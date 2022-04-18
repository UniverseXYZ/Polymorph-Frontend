import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Animated } from 'react-animated-css';
import Popup from 'reactjs-popup';
// import './MobileView.scss';
import HeaderAvatar from '../../HeaderAvatar';
import {
  PLACEHOLDER_MARKETPLACE_AUCTIONS,
  PLACEHOLDER_MARKETPLACE_NFTS,
  PLACEHOLDER_MARKETPLACE_USERS,
  PLACEHOLDER_MARKETPLACE_COLLECTIONS,
  PLACEHOLDER_MARKETPLACE_COMMUNITIES,
  PLACEHOLDER_MARKETPLACE_GALLERIES,
} from '../../../../utils/fixtures/BrowseNFTsDummyData';
import AppContext from '../../../../ContextAPI';
import Button from '../../../button/Button.jsx';
import hamburgerIcon from '../../../../assets/images/hamburger.svg';
import SearchIcon from '../../../../assets/images/marketplace-search.svg';
import closeIcon from '../../../../assets/images/close-menu.svg';
import Group1 from '../../../../assets/images/Group1.svg';
import Group2 from '../../../../assets/images/Group2.svg';
import copyIcon from '../../../../assets/images/copy.svg';
import accountIcon from '../../../../assets/images/icon1.svg';
import accountDarkIcon from '../../../../assets/images/account-dark-icon.svg';
import metamaskLogo from '../../../../assets/images/metamask.png';
import ledgerLogo from '../../../../assets/images/ledger.png';
import keystoreLogo from '../../../../assets/images/keystore.png';
import trezorLogo from '../../../../assets/images/trezor.png';
import coinbaseLogo from '../../../../assets/images/coinbase.png';
import walletConnectLogo from '../../../../assets/images/wallet-connect.png';
import leftArrow from '../../../../assets/images/arrow.svg';
import auctionHouseIcon from '../../../../assets/images/auction-house.svg';
import myProfileIcon from '../../../../assets/images/my-profile.svg';
import myNFTsIcon from '../../../../assets/images/my-nfts.svg';
import signOutIcon from '../../../../assets/images/sign-out.svg';
import marketplaceIcon from '../../../../assets/images/nft-marketplace.svg';
import socialMediaIcon from '../../../../assets/images/social-media.svg';
import polymorphsIcon from '../../../../assets/images/polymorphs.svg';
import coreDropsIcon from '../../../../assets/images/core-drops.svg';
import lobbyLobstersIcon from '../../../../assets/images/lobby-lobsters.svg';
import rarityChartIcon from '../../../../assets/images/rarity-chart.svg';
import navChartIcon from '../../../../assets/images/chart-nav-icon.svg';
import aboutIcon from '../../../../assets/images/about.svg';
import whitepaperIcon from '../../../../assets/images/whitepaper.svg';
import teamIcon from '../../../../assets/images/team.svg';
import governanceIcon from '../../../../assets/images/governance.svg';
import yieldFarmingIcon from '../../../../assets/images/yield-farming.svg';
import forumIcon from '../../../../assets/images/forum.svg';
import signalIcon from '../../../../assets/images/signal.svg';
import docsIcon from '../../../../assets/images/docs.svg';
import arrowDown from '../../../../assets/images/arrow-down.svg';
import SubscribePopup from '../../../popups/SubscribePopup.jsx';
import searchIcon from '../../../../assets/images/search-icon.svg';
import img from '../../../../assets/images/search-gray.svg';
import img2 from '../../../../assets/images/crossclose.svg';
import mp3Icon from '../../../../assets/images/mp3-icon.png';
import audioIcon from '../../../../assets/images/marketplace/audio-icon.svg';
import { handleClickOutside } from '../../../../utils/helpers';
import {
  toFixed,
  shortenEnsDomain,
  shortenEthereumAddress,
} from '../../../../utils/helpers/format';
import supportIcon from '../../../../assets/images/supportIcon.svg';
import Badge from '../../../badge/Badge';
import { useUserBalanceStore } from '../../../../stores/balanceStore';
import { useAuthStore } from '../../../../stores/authStore';

