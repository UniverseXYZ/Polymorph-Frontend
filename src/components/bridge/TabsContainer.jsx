import { useMyNftsStore } from "src/stores/myNftsStore";
import { usePolymorphStore } from "src/stores/polymorphStore";

const TabsContainer = () => {
  const {
    myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex,
    activeTxHashes,
    setActiveTxHashes,
  } = useMyNftsStore((s) => ({
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex: s.setMyNFTsSelectedTabIndex,
    activeTxHashes: s.activeTxHashes,
    setActiveTxHashes: s.setActiveTxHashes,
  }));

  const { userPolymorphsAll, userPolymorphicFaces } = usePolymorphStore();

  return (
    <div className="tabs__container">
      <span
        className={myNFTsSelectedTabIndex === 0 ? "active" : ""}
        onClick={() => {
          setMyNFTsSelectedTabIndex(0);
        }}
      >
        Polymorphs{" "}
        {userPolymorphsAll.length ? (
          <div
            className={`count ${myNFTsSelectedTabIndex === 0 ? "active" : ""}`}
          >
            {userPolymorphsAll.length || ""}
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
        {userPolymorphicFaces.length ? (
          <div
            className={`count ${myNFTsSelectedTabIndex === 1 ? "active" : ""}`}
          >
            {userPolymorphicFaces.length || null}
          </div>
        ) : null}
      </span>
    </div>
  );
};

export default TabsContainer;
