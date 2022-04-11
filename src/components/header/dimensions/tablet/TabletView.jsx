import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { Animated } from 'react-animated-css';
// import './TabletView.scss';
import HeaderAvatar from '../../HeaderAvatar';
import SelectWalletPopup from '../../../popups/SelectWalletPopup.jsx';
import hamburgerIcon from '../../../../assets/images/hamburger.svg';
import closeIcon from '../../../../assets/images/close-menu.svg';
import accountIcon from '../../../../assets/images/icon1.svg';
import accountDarkIcon from '../../../../assets/images/account-dark-icon.svg';
import AppContext from '../../../../ContextAPI';
import Group2 from '../../../../assets/images/Group2.svg';
import Group1 from '../../../../assets/images/Group1.svg';
import copyIcon from '../../../../assets/images/copy.svg';
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
import SubscribePopup from '../../../popups/SubscribePopup.jsx';
import searchIcon from '../../../../assets/images/search-icon.svg';
import img from '../../../../assets/images/search-gray.svg';
import img2 from '../../../../assets/images/crossclose.svg';
import Button from '../../../button/Button';
// import '../../Header.scss';
import mp3Icon from '../../../../assets/images/mp3-icon.png';
import audioIcon from '../../../../assets/images/marketplace/audio-icon.svg';
import { defaultColors, handleClickOutside } from '../../../../utils/helpers';
import {
  shortenEnsDomain,
  shortenEthereumAddress,
  toFixed,
} from '../../../../utils/helpers/format';
import { useAuctionContext } from '../../../../contexts/AuctionContext';
import supportIcon from '../../../../assets/images/supportIcon.svg';
import Badge from '../../../badge/Badge';
import { useUserBalanceStore } from '../../../../stores/balanceStore';
import { useAuthStore } from '../../../../stores/authStore';

const TabletView = (props) => {
  const {
    isWalletConnected,
    setIsWalletConnected,
    ethereumAddress,
    handleConnectWallet,
    showInstallWalletPopup,
    setShowInstallWalletPopup,
    selectedWallet,
    setSelectedWallet,
    showMenu,
    setShowMenu,
    showSearch,
    setShowSearch,
  } = props;
  const {
    yourEnsDomain,
    signOut,
    isAuthenticating,
  } = useAuthStore(s => ({yourEnsDomain: s.yourEnsDomain, signOut: s.signOut, isAuthenticating: s.isAuthenticating}))

  const { yourBalance, usdEthBalance } = useUserBalanceStore(state => ({yourBalance: state.yourBalance, usdEthBalance: state.usdEthBalance}));

  const { editProfileButtonClick } = useAuctionContext();
  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState('');
  const ref = useRef(null);
  const history = useHistory();

  const handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (searchValue) {
        history.push(`/search`, { query: searchValue });
        setSearchValue('');
        searchRef.current.blur();
        setShowSearch(false);
      }
    }
  };
  const handleAllResults = () => {
    history.push(`/search`, { query: searchValue });
    setSearchValue('');
    searchRef.current.blur();
    setShowSearch(false);
  };

  useEffect(() => {
    if (showSearch) {
      document.body.classList.add('no__scroll');
    } else {
      document.body.classList.remove('no__scroll');
    }
  }, [showSearch]);

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

  return (
    <div className="tablet__nav">
      {/* <button
        className="search--box"
        type="button"
        onClick={() => {
          setShowSearch(!showSearch);
        }}
      >
        <img src={searchIcon} alt="icon" />
      </button> */}
      {/* {showSearch && (
        <>
          <div className="search--section">
            <div className="input--search--box">
              <div className={`input--box ${searchFocus || searchValue ? 'focus' : ''}`}>
                <div className="box--shadow--effect--block" />
                <input
                  placeholder="Search"
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
                    setShowSearch(false);
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
          <div
            style={{ marginRight: 20, display: 'flex', cursor: 'pointer' }}
            aria-hidden
            onClick={toggleDropdown}
          >
            <HeaderAvatar scale={4} />
          </div>
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

          {isAccountDropdownOpened && (
            <Animated animationIn="fadeIn">
              <div ref={ref} className="dropdown drop-account">
                <div className="dropdown__header">
                  <div className="copy-div">
                    <HeaderAvatar scale={3} />
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
                      history.push('/my-nfts');
                      setIsAccountDropdownOpened(!isAccountDropdownOpened);
                    }}
                  >
                    <img src={myNFTsIcon} alt="My NFTs" />
                    My NTFs
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
            <li>
              <div className="grid__menu">
                <div>
                  <p className="title">Products</p>
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
                </div>
                <div>
                  <p className="title">NFT Drops</p>
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
                </div>
                <div>
                  <p className="title">Rarity Charts</p>
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
                </div>
                <div>
                  <p className="title">Info</p>
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
                    <button type="button" onClick={() => window.open('https://docs.universe.xyz/')}>
                      <img src={docsIcon} alt="Docs" />
                      <span>Docs</span>
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => window.open('https://universe.freshdesk.com/support/home')}
                    >
                      <img src={supportIcon} alt="Support" width="20px" height="15px" />

                      <span>Support</span>
                    </button>
                  </div>
                </div>
                <div>
                  <p className="title">DAO</p>
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
                </div>
              </div>
            </li>
            {!isWalletConnected && (
              <li className="sign__in">
                {/* <Popup trigger={<button type="button">Join newsletter</button>}>
                  {(close) => <SubscribePopup close={close} />}
                </Popup> */}
                <Popup
                  closeOnDocumentClick={false}
                  trigger={
                    <button type="button" className="sign__in">
                      {isAuthenticating ? 'Signing in...' : 'Sign in'}
                    </button>
                  }
                >
                  {(close) => (
                    <SelectWalletPopup
                      close={close}
                      handleConnectWallet={handleConnectWallet}
                      showInstallWalletPopup={showInstallWalletPopup}
                      setShowInstallWalletPopup={setShowInstallWalletPopup}
                      selectedWallet={selectedWallet}
                      setSelectedWallet={setSelectedWallet}
                    />
                  )}
                </Popup>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

TabletView.propTypes = {
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
  showSearch: PropTypes.bool.isRequired,
  setShowSearch: PropTypes.func.isRequired,
};

export default TabletView;
