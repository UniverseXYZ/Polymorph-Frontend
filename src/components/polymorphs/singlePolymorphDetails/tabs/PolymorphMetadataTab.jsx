import React from 'react';
import PolymorphMetadataCard from '../../polymorphMetadataCard/PolymorphMetadataCard';

const PolymorphMetadataTab = () => {
  // Dummy data
  const polymorphMetadata = [
    {
      id: 1,
      label: 'Next morph price',
      price: 0.01,
      address: null,
    },
    {
      id: 2,
      label: 'Owner',
      address: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
    },
    {
      id: 3,
      label: 'Genome string',
      address: '0x88f107857b9046a07c06D36566b661EDd2993e0b',
    },
  ]
  
  return (
    <div className='polymorph--metadata--tab'>
      {polymorphMetadata.map(metadata => (
        <PolymorphMetadataCard key={metadata.id} metadata={metadata} />
      ))}
    </div>
  )
}

export default PolymorphMetadataTab;