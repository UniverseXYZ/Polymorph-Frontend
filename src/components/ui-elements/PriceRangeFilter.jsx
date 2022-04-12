import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import InputRange from 'react-input-range';
import SortingFilter from '../input/SortingFilter';
import salesIcon from '../../assets/images/marketplace/sale-type.svg';
import arrowDown from '../../assets/images/browse-nft-arrow-down.svg';
import ethereumIcon from '../../assets/images/eth-icon.svg';
import daiIcon from '../../assets/images/dai_icon.svg';
import usdcIcon from '../../assets/images/usdc_icon.svg';
import bondIcon from '../../assets/images/bond_icon.svg';
import snxIcon from '../../assets/images/snx.svg';
import priceIcon from '../../assets/images/marketplace/price-range.svg';
import AppContext from '../../ContextAPI';
import './styles/PriceRangeFilter.scss';
// import { useAuctionContext } from '../../contexts/AuctionContext';

const bidTokens = [
  {
    icon: ethereumIcon,
    title: 'ETH',
    subtitle: 'Ether',
  },
  {
    icon: daiIcon,
    title: 'DAI',
    subtitle: 'DAI Stablecoin',
  },
  {
    icon: usdcIcon,
    title: 'USDC',
    subtitle: 'USD Coin',
  },
  {
    icon: bondIcon,
    title: 'BOND',
    subtitle: 'BarnBridge Gov. Token',
  },
  {
    icon: snxIcon,
    title: 'SNX',
    subtitle: 'Synthetix Network Token',
  },
];

const validateMinValue = (e, sliderValue, setSliderValue, setDisabledMin) => {
  if (Number(e.target.value) >= 0 && +e.target.value <= sliderValue.max) {
    setSliderValue({ ...sliderValue, min: Number(e.target.value) });
    setDisabledMin(true);
  }
};

const validateMaxValue = (e, sliderValue, setSliderValue, setDisabledMax) => {
  if (Number(e.target.value) >= 0) {
    setSliderValue({ ...sliderValue, max: Number(e.target.value) });
    setDisabledMax(true);
  }
};

const PriceRangeFilter = (props) => {
  const { getPrice, remove, onClear } = props;
  const [showPriceItems, setShowPriceItems] = useState(false);
  // const { selectedTokenIndex, setSelectedTokenIndex } = useAuctionContext();
  const [sliderValue, setSliderValue] = useState({ min: 0, max: 4 });
  const [disabledMin, setDisabledMin] = useState(false);
  const [disabledMax, setDisabledMax] = useState(false);
  const handleClearPrice = () => {
    setSliderValue({ min: 0, max: 4 });
    setDisabledMin(false);
    setDisabledMax(false);
    // setShowPriceDropdown(false);
  };

  useEffect(() => {
    if (remove || onClear) {
      setSelectedTokenIndex(0);
      setSliderValue({ min: 0, max: 4 });
      getPrice(null);
    }
  }, [remove, onClear]);

  return (
    <SortingFilter
      className="price--range--filter"
      title="Price range"
      //   countFilter={saleTypeButtons.filter((elem) => elem.selected).length}
      icon={priceIcon}
    >
      <div
        className="price__dropdown"
        aria-hidden="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="price__dropdown__body">
          <div
            className={`price--dropdown ${showPriceItems ? 'open' : ''}`}
            aria-hidden="true"
            onClick={() => setShowPriceItems(!showPriceItems)}
          >
            <div>
              {/* <img src={bidTokens[selectedTokenIndex].icon} alt="img" /> */}
            </div>
            <div>
              <h6>
                {/* {bidTokens[selectedTokenIndex].title} */}
                {/* <p>({bidTokens[selectedTokenIndex].subtitle})</p> */}
              </h6>
            </div>
            <div>
              <img src={arrowDown} alt="Arrow Down" className={showPriceItems ? 'rotate' : ''} />
            </div>
            {showPriceItems ? (
              <div className="price--dropdown--items">
                {bidTokens.map((token, index) => (
                  <div
                    className="price--dropdown--item"
                    key={uuid()}
                    aria-hidden="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      // setSelectedTokenIndex(index);
                    }}
                    // style={{ display: selectedTokenIndex === index ? 'none' : 'flex' }}
                  >
                    <div>
                      <img src={token.icon} alt={token.title} />
                    </div>
                    <div>
                      <h6>
                        {token.title}
                        <p>({token.subtitle})</p>
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="range--slider">
            <InputRange
              step={0.1}
              maxValue={4}
              minValue={0}
              value={sliderValue}
              onChange={(value) =>
                setSliderValue({
                  min: Number(value.min.toFixed(1)),
                  max: Number(value.max.toFixed(1)),
                })
              }
            />
          </div>
          <div className="min--max--fields">
            <div className="value--div">
              <p className="value--text">Min price</p>
              <input
                type="number"
                min="0"
                max="4"
                onChange={(e) => validateMinValue(e, sliderValue, setSliderValue, setDisabledMin)}
                value={disabledMin && sliderValue.min}
              />
            </div>
            <div className="value--div">
              <p className="value--text">Max price</p>
              <input
                type="number"
                min={sliderValue.min}
                max="4"
                onChange={(e) => validateMaxValue(e, sliderValue, setSliderValue, setDisabledMax)}
                // onChange={validateMaxValue}
                value={disabledMax && sliderValue.max}
              />
            </div>
          </div>
        </div>
        <div className="price--dropdown--footer">
          <button type="button" className="clear--all" onClick={() => handleClearPrice()}>
            Clear
          </button>
          <button
            type="button"
            className="light-button"
            // onClick={() => getPrice({ ...bidTokens[selectedTokenIndex], ...sliderValue })}
          >
            Save
          </button>
        </div>
      </div>
    </SortingFilter>
  );
};

PriceRangeFilter.propTypes = {
  getPrice: PropTypes.func,
  remove: PropTypes.bool,
  onClear: PropTypes.bool,
};

PriceRangeFilter.defaultProps = {
  getPrice: () => {},
  remove: false,
  onClear: false,
};

export default PriceRangeFilter;
