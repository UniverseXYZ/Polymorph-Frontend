import { fetchTokensMetadataJson } from "@legacy/api/polymorphs";
import {
  burnedPolymorphs,
  queryPolymorphsGraph,
  queryPolymorphsGraphV2,
  queryPolymorphsGraphV2Polygon,
  transferPolymorphs,
} from "@legacy/graphql/polymorphQueries";
import { convertPolymorphObjects } from "@legacy/helpers/polymorphs";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import {
  queryPolymorphicFacesGraph,
  queryPolymorphicFacesGraphPolygon,
  mintedPolymorphicFaces,
  transferPolymorphicFaces,
  transferPolymorphicFacesBeingBridgedToEthereum,
  polymorphicFaceOwner,
  transferPolymorphicFacesBeingBridgedToPolygon,
  transferPolymorphicFacesSentToNullByUser,
  transferPolymorphicFacesSentToUserByBridge,
} from "../utils/graphql/polymorphicFacesQueries";
import { ZERO_ADDRESS } from "../utils/constants/zero-address";
import { utils } from "ethers";

type IPolymorphStore = {
  // Getters
  userPolymorphs: [];
  userPolymorphsV2: [];
  userPolymorphsV2Polygon: [];
  userPolymorphsAll: [];
  userSelectedPolymorphsToBurn: [];
  userPolymorphsLoaded: boolean;
  userPolymorphWithMetadata: [];
  userPolymorphicFaces: [];
  userPolymorphicFacesPolygon: [];
  userPolymorphicFacesAll: [];
  userPolymorphicFacesClaimed: [];
  userSelectedNFTsToBridge: [];
  userFacesBeingBridged: [];

  // Setters
  setUserPolymorphs: (userPolymorphs: []) => void;
  setUserPolymorphsV2: (userPolymorphsV2: []) => void;
  setUserPolymorphsV2Polygon: (userPolymorphsV2Polygon: []) => void;
  setUserPolymorphsAll: (userPolymorphsAll: []) => void;
  setUserSelectedPolymorphsToBurn: (userSelectedPolymorphsToBurn: []) => void;
  setUserPolymorphsLoaded: (userPolymorphsLoaded: boolean) => void;
  setUserPolymorphsWithMetadata: (userPolymorphWithMetadata: []) => void;
  setUserPolymorphicFaces: (userPolymorphicFaces: []) => void;
  setUserPolymorphicFacesPolygon: (userPolymorphicFacesPolygon: []) => void;
  setUserPolymorphicFacesAll: (userPolymorphicFacesAll: []) => void;
  setUserPolymorphicFacesClaimed: (setUserPolymorphicFacesClaimed: []) => void;
  setUserSelectedNFTsToBridge: (setUserSelectedNFTsToBridge: []) => void;
  setUserFacesBeingBridged: (userFacesBeingBridged: []) => void;
  // Helpers
  fetchUserPolymorphsTheGraph: (newAddress: string) => Promise<void>;
  loadMetadata: () => Promise<void>;
};

