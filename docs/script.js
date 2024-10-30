const playerA = document.getElementById('playerA');
const playerB = document.getElementById('playerB');
const deleteABtn = document.getElementById('deleteA');
const deleteBBtn = document.getElementById('deleteB');
const resetBtn = document.getElementById('reset');
const winnerDisplay = document.getElementById('winner');
const playerAName = document.getElementById('playerAName');
const playerBName = document.getElementById('playerBName');
const firstServer = document.getElementById('firstServer');
const gameType = document.getElementById('gameType');
const playerALabel = document.getElementById('playerALabel');
const playerBLabel = document.getElementById('playerBLabel');


let scoreA = 0;
let scoreB = 0;
let server = 'A';
let gameOver = false;
let serveCount = 0;
let totalPoints = 0;
let winningScore = parseInt(gameType.value);
let isDeuce = false;

function updateScores() {
    playerA.querySelector('.score').textContent = scoreA;
    playerB.querySelector('.score').textContent = scoreB;
}

function updateServer() {
    playerA.classList.toggle('serving', server === 'A');
    playerB.classList.toggle('serving', server === 'B');

    const serveA = playerA.querySelector('.serve');
    const serveB = playerB.querySelector('.serve');

    if (isDeuce) {
        if (server === 'A') {
            serveA.textContent = 'FIRST SERVE';
            serveB.textContent = '';
        } else {
            serveB.textContent = 'FIRST SERVE';
            serveA.textContent = '';
        }
    } else {
        if (server === 'A') {
            serveA.textContent = serveCount === 0 ? 'FIRST SERVE' : 'LAST SERVE';
            serveB.textContent = '';
        } else {
            serveB.textContent = serveCount === 0 ? 'FIRST SERVE' : 'LAST SERVE';
            serveA.textContent = '';
        }
    }
}

function updatePlayerNames() {
    playerALabel.textContent = playerAName.value || 'Player A';
    playerBLabel.textContent = playerBName.value || 'Player B';
    deleteABtn.textContent = `Delete Point ${playerAName.value || 'A'}`;
    deleteBBtn.textContent = `Delete Point ${playerBName.value || 'B'}`;
}

function checkWinner() {
    const isGameTo5 = winningScore === 5;
    if (isGameTo5 && scoreA === 4 && scoreB === 4) {
        isDeuce = true;
    } else if (!isGameTo5 && scoreA >= winningScore - 1 && scoreB >= winningScore - 1) {
        isDeuce = true;
    }

    if ((isDeuce && Math.abs(scoreA - scoreB) >= 2) || (!isDeuce && (scoreA >= winningScore || scoreB >= winningScore))) {
        gameOver = true;
        const winner = scoreA > scoreB ? playerAName.value : playerBName.value;
        winnerDisplay.textContent = `${winner} wins!`;
        winnerDisplay.style.opacity = '1';
    }
}

function incrementScore(player) {
    if (gameOver) return;

    if (player === 'A') scoreA++;
    else scoreB++;

    totalPoints++;
    updateScores();

    const isGameTo5 = winningScore === 5;
    // Check for deuce
    if (isGameTo5 && scoreA === 4 && scoreB === 4) {
        isDeuce = true;
        serveCount = 0;
    } else if (!isGameTo5 && scoreA >= winningScore - 1 && scoreB >= winningScore - 1) {
        isDeuce = true;
        serveCount = 0;
    }

    // Change server
    if (isDeuce) {
        server = server === 'A' ? 'B' : 'A';
        serveCount = 0;
    } else if (totalPoints % 2 === 0) {
        server = server === 'A' ? 'B' : 'A';
        serveCount = 0;
    } else {
        serveCount = 1;
    }

    updateServer();
    checkWinner();
}

function deletePoint(player) {
    if (gameOver) return;

    if (player === 'A' && scoreA > 0) {
        scoreA--;
        totalPoints--;
    } else if (player === 'B' && scoreB > 0) {
        scoreB--;
        totalPoints--;
    } else {
        return;
    }

    updateScores();

    const isGameTo5 = winningScore === 5;
    // Check if we're still in deuce
    isDeuce = (isGameTo5 && scoreA === 4 && scoreB === 4) || (!isGameTo5 && scoreA >= winningScore - 1 && scoreB >= winningScore - 1);

    // Recalculate server
    if (isDeuce) {
        server = (totalPoints % 2 === 0) ? firstServer.value : (firstServer.value === 'A' ? 'B' : 'A');
        serveCount = 0;
    } else {
        const pointsPerServe = 2;
        const totalServes = Math.floor(totalPoints / pointsPerServe);
        server = (firstServer.value === 'A' ? totalServes % 2 === 0 : totalServes % 2 !== 0) ? 'A' : 'B';
        serveCount = totalPoints % 2;
    }

    updateServer();
    winnerDisplay.style.opacity = '0';
    gameOver = false;
}

function resetGame() {
    scoreA = 0;
    scoreB = 0;
    server = firstServer.value;
    gameOver = false;
    serveCount = 0;
    totalPoints = 0;
    winningScore = parseInt(gameType.value);
    isDeuce = false;
    updateScores();
    updateServer();
    updatePlayerNames();
    winnerDisplay.style.opacity = '0';
}

function launchConfetti() {
    const duration = 2 * 1000; // 2 seconds
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function checkWinner() {
    const isGameTo5 = winningScore === 5;
    if (isGameTo5 && scoreA === 4 && scoreB === 4) {
        isDeuce = true;
    } else if (!isGameTo5 && scoreA >= winningScore - 1 && scoreB >= winningScore - 1) {
        isDeuce = true;
    }

    if ((isDeuce && Math.abs(scoreA - scoreB) >= 2) || (!isDeuce && (scoreA >= winningScore || scoreB >= winningScore))) {
        gameOver = true;
        const winner = scoreA > scoreB ? playerAName.value : playerBName.value;
        winnerDisplay.textContent = `${winner} wins!`;
        winnerDisplay.style.opacity = '1';

        // Launch confetti
        launchConfetti();
    }
}


playerA.addEventListener('click', () => incrementScore('A'));
playerB.addEventListener('click', () => incrementScore('B'));
deleteABtn.addEventListener('click', () => deletePoint('A'));
deleteBBtn.addEventListener('click', () => deletePoint('B'));
resetBtn.addEventListener('click', resetGame);
playerAName.addEventListener('input', updatePlayerNames);
playerBName.addEventListener('input', updatePlayerNames);
firstServer.addEventListener('change', resetGame);
gameType.addEventListener('change', resetGame);

// Initialize the game
resetGame();