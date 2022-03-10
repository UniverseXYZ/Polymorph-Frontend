import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber as EthersBigNumber, Signer, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { useMutation } from 'react-query';

import AudioNFTPreviewImage from '../../../../../../../../../../../assets/images/v2/audio-nft-preview.png';

import { useAuthContext } from '../../../../../../../../../../../contexts/AuthContext';
import { Loading, TokenIcon } from '../../../../../../../../../../components';
import { NFTType } from './components';
import { AcceptState } from './enums';
import * as styles from './styles';
import { INFT, IOrder } from '../../../../../../../../types';
import { isNFTAssetAudio, isNFTAssetImage, isNFTAssetVideo } from '../../../../../../../../helpers';
import { TOKENS_MAP, getTokenByAddress } from '../../../../../../../../../../constants';
import { TokenTicker } from '../../../../../../../../../../enums';
import { Fee } from '../../../../../../../../../marketplace/pages/sell-page/components/tab-summary/compoents';
import { getRoyaltiesFromRegistry } from '../../../../../../../../../../../utils/marketplace/utils';
import { useTokenPrice } from '../../../../../../../../../../hooks';
import { useErrorContext } from '../../../../../../../../../../../contexts/ErrorContext';

interface INFTAcceptOfferPopupProps {
  NFT?: INFT;
  NFTs?: INFT[];
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
}
const UNIVERSE_FEE = 2.5;

