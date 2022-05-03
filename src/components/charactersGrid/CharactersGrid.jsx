import React, { useEffect, useState } from 'react';

const CharactersGrid = ({characters}) => {
  const [gridColumns, setGridColumns] = useState('');

  useEffect(() => {
    if(characters.length > 1 && characters.length < 5) {
      setGridColumns('two--columns');
    }
    if(characters.length > 4 && characters.length < 10) {
      setGridColumns('three--columns');
    }
    if(characters.length > 9 && characters.length < 17) {
      setGridColumns('four--columns');
    }
    if(characters.length > 16) {
      setGridColumns('five--columns');
    }
  }, [])
  
  return (
    <div className={`characters--grid ${gridColumns}`}>
      {characters.map(c => {
        return (
          <div key={c.id}>
            <img src={c.polymorphImg} alt='polymorph' />
          </div>
        )
      })}
    </div>
  )
}

export default CharactersGrid;