import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import uuid from "react-uuid";
import arrowIcon from "../../../assets/images/browse-nft-arrow-down.svg";

const CategoriesFilter = ({
  categories,
  setCategories,
  categoriesIndexes,
  setCategoriesIndexes,
  setFilter,
  filter,
  handleCategoryFilterChange,
  resultsCount,
  activeVersion,
  setActiveVersion,
}) => {
  const handleClick = useCallback(
    (idx) => {
      if (categoriesIndexes.includes(idx)) {
        setCategoriesIndexes(categoriesIndexes.filter((i) => i !== idx));
      } else {
        setCategoriesIndexes([...categoriesIndexes, idx]);
      }
    },
    [categoriesIndexes]
  );

  return (
    <div className="categories--filters">
      <h2>Filters</h2>
      {activeVersion && (
        <div className="version--filter">
          <button
            className={activeVersion === "all" && "active"}
            onClick={() => setActiveVersion("all")}
          >
            All
          </button>
          <button
            className={activeVersion === "V1" && "active"}
            onClick={() => setActiveVersion("V1")}
          >
            V1
          </button>
          <button
            className={activeVersion === "V2" && "active"}
            onClick={() => setActiveVersion("V2")}
          >
            V2
          </button>
        </div>
      )}
      {categories.map((item, index) => (
        <div className="each--category" key={uuid()}>
          <div
            className={`dropdown ${
              categoriesIndexes.includes(index) ? "open" : ""
            }`}
            aria-hidden="true"
            onClick={() => handleClick(index)}
          >
            <span>{`${item.title} (${item.traits.length})`}</span>
            <img src={arrowIcon} alt="Arrow" />
            <div className="box--shadow--effect--block" />
          </div>
          {categoriesIndexes.includes(index) && (
            <div className="traits">
              {item.traits.map((trait, traitIndex) => (
                <div className="trait" key={uuid()}>
                  <input
                    id={trait.name.toLowerCase().replaceAll(" ", "--")}
                    type="checkbox"
                    checked={trait.checked}
                    onChange={() =>
                      handleCategoryFilterChange(index, traitIndex)
                    }
                  />
                  <label
                    htmlFor={trait.name.toLowerCase().replaceAll(" ", "--")}
                  >
                    {trait.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

CategoriesFilter.propTypes = {
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategories: PropTypes.func.isRequired,
  categoriesIndexes: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategoriesIndexes: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  handleCategoryFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.array]).isRequired,
  resultsCount: PropTypes.number.isRequired,
};

export default CategoriesFilter;
