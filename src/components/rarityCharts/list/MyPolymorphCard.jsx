import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../../popups/RarityRankPopup.jsx";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphCard = ({ item }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      className="card"
      onClick={() => router.push(`/polymorphs/${item.tokenid}`)}
      aria-hidden="true"
    >
      <div className="card--header">
        <div className="card--number">{`#${item.rank}`}</div>
        <div className="card--price">{`Rarity Score: ${item.rarityscore}`}</div>
      </div>
      <div className="card--body">
        <img
          onError={fetchMetadata}
          className="rarity--chart"
          src={item.imageurl}
          alt={item.name}
        />
      </div>
      <div className="card--footer">
        <div className="card--footer--top">
          <h2>{item.character}</h2>
        </div>
        <div className="card--footer--bottom">
          <span>{`ID: ${item.tokenid}`}</span>
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
    </div>
  );
};

MyPolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MyPolymorphCard;
