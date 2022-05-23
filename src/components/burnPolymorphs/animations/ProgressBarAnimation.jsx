import React from "react";
import Lottie from "react-lottie";
import animationData from "./ProgressBar/progress_bar";

const ProgressBarAnimation = () => {
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

export default ProgressBarAnimation;
