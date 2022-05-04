import React from 'react';
import polymorphImg from '../../assets/images/soldier.png';
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
    },
    {
      id: 8,
      polymorphImg: polymorphImg
    },
    {
      id: 9,
      polymorphImg: polymorphImg
    },
    {
      id: 10,
      polymorphImg: polymorphImg
    },
    {
      id: 11,
      polymorphImg: polymorphImg
    },
    {
      id: 12,
      polymorphImg: polymorphImg
    },
    {
      id: 13,
      polymorphImg: polymorphImg
    },
    {
      id: 14,
      polymorphImg: polymorphImg
    },
    {
      id: 15,
      polymorphImg: polymorphImg
    },
    {
      id: 16,
      polymorphImg: polymorphImg
    },
    {
      id: 17,
      polymorphImg: polymorphImg
    },
    {
      id: 18,
      polymorphImg: polymorphImg
    },
  ];

  return (
    <BurnPolymorphs characters={burnPolymorphsArr} type="batch" />
  )
}