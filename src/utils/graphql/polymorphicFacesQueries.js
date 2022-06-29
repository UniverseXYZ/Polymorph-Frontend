import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { request, gql as gql2 } from 'graphql-request';

export const morphedPolymorphicFaces = `
  query Polymorphs {
    tokenMorphedEntities(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      newGene
      oldGene
      tokenId
      eventType
      price
    }
  }
`;

export const claimedPolymorphicFaces = `
  query Polymorphs {
    burnCount(id: 1) {
      id
      count
    }
  }
`;

export const transferPolymorphicFaces = (ownerAddress) => `
  query Polymorphs {
    transferEntities(first: 1000, where: { to: "${ownerAddress}" }) {
      from
      id
      to
      tokenId
    }
  }
`;

export const polymorphicFaceOwner = (tokenId) => `
  query Polymorphs {
    transferEntities(where: { tokenId: "${tokenId}" }) {
      to
    }
    tokenMorphedEntities(where: {tokenId: ${tokenId}, eventType_not: 2}, orderBy: timestamp, orderDirection: asc) {
      priceForGenomeChange
      newGene
      tokenId
      oldGene
      timestamp
      price
    }
  }
`;

export const polymorphicFacesScrambleHistory = (tokenId) => `
  query Polymorphs {
    tokenMorphedEntities(where: {tokenId: ${tokenId}, eventType_not: 2}, orderBy: timestamp, orderDirection: asc) {
      tokenId
      oldGene
      newGene
      timestamp
      price
    }
  }
`;

export const traitRarity = (searchedId) => `
  query Polymorphs {
    traits(where: {id: ${searchedId}}) {
      id
      rarity
    }
  }
`;

export const queryPolymorphicFacesGraph = async (graphQuery) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_POLYMORPHS_GRAPH_URL,
    cache: new InMemoryCache(),
  });

  const graphData = await client.query({
    query: gql`
      ${graphQuery}
    `,
  });

  return graphData?.data;
};