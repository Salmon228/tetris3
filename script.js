const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = 30; // Размер клетки
const rows = canvas.height / grid;
const cols = canvas.width / grid;

let score = 0;
let playerName = localStorage.getItem('tetrisPlayerName') || '';
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

// Показываем модальное окно при запуске, если имя не сохранено
window.onload = function() {
    if (!playerName) {
        document.getElementById('registrationModal').style.display = 'block';
    }
    updateLeaderboard();
};

// Функция сохранения имени
function savePlayerName() {
    const nameInput = document.getElementById('playerName');
    if (nameInput.value.trim()) {
        playerName = nameInput.value.trim();
        localStorage.setItem('tetrisPlayerName', playerName);
        document.getElementById('registrationModal').style.display = 'none';
    }
}

// Функция завершения игры
function gameOver() {
    if (playerName) {
        alert(`${playerName}, ваш счет: ${score}!`);
    } else {
        alert(`Игра окончена! Счет: ${score}`);
    }
    saveScoreToLeaderboard();
    reset();
}

// Сохранение счета в таблицу рекордов
function saveScoreToLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
    leaderboard.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
    });

    // Сортируем и сохраняем топ-10
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('tetrisLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    updateLeaderboard();
}

// Обновление таблицы рекордов
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
    const list = document.getElementById('leaderboardList');
    list.innerHTML = leaderboard
        .map((entry, index) => `
            <div class="leaderboard-item">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.score}</span>
            </div>
        `)
        .join('');
}

// Остальной код игры (создание фигур, движение, поворот и т.д.)
// ... (используй код из предыдущего ответа для реализации логики игры)

// Запуск игры
spawnPiece();
update();
setInterval(drop, 1000);
