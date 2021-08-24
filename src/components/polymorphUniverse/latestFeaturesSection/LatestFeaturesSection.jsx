import React from 'react';
import './LatestFeaturesSection.scss';
import arrowRight from '../../../assets/images/arrow-right.svg';
import rarityChartIcon from '../../../assets/images/rarity-chart-icon.svg';
import battleUniverseIcon from '../../../assets/images/battle-universe-icon.svg';
import burnToMintIcon from '../../../assets/images/burn-to-mint-icon.svg';

const LatestFeaturesSection = () => (
  <div className="latest--features--section">
    <div className="latest--features--section--container">
      <h1 className="title">Latest features</h1>
      <div className="grid">
        <div>
          <img src={rarityChartIcon} alt="Rarity chart" />
          <h2>Rarity chart</h2>
          <p>Compare you Polymorphs rarity with others using our brand new rarity tools.</p>
          <button type="button">
            Explore
            <img src={arrowRight} alt="Arrow right" />
          </button>
        </div>
        <div>
          <img src={battleUniverseIcon} alt="Battle universe" />
          <h2>Battle universe</h2>
          <p>Meet your match. Has your Polymorph got what it takes to be the champ?</p>
          <button type="button">
            Explore
            <img src={arrowRight} alt="Arrow right" />
          </button>
        </div>
        <div>
          <img src={burnToMintIcon} alt="Burn to mint" />
          <h2>Burn to mint</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt
          </p>
          <button type="button">
            Explore
            <img src={arrowRight} alt="Arrow right" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default LatestFeaturesSection;