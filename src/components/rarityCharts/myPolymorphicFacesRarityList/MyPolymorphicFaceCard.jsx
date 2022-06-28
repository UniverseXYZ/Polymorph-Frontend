import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";
import { useContractsStore } from "src/stores/contractsStore";
import ScrambleIconSvg from "../../../assets/images/scramble-icon.svg";
import PolymorphicFaceScramblePopup from "@legacy/popups/PolymorphicFaceScramblePopup.jsx";
import LoadingPopup from "@legacy/popups/LoadingPopup.jsx";
import PolymorphScrambleCongratulationPopup from "@legacy/popups/PolymorphScrambleCongratulationPopup.jsx";
import Image from "next/image";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphicFaceCard = ({ polymorphItem, redirect }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [item, setItem] = useState(polymorphItem);
  const [update, setUpdate] = useState(false);
  const { polymorphicFacesContract } = useContractsStore();

  const showScrambleOptions = () => {
    setUpdate(true);
    setShowScramblePopup(true);
  };

  const handleScrambleClick = (event) => {
    event.stopPropagation();
    setShowScramblePopup(true);
  };

  const fetchMetadata = async () => {
    setLoading(true);
    const data = await getPolymorphMeta(item.tokenid);
    setLoading(false);
  };

  useEffect(() => {
    setItem(polymorphItem);
  }, [polymorphItem]);

  useEffect(async () => {
    if (update) {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_RARITY_METADATA_URL_V2}?ids=${polymorphItem.tokenid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const [data] = await response.json();
      setItem(data);
      setUpdate(false);
      setLoading(false);
    }
  }, [update]);

  const redirectHandler = () => {
    router.push(`/polymorphic-faces/${item.tokenid}`);
    redirect();
  };

  return loading ? (
    renderLoaderWithData(item)
  ) : (
    <div
      className="card faces--card"
      onClick={() =>
        !showScramblePopup &&
        !showLoading &&
        !showMetadataLoading &&
        !showCongratulations
          ? redirectHandler()
          : null
      }
      aria-hidden="true"
    >
      <div className="faces--card--body">
        <Image
          onError={fetchMetadata}
          className="rarity--chart"
          src={item.imageurl}
          alt={item.name}
          quality="25"
          width={500}
          height={500}
        ></Image>
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
            <img src={ThreeDotsSVG} alt="dropdown-icon" />
          </button>
        </div>
        {dropdownOpen ? (
          <div className={"dropdown faces--dropdown"}>
            <button onClick={handleScrambleClick}>
              <img src={ScrambleIconSvg} alt="link-icon" />
              Scramble
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                window.open(
                  `${marketplaceLinkOut}${polymorphicFacesContract.address}/${item.tokenid}`
                );
              }}
            >
              <img src={LinkOut} alt="link-icon" />
              View on marketplace
            </button>
          </div>
        ) : null}
      </div>
      {showScramblePopup ? (
        <Popup closeOnDocumentClick={false} open={showScramblePopup}>
          <PolymorphicFaceScramblePopup
            onClose={() => setShowScramblePopup(false)}
            polymorph={item}
            id={item.tokenid.toString()}
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
      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={item}
          isPolymorph={false}
          isPolymorphicFace={true}
        />
      </Popup>
    </div>
  );
};

MyPolymorphicFaceCard.propTypes = {
  polymorphItem: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MyPolymorphicFaceCard;
