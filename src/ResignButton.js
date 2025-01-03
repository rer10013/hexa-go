import React from 'react';

function ResignButton({ onResign }) {
  return (
    <button onClick={onResign} style={{ marginTop: '20px' }}>
      Resign
    </button>
  );
}

export default ResignButton;
