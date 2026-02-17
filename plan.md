# Personal Coding Blog Website - Comprehensive Project Plan

## Project Overview
A personal website hosted on GitHub Pages featuring a Valentine's-themed Pac-Man game and an auto-updating arXiv paper feed (papers matching: machine learning, natural language processing, quantum computing), orchestrated by Terminal-based Copilot agents without manual code writing.

**GitHub Repository:** nsaririan3/nsaririan3.github.io

---

## Project Structure

```
.github/
├── agents/              # Copilot CLI agents
├── skills/              # Agent skills (reusable capabilities)
└── prompts/             # Agent guidance prompts
```

---

## System Architecture

### Data Pipeline Workflow
```
arXiv Paper Fetch (Midnight) → Process & Filter → Generate HTML → Deploy to Site
              ↓
    GitHub Actions Trigger
              ↓
  ArxivFetcher Agent → ContentProcessor Agent → HTMLGenerator Agent → Publisher Agent
```

---

## 1. Agent Design

### 1.1 ArxivFetcher Agent
**Purpose:** Fetch and parse arXiv papers matching specified keywords every midnight via GitHub Actions.

**Type:** Periodic Automation Agent  
**Model:** gpt-4-turbo  
**Tools:** 
- arXiv API query capability
- JSON data parsing
- File system write access

**Responsibilities:**
- Query arXiv API for papers: machine learning, natural language processing, quantum computing
- Parse JSON responses
- Extract metadata: title, authors, abstract, publication date, PDF link
- Store results in JSON format
- Handle rate limiting

**File:** `.github/agents/arxiv-fetcher.agent.md`

---

### 1.2 ContentProcessor Agent
**Purpose:** Process raw arXiv data, filter duplicates, and prepare content for web display.

**Type:** Data Processing Agent  
**Model:** gpt-4-turbo  
**Tools:**
- JSON read/write operations
- Text processing and sanitization
- Duplicate detection
- Date parsing and sorting

**Responsibilities:**
- Read fetched arXiv papers
- Remove duplicates based on arXiv ID
- Sort by publication date (newest first)
- Sanitize HTML entities in abstracts and titles
- Store processed data in clean JSON format

**File:** `.github/agents/content-processor.agent.md`

---

### 1.3 HTMLGenerator Agent
**Purpose:** Generate website HTML pages (index.html, game.html, papers.html) based on configurations and data.

**Type:** Code Generation Agent  
**Model:** gpt-4-turbo  
**Tools:**
- HTML/CSS template rendering
- JSON data templating
- File system write access
- SVG/Canvas code generation for game

**Responsibilities:**
- Generate responsive index.html with Valentine's theme and navigation
- Generate game.html with Valentine's Pac-Man game (Classic mechanics + Rose power-up)
- Generate papers.html with dynamic arXiv paper listings
- Implement CSS styling with Valentine's color scheme (reds, pinks, whites)
- Embed game mechanics: Pac-Man movement, ghost AI, rose power-up (heart projectiles), collision detection

**File:** `.github/agents/html-generator.agent.md`

---

### 1.4 Publisher Agent
**Purpose:** Deploy generated content to GitHub Pages repository.

**Type:** Deployment Agent  
**Model:** gpt-4-turbo  
**Tools:**
- Git operations (commit, push)
- File validation
- GitHub API access

**Responsibilities:**
- Validate generated HTML files
- Commit changes to repo with descriptive messages
- Push to main branch (triggers GitHub Pages deployment)
- Handle merge conflicts
- Verify deployment success

**File:** `.github/agents/publisher.agent.md`

---

## 2. Skills Design

### 2.1 Core Skills

**arxiv-api-query.skill.md**
- Query arXiv API with multiple keywords
- Parse API responses
- Handle pagination
- Implement rate limiting (3 requests/second max)

**json-processing.skill.md**
- Read/write JSON files
- Validate JSON structure
- Merge JSON arrays
- Extract nested properties

**html-generation.skill.md**
- Generate semantic HTML5
- Create responsive layouts
- Implement CSS Grid/Flexbox
- Generate SVG graphics

**valentine-game-mechanics.skill.md**
- Implement Pac-Man movement (arrow keys)
- Ghost AI pathfinding (4 ghosts: Blinky, Pinky, Inky, Clyde)
- Collision detection
- Rose power-up mechanics (heart projectile shooting)
- Score tracking
- Game state management

**git-operations.skill.md**
- Create commits with messages
- Push to remote
- Handle authentication
- Verify commit success

---

## 3. Prompt Design

### 3.1 System Prompts

**system-coding-style.prompt.md**
General coding guidelines for all agents:
- Use semantic HTML5 elements
- Follow accessibility (WCAG 2.1 AA)
- Write clean, readable code
- Use consistent indentation (2 spaces)
- Add code comments for complex logic
- Avoid inline styles; use external CSS
- Optimize for performance
- Cross-browser compatibility

**system-html-style.prompt.md**
Specific HTML/CSS guidelines:
- Mobile-first responsive design
- Valentine's color palette: #ff1744 (red), #ff69b4 (pink), #fff (white)
- Font: 'Segoe UI', Tahoma, Geneva, sans-serif
- All pages must load in <2 seconds
- Semantic HTML structure
- No deprecated tags
- Accessibility requirements for interactive elements
- Game canvas: 800x600px initially (responsive)

---

### 3.2 Agent-Specific Prompts

**arxiv-fetcher.prompt.md**
- Search parameters: machine learning, natural language processing, quantum computing
- Fetch papers from last 7 days
- Handle API errors gracefully
- Store raw results with timestamp
- Format: JSON array with metadata

