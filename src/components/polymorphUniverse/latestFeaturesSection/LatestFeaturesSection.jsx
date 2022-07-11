import React from "react";
// import './LatestFeaturesSection.scss';
import { useRouter } from "next/router";
import rarityChartIcon from "../../../assets/images/rarity-chart-icon.svg";
import battleUniverseIcon from "../../../assets/images/battle-universe-icon.svg";
import burnToMintIcon from "../../../assets/images/burn-to-mint-icon.svg";
import Button from "@legacy/button/Button";
import PolymorphicFaces from "../../../assets/images/polymorphic-faces.png";
import ArrowLeftIcon from "@legacy/svgs/ArrowLeftIcon";
import polymorphicFacesGif from "../../../assets/images/polymorphic-faces-gif.gif";

const LatestFeaturesSection = () => {
  const router = useRouter();

  return (
    <div className="latest--features--section">
      <div className="latest--features--section--container">
        <h1 className="title">Latest features</h1>
        <div className="grid">
          <div className="grid--item">
            <img src={rarityChartIcon} alt="Rarity chart" />
            <h2>Rarity Chart</h2>
            <p>
              Compare your Polymorph’s ranking, scoring and information based on
              the rarity of its traits.
            </p>
            <button
              className="light-border-button"
              onClick={() => router.push("/polymorph-rarity")}
            >
              Explore
              <ArrowLeftIcon />
            </button>
          </div>
          <div className="grid--item">
            <img src={burnToMintIcon} alt="Burn to mint" />
            <h2 className="burn-mint-h2">Burn to Mint</h2>
            <p>
              Say goodbye to the old version of your Polymorph forever and hello
              to your shiny new one.
            </p>
            <button
              className="light-border-button"
              onClick={() => router.push("/burn-to-mint")}
            >
              Explore
              <ArrowLeftIcon />
            </button>
          </div>
          <div className="grid--item">
            <img src={battleUniverseIcon} alt="Battle universe" />
            <h2>Battle Universe</h2>
            <p>
              Wager ETH and compete against other Polymorph owners around the
              world.
            </p>
            <button className="button-disabled">
              Coming soon
              {/* <ArrowLeftIcon /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestFeaturesSection;
