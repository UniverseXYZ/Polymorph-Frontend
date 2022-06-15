import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../../popups/RarityRankPopup.jsx";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import Image from 'next/image';

const PolymorphCard = ({ item, tab }) => {
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
    <div className="card" onClick={() => setShowPopup(true)} aria-hidden="true">
      <div className="card--header">
        <div className="card--number">{`#${item.rank}`}</div>
        <div className="card--price">{`Rarity Score: ${item.rarityscore}`}</div>
      </div>
      <div className="card--body">
        <Image
          onError={fetchMetadata}
          className="rarity--chart"
          src={item.imageurl}
          alt={item.name} 
          quality="25"
          width={500}
          height={500}
        >
        </Image>
      </div>
      <div className="card--footer">
        <div className="card--footer--top">
          <h2>{item.character}</h2>
        </div>
        <div className="card--footer--bottom">
          <div className={"badge--container"}>
            <span className={`badge--version${tab === "V2" ? "--v2" : ""}`}>
              {tab === "V2" ? "V2" : "V1"}
            </span>
            <span>{`ID: ${item.tokenid}`}</span>
          </div>{" "}
        </div>
      </div>
      <Popup open={showPopup} closeOnDocumentClick={false}>
        <RarityRankPopup
          onClose={() => setShowPopup(false)}
          item={item}
          tab={tab}
        />
      </Popup>
    </div>
  );
};

PolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PolymorphCard;
