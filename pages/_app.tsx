import '../styles/globals.css'

import '../public/fonts/style.css';
import '../src/assets/scss/normalize.scss'
import '../src/assets/scss/_variables.scss'

import '../src/components/input/Inputs.scss';
import '../src/components/header/Header.scss';
import '../src/components/header/dimensions/desktop/DesktopView.scss';
import '../src/components/header/dimensions/mobile/MobileView.scss';
import '../src/components/header/dimensions/tablet/TabletView.scss';
import '../src/components/footer/Footer.scss';
import '../src/components/button/Button.scss';
import '../src/components/polymorphs/styles/Characters.scss';
import '../src/components/polymorphs/styles/PolymorphsActivity.scss';
import '../src/components/polymorphs/styles/PolymorphsActivityTableRow.scss';
import '../src/components/polymorphs/styles/PolymorphsActivityTableRowMobile.scss';
import '../src/components/polymorphs/styles/Section4.scss';
import '../src/components/polymorphs/styles/Section6.scss';
import '../src/components/polymorphs/styles/WrapperCenter.scss';
import '../src/components/polymorphs/styles/WrapperCenterTwoColumns.scss';
import '../src/components/ui-elements/styles/WelcomeWrapper.scss';
import '../src/components/pagination/Pagination.scss';
import '../src/components/polymorphUniverse/aboutSection/AboutSection.scss';
import '../src/components/polymorphUniverse/burnToMintSection/BurnToMintSection.scss';
import '../src/components/polymorphUniverse/polymorphicTherapySection/PolymorphicTherapySection.scss'
import '../src/components/polymorphUniverse/battlePolymorphSection/BattlePolymorphSection.scss';
import '../src/components/polymorphUniverse/heroSection/HeroSection.scss';
import '../src/components/polymorphUniverse/latestFeaturesSection/LatestFeaturesSection.scss';
import '../src/containers/polymorphs/BurnToMint.scss';
import '../src/containers/polymorphs/WhatsNewSection.scss';
import '../src/components/charactersGrid/CharactersGrid.scss';
import '../src/components/notFound/NotFound.scss';
import '../src/components/input/RaritySortByOrder.scss';
import '../src/components/input/RaritySortBySelect.scss';
import '../src/components/rarityCharts/filters/RarityFilters.scss';
import '../src/components/rarityCharts/list/RarityList.scss';
import '../src/components/rarityCharts/welcome/Welcome.scss';
import '../src/components/popups/PopupStyle.scss';
import '../src/components/myNFTs/MyNFTs.scss';
import '../src/components/general/LoadingImage.scss';
// import '../src/components/input/SearchTokenIdField.scss';
import '../src/components/myNFTs/UniverseNFTs.scss';
// import '../src/components/myNFTs/pendingDropdown/pendingAccordion/PendingAccordion.scss';
// import '../src/components/myNFTs/pendingDropdown/pendingCollections/PendingCollections.scss';
// import '../src/components/myNFTs/pendingDropdown/pendingNFTs/PendingNFTs.scss';
import '../src/components/rarityCharts/filters/LobsterRarityFilters.scss';

import '../src/containers/homepage/Homepage.scss';
import '../src/containers/polymorphs/Polymorphs.scss';
import '../src/containers/polymorphUniverse/PolymorphUniverse.scss';
import '../src/containers/rarityCharts/RarityCharts.scss';
import '../src/containers/rarityCharts/RarityCharsLoader.scss';
import '../src/containers/rarityCharts/PolymorphRarityCharts.scss';
import '../src/containers/burnPolymorphs/BurnPolymorph.scss';

import '../src/components/rarityCharts/list/RarityLobsterList.scss';
import '../src/components/skeletons/nftCardSkeleton/NftCardSkeleton.scss';
import '../src/components/tabs/Tabs.scss';
import '../src/containers/rarityCharts/RarityCharts.scss';
import '../src/containers/rarityCharts/RarityChartsLoader';
import '../src/components/popups/PopupStyle.scss';
import '../src/components/popups/LobsterLoader.scss';
import '../src/components/ui-elements/styles/QuantityUpDownGroup.scss';
import '../src/components/polymorphs/scramble/styles/PolymorphScramblePage.scss';
import '../src/components/polymorphs/scramble/styles/PolymorphScrambleProp.scss';
import '../src/components/select/SelectComponent.scss';

import '../src/components/badge/Badge.scss';
import '../src/app/modules/account/pages/my-nfts-page/components/search-filters/search-filters/SearchFilters.scss';
import '../src/app/modules/account/pages/my-nfts-page/components/search-filters/search-nft-filed/SearchField.scss';
import '../src/app/modules/nft/pages/nft-page/components/nft-info/components/tab-properties/TabProperties.scss';
import '../src/components/skeletons/collectionCardSkeleton/CollectionCardSkeleton.scss';
// import '../src/components/myNFTs/revenueSplits/RevenueSplits.scss';
// import '../src/components/myNFTs/socialConnections/SocialConnections.scss';
import '../src/components/selectNFTs/SelectNfts.scss'
import '../src/components/nft/SearchFilters.scss';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { AppProps } from 'next/app'
import React, { useCallback, useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import Header from '../src/components/header/Header';
import Footer from '../src/components/footer/Footer';
import { Popups } from '../src/app/components/AppPopups';
import { Theme } from '../src/app/theme';
import { LayoutProvider } from '../src/app/providers';
import { useErc20PriceStore } from '../src/stores/erc20PriceStore';
import { useAuthStore } from '../src/stores/authStore';
import Cookies from 'js-cookie'
import { ReactQueryDevtools } from 'react-query/devtools';

function MyApp({ Component, pageProps }: AppProps) {
  // const [mounted, setMounted] = useState(false);
  //
  // useEffect(() => setMounted(true), []);
  //
  // if (!mounted) {
  //   return null;
  // }
  const [queryClient] = useState(() => new QueryClient());
  
  const fetchPrices = useErc20PriceStore(s => useCallback(s.fetchPrices, []));
  const setProviderName = useAuthStore(s => useCallback(s.setProviderName, []));

  useEffect(() => {
    fetchPrices();

    // Refetch erc20 prices every 60 seconds  
    const priceInterval = setInterval(() => {
      fetchPrices();
    }, 60000);

    return () => clearInterval(priceInterval);
  }, []);

  // SSR causes a mismatch between providerName if we set it in authStore as default value
  useEffect(() => {
    const providerName = Cookies.get('providerName');
    if (providerName) {
      setProviderName(providerName);
    }
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
            <LayoutProvider>
              <Theme>
                <div id="root">
                  <Header />
                  <Component {...pageProps} />
                  <Footer />
                  <Popups />
                </div>
              </Theme>
            </LayoutProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp
