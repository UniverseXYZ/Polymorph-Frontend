import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import SortingFilter from '../input/SortingFilter';
import collectionIcon from '../../assets/images/marketplace/collections.svg';
import SearchField from '../input/SearchField';
import {
  PLACEHOLDER_MARKETPLACE_COLLECTIONS,
  PLACEHOLDER_MARKETPLACE_USERS,
} from '../../utils/fixtures/BrowseNFTsDummyData';
import { defaultColors } from '../../utils/helpers';
import closeIcon from '../../assets/images/close-menu.svg';
import './styles/CollectionFilter.scss';

const CollectionFilter = (props) => {
  const [collections, setCollections] = useState([...PLACEHOLDER_MARKETPLACE_COLLECTIONS]);
  const [selectedCollections, setSellectedCollections] = useState([]);
  const handleSelectCollection = (el) => {
    if (!selectedCollections.includes(el)) {
      const copySelectedCollections = [...selectedCollections];
      copySelectedCollections.push(el);
      setSellectedCollections(copySelectedCollections);
    }
  };
  const removeCollection = (index) => {
    const copySelectedCollections = [...selectedCollections];
    copySelectedCollections.splice(index, 1);
    setSellectedCollections(copySelectedCollections);
  };

  return (
    <SortingFilter
      className="collections--filter"
      title="Collections"
      countFilter={selectedCollections.length}
      icon={collectionIcon}
    >
      <div className="collection--dropdown" aria-hidden="true" onClick={(e) => e.stopPropagation()}>
        <div className="collection--dropdown--body">
          <div className="collection--dropdown--selected">
            {selectedCollections.map((coll, index) => (
              <button type="button" className="light-border-button" key={uuid()}>
                {!coll.photo ? (
                  <div
                    className="random--avatar--color"
                    style={{
                      backgroundColor:
                        defaultColors[Math.floor(Math.random() * defaultColors.length)],
                    }}
                  >
                    {coll.name.charAt(0)}
                  </div>
                ) : (
                  <img className="collection" src={coll.photo} alt={coll.name} />
                )}
                {coll.name}
                <img
                  className="close"
                  src={closeIcon}
                  alt="Close"
                  aria-hidden="true"
                  onClick={() => removeCollection(index)}
                />
              </button>
            ))}
          </div>
          <SearchField
            data={PLACEHOLDER_MARKETPLACE_COLLECTIONS}
            CardElement={<h1>ok</h1>}
            placeholder="Search items"
            dropdown={false}
            getData={(find) => setCollections(find)}
          />
          <div className="collections__list">
            {collections.map((col) => (
              <div
                className="collection__item"
                key={uuid()}
                onClick={() => handleSelectCollection(col)}
                aria-hidden="true"
              >
                {console.log(col)}
                {!col.photo ? (
                  <div
                    className="random--avatar--color"
                    style={{
                      backgroundColor:
                        defaultColors[Math.floor(Math.random() * defaultColors.length)],
                    }}
                  >
                    {col.name.charAt(0)}
                  </div>
                ) : (
                  <img className="collection__avatar" src={col.photo} alt={col.name} />
                )}
                <p>{col.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="collection--dropdown--footer">
          <button type="button" className="clear--all" onClick={() => setSellectedCollections([])}>
            Clear
          </button>
          <button
            type="button"
            className="light-button"
            // onClick={() => handleSaveCollections()}
          >
            Save
          </button>
        </div>
      </div>
    </SortingFilter>
  );
};

export default CollectionFilter;
