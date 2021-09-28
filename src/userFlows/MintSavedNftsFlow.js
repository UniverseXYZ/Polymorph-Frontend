/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
import { Contract } from 'ethers';
import { formatRoyaltiesForMinting } from '../utils/helpers/contractInteraction';
import { sendMintRequest, sendBatchMintRequest } from './api/ContractInteraction';
import { getMetaForSavedNft } from '../utils/api/mintNFT';

const FACTTORY_CONTRACT_ID = 2;
const getCurrentDay = () => parseInt(new Date().getTime() / (10000 * 60 * 60 * 24), 10);

export const getPlaceholdersLocalStorage = () =>
  JSON.parse(localStorage.getItem('nftsPlaceholders')) || [];

export const setPlaceholdersLocalStorage = (data) => {
  localStorage.setItem('nftsPlaceholders', JSON.stringify(data));
  localStorage.setItem('nftsPlaceholdersBuster', JSON.stringify(getCurrentDay()));
};

const createPlaceholders = (nfts) => {
  const currentList = getPlaceholdersLocalStorage();
  nfts?.forEach((nft) => {
    for (let i = 0; i < nft.numberOfEditions; i += 1) {
      currentList.push(
        `${nft.collectionId || FACTTORY_CONTRACT_ID}${nft?.name || ''}${nft?.description || ''}`
      );
    }
  });

  setPlaceholdersLocalStorage(currentList);
};

/**
 * @param {Object} data
 * @param {Array} data.nfts
 * @param {Object} data.helpers
 * @param data.helpers.collectionsIdAddressMapping
 * @param data.helpers.UniverseERC721Core
 * @param data.helpers.signer
 * @param data.helpers.universeERC721CoreContract
 * @param data.helpers.contracts
 */
export async function MintSavedNftsFlow({ nfts, helpers }) {
  const requiredContracts = {};

  const nftsAttachedAddress = nfts.map((nft) => ({
    ...nft,
    contractAddress: helpers.collectionsIdAddressMapping[nft.collectionId] || 0,
  }));

  // if there is no address we need to use the Universe Contract
  nfts.forEach((nft) => {
    requiredContracts[nft.collectionId || 0] = nft.contractAddress
      ? new Contract(nft.contractAddress, helpers.contracts.UniverseERC721.abi, helpers.signer)
      : helpers.universeERC721CoreContract;
  });

  const formatNfts = nfts.map((nft) => ({
    collectionId: nft.collectionId ? nft.collectionId : 0,
    royalties: nft.royalties ? formatRoyaltiesForMinting(nft.royalties) : [],
    id: nft.id,
    numberOfEditions: nft.numberOfEditions,
    name: nft.name,
    description: nft.description,
  }));

  const promises = [];

  formatNfts.forEach((nft) => promises.push(getMetaForSavedNft(nft.id)));

  const res = await Promise.all(promises);

  if (!res.length) {
    console.error('server error. cannot get meta data');
    return {};
  }

  const nftsAttachedTokenUri = formatNfts.map((nft, i) => ({
    ...nft,
    tokenUri: res[i],
  }));

  createPlaceholders(nftsAttachedTokenUri);

  const tokenURIsAndRoyaltiesObject = {};

  nftsAttachedTokenUri.forEach((nft) => {
    if (!tokenURIsAndRoyaltiesObject[nft.collectionId])
      tokenURIsAndRoyaltiesObject[nft.collectionId] = [];

    nft.tokenUri.forEach((token) => {
      tokenURIsAndRoyaltiesObject[nft.collectionId].push({
        token,
        royalties: nft.royalties,
      });
    });
  });

  const isSingle =
    nftsAttachedTokenUri.length === 1 && nftsAttachedTokenUri[0].tokenUri.length === 1;

  if (!tokenURIsAndRoyaltiesObject) return false;

  isSingle
    ? await sendMintRequest(requiredContracts, tokenURIsAndRoyaltiesObject, helpers)
    : await sendBatchMintRequest(requiredContracts, tokenURIsAndRoyaltiesObject, helpers);

  return true;
}
