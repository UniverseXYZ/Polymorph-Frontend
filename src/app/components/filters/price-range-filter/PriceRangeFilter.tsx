import {
  Box,
  FormLabel,
  Image,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';

import PriceRangeIcon from '../../../../assets/images/v2/marketplace/filter-price-range.svg';

import { CurrencySelect, Dropdown, DropdownFilterContainer } from '../../../components';
import { IPriceRangeFilterProps, IPriceRangeFilterValue } from './types';
// import { coins } from '../../../mocks';

export const usePriceRangeFilter = () => {
  // const form = useFormik<IPriceRangeFilterValue>({
  //   initialValues: {
  //     currency: coins[0],
  //     price: [0, 0],
  //   },
  //   onSubmit: () => {},
  // });

  // return { form };
};

export const PriceRangeFilter = (props: IPriceRangeFilterProps) => {
  const { value, onChange } = props;

  const [isMaxPriceFocused, setIsMaxPriceFocused] = useState<boolean>(false);
  const [minPriceVal, setMinPriceVal] = useState<string>('');
  const [maxPriceVal, setMaxPriceVal] = useState<string>('');

  const handleChangeCurrency = useCallback((newCurrency) => {
    onChange({...value, currency: newCurrency})
  }, [value, onChange]);

  const handleChangePrice = useCallback((newPrice: number[]) => {
    onChange({...value, price: newPrice})
  }, [value, onChange]);

  useEffect(() => {
    setMinPriceVal(`${value.price?.[0]}`);
    setMaxPriceVal(`${value.price?.[1]}`);
  }, [value.price]);

  return (
    <>
      <Box mb={'30px'}>
        <CurrencySelect
          value={value.currency}
          onChange={(currency) => handleChangeCurrency(currency)}
        />
      </Box>

      {/* <RangeSlider
          aria-label={['min', 'max']}
          name={'price'}
          value={value.price}
          onChange={(value) => handleChangePrice(value)}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider> */}

      <SimpleGrid columns={2} spacing={'24px'} mt={'24px'}>
        <Box position={'relative'}>
          <NumberInput
            value={minPriceVal}
            onChange={(val) => setMinPriceVal(val)}
            onBlur={() => {
              const val = +(minPriceVal || 0);
              setMinPriceVal(`${val}`);
              handleChangePrice([val, value.price[1]]);
            }}
          >
            <NumberInputField
              id={'minPriceVal'}
              placeholder={'0'}
              pt={'24px'}
              height={'64px'}
              fontWeight={500}
              fontSize={'16px'}
            />
          </NumberInput>
          <FormLabel
            htmlFor={'minPriceVal'}
            sx={{
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: '12px',
              fontWeight: 400,
              position: 'absolute',
              left: '16px',
              top: '12px',
            }}
          >Min price</FormLabel>
        </Box>
        <Box position={'relative'}>
          <NumberInput
            value={maxPriceVal}
            onChange={(val) => setMaxPriceVal(val)}
            onFocus={() => setIsMaxPriceFocused(true)}
            onBlur={() => {
              const val = +(maxPriceVal || 0);
              setMaxPriceVal(`${val}`);
              handleChangePrice([value.price[0], val]);
              setIsMaxPriceFocused(false);
            }}
          >
            <NumberInputField
              id={'maxPriceVal'}
              placeholder={'0'}
              pt={'24px'}
              height={'64px'}
              fontWeight={500}
              fontSize={'16px'}
            />
          </NumberInput>
          <FormLabel
            htmlFor={'maxPriceVal'}
            sx={{
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: '12px',
              fontWeight: 400,
              position: 'absolute',
              left: '16px',
              top: '12px',
            }}
          >Max price</FormLabel>
        </Box>
      </SimpleGrid>
    </>
  );
};

export interface IPriceRangeFilterDropdownProps {
  value: IPriceRangeFilterValue;
  isDirty: boolean;
  onSave: (value: IPriceRangeFilterValue) => void;
  onClear: () => void;
}

export const PriceRangeFilterDropdown = (props: IPriceRangeFilterDropdownProps) => {
  const {
    value: initialValue,
    isDirty,
    onSave,
    onClear,
  } = props;

  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState<IPriceRangeFilterValue>({} as IPriceRangeFilterValue);

  const handleSave = useCallback(() => {
    onSave(value);
    setIsOpened(false);
  }, [value, onSave]);

  const handleClear = useCallback(() => {
    setValue(initialValue);
    onClear();
  }, [initialValue, onClear]);

  const valueLabel = useMemo(() => {
    if (!isDirty) {
      return null;
    }
    const minPrice = initialValue.price[0];
    const maxPrice = initialValue.price[1];
    if (maxPrice && minPrice) {
      return `${minPrice}-${maxPrice} ${initialValue.currency.token}`;
    }
    if (maxPrice) {
      return `<${maxPrice} ${initialValue.currency.token}`
    }
    if (minPrice) {
      return `>${minPrice} ${initialValue.currency.token}`
    }
  }, [initialValue, isDirty]);

  useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <Dropdown
      label={'Price range'}
      value={valueLabel}
      buttonProps={{ leftIcon: <Image src={PriceRangeIcon} /> }}
      isOpened={isOpened}
      onOpen={() => setIsOpened(true)}
      onClose={() => {
        setValue(initialValue);
        setIsOpened(false);
      }}
    >
      <DropdownFilterContainer
        onSave={handleSave}
        onClear={handleClear}
      >
        <PriceRangeFilter value={value} onChange={(value) => setValue(value)} />
      </DropdownFilterContainer>
    </Dropdown>
  );
}
