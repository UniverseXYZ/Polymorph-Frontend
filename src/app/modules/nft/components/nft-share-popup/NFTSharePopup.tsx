import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  LinkOverlayProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import { SearchInput } from '../../../../components';
import * as styles from './styles';

import LinkSVG from './../../../../../assets/images/v2/link.svg';
import TwitterSVG from './../../../../../assets/images/v2/twitter.svg';
import FacebookSVG from './../../../../../assets/images/v2/facebook.svg';
import TelegramSVG from './../../../../../assets/images/v2/telegram.svg';
import MailSVG from './../../../../../assets/images/v2/mail.svg';

interface INFTSharePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NFTSharePopup = ({ isOpen, onClose }: INFTSharePopupProps) => {
  const { onCopy } = useClipboard(location?.href ?? '');

  const [search, setSearch] = useState('');

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log('Search: ', e.target.value);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW={'480px'}>
        <ModalCloseButton />
        <ModalHeader {...styles.HeaderStyle}>
          <Heading {...styles.TitleStyle} mb={'22px'}>Share this page</Heading>
          <SimpleGrid columns={5} spacingX={'20px'}>
            <Box>
              <Box {...styles.getShareButtonStyle(LinkSVG)} onClick={onCopy} />
              <Text {...styles.ShareButtonTextStyle}>Copy link</Text>
            </Box>
            <LinkBox>
              <LinkOverlay
                {...styles.getShareButtonStyle(TwitterSVG) as LinkOverlayProps}
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(location?.href)}`}
                target={'_blank'}
              />
              <Text {...styles.ShareButtonTextStyle}>Twitter</Text>
            </LinkBox>
            <Box>
              <LinkOverlay
                {...styles.getShareButtonStyle(FacebookSVG) as LinkOverlayProps}
                href={`https://www.facebook.com/dialog/share?app_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&href=${encodeURIComponent(location?.href)}&display=popup`}
                target={'_blank'}
              />
              <Text {...styles.ShareButtonTextStyle}>Facebook</Text>
            </Box>
            <Box>
              <LinkOverlay
                {...styles.getShareButtonStyle(TelegramSVG) as LinkOverlayProps}
                href={`https://telegram.me/share/url?url=${encodeURIComponent(location?.href)}`}
                target={'_blank'}
              />
              <Text {...styles.ShareButtonTextStyle}>Telegram</Text>
            </Box>
            <Box>
              <LinkOverlay
                {...styles.getShareButtonStyle(MailSVG) as LinkOverlayProps}
                href={`mailto:?body=${encodeURIComponent(location?.href)}`}
                target={'_blank'}
              />
              <Text {...styles.ShareButtonTextStyle}>Email</Text>
            </Box>
          </SimpleGrid>
        </ModalHeader>
        {/*TODO: social media*/}
        {/*<ModalBody pt={'40px !important'}>*/}
        {/*  <Heading {...styles.TitleStyle} mb={'20px'}>Send to a friend</Heading>*/}
        {/*  <SearchInput*/}
        {/*    shadowProps={{ width: '100%', }}*/}
        {/*    inputProps={{*/}
        {/*      placeholder: 'Search for people',*/}
        {/*      value: search,*/}
        {/*      onChange: handleSearch,*/}
        {/*    }}*/}
        {/*  />*/}
        {/*  <Text {...styles.ResultsLabelStyle}>Recent</Text>*/}
        {/*  <Box maxH={'250px'} overflowY={'scroll'}>*/}
        {/*    {NftLikes.map((user, i) => (*/}
        {/*      <Flex key={i} {...styles.ResultItemStyle}>*/}
        {/*        <Image src={user.avatar} />*/}
        {/*        <Text>{user.name}</Text>*/}
        {/*        <Button>Send</Button>*/}
        {/*      </Flex>*/}
        {/*    ))}*/}
        {/*  </Box>*/}
        {/*</ModalBody>*/}
      </ModalContent>
    </Modal>
  );
};
