import { utils } from 'ethers';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ItemsPerPageDropdown from '../pagination/ItemsPerPageDropdown.jsx';
// import '../pagination/Pagination.scss';
// import '../marketplace/browseNFT/NFTsList.scss';
import NFTCard from '../nft/NFTCard';
import NftCardSkeleton from '../skeletons/nftCardSkeleton/NftCardSkeleton';
import { CollectionPageLoader } from '../../containers/collection/CollectionPageLoader.jsx';
import NoNftsFound from './NoNftsFound.jsx';
import { useErrorContext } from '../../contexts/ErrorContext';
import { getNftsPerAddress } from '../../utils/api/marketplace.ts';
import { useAuthStore } from '../../stores/authStore.js';
import LoadMore from '../pagination/LoadMore';

const PER_PAGE = 12;

const Wallet = React.memo(() => {
  const [page, setPage] = useState(1);

  const [shownNFTs, setShownNFTs] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const { address } = useAuthStore();
  const { setShowError, setErrorTitle, setErrorBody } = useErrorContext();

  const getMyNfts = async () => {
    if (address) {
      setShowSpinner(true);
      try {
        const response = await getNftsPerAddress(utils.getAddress(address), page, PER_PAGE);
        if (response.error) {
          const { error, message } = response;
          setErrorTitle(error);
          setErrorBody(message);
          setShowError(true);
          return;
        }
        setShowSkeleton(false);

        if (response.data) {
          const shownNFTsClone = [...shownNFTs, ...response.data];
          setShownNFTs(shownNFTsClone);
          // we need to add 2 to the page received from the response since for each page that is passed as a query param you get back the param - 1
          setPage(response.page + 2);
          setShowSpinner(false);
          setShowLoadMore(response.total > shownNFTsClone.length);
        } else {
          setShowLoadMore(false);
          setShowSpinner(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(async () => {
    getMyNfts();
  }, [address]);

  let loadMoreButton = null;

  if (showLoadMore) {
    loadMoreButton = <LoadMore page={page} loadMore={getMyNfts} pageAndSize />;
  }

  return (
    <div className="tab__wallet">
      {showSkeleton ? (
        <div className="nfts__lists">
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
          <NftCardSkeleton />
        </div>
      ) : shownNFTs && shownNFTs.length ? (
        <>
          {shownNFTs && shownNFTs.length ? (
            <>
              <div className="nfts__lists">
                {shownNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
              {showSpinner ? <CollectionPageLoader /> : loadMoreButton}
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <NoNftsFound />
      )}
    </div>
  );
});

export default Wallet;
