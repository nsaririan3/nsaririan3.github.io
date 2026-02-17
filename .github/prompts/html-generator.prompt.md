---
type: prompt
category: agent-specific
applies_to: html-generator
---

# Prompt: HTMLGenerator Agent Instructions

## Objective
Generate three interconnected Valentine's Day themed web pages: homepage, interactive Pac-Man game page, and dynamic arXiv paper feed page. All pages must be responsive, accessible, and follow Valentine's color scheme.

## Pages to Generate

### 1. index.html (Homepage)

**Purpose:** Welcome page with navigation to other sections

**Required Sections:**
- **Header with Navigation:**
  - Logo/title "Personal Coding Blog"
  - Links to: Home (active), Game, Papers
  - Valentine's color scheme (red background)

- **Hero Section:**
  - Large Valentine's Day themed banner
  - Welcome message with hearts (❤️, 💕, 🌹)
  - Brief introduction (3-4 sentences)
  - Call-to-action buttons:
    - "Play Pac-Man Game" → game.html
    - "Browse Papers" → papers.html

- **About Section:**
  - Short bio (2-3 paragraphs)
  - Research interests: machine learning, NLP, quantum computing
  - Contact information (optional email link)

- **Featured Content Preview:**
  - Highlight latest paper added
  - Game description/features
  - Last update timestamp

- **Footer:**
  - Copyright information
  - Links to papers page and game
  - Social links (if applicable)
  - Valentine's Day emoji decorations

**Design Requirements:**
- Mobile responsive (320px to 4K)
- Sticky navigation header
- Smooth scrolling
- Valentine's colors throughout
- Load time < 2 seconds

---

### 2. game.html (Valentine's Pac-Man Game)

**Purpose:** Interactive Valentine's themed Pac-Man game

**Game Features:**

**Core Gameplay:**
- **Canvas:** 800x600px (responsive scaling for smaller screens)
- **Maze:** Classic Pac-Man maze layout with walls and pellets
- **Pac-Man:** Yellow character with animation (mouth opening/closing)
- **Ghosts:** 4 distinct ghosts with unique colors and AI behaviors
  - Blinky (Red) - Direct chase
  - Pinky (Pink) - Ambush ahead  
  - Inky (Cyan) - Unpredictable
  - Clyde (Orange) - Scatter/chase patterns

**Controls:**
- Arrow Keys: Move Pac-Man (↑↓←→)
- Spacebar: Start/Pause game
- While power-up active: Spacebar fires heart projectiles

