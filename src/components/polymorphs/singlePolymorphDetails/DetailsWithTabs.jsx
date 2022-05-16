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

const DetailsWithTabs = ({ polymorphData }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [burnt, setBurnt] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
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
              <li>
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
        <div
          className={`polymorph--tab--item ${
            selectedTabIndex === 2 ? "active" : ""
          }`}
          onClick={() => setSelectedTabIndex(2)}
        >
          History
        </div>
      </div>
      <div className={`polymorph--tabs--content ${burnt ? "pb" : ""}`}>
        {selectedTabIndex === 0 && (
          <PolymorphPropertiesTab data={polymorphData} />
        )}
        {selectedTabIndex === 1 && <PolymorphMetadataTab />}
        {selectedTabIndex === 2 && <PolymorphHistoryTab />}
      </div>
      <div className="polymorph--actions">
        <div className="polymorph--actions--gradient"></div>
        {!burnt && (
          <div className="burn--to--mint--btn mr">
            <Button className="light-button" onClick={() => setBurnt(true)}>
              Burn to Mint
            </Button>
          </div>
        )}
        <div className="scramble--btn">
          {!burnt && (
            <div className="tooltiptext">
              Scrambling will be enabled after you burn your polymorph
            </div>
          )}
          <Button
            className="light-button"
            disabled={!burnt}
            onClick={() => setShowScramblePopup(true)}
          >
            Scramble
          </Button>
        </div>
      </div>

      <Popup closeOnDocumentClick={false} open={showScramblePopup}>
        {/* TODO: here need to pass the real data */}
        <PolymorphScramblePopup
          onClose={() => setShowScramblePopup(false)}
          // polymorph={polymorphData}
          // id={polymorphId}
          // setPolymorph={setPolymorphData}
          // setPolymorphGene={setPolymorphGene}
          setShowCongratulations={setShowCongratulations}
          setShowLoading={setShowLoading}
          setShowMetadataLoading={setShowMetadataLoading}
        />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showLoading}>
        <LoadingPopup onClose={() => setShowLoading(false)} />
      </Popup>

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
          // polymorph={polymorphData}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
