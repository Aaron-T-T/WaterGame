let gameRunning = false;
let dropMaker;
let score = 0;
let pollution = 0;
let timeLeft = 30;

let difficulty = "normal";

const scoreDisplay = document.getElementById("score");
const pollutionBar = document.getElementById("pollution-fill");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const modal = document.getElementById("game-over-modal");
const finalScoreDisplay = document.getElementById("final-score");

// Difficulty settings
const difficultySettings = {
    easy: {
        spawnRate: 1500,
        time: 40,
        pollutionPenalty: 5,
        scoreReward: 5,
        dropSpeed: "5s"
    },
    normal: {
        spawnRate: 1000,
        time: 30,
        pollutionPenalty: 10,
        scoreReward: 5,
        dropSpeed: "4s"
    },
    hard: {
        spawnRate: 700,
        time: 20,
        pollutionPenalty: 20,
        scoreReward: 10,
        dropSpeed: "3s"
    }
};

// Difficulty selection
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        difficulty = btn.dataset.mode;
    });
});

// Start game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
    if (gameRunning) return;

    const settings = difficultySettings[difficulty];

    gameRunning = true;
    score = 0;
    pollution = 0;
    timeLeft = settings.time;

    scoreDisplay.textContent = score;
    pollutionBar.style.width = "0%";
    timeDisplay.textContent = timeLeft;

    dropMaker = setInterval(createDrop, settings.spawnRate);

    const timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
            clearInterval(timer);
        }
    }, 1000);
}

function createDrop() {
    const settings = difficultySettings[difficulty];
    const drop = document.createElement("div");

    const isBad = Math.random() < 0.3;
    drop.className = isBad ? "water-drop bad-drop" : "water-drop good-drop";

    const size = 40 + Math.random() * 40;
    drop.style.width = drop.style.height = `${size}px`;

    const gameWidth = gameContainer.offsetWidth;
    drop.style.left = Math.random() * (gameWidth - size) + "px";

    drop.style.animationDuration = settings.dropSpeed;

    gameContainer.appendChild(drop);

    drop.addEventListener("click", () => {
        if (!gameRunning) return;

        if (isBad) {
            pollution += settings.pollutionPenalty;
            pollutionBar.style.width = pollution + "%";
            drop.style.backgroundColor = "#F5402C";
        } else {
            score += settings.scoreReward;
            scoreDisplay.textContent = score;
            drop.style.backgroundColor = "#FFC907";
            drop.style.transform = "scale(1.3)";
        }

        setTimeout(() => drop.remove(), 150);

        if (pollution >= 100) endGame();
    });

    drop.addEventListener("animationend", () => {
        if (isBad) {
            pollution += settings.pollutionPenalty;
            pollutionBar.style.width = pollution + "%";
        }
        drop.remove();

        if (pollution >= 100) endGame();
    });
}

function endGame() {
    gameRunning = false;
    clearInterval(dropMaker);

    finalScoreDisplay.textContent = score;
    modal.classList.remove("hidden");

    document.querySelectorAll(".water-drop").forEach(d => d.remove());
}

document.getElementById("restart-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
});
