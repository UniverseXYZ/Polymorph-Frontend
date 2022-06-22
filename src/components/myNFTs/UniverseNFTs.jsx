import React, { useEffect } from "react";
import PropTypes from "prop-types";
import MyPolymorphsChart from "./MyPolymorphsChart";
import { useMyNftsStore } from "src/stores/myNftsStore";
import MyPolymorphicFacesChart from "./MyPolymorphicFacesChart";

const UniverseNFTs = ({ scrollContainer }) => {
  const {
    collectionFilter,
    setCollectionFilter,
    polymorphsFilter,
    myNFTsSelectedTabIndex,
  } = useMyNftsStore((s) => ({
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
    collectionFilter: s.collectionFilter,
    setCollectionFilter: s.setCollectionFilter,
    polymorphsFilter: s.polymorphsFilter,
  }));

  useEffect(() => {
    setCollectionFilter(polymorphsFilter);
  }, [polymorphsFilter]);

  return (
    <>
      {myNFTsSelectedTabIndex === 0 && (
        <MyPolymorphsChart scrollContainer={scrollContainer} />
      )}
      {myNFTsSelectedTabIndex === 1 && <MyPolymorphicFacesChart />}
    </>
  );
};
UniverseNFTs.propTypes = {
  scrollContainer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default UniverseNFTs;
