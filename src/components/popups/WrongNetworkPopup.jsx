import React from "react";
import PropTypes from "prop-types";
import Button from "../button/Button.jsx";
import closeIcon from "../../assets/images/close-menu.svg";
import wrongNetworkIcon from "../../assets/images/wrong-network-2.jpg";

const WrongNetworkPopup = ({ close }) => {
  const switchChain = async () => {
    const { ethereum } = window;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  };

  return (
    <div className="wrong__network__popup">
      <img
        className="close__popup"
        onClick={close}
        src={closeIcon}
        alt="Close"
        aria-hidden="true"
      />
      <img src={wrongNetworkIcon} alt="Wrong Network" />
      <h1 className="title">Wrong network</h1>
      <p className="desc">
        Please switch your wallet network to{" "}
        <span>{process.env.REACT_APP_NETWORK_NAME}</span> to use the app. If you
        still encounter problems, you may want to switch to a different wallet
      </p>
      <Button onClick={switchChain} className="light-border-button">
        Switch Network
      </Button>
    </div>
  );
};

WrongNetworkPopup.propTypes = {
  close: PropTypes.func.isRequired,
};

export default WrongNetworkPopup;
