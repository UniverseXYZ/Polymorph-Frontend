import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { PLACEHOLDER_MARKETPLACE_NFTS } from '../../utils/fixtures/BrowseNFTsDummyData';
import { defaultColors } from '../../utils/helpers';
import SaleTypeFilter from '../ui-elements/SaleTypeFilter';
import PriceRangeFilter from '../ui-elements/PriceRangeFilter';
import CollectionFilter from '../ui-elements/CollectionFilter';
import ArtistFilter from '../ui-elements/ArtistsFilter';
import SearchField from '../input/SearchField';
import SortBySelect from '../input/SortBySelect';
import Button from '../button/Button';
import NftGalleryItemCard from '../ui-elements/NftGalleryItemCard';
import filtersIcon from '../../assets/images/filters-icon-black.svg';
import closeIcon from '../../assets/images/close-menu.svg';
import closeIconWhite from '../../assets/images/marketplace/close.svg';
import mp3Icon from '../../assets/images/mp3-icon.png';
import './styles/SelectNfts.scss';

const clearCheck = (filtersSale, collections, artist, priceRange) => {
  const arr = [].concat(filtersSale).concat(collections).concat(artist);
  if (arr.length) {
    return true;
  }
  if (priceRange) return true;
  return false;
};

const SelectNfts = (props) => {
  const [filtersCount, setFiltersCount] = useState(0);
  const [saleTypeFilters, setSaleTypeFilters] = useState([]);
  const [collectionsSelected, setCollectionSelected] = useState([]);
  const [filterRangePrice, setFilterRangePrice] = useState(null);
  const [artistsSelected, setArtistsSelected] = useState([]);
  const [elemSaleRemove, setElemSaleRemove] = useState(null);
  const [removePrice, setRemovePrice] = useState(false);
  const [clearCollectionSelectedItem, setClearCollectionSelectedItem] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const [data, setData] = useState(PLACEHOLDER_MARKETPLACE_NFTS);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState([]);
  // const [galleryRowItem, setGalleryRowItem] = useState(4);
  const history = useHistory();
  // useEffect(() => {
  //   if (window.innerWidth < 1000 && window.innerWidth >= 769) setGalleryRowItem(3);
  //   if (window.innerWidth > 576 && window.innerWidth <= 769) setGalleryRowItem(2);
  //   if (window.innerWidth <= 576) setGalleryRowItem(0);
  // }, [window.innerWidth]);
  useEffect(() => {
    if (clearAll) setClearAll(false);
    if (elemSaleRemove) setElemSaleRemove(null);
    if (clearCollectionSelectedItem !== null) setClearCollectionSelectedItem(null);
    if (removePrice) setRemovePrice(false);
  }, [clearAll, elemSaleRemove, clearCollectionSelectedItem, removePrice]);

  const filterData = (dataFil, saleTypes, collectionSelected, artistSelected, filterPrice) => {
    const copyData = [...dataFil];
    let filterD = copyData.filter((elem) =>
      collectionSelected.map((item) => item.name === elem.collection.name).includes(true)
    );
    if (!filterD.length) {
      filterD = [...dataFil];
    }
    const filterWithCreator = filterD.filter((elem) =>
      artistSelected
        .map((item) => item.name.toLowerCase() === elem.creator.name.toLowerCase())
        .includes(true)
    );
    if (artistSelected.length) {
      filterD = filterWithCreator;
    }
    if (!filterD.length && !artistSelected.length) {
      filterD = [...dataFil];
    }
    if (filterPrice) {
      filterD = filterD.filter(
        (elem) => +elem.price >= +filterPrice.min && +elem.price <= +filterPrice.max
      );
    }
    setData(filterD);
  };

  useEffect(() => {
    const arr = [].concat(saleTypeFilters).concat(collectionsSelected).concat(artistsSelected);
    setFiltersCount(arr.length);
    filterData(
      PLACEHOLDER_MARKETPLACE_NFTS,
      saleTypeFilters,
      collectionsSelected,
      artistsSelected,
      filterRangePrice
    );
  }, [saleTypeFilters, collectionsSelected, artistsSelected, filterRangePrice]);

  const clickGalleryItem = (item, selected) => {
    if (selected) {
      const newSelectedArr = [...selectedGalleryItem];
      newSelectedArr.push(item);
      setSelectedGalleryItem(newSelectedArr);
    } else {
      const newSelectedArr = [...selectedGalleryItem];
      const indx = newSelectedArr.findIndex((elem) => elem.id === item.id);
      newSelectedArr.splice(indx, 1);
      setSelectedGalleryItem(newSelectedArr);
    }
  };

  return (
    <div className="select--nfts--container">
      <div className="section--title--block">
        <h3 className="section--title">Select NFTs</h3>
        <p className="section--hint--text">
          You can only select minted NFTs from your wallet. If you want to create NFTs, go to
          <Link to="/nft-marketplace/settings">Minting</Link>.
        </p>
      </div>
      <div className="header--search--block">
        <div className="search--block">
          <SearchField
            data={PLACEHOLDER_MARKETPLACE_NFTS}
            CardElement={<h1>ok</h1>}
            placeholder="Search items"
            dropdown={false}
            getData={(find) => setData([...find])}
          />
        </div>
        <div className="sort--by--block">
          <SortBySelect />
        </div>
        <div className="filters--count--block">
          <div className="filters--count--parent">
            <div className="filters--count--child">
              {!filtersCount ? (
                <img src={filtersIcon} alt="img" />
              ) : (
                <div className="count--block">
                  <p>{filtersCount}</p>
                </div>
              )}
              <p>Filters</p>
            </div>
            {/* <div className="box--shadow--effect--block" /> */}
          </div>
        </div>
      </div>
      <div className="sorting--filters--row">
        <SaleTypeFilter
          getSelectedFilters={setSaleTypeFilters}
          onClear={clearAll}
          removeElemInSelected={elemSaleRemove}
        />
        <PriceRangeFilter
          getPrice={(price) => setFilterRangePrice(price)}
          remove={removePrice}
          onClear={clearAll}
        />
        <CollectionFilter
          getSelectedFilters={setCollectionSelected}
          onClear={clearAll}
          removeElemInSelected={clearCollectionSelectedItem}
        />
        <ArtistFilter
          getSelectedFilters={setArtistsSelected}
          onClear={clearAll}
          removeElemInSelected={clearCollectionSelectedItem}
        />
      </div>
      <div className="filters--row--data">
        <div className="nfts--data--count">
          <p>{data.length} results</p>
        </div>
        <div className="filters">
          {saleTypeFilters.map((elem, index) => (
            <div className="filter--item--parent" key={index.toString()}>
              <div className="filter--item--child">
                <p className="filter--text">{elem.text}</p>
                <img
                  src={closeIcon}
                  alt="img"
                  className="close--icon"
                  onClick={() => setElemSaleRemove(elem)}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
          {filterRangePrice && (
            <div className="filter--item--parent">
              <div className="filter--item--child">
                <img src={filterRangePrice.icon} alt="img" className="price--icon" />
                <p className="filter--text">
                  {`${filterRangePrice.title}: ${filterRangePrice.min} - ${filterRangePrice.max}`}
                </p>
                <img
                  src={closeIcon}
                  alt="img"
                  className="close--icon"
                  onClick={() => setRemovePrice(true)}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
          {collectionsSelected.map((elem, index) => (
            <div className="filter--item--parent" key={index.toString()}>
              <div className="filter--item--child">
                {elem.background !== null && (
                  <img src={elem.background} alt="img" className="avatar--img" />
                )}
                {elem.background === null && (
                  <p
                    className="default--avatar"
                    style={{
                      backgroundColor:
                        defaultColors[Math.floor(Math.random() * defaultColors.length)],
                    }}
                  >
                    {elem.name[0]}
                  </p>
                )}
                <p className="filter--text">{elem.name}</p>
                <img
                  src={closeIcon}
                  alt="img"
                  className="close--icon"
                  onClick={() => setClearCollectionSelectedItem(elem)}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
          {artistsSelected.map((elem, index) => (
            <div className="filter--item--parent" key={index.toString()}>
              <div className="filter--item--child">
                {elem.avatar !== null && (
                  <img src={elem.avatar} alt="img" className="avatar--img" />
                )}
                {elem.avatar === null && (
                  <p
                    className="default--avatar"
                    style={{
                      backgroundColor:
                        defaultColors[Math.floor(Math.random() * defaultColors.length)],
                    }}
                  >
                    {elem.name[0]}
                  </p>
                )}
                <p className="filter--text">{elem.name}</p>
                <img
                  src={closeIcon}
                  alt="img"
                  className="close--icon"
                  onClick={() => setClearCollectionSelectedItem(elem)}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
        {clearCheck(saleTypeFilters, collectionsSelected, artistsSelected, filterRangePrice) && (
          <div className="clear--all" aria-hidden="true" onClick={() => setClearAll(true)}>
            Clear all
          </div>
        )}
      </div>
      <div className="nfts--gallery">
        {data.map((elem, index) => {
          // const rowLastElem = (index + 1) % galleryRowItem;
          console.log('1');
          return (
            <NftGalleryItemCard
              key={index.toString()}
              nft={elem}
              onClick={(e, selected) => clickGalleryItem(e, selected)}
              // style={rowLastElem === 0 ? { marginRight: 0 } : {}}
            />
          );
        })}
      </div>
      <div className="select--nfts--footer">
        <div className="selected--nft--block">
          {selectedGalleryItem.map((elem, index) => (
            <div className="selected--nft--item" key={index.toString()}>
              {elem.media.type === 'image/png' && <img src={elem.media.url} alt="img" />}
              {elem.media.type === 'audio/mpeg' && <img src={mp3Icon} alt="img" />}
              {elem.media.type === 'video/mp4' && (
                <video
                  onMouseOver={(event) => event.target.play()}
                  onFocus={(event) => event.target.play()}
                  onMouseOut={(event) => event.target.pause()}
                  onBlur={(event) => event.target.pause()}
                  muted
                >
                  <source src={elem.media.url} type="video/mp4" />
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="close--icon">
                <img src={closeIconWhite} alt="img" />
              </div>
            </div>
          ))}
        </div>
        <div className="buttons--group">
          <Button
            className="light-border-button"
            onClick={() => history.push('/nft-marketplace/selected-method')}
          >
            Back
          </Button>
          <Button className="light-button">Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default SelectNfts;
