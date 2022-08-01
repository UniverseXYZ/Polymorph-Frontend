import React, { useEffect, useState, useRef } from "react";
import Popup from "reactjs-popup";
import { useRouter } from "next/router";
import linkIcon from "../../../assets/images/rarity-charts/linkIcon.svg";
import Button from "@legacy/button/Button";
import PolymorphPropertiesTab from "./tabs/PolymorphPropertiesTab";
import PolymorphMetadataTab from "./tabs/PolymorphMetadataTab";
import PolymorphHistoryTab from "./tabs/PolymorphHistoryTab";
import PolymorphScramblePopup from "../../popups/PolymorphScramblePopup";
import LoadingPopup from "../../popups/LoadingPopup";
import PolymorphScrambleCongratulationPopup from "../../popups/PolymorphScrambleCongratulationPopup";
import { useContractsStore } from "src/stores/contractsStore";
import { ethers } from "ethers";
import bridgeIcon from "../../../assets/images/bridge/bridge-icon.png";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;
import { usePolymorphStore } from "src/stores/polymorphStore";

const DetailsWithTabs = ({ polymorphData, isV1, update }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [polymorphOwner, setPolymorphOwner] = useState("");
  const [morphPrice, setMorphPrice] = useState("");

  const { polymorphContract, polymorphContractV2 } = useContractsStore();
  const { setUserSelectedPolymorphsToBurn, userPolymorphsAll } =
    usePolymorphStore();

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
    update(true);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleBurnToMintClick = () => {
    setUserSelectedPolymorphsToBurn([
      {
        tokenId: polymorphData.tokenid,
        imageUrl: polymorphData.imageurl,
      },
    ]);
    router.push(`/burn-to-mint/burn/single/${polymorphData.tokenid}`);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  useEffect(() => {
    if (
      userPolymorphsAll?.some(
        (polymorph) => polymorph.id === polymorphData.tokenid
      )
    ) {
      setUserIsOwner(true);
    }
  }, [userPolymorphsAll]);

  useEffect(async () => {
    if (isV1 && polymorphContract) {
      const morphPrice = await polymorphContract.priceForGenomeChange(
        polymorphData.tokenid
      );
      setMorphPrice(ethers.utils.formatEther(morphPrice));
      const ownerAddress = await polymorphContract.ownerOf(
        polymorphData.tokenid
      );
      setPolymorphOwner(ownerAddress);
    }
    if (!isV1 && polymorphContractV2) {
      const morphPrice = await polymorphContractV2.priceForGenomeChange(
        polymorphData.tokenid
      );
      setMorphPrice(ethers.utils.formatEther(morphPrice));
      const ownerAddress = await polymorphContractV2.ownerOf(
        polymorphData.tokenid
      );
      setPolymorphOwner(ownerAddress);
    }
  }, [isV1, polymorphContract, polymorphContractV2]);

  return (
    <div className="polymorph--details--with--tabs">
      <div className="polymorph--header--section">
        <h1>{`${polymorphData.name}`}</h1>
        <div
          ref={ref}
          className="view--on--marketplace--dropdown"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span></span>
          <span></span>
          <span></span>
          {showDropdown && (
            <ul>
              {!isV1 && (
                <li onClick={() => router.push("/polymorphic-bridge")}>
                  <img src={bridgeIcon} alt="View on Marketplace" />
                  Bridge
                </li>
              )}
              <li
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(
                    `${marketplaceLinkOut}${contract?.address}/${polymorphData.tokenid}`
                  );
                }}
              >
                <img src={linkIcon} alt="View on Marketplace" />
                View on Marketplace
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="polymorph--desc">{polymorphData.description}</div>
      <div className="polymorph--tabs">
        <div
          className={`polymorph--tab--item ${
            selectedTabIndex === 0 ? "active" : ""
          }`}
          onClick={() => setSelectedTabIndex(0)}
        >
          Properties
        </div>
        <div
          className={`polymorph--tab--item ${
            selectedTabIndex === 1 ? "active" : ""
          }`}
          onClick={() => setSelectedTabIndex(1)}
        >
          Metadata
        </div>
        {/* <div
          className={`polymorph--tab--item ${
            selectedTabIndex === 2 ? "active" : ""
          }`}
          onClick={() => setSelectedTabIndex(2)}
        >
          History
        </div> */}
      </div>
      <div className={`polymorph--tabs--content ${!isV1 ? "pb" : ""}`}>
        {selectedTabIndex === 0 && (
          <PolymorphPropertiesTab
            data={polymorphData}
            isPolymorph={true}
            isV1={isV1}
            isPolymorphicFace={false}
          />
        )}
        {selectedTabIndex === 1 && (
          <PolymorphMetadataTab
            morphPrice={morphPrice}
            owner={polymorphOwner}
            genome={polymorphData?.currentgene}
          />
        )}
        {selectedTabIndex === 2 && <PolymorphHistoryTab />}
      </div>
      {userIsOwner ? (
        <div className="polymorph--actions">
          <div className="polymorph--actions--gradient"></div>
          {isV1 && (
            <div className="burn--to--mint--btn mr">
              <Button
                className="light-button"
                disabled={!isV1}
                onClick={handleBurnToMintClick}
              >
                Burn to Mint
              </Button>
            </div>
          )}
          <div className="scramble--btn">
            {isV1 && (
              <div className="tooltiptext">
                Scrambling will be enabled after you burn your polymorph
              </div>
            )}
            <Button
              className="light-button"
              disabled={isV1}
              onClick={() => setShowScramblePopup(true)}
            >
              Scramble
            </Button>
          </div>
        </div>
      ) : null}

      <Popup closeOnDocumentClick={false} open={showScramblePopup}>
        <PolymorphScramblePopup
          onClose={() => setShowScramblePopup(false)}
          polymorph={polymorphData}
          id={polymorphData.tokenid.toString()}
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
          polymorph={polymorphData}
          isPolymorph={true}
          isPolymorphicFace={false}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
