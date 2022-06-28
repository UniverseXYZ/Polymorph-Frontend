import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RarityRankPopup from "../../popups/RarityRankPopup.jsx";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";
import { usePolymorphStore } from "../../../stores/polymorphStore";
import { useContractsStore } from "src/stores/contractsStore";
import BurnIconSvg from "../../../assets/images/burn-icon.svg";
import ScrambleIconSvg from "../../../assets/images/scramble-icon.svg";
import PolymorphicFaceScramblePopup from "@legacy/popups/PolymorphicFaceScramblePopup.jsx";
import LoadingPopup from "@legacy/popups/LoadingPopup.jsx";
import PolymorphMetadataLoading from "@legacy/popups/PolymorphMetadataLoading.jsx";
import PolymorphScrambleCongratulationPopup from "@legacy/popups/PolymorphScrambleCongratulationPopup.jsx";
import Image from "next/image";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphCard = ({ polymorphItem, redirect }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [polymorphToScramble, setPolymorphToScramble] = useState(null);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [item, setItem] = useState(polymorphItem);
  const [update, setUpdate] = useState(false);
  const [contract, setContract] = useState(null);
  const { polymorphContract, polymorphContractV2 } = useContractsStore();

  const showScrambleOptions = () => {
    setUpdate(true);
    setShowScramblePopup(true);
  };

  const { userPolymorphs, setUserSelectedPolymorphsToBurn } =
    usePolymorphStore();
  const [isV2, setIsV2] = useState("");

  useEffect(() => {
    if (item) {
      const [polymorphV1] = userPolymorphs.filter(
        (token) => token.id === item.tokenid
      );
      if (polymorphV1) {
        setIsV2(false);
        setContract(polymorphContract?.address);
      } else {
        setIsV2(true);
        setContract(polymorphContractV2?.address);
      }
    }
  }, [item]);

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
                window.open(`${marketplaceLinkOut}${contract}/${item.tokenid}`);
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
  polymorphItem: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MyPolymorphCard;
