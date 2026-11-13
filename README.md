# Measuring Retrieval: MRR and Recall@10

Run the evaluation with:

```bash
node eval.js
```

The script scores the supplied keyword and semantic ranked results using reciprocal
rank, Mean Reciprocal Rank (MRR), and Recall@10.

| Query | Keyword rank | Semantic rank |
|---|---|---|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |

Semantic search is better overall because it has both the higher MRR (0.67 versus
0.30) and perfect Recall@10 (1.00 versus 0.60). Keyword search wins on the Redis
or Memcached query, the ACID query, and the SQL versus NoSQL query, which use exact
technical terms that keyword matching can recognize directly. Semantic search wins
on the paraphrased questions about stale caches, semantic search setup, slow queries,
schema changes, background jobs, database write throughput, and Redis memory, where
matching the underlying meaning is more useful than matching exact words. A team
would still keep keyword search because its exact-term strengths complement semantic
search and together can cover queries that either system misses or ranks poorly.
