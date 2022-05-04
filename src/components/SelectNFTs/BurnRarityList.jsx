/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import './RarityList.scss';
// import './RarityList.scss';
import BurnPolymorphCard from './BurnPolymorphCard';
// import ItemsPerPageDropdown from '../rarityCharts/list/pagination/ItemsPerPageDropdown';
// import Pagination from '../../pagination/Pagionation';
// import '../../../containers/rarityCharts/RarityCharsLoader.scss';
// import '../../../containers/rarityCharts/RarityCharts.scss';
import closeIcon from '../../assets/images/close-menu.svg';
// import { renderLoaders } from '../../../containers/rarityCharts/renderLoaders';
import CategoriesFilter from '../rarityCharts/list/CategoriesFilter';
import RarityChartsLoader from '../../containers/rarityCharts/RarityChartsLoader';
import RarityPagination from '../rarityCharts/list/RarityPagination';

const List = ({
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
  withFilter
}) => {
  const sliceData = data.slice(offset, offset + perPage) || [];
  const emptySlots = perPage - sliceData.length || 4;
  const [showClearALL, setShowClearALL] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

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

  console.log('the selected cards are: ', selectedCards)

  const removeSelectedCard = (tokenId) => {
    const newSelectedCards = selectedCards.filter((id) => id !== tokenId );
    setSelectedCards(newSelectedCards);
  }

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
    <div className="rarity--charts--list">
        {/* <CategoriesFilter
          categories={categories}
          setCategories={setCategories}
          categoriesIndexes={categoriesIndexes}
          setCategoriesIndexes={setCategoriesIndexes}
          setFilter={setFilter}
          filter={filter}
          handleCategoryFilterChange={handleCategoryFilterChange}
          resultsCount={results?.length || 0}
        />  */}

      <div className="list--with--selected--filters">
        <div className="selected--filters">
          {showClearALL && <div className="result">{results.length} results</div>}
          {categories.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.traits.map(
                (trait, idx) =>
                  trait.checked && (
                    <button type="button" className="light-border-button" key={trait.name}>
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
            <button type="button" className="clear--all" onClick={() => handleClearAll()}>
              Clear all
            </button>
          )}
        </div>
        {loading && !isLastPage ? (
          <div className="grid">
            <RarityChartsLoader number={9} />
          </div>
        ) : results.length ? (
          <div className="grid">
            {sliceData.map((item, i) => (
              <BurnPolymorphCard 
                key={item.id} 
                item={item} 
                index={offset + i + 1} 
                selected={selectedCards.includes(item.tokenid)}
                setSelected={() => selectedCards.includes(item.tokenid) 
                  ? removeSelectedCard(item.tokenid)
                  : setSelectedCards([...selectedCards, item.tokenid])}
              />
            ))}
            {isLastPage ? <RarityChartsLoader number={emptySlots} /> : <></>}
          </div>
        ) : (
          <div className="rarity--charts--empty polymorphs">
            <p>No Polymorph could be found :’(</p>
          </div>
        )}
        {data.length >= perPage ? (
          <div className="pagination__container">
            <RarityPagination
              data={data}
              perPage={perPage}
              setOffset={setOffset}
              setApiPage={setApiPage}
              apiPage={apiPage}
              setIsLastPage={setIsLastPage}
            />
            {/* <ItemsPerPageDropdown perPage={perPage} setPerPage={setPerPage} /> */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

List.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
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
  results: PropTypes.oneOfType([PropTypes.array]).isRequired,
  loading: PropTypes.bool.isRequired,
  handleCategoryFilterChange: PropTypes.func.isRequired,
  withFilter: PropTypes.bool.isRequired,
};

export default List;
