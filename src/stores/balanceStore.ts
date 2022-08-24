import create from "zustand";
import { useErc20PriceStore } from "./erc20PriceStore";
import WrappedEthContract from "../abis/WrappedEthContract.json";
import { ethers, Contract, utils } from "ethers";
import { useAuthStore } from "./authStore";
import { useContractsStore } from "./contractsStore";

interface IBalanceStore {
  // Getters
  yourBalance: number;
  yourPolygonBalance: number;
  usdEthBalance: number;
  usdMaticBalance: number;
  polygonWethAllowanceInWeiForPolymorphs: number;
  polygonWethAllowanceInWeiForFaces: number;

  // Setters
  setYourBalance: (newBalance: number) => void;
  setYourPolygonBalance: (newBalance: number) => void;
  setUsdEthBalance: (newBalance: number) => void;
  setUsdMaticBalance: (newBalance: number) => void;
  setPolygonWethAllowanceInWeiForPolymorphs: () => void;
  setPolygonWethAllowanceInWeiForFaces: () => void;
}

export const useUserBalanceStore = create<IBalanceStore>((set, get) => ({
  yourBalance: 0,
  yourPolygonBalance: 0,
  usdEthBalance: 0,
  usdMaticBalance: 0,
  polygonWethAllowanceInWeiForPolymorphs: 0,
  polygonWethAllowanceInWeiForFaces: 0,
  setYourBalance: (newBalance: number) => {
    const usdEthBalance = useErc20PriceStore.getState().ethUsdPrice;
    set((state) => ({
      ...state,
      yourBalance: newBalance,
      usdEthBalance: newBalance * usdEthBalance,
    }));
  },
  setYourPolygonBalance: (newBalance: number) => {
    const usdMaticBalance = useErc20PriceStore.getState().maticUsdPrice;
    set((state) => ({
      ...state,
      yourPolygonBalance: newBalance,
      usdMaticBalance: newBalance * usdMaticBalance,
    }));
  },
  setUsdEthBalance: (newPrice: number) => {
    const newUsdBalance = get().yourBalance * newPrice;
    set((state) => ({
      ...state,
      usdEthBalance: newUsdBalance,
    }));
  },
  setUsdMaticBalance: (newPrice: number) => {
    const newUsdBalance = get().yourPolygonBalance * newPrice;
    set((state) => ({
      ...state,
      usdMaticBalance: newUsdBalance,
    }));
  },

  setPolygonWethAllowanceInWeiForPolymorphs: async () => {
    const address = useAuthStore.getState().address;
    const wrappedEthContract = useContractsStore.getState().wrappedEthContract;
    const polymorphsPolygonContract =
      useContractsStore.getState().polymorphContractV2Polygon;
    const network = useAuthStore.getState().activeNetwork;

    // Fetch allowance for polymorph V2 contract on Polygon
    let allowance: any;
    if (network === "Polygon") {
      allowance = await wrappedEthContract?.allowance(
        address,
        polymorphsPolygonContract?.address
      );
    }
    set((state) => ({
      ...state,
      polygonWethAllowanceInWeiForPolymorphs: allowance,
    }));
  },
  setPolygonWethAllowanceInWeiForFaces: async () => {
    const address = useAuthStore.getState().address;
    const network = useAuthStore.getState().activeNetwork;
    const wrappedEthContract = useContractsStore.getState().wrappedEthContract;
    const facesPolygonContract =
      useContractsStore.getState().polymorphicFacesContractPolygon;

    // Fetch allowance for faces contract on Polygon
    let facesAllowance: any;
    if (network === "Polygon") {
      facesAllowance = await wrappedEthContract?.allowance(
        address,
        facesPolygonContract?.address
      );
    }

    set((state) => ({
      ...state,
      polygonWethAllowanceInWeiForFaces: facesAllowance,
    }));
  },
}));
