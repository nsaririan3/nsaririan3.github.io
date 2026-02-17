# Development Process: Personal Coding Blog Website

This document describes how this website was built using an AI coding assistant, including the prompts used, what worked well, and what required iteration.

---

## 1. Architecture & Planning Phase

### Initial Request
**Prompt:** "Design a comprehensive system architecture for a Personal Coding Blog Website with Copilot agents that automatically fetch arXiv papers."

**What Was Built:**
- System architecture document (plan.md) with 4 agent types and 5 skill definitions
- GitHub Actions workflow for nightly automation
- Defined data flow: arXiv API → agents → JSON → GitHub Pages

**What Worked Well:**
- Clear modular design with separate agents for fetching, processing, generating, and publishing
- Organized folder structure (.github/agents, .github/skills, .github/prompts, .github/workflows)
- JSON-based configuration made it easy to iterate later

**Required Iteration:**
- Initially planned for UTC scheduling; later changed to EST for user's timezone
- Had to clarify that the system would fetch NEW papers daily, not just the 8 canonical papers

---

## 2. Website Generation Phase

### Initial Request
**Prompt:** "Generate HTML/CSS/JS for a website with three pages: home, game, and papers. Include a Pac-Man game and an arXiv paper feed with search/filter."

**What Was Built:**
- `index.html` - Homepage with hero section, features, and stats
- `game.html` - Pac-Man game with canvas rendering
- `papers.html` - Dynamic paper feed with search, sort, and filter
- `style.css` - Responsive design with CSS Grid and Flexbox
- `js/game.js` - Complete game engine (~450 lines)

**What Worked Well:**
- Vanilla JavaScript (no frameworks) kept it lightweight
- Canvas API for game rendering was straightforward
- Inline JavaScript in papers.html allowed dynamic filtering without build tools
- Responsive design using CSS media queries worked across devices

**Required Iteration:**
- Initial game had no game mechanics; had to add maze, ghosts, collision detection
- Game movement initially too fast; implemented frame-based throttling (move every 6 frames)
- Had to fix lives system - ghosts were killing player multiple times in one frame (added 1-second invincibility cooldown)

---

## 3. Theme Modifications

### Valentine's Day Removal
**Prompt:** "Remove all Valentine's Day theming and replace with professional blue/gray colors."

**What Was Built:**
- Changed primary color: #ff69b4 (pink) → #2563eb (blue)
- Changed secondary color: #ffb3d9 (light pink) → #64748b (gray)
- Removed all heart emojis and pink gradients from home and papers pages
- Removed the "Clean Design" feature card

**What Worked Well:**
- CSS variable replacement made it fast to update site-wide
- All changes applied consistently across three pages

**Required Iteration:**
- None - straightforward color replacement

### Valentine's Theming for Game Page Only
**Prompt:** "Keep the game page Valentine's themed with pink colors, but keep home and papers pages professional blue."

**What Was Built:**
- Added inline CSS to game.html with Valentine's theme
- Pink gradient backgrounds, hot pink headers/footers
- Red/maroon text for headings
- Pink buttons with Valentine's styling

**What Worked Well:**
- Scoped CSS to `.game-page` class prevented theme bleed
- Clear visual distinction between game and rest of site

**Required Iteration:**
- User initially wanted pink game background; changed back to black after testing
- Removed heart emoji from game title after visual testing

---

## 4. Pac-Man Game Implementation

### Core Game Mechanics
**Prompt:** "Implement a Pac-Man game with maze, ghosts, power-ups, collision detection, and scoring."

**Key Components Implemented:**

1. **Maze Generation** (40×30 grid)
   - Walls as #1e40af (dark blue)
   - Pellets as gray dots
   - Visual representation on 800×600px canvas

