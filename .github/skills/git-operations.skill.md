---
type: skill
description: "Git operations including commit, push, authentication, conflict handling, and deployment verification"
---

# Git Operations Skill

## Overview
Enables agents to manage git repository operations including staging, committing, pushing, and verifying deployments with proper error handling.

## Git Configuration

### Initial Setup
```bash
# Configure git user
git config user.name "GitHub Copilot"
git config user.email "noreply@github.com"

# Or use GitHub Actions context
git config --global user.name "GitHub Copilot"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
```

### Repository Details
```
Repository: nsaririan3/nsaririan3.github.io
Owner: nsaririan3
Default Branch: main
Hosting: GitHub Pages
```

## Core Git Operations

### Stage Files
```bash
# Stage specific files
git add index.html
git add game.html
git add papers.html
git add css/style.css
git add data/papers.json

# Or stage all changes
git add .

# Verify staged files
git status
```

### Create Commits

**Commit Message Format:**
```
Update: [content type] - [brief description]

[Optional detailed description]
```

**Examples:**
```
Update: arXiv papers - Fetched 5 new papers (machine learning, NLP, quantum computing)
Update: website pages - Refreshed homepage and game HTML
Update: styling - Applied Valentine's theme updates to all pages
Update: game mechanics - Fixed ghost collision detection
```

**Create Commit:**
```bash
git commit -m "Update: arXiv papers - Fetched 5 new papers on machine learning"

# View commit details
git log -1 --stat
```

### Push to Remote

**Push to Main Branch:**
```bash
git push origin main

# Or specify:
git push --verbose --set-upstream origin main
```

**Handle Credentials (GitHub Actions):**
```bash
# GitHub Actions automatically provides GITHUB_TOKEN
git config --global credential.helper store

# Create credentials file for authentication
echo "https://oauth2:${GITHUB_TOKEN}@github.com" > ~/.git-credentials

# Or use native GitHub Actions auth
git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/nsaririan3/nsaririan3.github.io.git
```

## Advanced Operations

### Check Status
```bash
# Show working tree status
git status

# Show detailed changes
git diff

# Show staged changes
git diff --cached
```

### Handle Conflicts

```bash
# Check for conflicts
git status | grep "both"

# When push conflicts occur:
# 1. Pull latest
git pull origin main

# 2. Resolve conflicts in files
# 3. Stage resolved files
git add <resolved-file>

# 4. Complete merge
git commit -m "Merge: resolve conflicts"

# 5. Push again
git push origin main
```

### Verify Commits

```bash
# Show recent commits
git log -5 --oneline

# Show specific commit
git show [commit-hash]

# Verify commit was pushed
git log origin/main -1 --oneline
```

## GitHub Actions Context

### Available in GitHub Actions
```yaml
# Environment variables available
${{ github.actor }}           # GitHub username
${{ github.token }}           # GITHUB_TOKEN (short-lived)
${{ github.repository }}      # owner/repo
${{ github.sha }}             # Commit SHA
${{ github.ref }}             # Branch ref (refs/heads/main)
```

### Example Workflow Integration
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
      
      - name: Configure git
        run: |
          git config user.name "GitHub Copilot"
          git config user.email "noreply@github.com"
      
      - name: Run agents
        run: |
          npx @vscode/copilot-cli@latest run \
            --agents arxiv-fetcher,content-processor,html-generator,publisher
      
      - name: Push changes
        run: git push origin main
        if: success()
```

## Error Handling

### Common Errors

**Authentication Failed:**
```bash
# Error: fatal: could not read Username for 'https://github.com'
# Solution: Configure token
export GIT_TERMINAL_PROMPT=0
git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/nsaririan3/nsaririan3.github.io.git
```

**Nothing to Commit:**
```bash
# Error: nothing to commit, working tree clean
# Solution: Check if files actually changed
git status
# May need to regenerate files
```

**Branch Protection:**
```bash
# Error: [remote rejected] main -> main (protected branch)
# Solution: Use pull request or check branch rules
# For GitHub Pages deployment, might need to disable protection or use different branch
```

**Network Errors:**
```bash
# Error: fatal: unable to access repo
# Solution: Retry with exponential backoff
retry_count=0
while [ $retry_count -lt 3 ]; do
  if git push origin main; then
    break
  fi
  retry_count=$((retry_count + 1))
  sleep $((5 * retry_count))
done
```

## Deployment Verification

### GitHub Pages Checks

**Verify Deployment Triggered:**
```bash
# Check if push was successful
git log origin/main -1 --oneline

# GitHub Pages builds automatically
# Check: Repository Settings → Pages
```

**Check Deployment Status:**
```bash
# View Actions tab via GitHub API (optional)
# GET /repos/nsaririan3/nsaririan3.github.io/actions/runs

# Website URL: https://nsaririan3.github.io/
# Build details: https://github.com/nsaririan3/nsaririan3.github.io/actions
```

### Post-Deployment Steps

1. **Verify Files on Main Branch:**
   ```bash
   git ls-tree -r main | grep -E "\.(html|css|json)$"
   ```

2. **Wait for GitHub Pages Build:**
   - Typically takes 30-60 seconds
   - Check GitHub Actions tab for build status

3. **Test Live Site:**
   ```bash
   # Site available at:
   # - https://nsaririan3.github.io/
   # - https://nsaririan3.github.io/index.html
   # - https://nsaririan3.github.io/game.html
   # - https://nsaririan3.github.io/papers.html
   ```

## Best Practices

- ✅ Commit frequently with clear messages
- ✅ Pull before pushing to avoid conflicts
- ✅ Test changes locally before pushing
- ✅ Use descriptive commit messages
- ✅ Keep commits focused (one feature per commit)
- ✅ Verify deployment completed successfully
- ❌ Don't force push to main branch
- ❌ Don't mix unrelated changes in one commit
- ❌ Don't commit sensitive data or tokens

## Troubleshooting

### Debug Git Operations
```bash
# Enable verbose output
git push --verbose

# Check git configuration
git config --list

# Check remote URL
git remote -v

# Verify authentication
git ls-remote origin
```

### View Recent Activity
```bash
# Show last 20 commits
git log -20 --oneline --graph --all

# Show commits for specific file
git log -- data/papers.json

# Show blame for file
git blame papers.html
```
