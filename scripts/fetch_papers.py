import requests
import xmltodict
import json
from datetime import datetime, timedelta

KEYWORDS = [
    'machine learning',
    'natural language processing',
    'quantum computing'
]

ARXIV_API = 'http://export.arxiv.org/api/query'
DAYS_BACK = 7
MAX_RESULTS = 100

now = datetime.utcnow()
from_date = (now - timedelta(days=DAYS_BACK)).strftime('%Y-%m-%dT%H:%M:%SZ')

query = ' OR '.join([f'(ti:"{kw}" OR abs:"{kw}")' for kw in KEYWORDS])
params = {
    'search_query': query,
    'start': 0,
    'max_results': MAX_RESULTS,
    'sortBy': 'submittedDate',
    'sortOrder': 'descending'
}

resp = requests.get(ARXIV_API, params=params, timeout=30)
resp.raise_for_status()
data = xmltodict.parse(resp.text)

entries = data.get('feed', {}).get('entry', [])
if isinstance(entries, dict):
    entries = [entries]

papers = []
for entry in entries:
    arxiv_id = entry['id'].split('/')[-1]
    title = entry.get('title', '').replace('\n', ' ').strip()
    authors = [a['name'] for a in entry.get('author', [])] if isinstance(entry.get('author', []), list) else [entry['author']['name']]
    abstract = entry.get('summary', '').replace('\n', ' ').strip()
    published = entry.get('published', '')[:10]
    pdf_url = ''
    for link in entry.get('link', []):
        if link.get('@type') == 'application/pdf':
            pdf_url = link['@href']
    if not pdf_url:
        pdf_url = f'https://arxiv.org/pdf/{arxiv_id}.pdf'
    summary_url = f'https://arxiv.org/abs/{arxiv_id}'
    category = entry.get('arxiv:primary_category', {}).get('@term', '')
    papers.append({
        'arxivId': arxiv_id,
        'title': title,
        'authors': authors,
        'abstract': abstract,
        'publishedDate': published,
        'pdfUrl': pdf_url,
        'summaryUrl': summary_url,
        'category': category
    })

with open('data/papers-raw.json', 'w') as f:
    json.dump({'papers': papers, 'fetchedAt': now.isoformat()+'Z'}, f, indent=2)
