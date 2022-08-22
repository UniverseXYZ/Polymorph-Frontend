import { Contract } from "ethers";
import create from "zustand";
import PolymorphV1Contract from "../abis/PolymorphWithGeneChanger.json";
import PolymorphV2Contract from "../abis/PolymorphRoot.json";
import PolymorphicFacesContract from "../abis/PolymorphicFacesRoot.json";
import PolymorphRootTunnelContract from "../abis/PolymorphRootTunnel.json";
import PolymorphChildTunnelContract from "../abis/PolymorphChildTunnel.json";
import WrappedEthContract from "../abis/WrappedEthContract.json";

interface IContracts {
  // Getters
  polymorphContract: Contract | null;
  polymorphContractV2: Contract | null;
  polymorphContractV2Polygon: Contract | null;
  polymorphRootTunnel: Contract | null;
  polymorphChildTunnel: Contract | null;
  polymorphicFacesContract: Contract | null;
  polymorphicFacesContractPolygon: Contract | null;
  polymorphicFacesRootTunnel: Contract | null;
  polymorphicFacesChildTunnel: Contract | null;
  wrappedEthContract: Contract | null;
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
  polymorphRootTunnel: null,
  polymorphChildTunnel: null,
  polymorphicFacesContract: null,
  polymorphicFacesContractPolygon: null,
  polymorphicFacesRootTunnel: null,
  polymorphicFacesChildTunnel: null,
  wrappedEthContract: null,

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

    const polymorphicFacesContractPolygonInstance = new Contract(
      process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_POLYGON_ADDRESS as any,
      PolymorphicFacesContract?.abi,
      signer
    );

    const polymorphRootTunnelContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_ROOT_TUNNEL_ADDRESS as any,
      PolymorphRootTunnelContract?.abi,
      signer
    );

    const polymorphChildTunnelContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHS_CHILD_TUNNEL_ADDRESS as any,
      PolymorphChildTunnelContract?.abi,
      signer
    );

    const polymorphicFacesRootTunnelContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHIC_FACES_ROOT_TUNNEL_ADDRESS as any,
      PolymorphRootTunnelContract?.abi,
      signer
    );

    const polymorphicFacesChildTunnelContractInstance = new Contract(
      process.env.REACT_APP_POLYMORPHIC_FACES_CHILD_TUNNEL_ADDRESS as any,
      PolymorphChildTunnelContract?.abi,
      signer
    );

    const wrappedEthContractInstance = new Contract(
      process.env.REACT_APP_POLYGON_WRAPPED_ETH_CONTRACT_ADDRESS as any,
      WrappedEthContract?.abi,
      signer
    );

    set((state) => ({
      ...state,
      polymorphContract: polymorphContractInstance,
      polymorphContractV2: polymorphContractV2Instance,
      polymorphContractV2Polygon: polymorphContractV2PolygonInstance,
      polymorphRootTunnel: polymorphRootTunnelContractInstance,
      polymorphChildTunnel: polymorphChildTunnelContractInstance,
      polymorphicFacesContract: polymorphicFacesContractInstance,
      polymorphicFacesContractPolygon: polymorphicFacesContractPolygonInstance,
      polymorphicFacesRootTunnel: polymorphicFacesRootTunnelContractInstance,
      polymorphicFacesChildTunnel: polymorphicFacesChildTunnelContractInstance,
      wrappedEthContract: wrappedEthContractInstance,
    }));
  },
  clearContracts: () => {
    set(() => ({
      polymorphContract: null,
      polymorphContractV2: null,
      polymorphContractV2Polygon: null,
      polymorphRootTunnel: null,
      polymorphChildTunnel: null,
      polymorphicFacesContract: null,
      polymorphicFacesContractPolygon: null,
      polymorphicFacesRootTunnel: null,
      polymorphicFacesChildTunnel: null,
      wrappedEthContract: null,
    }));
  },
}));
