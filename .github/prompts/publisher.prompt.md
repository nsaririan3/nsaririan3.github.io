---
type: prompt
category: agent-specific
applies_to: publisher
---

# Prompt: Publisher Agent Instructions

## Objective
Validate generated content, commit changes to git, push to GitHub repository, and verify GitHub Pages deployment is triggered.

## Pre-Deployment Validation

### File Existence & Validity Check
Verify these files exist and are valid:

**HTML Files:**
- `index.html` - Check: Valid HTML structure, contains navigation, loads successfully
- `game.html` - Check: Valid HTML structure, canvas element present, game logic included
- `papers.html` - Check: Valid HTML structure, loads papers data, filters work
- All HTML files: > 5KB (indicates content exists)

**CSS File:**
- `css/style.css` - Check: Valid CSS syntax, > 2KB, Valentine's colors defined
- Contains required CSS rules (buttons, cards, responsive grid)

**Data Files:**
- `data/papers.json` - Check: Valid JSON structure, > 1KB, contains paper array
- Json structure: Has `metadata` and `papers` arrays
- All papers have required fields

**Validation Approach:**
```
For each file:
  1. Check file exists and is readable
  2. Check file size is reasonable
  3. Validate syntax (HTML/CSS/JSON)
  4. Report findings
  5. Abort if critical files invalid
```

### Console Report
```
Validation Results:
✓ index.html: 18.5KB, valid HTML
✓ game.html: 45.2KB, valid HTML, canvas found
✓ papers.html: 22.3KB, valid HTML, JSON loading script found
✓ css/style.css: 8.7KB, valid CSS
✓ data/papers.json: 125 papers, valid JSON
─────────────────────────────
All files valid ✓ Proceeding with deployment
```

## Git Operations

### Configure Git (If First Run)
```bash
git config user.name "GitHub Copilot"
git config user.email "noreply@github.com"

# In GitHub Actions, use:
git config user.name "${{ github.actor }}"
git config user.email "${{ github.actor }}@users.noreply.github.com"
```

### Stage Files
Stage all generated and updated files:
```bash
git add index.html
git add game.html
git add papers.html  
git add css/style.css
git add data/papers.json
git add data/papers-raw.json  # Include if updated
```

### Create Descriptive Commit Message

**Format:**
```
Update: [content type] - [brief description]

[Optional detailed description with stats]
```

**Examples:**
```
Update: arXiv papers - Added 5 new papers (machine learning, NLP)

- Fetched from arxiv.org at 2025-02-17T00:00:00Z
- Added papers: 5, Duplicates: 2, Errors: 0
- Total papers in database: 125
- Date range: 2025-02-10 to 2025-02-17
```

```
Update: website pages - Refreshed all HTML pages and styling

- Generated: index.html, game.html, papers.html, style.css
- Game tested: Playable, 60FPS
- Papers: Loaded dynamically from papers.json
- Responsive: Mobile/tablet/desktop tested
```

```
Update: game mechanics - Fixed ghost collision detection and power-up system
```

**Create Commit:**
```bash
git commit -m "Update: arXiv papers - Added 5 new papers (machine learning, NLP)

- Fetched from arxiv.org at 2025-02-17T00:00:00Z
- Added papers: 5
- Total papers: 125"
```

**Check Status Before Committing:**
```bash
git status  # Should show staged files
git diff --cached | head -50  # Preview changes
```

## Push to Repository

### Configure Remote URL (GitHub Actions)
```bash
# Use GITHUB_TOKEN for authentication
git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/nsaririan3/nsaririan3.github.io.git
```

### Push to Main Branch
```bash
git push origin main --verbose
```

### Verify Push Success
```bash
git log origin/main -1 --oneline
# Should show the commit you just pushed
```

## Error Handling

### Handle Merge Conflicts
If push fails with conflicts:
```
Error: [rejected] main -> main (fetch first)

Steps:
1. git pull origin main
2. Resolve conflicts manually
3. git add <resolved-files>
4. git commit -m "Merge: resolve conflicts"
5. git push origin main
```

