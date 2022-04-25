import React, { Component } from "react";
import Slider from "react-slick";
import CharlesImage from '../../assets/images/carousel-images/Charles-slide.png'
import AlienImage from '../../assets/images/carousel-images/Alien-slide.png'
import SkeletonImage from '../../assets/images/carousel-images/Skeleton-slide.png'
import GoldtoothImage from '../../assets/images/carousel-images/Goldtooth-slide.png'


function SampleArrow() {
  return (
    null
  );
}


export default class AutoPlayMethods extends Component {
    // constructor(props) {
    //   super(props);
    //   this.play = this.play.bind(this);
    //   this.pause = this.pause.bind(this);
    // }
    // play() {
    //   this.slider.slickPlay();
    // }
    // pause() {
    //   this.slider.slickPause();
    // }
    render() {
      const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />
      };

      console.log('slick rendered')
      
      return (
          <Slider {...settings}>
            <div className='background--image background--image--charles'>
              {'.'}
            </div>
            <div className='background--image background--image--alien'>
              {'.'}
            </div>
            <div className='background--image background--image--skeleton'>
              {'.'}
            </div>
            <div className='background--image background--image--goldtooth'>
              {'.'}
            </div>
          </Slider>
      );
    }
  }