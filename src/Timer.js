import React, { useEffect, useState } from 'react';

function Timer({ player }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: '0 10px' }}>
      <h2>{player} Timer: {time}s</h2>
    </div>
  );
}

export default Timer;
