import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../popups/RarityRankPopup.jsx";
// import priceIcon from '../../../assets/images/eth-icon-new.svg';
import neverScrambledIcon from "../../assets/images/never-scrambled-badge.svg";
import singleTraitScrambledIcon from "../../assets/images/single-trait-scrambled-badge.svg";
import { getPolymorphMeta } from "../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../containers/rarityCharts/renderLoaders.js";
// import loadingBg from '../../../assets/images/mint-polymorph-loading-bg.png';
import SelectedSVG from "../../assets/images/activity-icons/Selected.svg";
import ThreeDotsSVG from "../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../assets/images/burn-to-mint-images/link-out.svg";
import Image from 'next/image';

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const PolymorphCard = ({ item, selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchMetadata = async () => {
    setLoading(true);
    const data = await getPolymorphMeta(item.tokenid);
    setLoading(false);
  };

  return loading ? (
    renderLoaderWithData(item)
  ) : (
    <div
      className={`card ${selected ? "selected" : ""}`}
      onClick={() => setSelected(item.tokenid)}
      aria-hidden="true"
    >
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
            <span className={`badge--version`}>V1</span>
            <span>{`ID: ${item.tokenid}`}</span>
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
          >
            <img src={ThreeDotsSVG} />
          </button>
        </div>
        {dropdownOpen ? (
          <div className={"dropdown"}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                window.open(`${marketplaceLinkOut}/${item.tokenid}`);
              }}
            >
              <img src={LinkOut} />
              View on marketplace
            </button>
          </div>
        ) : null}
      </div>

      <Popup open={showPopup} closeOnDocumentClick={false}>
        <RarityRankPopup onClose={() => setShowPopup(false)} item={item} />
      </Popup>
      {selected ? <img className={"checkmark"} src={SelectedSVG} /> : null}
    </div>
  );
};

PolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PolymorphCard;
