import Popup from 'reactjs-popup';
import React from 'react';
import WrongNetworkPopup from './WrongNetworkPopup';
import ErrorPopup from './ErrorPopup';
import { useAuthStore } from '../../stores/authStore';
import { useErrorStore } from '../../stores/errorStore';

export const Popups = () => {
  const { showWrongNetworkPopup, setShowWrongNetworkPopup } = useAuthStore(state => ({showWrongNetworkPopup: state.showWrongNetworkPopup, setShowWrongNetworkPopup: state.setShowWrongNetworkPopup}));
  const showError = useErrorStore(s => s.showError)

  return (
    <>
      <Popup closeOnDocumentClick={false} open={showWrongNetworkPopup}>
        <WrongNetworkPopup close={() => setShowWrongNetworkPopup(false)} />
      </Popup>
      <Popup closeOnDocumentClick={false} open={showError}>
        <ErrorPopup />
      </Popup>
    </>
  );
}
