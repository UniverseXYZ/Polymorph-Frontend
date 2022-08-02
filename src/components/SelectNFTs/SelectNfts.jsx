import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Button from "../button/Button";
import RarityFilters from "../rarityCharts/filters/RarityFilters";
import BurnRarityList from "./BurnRarityList";
import { useSearchPolymorphs } from "../../utils/hooks/useMyNftsRarityDebouncerV1";
import { categoriesArray } from "../../containers/rarityCharts/categories";
import { useWindowSize } from "react-use";
import Arrow from "../../assets/images/burn-to-mint-images/arrow-left.svg";
import SelectedNftsCarousel from "./SelectedNftsCarousel";
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
import { Tooltip } from "@chakra-ui/react";

const SelectNfts = () => {
  const { setUserSelectedPolymorphsToBurn } = usePolymorphStore();
  const router = useRouter();
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  const {
    isWalletConnected,
    setIsWalletConnected,
    connectWithWalletConnect,
    connectWithMetaMask,
    activeNetwork,
  } = useAuthStore((s) => ({
    isWalletConnected: s.isWalletConnected,
    setIsWalletConnected: s.setIsWalletConnected,
    connectWithWalletConnect: s.connectWithWalletConnect,
    connectWithMetaMask: s.connectWithMetaMask,
    activeNetwork: s.activeNetwork,
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
  } = useSearchPolymorphs();

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
        title={`Burn a Polymorph`}
        description={`Upgrade your Polymorph from a V1 to a V2 to unlock new features and content.`}
        image={OpenGraphImage}
      />
      {isWalletConnected && (
        <div className="select--nfts--container">
          {/* {stepData.selectedItem !== 'single' ? ( */}
          <>
            <div className="section--header">
              <div className="section--title--block">
                <Button
                  className={"button--back"}
                  onClick={() => router.push("/burn-to-mint")}
                >
                  <img src={Arrow} alt="arrow" /> Burn To Mint
                </Button>
                <h3 className="section--title">Choose Polymorphs</h3>
                <p className="section--hint--text">
                  Select polymorphs you’d like to burn from your wallet. You can
                  burn up to 20 Polymorphs at a time.
                </p>
              </div>
            </div>
            {results === null ? (
              <div className={"no--polymorphs--found"}>
                <LoadingSpinner />
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="rarity--charts--page--container">
                  <RarityFilters
                    setSortField={setSortField}
                    searchText={inputText}
                    setSearchText={setInputText}
                    setSortDir={setSortDir}
                    sortDir={sortDir}
                    setApiPage={setApiPage}
                    resetPagination={resetPagination}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesIndexes={categoriesIndexes}
                    setCategoriesIndexes={setCategoriesIndexes}
                    resultsCount={results.length}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    setFilter={setFilter}
                    filter={filter}
                  />
                  <BurnRarityList
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
                </div>
                <div className={"selected--cards--bar"}>
                  {mobile && (
                    <p>
                      NFTs: <b>{selectedCards.length}</b>
                    </p>
                  )}
                  <SelectedNftsCarousel
                    nfts={results}
                    selectedCards={selectedCards}
                    showArrows={showArrows}
                  />
                  <div className={"button--container"}>
                    {!mobile && (
                      <span>
                        NFTs: <b>{selectedCards.length}</b>
                      </span>
                    )}
                    <Tooltip hasArrow label="Only available on Ethereum">
                      <span>
                        <Button
                          className={"light-button"}
                          disabled={activeNetwork === "polygon"}
                          onClick={
                            selectedCards.length > 0
                              ? () => {
                                  router.push(
                                    selectedCards.length === 1
                                      ? `/burn-to-mint/burn/single/${selectedCards[0].tokenId}`
                                      : "/burn-to-mint/burn/batch"
                                  );
                                }
                              : null
                          }
                        >
                          Burn
                        </Button>
                      </span>
                    </Tooltip>
                  </div>
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
                close={() => router.push("/burn-to-mint")}
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

SelectNfts.propTypes = {
  stepData: PropTypes.oneOfType([PropTypes.object]),
  setStepData: PropTypes.func,
  bundleData: PropTypes.oneOfType([PropTypes.object]),
};

SelectNfts.defaultProps = {
  setStepData: () => {},
};

export default SelectNfts;
