import React, { Component, useEffect } from "react";
import Slider from "react-slick";
import CharlesVideo from "../../assets/images/carousel-images/charles-video.mp4";
import GoldtoothVideo from "../../assets/images/carousel-images/goldtooth-video.mp4";
import AlienVideo from "../../assets/images/carousel-images/alien-video.mp4";
import SkeletonVideo from "../../assets/images/carousel-images/skeleton-video.mp4";

export default class AutoPlayMethods extends Component {
  state = {
    slideIndex: 0,
    barLoading: 0,
    isMobile: false,
  };

  updateIsMobile = () => {
    if (typeof window !== "undefined") {
      this.setState({
        isMobile: window.innerWidth < 768 ? true : false,
      });
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateIsMobile);
    this.updateIsMobile();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateIsMobile);
  }

  render() {
    const ArrowNav = () => {
      return null;
    };

    const fillCarouselIndicator = (index) => {
      // 1. Check if the selected bar is already in a loading state.
      // 2. If it is, do nothing.
      if (this.state.barLoading === index) {
        return;
      }

      // 3. If it is NOT, start increasing the SPAN's width to 100.
      if (typeof window !== "undefined" && this.state.barLoading !== index) {
        document.getElementsByClassName("active--carousel--span")[
          index
        ].style.width = "0%";

        let intervalID = 0;
        let i = 0;

        clearInterval(intervalID);
        this.setState({ barLoading: index });
        intervalID = setInterval(() => {
          try {
            i = i + 1;
            document.getElementsByClassName("active--carousel--span")[
              index
            ].style.width = i + "%";
            if (i >= 100) {
              i = 0;
              clearInterval(intervalID);
              document.getElementsByClassName("active--carousel--span")[
                index
              ].style.width = "0%";
              this.setState({ barLoading: false });
            }
          } catch {
            clearInterval(intervalID);
            this.setState({ barLoading: false });
          }
        }, 37);
      }
    };

    // const handleLoadingBarClick = (slideIndex) => {
    //   if (
    //     this.state.slideIndex === slideIndex ||
    //     this.state.barLoading == slideIndex
    //   ) {
    //     return;
    //   }
    //   this.setState({ slideIndex }, () => {
    //     this.slider.slickGoTo(this.state.slideIndex);
    //     fillCarouselIndicator(this.state.slideIndex);
    //   });
    // };

    const playNextVideo = () => {
      if (typeof window !== "undefined") {
        let video;
        let nextVideo;

        switch (this.state.slideIndex) {
          case 0:
            video = document.getElementById("charles--video");
            video.currentTime = 0;
            nextVideo = document.getElementById("skeleton--video");
            nextVideo.currentTime = 0;
            nextVideo.play();
            break;
          case 1:
            video = document.getElementById("skeleton--video");
            video.currentTime = 0;
            nextVideo = document.getElementById("goldtooth--video");
            nextVideo.currentTime = 0;
            nextVideo.play();
            break;
          case 2:
            video = document.getElementById("goldtooth--video");
            video.currentTime = 0;
            nextVideo = document.getElementById("alien--video");
            nextVideo.currentTime = 0;
            nextVideo.play();
            break;
          case 3:
            video = document.getElementById("alien--video");
            video.currentTime = 0;
            nextVideo = document.getElementById("charles--video");
            nextVideo.currentTime = 0;
            nextVideo.play();
            break;
          default:
            break;
        }
      }
    };

    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3700,
      nextArrow: <ArrowNav />,
      prevArrow: <ArrowNav />,
      pauseOnHover: false,
      pauseOnFocus: false,
      speed: 700,
      fade: true,
      // afterChange: () => {},
      beforeChange: (current, next) =>
        this.setState({ slideIndex: next }, () => {
          fillCarouselIndicator(this.state.slideIndex);
          this.state.isMobile ? null : playNextVideo();
        }),
    };

    return (
      <div className="slider--container">
        <Slider ref={(slider) => (this.slider = slider)} {...settings}>
          <div
            className={`background--image ${
              this.state.isMobile && "background--image--charles"
            }`}
          >
            {!this.state.isMobile && (
              <video
                id="charles--video"
                autoPlay={this.state.slideIndex === 0 ? true : false}
                muted
              >
                <source src={CharlesVideo} type="video/mp4" />
              </video>
            )}
          </div>

          <div
            className={`background--image ${
              this.state.isMobile && "background--image--skeleton"
            }`}
          >
            {!this.state.isMobile && (
              <video
                id="skeleton--video"
                autoPlay={this.state.slideIndex === 1 ? true : false}
                muted
              >
                <source src={SkeletonVideo} type="video/mp4" />
              </video>
            )}
          </div>

          <div
            className={`background--image ${
              this.state.isMobile && "background--image--goldtooth"
            }`}
          >
            {!this.state.isMobile && (
              <video
                id="goldtooth--video"
                autoPlay={this.state.slideIndex === 2 ? true : false}
                muted
              >
                <source src={GoldtoothVideo} type="video/mp4" />
              </video>
            )}
          </div>

          <div
            className={`background--image ${
              this.state.isMobile && "background--image--alien"
            }`}
          >
            {!this.state.isMobile && (
              <video
                id="alien--video"
                autoPlay={this.state.slideIndex === 3 ? true : false}
                muted
              >
                <source src={AlienVideo} type="video/mp4" />
              </video>
            )}
          </div>
        </Slider>

        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            aria-label="Slide 1"
            className={
              this.state.slideIndex === 0 ? "active--carousel--bar" : null
            }
            aria-current="true"
            // onClick={this.state.barLoading === 0 ? null : () => handleLoadingBarClick(0)}
          >
            <span className={"active--carousel--span"}></span>
          </button>

          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
            className={
              this.state.slideIndex === 1 ? "active--carousel--bar" : null
            }
            // onClick={this.state.barLoading === 1 ? null : () => handleLoadingBarClick(1)}
          >
            <span className={"active--carousel--span"}></span>
          </button>

          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
            className={
              this.state.slideIndex === 2 ? "active--carousel--bar" : null
            }
            // onClick={this.state.barLoading === 2 ? null : () => handleLoadingBarClick(2)}
          >
            <span className={"active--carousel--span"}></span>
          </button>

          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
            className={
              this.state.slideIndex === 3 ? "active--carousel--bar" : null
            }
            // onClick={this.state.barLoading === 3 ? null : () => handleLoadingBarClick(3)}
          >
            <span className={"active--carousel--span"}></span>
          </button>
        </div>
      </div>
    );
  }
}
