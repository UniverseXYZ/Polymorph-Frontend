import React from "react";
import Slider from "react-slick";
import loadingBg from "../../assets/images/mint-polymorph-loading-bg.png";
import nftLoadingBg from "../../assets/images/nft-loading-bg.png";
import loadingFacesBg from "../../assets/images/faces-loading-bg.png";
import LoadingSpinner from "../../components/svgs/LoadingSpinner";

export const renderLoaders = (number, type = "polymorph") => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="loading">
      {number > 1 ? (
        <Slider {...settings}>
          {[...Array(number)].map((n) => (
            <div className="polymorph--img" key={n}>
              <img src={loadingBg} alt="Polymorph" />
            </div>
          ))}
        </Slider>
      ) : (
        <>
          {type === "faces" ? (
            <img src={loadingFacesBg} alt="polymorphic face" />
          ) : (
            <img src={loadingBg} alt="polymorph" />
          )}
        </>
      )}
      <div className="lds-roller">
        <LoadingSpinner />
      </div>
    </div>
  );
};
