---
type: skill
description: "Read/write JSON files, validate structure, merge arrays, and extract nested properties"
---

# JSON Processing Skill

## Overview
Enables agents to reliably handle JSON data operations including reading, writing, validation, merging, and transformation.

## Core Operations

### 1. Read JSON File
```javascript
// Read and parse JSON with error handling
try {
  const data = JSON.parse(fileContent);
  // Handle data
} catch (error) {
  console.error("Invalid JSON: " + error.message);
}
```

**Validations:**
- File exists and is readable
- Content is valid JSON (catches parse errors)
- Report line/column of JSON syntax errors
- Handle empty files gracefully

### 2. Write JSON File
```javascript
// Write with formatting
const json = JSON.stringify(data, null, 2);
// 2-space indentation for readability
```

**Requirements:**
- Create directories if needed
- Use 2-space indentation
- Add newline at end of file
- Handle file write errors
- Verify file written successfully

### 3. Validate JSON Structure
```javascript
// Validate required fields
function validatePaper(paper) {
  const required = ['arxivId', 'title', 'authors', 'abstract', 'publishedDate', 'pdfUrl'];
  return required.every(field => field in paper && paper[field]);
}
```

**Validation Checks:**
- All required fields present
- Correct data types (string, array, object, number)
- Non-empty strings
- Non-empty arrays (where applicable)
- Valid date formats (ISO 8601)
- Valid URLs (http/https)

### 4. Merge JSON Arrays
```javascript
// Merge arrays removing duplicates
function mergeUnique(existing, incoming, identity) {
  const map = new Map();
  existing.forEach(item => map.set(identity(item), item));
  incoming.forEach(item => {
    if (!map.has(identity(item))) {
      map.set(identity(item), item);
    }
  });
  return Array.from(map.values());
}
```

**Merge Strategy:**
- Use identity field (e.g., `arxivId` for papers)
- Keep existing if duplicate found
- Preserve order (sort by date after merge)
- Return merged array

### 5. Extract Nested Properties
```javascript
// Deep property extraction
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, prop) => 
    current?.[prop], obj);
}

// Example: getNestedProperty(data, 'metadata.lastUpdated')
```

## High-Level Operations

### Load Papers Data
```javascript
// Load with fallback for missing file
function loadPapers() {
  try {
    return JSON.parse(readFile('data/papers.json'));
  } catch {
    return { metadata: {...}, papers: [] };
  }
}
```

### Save Papers Data
```javascript
// Save with metadata update
function savePapers(data) {
  data.metadata.lastUpdated = new Date().toISOString();
  writeFile('data/papers.json', JSON.stringify(data, null, 2));
}
```

### Deduplicate Papers
```javascript
function deduplicatePapers(papers) {
  const seen = new Set();
  return papers.filter(p => {
    if (seen.has(p.arxivId)) return false;
    seen.add(p.arxivId);
    return true;
  });
}
```

### Sort Papers by Date
```javascript
function sortByDate(papers) {
  return papers.sort((a, b) => 
    new Date(b.publishedDate) - new Date(a.publishedDate)
  );
}
```

### Filter by Time Range
```javascript
function filterByDays(papers, days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return papers.filter(p => new Date(p.publishedDate) >= cutoff);
}
```

## Data Structures

### Papers JSON Structure
```json
{
  "metadata": {
    "totalCount": 42,
    "lastUpdated": "2025-02-17T00:00:00Z",
    "keywords": ["machine learning", "natural language processing", "quantum computing"]
  },
  "papers": [
    {
      "arxivId": "2502.12345",
      "title": "Paper Title",
      "authors": ["Author One", "Author Two"],
      "abstract": "Abstract text...",
      "publishedDate": "2025-02-17",
      "pdfUrl": "https://arxiv.org/pdf/2502.12345.pdf",
      "summaryUrl": "https://arxiv.org/abs/2502.12345"
    }
  ]
}
```

### Required Fields Validation
```
papers[] must have:
- arxivId: string (format: YYMM.nnnnn)
- title: string (non-empty)
- authors: string[] (non-empty array)
- abstract: string (may be empty but field required)
- publishedDate: string (ISO 8601: YYYY-MM-DD)
- pdfUrl: string (valid https URL)
- summaryUrl: string (valid https URL)
```

## Error Handling

### Parse Errors
```javascript
try {
  const data = JSON.parse(content);
} catch (e) {
  console.error(`JSON Parse Error at line ${e.line}: ${e.message}`);
  throw e;
}
```

### File Operations
```javascript
try {
  readFile(path);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log(`File not found: ${path}`);
  } else {
    throw e;
  }
}
```

### Validation
```javascript
const errors = [];
papers.forEach((paper, idx) => {
  if (!paper.arxivId) errors.push(`Paper ${idx} missing arxivId`);
  if (!Array.isArray(paper.authors)) errors.push(`Paper ${idx} authors not array`);
});
if (errors.length) throw new Error(errors.join('; '));
```

## Performance Tips
- Cache frequently accessed JSON
- Stream large files instead of loading all at once
- Validate only required fields for speed
- Use Set for O(1) deduplication lookups
- Batch file operations
