/* eslint-disable no-use-before-define */
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Contract, providers, utils } from 'ethers';
import uuid from 'react-uuid';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Contracts from '../contracts/contracts.json';
import { CONNECTORS_NAMES } from '../utils/dictionary';
import { getProfileInfo, setChallenge, userAuthenticate } from '../utils/api/profile';
import { mapUserData } from '../utils/helpers';
import { useErrorContext } from './ErrorContext';
import { TokenTicker } from '../app/enums/token-ticker';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const { setShowError, setErrorTitle, setErrorBody, closeError } = useErrorContext();
  
  const setYourBalance = useUserBalanceStore(state => state.setUsdEthBalance);

  const [loggedInArtist, setLoggedInArtist] = useState({
    id: '',
    name: '',
    universePageAddress: '',
    avatar: null,
    about: '',
    personalLogo: null,
    instagramLink: '',
    twitterLink: '',
    social: true,
  });

  const [polymorphContract, setPolymorphContract] = useState(null);
  const [lobsterContract, setLobsterContract] = useState(null);
  const [providerName, setProviderName] = useState(Cookies.get('providerName') || '');
  const [web3Provider, setWeb3Provider] = useState(null);
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState(null);
  const [yourEnsDomain, setYourEnsDomain] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ethereumNetwork, setEthereumNetwork] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [universeERC721CoreContract, setUniverseERC721CoreContract] = useState(null);
  const [universeERC721FactoryContract, setUniverseERC721FactoryContract] = useState(null);
  const [contracts, setContracts] = useState(false);
  const [deployedCollections, setDeployedCollections] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [loginFn, setLoginFn] = useState();

  const history = useRouter();
  const [showWrongNetworkPopup, setShowWrongNetworkPopup] = useState(false);

  const web3ProviderRef = useRef(web3Provider);
  const networkRef = useRef(ethereumNetwork);
  const isAuthenticatingRef = useRef(isAuthenticating);
  const isSigningRef = useRef(isSigning);

  useEffect(() => {
    web3ProviderRef.current = web3Provider;
  }, [web3Provider]);

  useEffect(() => {
    networkRef.current = ethereumNetwork;
  }, [ethereumNetwork]);

  useEffect(() => {
    isAuthenticatingRef.current = isAuthenticating;
  }, [web3Provider]);

  useEffect(() => {
    isSigningRef.current = isSigning;
  }, [isSigning]);

  // HELPERS
  const clearStorageAuthData = () => {
    Cookies.remove('xyz_access_token');
    Cookies.remove('user_address');
    Cookies.remove('providerName');
  };

  // Authentication and Web3
  const web3AuthenticationProccess = async (provider, network, accounts) => {
    const balance = await provider.getBalance(accounts[0]);
    const ensDomain = await provider.lookupAddress(accounts[0]);
    const signerResult = provider.getSigner(accounts[0]).connectUnchecked();

    const { contracts: contractsData } = Contracts[network.chainId];

    const polymContract = contractsData.PolymorphWithGeneChanger;

    const polymorphContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
      polymContract?.abi,
      signerResult
    );

    const lobsContract = contractsData.Lobster;
    const lobsterContractInstance = new Contract(
      process.env.REACT_APP_LOBSTERS_CONTRACT_ADDRESS,
      lobsContract?.abi,
      signerResult
    );

    setWeb3Provider(provider);
    setAddress(accounts.length ? accounts[0].toLowerCase() : '');
    setSigner(signerResult);
    setYourBalance(Number(utils.formatEther(balance)));
    
    setYourEnsDomain(ensDomain);
    // setIsWalletConnected(true);
    setEthereumNetwork(network);
    setContracts(contractsData);

    setPolymorphContract(polymorphContractInstance);
    setLobsterContract(lobsterContractInstance);
  };

  const resetConnectionState = async (walletConnectEvent) => {
    // if (providerName === CONNECTORS_NAMES.WalletConnect && !walletConnectEvent) {
    //   await providerObject.disconnect();
    // }

    setWeb3Provider(null);
    setAddress('');
    setSigner('');
    setYourBalance(0);
    setYourEnsDomain(null);
    setIsWalletConnected(false);
    setEthereumNetwork('');
    setUsdEthBalance(0);
    clearStorageAuthData();
    setIsAuthenticated(false);

    setPolymorphContract(null);
    setLobsterContract(null);
  };

  const onAccountsChanged = async ([account]) => {
    // IF ACCOUNT CHANGES, CLEAR TOKEN AND ADDRESS FROM LOCAL STORAGE
    clearStorageAuthData();
    if (account) {
      connectWeb3();
      history.push('/');
      web3AuthenticationProccess(web3ProviderRef.current, networkRef.current, [account]);
    } else {
      resetConnectionState();
    }
  };

  const onChainChanged = async (networkId) => {
    clearStorageAuthData();
    window.location.reload();
  };

  const signOut = () => {
    resetConnectionState();
    // setIsAccountDropdownOpened(false);
    setIsWalletConnected(!isWalletConnected);
    history.push('/');

    const { ethereum } = window;

    ethereum.removeListener('accountsChanged', onAccountsChanged);
    ethereum.removeListener('disconnect', resetConnectionState);
    ethereum.removeListener('chainChanged', onChainChanged);
  };

  const connectWithMetaMask = async () => {
    const { ethereum } = window;

    // await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const network = await provider.getNetwork();

    if (network.chainId !== +process.env.REACT_APP_NETWORK_CHAIN_ID) {
      setShowWrongNetworkPopup(true);
    } else {
      await web3AuthenticationProccess(provider, network, accounts);
    }

    setProviderName(() => {
      const name = CONNECTORS_NAMES.MetaMask;
      Cookies.set('providerName', name);
      return name;
    });
    ethereum.on('accountsChanged', onAccountsChanged);

    ethereum.on('chainChanged', onChainChanged);

    ethereum.on('disconnect', resetConnectionState);
  };

  const connectWithWalletConnect = async () => {
    // There is an issue when user clicks close on wallet connect scan qr code step
    // the library throws an error that the user has closed the popup and makes the app crash
    // I've wrapped the code inside a try catch to mitigate that
    try {
      const provider = new WalletConnectProvider({
        infuraId: '1745e014e2ed4047acdaa135e869a11b',
      });

      await provider.enable();

      const web3ProviderWrapper = new providers.Web3Provider(provider);
      const network = await web3ProviderWrapper.getNetwork();
      const accounts = await web3ProviderWrapper.listAccounts();

      if (network.chainId !== +process.env.REACT_APP_NETWORK_CHAIN_ID) {
        await provider.disconnect();
        setShowWrongNetworkPopup(true);
      } else {
        web3AuthenticationProccess(web3ProviderWrapper, network, accounts);
      }

      setProviderName(() => {
        const name = CONNECTORS_NAMES.WalletConnect;
        Cookies.set('providerName', name);
        return name;
      });
      // setProviderObject(provider);

      // Subscribe to accounts change
      provider.on('accountsChanged', async ([account]) => {
        // IF ACCOUNT CHANGES, CLEAR TOKEN AND ADDRESS FROM LOCAL STORAGE
        clearStorageAuthData();
        history.push('/');
        web3AuthenticationProccess(web3ProviderWrapper, network, [account]);
      });

      // Subscribe to chainId change
      provider.on('chainChanged', async (chainId) => {
        clearStorageAuthData();
        window.location.reload();
      });

      // Subscribe to session disconnection
      provider.on('disconnect', (code, reason) => {
        resetConnectionState(true);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const connectWeb3 = async () => {
    if (isAuthenticatingRef.current) {
      // Don't run authentication twice
      return;
    }
    setIsAuthenticating(true);
    if (providerName === CONNECTORS_NAMES.MetaMask) {
      await connectWithMetaMask();
    }

    if (providerName === CONNECTORS_NAMES.WalletConnect) {
      await connectWithWalletConnect();
    }
  };

  useEffect(() => {
    if (providerName) {
      connectWeb3();
    }
  }, [providerName]);

  // Sign message for BE authentication
  const signMessage = async () => {
    try {
      if (signer) {
        const sameUser = address === Cookies.get('user_address');
        const hasSigned = sameUser && Cookies.get('xyz_access_token');

        if (!hasSigned) {
          const chanllenge = uuid();
          const challengeResult = await setChallenge(chanllenge);
          const data = utils.toUtf8Bytes(chanllenge);

          // we need to use this way of signature, otherwise wrong signer is returned on the BE
          // see issue here https://github.com/ethers-io/ethers.js/issues/491#issuecomment-483899968 for more info
          const signedMessage = await web3Provider.send('personal_sign', [
            utils.hexlify(data),
            address.toLowerCase(),
          ]);

          const authInfo = await userAuthenticate({
            address,
            signedMessage,
            uuid: challengeResult?.uuid,
          });

          if (!authInfo.error) {
            setIsAuthenticated(true);
            setLoggedInArtist(mapUserData(authInfo.user));

            // Save xyz_access_token into the local storage for later API requests usage
            Cookies.set('xyz_access_token', authInfo.token);
            Cookies.set('user_address', address);
          } else {
            setIsAuthenticated(false);
            setErrorBody('Please try again in a few minutes.');
            setErrorTitle('Failed to authenticate');
            setShowError(true);
          }
        } else {
          // THE USER ALREADY HAS SIGNED
          const userInfo = await getProfileInfo(address);

          if (!userInfo.error) {
            setIsAuthenticated(true);
            setIsWalletConnected(true);

            setLoggedInArtist({
              id: userInfo.id,
              name: userInfo.displayName,
              universePageAddress: userInfo.universePageUrl,
              avatar: userInfo.profileImageUrl,
              about: userInfo.about,
              personalLogo: userInfo.logoImageUrl,
              instagramLink: userInfo.instagramUser,
              twitterLink: userInfo.twitterUser,
            });
          }
        }
        setIsAuthenticating(false);
        closeError();
      }
    } catch (err) {
      if (err?.code === 4001) {
        setShowError(true);
        setErrorTitle('Signature is required');
        setErrorBody(
          "Signing a challenge is part of the authentication process.\nWithout it the application can't authenticate you."
        );
      }
      setIsWalletConnected(false);
      setIsAuthenticated(false);
      console.error(err);
      setIsAuthenticating(false);
    }
  };

  useEffect(async () => {
    if (!isSigningRef.current && signer?.address !== address) {
      setIsSigning(true);
      await signMessage();
      setIsSigning(false);
    }
  }, [signer]);

  return (
    <AuthContext.Provider
      value={{
        loggedInArtist,
        setLoggedInArtist,
        polymorphContract,
        setPolymorphContract,
        lobsterContract,
        setLobsterContract,
        providerName,
        setProviderName,
        web3Provider,
        setWeb3Provider,
        address,
        setAddress,
        signer,
        setSigner,
        yourEnsDomain,
        setYourEnsDomain,
        isWalletConnected,
        setIsWalletConnected,
        ethereumNetwork,
        setEthereumNetwork,
        isAuthenticated,
        setIsAuthenticated,
        showWrongNetworkPopup,
        setShowWrongNetworkPopup,
        universeERC721CoreContract,
        setUniverseERC721CoreContract,
        universeERC721FactoryContract,
        setUniverseERC721FactoryContract,
        contracts,
        setContracts,
        deployedCollections,
        setDeployedCollections,
        resetConnectionState,
        connectWithMetaMask,
        connectWeb3,
        connectWithWalletConnect,
        signOut,
        isAuthenticating,
        loginFn,
        setLoginFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext was used outside of its Provider');
  }

  return context;
};

export { AuthContextProvider, useAuthContext };
