import React from 'react';
import './TriCell.css';

function TriCell({ coordinate, stone, onClick, orientation }) {
  // Triangle orientation
  const triangleClass = orientation === 'up' ? 'triangle-up' : 'triangle-down';

  const stoneClass = stone === 'black' ? 'stone-black'
                   : stone === 'white' ? 'stone-white'
                   : '';

  return (
    <div className={`Tri-cell ${triangleClass}`} onClick={onClick}>
      <div className={`stone ${stoneClass}`}>
        <span className="coord-label">{coordinate}</span>
      </div>
    </div>
  );
}

export default TriCell;
