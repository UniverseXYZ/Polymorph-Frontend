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
      disableStaticImages: true
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
      REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
      REACT_APP_NETWORK_CHAIN_ID: process.env.REACT_APP_NETWORK_CHAIN_ID,
      REACT_APP_NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME,
      REACT_APP_BATCH_MINTING_CHUNK_SIZE: process.env.REACT_APP_BATCH_MINTING_CHUNK_SIZE,
      REACT_APP_POLYMORPHS_GRAPH_URL: process.env.REACT_APP_POLYMORPHS_GRAPH_URL,
      REACT_APP_LOBSTERS_GRAPH_URL: process.env.REACT_APP_LOBSTERS_GRAPH_URL,
      REACT_APP_POLYMORPHS_CONTRACT_ADDRESS: process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
      REACT_APP_LOBSTERS_CONTRACT_ADDRESS: process.env.REACT_APP_LOBSTERS_CONTRACT_ADDRESS,
      REACT_APP_RARITY_METADATA_URL: process.env.REACT_APP_RARITY_METADATA_URL,
      REACT_APP_POLYMORPHS_IMAGES_URL: process.env.REACT_APP_POLYMORPHS_IMAGES_URL,
      REACT_APP_LOBSTER_IMAGES_URL: process.env.REACT_APP_LOBSTER_IMAGES_URL,
      REACT_APP_ETHERSCAN_URL: process.env.REACT_APP_ETHERSCAN_URL,
      REACT_APP_UNIVERSE_ERC_721_ADDRESS: process.env.REACT_APP_UNIVERSE_ERC_721_ADDRESS,
      REACT_APP_UNIVERSE_ERC_721_FACTORY_ADDRESS: process.env.REACT_APP_UNIVERSE_ERC_721_FACTORY_ADDRESS,
      REACT_APP_DATASCRAPER_BACKEND: process.env.REACT_APP_DATASCRAPER_BACKEND,
      REACT_APP_MARKETPLACE_BACKEND: process.env.REACT_APP_MARKETPLACE_BACKEND,
      REACT_APP_MARKETPLACE_CONTRACT: process.env.REACT_APP_MARKETPLACE_CONTRACT,
      REACT_APP_ROYALTY_REGISTRY_CONTRACT: process.env.REACT_APP_ROYALTY_REGISTRY_CONTRACT,
      REACT_APP_FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
      REACT_APP_CAPTCHA_ID: process.env.REACT_APP_CAPTCHA_ID,
      REACT_APP_COLLECTION_EDITOR: process.env.REACT_APP_COLLECTION_EDITOR,
    },
  }
);