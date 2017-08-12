// find all blocks that have the string map 
// somewhere in the description (gist title)
// show those blocks and all blocks 
// that they have a 1st degree link-in-the-README 
// citation relationship with
MATCH(n)-[:LINKS_TO]-(m) WHERE n.description =~  '.*map.*'RETURN n, m

// description keyword `color`
MATCH(n)-[:LINKS_TO]-(m) WHERE n.description =~  '.*color.*'RETURN n, m

// description keyword `layout`
MATCH(n)-[:LINKS_TO]-(m) WHERE n.description =~  '.*layout*'RETURN n, m


// find all of the blocks from user enjalot
// that mention blocks or are mentioned
// show those blocks and all 
// 1st degree mention connections
MATCH(n)-[:LINKS_TO]-(m)
 WHERE n.user =~ '.*enjalot.*'
 RETURN n, m

// in one line
MATCH(n)-[:LINKS_TO]-(m) WHERE n.user =~ '.*enjalot.*'RETURN n, m

// user curran
MATCH(n)-[:LINKS_TO]-(m) WHERE n.user =~ '.*curran.*'RETURN n, m

// user micahstubbs
MATCH(n)-[:LINKS_TO]-(m) WHERE n.user =~ '.*micahstubbs.*'RETURN n, m