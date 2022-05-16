import React, { useEffect } from "react";
import PolymorphPropertyCard from "../../polymorphPropertyCard/PolymorphPropertyCard";

const PolymorphPropertiesTab = ({ data }) => {
  // Dummy data
  const polymorphProperties = [
    {
      id: 1,
      text1: "Base character",
      text2: "Troll God",
      text3: "28% have this trait",
      type: "gradient",
    },
    {
      id: 2,
      text1: "Headwear",
      text2: "Golden Spartan Helmet",
      text3: "58% have this trait",
      type: "blue",
    },
    {
      id: 3,
      text1: "Torso",
      text2: "Silver Spartan Armor",
      text3: "58% have this trait",
      type: "blue",
    },
    {
      id: 4,
      text1: "Footwear",
      text2: "Brown Spartan Sandals",
      text3: "58% have this trait",
      type: "pink",
    },
    {
      id: 5,
      text1: "Left-hand accessory",
      text2: "Bow & Arrow",
      text3: "58% have this trait",
      type: "",
    },
    {
      id: 6,
      text1: "Right -hand accessory",
      text2: "Silver Spartan Sword",
      text3: "58% have this trait",
      type: "pink",
    },
    {
      id: 7,
      text1: "Footwear",
      text2: "Brown Spartan Sandals",
      text3: "58% have this trait",
      type: "pink",
    },
    {
      id: 8,
      text1: "Torso",
      text2: "Silver Spartan Armor",
      text3: "58% have this trait",
      type: "blue",
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
        {polymorphProperties.map((prop) => (
          <PolymorphPropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
};

export default PolymorphPropertiesTab;
