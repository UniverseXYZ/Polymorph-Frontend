import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";
import { usePolymorphStore } from "../../../stores/polymorphStore";
import { useContractsStore } from "src/stores/contractsStore";
import BurnIconSvg from "../../../assets/images/burn-icon.svg";
import ScrambleIconSvg from "../../../assets/images/scramble-icon.svg";
import PolymorphScramblePopup from "@legacy/popups/PolymorphScramblePopup.jsx";
import LoadingPopup from "@legacy/popups/LoadingPopup.jsx";
import PolymorphScrambleCongratulationPopup from "@legacy/popups/PolymorphScrambleCongratulationPopup.jsx";
import Image from "next/image";
import bridgeIcon from "../../../assets/images/bridge-icon.png";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphCard = ({ polymorphItem, redirect }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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
    router.push(`/polymorphs/${item.tokenid}`);
    redirect();
  };

  return loading ? (
    renderLoaderWithData(item)
  ) : (
    <div
      className="card"
      onClick={() =>
        !showScramblePopup && !showLoading && !showCongratulations
          ? redirectHandler()
          : null
      }
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
        ></Image>
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
            <img src={ThreeDotsSVG} alt="dropdown-icon" />
          </button>
        </div>
        {dropdownOpen ? (
          <div className={"dropdown"}>
            {!isV2 && (
              <button onClick={handleBurnToMintClick}>
                <img src={BurnIconSvg} alt="burn-icon" />
                Burn to Mint
              </button>
            )}
            {isV2 && (
              <button onClick={() => router.push("/polymorphic-bridge")}>
                <img src={bridgeIcon} alt="bridge" />
                Bridge NFT
              </button>
            )}
            {isV2 && (
              <button onClick={handleScrambleClick}>
                <img src={ScrambleIconSvg} alt="scramble-icon" />
                Scramble
              </button>
            )}
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
      <Popup closeOnDocumentClick={false} open={showScramblePopup}>
        <PolymorphScramblePopup
          onClose={() => setShowScramblePopup(false)}
          polymorph={item}
          id={item.tokenid.toString()}
          setShowCongratulations={setShowCongratulations}
          setShowLoading={setShowLoading}
        />
      </Popup>
      <Popup closeOnDocumentClick={false} open={showLoading}>
        <LoadingPopup onClose={() => setShowLoading(false)} />
      </Popup>
      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={item}
          isPolymorph={true}
          isPolymorphicFace={false}
        />
      </Popup>
    </div>
  );
};

MyPolymorphCard.propTypes = {
  polymorphItem: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MyPolymorphCard;
