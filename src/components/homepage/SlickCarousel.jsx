import React, { Component, useEffect } from "react";
import Slider from "react-slick";

export default class AutoPlayMethods extends Component {

    state = {
      slideIndex: 0,
      updateCount: 0,
      barLoading: 0,
    };

    render() {

      const ArrowNav = () => {
        return null;
      }
    
      const fillCarouselIndicator = (index) => {

        // 1. Check if the selected bar is already in a loading state.
        // 2. If it is, do nothing.
        if (this.state.barLoading === index) {
          return;
        }

        // 3. If it is NOT, start increasing the SPAN's width to 100.
        if (typeof window !== 'undefined' && this.state.barLoading !== index) {
          document.getElementsByClassName("active--carousel--span")[index].style.width = "0%";

          let intervalID = 0;
          let i = 0;

          clearInterval(intervalID);
          this.setState({ barLoading: index })
          intervalID = setInterval(() => {
            try {
              i = i + 2;
              document.getElementsByClassName("active--carousel--span")[index].style.width = i + "%";
              if (i >= 100) {
                i = 0;
                clearInterval(intervalID);
                document.getElementsByClassName("active--carousel--span")[index].style.width = "0%";
                this.setState({ barLoading: false});
              }
            } catch {
              clearInterval(intervalID);
              this.setState({ barLoading: false});
            }
          }, 40);
        }
      }

      const handleLoadingBarClick = (slideIndex) => {
        if (this.state.slideIndex === slideIndex || this.state.barLoading == slideIndex) {
          return;
        }
        this.setState({ slideIndex }, () => {
          this.slider.slickGoTo(this.state.slideIndex); 
          fillCarouselIndicator(this.state.slideIndex)
        });
      }

      const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <ArrowNav />,
        prevArrow: <ArrowNav />,
        lazyLoad: true,
        pauseOnHover: false,
        pauseOnFocus: false,
        speed: 300,
        afterChange: (() =>
        this.setState(state => ({ updateCount: state.updateCount + 1 }))),
        beforeChange: ((current, next) => this.setState({ slideIndex: next }, () => {this.slider.slickGoTo(this.state.slideIndex); fillCarouselIndicator(this.state.slideIndex)}))
      };
      
      return (
        <div className='slider--container'>
          <Slider ref={slider => (this.slider = slider)} {...settings}>
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
          
          <div className="carousel-indicators">
              <button type="button" 
                data-bs-target="#carouselExampleIndicators" 
                data-bs-slide-to="0" 
                aria-label="Slide 1"
                className={this.state.slideIndex === 0 ? "active--carousel--bar" : null} 
                aria-current="true" 
                // onClick={this.state.barLoading === 0 ? null : () => handleLoadingBarClick(0)}
              >
                <span className={"active--carousel--span"}></span>
              </button>

                <button type="button" 
                  data-bs-target="#carouselExampleIndicators" 
                  data-bs-slide-to="1" 
                  aria-label="Slide 2"
                  className={this.state.slideIndex === 1 ? "active--carousel--bar" : null} 
                  // onClick={this.state.barLoading === 1 ? null : () => handleLoadingBarClick(1)}
                >                  
                  <span className={"active--carousel--span"}></span>
                </button>

                <button type="button" 
                  data-bs-target="#carouselExampleIndicators" 
                  data-bs-slide-to="2" 
                  aria-label="Slide 3"
                  className={this.state.slideIndex === 2 ? "active--carousel--bar" : null} 
                  // onClick={this.state.barLoading === 2 ? null : () => handleLoadingBarClick(2)}
                >
                  <span className={"active--carousel--span"}></span>
                </button>

                <button type="button" 
                  data-bs-target="#carouselExampleIndicators" 
                  data-bs-slide-to="3" 
                  aria-label="Slide 4"
                  className={this.state.slideIndex === 3 ? "active--carousel--bar" : null} 
                  // onClick={this.state.barLoading === 3 ? null : () => handleLoadingBarClick(3)}
                >                     
                  <span className={"active--carousel--span"}></span>
                </button>
          </div> 
        </div>
        
      );
    }
  }