2. **Pac-Man Entity**
   - Gold circle (#FFD700)
   - Arrow key movement with directional queuing
   - Pellet eating system

3. **Ghost AI** (4 ghosts)
   - Blinky: Direct chase toward Pac-Man
   - Others: Random valid moves
   - Color coding: red, pink, cyan, orange

4. **Power-up System**
   - Rose emoji (🌹) spawns at 5% per frame
   - Grants 10-second heart projectile ability
   - Auto-fires hearts (💕) when active

5. **Collision Detection**
   - Ghost collision with 1-second invincibility cooldown
   - Projectile-ghost elimination
   - Wall collision prevention

6. **Scoring System**
   - Pellets: 10 points
   - Ghosts: 100 points (with combo multipliers: 2x, 4x, 8x)
   - Power-up: 200 points
   - High score saved to localStorage

**What Worked Well:**
- Frame-based movement throttling (move every 6 frames = 10 moves/sec at 60 FPS)
- Invincibility cooldown elegantly prevented cascade losses
- Modular render() function made it easy to update visuals

**Required Iteration (Multiple Cycles):**

1. **Initial Loss Bug:** Game lost all lives immediately
   - Cause: Ghost collisions happening in consecutive frames
   - Solution: Added `lastCollisionTime` and `collisionCooldown` to pacManState
   - Lessons: Temporal state management is crucial for collision systems

2. **Movement Speed Issues:** Characters initially moved too fast, then after fix moved too slowly
   - First attempt: Per-frame movement caused 60 moves/sec
   - Second attempt: Added throttling with `moveCounter < 3` but still inconsistent
   - Final solution: Centralized frame-counting with `moveCounter >= movesPerFrame` (6)
   - Lessons: Frame-based throttling must be in a single update() location

3. **Rose Power-up Not Appearing:** No visible roses on maze
   - Cause: Spawn rate was 0.15% per frame (too low)
   - Solution: Increased to 5% per frame (0.05 probability)
   - Lessons: Visual feedback needs higher spawn rates than expected; added console logging

4. **Spacebar Doing Multiple Actions:** Start/pause and fire projectile triggered simultaneously
   - Cause: Spacebar event listener called multiple functions
   - Solution: Removed fireProjectile() call; projectiles auto-fire when active
   - Lessons: Single responsibility per input key

---

## 5. ArXiv Paper Feed Implementation

### Initial Data Setup
**Prompt:** "Create a papers.json with 8 canonical papers related to machine learning, NLP, and quantum computing."

**What Was Built:**
- data/papers.json with structured paper metadata
- Fields: arxivId, title, authors, abstract, publishedDate, category, URLs

**Paper Selection Issues & Resolution:**

**Problem 1: Wrong ArXiv IDs**
- Several papers had IDs that didn't match their titles
- Example: ID 1712.06559 was supposed to be "Supervised learning with quantum features" but was titled something else

**Attempted Solutions:**
1. Used substitute papers with incorrect IDs
2. Tried generic paper titles that didn't match

**Final Solution:**
- Verified all 8 papers directly from arxiv.org pages
- Used canonical papers:
  - 1706.03762: Attention Is All You Need
  - 1810.04805: BERT
  - 1801.00862: Quantum Computing in the NISQ era
  - 2005.14165: Language Models are Few-Shot Learners (GPT-3)
  - 1804.11326: Supervised learning with quantum enhanced feature spaces
  - 1512.03385: Deep Residual Learning for Image Recognition (ResNet)
  - 1805.04492: Extending the computational reach of a noisy superconducting quantum processor
  - 1602.04938: "Why Should I Trust You?" (LIME)

**What Worked Well:**
- Fetching exact titles from arxiv.org ensured data integrity
- Maintaining all paper metadata in JSON made future updates easy

**Required Iteration:**
- Multiple rounds of fetching to get correct titles
- Had to replace wrong papers several times
- Eventually created a mapping function to display readable category names

### Category Tag Display
**Prompt:** "Make the arXiv category tags show readable names instead of codes like 'cs.CL'."

**What Was Built:**
- Added `getCategoryLabel()` function in papers.html
- Maps arxiv codes to readable names:
  - cs.CL → NLP
  - cs.LG → Machine Learning
  - quant-ph → Quantum Computing
  - cs.AI → AI

**What Worked Well:**
- Function-based mapping is maintainable and extensible
- Filters still work with original category codes internally

**Required Iteration:**
- Removed cs.CV (Computer Vision) since it's not a search keyword
- Changed ResNet paper category from cs.CV to cs.LG (Machine Learning)

---

## 6. Automation & Deployment Setup

### GitHub Actions Workflow
**Prompt:** "Set up GitHub Actions to run at midnight EST, fetch new papers, and auto-update the website."

**What Was Built:**
- `.github/workflows/arxiv-update.yml` with cron schedule
- 4 agent scripts that run sequentially
- Automatic git commit and push to GitHub Pages

**Workflow Steps:**
1. **arxiv-fetcher.agent** → Queries arXiv API for papers from last 7 days
2. **content-processor.agent** → Deduplicates and merges with existing papers
3. **html-generator.agent** → Generates index.html, game.html, papers.html
4. **publisher.agent** → Commits and pushes to GitHub Pages

**What Worked Well:**
- Cron schedule was straightforward once timezone was clarified
- Modular agent design allows easy maintenance

**Required Iteration:**
- Initial schedule was UTC; changed to EST (5 AM UTC = midnight EST)
- Had to clarify that new papers matching keywords appear daily, not just the 8 canonical ones

---

## 7. Timestamp & Timezone Fixes

### Challenge: UTC vs EST
**Prompt:** "Change all timestamps from UTC to EST timezone."

**What Was Changed:**
- data/papers.json: `2025-02-17T00:00:00Z` → `2026-02-17T00:00:00-05:00`
- Cron schedule: `0 0 * * *` (midnight UTC) → `0 5 * * *` (midnight EST)
- Documentation updated in 7 files

**What Worked Well:**
- ISO 8601 timezone offset format (-05:00) is standard and understood
- Multi-file replacement tool made bulk updates efficient

**Required Iteration:**
- None - straightforward timezone conversion

---

## Key Learnings & Best Practices

### What Worked Well Across the Project:

1. **Modular Architecture**
   - Separate HTML files for each page
   - Reusable CSS with variables
   - Modular JavaScript functions with clear responsibilities

2. **JSON as Configuration**
   - Easy to update papers without touching code
   - Automation agents can read/write without special parsing

3. **Vanilla JavaScript**
   - No build process or dependencies needed
   - Canvas API sufficient for game rendering
   - Inline JavaScript in HTML for simple interactivity

4. **Frame-Based Game Logic**
   - More predictable than per-frame movement
   - Easier to debug and tune game feel

5. **Scoped CSS**
   - Inline styles for page-specific themes (game.html)
   - Global styles in style.css for consistency

### Challenges & How They Were Resolved:

| Challenge | Cause | Solution | Iteration Count |
|-----------|-------|----------|-----------------|
| Game losing lives instantly | No collision cooldown | Added 1-sec invincibility window | 1 |
| Characters moving erratically | Inconsistent throttling location | Centralized frame counting | 2 |
| Rose power-up invisible | Too-low spawn rate (0.15% → 5%) | Increased probability + console logs | 1 |
| Spacebar doing multiple actions | Single input triggering multiple handlers | Separated start/pause from projectiles | 1 |
| ArXiv links incorrect | Wrong paper IDs | Verified all papers on arxiv.org | 3+ |
| Category tags confusing | Technical codes (cs.CL) vs readable names | Created mapping function | 1 |
| Theme consistency | Pink/red remained on game page | Scoped Valentine's CSS to game.html | 1 |
| Timezone confusion | UTC vs EST in documentation | Updated all 7 files to EST | 1 |

---

## Testing Performed

### Manual Testing:
- Navigated all 3 pages (Home, Game, Papers)
- Played Pac-Man game: movement, collision, power-ups, scoring
- Tested paper search, sort, and filter functionality
- Verified responsive design on different screen sizes
- Checked all arxiv.org links resolve correctly

### Automated Testing:
- GitHub Actions workflow validates git commits
- JSON structure validated by content-processor agent

---

## Future Enhancements

Based on current implementation, potential improvements:

1. **Game:** Difficulty levels, sound effects, leaderboard
2. **Papers:** Author filtering, saved favorites, export functionality
3. **Automation:** Email notifications for new papers, paper recommendations
4. **Design:** Dark mode, accessibility improvements (ARIA labels added but can expand)

---

## Conclusion

This project demonstrates how AI-assisted development can rapidly build a full-stack web application with automation. The iterative approach—building, testing, fixing, refining—was essential. The biggest challenges came from:

1. **Game mechanics** (collision systems, movement timing)
2. **Data accuracy** (ensuring arxiv links are correct)
3. **Timezone/configuration** (details matter for automation)

The most successful decisions were:
- Using vanilla JavaScript and HTML5 Canvas (kept it simple)
- JSON-based configuration (made updates easy)
- Modular agent design (each component has one job)
- Scoped CSS for page-specific themes (avoided conflicts)

Total development time: Single chat session with multiple refinement cycles.
