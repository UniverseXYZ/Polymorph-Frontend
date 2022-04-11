/* eslint-disable prefer-const */
/* eslint-disable no-debugger */
/* eslint-disable no-useless-return */
const GET_SAVED_NFTS_URL = `${process.env.REACT_APP_API_BASE_URL}/api/saved-nfts`;
const GET_MY_MINTED_NFTS_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-nfts`;
const GET_MY_MINTING_NFTS_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-nfts/pending`;
const GET_MY_MINTING_NFTS_COUNT_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-nfts/pending/count`;
const GENERATE_TOKEN_URI_URL = `${process.env.REACT_APP_API_BASE_URL}/api/nfts/token-uri`;
const CREATE_COLLECTION_URL = `${process.env.REACT_APP_API_BASE_URL}/api/nfts/minting-collections`;
const GET_MY_MINTED_COLLECTIONS = `${process.env.REACT_APP_API_BASE_URL}/api/nfts/collections/my-collections`;
const GET_USER_COLLECTIONS = (address) =>
  `${process.env.REACT_APP_API_BASE_URL}/api/nfts/collections/${address}`;
const GET_MY_MINTING_COLLECTIONS = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-collections/pending`;
const GET_MY_MINTING_COLLECTIONS_COUNT = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-collections/pending/count`;
const GET_NFT_INFO = `${process.env.REACT_APP_API_BASE_URL}/api/pages/nft`;
const GET_NFT_SUMMARY = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-nfts/summary`;

const GET_USER_NFTS_URL = (username) =>
  `${process.env.REACT_APP_API_BASE_URL}/api/pages/user-profile/${username}/nfts`;

/**
 * @returns {array} with saved NFTs
 */
export const getSavedNfts = async () => {
  const request = await fetch(GET_SAVED_NFTS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to GET saved NFTS info: ${request.statusText}`);
  }
  const result = await request.text().then((data) => JSON.parse(data));
  return result;
};

/**
 * @returns {array} with my NFTs
 */
export const getMyNfts = async () => {
  const request = await fetch(GET_MY_MINTED_NFTS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to GET saved NFTS info: ${request.statusText}`);
  }
  const result = await request.text().then((data) => JSON.parse(data));

  return result.nfts;
};

export const getMyMintingNfts = async () => {
  const request = await fetch(GET_MY_MINTING_NFTS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to GET saved NFTS info: ${request.statusText}`);
  }
  const result = await request.text().then((data) => JSON.parse(data));

  return result;
};

export const getMyMintingNftsCount = async () => {
  const request = await fetch(GET_MY_MINTING_NFTS_COUNT_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to GET saved NFTS info: ${request.statusText}`);
  }
  const result = await request.text().then((data) => JSON.parse(data));

  return result.count;
};

/**
 * @param {string} id NFT id
 * @returns
 */
export const getMetaForSavedNft = async (id) => {
  const GET_SAVED_NFTS_TOKEN_URI_URL = `${process.env.REACT_APP_API_BASE_URL}/api/saved-nfts/${id}/token-uri`;

  const request = await fetch(GET_SAVED_NFTS_TOKEN_URI_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to GET meta for saved NFT: ${request.statusText}`);
  }
  const result = await request.text().then((data) => JSON.parse(data));
  return result;
};

/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {string} data.editions
 * @param {array} data.propertiesParsed
 * @param {string} data.percentAmount
 * @param {string} data.id
 * @returns
 */
export const updateSavedForLaterNft = async (data) => {
  const UPDATE_SAVED_FOR_LATER_NFT_URL = `${process.env.REACT_APP_API_BASE_URL}/api/saved-nfts/${data.id}`;

  // Construct it in order to match the expected object keys at the BE
  const requestData = {
    name: data.name,
    numberOfEditions: parseInt(data.editions, 10),
  };

  if (data.description) {
    requestData.description = data.description;
  }
  if (data.propertiesParsed.length) {
    requestData.properties = data.propertiesParsed;
  }
  if (data.royaltiesParsed.length) {
    requestData.royalties = data.royaltiesParsed;
  }
  if (data.collectionId) {
    requestData.collectionId = data.collectionId;
  }

  const request = await fetch(UPDATE_SAVED_FOR_LATER_NFT_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
    body: JSON.stringify({
      ...requestData,
    }),
  });

  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to save NFT data: ${request.statusText}`);
  }

  const result = await request.text().then((res) => JSON.parse(res));
  return result;
};

