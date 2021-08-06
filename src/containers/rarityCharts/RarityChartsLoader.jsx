import React from 'react';
import PropTypes from 'prop-types';
import './RarityCharsLoader.scss';
import './RarityCharts.scss';
import { renderLoaders } from './renderLoaders';

const RarityChartsLoader = React.memo(({ number }) => (
  <div className="rarity-charts--list">
    <div className="grid">{renderLoaders(number)}</div>
  </div>
));

RarityChartsLoader.propTypes = {
  number: PropTypes.number.isRequired,
};

export default RarityChartsLoader;
