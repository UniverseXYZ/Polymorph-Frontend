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

export const MyNFTsPage = () => {
  const router = useRouter();
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const { userPolymorphsAll, userPolymorphicFaces } = usePolymorphStore();

  // Context hooks
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

  const setDarkMode = useThemeStore((s) => s.setDarkMode);

  const scrollContainer = useRef(null);

  // State hooks
  const [showLoading, setShowLoading] = useStateIfMounted(false);

  useTitle("My Polymorphs", { restoreOnUnmount: true });

  useEffect(() => {
    if (!showLoading) {
      setActiveTxHashes([]);
    }
  }, [showLoading]);

  useEffect(() => {
    setDarkMode(false);
  }, []);

  const renderIfNFTsExist = () => (
    <>
      <OpenGraph
        title={`My Polymorphs`}
        description={`Explore and scramble your Polymorphs.`}
        image={OpenGraphImage}
      />

      <div className="mynfts__page__gradient" />

      <div className="container mynfts__page__header">
        <h1 className="title">My Polymorphs</h1>
      </div>

      <div className="tabs__container">
        <span
          className={myNFTsSelectedTabIndex === 0 ? "active" : ""}
          onClick={() => {
            setMyNFTsSelectedTabIndex(0);
          }}
        >
          Polymorphs <div className={`count ${myNFTsSelectedTabIndex === 0 ? "active" : ""}`}>{userPolymorphsAll.length || ""}</div>
        </span>
        <span
          className={myNFTsSelectedTabIndex === 1 ? "active" : ""}
          onClick={() => {
            setMyNFTsSelectedTabIndex(1);
          }}
        >
          Polymorphic Faces <div className={`count ${myNFTsSelectedTabIndex === 1 ? "active" : ""}`}>{userPolymorphicFaces.length || ""}</div>
        </span>
      </div>

      <UniverseNFTs scrollContainer={scrollContainer} />
    </>
  );

  return (
    <>
      <div className="mynfts__page">{renderIfNFTsExist()}</div>
    </>
  );
};
