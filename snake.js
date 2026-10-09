const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");

const size = 20;
const cells = canvas.width / size;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let direction = { x: 1, y: 0 };
let food = { x: 15, y: 10 };
let score = 0;
let started = false;
let gameOver = false;

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * size, food.y * size, size, size);

    // Draw the snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#7CFC00" : "green";
        ctx.fillRect(
            part.x * size,
            part.y * size,
            size - 2,
            size - 2
        );
    });
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * cells),
            y: Math.floor(Math.random() * cells)
        };
    } while (
        snake.some(part => part.x === food.x && part.y === food.y)
    );
}

function moveSnake() {
    if (!started || gameOver) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const eating = head.x === food.x && head.y === food.y;

    // Check the walls
    if (
        head.x < 0 || head.x >= cells ||
        head.y < 0 || head.y >= cells
    ) {
        endGame();
        return;
    }

    // The tail moves away if the snake isn't eating
    const body = eating ? snake : snake.slice(0, -1);

    if (body.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (eating) {
        score++;
        scoreText.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function endGame() {
    gameOver = true;
    message.textContent = "Game over! Press Enter to restart.";
}

function restart() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    score = 0;
    started = true;
    gameOver = false;

    scoreText.textContent = score;
    message.textContent = "";

    spawnFood();
    draw();
}

const directions = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
};

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (key === "enter" && gameOver) {
        restart();
        return;
    }

    const next = directions[key];

    if (!next) return;

    event.preventDefault();

    if (!started) {
        started = true;
        message.textContent = "";
    }

    // Don't allow a direct 180-degree turn
    if (next.x !== -direction.x || next.y !== -direction.y) {
        direction = next;
    }
});

spawnFood();
draw();
setInterval(moveSnake, 120);
