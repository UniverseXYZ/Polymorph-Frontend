import React from 'react';
import ScramblingImg from '../../assets/images/polymorph-scrambling.png';
import OptimizedImg from '../../assets/images/polymorph-optimized.png';
import GamingReadyImg from '../../assets/images/polymorph-gaming-ready.png';
import Button from '@legacy/button/Button';
import { useRouter } from 'next/router';

const WhatsNewSection = () => {
  const router = useRouter();

  return (
    <div className='whats--new--section'>
      <div className='top--shadow'></div>
      <div className='whats--new--section--wrapper'>
        <div className='whats--new--section--wrapper--container'>
          <h1 className='title'>What’s New</h1>
          <div className='grid--row'>
            <div>
              <img src={ScramblingImg} alt="Scrambling" />
              <h2>Scrambling</h2>
              <p>Roll the dice for a chance to acquire your favorite traits.</p>
            </div>
            <div>
              <img src={OptimizedImg} alt="Optimized" />
              <h2>Optimized</h2>
              <p>Contract upgrades with even more functionality and intelligence.</p>
            </div>
            <div>
              <img src={GamingReadyImg} alt="Gaming Ready" />
              <h2>Gaming Ready</h2>
              <p>V2 Polymorphs can participate in the Battle Universe game.</p>
            </div>
          </div>
          <div className='burn--polymorph--btn'>
            <Button className="light-button" onClick={() => router.push('/burn-to-mint/burn')}>Burn a Polymorph</Button>
          </div>
        </div>
      </div>
      <div className='bottom--shadow'></div>
    </div>
  )
}

export default WhatsNewSection;