import { providers, Signer, utils } from "ethers";
import create, { GetState, Mutate, SetState, StoreApi } from "zustand";
import { CONNECTORS_NAMES } from "../utils/dictionary";
import Cookies from 'js-cookie'
import { useUserBalanceStore } from "./balanceStore";
import { getProfileInfo, setChallenge, userAuthenticate } from "../utils/api/profile";
import uuid from 'react-uuid';
import { mapUserData } from "../utils/helpers";
import { useContractsStore } from "./contractsStore";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useErrorStore } from "./errorStore";
import { subscribeWithSelector } from 'zustand/middleware'
import { usePolymorphStore } from "src/stores/polymorphStore";

type IDefaultAuthStoreGeters = {
  // Getters
  web3Provider: providers.Web3Provider | null;
  ethereumNetwork: providers.Network | null;
  signer: Signer | null;
  providerName: string;
  address: string;
  yourEnsDomain: any;
  isWalletConnected: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isSigning: boolean;
  showWrongNetworkPopup: boolean,
  loggedInArtist: any,
}

type IAuthStore = IDefaultAuthStoreGeters & {
  // Authentication functions
  connectWithMetaMask: () => Promise<void>;
  connectWithWalletConnect: () => Promise<void>;
  web3AuthenticationProccess: (provider: providers.Web3Provider, network: providers.Network, accounts: string[]) => Promise<void>;
  connectWeb3: () => Promise<void>;
  signMessage: () => Promise<void>;
  signOut: () => void;

  // Event handlers
  onAccountsChanged: (account: string[]) => Promise<void>;
  onChainChanged: () => void;
  
  // Helper functions
  resetConnectionState: () => void;
  removeListeners: () => void;
  setListeners: () => void;
  loginFn: () => void;

  // Setters
  setIsSigning: (isSigning: boolean) => void
  setIsWalletConnected: (isWalletConnected: boolean) => void
  setLoginFn: (loginFn: () => void) => void
  setShowWrongNetworkPopup: (show: boolean) => void;
  setLoggedInArtist: (artist: any) => void;
  setProviderName: (providerName: string) => void;
}

const defaultState: IDefaultAuthStoreGeters = {
  // Logged in user info
  loggedInArtist: {
    id: '',
    name: '',
    universePageAddress: '',
    avatar: '',
    about: '',
    personalLogo: '',
    instagramLink: '',
    twitterLink: '',
  },
  address: '',

  // Web3 State
  signer: null,
  yourEnsDomain: null,
  ethereumNetwork: null,
  web3Provider: null,
  providerName: '',

  // State Variables
  isWalletConnected: false,
  isAuthenticated: false,
  showWrongNetworkPopup: false,
  isSigning: false,
  isAuthenticating: false,
}

export const useAuthStore = 
create<
  IAuthStore,
  SetState<IAuthStore>,
  GetState<IAuthStore>,
  Mutate<StoreApi<IAuthStore>, [['zustand/subscribeWithSelector', never]]>
