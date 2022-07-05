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
import { queryPolymorphicFacesGraph } from "../utils/graphql/polymorphicFacesQueries";
import { ZERO_ADDRESS } from "../utils/constants/zero-address";

type IPolymorphStore = {
  // Getters
  userPolymorphs: [];
  userPolymorphsV2: [];
  userPolymorphsAll: [];
  userPolymorphWithMetadata: [];
  userPolymorphsLoaded: boolean;
  userSelectedPolymorphsToBurn: [];
  userPolymorphicFaces: [];
  userPolymorphicFacesClaimed: [];
  userPolymorphsV1Burnt: [];
  // totalBurnedPolymorphs: []

  // Setters
  setUserPolymorphs: (userPolymorphs: []) => void;
  setUserPolymorphsWithMetadata: (userPolymorphWithMetadata: []) => void;
  setUserPolymorphsLoaded: (userPolymorphsLoaded: boolean) => void;
  setUserSelectedPolymorphsToBurn: (userSelectedPolymorphsToBurn: []) => void;
  // setTotalBurnedPolymorphs: (totalBurnedPolymorphs: []) => void,
  setUserPolymorphicFaces: (userPolymorphicFaces: []) => void;
  setUserPolymorphicFacesClaimed: (setUserPolymorphicFacesClaimed: []) => void;
  setUserPolymorphsV1Burnt: (userPolymorphsBurnt: []) => void;

  // Helpers
  fetchUserPolymorphsTheGraph: (newAddress: string) => Promise<void>;
  loadMetadata: () => Promise<void>;
};

export const usePolymorphStore = create<IPolymorphStore>(
  subscribeWithSelector((set, get) => ({
    userPolymorphs: [],
    userPolymorphWithMetadata: [],
    userPolymorphsLoaded: false,
    userSelectedPolymorphsToBurn: [],
    userPolymorphsV2: [],
    userPolymorphsAll: [],
    userPolymorphicFaces: [],
    userPolymorphicFacesClaimed: [],

    setUserPolymorphs: (userPolymorphs) => {
      set((state) => ({
        ...state,
        userPolymorphs,
      }));
    },
    setUserPolymorphsLoaded: (userPolymorphsLoaded) => {
      set((state) => ({
        ...state,
        userPolymorphsLoaded,
      }));
    },
    setUserSelectedPolymorphsToBurn: (userSelectedPolymorphsToBurn) => {
      set((state) => ({
        ...state,
        userSelectedPolymorphsToBurn,
      }));
    },
    setUserPolymorphsWithMetadata: (userPolymorphWithMetadata) => {
      set((state) => ({
        ...state,
        userPolymorphWithMetadata,
      }));
    },
    setUserPolymorphicFaces: (userPolymorphicFaces) => {
      set((state) => ({
        ...state,
        userPolymorphicFaces,
      }));
    },
    setUserPolymorphicFacesClaimed: (userPolymorphicFacesClaimed) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesClaimed,
      }));
    },
    setUserPolymorphsV1Burnt: (userPolymorphsV1Burnt) => {
      set((state) => ({
        ...state,
        userPolymorphsV1Burnt,
      }));
    },

    fetchUserPolymorphsTheGraph: async (newAddress) => {
      set((state) => ({
        ...state,
        userPolymorphsLoaded: false,
      }));

      const polymorphs = await queryPolymorphsGraph(
        transferPolymorphs(newAddress)
      );
      const polymorphsV2 = await queryPolymorphsGraphV2(
        transferPolymorphs(newAddress)
      );
      const allPolymorphs = polymorphs?.transferEntities.concat(
        polymorphsV2?.transferEntities
      );
      const faces = await queryPolymorphicFacesGraph(
        transferPolymorphs(newAddress)
      );
      const claimedFaces = faces.transferEntities.filter(
        (entity: any) => entity.from === ZERO_ADDRESS
      );
      const polymorphsV1Burnt = polymorphsV2.transferEntities.filter(
        (entity: any) => entity.from === ZERO_ADDRESS
      );

      const polymorphV1Ids = polymorphs?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const polymorphV2Ids = polymorphsV2?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const allPolymorphIds = allPolymorphs.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const facesIds = faces?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const claimedFacesIds = claimedFaces?.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const userPolymorphsV1Burnt = polymorphsV1Burnt?.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));

      set((state) => ({
        ...state,
        userPolymorphs: polymorphV1Ids || [],
        userPolymorphsV2: polymorphV2Ids || [],
        userPolymorphsAll: allPolymorphIds || [],
        userPolymorphsLoaded: true,
        userPolymorphsV1Burnt: userPolymorphsV1Burnt || [],
        userPolymorphicFaces: facesIds || [],
        userPolymorphicFacesClaimed: claimedFacesIds || [],
      }));
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
    },
  }))
);
