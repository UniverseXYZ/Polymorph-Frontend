import { fetchTokensMetadataJson } from "@legacy/api/polymorphs";
import { queryPolymorphsGraph, queryPolymorphsGraphV2, transferPolymorphs } from "@legacy/graphql/polymorphQueries";
import { convertPolymorphObjects } from "@legacy/helpers/polymorphs";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useAuthStore } from "./authStore";

type IPolymorphStore = {
  // Getters 
  userPolymorphs: [],
  userPolymorphWithMetadata: [],
  userPolymorphsLoaded: boolean,
  userSelectedPolymorphsToBurn: []
  
  // Setters
  setUserPolymorphs: (userPolymorphs: []) => void,
  setUserPolymorphsWithMetadata: (userPolymorphWithMetadata: []) => void,
  setUserPolymorphsLoaded: (userPolymorphsLoaded: boolean) => void,
  setUserSelectedPolymorphsToBurn: (userSelectedPolymorphsToBurn: []) => void,

  // Helpers
  fetchUserPolymorphsTheGraph: (newAddress: string) => Promise<void>
  loadMetadata: () => Promise<void>
}

export const usePolymorphStore = create<IPolymorphStore>(subscribeWithSelector((set, get) => ({
  userPolymorphs: [],
  userPolymorphWithMetadata: [],
  userPolymorphsLoaded: false,
  userSelectedPolymorphsToBurn: [],
  setUserPolymorphs: (userPolymorphs) => {
    set(state => ({
      ...state,
      userPolymorphs
    }))
  },
  setUserPolymorphsLoaded: (userPolymorphsLoaded) => {
    set(state => ({
      ...state,
      userPolymorphsLoaded
    }))
  },
  setUserSelectedPolymorphsToBurn: (userSelectedPolymorphsToBurn) => {
    set(state => ({
      ...state,
      userSelectedPolymorphsToBurn
    }))
  },
  setUserPolymorphsWithMetadata: (userPolymorphWithMetadata) => {
    set(state => ({
      ...state,
      userPolymorphWithMetadata
    }))
  },
  fetchUserPolymorphsTheGraph: async (newAddress) => {
    set(state => ({
      ...state,
      userPolymorphsLoaded: false
    }))

    const polymorphs = await queryPolymorphsGraph(transferPolymorphs(newAddress));
    const polymorphsV2 = await queryPolymorphsGraphV2(transferPolymorphs(newAddress));
    const allPolymorphs = polymorphs?.transferEntities.concat(polymorphsV2?.transferEntities)
    const userNftIds = allPolymorphs.map((nft: any) => ({
      tokenId: nft.tokenId,
      id: parseInt(nft.id, 16),
    }));

    set(state => ({
      ...state,
      userPolymorphs: userNftIds || [],
      userPolymorphsLoaded: true
    }))
  },
  // This is a new function for loading the metadata of the polymorphs
  // This previously was inside fetchUserPolymorphsTheGraph
  // but polymorph metadata isn't used anywhere currently so I'm splitting
  // the function into two pieces so we don't make unnecessary calls to the cloud function
  // and we can load the metadata on demand when needed
  loadMetadata: async () => {
    const userNftIds = get().userPolymorphs.map((nft: any) => nft.tokenId);
    const metadataURIs = userNftIds?.map(
      (id) => `${process.env.REACT_APP_POLYMORPHS_IMAGES_URL}${id}`
    );
    const nftMetadataObjects = await fetchTokensMetadataJson(metadataURIs);
    const polymorphNFTs = convertPolymorphObjects(nftMetadataObjects);
    if (polymorphNFTs) {
      get().setUserPolymorphsWithMetadata(polymorphNFTs);
    }
  }
})))

// Fetch polymorphs when address changes
useAuthStore.subscribe(s => s.address, () => {
  const address = useAuthStore.getState().address;
  usePolymorphStore.getState().setUserPolymorphs([]);
  usePolymorphStore.getState().fetchUserPolymorphsTheGraph(address);
})
