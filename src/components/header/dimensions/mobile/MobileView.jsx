import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Animated } from "react-animated-css";
import Button from "../../../button/Button.jsx";
import hamburgerIcon from "../../../../assets/images/hamburger.svg";
import closeIcon from "../../../../assets/images/close-menu.svg";
import Group1 from "../../../../assets/images/Group1.svg";
import Group2 from "../../../../assets/images/Group2.svg";
import copyIcon from "../../../../assets/images/copy.svg";
import metamaskLogo from "../../../../assets/images/metamask.png";
import coinbaseLogo from "../../../../assets/images/coinbase.png";
import walletConnectLogo from "../../../../assets/images/wallet-connect.png";
import leftArrow from "../../../../assets/images/arrow.svg";
import { handleClickOutside } from "../../../../utils/helpers";
import {
  toFixed,
  shortenEnsDomain,
  shortenEthereumAddress,
} from "../../../../utils/helpers/format";
import { useUserBalanceStore } from "../../../../stores/balanceStore";
import { useAuthStore } from "../../../../stores/authStore";
import arrowRight from "../../../../assets/images/marketplace/bundles-right-arrow.svg";
import arrowLeft from "../../../../assets/images/burn-to-mint-images/arrow-left-white.svg";
import PlusIcon from "../../../../assets/images/plus-icon-white.svg";
import MinusIcon from "../../../../assets/images/minus-icon-white.svg";
import ethIcon from "../../../../assets/images/eth-icon-blue.png";
import polygonIcon from "../../../../assets/images/polygon-icon.png";
import Image from "next/image";
import signOutIcon from "../../../../assets/images/sign-out.png";
import myPolymorphsIcon from "../../../../assets/images/my-polymorphs-icon.png";
import walletIcon from "../../../../assets/images/wallet-icon.png";

