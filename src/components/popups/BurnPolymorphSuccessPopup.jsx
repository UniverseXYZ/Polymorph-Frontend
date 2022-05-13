import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Slider from "react-slick";
import closeIcon from "../../assets/images/cross.svg";
import Button from "@legacy/button/Button";
import { renderLoaders } from "../../containers/rarityCharts/renderLoaders.jsx";

const BurnPolymorphSuccessPopup = ({ onClose, characters }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="burn--polymorph--success--popup">
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="Close" />
      </button>
      <h2 className="title">Congratulations!</h2>
      <p className="desc">{`You have successfully burnt your old polymorph${
        characters.length > 1 ? "s" : ""
      } and minted a new one${characters.length > 1 ? "s" : ""}`}</p>
      {loading ? (
        <p className="info">Your NFTs may take up to 2 minutes to load</p>
      ) : (
        <></>
      )}
      {characters.length > 1 ? (
        <div className="batch--polymorphs">
          {loading ? (
            renderLoaders(characters.length)
          ) : (
            <Slider {...settings}>
              {characters.map((c) => {
                return (
                  <div className="polymorph--img" key={c.tokenId}>
                    <img src={c.imageUrl} alt="Polymorph" />
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      ) : (
        <div className="single--polymorph">
          {loading ? (
            renderLoaders(1)
          ) : (
            <div className="polymorph--img">
              <img src={characters[0].imageUrl} alt="Polymorph" />
            </div>
          )}
        </div>
      )}
      <div className="actions">
        <Button className="light-button" onClick={onClose}>
          Burn More
        </Button>
        <Button
          className="light-border-button"
          onClick={() => router.push("/my-polymorphs")}
        >
          My Polymorphs
        </Button>
      </div>
    </div>
  );
};

BurnPolymorphSuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  characters: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default BurnPolymorphSuccessPopup;
