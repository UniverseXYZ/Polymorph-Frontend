import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import { getPolymorphMeta } from "../../../utils/api/polymorphs.js";
import { renderFacesLoaderWithData } from "../../../containers/rarityCharts/renderLoaders.js";
import { useRouter } from "next/router";
import ThreeDotsSVG from "../../../assets/images/three-dots-horizontal.svg";
import LinkOut from "../../../assets/images/burn-to-mint-images/link-out.svg";
import { useContractsStore } from "src/stores/contractsStore";
import ScrambleIconSvg from "../../../assets/images/scramble-icon.svg";
import PolymorphicFaceScramblePopup from "@legacy/popups/PolymorphicFaceScramblePopup.jsx";
import LoadingPopup from "@legacy/popups/LoadingPopup.jsx";
import PolymorphScrambleCongratulationPopup from "@legacy/popups/PolymorphScrambleCongratulationPopup.jsx";
import Image from "next/image";
import bridgeIcon from "../../../assets/images/bridge/bridge-icon.png";
import polygonIcon from "../../../assets/images/polygon-badge-icon.png";
import ethIcon from "../../../assets/images/eth-badge-icon.png";
import { useAuthStore } from "../../../stores/authStore";
import { Tooltip } from "@chakra-ui/react";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const MyPolymorphicFaceCard = ({ polymorphItem, redirect }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [item, setItem] = useState(polymorphItem);
  const [update, setUpdate] = useState(false);
  const { polymorphicFacesContract } = useContractsStore();
  const { activeNetwork } = useAuthStore();
  const [disableScrambleButton, setDisableScrambleButton] = useState(
    activeNetwork !== polymorphItem.network ? true : false
  );

  const [isOnPolygon, setIsOnPolygon] = useState();

  const showScrambleOptions = () => {
    setUpdate(true);
    setShowScramblePopup(true);
  };

  const handleScrambleClick = (event) => {
    event.stopPropagation();
    setDropdownOpen(false);
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

  useEffect(() => {
    if (item) {
      if (polymorphItem.network === "Ethereum") {
        setIsOnPolygon(false);
      } else {
        setIsOnPolygon(true);
      }
    }
  }, [item]);

  useEffect(async () => {
    if (update) {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_FACES_RARITY_METADATA_URL}?ids=${polymorphItem.tokenid}`,
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
    renderFacesLoaderWithData(item)
  ) : (
    <div
      className="card faces--card"
      onClick={() =>
        !showScramblePopup && !showLoading && !showCongratulations
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
      <div className="card--footer faces--card--footer">
        <div className="card--footer--top">
          <h2>{item.name}</h2>
        </div>
        <div className="card--footer--bottom">
          <div className={"badge--container"}>
            <span>{`ID: ${item.tokenid}`}</span>
            <span>
              {isOnPolygon ? (
                <Image src={polygonIcon} width={20} height={20} alt=''/>
              ) : (
                <Image src={ethIcon} width={18} height={18} alt=''/>
              )}
            </span>
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
          <div className={"dropdown faces--dropdown"}>
            <Tooltip
              hasArrow
              label={`${
                disableScrambleButton
                  ? `Only available on ${polymorphItem.network}`
                  : ""
              }`}
            >
              <span>
                <button
                  className={disableScrambleButton ? "disabled" : ""}
                  onClick={handleScrambleClick}
                  disabled={disableScrambleButton}
                >
                  <img src={ScrambleIconSvg} alt="link-icon" />
                  Scramble
                </button>
              </span>
            </Tooltip>
            <button onClick={(event) => {
              event.stopPropagation();
              router.push("/polymorphic-bridge");
            }}>
              <img src={bridgeIcon} alt="bridge" />
              Bridge NFT
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