**Rose Power-Up (Valentine's Feature):**
- Spawns randomly on map occasionally
- When collected: Pac-Man gains projectile ability
- Effect lasts 10 seconds
- Shows visual timer
- Can fire up to 3 heart projectiles (❤️) simultaneously
- Projectiles eliminate ghosts (send to spawn point)
- Each ghost eliminated adds points (100 × combo multiplier)

**Scoring System:**
- 10 points per pellet eaten
- 50 points per fruit bonus item
- 100 points per ghost eliminated (while projectile active)
- 200 points for collecting rose power-up
- Combo multiplier increases with consecutive ghost eliminations (2x, 4x, 8x max)
- Bonus when all pellets cleared

**Game States:**
- **Ready:** Waiting for spacebar (shows instructions)
- **Playing:** Active gameplay
- **Paused:** Spacebar to resume
- **Game Over:** All 3 lives lost (show high score)
- **Won:** All pellets collected (show bonus)

**Display Elements:**
- Score counter (top-left)
- Lives display: 3 hearts (❤️) (top-right)
- Power-up timer (when active)
- High score (persistent via localStorage)
- Game status message
- Game instructions (visible when paused/ready)

**HTML Structure:**
```html
<div class="game-container">
  <h1>Valentine's Pac-Man Game</h1>
  <div class="game-controls">
    <button id="startBtn">Start Game</button>
    <button id="pauseBtn">Pause</button>
  </div>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <div class="game-info">
    <div>Score: <span id="score">0</span></div>
    <div>Lives: <span id="lives">❤️❤️❤️</span></div>
    <div>High Score: <span id="highScore">0</span></div>
  </div>
  <div class="game-instructions">
    <p>Arrow Keys to Move • Spacebar to Start/Pause • Spacebar to Fire (with power-up)</p>
  </div>
</div>
```

**Implementation Requirements:**
- Use HTML5 Canvas API for rendering
- JavaScript game loop at 60 FPS
- localStorage for high score persistence
- Responsive canvas scaling for mobile
- Sound effects optional (include mute button if added)
- No external game libraries required

---

### 3. papers.html (arXiv Paper Feed)

**Purpose:** Display and filter dynamic arXiv paper listings

**Data Source:** Load from `data/papers.json`

**Paper Display Card Components:**
Each paper shows:
- **Title** (linked to arXiv summary)
- **Authors** (comma-separated, each clickable)
- **Publication Date** (formatted as "Feb 17, 2025")
- **Abstract** (150-char preview with "Read More" option)
- **"Read PDF"** button (links to PDF)
- **Category Tags** (machine learning, NLP, quantum computing)

**Card Layout:**
```html
<article class="paper-card">
  <h3><a href="https://arxiv.org/abs/2502.12345">Paper Title</a></h3>
  <p class="authors">
    <span class="author"><a href="#author=Name">Author Name</a></span>,
    <span class="author"><a href="#author=Name2">Author Name 2</a></span>
  </p>
  <p class="date">Published: Feb 17, 2025</p>
  <p class="abstract">
    Abstract preview text...
    <button class="expand-btn" hidden>Read More</button>
  </p>
  <div class="tags">
    <span class="tag">machine learning</span>
  </div>
  <a class="btn btn-primary" href="https://arxiv.org/pdf/2502.12345.pdf">
    📄 Read PDF
  </a>
</article>
```

**Layout:**
- Grid layout (responsive: 1 column mobile → 2 tablet → 3 columns desktop)
- Card styling with Valentine's colors
- Smooth hover effects (scale, shadow)
- Sticky header with filters

**Features:**

**Search & Filter:**
- Search by paper title (case-insensitive)
- Filter by author name (remember: each author is clickable)
- Filter by keyword (machine learning, NLP, quantum computing)
- Combine multiple filters (AND logic)

**Sort Options:**
- By date (newest first) - **default**
- By title (A-Z)
- By author (first author A-Z)

**Header Section:**
- "Latest arXiv Papers" title
- Last updated timestamp (from papers.json metadata)
- Auto-refresh indicator (updates nightly)
- Search input field
- Filter buttons/checkboxes
- Sort dropdown

**Empty States:**
- If `papers.json` missing: Show "Loading papers..." message
- If no papers match filters: Show "No papers found" message
- Loading animation while fetching data

**HTML Structure:**
```html
<main>
  <header>
    <h1>Latest arXiv Papers</h1>
    <p class="last-updated">Last updated: <time>2025-02-17 00:00</time></p>
  </header>
  
  <div class="controls">
    <input type="text" class="search-input" placeholder="Search papers...">
    <select class="sort-select">
      <option value="date">Sort by: Newest First</option>
      <option value="title">Sort by: Title</option>
      <option value="author">Sort by: Author</option>
    </select>
    <div class="filters">
      <label><input type="checkbox" value="ml"> Machine Learning</label>
      <label><input type="checkbox" value="nlp"> Natural Language Processing</label>
      <label><input type="checkbox" value="qc"> Quantum Computing</label>
    </div>
  </div>

  <div class="papers-grid" id="papersList">
    <!-- Papers loaded dynamically -->
  </div>
</main>
```

**JavaScript Requirements:**
- Load JSON from `data/papers.json`
- Dynamically render paper cards
- Implement search/filter logic
- Handle sorting
- Format dates (timestamp → "Feb 17, 2025")
- Truncate abstracts to 150 characters
- Error handling if JSON missing

---

## Common Requirements (All Pages)

### Visual Design
- **Color Scheme:** Use Valentine's palette from system-html-style.prompt.md
- **Fonts:** 'Segoe UI', Tahoma, Geneva, sans-serif
- **Spacing:** Consistent 1.5rem gap between sections
- **Borders:** 2px red borders on cards
- **Shadows:** Subtle shadows on interactive elements

### Responsiveness
Breakpoints:
- Mobile: < 480px (1-column layouts)
- Tablet: 480px-768px (2-column layouts)  
- Desktop: > 768px (3-column layouts)

Test at: 320px, 768px, 1024px, 1440px

### Accessibility
- Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ARIA labels on interactive elements
- Color contrast ≥ 4.5:1
- Keyboard navigation support
- Alt text for images
- Focus visible indicators

### Performance
- All CSS in single `css/style.css` file
- No inline styles
- Load time target < 2 seconds
- Game runs at 60 FPS
- Optimize image delivery (use CSS/SVG where possible)

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## Output Files
1. `index.html` - Homepage
2. `game.html` - Pac-Man game page
3. `papers.html` - arXiv papers feed
4. `css/style.css` - All styling (created as one file)

## File Format
- UTF-8 encoding
- 2-space indentation
- No external dependencies (pure HTML/CSS/JavaScript)
- Validate HTML5 compliance

## Success Indicators
✓ All three pages load and render correctly
✓ Game is playable and responsive
✓ Papers load from JSON and display
✓ Responsive design works on mobile/tablet/desktop
✓ Valentine's theme applied throughout
✓ Page load time < 2 seconds
✓ No console errors
✓ Accessibility compliant
