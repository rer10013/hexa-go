import React, { useState, useEffect } from 'react';
import Board from './Board';
import Timer from './Timer';
import MoveDebug from './MoveDebug';
import ResignButton from './ResignButton';
import { evaluateMove } from './captureLogic';
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

  const buildBoardMapping = (history = moveDebug) => {
    return history.reduce((acc, move) => {
      acc[move.coordinate] = move.player;
      return acc;
    }, {});
  };

  // Place a stone on the board.
  const handlePlaceStone = (coordinate) => {
    if (isGameOver || moveDebug.find((move) => move.coordinate === coordinate)) {
      return;
    }

    const boardMapping = buildBoardMapping();

    // Evaluate the move using captureLogic
    const { valid, captured } = evaluateMove(coordinate, boardMapping, currentPlayer, depth);
    if (!valid) {
      alert("Invalid move: suicide is not allowed.");
      return;
    }

    // Build the new move
    const newMove = {
      coordinate,
      player: currentPlayer,
      time: new Date().toLocaleTimeString(),
    };

    // Remove any captured stones from moveDebug
    const newHistory = moveDebug.filter((move) => !captured.includes(move.coordinate));
    newHistory.push(newMove);

    // Append the new move to the URL history
    appendMoveToURL(coordinate);

    // Update state
    setMoveDebug(newHistory);
    setCapturedStones({
      ...capturedStones,
      [currentPlayer]: capturedStones[currentPlayer] + captured.length,
    });
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
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
      // We simulate the game from an empty board.
      let gameState = {
        moveDebug: [],
        currentPlayer: 'black',
        capturedStones: { black: 0, white: 0 }
      };

      movesFromURL.forEach(move => {
        const boardMapping = buildBoardMapping(gameState.moveDebug);
        const { valid, captured } = evaluateMove(move, boardMapping, gameState.currentPlayer, depth);

        // Skip invalid moves
        if (!valid) {
          console.warn(`Invalid move in URL: ${move}`);
          return;
        }
        const newMove = {
          coordinate: move,
          player: gameState.currentPlayer,
          time: new Date().toLocaleTimeString(),
        };

        // Remove any captured stones from our simulated history
        gameState.moveDebug = gameState.moveDebug.filter((m) => !captured.includes(m.coordinate));
        gameState.moveDebug.push(newMove);
        gameState.capturedStones[gameState.currentPlayer] += captured.length;
        // Switch turn
        gameState.currentPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';
      });

      // Update our state with the computed game state.
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
