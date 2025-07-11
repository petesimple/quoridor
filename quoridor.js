const boardEl = document.getElementById("board");

const gameState = {
  boardSize: 9,
  currentPlayerIndex: 0,
  players: [
    { id: 1, name: "Player 1", color: "blue", position: { x: 4, y: 0 }, wallsRemaining: 10 },
    { id: 2, name: "Player 2", color: "red", position: { x: 4, y: 8 }, wallsRemaining: 10 },
  ],
  walls: []
};

// Initialize grid cells
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 9; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.addEventListener("click", () => handleCellClick(x, y));
    boardEl.appendChild(cell);
  }
}

// Draw pawns
function renderPawns() {
  document.querySelectorAll(".pawn").forEach(p => p.remove());
  gameState.players.forEach(player => {
    const selector = `.cell[data-x='${player.position.x}'][data-y='${player.position.y}']`;
    const cell = document.querySelector(selector);
    const pawn = document.createElement("div");
    pawn.classList.add("pawn");
    pawn.style.background = player.color;
    cell.appendChild(pawn);
  });
}

function handleCellClick(x, y) {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const dx = x - currentPlayer.position.x;
  const dy = y - currentPlayer.position.y;

  // Determine if this is orthogonally adjacent
  const isOrthogonalAdjacent =
    (Math.abs(dx) === 1 && dy === 0) ||
    (Math.abs(dy) === 1 && dx === 0);

  if (isOrthogonalAdjacent) {
    const targetOccupied = gameState.players.some(p =>
      p.position.x === x && p.position.y === y
    );

    if (!targetOccupied) {
      // Simple adjacent move
      currentPlayer.position = { x, y };
    } else {
      // Attempt to jump or sidestep
      const jumpX = x + dx;
      const jumpY = y + dy;

      const jumpInBounds =
        jumpX >= 0 &&
        jumpX < gameState.boardSize &&
        jumpY >= 0 &&
        jumpY < gameState.boardSize;

      const jumpOccupied = gameState.players.some(p =>
        p.position.x === jumpX && p.position.y === jumpY
      );

      if (jumpInBounds && !jumpOccupied) {
        // Jump over the pawn
        currentPlayer.position = { x: jumpX, y: jumpY };
      } else {
        // Try diagonal sidestep
        const diagonalOffsets =
          dx !== 0
            ? [
                { x: x, y: y - 1 },
                { x: x, y: y + 1 },
              ]
            : [
                { x: x - 1, y: y },
                { x: x + 1, y: y },
              ];

        let sidestepDone = false;
        for (const offset of diagonalOffsets) {
          if (
            offset.x === x &&
            offset.y === y
          )
            continue; // Skip same cell
          if (
            offset.x >= 0 &&
            offset.x < gameState.boardSize &&
            offset.y >= 0 &&
            offset.y < gameState.boardSize
          ) {
            const sidestepOccupied = gameState.players.some(p =>
              p.position.x === offset.x && p.position.y === offset.y
            );
            if (!sidestepOccupied && x === offset.x && y === offset.y) {
              // This would mean they clicked directly on the sidestep square
              currentPlayer.position = { x: offset.x, y: offset.y };
              sidestepDone = true;
              break;
            }
          }
        }
        if (!sidestepDone) {
          console.log("Invalid move: cannot jump or sidestep.");
          return;
        }
      }
    }
  } else {
    console.log("Invalid move: must move to adjacent square.");
    return;
  }

  // Rotate to next player
  gameState.currentPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;

  renderPawns();
}

renderPawns();
