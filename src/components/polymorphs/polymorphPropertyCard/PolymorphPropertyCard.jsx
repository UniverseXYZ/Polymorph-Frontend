import React from 'react';
import polymorphGradientImg from '../../../assets/images/polymorph-property-gradient-icon.svg';
import polymorphBlueImg from '../../../assets/images/polymorph-property-blue-icon.svg';
import polymorphPinkImg from '../../../assets/images/polymorph-property-pink-icon.svg';

const PolymorphPropertyCard = ({property}) => {

  return (
    <div className={`polymorph--property--card ${property.type}`}>
      {property.type === 'gradient' &&
        <>
          <div className='gradient--bg'></div>
          <img className='card--icon' src={polymorphGradientImg} alt='gradient' />
        </>
      }
      {property.type === 'blue' &&
        <img className='card--icon' src={polymorphBlueImg} alt='blue' />
      }
      {property.type === 'pink' &&
        <img className='card--icon' src={polymorphPinkImg} alt='pink' />
      }
      {property.type &&
        <div className='tooltiptext'>Matching trait</div>
      }
      <span>{property.text1}</span>
      <span>{property.text2}</span>
      <span>{property.text3}</span>
    </div>
  )
}

export default PolymorphPropertyCard;