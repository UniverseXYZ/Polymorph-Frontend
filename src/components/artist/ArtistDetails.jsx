import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Animated } from 'react-animated-css';
import { useHistory } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import Blockies from 'react-blockies';
import twitterIcon from '../../assets/images/icons_twitter.svg';
import instagramIcon from '../../assets/images/instagram-outlined.svg';
import pencilIcon from '../../assets/images/edit.svg';
import copyIcon from '../../assets/images/copy.svg';
import Button from '../button/Button';
import { shortenEthereumAddress } from '../../utils/helpers/format';
import { useWindowSize } from 'react-use';
import { useAuthStore } from '../../stores/authStore';

const ArtistDetails = ({ artistAddress, onArtist = {}, loading }) => {
  const blockieSizes = {
    small: 9,
    medium: 24,
    large: 31,
  };
  const blockieResizePoints = {
    small: 562,
    medium: 768,
    large: 1230,
  };

  const history = useHistory();

  const address = useAuthStore(s => s.address)

  const [copied, setCopied] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [blockieScale, setBlockieScale] = useState(31);
  // const [width, height] = useWindowSize();
  const { width, height } = useWindowSize();
  
  useEffect(() => {
    if (width < blockieResizePoints.small && blockieScale !== blockieSizes.small) {
      setBlockieScale(blockieSizes.small);
    } else if (
      width > blockieResizePoints.small &&
      width <= blockieResizePoints.medium &&
      blockieScale !== blockieSizes.medium
    ) {
      setBlockieScale(blockieSizes.medium);
    } else if (width > blockieResizePoints.large && blockieScale !== blockieSizes.large) {
      setBlockieScale(blockieSizes.large);
    }
  }, [width]);
  return (
    <div className="artist__details__section">
      <Animated animationIn="zoomIn">
        {artistAddress && !onArtist.avatar ? (
          <div className="artist__details__section__container">
            <div className="avatar">
              <Blockies seed={artistAddress} size={9} scale={blockieScale} />
              <h6 className="show__on__mobile">Unnamed</h6>
            </div>
            <div className="info">
              <h1 className="title">Unnamed</h1>
              <div className="address__copy">
                <div className="copy" title="Copy to clipboard">
                  <div className="copied-address" hidden={!copiedAddress}>
                    Copied
                    <span />
                  </div>
                  <CopyToClipboard
                    text={artistAddress}
                    onCopy={() => {
                      setCopiedAddress(true);
                      setTimeout(() => {
                        setCopiedAddress(false);
                      }, 1000);
                    }}
                  >
                    <p className="address">{shortenEthereumAddress(artistAddress)}</p>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="social__links">
                {address === artistAddress ? (
                  <Button
                    className="light-border-button"
                    onClick={() => {
                      history.push('/my-account');
                    }}
                  >
                    Edit <img src={pencilIcon} alt="Pencil" />
                  </Button>
                ) : (
                  <></>
                )}
                <div className="copy-div">
                  <div className="copy" title="Copy to clipboard">
                    <div className="copied-div" hidden={!copied}>
                      URL copied!
                      <span />
                    </div>
                    {/* During SSR we don't have window */}
                    {typeof window !== `undefined` && 
                      <CopyToClipboard
                        text={window.location.href}
                        onCopy={() => {
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 1000);
                        }}
                      >
                        <span>
                          <img src={copyIcon} alt="Copy to clipboard icon" className="copyImg" />
                          Copy URL
                        </span>
                      </CopyToClipboard>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="artist__details__section__container">
            <div className="avatar">
              <img src={onArtist.avatar} alt={onArtist.name} />
              <h2 className="show__on__mobile">{onArtist.name}</h2>
            </div>
            <div className="info">
              <h1 className="title">{onArtist.name}</h1>
              <p className="desc">{onArtist.about}</p>
              {onArtist.name && onArtist.about && (
                <div className="social__links">
                  {/* {loggedInArtist.id === onArtist.id ? (
                    <Button
                      className="light-border-button"
                      onClick={() => {
                        history.push('/my-account');
                        setEditProfileButtonClick(false);
                      }}
                    >
                      Edit <img src={pencilIcon} alt="Pencil" />
                    </Button>
                  ) : (
                    <></>
                  )} */}
                  {onArtist.instagramLink ? (
                    <a
                      href={`https://www.instagram.com/${onArtist.instagramLink}`}
                      target="_blank"
                      title={`https://www.instagram.com/${onArtist.instagramLink}`}
                      rel="noreferrer"
                    >
                      <img src={instagramIcon} alt="Instagram" />
                    </a>
                  ) : (
                    <></>
                  )}
                  {onArtist.twitterLink ? (
                    <a
                      href={`https://twitter.com/${onArtist.twitterLink}`}
                      target="_blank"
                      title={`https://twitter.com/${onArtist.twitterLink}`}
                      rel="noreferrer"
                    >
                      <img src={twitterIcon} alt="Twitter" />
                    </a>
                  ) : (
                    <></>
                  )}
                  <div className="copy-div">
                    <div className="copy" title="Copy to clipboard">
                      <div className="copied-div" hidden={!copied}>
                        URL copied!
                        <span />
                      </div>
                      {/* During SSR we don't have window */}
                      {typeof window !== `undefined` && 
                        <CopyToClipboard
                          text={window.location.href}
                          onCopy={() => {
                            setCopied(true);
                            setTimeout(() => {
                              setCopied(false);
                            }, 1000);
                          }}
                        >
                          <span>
                            <img src={copyIcon} alt="Copy to clipboard icon" className="copyImg" />
                            Copy URL
                          </span>
                        </CopyToClipboard>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Animated>
    </div>
  );
};

ArtistDetails.propTypes = {
  artistAddress: PropTypes.string.isRequired,
  onArtist: PropTypes.oneOfType([PropTypes.object]).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ArtistDetails;