### Network/Timeout Errors
Implement retry logic:
```bash
retry_count=0
max_retries=3
while [ $retry_count -lt $max_retries ]; do
  if git push origin main; then
    echo "Push successful"
    break
  fi
  retry_count=$((retry_count + 1))
  if [ $retry_count -lt $max_retries ]; then
    sleep $((5 * retry_count))
    echo "Retry $retry_count of $max_retries..."
  fi
done
```

### Common Issues
- **Authentication Failed:** Check GITHUB_TOKEN is set correctly
- **Nothing to Commit:** Files haven't changed, verify git tracked them
- **Protected Branch:** Verify no branch protection rules blocking direct push
- **Large Files:** Check file sizes don't exceed GitHub limits (100MB)

## Post-Deployment Verification

### Confirm Files on Main Branch
```bash
git ls-tree -r main | grep -E "\.(html|css|json)$"

# Should show:
# 100644 blob [hash]  css/style.css
# 100644 blob [hash]  data/papers.json
# 100644 blob [hash]  game.html
# 100644 blob [hash]  index.html
# 100644 blob [hash]  papers.html
```

### GitHub Pages Build Status
- GitHub Actions automatically triggers build
- Check: Repository → Settings → Pages
- Branch: main
- Status: "Your site is published at https://nsaririan3.github.io"

### Wait for Deployment
- Build time: Usually 30-60 seconds
- Deployment time: < 1 minute total
- Site updates live at: https://nsaririan3.github.io/

### Verify Live Site
Test deployed pages:
- https://nsaririan3.github.io/ (homepage)
- https://nsaririan3.github.io/game.html (game page)
- https://nsaririan3.github.io/papers.html (papers page)

## Console Output

### Success Message
```
✓ Validation: All files valid
✓ Staging: 5 files staged
✓ Commit: "Update: arXiv papers - Added 5 new papers"
  Commit: abc1234567890def
✓ Push: Pushed to origin/main
✓ Deployment: GitHub Pages build triggered
  Site: https://nsaririan3.github.io/
  Build Status: In Progress (check Actions tab)
  Estimated Time: 1-2 minutes to live

📊 Deployment Summary:
  - Files changed: 5
  - Commit hash: abc1234567890def
  - Branch: main
  - Status: ✓ Ready to Deploy
```

### Failure Message
```
✗ Validation Error:
  - index.html: Invalid HTML structure
  - papers.json: Missing required fields

Deployment Aborted. Please fix issues and retry.
```

## GitHub Actions Integration

This agent runs in GitHub Actions workflow context:
- **Trigger:** 0 5 * * * (Midnight EST daily, or manual trigger)
- **Permissions:** contents: write (for git commits/push)
- **Environment:** Ubuntu latest
- **Token:** ${{ secrets.GITHUB_TOKEN }}

### Workflow Example
```yaml
name: Update arXiv Papers

on:
  schedule:
    - cron: '0 5 * * *'  # Midnight EST (5 AM UTC)

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Configure git
        run: |
          git config --global user.name "GitHub Copilot"
          git config --global user.email "noreply@github.com"
      
      - name: Run pipeline agents
        run: |
          # Run agents in sequence
          npx @vscode/copilot-cli@latest run \
            --agents arxiv-fetcher,content-processor,html-generator,publisher
      
      - name: Report status
        if: always()
        run: echo "Pipeline execution completed"
```

## Best Practices
✓ Always validate before pushing
✓ Use descriptive commit messages
✓ Verify files staged correctly
✓ Check deployment completed successfully
✓ Monitor GitHub Actions for errors
✓ Keep credentials secure (use GITHUB_TOKEN)
✓ Don't force push to main branch
✓ Rollback only if deployment causes issues

## Troubleshooting Checklist
- [ ] All required files present and valid
- [ ] Git configured with correct user info
- [ ] Remote URL set to correct repository
- [ ] Authentication token valid and accessible
- [ ] No conflicting changes on main branch
- [ ] Commit message is clear and descriptive
- [ ] Push completed without errors
- [ ] GitHub Pages build started
- [ ] Deployment URL is accessible
- [ ] All three pages load correctly
