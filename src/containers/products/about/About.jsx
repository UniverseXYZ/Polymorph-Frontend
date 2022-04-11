import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
<<<<<<< HEAD
=======
import Welcome from '../../../components/products/about/Welcome.jsx';
import OurTeam from '../../../components/products/about/OurTeam.jsx';
>>>>>>> 19e37949 (Removed a chunk of auctions-related functionalities)
import Head from 'next/head';
import { useThemeStore } from 'src/stores/themeStore';
import OpenGraphImage from '@assets/images/open-graph/about-us.png';
import { OpenGraph } from '@app/components';

const About = () => {
  const setDarkMode = useThemeStore(s => s.setDarkMode);
  useEffect(() => setDarkMode(true), []);

  return (
    <div className="about__page">
      <OpenGraph
        title={'A Universe Made for Artists by Artists'}
        description={'Mint single or multiple NFTs, create and edit NFT Collections, and run auctions with multiple NFTs per winner. In this Universe anything is possible.'}
        image={OpenGraphImage}
      />
<<<<<<< HEAD
=======
      <Welcome />
      <OurTeam />
>>>>>>> 19e37949 (Removed a chunk of auctions-related functionalities)
    </div>
  );
};
export default About;
