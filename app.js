const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const levelSpan = document.getElementById('level');
const highscoreSpan = document.getElementById('highscore');
const clickSound = document.getElementById('clickSound');

const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let score = 0;
let level = 1;
let highscore = 0;
let d;
let speed = 100;

document.addEventListener('keydown', direction);
document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(event) {
    const key = event.target.id;
    if (key === 'left' && d !== 'RIGHT') d = 'LEFT';
    else if (key === 'up' && d !== 'DOWN') d = 'UP';
    else if (key === 'right' && d !== 'LEFT') d = 'RIGHT';
    else if (key === 'down' && d !== 'UP') d = 'DOWN';
    playClickSound();
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function direction(event) {
    const key = event.keyCode;
    if (key == 37 && d != 'RIGHT') d = 'LEFT';
    else if (key == 38 && d != 'DOWN') d = 'UP';
    else if (key == 39 && d != 'LEFT') d = 'RIGHT';
    else if (key == 40 && d != 'UP') d = 'DOWN';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? 'purple' : 'lightpurple';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        if (score % 5 == 0) {
            level++;
            speed *= 0.9;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
        food = generateFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        if (score > highscore) highscore = score;
        alert('Game Over! You have collided. Your final score is ' + score);
        score = 0;
        level = 1;
        speed = 100;
        snake = [{ x: 9 * box, y: 10 * box }];
        d = null;
        clearInterval(game);
        game = setInterval(draw, speed);
    }

    snake.unshift(newHead);
    updateScoreboard();
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasBoxes) * box,
        y: Math.floor(Math.random() * canvasBoxes) * box
    };
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function updateScoreboard() {
    scoreSpan.textContent = score;
    levelSpan.textContent = level;
    highscoreSpan.textContent = highscore;
}

let game = setInterval(draw, speed);
