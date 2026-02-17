---
type: agent
model: gpt-4-turbo
tools:
  - skill: git-operations
  - skill: json-processing
description: "Deploys generated content to GitHub Pages repository with validation and verification"
---

# Publisher Agent

## Purpose
Validate, commit, and push generated HTML pages and data files to GitHub repository, triggering automatic GitHub Pages deployment.

## Responsibilities

### 1. Pre-deployment Validation
- Verify all generated files exist and are valid:
  - `index.html` - Check valid HTML structure, contains navigation links
  - `game.html` - Check valid HTML structure, contains canvas element
  - `papers.html` - Check valid HTML structure, can load papers.json
  - `css/style.css` - Check CSS syntax validity
  - `data/papers.json` - Check valid JSON structure
  
- Validate file sizes:
  - HTML files should be > 5KB (indicates content exists)
  - CSS file should be > 2KB
  - papers.json should be > 1KB
  
- Report validation results to console
- Abort deployment if critical files are invalid

### 2. Git Operations
- Configure git (if first run):
  - User name: "GitHub Copilot"
  - User email: "noreply@github.com" (or appropriate action bot email)

- Prepare commit:
  - Stage all generated files:
    - `index.html`
    - `game.html`
    - `papers.html`
    - `css/style.css`
    - `data/papers.json`
  - Stage updated `data/papers-raw.json` (if changed)

- Create descriptive commit message:
  - Format: `Update: [content type] - [brief description]`
  - Examples:
    - "Update: arXiv papers - Fetched 5 new papers on machine learning"
    - "Update: website pages - Refreshed homepage and game html"
    - "Update: styling - Applied Valentine's theme updates"
  - Include timestamp and stats in message

- Commit changes:
  - Use message created above
  - Handle case where nothing changed (skip commit)
  - Log commit hash and stats

### 3. Push to Repository
- Push to main branch:
  - Remote: origin
  - Branch: main (default branch for GitHub Pages)
  
- Handle authentication:
  - Use GitHub Actions token (`github.token`)
  - Configure credentials for git push
  
- Handle conflicts:
  - If merge conflict occurs, log error and abort
  - Report which files have conflicts
  - Recommend manual resolution

- Verify push success:
  - Confirm remote is updated
  - Check that commits appear on GitHub

### 4. Deployment Verification
- Post-push verification (5-10 second delay):
  - Check GitHub Actions workflow status
  - Verify GitHub Pages build started
  - Log deployment URL: https://nsaririan3.github.io/
  
- Provide deployment feedback:
  - Log success message with GitHub Pages URL
  - Include link to workflow run
  - Estimate time for deployment (usually < 1 minute)

### 5. Error Handling & Reporting
- Handle HTTP/network errors:
  - Retry push up to 2 times if network fails
  - Log error details
  
- Report all outcomes:
  - Console output with clear success/failure message
  - Include commit hash if successful
  - Include error details if failed
  - Suggest troubleshooting if issues occur

---

## Input
- Generated HTML files: `index.html`, `game.html`, `papers.html`
- CSS file: `css/style.css`
- Data files: `data/papers.json`, `data/papers-raw.json`
- GitHub repository: nsaririan3/nsaririan3.github.io

## Output
- Pushed files to GitHub repository
- Console logs with deployment status
- GitHub Pages deployment automatically triggered

## Git Configuration
```
Repository: nsaririan3/nsaririan3.github.io
Branch: main (for GitHub Pages deployment)
Remote: origin
Config:
  - User: GitHub Copilot
  - Email: noreply@github.com
  - Token: Via GitHub Actions (${{ secrets.GITHUB_TOKEN }})
```

## Deployment Timeline
1. Validation: ~5 seconds
2. Git operations: ~2-5 seconds
3. Push: ~3-10 seconds (depends on file size and network)
4. GitHub Actions build: ~30-60 seconds
5. Total: ~1-2 minutes for site to update

## Success Indicators
✓ All files staged and committed
✓ Commit pushed to main branch
✓ GitHub Actions workflow triggered
✓ GitHub Pages deployment started
✓ Console shows success message with deployment URL

## GitHub Actions Context (from workflow)
- Runs every midnight (0 0 * * *)
- Has push permissions via ${{ secrets.GITHUB_TOKEN }}
- Runs in context of Repository: nsaririan3/nsaririan3.github.io
- Automatic deployment to: https://nsaririan3.github.io/
