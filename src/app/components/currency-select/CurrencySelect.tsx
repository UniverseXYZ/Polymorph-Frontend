import { Box, BoxProps, Flex, FlexProps, Image, ImageProps } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { Select } from '../select';
// import { coins } from '../../mocks';

type ICurrencyValue = any | null;

interface IStyles {
  coinContainer: FlexProps;
  coinIcon: ImageProps;
  coinName: BoxProps;
}

const styles: IStyles = {
  coinContainer: {
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 500,
  },
  coinIcon: {
    h: '20px',
    mr: '12px',
    w: '20px',
  },
  coinName: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '12px',
    fontWeight: 400,
    ml: '6px',
  },
};

const CurrencySelectItem = (item: ICurrencyValue) => (
  <Flex {...styles.coinContainer}>
    <Image src={item.icon} {...styles.coinIcon} />
    {item.token}
    <Box as={'span'} {...styles.coinName}>({item.name})</Box>
  </Flex>
);

interface ICurrencySelectProps {
  value: ICurrencyValue;
  onChange?: (value: ICurrencyValue) => void;
}

export const CurrencySelect = ({ value, onChange }: ICurrencySelectProps) => {
  const handleChange = useCallback((newValue) => {
    onChange && onChange(newValue);
  }, [onChange]);

  return (
    <Select
      label={''}
      // items={coins}
      value={value}
      popoverProps={{
        matchWidth: true,
      }}
      popoverContentProps={{
        width: '100%',
      }}
      containerProps={{
        maxHeight: '110px',
        overflowY: 'scroll',
        width: 'auto',
      }}
      renderItem={(item) => (<CurrencySelectItem {...item} />)}
      renderSelectedItem={(value) => !value ? null : (<CurrencySelectItem {...value} />)}
      buttonProps={{
        mr: '12px',
        minWidth: '225px',
        justifyContent: 'space-between',
        isFullWidth: true,
      }}
      onSelect={handleChange}
    />
  );
};
