import React from "react";
import Lottie from "react-lottie";
// import animationData from '../../../utils/animations/burning_polymorph_animation.json';

const BurnPolymorphAnimation = ({ animationData }) => {
  const defaultOptions = {
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} />;
};

export default BurnPolymorphAnimation;
