import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Button from "../button/Button";
import RarityFilters from "../rarityCharts/filters/RarityFilters";
import PolymorphsBridgeList from "./PolymorphsBridgeList";
import { useSearchPolymorphsV2 } from "../../utils/hooks/useMyNftsRarityDebouncerV2";
import { categoriesArray } from "../../containers/rarityCharts/categories";
import { useWindowSize } from "react-use";
import Arrow from "../../assets/images/burn-to-mint-images/arrow-left.svg";
// import SelectedNftsCarousel from "./SelectedNftsCarousel";
import BubbleIcon from "../../assets/images/text-bubble.png";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useThemeStore } from "src/stores/themeStore";
import { OpenGraph } from "../open-graph";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";
import LoadingSpinner from "@legacy/svgs/LoadingSpinner";
import { useAuthStore } from "src/stores/authStore";
import Popup from "reactjs-popup";
import SelectWalletPopup from "@legacy/popups/SelectWalletPopup";
import { CONNECTORS_NAMES } from "@legacy/dictionary";
import BridgeInteraction from "./BridgeInteraction";

const SelectPolymorphsToBridge = () => {
  const { setUserSelectedPolymorphsToBurn } = usePolymorphStore();
  const router = useRouter();
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  const {
    isWalletConnected,
    setIsWalletConnected,
    connectWithWalletConnect,
    connectWithMetaMask,
  } = useAuthStore((s) => ({
    isWalletConnected: s.isWalletConnected,
    setIsWalletConnected: s.setIsWalletConnected,
    connectWithWalletConnect: s.connectWithWalletConnect,
    connectWithMetaMask: s.connectWithMetaMask,
  }));

  const {
    inputText,
    setInputText,
    apiPage,
    setApiPage,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    filter,
    setFilter,
    search,
    results,
    isLastPage,
    setIsLastPage,
  } = useSearchPolymorphsV2();

  const [categories, setCategories] = useState(categoriesArray);
  const [categoriesIndexes, setCategoriesIndexes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [showInstallWalletPopup, setShowInstallWalletPopup] = useState(false);
  const [showSelectWallet, setShowSelectWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [installed, setInstalled] = useState(
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
      ? true
      : false
  );

  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();

  const handleCategoryFilterChange = (idx, traitIdx) => {
    const newCategories = [...categories];
    const attribute = newCategories[idx];
    const trait = attribute.traits[traitIdx];
    trait.checked = !trait.checked;
    setCategories(newCategories);
    let newFilter = [];
    if (trait.checked) {
      newFilter = [...filter, [attribute.value, trait.name]];
    } else if (
      attribute.value === "righthand" ||
      attribute.value === "lefthand"
    ) {
      newFilter = filter.filter(
        (f) => !(f[0] === attribute.value && f[1] === trait.name)
      );
    } else {
      newFilter = filter.filter((f) => f[1] !== trait.name);
    }
    setFilter(newFilter);
  };

  const handleConnectWallet = async (wallet) => {
    // Here need to check if selected wallet is installed in browser
    setSelectedWallet(wallet);
    if (installed) {
      if (
        wallet === CONNECTORS_NAMES.MetaMask &&
        typeof window.ethereum !== "undefined"
      ) {
        await connectWithMetaMask();
        setShowSelectWallet(false);
      } else if (wallet === CONNECTORS_NAMES.WalletConnect) {
        await connectWithWalletConnect();
        setIsWalletConnected(true);
        setShowSelectWallet(false);
      }
    } else {
      setShowInstallWalletPopup(true);
    }
  };

  const resetPagination = () => {
    // setMyUniverseNFTsActiverPage(0);
    setOffset(0);
  };

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  const getSelectedCards = ([cards]) => {
    setSelectedCards(cards);
    setUserSelectedPolymorphsToBurn(cards);
  };

  useEffect(() => {
    setDarkMode(false);
  }, []);

  useEffect(() => {
    function handleResize() {
      let horizontalScrollerWidth = document.querySelector(
        ".horizontal--scroller"
      )?.offsetWidth;
      let selectedNftsWrapperWidth = document.querySelector(
        ".selected--nfts--wrapper"
      )?.offsetWidth;
      if (horizontalScrollerWidth > selectedNftsWrapperWidth) {
        setShowArrows(true);
      } else {
        setShowArrows(false);
      }
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <OpenGraph
        title={`Bridge a Polymorph`}
        description={`Scramble your V2 polymorphs with low transaction fees on Polygon.`}
        image={OpenGraphImage}
      />
      {isWalletConnected && (
        <div className="bridge--nfts--container">
          <>
            {results === null ? (
              <div className={"no--polymorphs--found"}>
                <LoadingSpinner />
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="bridge--components">
                  <PolymorphsBridgeList
                    data={results}
                    isLastPage={isLastPage}
                    perPage={perPage}
                    offset={offset}
                    setOffset={setOffset}
                    setPerPage={setPerPage}
                    setApiPage={setApiPage}
                    setIsLastPage={setIsLastPage}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesIndexes={categoriesIndexes}
                    setCategoriesIndexes={setCategoriesIndexes}
                    setFilter={setFilter}
                    filter={filter}
                    loading={search.loading}
                    results={results}
                    apiPage={apiPage}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    getSelectedCards={getSelectedCards}
                  />
                  <BridgeInteraction />
                </div>
              </>
            ) : (
              <div className={"no--polymorphs--found"}>
                <img src={BubbleIcon} alt="bubble" />
                <p>You have no V1 Polymorphs to burn</p>
                <Button
                  className={"light-button"}
                  onClick={() => router.push("/burn-to-mint")}
                >
                  Go Back
                </Button>
              </div>
            )}
          </>
        </div>
      )}
      {!isWalletConnected && typeof window !== "undefined" && (
        <div className="connect--wallet">
          <Popup closeOnDocumentClick={false} open={!isWalletConnected}>
            {(close) => (
              <SelectWalletPopup
                close={() => router.push("/")}
                handleConnectWallet={handleConnectWallet}
                showInstallWalletPopup={showInstallWalletPopup}
                setShowInstallWalletPopup={setShowInstallWalletPopup}
                selectedWallet={selectedWallet}
                setSelectedWallet={setSelectedWallet}
              />
            )}
          </Popup>
        </div>
      )}
    </>
  );
};

SelectPolymorphsToBridge.propTypes = {
  stepData: PropTypes.oneOfType([PropTypes.object]),
  setStepData: PropTypes.func,
  bundleData: PropTypes.oneOfType([PropTypes.object]),
};

SelectPolymorphsToBridge.defaultProps = {
  setStepData: () => {},
};

export default SelectPolymorphsToBridge;
