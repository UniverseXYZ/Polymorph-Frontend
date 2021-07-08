import React, { useState } from 'react';
import { Animated } from 'react-animated-css';
import uuid from 'react-uuid';
import arrowDown from '../../../../assets/images/browse-nft-arrow-down.svg';
import searchIcon from '../../../../assets/images/search-gray.svg';
import collectionImg from '../../../../assets/images/ntf1.svg';
import { PLACEHOLDER_MARKETPLACE_COLLECTIONS } from '../../../../utils/fixtures/BrowseNFTsDummyData';

const Collections = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [collections, setCollections] = useState(PLACEHOLDER_MARKETPLACE_COLLECTIONS);
  const [searchByCollections, setSearchByCollections] = useState('');

  const handleSearch = (value) => {
    setSearchByCollections(value);
  };

  return (
    <div className="browse--nft--sidebar--filtration--item">
      <div
        className="browse--nft--sidebar--filtration--item--header"
        aria-hidden="true"
        onClick={() => setShowFilters(!showFilters)}
      >
        <h3>Collections</h3>
      </div>
      <Animated animationIn="fadeIn">
        <div className="browse--nft--sidebar--filtration--item--content">
          <div className="search--field">
            <input
              type="text"
              placeholder="Search collections"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchByCollections}
            />
            <img src={searchIcon} alt="Search" />
          </div>
          {collections
            .filter((item) => item.name.toLowerCase().includes(searchByCollections.toLowerCase()))
            .map((col) => (
              <div className="collections--list" key={uuid()}>
                <img src={col.photo} alt={col.name} />
                <p>{col.name}</p>
              </div>
            ))}
        </div>
      </Animated>
    </div>
  );
};

export default Collections;
