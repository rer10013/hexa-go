import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Timer from './Timer';
import MoveDebug from './MoveDebug';
import ResignButton from './ResignButton';
import { processMove } from './gameProcessor';
import { useMoveHistory } from './moveHistory';
import "./App.css";

function App() {
  // Move Debug
  const [moveDebug, setMoveDebug] = useState([]);

  // Move History
  const { moves, appendMoveToURL } = useMoveHistory();

  // Current turn
  const [currentPlayer, setCurrentPlayer] = useState('black');
  
  // Captured stones count
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });

  // Game-over flag
  const [isGameOver, setIsGameOver] = useState(false);

  // Board depth (for Tri-Go)
  const depth = 2;

  // Game state object
  const getGameState = useCallback(() => ({
    moveDebug,
    currentPlayer,
    capturedStones,
  }), [moveDebug, currentPlayer, capturedStones]);

  // Update state for game
  const updateGameState = useCallback((newState) => {
    setMoveDebug(newState.moveDebug);
    setCapturedStones(newState.capturedStones);
    setCurrentPlayer(newState.currentPlayer);
  }, []);

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
    if (moves.length > 0) {
      let gameState = getGameState();
      moves.forEach(move => {
        const result = processMove(move, gameState, depth);
        if (!result.valid) {
          console.warn(`Invalid move in URL: ${move}`);
          return;
        }
        gameState = result.gameState;
      });
      setMoveDebug(gameState.moveDebug);
      setCapturedStones(gameState.capturedStones);
      setCurrentPlayer(gameState.currentPlayer);
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
