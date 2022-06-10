import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSearchPolymorphs } from "../../utils/hooks/useMyNftsRarityDebouncerAll";
import { categoriesArray } from "../../containers/rarityCharts/categories";
import MyRarityList from "../rarityCharts/list/MyRarityList";
import { useMyNftsStore } from "src/stores/myNftsStore";
import RarityFilters from "../rarityCharts/filters/RarityFilters";

const MyPolymorphsChart = ({
  isDropdownOpened,
  setIsDropdownOpened,
  scrollContainer,
}) => {
  const { setMyUniverseNFTsActiverPage, myUniverseNFTsActiverPage } =
    useMyNftsStore((s) => ({
      setMyUniverseNFTsActiverPage: s.setMyUniverseNFTsActiverPage,
      myUniverseNFTsActiverPage: s.myUniverseNFTsActiverPage,
    }));
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(9);
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
  } = useSearchPolymorphs(true);
  const [categories, setCategories] = useState(categoriesArray);
  const [categoriesIndexes, setCategoriesIndexes] = useState([]);

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

  // const scrollToNftContainer = () => {
  //   if (scrollContainer && scrollContainer.current) {
  //     scrollContainer.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "nearest",
  //     });
  //   }
  // };

  useEffect(() => {
    //scrollToNftContainer();
  }, [apiPage, perPage, categories, myUniverseNFTsActiverPage]);

  const resetPagination = () => {
    setMyUniverseNFTsActiverPage(0);
    setOffset(0);
    //scrollToNftContainer();
  };

  return (
    <div className="polymorph-rarity--charts--page--container">
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
        resultsCount={results?.length}
        handleCategoryFilterChange={handleCategoryFilterChange}
        setFilter={setFilter}
        filter={filter}
        loading={search.loading}
      />
      <MyRarityList
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
      />
    </div>
  );
};
MyPolymorphsChart.propTypes = {
  isDropdownOpened: PropTypes.bool.isRequired,
  setIsDropdownOpened: PropTypes.func.isRequired,
  scrollContainer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default MyPolymorphsChart;
