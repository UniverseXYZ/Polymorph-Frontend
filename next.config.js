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
        'partybears-3n0w057k710bfqcm.s3.us-west-2.amazonaws.com',
        // UNIVERSE S3 BUCKETS
        'universeapp-assets-dev.s3.amazonaws.com',
        'universeapp-assets-auctions.s3.amazonaws.com',
        'universeapp-assets-local.s3.amazonaws.com',
        'universe-dev-datascraper-video.s3.amazonaws.com',
        'universe-dev-datascraper-images.s3.amazonaws.com',
        'universe-dev-datascraper-audio.s3.amazonaws.com',
        'universe-dev-datascraper-models.s3.amazonaws.com',
        'universe-dev-datascraper-misc.s3.amazonaws.com',
        'universe-rinkeby-datascraper-video.s3.amazonaws.com',
        'universe-rinkeby-datascraper-images.s3.amazonaws.com',
        'universe-rinkeby-datascraper-audio.s3.amazonaws.com',
        'universe-rinkeby-datascraper-models.s3.amazonaws.com',
        'universe-rinkeby-datascraper-misc.s3.amazonaws.com',
        'universe-prod-datascraper-video.s3.amazonaws.com',
        'universe-prod-datascraper-images.s3.amazonaws.com',
        'universe-prod-datascraper-audio.s3.amazonaws.com',
        'universe-prod-datascraper-models.s3.amazonaws.com',
        'universe-prod-datascraper-misc.s3.amazonaws.com',
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
      REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
      REACT_APP_NETWORK_CHAIN_ID: process.env.REACT_APP_NETWORK_CHAIN_ID,
      REACT_APP_NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME,
      REACT_APP_POLYMORPHS_GRAPH_URL: process.env.REACT_APP_POLYMORPHS_GRAPH_URL,
      REACT_APP_LOBSTERS_GRAPH_URL: process.env.REACT_APP_LOBSTERS_GRAPH_URL,
      REACT_APP_POLYMORPHS_CONTRACT_ADDRESS: process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
      REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS: process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS,
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
