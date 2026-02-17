---
type: skill
description: "Generate semantic HTML5, create responsive layouts, implement CSS Grid/Flexbox, and generate SVG graphics"
---

# HTML Generation Skill

## Overview
Enables agents to generate semantic, accessible, responsive HTML5 pages with modern CSS layouts and inline SVG graphics.

## HTML5 Semantic Structure

### Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header role="banner">
    <!-- Navigation and branding -->
  </header>
  <main role="main">
    <!-- Primary content -->
  </main>
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Semantic Elements
- `<header>` - Page header with logo/branding
- `<nav>` - Navigation sections
- `<main>` - Primary page content (one per page)
- `<article>` - Self-contained content (paper cards, game sections)
- `<section>` - Thematic groupings
- `<aside>` - Side content
- `<footer>` - Page footer

### Accessibility Attributes
```html
<nav aria-label="Main Navigation">
<article role="doc-article">
<button aria-label="Start Game">
<img src="..." alt="Description">
```

## Responsive Design Patterns

### Mobile-First CSS
```css
/* Base styles (mobile) */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    gap: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    gap: 3rem;
  }
}
```

### CSS Grid Layouts

**Responsive Grid:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

**Paper Card Grid:**
```css
.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .papers-grid {
    grid-template-columns: 1fr;
  }
}
```

### CSS Flexbox Layouts

**Horizontal Navigation:**
```css
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
```

**Vertical Stack:**
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

## Canvas/Game Structures

### Canvas Implementation
```html
<canvas id="gameCanvas" width="800" height="600"></canvas>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Update game state
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw game elements
}

gameLoop();
</script>
```

### Responsive Canvas
```javascript
function resizeCanvas() {
  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = Math.min(600, width * 0.75);
  canvas.width = width;
  canvas.height = height;
  // Scale game coordinates
}

window.addEventListener('resize', resizeCanvas);
```

## SVG Graphics

### Inline SVG Examples

**Heart Shape:**
```html
<svg width="20" height="20" viewBox="0 0 20 20">
  <path d="M10 18c0 0-8-4-8-10c0-2.4 1.6-4 4-4c1.4 0 2.6 0.8 3 1.6c0.4-0.8 1.6-1.6 3-1.6c2.4 0 4 1.6 4 4C18 14 10 18 10 18z" 
        fill="#ff1744"/>
</svg>
```

**Rose (Simplified):**
```html
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- Stem -->
  <line x1="12" y1="4" x2="12" y2="20" stroke="#228B22" stroke-width="2"/>
  <!-- Petals -->
  <circle cx="12" cy="6" r="3.5" fill="#FF1744"/>
  <circle cx="15" cy="8" r="2.5" fill="#FF69B4"/>
  <circle cx="14" cy="11" r="2" fill="#FF1744"/>
  <circle cx="10" cy="11" r="2" fill="#FF1744"/>
  <circle cx="9" cy="8" r="2.5" fill="#FF69B4"/>
</svg>
```

## Code Organization

### Directory Structure
```
css/
├── style.css          # All page styles
images/
├── heart.svg          # Heart emoji/graphics
├── rose.svg           # Rose graphics
js/
├── game.js            # Game logic
├── utils.js           # Utility functions
index.html
game.html
papers.html
```

### CSS Organization
```css
/* 1. CSS Variables / Root Styles */
:root {
  --primary-red: #ff1744;
  --pink: #ff69b4;
  /* ... */
}

/* 2. Typography */
body {
  font-family: 'Segoe UI', sans-serif;
}

/* 3. Layout Utilities */
.container { }
.grid { }
.flex { }

/* 4. Page Sections */
header { }
nav { }
main { }
footer { }

/* 5. Components */
.card { }
.button { }
.input { }

/* 6. Responsive Media Queries */
@media (max-width: 768px) { }
```

## Valentine's Theme Integration

### Color Scheme
```css
:root {
  --red: #ff1744;          /* Primary red */
  --pink: #ff69b4;         /* Secondary pink */
  --dark-red: #c41c3b;     /* Dark accent */
  --white: #ffffff;        /* Background */
  --light-pink: #ffb3d9;   /* Light background */
  --gray: #f5f5f5;         /* Neutral */
}
```

### Themed Elements
```html
<!-- Heart decorations -->
<div class="decoration">❤️</div>

<!-- Gradient backgrounds -->
<div style="background: linear-gradient(135deg, var(--light-pink), var(--red))">

<!-- Themed buttons -->
<button class="btn-primary">💕 Start Game</button>
```

## Performance Best Practices

- Minimize inline CSS (use external stylesheet)
- Lazy load images (but use SVG where possible)
- Use CSS Grid/Flexbox instead of floats
- Minimize JavaScript execution time
- Use hardware acceleration (transform, opacity)
- Avoid layout thrashing

## Accessibility Requirements

- Alt text for all images: `<img alt="description">`
- ARIA labels: `<button aria-label="action">`
- Semantic HTML structure
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- Focus indicators on interactive elements
