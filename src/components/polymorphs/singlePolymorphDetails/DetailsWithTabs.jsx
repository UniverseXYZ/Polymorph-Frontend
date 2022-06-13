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

const DetailsWithTabs = ({ polymorphData, isV1, update }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [burnt, setBurnt] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [contract, setContract] = useState(null);
  const [disableBurnButton, setDisableBurnButton] = useState(true);
  const [disableScrambleButton, setDisableScrambleButton] = useState(true);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [polymorphOwner, setPolymorphOwner] = useState("");
  const [morphPrice, setMorphPrice] = useState("");

  const { address } = useAuthStore();
  const { polymorphContract, polymorphContractV2 } = useContractsStore();
  const { setUserSelectedPolymorphsToBurn } = usePolymorphStore();

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
    update(true);
    console.log("show scrample popup again");
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

  useEffect(async () => {
    if (polymorphContract && polymorphContractV2) {
      try {
        if (await polymorphContract.ownerOf(polymorphData.tokenid)) {
          setContract(polymorphContract);
          setDisableBurnButton(false);
        }
      } catch (err) {
        if (await polymorphContractV2.ownerOf(polymorphData.tokenid)) {
          setContract(polymorphContractV2);
          setDisableScrambleButton(false);
          setBurnt(true);
        }
      }
    }
  }, [polymorphContract, polymorphContractV2]);

  useEffect(async () => {
    if (contract) {
      const owner = await contract.ownerOf(polymorphData.tokenid);
      setPolymorphOwner(owner);
      const isOwner = owner.toUpperCase() === address.toUpperCase();
      setUserIsOwner(isOwner);
      const morphPrice = await contract.priceForGenomeChange(
        polymorphData.tokenid
      );
      setMorphPrice(ethers.utils.formatEther(morphPrice));
    }
  }, [contract]);

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
              <li
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(`${marketplaceLinkOut}${contract?.address}/${polymorphData.tokenid}`);
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
      <div className={`polymorph--tabs--content ${burnt ? "pb" : ""}`}>
        {selectedTabIndex === 0 && (
          <PolymorphPropertiesTab data={polymorphData} isV1={isV1} />
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
          {!burnt && (
            <div className="burn--to--mint--btn mr">
              <Button
                className="light-button"
                disabled={disableBurnButton}
                onClick={handleBurnToMintClick}
              >
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
              disabled={!burnt && disableScrambleButton}
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
          polymorph={polymorphData}
          id={polymorphData.tokenid.toString()}
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

      {/* <Popup closeOnDocumentClick={false} open={showMetadataLoading}>
        TODO: here need to pass the real data
        <PolymorphMetadataLoading
          onClose={() => setShowMetadataLoading(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphData}
        />
      </Popup> */}

      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        {/* TODO: here need to pass the real data */}
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphData}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
