---
type: skill
description: "Implement classic Pac-Man mechanics, ghost AI, rose power-up with heart projectiles, collision detection, and game state management"
---

# Valentine's Game Mechanics Skill

## Overview
Implements complete Pac-Man game mechanics with Valentine's Day theming, including ghost AI, rose power-ups with heart projectiles, scoring, and collision detection.

## Game Architecture

### Core Components
1. **Game Loop** - Update state, render graphics, handle input
2. **Pac-Man** - Player character, movement, direction
3. **Ghosts** - AI-controlled enemies with distinct behaviors
4. **Maze** - Game board with pellets and walls
5. **Power-ups** - Rose power-up with projectile ability
6. **Collision Detection** - Pellet, ghost, wall, projectile collisions
7. **Scoring System** - Points, combos, multipliers

## Game Loop

```javascript
const FPS = 60;
const FRAME_TIME = 1000 / FPS;
let lastFrameTime = 0;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime;
  
  if (deltaTime >= FRAME_TIME) {
    update(deltaTime);
    render();
    lastFrameTime = timestamp;
  }
  
  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  // Update game state
  updatePacMan();
  updateGhosts();
  updateProjectiles();
  checkCollisions();
  updateScore();
}

function render() {
  clearCanvas();
  drawMaze();
  drawPellets();
  drawPowerUps();
  drawPacMan();
  drawGhosts();
  drawProjectiles();
  drawUI();
}
```

## Game Board/Maze

### Maze Grid
```javascript
const GRID_SIZE = 20;  // pixels per grid cell
const MAZE_WIDTH = 40;  // cells
const MAZE_HEIGHT = 30; // cells
const CANVAS_WIDTH = MAZE_WIDTH * GRID_SIZE;  // 800px
const CANVAS_HEIGHT = MAZE_HEIGHT * GRID_SIZE; // 600px

// Maze representation: 0=path, 1=wall, 2=pellet, 3=fruit
const maze = [
  [1,1,1,1,1,...],
  [1,0,0,2,0,...],
  ...
];

function drawMaze() {
  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        // Draw wall
        ctx.fillStyle = '#c41c3b';
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    });
  });
}
```

### Pellet System
```javascript
function drawPellets() {
  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 2) {
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.arc(
          x * GRID_SIZE + GRID_SIZE/2, 
          y * GRID_SIZE + GRID_SIZE/2, 
          2, 0, Math.PI * 2
        );
        ctx.fill();
      }
    });
  });
}

function eatPellet(x, y) {
  if (maze[y][x] === 2) {
    maze[y][x] = 0;
    score += 10;
    pelletsRemaining--;
  }
}
```

## Pac-Man Implementation

### Pac-Man Object
```javascript
const pacMan = {
  gridX: 20,
  gridY: 15,
  direction: 'right',  // left, right, up, down
  nextDirection: 'right',
  speed: 1,  // grid cells per frame
  mouthOpen: true,
  mouthCounter: 0
};
```

### Movement
```javascript
// Handle keyboard input
const ARROW_KEYS = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowUp': 'up',
  'ArrowDown': 'down'
};

document.addEventListener('keydown', (e) => {
  if (ARROW_KEYS[e.key]) {
    pacMan.nextDirection = ARROW_KEYS[e.key];
    gameState.inputReceived = true;
  }
});

function updatePacMan() {
  const nextX = pacMan.gridX + (pacMan.nextDirection === 'right' ? 1 : 
                               pacMan.nextDirection === 'left' ? -1 : 0);
  const nextY = pacMan.gridY + (pacMan.nextDirection === 'down' ? 1 :
                               pacMan.nextDirection === 'up' ? -1 : 0);
  
  if (!isWall(nextX, nextY)) {
    pacMan.gridX = nextX;
    pacMan.gridY = nextY;
    pacMan.direction = pacMan.nextDirection;
  }
  
  eatPellet(pacMan.gridX, pacMan.gridY);
}

function drawPacMan() {
  const x = pacMan.gridX * GRID_SIZE + GRID_SIZE/2;
  const y = pacMan.gridY * GRID_SIZE + GRID_SIZE/2;
  
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  
  const mouthAngle = pacMan.mouthOpen ? 0.3 : 0.1;
  const startAngle = {
    'right': -mouthAngle,
    'left': Math.PI + mouthAngle,
    'up': Math.PI/2 + mouthAngle,
    'down': -Math.PI/2 + mouthAngle
  }[pacMan.direction];
  
  ctx.arc(x, y, GRID_SIZE/3, startAngle, startAngle + (Math.PI * 2 - mouthAngle * 2));
  ctx.lineTo(x, y);
  ctx.fill();
  
  pacMan.mouthCounter++;
  if (pacMan.mouthCounter % 10 === 0) {
    pacMan.mouthOpen = !pacMan.mouthOpen;
  }
}
```

