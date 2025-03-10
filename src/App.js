import React, { useState, useEffect } from 'react';
import Board from './Board';
import Timer from './Timer';
import MoveDebug from './MoveDebug';
import ResignButton from './ResignButton';
import { processMove } from './gameProcessor';
import { appendMoveToURL, getMovesFromURL } from './moveHistory';

function App() {
  // Move history
  const [moveDebug, setMoveDebug] = useState([]);

  // Current turn
  const [currentPlayer, setCurrentPlayer] = useState('black');
  
  // Captured stones count
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });

  // Game-over flag
  const [isGameOver, setIsGameOver] = useState(false);

  // Board depth (for Tri-Go)
  const depth = 2;

  // Game state object
  const getGameState = () => ({
    moveDebug,
    currentPlayer,
    capturedStones,
  });

  // Update state for game
  const updateGameState = (newState) => {
    setMoveDebug(newState.moveDebug);
    setCapturedStones(newState.capturedStones);
    setCurrentPlayer(newState.currentPlayer);
  };

  // Place a stone on the board
  const handlePlaceStone = (coordinate) => {
    if (isGameOver || moveDebug.find((move) => move.coordinate === coordinate)) {
      return;
    }

    // Process move using gameProcessor
    const result = processMove(coordinate, getGameState(), depth);
    if (!result.valid) {
      alert("Invalid move: suicide is not allowed.");
      return;
    }

    // Append the new move to the URL history
    appendMoveToURL(coordinate);

    // Update state
    updateGameState(result.gameState);
  };
  
  // Handle board full
  const handleGameEnd = () => {
    setIsGameOver(true);
    alert('Game over! The board is full.');
  };

  // Handle resign
  const handleResign = () => {
    alert(`${currentPlayer} resigned!`);
  };

  // On page load, initialize the game state from URL moves
  useEffect(() => {
    const movesFromURL = getMovesFromURL();
    if (movesFromURL.length > 0) {
      let gameState = getGameState();
      movesFromURL.forEach(move => {
        const result = processMove(move, gameState, depth);
        // Skip invalid moves
        if (!result.valid) {
          console.warn(`Invalid move in URL: ${move}`);
          return;
        }
        gameState = result.gameState;
      });
      // Update our state with the computed game state.
      updateGameState(gameState);
    }
  }, []);

  return (
    <div className="App">
      <h1>Tri-Go (Depth: {depth})</h1>
      
      {/* Timers for Black and White */}
      <div className="timer-container">
        <Timer player="Black" isActive={currentPlayer === 'black'} />
        <Timer player="White" isActive={currentPlayer === 'white'} />
      </div>

      {/* Game Board */}
      <Board depth={depth} onPlaceStone={handlePlaceStone} moveDebug={moveDebug} onGameEnd={handleGameEnd} />

      {/* Captured Stones Count */}
      <div className="captured">
        <p>Black Captured: {capturedStones.black}</p>
        <p>White Captured: {capturedStones.white}</p>
      </div>

      {/* Resign Button */}
      <ResignButton onResign={handleResign} />

      {/* Move History Debug */}
      <MoveDebug moveDebug={moveDebug} />
    </div>
  );
}

export default App;
