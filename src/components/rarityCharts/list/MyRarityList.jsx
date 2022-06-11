/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import './RarityList.scss';
// import uuid from 'react-uuid';
import MyPolymorphCard from "./MyPolymorphCard";
import ItemsPerPageDropdown from "../../pagination/ItemsPerPageDropdown";
import Pagination from "../../pagination/Pagionation";
// import '../../../containers/rarityCharts/RarityCharsLoader.scss';
// import '../../../containers/rarityCharts/RarityCharts.scss';
import closeIcon from "../../../assets/images/close-menu.svg";
import { renderLoaders } from "../../../containers/rarityCharts/renderLoaders";
import CategoriesFilter from "./CategoriesFilter";
import RarityChartsLoader from "../../../containers/rarityCharts/RarityChartsLoader";
import RarityPagination from "./RarityPagination";
import LoadingSpinner from "@legacy/svgs/LoadingSpinner";
import Popup from "reactjs-popup";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { Button } from "@chakra-ui/react";
import BubbleIcon from "../../../assets/images/text-bubble.png";

const marketplaceLink = "https://universe.xyz/marketplace";

const MyRarityList = ({
  data,
  perPage,
  offset,
  isLastPage,
  setPerPage,
  setOffset,
  setApiPage,
  setIsLastPage,
  categories,
  setCategories,
  categoriesIndexes,
  setCategoriesIndexes,
  setFilter,
  filter,
  loading,
  results,
  apiPage,
  handleCategoryFilterChange,
}) => {
  const sliceData = data?.slice(offset, offset + perPage) || [];
  const emptySlots = perPage - sliceData.length || 4;
  const [showClearALL, setShowClearALL] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { userPolymorphsAll } = usePolymorphStore();

  const handleClearAll = () => {
    const newCategories = [...categories];
    newCategories.forEach((item) => {
      item.traits.forEach((trait) => {
        trait.checked = false;
      });
    });
    setCategories(newCategories);
    setFilter([]);
  };

  const removeSelectedFilter = (idx, traitIdx) => {
    const newCategories = [...categories];
    const attribute = newCategories[idx];
    const trait = attribute.traits[traitIdx];
    attribute.traits[traitIdx].checked = false;
    let newFilter = [];
    if (attribute.value === "righthand" || attribute.value === "lefthand") {
      newFilter = filter.filter(
        (f) => !(f[0] === attribute.value && f[1] === trait.name)
      );
    } else {
      newFilter = filter.filter((f) => f[1] !== trait.name);
    }
    setCategories(newCategories);
    setFilter(newFilter);
  };

  const redirectHandler = () => {
    setRedirect(true);
  };

  useEffect(() => {
    let check = false;
    categories.forEach((item) => {
      const res = item.traits.filter((i) => i.checked);
      if (res.length) {
        check = true;
      }
    });
    if (check) {
      setShowClearALL(true);
    } else {
      setShowClearALL(false);
    }
  }, [categories]);

  return (
    <div
      className={`rarity--charts--list ${
        loading || userPolymorphsAll.length > 0 ? "" : "unset--grid"
      }`}
    >
      {loading || userPolymorphsAll.length > 0 ? (
        <CategoriesFilter
          categories={categories}
          setCategories={setCategories}
          categoriesIndexes={categoriesIndexes}
          setCategoriesIndexes={setCategoriesIndexes}
          setFilter={setFilter}
          filter={filter}
          handleCategoryFilterChange={handleCategoryFilterChange}
          resultsCount={results?.length || 0}
        />
      ) : null}
      <div className="list--with--selected--filters">
        <div className="selected--filters">
          {showClearALL && (
            <div className="result">{results.length} results</div>
          )}
          {categories.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.traits.map(
                (trait, idx) =>
                  trait.checked && (
                    <button
                      type="button"
                      className="light-border-button"
                      key={trait.id}
                    >
                      {trait.name}
                      <img
                        className="close"
                        src={closeIcon}
                        alt="Close"
                        aria-hidden="true"
                        onClick={() => removeSelectedFilter(index, idx)}
                      />
                    </button>
                  )
              )}
            </React.Fragment>
          ))}
          {showClearALL && (
            <button
              type="button"
              className="clear--all"
              onClick={() => handleClearAll()}
            >
              Clear all
            </button>
          )}
        </div>
        {loading && !isLastPage ? (
          <div className="grid">
            <RarityChartsLoader number={9} />
          </div>
        ) : results?.length ? (
          <div className="grid">
            {sliceData?.map((item, i) => (
              <MyPolymorphCard
                key={i}
                polymorphItem={item}
                index={offset + i + 1}
                redirect={redirectHandler}
              />
            ))}
            {isLastPage ? <RarityChartsLoader number={emptySlots} /> : <></>}
          </div>
        ) : (
          <div className="rarity--charts--empty polymorphs">
            <img src={BubbleIcon} />
            <p>No Polymorph found</p>
            <span>You can always buy them on the Marketplace</span>
            <Button
              onClick={() => {
                window.open(marketplaceLink);
              }}
            >
              Marketplace
            </Button>
          </div>
        )}
        {data?.length >= perPage ? (
          <div className="pagination__container">
            <RarityPagination
              data={data}
              perPage={perPage}
              setOffset={setOffset}
              setApiPage={setApiPage}
              apiPage={apiPage}
              setIsLastPage={setIsLastPage}
            />
            <ItemsPerPageDropdown perPage={perPage} setPerPage={setPerPage} />
          </div>
        ) : null}
        <Popup open={redirect}>
          <LoadingSpinner />
        </Popup>
      </div>
    </div>
  );
};

MyRarityList.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  perPage: PropTypes.number.isRequired,
  apiPage: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  isLastPage: PropTypes.bool.isRequired,
  setOffset: PropTypes.func.isRequired,
  setApiPage: PropTypes.func.isRequired,
  setIsLastPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategories: PropTypes.func.isRequired,
  categoriesIndexes: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategoriesIndexes: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.array]).isRequired,
  results: PropTypes.oneOfType([PropTypes.array]),
  loading: PropTypes.bool.isRequired,
  handleCategoryFilterChange: PropTypes.func.isRequired,
};

export default MyRarityList;
