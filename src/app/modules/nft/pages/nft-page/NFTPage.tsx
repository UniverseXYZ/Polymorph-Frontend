import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  SimpleGrid,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { NftItem } from '../../components';
import { INft } from '../../types';
import { Nfts } from '../../../marketplace/mocks/nfts';
import { NFTLike } from '../../components/nft-item/components';
import { useThemeContext } from '../../../../../contexts/ThemeContext';
import { NFTMenu, Tabs as NFTTabs } from './constants';

import DotsIcon from './../../../../../assets/images/marketplace/3-dots.svg';
import { Bindings } from './mocks';
import { LineTabList } from '../../../../components';
import { NFTPageContext } from './NFTPage.context';

const MenuItemStyles: MenuItemProps = {
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  padding: '15px',
  _hover: {
    bg: 'rgba(0, 0, 0, 0.05)',
  },
  _focus: {
    bg: 'transparent',
  },
};

// TODO: hide metadata tab for not Polymorph NFT type
export const NFTPage = () => {
  const { setDarkMode } = useThemeContext() as any;

  const [NFT] = useState<INft>(Nfts[0] as INft);

  const [moreNFTs] = useState<INft[]>(Nfts.slice(0, 4) as INft[]);

  const [isPolymorph] = useState(true);

  useEffect(() => setDarkMode(false), []);

  return (
    <NFTPageContext.Provider value={{ NFT, isPolymorph }}>
      <Box>
        <Flex>
          <Flex sx={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            py: '60px',
          }}>
            {/*TODO: add video / audio / bundle / storybook */}
            <Image
              src={'https://storage.googleapis.com/lobster-images/05020905000503.jpg'}
              sx={{
                borderRadius: '12px',
                maxH: '600px',
                maxW: '600px',
              }}
            />
          </Flex>
          <Box sx={{
            borderLeft: '1px solid #E4E4E4',
            p: '60px 40px',
            w: '550px',
          }}>
            <Flex sx={{
              alignItems: 'center',
              mb: '12px',
              justifyContent: 'space-between'
            }}>
              <Heading as={'h2'} sx={{ fontSize: '26px', }}>NFT long name</Heading>
              <Box>
                <NFTLike
                  likes={NFT.likes}
                  isLiked={false}
                  sx={{
                    padding: '15px 17px',
                    height: '42px',
                    borderRadius: '12px',
                    mr: '7px',
                  }}
                />

                <Menu>
                  <MenuButton
                    as={Button}
                    variant={'simpleOutline'}
                    sx={{
                      borderRadius: '12px',
                      height: '42px',
                      padding: '10px',
                    }}
                  >
                    <Image src={DotsIcon} />
                  </MenuButton>
                  <MenuList
                    sx={{
                      borderRadius: '12px',
                      boxShadow: '0px 10px 36px rgba(136, 120, 172, 0.14)',
                      padding: '8px',
                    }}
                  >
                    {NFTMenu.map((menuItem, i) => (
                      <MenuItem
                        key={i}
                        {...MenuItemStyles}
                        color={menuItem.red ? '#FF4949' : ''}
                      >
                        {menuItem.icon && <Image src={menuItem.icon} mr={'6px'} />}
                        {menuItem.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            </Flex>

            <Text
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '14px',
                fontWeight: 500,
                mb: '30px',
              }}
            >Edition 1/20</Text>

            <Flex mb={'24px'}>
              {Bindings.map((binding, i) => (
                <Flex key={i} sx={{
                  alignItems: 'center',
                  flex: 1,
                }}>
                  <Image src={binding.getImage(null)} sx={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    h: '30px',
                    w: '30px',
                  }} />
                  <Box fontSize={'12px'} ml={'10px'}>
                    <Text color={'rgba(0, 0, 0, 0.4)'} fontWeight={500}>{binding.name}</Text>
                    <Text fontWeight={700}>{binding.getValue(null)}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>

            <Text sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '14px',
              mb: '40px',
            }}>
              Cras vel eget vitae quis scelerisque arcu ut.
              Tristique velit nec sed sit massa. Odio molestie velit purus at blandit.
              Lacus, fusce quam dolor imperdiet velit augue neque tincidunt lorem et diam...
              <Link sx={{ color: 'black', fontWeight: 'bold', ml: '6px' }}>Read more</Link>
            </Text>

            <Tabs>
              <LineTabList>
                {NFTTabs.map(({ name }, i) => (<Tab key={i}>{name}</Tab>))}
              </LineTabList>

              <TabPanels>
                {NFTTabs.map(({ component: TabContentComponent }, i) => (
                  <TabPanel key={i} px={0} pt={'30px'}>
                    <TabContentComponent />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
        <Box sx={{
          bg: 'linear-gradient(127.59deg, #F2F3FB -1.33%, #FCF9F4 91.03%)',
          py: '80px',
          px: '40px',
        }}>
          <Heading as={'h2'} sx={{ fontSize: '26px', textAlign: 'center', }}>More from this collection</Heading>
          <Container maxW={'1110px'} py={'40px !important'}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacingX={'20px'}
            >
              {moreNFTs.map((NFT) => (<NftItem key={NFT.id} nft={NFT} />))}
            </SimpleGrid>
          </Container>
          <Flex justifyContent={'center'}>
            <Button variant={'outline'} boxShadow={'inset 2px 1000px 1px #fbf8f6'}>View collection</Button>
          </Flex>
        </Box>
      </Box>
    </NFTPageContext.Provider>
  );
};
