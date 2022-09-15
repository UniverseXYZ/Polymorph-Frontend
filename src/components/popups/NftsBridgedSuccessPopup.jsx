import PropTypes from "prop-types";
import uuid from "react-uuid";
import Button from "../button/Button.jsx";
import closeIcon from "../../assets/images/cross.svg";
import { useMyNftsStore } from "src/stores/myNftsStore";
import Image from "next/image.js";
import SuccessBubble from "../../assets/images/successful-claim-bubble.png";
import { useRouter } from "next/router.js";
import { useAuthStore } from "src/stores/authStore";

const NftsBridgedSuccessPopup = ({ txHash, onClose,numberOfNFTsToBridge }) => {
  const router = useRouter();
  const { activeNetwork } = useAuthStore();

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
      <h1>{numberOfNFTsToBridge == 1 ?"NFT" : "NFTs"} en route!</h1>
      <p className="desc">
        Your {numberOfNFTsToBridge == 1 ?"NFT is" : "NFTs are"} en route. It will take some time depending on network
        congestion for the deposit to get completed. On completion, you’ll find
        your {numberOfNFTsToBridge == 1 ?"NFT" : "NFTs"} in your { activeNetwork == "Polygon" ? "Ethereum" : "Polygon"} wallet.
      </p>
      <p className="desc">
        <span className="txHash" onClick={() => window.open(txHash)}>
          View on Etherscan
        </span>
      </p>
      <div className="button__div_polymorph">
        <Button className="light-button" onClick={onClose}>
          Bridge More
        </Button>
        <Button
          className="light-border-button"
          onClick={() => router.push("./my-polymorphs")}
        >
          My Polymorphs
        </Button>
      </div>
    </div>
  );
};

export default NftsBridgedSuccessPopup;
