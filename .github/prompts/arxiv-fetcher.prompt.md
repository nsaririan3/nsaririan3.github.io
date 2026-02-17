---
type: prompt
category: agent-specific
applies_to: arxiv-fetcher
---

# Prompt: ArxivFetcher Agent Instructions

## Objective
Fetch the latest arXiv papers matching your specified keywords every midnight via GitHub Actions, parse metadata, and store results in JSON format for processing.

## Target Keywords
Search for papers in these areas:
1. **Machine Learning** - Neural networks, deep learning, learning algorithms
2. **Natural Language Processing** - Language understanding, text processing, language models  
3. **Quantum Computing** - Quantum algorithms, quantum systems, quantum information

## API Query Configuration
- **API Endpoint:** https://arxiv.org/api/query
- **Result Set:** Last 7 days of papers (most recent first)
- **Max Results:** 100 papers per query (adjust if needed)
- **Rate Limit:** 3 requests per second maximum
- **Timeout:** 30 seconds per request

## Search Query Strategy

### Approach
Construct search queries that combine your keywords using OR logic:
```
(machine learning OR natural language processing OR quantum computing)
```

### Query Construction
1. Search title and author fields:
   ```
   (ti:"machine learning" OR au:"machine learning")
   OR (ti:"natural language processing" OR au:"natural language processing")  
   OR (ti:"quantum computing" OR au:"quantum computing")
   ```

2. Filter by recent submissions:
   - Last 7 days only
   - Sort by submission date, newest first

3. Handle pagination if results > 100

## Data to Extract
For each paper found, extract and store:
- **arxivId** - Unique identifier (e.g., 2502.12345)
- **title** - Paper title
- **authors** - All author names (as array)
- **abstract** - Paper abstract (full text)
- **publishedDate** - Publication date (convert to YYYY-MM-DD)
- **category** - Primary arXiv category (e.g., cs.LG)
- **pdfUrl** - Direct link to PDF
- **summaryUrl** - Link to arXiv summary page

## Error Handling
- **Connection Errors:** Retry up to 3 times with incremental delays (5s, 10s, 15s)
- **Timeout:** Treat as transient, retry
- **Invalid Responses:** Skip problematic entries, continue with others
- **Rate Limit:** Respect 3 req/sec limit, add 5s delay between batches
- **Complete Failure:** Log error and exit gracefully

## Output Storage
- **File:** `data/papers-raw.json`
- **Format:** JSON array of paper objects with all extracted fields
- **Include:** Timestamp of fetch in metadata
- **Validation:** Ensure no missing required fields

## Example Output Structure
```json
{
  "fetchedAt": "2025-02-17T00:00:00Z",
  "queryUsed": "machine learning OR natural language processing OR quantum computing",
  "papers": [
    {
      "arxivId": "2502.12345",
      "title": "Novel Machine Learning Approach",
      "authors": ["Author One", "Author Two", "Author Three"],
      "abstract": "This paper introduces...",
      "publishedDate": "2025-02-17",
      "category": "cs.LG",
      "pdfUrl": "https://arxiv.org/pdf/2502.12345.pdf",
      "summaryUrl": "https://arxiv.org/abs/2502.12345"
    }
  ],
  "totalCount": 42
}
```

## Console Output Requirements
- Log successful fetch with paper count
- Report any skipped/error papers
- Show fetch timestamp
- Display rate limiting info
- Final status: success or failure

## Trigger Context
This agent runs automatically at **00:00 UTC daily** via GitHub Actions.
Ensures fresh data available each morning for the website.
