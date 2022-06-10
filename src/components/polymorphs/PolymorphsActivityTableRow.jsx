import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { utils } from "ethers";
import ScrambleTypeImg from "../../assets/images/eventTypeScramble.svg";
import MintTypeImg from "../../assets/images/eventTypeMint.svg";
import TradeTypeImg from "../../assets/images/eventTypeTrade.svg";
import ListedTypeImg from "../../assets/images/eventTypeListed.svg";
import TransferTypeImg from "../../assets/images/eventTypeTransfer.svg";
import imgDiamondPaws from "../../assets/images/Diamond-paws.png";
import imgEsCrow from "../../assets/images/Escrow-small.png";
import imgFrankie from "../../assets/images/Frankie-small.png";
import imgGlenn from "../../assets/images/Glenn-small.png";
import imgGoldtooth from "../../assets/images/Goldtooth-small.png";
import imgGrishnak from "../../assets/images/Grishnak-small.png";
import imgCharles from "../../assets/images/Charles-small.png";
import imgMariguana from "../../assets/images/Mariguana-small.png";
import imgPaul from "../../assets/images/Paul-small.png";
import imgRagnar from "../../assets/images/Ragnar-small.png";
import imgXYZBot from "../../assets/images/XYZbot-small.png";
import { useRouter } from "next/router";
// import './styles/PolymorphsActivityTableRow.scss';
import ETHIcon from "../../assets/images/v2/tokens/ETH_white.svg";
import LoadingSpinner from "@legacy/svgs/LoadingSpinner";
import Popup from "reactjs-popup";

const characters = [
  "Diamond Paws",
  "EsCrow",
  "Frankie",
  "Glenn",
  "Goldtooth",
  "Troll God",
  "Charles",
  "Mariguana",
  "Vitalik",
  "Ragnar",
  "X-YZ",
];

const characterImages = {
  "Diamond Paws": imgDiamondPaws,
  EsCrow: imgEsCrow,
  Frankie: imgFrankie,
  Glenn: imgGlenn,
  Goldtooth: imgGoldtooth,
  "Troll God": imgGrishnak,
  Charles: imgCharles,
  Mariguana: imgMariguana,
  Vitalik: imgPaul,
  Ragnar: imgRagnar,
  "X-YZ": imgXYZBot,
};

const getTypeImage = (type) => {
  if (type === "scramble") {
    return ScrambleTypeImg;
  }
  if (type === "mint") {
    return MintTypeImg;
  }
  if (type === "trade") {
    return TradeTypeImg;
  }
  if (type === "listed") {
    return ListedTypeImg;
  }
  return TransferTypeImg;
};

const getTypeEvent = (type) => {
  switch (type) {
    case 0:
      return "mint";
    case 1:
      return "scramble";
    case 2:
      return "transfer";
    default:
      return "transfer";
  }
};

const getSkinFromGenome = (gene) => {
  const genePosition = gene.slice(-2);
  return characters[parseInt(genePosition, 10) % 11];
};

const getName = (skin, id) => `${skin} #${id}`;

const getCharacterBaseImage = (character) => characterImages[character];

const PolymorphsActivityTableRow = ({ data, className, ethPrice }) => {
  const history = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  return (
    <tr className={`row ${className}`}>
      <td className="td--image">
        <div className="polymorph--table--image--block">
          <img
            alt="img"
            src={getCharacterBaseImage(getSkinFromGenome(data.newGene))}
          />
        </div>
      </td>
      <td className="td--name">
        <span>
          <button
            className="morph-button"
            type="button"
            onClick={() => {
              setRedirecting(true);
              history.push(`polymorphs/${data.tokenId}`);
            }}
          >
            {getName(getSkinFromGenome(data.newGene), data.tokenId)}
          </button>
        </span>
      </td>
      <td className="td--skin">
        <span>{getSkinFromGenome(data.newGene)}</span>
      </td>
      <td className="td--event">
        <span>
          <div className={`flex--event--block`}>
            <div
              className={`event--type event--type--${getTypeEvent(
                data.eventType
              )}`}
            >
              <img alt="img" src={getTypeImage(getTypeEvent(data.eventType))} />
              <span className="text--event">
                {getTypeEvent(data.eventType)}
              </span>
            </div>
          </div>
        </span>
      </td>
      <td className="td--price">
        <img className="eth--icon" src={ETHIcon} />
        <span className="price--eth">{utils.formatEther(data.price)}</span>
        <span className="price--usd">
          {" "}
          (${(ethPrice * utils.formatEther(data.price)).toFixed(2)})
        </span>
      </td>
      <Popup open={redirecting}>
        <LoadingSpinner />
      </Popup>
    </tr>
  );
};
PolymorphsActivityTableRow.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    skin: PropTypes.string,
    eventType: PropTypes.number,
    price: PropTypes.string,
    priceUSD: PropTypes.string,
    tokenId: PropTypes.string,
    newGene: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  ethPrice: PropTypes.string,
};

PolymorphsActivityTableRow.defaultProps = {
  className: "",
  ethPrice: "",
};

export default PolymorphsActivityTableRow;
