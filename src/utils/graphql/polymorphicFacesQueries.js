import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { request, gql as gql2 } from 'graphql-request';
import { ZERO_ADDRESS } from '@legacy/constants';

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

export const singleMorphedPolymorphicFace = (tokenId) => `
  query Polymorphs {
    tokenMorphedEntities(first: 100, orderBy: timestamp, orderDirection: desc, where: { tokenId: "${tokenId}", eventType: ${1}}) {
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

export const transferPolymorphicFacesBeingBridgedToEthereum = (ownerAddress) => `
  query Polymorphs {
    transferEntities(first: 1000, where: { from: "${ownerAddress}", to: "${ZERO_ADDRESS}"}) {
      from
      id
      to
      tokenId
    }
  }
`;

export const transferPolymorphicFacesBeingBridgedToPolygon = (ownerAddress) => `
  query Polymorphs {
    transferEntities(first: 1000, where: { from: "${ownerAddress}", to: "${process.env.REACT_APP_POLYMORPHIC_FACES_ROOT_TUNNEL_ADDRESS}"}) {
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
      tokenId
      to
      from
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

export const mintedPolymorphicFaces = (ownerAddress) => `
  query Polymorphs {
    mintedEntities(first: 1000, where: { to: "${ownerAddress}" }) {
      id
      tokenId
      to
    }
  }
`;

export const queryPolymorphicFacesGraph = async (graphQuery) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_POLYMORPHIC_FACES_GRAPH_URL,
    cache: new InMemoryCache(),
  });

  const graphData = await client.query({
    query: gql`
      ${graphQuery}
    `,
  });

  return graphData?.data;
};

export const queryPolymorphicFacesGraphPolygon = async (graphQuery) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_POLYMORPHIC_FACES_GRAPH_POLYGON_URL,
    cache: new InMemoryCache(),
  });

  const graphData = await client.query({
    query: gql`
      ${graphQuery}
    `,
  });

  return graphData?.data;
};