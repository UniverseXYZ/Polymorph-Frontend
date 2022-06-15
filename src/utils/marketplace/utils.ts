// import { BigNumber, Contract } from 'ethers';
// import { fetchDAOFee, fetchRoyalties } from '../api/royaltyRegistry';

// export interface IRoyalties {
//   regitstyContract: Contract;
//   collectionRoyaltiesPercent: BigNumber;
//   nftRoyaltiesPercent: BigNumber;
//   daoFee: BigNumber;
// }
// export const getRoyaltiesFromRegistry = async (
//   collectionAddress: string,
//   tokenId: string,
//   signer: any
// ): Promise<IRoyalties> => {
//   const [regitstyContract, royalties] = await fetchRoyalties(collectionAddress, signer, tokenId);
//   const [, daoFee] = await fetchDAOFee(signer);

//   let nftRoyaltiesSum = BigNumber.from(0);
//   let collRoyaltiesSum = BigNumber.from(0);

//   if (royalties.length) {
//     const nftRoyalties = royalties[0];
//     if (nftRoyalties.length) {
//       nftRoyaltiesSum = nftRoyalties.reduce(
//         (acc: any, curr: any) => acc.add(curr[1]),
//         BigNumber.from(0)
//       );
//     }

//     const collectionRoyalties = royalties[1];
//     if (collectionRoyalties.length) {
//       collRoyaltiesSum = collectionRoyalties.reduce(
//         (acc: any, curr: any) => acc.add(curr[1]),
//         BigNumber.from(0)
//       );
//     }
//   }
//   return {
//     regitstyContract,
//     collectionRoyaltiesPercent: collRoyaltiesSum,
//     nftRoyaltiesPercent: nftRoyaltiesSum,
//     daoFee,
//   };
// };
