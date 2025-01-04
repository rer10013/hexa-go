import React from 'react';
import HexCell from './HexCell';
import './Board.css';

function Board({ onPlaceStone, moveHistory }) {
  // Hexa-board array
  const boardRows = [3, 4, 5, 6, 5, 4, 3];
  const lowercsaseIndexBase = [3, 4, 5, 6, 6, 6, 6];

  let rows = [];
  let uppercaseIndex = 0;
  let lowercaseIndex = 0;

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";

  for (let rowIndex = 0; rowIndex < boardRows.length; rowIndex++) {
    let cells = [];
    lowercaseIndex = lowercsaseIndexBase[rowIndex] - 1
    // NumIndex controll (/)
    for (let colIndex = 0; colIndex < boardRows[rowIndex]; colIndex++) {
      // Generate coordinate
      const coordinate = 
        uppercase[uppercaseIndex] + 
        lowercase[lowercaseIndex] + 
        (colIndex + 1).toString();

      // Check move history
      const stone = moveHistory.find(
        (move) => move.coordinate === coordinate
      )?.player;

      cells.push(
        <HexCell
          key={coordinate}
          coordinate={coordinate}
          stone={stone} 
          onClick={() => onPlaceStone(coordinate)}
        />
      );

      // LowercaseIndex (\) controll
      lowercaseIndex--;
      if (lowercaseIndex < 0) lowercaseIndex = 0;
    }
    // UppercaseIndex (-) controll
    uppercaseIndex++;
    if (uppercaseIndex >= uppercase.length) uppercaseIndex = 0;

    rows.push(
      <div className="board-row" key={rowIndex}>
        {cells}
      </div>
    );
  }

  return (
    <div className="board-container">
      {rows}
    </div>
  );
}

export default Board;
