import React, { useState } from 'react';
import Board from './Board';
import Timer from './Timer';
import MoveDebug from './MoveDebug';
import ResignButton from './ResignButton';
import { evaluateMove } from './captureLogic';

function App() {
  // History
  const [moveDebug, setMoveDebug] = useState([]);

  // Turn
  const [currentPlayer, setCurrentPlayer] = useState('black');
  
  // Captured stones
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });

  // Whether game end
  const [isGameOver, setIsGameOver] = useState(false);

  // Depth signing (will be fixed to dynamic button)
  const depth = 3;

  const buildBoardMapping = () => {
    return moveDebug.reduce((acc, move) => {
      acc[move.coordinate] = move.player;
      return acc;
    }, {});
  };

  const handlePlaceStone = (coordinate) => {

    // Board is full or move already exists.
    if (isGameOver || moveDebug.find((move) => move.coordinate === coordinate)) {
      return;
    }

    const boardMapping = buildBoardMapping();

    // Evaluate the move:
    const { valid, captured } = evaluateMove(coordinate, boardMapping, currentPlayer, depth);

    if (!valid) {
      alert("Invalid move: suicide is not allowed.");
      return;
    }

    // Construct move:
    const newMove = {
      coordinate,
      player: currentPlayer,
      time: new Date().toLocaleTimeString(),
    };

    // Remove captured stones from moveDebug
    const newHistory = moveDebug.filter((move) => !captured.includes(move.coordinate));
    newHistory.push(newMove);

    // Update board stat
    setMoveDebug(newHistory);
    setCapturedStones({
      ...capturedStones,
      [currentPlayer]: capturedStones[currentPlayer] + captured.length,
    });
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };
  
  // Board is full
  const handleGameEnd = () => {
    setIsGameOver(true);
    alert('Game over! The board is full.');
  };

  // Resign
  const handleResign = () => {
    alert(`${currentPlayer} resigned!`);
  };

  return (
    <div className="App">
      <h1>Tri-Go (Depth: {depth})</h1>
      
      {/* Timer(B/W) */}
      <div className="timer-container">
        <Timer player="Black" isActive={currentPlayer === 'black'}/>
        <Timer player="White" isActive={currentPlayer === 'white'}/>
      </div>

      {/* Board */}
      <Board depth={depth} onPlaceStone={handlePlaceStone} moveDebug={moveDebug} onGameEnd={handleGameEnd}/>

      {/* Num of Captured stones */}
      <div className="captured">
        <p>Black Captured: {capturedStones.black}</p>
        <p>White Captured: {capturedStones.white}</p>
      </div>

      {/* Resign Button */}
      <ResignButton onResign={handleResign} />

      {/* History Search */}
      <MoveDebug moveDebug={moveDebug} />
    </div>
  );
}

export default App;
