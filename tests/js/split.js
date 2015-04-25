$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [100, 200],
  [100, 300],
  [300, 400],
  [300, 300],
  [400, 200],
  [300, 200],
  [300, 100],
  [200, 200],
  [200, 100],

  [150, 200],
  [250, 300],
  [150, 300]
];

var edges = [
  [ 0,  1],
  [ 1,  2],
  [ 2,  3],
  [ 3,  4],
  [ 4,  5],
  [ 5,  6],
  [ 6,  7],
  [ 7,  8],
  [ 8,  0],

  [ 9, 10],
  [10, 11],
  [11,  9]
];
Graph.markFixed(edges);
Graph.markExternal(edges);

var face = [[0, 1, 2, 3, 4, 5, 6, 7, 8],[9,10,11]];

var diags = triangulate.face(vertices, face);
edges = edges.concat(diags);
triangulate.refineToDelaunay(vertices, edges);
var g = new Graph(vertices, edges, [face]);
g.draw(c, { edgeNumbers: true });
var qe = triangulate.makeQuadEdge(vertices, edges);

$('#split-button').click(function (event) {
  var tj = $('#split-j').val();
  var j = Math.floor(Math.random() * edges.length);
  if (tj != "")
    j = parseInt(tj);
  console.log(j);
  triangulate.splitEdge(vertices, edges, qe.coEdges, qe.sideEdges, j);
  c.clearCanvas();
  g.draw(c, { edgeNumbers: true });
});

})
