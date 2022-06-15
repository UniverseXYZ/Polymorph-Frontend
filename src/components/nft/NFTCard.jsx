/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
// import './NFTCard.scss';
// import { Link, useHistory, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router'
import { Link } from 'next/link'
import PropTypes from 'prop-types';
import videoIcon from '../../assets/images/marketplace/video-icon.svg';
import audioIcon from '../../assets/images/marketplace/audio-icon.svg';
import mp3Icon from '../../assets/images/mp3-icon.png';
import { useAuthStore } from '../../stores/authStore'
import LoadingImage from '../general/LoadingImage';
import clockIcon from '../../assets/images/marketplace/green-clock.svg';
import checkIcon from '../../assets/images/check-black.svg';
import NFTCardHeader from './NFTCardHeader';
// import PendingPrevArrow from '../myNFTs/pendingDropdown/misc/PendingPrevArrow';
// import PendingNextArrow from '../myNFTs/pendingDropdown/misc/PendingNextArrow';
import NftEditions from './NftEditions';
// import SVGImageLoader from '../marketplaceNFT/InlineSVG';
// import BrokenNFT from '../marketplaceNFT/BrokenNFT';

const NFTCard = React.memo(
  ({ nft, canSelect, collectionAddress, selectedNFTsIds, setSelectedNFTsIds }) => {
    const { loggedInArtist } = useAuthStore();
    const router = useRouter();
    // const location = useLocation();
    const [searchValue, setSearchValue] = useState('');

    const { creator } = nft;
    // const owner = location.pathname === '/my-nfts' ? loggedInArtist : nft.owner;

    // const sliderSettings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   nextArrow: <PendingPrevArrow />,
    //   prevArrow: <PendingNextArrow />,
    // };

    // const handleSelectNFT = (id) => {
    //   if (selectedNFTsIds.includes(id)) {
    //     const findById = selectedNFTsIds.filter((i) => i !== id);
    //     setSelectedNFTsIds([...findById]);
    //   } else {
    //     setSelectedNFTsIds([...selectedNFTsIds, id]);
    //   }
    // };

    const showNftImage = () => {
      if (!nft.metadata?.image) {
        // return <BrokenNFT />;
      }

      // if (nft.metadata?.image.endsWith('.svg')) {
        // return <SVGImageLoader svgUrl={nft.metadata?.image} />;
      // }

      return (
        <LoadingImage
          className="nft--image"
          alt={nft.metadata?.name}
          src={nft.metadata?.image}
          showSpinner
        />
      );
    };

    return (
      <div
        className={`nft--card${canSelect ? ' can--select' : ''}${
          selectedNFTsIds && selectedNFTsIds.includes(nft.id) ? ' selected' : ''
        }`}
      >
        <NFTCardHeader nft={nft} creator={creator} collection={nft.collection} />
        <div className="nft--card--body" aria-hidden="true">
          {nft.artworkType !== 'bundles' ? (
            <Link
              href={`/nft/${nft.contractAddress}/${nft.tokenId}`}
              to={`/nft/${nft.contractAddress}/${nft.tokenId}`}
            >
              {nft.artworkType !== 'audio/mpeg' && nft.artworkType !== 'mp4' && showNftImage()}
              {nft.artworkType === 'mp4' && (
                <video
                  onMouseOver={(event) => event.target.play()}
                  onFocus={(event) => event.target.play()}
                  onMouseOut={(event) => event.target.pause()}
                  onBlur={(event) => event.target.pause()}
                  muted
                >
                  <source src={nft.thumbnail_url} type="video/mp4" />
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              )}
              {nft.artworkType === 'audio/mpeg' && (
                <img className="nft--image" src={mp3Icon} alt={nft.name} />
              )}
              {/* {nft.artworkType === 'video/mp4' && (
                    <div className="video--icon">
                      <img src={videoIcon} alt="Video Icon" />
                    </div>
                  )} */}
              {nft.artworkType === 'audio/mpeg' && (
                <div className="video--icon">
                  <img src={audioIcon} alt="Video Icon" />
                </div>
              )}
              {nft.state === 'On Auction' && (
                <div className="nft--time--left">
                  <p>
                    <img src={clockIcon} alt="Clock" /> 20m : 30s left
                  </p>
                </div>
              )}
            </Link>
          ) : (
            <>
              {/* TODO:: comment out the slider, its going to be needed for the Marketplace only */}
              {/* <Slider {...sliderSettings}> */}
              {/* {nft.tokenIds &&
                  nft.tokenIds.map(
                    (item, index) =>
                      index < 7 && (
                        <div
                          className="slider--box"
                          onClick={() =>
                            !canSelect
                              ?router.push(`/nft/${nft.collection?.address || collectionAddress}/${nft.tokenId}`, { nft })
                              : handleSelectNFT(nft.id)
                          }
                          aria-hidden="true"
                          key={uuid()}
                        >
                          {nft.artworkType &&
                            !nft.artworkType.endsWith('mpeg') &&
                            !nft.artworkType.endsWith('mp4') && (
                              <img className="nft--image" src={nft.thumbnail_url} alt={nft.name} />
                            )}
                          {nft.artworkType && nft.artworkType.endsWith('mp4') && (
                            <video
                              onMouseOver={(event) => event.target.play()}
                              onFocus={(event) => event.target.play()}
                              onMouseOut={(event) => event.target.pause()}
                              onBlur={(event) => event.target.pause()}
                              muted
                            >
                              <source src={nft.thumbnail_url} type="video/mp4" />
                              <track kind="captions" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {nft.artworkType && nft.artworkType.endsWith('mpeg') && (
                            <img className="nft--image" src={mp3Icon} alt={nft.name} />
                          )}
                        </div>
                      )
                  )} */}
              {/* Colelction View NFTs  TODO:: The code below should be commented when we realse Marketplace and uncomment the upper one */}
              {nft.tokenIds && (
                <div
                  className="slider--box"
                  onClick={() =>
                    router.push(
                      `/nft/${nft.collection?.address || collectionAddress}/${nft.tokenId}`,
                      { nft }
                    )
                  }
                  aria-hidden="true"
                  key={nft.id}
                >
                  {!nft.artworkType.endsWith('mpeg') &&
                    !nft.artworkType.endsWith('mp4') &&
                    showNftImage()}
                  {nft.artworkType && nft.artworkType.endsWith('mp4') && (
                    <video
                      onMouseOver={(event) => event.target.play()}
                      onFocus={(event) => event.target.play()}
                      onMouseOut={(event) => event.target.pause()}
                      onBlur={(event) => event.target.pause()}
                      muted
                    >
                      <source src={nft.thumbnail_url} type="video/mp4" />
                      <track kind="captions" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {nft.artworkType && nft.artworkType.endsWith('mpeg') && (
                    <img className="nft--image" src={mp3Icon} alt={nft.name} />
                  )}
                </div>
              )}
              {/* </Slider> */}
            </>
          )}
        </div>
        <div className="nft--card--footer">
          <div className="name--and--price">
            <h4>{nft.metadata?.name}</h4>
            {/* <div className="price--div">
            <img src={priceIcon} alt="Price" />
            <span>0.5</span>
          </div> */}
          </div>
          <div className="quantity--and--offer">
            {/* // TODO:: we need a property from the BE about the total editions count */}
            {/* <NftEditions
              push={router.push}
              searchValue={searchValue}
              nft={nft}
              setSearchValue={setSearchValue}
              collectionAddress={collectionAddress}
            /> */}
            {/* <div className="price--offer--div">
            <label>Offer for</label>
            <img src={priceIcon} alt="Price" />
            <span>0.35</span>
          </div> */}
          </div>
        </div>
        {selectedNFTsIds && selectedNFTsIds.includes(nft.id) && (
          <div className="nft--selected">
            <img src={checkIcon} alt="img" />
          </div>
        )}
      </div>
    );
  }
);

NFTCard.propTypes = {
  nft: PropTypes.oneOfType([PropTypes.object]).isRequired,
  canSelect: PropTypes.bool,
  collectionAddress: PropTypes.string,
  selectedNFTsIds: PropTypes.oneOfType([PropTypes.array]),
  setSelectedNFTsIds: PropTypes.func,
};

NFTCard.defaultProps = {
  canSelect: false,
  collectionAddress: '',
  selectedNFTsIds: [],
  setSelectedNFTsIds: () => {},
};

export default NFTCard;
