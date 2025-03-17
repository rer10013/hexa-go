import { evaluateMove } from './captureLogic';

/**
 * Processes game move and returns to main
 * @param {string} coordinate - move coordinate (e.g., "A1").
 * @param {object} gameState - The current game state containing:
 * @param {number} depth - Board depth.
 * @returns {object} - { valid: boolean, gameState: updatedGameState }
 */
export function processMove(coordinate, gameState, depth) {
  // Build board mapping from current move history.
  const boardMapping = gameState.moveDebug.reduce((acc, move) => {
    acc[move.coordinate] = move.player;
    return acc;
  }, {});

  // Evaluate move
  const { valid, captured } = evaluateMove(coordinate, boardMapping, gameState.currentPlayer, depth);
  if (!valid) {
    return { valid, gameState };
  }

  // Create new move
  const newMove = {
    coordinate,
    player: gameState.currentPlayer,
    time: new Date().toLocaleTimeString(),
  };

  // Remove captured stones from moveDebug
  const newMoveDebug = gameState.moveDebug.filter(move => !captured.includes(move.coordinate));
  newMoveDebug.push(newMove);

  // Update captured stones
  const newCapturedStones = {
    ...gameState.capturedStones,
    [gameState.currentPlayer]: gameState.capturedStones[gameState.currentPlayer] + captured.length,
  };

  // Flip turn
  const nextPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';

  return {
    valid: true,
    gameState: {
      moveDebug: newMoveDebug,
      currentPlayer: nextPlayer,
      capturedStones: newCapturedStones,
    },
  };
}
