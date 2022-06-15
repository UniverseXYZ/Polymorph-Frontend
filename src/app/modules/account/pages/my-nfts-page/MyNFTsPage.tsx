import React, { useEffect, useRef } from "react";
import { useTitle } from "react-use";
import useStateIfMounted from "../../../../../utils/hooks/useStateIfMounted";
import UniverseNFTs from "../../../../../components/myNFTs/UniverseNFTs";
import FiltersContextProvider from "../../../account/pages/my-nfts-page/components/search-filters/search-filters.context";
import { useThemeStore } from "src/stores/themeStore";
import { useMyNftsStore } from "src/stores/myNftsStore";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";
import { OpenGraph } from "@app/components";

export const MyNFTsPage = () => {

  // Context hooks
  const { myNFTsSelectedTabIndex, setMyNFTsSelectedTabIndex, activeTxHashes, setActiveTxHashes } = useMyNftsStore(
    (s) => ({
      myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
      setMyNFTsSelectedTabIndex: s.setMyNFTsSelectedTabIndex,
      activeTxHashes: s.activeTxHashes,
      setActiveTxHashes: s.setActiveTxHashes,
    })
  );

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
      <OpenGraph title={`My Polymorphs`} description={`Explore and scramble your Polymorphs.`} image={OpenGraphImage} />

      <div className="mynfts__page__gradient" />

      <div className="container mynfts__page__header">
        <h1 className="title">My Polymorphs</h1>
      </div>

      {myNFTsSelectedTabIndex === 0 && (
        <FiltersContextProvider defaultSorting={0}>
          <UniverseNFTs scrollContainer={scrollContainer} />
        </FiltersContextProvider>
      )}
    </>
  );

  return (
    <>
      <div className="mynfts__page">{renderIfNFTsExist()}</div>
    </>
  );
};
