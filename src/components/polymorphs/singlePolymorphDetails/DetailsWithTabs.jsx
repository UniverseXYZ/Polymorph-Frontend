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
import { BigNumber, utils, ethers } from "ethers";
import bridgeIcon from "../../../assets/images/bridge/bridge-icon.png";
import polymorphV1 from "../../../abis/PolymorphWithGeneChanger.json";
import polymorphV2 from "../../../abis/PolymorphRoot.json";
import { Tooltip } from "@chakra-ui/react";

const marketplaceLinkOut =
  process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE;
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useAuthStore } from "src/stores/authStore";

const DetailsWithTabs = ({ polymorphData, isV1, update, blockchain }) => {
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
  const [isOnPolygon, setIsOnPolygon] = useState(false);
  const [contract, setContract] = useState("");
  const [disableMorphing, setDisableMorphing] = useState(true);

  const { polymorphContract, polymorphContractV2, polymorphContractV2Polygon } =
    useContractsStore();
  const { setUserSelectedPolymorphsToBurn, userPolymorphsAll } =
    usePolymorphStore();
  const { activeNetwork } = useAuthStore();

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
    if (isV1 && blockchain === "Ethereum") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_ETHEREUM
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
        polymorphV1?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorphData.tokenid
      );
      const price = utils.formatEther(fetchedPrice.toNumber());
      const owner = await contractInstance.ownerOf(polymorphData.tokenid);
      setMorphPrice(price);
      setPolymorphOwnerAddress(owner);
      setContract(polymorphContract);
    }
    if (!isV1 && blockchain === "Ethereum") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_ETHEREUM
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS,
        polymorphV2?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorphData.tokenid
      );
      const price = utils.formatEther(fetchedPrice.toNumber());
      const owner = await contractInstance.ownerOf(polymorphData.tokenid);
      setMorphPrice(price);
      setPolymorphOwnerAddress(owner);
      setContract(polymorphContractV2);
    }
    if (!isV1 && blockchain === "Polygon") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_POLYGON
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_POLYGON_ADDRESS,
        polymorphV2?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorphData.tokenid
      );
      const price = utils.formatEther(fetchedPrice.toNumber());
      const owner = await contractInstance.ownerOf(polymorphData.tokenid);
      setMorphPrice(price);
      setPolymorphOwnerAddress(owner);
      setContract(polymorphContractV2Polygon);
    }
  }, [blockchain]);

  useEffect(() => {
    if (activeNetwork && polymorphData.network) {
      if (activeNetwork !== polymorphData.network) {
        setDisableMorphing(true);
      }
      if (activeNetwork === polymorphData.network) {
        setDisableMorphing(false);
      }
    }
  }, [activeNetwork, polymorphData.network]);

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
            contractAddress={
              isV1
                ? process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS
                : !isV1 && blockchain === "Ethereum"
                ? process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS
                : !isV1 && blockchain === "Polygon"
                ? process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_POLYGON_ADDRESS
                : ""
            }
            tokenId={polymorphData.tokenid.toString()}
            tokenStandard={"ERC-721"}
            network={blockchain}
            morphPrice={morphPrice}
            owner={polymorphOwnerAddress}
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
              <Tooltip
                hasArrow
                label={`${
                  activeNetwork !== "Ethereum"
                    ? `Only available on Ethereum`
                    : ""
                }`}
              >
                <span>
                  <Button
                    className="light-button"
                    disabled={!isV1 || activeNetwork !== "Ethereum"}
                    onClick={handleBurnToMintClick}
                  >
                    Burn to Mint
                  </Button>
                </span>
              </Tooltip>
            </div>
          )}
          <div className="scramble--btn">
            {isV1 && (
              <div className="tooltiptext">
                Scrambling will be enabled after you burn your polymorph
              </div>
            )}
            <Tooltip
              hasArrow
              label={`${
                disableMorphing && !isV1
                  ? `Only available on ${polymorphData.network}`
                  : ""
              }`}
            >
              <span>
                <Button
                  className="light-button"
                  disabled={isV1 || disableMorphing}
                  onClick={() => setShowScramblePopup(true)}
                >
                  Scramble
                </Button>
              </span>
            </Tooltip>
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
          polymorph={polymorphData}
          isPolymorph={true}
          isPolymorphicFace={false}
        />
      </Popup>
    </div>
  );
};

export default DetailsWithTabs;
