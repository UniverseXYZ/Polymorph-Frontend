import React from 'react';
// import './LatestFeaturesSection.scss';
import { useRouter } from 'next/router'
import arrowRight from '../../../assets/images/arrow-right.svg';
import rarityChartIcon from '../../../assets/images/rarity-chart-icon.svg';
import battleUniverseIcon from '../../../assets/images/battle-universe-icon.svg';
import burnToMintIcon from '../../../assets/images/burn-to-mint-icon.svg';

const LatestFeaturesSection = () => {
  const router = useRouter();

  return (
    <div className="latest--features--section">
      <div className="latest--features--section--container">
        <h1 className="title">Latest features</h1>
        <div className="grid">
          <div>
            <img src={rarityChartIcon} alt="Rarity chart" />
            <h2>Rarity chart</h2>
            <p>
              Compare your Polymorph’s ranking, scoring and information based on the rarity of its
              traits.
            </p>
            <button className='light-border-button' onClick={() => router.push('/polymorph-rarity')}>
              Explore
              <img src={arrowRight} alt="Arrow right" />
            </button>
          </div>
          <div>
            <img src={burnToMintIcon} alt="Burn to mint" />
            <h2 className="burn-mint-h2">Burn to mint</h2>
            <p>
              Say goodbye to the old version of your Polymorph forever and hello to your shiny new
              one.
            </p>
            <button className='light-border-button' onClick={() => router.push('/burn-to-mint')}>
              Explore
              <img src={arrowRight} alt="Arrow right" />
            </button>
          </div>
          <div>
            <img src={battleUniverseIcon} alt="Battle universe" />
            <h2>Battle universe</h2>
            <p>Wager ETH and compete against other Polymorph owners around the world.</p>
            <button className='button-disabled'>
              Coming Soon
              {/* <img src={arrowRight} alt="Arrow right" /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestFeaturesSection;
