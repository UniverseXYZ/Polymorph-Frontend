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
  transferPolymorphicFacesFromUser,
  bridgeEntity,
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
  userFacesBeingBridgedToEthereum: [];
  userFacesBeingBridgedToPolygon: [];

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
  setUserFacesBeingBridgedToEthereum: (
    userFacesBeingBridgedToEthereum: []
  ) => void;
  setUserFacesBeingBridgedToPolygon: (
    userFacesBeingBridgedToPolygon: []
  ) => void;
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
    userFacesBeingBridgedToEthereum: [],
    userFacesBeingBridgedToPolygon: [],

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
    setUserFacesBeingBridgedToEthereum: (userFacesBeingBridgedToEthereum) => {
      set((state) => ({
        ...state,
        userFacesBeingBridgedToEthereum,
      }));
    },
    setUserFacesBeingBridgedToPolygon: (userFacesBeingBridgedToPolygon) => {
      set((state) => ({
        ...state,
        userFacesBeingBridgedToPolygon,
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
          to: nft.to,
          from: nft.from,
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

      /// O W N E R S H I P
      // get faces from: $userAddress on ETH
      const facesFromUser = await queryPolymorphicFacesGraph(
        transferPolymorphicFacesFromUser(newAddress)
      );

      const facesFromUserIds = facesFromUser.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        })
      );

      // filter out the faces that have a to: different from the RootTunnelAddress
      const faceFromUserIdsFiltered = facesFromUserIds.filter(
        (entity: any) =>
          entity.to.toLowerCase() ===
          process.env.REACT_APP_POLYMORPHIC_FACES_ROOT_TUNNEL_ADDRESS?.toLowerCase()
      );

      // Merge the filtered from: $userAddress entities with
      // the to: $userAddress entities
      const facesFromAndToUserOnEth = facesIds.concat(faceFromUserIdsFiltered);

      // get faces from: $userAddress on Polygon
      const facesFromUserPolygon = await queryPolymorphicFacesGraphPolygon(
        transferPolymorphicFacesFromUser(newAddress)
      );
      const facesFromUserPolygonIds = facesFromUserPolygon.transferEntities.map(
        (nft: any) => ({
          tokenId: nft.tokenId,
          id: parseInt(nft.id, 16),
          from: nft.from,
          to: nft.to,
        })
      );

      // filter out the faces that have a to: different from the 0x00
      const facesFromUserPolygonIdsFiltered = facesFromUserPolygonIds.filter(
        (entity: any) => entity.to.toLowerCase() === ZERO_ADDRESS.toLowerCase()
      );

      // Merge the filtered from: $userAddress entities with
      // the to: $userAddress entities
      const faceFromAndToUserOnPolygon = facesPolygonIds.concat(
        facesFromUserPolygonIdsFiltered
      );

      const allTokens = facesFromAndToUserOnEth.concat(
        faceFromAndToUserOnPolygon
      );

      // Create a new array of tokens without duplicates
      const uniqueTokens: any = [
        ...new Map(
          allTokens.map((token: any) => [token.tokenId, token])
        ).values(),
      ];

      // Query both subgraphs for each token
      let uniqueTokenPromisesEth: any = [];
      let uniqueTokenPromisesPolygon: any = [];

      for (let i = 0; i <= uniqueTokens.length - 1; i++) {
        uniqueTokenPromisesEth.push(
          queryPolymorphicFacesGraph(bridgeEntity(uniqueTokens[i]?.tokenId))
        );
        uniqueTokenPromisesPolygon.push(
          queryPolymorphicFacesGraphPolygon(
            bridgeEntity(uniqueTokens[i].tokenId)
          )
        );
      }

      const uniqueTokenPromisesEthResolved: any = await Promise.all(
        uniqueTokenPromisesEth
      );
      const uniqueTokenPromisesPolygonResolved: any = await Promise.all(
        uniqueTokenPromisesPolygon
      );

      let tokensOwnedByUser: any = [];

      for (let i = 0; i <= uniqueTokenPromisesEthResolved.length - 1; i++) {
        // Check if the user is owner of a token on both networks
        // by checking the bridge entities owner
        if (
          uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]?.ownerAddress ===
            uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
              ?.ownerAddress ||
          uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities.length === 0
        ) {
          tokensOwnedByUser.push(
            uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
          );
        }

        // if the owner is not the same on both networks
        if (
          uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]?.ownerAddress !==
          uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]?.ownerAddress
        ) {
          // check if eth timestamp > polygon timestamp && if eth owner is the user
          if (
            uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]?.timestamp >
              uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
                ?.timestamp &&
            uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              ?.ownerAddress === newAddress
          ) {
            tokensOwnedByUser.push(
              uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
            );
          }
          // check if polygon timestamp > eth timestamp && if polygon owner is the user
          if (
            uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
              ?.timestamp >
              uniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]?.timestamp &&
            uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
              ?.ownerAddress === newAddress
          ) {
            tokensOwnedByUser.push(
              uniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
            );
          }
        }
      }

      // Create 2 new arrays containing only the tokens owner by the user
      const filteredUniqueTokenPromisesEthResolved =
        uniqueTokenPromisesEthResolved.filter((obj: any) => {
          return tokensOwnedByUser.some((token: any) => {
            return obj.bridgeEntities[0].tokenId === token.tokenId;
          });
        });

      const filteredUniqueTokenPromisesPolygonResolved =
        uniqueTokenPromisesPolygonResolved.filter((obj: any) => {
          return tokensOwnedByUser.some((token: any) => {
            return obj?.bridgeEntities[0]?.tokenId === token?.tokenId;
          });
        });

      console.log(
        "owner bu yser on eth",
        filteredUniqueTokenPromisesEthResolved
      );
      console.log(
        "owner bu yser on polygon",
        filteredUniqueTokenPromisesPolygonResolved
      );

      // Check which of the tokens owned by the user are pending
      let facesPendingToEth: any = [];
      let facesPendingToPolygon: any = [];

      for (
        let i = 0;
        i <= filteredUniqueTokenPromisesEthResolved.length - 1;
        i++
      ) {
        // check if the entity on ETH at the current index exists on polygon too
        if (
          filteredUniqueTokenPromisesPolygonResolved.some(
            (tokenOnPolygon: any) =>
              tokenOnPolygon.bridgeEntities[0].tokenId ===
              filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
                .tokenId
          )
        ) {
          // extract the index of the entity in the polygon array
          const mapping = filteredUniqueTokenPromisesPolygonResolved.map(
            (obj: any) => obj.bridgeEntities[0].tokenId
          );
          const index = mapping.indexOf(
            filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0].tokenId
          );

          // check if it is pending
          if (
            !filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              .bridged &&
            !filteredUniqueTokenPromisesPolygonResolved[index]
              ?.bridgeEntities[0].bridged
          ) {
            // if the latest timestamp is on ETH, it must be pending towards Polygon
            if (
              filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
                .timestamp >
              filteredUniqueTokenPromisesPolygonResolved[index]
                ?.bridgeEntities[0].timestamp
            ) {
              // add it to the faces pending to polygon
              facesPendingToPolygon.push(
                filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              );
            }
            // if the latest timestamp is on Polygon, it must be pending towards Eth
            if (
              filteredUniqueTokenPromisesPolygonResolved[index]
                ?.bridgeEntities[0].timestamp >
              filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
                .timestamp
            ) {
              // add it to the faces pending to eth
              facesPendingToEth.push(
                filteredUniqueTokenPromisesPolygonResolved[index]
                  ?.bridgeEntities[0]
              );
            }
          }
        } else {
          if (
            !filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              .bridged
          ) {
            facesPendingToPolygon.push(
              filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
            );
          }
        }
      }

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
        userFacesBeingBridgedToPolygon: facesPendingToPolygon || [],
        userFacesBeingBridgedToEthereum: facesPendingToEth || [],
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