>(subscribeWithSelector((set, get) => ({
  ...defaultState,
  loginFn: () => {},
  setProviderName: (providerName) => {
    set(state => ({
      ...state,
      providerName
    }))
  },
  connectWithMetaMask: async () => {
    const { ethereum } = window as any;

    const provider = new providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const network = await provider.getNetwork();

    if (network.chainId !== Number(process.env.REACT_APP_NETWORK_CHAIN_ID || "")) {
      set(state => ({
        ...state,
        showWrongNetworkPopup: true,
        isSigning: false,
        isAuthenticating: false,
      }))
    } else {
      await get().web3AuthenticationProccess(provider, network, accounts);
    }

    set(state => ({
      ...state,
      providerName: CONNECTORS_NAMES.MetaMask,
    }));

    Cookies.set('providerName', CONNECTORS_NAMES.MetaMask);

    get().removeListeners();
    get().setListeners();

  },
  connectWithWalletConnect: async () => {
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

      if (network.chainId !== Number(process.env.REACT_APP_NETWORK_CHAIN_ID)) {
        await provider.disconnect();
        set(state => ({
          ...state,
          showWrongNetworkPopup: true,
          isSigning: false,
          isAuthenticating: false
        }))
        } else {
        get().web3AuthenticationProccess(web3ProviderWrapper, network, accounts);
      }

      set(state => ({
        ...state,
        providerName: CONNECTORS_NAMES.WalletConnect,
      }));
  
      Cookies.set('providerName', CONNECTORS_NAMES.WalletConnect);
  
      get().removeListeners();
      get().setListeners();
      } catch (err) {
      console.error(err);
    }

  },
  web3AuthenticationProccess: async (provider, network, accounts) => {
    const balance = await provider.getBalance(accounts[0]);
    const ensDomain = await provider.lookupAddress(accounts[0]);
    const signerResult = provider.getSigner(accounts[0]).connectUnchecked();

    useContractsStore.getState().setContracts(signerResult, network);

    set(state => ({
      ...state,
      web3Provider: provider,
      address: accounts.length ? accounts[0].toLowerCase() : '',
      signer: signerResult,
      yourEnsDomain: ensDomain,
      ethereumNetwork: network,
    }));

    useUserBalanceStore.getState().setYourBalance(Number(utils.formatEther(balance)));
    usePolymorphStore.getState().setUserPolymorphs([]);
    usePolymorphStore.getState().fetchUserPolymorphsTheGraph(accounts[0]);
  },
  resetConnectionState: () => {
    set(state => ({
      ...state,
      ...defaultState
    }))

    useContractsStore.getState().clearContracts();
    useUserBalanceStore.getState().setYourBalance(0);
    usePolymorphStore.getState().setUserPolymorphs([]);
    clearStorageAuthData();

  },
  onChainChanged: () => {
    clearStorageAuthData();
    window.location.reload();

  },
  onAccountsChanged: async ([account]) => {
    // IF ACCOUNT CHANGES, CLEAR TOKEN AND ADDRESS FROM LOCAL STORAGE
    clearStorageAuthData();
    if (account) {
      get().connectWeb3();
      const provider = get().web3Provider;
      const network = get().ethereumNetwork;
      if(provider && network) {
        get().web3AuthenticationProccess(provider, network, [account]);
      }
    } else {
      get().resetConnectionState();
    }
  },
  connectWeb3: async () => {
    if (get().isAuthenticating) {
      // Don't run authentication twice
      return;
    }
    set(state => ({
      ...state,
      isAuthenticating: true
    }));

    if (get().providerName === CONNECTORS_NAMES.MetaMask) {
      await get().connectWithMetaMask();
    }

    if (get().providerName === CONNECTORS_NAMES.WalletConnect) {
      await get().connectWithWalletConnect();
    }

  },
  signMessage: async () => {
    try {
      const signer = get().signer;
      const web3Provider = get().web3Provider;
      const address = get().address;

      if (signer && web3Provider && address) {
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

          const authInfo: any = await userAuthenticate({
            address,
            signedMessage,
            uuid: challengeResult?.uuid ,
          });

          if (!authInfo.error) {
            set(state => ({
              ...state,
              isAuthenticated: true,
              isAuthenticating: false,
              loggedInArtist: mapUserData(authInfo.user)
            }))

            // Save xyz_access_token into the local storage for later API requests usage
            Cookies.set('xyz_access_token', authInfo.token);
            Cookies.set('user_address', address);
          } else {
            set(state => ({
              ...state,
              isAuthenticated: false,
              isAuthenticating: false,
              isSigning: false,
            }))
            
            useErrorStore.getState().setErrorBody('Please try again in a few minutes.');
            useErrorStore.getState().setErrorTitle('Failed to authenticate');
            useErrorStore.getState().setShowError(true);
          }
        } else {
          // THE USER ALREADY HAS SIGNED
          const userInfo: any = await getProfileInfo(address);

          if (!userInfo.error) {
            set(state => ({
              ...state,
              isAuthenticated: true,
              isWalletConnected: true,
              isAuthenticating: false,
              loggedInArtist: mapUserData(userInfo)
            }))
          }
        }
        set(state => ({
          ...state,
          isAuthenticating: false,
        }))
        // closeError();
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        useErrorStore.getState().setShowError(true);
        useErrorStore.getState().setErrorTitle('Signature is required');
        useErrorStore.getState().setErrorBody(
          "Signing a challenge is part of the authentication process.\nWithout it the application can't authenticate you."
        );
      }

      set(state => ({
        ...state,
        isWalletConnected: false,
        isAuthenticated: false,
        isAuthenticating: false,
        isSigning: false,
      }))
      console.error(err);
    }
  },
  signOut: () => {
    get().resetConnectionState();
    set(state => ({
      ...state,
      isWalletConnected: false
    }));
  },
  removeListeners: () => {
    const { ethereum } = window as any;

    ethereum.removeListener('accountsChanged', get().onAccountsChanged);
    ethereum.removeListener('disconnect', get().resetConnectionState);
    ethereum.removeListener('chainChanged', get().onChainChanged);

  },
  setListeners: () => {
    const { ethereum } = window as any;

    ethereum.on('accountsChanged', get().onAccountsChanged);
    ethereum.on('chainChanged', get().onChainChanged);
    ethereum.on('disconnect', get().resetConnectionState);
  },
  setLoginFn: (loginFn) => {
    set(state => ({
      ...state,
      loginFn
    }))
  },
  setIsWalletConnected: (isWalletConnected) => {
    set(state => ({
      ...state,
      isWalletConnected
    }))
  },
  setIsSigning: (isSigning) => {
    set(state => ({
      ...state,
      isSigning,
    }))
  },
  setShowWrongNetworkPopup: (show) => {
    set(state => ({
      ...state,
      showWrongNetworkPopup: show
    }))
  },
  setLoggedInArtist: (artist) => {
    set(state => ({
      ...state,
      loggedInArtist: artist
    }))
  }
})))

const clearStorageAuthData = () => {
  Cookies.remove('xyz_access_token');
  Cookies.remove('user_address');
  Cookies.remove('providerName');
};

useAuthStore.subscribe(s => s.providerName, () => {
  console.log("Provider name changed");
  const providerName = useAuthStore.getState().providerName;
  if (providerName) {
    console.log("Connecting web3...");
    useAuthStore.getState().connectWeb3();
  }
  console.log("End of provider subscribe callback")
})

useAuthStore.subscribe(s => s.signer, async() => {
  console.log("Signer changed");
  const signer = useAuthStore.getState().signer;
  const signerAddress = await signer?.getAddress();
  const address = useAuthStore.getState().address;
  const isSigning = useAuthStore.getState().isSigning;
  if (!isSigning && (!signer || (signerAddress !== address))) {
    console.log("Signing in...");
    useAuthStore.getState().setIsSigning(true);
    await useAuthStore.getState().signMessage();
    useAuthStore.getState().setIsSigning(false);
  }
  usePolymorphStore.getState().setUserPolymorphs([]);
  usePolymorphStore.getState().fetchUserPolymorphsTheGraph(address);
  console.log("End of signer subscribe callback")
})