const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');

const gridSize = 5; // 5x5 grid of dots
const dotSpacing = 80; // Spacing between dots
const dotRadius = 5; // Radius of each dot
const clickMargin = 10; // Tolerance for clicks near lines

let grid = [];
let currentPlayer = 'player'; // Alternate between 'player' and 'ai'
let aiDifficulty = 'easy';
let playerScore = 0;
let aiScore = 0;

// Initialize the grid
function initializeGrid() {
    grid = [];
    for (let row = 0; row < gridSize; row++) {
        const gridRow = [];
        for (let col = 0; col < gridSize; col++) {
            gridRow.push({
                right: false, // Line to the right
                down: false,  // Line below
                owner: null,  // Owner of the box
            });
        }
        grid.push(gridRow);
    }
    playerScore = 0;
    aiScore = 0;
    currentPlayer = 'player';
}

// Draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Draw dots
            ctx.beginPath();
            ctx.arc(col * dotSpacing + 50, row * dotSpacing + 50, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();

            // Draw lines
            if (grid[row][col].right) {
                ctx.beginPath();
                ctx.moveTo(col * dotSpacing + 50, row * dotSpacing + 50);
                ctx.lineTo((col + 1) * dotSpacing + 50, row * dotSpacing + 50);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            if (grid[row][col].down) {
                ctx.beginPath();
                ctx.moveTo(col * dotSpacing + 50, row * dotSpacing + 50);
                ctx.lineTo(col * dotSpacing + 50, (row + 1) * dotSpacing + 50);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Highlight completed boxes
            if (grid[row][col].owner) {
                ctx.fillStyle = grid[row][col].owner === 'player' ? 'rgba(0, 0, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                ctx.fillRect(col * dotSpacing + 50, row * dotSpacing + 50, dotSpacing, dotSpacing);
            }
        }
    }
}

// Handle canvas clicks
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const dotX = col * dotSpacing + 50;
            const dotY = row * dotSpacing + 50;

            // Check for right line click
            if (!grid[row][col].right && Math.abs(y - dotY) < clickMargin && x > dotX && x < dotX + dotSpacing) {
                grid[row][col].right = true;
                if (!checkForBox(row, col)) {
                    switchPlayer();
                }
                drawGrid();
                return;
            }

            // Check for down line click
            if (!grid[row][col].down && Math.abs(x - dotX) < clickMargin && y > dotY && y < dotY + dotSpacing) {
                grid[row][col].down = true;
                if (!checkForBox(row, col)) {
                    switchPlayer();
                }
                drawGrid();
                return;
            }
        }
    }
});

// Check if a box is completed
function checkForBox(row, col) {
    let boxCompleted = false;

    // Check current box
    if (row < gridSize - 1 && col < gridSize - 1) {
        if (
            grid[row][col].right &&
            grid[row][col].down &&
            grid[row + 1][col].right &&
            grid[row][col + 1].down
        ) {
            grid[row][col].owner = currentPlayer;
            boxCompleted = true;
            if (currentPlayer === 'player') playerScore++;
            else aiScore++;
        }
    }

    return boxCompleted;
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'player' ? 'ai' : 'player';
    if (currentPlayer === 'ai') aiMove();
}

// AI move using alpha-beta pruning
function aiMove() {
    setTimeout(() => {
        const bestMove = getBestMove();
        if (bestMove) {
            const { row, col, direction } = bestMove;
            if (direction === 'right') {
                grid[row][col].right = true;
            } else if (direction === 'down') {
                grid[row][col].down = true;
            }
            if (!checkForBox(row, col)) {
                switchPlayer();
            }
            drawGrid();
        }
    }, 500);
}

// Get the best move using alpha-beta pruning
function getBestMove() {
    // Simplified AI logic for now
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col].right) {
                return { row, col, direction: 'right' };
            }
            if (!grid[row][col].down) {
                return { row, col, direction: 'down' };
            }
        }
    }
    return null;
}

// Restart game
restartBtn.addEventListener('click', () => {
    initializeGrid();
    drawGrid();
});

// Update difficulty
difficultySelect.addEventListener('change', (e) => {
    aiDifficulty = e.target.value;
});

// Initialize the game
initializeGrid();
drawGrid();
