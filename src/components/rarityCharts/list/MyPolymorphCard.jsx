import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../../popups/RarityRankPopup.jsx";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";
import { usePolymorphStore } from "../../../stores/polymorphStore";
import BurnIconSvg from "../../../assets/images/burn-icon.svg";
import ScrambleIconSvg from "../../../assets/images/scramble-icon.svg";
import PolymorphScramblePopup from "@legacy/popups/PolymorphScramblePopup.jsx";
import LoadingPopup from "@legacy/popups/LoadingPopup.jsx";
import PolymorphMetadataLoading from "@legacy/popups/PolymorphMetadataLoading.jsx";
import PolymorphScrambleCongratulationPopup from "@legacy/popups/PolymorphScrambleCongratulationPopup.jsx";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphCard = ({ item }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [polymorphToScramble, setPolymorphToScramble] = useState(null);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
  };

  const { userPolymorphsV2, setUserSelectedPolymorphsToBurn } =
    usePolymorphStore();
  const [isV2, setIsV2] = useState(
    userPolymorphsV2.some((token) => token.id === item.tokenid)
  );

  const handleBurnToMintClick = (event) => {
    event.stopPropagation();
    if (!isV2) {
      setUserSelectedPolymorphsToBurn([
        {
          tokenId: item.tokenid,
          imageUrl: item.imageurl,
        },
      ]);
      router.push(`/burn-to-mint/burn/single/${item.tokenid}`);
    }
  };

  const handleScrambleClick = (event) => {
    event.stopPropagation();
    if (isV2) {
      setPolymorphToScramble(item);
      setShowScramblePopup(true);
    }
  };

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
      onClick={() =>
        !showScramblePopup &&
        !showLoading &&
        !showMetadataLoading &&
        !showCongratulations
          ? router.push(`/polymorphs/${item.tokenid}`)
          : null
      }
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
          <div className={"badge--container"}>
            <span className={`badge--version${isV2 ? "--v2" : ""}`}>
              {isV2 ? "V2" : "V1"}
            </span>
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
            {!isV2 && (
              <button onClick={handleBurnToMintClick}>
                <img src={BurnIconSvg} />
                Burn to Mint
              </button>
            )}
            {isV2 && (
              <button onClick={handleScrambleClick}>
                <img src={ScrambleIconSvg} />
                Scramble
              </button>
            )}
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
      {showScramblePopup ? (
        <Popup closeOnDocumentClick={false} open={showScramblePopup}>
          <PolymorphScramblePopup
            onClose={() => setShowScramblePopup(false)}
            polymorph={item}
            id={item.tokenid}
            // setPolymorph={setPolymorphData}
            // setPolymorphGene={setPolymorphGene}
            setShowCongratulations={setShowCongratulations}
            setShowLoading={setShowLoading}
            setShowMetadataLoading={setShowMetadataLoading}
          />
        </Popup>
      ) : null}
      {showLoading ? (
        <Popup closeOnDocumentClick={false} open={showLoading}>
          <LoadingPopup onClose={() => setShowLoading(false)} />
        </Popup>
      ) : null}

      <Popup closeOnDocumentClick={false} open={showMetadataLoading}>
        {/* TODO: here need to pass the real data */}
        <PolymorphMetadataLoading
          onClose={() => setShowMetadataLoading(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          // polymorph={polymorphData}
        />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        {/* TODO: here need to pass the real data */}
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={item}
        />
      </Popup>
    </div>
  );
};

MyPolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MyPolymorphCard;
