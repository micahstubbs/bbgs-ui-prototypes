/* prettier-ignore */
d3.select('body')
  .append('canvas')
  .attr('width', 960)
  .attr('height', 500);

const canvas = d3.select('canvas');
const context = canvas.node().getContext('2d');
const width = canvas.property('width');
const height = canvas.property('height');

// make a rect for the background
// d3.drag updates these values behind the scenes
const rects = [{ x: 0, y: 0, x2: 0, y2: 0 }];
const radius = 10;

//
// load static neo4j API response data from a file
//
d3.json('neo4j-api-response.json', (error, response) => {
  if (error) {
    console.error(error);
  }
  parseResponse(response);
});

//
// parse the response from neo4j
//
function parseResponse(responseData) {
  const graph = {
    nodes: [],
    links: []
  };
  const nodeHash = {};

  console.log('responseData from parseResponse', responseData);
  const graphData = responseData.results[0].data;
  graphData.forEach(inputLink => {
    const source = inputLink.row[0].gistId;
    const target = inputLink.row[1].gistId;
    if (typeof source !== 'undefined' && typeof target !== 'undefined') {
      // collect the nodes in a set
      // which builds up a list of unique nodes
      inputLink.row.forEach(inputNode => {
        nodeHash[inputNode.gistId] = {
          id: inputNode.gistId,
          createdAt: inputNode.createdAt,
          description: inputNode.description,
          updatedAt: inputNode.updatedAt,
          user: inputNode.user
        };
      });
      // assume that the inputLink rows
      // are in [source, target] format
      // TODO: check the neo4j REST API docs
      // to verify this
      graph.links.push({
        source,
        target,
        weight: 1 // for jsLouvain community detection
      });
    }
  });

  // add the unique nodes that we've collected
  // onto our graph object
  Object.keys(nodeHash).forEach(key => {
    graph.nodes.push(nodeHash[key]);
  });

  // call the drawGraph function
  // to plot the graph
  drawGraph(graph, nodeHash);
}

function drawGraph(graph, nodeHash) {
  //
  // setup force simulation
  //
  const simulation = d3
    .forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  simulation.nodes(graph.nodes).on('tick', ticked);

  render();

  canvas.call(
    d3
      .drag()
      .subject(dragSubject)
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
      .on('start.render drag.render end.render', render)
  );

  function ticked() {
    render();
  }

  function render() {
    context.clearRect(0, 0, width, height);
    // draw the black rectangle
    rects.forEach(rect => {
      context.clearRect(0, 0, width, height);

      // context.fillStyle = 'black';
      // context.fillRect(rect.x, rect.y, rect.x2, rect.y2);

      // draw a line for each link
      context.strokeStyle = '#aaa';
      context.lineWidth = 1;
      context.beginPath();
      graph.links.forEach(link => {
        context.moveTo(
          nodeHash[link.source].x + rect.x,
          nodeHash[link.source].y + rect.y
        );
        context.lineTo(
          nodeHash[link.target].x + rect.x,
          nodeHash[link.target].y + rect.y
        );
      });
      context.stroke();

      // draw a circle for each node
      context.beginPath();
      graph.nodes.forEach(node => {
        context.moveTo(node.x + rect.x + radius, node.y + rect.y);
        context.arc(node.x + rect.x, node.y + rect.y, radius, 0, 2 * Math.PI);
      });
      context.fillStyle = 'red';
      context.fill();
    });
  }

  function dragSubject() {
    let i;
    const n = graph.nodes.length;
    let dx;
    let dy;
    let d2;
    let s2 = radius * radius * 4;
    let node;
    let subject;

    for (i = 0; i < n; i += 1) {
      node = graph.nodes[i];
      console.log('node from dragSubject', node);
      dx = d3.event.x - node.x - rects[0].x;
      dy = d3.event.y - node.y - rects[0].y;
      d2 = dx * dx + dy * dy;

      console.log('dx', dx);
      console.log('dy', dy);
      console.log('d2', d2);
      console.log('s2', s2);

      if (d2 < s2) {
        subject = node;
        s2 = d2;
      } else if (typeof subject === 'undefined') {
        background = rects[0];
        subject = background;
        console.log('background', background);
      }
    }
    return subject;
  }

  function dragStarted() {
    // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    // circles.splice(circles.indexOf(d3.event.subject), 1);
    // circles.push(d3.event.subject);
    d3.event.subject.active = true;
  }

  function dragged() {
    d3.event.subject.x = d3.event.x;
    d3.event.subject.y = d3.event.y;
  }

  function dragEnded() {
    d3.event.subject.active = false;
  }
}
