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
import { utils } from "ethers";
import polymorphicFaces from "../../../abis/PolymorphicFacesRoot.json";
import { Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;

const DetailsWithTabs = ({ polymorphicData, isV1, update, blockchain }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [polymorphOwnerAddress, setPolymorphOwnerAddress] = useState("");
  const [morphPrice, setMorphPrice] = useState("");
  const [contract, setContract] = useState("");
  const [disableMorphing, setDisableMorphing] = useState(true);
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);

  const {
    polymorphicFacesContract,
    polymorphicFacesContractPolygon,
    wrappedEthContract,
  } = useContractsStore();
  const { userPolymorphicFacesAll } = usePolymorphStore();
  const { address, activeNetwork } = useAuthStore();

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
    if (isV1 && blockchain === "Ethereum") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_ETHEREUM
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS,
        polymorphicFaces?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorphicData.tokenid
      );
      const price = utils.formatEther(fetchedPrice.toNumber());
      const owner = await contractInstance.ownerOf(polymorphicData.tokenid);
      setMorphPrice(price);
      setPolymorphOwnerAddress(owner);
      setContract(polymorphicFacesContract);
    }
    if (isV1 && blockchain === "Polygon") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_POLYGON
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_POLYGON_ADDRESS,
        polymorphicFaces?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorphicData.tokenid
      );
      const price = utils.formatEther(fetchedPrice);
      const owner = await contractInstance.ownerOf(polymorphicData.tokenid);
      setMorphPrice(price);
      setPolymorphOwnerAddress(owner);
      setContract(polymorphicFacesContractPolygon);
    }
  }, [blockchain]);

  useEffect(() => {
    if (activeNetwork && polymorphicData.network) {
      if (activeNetwork !== polymorphicData.network) {
        setDisableMorphing(true);
      }
      if (activeNetwork === polymorphicData.network) {
        setDisableMorphing(false);
      }
    }
  }, [activeNetwork, polymorphicData.network]);

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
            contractAddress={
              blockchain === "Ethereum"
                ? process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS
                : process.env
                    .REACT_APP_POLYMORPHIC_FACES_CONTRACT_POLYGON_ADDRESS
            }
            tokenId={polymorphicData.tokenid.toString()}
            tokenStandard={"ERC-721"}
            network={blockchain}
            morphPrice={morphPrice}
            owner={polymorphOwnerAddress}
            genome={polymorphicData?.currentgene}
          />
        )}
        {selectedTabIndex === 2 && <PolymorphHistoryTab />}
      </div>
      {userIsOwner ? (
        <div className="polymorph--actions">
          <div className="polymorph--actions--gradient"></div>
          <div className="scramble--btn">
            <Tooltip
              hasArrow
              label={`${
                disableMorphing
                  ? `Only available on ${polymorphicData.network}`
                  : ""
              }`}
            >
              <span>
                <Button
                  className="light-button"
                  onClick={() => setShowScramblePopup(true)}
                  disabled={disableMorphing}
                >
                  Scramble
                </Button>
              </span>
            </Tooltip>
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
          morphPrice={morphPrice}
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
