import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import WelcomeWrapper from '../../components/ui-elements/WelcomeWrapper';
import PolymorphGroupFire from '../../assets/images/PolymorphGroupFire.png';
// import Section2HorizontalScroll from '../../components/polymorphs/mint-polymorph/Section2HorizontalScroll';
import PolymorphsActivity from '../../components/polymorphs/PolymorphsActivity';
import BurnPolymorphLeft from '../../assets/images/bgElementLeft.png';
import BurnPolymorphRight from '../../assets/images/bgElementRight.png';
import Section4LeftBackground from '../../assets/images/Section4GroupImage.png';
import BurnPolymorphBg from '../../assets/images/BurnPolymorphBg.png';
import Section4 from '../../components/polymorphs/Section4';
import data from '../../utils/fixtures/newPolymorphBaseSkins';
// import './BurnToMint.scss';
import { useWindowSize } from 'react-use';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import Button from '@legacy/button/Button';
import { useThemeStore } from '../../../src/stores/themeStore'

const BurnToMint = () => {
  // const { setDarkMode } = useThemeContext();
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (+windowSize.width <= 575) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  const setDarkMode = useThemeStore(s => s.setDarkMode);
  useEffect(() => {
    setDarkMode(true);
  }, []);

  return (
      <div className="welcome--section">
        <div className="welcome__section__container">
          <div className="left">
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
              <h1 className="title">Burn To Mint</h1>
            </AnimatedOnScroll>
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={400}>
              <p className="desc">Burning will allow you to participate in lower fee scrambling, games and more.</p>
            </AnimatedOnScroll>
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={600}>
              <div className="links">
                  <Button className="light-button" onClick={() => router.push('/burn-to-mint/burn')}>
                    Burn Polymorph
                  </Button>
              </div>
            </AnimatedOnScroll>
          </div>
          <img src={PolymorphGroupFire} alt="" />
        </div>
          <div className='burn--progress--container'>
            <div className='progress--indicators'>
              <span>Already Burnt</span>
              <span>
                {/* TO DO:  */}
                {/* Value to be fetched and displayed here */}
                <span>3000 </span><span>/ 10000</span>
              </span>
            </div>
          <div className='progress--bar'></div>
        </div>
        <div className='fade'>
          {/* TO DO:  */}
          {/* animation to be implemented here */}
        </div> 
      </div>
  );
};

export default BurnToMint;
