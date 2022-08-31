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
      // these were traded on ETH and are no longer owned by the user
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
      // these were traded on Polygon and are no longer owned by the user
      const facesFromUserPolygonIdsFiltered = facesFromUserPolygonIds.filter(
        (entity: any) => entity.to.toLowerCase() === ZERO_ADDRESS.toLowerCase()
      );

      // Merge the filtered from: $userAddress entities with
      // the to: $userAddress entities
      const faceFromAndToUserOnPolygon = facesPolygonIds.concat(
        facesFromUserPolygonIdsFiltered
      );

      // console.log("facesFromAndToUserOnEth", facesFromAndToUserOnEth);
      // console.log("faceFromAndToUserOnPolygon", faceFromAndToUserOnPolygon);

      const allTokens = facesFromAndToUserOnEth.concat(
        faceFromAndToUserOnPolygon
      );

      const uniqueTokens = [
        ...new Map(allTokens.map((token) => [token.tokenId, token])).values(),
      ];
      // console.log("unique", uniqueTokens);

      let uniqueTokenPromisesEth: any = [];
      let uniqueTokenPromisesPolygon: any = [];

      for (let i = 0; i <= uniqueTokens.length - 1; i++) {
        uniqueTokenPromisesEth.push(
          queryPolymorphicFacesGraph(bridgeEntity(uniqueTokens[i].tokenId))
        );
        uniqueTokenPromisesPolygon.push(
          queryPolymorphicFacesGraphPolygon(
            bridgeEntity(uniqueTokens[i].tokenId)
          )
        );
      }

      const uniqueTokenPromisesEthResolved = await Promise.all(
        uniqueTokenPromisesEth
      );
      const uniqueTokenPromisesPolygonResolved = await Promise.all(
        uniqueTokenPromisesPolygon
      );

      let tokensOwnedByUser: any = [];

      for (let i = 0; i <= uniqueTokenPromisesEthResolved.length - 1; i++) {
        // if the user is owner of a token on both networks
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
      console.log("owned by user ", tokensOwnedByUser);

      const filteredUniqueTokenPromisesEthResolved =
        uniqueTokenPromisesEthResolved.filter((obj) => {
          return tokensOwnedByUser.some((token) => {
            return obj.bridgeEntities[0].tokenId === token.tokenId;
          });
        });

      const filteredUniqueTokenPromisesPolygonResolved =
        uniqueTokenPromisesPolygonResolved.filter((obj) => {
          return tokensOwnedByUser.some((token) => {
            return obj?.bridgeEntities[0]?.tokenId === token?.tokenId;
          });
        });

      // console.log("this is what i filter", uniqueTokenPromisesEthResolved);
      console.log("filtered eth ones", filteredUniqueTokenPromisesEthResolved);
      console.log(
        "filtered polygon ones",
        filteredUniqueTokenPromisesPolygonResolved
      );

      let facesPendingToEth: any = [];
      let facesPendingToPolygon: any = [];

      for (
        let i = 0;
        i <= filteredUniqueTokenPromisesEthResolved.length - 1;
        i++
      ) {
        // check if it is pending
        if (
          !filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
            .bridged &&
          !filteredUniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
            .bridged
        ) {
          // if the latest timestamp is on ETH, it must be pending towards Polygon
          if (
            filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              .timestamp >
            filteredUniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
              .timestamp
          ) {
            console.log("Pending to polygon");
            facesPendingToPolygon.push(
              filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
            );
          }
          // if the latest timestamp is on Polygon, it must be pending towards Eth
          if (
            filteredUniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
              .timestamp >
            filteredUniqueTokenPromisesEthResolved[i]?.bridgeEntities[0]
              .timestamp
          ) {
            console.log("Pending to eth");
            facesPendingToEth.push(
              filteredUniqueTokenPromisesPolygonResolved[i]?.bridgeEntities[0]
            );
          }
        }
      }

      console.log("uniqueTokenPromisesEth", uniqueTokenPromisesEthResolved);
      console.log(
        "uniqueTokenPromisesPolygon",
        uniqueTokenPromisesPolygonResolved
      );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // Filter the two arrays. The differences are the traded tokens on ETH,
      // // and they are not owned by the user address, therefore removed from the array.
      // const filteredDifferencesOnEth = facesFromAndToUserOnEth.filter(
      //   ({ tokenId: id1 }: any) => {
      //     return !faceFromAndToUserOnPolygon.some(({ tokenId: id2 }: any) => {
      //       return id2 === id1;
      //     });
      //   }
      // );

      // const filteredDifferencesOnPolygon = faceFromAndToUserOnPolygon.filter(
      //   ({ tokenId: id1 }: any) => {
      //     return !facesFromAndToUserOnEth.some(({ tokenId: id2 }: any) => {
      //       return id2 === id1;
      //     });
      //   }
      // );

      // // console.log("filtered differences on eth", filteredDifferencesOnEth);
      // // console.log(
      // //   "filtered differences on polygon",
      // //   filteredDifferencesOnPolygon
      // // );

      // // Check the entities on Polygon, of the tokens difference on ETH
      // let filteredDiffOnEthPromises: any = [];
      // for (let i = 0; i <= filteredDifferencesOnEth.length - 1; i++) {
      //   filteredDiffOnEthPromises.push(
      //     queryPolymorphicFacesGraphPolygon(
      //       polymorphicFaceOwner(filteredDifferencesOnEth[i].tokenId)
      //     )
      //   );
      // }
      // const filteredDiffOnEthPromisesResolved: any = await Promise.all(
      //   filteredDiffOnEthPromises
      // );
      // console.log("entities", filteredDiffOnEthPromisesResolved);
      // for (let i = 0; i <= filteredDiffOnEthPromisesResolved.length - 1; i++) {
      //   if (
      //     filteredDiffOnEthPromisesResolved[i].transferEntities[0].to ===
      //     newAddress
      //   ) {
      //     // add it to the array of tokens owned by the user
      //   } else {
      //     // remove from the array of tokens owner by the user on ETH
      //     const index = facesFromAndToUserOnEth
      //       .map((object) => object.tokenId)
      //       .indexOf(
      //         filteredDiffOnEthPromisesResolved[i].transferEntities[0].tokenId
      //       );
      //     if (index > -1) {
      //       // facesFromAndToUserOnEth.splice(index, 1);
      //       console.log("NEW ARRAY ETH", facesFromAndToUserOnEth);
      //     }
      //   }
      // }

      // // Check the entities on Ethereum, of the tokens difference on Polygon
      // let filteredDiffOnPolygonPromises: any = [];
      // for (let i = 0; i <= filteredDifferencesOnPolygon.length - 1; i++) {
      //   filteredDiffOnPolygonPromises.push(
      //     queryPolymorphicFacesGraph(
      //       polymorphicFaceOwner(filteredDifferencesOnPolygon[i].tokenId)
      //     )
      //   );
      // }
      // const filteredDiffOnPolygonPromisesResolved: any = await Promise.all(
      //   filteredDiffOnPolygonPromises
      // );
      // for (
      //   let i = 0;
      //   i <= filteredDiffOnPolygonPromisesResolved.length - 1;
      //   i++
      // ) {
      //   if (
      //     filteredDiffOnPolygonPromisesResolved[i].transferEntities[0].to ===
      //     newAddress
      //   ) {
      //     // add it to the array of tokens owned by the user
      //   } else {
      //     // remove from the array of tokens owner by the user on ETH
      //     const index = faceFromAndToUserOnPolygon
      //       .map((object) => object.tokenId)
      //       .indexOf(
      //         filteredDiffOnPolygonPromisesResolved[i].transferEntities[0]
      //           .tokenId
      //       );
      //     if (index > -1) {
      //       // faceFromAndToUserOnPolygon.splice(index, 1);
      //       console.log("NEW ARRAY POLYGON", faceFromAndToUserOnPolygon);
      //     }
      //   }
      // }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // for each filtered difference on ETH make a query to the tokenId on polygon.
      // if the token entity to: $address is not the user address, exclude it from
      // the array of tokens owned by the user

      // console.log("faces from user POLYGON", facesFromUserPolygonIds);

      // // Get all faces sent from user to RootTunnel on ETH
      // const facesTransferredToBridge = await queryPolymorphicFacesGraph(
      //   transferPolymorphicFacesBeingBridgedToPolygon(newAddress)
      // );
      // const facesIdsTransferredToBridge =
      //   facesTransferredToBridge.transferEntities.map((nft: any) => ({
      //     tokenId: nft.tokenId,
      //     id: parseInt(nft.id, 16),
      //     from: nft.from,
      //     to: nft.to,
      //   }));

      // // Get all faces sent from user to 0x00 in Polygon
      // const facesBridgedToEthereum = await queryPolymorphicFacesGraphPolygon(
      //   transferPolymorphicFacesBeingBridgedToEthereum(newAddress)
      // );
      // const facesIdsBridgedToEthereum =
      //   facesBridgedToEthereum?.transferEntities.map((nft: any) => ({
      //     tokenId: nft.tokenId,
      //     id: parseInt(nft.id, 16),
      //     from: nft.from,
      //     to: nft.to,
      //   }));

      // // Filter the tokens that are present in both arrays
      // const filteredResults = facesIdsBridgedToEthereum.filter(
      //   ({ tokenId: id1 }: any) =>
      //     facesIdsTransferredToBridge.some(
      //       ({ tokenId: id2 }: any) => id2 === id1
      //     )
      // );

      // // Query individually every token that has been
      // // transferred from the user to the Root Tunnel
      // const facesObjects: any = [];
      // const metadataPromises: any = [];
      // for (
      //   let i = 0;
      //   i <= facesTransferredToBridge.transferEntities.length - 1;
      //   i++
      // ) {
      //   metadataPromises.push(
      //     queryPolymorphicFacesGraphPolygon(
      //       polymorphicFaceOwner(
      //         facesTransferredToBridge.transferEntities[i].tokenId
      //       )
      //     )
      //   );
      //   facesObjects.push(facesTransferredToBridge.transferEntities[i]);
      // }
      // const promises: any = await Promise.all(metadataPromises);

      // // Make a new array containing the tokens that
      // // have been trasferred to the Root Tunnel,
      // // but have never been minted on Polygon yet
      // const facesBeingBridgedFirstTime: any = [];
      // for (let i = 0; i <= promises.length - 1; i++) {
      //   if (promises[i].transferEntities.length === 0) {
      //     facesBeingBridgedFirstTime.push({
      //       id: Number(facesObjects[i].id),
      //       tokenId: facesObjects[i].tokenId,
      //       from: facesObjects[i].from,
      //       to: facesObjects[i].to,
      //     });
      //   }
      // }

      // // =========================================================//
      // // HANDLE CASES WHERE A TOKEN WAS TRANSFERRED TO ANOTHER USER
      // // ON POLYGON, THEN BRIDGED BY THE ITS NEW OWNER TO ETHEREUM
      // // =========================================================//

      // // get All entities from user to 0x00
      // const sentToNullByUser = await queryPolymorphicFacesGraphPolygon(
      //   transferPolymorphicFacesSentToNullByUser(newAddress)
      // );
      // const idsSentToNullByUser = sentToNullByUser?.transferEntities.map(
      //   (nft: any) => ({
      //     tokenId: nft.tokenId,
      //     id: parseInt(nft.id, 16),
      //     from: nft.from,
      //     to: nft.to,
      //   })
      // );
      // // get all entities   from: $bridge ----> to: $user   AND   from: $user ----> to: $bridge

      // const bridgeToUserEntities = await queryPolymorphicFacesGraph(
      //   transferPolymorphicFacesSentToUserByBridge(newAddress)
      // );
      // const idsBridgeToUserEntities =
      //   bridgeToUserEntities?.transferEntities.map((nft: any) => ({
      //     tokenId: nft.tokenId,
      //     id: parseInt(nft.id, 16),
      //     from: nft.from,
      //     to: nft.to,
      //   }));
      // const bridgeToUserAndViceVersaEntities =
      //   facesIdsTransferredToBridge.concat(idsBridgeToUserEntities);

      // // if there is an entity that was sent to 0x00, but not from user to bridge AND not from bridge to user,
      // // then the user must have bought it on polygon and transferred it to eth
      // const tradedOnPolygonAndSentToEth = idsSentToNullByUser.filter(
      //   ({ tokenId: id1 }: any) =>
      //     !bridgeToUserAndViceVersaEntities.some(
      //       ({ tokenId: id2 }: any) => id2 === id1
      //     )
      // );

      // const allFacesInBridgingProgress = filteredResults
      //   .concat(facesBeingBridgedFirstTime)
      //   .concat(tradedOnPolygonAndSentToEth);

      // // Filter out the tokens not sent
      // // in pending status by the user
      // const filteredFacesInBridgingProgress = allFacesInBridgingProgress.filter(
      //   (faces: any) => faces.from === newAddress
      // );

      // // =========================================================//
      // // HANDLE CASES WHERE A TOKEN WAS TRANSFERRED TO A NEW OWNER
      // // ON ETHEREUM, AFTER BRIDGED BACK TO ETHEREUM BY OLD OWNER
      // // =========================================================//

      // // Get all ethereum entities of tokens that were
      // // sent to ethereum and then traded
      // let metadataPromises2: any = [];
      // for (let i = 0; i <= tradedOnPolygonAndSentToEth.length - 1; i++) {
      //   metadataPromises2.push(
      //     queryPolymorphicFacesGraph(
      //       polymorphicFaceOwner(tradedOnPolygonAndSentToEth[i].tokenId)
      //     )
      //   );
      // }
      // const promises2: any = await Promise.all(metadataPromises2);
      // // console.log("promise2", promises2);

      // let filteredResults2: any = [];
      // for (let i = 0; i <= promises.length - 1; i++) {
      //   promises2[i]?.transferEntities.map((face: any) => {
      //     if (
      //       face.to !==
      //         process.env.REACT_APP_POLYMORPHIC_FACES_ROOT_TUNNEL_ADDRESS?.toLowerCase() &&
      //       face.to !== newAddress
      //     ) {
      //       filteredResults2.push({
      //         id: Number(face.tokenId),
      //         tokenId: face.tokenId,
      //         from: face.from,
      //         to: face.to,
      //       });
      //     } else {
      //       return {};
      //     }
      //   });
      // }

      // // Filter out the tokens that were first bridged back from Polygon to Ethereum
      // // and then transferred toa new owner on Ethereum
      // const allUserFacesInBridgingProgress =
      //   filteredFacesInBridgingProgress.filter(
      //     ({ tokenId: id1 }: any) =>
      //       !filteredResults2?.some(({ tokenId: id2 }: any) => id2 === id1)
      //   );

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
        userFacesBeingBridged:
          facesPendingToPolygon.concat(facesPendingToEth) || [],
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
