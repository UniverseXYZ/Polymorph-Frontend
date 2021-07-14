import React, { useState, useRef, useEffect, useContext } from 'react';
import uuid from 'react-uuid';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import share from '../../assets/images/share.svg';
import pauseIcon from '../../assets/images/pause.svg';
import playIcon from '../../assets/images/play.svg';
import soundOnIcon from '../../assets/images/sound-on.svg';
import soundOffIcon from '../../assets/images/sound-off.svg';
import miniplayerIcon from '../../assets/images/miniplayer.svg';
import fullScreenIcon from '../../assets/images/full-screen.svg';
import fullScreenOffIcon from '../../assets/images/full-screen-off.svg';
import Properties from '../marketplaceTabComponents/Properties';
import Owners from '../marketplaceTabComponents/Owners';
import Bids from '../marketplaceTabComponents/Bids';
import TradingHistory from '../marketplaceTabComponents/TradingHistory';
import SharePopup from '../popups/SharePopup';
import ReportPopup from '../popups/ReportPopup';
import LikesPopup from '../popups/LikesPopup';
import NFTPlaceBid from '../popups/NFTPlaceBid';
import Offers from '../marketplaceTabComponents/Offers';
import unveiling from '../../assets/images/unveiling.svg';
import pyramid from '../../assets/images/marketplace/eth-icon.svg';
import '../marketplace/browseNFT/NFTsList.scss';
import priceIcon from '../../assets/images/marketplace/price.svg';
import videoIcon from '../../assets/images/marketplace/video-icon.svg';
import audioIcon from '../../assets/images/marketplace/audio-icon.svg';
import mp3Icon from '../../assets/images/mp3-icon.png';
import dot3 from '../../assets/images/3333dots.svg';
import NFTMakeOffer from '../popups/NFTMakeOffer';
import CongratsProfilePopup from '../popups/CongratsProfilePopup';

