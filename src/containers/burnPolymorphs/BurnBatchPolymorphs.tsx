import React from 'react';
import polymorphImg from '../../assets/images/burn-polymorph.png';
import BurnPolymorphs from '../../components/burnPolymorphs/BurnPolymorphs';

export const BurnBatchPolymorphs = () => {
  //DummyData
  const burnPolymorphsArr = [
    {
      id: 1,
      polymorphImg: polymorphImg
    },
    {
      id: 2,
      polymorphImg: polymorphImg
    },
    {
      id: 3,
      polymorphImg: polymorphImg
    },
    {
      id: 4,
      polymorphImg: polymorphImg
    },
    {
      id: 5,
      polymorphImg: polymorphImg
    },
    {
      id: 6,
      polymorphImg: polymorphImg
    },
    {
      id: 7,
      polymorphImg: polymorphImg
    }
  ];

  return (
    <BurnPolymorphs characters={burnPolymorphsArr} type="batch" />
  )
}