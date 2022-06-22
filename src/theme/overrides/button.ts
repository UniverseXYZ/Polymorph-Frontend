export const Button = {
  baseStyle: {
    fontFamily: 'Space Grotesk',
    fontSize: '16px',
  },
  variants: {
    solid: {
      background: 'linear-gradient(170deg, #bceb00 15.57%, #00eaea 84.88%)',
      borderRadius: '12px',
      color: 'black',
      padding: '11px 26px',
      _hover: {
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(170deg, #bceb00 15.57%, #00eaea 84.88%) !important',
      },
      _focus: {
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(170deg, #bceb00 15.57%, #00eaea 84.88%) !important',
        boxShadow: 'none',
      },
      _active: {
        background: 'linear-gradient(170deg, #bceb00 15.57%, #00eaea 84.88%) !important',
        transform: 'scale(0.95)',
      },
      _disabled: {
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(0, 0, 0, 0.4)',

        _hover: {
          background: 'rgba(0, 0, 0, 0.1) !important',
          color: 'rgba(0, 0, 0, 0.4) !important',
          cursor: 'not-allowed'
        }
      },
    },
    outline: {
      backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
      backgroundOrigin: 'border-box !important',
      borderColor: 'transparent',
      borderRadius: '12px',
      boxShadow: 'inset 2px 1000px 1px #fff',
      padding: '11px 26px',
      _hover: {
        backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
        backgroundOrigin: 'border-box',
        borderColor: 'transparent',
        boxShadow: 'inset 2px 1000px 1px hsla(0,0%,100%,.9)',
      },
      _focus: {
        backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
        backgroundOrigin: 'border-box',
        borderColor: 'transparent',
        boxShadow: 'inset 2px 1000px 1px hsla(0,0%,100%,.9)',
      },
      _active: {
        backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
        borderColor: 'transparent',
        boxShadow: 'inset 2px 1000px 1px hsla(0,0%,100%,.9)',
        transform: 'scale(0.95)',
      }
    },
    dropdown: {
      bg: 'white',
      borderRadius: '12px',
      padding: '11px 26px',
      position: 'relative',
      _before: {
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 'inherit',
        position: 'absolute',
        content: '" "',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: -1,
      },
      _hover: {
        _before: {
          backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
          backgroundOrigin: 'border-box',
          borderColor: 'transparent',
          boxShadow: 'inset 2px 1000px 1px white',
        },
      },
      _focus: {
        boxShadow: 'none',
        _before: {
          backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
          backgroundOrigin: 'border-box',
          borderColor: 'transparent',
          boxShadow: 'inset 2px 1000px 1px white',
        },
      },
      _active: {
        boxShadow: 'none',
        _before: {
          backgroundImage: 'linear-gradient(175deg,#bceb00,#00eaea)',
          backgroundOrigin: 'border-box',
          borderWidth: '2px',
          borderColor: 'transparent',
          boxShadow: 'inset 2px 1000px 1px white',
        },
      }
    },
    simpleOutline: {
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '10px 12px',
      '.chakra-button__icon': {
        _first: {
          mr: '6px',
        },
      },
      _focus: {
        boxShadow: 'none',
      },
    },
    black: {
      background: 'black',
      borderRadius: '12px',
      color: 'white',
      padding: '11px 26px',
      lineHeight: '21px',
      _hover: {
        background: '#242424',
      },
      _focus: {
        background: '#242424',
        boxShadow: 'none',
      },
      _active: {
        transform: 'scale(0.95)',
      },
      _disabled: {
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(0, 0, 0, 0.4)',

        _hover: {
          background: 'rgba(0, 0, 0, 0.1) !important',
          color: 'rgba(0, 0, 0, 0.4) !important',
        }
      },
    },
  },
  sizes: {
    lg: {
      height: '50px',
    }
  },
};
