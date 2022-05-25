import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import { Animated } from "react-animated-css";
// import './TabletView.scss';
import HeaderAvatar from "../../HeaderAvatar";
import SelectWalletPopup from "../../../popups/SelectWalletPopup.jsx";
import hamburgerIcon from "../../../../assets/images/hamburger.svg";
import closeIcon from "../../../../assets/images/close-menu.svg";
import accountIcon from "../../../../assets/images/icon1.svg";
import accountDarkIcon from "../../../../assets/images/account-dark-icon.svg";
import AppContext from "../../../../ContextAPI";
import Group2 from "../../../../assets/images/Group2.svg";
import Group1 from "../../../../assets/images/Group1.svg";
import copyIcon from "../../../../assets/images/copy.svg";
import auctionHouseIcon from "../../../../assets/images/auction-house.svg";
import myProfileIcon from "../../../../assets/images/my-profile.svg";
import myNFTsIcon from "../../../../assets/images/my-nfts.svg";
import signOutIcon from "../../../../assets/images/sign-out.svg";
import marketplaceIcon from "../../../../assets/images/nft-marketplace.svg";
import socialMediaIcon from "../../../../assets/images/social-media.svg";
import polymorphsIcon from "../../../../assets/images/polymorphs.svg";
import coreDropsIcon from "../../../../assets/images/core-drops.svg";
import rarityChartIcon from "../../../../assets/images/rarity-chart.svg";
import navChartIcon from "../../../../assets/images/chart-nav-icon.svg";
import aboutIcon from "../../../../assets/images/about.svg";
import whitepaperIcon from "../../../../assets/images/whitepaper.svg";
import teamIcon from "../../../../assets/images/team.svg";
import governanceIcon from "../../../../assets/images/governance.svg";
import yieldFarmingIcon from "../../../../assets/images/yield-farming.svg";
import forumIcon from "../../../../assets/images/forum.svg";
import signalIcon from "../../../../assets/images/signal.svg";
import docsIcon from "../../../../assets/images/docs.svg";
import SubscribePopup from "../../../popups/SubscribePopup.jsx";
import searchIcon from "../../../../assets/images/search-icon.svg";
import img from "../../../../assets/images/search-gray.svg";
import img2 from "../../../../assets/images/crossclose.svg";
import Button from "../../../button/Button";
// import '../../Header.scss';
import mp3Icon from "../../../../assets/images/mp3-icon.png";
import audioIcon from "../../../../assets/images/marketplace/audio-icon.svg";
import { defaultColors, handleClickOutside } from "../../../../utils/helpers";
import {
  shortenEnsDomain,
  shortenEthereumAddress,
  toFixed,
} from "../../../../utils/helpers/format";
import supportIcon from "../../../../assets/images/supportIcon.svg";
import Badge from "../../../badge/Badge";
import arrowUP from "../../../../assets/images/arrow-down.svg";
import { useUserBalanceStore } from "../../../../stores/balanceStore";
import { useAuthStore } from "../../../../stores/authStore";

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
    userPolymorphsCount,
  } = props;
  const { yourEnsDomain, signOut, isAuthenticating } = useAuthStore((s) => ({
    yourEnsDomain: s.yourEnsDomain,
    signOut: s.signOut,
    isAuthenticating: s.isAuthenticating,
  }));

  const { yourBalance, usdEthBalance } = useUserBalanceStore((state) => ({
    yourBalance: state.yourBalance,
    usdEthBalance: state.usdEthBalance,
  }));

  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const ref = useRef(null);
  const router = useRouter();

  const handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (searchValue) {
        router.push(`/search`, { query: searchValue });
        setSearchValue("");
        searchRef.current.blur();
        setShowSearch(false);
      }
    }
  };
  const handleAllResults = () => {
    router.push(`/search`, { query: searchValue });
    setSearchValue("");
    searchRef.current.blur();
    setShowSearch(false);
  };

  useEffect(() => {
    if (showSearch) {
      document.body.classList.add("no__scroll");
    } else {
      document.body.classList.remove("no__scroll");
    }
  }, [showSearch]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("no__scroll");
    } else {
      document.body.classList.remove("no__scroll");
    }
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener(
      "click",
      (e) => handleClickOutside(e, "blockie", ref, setIsAccountDropdownOpened),
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        (e) => {
          handleClickOutside(e, "blockie", ref, setIsAccountDropdownOpened);
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
      {isWalletConnected && (
        <div className="wallet__connected__tablet">
          <div
            style={{ marginRight: 20, display: "flex", cursor: "pointer" }}
            aria-hidden
            onClick={toggleDropdown}
          >
            <button
              // style={{ width: 200 }}
              type="button"
              className="menu-li myAccount"
              onClick={() =>
                setIsAccountDropdownOpened(!isAccountDropdownOpened)
              }
            >
              <HeaderAvatar scale={4} />
              <span className="nav__link__title">
                <div className="ethereum__address__tablet">
                  {yourEnsDomain
                    ? shortenEnsDomain(yourEnsDomain)
                    : shortenEthereumAddress(ethereumAddress)}
                </div>
              </span>
              <img className="arrow" src={arrowUP} alt="arrow" />
            </button>
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
                            <img
                              src={copyIcon}
                              alt="Copy to clipboard icon"
                              className="copyImg"
                            />
                          </span>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                  <div className="group1">
                    <img src={Group1} alt="ETH" />
                    <span className="first-span">
                      {toFixed(yourBalance, 2)} ETH
                    </span>
                    <span className="second-span">
                      ${toFixed(usdEthBalance, 2)}
                    </span>
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
                    className="light-border-button"
                    onClick={() => {
                      signOut();
                      router.push("/");
                      setIsAccountDropdownOpened(false);
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </Animated>
          )}
        </div>
      )}
      <button
        type="button"
        className="hamburger"
        onClick={() => setShowMenu(!showMenu)}
      >
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
                {/* <div>
                  <p className="title">NFT Drops</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        router.push('/polymorphs');
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
                        router.push('/lobby-lobsters');
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
                      //   router.push('/core-drops');
                      // }}
                      className="disable"
                    >
                      <img src={coreDropsIcon} alt="Core drops" />
                      <span>OG Planet Drop</span>
                      <span className="tooltiptext">Coming soon</span>
                    </button>
                  </div>
                </div> */}
                <div>
                  <p
                    className="title"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/burn-to-mint");
                    }}
                  >
                    Burn to Mint
                  </p>
                </div>
                <div>
                  <p
                    className="title"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/polymorph-rarity");
                    }}
                  >
                    Rarity Chart
                  </p>
                </div>
                <div>
                  <p
                    className="title"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/my-polymorphs");
                    }}
                  >
                    My Polymorphs
                    {userPolymorphsCount ? (
                      <span>{userPolymorphsCount}</span>
                    ) : null}
                  </p>
                </div>
                {/* <div>
                  <p className="title">Info</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        router.push('/about');
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
                        router.push('/team');
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
                </div> */}
                {/* <div>
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
                </div> */}
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
                      {"Connect Wallet"}
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