## Ghosts Implementation

### Ghost AI Modes

```javascript
const GHOST_PERSONALITIES = {
  blinky: { color: '#FF0000', name: 'Blinky', mode: 'chase' },
  pinky: { color: '#FFB8FF', name: 'Pinky', mode: 'ambush' },
  inky: { color: '#00FFFF', name: 'Inky', mode: 'unpredictable' },
  clyde: { color: '#FFB847', name: 'Clyde', mode: 'scatter' }
};

const ghosts = [
  { name: 'Blinky', gridX: 18, gridY: 13, color: '#FF0000' },
  { name: 'Pinky', gridX: 19, gridY: 13, color: '#FFB8FF' },
  { name: 'Inky', gridX: 20, gridY: 13, color: '#00FFFF' },
  { name: 'Clyde', gridX: 21, gridY: 13, color: '#FFB847' }
];
```

### Ghost Behaviors

**Blinky (Red) - Direct Chase:**
```javascript
function blinkyAI(ghost) {
  // Chase Pac-Man directly
  const dx = pacMan.gridX - ghost.gridX;
  const dy = pacMan.gridY - ghost.gridY;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}
```

**Pinky (Pink) - Ambush:**
```javascript
function pinkyAI(ghost) {
  // Target Pac-Man's future position (4 cells ahead)
  let targetX = pacMan.gridX;
  let targetY = pacMan.gridY;
  
  for (let i = 0; i < 4; i++) {
    if (pacMan.direction === 'right') targetX++;
    else if (pacMan.direction === 'left') targetX--;
    else if (pacMan.direction === 'down') targetY++;
    else if (pacMan.direction === 'up') targetY--;
  }
  
  const dx = targetX - ghost.gridX;
  const dy = targetY - ghost.gridY;
  
  return Math.abs(dx) > Math.abs(dy) ? 
    (dx > 0 ? 'right' : 'left') : 
    (dy > 0 ? 'down' : 'up');
}
```

**Inky (Cyan) - Unpredictable:**
```javascript
function inkyAI(ghost) {
  const choices = ['up', 'down', 'left', 'right'];
  const validMoves = choices.filter(dir => {
    const nx = ghost.gridX + (dir === 'right' ? 1 : dir === 'left' ? -1 : 0);
    const ny = ghost.gridY + (dir === 'down' ? 1 : dir === 'up' ? -1 : 0);
    return !isWall(nx, ny);
  });
  
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function updateGhosts() {
  ghosts.forEach((ghost, index) => {
    let nextDir;
    
    if (index === 0) nextDir = blinkyAI(ghost);
    else if (index === 1) nextDir = pinkyAI(ghost);
    else if (index === 2) inkyAI(ghost);
    else nextDir = scattered();
    
    const nx = ghost.gridX + (nextDir === 'right' ? 1 : nextDir === 'left' ? -1 : 0);
    const ny = ghost.gridY + (nextDir === 'down' ? 1 : nextDir === 'up' ? -1 : 0);
    
    if (!isWall(nx, ny)) {
      ghost.gridX = nx;
      ghost.gridY = ny;
    }
  });
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.fillStyle = ghost.color;
    ctx.fillRect(
      ghost.gridX * GRID_SIZE, 
      ghost.gridY * GRID_SIZE, 
      GRID_SIZE, GRID_SIZE
    );
    // Draw eyes as small circles
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ghost.gridX * GRID_SIZE + 5, ghost.gridY * GRID_SIZE + 5, 2, 0, Math.PI * 2);
    ctx.arc(ghost.gridX * GRID_SIZE + 15, ghost.gridY * GRID_SIZE + 5, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}
```

## Rose Power-Up System

### Power-Up Mechanics
```javascript
const powerUp = {
  gridX: null,
  gridY: null,
  active: false,
  spawnCounter: 0
};

const pacManState = {
  hasProjectileAbility: false,
  projectileEndTime: 0
};

function spawnPowerUp() {
  if (!powerUp.active && Math.random() < 0.001) {  // 0.1% chance per frame
    let x, y;
    do {
      x = Math.floor(Math.random() * MAZE_WIDTH);
      y = Math.floor(Math.random() * MAZE_HEIGHT);
    } while (isWall(x, y) || (x === pacMan.gridX && y === pacMan.gridY));
    
    powerUp.gridX = x;
    powerUp.gridY = y;
    powerUp.active = true;
  }
}

function drawPowerUp() {
  if (powerUp.active) {
    ctx.fillStyle = '#FF0000';  // Red rose
    ctx.font = '20px Arial';
    ctx.fillText('🌹', 
      powerUp.gridX * GRID_SIZE + 2, 
      powerUp.gridY * GRID_SIZE + 16);
  }
}

function checkPowerUpCollision() {
  if (powerUp.active && 
      pacMan.gridX === powerUp.gridX && 
      pacMan.gridY === powerUp.gridY) {
    pacManState.hasProjectileAbility = true;
    pacManState.projectileEndTime = Date.now() + 10000;  // 10 second duration
    powerUp.active = false;
    score += 200;
  }
}
```

