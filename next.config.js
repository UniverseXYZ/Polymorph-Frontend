const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withVideos = require('next-videos')

/** @type {import('next').NextConfig} */
module.exports = withPlugins(
  [
    withVideos,
    [withImages, {
      fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'ico', 'webp', 'jp2', 'avif']
    }],
  ],
  {
    trailingSlash: true,
    reactStrictMode: false,
    images: {
      disableStaticImages: true,
      domains: [
        'ipfs.io',
        'storage.googleapis.com',
      ],
    },
    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
        },
      });

      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      });
      return config;
    },
    env: {
      REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      REACT_APP_NETWORK_CHAIN_ID: process.env.REACT_APP_NETWORK_CHAIN_ID,
      REACT_APP_NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME,
      REACT_APP_POLYMORPHS_GRAPH_URL: process.env.REACT_APP_POLYMORPHS_GRAPH_URL,
      REACT_APP_POLYMORPHS_GRAPH_V2_URL: process.env.REACT_APP_POLYMORPHS_GRAPH_V2_URL,
      REACT_APP_POLYMORPHIC_FACES_GRAPH_URL: process.env.REACT_APP_POLYMORPHIC_FACES_GRAPH_URL,
      REACT_APP_POLYMORPHS_CONTRACT_ADDRESS: process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
      REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS: process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS,
      REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS: process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS,
      REACT_APP_RARITY_METADATA_URL: process.env.REACT_APP_RARITY_METADATA_URL,
      REACT_APP_FACES_RARITY_METADATA_URL: process.env.REACT_APP_FACES_RARITY_METADATA_URL,
      REACT_APP_RARITY_METADATA_URL_V2: process.env.REACT_APP_RARITY_METADATA_URL_V2,
      REACT_APP_RARITY_METADATA_URL: process.env.REACT_APP_RARITY_METADATA_URL,
      REACT_APP_POLYMORPHS_IMAGES_URL: process.env.REACT_APP_POLYMORPHS_IMAGES_URL,
      REACT_APP_POLYMORPHS_IMAGES_URL_V2: process.env.REACT_APP_POLYMORPHS_IMAGES_URL_V2,
      REACT_APP_FACES_IMAGES_URL: process.env.REACT_APP_FACES_IMAGES_URL,
      REACT_APP_ETHERSCAN_URL: process.env.REACT_APP_ETHERSCAN_URL,
      REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE: process.env.REACT_APP_LINK_TO_POLYMORPH_IN_MARKETPLACE,
      REACT_APP_UNIVERSE_PINATA_GATEWAY: process.env.REACT_APP_UNIVERSE_PINATA_GATEWAY
    },
  }
);
