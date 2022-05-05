/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import closeIcon from '../../assets/images/cross.svg';
import LoadingSpinner from '../svgs/LoadingSpinner';

const BurnPolymorphLoadingPopup = ({ onClose }) => {
  return (
    <div className="loading-div popup-div" id="loading-popup-div">
      <div className="loading-ring">
        <div className="lds-roller">
          <LoadingSpinner />
        </div>
      </div>
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </button>
      <div className="loading-text">
        <h2>Burning Your Polymorph</h2>
        <p>Just accept the signature request and wait for us to process burn your Polymorph.</p>
      </div>
    </div>
  );
};

BurnPolymorphLoadingPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BurnPolymorphLoadingPopup;
