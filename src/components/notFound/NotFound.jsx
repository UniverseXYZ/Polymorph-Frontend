import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../button/Button';
// import './NotFound.scss';
import notFoundImg from '../../assets/images/404img.png';
import { useThemeStore } from 'src/stores/themeStore';

const NotFound = () => {
  const setDarkMode = useThemeStore(s => s.setDarkMode);
  const router = useRouter();
  useEffect(() => {
    setDarkMode(false);
    document.title = `Universe Minting - 404 - page not found`;
    return () => {
      document.title = 'Universe Minting';
    };
  }, []);
  return (
    <div className="not__found__page">
      <div className="not__found__page__box">
        <h1>
          <img src={notFoundImg} alt="404" />
        </h1>
        <p>Oops.. page not found</p>
        <Button className="light-button" onClick={() => router.push('/')}>
          Go back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