export const usePolymorphStore = create<IPolymorphStore>(
  subscribeWithSelector((set, get) => ({
    userPolymorphs: [],
    userPolymorphsV2: [],
    userPolymorphsV2Polygon: [],
    userPolymorphsAll: [],
    userSelectedPolymorphsToBurn: [],
    userPolymorphsLoaded: false,
    userPolymorphWithMetadata: [],
    userPolymorphicFaces: [],
    userPolymorphicFacesPolygon: [],
    userPolymorphicFacesAll: [],
    userPolymorphicFacesClaimed: [],
    userSelectedNFTsToBridge: [],
    userFacesBeingBridged: [],

    setUserPolymorphs: (userPolymorphs) => {
      set((state) => ({
        ...state,
        userPolymorphs,
      }));
    },
    setUserPolymorphsV2: (userPolymorphsV2) => {
      set((state) => ({
        ...state,
        userPolymorphsV2,
      }));
    },
    setUserPolymorphsV2Polygon: (userPolymorphsV2Polygon) => {
      set((state) => ({
        ...state,
        userPolymorphsV2Polygon,
      }));
    },
    setUserPolymorphsAll: (userPolymorphsAll) => {
      set((state) => ({
        ...state,
        userPolymorphsAll,
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
    setUserPolymorphicFacesPolygon: (userPolymorphicFacesPolygon) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesPolygon,
      }));
    },
    setUserPolymorphicFacesAll: (userPolymorphicFacesAll) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesAll,
      }));
    },
    setUserPolymorphicFacesClaimed: (userPolymorphicFacesClaimed) => {
      set((state) => ({
        ...state,
        userPolymorphicFacesClaimed,
      }));
    },
    setUserSelectedNFTsToBridge: (userSelectedNFTsToBridge) => {
      set((state) => ({
        ...state,
        userSelectedNFTsToBridge,
      }));
    },
    setUserFacesBeingBridged: (userFacesBeingBridged) => {
      set((state) => ({
        ...state,
        userFacesBeingBridged,
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
      const polymorphsV2Polygon = await queryPolymorphsGraphV2Polygon(
        transferPolymorphs(newAddress)
      );
      const allPolymorphs = polymorphs?.transferEntities
        .concat(polymorphsV2?.transferEntities)
        .concat(polymorphsV2Polygon?.transferEntities);

      const faces = await queryPolymorphicFacesGraph(
        transferPolymorphicFaces(newAddress)
      );
      const facesPolygon = await queryPolymorphicFacesGraphPolygon(
        transferPolymorphicFaces(newAddress)
      );
      const claimedFaces = await queryPolymorphicFacesGraph(
        mintedPolymorphicFaces(newAddress)
      );
      const allFaces = faces?.transferEntities.concat(
        facesPolygon?.transferEntities
      );
      const polymorphV1Ids = polymorphs?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const polymorphV2Ids = polymorphsV2?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));
      const polymorphV2PolygonIds = polymorphsV2Polygon?.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
        })
      );
      const allPolymorphIds = allPolymorphs.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));

      const facesIds = faces?.transferEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
        to: nft.to,
        from: nft.from,
      }));

      const facesPolygonIds = facesPolygon?.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
        })
      );
      const allFacesIds = allFaces.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));

      const claimedFacesIds = claimedFaces?.mintedEntities.map((nft: any) => ({
        tokenId: nft.tokenId,
        id: parseInt(nft.id, 16),
      }));

      // Get all faces sent from user to RootTunnel on ETH
      const facesTransferredToBridge = await queryPolymorphicFacesGraph(
        transferPolymorphicFacesBeingBridgedToPolygon(newAddress)
      );
      const facesIdsTransferredToBridge =
        facesTransferredToBridge.transferEntities.map((nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        }));

      // Get all faces sent from user to 0x00 in Polygon
      const facesBridgedToEthereum = await queryPolymorphicFacesGraphPolygon(
        transferPolymorphicFacesBeingBridgedToEthereum(newAddress)
      );
      const facesIdsBridgedToEthereum =
        facesBridgedToEthereum?.transferEntities.map((nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        }));

      // Filter the tokens that are present in both arrays
      const filteredResults = facesIdsBridgedToEthereum.filter(
        ({ tokenId: id1 }: any) =>
          facesIdsTransferredToBridge.some(
            ({ tokenId: id2 }: any) => id2 === id1
          )
      );

      // Query individually every token that has been
      // transferred from the user to the Root Tunnel
      const facesObjects: any = [];
      const metadataPromises: any = [];
      for (
        let i = 0;
        i <= facesTransferredToBridge.transferEntities.length - 1;
        i++
      ) {
        metadataPromises.push(
          queryPolymorphicFacesGraphPolygon(
            polymorphicFaceOwner(
              facesTransferredToBridge.transferEntities[i].tokenId
            )
          )
        );
        facesObjects.push(facesTransferredToBridge.transferEntities[i]);
      }
      const promises: any = await Promise.all(metadataPromises);

      // Make a new array containing the tokens that
      // have been trasferred to the Root Tunnel,
      // but have never been minted on Polygon yet
      const facesBeingBridgedFirstTime: any = [];
      for (let i = 0; i <= promises.length - 1; i++) {
        if (promises[i].transferEntities.length === 0) {
          facesBeingBridgedFirstTime.push({
            id: Number(facesObjects[i].id),
            tokenId: facesObjects[i].tokenId,
            from: facesObjects[i].from,
            to: facesObjects[i].to,
          });
        }
      }

      // =========================================================//
      // HANDLE CASES WHERE A TOKEN WAS TRANSFERRED TO ANOTHER USER
      // ON POLYGON, THEN BRIDGED BY THE ITS NEW OWNER TO ETHEREUM
      // =========================================================//

      // get All entities from user to 0x00
      const sentToNullByUser = await queryPolymorphicFacesGraphPolygon(
        transferPolymorphicFacesSentToNullByUser(newAddress)
      );
      const idsSentToNullByUser = sentToNullByUser?.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        })
      );
      // get all entities   from: $bridge ----> to: $user   AND   from: $user ----> to: $bridge

      const bridgeToUserEntities = await queryPolymorphicFacesGraph(
        transferPolymorphicFacesSentToUserByBridge(newAddress)
      );
      const idsBridgeToUserEntities =
        bridgeToUserEntities?.transferEntities.map((nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        }));
      const bridgeToUserAndViceVersaEntities =
        facesIdsTransferredToBridge.concat(idsBridgeToUserEntities);

      // if there is an entity that was sent to 0x00, but not from user to bridge AND not from bridge to user,
      // then the user must have bought it on polygon and transferred it to eth
      const tradedOnPolygonAndSentToEth = idsSentToNullByUser.filter(
        ({ tokenId: id1 }: any) =>
          !bridgeToUserAndViceVersaEntities.some(
            ({ tokenId: id2 }: any) => id2 === id1
          )
      );

      const allFacesInBridgingProgress = filteredResults
        .concat(facesBeingBridgedFirstTime)
        .concat(tradedOnPolygonAndSentToEth);

      // Filter out the tokens not sent
      // in pending status by the user
      const filteredFacesInBridgingProgress = allFacesInBridgingProgress.filter(
        (faces: any) => faces.from === newAddress
      );

      // =========================================================//
      // HANDLE CASES WHERE A TOKEN WAS TRANSFERRED TO A NEW OWNER
      // ON ETHEREUM, AFTER BRIDGED BACK TO ETHEREUM BY OLD OWNER
      // =========================================================//

      // Get all ethereum entities of tokens that were
      // sent to ethereum and then traded
      let metadataPromises2: any = [];
      for (let i = 0; i <= tradedOnPolygonAndSentToEth.length - 1; i++) {
        metadataPromises2.push(
          queryPolymorphicFacesGraph(
            polymorphicFaceOwner(tradedOnPolygonAndSentToEth[i].tokenId)
          )
        );
      }
      const promises2: any = await Promise.all(metadataPromises2);
      // console.log("promise2", promises2);

      let filteredResults2: any = [];
      for (let i = 0; i <= promises.length - 1; i++) {
        promises2[i]?.transferEntities.map((face: any) => {
          if (
            face.to !==
              process.env.REACT_APP_POLYMORPHIC_FACES_ROOT_TUNNEL_ADDRESS?.toLowerCase() &&
            face.to !== newAddress
          ) {
            filteredResults2.push({
              id: Number(face.tokenId),
              tokenId: face.tokenId,
              from: face.from,
              to: face.to,
            });
          } else {
            return {};
          }
        });
      }

      // Filter out the tokens that were first bridged back from Polygon to Ethereum
      // and then transferred toa new owner on Ethereum
      const allUserFacesInBridgingProgress =
        filteredFacesInBridgingProgress.filter(
          ({ tokenId: id1 }: any) =>
            !filteredResults2?.some(({ tokenId: id2 }: any) => id2 === id1)
        );

      set((state) => ({
        ...state,
        userPolymorphs: polymorphV1Ids || [],
        userPolymorphsV2: polymorphV2Ids || [],
        userPolymorphsV2Polygon: polymorphV2PolygonIds || [],
        userPolymorphsAll: allPolymorphIds || [],
        userPolymorphsLoaded: true,
        userPolymorphicFaces: facesIds || [],
        userPolymorphicFacesPolygon: facesPolygonIds || [],
        userPolymorphicFacesAll: allFacesIds || [],
        userPolymorphicFacesClaimed: claimedFacesIds || [],
        userFacesBeingBridged: allUserFacesInBridgingProgress || [],
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
