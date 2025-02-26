/**
 * Append Move to URL
 * @param {string} move - The move coordinate
 */
export function appendMoveToURL(move) {
  const currentPath = window.location.pathname;
  // Remove "/" to work with string
  const historyStr = currentPath.replace(/^\/+/, '');
  const newHistoryStr = historyStr + move;
  window.history.pushState(null, '/', `/${newHistoryStr}`);
}

/**
 * Parse the URL path into an array of moves
 * @returns {string[]} An array of moves
 */
export function getMovesFromURL() {
  const currentPath = window.location.pathname;
  const historyStr = currentPath.replace(/^\/+/, '');
  const moves = [];
  for (let i = 0; i < historyStr.length; i += 2) {
    // Each move is exactly two characters (an alphabet + a digit) for now
    const move = historyStr.substring(i, i + 2);
    if (move.length === 2) {
      moves.push(move);
    }
  }
  return moves;
}
