import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/Section2HorizontalScroll.scss';
import charactersData from '../../../utils/fixtures/horizontalScrollCharactersData';

const child = (data) =>
  data.map((elem, index) => (
    <div className={`child--scroll child--scroll--${index + 1}`} key={index.toString()}>
      <img alt="img" src={elem.img} />
      <p>{elem.name}</p>
    </div>
  ));

const Section2HorizontalScroll = (props) => {
  const { width, height } = props;
  const [scrollWidth, setScrollWidth] = useState(width);
  useEffect(() => {
    setScrollWidth(width);
  }, [width]);
  return (
    <div className="section2--horizontal--scroll--parent">
      <h3>Possible base characters</h3>
      <p className="row2--unique--skins">10 unique skins</p>
      <div className="horizontal--scroll--parent">
        <div className="horizontal--scroll--child" style={{ height: `${scrollWidth}px` }}>
          {child(charactersData)}
        </div>
      </div>
    </div>
  );
};

Section2HorizontalScroll.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Section2HorizontalScroll;