import React from "react";
import Lottie from "react-lottie";
import animationData from "./BurningImage/NFTs_hero";

const ProgressBarIndicatorAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} isClickToPauseDisabled />;
};

export default ProgressBarIndicatorAnimation;
