import React, { useEffect, useState } from 'react';

import OpenGraphImage from '@assets/images/open-graph/home-page.png'
import { OpenGraph } from '@app/components';

import { useThemeStore } from 'src/stores/themeStore';
import About from '../../components/homepage/About.jsx';
import BuyUniverseNFTs from '../../components/homepage/BuyUniverseNFTs.jsx';
import NonFungibleUniverse from '../../components/homepage/NonFungibleUniverse.jsx';
import Welcome from '../../components/homepage/Welcome.jsx';
import LatestFeaturesSection from '@legacy/polymorphUniverse/latestFeaturesSection/LatestFeaturesSection.jsx';
import AboutSection from '@legacy/polymorphUniverse/aboutSection/AboutSection.jsx';
import BattlePolymorphSection from '@legacy/polymorphUniverse/battlePolymorphSection/BattlePolymorphSection.jsx';
import BurnToMintSection from '../../components/polymorphUniverse/burnToMintSection/BurnToMintSection'
import PolymorphicTherapySection from '../../components/polymorphUniverse/polymorphicTherapySection/PolymorphicTherapySection'
import PolymorphsActivity from '@legacy/polymorphs/PolymorphsActivity.jsx';
import { morphedPolymorphs, queryPolymorphsGraph } from '../../utils/graphql/polymorphQueries'
import { useGraphQueryHook } from '../../utils/hooks/useGraphQueryHook';
import { useErc20PriceStore } from '../../stores/erc20PriceStore';
import { useWindowSize } from 'react-use';



const Homepage = () => {
  
  const { data } = useGraphQueryHook(queryPolymorphsGraph(morphedPolymorphs));
  const ethUsdPrice = useErc20PriceStore(state => state.ethUsdPrice);
  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  const setDarkMode = useThemeStore(s => s.setDarkMode);
  useEffect(() => {
    setDarkMode(true);
  }, []);

  return (
    <div className="homepage">
      <OpenGraph
        title={'Universe – Community-Driven NFT Protocol'}
        titlePostfix={null}
        description={'Community-driven NFT Universe with the tools to empower artists and endless posibilities for creators'}
        image={OpenGraphImage}
      >
        <title>Universe XYZ - The NFT Universe Built on Ethereum</title>
        <meta
          name="description"
          content="Launch your own community-driven NFT universe baked with social tools, media services, and distribution - underpinned by the native $XYZ token."
        />
      </OpenGraph>

      <Welcome />
      {/* <About /> */}
      <LatestFeaturesSection />
      <AboutSection />
      {/* <NonFungibleUniverse />
      <BuyUniverseNFTs /> */}
      <BurnToMintSection />
      <PolymorphicTherapySection />
      <BattlePolymorphSection />
      <PolymorphsActivity
        ethPrice={`${ethUsdPrice}`}
        mobile={mobile}
        morphEntities={data?.tokenMorphedEntities}
      />
    </div>
  );
};
export default Homepage;
