import React, { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import WelcomeWrapper from "../../ui-elements/WelcomeWrapper";
import Lottie from "react-lottie";
import animationDataDesktop from "../../../utils/animations/rarity_header_animation_desktop.json";
import animationDataTablet from "../../../utils/animations/rarity_header_animation_tablet.json";
import animationDataMobile from "../../../utils/animations/rarity_header_animation_mobile.json";
// import './Welcome.scss';

const Welcome = () => {
  const [animation, setAnimation] = useState();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (+windowSize.width <= 575) setAnimation(animationDataMobile);
    if (+windowSize.width <= 1024) setAnimation(animationDataTablet);
    else setAnimation(animationDataDesktop);
  }, [windowSize.width]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="welcome--section--rarity--charts">
      <div className={"rarity--background--animation"}>
        <Lottie options={defaultOptions} isClickToPauseDisabled />
      </div>
      <WelcomeWrapper
        title="Polymorph Rarity Chart"
        hintText="10,000 Total Polymorphs"
        ellipsesLeft={false}
        ellipsesRight={false}
        // marquee={marquee()}
        bgTextRight
      />
    </div>
  );
};

export default Welcome;
