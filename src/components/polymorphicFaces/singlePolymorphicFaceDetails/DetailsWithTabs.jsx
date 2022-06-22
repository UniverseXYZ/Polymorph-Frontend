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
import PolymorphMetadataLoading from "../../popups/PolymorphMetadataLoading";
import PolymorphScrambleCongratulationPopup from "../../popups/PolymorphScrambleCongratulationPopup";
import { useContractsStore } from "src/stores/contractsStore";
import { useAuthStore } from "src/stores/authStore";
import { ethers } from "ethers";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;
import { usePolymorphStore } from "src/stores/polymorphStore";

const DetailsWithTabs = ({ polymorphicData, isV1, update }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [burnt, setBurnt] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [polymorphOwner, setPolymorphOwner] = useState("");
  const [morphPrice, setMorphPrice] = useState("");

  const { polymorphContract } = useContractsStore();
  const { userPolymorphsAll } = usePolymorphStore();

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
      userPolymorphsAll?.some(
        (polymorph) => polymorph.id === polymorphicData.tokenid
      )
    ) {
      setUserIsOwner(true);
    }
  }, [userPolymorphsAll]);

  useEffect(async () => {
    if (polymorphContract) {
      const morphPrice = await polymorphContract.priceForGenomeChange(
        polymorphicData.tokenid
      );
      setMorphPrice(ethers.utils.formatEther(morphPrice));
      const ownerAddress = await polymorphContract.ownerOf(
        polymorphicData.tokenid
      );
      setPolymorphOwner(ownerAddress);
    }
  }, [polymorphContract]);

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
              <li
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(
                    `${marketplaceLinkOut}${contract?.address}/${polymorphicData.tokenid}`
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
          <PolymorphPropertiesTab data={polymorphicData} isV1={isV1} />
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
        {/* TODO: here need to pass the real data */}
        <PolymorphScramblePopup
          onClose={() => setShowScramblePopup(false)}
          polymorph={polymorphicData}
          id={polymorphicData.tokenid.toString()}
          // setPolymorph={polymorphicData}
          // setPolymorphGene={setPolymorphGene}
          setShowCongratulations={setShowCongratulations}
          setShowLoading={setShowLoading}
          setShowMetadataLoading={setShowMetadataLoading}
        />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showLoading}>
        <LoadingPopup onClose={() => setShowLoading(false)} />
      </Popup>

      {/* <Popup closeOnDocumentClick={false} open={showMetadataLoading}>
        TODO: here need to pass the real data
        <PolymorphMetadataLoading
          onClose={() => setShowMetadataLoading(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphicData}
        />
      </Popup> */}

      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        {/* TODO: here need to pass the real data */}
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphicData}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
