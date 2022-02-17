import { Box, Button, Image, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { useBuyNFTSection } from '../../mocks';
import { useDateCountDown } from '../../../../../../hooks';
import * as styles from './styles';
import { HighestBid } from './components';
import { NFTCheckoutPopup } from '../nft-checkout-popup';

import ClockIcon from '../../../../../../../assets/images/clock.svg';
import { NFTPlaceABidPopup } from '../nft-place-a-bid-popup';

export const NFTBuySection = () => {
  const buyNFTSection = useBuyNFTSection(8);

  const { countDownString } = useDateCountDown(new Date(new Date().setDate(new Date().getDate() + 1)));

  const [isCheckoutPopupOpened, setIsCheckoutPopupOpened] = useState(false);
  const [isPlaceABidPopupOpened, setIsPlaceABidPopupOpened] = useState(false);

  return (
    <Box {...styles.WrapperStyle}>
      <Box {...styles.CountDownWrapperStyle} cursor={'pointer'} onClick={buyNFTSection.changeBuyNFTSection}>
        <Box {...styles.CountDownContentStyle} minW={`${((countDownString?.length ?? 0) + 5) * 10}px`}>
          <Text>
            <Image src={ClockIcon} />
            {countDownString} left
          </Text>
          <Text>Reserve price has been met</Text>
        </Box>
      </Box>
      <Box {...styles.ContentStyle}>

        {buyNFTSection.index === 0 && (
          <>
            <HighestBid />
            <SimpleGrid columns={2} spacingX={'12px'}>
              <Button boxShadow={'lg'} onClick={() => setIsPlaceABidPopupOpened(true)}>Place a bid</Button>
              <Button variant={'outline'}>Make offer</Button>
            </SimpleGrid>
          </>
        )}
        {buyNFTSection.index === 1 && (
          <>
            <HighestBid />
            <SimpleGrid columns={2} spacingX={'12px'}>
              <Button boxShadow={'lg'} onClick={() => setIsCheckoutPopupOpened(true)}>Buy for 0.5 ETH</Button>
              <Button variant={'outline'}>Make offer</Button>
            </SimpleGrid>
          </>
        )}
        {buyNFTSection.index === 2 && (
          <>
            <Button boxShadow={'lg'} w={'100%'} onClick={() => setIsCheckoutPopupOpened(true)}>Buy for 0.5 ETH</Button>
            <Text {...styles.ContentFeeLabelStyle} textAlign={'center'} mt={'12px'}>(10% of sales will go to creator)</Text>
          </>
        )}
        {buyNFTSection.index === 3 && (
          <>
            <Button boxShadow={'lg'} w={'100%'} onClick={() => setIsPlaceABidPopupOpened(true)}>Place a bid</Button>
            <Text {...styles.ContentFeeLabelStyle} textAlign={'center'} mt={'12px'}>(10% of sales will go to creator)</Text>
          </>
        )}
        {buyNFTSection.index === 4 && (
          <>
            <Button boxShadow={'lg'} w={'100%'}>Put on sale</Button>
            <Text {...styles.ContentFeeLabelStyle} textAlign={'center'} mt={'12px'} color={'rgba(0, 0, 0, 0.4)'}>
              This NFT is on your wallet
            </Text>
          </>
        )}
        {buyNFTSection.index === 5 && (
          <>
            <HighestBid />
            <SimpleGrid columns={2} spacingX={'12px'}>
              <Button boxShadow={'lg'}>Lower Price</Button>
              <Button variant={'outline'}>Cancel listing</Button>
            </SimpleGrid>
          </>
        )}
        {buyNFTSection.index === 6 && (
          <>
            <HighestBid />
            <SimpleGrid columns={2} spacingX={'12px'}>
              <Button boxShadow={'lg'}>Change price</Button>
              <Button variant={'outline'}>Cancel listing</Button>
            </SimpleGrid>
          </>
        )}
        {buyNFTSection.index === 7 && (
          <>
            <SimpleGrid columns={2} spacingX={'12px'}>
              <Button boxShadow={'lg'}>Change price</Button>
              <Button variant={'outline'}>Cancel listing</Button>
            </SimpleGrid>
            <Text {...styles.ContentFeeLabelStyle} textAlign={'center'} mt={'12px'}>
              This NFT is on your wallet
            </Text>
          </>
        )}
      </Box>
      <NFTCheckoutPopup isOpen={isCheckoutPopupOpened} onClose={() => setIsCheckoutPopupOpened(false)} />
      <NFTPlaceABidPopup isOpen={isPlaceABidPopupOpened} onClose={() => setIsPlaceABidPopupOpened(false)} />
    </Box>
  );
}
