---
type: prompt
category: system
applies_to: all
---

# System: HTML/CSS Styling Guide

## Valentine's Day Color Palette

**Primary Colors:**
```css
--primary-red: #ff1744           /* Vibrant red for primary elements */
--pink: #ff69b4                  /* Hot pink for secondary elements */
--dark-red: #c41c3b              /* Dark red for accents and borders */
--white: #ffffff                 /* Clean white for backgrounds */
--light-pink: #ffb3d9            /* Light pink for subtle backgrounds */
--accent-gray: #f5f5f5           /* Neutral gray for alternates */
```

**Usage Guidelines:**
- Primary Red: Main buttons, headings, primary call-to-actions
- Pink: Links, secondary buttons, highlights
- Dark Red: Borders, shadows, emphasis
- White: Main background
- Light Pink: Card backgrounds, section dividers
- Accent Gray: Alternate rows, disabled states

## Typography

**Font Stack:**
```css
font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
```

**Size Hierarchy:**
```
Display (Hero): 48px, bold
Heading 1: 32px, bold
Heading 2: 24px, semi-bold
Heading 3: 20px, semi-bold
Body: 16px, regular
Small: 14px, regular
Caption: 12px, regular
```

**Line Height:**
```
Headings: 1.2
Body: 1.6
Compact: 1.4
```

## Responsive Breakpoints

```css
Mobile: < 480px
Small Tablet: 480px - 768px
Tablet: 768px - 1024px
Desktop: 1024px - 1440px
Large Desktop: > 1440px
```

**Mobile-First Approach:**
1. Write CSS for mobile first
2. Add `@media (min-width: ...)` for larger screens
3. Avoid `max-width` queries when possible

## Layout Patterns

### Container Layout
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.75rem;
  }
}
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

### Flex Stack
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stack-horizontal {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}
```

## Card Component
```css
.card {
  background: white;
  border: 2px solid var(--light-pink);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(255, 23, 68, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--primary-red);
  box-shadow: 0 4px 12px rgba(255, 23, 68, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }
}
```

## Button Styles
```css
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-red);
  color: white;
}

.btn-primary:hover {
  background: var(--dark-red);
  transform: scale(1.05);
}

.btn-secondary {
  background: var(--light-pink);
  color: var(--dark-red);
}

.btn-secondary:hover {
  background: var(--pink);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Navigation
```css
nav {
  background: var(--primary-red);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: opacity 0.2s;
}

nav a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

nav a.active {
  border-bottom: 3px solid white;
}
```

## Input & Form Elements
```css
input, textarea, select {
  font-family: inherit;
  padding: 0.75rem;
  border: 2px solid var(--light-pink);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(255, 23, 68, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark-red);
}
```

## Canvas Game Styling
```css
#gameCanvas {
  display: block;
  margin: 0 auto;
  background: black;
  border: 3px solid var(--primary-red);
  max-width: 100%;
  height: auto;
}

.game-container {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--light-pink), var(--white));
}

.game-info {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--dark-red);
}
```

## Animations

**Fade In:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**Slide In:**
```css
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
```

**Heartbeat (Valentine's):**
```css
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.heart {
  animation: heartbeat 1.5s ease-in-out infinite;
}
```

## Accessibility Requirements

**Color Contrast:**
- Normal text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Test: https://webaim.org/resources/contrastchecker/

**Focus States:**
```css
:focus, :focus-visible {
  outline: 3px solid var(--primary-red);
  outline-offset: 2px;
}
```

**No Inline Styles:**
- All styling in external CSS only
- Use CSS classes for all styling
- Avoid styling in HTML attributes

## Responsive Images
```html
<img src="image.jpg" alt="Description">

<picture>
  <source media="(max-width: 768px)" srcset="small.jpg">
  <source media="(min-width: 769px)" srcset="large.jpg">
  <img src="fallback.jpg" alt="Description">
</picture>
```

## Performance Tips
- Minimize CSS file size
- Use CSS Grid/Flexbox (no float layouts)
- Avoid `!important` declarations
- Use shorthand properties
- Defer loading of non-critical CSS
- Combine similar selectors
