import React, { Component, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Face1 from "../../assets/images/carousel-images/poly-face-1.png";
import Face2 from "../../assets/images/carousel-images/poly-face-2.png";
import Face3 from "../../assets/images/carousel-images/poly-face-3.png";
import Face4 from "../../assets/images/carousel-images/poly-face-4.png";
import Face5 from "../../assets/images/carousel-images/poly-face-5.png";
import Face6 from "../../assets/images/carousel-images/poly-face-6.png";

export default class AutoPlayMethods extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 5000,
      slidesToShow: 6,
      slidesToScroll: 1,
      swipe: false,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <div className="slider--container">
        <div className="shadow--left" />
        <Slider ref={(slider) => (this.slider = slider)} {...settings}>
          <div className={``}>
            <Image src={Face1} width={256} height={256} />
          </div>

          <div className={``}>
            {" "}
            <Image src={Face2} width={256} height={256} />
          </div>

          <div className={``}>
            {" "}
            <Image src={Face3} width={256} height={256} />
          </div>

          <div className={``}>
            {" "}
            <Image src={Face4} width={256} height={256} />
          </div>

          <div className={``}>
            {" "}
            <Image src={Face5} width={256} height={256} />
          </div>

          <div className={``}>
            {" "}
            <Image src={Face6} width={256} height={256} />
          </div>
        </Slider>
        <div className="shadow--right" />
      </div>
    );
  }
}
