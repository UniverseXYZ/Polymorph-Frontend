import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import Marquee from 'react-fast-marquee';
import WrapperCenter from '../WrapperCenter';
import WrapperCenterTwoColumns from '../WrapperCenterTwoColumns';
import Button from '../../button/Button';
import RandomiseIconBTN from '../../../assets/images/Randomise.png';
import personData from '../../../utils/fixtures/randomisePersonData';
import Section3Border from '../../../assets/images/mint-polymorph-section3-border.png';
import './styles/Section3Randomise.scss';
import IconInfoYellow from '../../../assets/images/yellowIcon.svg';

const randomIndex = (state, setState) => {
  const random = Math.floor(Math.random() * 4);
  if (state === random) {
    if (random === 3) setState(random - 1);
    else setState(random + 1);
  }
  return setState(random);
};

const marqueText = () => (
  <>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
    <div>Test {'> '}</div>
  </>
);

const title = () => (
  <>
    <h3 className="tittle--randomise--block">Play with the traits</h3>
    <p className="hint--text--randomise--block">
      Experiment with a collection of 40+ traits by clicking the button below
    </p>
  </>
);

const Section3Randomise = (props) => {
  const { mobile } = props;
  const [randomBgNumber, setRandomBgNumber] = useState(0);
  const [randomHeadwearsNumber, setRandomHeadwearsNumber] = useState(1);
  const [randomPantsNumber, setRandomPantsNumber] = useState(1);
  const [randomTorsoNumber, setRandomTorsoNumber] = useState(3);
  const { person, backgrounds, headwears, pants, torso } = personData;
  const globalRandom = () => {
    randomIndex(randomBgNumber, setRandomBgNumber);
    randomIndex(randomHeadwearsNumber, setRandomHeadwearsNumber);
    randomIndex(randomPantsNumber, setRandomPantsNumber);
    randomIndex(randomTorsoNumber, setRandomTorsoNumber);
  };
  return (
    <div className="section3--randomise--parent">
      <WrapperCenter>
        <WrapperCenterTwoColumns
          leftBlock={
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
              {!!mobile && title()}
              <div className="left--randomise--img--block--parent">
                <div
                  className="left--randomise--img--block--child"
                  style={{ backgroundImage: `url(${backgrounds[randomBgNumber]})` }}
                >
                  <div className="marquee--top">
                    <Marquee gradient={false} direction="right">
                      {marqueText()}
                    </Marquee>
                  </div>
                  <div className="marquee--right">
                    <Marquee gradient={false} direction="right" speed={0.5}>
                      {marqueText()}
                    </Marquee>
                  </div>
                  <div className="marquee--bottom">
                    <Marquee gradient={false} direction="right">
                      {marqueText()}
                    </Marquee>
                  </div>
                  <div className="marquee--left">
                    <Marquee gradient={false} direction="right" speed={0.5}>
                      {marqueText()}
                    </Marquee>
                  </div>
                  <img src={Section3Border} alt="img" className="randomise--border--image" />
                  {!!headwears[randomHeadwearsNumber] && (
                    <img
                      src={headwears[randomHeadwearsNumber]}
                      alt="img"
                      className="headwears--img"
                    />
                  )}
                  <img alt="img" src={person} />
                  {!!pants[randomPantsNumber] && (
                    <img src={pants[randomPantsNumber]} alt="img" className="pants--img" />
                  )}
                  {!!torso[randomTorsoNumber] && (
                    <img src={torso[randomTorsoNumber]} alt="img" className="torso--img" />
                  )}
                </div>
              </div>
            </AnimatedOnScroll>
          }
          rightBlock={
            <div className="right--randomise--block--parent">
              {!mobile && title()}
              <div className="warning--popup--info">
                <div className="warning--popup--info--child">
                  <img alt="title" src={IconInfoYellow} />
                  <p>
                    This is just a test run and it doesn’t relate to the polimorph you mint via the
                    bonding curve
                  </p>
                </div>
              </div>
              <Button className="light-button" onClick={globalRandom}>
                Randomise
                <img alt="img" src={RandomiseIconBTN} className="btn--icon--randomise" />
              </Button>
            </div>
          }
          rightClassName="wrapper--randomise--right--block"
        />
      </WrapperCenter>
    </div>
  );
};

Section3Randomise.propTypes = {
  mobile: PropTypes.bool,
};

Section3Randomise.defaultProps = {
  mobile: false,
};

export default Section3Randomise;