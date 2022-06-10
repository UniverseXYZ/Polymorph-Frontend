import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import sortArrowUp from '../../assets/images/rarity-charts/sortArrowUp.svg';
import sortArrowDown from '../../assets/images/rarity-charts/sortArrowDown.svg';
import AppContext from '../../ContextAPI';
// import './SortByOrder.scss';

const SortByOrder = ({ setSortDir, sortDir, setApiPage, resetPagination }) => {
  const handleChange = () => {
    let newDir = "";
    if (sortDir === "asc") {
      newDir = "desc";
    } else {
      newDir = "asc";
    }
    setSortDir(newDir);
    resetPagination();
    setApiPage(1);
  };
  return (
    <div className="sort--by--order" aria-hidden="true" onClick={handleChange}>
      <div className="sort--by--order--icon">
        <img
          src={sortDir === 'desc' ? sortArrowDown : sortArrowUp}
          alt={sortDir === 'desc' ? 'Arrow Down' : 'Arrow Up'}
        />
      </div>
      <div className="box--shadow--effect--block" />
    </div>
  );
};
SortByOrder.propTypes = {
  setSortDir: PropTypes.func.isRequired,
  sortDir: PropTypes.string.isRequired,
  setApiPage: PropTypes.func,
  resetPagination: PropTypes.func.isRequired,
};

SortByOrder.defaultProps = {
  setApiPage: () => {},
};
export default SortByOrder;
