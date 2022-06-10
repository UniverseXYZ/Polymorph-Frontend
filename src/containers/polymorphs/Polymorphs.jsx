import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import WelcomeWrapper from '../../components/ui-elements/WelcomeWrapper';
import GroupPolymorphWelcome from '../../assets/images/GroupPolymorphWelcome.png';
import About from '../../components/polymorphs/About';
import Characters from '../../components/polymorphs/Characters';
import Section4 from '../../components/polymorphs/Section4';
import PolymorphsActivity from '../../components/polymorphs/PolymorphsActivity';
import Section6 from '../../components/polymorphs/Section6';
// import './Polymorphs.scss';
import { morphedPolymorphs, queryPolymorphsGraph } from '../../utils/graphql/polymorphQueries';
import { useGraphQueryHook } from '../../utils/hooks/useGraphQueryHook';
import { useWindowSize } from 'react-use';
import { useErc20PriceStore } from '../../stores/erc20PriceStore';
import { useThemeStore } from 'src/stores/themeStore';
import { useMyNftsStore } from 'src/stores/myNftsStore';
import { useRouter } from 'next/router';
import { OpenGraph } from '@app/components';

import OpenGraphImage from '@assets/images/open-graph/polymorphs.png';

const marquee = () => (
  <p>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
  </p>
);

const Polymorphs = () => {
  const setDarkMode = useThemeStore(s => s.setDarkMode);
  const [mobile, setMobile] = useState(false);
  const { data } = useGraphQueryHook(queryPolymorphsGraph(morphedPolymorphs));
  const { polymorphsFilter, navigateToMyUniverseNFTsTab } = useMyNftsStore(s => ({polymorphsFilter: s.polymorphsFilter, navigateToMyUniverseNFTsTab: s.navigateToMyUniverseNFTsTab}))
  const ethUsdPrice = useErc20PriceStore(state => state.ethUsdPrice);
  const windowSize = useWindowSize();
  const router = useRouter();

  useLayoutEffect(() => {
    function handleResize() {
      if (+window.innerWidth <= 575) setMobile(true);
      else setMobile(false);
    }
    window.addEventListener('resize', handleResize);
  });

  useEffect(() => {
    setDarkMode(true);
  }, []);

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
  }, [windowSize.width]);

  const redirectToMyPolymorphs = () => {
    navigateToMyUniverseNFTsTab(polymorphsFilter);
    router.push('/my-polymorphs');
  };
  
  return (
    <div className="polymorphs">
      <OpenGraph
        title={'Polymorphs NFT Drop'}
        description={'A universe of polymorphic creatures with the power to mutate on demand.'}
        image={OpenGraphImage}
      />
      <WelcomeWrapper
        title="Polymorph Universe"
        hintText="A universe of polymorphic creatures with the power to mutate on demand"
        popupBtnText="My Polymorphs"
        btnText="Mint a morph"
        btnOnClick={redirectToMyPolymorphs}
        btnAnotherOnClick={redirectToMyPolymorphs}
        ellipsesLeft={false}
        ellipsesRight={false}
        marquee={marquee()}
      >
        <img src={GroupPolymorphWelcome} alt="" />
      </WelcomeWrapper>
      <div className="content">
        <About />
      </div>
      {/* <Characters /> */}
      <Section4 />
      <PolymorphsActivity
        ethPrice={`${ethUsdPrice}`}
        mobile={mobile}
        morphEntities={data?.tokenMorphedEntities}
      />
      <Section6 />
    </div>
  );
};

export default Polymorphs;
