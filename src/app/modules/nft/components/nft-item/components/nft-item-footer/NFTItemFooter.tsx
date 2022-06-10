import { Box, BoxProps, Flex } from '@chakra-ui/react';
import React from 'react';

import { ICollection, INFT, IOrder, NFTStandard } from '../../../../types';
import * as styles from './styles';
import {
  NFTItemFooterEditionsLabel,
  NFTItemFooterStandardLabel,
  NFTItemFooterBundleLabel,
  NFTItemFooterCompositionLabel,
} from './components';
import { Button } from '@chakra-ui/react';
import { useNftCheckoutPopupContext } from '../../../../../../providers/NFTCheckoutProvider';
import { useAuthStore } from '../../../../../../../stores/authStore';
interface INFTItemFooterProps extends BoxProps {
  NFT?: INFT;
  collection?: ICollection;
  order?: any;
  isCheckoutPopupOpened?: boolean;
  showBuyNowButton?: boolean;
  setIsCheckoutPopupOpened?: (isCheckoutPopupOpened: boolean) => void;
}

export const NFTItemFooter = (
  {
    NFT,
    collection,
    order,
    children,
    isCheckoutPopupOpened,
    setIsCheckoutPopupOpened,
    showBuyNowButton,
    ...rest
  }: INFTItemFooterProps
) => {
  const showLikes = false;
  const { address, isAuthenticated } = useAuthStore(s => ({address: s.address, isAuthenticated: s.isAuthenticated}))
  const {setNFT, setCollection, setIsOpen, setOrder, setOnClose} = useNftCheckoutPopupContext();


  const handleCheckoutModal = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    // @ts-ignore - TODO: this is temp
    if(isCheckoutPopupOpened) {
      setIsOpen(false);
      setOrder({} as IOrder);
      setNFT({} as INFT);
      setCollection({} as ICollection);
    } else {
      setIsOpen(true);
      setOrder(order || {} as IOrder);
      setNFT(NFT || {} as INFT)
      setCollection(collection as ICollection);
    }
  }

  const isOwner = address?.toLowerCase() === NFT?._ownerAddress?.toLowerCase();

  return (
    <Flex {...styles.WrapperStyle} {...rest}>
      {children ? children : (
        <>
          <Flex w={'100%'} justifyContent={'space-between'}>
            <Box sx={{ '> div': { mr: '6px', _last: { mr: 0 } } }}>
              {NFT && <NFTItemFooterStandardLabel isOwner={isOwner} NFT={NFT} showBuyNowButton={showBuyNowButton}/>}
              {NFT?.standard === NFTStandard.ERC1155 && <NFTItemFooterEditionsLabel isOwner={isOwner} NFT={NFT} />}
              {/*TODO: composition*/}
              {/*{NFT.assets?.length && (<NFTItemFooterCompositionLabel count={NFT.assets.length ?? 0} mr={'6px'} />)}*/}
            </Box>
            <Box className='buy-now-box'>
            {!isOwner && isAuthenticated && showBuyNowButton && <Button onClick={(event) => handleCheckoutModal(event)} className='buy-now' display={'none'} lineHeight={'0.5'} size='sm' borderRadius={'6px'}>Buy now</Button>}
            </Box>
          </Flex>


        </>
      )}
    </Flex>
  );
};
