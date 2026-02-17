---
type: agent
model: gpt-4-turbo
tools:
  - skill: arxiv-api-query
  - skill: json-processing
description: "Fetches and parses arXiv papers matching specified keywords every midnight via GitHub Actions"
---

# ArxivFetcher Agent

## Purpose
Query the arXiv API for papers matching the keywords: machine learning, natural language processing, and quantum computing. Extract and store paper metadata (title, authors, abstract, publication date, PDF link).

## Responsibilities
1. Query arXiv API with specified keywords
   - Use search query: `(au:machine learning OR ti:machine learning) OR (au:natural language processing OR ti:natural language processing) OR (au:quantum computing OR ti:quantum computing)`
   - Set pagination to fetch latest papers
   - Filter by papers from last 7 days (sortBy: submittedDate, max_results: 100)

2. Parse and extract metadata:
   - arXiv ID
   - Paper title
   - Author names (all authors, full names)
   - Abstract
   - Publication date (ISO format: YYYY-MM-DD)
   - PDF URL (construct as: https://arxiv.org/pdf/{id}.pdf)
   - Summary URL (https://arxiv.org/abs/{id})

3. Handle API constraints:
   - Implement rate limiting: max 3 requests per second
   - Add delay of 5 seconds between API batches
   - Handle timeout errors gracefully (retry up to 3 times)
   - Log API calls with timestamps

4. Data storage:
   - Store raw results in JSON format
   - Include fetch timestamp with each batch
   - File location: `data/papers-raw.json`
   - Format: Array of paper objects with all extracted fields

5. Error handling:
   - Catch connection errors and log them
   - Report missing fields in responses
   - Continue processing even if individual papers have issues
   - Notify via console output if fetch fails completely

## Input
- Triggered by GitHub Actions at midnight EST daily
- No manual input required

## Output
- JSON file: `data/papers-raw.json`
- Console logs with fetch status and count of papers retrieved

## Implementation Notes
- Use official arXiv API: https://arxiv.org/api/query
- arXiv API documentation: https://arxiv.org/help/api/user-manual
- Response format is Atom XML - parse appropriately
- Ensure no duplicate fetches within the same day
