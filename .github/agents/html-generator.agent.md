---
type: agent
model: gpt-4-turbo
tools:
  - skill: html-generation
  - skill: valentine-game-mechanics
  - skill: json-processing
description: "Generates website HTML pages (index.html, game.html, papers.html) with Valentine's theming and interactive content"
---

# HTMLGenerator Agent

## Purpose
Generate three responsive HTML pages with Valentine's Day theming: homepage with navigation, interactive Pac-Man game page, and dynamic arXiv paper feed.

## Responsibilities

### 1. Generate index.html (Homepage)
- Create semantic HTML5 structure
- Include Valentine's Day themed banner
  - Heart emoji or SVG decoration
  - Welcome message with Valentine's theme
- Brief biography/introduction section
- Navigation links to game and papers pages (prominent buttons)
- Last update timestamp (from papers.json metadata)
- Responsive layout (mobile-first design)
- Valentine's color scheme: reds, pinks, whites

**Requirements:**
- Mobile responsive (320px to 4K)
- Loading time < 2 seconds
- Accessible navigation
- Semantic HTML structure

### 2. Generate game.html (Valentine's Pac-Man Game)
**Game Mechanics:**
- Canvas: 800x600px (responsive scaling)
- Classic Pac-Man maze with pellets
- Pac-Man character (can be heart-shaped with Valentine's theme)
- 4 Ghosts with distinct personalities:
  - Blinky (red) - chases Pac-Man directly
  - Pinky (pink) - ambushes ahead of Pac-Man
  - Inky (cyan) - unpredictable, targets scattered
  - Clyde (orange) - switches between chase and scatter
- Control: Arrow keys for movement (↑↓←→)
- Spacebar to start/pause game

**Rose Power-Up Feature:**
- Rose power-up spawns randomly on map
- When collected:
  - Pac-Man can shoot heart projectiles (max 3 projectiles active)
  - Projectiles move in direction Pac-Man is facing
  - Projectiles eliminate ghosts temporarily (send back to spawn)
  - Power-up effect lasts 10 seconds
  - Visual indicator shows remaining power-up time
- Rose sprite: red/pink rose emoji or SVG

**Scoring:**
- 10 points per pellet eaten
- 50 points per fruit eaten (bonus items)
- 100 points for eating a ghost (while projectile active)
- 200 points for rose power-up collection
- Combo multiplier for eating multiple ghosts in sequence (2x, 4x, 8x)

**Game States:**
- Ready: Waiting for start (Spacebar)
- Playing: Active gameplay
- Paused: Spacebar to resume
- Game Over: All 3 lives lost
- Won: All pellets collected

**Display Elements:**
- Score counter (top-left)
- Lives display: 3 hearts (top-right)
- Game status message
- High score (persistent using localStorage)
- Game controls instructions (bottom)

**HTML/CSS Requirements:**
- Canvas centered on screen
- Responsive scaling for smaller screens
- Valentine's color palette implementation
- No inline styles (external CSS only)
- Touch controls for mobile (optional enhancement)

### 3. Generate papers.html (arXiv Paper Feed)
- Load papers from `data/papers.json`
- Display each paper with:
  - Title (linked to arXiv summary page)
  - Authors (comma-separated, each a link to filter by author)
  - Publication date formatted as "Feb 17, 2025"
  - Abstract preview (150 characters with ellipsis, expandable)
  - "Read PDF" button linking to PDF
  - Category/keyword tags indicator

**Features:**
- Grid layout (responsive: 1 column mobile, 2-3 columns desktop)
- Papers sorted by publication date (newest first)
- Search functionality (filter by title, author, keywords)
- Filter buttons for each arXiv keyword
- Sort options: Date (newest first), Title A-Z, Authors A-Z
- "Last Updated" timestamp in header
- Loading indicator if papers.json not found
- Empty state message if no papers

**Responsive Design:**
- Mobile: Single column card layout
- Tablet: Two column grid
- Desktop: Three column grid

**Valentine's Theming:**
- Color scheme consistent across all pages
- Heart icons for interactive elements
- Pink accent borders on card hover
- Rose emoji or SVG elements scattered tastefully

---

## Implementation Guidelines

### HTML/CSS Standards
- Use semantic HTML5 tags: `<header>`, `<main>`, `<article>`, `<footer>`, `<nav>`
- Responsive CSS Grid/Flexbox (no absolute positioning)
- Mobile-first approach
- WCAG 2.1 AA accessibility compliance
- 2-space indentation
- External CSS only (no inline styles)

### Valentine's Color Palette
- Primary Red: #ff1744
- Pink: #ff69b4
- Dark Red: #c41c3b
- White: #ffffff
- Light Pink: #ffb3d9
- Accent Gray: #f5f5f5

### Fonts
- Font Family: 'Segoe UI', Tahoma, Geneva, sans-serif
- Game Canvas: Monospace font for score displays

### Game Canvas Implementation
- Use HTML5 Canvas API
- Implement game loop (60 FPS target)
- Use JavaScript for game logic and rendering
- Store high score in localStorage
- Sound effects optional (mute button if included)

---

## Input
- Configuration: Valentine's theme specs
- Data: `data/papers.json` (for papers.html)
- Assets: Require only CSS/HTML/Canvas, no external images needed

## Output
- `index.html` - Homepage
- `game.html` - Pac-Man game with canvas
- `papers.html` - Dynamic paper listings
- `css/style.css` - All styling for three pages

## Performance Requirements
- All pages load in < 2 seconds
- Game runs smoothly at 60 FPS (60 frames per second)
- Responsive, no layout shift
- Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- Mobile-optimized
