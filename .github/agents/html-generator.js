#!/usr/bin/env node
/**
 * HTMLGenerator Agent
 * Generates website HTML pages with Valentine's theming
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');
const ROOT_DIR = path.join(__dirname, '../..');

/**
 * Load JSON file safely
 */
function loadJSON(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return defaultValue;
  }
}

/**
 * Generate index.html
 */
function generateIndexHTML() {
  const papers = loadJSON(PAPERS_FILE, { metadata: {}, papers: [] });
  const lastUpdated = papers.metadata?.lastUpdated || new Date().toISOString();
  const formattedDate = new Date(lastUpdated).toLocaleString();
  
  const latestPaper = papers.papers?.[0] || null;
  const latestPaperHtml = latestPaper ? `
    <div class="featured-paper">
      <h3>${latestPaper.title.substring(0, 60)}...</h3>
      <p class="authors">${latestPaper.authors.slice(0, 2).join(', ')}</p>
      <p class="date">${latestPaper.publishedDate}</p>
      <a href="papers.html" class="btn btn-secondary">View All Papers →</a>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Coding Blog</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header role="banner">
    <nav aria-label="Main Navigation">
      <h1>Personal Coding Blog</h1>
      <ul>
        <li><a href="index.html" class="active">Home</a></li>
        <li><a href="game.html">Game</a></li>
        <li><a href="papers.html">Papers</a></li>
      </ul>
    </nav>
  </header>

  <main role="main">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h2>Welcome to My Personal Coding Blog</h2>
        <p class="tagline">Explore AI research and play a classic Pac-Man game</p>
        <div class="cta-buttons">
          <a href="game.html" class="btn btn-primary">Play Pac-Man Game</a>
          <a href="papers.html" class="btn btn-secondary">Browse arXiv Papers</a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="container">
        <h2>About This Blog</h2>
        <p>Welcome to my personal coding blog! I'm passionate about machine learning, natural language processing, and quantum computing. This website combines my research interests with fun interactive experiences.</p>
        <p>Featured topics: machine learning, NLP, quantum computing, and more.</p>
      </div>
    </section>

    <!-- Latest Paper -->
    ${latestPaperHtml ? `<section class="featured">
      <div class="container">
        <h2>Latest Paper 🌹</h2>
        ${latestPaperHtml}
      </div>
    </section>` : ''}

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🎮 Play Game</h3>
            <p>Enjoy a classic Pac-Man game with power pellets and projectile abilities.</p>
          </div>
          <div class="feature-card">
            <h3>� Paper Feed</h3>
            <p>Auto-updating feed of latest arXiv papers in machine learning, NLP, and quantum computing.</p>
          </div>
          <div class="feature-card">
            <h3>🎨 Professional Design</h3>
            <p>Clean, modern design with professional blue and gray color scheme.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="container">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat">
            <div class="stat-value">${papers.papers?.length || 0}</div>
            <div class="stat-label">Papers indexed</div>
          </div>
          <div class="stat">
            <div class="stat-value">3</div>
            <div class="stat-label">Keywords tracked</div>
          </div>
          <div class="stat">
            <div class="stat-value">🌙</div>
            <div class="stat-label">Daily updates</div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer role="contentinfo">
    <p>Last updated: <time>${formattedDate}</time></p>
    <p>Built with ❤️ in 2025</p>
  </footer>
</body>
</html>`;
}

/**
 * Generate game.html
 */
function generateGameHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pac-Man Game</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header role="banner">
    <nav aria-label="Main Navigation">
      <h1>Personal Coding Blog</h1>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="game.html" class="active">Game</a></li>
        <li><a href="papers.html">Papers</a></li>
      </ul>
    </nav>
  </header>

  <main role="main" class="game-main">
    <section class="game-container">
      <h1>Pac-Man Game</h1>
      
      <div class="game-controls">
        <button id="startBtn" class="btn btn-primary" aria-label="Start Game">Start Game</button>
        <button id="pauseBtn" class="btn btn-secondary" aria-label="Pause Game">Pause</button>
      </div>

      <canvas id="gameCanvas" width="800" height="600" aria-label="Pac-Man game canvas"></canvas>

      <div class="game-info">
        <div class="info-item">Score: <span id="score">0</span></div>
        <div class="info-item">Lives: <span id="lives">❤️ ❤️ ❤️</span></div>
        <div class="info-item">High Score: <span id="highScore">0</span></div>
        <div class="info-item" id="powerupStatus"></div>
      </div>

      <div class="game-instructions">
        <h3>How to Play</h3>
        <ul>
          <li><strong>Arrow Keys</strong> - Move Pac-Man</li>
          <li><strong>Spacebar</strong> - Start/Pause game</li>
          <li><strong>Spacebar</strong> - Fire projectiles (with power pellet)</li>
          <li><strong>Objective</strong> - Eat all pellets and avoid ghosts</li>
          <li><strong>Power-up</strong> - Power pellet gives you projectile ability for 10 seconds</li>
          <li><strong>Scoring</strong> - Pellets: 10pts | Ghost: 100pts | Power-up: 200pts</li>
        </ul>
      </div>
    </section>
  </main>

  <footer role="contentinfo">
    <p>Pac-Man Game</p>
  </footer>

  <script src="js/game.js"></script>
</body>
</html>`;
}

/**
 * Generate papers.html
 */
function generatePapersHTML() {
  const papers = loadJSON(PAPERS_FILE, { metadata: {}, papers: [] });
  const lastUpdated = papers.metadata?.lastUpdated || new Date().toISOString();
  const formattedDate = new Date(lastUpdated).toLocaleString();
  const totalPapers = papers.papers?.length || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>arXiv Papers Feed</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header role="banner">
    <nav aria-label="Main Navigation">
      <h1>Personal Coding Blog</h1>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="game.html">Game</a></li>
        <li><a href="papers.html" class="active">Papers</a></li>
      </ul>
    </nav>
  </header>

  <main role="main">
    <section class="papers-section">
      <div class="container">
        <h1>Latest arXiv Papers</h1>
        <p class="subtitle">Tracking papers in machine learning, NLP, and quantum computing</p>
        
        <div class="papers-info">
          <p>Total papers: <strong>${totalPapers}</strong></p>
          <p>Last updated: <time>${formattedDate}</time></p>
          <p>Updates every midnight EST</p>
        </div>

        <!-- Search & Filter Controls -->
        <div class="controls">
          <input 
            type="text" 
            id="searchInput" 
            class="search-input" 
            placeholder="Search papers by title..."
            aria-label="Search papers"
          >
          
          <select id="sortSelect" class="sort-select" aria-label="Sort papers">
            <option value="date">Sort by: Newest First</option>
            <option value="title">Sort by: Title A-Z</option>
            <option value="author">Sort by: Author A-Z</option>
          </select>

          <div class="filters" role="group" aria-label="Filter by keyword">
            <label><input type="checkbox" value="cs.LG" checked> Machine Learning</label>
            <label><input type="checkbox" value="cs.CL" checked> NLP</label>
            <label><input type="checkbox" value="quant-ph" checked> Quantum</label>
          </div>
        </div>

        <!-- Papers Grid -->
        <div class="papers-grid" id="papersList">
          <div class="loading">Loading papers...</div>
        </div>
      </div>
    </section>
  </main>

  <footer role="contentinfo">
    <p>📚 Auto-updating arXiv paper feed</p>
  </footer>

  <script>
    // Load and render papers
    fetch('data/papers.json')
      .then(res => res.json())
      .then(data => {
        const papers = data.papers || [];
        const container = document.getElementById('papersList');
        
        if (papers.length === 0) {
          container.innerHTML = '<p class="no-papers">No papers found. Check back at midnight!</p>';
          return;
        }

        function renderPapers(filtered) {
          container.innerHTML = filtered.map(paper => \`
            <article class="paper-card">
              <h3><a href="\${paper.summaryUrl}" target="_blank">\${paper.title}</a></h3>
              <p class="authors">
                \${paper.authors.slice(0, 3).map(a => \`<span class="author">\${a}</span>\`).join(', ')}
                \${paper.authors.length > 3 ? ' et al.' : ''}
              </p>
              <p class="date">📅 \${new Date(paper.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}</p>
              <p class="abstract">\${paper.abstract.substring(0, 200)}...</p>
              <div class="tags">
                <span class="tag">\${paper.category}</span>
              </div>
              <a href="\${paper.pdfUrl}" class="btn btn-primary" target="_blank">📄 Read PDF</a>
            </article>
          \`).join('');
        }

        // Initial render
        renderPapers(papers);

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const filtered = papers.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.authors.some(a => a.toLowerCase().includes(query))
          );
          renderPapers(filtered);
        });

        // Sort functionality
        document.getElementById('sortSelect').addEventListener('change', (e) => {
          const sorted = [...papers];
          if (e.target.value === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
          } else if (e.target.value === 'author') {
            sorted.sort((a, b) => a.authors[0].localeCompare(b.authors[0]));
          } else {
            sorted.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
          }
          renderPapers(sorted);
        });
      })
      .catch(err => {
        console.error('Error loading papers:', err);
        document.getElementById('papersList').innerHTML = '<p class="error">Error loading papers</p>';
      });
  </script>
</body>
</html>`;
}

