import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import Popup from 'reactjs-popup';
import ellipses from '../../assets/images/ellipses.svg';
import heroVideo from '../../assets/images/hero_video.mp4';
import Button from '../button/Button.jsx';
import SubscribePopup from '../popups/SubscribePopup.jsx';

const Welcome = () => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current && ref.current.readyState === 4) {
        setLoaded(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <div className="welcome__section">
      {/* <img className="ellipse-l" src={ellipses} alt="Ellipses" />
      <img className="ellipse-r" src={ellipses} alt="Ellipses" /> */}
      <div className="welcome__section__container">
        <div className="left">
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
            <h1 className="title">Polymorph Universe</h1>
          </AnimatedOnScroll>
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={400}>
            <p className="desc">
              The Polymorphs are a collection of morphing NFTs, with <b>11 base skins</b> and <b>200+ traits</b>.
            </p>
          </AnimatedOnScroll>
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={600}>
            <div className="links">
              <Button className="light-button" onClick={() => router.push('/burn-to-mint')}>
                Burn to Mint
              </Button>
              <Button className="light-border-button" onClick={() => router.push('/polymorph-rarity')}>
                Rarity Chart
              </Button>
            </div>
          </AnimatedOnScroll>
        </div>
        {/* <AnimatedOnScroll animationIn="fadeIn">
          <div className="right">
            {!loaded && (
              <SkeletonTheme color="#202020" highlightColor="#444">
                <Skeleton circle height={300} width={300} />
              </SkeletonTheme>
            )}
            <video
              ref={ref}
              autoPlay
              loop
              muted
              playsInline
              style={{ display: loaded ? 'block' : 'none' }}
            >
              <source src={heroVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </AnimatedOnScroll> */}
      </div>
    </div>
  );
};

export default Welcome;
