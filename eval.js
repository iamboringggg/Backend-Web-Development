// Evaluate keyword and semantic retrieval results with MRR and Recall@10.
const fs = require('fs');

function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split('\n').slice(1);
  return lines.map(line => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}

const testSet = loadTestSet('test-set.csv');
const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank === null ? 0 : 1 / rank;
}

function rankOf(rankedIds, correctIds) {
  const correct = new Set(correctIds);
  const index = rankedIds.findIndex(postId => correct.has(postId));
  return index === -1 ? null : index + 1;
}

const keywordRRs = [];
const semanticRRs = [];
let keywordHits = 0;
let semanticHits = 0;
const rows = [];

for (const { query, correctIds } of testSet) {
  const queryResults = results[query];
  const keywordRank = rankOf(queryResults.keyword, correctIds);
  const semanticRank = rankOf(queryResults.semantic, correctIds);
  const keywordRR = reciprocalRank(queryResults.keyword, correctIds);
  const semanticRR = reciprocalRank(queryResults.semantic, correctIds);

  keywordRRs.push(keywordRR);
  semanticRRs.push(semanticRR);
  if (keywordRR > 0) keywordHits += 1;
  if (semanticRR > 0) semanticHits += 1;

  rows.push({
    query,
    keywordRank: keywordRank ?? 'miss',
    semanticRank: semanticRank ?? 'miss'
  });
}

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const keywordMRR = mean(keywordRRs);
const semanticMRR = mean(semanticRRs);
const keywordRecall = keywordHits / testSet.length;
const semanticRecall = semanticHits / testSet.length;
const format = value => value.toFixed(2);

console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');
for (const row of rows) {
  console.log(`| ${row.query} | ${row.keywordRank} | ${row.semanticRank} |`);
}
console.log(
  `| **Summary** | **MRR ${format(keywordMRR)} · Recall@10 ${format(keywordRecall)}** | **MRR ${format(semanticMRR)} · Recall@10 ${format(semanticRecall)}** |`
);
