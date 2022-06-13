import React, { useState, useEffect, useContext } from "react";
// import './SelectNfts.scss';
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Button from "../button/Button";
import closeIconWhite from "../../assets/images/marketplace/close.svg";
import mp3Icon from "../../assets/images/mp3-icon.png";
import AppContext from "../../ContextAPI";
// import SearchFilters from '../nft/SearchFilters';
import RarityFilters from "../rarityCharts/filters/RarityFilters";
import BurnRarityList from "./BurnRarityList";
import { useSearchPolymorphs } from "../../utils/hooks/useMyNftsRarityDebouncerV1";
import { categoriesArray } from "../../containers/rarityCharts/categories";
import NFTCard from "../nft/NFTCard";
import { useMyNftsStore } from "src/stores/myNftsStore";
import { WalletTab } from "@app/modules/account/pages/my-nfts-page/components";
import FiltersContextProvider from "../../app/modules/account/pages/my-nfts-page/components/search-filters/search-filters.context";
import { useWindowSize } from "react-use";
import Arrow from "../../assets/images/burn-to-mint-images/arrow-left.svg";
import SelectedNftsCarousel from "./SelectedNftsCarousel";
import BubbleIcon from "../../assets/images/text-bubble.png";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useThemeStore } from "src/stores/themeStore";
import { OpenGraph } from "@app/components";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";
import LoadingSpinner from "@legacy/svgs/LoadingSpinner";

const SelectNfts = (props) => {
  // const { myNFTs, setSellNFTBundleEnglishAuctionData } = useContext(AppContext);
  const { myNFTs } = useMyNftsStore();
  const { setUserSelectedPolymorphsToBurn } = usePolymorphStore();
  const { stepData, setStepData, bundleData } = props;
  const [selectedNFTsIds, setSelectedNFTsIds] = useState([]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState([]);
  const router = useRouter();
  const setDarkMode = useThemeStore((s) => s.setDarkMode);

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
  const [totalNfts, getTotalNfts] = useState("-");
  const [perPage, setPerPage] = useState(8);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showArrows, setShowArrows] = useState(false);

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

  const resetPagination = () => {
    // setMyUniverseNFTsActiverPage(0);
    setOffset(0);
  };

  const clickContinue = () => {
    let dataBundleSale = bundleData;
    dataBundleSale = { ...dataBundleSale, selectedNfts: selectedGalleryItem };
    setStepData({ ...stepData, settings: { ...dataBundleSale } });
    setSellNFTBundleEnglishAuctionData(bundleData);
    router.push("/nft-marketplace/summary");
  };

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  // useEffect(() => {
  //   const getSelectedNFTs = [];
  //   myNFTs.forEach((nft) => {
  //     if (selectedNFTsIds.includes(nft.id)) {
  //       getSelectedNFTs.push(nft);
  //     }
  //   });
  //   setSelectedGalleryItem(getSelectedNFTs);
  // }, [selectedNFTsIds]);

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
  console.log("results", results);
  return (
    <>
      <OpenGraph
        title={`Burn a Polymorph`}
        description={`Upgrade your Polymorph from a V1 to a V2 to unlock new features and content.`}
        image={OpenGraphImage}
      />
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
                  <Button
                    className={"light-button"}
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
