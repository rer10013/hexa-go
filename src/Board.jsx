import React, { useEffect } from 'react';
import TriCell from './TriCell';
import './Board.css';

function Board({ depth, onPlaceStone, moveDebug, onGameEnd }) {
  const totalRows = 2 * depth;

  // Compute number of Triangles
  const spaceNum = depth * depth * 6;
  useEffect(() => {
    if (moveDebug.length === spaceNum) {
      onGameEnd();
    }
  }, [moveDebug, spaceNum, onGameEnd]);

  // Build rows and cells
  const rows = [];
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const isIncreasing = rowIndex < depth;
    const startWithUp = isIncreasing;
    const blockCount = isIncreasing
      ? (depth + rowIndex) * 2 + 1
      : (totalRows - rowIndex + depth - 1) * 2 + 1;

    const rowCells = [];
    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
      const orientation = (blockIndex % 2 === 0) === startWithUp ? "U" : "D";
      const coordinate = `${uppercase[rowIndex]}${blockIndex + 1 + (isIncreasing ? 0 : (rowIndex - depth) * 2 + 1)}`;

      // Find if stone is placed
      const stone = moveDebug.find((move) => move.coordinate === coordinate)?.player;

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

    rows.push(
      <div
        className={`board-row`}
        key={rowIndex}
      >
        {rowCells}
      </div>
    );
  }

  return <div className="board-container">{rows}</div>;
}

export default Board;
