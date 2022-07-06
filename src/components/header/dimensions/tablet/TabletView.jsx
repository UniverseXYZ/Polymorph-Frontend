import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import { Animated } from "react-animated-css";
import HeaderAvatar from "../../HeaderAvatar";
import SelectWalletPopup from "../../../popups/SelectWalletPopup.jsx";
import hamburgerIcon from "../../../../assets/images/hamburger.svg";
import closeIcon from "../../../../assets/images/close-menu.svg";
import Group1 from "../../../../assets/images/Group1.svg";
import copyIcon from "../../../../assets/images/copy.svg";
import { defaultColors, handleClickOutside } from "../../../../utils/helpers";
import {
  shortenEnsDomain,
  shortenEthereumAddress,
  toFixed,
} from "../../../../utils/helpers/format";
import arrowUP from "../../../../assets/images/arrow-down.svg";
import { useUserBalanceStore } from "../../../../stores/balanceStore";
import { useAuthStore } from "../../../../stores/authStore";
import arrowRight from "../../../../assets/images/marketplace/bundles-right-arrow.svg";
import MintPolymorphicFaceSuccessPopup from "../../../popups/MintPolymorphicFaceSuccessPopup";

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
    userPolymorphsToBurnCount,
    userPolymorphsBurntCount,
    userClaimedFacesCount,
    claimTx,
    facesAmountToClaim,
    setFacesAmountToClaim,
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
  const ref = useRef(null);
  const router = useRouter();
  const [isFacesDropdownOpened, setIsFacesDropdownOpened] = useState(false);

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
    setIsFacesDropdownOpened(false);
    setShowMenu(false);
  };

  const toggleFacesDropdown = () => {
    setIsFacesDropdownOpened(!isFacesDropdownOpened);
    setIsAccountDropdownOpened(false);
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

          <div
            style={{ marginRight: 20, display: "flex", cursor: "pointer" }}
            aria-hidden
            onClick={toggleFacesDropdown}
          >
            <button
              // style={{ width: 200 }}
              type="button"
              className="menu-li faces-to-claim"
            >
              <span className="nav__link__title">
                Faces to Claim
                {userPolymorphsBurntCount && userClaimedFacesCount ? (
                  <span>
                    {userPolymorphsBurntCount - userClaimedFacesCount}
                  </span>
                ) : null}
              </span>
              <img className="arrow" src={arrowUP} alt="arrow" />
            </button>
          </div>

          {isFacesDropdownOpened ? (
            <div className="dropdown drop-faces-to-claim">
              <div className="dropdown__header">
                <div className={"heading"}>
                  {userPolymorphsBurntCount && userClaimedFacesCount ? (
                    <span>
                      {userPolymorphsBurntCount - userClaimedFacesCount}{" "}
                    </span>
                  ) : null}
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
                      -
                    </button>
                    <span>{facesAmountToClaim}</span>
                    <button
                      className={`${
                        facesAmountToClaim === 20 ? "disabled" : ""
                      }`}
                      onClick={() => setFacesAmountToClaim("add")}
                      disabled={facesAmountToClaim === 20}
                    >
                      +
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
              <div className="dropdown__body">
                <div>{userPolymorphsToBurnCount} Polymorphs to Burn</div>
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
          ) : null}
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
                <div className="menu__row">
                  <p
                    className="title"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/burn-to-mint");
                    }}
                  >
                    Burn to Mint
                  </p>
                  <img src={arrowRight} alt="arrow" />
                </div>
                <div className="menu__row">
                  <p
                    className="title"
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/polymorph-rarity");
                    }}
                  >
                    Rarity Chart
                  </p>
                  <img src={arrowRight} alt="arrow" />
                </div>
                <div className="menu__row">
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
                  <img src={arrowRight} alt="arrow" />
                </div>
              </div>
            </li>
            {!isWalletConnected && (
              <li className="sign__in">
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
