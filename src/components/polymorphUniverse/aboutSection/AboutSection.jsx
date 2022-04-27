import React from 'react';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import { useRouter } from 'next/router';
import WrapperCenter from '../../polymorphs/WrapperCenter';
import WrapperCenterTwoColumns from '../../polymorphs/WrapperCenterTwoColumns';
import ImgRow1 from '../../../assets/images/Section1-Illustration-min.png';
// import './AboutSection.scss';
import Button from '../../button/Button';
import imgRow2Chart from '../../../assets/images/universelandscape.png';
import imgRow2ChartMobile from '../../../assets/images/universelandscapemobile.png';
import Marquee from 'react-fast-marquee';

const marquee = () => (
  <p>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
    <span className="marquee--text--polymorph">POLYMORPH</span>
    <span className="marquee--text--universe">UNIVERSE</span>
  </p>
);

const row1RightBlock = () => (
  <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
    <h2>What are Polymorphs?</h2>
    <p>
      We believe that Polymorphs are the beginning of what will be a wave of technically advanced
      NFTs for the Web3 ecosystem. Like many collections before us, Polymorphs exist with rarity and
      traits but with a spin. They can morph on command from their owners to change the appearance
      of them over time.
    </p>
  </AnimatedOnScroll>
);

const row2LeftBlock = () => {
  const router = useRouter();
  return (
    <>
      <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
        <h2>Rarity Chart</h2>
        <p>
          Your Polymorph’s traits determine its rarity rating. Having a full set of matching traits
          will help you climb the rarity chart. One sure way to obtain matching traits is to
          scramble your way to the top.
        </p>
        <Button className="light-button" onClick={() => router.push('/polymorph-rarity')}>
          Rarity chart
        </Button>
      </AnimatedOnScroll>
    </>
  );
};

const AboutSection = () => (
  <>
    <Marquee gradient={false} className="welcome--marquee">
      <div className="border--top" />
      {marquee()}
    </Marquee>
    <WrapperCenter className="about--wrapper--row1">
      <WrapperCenterTwoColumns
        leftBlock={
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={500}>
            <h2>What are Polymorphs?</h2>
            <img alt="img" src={ImgRow1} />
          </AnimatedOnScroll>
        }
        rightBlock={row1RightBlock()}
        rightClassName="new--technology"
        leftClassName="polymorph--section1--row1--left--block"
      />
    </WrapperCenter>
    <WrapperCenter className="about--wrapper--row2">
      <WrapperCenterTwoColumns
        rightBlock={
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={500}>
            <div className="images--charts--parent">
              <h2>Polymorph Rarity Chart</h2>
              <img src={imgRow2Chart} alt="img" className="row2-chart" />
              {/* <img src={imgRow2ChartMobile} alt="img" className="row2-chart-mobile" /> */}
            </div>
          </AnimatedOnScroll>
        }
        leftBlock={row2LeftBlock()}
        leftClassName="released--left--block"
        rightClassName="relased--right--block"
      />
    </WrapperCenter>
  </>
);

export default AboutSection;
