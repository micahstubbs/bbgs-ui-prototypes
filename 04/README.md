This iteration explores using bounding boxes to repel rectangular nodes, as done in the block [More bounding box collide](https://bl.ocks.org/emeeks/a193b0e64cd1b1dd06fa75ed5b491a79) from [@Elijah_Meeks](https://twitter.com/Elijah_Meeks).  a work in progress.

This iteration calls the neo4j api to display the results of this query, which finds all blocks that have the string `map` somewhere in the description (gist title)
show those blocks and all blocks that they have a 1st degree link-in-the-README citation relationship with

```
MATCH(n)-[:LINKS_TO]-(m)
WHERE n.description =~  '.*map.*'
RETURN n, m
```

the cool thing about this is the related nodes may not have `map` anywhere in the description, but we can still use some known graph of d3 example relationships (in this case README citations) to infer that they are relevant to a map keyword search

![map query demo screenshot]()