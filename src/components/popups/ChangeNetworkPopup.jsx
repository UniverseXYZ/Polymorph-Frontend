import Image from "next/image";
import ethIcon from "../../assets/images/eth-icon-blue.png";
import polygonIcon from "../../assets/images/polygon-icon.png";
import closeIcon from "../../assets/images/cross.svg";
import { utils } from "ethers";

const ChangeNetworkPopup = ({ onClose }) => {
  const { ethereum } = window;
  const chainId = ethereum?.networkVersion;

  const switchChain = async (chain) => {
    const { ethereum } = window;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId:
              chain === "ethereum"
                ? `0x${process.env.REACT_APP_NETWORK_CHAIN_ID}`
                : utils.hexValue(
                    Number(process.env.REACT_APP_POLYGON_CHAIN_ID)
                  ),
          },
        ],
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${process.env.REACT_APP_POLYGON_CHAIN_ID}`,
                chainName: "Maticmum",
                rpcUrls: ["https://polygonscan.com/"],
              },
            ],
          });
        } catch (addError) {
          console.log(addError);
        }
      }
    }
  };

  return (
    <div className="change--network--popup">
      <h2>Change Network</h2>
      <button
        className={`network--button`}
        onClick={() => switchChain("ethereum")}
      >
        <Image src={ethIcon} height={40} width={40} alt="eth-icon" />
        <div className="chain">
          <div>Ethereum</div>
          {chainId === process.env.REACT_APP_NETWORK_CHAIN_ID && (
            <p>Connected</p>
          )}
        </div>
      </button>
      <button
        className={`network--button `}
        onClick={() => switchChain("polygon")}
      >
        <Image src={polygonIcon} height={40} width={40} alt="polygon-icon" />
        <div className="chain">
          <div>Polygon</div>
          {chainId === process.env.REACT_APP_POLYGON_CHAIN_ID && (
            <p>Connected</p>
          )}
        </div>
      </button>
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </button>
    </div>
  );
};

export default ChangeNetworkPopup;
