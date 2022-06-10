import React from "react";
import ethIcon from "../../../assets/images/ETHicon.png";

const PolymorphMetadataCard = ({ metadata }) => {
  return (
    <div className="polymorph--metadata--card">
      <div className="card--label">{metadata.label}</div>
      {metadata.price ? (
        <div className="card--price">
          <img src={ethIcon} alt="eth" />
          {metadata.price}
        </div>
      ) : (
        <div className="card--address">{`${
          metadata?.address ? metadata.address.substring(0, 13) : ""
        }...${
          metadata?.address
            ? metadata.address.substring(metadata?.address?.length - 4)
            : ""
        }`}</div>
      )}
    </div>
  );
};

export default PolymorphMetadataCard;
