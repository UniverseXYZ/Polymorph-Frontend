import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import { useHistory } from 'react-router-dom';
import Button from '../button/Button.jsx';
import closeIcon from '../../assets/images/cross.svg';
import { PLACEHOLDER_MINTED_POLYMORPHS } from '../../utils/fixtures/MintedPolymorphsDummyData.js';
// import './PopupStyle.scss';
import AppContext from '../../ContextAPI.js';
import { useMyNftsStore } from 'src/stores/myNftsStore';

const MintPolymorphConfirmationPopup = ({
  onClose,
  quantity,
  mintedNFTs,
  collectionName,
  loadingImage,
  metadataLoaded,
  buttonText,
  collectionFilter,
}) => {
  const history = useHistory();
  const setCollectionFilter= useMyNftsStore(s => s.setCollectionFilter);
  const navigateMyPolymorphs = () => {
    onClose();
    history.push('/my-nfts');
    setCollectionFilter(collectionFilter);
  };

  return (
    <div className="polymorph_popup">
      <img className="close" src={closeIcon} alt="Close" onClick={onClose} aria-hidden="true" />
      <h1>Congratulations!</h1>
      <p className="desc">
        You have successfully minted {mintedNFTs.length} {collectionName}
        {mintedNFTs.length > 1 ? 's' : ''}
      </p>
      {!metadataLoaded ? (
        <p className="info">
          Your {collectionName}
          {mintedNFTs.length > 1 ? 's' : ''} may take up to 2 minutes to load
        </p>
      ) : (
        <></>
      )}
      <div
        className={`polymorph_confirmation_image ${
          mintedNFTs.length > 1 && mintedNFTs.length < 5 ? 'img2x2' : ''
        } ${mintedNFTs.length > 4 && mintedNFTs.length < 7 ? 'img3x2' : ''}
        ${mintedNFTs.length > 6 && mintedNFTs.length < 13 ? 'img4x3' : ''}
        ${mintedNFTs.length > 12 && mintedNFTs.length < 21 ? 'img5x4' : ''}`}
      >
        {mintedNFTs.map((elm) =>
          metadataLoaded ? (
            <img src={elm.data.image} alt="polymorph" key={uuid()} />
          ) : (
            <div className="lobster-loading" key={uuid()}>
              <img src={loadingImage} alt="polymorph" key={uuid()} />
              <div className="lobster-lds-roller">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          )
        )}
      </div>
      <div className="button__div_polymorph">
        <Button className="light-button" onClick={() => navigateMyPolymorphs()}>
          {buttonText}
        </Button>
        <Button className="light-border-button" onClick={onClose}>
          Mint again
        </Button>
      </div>
    </div>
  );
};

MintPolymorphConfirmationPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  mintedNFTs: PropTypes.oneOfType([PropTypes.array]).isRequired,
  collectionName: PropTypes.string.isRequired,
  loadingImage: PropTypes.string.isRequired,
  metadataLoaded: PropTypes.bool.isRequired,
  buttonText: PropTypes.bool.isRequired,
  collectionFilter: PropTypes.string.isRequired,
};

export default MintPolymorphConfirmationPopup;
