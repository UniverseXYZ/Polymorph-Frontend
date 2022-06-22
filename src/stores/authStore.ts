import { providers, Signer, utils } from "ethers";
import create, { GetState, Mutate, SetState, StoreApi } from "zustand";
import { CONNECTORS_NAMES } from "../utils/dictionary";
import Cookies from "js-cookie";
import { useUserBalanceStore } from "./balanceStore";
import uuid from "react-uuid";
import { mapUserData } from "../utils/helpers";
import { useContractsStore } from "./contractsStore";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useErrorStore } from "./errorStore";
import { subscribeWithSelector } from "zustand/middleware";
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
  showWrongNetworkPopup: boolean;
  loggedInArtist: any;
};

type IAuthStore = IDefaultAuthStoreGeters & {
  // Authentication functions
  connectWithMetaMask: () => Promise<void>;
  connectWithWalletConnect: () => Promise<void>;
  web3AuthenticationProccess: (
    provider: providers.Web3Provider,
    network: providers.Network,
    accounts: string[]
  ) => Promise<void>;
  connectWeb3: () => Promise<void>;
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
  setIsSigning: (isSigning: boolean) => void;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
  setLoginFn: (loginFn: () => void) => void;
  setShowWrongNetworkPopup: (show: boolean) => void;
  setLoggedInArtist: (artist: any) => void;
  setProviderName: (providerName: string) => void;
};

const defaultState: IDefaultAuthStoreGeters = {
  // Logged in user info
  loggedInArtist: {
    id: "",
    name: "",
    universePageAddress: "",
    avatar: "",
    about: "",
    personalLogo: "",
    instagramLink: "",
    twitterLink: "",
  },
  address: "",

  // Web3 State
  signer: null,
  yourEnsDomain: null,
  ethereumNetwork: null,
  web3Provider: null,
  providerName: "",

  // State Variables
  isWalletConnected: false,
  isAuthenticated: false,
  showWrongNetworkPopup: false,
  isSigning: false,
  isAuthenticating: false,
};

export const useAuthStore = create<
  IAuthStore,
  SetState<IAuthStore>,
  GetState<IAuthStore>,
  Mutate<StoreApi<IAuthStore>, [["zustand/subscribeWithSelector", never]]>
>(
  subscribeWithSelector((set, get) => ({
    ...defaultState,
    loginFn: () => {},
    setProviderName: (providerName) => {
      set((state) => ({
        ...state,
        providerName,
      }));
    },
    connectWithMetaMask: async () => {
      const { ethereum } = window as any;

      const provider = new providers.Web3Provider(ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const network = await provider.getNetwork();

      if (
        network.chainId !== Number(process.env.REACT_APP_NETWORK_CHAIN_ID || "")
      ) {
        set((state) => ({
          ...state,
          showWrongNetworkPopup: true,
          isSigning: false,
          isAuthenticating: false,
          IsWalletConnected: false,
        }));
      } else {
        await get().web3AuthenticationProccess(provider, network, accounts);
      }

      set((state) => ({
        ...state,
        providerName: CONNECTORS_NAMES.MetaMask,
      }));

      Cookies.set("providerName", CONNECTORS_NAMES.MetaMask);

      get().removeListeners();
      get().setListeners();
    },
    connectWithWalletConnect: async () => {
      // There is an issue when user clicks close on wallet connect scan qr code step
      // the library throws an error that the user has closed the popup and makes the app crash
      // I've wrapped the code inside a try catch to mitigate that
      try {
        const provider = new WalletConnectProvider({
          infuraId: "1745e014e2ed4047acdaa135e869a11b",
        });

        await provider.enable();

        const web3ProviderWrapper = new providers.Web3Provider(provider);
        const network = await web3ProviderWrapper.getNetwork();
        const accounts = await web3ProviderWrapper.listAccounts();

        if (
          network.chainId !== Number(process.env.REACT_APP_NETWORK_CHAIN_ID)
        ) {
          await provider.disconnect();
          set((state) => ({
            ...state,
            showWrongNetworkPopup: true,
            isSigning: false,
            isAuthenticating: false,
          }));
        } else {
          get().web3AuthenticationProccess(
            web3ProviderWrapper,
            network,
            accounts
          );
        }

        set((state) => ({
          ...state,
          providerName: CONNECTORS_NAMES.WalletConnect,
        }));

        Cookies.set("providerName", CONNECTORS_NAMES.WalletConnect);

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

      set((state) => ({
        ...state,
        web3Provider: provider,
        address: accounts.length ? accounts[0].toLowerCase() : "",
        signer: signerResult,
        yourEnsDomain: ensDomain,
        ethereumNetwork: network,
        isWalletConnected: true,
      }));

      useUserBalanceStore
        .getState()
        .setYourBalance(Number(utils.formatEther(balance)));
      usePolymorphStore.getState().setUserPolymorphs([]);
    },
    resetConnectionState: () => {
      set((state) => ({
        ...state,
        ...defaultState,
      }));

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
        if (provider && network) {
          get().web3AuthenticationProccess(provider, network, [account]);
        }
      } else {
        get().resetConnectionState();
      }
    },
    connectWeb3: async () => {
      if (get().providerName === CONNECTORS_NAMES.MetaMask) {
        await get().connectWithMetaMask();
      }

      if (get().providerName === CONNECTORS_NAMES.WalletConnect) {
        await get().connectWithWalletConnect();
      }
    },
    signOut: () => {
      get().resetConnectionState();
      set((state) => ({
        ...state,
        isWalletConnected: false,
      }));
    },
    removeListeners: () => {
      const { ethereum } = window as any;

      ethereum.removeListener("accountsChanged", get().onAccountsChanged);
      ethereum.removeListener("disconnect", get().resetConnectionState);
      ethereum.removeListener("chainChanged", get().onChainChanged);
    },
    setListeners: () => {
      const { ethereum } = window as any;

      ethereum.on("accountsChanged", get().onAccountsChanged);
      ethereum.on("chainChanged", get().onChainChanged);
      ethereum.on("disconnect", get().resetConnectionState);
    },
    setLoginFn: (loginFn) => {
      set((state) => ({
        ...state,
        loginFn,
      }));
    },
    setIsWalletConnected: (isWalletConnected) => {
      set((state) => ({
        ...state,
        isWalletConnected,
      }));
    },
    setIsSigning: (isSigning) => {
      set((state) => ({
        ...state,
        isSigning,
      }));
    },
    setShowWrongNetworkPopup: (show) => {
      set((state) => ({
        ...state,
        showWrongNetworkPopup: show,
      }));
    },
    setLoggedInArtist: (artist) => {
      set((state) => ({
        ...state,
        loggedInArtist: artist,
      }));
    },
  }))
);

const clearStorageAuthData = () => {
  Cookies.remove("user_address");
  Cookies.remove("providerName");
};

useAuthStore.subscribe(
  (s) => s.providerName,
  () => {
    const providerName = useAuthStore.getState().providerName;
    if (providerName) {
      useAuthStore.getState().connectWeb3();
    }
  }
);

useAuthStore.subscribe(
  (s) => s.signer,
  async () => {
    const signer = useAuthStore.getState().signer;
    const signerAddress = await signer?.getAddress();
    const address = useAuthStore.getState().address;
    const isSigning = useAuthStore.getState().isSigning;

    if (address) {
      useAuthStore.getState().setIsWalletConnected(true);
      usePolymorphStore.getState().setUserPolymorphs([]);
      usePolymorphStore.getState().fetchUserPolymorphsTheGraph(address);
    }
  }
);
