import React, { useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import searchIcon from "../../assets/images/search-gray.svg";
import closeIcon from "../../assets/images/close-menu.svg";
import AppContext from "../../ContextAPI";
// import './SearchField.scss';

const SearchField = (props) => {
  const {
    searchText,
    setSearchText,
    setApiPage,
    resetPagination,
    ...resProps
  } = props;
  const [focusField, setFocusField] = useState("");
  const searchRef = useRef();

  const handleInputChange = (e) => {
    if (e.target.value.length < 50) {
      setSearchText(e.target.value);
      setApiPage(1);
      resetPagination();
    }
  };

  return (
    <div className={`search--field--component ${focusField}`}>
      <img className="search" src={searchIcon} alt="Search" />
      <input
        type="text"
        className="inp"
        ref={searchRef}
        onChange={handleInputChange}
        value={searchText}
        onFocus={() => setFocusField("focus--field")}
        onBlur={() => setFocusField("")}
        {...resProps}
      />
      <div className="focus--field--box--shadow" />
      {searchText.length > 0 && (
        <>
          <img
            className="close"
            src={closeIcon}
            alt="Close"
            onClick={() => setSearchText("")}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};

SearchField.propTypes = {
  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
  setApiPage: PropTypes.func,
  resetPagination: PropTypes.func.isRequired,
};

SearchField.defaultProps = {
  searchText: "",
  setSearchText: () => {},
  setApiPage: () => {},
};

export default SearchField;
