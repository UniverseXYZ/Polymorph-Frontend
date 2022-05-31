import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Marquee from "react-fast-marquee";
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { AnimatedOnScroll } from "react-animated-css-onscroll";
import Popup from "reactjs-popup";
import ellipses from "../../assets/images/ellipses.svg";
import backgroundTextLeft from "../../assets/images/mint-polymorph-welcome-bg-left.png";
import backgroundTextRight from "../../assets/images/mint-polymorph-welcome-bg-right.png";
import Button from "../button/Button.jsx";
import SubscribePopup from "../popups/SubscribePopup.jsx";
// import './styles/WelcomeWrapper.scss';

const WelcomeWrapper = (props) => {
  const {
    ellipsesLeft,
    ellipsesRight,
    title,
    hintText,
    btnText,
    btnOnClick,
    btnAnotherOnClick,
    popupBtnText,
    children,
    marquee,
    bgTextLeft,
    bgTextRight,
  } = props;

  return (
    <div className="welcome--section">
      {ellipsesLeft && (
        <img className="ellipse-l" src={ellipses} alt="Ellipses" />
      )}
      {ellipsesRight && (
        <img className="ellipse-r" src={ellipses} alt="Ellipses" />
      )}
      <div className="welcome__section__container">
        {bgTextLeft && (
          <div className="text-l">
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={300}>
              {/* <img src={backgroundTextLeft} className="elipses-bg" alt="Ellipses" /> */}
            </AnimatedOnScroll>
            <div className="opacity-l" />
          </div>
        )}
        {bgTextRight && (
          <div className="text-r">
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={300}>
              {/* <img src={backgroundTextRight} className="elipses-bg" alt="Ellipses" /> */}
            </AnimatedOnScroll>
            <div className="opacity-r" />
          </div>
        )}
        <div className="left">
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
            <h1 className="title">{title}</h1>
          </AnimatedOnScroll>
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={400}>
            <p className="desc">{hintText}</p>
          </AnimatedOnScroll>
          <AnimatedOnScroll animationIn="fadeIn" animationInDelay={600}>
            <div className="links">
              {!!btnText.length && (
                <Button className="light-button" onClick={btnOnClick}>
                  {popupBtnText}
                </Button>
              )}
              {/* {!!popupBtnText.length && !btnAnotherOnClick && (
                <Popup
                  trigger={
                    <button type="button" className="light-border-button">
                      {popupBtnText}
                    </button>
                  }
                >
                  {(close) => <SubscribePopup close={close} />}
                </Popup>
              )} */}
              {/* {!!popupBtnText.length && btnAnotherOnClick && (
                <button type="button" className="light-border-button" onClick={btnAnotherOnClick}>
                  {popupBtnText}
                </button>
              )} */}
            </div>
          </AnimatedOnScroll>
        </div>
        <AnimatedOnScroll animationIn="fadeIn">
          <div className="right">{children && <div>{children}</div>}</div>
        </AnimatedOnScroll>
      </div>
      {marquee && (
        <Marquee gradient={false} className="welcome--marquee">
          <div className="border--top" />
          {marquee}
        </Marquee>
      )}
    </div>
  );
};

WelcomeWrapper.propTypes = {
  ellipsesLeft: PropTypes.bool,
  ellipsesRight: PropTypes.bool,
  title: PropTypes.string.isRequired,
  hintText: PropTypes.string,
  btnText: PropTypes.string,
  btnOnClick: PropTypes.func,
  btnAnotherOnClick: PropTypes.func,
  popupBtnText: PropTypes.string,
  children: PropTypes.node,
  marquee: PropTypes.node,
  bgTextLeft: PropTypes.bool,
  bgTextRight: PropTypes.bool,
};

WelcomeWrapper.defaultProps = {
  ellipsesLeft: true,
  ellipsesRight: true,
  hintText: "",
  children: null,
  marquee: null,
  btnText: "",
  btnOnClick: () => {},
  btnAnotherOnClick: () => {},
  popupBtnText: "",
  bgTextLeft: false,
  bgTextRight: false,
};

export default WelcomeWrapper;
