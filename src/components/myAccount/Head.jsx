import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../button/Button.jsx';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/router';

const Head = () => {
  const { loggedInArtist } = useAuthStore(s => ({
    loggedInArtist: s.loggedInArtist,
  }));
  const router = useRouter();

  const handlePublicPage = () => {
    if (
      loggedInArtist.name &&
      loggedInArtist.universePageAddress &&
      loggedInArtist.avatar &&
      loggedInArtist.about
    ) {
      router.push(`/${loggedInArtist.universePageAddress}`);
    }
  };

  return (
    <div className="edit--my--profile--header">
      <div className="my-account-title">
        <div>
          <h1>Edit My Profile</h1>
        </div>
        <div className="button-section">
          <Button className="light-border-button public-button" onClick={() => handlePublicPage()}>
            See Public View
          </Button>
        </div>
        <p>
          You can set your preffered display name, create a branded profile URL and manage other
          personal settings.
        </p>
      </div>
    </div>
  );
};
export default Head;
