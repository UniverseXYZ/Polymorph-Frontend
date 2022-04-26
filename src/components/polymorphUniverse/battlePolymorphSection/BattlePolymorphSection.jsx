import React from 'react';
// import './BattlePolymorphSection.scss';
import battlePolymorphImage from '../../../assets/images/battle-polymorph-section-image.png';
import Button from '../../button/Button';

const battlePolymorphSection = () => (
  <div className="battle--polymorph--section">
    <div className="battle--polymorph--section--container">
      <div className="grid">
        <div className="polymorph-div">
          <h1>Battle Universe</h1>
          <p>
            Wager ETH and go head to head with other Polymorph owners from around the world. Choose
            from 6 quirky battlegrounds, each of them with a nod to popular culture and different
            entry fees.
          </p>
          <Button className={'light-button'} disabled='true'>Coming Soon</Button>
        </div>
        <div>
          <h1 className="hidden-battle">Battle your Polymorph</h1>
          <img src={battlePolymorphImage} alt="Battle polymorph" />
        </div>
      </div>
    </div>
  </div>
);

export default battlePolymorphSection;
