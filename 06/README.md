This iteration adds input both for neo4j Cypher graph search queries

This query finds all of the blocks from user `enjalot` that mention blocks or are mentioned themselves.  Then, we show those blocks as well as all 1st degree connections

```
MATCH(n)-[:LINKS_TO]-(m)
 WHERE n.user =~ '.*enjalot.*'
 RETURN n, m
```

![user enjalot query](https://user-images.githubusercontent.com/2119400/29060929-a4419cac-7bd0-11e7-92d1-6cb81304ff2c.png)