import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { Contract, providers, utils } from 'ethers';
import Popup from 'reactjs-popup';
import './assets/scss/normalize.scss';
import uuid from 'react-uuid';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useQuery } from '@apollo/client';
import { handleClickOutside, handleScroll } from './utils/helpers';
import AppContext from './ContextAPI';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Auctions from './containers/auctions/Auction.jsx';
import SetupAuction from './components/setupAuction/SetupAuction';
import CreateTiers from './components/createTiers/Create.jsx';
import MyNFTs from './components/myNFTs/MyNFTs.jsx';
import Artist from './containers/artist/Artist.jsx';
import AuctionLandingPage from './containers/auctionLandingPage/AuctionLandingPage.jsx';
import Homepage from './containers/homepage/Homepage.jsx';
import About from './containers/mintingAndAuctions/about/About.jsx';
import Marketplace from './containers/mintingAndAuctions/marketplace/Marketplace.jsx';
import MyAccount from './containers/myAccount/MyAccount.jsx';
import CustomizeAuction from './containers/customizeAuction/CustomizeAuction.jsx';
import Team from './containers/team/Team.jsx';
import AuctionReview from './components/auctions/AuctionReview.jsx';
import BidOptions from './utils/fixtures/BidOptions';
import NotFound from './components/notFound/NotFound.jsx';
import Collection from './containers/collection/Collection.jsx';
import FinalizeAuction from './components/finalizeAuction/FinalizeAuction.jsx';
import Polymorphs from './containers/polymorphs/Polymorphs.jsx';
import MintPolymorph from './containers/polymorphs/MintPolymorph.jsx';
import BurnToMint from './containers/polymorphs/BurnToMint.jsx';
import PolymorphScramblePage from './components/polymorphs/scramble/PolymorphScramblePage.jsx';
import MarketplaceNFT from './containers/marketplaceNFT/MarketplaceNFT';
import Planet1 from './containers/planets/Planet1.jsx';
import Planet2 from './containers/planets/Planet2.jsx';
import Planet3 from './containers/planets/Planet3.jsx';
import BrowseNFT from './containers/marketplace/browseNFT/BrowseNFT.jsx';
import CharectersDrop from './containers/charactersDrop/CharactersDrop.jsx';
import CharacterPage from './containers/characterPage/CharacterPage.jsx';
import Search from './containers/search/Search.jsx';
import NFTMarketplace from './containers/sellNFT/NFTMarketplace';
import MyProfile from './containers/myProfile/MyProfile';
import CreateNFT from './components/myNFTs/create/CreateNFT';
import RarityCharts from './containers/rarityCharts/RarityCharts';
import PolymorphUniverse from './containers/polymorphUniverse/PolymorphUniverse';
import LobbyLobsters from './containers/lobbyLobsters/LobbyLobsters';
import WrongNetworkPopup from './components/popups/WrongNetworkPopup';
import { transferLobsters, queryLobstersGraph } from './utils/graphql/lobsterQueries';
import { convertLobsterObjects } from './utils/helpers/lobsters';

import { CONNECTORS_NAMES } from './utils/dictionary';
import { getEthPriceCoingecko } from './utils/api/etherscan';
import { getProfileInfo, setChallenge, userAuthenticate } from './utils/api/profile';
import Contracts from './contracts/contracts.json';
import { getSavedNfts, getMyNfts, getMyCollections } from './utils/api/mintNFT';
import { transferPolymorphs } from './utils/graphql/queries';
import { fetchTokensMetadataJson } from './utils/api/polymorphs';
import { convertPolymorphObjects } from './utils/helpers/polymorphs';
import LobsterInfoPage from './components/lobbyLobsters/info/LobstersInfoPage';
import AuthenticatedRoute from './components/authenticatedRoute/AuthenticatedRoute';

