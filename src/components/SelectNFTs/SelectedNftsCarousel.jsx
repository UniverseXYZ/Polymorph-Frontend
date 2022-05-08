import React, { useRef } from "react";

const ArrowNav = ({ direction, onClick }) => {
  return (
    <div className={`arrow--nav ${direction}`} onClick={onClick}>
      {direction === "left" ? <span>{"<"}</span> : <span>{">"}</span>}
    </div>
  );
};

const SelectedNftsCarousel = ({ nfts, selectedCards }) => {
  const overflowElementRef = useRef();

  const onClickFunc = (direction) => {
    if (typeof window !== "undefined") {
      direction === "right"
        ? (overflowElementRef.current.scrollLeft += 60)
        : (overflowElementRef.current.scrollLeft -= 60);
    }
  };

  return (
    <div className={"wrapper"}>
      {selectedCards.length ? (
        <ArrowNav direction={"left"} onClick={() => onClickFunc("left")} />
      ) : null}
      {selectedCards.length ? (
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
            {nfts.map((slice) => {
              return selectedCards.includes(slice.tokenid) ? (
                <span>
                  <img src={slice.imageurl} />
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedNftsCarousel;
