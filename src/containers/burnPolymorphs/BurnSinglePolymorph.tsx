import React from 'react';
import polymorphImg from '../../assets/images/soldier.png';
import BurnPolymorphs from '../../components/burnPolymorphs/BurnPolymorphs';

export const BurnSinglePolymorph = () => {
  //DummyData
  const burnPolymorphsArr = [
    {
      id: 1,
      polymorphImg: polymorphImg
    }
  ];

  return (
    <BurnPolymorphs characters={burnPolymorphsArr} type="single" />
  )
}