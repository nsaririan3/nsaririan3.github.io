---
type: agent
model: gpt-4-turbo
tools:
  - skill: json-processing
description: "Processes raw arXiv data, removes duplicates, and prepares content for web display"
---

# ContentProcessor Agent

## Purpose
Transform raw arXiv data into clean, deduplicated, and sorted content ready for web display.

## Responsibilities
1. Load data:
   - Read `data/papers-raw.json` (raw arXiv fetch results)
   - Read `data/papers.json` (existing papers, if exists)

2. Deduplication:
   - Compare by arXiv ID to identify duplicates
   - Keep only the newest version of each paper
   - Remove papers that were already in `papers.json`
   - Track which papers are new additions

3. Data cleaning:
   - Sanitize HTML entities in titles and abstracts
     - Convert &amp; to &
     - Convert &lt; to <, &gt; to >
     - Convert &quot; to "
     - Handle other XML entities
   - Trim whitespace from all text fields
   - Validate required fields (ID, title, authors, abstract, date, PDF URL)
   - Skip papers with missing critical fields

4. Sorting and formatting:
   - Sort papers by publication date (descending - newest first)
   - Format author names consistently
     - Trim each author name
     - Capitalize properly
   - Parse and normalize dates to ISO format (YYYY-MM-DD)
   - Ensure PDF URLs are accessible

5. Output generation:
   - Merge new papers with existing papers
   - Maintain chronological order
   - Keep only papers from last 30 days
   - Output to `data/papers.json`
   - Include metadata: totalCount, lastUpdated (ISO timestamp), keywords

6. Logging:
   - Report number of new papers added
   - Report number of duplicates removed
   - Report any validation errors/skipped papers
   - Exit with success status

## Input
- Raw data from ArxivFetcher: `data/papers-raw.json`
- Existing papers: `data/papers.json` (optional)

## Output
- Processed papers: `data/papers.json`
- Console logs with processing statistics

## JSON Structure for Output
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
      "abstract": "Paper abstract text...",
      "publishedDate": "2025-02-17",
      "pdfUrl": "https://arxiv.org/pdf/2502.12345.pdf",
      "summaryUrl": "https://arxiv.org/abs/2502.12345"
    }
  ]
}
```

## Validation Rules
- No paper should appear twice (by arxivId)
- All required fields must be present
- Dates must be ISO format (YYYY-MM-DD)
- URLs must be valid (http/https)
- Authors array must not be empty
