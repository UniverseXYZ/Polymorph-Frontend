import React, { useEffect, useState } from "react";
import RarityFilters from "../../components/rarityCharts/filters/RarityFilters";
import Welcome from "../../components/rarityCharts/welcome/Welcome";
// import './RarityCharts.scss';
import { useSearchPolymorphs } from "../../utils/hooks/useRarityDebouncer";
import { categoriesArray } from "./categories";
import RarityList from "../../components/rarityCharts/list/RarityList";
import { useThemeStore } from "src/stores/themeStore";
import { useMyNftsStore } from "src/stores/myNftsStore";
import OpenGraphImage from "@assets/images/open-graph/polymorphs-rarity-charts.png";
import { OpenGraph } from "@app/components";

const RarityCharts = () => {
  const setMyUniverseNFTsActiverPage = useMyNftsStore(
    (s) => s.setMyUniverseNFTsActiverPage
  );
  const setDarkMode = useThemeStore((s) => s.setDarkMode);
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
  } = useSearchPolymorphs("V1");

  const [categories, setCategories] = useState(categoriesArray);
  const [categoriesIndexes, setCategoriesIndexes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("V1");

  useEffect(() => {
    setDarkMode(true);
  }, []);

  const resetPagination = () => {
    setMyUniverseNFTsActiverPage(0);
    setOffset(0);
  };

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

  return (
    <div className="rarity--charts--page">
      <OpenGraph
        title={"Polymorph Rarity Chart"}
        description={
          "Check who has the rarest polymorph with Universe rarity chart."
        }
        image={OpenGraphImage}
      />
      <Welcome />
      <div className={"tabs--container"}>
        <div
          className={`tab ${selectedTab === "V1" ? "active" : "inactive"}`}
          onClick={() => setSelectedTab("V1")}
        >
          Polymorphs V1
        </div>
        <div
          className={`tab ${selectedTab === "V2" ? "active" : "inactive"}`}
          onClick={() => setSelectedTab("V2")}
        >
          Polymorphs V2
        </div>
      </div>
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
        <RarityList
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
    </div>
  );
};

export default RarityCharts;
