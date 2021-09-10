import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import './SearchFilters.scss';
import SearchField from '../input/SearchField.jsx';
import SortingDropdowns from '../marketplace/browseNFT/selectedFiltersAndSorting/SortingDropdowns.jsx';
import SortingFilters from '../marketplace/browseNFT/selectedFiltersAndSorting/SortingFilters.jsx';
import filtersIcon from '../../assets/images/marketplace/filters.svg';
import SelectedFilters from '../marketplace/browseNFT/selectedFiltersAndSorting/SelectedFilters';
import BrowseFilterPopup from '../popups/BrowseFiltersPopup';

const SearchFilters = ({ data }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
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
  const [sliderValue, setSliderValue] = useState({ min: 0.01, max: 100 });
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [savedCollections, setSavedCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [savedCreators, setSavedCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);

  useEffect(() => {
    const onScroll = (e) => {
      const element = document.querySelector('.search--sort--filters--section');
      if (element) {
        if (window.scrollY >= element.offsetTop) {
          document.querySelector('header').style.position = 'absolute';
          // element.classList.add('fixed');
        } else {
          document.querySelector('header').style.position = 'fixed';
          // element.classList.remove('fixed');
        }
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="search--sort--filters--section">
      <div className="search--sort--filters">
        <SearchField
          data={data}
          CardElement={<h1>ok</h1>}
          placeholder="Search items"
          dropdown={false}
          // getData={(find) => setMyNFTsData(find)}
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
        {showFilters && (
          <SortingFilters
            saleTypeButtons={saleTypeButtons}
            setSaleTypeButtons={setSaleTypeButtons}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            sliderValue={sliderValue}
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
        )}
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

SearchFilters.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default SearchFilters;