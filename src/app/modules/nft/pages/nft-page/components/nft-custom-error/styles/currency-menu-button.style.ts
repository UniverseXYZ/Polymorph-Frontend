import { MenuButtonProps } from '@chakra-ui/react';

export const CurrencyMenuButtonStyle: MenuButtonProps = {
  background: 'rgba(0, 0, 0, 0.02)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '6px',
  height: '34px',
  ml: '8px',
  padding: '0 10px',

  sx: {
    '> span': {
      display: 'contents',
    },
    img: {
      _first: {
        mr: '10px',
        h: '20px',
        w: '20px',
      },
      _last: {
        ml: '10px',
        transition: '200ms',
      },
    },
  },

  _hover: {
    background: 'rgba(0, 0, 0, 0.03)',
    boxShadow: 'sm',
  },

  _focus: {
    background: 'rgba(0, 0, 0, 0.03)',
    boxShadow: 'sm',
  },

  _active: {
    boxShadow: 0,
    img: {
      _last: {
        transform: 'rotate(180deg)',
      }
    }
  },
}
