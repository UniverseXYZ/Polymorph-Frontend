import { Contract } from "ethers";
import create from "zustand";
import Contracts from "../contracts/contracts.json";

interface IContracts {
  // Getters
  polymorphContract: Contract | null;
  polymorphContractV2: Contract | null;
}

interface IContractsStore extends IContracts {
  // Setters
  setContracts: (signer: any, network: any) => void;
  clearContracts: () => void;
}

export const useContractsStore = create<IContractsStore>((set) => ({
  polymorphContract: null,
  polymorphContractV2: null,

  setContracts: (signer, network) => {
    const { contracts: contractsData } = (Contracts as any)[network.chainId];

    const polymorphContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS as any,
      contractsData.PolymorphWithGeneChanger?.abi,
      signer
    );

    const polymorphContractV2Instance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS as any,
      contractsData.PolymorphRoot?.abi,
      signer
    );

    set((state) => ({
      ...state,
      polymorphContract: polymorphContractInstance,
      polymorphContractV2: polymorphContractV2Instance,
    }));
  },
  clearContracts: () => {
    set(() => ({
      polymorphContract: null,
      polymorphContractV2: null,
    }));
  },
}));
