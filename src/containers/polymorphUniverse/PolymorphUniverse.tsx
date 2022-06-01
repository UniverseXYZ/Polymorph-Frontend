import React, { useEffect, useState } from 'react';
// import './PolymorphUniverse.scss';
import BurnToMint from '../polymorphs/BurnToMint';
import WhatsNewSection from '../polymorphs/WhatsNewSection';
import { GetStaticProps } from 'next';
import { queryPolymorphsGraphV2 } from '@legacy/graphql/polymorphQueries';
import { burnedPolymorphs } from "@legacy/graphql/polymorphQueries";

export const PolymorphUniverse = ({burntPolymorphs} : any) => {
  return (
    <div className="polymorph--universe--general--page">
      <BurnToMint burntCount={burntPolymorphs?.burnCount?.count}/>
      <WhatsNewSection />
    </div>
  )
};

// NextJs ISSG Page, rebuilt every 60 seconds.
// A rebuild is trigger by a page visit.
export const getStaticProps: GetStaticProps = async () => {
  const burned = await queryPolymorphsGraphV2(burnedPolymorphs);
  return {
    props: {
      burntPolymorphs: burned,
    },
    revalidate: 60
  };
}
