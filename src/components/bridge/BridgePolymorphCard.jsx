import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../popups/RarityRankPopup.jsx";
import { getPolymorphMeta } from "../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../containers/rarityCharts/renderLoaders.js";
import SelectedSVG from "../../assets/images/activity-icons/Selected.svg";
import Image from "next/image";

const PolymorphCard = ({ item, selected, setSelected, nft }) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fetchMetadata = async () => {
    setLoading(true);
    const data = await getPolymorphMeta(item.tokenid);
    setLoading(false);
  };

  return loading ? (
    renderLoaderWithData(item)
  ) : (
    <div
      className={`card ${selected ? "selected" : ""} ${
        nft === "polymorphic-faces" ? "card--faces" : ""
      }`}
      onClick={() => item.network !== "Pending" && setSelected(item.tokenid)}
      aria-hidden="true"
    >
      {item.network === "Pending" && <div className="pending-overlay"></div>}
      {nft === "polymorphs" && (
        <div className="card--header">
          <div className="card--number">{`#${item.rank}`}</div>
          <div className="card--price">{`Rarity Score: ${item.rarityscore}`}</div>
        </div>
      )}
      <div
        className={`card--body ${
          nft === "polymorphic-faces" ? "card--faces--body" : ""
        }`}
      >
        <Image
          onError={fetchMetadata}
          className="rarity--chart"
          src={item.imageurl}
          alt={item.name}
          quality="25"
          width={500}
          height={500}
        />
      </div>
      <div
        className={`card--footer ${
          nft === "polymorphic-faces" ? "card--faces--footer" : ""
        }`}
      >
        <div className="card--footer--top">
          <h2>{nft === "polymorphs" ? item.character : item.name}</h2>
        </div>
        <div className="card--footer--bottom">
          <div className={"badge--container"}>
            {nft === "polymorphs" && (
              <span className={`badge--version--v2`}>V2</span>
            )}
            <span>{`ID: ${item.tokenid}`}</span>
          </div>
        </div>
      </div>
      <Popup open={showPopup} closeOnDocumentClick={false}>
        <RarityRankPopup onClose={() => setShowPopup(false)} item={item} />
      </Popup>
      {selected ? (
        <img className={"checkmark"} src={SelectedSVG} alt="checkmark-icon" />
      ) : null}
    </div>
  );
};

PolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PolymorphCard;
