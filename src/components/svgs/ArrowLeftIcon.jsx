import React from 'react';
import PropTypes from 'prop-types';

const ArrowLeftIcon = ({ width, height, fillColor }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path filRule="evenodd" clipRule="evenodd" d="M6.46967 13.5303C6.76256 13.8232 7.23744 13.8232 7.53033 13.5303C7.82322 13.2374 7.82322 12.7626 7.53033 12.4697L2.80675 7.74609L13 7.74609C13.4142 7.74609 13.75 7.41031 13.75 6.99609C13.75 6.58188 13.4142 6.24609 13 6.24609L2.81457 6.24609L7.53033 1.53033C7.82322 1.23744 7.82322 0.762563 7.53033 0.46967C7.23744 0.176777 6.76256 0.176777 6.46967 0.46967L0.51724 6.4221C0.353831 6.55968 0.25 6.76576 0.25 6.99609C0.25 6.99679 0.250001 6.99748 0.250003 6.99818C0.249538 7.19073 0.322761 7.38342 0.46967 7.53033L6.46967 13.5303Z" fill={fillColor} />
    </svg>
  )
}

ArrowLeftIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

ArrowLeftIcon.defaultProps = {
  width: '14',
  height: '14',
  fillColor: 'white',
};

export default ArrowLeftIcon;