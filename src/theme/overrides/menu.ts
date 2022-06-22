import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import { PartsStyleFunction } from '@chakra-ui/theme-tools';

const baseStyle: PartsStyleFunction<typeof parts> = () => ({
  list: {
    borderRadius: '12px',
    boxShadow: '0px 10px 36px rgba(136, 120, 172, 0.14)',
    padding: '8px',
  },
  item: {
    borderRadius: '6px',
    color: 'black',
    fontSize: '16px',
    fontWeight: 500,
    padding: '15px',
    _hover: {
      bg: 'rgba(0, 0, 0, 0.05)',
    },
    _focus: {
      bg: 'transparent',
    },
  },
});

export const Menu = {
  baseStyle,
};