const App = () => {
  const authenticatedRoutes = [
    '/auction-review',
    '/my-profile',
    '/setup-auction',
    '/my-nfts',
    '/my-nfts/create',
    '/my-account',
    '/my-auctions',
    '/create-tiers',
    '/create-tiers/my-nfts/create',
    '/finalize-auction',
  ];

  const location = useLocation();
  const history = useHistory();

  const [loggedInArtist, setLoggedInArtist] = useState({
    id: uuid(),
    name: '',
    universePageAddress: '',
    avatar: null,
    about: '',
    personalLogo: null,
    instagramLink: '',
    twitterLink: '',
    social: true,
  });
  const [myBalance, setMyBalance] = useState(48.24);
  const [showModal, setShowModal] = useState(false);
  const [myNFTsSelectedTabIndex, setMyNFTsSelectedTabIndex] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [activeView, setActiveView] = useState(null);
  const [savedNFTsID, setSavedNFTsID] = useState(null);
  const [savedCollectionID, setSavedCollectionID] = useState(null);
  const [myCollectionID, setMyCollectionID] = useState(null);
  const [universeNFTs, setUniverseNFTs] = useState([]);
  const [savedCollections, setSavedCollections] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [futureAuctions, setFutureAuctions] = useState([]);
  const [auction, setAuction] = useState({ tiers: [] });
  const [selectedNftForScramble, setSelectedNftForScramble] = useState({});
  const [bidtype, setBidtype] = useState('eth');
  const [options, setOptions] = useState(BidOptions);
  const [darkMode, setDarkMode] = useState(true);
  const [sortName, setSortName] = useState('Sort by');
  const [editProfileButtonClick, setEditProfileButtonClick] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [stepsData, setStepsData] = useState({
    selectedMethod: null,
    settings: null,
    summary: null,
  });
  const [auctionSetupState, setAuctionSetupState] = useState(false);

  // Web3 local state
  const [providerName, setProviderName] = useState(localStorage.getItem('providerName') || '');
  const [web3Provider, setWeb3Provider] = useState(null);
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState('');
  const [yourBalance, setYourBalance] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ethereumNetwork, setEthereumNetwork] = useState('');
  const [usdEthBalance, setUsdEthBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Minting local state
  const [universeERC721CoreContract, setUniverseERC721CoreContract] = useState(null);
  const [universeERC721FactoryContract, setUniverseERC721FactoryContract] = useState(null);
  const [contracts, setContracts] = useState(false);
  const [savedNfts, setSavedNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [deployedCollections, setDeployedCollections] = useState([]);
  const [collectionsIdAddressMapping, setCollectionsIdAddressMapping] = useState({});

  // Pagination
  const [myUniversNFTsSearchPhrase, setMyUniversNFTsSearchPhrase] = useState('');
  const [myUniverseNFTsperPage, setMyUniverseNFTsPerPage] = useState(12);
  const [myUniverseNFTsActiverPage, setMyUniverseNFTsActiverPage] = useState(0);
  const [myUniverseNFTsOffset, setMyUniverseNFTsOffset] = useState(0);

  // Polymorphs
  const [polymorphContract, setPolymorphContract] = useState(null);
  const [userPolymorphs, setUserPolymorphs] = useState([]);
  const [userPolymorphsLoaded, setUserPolymorphsLoaded] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0.1);
  const [totalPolymorphs, setTotalPolymorphs] = useState(0);
  const [polymorphBaseURI, setPolymorphBaseURI] = useState('');
  const [polymorphPrice, setPolymorphPrice] = useState(0);
  const { data } = useQuery(transferPolymorphs(address));

  // Lobsters
  const [userLobsters, setUserLobsters] = useState([]);
  const [userLobstersLoaded, setUserLobstersLoaded] = useState(false);
  const [totalLobsters, setTotalLobsters] = useState(0);
  const [lobsterBaseURI, setLobsterBaseURI] = useState('');
  const [lobsterPrice, setLobsterPrice] = useState(0);
  const [lobsterContract, setLobsterContract] = useState(null);

  // Filters
  const allCharactersFilter = 'All Characters';
  const polymorphsFilter = 'Polymorphs';
  const lobstersFilter = 'Lobby Lobsters';
  const [collectionFilter, setCollectionFilter] = useState(polymorphsFilter);

  useEffect(() => {
    if (!darkMode) {
      window.document.querySelector('header').classList.remove('dark');
    }
    handleScroll(darkMode);

    window.addEventListener('scroll', () => handleScroll(darkMode));

    return () => {
      window.removeEventListener('scroll', () => handleScroll(darkMode));
    };
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      (location.pathname === '/nft-marketplace/settings' &&
        stepsData.selectedMethod === 'bundle') ||
      location.pathname === '/marketplace'
    ) {
      document.querySelector('header').style.position = 'absolute';
    } else {
      document.querySelector('header').style.position = 'fixed';
    }
  }, [location]);

  // Popups
  const triggerWrongNetworkPopup = async () => {
    document.getElementById('wrong-network-hidden-btn').click();
  };

  // Getters
  const getEthPriceData = async (balance) => {
    const ethUsdPice = await getEthPriceCoingecko();
    setUsdEthBalance(ethUsdPice?.market_data?.current_price?.usd * balance);
    setEthPrice(ethUsdPice);
  };

  useEffect(() => {
    if (yourBalance) {
      getEthPriceData(yourBalance);
    }
  }, [yourBalance]);

  // HELPERS
  const clearStorageAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_address');
    localStorage.removeItem('providerName');
  };
  // Fetch user's polymorphs
  const fetchUserPolymorphsTheGraph = async (theGraphData) => {
    setUserPolymorphsLoaded(false);

    const userNftIds = theGraphData?.transferEntities?.map((nft) => nft.tokenId);
    const metadataURIs = userNftIds?.map(
      (id) => `${process.env.REACT_APP_POLYMORPHS_IMAGES_URL}${id}`
    );
    const nftMetadataObjects = await fetchTokensMetadataJson(metadataURIs);
    const polymorphNFTs = convertPolymorphObjects(nftMetadataObjects);
    if (polymorphNFTs) {
      setUserPolymorphs(polymorphNFTs);
    }
    setUserPolymorphsLoaded(true);
  };

  // Fetch users's lobsters
  const fetchUserLobstersTheGraph = async (newAddress) => {
    setUserLobstersLoaded(false);

    const lobsters = (await queryLobstersGraph(transferLobsters(newAddress))) || [];
    const userNftIds = lobsters?.transferEntities?.map((nft) => nft.tokenId);
    const metadataURIs = userNftIds?.map(
      (id) => `${process.env.REACT_APP_LOBSTER_IMAGES_URL}${id}`
    );
    const nftMetadataObjects = await fetchTokensMetadataJson(metadataURIs);
    const lobsterNFTs = convertLobsterObjects(nftMetadataObjects);
    if (lobsterNFTs) {
      setUserLobsters(lobsterNFTs);
    }
    setUserLobstersLoaded(true);
  };

  const navigateToMyNFTsPage = (characterFilter) => {
    setCollectionFilter(characterFilter);
    setMyUniverseNFTsActiverPage(0);
    setMyUniverseNFTsOffset(0);

    history.push('/my-nfts');
  };

  useEffect(() => {
    if (data) {
      fetchUserPolymorphsTheGraph(data);
    }
  }, [data]);

  useEffect(async () => {
    setUserLobsters([]);
    setUserPolymorphs([]);
    fetchUserPolymorphsTheGraph(data);
    fetchUserLobstersTheGraph(address || '');
  }, [address]);

  // Authentication and Web3
  const web3AuthenticationProccess = async (provider, network, accounts) => {
    const balance = await provider.getBalance(accounts[0]);
    const signerResult = provider.getSigner(accounts[0]).connectUnchecked();

    const { contracts: contractsData } = Contracts[network.chainId];

    // Minting
    const universeERC721CoreContractResult = new Contract(
      contractsData.UniverseERC721Core.address,
      contractsData.UniverseERC721Core.abi,
      signerResult
    );

    const universeERC721FactoryContractResult = new Contract(
      contractsData.UniverseERC721Factory.address,
      contractsData.UniverseERC721Factory.abi,
      signerResult
    );

    // TODO: Vik to check it
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

    const totalPolyMinted = await polymorphContractInstance.lastTokenId();
    const polymorphBaseURIData = await polymorphContractInstance.baseURI();
    const polymPrice = await polymorphContractInstance.polymorphPrice();

    const totalLobsterMinted = await lobsterContractInstance.lastTokenId();
    const lobsterBaseURIData = await lobsterContractInstance.baseURI();
    const lobsPrice = await lobsterContractInstance.lobsterPrice();

    setWeb3Provider(provider);
    setAddress(accounts[0]);
    setSigner(signerResult);
    setYourBalance(utils.formatEther(balance));
    setIsWalletConnected(true);
    setEthereumNetwork(network);
    setUniverseERC721CoreContract(universeERC721CoreContractResult);
    setUniverseERC721FactoryContract(universeERC721FactoryContractResult);
    setContracts(contractsData);

    setPolymorphContract(polymorphContractInstance);
    setTotalPolymorphs(totalPolyMinted.toNumber());
    setPolymorphBaseURI(polymorphBaseURIData);
    setPolymorphPrice(utils.formatEther(polymPrice));

    setLobsterContract(lobsterContractInstance);
    setTotalLobsters(totalLobsterMinted);
    setLobsterBaseURI(lobsterBaseURIData);
    setLobsterPrice(lobsPrice);
  };

  const resetConnectionState = async (walletConnectEvent) => {
    if (providerName === CONNECTORS_NAMES.WalletConnect && !walletConnectEvent) {
      await providerObject.disconnect();
    }

    setWeb3Provider(null);
    setAddress(null);
    setSigner('');
    setYourBalance(0);
    setIsWalletConnected(false);
    setEthereumNetwork('');
    setUsdEthBalance(0);
    clearStorageAuthData();
    setIsAuthenticated(false);
    // localStorage.removeItem('isAuthenticated');

    // TODO: Vik to check it
    setUserPolymorphs([]);
    setPolymorphContract(null);
    setLobsterContract(null);
    setTotalPolymorphs(0);
    setTotalLobsters(0);
    setPolymorphBaseURI('');
    setLobsterBaseURI('');
    setPolymorphPrice(0);
    setLobsterPrice(0);
  };

  const connectWithMetaMask = async () => {
    const { ethereum } = window;

    await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const network = await provider.getNetwork();

    if (network.chainId !== +process.env.REACT_APP_NETWORK_CHAIN_ID) {
      triggerWrongNetworkPopup();
    } else {
      await web3AuthenticationProccess(provider, network, accounts);
    }

    setProviderName(() => {
      const name = CONNECTORS_NAMES.MetaMask;
      localStorage.setItem('providerName', name);
      return name;
    });

    ethereum.on('accountsChanged', async ([account]) => {
      // IF ACCOUNT CHANGES, CLEAR TOKEN AND ADDRESS FROM LOCAL STORAGE
      clearStorageAuthData();
      if (account) {
        // await connectWithMetaMask();
        web3AuthenticationProccess(provider, network, [account]);
      } else {
        resetConnectionState();
      }
    });

    ethereum.on('chainChanged', async (networkId) => {
      clearStorageAuthData();
      window.location.reload();
    });

    ethereum.on('disconnect', async (error) => {
      resetConnectionState();
    });
  };

  const connectWithWalletConnect = async () => {
    const provider = new WalletConnectProvider({
      infuraId: '1745e014e2ed4047acdaa135e869a11b',
    });

    await provider.enable();

    const web3ProviderWrapper = new providers.Web3Provider(provider);
    const network = await web3ProviderWrapper.getNetwork();
    const { accounts: accountsWW } = web3ProviderWrapper.provider;

    if (network.chainId !== +process.env.REACT_APP_NETWORK_CHAIN_ID) {
      await provider.disconnect();
      triggerWrongNetworkPopup();
    } else {
      web3AuthenticationProccess(web3ProviderWrapper, network, accountsWW);
    }

    setProviderName(() => {
      const name = CONNECTORS_NAMES.WalletConnect;
      localStorage.setItem('providerName', name);
      return name;
    });
    setProviderObject(provider);

    // Subscribe to accounts change
    provider.on('accountsChanged', async (accounts) => {
      // IF ACCOUNT CHANGES, CLEAR TOKEN AND ADDRESS FROM LOCAL STORAGE
      clearStorageAuthData();
      web3AuthenticationProccess(web3ProviderWrapper, network, accounts);
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
  };

  const connectWeb3 = async () => {
    if (providerName === CONNECTORS_NAMES.MetaMask) connectWithMetaMask();
    if (providerName === CONNECTORS_NAMES.WalletConnect) connectWithWalletConnect();
  };

  useEffect(() => {
    if (
      !(providerName === CONNECTORS_NAMES.WalletConnect && !localStorage.getItem('walletconnect'))
    ) {
      connectWeb3();
    }
  }, []);

  // Sign message for BE authentication
  const signMessage = async () => {
    if (signer) {
      const sameUser = address === localStorage.getItem('user_address');
      const hasSigned = sameUser && localStorage.getItem('access_token');

      if (!hasSigned) {
        const chanllenge = uuid();
        const challengeResult = await setChallenge(chanllenge);
        const signedMessage = await signer?.signMessage(chanllenge);
        const authInfo = await userAuthenticate({
          address,
          signedMessage,
          uuid: challengeResult?.uuid,
        });

        if (!authInfo.error) {
          setIsAuthenticated(true);
          setLoggedInArtist({
            id: authInfo.user.id,
            name: authInfo.user.displayName,
            universePageAddress: authInfo.user.universePageUrl,
            avatar: authInfo.user.profileImageUrl,
            about: authInfo.user.about,
            personalLogo: authInfo.user.logoImageUrl,
            instagramLink: authInfo.user.instagramUser,
            twitterLink: authInfo.user.twitterUser,
          });

          // Save access_token into the local storage for later API requests usage
          localStorage.setItem('access_token', authInfo.token);
          localStorage.setItem('user_address', address);
        } else {
          setIsAuthenticated(false);
          // if (authenticatedRoutes.includes(window.location.pathname)) {
          //   history.push('/');
          // }
        }
      } else {
        // THE USER ALREADY HAS SIGNED
        const userInfo = await getProfileInfo({ address });

        if (!userInfo.error) {
          setIsAuthenticated(true);

          setLoggedInArtist({
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
    }
  };

  useEffect(async () => {
    if (signer) signMessage();
  }, [signer]);

  // Minting
  const fetchNfts = async () => {
    try {
      // Fetch the saved NFTS for that addres
      const savedNFTS = await getSavedNfts();
      setSavedNfts(savedNFTS || []);

      // Fetch the minted NFTS for that address
      const mintedNfts = await getMyNfts();
      setMyNFTs(mintedNfts || []);

      // Fetch the minted NFTS for that address
      const collectionsReturn = await getMyCollections();
      setDeployedCollections(collectionsReturn || []);
    } catch (err) {
      alert(
        'Failed to fetch nfts. Most likely due to failed notifcation. Please sign out and sign in again.'
      );
    }
  };

  useEffect(() => {
    const mapping = {};
    deployedCollections.forEach((collection) => {
      mapping[collection.id] = collection.address;
    });
    setCollectionsIdAddressMapping(mapping);
  }, [deployedCollections]);

  useEffect(() => {
    const canRequestData = loggedInArtist && isWalletConnected && isAuthenticated;
    if (canRequestData) {
      fetchNfts();
    } else {
      setSavedNfts([]);
      setMyNFTs([]);
      setDeployedCollections([]);
    }
  }, [loggedInArtist, isWalletConnected]);

  return (
    <AppContext.Provider
      value={{
        stepsData,
        setStepsData,
        isWalletConnected,
        setIsWalletConnected,
        loggedInArtist,
        setLoggedInArtist,
        myBalance,
        setMyBalance,
        handleClickOutside,
        universeNFTs,
        setUniverseNFTs,
        showModal,
        setShowModal,
        myNFTsSelectedTabIndex,
        setMyNFTsSelectedTabIndex,
        selectedTabIndex,
        setSelectedTabIndex,
        savedCollections,
        setSavedCollections,
        activeView,
        setActiveView,
        savedNFTsID,
        setSavedNFTsID,
        savedCollectionID,
        setSavedCollectionID,
        myCollectionID,
        setMyCollectionID,
        myNFTs,
        setMyNFTs,
        deployedCollections,
        setDeployedCollections,
        myAuctions,
        setMyAuctions,
        activeAuctions,
        setActiveAuctions,
        futureAuctions,
        setFutureAuctions,
        auction,
        setAuction,
        selectedNftForScramble,
        setSelectedNftForScramble,
        bidtype,
        setBidtype,
        options,
        setOptions,
        darkMode,
        setDarkMode,
        editProfileButtonClick,
        setEditProfileButtonClick,
        sortName,
        setSortName,
        selectedTokenIndex,
        setSelectedTokenIndex,
        auctionSetupState,
        setAuctionSetupState,
        // Authentication and Web3
        connectWithMetaMask,
        connectWithWalletConnect,
        web3Provider,
        setWeb3Provider,
        address,
        setAddress,
        signer,
        setSigner,
        yourBalance,
        setYourBalance,
        usdEthBalance,
        setUsdEthBalance,
        ethPrice,
        setEthPrice,
        isAuthenticated,
        setIsAuthenticated,
        resetConnectionState,
        // Minting
        universeERC721CoreContract,
        setUniverseERC721CoreContract,
        universeERC721FactoryContract,
        contracts,
        savedNfts,
        setSavedNfts,
        collectionsIdAddressMapping,
        // Pagination
        myUniversNFTsSearchPhrase,
        setMyUniversNFTsSearchPhrase,
        myUniverseNFTsperPage,
        setMyUniverseNFTsPerPage,
        myUniverseNFTsActiverPage,
        setMyUniverseNFTsActiverPage,
        myUniverseNFTsOffset,
        setMyUniverseNFTsOffset,
        // Polymorphs
        polymorphContract,
        userPolymorphs,
        userPolymorphsLoaded,
        payableAmount,
        totalPolymorphs,
        polymorphBaseURI,
        polymorphPrice,
        // Lobsters
        userLobsters,
        userLobstersLoaded,
        totalLobsters,
        lobsterBaseURI,
        lobsterPrice,
        lobsterContract,
        // Filters
        navigateToMyNFTsPage,
        polymorphsFilter,
        lobstersFilter,
        allCharactersFilter,
        collectionFilter,
        setCollectionFilter,
      }}
    >
      <Header />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/team">
          <Team />
        </Route>
        <Route exact path="/polymorphs">
          <Polymorphs />
        </Route>
        <Route exact path="/polymorph-universe">
          <PolymorphUniverse />
        </Route>
        <Route exact path="/mint-polymorph">
          <MintPolymorph />
        </Route>
        <Route exact path="/burn-to-mint">
          <BurnToMint />
        </Route>
        <Route exact path="/planets/adaka">
          <Planet1 />
        </Route>
        <Route exact path="/planets/prosopon">
          <Planet2 />
        </Route>
        <Route exact path="/planets/kuapo">
          <Planet3 />
        </Route>
        <Route exact path="/polymorphs/:id">
          <PolymorphScramblePage />
        </Route>
        <Route exact path="/lobsters/:id">
          <LobsterInfoPage />
        </Route>
        <Route exact path="/marketplace/nft/:id">
          <MarketplaceNFT />
        </Route>
        <Route exact path="/character-page">
          <CharacterPage />
        </Route>
        <Route exact path="/marketplace">
          <BrowseNFT />
        </Route>
        <Route exact path="/nft-marketplace/:steps">
          <NFTMarketplace />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/core-drops">
          <CharectersDrop />
        </Route>
        <Route exact path="/lobby-lobsters">
          <LobbyLobsters />
        </Route>
        <Route exact path="/polymorph-rarity">
          <RarityCharts />
        </Route>
        <AuthenticatedRoute exact path="/my-profile" component={MyProfile} />
        <AuthenticatedRoute path="/setup-auction" component={SetupAuction} />
        <Route exact path="/minting-and-auctions/marketplace/active-auctions">
          <Marketplace />
        </Route>
        <Route exact path="/minting-and-auctions/marketplace/future-auctions">
          <Marketplace />
        </Route>
        <AuthenticatedRoute exact path="/my-nfts" component={MyNFTs} />
        <AuthenticatedRoute exact path="/my-nfts/create" component={CreateNFT} />
        <AuthenticatedRoute exact path="/my-account" component={MyAccount} />
        <AuthenticatedRoute exact path="/my-auctions" component={Auctions} />
        <AuthenticatedRoute exact path="/create-tiers" component={CreateTiers} />
        <AuthenticatedRoute exact path="/create-tiers/my-nfts/create" component={CreateNFT} />
        <AuthenticatedRoute exact path="/finalize-auction" component={FinalizeAuction} />
        <AuthenticatedRoute
          exact
          path="/customize-auction-landing-page"
          component={CustomizeAuction}
        />
        <AuthenticatedRoute exact path="/auction-review" component={AuctionReview} />
        <Route exact path="/:artist">
          <Artist />
        </Route>
        <Route exact path="/c/:collectionId">
          <Collection />
        </Route>
        <Route exact path="/:artist/:auction">
          <AuctionLandingPage />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Footer />
      <Popup
        closeOnDocumentClick={false}
        trigger={
          <button
            type="button"
            id="wrong-network-hidden-btn"
            aria-label="hidden"
            style={{ display: 'none' }}
          />
        }
      >
        {(close) => <WrongNetworkPopup close={close} />}
      </Popup>
    </AppContext.Provider>
  );
};

export default App;
