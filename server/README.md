This iteration add an interaction that opens the block represented by a node when you click on that node

This query finds all of the blocks from user `enjalot` that mention blocks or are mentioned themselves.  Then, we show those blocks as well as all 1st degree connections

```
MATCH(n)-[:LINKS_TO]-(m)
 WHERE n.user =~ '.*enjalot.*'
 RETURN n, m
```

![user enjalot query](https://user-images.githubusercontent.com/2119400/29060929-a4419cac-7bd0-11e7-92d1-6cb81304ff2c.png)