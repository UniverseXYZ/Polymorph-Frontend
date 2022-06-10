import { Box } from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '../../../../../../../../../stores/authStore';
import { OrderSide, OrderStatus } from '../../../../../../../marketplace/enums';
import { IOrder, IUser } from '../../../../../../types';
import { useNFTPageData } from '../../../../NFTPage.context';
import { EventsEmpty } from '../shared';
import HistoryEvent from '../shared/history-listings-event/HistoryEvent';

interface ITabListingsProps {
  owner: IUser;
}

export const TabListings = (props: ITabListingsProps) => {
  const [isCancelListingPopupOpened, setIsCancelListingPopupOpened] = useState(false);
  const { owner } = props;
  const address = useAuthStore(s => s.address)
  const { order } = useNFTPageData();

  if (!order) {
    return <EventsEmpty title="No active listings yet." />;
  }

  return (
    <Box>
      {[order].map((listing: IOrder | any) => {
        return (
          <React.Fragment key={listing.id}>
            <HistoryEvent
              key={listing.id ?? listing._id}
              event={{ ...listing, makerData: owner } as IOrder}
              onlyListings
              cancelListing={setIsCancelListingPopupOpened}
              isOwner={owner?.address === address}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
};
