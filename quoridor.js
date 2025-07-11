const boardEl = document.getElementById("board");

// Initialize grid cells
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 9; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
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

renderPawns();
