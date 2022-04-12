import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NFTsTab from './nfts/NFTsTab.jsx';
import tabArrow from '../../../assets/images/tab-arrow.svg';
import { handleTabLeftScrolling, handleTabRightScrolling } from '../../../utils/scrollingHandlers';
import { useWindowSize } from 'react-use';

const Tabs = ({ nfts }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width < 600) {
      document.querySelector('.tab__right__arrow').style.display = 'flex';
    } else {
      document.querySelector('.tab__right__arrow').style.display = 'none';
      document.querySelector('.tab__left__arrow').style.display = 'none';
    }
  }, [windowSize]);

  return (
    <div className="tabs__section">
      <div className="tabs__section__container">
        <div className="tabs__wrapper">
          <div className="tab__left__arrow">
            <img
              onClick={handleTabLeftScrolling}
              aria-hidden="true"
              src={tabArrow}
              alt="Tab left arrow"
            />
          </div>
          <div className="tabs">
            <div className="tab_items">
              <button
                type="button"
                onClick={() => setSelectedTabIndex(0)}
                className={selectedTabIndex === 0 ? 'active' : ''}
              >
                {`NFTs (${nfts.length})`}
              </button>
            </div>
          </div>
          <div className="tab__right__arrow">
            <img
              onClick={handleTabRightScrolling}
              aria-hidden="true"
              src={tabArrow}
              alt="Tab right arrow"
            />
          </div>
        </div>
        <div className="tab__content">
          {selectedTabIndex === 0 && <NFTsTab showMintPrompt={false} nftData={nfts} />}
        </div>
      </div>
    </div>
  );
};

Tabs.propTypes = {
  nfts: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default Tabs;
