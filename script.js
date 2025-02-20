const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = 30; // Размер клетки
const rows = canvas.height / grid;
const cols = canvas.width / grid;

let score = 0;
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]] // Z
];

const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#ff6348', '#7bed9f'];

let currentPiece;
let currentX, currentY;

function createPiece() {
    const id = Math.floor(Math.random() * shapes.length);
    return {
        shape: shapes[id],
        color: colors[id]
    };
}

function drawPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = currentPiece.color;
                context.fillRect((currentX + x) * grid, (currentY + y) * grid, grid, grid);
            }
        });
    });
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = value;
                context.fillRect(x * grid, y * grid, grid, grid);
            }
        });
    });
    drawPiece();
}

function movePiece(dx, dy) {
    if (!collision(dx, dy)) {
        currentX += dx;
        currentY += dy;
    } else if (dy === 1) {
        freeze();
        clearLines();
        if (currentY === 0) {
            alert(`Игра окончена! Счет: ${score}`);
            reset();
        } else {
            spawnPiece();
        }
    }
}

function collision(dx, dy) {
    return currentPiece.shape.some((row, y) =>
        row.some((value, x) =>
            value && (
                (currentX + x + dx < 0 || currentX + x + dx >= cols) ||
                (currentY + y + dy >= rows) ||
                board[currentY + y + dy][currentX + x + dx]
            )
        )
    );
}

function freeze() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentY + y][currentX + x] = currentPiece.color;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    board.forEach((row, y) => {
        if (row.every(cell => cell)) {
            linesCleared++;
            board.splice(y, 1);
            board.unshift(Array(cols).fill(0));
        }
    });
    if (linesCleared) {
        score += linesCleared * 100;
        document.getElementById('score').innerText = score;
    }
}

function spawnPiece() {
    currentPiece = createPiece();
    currentX = Math.floor(cols / 2) - 1;
    currentY = 0;
}

function reset() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    score = 0;
    document.getElementById('score').innerText = score;
    spawnPiece();
}

function moveLeft() {
    movePiece(-1, 0);
}

function moveRight() {
    movePiece(1, 0);
}

function rotate() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!collision(0, 0, rotated)) {
        currentPiece.shape = rotated;
    }
}

function drop() {
    movePiece(0, 1);
}

function update() {
    drawBoard();
    requestAnimationFrame(update);
}

// Обработка клавиш клавиатуры
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveLeft();
    if (event.key === 'ArrowRight') moveRight();
    if (event.key === 'ArrowUp') rotate();
    if (event.key === 'ArrowDown') drop();
});

spawnPiece();
update();
setInterval(drop, 1000);
