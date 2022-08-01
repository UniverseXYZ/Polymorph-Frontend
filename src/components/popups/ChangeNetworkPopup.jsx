import Image from "next/image";
import ethIcon from "../../assets/images/eth-icon-blue.png";
import polygonIcon from "../../assets/images/polygon-icon.png";
import closeIcon from "../../assets/images/cross.svg";
import { useMyNftsStore } from "src/stores/myNftsStore";

const ChangeNetworkPopup = ({ onClose }) => {
  const [selectedNetwork, setSelectedNetwork] = useMyNftsStore();

  return (
    <div className="change--network--popup">
      <h2>Change Network</h2>
      <button className="network--button">
        <Image src={ethIcon} height={40} width={40} />
        <div className="chain">
          <div>Ethereum</div>
          <p>Connected</p>
        </div>
      </button>
      <button className="network--button">
        <Image src={polygonIcon} height={40} width={40} />
        <div className="chain">
          <div>Polygon</div>
          <p>Connected</p>
        </div>
      </button>
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </button>
    </div>
  );
};

export default ChangeNetworkPopup;
