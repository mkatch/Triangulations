$(document).ready(function () {

var vertices = [
  [ 10,  10],
  [100, 100],
  [100,  10],
  [ 10, 100]
];

var edges = [
  [0, 1],
  [2, 3]
];

var g = new Graph(vertices, edges);
g.makeInteractive({
  canvas: $('#canvas'),
  clearCanvas: true,
  onChange: function (g) {
    if (geom.edgesIntersect(
      g.vertices[0], g.vertices[1],
      g.vertices[2], g.vertices[3]
    )) {
      g.setEdgeStyle({ strokeStyle: 'red' });
    } else {
      g.setEdgeStyle(null);
    }
  }
});

});
