import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import RarityRankPopup from '../popups/RarityRankPopup.jsx';
// import priceIcon from '../../../assets/images/eth-icon-new.svg';
import neverScrambledIcon from '../../assets/images/never-scrambled-badge.svg';
import singleTraitScrambledIcon from '../../assets/images/single-trait-scrambled-badge.svg';
import { getPolymorphMeta } from '../../utils/api/polymorphs.js';
import { renderLoaderWithData } from '../../containers/rarityCharts/renderLoaders.js';
// import loadingBg from '../../../assets/images/mint-polymorph-loading-bg.png';
import SelectedSVG from '../../assets/images/activity-icons/Selected.svg'

const PolymorphCard = ({ item, selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const fetchMetadata = async () => {
    setLoading(true);
    const data = await getPolymorphMeta(item.tokenid);

    setLoading(false);
  };

  return loading ? (
    renderLoaderWithData(item)
  ) : (
    <div className={`card ${selected ? 'selected' : ''}`} onClick={() => setSelected(item.tokenid)} aria-hidden="true">
      <div className="card--header">
        <div className="card--number">{`#${item.rank}`}</div>
        <div className="card--price">{`Rarity Score: ${item.rarityscore}`}</div>
      </div>
      <div className="card--body">
        <img
          onError={fetchMetadata}
          className="rarity--chart"
          src={item.imageurl}
          alt={item.name}
        />

        {item.scrambles === 0 && item.morphs > 0 ? (
          <div className="card--scrambled">
            <img alt="Single trait scrambled badge" src={singleTraitScrambledIcon} />
            <span className="tooltiptext">Single trait scrambled</span>
          </div>
        ) : item.isvirgin ? (
          <div className="card--scrambled">
            <img alt="Never scrambled badge" src={neverScrambledIcon} />
            <span className="tooltiptext">Never scrambled</span>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="card--footer">
        <h2>{item.character}</h2>
        <p>{`ID: #${item.tokenid}`}</p>
      </div>
      <Popup open={showPopup} closeOnDocumentClick={false}>
        <RarityRankPopup onClose={() => setShowPopup(false)} item={item} />
      </Popup>
      {selected ? <img className={'checkmark'} src={SelectedSVG} /> : null}
    </div>
  );
};

PolymorphCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PolymorphCard;
