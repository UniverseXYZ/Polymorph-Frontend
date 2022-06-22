export const Modal = {
  baseStyle: {
    header: {
      fontFamily: 'Sharp Grotesk SemiBold',
      fontSize: '20px',
      padding: '30px',
    },
    body: {
      padding: '30px',
    },
    closeButton: {
      background: 'white',
      borderRadius: '50%',
      boxShadow: '0px 10px 20px rgba(136, 120, 172, 0.2)',
      height: '26px',
      position: 'absolute',
      right: '-13px',
      top: '-13px',
      width: '26px',

      _hover: {
        background: 'white',
      },
      _focus: {
        boxShadow: 0,
      },
      _active: {
        background: 'white',
        boxShadow: '0px 5px 10px rgba(136, 120, 172, 0.2)',
      }
    }
  }
};
