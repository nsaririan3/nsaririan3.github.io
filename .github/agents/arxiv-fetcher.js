#!/usr/bin/env node
/**
 * ArxivFetcher Agent
 * Fetches and parses arXiv papers matching keywords
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Configuration
const ARXIV_API = 'https://arxiv.org/api/query';
const KEYWORDS = [
  'machine learning',
  'natural language processing',
  'quantum computing'
];

const DATA_DIR = path.join(__dirname, '../../data');
const OUTPUT_FILE = path.join(DATA_DIR, 'papers-raw.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Query arXiv API
 */
function queryArxiv(query, maxResults = 100) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query);
    const url = `${ARXIV_API}?search_query=${searchQuery}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
    
    console.log(`Querying arXiv: ${query.substring(0, 50)}...`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Parse arXiv XML response
 */
async function parseArxivResponse(xmlData) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);
  return result.feed.entry || [];
}

/**
 * Extract paper metadata from entry
 */
function extractPaperMetadata(entry) {
  try {
    // Extract arXiv ID from URL (e.g., http://arxiv.org/abs/2502.12345v1)
    const idUrl = entry.id?.[0] || '';
    const arxivIdMatch = idUrl.match(/\/(\d+\.\d+)(v\d+)?/);
    const arxivId = arxivIdMatch?.[1];
    
    if (!arxivId) return null;
    
    // Extract authors
    const authors = (entry.author || []).map(a => a.name?.[0] || 'Unknown').filter(Boolean);
    
    // Extract title
    const title = (entry.title?.[0] || '').trim();
    
    // Extract abstract
    const abstract = (entry.summary?.[0] || '').trim();
    
    // Extract published date
    let publishedDate = entry.published?.[0] || new Date().toISOString();
    publishedDate = publishedDate.split('T')[0]; // Format to YYYY-MM-DD
    
    // Extract category
    const category = entry['arxiv:primary_category']?.[0]?.$.term || 'Unknown';
    
    // Construct URLs
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    const summaryUrl = `https://arxiv.org/abs/${arxivId}`;
    
    return {
      arxivId,
      title,
      authors,
      abstract,
      category,
      publishedDate,
      pdfUrl,
      summaryUrl
    };
  } catch (error) {
    console.error('Error extracting metadata:', error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 ArxivFetcher Agent Started');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔍 Keywords: ${KEYWORDS.join(', ')}`);
    console.log('');
    
    // Build search query
    const keywordQueries = KEYWORDS.map(kw => `(ti:"${kw}" OR au:"${kw}")`).join(' OR ');
    const query = keywordQueries;
    
    // Query arXiv API with rate limiting
    console.log('Fetching from arXiv API...');
    const xmlData = await queryArxiv(query, 100);
    
    // Parse XML response
    console.log('Parsing XML response...');
    const entries = await parseArxivResponse(xmlData);
    console.log(`Got ${entries.length} entries from API`);
    
    // Extract paper metadata
    console.log('Extracting paper metadata...');
    const papers = [];
    let skipped = 0;
    
    entries.forEach((entry, index) => {
      const paper = extractPaperMetadata(entry);
      if (paper) {
        papers.push(paper);
      } else {
        skipped++;
      }
    });
    
    console.log(`✓ Extracted ${papers.length} papers, skipped ${skipped}`);
    
    // Save raw data
    const output = {
      fetchedAt: new Date().toISOString(),
      queryUsed: query.substring(0, 100),
      papers,
      totalCount: papers.length
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✓ Saved to ${OUTPUT_FILE}`);
    
    console.log('');
    console.log('✅ ArxivFetcher Agent Completed Successfully');
    console.log(`📊 Papers fetched: ${papers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ArxivFetcher Agent Error:', error.message);
    process.exit(1);
  }
}

// Install xml2js if needed
if (!fs.existsSync(path.join(__dirname, '../../node_modules/xml2js'))) {
  console.log('Installing xml2js...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

main();
