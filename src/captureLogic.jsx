const letterToIndex = (letter) => letter.charCodeAt(0) - 65;
const indexToLetter = (idx) => String.fromCharCode(idx + 65);

/**
 * Compute adjacent coordinates of a given cell
 * @param {string} coord - The coordinate string
 * @param {number} depth - The board depth
 * @returns {string[]} An array of adjacent coordinate strings
 */
function getAdjacent(coord, depth) {
  const rowLetter = coord.charAt(0);
  const numPart = parseInt(coord.slice(1), 10);
  const rowIndex = letterToIndex(rowLetter);

  const maxRow = depth * 2;

  const isIncreasing = rowIndex < depth;
  const blockCount = isIncreasing
    ? (depth + rowIndex) * 2 + 1
    : (maxRow - rowIndex + depth - 1) * 2 + 1;

  const adjacent = [];

  // Left
  if (numPart - 1 >= 1 + (isIncreasing ? 0 : (rowIndex - depth) * 2 + 1)) {
    adjacent.push(`${rowLetter}${numPart - 1}`);
  }

  // Right
  if (numPart + 1 <= blockCount + (isIncreasing ? 0 : (rowIndex - depth) * 2 + 1)) {
    adjacent.push(`${rowLetter}${numPart + 1}`);
  }

  // Vertical neighbor 
  if (numPart % 2 === 1) {
    // Odd - Under
    const belowRowIndex = rowIndex + 1;
    if (belowRowIndex < maxRow) {
      const belowRowLetter = indexToLetter(belowRowIndex);
      adjacent.push(`${belowRowLetter}${numPart + 1}`);
    }
  } else {
    // Even - Below
    const aboveRowIndex = rowIndex - 1;
    if (aboveRowIndex >= 0) {
      const aboveRowLetter = indexToLetter(aboveRowIndex);
      adjacent.push(`${aboveRowLetter}${numPart - 1}`);
    }
  }

  return adjacent;
}

/**
 * Flood-fills collect all connected stones of the same color.
 * @param {string} coord - Starting coordinate
 * @param {object} board - Mapping positions to stone colors
 * @param {string} color - The stone color
 * @param {number} depth - Board depth
 * @returns {Set<string>} A set of coordinates connected group.
 */
function getConnectedGroup(coord, board, color, depth) {
  const group = new Set();
  const stack = [coord];

  while (stack.length > 0) {
    const current = stack.pop();
    if (group.has(current)) continue;
    if (board[current] !== color) continue;

    group.add(current);

    const neighbors = getAdjacent(current, depth);
    neighbors.forEach((nb) => {
      if (!group.has(nb) && board[nb] === color) {
        stack.push(nb);
      }
    });
  }
  return group;
}

/**
 * Determines group has liberties.
 * @param {Set<string>} group - Set of coordinates
 * @param {object} board - Current board
 * @param {number} depth - Board depth
 * @returns {boolean} True if liberty, otherwise false.
 */
function hasLiberty(group, board, depth) {
  for (let coord of group) {
    const neighbors = getAdjacent(coord, depth);
    if (neighbors.some(nb => !board[nb])) {
      return true;
    }
  }
  return false;
}

/**
 * Determines move is repetitive capture (Pae)
 * @param {string[]} captured - Array of captured stones at previous.
 * @param {string} newCoord - The coordinate stone 
 * @returns {boolean} True if is repetitive capture, otherwise false.
 */
function hasRepetitiveCapture(captured, newCoord) {
  if (captured.length > 1) {
    return false
  }

  if (captured[0] === newCoord) {
    return True
  } else {
    return false
  }
}

/**
 * Evaluates captures and suicide.
 * @param {string} newCoord - The coordinate stone 
 * @param {object} board - Current board mapping (before placing the new stone)
 * @param {string} currentPlayer - Current player's color
 * @param {number} depth - Board depth
 * @returns {object} - { valid: boolean, captured: string[] }
 */
export function evaluateMove(newCoord, board, currentPlayer, depth, previousCaptured) {
  // Create a temporary board
  const tempBoard = { ...board };
  tempBoard[newCoord] = currentPlayer;

  const opponent = currentPlayer === 'black' ? 'white' : 'black';
  const capturedCoordinates = new Set();

  // Check for opponent captures
  const adjacentCoords = getAdjacent(newCoord, depth);
  adjacentCoords.forEach((nb) => {
    if (tempBoard[nb] === opponent) {
      const oppGroup = getConnectedGroup(nb, tempBoard, opponent, depth);
      if (!hasLiberty(oppGroup, tempBoard, depth)) {
        oppGroup.forEach((c) => capturedCoordinates.add(c));
      }
    }
  });

  // Remove captured opponent stones
  capturedCoordinates.forEach((c) => {
    delete tempBoard[c];
  });

  // Evaluate connected group
  const selfGroup = getConnectedGroup(newCoord, tempBoard, currentPlayer, depth);
  // If no liberties, then suicide.
  if (!hasLiberty(selfGroup, tempBoard, depth) || hasRepetitiveCapture(previousCaptured, newCoord)) {
    return {
      valid: false,
      captured: []
    };
  }

  // Otherwise, is valid
  return {
    valid: true,
    captured: Array.from(capturedCoordinates)
  };
}
