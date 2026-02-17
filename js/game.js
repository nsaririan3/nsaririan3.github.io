#!/usr/bin/env node
/**
 * Simple game.js for Valentine's Pac-Man Game
 * Full implementation of game mechanics
 */

// Game configuration
const GRID_SIZE = 20;
const MAZE_WIDTH = 40;
const MAZE_HEIGHT = 30;
const FPS = 60;

// Game state
const gameState = {
  running: false,
  paused: false,
  gameOver: false,
  gameWon: false,
  lives: 3,
  score: 0,
  highScore: localStorage.getItem('pacmanHighScore') || 0,
  pelletsRemaining: 0,
  ghostCombo: 1,
  moveCounter: 0,
  movesPerFrame: 6 // Move every 6 frames (10 moves per second at 60 FPS)
};

// Pac-Man state
const pacMan = {
  gridX: 20,
  gridY: 15,
  direction: 'right',
  nextDirection: 'right',
  mouthOpen: true,
  mouthCounter: 0
};

// Ghosts
const ghosts = [
  { name: 'Blinky', gridX: 18, gridY: 10, spawnX: 18, spawnY: 10, color: '#FF0000' },
  { name: 'Pinky', gridX: 19, gridY: 10, spawnX: 19, spawnY: 10, color: '#FFB8FF' },
  { name: 'Inky', gridX: 20, gridY: 10, spawnX: 20, spawnY: 10, color: '#00FFFF' },
  { name: 'Clyde', gridX: 21, gridY: 10, spawnX: 21, spawnY: 10, color: '#FFB847' }
];

// Power-up state
const powerUp = {
  gridX: null,
  gridY: null,
  active: false
};

const pacManState = {
  hasProjectileAbility: false,
  projectileEndTime: 0,
  lastCollisionTime: 0,
  collisionCooldown: 1000 // 1 second invincibility
};

const projectiles = [];
let lastFireTime = 0;

// Maze (simplified)
const maze = [];

// Initialize maze
function initMaze() {
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    maze[y] = [];
    for (let x = 0; x < MAZE_WIDTH; x++) {
      // Create borders and some walls
      if (x === 0 || x === MAZE_WIDTH - 1 || y === 0 || y === MAZE_HEIGHT - 1) {
        maze[y][x] = 1; // Wall
      } else if ((y === 5 || y === 15 || y === 25) && x % 3 === 0) {
        maze[y][x] = 1; // Wall
      } else if ((x === 10 || x === 20 || x === 30) && y % 4 === 0) {
        maze[y][x] = 1; // Wall
      } else {
        maze[y][x] = 2; // Pellet
      }
    }
  }
  
  // Count pellets
  gameState.pelletsRemaining = maze.flat().filter(c => c === 2).length;
}

function isWall(x, y) {
  if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) return true;
  return maze[y] && maze[y][x] === 1;
}

// DOM elements (initialized on load)
let canvas, ctx, startBtn, pauseBtn, scoreDisplay, livesDisplay, highScoreDisplay, powerupStatus;

function initDOM() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  startBtn = document.getElementById('startBtn');
  pauseBtn = document.getElementById('pauseBtn');
  scoreDisplay = document.getElementById('score');
  livesDisplay = document.getElementById('lives');
  highScoreDisplay = document.getElementById('highScore');
  powerupStatus = document.getElementById('powerupStatus');
  
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
}

document.addEventListener('keydown', (e) => {
  const arrowKeys = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down'
  };

  if (e.key in arrowKeys) {
    e.preventDefault();
    pacMan.nextDirection = arrowKeys[e.key];
    gameState.inputReceived = true;
  }

  if (e.key === ' ') {
    e.preventDefault();
    if (!gameState.running && !gameState.paused) {
      startGame();
    } else if (gameState.paused) {
      togglePause();
    }
  }
});

function startGame() {
  initMaze();
  gameState.running = true;
  gameState.paused = false;
  gameState.gameOver = false;
  gameState.gameWon = false;
  gameState.lives = 3;
  gameState.score = 0;
  gameState.ghostCombo = 1;
  pacMan.gridX = 20;
  pacMan.gridY = 15;
  pacMan.direction = 'right';
  pacManState.hasProjectileAbility = false;
  projectiles.length = 0;
  
  // Reset ghosts to spawn positions
  ghosts.forEach((ghost) => {
    ghost.gridX = ghost.spawnX;
    ghost.gridY = ghost.spawnY;
  });
  
  startBtn.textContent = 'Restart';
  pauseBtn.disabled = false;
  gameLoop();
}

