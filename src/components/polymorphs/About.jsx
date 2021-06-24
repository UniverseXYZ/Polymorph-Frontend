import React from 'react';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import WrapperCenter from './WrapperCenter';
import WrapperCenterTwoColumns from './WrapperCenterTwoColumns';
import ImgRow1 from '../../assets/images/Section1-Illustration-min.png';
import ImgRow2Chart from '../../assets/images/chart-min1.svg';
import ImgRow2Background from '../../assets/images/curve-bg.jpg';
import './styles/About.scss';

const row1RightBlock = () => (
  <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
    <h2>New Technology</h2>
    <p>
      A first in the Universe and on the blockchain, we’ve built technology that allows you to morph
      your Polymorph’s characteristics. When you mint, you will get a random Polymorph with traits
      and wearables that can be scrambled.
    </p>
  </AnimatedOnScroll>
);

const row2LeftBlock = () => (
  <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
    <h2>Fair Launch</h2>
    <p>
      The Polymorphs will be released on a flat curve. 10,000 Polymorphs can be minted for 0.0777
      ETH each. Up to 20 Polymorphs can be minted in one transaction. Minted Polymorphs can be sold
      on any ERC-721-compatible marketplace.
    </p>
  </AnimatedOnScroll>
);

const About = () => (
  <>
    <WrapperCenter className="about--wrapper--row1">
      <WrapperCenterTwoColumns
        leftBlock={
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={500}>
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
              <img alt="img" src={ImgRow2Chart} className="dominant--image" />
              <img alt="img" src={ImgRow2Background} className="row2--background" />
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

export default About;
