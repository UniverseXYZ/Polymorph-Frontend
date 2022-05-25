import React from "react";
import Lottie from "react-lottie";
import animationData from "./BurnPolymorph/burn_polymorph";

const BurnPolymorphAnimation = ({ animationData }) => {
  const defaultOptions = {
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} isClickToPauseDisabled />;
};

export default BurnPolymorphAnimation;
