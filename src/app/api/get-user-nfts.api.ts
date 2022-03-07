import axios from 'axios';
import { INFT, NFTArtworkType, NFTStandard } from '../modules/nft/types';
import { getArtworkType } from '../helpers';
interface IUserNFTsResponse {
  data: any[];
  page: number;
  size: string;
  total: number;
}

export interface IGetUserNFTsProps {
  address: string;
  page: string | number;
  size: string | number;
  search?: string;
  tokenType?: string;
  tokenAddress?: string;
}

export const getUserNFTsApi = async (props: IGetUserNFTsProps) => {
  let url = `${process.env.REACT_APP_DATASCRAPER_BACKEND}/v1/users/${props.address}/tokens?page=${props.page}&size=${props.size}`;

  if (props.search) {
    url = url.concat('&search=' + props.search);
  }

  if (props.tokenType) {
    url = url.concat('&tokenType=' + props.tokenType);
  }

  if (props.tokenAddress) {
    url = url.concat('&tokenAddress=' + props.tokenAddress);
  }

  const { data: { data, ...responseData } } = await axios.get<IUserNFTsResponse>(url);

  return {
    data: data.map((nft) => {
      const imgUrl = nft?.metadata?.image_url|| nft?.metadata?.image || nft?.metadata?.image_original_url || "";

      return {
        name: nft.metadata?.name ?? '',
        tokenId: nft.tokenId,
        standard: nft.tokenType as NFTStandard,
        collection: undefined,
        tokenIds: [nft.tokenId], // TODO
        url: nft.metadata?.external_url, // TODO
        id: nft._id,
        createdAt: new Date(nft.createdAt),
        description: nft.metadata?.description,
        updatedAt: new Date(nft.updatedAt),
        thumbnailUrl: imgUrl, // TODO
        originalUrl: imgUrl, // TODO
        optimizedUrl: imgUrl, // TODO
        artworkType: getArtworkType(nft),
        amount: 0, // TODO
        txHash: null,
        collectionId: 0,
        numberOfEditions: 1,
        properties: [],
        tokenUri: '',
        royalties: [],
        _ownerAddress: nft.owners?.length ? nft.owners[nft.owners.length - 1].address : undefined,
        _creatorAddress: nft.firstOwner,
        _collectionAddress: nft.contractAddress,
        _properties: nft?.metadata?.attributes?.length ? nft.metadata.attributes.map((attribute: any) => ({
          traitType: attribute.trait_type,
          value: attribute.value,
          displayType: attribute.display_type,
        })) : undefined,
      }
    }) as INFT[],
    ...responseData,
  }
};
