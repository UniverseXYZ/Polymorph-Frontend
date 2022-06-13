import React from "react";
import PropTypes from "prop-types";
import { utils } from "ethers";
import ScrambleTypeImg from "../../assets/images/eventTypeScramble.svg";
import MintTypeImg from "../../assets/images/eventTypeMint.svg";
import TradeTypeImg from "../../assets/images/eventTypeTrade.svg";
import ListedTypeImg from "../../assets/images/eventTypeListed.svg";
import TransferTypeImg from "../../assets/images/eventTypeTransfer.svg";
// import './styles/PolymorphsActivityTableRowMobile.scss';
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
import ETHIcon from "../../assets/images/v2/tokens/ETH_white.svg";

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

const PolymorphsActivityTableRowMobile = (props) => {
  const { data, className, ethPrice } = props;
  const { image, name, skin, eventType, price, priceUSD } = data;
  return (
    <div className={`item table--row--mobile ${className}`}>
      <div className="left--block image--block">
        <div>
          <img
            alt="img"
            src={getCharacterBaseImage(getSkinFromGenome(data.newGene))}
          />
        </div>
      </div>
      <div className="center--block data--block">
        <p className="name--block">
          {getName(getSkinFromGenome(data.newGene), data.tokenId)} .{" "}
          <span>{getSkinFromGenome(data.newGene)}</span>
        </p>
        <div className="event--block">
          <div
            className={`event--type event--type--${getTypeEvent(
              data.eventType
            )}`}
          >
            <img alt="img" src={getTypeImage(getTypeEvent(data.eventType))} />
            <span className="event--text">{getTypeEvent(data.eventType)}</span>
          </div>
        </div>
      </div>
      <div className="right--block price--block">
        <p className="price--eth">
          <img src={ETHIcon} alt="eth-icon" />
          {utils.formatEther(data.price)}
        </p>
        <p className="price--usd">
          (${(ethPrice * utils.formatEther(data.price)).toFixed(2)})
        </p>
      </div>
    </div>
  );
};

PolymorphsActivityTableRowMobile.propTypes = {
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

PolymorphsActivityTableRowMobile.defaultProps = {
  className: "",
  ethPrice: "",
};

export default PolymorphsActivityTableRowMobile;
