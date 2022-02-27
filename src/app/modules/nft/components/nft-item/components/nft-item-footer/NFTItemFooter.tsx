import { Box, BoxProps, Flex } from '@chakra-ui/react';
import React from 'react';

import { INFT, NFTStandard } from '../../../../types';
import { NFTLike } from '../nft-like';
import * as styles from './styles';
import {
  NFTItemFooterEditionsLabel,
  NFTItemFooterStandardLabel,
  NFTItemFooterBundleLabel,
  NFTItemFooterCompositionLabel,
} from './components';
import { Button } from '@chakra-ui/react';
import { useAuthContext } from '../../../../../../../contexts/AuthContext';



interface INFTItemFooterProps extends BoxProps {
  NFT?: INFT;
  isCheckoutPopupOpened?: boolean;
  setIsCheckoutPopupOpened?: (isCheckoutPopupOpened: boolean) => void;
}

export const NFTItemFooter = (
  {
    NFT,
    children,
    isCheckoutPopupOpened,
    setIsCheckoutPopupOpened,
    ...rest
  }: INFTItemFooterProps
) => {
  const showLikes = false;
   const { address } = useAuthContext() as any;

    const handleCheckoutModal = (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      // @ts-ignore - TODO: this is temp
      setIsCheckoutPopupOpened(!isCheckoutPopupOpened);
  }

   const isOwner = address?.toLowerCase() === NFT?._ownerAddress?.toLowerCase();

  return (
    <Flex {...styles.WrapperStyle} {...rest} className="test-bace">
      {children ? children : (
        <>
          <Flex>
            <Box sx={{ '> div': { mr: '6px', _last: { mr: 0 } } }}>
              {!isOwner && <Button onClick={(event) => handleCheckoutModal(event)} className='buy-now' display={'none'} lineHeight={'0.5'} size='sm'>Buy now</Button>}
              {NFT && <NFTItemFooterStandardLabel isOwner={isOwner} NFT={NFT} />}
              {NFT?.standard === NFTStandard.ERC1155 && <NFTItemFooterEditionsLabel isOwner={isOwner} NFT={NFT} />}
              {/*TODO: composition*/}
              {/*{NFT.assets?.length && (<NFTItemFooterCompositionLabel count={NFT.assets.length ?? 0} mr={'6px'} />)}*/}
            </Box>
          </Flex>

          <Box>
            {/*TODO: likes*/}
            {showLikes && <NFTLike likes={[]} isLiked={true} />}
          </Box>
        </>
      )}
    </Flex>
  );
};
