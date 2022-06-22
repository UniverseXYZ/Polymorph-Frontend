import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';

import { breakpoints, global } from './constants';
import * as components from './overrides';
import * as layerStyles from './layer-styles';

const theme = extendTheme({
  breakpoints,
  styles: { global },
  fontSizes: {
    '4xl': '32px',
  },
  components: {
    ...components,
  },
  layerStyles: {
    ...layerStyles,
  },
});

interface IThemeProps {
  children: React.ReactNode;
}

export const Theme = (props: IThemeProps) => <ChakraProvider theme={theme} {...props} />;
