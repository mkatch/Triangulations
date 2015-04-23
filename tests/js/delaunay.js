$(document).ready(function () {

var vertices = [
  [100, 100],
  [100, 200],
  [200, 200],
  [200, 100]
];

var edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 2]
]

var g = new Graph(vertices, edges);
g.draw($('canvas'));

var qe = triangulate.makeQuadEdge(vertices, edges);
for (var j = 0; j < edges.length; ++j) {
  var edge = edges[j];
  var coEdge = qe.coEdges[j];
  var sides = qe.sideEdges[j];
  console.log("edge %d: (%d %d), co-edge: (%d %d), sides: %d %d %d %d", j,
    edge[0], edge[1],
    coEdge[0], coEdge[1],
    sides[0], sides[1], sides[2], sides[3]
  );
}

})
