import React, { useState } from 'react';
import Board from './Board';
import Timer from './Timer';
import MoveHistory from './MoveHistory';
import ResignButton from './ResignButton';

function App() {
  // History
  const [moveHistory, setMoveHistory] = useState([]);

  // Turn
  const [currentPlayer, setCurrentPlayer] = useState('black');
  
  // Captured stones
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });

  // Placing stones
  const handlePlaceStone = (coordinate) => {
    if (moveHistory.find((move) => move.coordinate === coordinate)) {
      return;
    }
    // Save to history
    const newMove = {
      coordinate,
      player: currentPlayer,
      time: new Date().toLocaleTimeString(),
    };

    // Capture Logic
    const newlyCaptured = 0;

    setMoveHistory([...moveHistory, newMove]);
    setCapturedStones({
      ...capturedStones,
      [currentPlayer]: capturedStones[currentPlayer] + newlyCaptured
    });

    // Next Turn
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // Resign
  const handleResign = () => {
    alert(`${currentPlayer} resigned!`);
  };

  return (
    <div className="App">
      <h1>Hexa-Go (Depth: 3)</h1>
      
      {/* Timer(B/W) */}
      <div className="timer-container">
        <Timer player="Black" isActive={currentPlayer === 'black'}/>
        <Timer player="White" isActive={currentPlayer === 'white'}/>
      </div>

      {/* Board */}
      <Board onPlaceStone={handlePlaceStone} moveHistory={moveHistory} />

      {/* Num of Captured stones */}
      <div className="captured">
        <p>Black Captured: {capturedStones.black}</p>
        <p>White Captured: {capturedStones.white}</p>
      </div>

      {/* Resign Button */}
      <ResignButton onResign={handleResign} />

      {/* History Search */}
      <MoveHistory moveHistory={moveHistory} />
    </div>
  );
}

export default App;
