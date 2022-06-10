import React from "react";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@legacy/svgs/ArrowLeftIcon";
import polymorphImg from "../../../assets/images/burn-polymorph.png";
import neverScrambledIcon from "../../../assets/images/never-scrambled-badge.svg";

const ImageWithBadges = ({ polymorphData, isV1, iframeData }) => {
  const router = useRouter();
  // Get the ipfsHash from the animation_url
  const ipfsHash = iframeData?.substr(7);
  return (
    <div className="polymorph--image--with--badges">
      <div
        className="go--back--btn"
        onClick={() => router.push("/my-polymorphs")}
      >
        <span className="tooltiptext">Go back</span>
        <ArrowLeftIcon fillColor="black" />
      </div>
      <div
        className="go--back--btn--mobile"
        onClick={() => router.push("/my-polymorphs")}
      >
        <ArrowLeftIcon fillColor="black" />
        <span>Go back</span>
      </div>
      {isV1 && (
        <div className="polymorph--image">
          <img src={polymorphData.imageurl} alt="Polymorph" />
          {/* <div className="polymorph--badge">
          TO DO: NEVER SCRAMBLED SHOULD BE CONDITIONALLY RENDERED
          <span className="tooltiptext">Never scrambled</span>
          <img
            className="scrambled--icon"
            src={neverScrambledIcon}
            alt="Never Scrambled"
          />
        </div> */}
        </div>
      )}
      {!isV1 && ipfsHash && (
        <div className="polymorph--iframe">
          <iframe
            src={`${process.env.REACT_APP_UNIVERSE_PINATA_GATEWAY}${ipfsHash}`}
            style={{
              height: "600px",
              // maxWidth: "600px",
              width: "600px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithBadges;
