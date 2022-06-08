import React, { useEffect, useState } from "react";

import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";
import { OpenGraph } from "@app/components";

import { useThemeStore } from "src/stores/themeStore";
import Welcome from "../../components/homepage/Welcome.jsx";
import LatestFeaturesSection from "@legacy/polymorphUniverse/latestFeaturesSection/LatestFeaturesSection.jsx";
import AboutSection from "@legacy/polymorphUniverse/aboutSection/AboutSection.jsx";
import BattlePolymorphSection from "@legacy/polymorphUniverse/battlePolymorphSection/BattlePolymorphSection.jsx";
import BurnToMintSection from "../../components/polymorphUniverse/burnToMintSection/BurnToMintSection";
import PolymorphicTherapySection from "../../components/polymorphUniverse/polymorphicTherapySection/PolymorphicTherapySection";
import PolymorphsActivity from "@legacy/polymorphs/PolymorphsActivity.jsx";
import {
  morphedPolymorphs,
  queryPolymorphsGraphV2,
} from "../../utils/graphql/polymorphQueries";
import { useGraphQueryHook } from "../../utils/hooks/useGraphQueryHook";
import { useErc20PriceStore } from "../../stores/erc20PriceStore";
import { useWindowSize } from "react-use";

const Homepage = () => {
  const { data } = useGraphQueryHook(queryPolymorphsGraphV2(morphedPolymorphs));
  const ethUsdPrice = useErc20PriceStore((state) => state.ethUsdPrice);
  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  const setDarkMode = useThemeStore((s) => s.setDarkMode);
  useEffect(() => {
    setDarkMode(true);
  }, []);

  return (
    <div className="homepage">
      <OpenGraph
        title={`Polymorphic Universe`}
        description={`The Polymorphs are a collection of morphing NFTs, with 11 base skins and 200+ traits.`}
        image={OpenGraphImage}
      />
      <Welcome />
      <LatestFeaturesSection />
      <AboutSection />
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
