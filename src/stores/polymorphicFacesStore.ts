import { fetchTokensMetadataJson } from "@legacy/api/polymorphs";
import {
  burnedPolymorphs,
  queryPolymorphsGraph,
  queryPolymorphsGraphV2,
  transferPolymorphs,
} from "@legacy/graphql/polymorphQueries";
import { convertPolymorphObjects } from "@legacy/helpers/polymorphs";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useAuthStore } from "./authStore";

type IPolymorphStore = {
  // Getters
  userPolymorphicFaces: [];
  userPolymorphicFacesWithMetadata: [];
  userPolymorphicFacesLoaded: boolean;
  totalClaimedPolymorphicFaces: [];

  // Setters
  setUserPolymorphicFaces: (userPolymorphicFaces: []) => void;
  setUserPolymorphicFacesWithMetadata: (
    userPolymorphicFacesWithMetadata: []
  ) => void;
  setUserPolymorphicFacesLoaded: (userPolymorphicFacesLoaded: boolean) => void;
  setTotalClaimedPolymorphicFaces: (totalClaimedPolymorphicFaces: []) => void;

  // Helpers
  fetchUserPolymorphicFacesTheGraph: (newAddress: string) => Promise<void>;
  // loadMetadata: () => Promise<void>;
};

export const usePolymorphStore = create<IPolymorphStore>(
  subscribeWithSelector((set, get) => ({
    userPolymorphicFaces: [],
    userPolymorphicFacesWithMetadata: [],
    userPolymorphicFacesLoaded: false,
    totalClaimedPolymorphicFaces: [],
    setUserPolymorphicFaces: (userPolymorphicFaces) => {
      set((state) => ({
        ...state,
        userPolymorphicFaces,
      }));
    },
    setUserPolymorphicFacesLoaded: (userPolymorphicFacesLoaded) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesLoaded,
      }));
    },
    setUserPolymorphicFacesWithMetadata: (userPolymorphicFacesWithMetadata) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesWithMetadata,
      }));
    },
    setTotalClaimedPolymorphicFaces: (totalClaimedPolymorphicFaces) => {
      set((state) => ({
        ...state,
        totalClaimedPolymorphicFaces,
      }));
    },
    fetchUserPolymorphicFacesTheGraph: async (newAddress) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesLoaded: false,
      }));

      const polymorphicFaces = await queryPolymorphsGraph(
        transferPolymorphs(newAddress)
      );
      // const claimed = await queryPolymorphsGraphV2(
      //   totalClaimedPolymorphicFaces
      // );

      const polymorphicFacesIds = polymorphicFaces?.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
        })
      );

      set((state) => ({
        ...state,
        userPolymorphicFaces: polymorphicFacesIds || [],
        userPolymorphicFacesLoaded: true,
        // totalClaimedPolymorphicFaces: burned?.burnCount?.count || 0
      }));
    },
    // This is a new function for loading the metadata of the polymorphs
    // This previously was inside fetchUserPolymorphsTheGraph
    // but polymorph metadata isn't used anywhere currently so I'm splitting
    // the function into two pieces so we don't make unnecessary calls to the cloud function
    // and we can load the metadata on demand when needed
    // loadMetadata: async () => {
    //   const userNftIds = get().userPolymorphs.map((nft: any) => nft.tokenId);
    //   const metadataURIs = userNftIds?.map(
    //     (id) => `${process.env.REACT_APP_POLYMORPHS_IMAGES_URL}${id}`
    //   );
    //   const nftMetadataObjects = await fetchTokensMetadataJson(metadataURIs);
    //   const polymorphNFTs = convertPolymorphObjects(nftMetadataObjects);
    //   if (polymorphNFTs) {
    //     get().setUserPolymorphsWithMetadata(polymorphNFTs);
    //   }
    // },
  }))
);
