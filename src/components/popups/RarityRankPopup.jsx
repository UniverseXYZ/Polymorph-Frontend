import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import closeIcon from '../../assets/images/close-menu.svg';
import neverScrumbledIcon from '../../assets/images/never-scrambled-badge.svg';
import scrumbledIcon from '../../assets/images/single-trait-scrambled-badge.svg';
import GeneParser from '../../utils/helpers/GeneParser.js';
import RarityRankPopupProperty from './RarityRankPopupProperty';
import linkIcon from '../../assets/images/rarity-charts/linkIcon.svg';

const RarityRankPopup = ({ onClose, item }) => {
  const [traitsMap, setTraitsMap] = useState(GeneParser.parse(item.currentgene));

  return (
    <div className="rarity--rank--popup">
      <img src={closeIcon} alt="Close" className="close" onClick={onClose} aria-hidden="true" />
      <div className="rarity--rank">
        <div className="rarity--rank--image">
          {item.scrambles === 0 && item.morphs > 0 ? (
            <div className="never--scrumbled">
              <img src={scrumbledIcon} alt="Single trait scrambled badge" />
              <span className="tooltiptext">Single trait scrambled</span>
            </div>
          ) : item.isvirgin ? (
            <div className="never--scrumbled">
              <img src={neverScrumbledIcon} alt="Never scrambled badge" />
              <span className="tooltiptext">Never scrambled</span>
            </div>
          ) : (
            <></>
          )}
          <img src={item.imageurl} alt={item.name} />
        </div>
        <div className="rarity--rank--body">
          <div className="rarity--rank--header">
            <div>
              <h1>{`Rarity Rank #${item.rank}`}</h1>
              <a href={`https://universe.xyz/nft/${process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS}/${item.tokenid}`}>
                View on Universe <img src={linkIcon} alt="Link Icon" />
              </a>{' '}
            </div>
            <p className="number">{`#${item.tokenid}`}</p>
          </div>
          <div className="rarity--rank--descriptions">
            <RarityRankPopupProperty
              propertyName="Character"
              value={item.character}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Footwear"
              value={item.footwear}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Pants"
              value={item.pants}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Torso"
              value={item.torso}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Eyewear"
              value={item.eyewear}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Headwear"
              value={item.headwear}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />

            <RarityRankPopupProperty
              propertyName="Left Hand"
              value={item.lefthand}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Right Hand"
              value={item.righthand}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
            <RarityRankPopupProperty
              propertyName="Background"
              value={item.background}
              mainMatchingAttributes={item.mainmatchingtraits}
              secMatchingAttributes={item.secmatchingtraits}
              genesMap={traitsMap}
              matchingHands={item.matchinghands}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
RarityRankPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default RarityRankPopup;
