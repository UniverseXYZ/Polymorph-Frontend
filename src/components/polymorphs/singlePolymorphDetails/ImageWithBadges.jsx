import React from "react";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@legacy/svgs/ArrowLeftIcon";
import polymorphImg from "../../../assets/images/burn-polymorph.png";
import neverScrambledIcon from "../../../assets/images/never-scrambled-badge.svg";

const ImageWithBadges = ({ polymorphData }) => {
  const router = useRouter();
  return (
    <div className="polymorph--image--with--badges">
      <div className="go--back--btn" onClick={() => router.back()}>
        <span className="tooltiptext">Go back</span>
        <ArrowLeftIcon fillColor="black" />
      </div>
      <div className="go--back--btn--mobile" onClick={() => router.back()}>
        <ArrowLeftIcon fillColor="black" />
        <span>Go back</span>
      </div>
      <div className="polymorph--image">
        <img src={polymorphData.imageurl} alt="Polymorph" />
        <div className="polymorph--badge">
          {/* TO DO: NEVER SCRAMBLED SHOULD BE CONDITIONALLY RENDERED*/}
          <span className="tooltiptext">Never scrambled</span>
          <img
            className="scrambled--icon"
            src={neverScrambledIcon}
            alt="Never Scrambled"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageWithBadges;
