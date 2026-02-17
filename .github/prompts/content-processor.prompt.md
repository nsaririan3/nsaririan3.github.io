---
type: prompt
category: agent-specific
applies_to: content-processor
---

# Prompt: ContentProcessor Agent Instructions

## Objective
Transform raw arXiv data into clean, deduplicated content ready for web display by removing duplicates, validating data, and sorting chronologically.

## Processing Pipeline

### 1. Load Input Data
- Read raw papers from `data/papers-raw.json` (from ArxivFetcher)
- Read existing papers from `data/papers.json` (if exists)
- Handle missing file gracefully (treat as empty array)

### 2. Deduplication Strategy
Remove duplicate papers using arXiv ID as unique identifier:
- Keep only one version of each paper (the newest)
- Remove any papers already in `papers.json`
- Track which papers are new additions
- Report duplicate count to console

**Logic:**
```
For each paper in raw data:
  If arXiv ID already in existing papers:
    Skip (duplicate)
  Else:
    Add to processed papers (new)
```

### 3. Data Cleaning & Validation

**HTML Entity Sanitization:**
- Convert `&amp;` → `&`
- Convert `&lt;` → `<`
- Convert `&gt;` → `>`
- Convert `&quot;` → `"`
- Convert `&#[digits];` → corresponding character
- Trim excess whitespace from all fields

**Field Validation:**
Required fields (skip papers missing these):
- `arxivId` - Must be non-empty
- `title` - Must be non-empty
- `authors` - Must be non-empty array
- `abstract` - May be empty but field must exist
- `publishedDate` - Must be ISO format (YYYY-MM-DD)
- `pdfUrl` - Must start with https://
- `summaryUrl` - Must start with https://

**Data Format Standardization:**
- Normalize author names: trim whitespace, proper capitalization
- Parse and validate dates to ISO format (YYYY-MM-DD)
- Verify URLs are accessible (valid http/https)
- Remove leading/trailing whitespace from all strings

### 4. Sorting & Filtering

**Sort Papers:**
- By publication date: **newest first** (descending order)
- Keep only papers from last **30 days**
- Skip older papers (archive outdated content)

**Output Strategy:**
- Merge new papers with existing papers
- Maintain chronological order (newest first)
- If paper already in database, keep the existing version to avoid re-processing

### 5. Generate Output File

**Save to:** `data/papers.json`

**Required Metadata:**
- `totalCount` - Total unique papers stored
- `lastUpdated` - ISO timestamp of this processing
- `keywords` - List of search keywords used

**JSON Structure:**
```json
{
  "metadata": {
    "totalCount": 42,
    "lastUpdated": "2025-02-17T01:23:45Z",
    "keywords": ["machine learning", "natural language processing", "quantum computing"]
  },
  "papers": [
    {
      "arxivId": "2502.12345",
      "title": "Paper Title",
      "authors": ["Author One", "Author Two"],
      "abstract": "Clean, sanitized abstract text...",
      "publishedDate": "2025-02-17",
      "pdfUrl": "https://arxiv.org/pdf/2502.12345.pdf",
      "summaryUrl": "https://arxiv.org/abs/2502.12345"
    }
  ]
}
```

## Logging & Reporting

**Console Output Should Include:**
- Number of new papers added
- Number of duplicates removed  
- Number of papers skipped due to validation errors
- Any validation issues found (missing fields, bad formats)
- Total papers after processing
- File save status
- Execution timestamp

**Example Console Output:**
```
Processing arXiv papers...
✓ Loaded 50 raw papers from arxiv-fetcher
✓ Loaded 85 existing papers from database
- Removed 5 duplicates (already in database)
- Added 40 new unique papers
- Skipped 5 papers (validation errors)
- Total papers: 125
- Date range: 2025-02-10 to 2025-02-17
✓ Saved to data/papers.json
Processing complete: 40 new papers added
```

## Error Handling

**Validation Errors:**
- Log paper arxivId and specific issue
- Examples: "arxiv ID 2502.99999: missing authors"
- Continue processing other papers (don't crash)
- Report total errors at end

**File Errors:**
- Missing `papers-raw.json`: Create as empty start, continue
- Missing `papers.json`: Create new file (first run)
- Write errors: Report and halt processing

**Data Issues:**
- Malformed dates: Try to parse, skip if impossible
- Invalid URLs: Keep as-is, logging issue
- Empty abstracts: Allow (some papers may not have)

## Data Integrity Checks

**Pre-Save Validation:**
- Verify processed JSON is valid
- Ensure no duplicate arXiv IDs in output
- Check all required fields present
- Verify metadata timestamps

**Post-Save Verification:**
- Confirm file was written
- Spot-check read-back of file
- Verify file size reasonable
- Log success message

## Performance Considerations
- No network calls (local processing only)
- Process all papers in single pass where possible
- Use efficient data structures (Set for dedup)
- Keep processing under 30 seconds

## Success Criteria
✓ `papers.json` contains deduplicated papers
✓ Newest papers listed first
✓ No papers older than 30 days
✓ All data fields validated and sanitized
✓ Console logs complete processing details
✓ Metadata accurately reflects current state
