import React from 'react';
import BurnPolymorphs from '../../components/burnPolymorphs/BurnPolymorphs';
import { usePolymorphStore } from 'src/stores/polymorphStore';

export const BurnBatchPolymorphs = () => {
  const { userSelectedPolymorphsToBurn } = usePolymorphStore();

  return <BurnPolymorphs characters={userSelectedPolymorphsToBurn} type="batch" />;
};
