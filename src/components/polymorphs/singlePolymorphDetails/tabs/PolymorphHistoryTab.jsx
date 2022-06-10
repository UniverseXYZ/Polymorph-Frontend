import React from 'react'
import PolymorphHistoryCard from '../../polymorphHistoryCard/PolymorphHistoryCard';
import SaleBadge from '../../../../assets/images/polymorph-sale-badge.png';
import TransferBadge from '../../../../assets/images/polymorph-transfer-badge.png';
import MintBadge from '../../../../assets/images/polymorph-mint-badge.png';
import ScrambleBadge from '../../../../assets/images/burn-polymorph.png';

const PolymorphHistoryTab = () => {
  // Dummy data
  const polymorphHistories = [
    {
      id: 1,
      type: 'Sale',
      img: SaleBadge,
      fromAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      toAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      price: 8.242,
      date: '13 hours ago',
    },
    {
      id: 2,
      type: 'Transfer',
      img: TransferBadge,
      fromAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      toAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      date: '13 hours ago',
    },
    {
      id: 3,
      type: 'Scramble',
      img: ScrambleBadge,
      fromAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      price: 0.1,
      date: '13 hours ago',
      morphed: false,
    },
    {
      id: 4,
      type: 'Scramble',
      img: ScrambleBadge,
      fromAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      price: 0.7,
      date: '13 hours ago',
      morphed: true,
    },
    {
      id: 5,
      type: 'Mint',
      img: MintBadge,
      fromAddress: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
      date: '13 hours ago',
    },
  ];

  return (
    <div className='polymorph--history--tab'>
      {polymorphHistories.map(history => (
        <PolymorphHistoryCard key={history.id} history={history} />
      ))}
    </div>
  )
}

export default PolymorphHistoryTab