## Heart Projectile System

### Projectile Object
```javascript
const projectiles = [];

function fireProjectile() {
  if (pacManState.hasProjectileAbility && 
      projectiles.length < 3 &&
      geme gameState.lastFired < Date.now() - 200) {  // 200ms between shots
    
    projectiles.push({
      gridX: pacMan.gridX,
      gridY: pacMan.gridY,
      direction: pacMan.direction,
      active: true
    });
    gameState.lastFired = Date.now();
  }
}

function updateProjectiles() {
  projectiles.forEach((proj, index) => {
    if (!proj.active) {
      projectiles.splice(index, 1);
      return;
    }
    
    const nextX = proj.gridX + (proj.direction === 'right' ? 1 : 
                                proj.direction === 'left' ? -1 : 0);
    const nextY = proj.gridY + (proj.direction === 'down' ? 1 :
                                proj.direction === 'up' ? -1 : 0);
    
    if (isWall(nextX, nextY)) {
      proj.active = false;
      return;
    }
    
    proj.gridX = nextX;
    proj.gridY = nextY;
  });
}

function drawProjectiles() {
  projectiles.forEach(proj => {
    if (proj.active) {
      ctx.fillStyle = '#FF1744';  // Heart red
      ctx.font = '12px Arial';
      ctx.fillText('💕',
        proj.gridX * GRID_SIZE + 4,
        proj.gridY * GRID_SIZE + 13);
    }
  });
}

// Player input for firing
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && pacManState.hasProjectileAbility) {
    fireProjectile();
  }
});
```

## Collision Detection

```javascript
function checkGhostCollision() {
  for (let ghost of ghosts) {
    if (pacMan.gridX === ghost.gridX && pacMan.gridY === ghost.gridY) {
      if (pacManState.hasProjectileAbility) {
        // Do nothing - projectile handles ghost elimination
      } else {
        gameState.lives--;
        if (gameState.lives === 0) {
          gameState.gameOver = true;
        } else {
          resetPacManPosition();
        }
      }
    }
  }
}

function checkProjectileGhostCollision() {
  projectiles.forEach((proj, pIndex) => {
    ghosts.forEach((ghost, gIndex) => {
      if (proj.gridX === ghost.gridX && proj.gridY === ghost.gridY && proj.active) {
        ghost.gridX = ghost.spawnX;
        ghost.gridY = ghost.spawnY;
        proj.active = false;
        
        score += 100 * gameState.ghostCombo;
        gameState.ghostCombo = Math.min(gameState.ghostCombo * 2, 8);
        
        projectiles.splice(pIndex, 1);
      }
    });
  });
  
  if (projectiles.length === 0) {
    gameState.ghostCombo = 1;  // Reset multiplier
  }
}

function checkWinCondition() {
  if (pelletsRemaining === 0) {
    gameState.gameWon = true;
    gameState.score += 1000;  // Bonus
  }
}
```

## Scoring System

```javascript
const SCORE = {
  PELLET: 10,
  FRUIT: 50,
  POWERUP: 200,
  GHOST: 100,  // Base, multiplied by combo
};

let score = 0;
let pelletsRemaining = 0;
let ghostCombo = 1;

function updateScore(points) {
  score += points;
  updateUI();
}

function drawUI() {
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${score}`, 10, 580);
  ctx.fillText(`Lives: ${'❤️'.repeat(gameState.lives)}`, 650, 580);
  
  if (pacManState.hasProjectileAbility) {
    const timeRemaining = Math.max(0, (pacManState.projectileEndTime - Date.now()) / 1000);
    ctx.fillText(`Power-up: ${timeRemaining.toFixed(1)}s`, 350, 580);
  }
}
```

## Game State Management

```javascript
const gameState = {
  gameRunning: false,
  gameOver: false,
  gameWon: false,
  lives: 3,
  score: 0,
  ghostCombo: 1,
  level: 1,
  inputReceived: false
};

function startGame() {
  gameState.gameRunning = true;
  gameState.gameOver = false;
  gameState.gameWon = false;
  gameState.lives = 3;
  gameState.score = 0;
}

function endGame() {
  gameState.gameRunning = false;
  if (gameState.gameWon) {
    ctx.fillText('YOU WIN! 💕', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  } else {
    ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  }
}
```
