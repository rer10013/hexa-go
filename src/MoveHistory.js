import React, { useState } from 'react';

function MoveHistory({ moveHistory }) {
  
  const [searchValue] = useState('');

  const filteredHistory = moveHistory.filter((move) =>
    move.coordinate.includes(searchValue)
  );

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Move History</h2>
      <ul>
        {filteredHistory.map((move, idx) => (
          <li key={idx}>
            [{idx + 1}] {move.player === 'black' ? 'B' : 'W'}{move.coordinate}, time: {move.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoveHistory;
