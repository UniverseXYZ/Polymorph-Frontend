import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MyPolymorphsChart from './MyPolymorphsChart';
import { useMyNftsStore } from 'src/stores/myNftsStore';

const UniverseNFTs = ({ scrollContainer }) => {
  const { collectionFilter, setCollectionFilter, polymorphsFilter } =
    useMyNftsStore(s => ({
      collectionFilter: s.collectionFilter,
      setCollectionFilter: s.setCollectionFilter,
      polymorphsFilter: s.polymorphsFilter,
    }));

  useEffect(() => {
    setCollectionFilter(polymorphsFilter);
  }, [polymorphsFilter]);

  return (
    <MyPolymorphsChart
      scrollContainer={scrollContainer}
    />
  );
};
UniverseNFTs.propTypes = {
  scrollContainer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default UniverseNFTs;
