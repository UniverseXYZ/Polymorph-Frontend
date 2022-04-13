import { Box, BoxProps } from '@chakra-ui/react';
import React, { useState } from 'react';
import NextImage from 'next/image';

// import BrokenNFT from '../../../../../../../components/marketplaceNFT/BrokenNFT';
import { NFTAssetFullscreen } from '../nft-asset-full-screen';
import * as NFTInfoStyles from '../nft-info/NFTInfo.style';
import * as styles from './NFTAssetImage.styles';

interface INFTAssetImageProps {
  image: string;
  alt: string;
  containerProps?: BoxProps;
  allowFullscreen?: boolean;
}

export const NFTAssetImage = (props: INFTAssetImageProps) => {
  const {
    image,
    alt,
    containerProps = {},
    allowFullscreen = true,
  } = props;

  const [fullscreen, setFullscreen] = useState(false);
  const [showError, setShowError] = useState(false);

  return showError ? (
    <Box {...NFTInfoStyles.BrokenAssetStyle}>
      {/* <BrokenNFT /> */}
      <p>BrokenNFT</p>
    </Box>)
   : (
    <>
      <Box {...styles.ImageWrapperStyle} {...containerProps}>
        <NextImage
          src={image}
          alt={alt}
          layout={'fill'}
          objectFit={'cover'}
          style={{
            cursor: allowFullscreen ? 'zoom-in' : 'default',
            borderRadius: '12px',
          }}
          onClick={() => allowFullscreen && setFullscreen(true)}
          onError={() => setShowError(true)}
        />
      </Box>
      {!showError &&
        <NFTAssetFullscreen isOpen={fullscreen}>
          <NextImage
            src={image}
            alt={alt}
            height={600}
            width={600}
            layout={'fill'}
            objectFit={'contain'}
            style={{
              cursor: 'zoom-out',
            }}
            onClick={() => allowFullscreen && setFullscreen(false)}
          />
        </NFTAssetFullscreen>
      }
    </>
  )
}