function togglePause() {
  if (!gameState.running) return;
  gameState.paused = !gameState.paused;
  pauseBtn.textContent = gameState.paused ? 'Resume' : 'Pause';
  if (!gameState.paused) gameLoop();
}

function updatePacMan() {
  const nextX = pacMan.gridX + (pacMan.nextDirection === 'right' ? 1 : pacMan.nextDirection === 'left' ? -1 : 0);
  const nextY = pacMan.gridY + (pacMan.nextDirection === 'down' ? 1 : pacMan.nextDirection === 'up' ? -1 : 0);

  if (!isWall(nextX, nextY)) {
    pacMan.gridX = nextX;
    pacMan.gridY = nextY;
    pacMan.direction = pacMan.nextDirection;
  }

  // Eat pellet
  if (maze[pacMan.gridY] && maze[pacMan.gridY][pacMan.gridX] === 2) {
    maze[pacMan.gridY][pacMan.gridX] = 0;
    gameState.score += 10;
    gameState.pelletsRemaining--;
  }
}

function updateGhosts() {
  ghosts.forEach((ghost, index) => {
    const dx = pacMan.gridX - ghost.gridX;
    const dy = pacMan.gridY - ghost.gridY;

    let nextDir;
    if (index === 0) { // Blinky - direct chase
      nextDir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    } else {
      const choices = ['up', 'down', 'left', 'right'];
      const valid = choices.filter(d => {
        const nx = ghost.gridX + (d === 'right' ? 1 : d === 'left' ? -1 : 0);
        const ny = ghost.gridY + (d === 'down' ? 1 : d === 'up' ? -1 : 0);
        return !isWall(nx, ny);
      });
      nextDir = valid[Math.floor(Math.random() * valid.length)] || 'up';
    }

    const nx = ghost.gridX + (nextDir === 'right' ? 1 : nextDir === 'left' ? -1 : 0);
    const ny = ghost.gridY + (nextDir === 'down' ? 1 : nextDir === 'up' ? -1 : 0);

    if (!isWall(nx, ny)) {
      ghost.gridX = nx;
      ghost.gridY = ny;
    }
  });
}

function updateProjectiles() {
  projectiles.forEach((proj, index) => {
    const nx = proj.gridX + (proj.direction === 'right' ? 1 : proj.direction === 'left' ? -1 : 0);
    const ny = proj.gridY + (proj.direction === 'down' ? 1 : proj.direction === 'up' ? -1 : 0);

    if (isWall(nx, ny)) {
      projectiles.splice(index, 1);
    } else {
      proj.gridX = nx;
      proj.gridY = ny;
    }
  });
}

function fireProjectile() {
  if (!pacManState.hasProjectileAbility || projectiles.length >= 3 || Date.now() - lastFireTime < 200) return;

  projectiles.push({
    gridX: pacMan.gridX,
    gridY: pacMan.gridY,
    direction: pacMan.direction
  });
  lastFireTime = Date.now();
}

function checkCollisions() {
  // Projectile-ghost collisions
  projectiles.forEach((proj, pIndex) => {
    ghosts.forEach((ghost) => {
      if (proj.gridX === ghost.gridX && proj.gridY === ghost.gridY) {
        ghost.gridX = ghost.spawnX;
        ghost.gridY = ghost.spawnY;
        gameState.score += 100 * gameState.ghostCombo;
        gameState.ghostCombo = Math.min(gameState.ghostCombo * 2, 8);
        projectiles.splice(pIndex, 1);
      }
    });
  });

  // Ghost-Pac-Man collisions (with cooldown to prevent multiple collisions)
  const now = Date.now();
  if (now - pacManState.lastCollisionTime > pacManState.collisionCooldown) {
    ghosts.forEach((ghost) => {
      if (pacMan.gridX === ghost.gridX && pacMan.gridY === ghost.gridY) {
        if (!pacManState.hasProjectileAbility) {
          pacManState.lastCollisionTime = now;
          gameState.lives--;
          if (gameState.lives === 0) {
            gameState.gameOver = true;
            gameState.running = false;
          } else {
            resetPacMan();
          }
        }
      }
    });
  }

  // Win condition
  if (gameState.pelletsRemaining === 0) {
    gameState.gameWon = true;
    gameState.running = false;
    gameState.score += 1000;
  }
}

function resetPacMan() {
  pacMan.gridX = 20;
  pacMan.gridY = 15;
}

function spawnPowerUp() {
  if (!powerUp.active && Math.random() < 0.05) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * MAZE_WIDTH);
      y = Math.floor(Math.random() * MAZE_HEIGHT);
      attempts++;
    } while (attempts < 50 && (isWall(x, y) || (x === pacMan.gridX && y === pacMan.gridY)));

    if (attempts < 50) {
      powerUp.gridX = x;
      powerUp.gridY = y;
      powerUp.active = true;
      console.log('🌹 Rose spawned at', x, y);
    }
  }

  // Auto-fire projectiles when power-up is active
  if (pacManState.hasProjectileAbility && Date.now() - lastFireTime > 150) {
    fireProjectile();
  }
}

