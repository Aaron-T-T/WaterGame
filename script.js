// -------------------------------
// GAME STATE
// -------------------------------
let gameRunning = false;
let dropMaker;
let score = 0;
let pollution = 0;
let timeLeft = 30;

// DOM elements
const scoreDisplay = document.getElementById("score");
const pollutionBar = document.getElementById("pollution-fill");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");

// -------------------------------
// START GAME
// -------------------------------
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  pollution = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  pollutionBar.style.width = "0%";
  timeDisplay.textContent = timeLeft;

  // Spawn drops every second
  dropMaker = setInterval(createDrop, 1000);

  // Countdown timer
  const timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
      clearInterval(timer);
    }
  }, 1000);
}

// -------------------------------
// CREATE DROP
// -------------------------------
function createDrop() {
  const drop = document.createElement("div");

  // 70% chance good drop, 30% bad drop
  const isBad = Math.random() < 0.3;
  drop.className = isBad ? "water-drop bad-drop" : "water-drop good-drop";

  // Size variety
  const size = 40 + Math.random() * 40;
  drop.style.width = drop.style.height = `${size}px`;

  // Random X position
  const gameWidth = gameContainer.offsetWidth;
  drop.style.left = Math.random() * (gameWidth - size) + "px";

  // Fall speed
  drop.style.animationDuration = "4s";

  // Add to screen
  gameContainer.appendChild(drop);

  // CLICK INTERACTION
  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBad) {
      pollution += 10;
      pollutionBar.style.width = pollution + "%";
      drop.style.backgroundColor = "#F5402C"; // charity: water red
    } else {
      score += 5;
      scoreDisplay.textContent = score;

      // Visual feedback
      drop.style.backgroundColor = "#FFC907"; // charity: water yellow
      drop.style.transform = "scale(1.3)";
    }

    // Remove after click
    setTimeout(() => drop.remove(), 150);

    // Lose condition
    if (pollution >= 100) {
      endGame();
    }
  });

  // If drop reaches bottom without being clicked
  drop.addEventListener("animationend", () => {
    if (isBad) {
      pollution += 10;
      pollutionBar.style.width = pollution + "%";
    }
    drop.remove();

    if (pollution >= 100) {
      endGame();
    }
  });
}

// -------------------------------
// END GAME
// -------------------------------
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);

  alert(`Game Over! Your score: ${score}`);

  // Clear remaining drops
  document.querySelectorAll(".water-drop").forEach(d => d.remove());
}
