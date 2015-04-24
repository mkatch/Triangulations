$(document).ready(function () {

var vertices = [
  [100, 100],
  [200, 100],
  [200, 200],
  [100, 200],

  [ 50, 150],
  [150,  50],
  [250, 150],
  [150, 250]
];

var edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],

  [0, 5],
  [5, 1],
  [1, 6],
  [6, 2],
  [2, 7],
  [7, 3],
  [3, 4],
  [4, 0],

  [0, 2]
]

var g = new Graph(vertices, edges);
var qe = triangulate.makeQuadEdge(vertices, edges);

function printStuff () {
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
}

printStuff();
triangulate.flipEdge(edges, qe.coEdges, qe.sideEdges, 12);
console.log("");
printStuff();
g.draw($('canvas'));

})
