#!/usr/bin/env node
/**
 * ContentProcessor Agent
 * Processes raw arXiv data, removes duplicates, and prepares for web display
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const RAW_FILE = path.join(DATA_DIR, 'papers-raw.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'papers.json');

/**
 * Load JSON file safely
 */
function loadJSON(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return defaultValue;
  }
}

/**
 * Sanitize HTML entities
 */
function sanitizeHtmlEntities(text) {
  if (!text) return text;
  
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  };
  
  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }
  
  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (match, code) => String.fromCharCode(parseInt(code)));
  
  return result;
}

/**
 * Validate paper object
 */
function validatePaper(paper) {
  const required = ['arxivId', 'title', 'authors', 'abstract', 'publishedDate', 'pdfUrl', 'summaryUrl'];
  
  for (const field of required) {
    if (!(field in paper) || paper[field] === null || paper[field] === undefined) {
      return false;
    }
  }
  
  // Check authors is array
  if (!Array.isArray(paper.authors) || paper.authors.length === 0) {
    return false;
  }
  
  // Check date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paper.publishedDate)) {
    return false;
  }
  
  // Check URLs
  if (!paper.pdfUrl.startsWith('http')) return false;
  if (!paper.summaryUrl.startsWith('http')) return false;
  
  return true;
}

/**
 * Clean paper data
 */
function cleanPaper(paper) {
  const cleaned = {
    arxivId: (paper.arxivId || '').trim(),
    title: sanitizeHtmlEntities((paper.title || '').trim()),
    authors: (paper.authors || [])
      .map(a => sanitizeHtmlEntities((a || '').trim()))
      .filter(Boolean),
    abstract: sanitizeHtmlEntities((paper.abstract || '').trim()),
    publishedDate: (paper.publishedDate || '').trim(),
    pdfUrl: (paper.pdfUrl || '').trim(),
    summaryUrl: (paper.summaryUrl || '').trim(),
    category: (paper.category || 'Unknown').trim()
  };
  
  return cleaned;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🔧 ContentProcessor Agent Started');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('');
    
    // Load raw data
    console.log('Loading raw papers...');
    const rawData = loadJSON(RAW_FILE, { papers: [] });
    const rawPapers = rawData.papers || [];
    console.log(`✓ Loaded ${rawPapers.length} raw papers`);
    
    // Load existing papers
    console.log('Loading existing papers...');
    const existing = loadJSON(OUTPUT_FILE, { metadata: {}, papers: [] });
    const existingPapers = existing.papers || [];
    console.log(`✓ Loaded ${existingPapers.length} existing papers`);
    
    // Track stats
    let duplicates = 0;
    let skipped = 0;
    let added = 0;
    
    // Create set of existing arXiv IDs
    const existingIds = new Set(existingPapers.map(p => p.arxivId));
    
    // Process raw papers
    console.log('Processing papers...');
    const processedPapers = [];
    
    rawPapers.forEach(paper => {
      // Check for duplicates
      if (existingIds.has(paper.arxivId)) {
        duplicates++;
        return;
      }
      
      // Clean and validate
      const cleaned = cleanPaper(paper);
      
      if (!validatePaper(cleaned)) {
        console.log(`  ⚠️  Skipped ${paper.arxivId}: validation failed`);
        skipped++;
        return;
      }
      
      processedPapers.push(cleaned);
      added++;
    });
    
    console.log(`✓ Processed: Added ${added}, Duplicates ${duplicates}, Skipped ${skipped}`);
    
    // Merge with existing papers
    console.log('Merging with existing data...');
    const allPapers = [...processedPapers, ...existingPapers];
    
    // Sort by date (newest first)
    allPapers.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    
    // Filter: keep last 30 days only
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredPapers = allPapers.filter(p => new Date(p.publishedDate) >= thirtyDaysAgo);
    const removed = allPapers.length - filteredPapers.length;
    
    if (removed > 0) {
      console.log(`✓ Filtered out ${removed} papers older than 30 days`);
    }
    
    // Create output
    const output = {
      metadata: {
        totalCount: filteredPapers.length,
        lastUpdated: new Date().toISOString(),
        keywords: ['machine learning', 'natural language processing', 'quantum computing']
      },
      papers: filteredPapers
    };
    
    // Save output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✓ Saved to ${OUTPUT_FILE}`);
    
    console.log('');
    console.log('✅ ContentProcessor Agent Completed Successfully');
    console.log(`📊 Summary:`);
    console.log(`   New papers added: ${added}`);
    console.log(`   Duplicates ignored: ${duplicates}`);
    console.log(`   Validation errors: ${skipped}`);
    console.log(`   Total papers in database: ${filteredPapers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ContentProcessor Agent Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
