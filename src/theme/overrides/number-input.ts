export const NumberInput = {
  baseStyle: {
    field: {
      transition: 'none',
    }
  },
  variants: {
    outline: {
      field: {
        bg: 'white',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        color: 'black',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        position: 'relative',
        _hover: {
          bg: `
            linear-gradient(#ffffff, #ffffff) padding-box, 
            linear-gradient(135deg, #bceb00 15.57%, #00eaea 84.88%) border-box
          `,
          borderColor: 'transparent !important',
          boxShadow: 'none',
        },
        _focus: {
          bg: `
            linear-gradient(#ffffff, #ffffff) padding-box,
            linear-gradient(135deg, #bceb00 15.57%, #00eaea 84.88%) border-box
          `,
          borderColor: 'transparent',
          boxShadow: '0px 0px 0px 5px rgba(102, 234, 90, 0.15)',
        },
        _invalid: {
          borderColor: 'rgba(255, 73, 73, 1)',
          boxShadow: 'none',
        },
      }
    }
  },
  sizes: {
    md: {
      field: {
        height: '50px',
      }
    }
  },
};