const MobileView = (props) => {
  const {
    isWalletConnected,
    setIsWalletConnected,
    ethereumAddress,
    handleConnectWallet,
    setShowMenu,
    setShowSelectWallet,
    showMenu,
    showSelectWallet,
    showInstallWalletPopup,
    setSelectedWallet,
    setShowInstallWalletPopup,
    selectedWallet,
    showMobileSearch,
    setShowMobileSearch,
  } = props;
  const { yourEnsDomain, signOut, isAuthenticating } = useAuthStore(s => ({yourEnsDomain: s.yourEnsDomain, signOut: s.signOut, isAuthenticating: s.isAuthenticating}))
  
  const { yourBalance, usdEthBalance } = useUserBalanceStore(state => ({yourBalance: state.yourBalance, usdEthBalance: state.usdEthBalance}));

  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const history = useHistory();
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showNFTDrops, setShowNFTDrops] = useState(false);
  const [showRarityCharts, setShowRarityCharts] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDAO, setShowDAO] = useState(false);
  const rarityChartsRef = useRef(null);
  const infoRef = useRef(null);
  const daoRef = useRef(null);

  const handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (searchValue) {
        history.push(`/search`, { query: searchValue });
        setSearchValue('');
        searchRef.current.blur();
        setShowMobileSearch(false);
      }
    }
  };

  const handleAllResults = () => {
    history.push(`/search`, { query: searchValue });
    setSearchValue('');
    searchRef.current.blur();
    setShowMobileSearch(false);
  };

  useEffect(() => {
    if (showMobileSearch) {
      document.body.classList.add('no__scroll');
    } else {
      document.body.classList.remove('no__scroll');
    }
  }, [showMobileSearch]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('no__scroll');
    } else {
      document.body.classList.remove('no__scroll');
    }
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener(
      'click',
      (e) => handleClickOutside(e, 'blockie', ref, setIsAccountDropdownOpened),
      true
    );
    return () => {
      document.removeEventListener(
        'click',
        (e) => {
          handleClickOutside(e, 'blockie', ref, setIsAccountDropdownOpened);
        },
        true
      );
    };
  }, []);

  const toggleDropdown = () => {
    setIsAccountDropdownOpened(!isAccountDropdownOpened);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showRarityCharts) {
      rarityChartsRef.current.scrollIntoView();
    }
  }, [showRarityCharts]);

  useEffect(() => {
    if (showInfo) {
      rarityChartsRef.current.scrollIntoView();
    }
  }, [showInfo]);

  useEffect(() => {
    if (showDAO) {
      rarityChartsRef.current.scrollIntoView();
    }
  }, [showDAO]);

  return (
    <div className="mobile__nav">
      {/* <button
        type="button"
        className="mobile--search--box"
        onClick={() => {
          setShowMobileSearch(!showMobileSearch);
        }}
      >
        <img src={searchIcon} alt="icon" />
      </button>
      {showMobileSearch && (
        <>
          <div className="mobile--search--section">
            <div className="input--search--box">
              <div className={`input--box ${searchFocus || searchValue ? 'focus' : ''}`}>
                <div className="box--shadow--effect--block" />
                <input
                  placeholder=""
                  ref={searchRef}
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  onKeyDown={handleSearchKeyDown}
                  type="text"
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                />
                <img src={img} alt="search" className="searchicon" />
                <img
                  src={img2}
                  alt="close"
                  className="closeicon"
                  onClick={() => {
                    setShowMobileSearch(false);
                    setSearchValue('');
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="search--results">
              {searchValue.length > 0 && (
                <>
                  <div className="search__results" ref={ref}>
                    {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                      item.name.toLowerCase().includes(searchValue.toLowerCase())
                    ).length > 0 ||
                    PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                      item.name.toLowerCase().includes(searchValue.toLowerCase())
                    ).length > 0 ||
                    PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                      item.name.toLowerCase().includes(searchValue.toLowerCase())
                    ).length > 0 ||
                    PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                      item.name.toLowerCase().includes(searchValue.toLowerCase())
                    ).length > 0 ? (
                      // PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                      //   item.name.toLowerCase().includes(searchValue.toLowerCase())
                      // ).length > 0 ||
                      // PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                      //   item.name.toLowerCase().includes(searchValue.toLocaleLowerCase())
                      // ).length ? (
                      <div className="search__nfts">
                        {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).length > 0 && <h4>NFTs</h4>}
                        {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((nft) => (
                          <div className="nft__div">
                            <div className="nft--image">
                              {nft.media.type !== 'audio/mpeg' &&
                                nft.media.type !== 'video/mp4' && (
                                  <img src={nft.media.url} alt="NFT" />
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
                              {nft.media.type === 'audio/mpeg' && (
                                <div className="video__icon">
                                  <img src={audioIcon} alt="Video Icon" />
                                </div>
                              )}
                            </div>
                            <div className="nft--desc">
                              <h5 className="nft--name">{nft.name}</h5>
                              <p className="nft--price">
                                {nft.price} ETH / {nft.editions.split('/')[0]} of{' '}
                                {nft.editions.split('/')[1]}
                              </p>
                            </div>
                          </div>
                        ))}
                        {PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).length > 0 && <h4>Users</h4>}
                        {PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((user) => (
                          <div className="users__div">
                            <div className="user--avatar">
                              <img src={user.avatar} alt="User" />
                            </div>
                            <div className="user--desc">
                              <h5 className="user--name">{user.name}</h5>
                              <p className="user--followers">{user.followers} Followers</p>
                            </div>
                          </div>
                        ))}
                        {PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).length > 0 && <h4>Auctions</h4>}
                        {PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((auction) => (
                          <div className="auction__div">
                            <div className="auction--image">
                              <img src={auction.photo} alt="Auction" />
                            </div>
                            <div className="auction--desc">
                              <h5 className="auction--title">{auction.name}</h5>
                              <p className="auction--artist">by {auction.creator.name}</p>
                            </div>
                          </div>
                        ))}
                        {PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).length > 0 && <h4>Collections</h4>}
                        {PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((collection) => (
                          <div className="collection__div">
                            {!collection.photo ? (
                              <div
                                className="random--avatar--color"
                                style={{
                                  backgroundColor:
                                    defaultColors[Math.floor(Math.random() * defaultColors.length)],
                                }}
                              >
                                {collection.name.charAt(0)}
                              </div>
                            ) : (
                              <div className="collection--image">
                                <img src={collection.photo} alt="Coll" />
                              </div>
                            )}
                            <div className="collection--desc">
                              <h5 className="collection--name">{collection.name}</h5>
                              <p className="collection--owner">by {collection.owner.name}</p>
                            </div>
                          </div>
                        ))}
                        {PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).length > 0 && <h4>Communities</h4>}
                        {PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((communities) => (
                          <div className="communities__div">
                            <div className="communities--photo">
                              <img src={communities.photo} alt="Comm" />
                            </div>
                            <div className="communities--desc">
                              <h5 className="communities--name">{communities.name}</h5>
                              <p className="communities--members">{communities.members} Members</p>
                            </div>
                          </div>
                        ))}
                        {PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLocaleLowerCase())
                        ).length > 0 && <h4>Galleries</h4>}
                        {PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                          item.name.toLowerCase().includes(searchValue.toLowerCase())
                        ).map((galleries) => (
                          <div className="galleries__div">
                            <div className="galleries--photo">
                              <img src={galleries.photos[0]} alt="Gall" />
                            </div>
                            <div className="galleries--desc">
                              <h5 className="galleries--name">{galleries.name}</h5>
                              <p className="galleries--likes">{galleries.likesCount} Likes</p>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          className="light-border-button"
                          onClick={() => handleAllResults()}
                        >
                          All results
                        </Button>
                      </div>
                    ) : (
                      <div className="no__result">
                        <p>No items found</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              <p>
                Search by auction, NFT, user,
                <br /> collection, community or gallery
              </p>
            </div>
          </div>
        </>
      )} */}
      {isWalletConnected && (
        <div className="wallet__connected__tablet">
          {/* <img
            className="account__icon hide__on__tablet"
            src={accountIcon}
            onClick={() => {
              setIsAccountDropdownOpened(!isAccountDropdownOpened);
              setShowMenu(false);
            }}
            alt="Account icon"
            aria-hidden="true"
          /> */}
          {/* <img
            className="account__icon show__on__tablet"
            src={accountDarkIcon}
            onClick={() => {
              setIsAccountDropdownOpened(!isAccountDropdownOpened);
              setShowMenu(false);
            }}
            alt="Account icon"
            aria-hidden="true"
          /> */}
          <div
            style={{ marginRight: 20, display: 'flex', cursor: 'pointer' }}
            aria-hidden
            onClick={toggleDropdown}
          >
            <HeaderAvatar scale={4} />
          </div>

          {isAccountDropdownOpened && (
            <Animated animationIn="fadeIn">
              <div ref={ref} className="dropdown drop-account">
                <div className="dropdown__header">
                  <div className="copy-div">
                    <HeaderAvatar scale={4} />

                    {/* <img className="icon-img" src={accountIcon} alt="icon" /> */}
                    <div className="ethereum__address">
                      {yourEnsDomain
                        ? shortenEnsDomain(yourEnsDomain)
                        : shortenEthereumAddress(ethereumAddress)}
                    </div>
                    <div className="copy__div">
                      <div className="copy" title="Copy to clipboard">
                        <div className="copied-div" hidden={!copied}>
                          Address copied!
                          <span />
                        </div>
                        <CopyToClipboard
                          text={ethereumAddress}
                          onCopy={() => {
                            setCopied(true);
                            setTimeout(() => {
                              setCopied(false);
                            }, 1000);
                          }}
                        >
                          <span>
                            <img src={copyIcon} alt="Copy to clipboard icon" className="copyImg" />
                          </span>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                  <div className="group1">
                    <img src={Group1} alt="ETH" />
                    <span className="first-span">{toFixed(yourBalance, 2)} ETH</span>
                    <span className="second-span">${toFixed(usdEthBalance, 2)}</span>
                  </div>
                  {/* <div className="group2">
                    <img src={Group2} alt="WETH" />
                    <span className="first-span">6,24 WETH</span>
                    <span className="second-span">$10,554</span>
                  </div> */}
                </div>
                <div className="dropdown__body">
                  <button
                    type="button"
                    onClick={() => {
                      history.push('/my-account');
                      setIsAccountDropdownOpened(false);
                      // if (
                      //   loggedInArtist.name &&
                      //   loggedInArtist.universePageAddress &&
                      //   loggedInArtist.avatar &&
                      //   loggedInArtist.about &&
                      //   editProfileButtonClick
                      // ) {
                      //   history.push(`/${loggedInArtist.universePageAddress}`, {
                      //     id: loggedInArtist.id,
                      //   });
                      // } else {
                      //   history.push('/my-account');
                      // }
                      // setIsAccountDropdownOpened(!isAccountDropdownOpened);
                    }}
                  >
                    <img src={myProfileIcon} alt="My Profile" />
                    Edit My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      history.push('/my-polymorphs');
                      setIsAccountDropdownOpened(!isAccountDropdownOpened);
                    }}
                  >
                    <img src={myNFTsIcon} alt="My NFTs" />
                    My NFTs
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => {
                      history.push('/my-auctions');
                      setIsAccountDropdownOpened(!isAccountDropdownOpened);
                    }}
                  >
                    <img src={auctionHouseIcon} alt="My Auctions" />
                    My auctions
                  </button> */}
                  <button
                    type="button"
                    className="signOut"
                    onClick={() => {
                      signOut();
                      history.push('/');
                      setIsAccountDropdownOpened(false);
                    }}
                  >
                    <img src={signOutIcon} alt="Sign out" />
                    Sign out
                  </button>
                </div>
              </div>
            </Animated>
          )}
        </div>
      )}
      <button type="button" className="hamburger" onClick={() => setShowMenu(!showMenu)}>
        {!showMenu ? (
          <img src={hamburgerIcon} alt="Hamburger" />
        ) : (
          <img src={closeIcon} alt="Close" />
        )}
      </button>
      {showMenu && (
        <>
          <div className="overlay" />
          <ul className="nav__menu">
            {!showSelectWallet ? (
              <>
                <li>
                  <div className="grid__menu">
                    <div>
                      <div
                        className="head"
                        aria-hidden="true"
                        onClick={() => setShowProducts(!showProducts)}
                      >
                        <p className="title">
                          Products
                          <Badge text="new" />
                        </p>
                        <img className={showProducts ? 'rotate' : ''} src={arrowDown} alt="arrow" />
                      </div>
                      {showProducts ? (
                        <>
                          <div>
                            <button
                              type="button"
                              // className="disable"
                              onClick={() => {
                                setShowMenu(false);
                                history.push('/marketplace');
                              }}
                            >
                              <img src={marketplaceIcon} alt="NFT Marketplace" />
                              <span>
                                NFT Marketplace <Badge text="beta" />
                              </span>
                              {/* <span className="tooltiptext">Coming soon</span> */}
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="disable"
                              onClick={() => {
                                // setShowMenu(false);
                                // history.push('/minting-and-auctions/marketplace/active-auctions');
                              }}
                            >
                              <img src={auctionHouseIcon} alt="Auction House" />
                              <span>Auction House</span>
                              <span className="tooltiptext">Coming soon</span>
                            </button>
                          </div>
                          <div>
                            <button type="button" className="disable">
                              <img src={socialMediaIcon} alt="Social Media" />
                              <span>Social Media</span>
                              <span className="tooltiptext">Coming soon</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      <div
                        className="head"
                        aria-hidden="true"
                        onClick={() => setShowNFTDrops(!showNFTDrops)}
                      >
                        <p className="title">NFT Drops</p>
                        <img className={showNFTDrops ? 'rotate' : ''} src={arrowDown} alt="arrow" />
                      </div>
                      {showNFTDrops ? (
                        <>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowMenu(false);
                                history.push('/polymorphs');
                              }}
                            >
                              <img src={polymorphsIcon} alt="Polymorphs" />
                              <span>Polymorphs</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                history.push('/lobby-lobsters');
                              }}
                            >
                              <img src={lobbyLobstersIcon} alt="Lobby Lobsters" />
                              <span>Lobby Lobsters</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              // onClick={() => {
                              //   history.push('/core-drops');
                              // }}
                              className="disable"
                            >
                              <img src={coreDropsIcon} alt="Core drops" />
                              <span>OG Planet Drop</span>
                              <span className="tooltiptext">Coming soon</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div ref={rarityChartsRef}>
                      <div
                        className="head"
                        aria-hidden="true"
                        onClick={() => setShowRarityCharts(!showRarityCharts)}
                      >
                        <p className="title">Rarity Charts</p>
                        <img
                          className={showRarityCharts ? 'rotate' : ''}
                          src={arrowDown}
                          alt="arrow"
                        />
                      </div>
                      {showRarityCharts ? (
                        <>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowMenu(false);
                                history.push('/polymorph-rarity');
                              }}
                            >
                              <img src={navChartIcon} alt="Polymorphs" />
                              <span>Polymorphs</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://rarity.tools/lobby-lobsters')}
                            >
                              <img src={navChartIcon} alt="Lobby Lobsters" />
                              <span>Lobby Lobsters</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div ref={infoRef}>
                      <div
                        className="head"
                        aria-hidden="true"
                        onClick={() => setShowInfo(!showInfo)}
                      >
                        <p className="title">Info</p>
                        <img className={showInfo ? 'rotate' : ''} src={arrowDown} alt="arrow" />
                      </div>
                      {showInfo ? (
                        <>
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowMenu(false);
                                history.push('/about');
                              }}
                            >
                              <img src={aboutIcon} alt="About" />
                              About
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                window.open('https://github.com/UniverseXYZ/UniverseXYZ-Whitepaper')
                              }
                            >
                              <img src={whitepaperIcon} alt="Whitepaper" />
                              Whitepaper
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="team"
                              onClick={() => {
                                setShowMenu(false);
                                history.push('/team');
                              }}
                            >
                              <img src={teamIcon} alt="Team" />
                              Team
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://docs.universe.xyz/')}
                            >
                              <img src={docsIcon} alt="Docs" />
                              <span>Docs</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                window.open('https://universe.freshdesk.com/support/home')
                              }
                            >
                              <img src={supportIcon} alt="Support" width="20px" height="15px" />
                              <span>Support</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div ref={daoRef}>
                      <div className="head" aria-hidden="true" onClick={() => setShowDAO(!showDAO)}>
                        <p className="title">DAO</p>
                        <img className={showDAO ? 'rotate' : ''} src={arrowDown} alt="arrow" />
                      </div>
                      {showDAO ? (
                        <>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://dao.universe.xyz/governance')}
                            >
                              <img src={governanceIcon} alt="Governance" />
                              <span>Governance</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://dao.universe.xyz/yield-farming')}
                            >
                              <img src={yieldFarmingIcon} alt="Yield Farming" />
                              <span>Yield Farming</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://forum.universe.xyz/')}
                            >
                              <img src={forumIcon} alt="Forum" />
                              <span>Forum</span>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => window.open('https://signal.universe.xyz/#/')}
                            >
                              <img src={signalIcon} alt="Signal" />
                              <span>Signal</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </li>
                {!isWalletConnected && (
                  <li className="sign__in">
                    <button
                      type="button"
                      className="sign__in"
                      onClick={() => setShowSelectWallet(true)}
                    >
                      {isAuthenticating ? 'Signing in...' : 'Sign in'}
                    </button>
                  </li>
                )}
              </>
            ) : (
              <div className="select_wallet__section">
                <div
                  className="backToMenu"
                  onClick={() => setShowSelectWallet(false)}
                  aria-hidden="true"
                >
                  <img src={leftArrow} alt="back" />
                  <span>Back to menu</span>
                </div>
                {!showInstallWalletPopup ? (
                  <>
                    <h1 className="title">Select Wallet</h1>
                    <p className="desc">Please pick a wallet to connect to Universe</p>
                    <div className="wallets">
                      <button type="button" onClick={() => handleConnectWallet('Metamask')}>
                        <img src={metamaskLogo} alt="Metamask" />
                      </button>
                      <button type="button" onClick={() => handleConnectWallet('WalletConnect')}>
                        <img src={walletConnectLogo} alt="WalletConnect" />
                      </button>
                      <button type="button" disabled onClick={() => handleConnectWallet('Ledger')}>
                        <img src={ledgerLogo} alt="Ledger" />
                      </button>
                      <button
                        type="button"
                        disabled
                        onClick={() => handleConnectWallet('Keystore')}
                      >
                        <img src={keystoreLogo} alt="Keystore" />
                      </button>
                      <button type="button" disabled onClick={() => handleConnectWallet('Trezor')}>
                        <img src={trezorLogo} alt="Trezor" />
                      </button>
                      <button
                        type="button"
                        disabled
                        onClick={() => handleConnectWallet('Coinbase')}
                      >
                        <img src={coinbaseLogo} alt="Coinbase" />
                      </button>
                    </div>
                    <p className="info">
                      We do not own your private keys and cannot access your funds without your
                      confirmation.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="title">Install {selectedWallet}</h1>
                    <p className="desc">
                      You need to have Metamask installed to continue. Once you have installed it,
                      please refresh the page
                    </p>
                    <div className="links">
                      <Button className="light-button">Install {selectedWallet}</Button>
                      <Button
                        className="light-border-button"
                        onClick={() => {
                          setShowInstallWalletPopup(false);
                          setSelectedWallet('');
                        }}
                      >
                        Go back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

MobileView.propTypes = {
  isWalletConnected: PropTypes.bool.isRequired,
  setIsWalletConnected: PropTypes.func.isRequired,
  ethereumAddress: PropTypes.string.isRequired,
  handleConnectWallet: PropTypes.func.isRequired,
  showInstallWalletPopup: PropTypes.bool.isRequired,
  setShowInstallWalletPopup: PropTypes.func.isRequired,
  selectedWallet: PropTypes.string.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired,
  showSelectWallet: PropTypes.bool.isRequired,
  setShowSelectWallet: PropTypes.func.isRequired,
  showMobileSearch: PropTypes.bool.isRequired,
  setShowMobileSearch: PropTypes.func.isRequired,
};

export default MobileView;
