export const Checkbox = {
  baseStyle: {
    control: {
      border: '1px solid',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '6px',
      _hover: {
        bg: 'transparent',
        borderColor: '#BCEB00',
      },
      _focus: {
        boxShadow: 'none',
      },
      _checked: {
        bg: 'linear-gradient(135deg, #BCEB00 15.57%, #00EAEA 84.88%) !important',
        border: 0,
      },
    }
  },
  sizes: {
    lg: {
      label: {
        fontSize: '14px',
        fontWeight: 500,
      },
    }
  }
};
