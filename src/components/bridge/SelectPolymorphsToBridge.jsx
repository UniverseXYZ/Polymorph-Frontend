import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import PolymorphsBridgeList from "./PolymorphsBridgeList";
import { useSearchPolymorphsV2 } from "../../utils/hooks/useMyNftsRarityDebouncerV2";
import { categoriesArray } from "../../containers/rarityCharts/categories";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useThemeStore } from "src/stores/themeStore";
import { useAuthStore } from "src/stores/authStore";
import Popup from "reactjs-popup";
import SelectWalletPopup from "@legacy/popups/SelectWalletPopup";
import { CONNECTORS_NAMES } from "@legacy/dictionary";
import BridgeInteraction from "./BridgeInteraction";
import { useSearchPolymorphicFaces } from "@legacy/hooks/useMyFacesRarityDebouncer";

const SelectPolymorphsToBridge = ({ queryNft }) => {
  const { setUserSelectedNFTsToBridge } = usePolymorphStore();
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
  } =
    queryNft === "polymorphs"
      ? useSearchPolymorphsV2()
      : useSearchPolymorphicFaces();

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
  const { activeNetwork, setActiveNetwork } = useAuthStore();

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

  const getSelectedCards = ([cards]) => {
    setSelectedCards(cards);
    setUserSelectedNFTsToBridge(cards);
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
      {isWalletConnected && (
        <div className="bridge--nfts--container">
          <div className="bridge--components">
            <PolymorphsBridgeList
              data={results}
              searchText={inputText}
              setSearchText={setInputText}
              resetPagination={resetPagination}
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
              getSelectedCards={getSelectedCards}
              activeNetwork={activeNetwork}
              setActiveNetwork={setActiveNetwork}
              queryNft={queryNft}
            />
            <BridgeInteraction activeNetwork={activeNetwork} />
          </div>
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
