import React, { useState, useEffect } from "react";
// import '../pagination/Pagination.scss';
// import './UniverseNFTs.scss';
import PropTypes from "prop-types";
import MyPolymorphsChart from "./MyPolymorphsChart";
import MyPolymorphicFacesChart from "./MyPolymorphicFacesChart";
import { useMyNftsStore } from "src/stores/myNftsStore";

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

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  useEffect(() => {
    setCollectionFilter(polymorphsFilter);
  }, [polymorphsFilter]);

  return (
    <>
      {myNFTsSelectedTabIndex === 0 && (
        <MyPolymorphsChart
          isDropdownOpened={isDropdownOpened}
          setIsDropdownOpened={setIsDropdownOpened}
          scrollContainer={scrollContainer}
        />
      )}
      {myNFTsSelectedTabIndex === 1 && <MyPolymorphicFacesChart />}
    </>
  );
};
UniverseNFTs.propTypes = {
  scrollContainer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default UniverseNFTs;
