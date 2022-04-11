import React, { useContext, useState } from 'react';
import { useMyNftsStore } from 'src/stores/myNftsStore';
import AppContext from '../../ContextAPI';
// import NFTCard from '../nft/NFTCard';
import LoadMore from '../pagination/LoadMore';

const LikedNFTs = () => {
  const myNFTs = useMyNftsStore(s => s.myNFTs);
  const [quantity, setQuantity] = useState(8);

  return (
    <div className="tab__wallet">
      <div className="nfts__lists">
        {myNFTs
          .filter((nft) => nft.likers.length && !nft.hidden)
          .map((nft, index) => index < quantity && <NFTCard key={nft.id} nft={nft} />)}
      </div>
      {myNFTs.filter((nft) => nft.likers.length && !nft.hidden).length > quantity && (
        <LoadMore quantity={quantity} setQuantity={setQuantity} perPage={8} />
      )}
    </div>
  );
};

export default LikedNFTs;
