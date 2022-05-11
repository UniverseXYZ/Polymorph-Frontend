import React from 'react';
import polymorphImg from '../../assets/images/burn-polymorph.png';
import BurnPolymorphs from '../../components/burnPolymorphs/BurnPolymorphs';
import { usePolymorphStore } from 'src/stores/polymorphStore';

export const BurnBatchPolymorphs = () => {
  const { userSelectedPolymorphsToBurn } = usePolymorphStore();

  const burnPolymorphsArr = userSelectedPolymorphsToBurn.map((index) => ({ id: index, polymorphImg: polymorphImg }));

  return <BurnPolymorphs characters={burnPolymorphsArr} type="batch" />;
};
