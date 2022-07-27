import React, { useEffect, useRef } from "react";
import { useTitle } from "react-use";
import useStateIfMounted from "../../utils/hooks/useStateIfMounted";
import UniverseNFTs from "../../components/myNFTs/UniverseNFTs";
import { useThemeStore } from "src/stores/themeStore";
import { useMyNftsStore } from "src/stores/myNftsStore";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";
import { OpenGraph } from "../../components/open-graph";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useRouter } from "next/router";
import Image from "next/image";
import headerBg from "../../assets/images/bridge-background.png";
import MyPolymorphsChart from "@legacy/myNFTs/MyPolymorphsChart";
import MyPolymorphicFacesChart from "@legacy/myNFTs/MyPolymorphicFacesChart";
import TabsContainer from "../../components/bridge/tabsContainer";
import SelectPolymorphsToBridge from "../../components/bridge/SelectPolymorphsToBridge";

const PolymorphicBridge = () => {
  const { myNFTsSelectedTabIndex } = useMyNftsStore((s) => ({
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
  }));

  return (
    <div className="bridge--container">
      <div className="bridge--container--header">
        <h1 className="title">Polymorphic Bridge</h1>
      </div>

      <div className="header--background--container">
        <Image
          className="bridge__page__gradient"
          src={headerBg}
          layout="fill"
        />
      </div>

      <TabsContainer />

      {myNFTsSelectedTabIndex === 0 && <SelectPolymorphsToBridge />}
      {myNFTsSelectedTabIndex === 1 && <MyPolymorphicFacesChart />}
    </div>
  );
};

export default PolymorphicBridge;
