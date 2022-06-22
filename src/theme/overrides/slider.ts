import { orient } from '@chakra-ui/theme-tools';
import { SliderProps } from '@chakra-ui/react';

export const Slider = {
  baseStyle: {
    track: {
      bg: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '100px',
    },
    filledTrack: {
      bg: '#000',
    },
    thumb: {
      boxShadow: '0px 1px 3px rgba(76, 76, 76, 0.3) !important',
    },
  },
  sizes: {
    lg: (props: SliderProps) => {
      return {
        thumb: { w: '25px', h: '25px' },
        track: orient({
          orientation: props.orientation,
          horizontal: { h: '6px' },
          vertical: { w: '6px' },
        }),
      }
    }
  },
  defaultProps: {
    size: 'lg',
  },
};
