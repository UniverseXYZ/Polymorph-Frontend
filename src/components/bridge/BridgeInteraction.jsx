import Image from "next/image";
import polygonIcon from "../../assets/images/polygon-icon.png";
import ethereumIcon from "../../assets/images/eth-icon-blue.png";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useEffect } from "react";

const BridgeInteraction = ({ activeNetwork }) => {
  const { setUserSelectedNFTsToBridge, userSelectedNFTsToBridge } =
    usePolymorphStore();

  useEffect(() => {
    setUserSelectedNFTsToBridge([]);
  }, [activeNetwork]);

  return (
    <div className="bridge--interaction--container">
      <div className="header">
        <div>To Network</div>
        <div className="network">
          {activeNetwork === "Ethereum" && (
            <>
              <Image src={polygonIcon} width={24} height={24} alt="" />
              <div>Polygon</div>
            </>
          )}
          {activeNetwork === "Polygon" && (
            <>
              <Image src={ethereumIcon} width={24} height={24} alt="" />
              <div>Ethereum</div>
            </>
          )}
        </div>
      </div>
      <div className="body">
        <div className="selected--amount">
          <div>Selected NFTs</div>
          <div>
            {userSelectedNFTsToBridge ? userSelectedNFTsToBridge.length : "0"} /
            20
          </div>
        </div>
        <div className="estimate--indicators">
          <div>
            <div>Gas cost</div>
            <div>~ $5.24</div>
          </div>
          <div>
            <div>Transfer time</div>
            <div>~ 2 min</div>
          </div>
        </div>
        <div className="step">
          <div>Step 1</div>
          <button className="light-button">Approve Selected</button>
        </div>
        <div className="step">
          <div>Step 2</div>
          <button className="light-button">Transfer</button>
        </div>
        {activeNetwork === "polygon" && (
          <div className="step">
            <div>Step 3</div>
            <button className="light-button">Unlock</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BridgeInteraction;