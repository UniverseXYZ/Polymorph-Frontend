import { Button, SimpleGrid, Box } from '@chakra-ui/react';

// Contexts
import { useFiltersContext } from '../search-filters/search-filters.context';

// Components
// import NftCardSkeleton from '../../../../../../../components/skeletons/nftCardSkeleton/NftCardSkeleton';
// import NoNftsFound from '../../../../../../../components/myNFTs/NoNftsFound';
import { NftItem, NFTItemContentWithPrice } from '../../../../../nft/components';
import { SearchFilters } from '../search-filters';

// Constants
import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import { useAuthStore } from '../../../../../../../stores/authStore';

interface IWalletTabProps {
  getTotalNfts: (total: number) => void;
}

export const WalletTab = ({ getTotalNfts }: IWalletTabProps) => {
  const address = useAuthStore(state => state.address);

  const {
    setUserAddress,
    userNFTs,
    isFetchingUserNFTs,
    isLoadingUserNFTs,
    hasMoreUserNFTs,
    fetchNextUserNFTs,
    setShowCollectcionFilters,
    setDisabledSortByFilters,
    setShowSaleTypeFilters,
    setShowPriceRangeFilters,
    setShowNFTTypeFilters,
    hasSelectedOrderBookFilters,
    orders,
    fetchNextOrders,
    isFethingOrders,
    isLoadingOrders,
    hasMoreOrders,
  } = useFiltersContext();

  useEffect(() => {
    if (userNFTs?.pages.length) {
      getTotalNfts(userNFTs?.pages[0].total);
    }
  }, [userNFTs]);

  useEffect(() => {
    setUserAddress(address);
    setShowCollectcionFilters(true);
    setShowSaleTypeFilters(true);
    setShowPriceRangeFilters(true);
    setShowNFTTypeFilters(true);
  }, [address]);

  const hasOrderBookFilters = hasSelectedOrderBookFilters();
  const hasOrders = orders?.pages?.length && orders.pages[0].data?.length;
  const waitingOrders = isFethingOrders || isLoadingOrders;
  const hasUserNFTs = userNFTs?.pages?.length && userNFTs?.pages[0]?.data?.length;
  const waitingUserNFTs = isFetchingUserNFTs || isLoadingUserNFTs;

  const filtersRef = useRef(null);

  const intersection = useIntersection(filtersRef, {
    threshold: 1,
    rootMargin: '0px',
    root: null,
  });

  return (
    <>
      <Box
        ref={filtersRef}
        sx={{
          bg: (intersection?.intersectionRect.top ?? 1) === 0 ? 'white' : 'transparent',
          pos: 'sticky',
          top: '-1px',
          mb: '40px',
          zIndex: 20,
          '.search--sort--filters--section': {
            mb: 0,
          },
        }}
      >
        {/* <SearchFilters /> */}
      </Box>

      <div className="container mynfts__page__body">
        {hasOrderBookFilters ? (
          hasOrders || waitingOrders ? (
            <div className="mynfts__page">
              <div className="container mynfts__page__body">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={'30px'}>
                  {
                    !waitingOrders && (
                      orders?.pages ?? []).map((page) => {
                        return page.data.map(({ order, NFTs }) => {
                          if (!NFTs.length) {
                            return null;
                          }
                          return (
                            <NftItem
                              order={order}
                              key={order.id}
                              NFT={NFTs[0]}
                              collection={`${NFTs[0]._collectionAddress}`}
                              renderContent={({
                                NFT,
                                collection,
                                creator,
                                owner,
                                bestOfferPrice,
                                bestOfferPriceToken,
                                lastOfferPrice,
                                lastOfferPriceToken,
                                order: orderData,
                              }) => (
                                <NFTItemContentWithPrice
                                  collectionAddress={NFT._collectionAddress}
                                  name={NFT.name}
                                  collection={collection}
                                  creator={creator?.mappedArtist || undefined}
                                  owner={owner?.mappedArtist || undefined}
                                  order={orderData || undefined}
                                  bestOfferPrice={bestOfferPrice || 0}
                                  bestOfferPriceToken={bestOfferPriceToken || undefined}
                                  lastOfferPrice={lastOfferPrice || 0}
                                  lastOfferPriceToken={lastOfferPriceToken || undefined}
                                />
                              )}
                            />
                          );
                        });
                      }
                    )
                  }
                </SimpleGrid>

                {!waitingOrders && hasMoreOrders && (
                  <Button variant={'outline'} isFullWidth={true} mt={10} onClick={() => fetchNextOrders()}>
                    Load more
                  </Button>
                )}

                {waitingOrders && (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={'30px'} mt={10}>
                    {/* <NftCardSkeleton />
                    <NftCardSkeleton />
                    <NftCardSkeleton />
                    <NftCardSkeleton /> */}
                  </SimpleGrid>
                )}
              </div>
            </div>
          ) : (
            // !waitingOrders && <NoNftsFound /> 
            null
          )
        ) : // User NFTs
        hasUserNFTs || waitingUserNFTs ? (
          <div className="mynfts__page">
            <div className="container mynfts__page__body">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={'30px'}>
                {
                  !waitingUserNFTs && (
                    userNFTs?.pages ?? []).map((page: any) => {
                      return page.data.map((NFT: any) => (
                        <NftItem
                          key={NFT.id}
                          NFT={NFT}
                          showBuyNowButton={false}
                          collection={`${NFT._collectionAddress}`}
                          renderContent={({
                            NFT,
                            collection,
                            creator,
                            owner,
                            bestOfferPrice,
                            bestOfferPriceToken,
                            lastOfferPrice,
                            lastOfferPriceToken,
                            order,
                          }) => (
                            <NFTItemContentWithPrice
                              collectionAddress={NFT._collectionAddress}
                              name={NFT.name}
                              collection={collection}
                              creator={creator?.mappedArtist || undefined}
                              owner={owner?.mappedArtist || undefined}
                              order={order || undefined}
                              bestOfferPrice={bestOfferPrice || 0}
                              bestOfferPriceToken={bestOfferPriceToken || undefined}
                              lastOfferPrice={lastOfferPrice || 0}
                              lastOfferPriceToken={lastOfferPriceToken || undefined}
                            />
                          )}
                        />
                      ));
                    }
                  )
                }
              </SimpleGrid>

              {!waitingUserNFTs && hasMoreUserNFTs && (
                <Button variant={'outline'} isFullWidth={true} mt={10} onClick={() => fetchNextUserNFTs()}>
                  Load more
                </Button>
              )}

              {waitingUserNFTs && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={'30px'} mt={10}>
                  {/* <NftCardSkeleton />
                  <NftCardSkeleton />
                  <NftCardSkeleton />
                  <NftCardSkeleton /> */}
                </SimpleGrid>
              )}
            </div>
          </div>
        ) : (
          // !waitingUserNFTs && <NoNftsFound />
          null
        )}
      </div>
    </>
  );
};
