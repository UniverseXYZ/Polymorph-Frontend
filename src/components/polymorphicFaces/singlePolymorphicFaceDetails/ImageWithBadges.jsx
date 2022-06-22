import React from "react";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@legacy/svgs/ArrowLeftIcon";
import polymorphImg from "../../../assets/images/burn-polymorph.png";
import neverScrambledIcon from "../../../assets/images/never-scrambled-badge.svg";

const ImageWithBadges = ({ polymorphicData }) => {
  const router = useRouter();

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
      <div className="polymorph--image">
        <img src={polymorphicData.imageurl} alt="Polymorphic Face" />
      </div>
    </div>
  );
};

export default ImageWithBadges;
