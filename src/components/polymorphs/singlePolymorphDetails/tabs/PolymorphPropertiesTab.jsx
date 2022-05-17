import React, { useEffect, useState } from "react";
import GeneParser from "@legacy/helpers/GeneParser";
import RarityRankPopupProperty from "@legacy/popups/RarityRankPopupProperty";

const PolymorphPropertiesTab = ({ data }) => {
  const [traitsMap, setTraitsMap] = useState(
    GeneParser.parse(data.currentgene)
  );

  const properties = [
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default PolymorphPropertiesTab;
