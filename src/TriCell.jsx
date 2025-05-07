import React from 'react';
import './TriCell.css';

function TriCell({ coordinate, stone, onClick, orientation }) {
  const stoneClass = stone === 'black' ? 'stone-black'
                   : stone === 'white' ? 'stone-white'
                   : '';

  const triangleClass = orientation === 'LU' ? 'upper-template LU'
                         : orientation === 'LD' ? 'lower-template LD'
                         : orientation === 'RU' ? 'upper-template RU'
                         : orientation === 'RD' ? 'lower-template RD'
                         : orientation === 'UD' ? 'lower-template UD'
                         : orientation === 'DU' ? 'upper-template DU'
                         : orientation === 'ND' ? 'lower-template ND'
                         : orientation === 'NU' ? 'upper-template NU'
                         : '';

  return (
    <div className={`Tri-cell ${triangleClass}`} onClick={onClick}>
      <div className="centerLine"></div>
      <div className="centerLine"></div>
      <div className="centerLine"></div>
      <div className={`stone ${stoneClass}`}>
        <span className="coord-label">{coordinate}</span>
      </div>
    </div>
  );
}

export default TriCell;
