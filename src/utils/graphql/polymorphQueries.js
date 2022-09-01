import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { request, gql as gql2 } from 'graphql-request';

export const morphedPolymorphs = `
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

export const singleMorphedPolymorph = (tokenId) => `
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

export const burnedPolymorphs = `
  query Polymorphs {
    burnCount(id: 1) {
      id
      count
    }
  }
`;

export const transferPolymorphs = (ownerAddress) => `
  query Polymorphs {
    transferEntities(first: 1000, where: { to: "${ownerAddress}" }) {
      from
      id
      to
      tokenId
    }
  }
`;

export const transferPolymorphsFromUser = (ownerAddress) => `
  query Polymorphs {
    transferEntities(first: 1000, where: { from: "${ownerAddress}" }) {
      from
      id
      to
      tokenId
    }
  }
`;

export const polymorphOwner = (tokenId) => `
  query Polymorphs {
    transferEntities(where: { tokenId: "${tokenId}" }) {
      to
    }
  }
`;

export const polymorphScrambleHistory = (tokenId) => `
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

export const mintedV2Polymorphs = (ownerAddress) => `
  query Polymorphs {
    mintedEntities(first: 1000, where: { to: "${ownerAddress}" }) {
      id
      tokenId
      to
    }
  }
`;

export const queryPolymorphsGraph = async (graphQuery) => {
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

export const queryPolymorphsGraphV2 = async (graphQuery) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_POLYMORPHS_GRAPH_V2_URL,
    cache: new InMemoryCache(),
  });

  const graphData = await client.query({
    query: gql`
      ${graphQuery}
    `,
  });

  return graphData?.data;
};

export const queryPolymorphsGraphV2Polygon = async (graphQuery) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_POLYMORPHS_GRAPH_V2_POLYGON_URL,
    cache: new InMemoryCache(),
  });
  const graphData = await client.query({
    query: gql`
      ${graphQuery}
    `,
  });

  return graphData?.data;
};


export const queryPolymorphsGraph2 = async (graphQuery) => {
  return await request(
    process.env.REACT_APP_POLYMORPHS_GRAPH_URL,
    gql2`${graphQuery}`
  );
}
