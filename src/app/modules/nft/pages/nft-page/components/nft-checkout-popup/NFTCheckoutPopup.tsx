import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, Signer, utils, Contract, constants } from 'ethers';
import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { Web3Provider } from '@ethersproject/providers';
import { useRouter } from 'next/router';

import WarningSVGIcon from '../../../../../../../assets/images/yellowIcon.svg';
import ArrowSVGIcon from '../../../../../../../assets/images/arrow.svg';
import WalletImage from '../../../../../../../assets/images/v2/wallet.png';
import AudioNFTPreviewImage from '../../../../../../../assets/images/v2/audio-nft-preview.png';
import Contracts from '../../../../../../../contracts/contracts.json';

import { Checkbox, InputShadow, Loading, TokenIcon } from '../../../../../../components';
import { NFTType } from './components';
import { CheckoutState } from './enums';
import * as styles from './styles';
import { ICollection, IERC20AssetType, IERC721AssetType, INFT, IOrder } from '../../../../types';
import { isNFTAssetAudio, isNFTAssetImage, isNFTAssetVideo } from '../../../../helpers';
import { getTokenByAddress, TOKENS_MAP } from '../../../../../../constants';
import { TokenTicker } from '../../../../../../enums';
import { NFTCustomError } from '../nft-custom-error/NFTCustomError';
import { getEtherscanTxUrl } from '../../../../../../../utils/helpers';
import { formatAddress, shortenEthereumAddress } from '../../../../../../../utils/helpers/format';
import { useTokenPrice } from '../../../../../../hooks';
import { IToken } from '../../../../../../types';
import { GetActiveListingApi, GetNFT2Api } from '../../../../api';
import { nftKeys, orderKeys } from '../../../../../../utils/query-keys';
import CheckIcon from '../../../../../../../assets/images/check-vector.svg';
import { useNftCheckoutPopupContext } from '../../../../../../providers/NFTCheckoutProvider';
import { useAuthStore } from '../../../../../../../stores/authStore';
import { useErrorStore } from '../../../../../../../stores/errorStore';
// @ts-ignore
const { contracts: contractsData } = Contracts[process.env.REACT_APP_NETWORK_CHAIN_ID];

