import React, {useState} from 'react';
import { useRouter } from 'next/router';
import Popup from 'reactjs-popup';
import ArrowLeftIcon from '../../components/svgs/ArrowLeftIcon';
import CharactersGrid from '../../components/charactersGrid/CharactersGrid';
import Button from '@legacy/button/Button';
import neverScrambledIcon from '../../assets/images/never-scrambled-badge.svg';
import Lottie from 'react-lottie';
import animationData from '../../utils/animations/burn_polymorph_bg_animation.json';
import BurnPolymorphAnimation from './animations/BurnPolymorphAnimation';
import BurnPolymorphLoadingPopup from '../../components/popups/BurnPolymorphLoadingPopup';
import BurnPolymorphSuccessPopup from '../../components/popups/BurnPolymorphSuccessPopup';

const BurnPolymorphs = ({characters, type}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [tokenApproved, setTokenApproved] = useState(false);

  const handleBurnClick = () => {
    setStatus('burning');
    setTimeout(() => {
      setStatus('loading');
      setTimeout(() => {
        setStatus('success');
      }, 2000)
    }, 3000)
  }

  return (
    <div className='burn--polymorph--page'>
      <div className="lottie--animation">
        <Lottie options={defaultOptions} />
      </div>
      <div className='burn--polymorph--page--wrapper'>
        <div className='burn--polymorph--page--wrapper--container'>
          {!status ?
            <>
              <div className='back--btn'>
                <ArrowLeftIcon />
                <span>Choose Polymorphs</span>
              </div>
              <div className='burn--polymorph--grid'>
                <div>
                  <CharactersGrid characters={characters} />
                  {type === 'single' &&
                    <img className='scrambled--icon' src={neverScrambledIcon} alt='Never Scrambled' />
                  }
                </div>
                <div>
                  <h1>{type === 'single' ? `Burn Troll God #${router.query.id}` : `Burn ${characters.length} Polymorphs`}</h1>
                  <p>You can only burn your polymorph one time. <br/> The new polymorph will get the same traits and badges.</p>
                  <div className='burn--polymorphs--buttons'>
                    <Button className='light-button' onClick={() => setTokenApproved(true)} disabled={tokenApproved}>Approve Token</Button>
                    <Button className='light-button' onClick={handleBurnClick} disabled={!tokenApproved}>Burn</Button>
                  </div>
                </div>
              </div>
            </> : 
            status === 'burning' ?
            <div className='burning--polymorph--animation'>
              <CharactersGrid characters={characters} />
              <BurnPolymorphAnimation />
            </div> : <></>
          }
        </div>
      </div>
      <Popup closeOnDocumentClick={false} open={status === 'loading'}>
        <BurnPolymorphLoadingPopup onClose={() => setStatus('')} />
      </Popup>
      <Popup closeOnDocumentClick={false} open={status === 'success'}>
        <BurnPolymorphSuccessPopup onClose={() => setStatus('')} characters={characters} />
      </Popup>
    </div>
  )
}

export default BurnPolymorphs