import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Contract } from 'ethers';
import EthereumAddress from 'ethereum-address';

import SuccessIcon from '../../../../../../../assets/images/bid-submitted.png';

import * as styles from './styles';
import { Loading, Select } from '../../../../../../components';
import { INFT, NFTStandard } from '../../../../types';
import ERC721Contract from '../../../../../../../abis/ERC721.json';
import { useAuthStore } from '../../../../../../../stores/authStore';

export enum INFTTransferState {
  FORM,
  PROCESSING,
  SUCCESS,
}

const getTransferSchema = (NFT: INFT) =>
  Yup.object().shape({
    receiverAddress: Yup.string()
      .required('This field can’t be empty')
      .test('receiverAddress', 'Wallet address is not valid', (value) =>
        EthereumAddress.isAddress(value)
      ),
    tokenId: Yup.string().required('This field can’t be empty'),
    amount: Yup.number()
      .required('This field can’t be empty')
      .min(1)
      .max(NFT.amount || 1),
  });

interface INFTTransferPopupProps {
  NFT: INFT;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTTransferPopup = ({ NFT, isOpen, onClose, }: INFTTransferPopupProps) => {
  const signer = useAuthStore(s => s.signer)

  const [state, setState] = useState<INFTTransferState>(INFTTransferState.FORM);

  const formik = useFormik<{ receiverAddress: string; tokenId: string; amount: number; }>({
    initialValues: {
      receiverAddress: '',
      tokenId: NFT.tokenId,
      amount: NFT.amount || 1,
    },
    validationSchema: getTransferSchema(NFT),
    onSubmit: async (value) => {
      try {
        if (!signer) {
          return;
        }
        setState(INFTTransferState.PROCESSING);

        const contract = new Contract(`${NFT._collectionAddress}`, ERC721Contract?.abi, signer);
        const address = await signer.getAddress();

        let methodName = 'safeTransferFrom(address,address,uint256)';
        let params: Array<string | number> = [address, value.receiverAddress, value.tokenId];

        if (NFT.standard === NFTStandard.ERC1155) {
          methodName = 'safeTransferFrom';
          params = [address, value.receiverAddress, value.tokenId, +value.amount, 0x0];
        }

        const gasLimit = await contract.estimateGas[methodName](...params);
        setState(INFTTransferState.PROCESSING);

        const res = await contract[methodName](...params, { gasLimit });
        await res.wait();

        setState(INFTTransferState.SUCCESS);
      } catch (e) {
        setState(INFTTransferState.FORM);
        console.error(e);
      }
    },
  });

  useEffect(() => {
    formik.resetForm();
    formik.validateForm();
    setState(INFTTransferState.FORM);
  }, [isOpen]);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW={'380px'}>
        <ModalCloseButton />
        <ModalBody pt={'40px !important'}>
          {state === INFTTransferState.FORM && (
            <Box>
              <Heading {...styles.TitleStyle} mb={'10px'}>Transfer</Heading>
              <Text color={'rgba(0, 0, 0, 0.6)'} fontSize={'14px'} mb={'30px'}>You can transfer NFT to another address</Text>

              <FormControl mb={'30px'} isInvalid={!!(formik.touched.receiverAddress && formik.errors.receiverAddress)}>
                <FormLabel>Receiver address</FormLabel>
                <InputGroup>
                  <Input
                    type={'text'}
                    placeholder={'e.g. 0x3v042b...'}
                    name={'receiverAddress'}
                    value={formik.values.receiverAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
                <FormErrorMessage>{formik.errors.receiverAddress}</FormErrorMessage>
              </FormControl>

              {NFT.tokenIds.length > 1 && (
                <FormControl mb={'30px'} isInvalid={!!(formik.touched.tokenId && formik.errors.tokenId)}>
                  <FormLabel>Choose token ID</FormLabel>
                  <InputGroup>
                    <Select
                      label={!formik.values.tokenId ? 'Select a token ID' : ''}
                      items={NFT.tokenIds}
                      value={formik.values.tokenId}
                      buttonProps={{
                        size: 'lg',
                        width: '100%',
                      }}
                      containerProps={{
                        width: '100%',
                      }}
                      popoverContentProps={{
                        width: '100%',
                      }}
                      onSelect={(value) => formik.setFieldValue('tokenId', value)}
                    />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.tokenId}</FormErrorMessage>
                </FormControl>
              )}

              {NFT.standard === NFTStandard.ERC1155 && (
                <FormControl mb={'30px'} isInvalid={!!(formik.touched.amount && formik.errors.amount)}>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <Input
                      type={'number'}
                      placeholder={'Amount'}
                      name={'amount'}
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
                </FormControl>
              )}

              <Box {...styles.ButtonsContainerStyle}>
                <Button isFullWidth variant={'outline'} onClick={onClose}>Cancel</Button>
                <Button
                  isFullWidth
                  boxShadow={'lg'}
                  disabled={!formik.isValid}
                  onClick={() => formik.submitForm()}
                >Continue</Button>
              </Box>
            </Box>
          )}

          {state === INFTTransferState.PROCESSING && (
            <Box>
              <Loading />
              <Text color={'rgba(0, 0, 0, 0.6)'} fontSize={'14px'} mx={'auto'} mt={'30px'} textAlign={'center'}>
                To continue send transaction with your wallet
              </Text>
            </Box>
          )}

          {state === INFTTransferState.SUCCESS && (
            <Box>
              <Image src={SuccessIcon} w={'220px'} h={'165px'} m={'auto'} />
              <Heading {...styles.TitleStyle} mt={'50px'} mb={'10px'} textAlign={'center'}>Success!</Heading>
              <Text
                sx={{
                  color: 'rgba(0, 0, 0, .6)',
                  m: 'auto',
                  textAlign: 'center',

                  strong: {
                    color: 'black',
                  }
                }}
              >
                NFT was successfully sent to<br/>
                <Box as={'span'} color={'black'}>
                  {`${formik.values.receiverAddress.substring(0, 13)}...${formik.values.receiverAddress.substring(
                    27, formik.values.receiverAddress.length
                  )}`}
                </Box>
              </Text>
              <Button
                variant={'outline'}
                display={'block'}
                mt={'40px'}
                mx={'auto'}
                p={'10px 50px'}
                onClick={onClose}
              >Close</Button>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
