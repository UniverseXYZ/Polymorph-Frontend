import React, { useEffect, useState, useRef } from "react";
import Popup from "reactjs-popup";
import linkIcon from "../../../assets/images/rarity-charts/linkIcon.svg";
import Button from "@legacy/button/Button";
import PolymorphPropertiesTab from "../../polymorphs/singlePolymorphDetails/tabs/PolymorphPropertiesTab";
import PolymorphMetadataTab from "../../polymorphs/singlePolymorphDetails/tabs/PolymorphMetadataTab";
import PolymorphHistoryTab from "../../polymorphs/singlePolymorphDetails/tabs/PolymorphHistoryTab";
import PolymorphicFaceScramblePopup from "../../popups/PolymorphicFaceScramblePopup";
import LoadingPopup from "../../popups/LoadingPopup";
import PolymorphScrambleCongratulationPopup from "../../popups/PolymorphScrambleCongratulationPopup";
import { useContractsStore } from "src/stores/contractsStore";
import { useAuthStore } from "src/stores/authStore";
import { ethers } from "ethers";
import { usePolymorphStore } from "src/stores/polymorphStore";
import bridgeIcon from "../../../assets/images/bridge/bridge-icon.png";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const DetailsWithTabs = ({ polymorphicData, isV1, update }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [polymorphOwner, setPolymorphOwner] = useState("");
  const [morphPrice, setMorphPrice] = useState("");

  const { polymorphicFacesContract } = useContractsStore();
  const { userPolymorphicFacesAll } = usePolymorphStore();

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
    update(true);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  useEffect(() => {
    if (
      userPolymorphicFacesAll?.some(
        (polymorph) => polymorph.id === polymorphicData.tokenid
      )
    ) {
      setUserIsOwner(true);
    }
  }, [userPolymorphicFacesAll]);

  useEffect(async () => {
    if (polymorphicFacesContract) {
      const morphPrice = await polymorphicFacesContract.priceForGenomeChange(
        polymorphicData.tokenid
      );
      setMorphPrice(ethers.utils.formatEther(morphPrice));
      const ownerAddress = await polymorphicFacesContract.ownerOf(
        polymorphicData.tokenid
      );
      setPolymorphOwner(ownerAddress);
    }
  }, [polymorphicFacesContract]);

  return (
    <div className="polymorph--details--with--tabs">
      <div className="polymorph--header--section">
        <h1>{`${polymorphicData.name}`}</h1>
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
              <li onClick={() => router.push("/polymorphic-bridge")}>
                <img src={bridgeIcon} alt="View on Marketplace" />
                Bridge
              </li>
              <li
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(
                    `${marketplaceLinkOut}${polymorphicFacesContract?.address}/${polymorphicData.tokenid}`
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
      <div className="polymorph--desc">{polymorphicData.description}</div>
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
            data={polymorphicData}
            isPolymorph={false}
            isV1={isV1}
            isPolymorphicFace={true}
          />
        )}
        {selectedTabIndex === 1 && (
          <PolymorphMetadataTab
            morphPrice={morphPrice}
            owner={polymorphOwner}
            genome={polymorphicData?.currentgene}
          />
        )}
        {selectedTabIndex === 2 && <PolymorphHistoryTab />}
      </div>
      {userIsOwner ? (
        <div className="polymorph--actions">
          <div className="polymorph--actions--gradient"></div>
          <div className="scramble--btn">
            <Button
              className="light-button"
              onClick={() => setShowScramblePopup(true)}
            >
              Scramble
            </Button>
          </div>
        </div>
      ) : null}

      <Popup closeOnDocumentClick={false} open={showScramblePopup}>
        <PolymorphicFaceScramblePopup
          onClose={() => setShowScramblePopup(false)}
          polymorph={polymorphicData}
          id={polymorphicData.tokenid.toString()}
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
          polymorph={polymorphicData}
          isPolymorph={false}
          isPolymorphicFace={true}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
