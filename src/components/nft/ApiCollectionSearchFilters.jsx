import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import './SearchFilters.scss';
import SearchNFTsField from '../input/SearchNFTsField.jsx';
import SortingDropdowns from '../marketplace/browseNFT/selectedFiltersAndSorting/SortingDropdowns.jsx';
import CollectionSortingFilters from '../marketplace/browseNFT/selectedFiltersAndSorting/CollectionSortingFilters';
import filtersIcon from '../../assets/images/marketplace/filters.svg';
import SelectedFilters from '../marketplace/browseNFT/selectedFiltersAndSorting/SelectedFilters';
import BrowseFilterPopup from '../popups/BrowseFiltersPopup';

const ApiCollectionSearchFilters = ({ searchText, search, resetPagination }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [sliderValue, setSliderValue] = useState({ min: 0.01, max: 100 });
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [savedCollections, setSavedCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [savedCreators, setSavedCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);

  const [saleTypeButtons, setSaleTypeButtons] = useState([
    {
      text: 'Buy now',
      description: 'Fixed price sale',
      selected: false,
    },
    {
      text: 'On auction',
      description: 'You can place bids',
      selected: false,
    },
    {
      text: 'New',
      description: 'Recently added',
      selected: false,
    },
    {
      text: 'Has offers',
      description: 'High in demand',
      selected: false,
    },
  ]);

  useEffect(() => {
    const onScroll = (e) => {
      const element = document.querySelector('.search--sort--filters--section');
      if (element) {
        if (window.scrollY >= element.offsetTop) {
          document.querySelector('header').style.position = 'absolute';
        } else {
          document.querySelector('header').style.position = 'fixed';
        }
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="search--sort--filters--section">
      <div className="search--sort--filters">
        <SearchNFTsField
          searchValue={searchText}
          setSearchValue={search}
          resetPagination={resetPagination}
          placeholder="Search items"
        />
        <SortingDropdowns />
        <div
          className="filter--button"
          onClick={() => setShowFilters(!showFilters)}
          aria-hidden="true"
        >
          {saleTypeButtons.filter((item) => item.selected === true).length > 0 ||
          selectedPrice ||
          savedCollections.length > 0 ||
          savedCreators.length > 0 ? (
            <div className="tablet--selected--filters">
              {saleTypeButtons.filter((item) => item.selected === true).length +
                (selectedPrice && +1) +
                savedCollections.length +
                savedCreators.length}
            </div>
          ) : (
            <img src={filtersIcon} alt="Filter" />
          )}
          Filters
        </div>
        {saleTypeButtons.filter((item) => item.selected === true).length > 0 ||
        selectedPrice ||
        savedCollections.length > 0 ||
        savedCreators.length > 0 ? (
          <SelectedFilters
            saleTypeButtons={saleTypeButtons}
            setSaleTypeButtons={setSaleTypeButtons}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            setSliderValue={setSliderValue}
            selectedTokenIndex={selectedTokenIndex}
            setSelectedTokenIndex={setSelectedTokenIndex}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            savedCollections={savedCollections}
            setSavedCollections={setSavedCollections}
            selectedCreators={selectedCreators}
            setSelectedCreators={setSelectedCreators}
            savedCreators={savedCreators}
            setSavedCreators={setSavedCreators}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="mobile--filters">
        <Popup
          trigger={
            <button type="button" className="light-button">
              <img src={filtersIcon} alt="Filter" />
            </button>
          }
        >
          {(close) => (
            <BrowseFilterPopup
              onClose={close}
              saleTypeButtons={saleTypeButtons}
              setSaleTypeButtons={setSaleTypeButtons}
              setSelectedPrice={setSelectedPrice}
              selectedTokenIndex={selectedTokenIndex}
              setSelectedTokenIndex={setSelectedTokenIndex}
              selectedCollections={selectedCollections}
              setSelectedCollections={setSelectedCollections}
              savedCollections={savedCollections}
              setSavedCollections={setSavedCollections}
              selectedCreators={selectedCreators}
              setSelectedCreators={setSelectedCreators}
              savedCreators={savedCreators}
              setSavedCreators={setSavedCreators}
            />
          )}
        </Popup>
        {(saleTypeButtons.filter((item) => item.selected === true).length > 0 ||
          selectedPrice ||
          savedCollections.length > 0 ||
          savedCreators.length > 0) && (
          <div className="selected--filters--numbers">
            {saleTypeButtons.filter((item) => item.selected === true).length +
              (selectedPrice && +1) +
              savedCollections.length +
              savedCreators.length}
          </div>
        )}
      </div>
    </div>
  );
};

ApiCollectionSearchFilters.propTypes = {
  search: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  resetPagination: PropTypes.func.isRequired,
};

export default ApiCollectionSearchFilters;
