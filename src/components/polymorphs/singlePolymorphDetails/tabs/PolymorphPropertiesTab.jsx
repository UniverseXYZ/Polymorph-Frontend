import React, { useEffect, useState } from "react";
import GeneParser from "@legacy/helpers/GeneParser";
import RarityRankPopupProperty from "@legacy/popups/RarityRankPopupProperty";

const PolymorphPropertiesTab = ({
  data,
  isPolymorph,
  isV1,
  isPolymorphicFace,
}) => {
  const [traitsMap, setTraitsMap] = useState(
    GeneParser.parse(data.currentgene)
  );

  let properties = [];

  if (isPolymorph) {
    properties = [
      {
        propertyName: "Character",
        value: data.character,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Footwear",
        value: data.footwear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Pants",
        value: data.pants,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Torso",
        value: data.torso,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Eyewear",
        value: data.eyewear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Headwear",
        value: data.headwear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Left Hand",
        value: data.lefthand,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Right Hand",
        value: data.righthand,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Background",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
    ];
  }

  if (isPolymorphicFace) {
    properties = [
      {
        propertyName: "Background",
        value: data.character,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Hair Left",
        value: data.footwear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Hair Right",
        value: data.pants,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Ear Left",
        value: data.torso,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Ear Right",
        value: data.eyewear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Eye Left",
        value: data.headwear,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Eye Right",
        value: data.lefthand,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Lips Left",
        value: data.righthand,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Lips Right",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Beard Top Left",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Beard Top Right",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Beard Bottom Left",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
      {
        propertyName: "Beard Bottom Right",
        value: data.background,
        mainMatchingAttributes: data.mainmatchingtraits,
        secMatchingAttributes: data.secmatchingtraits,
        genesMap: traitsMap,
        matchingHands: data.matchinghands,
      },
    ];
  }

  useEffect(() => {
    let tooltips = document.querySelectorAll(
      ".polymorph--property--card .tooltiptext"
    );
    if (tooltips.length) {
      tooltips.forEach((t) => {
        let elRect = t.getBoundingClientRect();
        let pos = window.innerWidth - elRect.right;
        if (pos < 0) {
          t.classList.add("align--right");
        }
      });
    }
  }, []);

  return (
    <div className="polymorph--properties--tab">
      <div className="polymorph--tags">
        {isPolymorph && isV1 && (
          <span>
            <b>V1</b>
          </span>
        )}
        {isPolymorph && !isV1 && (
          <span className="gradient">
            <b>V2</b>
            <div className="gr-bg" />
          </span>
        )}
        <span>
          Rank: <b>{data.rank}</b>
        </span>
        <span>
          Rarity score: <b>{data.rarityscore}</b>
        </span>
      </div>
      <div className="polymorph--properties--grid">
        {properties.map((prop) => {
          return (
            <RarityRankPopupProperty
              key={prop.propertyName}
              propertyName={prop.propertyName}
              value={prop.value}
              mainMatchingAttributes={prop.mainMatchingAttributes}
              secMatchingAttributes={prop.secMatchingAttributes}
              genesMap={traitsMap}
              matchingHands={data.matchinghands}
              isPolymorph={isPolymorph}
              isV1={isV1}
              isPolymorphicFace={isPolymorphicFace}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PolymorphPropertiesTab;