/**
 * Generate css/style.css
 */
function generateStyleCSS() {
  return `/* Professional Blue/Gray Color Palette */
:root {
  --primary-color: #2563eb;
  --primary-dark: #1e40af;
  --secondary-color: #64748b;
  --accent-color: #3b82f6;
  --white: #ffffff;
  --light-gray: #f1f5f9;
  --gray: #e2e8f0;
  --dark-gray: #334155;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
  line-height: 1.6;
  color: #333;
}

body {
  background: var(--white);
}

/* Header & Navigation */
header {
  background: var(--primary-red);
  color: var(--white);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(255, 23, 68, 0.2);
}

header h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 1px;
}

nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

nav a {
  color: var(--white);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
  text-decoration: underline;
}

nav a.active {
  border-bottom: 3px solid var(--white);
}

/* Main Container */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Sections */
section {
  margin-bottom: 3rem;
}

section h2 {
  color: var(--primary-red);
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
}

section h3 {
  color: var(--dark-red);
  margin: 1rem 0 0.5rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--light-pink), var(--pink));
  padding: 3rem 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--dark-red);
}

.tagline {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: var(--dark-red);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: var(--primary-red);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--dark-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 23, 68, 0.3);
}

.btn-secondary {
  background: var(--light-pink);
  color: var(--dark-red);
  border: 2px solid var(--pink);
}

.btn-secondary:hover {
  background: var(--pink);
  color: var(--white);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Cards & Grid */
.features-grid, .stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.feature-card, .stat {
  background: white;
  border: 2px solid var(--light-pink);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--primary-red);
  box-shadow: 0 4px 12px rgba(255, 23, 68, 0.2);
  transform: translateY(-4px);
}

.feature-card h3 {
  font-size: 1.3rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-red);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Game Section */
.game-container {
  text-align: center;
}

.game-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

#gameCanvas {
  display: block;
  margin: 0 auto;
  background: #000;
  border: 4px solid var(--primary-red);
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.game-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--light-pink);
  border-radius: 4px;
  flex-wrap: wrap;
  font-weight: 600;
  color: var(--dark-red);
}

.info-item {
  font-size: 1.1rem;
}

.game-instructions {
  background: var(--gray);
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 2rem;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.game-instructions h3 {
  color: var(--primary-red);
  text-align: center;
}

.game-instructions ul {
  list-style: none;
  padding: 1rem 0;
}

.game-instructions li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.game-instructions li:last-child {
  border-bottom: none;
}

/* Papers Section */
.papers-section {
  padding: 1rem 0;
}

.papers-info {
  background: var(--light-pink);
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
  text-align: center;
}

.papers-info p {
  margin: 0.5rem 0;
}

.controls {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.search-input, .sort-select {
  padding: 0.75rem;
  border: 2px solid var(--light-pink);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus, .sort-select:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(255, 23, 68, 0.1);
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.filters input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .papers-grid {
    grid-template-columns: 1fr;
  }
}

.paper-card {
  background: white;
  border: 2px solid var(--light-pink);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.paper-card:hover {
  border-color: var(--primary-red);
  box-shadow: 0 4px 12px rgba(255, 23, 68, 0.2);
  transform: translateY(-4px);
}

.paper-card h3 {
  margin: 0 0 0.75rem;
  line-height: 1.4;
}

.paper-card h3 a {
  color: var(--primary-red);
  text-decoration: none;
}

.paper-card h3 a:hover {
  text-decoration: underline;
}

.paper-card .authors {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.paper-card .date {
  color: var(--dark-red);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.paper-card .abstract {
  color: #555;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--light-pink);
  color: var(--dark-red);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.no-papers, .error, .loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.error {
  color: var(--primary-red);
  font-weight: 600;
}

/* Footer */
footer {
  background: var(--gray);
  padding: 2rem;
  text-align: center;
  color: #666;
  border-top: 2px solid var(--light-pink);
  margin-top: 3rem;
}

footer p {
  margin: 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  header h1 {
    font-size: 1.5rem;
  }

  nav ul {
    gap: 1rem;
  }

  .hero h2 {
    font-size: 1.8rem;
  }

  .tagline {
    font-size: 1rem;
  }

  .cta-buttons {
    gap: 0.75rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
  }

  main {
    padding: 1rem;
  }

  section h2 {
    font-size: 1.5rem;
  }

  .game-info {
    gap: 1rem;
  }

  .controls {
    flex-direction: column;
  }

  .search-input {
    min-width: unset;
  }

  .filters {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.paper-card {
  animation: slideInUp 0.3s ease-out;
}

/* Accessibility */
a:focus, button:focus {
  outline: 3px solid var(--primary-red);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🎨 HTMLGenerator Agent Started');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('');

    // Create directory structure
    const cssDir = path.join(ROOT_DIR, 'css');
    const jsDir = path.join(ROOT_DIR, 'js');
    
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
      console.log('✓ Created css/ directory');
    }
    
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
      console.log('✓ Created js/ directory');
    }

    // Generate and save files
    const files = [
      { path: path.join(ROOT_DIR, 'index.html'), content: generateIndexHTML(), name: 'index.html' },
      { path: path.join(ROOT_DIR, 'game.html'), content: generateGameHTML(), name: 'game.html' },
      { path: path.join(ROOT_DIR, 'papers.html'), content: generatePapersHTML(), name: 'papers.html' },
      { path: path.join(cssDir, 'style.css'), content: generateStyleCSS(), name: 'css/style.css' }
    ];

    console.log('Generating HTML and CSS files...');
    files.forEach(file => {
      fs.writeFileSync(file.path, file.content);
      const sizeKb = (file.content.length / 1024).toFixed(1);
      console.log(`✓ Generated ${file.name} (${sizeKb}KB)`);
    });

    console.log('');
    console.log('✅ HTMLGenerator Agent Completed Successfully');
    console.log(`📊 Generated 4 files:`);
    console.log(`   - index.html (homepage)`);
    console.log(`   - game.html (Pac-Man game)`);
    console.log(`   - papers.html (paper feed)`);
    console.log(`   - css/style.css (Professional styling)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ HTMLGenerator Agent Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
