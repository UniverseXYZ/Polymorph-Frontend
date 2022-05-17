import React, { useEffect, useState } from 'react';
// import './PolymorphUniverse.scss';
import BurnToMint from '../polymorphs/BurnToMint';
import WhatsNewSection from '../polymorphs/WhatsNewSection';

import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { GetCollectionApi, GetNFT2Api } from '@app/modules/nft/api';
import { collectionKeys, nftKeys } from '@app/utils/query-keys';
import Contracts from "../../contracts/contracts.json";
import { ethers } from "ethers";
import { useContractsStore } from "src/stores/contractsStore";


export const PolymorphUniverse = ({} : any) => {
  const [burntCount, setBurntCount] = useState(0);
  const { polymorphContractV2 } = useContractsStore();

  useEffect(() => {
    let contract = polymorphContractV2;
    if(!contract) {
      const network = process.env.REACT_APP_NETWORK_CHAIN_ID 
        ? parseInt(process.env.REACT_APP_NETWORK_CHAIN_ID)
        : 4
  
      const { contracts: contractsData } = (Contracts as any)[network];
      contract = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS as any,
        contractsData.PolymorphRoot?.abi,
        ethers.getDefaultProvider(network)
      );
    }
    contract
      .totalBurnedV1()
      .then((burned: any) => {
        setBurntCount(burned.toString())
      })
  }, [polymorphContractV2])


  return (
    <div className="polymorph--universe--general--page">
      <BurnToMint burntCount={burntCount}/>
      <WhatsNewSection />
    </div>
  )
};


// TO DO:
// Re-write this when we have an instance 
// of the V2 contract live on test net.
export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  const collectionAddress = '0x1cBB182322Aee8ce9F4F1f98d7460173ee30Af1F'
  const tokenId = '123';
  await queryClient.prefetchQuery(nftKeys.nftInfo({collectionAddress, tokenId}), async () => {
    const result = await GetNFT2Api(collectionAddress, tokenId, false);
    // Dehydration will fail if there's a Date or undefined value in the NFT model
    // This will strip any invalid values
    return JSON.parse(JSON.stringify(result));
  });

  await queryClient.prefetchQuery(collectionKeys.centralizedInfo(collectionAddress), async () => {
    const result = await GetCollectionApi(collectionAddress);
    return JSON.parse(JSON.stringify(result));
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60
  };
}
