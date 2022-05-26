import React from "react";
import PropTypes from "prop-types";
import Button from "../button/Button.jsx";
import metamaskLogo from "../../assets/images/metamask.png";
import ledgerLogo from "../../assets/images/ledger.png";
import keystoreLogo from "../../assets/images/keystore.png";
import trezorLogo from "../../assets/images/trezor.png";
import coinbaseLogo from "../../assets/images/coinbase.png";
import walletConnectLogo from "../../assets/images/wallet-connect.png";
import closeIcon from "../../assets/images/close-menu.svg";

const externalLink =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";

const SelectWalletPopup = (props) => {
  const {
    close,
    handleConnectWallet,
    showInstallWalletPopup,
    setShowInstallWalletPopup,
    selectedWallet,
    setSelectedWallet,
  } = props;

  return (
    <div className="select_wallet__popup">
      <img
        className="close__popup"
        onClick={close}
        src={closeIcon}
        alt="Close"
        aria-hidden="true"
      />
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
              disabled
              onClick={() => handleConnectWallet("Ledger")}
            >
              <img src={ledgerLogo} alt="Ledger" />
            </button>
            <button
              type="button"
              disabled
              onClick={() => handleConnectWallet("Keystore")}
            >
              <img src={keystoreLogo} alt="Keystore" />
            </button>
            <button
              type="button"
              disabled
              onClick={() => handleConnectWallet("Trezor")}
            >
              <img src={trezorLogo} alt="Trezor" />
            </button>
            <button
              type="button"
              disabled
              onClick={() => handleConnectWallet("Coinbase")}
            >
              <img src={coinbaseLogo} alt="Coinbase" />
            </button>
          </div>
          <p className="info">
            We do not own your private keys and cannot access your funds without
            your confirmation.
          </p>
        </>
      ) : (
        <>
          <h1 className="title">Install {selectedWallet}</h1>
          <p className="desc">
            You need to have Metamask installed to continue. Once you have
            installed it, please refresh the page
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
  );
};

SelectWalletPopup.propTypes = {
  close: PropTypes.func.isRequired,
  handleConnectWallet: PropTypes.func.isRequired,
  showInstallWalletPopup: PropTypes.bool.isRequired,
  setShowInstallWalletPopup: PropTypes.func.isRequired,
  selectedWallet: PropTypes.string.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
};

export default SelectWalletPopup;
