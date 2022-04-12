import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import EthereumAddress from 'ethereum-address';
import Button from '../button/Button.jsx';
import Input from '../input/Input.jsx';
import AppContext from '../../ContextAPI';
import backArrow from '../../assets/images/arrow.svg';

const AddTokenPopup = ({ setShowAddTokenPopup }) => {
  const [token, setToken] = useState({
    value: '',
    name: '',
    img: null,
    subtitle: '18',
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
      address: token.address.trim().length !== 0 && EthereumAddress.isAddress(token.address),
      name: token.name.trim().length !== 0,
    }));
  }, [token]);

  const handleAddressChange = (event) => {
    setToken((prevValues) => ({ ...prevValues, address: event.target.value }));
  };

  const handleSymbolChange = (event) => {
    if (/^[a-zA-Z]+$/.test(event.target.value)) {
      setToken((prevValues) => ({ ...prevValues, name: event.target.value }));
      setToken((prevValues) => ({ ...prevValues, value: event.target.value }));
    }
  };

  const handleDecimalChange = (event) => {
    if (/^\d+$/.test(event.target.value)) {
      setToken((prevValues) => ({ ...prevValues, subtitle: event.target.value }));
    }
  };

  const handleAddToken = () => {
    if (token.name && EthereumAddress.isAddress(token.address) && token.subtitle) {
      // setOptions((prevValues) => [...prevValues, token]);
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
        onChange={handleAddressChange}
      />
      <Input
        id="name"
        className="inp"
        placeholder="Name"
        label="Token Symbol"
        value={token.name}
        onChange={handleSymbolChange}
      />
      <Input
        id="subtitle"
        className="inp"
        label="Decimal and Precision"
        value={token.subtitle}
        onChange={handleDecimalChange}
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
