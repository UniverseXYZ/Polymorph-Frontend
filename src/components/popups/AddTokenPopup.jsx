import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button.jsx';
import Input from '../input/Input.jsx';
import AppContext from '../../ContextAPI';
import backArrow from '../../assets/images/arrow.svg';

const AddTokenPopup = ({ setShowAddTokenPopup }) => {
  const { setOptions } = useContext(AppContext);
  const [token, setToken] = useState({
    value: '',
    name: '',
    img: null,
    subtitle: '',
    address: '',
  });
  const [isValid, setIsValid] = useState({
    name: false,
    address: false,
    subtitle: false,
  });

  useEffect(() => {
    setIsValid((prevValues) => ({
      ...prevValues,
      subtitle: token.subtitle.trim().length !== 0,
      address: token.address.trim().length !== 0,
      name: token.name.trim().length !== 0,
    }));
  }, [token]);

  const handleTokenChange = (event) => {
    setToken((prevValues) => ({ ...prevValues, [event.target.id]: event.target.value }));
    setToken((prevValues) => ({ ...prevValues, value: token.name }));
  };
  const handleAddToken = () => {
    if (token.name && token.address && token.subtitle) {
      setOptions((prevValues) => [...prevValues, token]);
    }
  };

  return (
    <div className="add__token">
      <div className="back-rew" onClick={() => setShowAddTokenPopup(false)} aria-hidden="true">
        <img src={backArrow} alt="back" />
        <span>Select bid token (ERC-20)</span>
      </div>
      <h3>Add token</h3>
      <Input
        id="address"
        className="inp"
        placeholder="0x0000"
        label="Token Contract Address"
        value={token.address}
        onChange={handleTokenChange}
      />
      <Input
        id="name"
        className="inp"
        placeholder="Name"
        label="Token Symbol"
        value={token.name}
        onChange={handleTokenChange}
      />
      <Input
        id="subtitle"
        className="inp"
        label="Decimal and Precision"
        value={token.subtitle}
        onChange={handleTokenChange}
      />
      {isValid.address && isValid.name && isValid.subtitle ? (
        <Button className="light-button" onClick={handleAddToken}>
          Add custom token
        </Button>
      ) : (
        <Button className="light-button" disabled onClick={handleAddToken}>
          Add custom token
        </Button>
      )}
    </div>
  );
};

AddTokenPopup.propTypes = {
  setShowAddTokenPopup: PropTypes.func,
};

AddTokenPopup.defaultProps = {
  setShowAddTokenPopup: () => {},
};

export default AddTokenPopup;
