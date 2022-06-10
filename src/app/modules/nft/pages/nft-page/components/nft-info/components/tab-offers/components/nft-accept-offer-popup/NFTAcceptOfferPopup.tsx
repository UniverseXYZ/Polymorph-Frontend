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
import { BigNumber as EthersBigNumber, Contract, Signer, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { useMutation, useQueryClient } from 'react-query';

import AudioNFTPreviewImage from '../../../../../../../../../../../assets/images/v2/audio-nft-preview.png';

import { Loading, TokenIcon } from '../../../../../../../../../../components';
import { NFTType } from './components';
import { AcceptState } from './enums';
import * as styles from './styles';
import { IERC20AssetType, IERC721AssetType, INFT, IOrder } from '../../../../../../../../types';
import { isNFTAssetAudio, isNFTAssetImage, isNFTAssetVideo } from '../../../../../../../../helpers';
import { TOKENS_MAP, getTokenByAddress } from '../../../../../../../../../../constants';
import { TokenTicker } from '../../../../../../../../../../enums';
// import { Fee } from '../../../../../../../../../marketplace/pages/sell-page/components/tab-summary/compoents';
import { getRoyaltiesFromRegistry } from '../../../../../../../../../../../utils/marketplace/utils';
import { useTokenPrice } from '../../../../../../../../../../hooks';
import { nftKeys, orderKeys } from '../../../../../../../../../../utils/query-keys';
import { GetActiveListingApi, GetNFT2Api, GetOrdersApi } from '../../../../../../../../api';
import { useNFTPageData } from '../../../../../../NFTPage.context';
import CheckIcon from '../../../../../../../../../../../assets/images/check-vector.svg';
import Contracts from '../../../../../../../../../../../contracts/contracts.json';
import { NFTCustomError } from '../../../../../nft-custom-error/NFTCustomError';
import { useAuthStore } from '../../../../../../../../../../../stores/authStore';
import { useErrorStore } from '../../../../../../../../../../../stores/errorStore';

interface INFTAcceptOfferPopupProps {
  NFT?: INFT;
  NFTs?: INFT[];
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
}

// @ts-ignore
const { contracts: contractsData } = Contracts[process.env.REACT_APP_NETWORK_CHAIN_ID];

export const NFTAcceptOfferPopup = ({ NFT, NFTs, order, isOpen, onClose }: INFTAcceptOfferPopupProps) => {
  const { address, signer } = useAuthStore(s => ({address: s.address, signer: s.signer}))

  const { setShowError, setErrorBody } = useErrorStore(s => ({setErrorBody: s.setErrorBody, setShowError: s.setShowError}))

  const contract = useMemo(() => !signer ? null : new Contract(`${NFT?._collectionAddress}`, contractsData[NFT?.standard].abi, signer), [signer]);

  const queryClient = useQueryClient();
  const { offers } = useNFTPageData();

  const [state, setState] = useState<AcceptState>(AcceptState.CHECKOUT);
  const [nftRoyalties, setNftRoyalties] = useState(0);
  const [collectionRoyalties, setCollectionRoyalties] = useState(0);
  const [daoFee, setDaoFee] = useState(0);
  const [totalRoyalties, setTotalRoyalties] = useState(0);
  const [isNFTAudio] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  // INDEXING
  const [fetchOrderCount, setFetchOrderCount] = useState(0);
  const [fetchNftCount, setFetchNftCount] = useState(0);
  const [isOrderIndexed, setIsOrderIndexed] = useState(false);
  const [isNftIndexed, setIsNftIndexed] = useState(false);
  const [newOffersInfo, setNewOffersInfo] = useState<IOrder[]>([]);
  const [newNftInfo, setNewNftInfo] = useState<INFT | null>(null);
  const [nftInterval, setNftInterval] = useState<NodeJS.Timer>();
  const [orderInterval, setOrderInterval] = useState<NodeJS.Timer>();
  const [nftRoyaltiesValue, setNftRoyaltiesValue] = useState(0);
  const [collectionRoyaltiesValue, setCollectionRoyaltiesValue] = useState(0);
  const [daoFeeValue, setDaoFeeValue] = useState(0);

  const tokenTicker = useMemo(() => {
    return getTokenByAddress((order as any).make.assetType.contract).ticker as TokenTicker;
  }, [order]);

  const tokenDecimals = useMemo(() => {
    return TOKENS_MAP[tokenTicker]?.decimals ?? 18;
  }, [tokenTicker]);

  const listingPrice = useMemo(() => {
    return Number(utils.formatUnits((order as any).make.value, tokenDecimals));
  }, [tokenDecimals]);

  const prepareMutation = useMutation(({ hash, data }: { hash: string; data: any }) => {
    return axios.post(`${process.env.REACT_APP_MARKETPLACE_BACKEND}/v1/orders/${hash}/prepare`, data);
  });

  const usdPrice = useTokenPrice(tokenTicker);

  const usd = useMemo(() => {
    return new BigNumber(usdPrice).multipliedBy(listingPrice).toFixed(2);
  }, [usdPrice, listingPrice]);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (nftInterval) {
        clearInterval(nftInterval);
      }

      if (orderInterval) {
        clearInterval(orderInterval);
      }
    };
  }, []);

  const handleAcceptClick = useCallback(async () => {
    try {
      if (!signer || !contract) {
        return;
      }
      const isApprovedForAll = await contract.isApprovedForAll(address, process.env.REACT_APP_MARKETPLACE_CONTRACT);
      if (!isApprovedForAll) {
        setState(AcceptState.APPROVAL);
        const approveTx = await contract.setApprovalForAll(process.env.REACT_APP_MARKETPLACE_CONTRACT, true);
        await approveTx.wait();
      }
      const paymentToken = getTokenByAddress((order?.make?.assetType as IERC20AssetType)?.contract);
      const paymentAmount = EthersBigNumber.from(order?.make?.value)
      const tokenContract = new Contract(contractsData[paymentToken.contractName].address, contractsData[paymentToken.contractName].abi, signer);
      const balance = await tokenContract.balanceOf(order.maker);

      if (paymentAmount.gt(balance)) {
        setState(AcceptState.INSUFFICIENT_BALANCE);
        return;
      }

      setFetchCount(0);
      setState(AcceptState.PROCESSING);

      const response = await prepareMutation.mutateAsync({
        hash: order.hash,
        data: {
          maker: address,
          amount: order.take.value,
        },
      });
      console.log('response', response);

      const { data, from, to, value } = response.data;

      await sendAcceptOfferTransaction(data, from, to, EthersBigNumber.from(value.hex));
      setState(AcceptState.INDEXING);
      // This polling mechanic is temporary until we have marketplace web sockets
      const orderIndexing = setInterval(async () => {
        const stringifiedOffers = offers?.orders?.map((offer) => offer.id).join('');
        setFetchCount((count) => (count += 1));

        const convertedOrder = order.take.assetType as IERC721AssetType;
        const tokenId = convertedOrder.tokenId?.toString();
        const collectionAddress = convertedOrder.contract;

        const newOffers = await GetOrdersApi({
          side: 0,
          tokenIds: tokenId,
          collection: collectionAddress,
        });

        // Change query information about order
        const newStringifiedoffers = newOffers?.orders?.map((offer) => offer.id).join('');
        if (stringifiedOffers !== newStringifiedoffers) {
          clearInterval(orderIndexing);
          setNewOffersInfo(newOffers.orders);
          setIsOrderIndexed(true);
        }
      }, 4000);

      const nftIndexing = setInterval(async () => {
        setFetchNftCount((count) => (count += 1));

        const tokenId = NFT?.tokenId || '';
        const collectionAddress = NFT?._collectionAddress || '';

        // Fetch order api until a diffrent response is returned
        const newNft = await GetNFT2Api(collectionAddress, tokenId, false);

        // Change query information about order
        if (NFT?._ownerAddress?.toLowerCase() !== newNft._ownerAddress?.toLowerCase()) {
          clearInterval(nftIndexing);
          setNewNftInfo(newNft || null);
          setIsNftIndexed(true);
        }
      }, 10000);

      setOrderInterval(orderIndexing);
      setNftInterval(nftIndexing);
    } catch (err: any) {
      console.log(err);
      setState(AcceptState.CHECKOUT);

      // Code 4001 is user rejected transaction
      if (err?.code === 4001) {
        return;
      }

      // Check if error comes from api request and if the api has returned a meaningful messages
      if (prepareMutation.isError && !!(prepareMutation as any)?.error?.response?.data?.message) {
        setErrorBody((prepareMutation as any)?.error?.response?.data?.message);
      }

      setShowError(true);
    }
  }, [order, address, signer]);

  useEffect(() => {
    if (isOrderIndexed && isNftIndexed) {
      const tokenId = NFT?.tokenId || '';
      const collectionAddress = NFT?._collectionAddress || '';

      setState(AcceptState.CONGRATULATIONS);

      //TODO: Invalidate browse marketplace page if order has been loaded
      queryClient.refetchQueries(orderKeys.browseAny);

      // Invalidate listing because it's not active anymore
      queryClient.invalidateQueries(orderKeys.listing({ tokenId, collectionAddress }));
      queryClient.invalidateQueries(orderKeys.history({ tokenId, collectionAddress }));
      queryClient.setQueriesData(orderKeys.offers({ tokenId, collectionAddress }), newOffersInfo);

      // Invalidate nfts counter
      queryClient.invalidateQueries(nftKeys.fetchNftSummary(address));

      // Set fetched nft info or invalidate query
      if (newNftInfo) {
        queryClient.setQueryData(nftKeys.nftInfo({ tokenId, collectionAddress }), newNftInfo);
      } else {
        queryClient.invalidateQueries(nftKeys.nftInfo({ tokenId, collectionAddress }));
      }

      // Invalidate my nfts query in order to see the new nft
      queryClient.refetchQueries(nftKeys.userNfts(address));

      setNewNftInfo(null);
      setNewOffersInfo([]);
    }
  }, [isOrderIndexed, isNftIndexed]);

  const sendAcceptOfferTransaction = async (data: string, from: string, to: string, value: EthersBigNumber) => {
    const sellTx = await (signer as Signer).sendTransaction({
      data,
      from,
      to,
      value,
    });

    return sellTx.wait();
  };

  const fetchNftRoyalties = async () => {
    if (NFT?._collectionAddress && NFT.tokenId) {
      try {
        const { nftRoyaltiesPercent, collectionRoyaltiesPercent, daoFee } = await getRoyaltiesFromRegistry(
          NFT._collectionAddress,
          NFT.tokenId,
          signer
        );
        setNftRoyalties(+nftRoyaltiesPercent / 100);
        setCollectionRoyalties(+collectionRoyaltiesPercent / 100);
        setDaoFee(+daoFee / 100);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const finalPrice = useMemo(() => {
    const nftRoyaltiesAmount = listingPrice * nftRoyalties / 100;
    const collectionRoyaltiesAmount = (listingPrice - nftRoyaltiesAmount) * collectionRoyalties / 100;
    const daoFeeAmount =(listingPrice - nftRoyaltiesAmount - collectionRoyaltiesAmount) * daoFee / 100;

    setNftRoyaltiesValue(nftRoyaltiesAmount);
    setCollectionRoyaltiesValue(collectionRoyaltiesAmount);
    setDaoFeeValue(daoFeeAmount);

    return parseFloat((listingPrice - (nftRoyaltiesAmount + collectionRoyaltiesAmount + daoFeeAmount)).toFixed(8));
  }, [order, totalRoyalties, tokenDecimals, listingPrice]);

  const usdFinal = useMemo(() => {
    return new BigNumber(usdPrice).multipliedBy(finalPrice).toFixed(2);
  }, [usdPrice, finalPrice]);

  useEffect(() => {
    fetchNftRoyalties();
  }, [NFT?._collectionAddress, NFT?.tokenId, signer]);

  useEffect(() => {
    setTotalRoyalties(nftRoyalties + collectionRoyalties + daoFee);
  }, [nftRoyalties, collectionRoyalties, daoFee]);

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={false} closeOnOverlayClick={false}>
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
                    {(isNFTAssetImage(previewNFT.artworkTypes) && <Image src={previewNFT.thumbnailUrl} />) ||
                      (isNFTAssetVideo(previewNFT.artworkTypes) && <video src={previewNFT.thumbnailUrl} />) ||
                      (isNFTAssetAudio(previewNFT.artworkTypes) && <Image src={AudioNFTPreviewImage} />)}
                  </Box>
                  {!!NFTs && <NFTType type={'bundle'} count={NFTs.length} />}
                </Box>
                <Box flex={1} p={'20px'}>
                  <Text>{NFT?.name}</Text>
                  <Text {...styles.CollectionNameStyle}>{NFT?._collectionAddress}</Text>
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
                <Text fontSize={'16px'} fontWeight={700}>
                  Fees
                </Text>
                {/* <Box layerStyle={'Grey'} {...styles.FeesContainerStyle}>
                  <Fee name={'Creator'} amount={nftRoyalties} total={listingPrice} ticker={tokenTicker} />
                  <Fee name={'Collection'} amount={collectionRoyalties} total={listingPrice - nftRoyaltiesValue} ticker={tokenTicker}  />
                  <Fee name={'Universe'} amount={daoFee} total={listingPrice - nftRoyaltiesValue - collectionRoyaltiesValue} ticker={tokenTicker}  />
                  <Fee name={'Total Fees'} total={nftRoyaltiesValue + collectionRoyaltiesValue + daoFeeValue} ticker={tokenTicker} />
                </Box> */}
              </Box>

              <Flex {...styles.TotalContainerStyle}>
                <Text>Total</Text>
                <Box {...styles.PriceContainerStyle}>
                  <Text fontSize={'18px'}>
                    <TokenIcon ticker={tokenTicker} display={'inline'} size={24} mr={'6px'} mt={'-3px'} />
                    {finalPrice}
                  </Text>
                  <Text {...styles.PriceUSDStyle}>${usdFinal}</Text>
                </Box>
              </Flex>

              <Box {...styles.ButtonsContainerStyle}>
                <Button boxShadow={'lg'} onClick={handleAcceptClick}>
                  Accept
                </Button>
              </Box>
            </>
          )}

          {state === AcceptState.APPROVAL && (
            <Box>
              <Heading {...styles.TitleStyle} mb={'20px'}>
                Accepting offer...
              </Heading>

              <Loading my={'64px'} />
              <Text textAlign={'center'} color={'rgba(0, 0, 0, 0.6)'}>
                Please approve this collection before accepting the offer.
              </Text>
            </Box>
          )}

          {state === AcceptState.PROCESSING && (
            <Box>
              <Heading {...styles.TitleStyle} mb={'20px'}>
                Accepting offer...
              </Heading>

              <Loading my={'64px'} />
              <Text textAlign={'center'} color={'rgba(0, 0, 0, 0.6)'}>
                Loading.... do not click refresh or leave this page.
                <br />
                Just kidding you can do whatever you want.
                <br />
                This is Ethereum!
              </Text>
            </Box>
          )}

          {state === AcceptState.INDEXING && (
            <Box>
              <Heading {...styles.TitleStyle} mb={'20px'}>
                Accepting offer...
              </Heading>

              <Text fontSize={'16px'} mx={'auto'} maxW={'260px'} textAlign={'center'}>
                Indexing order transaction
                {!isOrderIndexed ? (
                  '...'
                ) : (
                  <Box display={'inline-block'} marginLeft={'5px'}>
                    <Image src={CheckIcon} alt={''} />
                  </Box>
                )}
              </Text>

              <Text fontSize={'16px'} mx={'auto'} maxW={'260px'} textAlign={'center'}>
                Indexing NFT changes
                {!isNftIndexed ? (
                  '...'
                ) : (
                  <Box display={'inline-block'} marginLeft={'5px'}>
                    <Image src={CheckIcon} alt={''} />
                  </Box>
                )}
              </Text>

              {(fetchOrderCount >= 3 && !isOrderIndexed) ||
                (fetchNftCount >= 5 && !isNftIndexed && (
                  <Text marginTop={'20px'} fontSize={'14px'} mx={'auto'} maxW={'330px'} textAlign={'center'}>
                    Receving the events from the blockchain is taking longer than expected. Please be patient.
                  </Text>
                ))}

              <Loading my={'64px'} />
            </Box>
          )}

          {state === AcceptState.CONGRATULATIONS && (
            <>
              <Heading {...styles.TitleStyle} mb={'10px'}>
                Congratulations!
              </Heading>
              <Text color={'rgba(0, 0, 0, 0.6)'} textAlign={'center'}>
                You have successfully sold <strong>{NFT?.name}</strong>
              </Text>

              <Box {...styles.AssetCongratsStyle}>
                {isNFTAssetImage(previewNFT.artworkTypes) && <Image src={previewNFT.thumbnailUrl} />}
                {isNFTAssetVideo(previewNFT.artworkTypes) && <video src={previewNFT.thumbnailUrl} />}
                {isNFTAssetAudio(previewNFT.artworkTypes) && <Image src={AudioNFTPreviewImage} />}
                {!!NFTs && <NFTType type={'bundle'} count={NFTs.length} />}
              </Box>

              <Box {...styles.ButtonsContainerStyle}>
                <Button variant={'outline'} onClick={onClose}>
                  Close
                </Button>
              </Box>
            </>
          )}

          {state === AcceptState.INSUFFICIENT_BALANCE && (
            <NFTCustomError
              title={`Insufficient balance`}
              message={`The creator of the offer does not have enough ${tokenTicker} in the wallet!`}
            ></NFTCustomError>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
