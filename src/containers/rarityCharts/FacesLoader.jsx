import React from "react";
import PropTypes from "prop-types";
// import './RarityCharsLoader.scss';
// import './RarityCharts.scss';
// import uuid from 'react-uuid';
import loadingBg from "../../assets/images/faces-loading-bg.png";

const RarityChartsLoader = React.memo(({ number }) =>
  [...Array(number).keys()].map((n) => (
    <div key={n} className="card faces--card" style={{ cursor: "default" }}>
      {/* <div className="card--header">
        <div className="card--number">#???</div>
        <div className="card--price">Rarity Score: ???</div>
      </div> */}
      <div className="card--body faces--card--body">
        <img
          className="rarity--chart"
          style={{ cursor: "default" }}
          src={loadingBg}
          alt="loader"
        />
        <div className="card-lds-roller">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      <div className="card--footer">
        <h2>?????</h2>
        <p>#?????</p>
      </div>
    </div>
  ))
);

RarityChartsLoader.propTypes = {
  number: PropTypes.number.isRequired,
};

export default RarityChartsLoader;
