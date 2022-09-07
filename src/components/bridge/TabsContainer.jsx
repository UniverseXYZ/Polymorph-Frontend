import { useMyNftsStore } from "src/stores/myNftsStore";
import { usePolymorphStore } from "src/stores/polymorphStore";

const TabsContainer = () => {
  const {
    bridgeFromNetwork,
    myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex,
    activeTxHashes,
    setActiveTxHashes,
  } = useMyNftsStore((s) => ({
    bridgeFromNetwork: s.bridgeFromNetwork,
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex: s.setMyNFTsSelectedTabIndex,
    activeTxHashes: s.activeTxHashes,
    setActiveTxHashes: s.setActiveTxHashes,
  }));

  const {
    userPolymorphsV2, userPolymorphsV2Polygon,
    userPolymorphicFaces, userPolymorphicFacesPolygon
  } = usePolymorphStore();
  const polymorphsArr = bridgeFromNetwork === "Polygon" ? userPolymorphsV2Polygon : userPolymorphsV2;
  const polymorphicFacesArr = bridgeFromNetwork === "Polygon" ? userPolymorphicFacesPolygon : userPolymorphicFaces;

  return (
    <div className="tabs__container">
      <span
        className={myNFTsSelectedTabIndex === 0 ? "active" : ""}
        onClick={() => {
          setMyNFTsSelectedTabIndex(0);
        }}
      >
        Polymorphs{" "}
        {polymorphsArr.length ? (
          <div
            className={`count ${myNFTsSelectedTabIndex === 0 ? "active" : ""}`}
          >
            {polymorphsArr.length || ""}
          </div>
        ) : null}
      </span>
      <span
        className={myNFTsSelectedTabIndex === 1 ? "active" : ""}
        onClick={() => {
          setMyNFTsSelectedTabIndex(1);
        }}
      >
        Polymorphic Faces{" "}
        {polymorphicFacesArr.length ? (
          <div
            className={`count ${myNFTsSelectedTabIndex === 1 ? "active" : ""}`}
          >
            {polymorphicFacesArr.length || null}
          </div>
        ) : null}
      </span>
    </div>
  );
};

export default TabsContainer;
