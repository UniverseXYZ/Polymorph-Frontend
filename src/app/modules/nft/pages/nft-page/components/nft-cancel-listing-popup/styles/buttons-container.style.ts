import { BoxProps } from '@chakra-ui/react';

export const ButtonsContainerStyle: BoxProps = {
  display: 'flex',
  justifyContent: 'center',
  mt: '36px',

  sx: {
    button: {
      mr: '15px',

      _last: {
        mr: 0,
      }
    }
  }
}
