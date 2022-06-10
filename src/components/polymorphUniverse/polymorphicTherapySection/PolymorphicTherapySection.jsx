import React, { useState } from "react";
import ReactPlayer from "react-player";
import TV from "../../../assets/images/polymorphic-therapy-tv.png";
import Button from "@legacy/button/Button";
import YoutubeIcon from "../../../assets/images/youtube-red.svg";
import YoutubeIconMobile from "../../../assets/images/youtube.svg";
const linkToYoutube =
  "https://www.youtube.com/watch?v=tf-6ele4-Co&list=PLEzjGlBjDUouyywVq5dpuEHmJfyu8Ny_E&ab_channel=Universe";

const PolymorphicTherapySection = () => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div className="polymorphic--therapy--section">
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
