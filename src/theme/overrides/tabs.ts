export const Tabs = {
  variants: {
    line: {
      tablist: {
        borderBottom: {
          base: 0,
          lg: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
      tab: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontWeight: 500,
        mb: 0,
        px: 0,
        mx: '20px',

        _first: {
          ml: 0,
        },
        _last: {
          mr: 0,
        },

        _selected: {
          color: 'black',
        },
        _hover: {
          color: 'black',
        },
        _focus: {
          boxShadow: 'none',
        },
        _active: {
          bg: 'transition',
        },
      },
    },
    arrow: {
      tablist: {
        border: 0,
      },
      tab: {
        '--tab-height': {
          base: '70px',
          lg: '50px'
        },
        background: 'rgba(0, 0, 0, 0.03)',
        border: 0,
        fontFamily: '"Sharp Grotesk SemiBold", sans-serif',
        fontSize: '12px',
        flexDir: {
          base: 'column',
          lg: 'row',
        },
        padding: {
          base: '8px 16px',
          lg: '16px'
        },
        position: 'relative',
        margin: '0 -3px',
        clipPath: {
          lg: 'polygon(97% 0, 100% 50%, 97% 100%, 0% 100%, 3% 50%, 0% 0%)',
          md: 'polygon(95% 0, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)',
          sm: 'polygon(93% 0, 100% 50%, 93% 100%, 0% 100%, 7% 50%, 0% 0%)',
        },
        
        img: {
          h: '17px',
          m: {
            base: '0 0 1px 0',
            lg: '0 10px 0 0'
          },
        },
        _hover: {
          background: 'rgba(0, 0, 0, 0.1)',
          _after: {
            borderLeftColor: 'rgba(0, 0, 0, 0.1)',
          }
        },
        _focus: {
          boxShadow: 'none',
        },
        _selected: {
          background: 'black',
          color: 'white',
          _after: {
            borderLeft: '10px solid black',
          },
        },
        _disabled: {
          background: 'rgba(0, 0, 0, 0.03)',
          color: 'rgba(0, 0, 0, 0.2)',
          cursor: 'not-allowed',
          img: {
            opacity: 0.2,
          },
          _after: {
            borderLeft: '10px solid rgba(0, 0, 0, 0.03)',
          }
        },
      }
    }
  }
};