export const NFTAcceptOfferPopup = ({ NFT, NFTs, order, isOpen, onClose }: INFTAcceptOfferPopupProps) => {
  const { address, signer } = useAuthContext() as any;

  const { setShowError, setErrorBody} = useErrorContext() as any;

  const [state, setState] = useState<AcceptState>(AcceptState.CHECKOUT);
  const [nftRoyalties, setNftRoyalties] = useState(0);
  const [collectionRoyalties, setCollectionRoyalties] = useState(0);
  const [daoFee, setDaoFee] = useState(0);
  const [totalRoyalties, setTotalRoyalties] = useState(0);
  const [isNFTAudio] = useState(false);
  
  const tokenTicker = useMemo(() => {
    return getTokenByAddress((order as any).make.assetType.contract).ticker as TokenTicker
  }, [order]);

  const tokenDecimals = useMemo(() => {
    return TOKENS_MAP[tokenTicker]?.decimals ?? 18
  }, [tokenTicker]);

  const listingPrice = useMemo(() => {
    return utils.formatUnits((order as any).make.value, tokenDecimals)
  }, [tokenDecimals]);

  const prepareMutation = useMutation(({ hash, data }: { hash: string, data: any }) => {
    return axios.post(`${process.env.REACT_APP_MARKETPLACE_BACKEND}/v1/orders/${hash}/prepare`, data);
  });

  const usdPrice = useTokenPrice(tokenTicker);

   const usd = useMemo(() => {
    return new BigNumber(usdPrice).multipliedBy(listingPrice).toFixed(2);
   }, [usdPrice, listingPrice])


  const handleAcceptClick = useCallback(async () => {
    try {
      setState(AcceptState.PROCESSING);

      const response = await prepareMutation.mutateAsync({
        hash: order.hash,
        data: {
          maker: address,
          amount: order.take.value,
        },
      });
      console.log('response', response);
  
      const {data, from, to, value} = response.data;
  
      await sendAcceptOfferTransaction(data, from, to, EthersBigNumber.from(value.hex));
      setState(AcceptState.CONGRATULATIONS);
    } catch(err: any) {
      console.log(err)   
      setState(AcceptState.CHECKOUT);

      // Code 4001 is user rejected transaction
      if (err?.code === 4001) {
        return;
      } 

      // Check if error comes from api request and if the api has returned a meaningful messages
      if (prepareMutation.isError && !!(prepareMutation as any)?.error?.response?.data?.message) {
        setErrorBody((prepareMutation as any)?.error?.response?.data?.message)
      }

      setShowError(true);
    }
  }, [order, address, signer]);

  const sendAcceptOfferTransaction = async (data: string, from: string, to: string, value: EthersBigNumber ) => {

    const sellTx = await (signer as Signer).sendTransaction({
      data,
      from,
      to,
      value
    })

    return sellTx.wait();
  }

  const fetchNftRoyalties =  async () => {
    if (NFT?._collectionAddress && NFT.tokenId) {
      try {
        const { nftRoyaltiesPercent, collectionRoyaltiesPercent, daoFee } = await getRoyaltiesFromRegistry(NFT._collectionAddress, NFT.tokenId, signer);
        setNftRoyalties(+nftRoyaltiesPercent / 100);
        setCollectionRoyalties(+collectionRoyaltiesPercent / 100);
        setDaoFee(+daoFee / 100);
      } catch(err) {
        console.log(err)
      }
    }
  }

  const finalPrice = useMemo(() => {
    const royaltyCut = new BigNumber(listingPrice).multipliedBy(totalRoyalties).dividedBy(100)
    const final = new BigNumber(listingPrice).minus(royaltyCut).toFixed(2);
    return final;
  }, [order, totalRoyalties, tokenDecimals, listingPrice]);

  useEffect(() => {
    fetchNftRoyalties()
  }, [NFT?._collectionAddress, NFT?.tokenId, signer])

  useEffect(() => {
    setTotalRoyalties(nftRoyalties + collectionRoyalties + daoFee);
  }, [nftRoyalties, collectionRoyalties, daoFee])

  const previewNFT = useMemo(() => {
    return NFT || (NFTs as INFT[])[0];
  }, [NFT, NFTs]);

  useEffect(() => {
    setState(AcceptState.CHECKOUT);
  }, [isOpen, NFTs]);

  if (!order) {
    return null;
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={'480px'}>
        <ModalCloseButton />
        <ModalBody pt={'40px !important'}>
          {state === AcceptState.CHECKOUT && (
            <>
              <Heading {...styles.TitleStyle}>Accept this offer</Heading>
              <Flex {...styles.TitlesContainerStyle}>
                <Text>Item</Text>
                <Text>Subtotal</Text>
              </Flex>

              <Flex {...styles.NFTContainerStyle}>
                <Box pos={'relative'}>
                  <Box {...styles.AssetStyle}>
                    {isNFTAssetImage(previewNFT.artworkType) && <Image src={previewNFT.thumbnailUrl} />}
                    {isNFTAssetVideo(previewNFT.artworkType) && <video src={previewNFT.thumbnailUrl} />}
                    {isNFTAssetAudio(previewNFT.artworkType) && <Image src={AudioNFTPreviewImage} />}
                  </Box>
                  {!!NFTs && (<NFTType type={'bundle'} count={NFTs.length} />)}
                </Box>
                <Box flex={1} p={'20px'}>
                  <Text>{NFT?.name}</Text>
                  <Text {...styles.CollectionNameStyle}>{NFT?.collection?.name}</Text>
                </Box>
                <Box {...styles.PriceContainerStyle}>
                  <Text fontSize={'14px'}>
                    <TokenIcon ticker={tokenTicker} display={'inline'} size={20} mr={'6px'} mt={'-3px'} />
                    {listingPrice}
                  </Text>
                  <Text {...styles.PriceUSDStyle}>${usd}</Text>
                </Box>
              </Flex>

              <Box>
                <Text fontSize={'16px'} fontWeight={700}>Fees</Text>
                <Box layerStyle={'Grey'} {...styles.FeesContainerStyle}>
                  <Fee name={'To Universe'} amount={UNIVERSE_FEE} />
                  <Fee name={'To collection'} amount={collectionRoyalties} />
                  <Fee name={'To creator'} amount={nftRoyalties} />
                  <Fee name={'Total'} amount={totalRoyalties} />
                </Box>
              </Box>

              <Flex {...styles.TotalContainerStyle}>
                <Text>Total</Text>
                <Box {...styles.PriceContainerStyle}>
                  <Text fontSize={'18px'}>
                    <TokenIcon ticker={tokenTicker} display={'inline'} size={24} mr={'6px'} mt={'-3px'} />
                    {finalPrice}
                  </Text>
                  <Text {...styles.PriceUSDStyle}>${usd}</Text>
                </Box>
              </Flex>

              <Box {...styles.ButtonsContainerStyle}>
                <Button boxShadow={'lg'} onClick={handleAcceptClick}>Accept</Button>
              </Box>
            </>
          )}

          {state === AcceptState.PROCESSING && (
            <Box>
              <Loading my={'64px'} />
              <Text textAlign={'center'} color={'rgba(0, 0, 0, 0.6)'}>
                Loading.... do not click refresh or leave this page.<br/>
                Just kidding you can do whatever you want.<br/>
                This is Ethereum!
              </Text>
            </Box>
          )}

          {state === AcceptState.CONGRATULATIONS && (
            <>
              <Heading {...styles.TitleStyle} mb={'10px'}>Congratulations!</Heading>
              <Text color={'rgba(0, 0, 0, 0.6)'} textAlign={'center'}>
                You have successfully sold <strong>{NFT?.name}</strong>
              </Text>

              <Box {...styles.AssetCongratsStyle}>
                {isNFTAssetImage(previewNFT.artworkType) && <Image src={previewNFT.thumbnailUrl} />}
                {isNFTAssetVideo(previewNFT.artworkType) && <video src={previewNFT.thumbnailUrl} />}
                {isNFTAssetAudio(previewNFT.artworkType) && <Image src={AudioNFTPreviewImage} />}
                {!!NFTs && (<NFTType type={'bundle'} count={NFTs.length} />)}
              </Box>

              <Box {...styles.ButtonsContainerStyle}>
                <Button variant={'outline'} onClick={onClose}>Close</Button>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
