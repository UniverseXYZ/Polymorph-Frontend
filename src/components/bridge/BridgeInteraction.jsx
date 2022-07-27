import Image from "next/image";
import polygonIcon from "../../assets/images/polygon--icon.png";

const BridgeInteraction = () => {
  return (
    <div className="container">
      <div className="header">
        <div>To Network</div>
        <div className="network">
          <Image src={polygonIcon} width={24} height={24} />
          <div>Polygon</div>
        </div>
      </div>
      <div className="body">
        <div className="selected--amount">
          <div>Selected NFTs</div>
          <div>2 / 20</div>
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
        <div className="step">
          <div>Step 3</div>
          <button className="light-button">Unlock</button>
        </div>
      </div>
    </div>
  );
};

export default BridgeInteraction;
