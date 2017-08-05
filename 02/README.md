This iteration updates the example to a [modern d3 version](https://github.com/d3/d3/releases), which at the time of this writing is `4.10.0`

This iteration calls the neo4j api to display the results of this query, which finds all blocks that have the string `map` somewhere in the description (gist title)
show those blocks and all blocks that they have a 1st degree link-in-the-README citation relationship with

```
MATCH(n)-[:LINKS_TO]-(m)
WHERE n.description =~  '.*map.*'
RETURN n, m
```

the cool thing about this is the related nodes may not have `map` anywhere in the description, but we can still use some known graph of d3 example relationships (in this case README citations) to infer that they are relevant to a map keyword search

![map query demo screenshot]()