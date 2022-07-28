import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import RaritySortBySelect from "../../input/RaritySortBySelect";
import RaritySortByOrder from "../../input/RaritySortByOrder";
import priceIcon from "../../../assets/images/eth-icon-new.svg";
import filterIcon from "../../../assets/images/filters-icon-black.svg";
// import './RarityFilters.scss';
import RarityChartFiltersPopup from "../../popups/RarityChartFiltersPopup";
import RaritySearchField from "../../input/RaritySearchField";
import { usePolymorphStore } from "src/stores/polymorphStore";

const RarityFilters = (props) => {
  const {
    floorPrice,
    searchText,
    setSearchText,
    setSortField,
    setSortDir,
    sortDir,
    setApiPage,
    resetPagination,
    categories,
    setCategories,
    categoriesIndexes,
    setCategoriesIndexes,
    resultsCount,
    handleCategoryFilterChange,
    setFilter,
    filter,
    CollectionFilter,
    loading,
    usedOnPage,
    activeVersion,
    setActiveVersion,
  } = props;

  const [selectedFiltersLength, setSelectedFiltersLength] = useState(0);
  const { userPolymorphsAll, userPolymorphicFaces } = usePolymorphStore();

  return (
    <div className="rarity--charts--search--and--filters--container">
      {usedOnPage === "Rarity" && (loading || resultsCount >= 0) ? (
        <div className="rarity--charts--search--and--filters--row">
          {/* <CollectionFilter /> */}
          <div className="rarity--charts--search--and--floor--price">
            <RaritySearchField
              placeholder="Search items"
              searchText={searchText}
              setSearchText={setSearchText}
              setApiPage={setApiPage}
              resetPagination={resetPagination}
            />
            <div className="mobile--filters">
              <Popup
                trigger={
                  <button type="button" className="light-button">
                    <img src={filterIcon} alt="Filter" />
                  </button>
                }
              >
                {(close) => (
                  <RarityChartFiltersPopup
                    close={close}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesIndexes={categoriesIndexes}
                    setCategoriesIndexes={setCategoriesIndexes}
                    selectedFiltersLength={selectedFiltersLength}
                    setSelectedFiltersLength={setSelectedFiltersLength}
                    resultsCount={resultsCount}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    setFilter={setFilter}
                    filter={filter}
                  />
                )}
              </Popup>
              {selectedFiltersLength !== 0 && (
                <div className="count">{selectedFiltersLength}</div>
              )}
            </div>
          </div>
          <RaritySortBySelect
            id="sort--select"
            defaultValue="Rarity Score"
            sortData={["Rarity Score", "Rank", "Polymorph Id"]}
            setSortField={setSortField}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          />
          <RaritySortByOrder
            setSortDir={setSortDir}
            sortDir={sortDir}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          />
        </div>
      ) : null}
      {usedOnPage === "My-polymorphs" &&
      (loading || userPolymorphsAll.length > 0) ? (
        <div className="rarity--charts--search--and--filters--row">
          {/* <CollectionFilter /> */}
          <div className="rarity--charts--search--and--floor--price">
            <RaritySearchField
              placeholder="Search items"
              searchText={searchText}
              setSearchText={setSearchText}
              setApiPage={setApiPage}
              resetPagination={resetPagination}
            />
            <div className="mobile--filters">
              <Popup
                trigger={
                  <button type="button" className="light-button">
                    <img src={filterIcon} alt="Filter" />
                  </button>
                }
              >
                {(close) => (
                  <RarityChartFiltersPopup
                    close={close}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesIndexes={categoriesIndexes}
                    setCategoriesIndexes={setCategoriesIndexes}
                    selectedFiltersLength={selectedFiltersLength}
                    setSelectedFiltersLength={setSelectedFiltersLength}
                    resultsCount={resultsCount}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    setFilter={setFilter}
                    filter={filter}
                    activeVersion={activeVersion}
                    setActiveVersion={setActiveVersion}
                  />
                )}
              </Popup>
              {selectedFiltersLength !== 0 && (
                <div className="count">{selectedFiltersLength}</div>
              )}
            </div>
          </div>
          <RaritySortBySelect
            id="sort--select"
            defaultValue="Rarity Score"
            sortData={["Rarity Score", "Rank", "Polymorph Id"]}
            setSortField={setSortField}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          />
          <RaritySortByOrder
            setSortDir={setSortDir}
            sortDir={sortDir}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          />
        </div>
      ) : null}
      {usedOnPage === "My-polymorphic-faces" &&
      (loading || userPolymorphicFaces.length > 0) ? (
        <div className="rarity--charts--search--and--filters--row faces">
          {/* <CollectionFilter /> */}
          <div className="rarity--charts--search--and--floor--price">
            <RaritySearchField
              placeholder="Search items"
              searchText={searchText}
              setSearchText={setSearchText}
              setApiPage={setApiPage}
              resetPagination={resetPagination}
            />
            <div className="mobile--filters">
              <Popup
                trigger={
                  <button type="button" className="light-button">
                    <img src={filterIcon} alt="Filter" />
                  </button>
                }
              >
                {(close) => (
                  <RarityChartFiltersPopup
                    close={close}
                    categories={categories}
                    setCategories={setCategories}
                    categoriesIndexes={categoriesIndexes}
                    setCategoriesIndexes={setCategoriesIndexes}
                    selectedFiltersLength={selectedFiltersLength}
                    setSelectedFiltersLength={setSelectedFiltersLength}
                    resultsCount={resultsCount}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    setFilter={setFilter}
                    filter={filter}
                  />
                )}
              </Popup>
              {selectedFiltersLength !== 0 && (
                <div className="count">{selectedFiltersLength}</div>
              )}
            </div>
          </div>
          {/* <RaritySortBySelect
            id="sort--select"
            defaultValue="Polymorph Id"
            sortData={["Rarity Score", "Rank", "Polymorph Id"]}
            setSortField={setSortField}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          /> */}
          <RaritySortByOrder
            setSortDir={setSortDir}
            sortDir={sortDir}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
          />
        </div>
      ) : null}
    </div>
  );
};

RarityFilters.propTypes = {
  floorPrice: PropTypes.shape({
    price: PropTypes.number,
    priceType: PropTypes.string,
  }),
  searchText: PropTypes.string,
  setSearchText: PropTypes.func.isRequired,
  setSortField: PropTypes.func.isRequired,
  setSortDir: PropTypes.func.isRequired,
  sortDir: PropTypes.string.isRequired,
  setApiPage: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategories: PropTypes.func.isRequired,
  categoriesIndexes: PropTypes.oneOfType([PropTypes.array]).isRequired,
  filter: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategoriesIndexes: PropTypes.func.isRequired,
  resultsCount: PropTypes.number,
  handleCategoryFilterChange: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  CollectionFilter: PropTypes.elementType,
};

RarityFilters.defaultProps = {
  floorPrice: { price: 0.8, priceIcon },
  searchText: "",
  CollectionFilter: () => <></>,
};

export default RarityFilters;
