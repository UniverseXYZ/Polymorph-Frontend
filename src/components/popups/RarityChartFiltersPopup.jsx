import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import closeIcon from '../../assets/images/close-menu.svg';
import arrowIcon from '../../assets/images/browse-nft-arrow-down.svg';
import Button from '../button/Button';

const RarityChartFiltersPopup = ({
  close,
  categories,
  setCategories,
  categoriesIndexes,
  setCategoriesIndexes,
  selectedFiltersLength,
  setSelectedFiltersLength,
  resultsCount,
  handleCategoryFilterChange,
  setFilter,
  filter,
  activeVersion,
  setActiveVersion,
}) => {
  const [showClearALL, setShowClearALL] = useState(false);

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
    if (attribute.value === 'righthand' || attribute.value === 'lefthand') {
      newFilter = filter.filter((f) => !(f[0] === attribute.value && f[1] === trait.name));
    } else {
      newFilter = filter.filter((f) => f[1] !== trait.name);
    }
    setCategories(newCategories);
    setFilter(newFilter);
  };

  useEffect(() => {
    let check = false;
    let length = 0;
    categories.forEach((item) => {
      const res = item.traits.filter((i) => i.checked);
      if (res.length) {
        length += res.length;
        check = true;
      }
    });
    setSelectedFiltersLength(length);
    if (check) {
      setShowClearALL(true);
    } else {
      setShowClearALL(false);
    }
  }, [categories]);

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
    <div className="rarity--chart--filters--popup">
      <div className="rarity--chart--filters--popup--header">
        <button type="button" onClick={close}>
          <img className="close" src={closeIcon} alt="Close" />
        </button>
        <p>Filters</p>
        <button className="clear--all" type="button" onClick={() => handleClearAll()}>
          Clear all
        </button>
      </div>
      <div className="rarity--chart--filters--popup--body">
        <div className="selected--filters">
          {showClearALL && <div className="result"> Show results</div>}
          {categories.map((item, index) => (
            <>
              {item.traits.map(
                (trait, idx) =>
                  trait.checked && (
                    <button type="button" className="light-border-button">
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
            </>
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
        <div className="categories--filters">
          <h2>Categories</h2>
          {activeVersion && (
            <div className="version--filter">
              <button
                className={activeVersion === "all" ? "active" : ""}
                onClick={() => setActiveVersion("all")}
              >
                All
              </button>
              <button
                className={activeVersion === "V1" ? "active" : ""}
                onClick={() => setActiveVersion("V1")}
              >
                V1
              </button>
              <button
                className={activeVersion === "V2" ? "active" : ""}
                onClick={() => setActiveVersion("V2")}
              >
                V2
              </button>
            </div>
          )}
          {categories.map((item, index) => (
            <div className="each--category" key={item.id}>
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
                    <div className="trait" key={trait.name}>
                      <input
                        id={trait.name.toLowerCase().replaceAll(' ', '--')}
                        type="checkbox"
                        checked={trait.checked}
                        onChange={() => handleCategoryFilterChange(index, traitIndex)}
                      />
                      <label htmlFor={trait.name.toLowerCase().replaceAll(' ', '--')}>
                        {trait.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rarity--chart--filters--popup--footer">
        <Button className="light-button" onClick={close}>
          Show results
        </Button>
      </div>
    </div>
  );
};

RarityChartFiltersPopup.propTypes = {
  close: PropTypes.func.isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategories: PropTypes.func.isRequired,
  categoriesIndexes: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategoriesIndexes: PropTypes.func.isRequired,
  selectedFiltersLength: PropTypes.number.isRequired,
  resultsCount: PropTypes.number,
  setSelectedFiltersLength: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  handleCategoryFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default RarityChartFiltersPopup;
