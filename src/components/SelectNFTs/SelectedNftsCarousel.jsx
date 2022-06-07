import React, { useRef } from "react";
import {ReactComponent as CarouselArrow} from '../../assets/images/carousel-arrow.svg';

const ArrowNav = ({ direction, onClick }) => {
  return (
    <div className={`arrow--nav ${direction}`} onClick={onClick}>
      {direction === "left" ? <span style={{ transform: 'rotate(180deg)' }}><CarouselArrow /></span> : <span><CarouselArrow /></span>}
    </div>
  );
};

const SelectedNftsCarousel = ({ nfts, selectedCards, showArrows }) => {
  const overflowElementRef = useRef();

  const onClickFunc = (direction) => {
    if (typeof window !== "undefined") {
      direction === "right"
      ? (overflowElementRef.current.scrollLeft += 60)
        : (overflowElementRef.current.scrollLeft -= 60);
    }
  };

  return (
    <div className={"selected--nfts--wrapper"}>
      {selectedCards.length && showArrows ? (
        <ArrowNav direction={"left"} onClick={() => onClickFunc("left")} />
      ) : null}
      {selectedCards.length && showArrows ? (
        <ArrowNav direction={"right"} onClick={() => onClickFunc("right")} />
      ) : null}
      {!selectedCards.length ? (
        <span className={"no--selected--nfts"}></span>
      ) : null}

      {!!selectedCards.length && (
        <div
          className={"horizontal--scroller--container"}
          ref={overflowElementRef}
          onClick={onClickFunc}
        >
          <div className={"horizontal--scroller"}>
            {selectedCards.map((card) => {
              return (
                <span key={card.tokenId}>
                  <img src={card.imageUrl} alt={card.tokenId} />
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedNftsCarousel;