function checkPowerUpCollision() {
  if (powerUp.active && pacMan.gridX === powerUp.gridX && pacMan.gridY === powerUp.gridY) {
    pacManState.hasProjectileAbility = true;
    pacManState.projectileEndTime = Date.now() + 10000;
    powerUp.active = false;
    gameState.score += 200;
  }
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Maze
  ctx.fillStyle = '#1e40af';
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    for (let x = 0; x < MAZE_WIDTH; x++) {
      if (maze[y][x] === 1) {
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    }
  }

  // Pellets
  ctx.fillStyle = '#64748b';
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    for (let x = 0; x < MAZE_WIDTH; x++) {
      if (maze[y][x] === 2) {
        ctx.beginPath();
        ctx.arc(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Power-up (Rose)
  if (powerUp.active) {
    ctx.font = '16px Arial';
    ctx.fillText('🌹', powerUp.gridX * GRID_SIZE + 2, (powerUp.gridY + 1) * GRID_SIZE - 2);
  }

  // Pac-Man
  ctx.fillStyle = '#FFD700';
  const mouthAngle = pacMan.mouthOpen ? 0.3 : 0.1;
  const angles = { right: -mouthAngle, left: Math.PI + mouthAngle, up: Math.PI / 2 + mouthAngle, down: -Math.PI / 2 + mouthAngle };
  const startAngle = angles[pacMan.direction];

  ctx.beginPath();
  ctx.arc(pacMan.gridX * GRID_SIZE + GRID_SIZE / 2, pacMan.gridY * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 3, startAngle, startAngle + (Math.PI * 2 - mouthAngle * 2));
  ctx.lineTo(pacMan.gridX * GRID_SIZE + GRID_SIZE / 2, pacMan.gridY * GRID_SIZE + GRID_SIZE / 2);
  ctx.fill();

  if (++pacMan.mouthCounter % 10 === 0) pacMan.mouthOpen = !pacMan.mouthOpen;

  // Ghosts
  ghosts.forEach((ghost) => {
    ctx.fillStyle = ghost.color;
    ctx.fillRect(ghost.gridX * GRID_SIZE, ghost.gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ghost.gridX * GRID_SIZE + 5, ghost.gridY * GRID_SIZE + 5, 2, 0, Math.PI * 2);
    ctx.arc(ghost.gridX * GRID_SIZE + 15, ghost.gridY * GRID_SIZE + 5, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Projectiles (Hearts)
  projectiles.forEach((proj) => {
    ctx.font = '14px Arial';
    ctx.fillText('💕', proj.gridX * GRID_SIZE + 2, (proj.gridY + 1) * GRID_SIZE - 4);
  });
}

function updateUI() {
  scoreDisplay.textContent = gameState.score;
  livesDisplay.textContent = '●'.repeat(gameState.lives);
  highScoreDisplay.textContent = gameState.highScore;

  if (pacManState.hasProjectileAbility) {
    const timeRemaining = Math.max(0, (pacManState.projectileEndTime - Date.now()) / 1000);
    powerupStatus.textContent = `Power-up: ${timeRemaining.toFixed(1)}s`;
  } else {
    powerupStatus.textContent = '';
  }

  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem('pacmanHighScore', gameState.highScore);
    highScoreDisplay.textContent = gameState.highScore;
  }
}

function update() {
  if (!gameState.running || gameState.paused) return;

  // Implement frame-based movement throttling
  gameState.moveCounter++;
  const shouldMove = gameState.moveCounter >= gameState.movesPerFrame;
  if (shouldMove) {
    gameState.moveCounter = 0;
    updatePacMan();
    updateGhosts();
  }

  updateProjectiles();
  spawnPowerUp();
  checkPowerUpCollision();
  checkCollisions();

  if (Date.now() - (pacManState.projectileEndTime || 0) > 0 && pacManState.hasProjectileAbility) {
    pacManState.hasProjectileAbility = false;
  }

  updateUI();
}

function gameLoop() {
  update();
  render();

  if (gameState.running && !gameState.paused) {
    setTimeout(gameLoop, 1000 / FPS);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initMaze();
    render();
    updateUI();
    console.log('🎮 Pac-Man Game Loaded');
  });
} else {
  initDOM();
  initMaze();
  render();
  updateUI();
  console.log('🎮 Pac-Man Game Loaded');
}
