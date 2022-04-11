import React, { useEffect, useContext, useState } from 'react';
import { useMyNftsStore } from 'src/stores/myNftsStore';
import AppContext from '../../ContextAPI';
// import NFTCard from '../nft/NFTCard';
import LoadMore from '../pagination/LoadMore';

const HiddenNFTs = () => {
  const { myNFTs, setMyNFTsSelectedTabIndex } = useMyNftsStore(s => ({myNFTs: s.myNFTs, setMyNFTsSelectedTabIndex: s.setMyNFTsSelectedTabIndex}));
  const [quantity, setQuantity] = useState(8);

  useEffect(() => {
    if (!myNFTs.filter((nft) => nft.hidden).length) {
      setMyNFTsSelectedTabIndex(0);
    }
  }, [myNFTs]);

  return (
    <div className="tab__wallet">
      <div className="nfts__lists">
        {myNFTs
          .filter((nft) => nft.hidden)
          .map((nft, index) => index < quantity && <NFTCard key={nft.id} nft={nft} />)}
      </div>
      {myNFTs.filter((nft) => nft.hidden).length > quantity && (
        <LoadMore quantity={quantity} setQuantity={setQuantity} perPage={8} />
      )}
    </div>
  );
};

export default HiddenNFTs;
