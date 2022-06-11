import { Contract } from 'ethers';
import RoyaltyRegistryContract from '../../abis/RoyaltyRegistry.json'
import MarketplaceContract from '../../abis/Marketplace.json'

export const fetchRoyalties = async (collectionAddress, signer, tokenId = '0') => {
  const contract = new Contract(
    process.env.REACT_APP_ROYALTY_REGISTRY_CONTRACT,
    RoyaltyRegistryContract.abi,
    signer
  );
  let royalties = [];
  try {
    royalties = await contract.callStatic.getRoyalties(collectionAddress, tokenId);
  } catch (err) {
    console.error(err);
  }

  return [contract, royalties];
};

export const fetchDAOFee = async (signer) => {
  const contract = new Contract(
    process.env.REACT_APP_MARKETPLACE_CONTRACT,
    MarketplaceContract.abi,
    signer
  );

  const daoFee = await contract.daoFee();

  return [contract, daoFee];
};