interface INFTCheckoutPopupProps {
  NFT?: INFT;
  collection?: ICollection;
  NFTs?: INFT[];
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTCheckoutPopup = ({ NFT, collection, NFTs, order, isOpen, onClose }: INFTCheckoutPopupProps) => {
  const router = useRouter();

  const { address, signer, web3Provider } = useAuthStore(s => ({address: s.address, signer: s.signer, web3Provider: s.web3Provider}))
  const { setShowError, setErrorBody } = useErrorStore(s => ({setShowError: s.setShowError, setErrorBody: s.setErrorBody}))
  const { onCopy } = useClipboard(address);
  const queryClient = useQueryClient();

  const { setIsOpen } = useNftCheckoutPopupContext();

  const [state, setState] = useState<CheckoutState>(CheckoutState.CHECKOUT);
  const [isNFTAudio] = useState(false);
  const [approveTx, setApproveTx] = useState<string>('');

  // INDEXING
  const [fetchOrderCount, setFetchOrderCount] = useState(0);
  const [fetchNftCount, setFetchNftCount] = useState(0);
  const [isOrderIndexed, setIsOrderIndexed] = useState(false);
  const [isNftIndexed, setIsNftIndexed] = useState(false);
  const [newOrderInfo, setNewOrderInfo] = useState<IOrder | null>(null);
  const [newNftInfo, setNewNftInfo] = useState<INFT | null>(null);

  const [nftInterval, setNftInterval] = useState<NodeJS.Timer>();
  const [orderInterval, setOrderInterval] = useState<NodeJS.Timer>();

  const [verificationChecked, setSerificationChecked] = useState(false);

  const prepareMutation = useMutation(({ hash, data }: { hash: string; data: any }) => {
    return axios.post(`${process.env.REACT_APP_MARKETPLACE_BACKEND}/v1/orders/${hash}/prepare`, data);
  });

  const tokenTicker = getTokenByAddress((order?.take?.assetType as IERC20AssetType)?.contract);

  const listingPrice = Number(utils.formatUnits(order?.take.value || 0, tokenTicker.decimals));

  const usdPrice = useTokenPrice(tokenTicker.ticker);

  const usdListingPrice = Math.round(listingPrice * usdPrice);

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

  const handleCheckoutClick = useCallback(async () => {
    try {
      if (!signer || !web3Provider) {
        return;
      }
      setFetchOrderCount(0);
      setState(CheckoutState.PROCESSING);
      const paymentToken = getTokenByAddress((order?.take?.assetType as IERC20AssetType)?.contract);

      if (paymentToken.ticker !== TokenTicker.ETH) {
        const paymentAmount = BigNumber.from(order.take.value);
        const contract = new Contract(
          contractsData[paymentToken.contractName].address,
          contractsData[paymentToken.contractName].abi,
          signer
        );
        const balance = await contract.balanceOf(address);

        if (paymentAmount.gt(balance)) {
          setState(CheckoutState.INSUFFICIENT_BALANCE);
          return;
        }

        const allowance = await contract.allowance(address, process.env.REACT_APP_MARKETPLACE_CONTRACT);

        if (paymentAmount.gt(allowance)) {
          setState(CheckoutState.APPROVAL);

          const approveTx = await contract.approve(process.env.REACT_APP_MARKETPLACE_CONTRACT, constants.MaxUint256);
          setApproveTx(approveTx?.hash);

          await approveTx.wait();

          setState(CheckoutState.PROCESSING);
        }
      } else {
        const paymentAmount = BigNumber.from(order.take.value);
        const balance = await web3Provider.getBalance(address);

        if (paymentAmount.gt(balance)) {
          setState(CheckoutState.INSUFFICIENT_BALANCE);
          return;
        }
      }

      const response = await prepareMutation.mutateAsync({
        hash: order.hash,
        data: {
          maker: address,
          amount: order.make.value,
        },
      });
      console.log('response', response);

      const { data, from, to, value } = response.data;

      await sendSellTransaction(data, from, to, BigNumber.from(value.hex)); // TODO Test after new version of contracts and backend redeployed

      setState(CheckoutState.INDEXING);
      // This polling mechanic is temporary until we have marketplace web sockets
      const orderIndexing = setInterval(async () => {
        setFetchOrderCount((count) => (count += 1));

        const convertedOrder = order.make.assetType as IERC721AssetType;
        const tokenId = convertedOrder.tokenId?.toString();
        const collectionAddress = convertedOrder.contract;

        // Fetch order api until a diffrent response is returned
        const newOrder = await GetActiveListingApi(collectionAddress, tokenId);

        // Change query information about order
        if (!newOrder?.id || order.id !== newOrder.id) {
          clearInterval(orderIndexing);
          setNewOrderInfo(newOrder);
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

      setNftInterval(nftIndexing);
      setOrderInterval(orderIndexing);
    } catch (err: any) {
      console.log(err);
      setState(CheckoutState.CHECKOUT);

      // Code 4001 is user rejected transaction
      if (err?.code === 4001) {
        return;
      }

      // Check if error comes from api request and if the api has returned a meaningful messages
      if (prepareMutation.isError && !!(prepareMutation as any)?.error?.response?.data?.message) {
        setErrorBody((prepareMutation as any)?.error?.response?.data?.message);
      } else if (err.response?.data?.message) {
        setErrorBody(err.response.data.message);
      } else if (err.error?.message) {
        setErrorBody(err.error.message);
      }

      setShowError(true);
    }
  }, [order, address, signer, web3Provider]);

  useEffect(() => {
    if (isOrderIndexed && isNftIndexed) {
      const tokenId = NFT?.tokenId || '';
      const collectionAddress = NFT?._collectionAddress || '';

      setState(CheckoutState.CONGRATULATIONS);

      //TODO: Invalidate browse marketplace page if order has been loaded
      queryClient.refetchQueries(orderKeys.browseAny);

      // Invalidate listing because it's not active anymore
      queryClient.invalidateQueries(orderKeys.listing({ tokenId, collectionAddress }));
      queryClient.invalidateQueries(orderKeys.history({ tokenId, collectionAddress }));
      queryClient.setQueriesData(orderKeys.listing({ tokenId, collectionAddress }), newOrderInfo);

      // Invalidate nfts counter
      queryClient.invalidateQueries(nftKeys.fetchNftSummary(address));

      // Invalidate nft info query in order to refetch new owner info
      if (newNftInfo) {
        queryClient.setQueryData(nftKeys.nftInfo({ tokenId, collectionAddress }), newNftInfo);
      } else {
        // queryClient.invalidateQueries(nftKeys.nftInfo({tokenId, collectionAddress}));
        queryClient.setQueryData(nftKeys.nftInfo({ tokenId, collectionAddress }), null);
      }

      // Invalidate my nfts query in order to see the new nft
      queryClient.refetchQueries(nftKeys.userNfts(address));

      setNewNftInfo(null);
      setNewOrderInfo(null);
    }
  }, [isOrderIndexed, isNftIndexed]);

  const sendSellTransaction = async (data: string, from: string, to: string, value: BigNumber) => {
    const sellTx = await (signer as Signer).sendTransaction({
      data,
      from,
      to,
      value,
    });

    return sellTx.wait();
  };

  const handleMyNFTsClick = useCallback(() => {
    onClose();
    router.push('/my-polymorphs');
  }, []);

  const handleAddFundsClick = useCallback(() => {
    setState(CheckoutState.ADD_FUNDS);
  }, []);

  const handleBackClick = useCallback(() => {
    setState(CheckoutState.CHECKOUT);
  }, []);

  const previewNFT = useMemo(() => {
    if (NFT) {
      return NFT;
    }
    if (NFTs && NFTs?.length) {
      return NFTs[0];
    }
    return null;
  }, [NFT, NFTs]);

  useEffect(() => {
    setState(CheckoutState.CHECKOUT);
  }, [isOpen, NFTs]);

  if (!order) {
    return null;
  }

  return (
    !!previewNFT && (
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsOpen(false);
        }}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent maxW={'480px'}>
          <ModalCloseButton />
          <ModalBody pt={'40px !important'}>
            {state === CheckoutState.CHECKOUT && (
              <>
                <Heading {...styles.TitleStyle}>Checkout</Heading>
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
                  </Box>
                    <Box flex={1} p={'20px'}>
                      <Text>{NFT?.name}</Text>
                      <Text {...styles.CollectionNameStyle}>
                        {collection?.name || shortenEthereumAddress(NFT?._collectionAddress)}
                      </Text>
                    <Box {...styles.PriceContainerStyle}>
                      <Text fontSize={'14px'}>
                        <TokenIcon ticker={tokenTicker.ticker} display={'inline'} size={20} mr={'6px'} mt={'-3px'} />
                        {listingPrice}
                      </Text>
                      <Text {...styles.PriceUSDStyle}>${usdListingPrice}</Text>
                    </Box>
                  </Box>
                </Flex>

                <Flex {...styles.TotalContainerStyle} pr={'20px'}>
                  <Text>Total</Text>
                  <Box {...styles.PriceContainerStyle}>
                    <Text fontSize={'18px'}>
                      <TokenIcon ticker={tokenTicker.ticker} display={'inline'} size={24} mr={'6px'} mt={'-3px'} />
                      {listingPrice}
                    </Text>
                    <Text {...styles.PriceUSDStyle}>${usdListingPrice}</Text>
                  </Box>
                </Flex>

                <Flex>
                  <Checkbox isChecked={verificationChecked} onChange={() => setSerificationChecked(!verificationChecked)} mr={"15px"} alignSelf={'flex-start'} />
                 <Box>
                   <Text mb={'12px'} fontSize={'12px'}>
                    Always verify on Etherscan to confirm that the contract address is the same address as the project you are trying to buy. Ethereum transactions are irreversible.
                  </Text>
                  <Text fontWeight={600} fontSize={'12px'} >
                    By checking this box, I acknowledge this information.
                  </Text>
                 </Box>

                </Flex>

                <Box {...styles.ButtonsContainerStyle}>
                  <Button disabled={!verificationChecked} boxShadow={'lg'} onClick={handleCheckoutClick}>
                    Checkout
                  </Button>
                  <Button variant={'outline'} onClick={handleAddFundsClick}>
                    Add Funds
                  </Button>
                </Box>
              </>
            )}

            {state === CheckoutState.INSUFFICIENT_BALANCE && (
              <NFTCustomError
                title={`Insufficient balance`}
                message={`You do not have enough ${
                  getTokenByAddress(order?.take.assetType.contract as TokenTicker).ticker
                } in your wallet!`}
              ></NFTCustomError>
            )}

            {state === CheckoutState.PROCESSING && (
              <Box>
                <Heading {...styles.TitleStyle} mb={'20px'}>
                  Purchasing the NFT...
                </Heading>

                <Text fontSize={'14px'} mx={'auto'} maxW={'260px'} textAlign={'center'}>
                  Just accept the signature request and wait for us to process your offer
                </Text>

                <Loading my={'64px'} />
              </Box>
            )}

            {state === CheckoutState.INDEXING && (
              <Box>
                <Heading {...styles.TitleStyle} mb={'20px'}>
                  Purchasing the NFT...
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

            {state === CheckoutState.APPROVAL && (
              <Box>
                <Heading {...styles.TitleStyle} mb={'20px'}>
                  Purchasing the NFT...
                </Heading>

                <Text fontSize={'14px'} mx={'auto'} maxW={'260px'} textAlign={'center'}>
                  Please give an approval for the specified amount ..
                </Text>

                <Loading my={'64px'} />

                {approveTx && (
                  <Text color={'rgba(0, 0, 0, 0.6)'} textAlign={'center'} key={approveTx}>
                    Transaction hash #{1}:{' '}
                    <a target="_blank" href={getEtherscanTxUrl(approveTx)} rel="noreferrer" style={{ color: 'blue' }}>
                      {formatAddress(approveTx)}
                    </a>
                  </Text>
                )}
              </Box>
            )}

           {state === CheckoutState.CONGRATULATIONS && (
            <>
              <Heading {...styles.TitleStyle} mb={'10px'}>Congratulations!</Heading>
              <Text color={'rgba(0, 0, 0, 0.6)'} textAlign={'center'}>You have successfully bought the NFT</Text>

              <Box {...styles.AssetCongratsStyle}>
                {isNFTAssetImage(previewNFT.artworkTypes) && <Image src={previewNFT.thumbnailUrl} />}
                {isNFTAssetVideo(previewNFT.artworkTypes) && <video src={previewNFT.thumbnailUrl} />}
                {isNFTAssetAudio(previewNFT.artworkTypes) && <Image src={AudioNFTPreviewImage} />}
                {!!NFTs && !!NFTs?.length && <NFTType type={'bundle'} count={NFTs.length} />}
              </Box>

              <Box {...styles.ButtonsContainerStyle}>
                <Button boxShadow={'lg'} onClick={handleMyNFTsClick}>My NFTs</Button>
                <Button variant={'outline'} onClick={onClose}>Close</Button>
              </Box>
            </>
          )}

          {state === CheckoutState.ADD_FUNDS && (
            <>
              <Heading {...styles.TitleStyle} mb={'40px'} position={'relative'}>
                <Image src={ArrowSVGIcon}
                       cursor={'pointer'}
                       position={'absolute'}
                       left={0}
                       transform={'translateY(50%)'}
                       onClick={handleBackClick}
                />
                Add funds
              </Heading>

              <Image src={WalletImage} {...styles.WalletStyle} />

              <Text textAlign={'center'} px={'20px'} mb={'30px'}>
                Transfer funds from an exchange or another wallet to your wallet address below:
              </Text>

              <Flex position={'relative'} flexDir={{ base: 'column', md: 'row' }}>
                <InputShadow
                  flex={1}
                  mr={{ base: 0, md: '14px' }}
                  mb={{ base: '14px', md: 0 }}
                >
                  <Input defaultValue={address} />
                </InputShadow>

                <Button size={'lg'} fontSize={'16px'} boxShadow={'lg'} onClick={onCopy}>Copy</Button>
              </Flex>
            </>
          )}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  );
};
