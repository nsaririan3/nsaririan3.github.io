---
type: skill
description: "Query arXiv API with multiple keywords, parse responses, handle pagination and rate limiting"
---

# ArXiv API Query Skill

## Overview
Enables agents to query the arXiv API for papers matching specified keywords with proper rate limiting, pagination, and error handling.

## API Details
- **Base URL:** https://arxiv.org/api/query
- **Response Format:** Atom XML
- **Rate Limit:** 3 requests per second (built-in enforcement)
- **Max Results Per Query:** 100
- **Timeout:** 30 seconds

## Query Construction

### Basic Query Syntax
```
search_query=<field>:<value> AND <field>:<value>
```

### Search Fields
- `ti` - Title
- `au` - Author
- `abs` - Abstract
- `cat` - Category
- `all` - All fields

### Example Queries

**Single Keyword:**
```
search_query=ti:machine%20learning&start=0&max_results=100
```

**Multiple Keywords (OR logic):**
```
search_query=(ti:machine%20learning%20OR%20au:machine%20learning)%20AND%20submittedDate:[202502170000%20TO%20202502242359]
```

**Multiple Categories:**
```
search_query=cat:cs.AI%20OR%20cat:cs.LG%20OR%20cat:quant-ph
```

## Parameters
- `search_query` - The query string
- `start` - Starting index (0-based)
- `max_results` - Results per request (max 100)
- `sortBy` - Field to sort by (relevance, submittedDate, lastUpdatedDate)
- `sortOrder` - ascending or descending

## Response Parsing

### XML Response Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>http://arxiv.org/abs/2502.12345v1</id>
    <title>Paper Title Here</title>
    <author>
      <name>Author Name</name>
    </author>
    <summary>Abstract text here...</summary>
    <published>2025-02-17T12:34:56Z</published>
    <arxiv:primary_category term="cs.LG"/>
  </entry>
</feed>
```

### Extract Information
Extract from each `<entry>`:
1. **arXiv ID:** From `<id>` URL, extract: `2502.12345` (before v1/v2)
2. **Title:** `<title>` text (trim whitespace)
3. **Authors:** All `<author><name>` entries (array)
4. **Abstract:** `<summary>` (sanitize whitespace)
5. **Publication Date:** `<published>` (convert to YYYY-MM-DD)
6. **Primary Category:** `<arxiv:primary_category term>` attribute
7. **PDF URL:** Construct as `https://arxiv.org/pdf/{arxivId}.pdf`
8. **Summary URL:** Construct as `https://arxiv.org/abs/{arxivId}`

## Rate Limiting Implementation
```
- Record timestamp of each request
- Enforce minimum 333ms gap between requests (3/sec)
- Add 5-second delay between batches of requests
- Queue requests if needed
- Log rate limit hits
```

## Pagination Handling
```
For large result sets:
1. Set max_results=100 (API maximum)
2. Use start parameter: 0, 100, 200, etc.
3. Parse totalResults from feed
4. Continue fetching until all results retrieved
5. Add 5-second delay between pagination calls
```

## Error Handling

### Common Errors
- **HTTP 400 Bad Request** - Check query syntax
- **HTTP 503 Service Unavailable** - Retry with exponential backoff
- **Timeout** - Retry up to 3 times with 10-second delay
- **Malformed XML** - Log entry and continue

### Retry Strategy
```
On error:
1. First attempt: immediate
2. Second attempt: 5-second delay
3. Third attempt: 10-second delay
4. Fail after 3 attempts
5. Log full error for debugging
```

## Example Implementation

### Query for Machine Learning Papers
```
search_query=
  (ti:"machine learning" OR au:"machine learning") 
  OR (ti:"natural language processing" OR au:"natural language processing")
  OR (ti:"quantum computing" OR au:"quantum computing")
&start=0
&max_results=100
&sortBy=submittedDate
&sortOrder=descending
```

### Filter by Recent Submissions
```
submittedDate:[202502100000 TO 202502172359]
```
Format: YYYYMMDDHHmm (UTC timezone)

## Output Format
```json
{
  "papers": [
    {
      "arxivId": "2502.12345",
      "title": "Paper Title",
      "authors": ["Author One", "Author Two"],
      "abstract": "Abstract text...",
      "category": "cs.LG",
      "publishedDate": "2025-02-17",
      "pdfUrl": "https://arxiv.org/pdf/2502.12345.pdf",
      "summaryUrl": "https://arxiv.org/abs/2502.12345"
    }
  ],
  "totalResults": 42,
  "queriedAt": "2025-02-17T00:00:00Z"
}
```

## Validation
- Ensure all required fields extracted for each paper
- Validate arXiv ID format (YYMM.nnnnn or older format)
- Validate URLs are well-formed (https://)
- Validate dates are ISO format
- Log any missing fields for debugging
