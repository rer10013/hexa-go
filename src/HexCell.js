import React from 'react';
import './HexCell.css';

function HexCell({ coordinate, stone, onClick }) {
  // Stone state
  const stoneClass = stone === 'black' ? 'stone-black'
                   : stone === 'white' ? 'stone-white'
                   : '';

  return (
    <div className="hex-cell" onClick={onClick}>
      <div className={`stone ${stoneClass}`}>
        {/* Index for debug */}
        <span className="coord-label">{coordinate}</span>
      </div>
    </div>
  );
}

export default HexCell;
