const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shootButton = document.getElementById('shootButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');

const goalWidth = 200;
const goalHeight = 100;
const goalX = (canvas.width - goalWidth) / 2;
const goalY = canvas.height - goalHeight - 10;

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
const ballRadius = 15;
let isGoal = false;
let score = 0;

let goalieX = goalX + goalWidth / 2;
const goalieWidth = 30;
const goalieHeight = 10;
let goalieSpeed = 3;
let goalieDirection = 1;

function drawGoal() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(goalX, goalY, goalWidth, goalHeight);
}

function drawGoalie() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(goalieX - goalieWidth / 2, goalY, goalieWidth, goalieHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGoal();
    drawGoalie();
    drawBall();
    if (isGoal) {
        ctx.fillStyle = 'green';
        ctx.font = '30px Arial';
        ctx.fillText('But !', canvas.width / 2 - 40, canvas.height / 2);
    }
}

function updateGoalie() {
    goalieX += goalieDirection * goalieSpeed;
    if (goalieX - goalieWidth / 2 <= goalX || goalieX + goalieWidth / 2 >= goalX + goalWidth) {
        goalieDirection *= -1;
    }
}

function shoot() {
    const targetX = goalX + Math.random() * goalWidth;
    const targetY = goalY + Math.random() * goalHeight;

    const interval = setInterval(() => {
        if (ballY > targetY) {
            ballY -= 5;
            ballX += (targetX - ballX) / 30;
            draw();
            updateGoalie();
        } else {
            clearInterval(interval);
            if (ballX > goalieX - goalieWidth / 2 && ballX < goalieX + goalieWidth / 2) {
                isGoal = false;
                score -= 1;
            } else {
                isGoal = true;
                score += 1;
            }
            draw();
            updateScore();
            setTimeout(resetGame, 2000);
        }
    }, 30);
}

function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    isGoal = false;
    draw();
}

function updateScore() {
    scoreDisplay.textContent = `Score : ${score}`;
}

function setDifficulty() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        goalieSpeed = 3;
    } else if (difficulty === 'medium') {
        goalieSpeed = 6;
    } else if (difficulty === 'hard') {
        goalieSpeed = 9;
    }
}

function moveLeft() {
    ballX -= 5;
    if (ballX - ballRadius < 0) ballX = ballRadius;
    draw();
}

function moveRight() {
    ballX += 5;
    if (ballX + ballRadius > canvas.width) ballX = canvas.width - ballRadius;
    draw();
}

shootButton.addEventListener('click', shoot);
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);
difficultySelect.addEventListener('change', setDifficulty);
canvas.addEventListener('touchstart', shoot);

draw();
updateScore();
setDifficulty();
