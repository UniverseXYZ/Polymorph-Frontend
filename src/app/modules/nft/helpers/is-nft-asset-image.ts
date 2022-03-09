import { NFTArtworkType } from '../types';

export const isNFTAssetImage = (type: NFTArtworkType | null) => {
  return type && [
    NFTArtworkType.JPG,
    NFTArtworkType.JPEG,
    NFTArtworkType.PNG,
    NFTArtworkType.IMAGE,
    NFTArtworkType.WEBP,
    NFTArtworkType.GIF,
  ].includes(type);
}
