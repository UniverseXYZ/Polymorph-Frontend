import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Popup from "reactjs-popup";
import HeaderAvatar from "../../HeaderAvatar";
import SelectWalletPopup from "../../../popups/SelectWalletPopup.jsx";
import copyIcon from "../../../../assets/images/copy.svg";
import arrowUP from "../../../../assets/images/arrow-down.svg";
import Group1 from "../../../../assets/images/Group1.svg";
import {
  shortenEnsDomain,
  shortenEthereumAddress,
  toFixed,
} from "../../../../utils/helpers/format";
import { useRouter } from "next/router";
import { useUserBalanceStore } from "../../../../stores/balanceStore";
import { useAuthStore } from "../../../../stores/authStore";
import PlusIcon from "../../../../assets/images/plus-icon.svg";
import MinusIcon from "../../../../assets/images/minus-icon.svg";
import signOutIcon from "../../../../assets/images/sign-out.png";
import myPolymorphsIcon from "../../../../assets/images/my-polymorphs-icon.png";
import ethIcon from "../../../../assets/images/eth-icon-blue.png";
import polygonIcon from "../../../../assets/images/polygon-icon.png";
import Image from "next/image";

const DesktopView = ({
  isWalletConnected,
  setIsWalletConnected,
  ethereumAddress,
  handleConnectWallet,
  showInstallWalletPopup,
  setShowInstallWalletPopup,
  selectedWallet,
  setSelectedWallet,
  userPolymorphsCount,
  userPolymorphsToBurnCount,
  userPolymorphsBurntCount,
  userClaimedFacesCount,
  claimTx,
  facesAmountToClaim,
  setFacesAmountToClaim,
  setShowNetworkModal,
}) => {
  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const {
    address,
    isAuthenticated,
    yourEnsDomain,
    loggedInArtist,
    signOut,
    isAuthenticating,
    activeNetwork,
  } = useAuthStore((s) => ({
    address: s.address,
    isAuthenticated: s.isAuthenticated,
    yourEnsDomain: s.yourEnsDomain,
    loggedInArtist: s.loggedInArtist,
    signOut: s.signOut,
    isAuthenticating: s.isAuthenticating,
    activeNetwork: s.activeNetwork,
  }));

  const { yourBalance, usdEthBalance } = useUserBalanceStore((state) => ({
    yourBalance: state.yourBalance,
    usdEthBalance: state.usdEthBalance,
  }));

  return (
    <div className="desktop__nav">
      <ul>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push("/burn-to-mint")}
          >
            <span className="nav__link__title">Burn to Mint</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push("/polymorphic-bridge")}
          >
            <span className="nav__link__title">Bridge</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push("/polymorph-rarity")}
          >
            <span className="nav__link__title">Rarity Chart</span>
          </button>
        </li>
        {/* <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push("/my-polymorphs")}
          >
            <span className="nav__link__title">
              My Polymorphs
              {userPolymorphsCount ? <span>{userPolymorphsCount}</span> : null}
            </span>
          </button>
        </li> */}

        {isWalletConnected ? (
          <>
            <li>
              <button type="button" className={"menu-li faces-to-claim"}>
                <span className="nav__link__title">
                  Faces to Claim
                  {userPolymorphsBurntCount ? (
                    <span>
                      {userPolymorphsBurntCount - userClaimedFacesCount}
                    </span>
                  ) : null}
                </span>
                <img className="arrow" src={arrowUP} alt="arrow" />
              </button>
              <div className="dropdown drop-faces-to-claim">
                <div className="dropdown__header">
                  <div className={"heading"}>
                    {userPolymorphsBurntCount ? (
                      <span>
                        {userPolymorphsBurntCount - userClaimedFacesCount}{" "}
                      </span>
                    ) : (
                      <span>{"0 "}</span>
                    )}
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
            </li>

            <li>
              <button
                // style={{ width: 200 }}
                type="button"
                className="menu-li myAccount"
                onClick={() =>
                  setIsAccountDropdownOpened(!isAccountDropdownOpened)
                }
              >
                <HeaderAvatar scale={3} />
                <span className="nav__link__title">
                  <div className="ethereum__address">
                    {yourEnsDomain
                      ? shortenEnsDomain(yourEnsDomain)
                      : shortenEthereumAddress(ethereumAddress)}
                  </div>
                </span>
                <img className="arrow" src={arrowUP} alt="arrow" />
              </button>
              <div className="dropdown drop-account">
                <div className="dropdown__header">
                  <div className="copy-div">
                    <button
                      type="button"
                      style={{ background: "transparent" }}
                      onClick={() => {
                        if (!loggedInArtist.universePageAddress && !address)
                          return;

                        const path = loggedInArtist.universePageAddress
                          ? loggedInArtist.universePageAddress
                          : address;
                        router.push(`/${path}`, {
                          id: loggedInArtist.id,
                        });

                        setIsAccountDropdownOpened(false);
                      }}
                    >
                      <HeaderAvatar scale={4} />
                    </button>
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
                      ~${toFixed(usdEthBalance, 2)}
                    </span>
                  </div>
                </div>
                <div className="dropdown__body">
                  <button
                    type="button"
                    // className="light-border-button"
                    onClick={() => {
                      router.push("/my-polymorphs");
                    }}
                  >
                    <img src={myPolymorphsIcon} alt="My polymorphs" />
                    My polymorphs
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
                    <img src={signOutIcon} alt="Sign out" />
                    Disconnect
                  </button>
                </div>
              </div>
            </li>
            <li>
              <button
                className="eth-icon"
                onClick={() => setShowNetworkModal(true)}
              >
                <Image
                  src={activeNetwork === "ethereum" ? ethIcon : polygonIcon}
                  width={24}
                  height={24}
                  alt="eth-ico"
                />
              </button>
            </li>
          </>
        ) : (
          <li>
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
    </div>
  );
};

DesktopView.propTypes = {
  isWalletConnected: PropTypes.bool.isRequired,
  setIsWalletConnected: PropTypes.func.isRequired,
  ethereumAddress: PropTypes.string.isRequired,
  handleConnectWallet: PropTypes.func.isRequired,
  showInstallWalletPopup: PropTypes.bool.isRequired,
  setShowInstallWalletPopup: PropTypes.func.isRequired,
  selectedWallet: PropTypes.string.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
};

export default DesktopView;
