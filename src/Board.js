import React, { useEffect } from 'react';
import TriCell from './TriCell';
import './Board.css';

function Board({ depth, onPlaceStone, moveHistory, onGameEnd }) {
  const totalRows = 2 * depth;

  // Compute number of Triangles
  const spaceNum = depth * depth * 6;
  useEffect(() => {
    if (moveHistory.length === spaceNum) {
      onGameEnd();
    }
  }, [moveHistory, spaceNum, onGameEnd]);

  // generate row cells
  const generateRowCells = (rowIndex, isIncreasing) => {
    const rowCells = [];
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const startWithUp = isIncreasing;
    const blockCount = isIncreasing
      ? (depth + rowIndex) * 2 + 1
      : (totalRows - rowIndex + depth - 1) * 2 + 1;

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
      const orientation = (blockIndex % 2 === 0) === startWithUp ? "U" : "D";
      const coordinate = `${uppercase[rowIndex]}${blockIndex + 1}`;

      // Find stone is placed
      const stone = moveHistory.find((move) => move.coordinate === coordinate)?.player;

      // Push TriCell
      rowCells.push(
        <TriCell
          key={coordinate}
          coordinate={coordinate}
          stone={stone}
          onClick={() => onPlaceStone(coordinate)}
          orientation={orientation === "U" ? "up" : "down"}
        />
      );
    }

    return rowCells;
  };

  // Build rows
  const rows = [];
  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const isIncreasing = rowIndex < depth;
    const rowCells = generateRowCells(rowIndex, isIncreasing);

    rows.push(
      <div
        className={`board-row ${rowIndex % 2 === 1 ? "offset-row" : ""}`}
        key={rowIndex}
      >
        {rowCells}
      </div>
    );
  }

  return <div className="board-container">{rows}</div>;
}

export default Board;
