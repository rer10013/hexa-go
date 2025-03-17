import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Custom Hook for move history
 * @returns {string[]} - An array of moves
 */
export function useMoveHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    setMoves(getMovesFromURL(searchParams));
  }, [searchParams]);

  function appendMoveToURL(move) {
    const updatedMoves = [...moves, move];
    setMoves(updatedMoves);
    setSearchParams({ moves: updatedMoves.join('') });
  }

  return { moves, appendMoveToURL };
}

/**
 * Parse the URL params into an array of moves
 * @param {URLSearchParams} searchParams
 * @returns {string[]}  - An array of moves
 */
export function getMovesFromURL(searchParams) {
  const moveStr = searchParams.get('moves') || '';
  const moves = [];
  for (let i = 0; i < moveStr.length; i += 2) {
    const move = moveStr.substring(i, i + 2);
    if (move.length === 2) {
      moves.push(move);
    }
  }
  return moves;
}
