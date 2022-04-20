import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import { useAuthStore } from '../../stores/authStore';

const HeaderAvatar = ({ scale }) => {
  const { loggedInArtist, address } = useAuthStore(s => ({loggedInArtist: s.loggedInArtist, address: s.address}))

  return (
    <>
        <Blockies
          className={scale === 3 ? 'blockie-md' : 'blockie-lg'}
          seed={address}
          size={9}
          scale={scale}
        />
    </>
  );
};

HeaderAvatar.propTypes = {
  scale: PropTypes.number.isRequired,
};

export default HeaderAvatar;
