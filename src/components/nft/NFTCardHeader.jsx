import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

import { useHistory } from 'react-router';
import Popup from 'reactjs-popup';
import countIcon from '../../assets/images/slidecounts.svg';
import priceIcon from '../../assets/images/marketplace/eth-icon.svg';

import sellNFTIcon from '../../assets/images/sell-nft.svg';
import transferNFTIcon from '../../assets/images/transfer-nft.svg';
import shareNFTIcon from '../../assets/images/share-nft.svg';
import hideNFTIcon from '../../assets/images/hide-nft.svg';
import unhideNFTIcon from '../../assets/images/unhide-nft.svg';
import burnNFTIcon from '../../assets/images/burn-nft.svg';
import universeIcon from '../../assets/images/universe-img.svg';
import { getCollectionBackgroundColor } from '../../utils/helpers';
import { useMyNftsStore } from '../../stores/myNftsStore'
import { useAuthStore } from '../../stores/authStore';
import { shortenEthereumAddress } from '../../utils/helpers/format';

const NFTCardHeader = ({ nft, creator, owner, collection }) => {
  const history = useHistory();
  const { myNFTs, setMyNFTs } = useMyNftsStore();
  const { address } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownID, setDropdownID] = useState(0);
  const ref = useRef();
  const [showTransferNFTPopup, setShowTransferNFTPopup] = useState(false);

  const hideNFT = (id) => {
    setMyNFTs(myNFTs.map((item) => (item.id === id ? { ...item, hidden: true } : item)));
  };

  const unhideNFT = (id) => {
    setMyNFTs(myNFTs.map((item) => (item.id === id ? { ...item, hidden: false } : item)));
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const handleLikeClick = (id) => {
    const newNFTs = [...myNFTs];
    newNFTs.forEach((item) => {
      if (item.id === id) {
        if (!item.likers.length) {
          item.likers.push({
            id: loggedInArtist.id,
            name: loggedInArtist.name || 'John Doe',
            avatar: loggedInArtist.avatar || likerTestImage,
          });
        } else {
          const alreadyLiked = item.likers.some((i) => i.id === loggedInArtist.id);
          if (!alreadyLiked) {
            item.likers.push({
              id: loggedInArtist.id,
              name: loggedInArtist.name || 'John Doe',
              avatar: loggedInArtist.avatar || likerTestImage,
            });
          } else {
            item.likers = item.likers.filter((i) => i.id !== loggedInArtist.id);
          }
        }
      }
    });

    setMyNFTs(newNFTs);
  };
  return (
    <div className="nft--card--header">
      <div className="three--images">
        {!creator ? (
          <></>
        ) : creator &&
          (creator.avatar || (creator.profileImageUrl && creator.profileImageUrl.length > 48)) ? (
          <>
            <div
              className="creator--details"
              onClick={() => history.push(`/${creator.universePageUrl}`)}
              aria-hidden
            >
              <img src={creator.profileImageUrl} alt={creator.displayName} />
              <span className="tooltiptext">{`Creator: ${creator.displayName}`}</span>
            </div>
          </>
        ) : (
          <div
            className="creator--details"
            onClick={() => history.push(`/${creator?.address}`)}
            aria-hidden
          >
            <Blockies className="blockie--details" seed={creator?.address} size={9} scale={3} />
            <span className="tooltiptext">{`Creator: ${creator?.address}`}</span>
          </div>
        )}
        {collection && (
          <div
            className="collection--details"
            onClick={() => history.push(`/collection/${collection.address}`)}
            aria-hidden
          >
            {collection.address === process.env.REACT_APP_UNIVERSE_ERC_721_ADDRESS.toLowerCase() ? (
              <img src={universeIcon} alt={collection.name} />
            ) : !collection.coverUrl ? (
              <div
                className="random--bg--color"
                style={{ backgroundColor: getCollectionBackgroundColor(collection) }}
              >
                {collection.name.charAt(0)}
              </div>
            ) : (
              <img src={collection.coverUrl} alt={collection.name} />
            )}
            <span className="tooltiptext">{`Collection: ${
              collection.name || shortenEthereumAddress(collection.address)
            }`}</span>
          </div>
        )}
        {!owner ? (
          <></>
        ) : owner.avatar || (owner.profileImageUrl && owner.profileImageUrl.length > 48) ? (
          <div
            className="owner--details"
            onClick={() => history.push(`/${owner.universePageUrl}`)}
            aria-hidden
          >
            <img
              src={owner.avatar || owner.profileImageUrl}
              alt={owner.name || owner.displayName}
            />
            <span className="tooltiptext">{`Owner: ${owner.name || owner.displayName}`}</span>
          </div>
        ) : (
          <div
            className="owner--details"
            onClick={() => history.push(`/${owner?.address || address}`)}
            aria-hidden
          >
            <Blockies
              className="blockie--details"
              seed={owner?.address || address}
              size={9}
              scale={3}
            />
            <span className="tooltiptext">{`Owner: ${owner?.address || address}`}</span>
          </div>
        )}
      </div>
      <div className="nft--card--header--right">
        {nft.type === 'bundles' ? (
          <div className="bundles--count">
            <img src={countIcon} alt="cover" />
            <span>{nft.numberOfEditions}</span>
          </div>
        ) : (
          <>
            {/* <div onClick={() => handleLikeClick(nft.id)} className="likes--count">
          <div>
            <svg
                className={
                  nft.likers.filter((liker) => liker.id === loggedInArtist.id).length
                    ? 'fill'
                    : ''
                }
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.9998 13.3996C8.15207 13.3996 8.36959 13.302 8.52911 13.2114C12.6113 10.7016 15.1998 7.78044 15.1998 4.8105C15.1998 2.34253 13.4379 0.599609 11.1611 0.599609C9.7974 0.599609 8.7372 1.30007 8.07164 2.38196C8.03914 2.4348 7.96094 2.43454 7.92872 2.38153C7.27515 1.30607 6.20174 0.599609 4.83848 0.599609C2.56174 0.599609 0.799805 2.34253 0.799805 4.8105C0.799805 7.78044 3.38832 10.7016 7.47775 13.2114C7.63002 13.302 7.84754 13.3996 7.9998 13.3996Z"
                  stroke="black"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="tooltiptext">
                <div className="likers--text">{`${nft.likers.length} people liked this`}</div>
                {nft.likers.length ? (
                  <div className="likers--avatars">
                    {nft.likers.map((liker) => (
                      <img
                        key={liker.id}
                        src={
                          typeof liker.avatar === 'string'
                            ? liker.avatar
                            : URL.createObjectURL(liker.avatar)
                        }
                        alt={liker.name}
                      />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </div>
          </div>
          <span className={nft.likers.length ? 'redlike' : 'like-count'}>
            {nft.likers.length}
          </span>
        </div> */}
          </>
        )}
        {/* {!canSelect ? ( */}
        {/* {address === nft.owner ? (
          <div
            className="nft--card--header--right--dropdown"
            aria-hidden="true"
            onClick={() => {
              setShowDropdown(!showDropdown);
              setDropdownID(nft.id);
            }}
            ref={ref}
          >
            <span />
            <span />
            <span />
            {dropdownID === nft.id && showDropdown && (
              <ul className="nft--card--header--right--dropdown--items">
                <li
                  aria-hidden="true"
                  onClick={() => history.push('/nft-marketplace/select-items', { name: nft.name })}
                >
                  <img src={sellNFTIcon} alt="Sell" />
                  <p>Sell</p>
                </li>
                <li aria-hidden="true" onClick={() => setShowTransferNFTPopup(true)}>
                  <img src={transferNFTIcon} alt="Transfer" />
                  <p>Transfer</p>
                </li>
                <li aria-hidden="true">
                  <img src={shareNFTIcon} alt="Share" />
                  <p>Share</p>
                </li>
                {nft.hidden ? (
                  <li aria-hidden="true" onClick={() => unhideNFT(nft.id)}>
                    <img src={unhideNFTIcon} alt="Hide" />
                    <p>Unhide</p>
                  </li>
                ) : (
                  <li aria-hidden="true" onClick={() => hideNFT(nft.id)}>
                    <img src={hideNFTIcon} alt="Hide" />
                    <p>Hide</p>
                  </li>
                )}
                <li className="burn" aria-hidden="true">
                  <img src={burnNFTIcon} alt="Burn" />
                  <p>Burn</p>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <></>
        )} */}
      </div>
      {/* <Popup closeOnDocumentClick={false} open={showTransferNFTPopup}>
        <TransferNFTPopup close={() => setShowTransferNFTPopup(false)} nft={nft} />
      </Popup> */}
    </div>
  );
};

NFTCardHeader.propTypes = {
  owner: PropTypes.oneOfType([PropTypes.object]).isRequired,
  creator: PropTypes.oneOfType([PropTypes.object]).isRequired,
  collection: PropTypes.oneOfType([PropTypes.object]).isRequired,
  nft: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default NFTCardHeader;
