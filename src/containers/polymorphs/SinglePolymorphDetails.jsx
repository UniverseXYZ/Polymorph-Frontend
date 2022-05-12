import React from 'react';
import ImageWithBadges from '../../components/polymorphs/singlePolymorphDetails/ImageWithBadges';
import DetailsWithTabs from '../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs';

export const SinglePolymorphDetails = () => {
  return (
    <div className='single--polymorph--details--page'>
      <ImageWithBadges />
      <DetailsWithTabs />
    </div>
  )
}