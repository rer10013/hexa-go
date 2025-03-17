import React, { useEffect, useState } from 'react';

function Timer({ player, isActive }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive) {
     interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  } else {
    clearInterval(interval);
  }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div style={{ margin: '0 10px' }}>
      <h2>{player} Timer: {time}s</h2>
    </div>
  );
}

export default Timer;
