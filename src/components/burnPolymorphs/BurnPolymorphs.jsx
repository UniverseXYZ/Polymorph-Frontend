import React from 'react';
import { useRouter } from 'next/router';
import ArrowLeftIcon from '../../components/svgs/ArrowLeftIcon';
import CharactersGrid from '../../components/charactersGrid/CharactersGrid';
import Button from '@legacy/button/Button';
import neverScrambledIcon from '../../assets/images/never-scrambled-badge.svg';

const BurnPolymorphs = ({characters, type}) => {
  const router = useRouter();

  return (
    <div className='burn--polymorph--page'>
      <div className='burn--polymorph--page--wrapper'>
        <div className='burn--polymorph--page--wrapper--container'>
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
                <Button className='light-button' disabled>Approve Token</Button>
                <Button className='light-button'>Burn</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BurnPolymorphs