const externalLink =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";

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
    userPolymorphsCount,
    userPolymorphsToBurnCount,
    userPolymorphsBurntCount,
    userClaimedFacesCount,
    claimTx,
    facesAmountToClaim,
    setFacesAmountToClaim,
    setShowNetworkModal,
  } = props;
  const { yourEnsDomain, signOut, isAuthenticating, activeNetwork } =
    useAuthStore((s) => ({
      yourEnsDomain: s.yourEnsDomain,
      signOut: s.signOut,
      isAuthenticating: s.isAuthenticating,
      activeNetwork: s.activeNetwork,
    }));

  const { yourBalance, usdEthBalance } = useUserBalanceStore((state) => ({
    yourBalance: state.yourBalance,
    usdEthBalance: state.usdEthBalance,
  }));

  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showNFTDrops, setShowNFTDrops] = useState(false);
  const [showRarityCharts, setShowRarityCharts] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDAO, setShowDAO] = useState(false);
  const rarityChartsRef = useRef(null);
  const infoRef = useRef(null);
  const daoRef = useRef(null);
  const [showFacesMenu, setShowFacesMenu] = useState(false);
  const [isFacesDropdownOpened, setIsFacesDropdownOpened] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (searchValue) {
        router.push(`/search`, { query: searchValue });
        setSearchValue("");
        searchRef.current.blur();
        setShowMobileSearch(false);
      }
    }
  };

  const handleAllResults = () => {
    router.push(`/search`, { query: searchValue });
    setSearchValue("");
    searchRef.current.blur();
    setShowMobileSearch(false);
  };

  useEffect(() => {
    if (showMobileSearch || isAccountDropdownOpened) {
      document.body.classList.add("no__scroll");
    } else {
      document.body.classList.remove("no__scroll");
    }
  }, [showMobileSearch, isAccountDropdownOpened]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("no__scroll");
    } else {
      document.body.classList.remove("no__scroll");
    }
  }, [showMenu]);

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
      {isWalletConnected && (
        <div className="wallet__connected__tablet">
          <div
            style={{ marginRight: 0, display: "flex", cursor: "pointer" }}
            aria-hidden
            onClick={toggleDropdown}
          >
            <Image
              className="wallet-icon"
              src={walletIcon}
              height={40}
              width={40}
              alt=""
            />
          </div>

          {isAccountDropdownOpened && (
            <div className={`account-menu`}>
              {/* <div className="overlay" /> */}
              <Animated animationIn="fadeIn">
                <div ref={ref} className="dropdown drop-account">
                  <div className="dropdown__header">
                    <div className="copy-div">
                      <Image
                        className="wallet-icon"
                        src={walletIcon}
                        height={40}
                        width={40}
                        alt=""
                      />
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
                  </div>
                  <div className="dropdown__body">
                    <button
                      type="button"
                      // className="light-border-button"
                      onClick={() => {
                        router.push("/my-polymorphs");
                        setIsAccountDropdownOpened(false);
                      }}
                    >
                      <Image
                        src={myPolymorphsIcon}
                        width={20}
                        height={20}
                        alt="My polymorphs"
                      />
                      <div>My polymorphs</div>
                    </button>
                    <button
                      type="button"
                      // className="light-border-button"
                      onClick={() => {
                        setIsAccountDropdownOpened(false);
                        signOut();
                        router.push("/");
                      }}
                    >
                      <Image
                        src={signOutIcon}
                        width={20}
                        height={20}
                        alt="Sign out"
                      />
                      <div>Disconnect</div>
                    </button>
                  </div>
                </div>
              </Animated>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className="hamburger"
        onClick={() => {
          setIsAccountDropdownOpened(false);
          setShowMenu(!showMenu);
        }}
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
            {!showSelectWallet ? (
              <>
                {!showFacesMenu && (
                  <li>
                    <div className="grid__menu">
                      <div>
                        <div
                          className="head"
                          aria-hidden="true"
                          onClick={() => router.push("/burn-to-mint")}
                        >
                          <p className="title">Burn to Mint</p>
                          <img src={arrowRight} alt="arrow" />
                        </div>
                      </div>
                      <div>
                        <div
                          className="head"
                          aria-hidden="true"
                          onClick={() => router.push("/polymorphic-bridge")}
                        >
                          <p className="title">Bridge</p>
                          <img src={arrowRight} alt="arrow" />
                        </div>
                      </div>
                      <div>
                        <div
                          className="head"
                          aria-hidden="true"
                          onClick={() => router.push("/polymorph-rarity")}
                        >
                          <p className="title">Rarity Chart</p>
                          <img src={arrowRight} alt="arrow" />
                        </div>
                      </div>
                      {/* <div>
                        <div
                          className="head"
                          aria-hidden="true"
                          onClick={() => router.push("/my-polymorphs")}
                        >
                          <p className="title">
                            My Polymorphs
                            {userPolymorphsCount ? (
                              <span>{userPolymorphsCount}</span>
                            ) : null}
                          </p>
                          <img src={arrowRight} alt="arrow" />
                        </div>
                      </div> */}
                      {isWalletConnected && (
                        <div>
                          <div
                            className="head"
                            aria-hidden="true"
                            onClick={() => {
                              setShowFacesMenu(true);
                            }}
                          >
                            <p className="title">
                              Faces to Claim
                              {userPolymorphsBurntCount &&
                              userClaimedFacesCount ? (
                                <span>
                                  {userPolymorphsBurntCount -
                                    userClaimedFacesCount}
                                </span>
                              ) : null}
                            </p>
                            <img src={arrowRight} alt="arrow" />
                          </div>
                          {/* <button
                          type="button"
                          className={"menu-li faces-to-claim"}
                        >
                          <span className="nav__link__title">
                            Faces to Claim
                            {userPolymorphsCount ? (
                              <span>{userPolymorphsCount}</span>
                            ) : null}
                          </span>
                        </button> */}
                        </div>
                      )}
                    </div>
                  </li>
                )}
                {showFacesMenu && (
                  <li className={"faces--menu"}>
                    <button
                      className={"go-back-button"}
                      onClick={() => setShowFacesMenu(false)}
                    >
                      <img src={arrowLeft} alt="" />
                      <span>Go Back</span>
                    </button>
                    <div className="faces-to-claim">
                      <div className="menu__header">
                        <div className={"heading"}>
                          {userPolymorphsBurntCount && userClaimedFacesCount ? (
                            <span>
                              {userPolymorphsBurntCount - userClaimedFacesCount}
                            </span>
                          ) : (
                            <span>{"0 "}</span>
                          )}{" "}
                          Faces to Claim
                        </div>
                        <div>{userClaimedFacesCount} Faces claimed</div>
                        <div className={"buttons--wrapper"}>
                          <div className={"claim--amount"}>
                            <button
                              className={`${
                                facesAmountToClaim === 0 ? "disabled" : ""
                              }`}
                              onClick={() => setFacesAmountToClaim("sub")}
                              disabled={facesAmountToClaim === 0}
                            >
                              <img src={MinusIcon} alt="" />
                            </button>
                            <span>{facesAmountToClaim}</span>
                            <button
                              className={`${
                                facesAmountToClaim === 20 ? "disabled" : ""
                              }`}
                              onClick={() => setFacesAmountToClaim("add")}
                              disabled={facesAmountToClaim === 20}
                            >
                              <img src={PlusIcon} alt="" />
                            </button>
                          </div>
                          <button
                            className={"light-border-button claim--button"}
                            onClick={claimTx}
                            disabled={facesAmountToClaim === 0}
                          >
                            Claim
                          </button>
                        </div>
                      </div>
                      <div className="menu__body">
                        <div>
                          {userPolymorphsToBurnCount} Polymorphs to Burn
                        </div>
                        <div>{userPolymorphsBurntCount} Polymorphs burnt</div>
                        <button
                          type="button"
                          className="light-border-button"
                          onClick={() => {
                            router.push("/burn-to-mint/burn");
                          }}
                        >
                          Burn to Mint
                        </button>
                      </div>
                    </div>
                  </li>
                )}

                {!isWalletConnected && (
                  <li className="sign__in">
                    <button
                      type="button"
                      className="sign__in"
                      onClick={() => setShowSelectWallet(true)}
                    >
                      {"Connect Wallet"}
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
                    <p className="desc">Please pick a wallet to connect</p>
                    <div className="wallets">
                      <button
                        type="button"
                        onClick={() => handleConnectWallet("Metamask")}
                      >
                        <img src={metamaskLogo} alt="Metamask" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConnectWallet("WalletConnect")}
                      >
                        <img src={walletConnectLogo} alt="WalletConnect" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConnectWallet("Coinbase")}
                      >
                        <img src={coinbaseLogo} alt="Coinbase" />
                      </button>
                    </div>
                    <p className="info">
                      We do not own your private keys and cannot access your
                      funds without your confirmation.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="title">Install {selectedWallet}</h1>
                    <p className="desc">
                      You need to have Metamask installed to continue. Once you
                      have installed it, please refresh the page
                    </p>
                    <div className="links">
                      <Button
                        className="light-button"
                        onClick={() => window.open(externalLink)}
                      >
                        Install {selectedWallet}
                      </Button>
                      <Button
                        className="light-border-button"
                        onClick={() => {
                          setShowInstallWalletPopup(false);
                          setSelectedWallet("");
                        }}
                      >
                        Go back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            {isWalletConnected && (
              <li className="network">
                {activeNetwork === "Ethereum" && (
                  <button onClick={() => setShowNetworkModal(true)}>
                    <Image src={ethIcon} height={24} width={24} alt="" />
                    <div>Ethereum</div>
                  </button>
                )}
                {activeNetwork === "Polygon" && (
                  <button onClick={() => setShowNetworkModal(true)}>
                    <Image src={polygonIcon} height={24} width={24} alt="" />
                    <div>Polygon</div>
                  </button>
                )}
              </li>
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
