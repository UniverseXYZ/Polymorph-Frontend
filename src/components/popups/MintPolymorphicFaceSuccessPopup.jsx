import PropTypes from "prop-types";
import uuid from "react-uuid";
import Button from "../button/Button.jsx";
import closeIcon from "../../assets/images/cross.svg";
import { useMyNftsStore } from "src/stores/myNftsStore";
import Image from "next/image.js";
import SuccessBubble from "../../assets/images/successful-claim-bubble.png";

const MintPolymorphConfirmationPopup = ({ amount, txHash, onClose }) => {
  return (
    <div className="polymorph_popup">
      <img
        className="close"
        src={closeIcon}
        alt="Close"
        onClick={onClose}
        aria-hidden="true"
      />
      <Image
        src={SuccessBubble}
        height={128}
        width={128}
        style={{ marginTop: "32px", marginBottom: "32px" }}
        alt=""
      />
      <h1>Congratulations!</h1>
      <p className="desc">
        {amount === 1
          ? `You have successfully claimed your Polymorphic Face. It will appear in your wallet soon.
        `
          : `You have successfully claimed ${amount} Polymorphic Faces. They will appear in your wallet soon.`}
      </p>
      <p className="desc">
        Transaction hash:{" "}
        <span className="txHash" onClick={() => window.open(txHash)}>
          {"TxHash"}
        </span>
      </p>
      <div className="button__div_polymorph">
        <Button className="light-border-button" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

MintPolymorphConfirmationPopup.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default MintPolymorphConfirmationPopup;