**content-processor.prompt.md**
- Remove papers fetched previously (check against existing JSON)
- Sort by publication date descending
- Validate all required fields present
- Clean special characters from abstracts
- Format author names consistently

**html-generator.prompt.md**
- Create three interconnected pages (index, game, papers)
- Game requirements:
  - Classic Pac-Man maze
  - 4 ghosts with distinct AI patterns
  - Rose power-up spawns randomly
  - Power-up grants heart projectile ability (max 3 projectiles)
  - Hearts eliminate ghosts temporarily
  - Score: 10 pts/pellet, 50 pts/fruit, 200 pts/powerup, 100-400 pts/ghost (depending on multiplier)
  - Game over when all lives lost
  - Win when all pellets eaten
- Paper listing:
  - Thumbnail grid or card layout
  - Title, authors (clickable), abstract preview
  - "Read PDF" link redirects to arXiv PDF
  - Sorting by date, title, authors
  - Search/filter functionality
- Homepage:
  - Brief bio/intro
  - Links to game and papers
  - Valentine's Day themed banner
  - Last update timestamp

**publisher.prompt.md**
- Validate all HTML files before commit
- Commit message format: "Update: [content type] - [brief description]"
- Push to main branch only
- Verify GitHub Pages deployment (check Actions tab)

---

## 4. Copilot CLI Format Requirements

All agents must follow this format:

```yaml
---
type: agent
model: gpt-4-turbo
tools:
  - skill: arxiv-api-query
  - skill: json-processing
  - skill: git-operations
description: "Brief description of agent purpose"
---

# Agent Name

[Agent-specific instructions and context]
```

All skills must follow this format:

```yaml
---
type: skill
description: "Brief description of skill capability"
---

# Skill Name

[Skill-specific instructions and examples]
```

All prompts must follow this format:

```yaml
---
type: prompt
category: "system|agent-specific"
applies_to: "agent-name|all"
---

# Prompt Title

[Prompt content]
```

---

## 5. Website Structure

### 5.1 Pages

**index.html** (Homepage)
- Valentine's Day themed banner
- Brief bio/introduction
- Quick links to game and papers feed
- Last update timestamp
- Responsive navigation

**game.html** (Valentine's Pac-Man Game)
- Game canvas (800x600px, responsive)
- Classic Pac-Man mechanics
- 4 ghosts with distinct behaviors
- Rose power-up (causes heart projectiles)
- Score display
- Lives display (3 starting)
- Game controls (arrow keys, spacebar to start/pause)
- Game over and win screens

**papers.html** (arXiv Paper Feed)
- Dynamic paper listings loaded from JSON
- Each paper shows:
  - Title
  - Authors (clickable to filter)
  - Abstract preview
  - Publication date
  - "Read PDF" link
- Filter/search by title, author, keyword
- Sort by date, title, author
- Auto-updates every midnight via GitHub Actions
- "Last Updated" timestamp

---

## 6. Automation Schedule

**GitHub Actions Workflow** (`arxiv-update-workflow.yml`)
- **Trigger:** 0 0 * * * (Midnight EST every day)
- **Steps:**
  1. Run ArxivFetcher Agent
  2. Run ContentProcessor Agent
  3. Run HTMLGenerator Agent
  4. Run Publisher Agent
  5. Verification step

---

## 7. Git Repository Structure

```
nsaririan3.github.io/
├── .github/
│   ├── agents/
│   │   ├── arxiv-fetcher.agent.md
│   │   ├── content-processor.agent.md
│   │   ├── html-generator.agent.md
│   │   └── publisher.agent.md
│   ├── skills/
│   │   ├── arxiv-api-query.skill.md
│   │   ├── json-processing.skill.md
│   │   ├── html-generation.skill.md
│   │   ├── valentine-game-mechanics.skill.md
│   │   └── git-operations.skill.md
│   ├── prompts/
│   │   ├── system-coding-style.prompt.md
│   │   ├── system-html-style.prompt.md
│   │   ├── arxiv-fetcher.prompt.md
│   │   ├── content-processor.prompt.md
│   │   ├── html-generator.prompt.md
│   │   └── publisher.prompt.md
│   └── workflows/
│       └── arxiv-update.yml
├── data/
│   └── papers.json
├── index.html
├── game.html
├── papers.html
├── css/
│   └── style.css
└── README.md
```

---

## 8. Implementation Phases

**Phase 1:** Create agent definitions and skills  
**Phase 2:** Create system and agent-specific prompts  
**Phase 3:** Generate HTML pages (index, game, papers)  
**Phase 4:** Set up GitHub Actions workflow  
**Phase 5:** Test complete pipeline end-to-end  

---

## 9. Key Technologies & APIs

- **arXiv API:** REST API for paper querying
- **GitHub Pages:** Hosting
- **GitHub Actions:** Workflow automation (midnight trigger)
- **HTML5 Canvas:** Pac-Man game rendering
- **Responsive CSS:** Mobile-first design
- **JSON:** Data storage format

---

## 10. Success Criteria

✓ Three interconnected web pages (index, game, papers)  
✓ Playable Valentine's Pac-Man game with rose power-up  
✓ arXiv feed auto-updates every midnight  
✓ All HTML/CSS follows Valentine's theme  
✓ Responsive design works on mobile/tablet/desktop  
✓ No manual code writing after initial setup  
✓ All agents follow Copilot CLI format specifications  
✓ GitHub Actions workflow runs successfully  
✓ Website deploys automatically via GitHub Pages
