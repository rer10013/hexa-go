import React, { useEffect } from 'react';
import TriCell from './TriCell';
import './Board.css';

function Board({ onPlaceStone, moveHistory, onGameEnd }) {
  const boardRows = [3, 4, 5, 6, 5, 4, 3];
  const spaceNum = boardRows.reduce((a, b) => a + b, 0) * 2; // Each Triagon now has 6 triangles

  useEffect(() => {
    if (moveHistory.length === spaceNum) {
      onGameEnd();
    }
  }, [moveHistory, spaceNum, onGameEnd]);

  let rows = [];
  let uppercaseIndex = 0;
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let rowIndex = 0; rowIndex < boardRows.length; rowIndex++) {
    let cells = [];
    for (let colIndex = 0; colIndex < boardRows[rowIndex]; colIndex++) {
      // Create 2 triangles per Triagon
      const upCoordinate = `${uppercase[uppercaseIndex]}${colIndex + 1}U`;
      const downCoordinate = `${uppercase[uppercaseIndex]}${colIndex + 1}D`;

      const upStone = moveHistory.find((move) => move.coordinate === upCoordinate)?.player;
      const downStone = moveHistory.find((move) => move.coordinate === downCoordinate)?.player;

      cells.push(
        <TriCell
          key={upCoordinate}
          coordinate={upCoordinate}
          stone={upStone}
          onClick={() => onPlaceStone(upCoordinate)}
          orientation="up"
        />
      );
      cells.push(
        <TriCell
          key={downCoordinate}
          coordinate={downCoordinate}
          stone={downStone}
          onClick={() => onPlaceStone(downCoordinate)}
          orientation="down"
        />
      );
    }
    uppercaseIndex++;
    rows.push(
      <div className="board-row" key={rowIndex}>
        {cells}
      </div>
    );
  }

  return <div className="board-container">{rows}</div>;
}

export default Board;
