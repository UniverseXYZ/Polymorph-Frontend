import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadingBg from '../../assets/images/loading-white-background.png';
// import './LoadingImage.scss';
import { useImageLoaded } from '../../utils/hooks/useImageLoaded';
// import BrokenNFT from '../marketplaceNFT/BrokenNFT';

const LoadingImage = React.memo(({ placeholderImage, src, alt, className, showSpinner, style }) => {
  const [ref, loaded, onLoad, errored, onError, setLoaded] = useImageLoaded();

  useEffect(
    () => () => {
      setLoaded(false);
    },
    []
  );

  return errored ? (
    // <BrokenNFT />
    <p>BrokenNFT</p>
  ) : (
    <>
      <img
        ref={ref}
        alt={alt}
        className={className}
        style={style}
        src={loaded ? src : placeholderImage || loadingBg}
        onLoad={onLoad}
        onError={onError}
      />
      {!loaded && showSpinner && (
        <div className="card-lds-roller">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      )}
    </>
  );
});

LoadingImage.propTypes = {
  placeholderImage: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object]),
  showSpinner: PropTypes.bool,
};

LoadingImage.defaultProps = {
  className: '',
  style: {},
  placeholderImage: '',
  showSpinner: false,
};

export default LoadingImage;
