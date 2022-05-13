import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import arrowDown from '../../assets/images/arrow-down.svg';
import AppContext from '../../ContextAPI';
import { useMyNftsStore } from 'src/stores/myNftsStore';

const CollectionDropdown = ({ isDropdownOpened, setIsDropdownOpened }) => {
  const ref = useRef(null);
  const {
    polymorphsFilter,
    collectionFilter,
    setCollectionFilter,
    setMyUniverseNFTsActiverPage,
    setMyUniverseNFTsOffset,
  } = useMyNftsStore(s => ({
    polymorphsFilter: s.polymorphsFilter,
    collectionFilter: s.collectionFilter,
    setCollectionFilter: s.setCollectionFilter,
    setMyUniverseNFTsActiverPage: s.setMyUniverseNFTsActiverPage,
    setMyUniverseNFTsOffset: s.setMyUniverseNFTsOffset,

  }));
  const handleClickOutside = (event) => {
    if (!event.target.classList.contains('target')) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDropdownOpened(false);
      }
    }
  };
  const setFilter = (filter) => {
    setCollectionFilter(filter.target.innerText);
    setIsDropdownOpened(false);
    setMyUniverseNFTsActiverPage(0);
    setMyUniverseNFTsOffset(0);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`universe_dropdown ${isDropdownOpened ? 'opened' : ''}`}
      onClick={() => setIsDropdownOpened(!isDropdownOpened)}
      aria-hidden="true"
    >
      <div className="box--shadow--effect--block" />
      <span className="selected__universe__item">{collectionFilter}</span>
      <img className="arrow__down" src={arrowDown} alt="Arrow" />
      {isDropdownOpened && (
        <div className="sort__dropdown">
          <ul>
            {/* <li onClick={setFilter} aria-hidden="true">
                  {allCharactersFilter}
                </li> */}
            <li onClick={setFilter} aria-hidden="true">
              {polymorphsFilter}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

CollectionDropdown.propTypes = {
  isDropdownOpened: PropTypes.bool.isRequired,
  setIsDropdownOpened: PropTypes.func.isRequired,
};

export default CollectionDropdown;
