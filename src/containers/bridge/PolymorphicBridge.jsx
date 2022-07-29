import { useMyNftsStore } from "src/stores/myNftsStore";
import { OpenGraph } from "../../components/open-graph";
import { useRouter } from "next/router";
import Image from "next/image";
import headerBg from "../../assets/images/bridge-background.png";
import MyPolymorphicFacesChart from "@legacy/myNFTs/MyPolymorphicFacesChart";
import TabsContainer from "../../components/bridge/TabsContainer";
import SelectPolymorphsToBridge from "../../components/bridge/SelectPolymorphsToBridge";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";

const PolymorphicBridge = () => {
  const { myNFTsSelectedTabIndex } = useMyNftsStore((s) => ({
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
  }));

  return (
    <div className="bridge--container">
      <OpenGraph
        title={`Bridge a Polymorph`}
        description={`Scramble your V2 polymorphs with low transaction fees on Polygon.`}
        image={OpenGraphImage}
      />
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

      <SelectPolymorphsToBridge
        queryNft={
          myNFTsSelectedTabIndex === 0 ? "polymorphs" : "polymorphic-faces"
        }
      />
    </div>
  );
};

export default PolymorphicBridge;
