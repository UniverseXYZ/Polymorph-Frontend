import { Contract } from "ethers";
import create from "zustand";
import PolymorphV1Contract from "../abis/PolymorphWithGeneChanger.json";
import PolymorphV2Contract from "../abis/PolymorphRoot.json";
import PolymorphicFacesContract from "../abis/PolymorphicFacesRoot.json";

interface IContracts {
  // Getters
  polymorphContract: Contract | null;
  polymorphContractV2: Contract | null;
  polymorphContractV2Polygon: Contract | null;
  polymorphicFacesContract: Contract | null;
}

interface IContractsStore extends IContracts {
  // Setters
  setContracts: (signer: any, network: any) => void;
  clearContracts: () => void;
}

export const useContractsStore = create<IContractsStore>((set) => ({
  polymorphContract: null,
  polymorphContractV2: null,
  polymorphContractV2Polygon: null,
  polymorphicFacesContract: null,

  setContracts: (signer, network) => {
    const polymorphContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS as any,
      PolymorphV1Contract?.abi,
      signer
    );

    const polymorphContractV2Instance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS as any,
      PolymorphV2Contract?.abi,
      signer
    );

    const polymorphContractV2PolygonInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_POLYGON_ADDRESS as any,
      PolymorphV2Contract?.abi,
      signer
    );

    const polymorphicFacesContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS as any,
      PolymorphicFacesContract?.abi,
      signer
    );

    set((state) => ({
      ...state,
      polymorphContract: polymorphContractInstance,
      polymorphContractV2: polymorphContractV2Instance,
      polymorphContractV2Polygon: polymorphContractV2PolygonInstance,
      polymorphicFacesContract: polymorphicFacesContractInstance,
    }));
  },
  clearContracts: () => {
    set(() => ({
      polymorphContract: null,
      polymorphContractV2: null,
      polymorphicFacesContract: null,
    }));
  },
}));
