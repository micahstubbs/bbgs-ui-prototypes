const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const searchRadius = 10;

const color = d3.scaleOrdinal().range(d3.schemeCategory20);

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-70))
  .force('link', d3.forceLink().iterations(4).id(d => d.id))
  .force('x', d3.forceX())
  .force('y', d3.forceY());

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden');

//
// make the request to neo4j for the data
//
const url = 'http://localhost:7474/db/data/transaction/commit';
const requestData = JSON.stringify({
  statements: [
    {
      statement: "MATCH(n)-[:LINKS_TO]-(m) WHERE n.description =~  '.*map.*'RETURN n, m"
    }
  ]
});
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', 'Basic bmVvNGo6YWRtaW4=');
myHeaders.append('Accept', 'application/json; charset=UTF-8');
const myInit = {
  method: 'POST',
  body: requestData,
  headers: myHeaders
};
const myRequest = new Request(url, myInit);
fetch(myRequest)
  .then(response => response.json())
  .then(data => parseResponse(data))
  .catch(e => {
    console.log(e);
  });

const imageCache = {};

//
// parse the response from neo4j
//
function parseResponse(responseData) {
  const graph = {
    nodes: [],
    links: []
  };
  const nodeSet = new Set();

  console.log('responseData from parseResponse', responseData);
  const graphData = responseData.results[0].data;
  graphData.forEach(inputLink => {
    const source = inputLink.row[0].gistId;
    const target = inputLink.row[1].gistId;
    if (typeof source !== 'undefined' && typeof target !== 'undefined') {
      // collect the nodes in a set
      // which builds up a list of unique nodes
      inputLink.row.forEach(inputNode => {
        nodeSet.add({
          id: inputNode.gistId,
          createdAt: inputNode.createdAt,
          description: inputNode.description,
          updatedAt: inputNode.updatedAt,
          user: inputNode.user
        });
      });
      // assume that the inputLink rows
      // are in [source, target] format
      // TODO: check the neo4j REST API docs
      // to verify this
      graph.links.push({
        source,
        target
      });
    }
  });

  // add the unique nodes that we've collected
  // onto our graph object
  graph.nodes = [...nodeSet];

  // call the drawGraph function
  // to plot the graph
  drawGraph(graph);
}

//
// visualize the graph
//
function drawGraph(graph) {
  console.log('graph from drawGraph', graph);
  cacheImages(graph, imageCache);

  const users = d3
    .nest()
    .key(d => d.user)
    .entries(graph.nodes)
    .sort((a, b) => b.values.length - a.values.length);

  color.domain(users.map(d => d.key));

  simulation.nodes(graph.nodes).on('tick', ticked);

  simulation
    .force('link')
    .links(graph.links);

  d3
    .select(canvas)
    .on('mousemove', mousemoved)
    .call(
      d3
        .drag()
        .container(canvas)
        .subject(dragsubject)
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    graph.links.forEach(drawLink);
    context.strokeStyle = '#aaa';
    context.stroke();

    users.forEach(user => {
      context.beginPath();
      user.values.forEach(drawNode);
      context.fillStyle = color(user.key);
      context.fill();
    });

    context.restore();
  }

  function dragsubject() {
    return simulation.find(
      d3.event.x - width / 2,
      d3.event.y - height / 2,
      searchRadius
    );
  }

  function mousemoved() {
    //
    // disable mouse move links for now
    //
    const a = this.parentNode;
    const m = d3.mouse(this);
    const d = simulation.find(
      m[0] - width / 2,
      m[1] - height / 2,
      searchRadius
    );
    if (!d) return a.removeAttribute('href');
    a.removeAttribute('title');
    // tooltip.style('visibility', 'hidden');
    a.setAttribute(
      'href',
      `http://bl.ocks.org/${d.user ? `${d.user}/` : ''}${d.id}`
    );
    a.setAttribute(
      'title',
      `${d.id}${d.user ? ` by ${d.user}` : ''}${d.description ? `\n${d.description}` : ''}`
    );
    //
    // disable tooltips for now
    //
    // loadTooltipThumb(d);
  }
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  // context.moveTo(d.x + 3, d.y);
  // context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  const image = imageCache[d.id];
  if (typeof image !== 'undefined' && image.height > 0) {
    context.drawImage(image, 0, 0, 230, 120, d.x, d.y, 20, 20);
    // context.drawImage(image, 0, 0, 230, 120, d.x, d.y, 46, 24
  }
}

function cacheImages(graph, imageCache) {
  graph.nodes.forEach(d => {
    const image = new Image();
    image.src = `https://bl.ocks.org/${d.user ? `${d.user}/` : ''}raw/${d.id}/thumbnail.png`;
    // image.onload = function() {
    //   imageCache[d.id] = image;
    // };
    imageCache[d.id] = image;
  });
}

function loadTooltipThumb(d) {
  tooltip.select('*').remove();

  const thumbnailURL = `https://bl.ocks.org/${d.user ? `${d.user}/` : ''}raw/${d.id}/thumbnail.png`;

  const top = d3.event.pageY - 150;

  tooltip
    .style('top', `${top}px`)
    .style('left', `${d3.event.pageX + 40}px`)
    .style('visibility', 'visible')
    .append('img')
    .attr('src', thumbnailURL);
}
