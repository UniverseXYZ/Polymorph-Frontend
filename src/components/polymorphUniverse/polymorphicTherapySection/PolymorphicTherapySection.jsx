import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import TV from "../../../assets/images/polymorphic-therapy-tv.png";
import Button from "@legacy/button/Button";
import YoutubeIcon from "../../../assets/images/youtube-red.svg";
import YoutubeIconMobile from "../../../assets/images/youtube.svg";
import Background from "../../../assets/images/polymorphic-therapy-background.png";
import Image from "next/image";
import { useWindowSize } from "react-use";

const linkToYoutube = "https://www.youtube.com/watch?v=xz3E6NpQJvI";

const PolymorphicTherapySection = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (+windowSize.width <= 768) setMobile(true);
    else setMobile(false);
  }, [windowSize.width]);

  return (
    <div className="polymorphic--therapy--section">
      <Image
        className="polymorphic--therapy--section--background"
        src={Background}
        objectFit={mobile ? "cover" : ""}
        width={2048}
        height={939}
        alt={"background"}
      />
      <div className="polymorphic--therapy--section--container">
        <div className="grid">
          <div className="polymorph-div">
            <h1>Polymorphic Therapy</h1>
            <p>
              Polymorphs are taking themselves to therapy... well, they may
              actually have taken a therapist but that’s not the point here. The
              point is, when is the last time you have asked your polymorph how
              it feels?
            </p>
            <Button onClick={() => window.open(linkToYoutube)}>
              <img className="youtube-logo" src={YoutubeIcon} alt="youtube" />
              <img
                className="youtube-mobile-logo"
                src={YoutubeIconMobile}
                alt="youtube"
              />
              Watch on Youtube
            </Button>
          </div>
          <div className="TV" onClick={() => setIsClicked(!isClicked)}>
            <div className="video-responsive">
              <ReactPlayer url={linkToYoutube} playing={isClicked} />
            </div>
            <img src={TV} alt="tv"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolymorphicTherapySection;
