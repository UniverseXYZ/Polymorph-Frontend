import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Slider from "react-slick";
import closeIcon from "../../assets/images/cross.svg";
import Button from "@legacy/button/Button";
import Image from "next/image";

const BurnPolymorphSuccessPopup = ({ onClose, characters }) => {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="burn--polymorph--success--popup">
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="Close" />
      </button>
      <h2 className="title">Congratulations!</h2>
      <p className="desc">{`You have successfully burnt your old polymorph${
        characters.length > 1 ? "s" : ""
      } and minted ${characters.length > 1 ? "new ones" : "a new one"}.`}</p>
      <p className="info">Your NFTs may take up to 2 minutes to load</p>
      {characters.length > 1 ? (
        <div className="batch--polymorphs">
          <Slider {...settings}>
            {characters?.map((c, i) => {
              return (
                <div className="polymorph--img" key={i}>
                  <Image
                    width={440}
                    height={440}
                    src={characters[i].imageUrl}
                    alt="Polymorph"
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        <div className="single--polymorph">
          <div className="polymorph--img">
            <Image
              width={440}
              height={440}
              src={characters[0].imageUrl}
              alt="Polymorph"
            />
          </div>
        </div>
      )}
      <div className="actions">
        <Button
          className="light-button"
          onClick={() => {
            onClose();
            router.push("/burn-to-mint/burn");
          }}
        >
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
