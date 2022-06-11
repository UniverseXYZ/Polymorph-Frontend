import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IERC721AssetType, INFT, IOrder, IUser } from '../../../../../../types';
import { NFTOffer } from './components/nft-offer/NFTOffer';
// import { LoadingPopup } from '../../../../../../../marketplace/components/popups/loading-popup';
import { Contract } from 'ethers';
import { useMutation, useQueryClient } from 'react-query';
import { EncodeOrderApi } from '../../../../../../../../api';
import MarketplaceContract from '../../../../../../../../../abis/Marketplace.json';
import { GetActiveListingApi, GetOrdersApi } from '../../../../../../api';
import { orderKeys } from '../../../../../../../../utils/query-keys';
import { useNFTPageData } from '../../../../NFTPage.context';
import { EventsEmpty } from '../shared';
import { useAuthStore } from '../../../../../../../../../stores/authStore';

interface ITabOffersProps {
  nft?: INFT;
  order?: IOrder;
  offers?: IOrder[];
  usersMap?: Record<string, IUser>;
  setShowOfferPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOfferForAccept: React.Dispatch<React.SetStateAction<IOrder | null>>;
}

enum CancelingText {
  PROGRESS = 'The transaction is in progress...',
  INDEXING = 'Indexing transaction...',
  INDEXING_TAKING_TOO_LONG = 'Receving the event from the blockchain is taking longer than expected. Please be patient.',
}

export const TabOffers: React.FC<ITabOffersProps> = ({
  nft,
  offers,
  usersMap,
  setShowOfferPopup,
  setOfferForAccept,
}) => {
  const signer = useAuthStore(s => s.signer);
  const [offerCanceling, setOfferCanceling] = useState(false);
  const [offerCancelingText, setOfferCancelingText] = useState(CancelingText.PROGRESS);
  const [orderInterval, setOrderInterval] = useState<NodeJS.Timer>();
  const queryClient = useQueryClient();

  const encodeOrderMutation = useMutation(EncodeOrderApi);

  useEffect(() => {
    return () => {
      if (orderInterval) {
        clearInterval(orderInterval);
      }
    };
  }, []);

  const handleCancelOffer = async (offer: IOrder) => {
    if (!signer) {
      return;
    }

    setOfferCanceling(true);
    setOfferCancelingText(CancelingText.PROGRESS);
    const contract = new Contract(
      `${process.env.REACT_APP_MARKETPLACE_CONTRACT}`,
      MarketplaceContract.abi,
      signer
    );

    const { data: encodedOrderData } = await encodeOrderMutation.mutateAsync({
      type: offer.type,
      data: offer.data,
      maker: offer.maker,
      make: offer.make as any,
      salt: offer.salt,
      start: offer.start,
      end: offer.end,
      take: offer.take,
      taker: offer.taker,
    });

    try {
      const cancelReceipt = await contract.cancel(encodedOrderData);
      const cancelTx = await cancelReceipt.wait();

      if (cancelTx.status !== 1) {
        console.error('display error');
        return;
      }

      setOfferCancelingText(CancelingText.INDEXING);

      // This polling mechanic is temporary until we have marketplace web sockets
      let fetchCount = 0;
      const orderIndexing = setInterval(async () => {
        fetchCount += 1;
        const stringifiedOffers = offers?.map((offer) => offer.id).join('');

        const convertedOrder = offer.take.assetType as IERC721AssetType;
        const tokenId = convertedOrder.tokenId?.toString();
        const collectionAddress = convertedOrder.contract;

        // Fetch order api until a diffrent response is returned
        const newOffers = await GetOrdersApi({
          side: 0,
          tokenIds: tokenId,
          collection: collectionAddress,
        });

        // Change query information about order
        const newStringifiedoffers = newOffers?.orders?.map((offer) => offer.id).join('');
        if (stringifiedOffers !== newStringifiedoffers) {
          clearInterval(orderIndexing);
          queryClient.setQueryData(orderKeys.offers({ tokenId, collectionAddress }), newOffers || undefined);
          queryClient.invalidateQueries(orderKeys.listing({ tokenId, collectionAddress }));
          setOfferCanceling(false);
        }

        if (fetchCount === 3) {
          setOfferCancelingText(CancelingText.INDEXING_TAKING_TOO_LONG);
        }
      }, 4000);

      setOrderInterval(orderIndexing);
    } catch (error) {
      console.error(error);
      setOfferCanceling(false);
    }
  };

  return !offers?.length ? (
    <EventsEmpty title="No active offers yet." subtitle="Be the first to make an offer!" />
  ) : (
    <Box>
      {offers
        // Filter only active offers
        .filter((offer: IOrder) => offer.end * 1000 > new Date().getTime())
        .map(
        (offer) =>
          offer &&
          nft &&
          nft._ownerAddress && (
            <NFTOffer
              key={offer.id}
              offer={offer}
              owner={nft._ownerAddress}
              usersMap={usersMap || {}}
              setOfferForAccept={setOfferForAccept}
              setShowOfferPopup={setShowOfferPopup}
              cancelOffer={handleCancelOffer}
            />
          )
      )}
      {/*TODO: add support of bundle*/}
      {/* <LoadingPopup
        heading="Cancelling offer"
        text={offerCancelingText}
        isOpen={offerCanceling}
        onClose={() => setOfferCanceling(false)}
        transactions={[]}
      /> */}
    </Box>
  );
};