const MarketplaceNFTDetails = ({ data, onNFT }) => {
  const [nfts, setNFTs] = useState(data);
  const [selectedNFT, setSelectedNFT] = useState(onNFT);
  const tabs = ['Properties', 'Owners', 'Bids', 'Offers', 'History'];
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const history = useHistory();
  const ref = useRef(null);
  const customPlayerRef = useRef(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState('...');

  // const handleClickOutside = (event) => {
  //   if (ref.current && !ref.current.contains(event.target)) {
  //     setIsDropdownOpened(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside, true);
  //   };
  // });

  const [trackProgress, setTrackProgress] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [duration, setDuration] = useState('--:--');
  const [progressWidth, setProgressWidth] = useState(0);

  const intervalRef = useRef();
  const mediaRef =
    selectedNFT.media.type === 'video/mp4'
      ? useRef()
      : selectedNFT.media.type === 'audio/mpeg'
      ? useRef(new Audio(selectedNFT.media.url))
      : null;

  const startTimer = () => {
    clearInterval(intervalRef.current);
    if (mediaRef && mediaRef.current) {
      intervalRef.current = setInterval(() => {
        if (mediaRef.current.ended) {
          setProgressWidth(0);
          setTrackProgress('00:00');
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        } else {
          const audioCurrentTimeProgress = Math.ceil(mediaRef.current.currentTime);
          const minutesProgress = `0${Math.floor(audioCurrentTimeProgress / 60)}`;
          const secondsProgress = `0${Math.floor(audioCurrentTimeProgress - minutesProgress * 60)}`;
          const durationProgress = `${minutesProgress.substr(-2)}:${secondsProgress.substr(-2)}`;
          const width = (parseInt(audioCurrentTimeProgress, 10) * 100) / mediaRef.current.duration;
          if (durationProgress === duration) {
            setProgressWidth(100);
          } else {
            setProgressWidth(parseInt(width, 10));
          }
          setTrackProgress(durationProgress);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (mediaRef) {
      console.log('mediaRef', mediaRef);
      setTimeout(() => {
        const audioCurrentTime = mediaRef.current.duration;
        const minutes = `0${Math.floor(audioCurrentTime / 60)}`;
        const seconds = `0${Math.floor(audioCurrentTime - minutes * 60)}`;
        setDuration(`${minutes.substr(-2)}:${seconds.substr(-2)}`);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (mediaRef) {
      if (isPlaying) {
        mediaRef.current.play();
        startTimer();
      } else {
        clearInterval(intervalRef.current);
        mediaRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (mediaRef) {
      if (muted) {
        mediaRef.current.muted = true;
      } else {
        mediaRef.current.muted = false;
      }
    }
  }, [muted]);

  useEffect(
    () => () => {
      if (mediaRef && mediaRef.current) {
        mediaRef.current.pause();
      }
      clearInterval(intervalRef.current);
    },
    []
  );

  const handleSelectedNFTLikeClick = (id) => {
    setSelectedNFT({
      ...selectedNFT,
      likesCount: selectedNFT.liked ? selectedNFT.likesCount - 1 : selectedNFT.likesCount + 1,
      liked: !selectedNFT.liked,
    });
    setNFTs((prevState) =>
      prevState.map((el) =>
        el.id === id
          ? {
              ...el,
              likesCount: el.liked ? el.likesCount - 1 : el.likesCount + 1,
              liked: !el.liked,
            }
          : el
      )
    );
  };

  const handleLikeClick = (id) => {
    setNFTs((prevState) =>
      prevState.map((el) =>
        el.id === id
          ? {
              ...el,
              likesCount: el.liked ? el.likesCount - 1 : el.likesCount + 1,
              liked: !el.liked,
            }
          : el
      )
    );
  };

  const handleLikeDivClick = (e) => {
    if (e.target.nodeName !== 'svg' && e.target.nodeName !== 'path') {
      document.getElementById('likes-hidden-btn').click();
    }
  };

  return (
    <>
      <div className="marketplace--nft--page">
        <Popup
          trigger={
            <button
              type="button"
              id="likes-hidden-btn"
              aria-label="hidden"
              style={{ display: 'none' }}
            />
          }
        >
          {(close) => <LikesPopup onClose={close} />}
        </Popup>
        <div
          className={`Marketplace--img ${fullScreen ? 'full--screen' : ''}`}
          aria-hidden="true"
          onClick={(event) =>
            mediaRef &&
            customPlayerRef.current &&
            !customPlayerRef.current.contains(event.target) &&
            setIsPlaying(!isPlaying)
          }
          onDoubleClick={(event) =>
            mediaRef &&
            customPlayerRef.current &&
            !customPlayerRef.current.contains(event.target) &&
            setFullScreen(!fullScreen)
          }
        >
          <div>
            {selectedNFT.media.type !== 'audio/mpeg' && selectedNFT.media.type !== 'video/mp4' && (
              <img src={selectedNFT.media.url} alt={selectedNFT.name} />
            )}
            {selectedNFT.media.type === 'video/mp4' && (
              <video ref={mediaRef}>
                <source src={selectedNFT.media.url} type="video/mp4" />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            )}
            {selectedNFT.media.type === 'audio/mpeg' && (
              <img src={mp3Icon} alt={selectedNFT.name} />
            )}
            {selectedNFT.media.type === 'audio/mpeg' || selectedNFT.media.type === 'video/mp4' ? (
              <div className="custom--player" ref={customPlayerRef}>
                <div className="controls">
                  <div className="controls--left">
                    {isPlaying ? (
                      <img
                        src={pauseIcon}
                        alt="Pause"
                        aria-hidden="true"
                        onClick={() => setIsPlaying(false)}
                      />
                    ) : (
                      <img
                        src={playIcon}
                        alt="Play"
                        aria-hidden="true"
                        onClick={() => setIsPlaying(true)}
                      />
                    )}
                    <span>{`${trackProgress} / ${duration}`}</span>
                  </div>
                  <div className="controls--right">
                    {muted ? (
                      <img
                        src={soundOffIcon}
                        alt="Sound off"
                        aria-hidden="true"
                        onClick={() => setMuted(false)}
                      />
                    ) : (
                      <img
                        src={soundOnIcon}
                        alt="Sound on"
                        aria-hidden="true"
                        onClick={() => setMuted(true)}
                      />
                    )}
                    <img src={miniplayerIcon} alt="Miniplayer" />
                    {fullScreen ? (
                      <img
                        src={fullScreenOffIcon}
                        alt="Full screen off"
                        aria-hidden="true"
                        onClick={() => setFullScreen(false)}
                      />
                    ) : (
                      <img
                        src={fullScreenIcon}
                        alt="Full screen"
                        aria-hidden="true"
                        onClick={() => setFullScreen(true)}
                      />
                    )}
                  </div>
                </div>
                <div className="progress--bar">
                  <div className="progress--bar--filled" style={{ width: `${progressWidth}%` }} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="Marketplace--settings">
          <div className="Marketplace--name">
            <h1>{selectedNFT.name}</h1>
            <div className="icon">
              <div className="like--share" aria-hidden="true" onClick={handleLikeDivClick}>
                <div className="likes--count">
                  <div>
                    <svg
                      className={selectedNFT.liked ? 'fill' : ''}
                      onClick={() => handleSelectedNFTLikeClick(selectedNFT.id)}
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
                      <div className="likers--text">{`${selectedNFT.likesCount} people liked this`}</div>
                      <div className="likers--avatars">
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                        <img src={selectedNFT.owner.avatar} alt="Liker" />
                      </div>
                    </div>
                  </div>
                  <span>{selectedNFT.likesCount}</span>
                </div>
              </div>
              <div
                ref={ref}
                className={`share_dropdown ${isDropdownOpened ? 'opened' : ''}`}
                onClick={() => setIsDropdownOpened(!isDropdownOpened)}
                aria-hidden="true"
              >
                <span className="selected__item">{selectedItem}</span>
                {isDropdownOpened && (
                  <div className="sort__share__dropdown">
                    <ul>
                      <Popup trigger={<li aria-hidden="true">Share</li>}>
                        {(close) => <SharePopup close={close} />}
                      </Popup>
                      <Popup
                        trigger={
                          <li aria-hidden="true" className="dropdown__report">
                            Report
                          </li>
                        }
                      >
                        {(close) => <ReportPopup onClose={close} />}
                      </Popup>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="Marketplace--number">
            <p>Edition {selectedNFT.editions}</p>
          </div>
          <div className="Marketplace--collections">
            <div className="Marketplace--creators">
              <img src={selectedNFT.creator.avatar} alt="icon" />
              <div className="creator--name">
                <p>Creator</p>
                <h6>{selectedNFT.creator.name}</h6>
              </div>
            </div>
            <div className="Marketplace--creators">
              <img src={selectedNFT.collection.avatar} alt="icon1" />
              <div className="creator--name">
                <p>Collection</p>
                <h6>{selectedNFT.collection.name}</h6>
              </div>
            </div>
            <div className="Marketplace--creators">
              <img src={selectedNFT.owner.avatar} alt="icon2" />
              <div className="creator--name">
                <p>Owner</p>
                <h6>{selectedNFT.owner.name}</h6>
              </div>
            </div>
          </div>
          <div className="Marketplace--text">
            <p>
              <ReactReadMoreReadLess
                charLimit={150}
                readMoreText="Read more"
                readLessText="Read less"
              >
                {selectedNFT.description}
              </ReactReadMoreReadLess>
            </p>
          </div>
          <div className="tabs">
            <ul className="tab_items">
              {tabs.map((tab, index) => (
                <li
                  key={uuid()}
                  className={selectedTabIndex === index ? 'active' : ''}
                  aria-hidden="true"
                  onClick={() => setSelectedTabIndex(index)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {selectedTabIndex === 0 && <Properties />}
            {selectedTabIndex === 1 && <Owners />}
            {selectedTabIndex === 2 && <Bids />}
            {selectedTabIndex === 3 && <Offers />}
            {selectedTabIndex === 4 && <TradingHistory />}
          </div>
          <div className="theunveiling">
            <div className="unveiling--box">
              <img src={unveiling} alt="avatar" />
              <div className="unveiling--info">
                <h1>
                  <span>Highest bid by</span> The Unveiling
                </h1>
                <div className="icon--box">
                  <div className="box--hover">
                    <img src={pyramid} alt="pyramid" className="weth--icon" />
                    <span className="weth--hover">WETH</span>
                  </div>
                  <p>
                    0.5<span className="span--price">$142.39s</span>
                    <span className="span--procent">(10% of sales will go to creator)</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="button--box">
              <Popup
                trigger={
                  <button type="button" className="light-button">
                    Place a bid
                  </button>
                }
              >
                {(close) => <NFTPlaceBid close={close} />}
              </Popup>
              <Popup
                trigger={
                  <button type="button" className="light-border-button">
                    Make offer
                  </button>
                }
              >
                {(close) => <NFTMakeOffer close={close} />}
              </Popup>
            </div>
          </div>
        </div>
      </div>
      <div className="collection">
        <div className="collection--title">
          <h1>More from this collection</h1>
        </div>
        <div className="browse--nft--list">
          {nfts.map(
            (nft, index) =>
              index < 4 && (
                <div className="nft--box" key={uuid()}>
                  <div className="nft--box--header">
                    <div className="three--images">
                      <div className="creator--details">
                        <img src={nft.creator.avatar} alt={nft.creator.name} />
                        <span className="tooltiptext">{`Creator: ${nft.creator.name}`}</span>
                      </div>
                      <div className="collection--details">
                        <img src={nft.collection.avatar} alt={nft.collection.name} />
                        <span className="tooltiptext">{`Collection: ${nft.collection.name}`}</span>
                      </div>
                      <div className="owner--details">
                        <img src={nft.owner.avatar} alt={nft.owner.name} />
                        <span className="tooltiptext">{`Owner: ${nft.owner.name}`}</span>
                      </div>
                    </div>
                    <div className="likes--count">
                      <div>
                        <svg
                          className={nft.liked ? 'fill' : ''}
                          onClick={() => handleLikeClick(nft.id)}
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
                          <div className="likers--text">{`${nft.likesCount} people liked this`}</div>
                          <div className="likers--avatars">
                            <img src={nft.owner.avatar} alt="Liker" />
                            <img src={nft.owner.avatar} alt="Liker" />
                            <img src={nft.owner.avatar} alt="Liker" />
                            <img src={nft.owner.avatar} alt="Liker" />
                            <img src={nft.owner.avatar} alt="Liker" />
                            <img src={nft.owner.avatar} alt="Liker" />
                          </div>
                        </div>
                      </div>
                      <span>{nft.likesCount}</span>
                    </div>
                  </div>
                  <div
                    className="nft--box--body"
                    aria-hidden="true"
                    onClick={() => history.push(`/marketplace/nft/${nft.id}`)}
                  >
                    {nft.media.type !== 'audio/mpeg' && nft.media.type !== 'video/mp4' && (
                      <img className="nft--image" src={nft.media.url} alt={nft.name} />
                    )}
                    {nft.media.type === 'video/mp4' && (
                      <video
                        onMouseOver={(event) => event.target.play()}
                        onFocus={(event) => event.target.play()}
                        onMouseOut={(event) => event.target.pause()}
                        onBlur={(event) => event.target.pause()}
                      >
                        <source src={nft.media.url} type="video/mp4" />
                        <track kind="captions" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {nft.media.type === 'audio/mpeg' && (
                      <img className="nft--image" src={mp3Icon} alt={nft.name} />
                    )}
                    {nft.media.type === 'video/mp4' && (
                      <div className="video__icon">
                        <img src={videoIcon} alt="Video Icon" />
                      </div>
                    )}
                    {nft.media.type === 'audio/mpeg' && (
                      <div className="video__icon">
                        <img src={audioIcon} alt="Video Icon" />
                      </div>
                    )}
                  </div>
                  <div className="nft--box--footer">
                    <div className="name--and--price">
                      <h4>{nft.name}</h4>
                      <div className="price--div">
                        <img src={priceIcon} alt="Price" />
                        <span>{nft.price}</span>
                      </div>
                    </div>
                    <div className="quantity--and--offer">
                      <p>{nft.editions}</p>
                      <div className="price--offer--div">
                        <label>Offer for</label>
                        <img src={priceIcon} alt="Price" />
                        <span>{nft.offerFor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
        <div className="view--button">
          <button type="button" className="light-button">
            View Collection
          </button>
        </div>
      </div>
    </>
  );
};

MarketplaceNFTDetails.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  onNFT: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

MarketplaceNFTDetails.defaultProps = {
  data: [],
};
export default MarketplaceNFTDetails;