/**
 * @param {Object} data
 * @param {file} data.file
 * @param {string} data.name
 * @param {string} data.description
 * @param {string} data.editions
 * @param {array} data.propertiesParsed
 * @param {array} data.royaltiesParsed
 * @param {number} collectionId
 * @returns
 */
export const getTokenURI = async ({
  file,
  name,
  description,
  editions,
  propertiesParsed,
  royaltiesParsed,
  collectionId,
}) => {
  const formData = new FormData();
  const noProperties = propertiesParsed?.length;
  const noRoyalties = royaltiesParsed?.length;

  formData.append('file', file, file.name);
  formData.append('name', name);
  formData.append('numberOfEditions', parseInt(editions, 10));
  formData.append('collectionId', collectionId);
  if (description) formData.append('description', description);
  if (noProperties) formData.append('properties', JSON.stringify(propertiesParsed));
  if (noRoyalties) formData.append('royalties', JSON.stringify(royaltiesParsed));

  const request = await fetch(GENERATE_TOKEN_URI_URL, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
    body: formData,
  });

  const result = await request.text().then((res) => JSON.parse(res));

  return result;
};

export const saveCollection = async (data) => {
  const {
    file,
    name,
    symbol,
    description,
    siteLink,
    discordLink,
    instagramLink,
    mediumLink,
    telegramLink,
  } = data;

  const formData = new FormData();
  if (file) formData.append('file', file, file.name);
  formData.append('name', name);
  formData.append('symbol', symbol);
  if (description) {
    formData.append('description', description);
  }
  if (siteLink) {
    formData.append('siteLink', siteLink);
  }
  if (discordLink) {
    formData.append('discordLink', discordLink);
  }
  if (instagramLink) {
    formData.append('instagramLink', instagramLink);
  }
  if (mediumLink) {
    formData.append('mediumLink', mediumLink);
  }
  if (telegramLink) {
    formData.append('telegramLink', telegramLink);
  }

  const requestUrl = CREATE_COLLECTION_URL;
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
    body: formData,
  };

  const request = await fetch(requestUrl, requestOptions);
  if (!request.ok && request.status !== 201) {
    console.error(`Error while trying to save a new collection: ${request.statusText}`);
  }

  const result = await request.text().then((res) => JSON.parse(res));
  return result;
};

export const attachTxHashToCollection = (txHash, collectionId) => {
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
    body: JSON.stringify({
      txHash,
    }),
  };

  return fetch(`${CREATE_COLLECTION_URL}/${collectionId}`, requestOptions);
};

export const getMyMintedCollections = async () => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  };
  const url = `${GET_MY_MINTED_COLLECTIONS}?mintable=false`;
  const request = await fetch(url, requestOptions);
  const result = await request.text().then((res) => JSON.parse(res));

  return result;
};

export const getUserCollections = async (address) => {
  const requestOptions = {
    method: 'GET',
  };
  const url = GET_USER_COLLECTIONS(address);
  const request = await fetch(url, requestOptions);
  const result = await request.text().then((res) => JSON.parse(res));

  return result;
};

export const getMyMintingCollections = async () => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  };

  const request = await fetch(GET_MY_MINTING_COLLECTIONS, requestOptions);
  const result = await request.text().then((res) => JSON.parse(res));

  return result;
};

export const getMyMintingCollectionsCount = async () => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  };

  const request = await fetch(GET_MY_MINTING_COLLECTIONS_COUNT, requestOptions);
  const result = await request.text().then((res) => JSON.parse(res));

  return result.count;
};


export const getUserNfts = async (username) => {
  const URL = GET_USER_NFTS_URL(username);

  const request = await fetch(URL);

  const result = await request.text().then((data) => JSON.parse(data));

  return result;
};

export const getNftData = async (collectionAddress, tokenId) => {
  const URL = `${GET_NFT_INFO}/${collectionAddress}/${tokenId}`;

  const request = await fetch(URL);

  const result = await request.text().then((data) => JSON.parse(data));
  return result;
};


export const getNftSummary = async () => {
  const request = await fetch(GET_NFT_SUMMARY, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  const result = await request.text().then((data) => JSON.parse(data));
  return result;
};

export const getMyCollections = async (offset, limit) => {
  const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/pages/my-nfts/collections?offset=${offset}&limit=${limit}`;

  const request = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
    },
  });

  const result = await request.text().then((data) => JSON.parse(data));
  return result;
};
