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

  const isAdjacent =
    (Math.abs(dx) === 1 && dy === 0) ||
    (Math.abs(dy) === 1 && dx === 0);

  if (!isAdjacent) {
    console.log("Invalid move: must move to adjacent square.");
    return;
  }

  // Later: check walls here.

  currentPlayer.position = { x, y };

  // Rotate to next player
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

  renderPawns();
}

renderPawns();
