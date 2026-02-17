#!/usr/bin/env node
/**
 * Publisher Agent
 * Validates, commits, and pushes generated content to GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '../..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

/**
 * Execute git command
 */
function runGit(command) {
  try {
    const result = execSync(`git -C "${ROOT_DIR}" ${command}`, { encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    throw new Error(`Git error: ${error.message}`);
  }
}

/**
 * Validate files exist and are reasonable
 */
function validateFiles() {
  console.log('Validating files...');
  
  const files = [
    { path: 'index.html', minSize: 5000 },
    { path: 'game.html', minSize: 10000 },
    { path: 'papers.html', minSize: 8000 },
    { path: 'css/style.css', minSize: 2000 },
    { path: 'data/papers.json', minSize: 500 }
  ];

  const results = [];

  for (const file of files) {
    const fullPath = path.join(ROOT_DIR, file.path);
    
    try {
      if (!fs.existsSync(fullPath)) {
        results.push({ file: file.path, status: '✗', reason: 'File not found' });
        continue;
      }

      const stats = fs.statSync(fullPath);
      const sizeKb = (stats.size / 1024).toFixed(1);

      if (stats.size < file.minSize) {
        results.push({ file: file.path, status: '⚠', reason: `Too small (${sizeKb}KB < ${(file.minSize/1024).toFixed(1)}KB)` });
      } else {
        results.push({ file: file.path, status: '✓', size: `${sizeKb}KB` });
      }
    } catch (error) {
      results.push({ file: file.path, status: '✗', reason: error.message });
    }
  }

  // Report results
  for (const result of results) {
    if (result.status === '✓') {
      console.log(`${result.status} ${result.file}: ${result.size}`);
    } else {
      console.log(`${result.status} ${result.file}: ${result.reason}`);
    }
  }

  // Check for critical failures
  const failures = results.filter(r => r.status === '✗');
  if (failures.length > 0) {
    throw new Error(`Validation failed: ${failures.map(f => f.file).join(', ')} missing`);
  }

  console.log('✓ All files validated successfully');
  return true;
}

/**
 * Configure git
 */
function configureGit() {
  console.log('Configuring Git...');
  
  try {
    runGit('config user.name "GitHub Copilot"');
    runGit('config user.email "noreply@github.com"');
    console.log('✓ Git configured');
  } catch (error) {
    console.warn('Note: Git config may already be set');
  }
}

/**
 * Stage files for commit
 */
function stageFiles() {
  console.log('Staging files for commit...');
  
  const filesToStage = [
    'index.html',
    'game.html',
    'papers.html',
    'css/style.css',
    'data/papers.json',
    'data/papers-raw.json'
  ];

  for (const file of filesToStage) {
    try {
      runGit(`add "${file}"`);
      console.log(`✓ Staged ${file}`);
    } catch (error) {
      console.warn(`⚠ Could not stage ${file}: ${error.message}`);
    }
  }
}

/**
 * Create and push commit
 */
function commitAndPush() {
  console.log('Committing and pushing changes...');
  
  // Check if there are changes to commit
  try {
    const status = runGit('status --porcelain');
    
    if (!status) {
      console.log('ℹ No changes to commit');
      return false;
    }

    // Count papers for commit message
    const papersFile = path.join(DATA_DIR, 'papers.json');
    let paperCount = '?';
    
    try {
      if (fs.existsSync(papersFile)) {
        const papers = JSON.parse(fs.readFileSync(papersFile, 'utf-8'));
        paperCount = papers.papers?.length || 0;
      }
    } catch (error) {
      console.warn('Could not read paper count');
    }

    // Create commit message
    const timestamp = new Date().toISOString();
    const commitMessage = `Update: arXiv papers & website - Automated update

- Fetched latest papers from arXiv
- Updated website pages and styling
- Total papers in database: ${paperCount}
- Timestamp: ${timestamp}`;

    // Commit
    console.log('Creating commit...');
    runGit(`commit -m "${commitMessage}"`);
    console.log('✓ Commit created');

    // Get commit hash
    const commitHash = runGit('rev-parse HEAD').substring(0, 7);
    console.log(`✓ Commit hash: ${commitHash}`);

    // Push
    console.log('Pushing to GitHub...');
    runGit('push origin main');
    console.log('✓ Pushed to origin/main');

    // Verify
    const remoteHash = runGit('rev-parse origin/main').substring(0, 7);
    if (remoteHash === commitHash) {
      console.log('✓ Push verified');
    }

    return true;
  } catch (error) {
    // Check if it's a "nothing to commit" error
    if (error.message.includes('nothing to commit')) {
      console.log('ℹ No changes to commit');
      return false;
    }
    throw error;
  }
}

/**
 * Verify deployment
 */
function verifyDeployment() {
  console.log('Verifying GitHub Pages deployment...');
  
  try {
    // Check main branch has latest code
    const mainLog = runGit('log origin/main -1 --oneline');
    console.log(`✓ Latest on main: ${mainLog}`);

    // GitHub Pages info
    const siteUrl = 'https://nsaririan3.github.io/';
    console.log(`✓ Site URL: ${siteUrl}`);
    console.log('ℹ GitHub Actions build starting...');
    console.log('ℹ Site will be live in ~1-2 minutes');

    return true;
  } catch (error) {
    console.warn('Could not verify deployment:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('📦 Publisher Agent Started');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('');

    // Validation
    validateFiles();
    console.log('');

    // Git operations
    configureGit();
    stageFiles();
    console.log('');

    // Commit and push
    const pushed = commitAndPush();
    console.log('');

    // Verification
    verifyDeployment();
    console.log('');

    if (pushed) {
      console.log('✅ Publisher Agent Completed Successfully');
      console.log('🌐 Website deployed to: https://nsaririan3.github.io/');
      console.log('📊 Check GitHub Actions for build status');
    } else {
      console.log('✅ Publisher Agent Completed (no changes to deploy)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Publisher Agent Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('- Verify git is configured correctly');
    console.error('- Check GitHub token is available');
    console.error('- Ensure repository is cloned with HTTPS');
    process.exit(1);
  }
}

main();
