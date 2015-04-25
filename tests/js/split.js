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

var face = [[0, 1, 2, 3, 4, 5, 6, 7, 8],[9,10,11]];

var diags = triangulate.face(vertices, face);
edges = edges.concat(diags);
triangulate.refineToDelaunay(vertices, edges);
var g = new Graph(vertices, edges, [face]);
g.draw(c, { edgeNumbers: true });

$('#split-button').click(function (event) {
  var j = Math.floor(Math.random() * edges.length);
  var qe = triangulate.makeQuadEdge(vertices, edges);
  triangulate.splitEdge(vertices, edges, qe.coEdges, qe.sideEdges, j);
  triangulate.refineToDelaunay(vertices, edges);
  c.clearCanvas();
  g.draw(c);//, { edgeNumbers: true });
});

})
