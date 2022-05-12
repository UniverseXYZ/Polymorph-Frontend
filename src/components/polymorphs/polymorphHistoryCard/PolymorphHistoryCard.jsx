import React from 'react';
import ethIcon from '../../../assets/images/ETHicon.png';
import {ReactComponent as LinkIcon} from '../../../assets/images/etherscan.svg';
import {ReactComponent as ChevronRight} from '../../../assets/images/chevron-right.svg';

const PolymorphHistoryCard = ({history}) => {
  return (
    <div className='polymorph--history--card'>
      <div className='card--body'>
        <div className='card--body--left'>
          <div className='card--body--left--badge'>
            <img src={history.img} alt={history.type} />
          </div>
          <div className='card--body--left--title'>
            <h3>{history.type}</h3>
            {history.type === 'Sale' || history.type === 'Transfer' ?
              <p>
                from <b>{`${history.fromAddress.substring(0,2)}...${history.fromAddress.substring(history.fromAddress.length-4)}`}</b> to <b>{`${history.toAddress.substring(0,2)}...${history.toAddress.substring(history.toAddress.length-4)}`}</b>
                <LinkIcon />
              </p> : 
              <p>
                from <b>{`${history.fromAddress.substring(0,2)}...${history.fromAddress.substring(history.fromAddress.length-4)}`}</b>
                <LinkIcon />
              </p>
            }
          </div>
        </div>
        <div className='card--body--right'>
          {history.price &&
            <h3>
              <img src={ethIcon} alt="eth" />
              {history.price}
            </h3>
          }
          <p>{history.date}</p>
        </div>
      </div>
      <div className='card--footer'>
        {history.type === 'Scramble' ?
          <>
            {history.morphed ?
              <div className='morphed--character'>The character was morphed</div> : 
              <div className='character--details'>
                <div>
                  <span>Eyewear</span>
                  <span>No Eyewear</span>
                  <span>30% have this trait</span>
                </div>
                <ChevronRight />
                <div>
                  <span>Eyewear</span>
                  <span>Orange Sunglasses</span>
                  <span>58% have this trait</span>
                </div>
              </div>
            }
          </> : <></>
        }
      </div>
    </div>
  )
}

export default PolymorphHistoryCard