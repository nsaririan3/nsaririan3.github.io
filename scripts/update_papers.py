import json
import os
from datetime import datetime, timedelta

RAW_PATH = 'data/papers-raw.json'
OUT_PATH = 'data/papers.json'
KEYWORDS = [
    'machine learning',
    'natural language processing',
    'quantum computing'
]

if not os.path.exists(RAW_PATH):
    raise FileNotFoundError('No papers-raw.json found')

with open(RAW_PATH) as f:
    raw = json.load(f)

papers = raw.get('papers', [])
now = datetime.utcnow()

# Remove duplicates by arxivId
seen = set()
unique = []
for p in papers:
    if p['arxivId'] not in seen:
        seen.add(p['arxivId'])
        unique.append(p)

# Only keep papers from last 30 days
cutoff = now - timedelta(days=30)
filtered = [p for p in unique if p.get('publishedDate', '') >= cutoff.strftime('%Y-%m-%d')]

# Sort by publishedDate descending
filtered.sort(key=lambda p: p.get('publishedDate', ''), reverse=True)

out = {
    'metadata': {
        'totalCount': len(filtered),
        'lastUpdated': now.isoformat()+'Z',
        'keywords': KEYWORDS
    },
    'papers': filtered
}

with open(OUT_PATH, 'w') as f:
    json.dump(out, f, indent=2)
