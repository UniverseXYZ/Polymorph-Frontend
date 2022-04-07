import { Box, BoxProps, Image, ImageProps } from '@chakra-ui/react';
import React, { useState } from 'react';
// import BrokenNFT from '../../../../../../../components/marketplaceNFT/BrokenNFT';
import { NFTAssetFullscreen } from '../nft-asset-full-screen';
import cogWheel from '../../../../../../../assets/images/cog.png';

const ImageStyle: ImageProps = {
  borderRadius: '12px',
  objectFit: 'cover',
  maxH: {sm: '335px', md: '600px'},
  maxW: {sm: '335px', md: '600px'},
  h: 'calc(100vh - 84px - 120px)',
  w: 'calc(100vh - 84px - 120px)',
}

export const NFTAssetBroken = (props: BoxProps) => {
  return (
    <Box className="wrap" {...props}>
      <div id="broken-nft-container">
        <div>
          <Image
            src={cogWheel}
            {...ImageStyle}
            cursor={"default"}
          />
        </div>
        <div className="error-text">
          <span>This NFT can&apos;t load yet</span>
        </div>
        <div className="error-text">
          <span style={{ fontWeight: 400, fontSize: 12 }}>We&apos;re working on it</span>
        </div>
      </div>
    </Box>
  )
}
