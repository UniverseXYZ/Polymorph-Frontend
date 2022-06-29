import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  queryPolymorphsGraph,
  queryPolymorphsGraphV2,
  traitRarity,
} from "../../utils/graphql/polymorphQueries";
import RarityRankOrangeProperty from "./RarityRankOrangeProperty";
import RarityRankBlueProperty from "./RarityRankBlueProperty";
import RarityRankPinkOrangeProperty from "./RarityRankPinkOrangeProperty";
import RarityRankNoColorProperty from "./RarityRankNoColorProperty";
import RarityRankPinkProperty from "./RarityRankPinkProperty";

function RarityRankPopupProperty({
  mainMatchingAttributes,
  propertyName,
  secMatchingAttributes,
  value,
  genesMap,
  matchingHands,
  isPolymorph,
  isV1,
  isPolymorphicFace,
}) {
  const [data, setData] = useState(null);

  let chance = "";
  if (data?.traits?.length) {
    chance = `${Math.round(data.traits[0]?.rarity, 10)}% have this trait`;
  }
  useEffect(() => {
    if (isPolymorph) {
      const queryTraitRarity = async () => {
        let traitData;
        if (isV1) {
          traitData = await queryPolymorphsGraph(
            traitRarity(genesMap[propertyName.toUpperCase()])
          );
        }
        if (!isV1) {
          traitData = await queryPolymorphsGraphV2(
            traitRarity(genesMap[propertyName.toUpperCase()])
          );
        }
        setData(traitData);
      };
      if (genesMap[propertyName.toUpperCase()]) {
        queryTraitRarity();
      }
    }
    if (isPolymorphicFace) {
      const queryTraitRarity = async () => {
        let traitData;
        // traitData = await queryPolymorphsGraph(
        //   traitRarity(genesMap[propertyName.toUpperCase()])
        // );
        setData(traitData);
      };
      if (genesMap[propertyName.toUpperCase()]) {
        queryTraitRarity();
      }
    }
  }, []);

  const renderTrait = () => {
    // Checks if hands are matching different set than the main and secondary sets
    if (
      (propertyName === "Left Hand" || propertyName === "Right Hand") &&
      matchingHands === 2 &&
      !mainMatchingAttributes.includes(propertyName) &&
      !secMatchingAttributes.includes(propertyName)
    ) {
      return (
        <RarityRankBlueProperty
          tooltipText="Hands set trait"
          propertyName={propertyName}
          trait={value}
          chance={chance}
        />
      );
    }

    if (
      mainMatchingAttributes.includes(propertyName) &&
      secMatchingAttributes.includes(propertyName)
    ) {
      return (
        <RarityRankPinkOrangeProperty
          tooltipText="Main &amp; Secondary set trait"
          propertyName={propertyName}
          trait={value}
          chance={chance}
        />
      );
    }

    if (mainMatchingAttributes.includes(propertyName)) {
      return (
        <RarityRankOrangeProperty
          tooltipText="Main set trait"
          propertyName={propertyName}
          trait={value}
          chance={chance}
        />
      );
    }

    if (secMatchingAttributes.includes(propertyName)) {
      return (
        <RarityRankPinkProperty
          tooltipText="Secondary set trait"
          propertyName={propertyName}
          trait={value}
          chance={chance}
        />
      );
    }
    return (
      <RarityRankNoColorProperty
        propertyName={propertyName}
        trait={value}
        chance={chance}
      />
    );
  };

  const renderTraitFaces = () => {
    // TO DO:
    // Implement this function, based on possible
    // combinations of matching traits
    // Checks if hands are matching different set than the main and secondary sets
    // if (
    // propertyName === "Eye Left" ||
    // propertyName === "Eye Right"
    // matchingHands === 2 &&
    // !mainMatchingAttributes.includes(propertyName) &&
    // !secMatchingAttributes.includes(propertyName)
    // ) {
    return (
      <RarityRankNoColorProperty
        tooltipText="Hands set trait"
        propertyName={propertyName}
        trait={value}
        chance={chance}
      />
    );
    // } else return <></>;
  };

  return isPolymorph
    ? renderTrait()
    : isPolymorphicFace
    ? renderTraitFaces()
    : null;
}

RarityRankPopupProperty.propTypes = {
  propertyName: PropTypes.oneOfType([PropTypes.string]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string]).isRequired,
  matchingHands: PropTypes.oneOfType([PropTypes.number]).isRequired,
  genesMap: PropTypes.oneOfType([PropTypes.any]).isRequired,
  mainMatchingAttributes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  secMatchingAttributes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default RarityRankPopupProperty;
