import axios from 'axios';
import { utils } from 'ethers';
import { GetUserApi } from '../api';

// Call to the scraper to get nft transfers and use the first one(mint)
const getMintData = async (collectionAddress: string, tokenId: string | number) => {
  const url = `${process.env.REACT_APP_DATASCRAPER_BACKEND}/v1/transfers/${utils.getAddress(collectionAddress)}/${tokenId}`;
  
  const { data } = await axios.get(url);

  return data;
}

export const GetHistoryApi = async (collectionAddress: string, tokenId: string | number) => {
    const url = `${process.env.REACT_APP_MARKETPLACE_BACKEND}/v1/orders?collection=${collectionAddress}&tokenId=${tokenId}&hasOffers=false`;
    const mintData = (await getMintData(collectionAddress, tokenId)).data[0];

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('xyz_access_token')}`,
      },
    });

    const history = data[0];
    const historyCopy = [...history, mintData];

    // Api call to get the order creator or the minter data
    historyCopy.forEach(async (order: any) => {
      if (order.maker) {
        order.makerData = await GetUserApi(order.maker);
      } else {
        order.makerData = await GetUserApi(order.to);
      }
    });

    return historyCopy;
};
