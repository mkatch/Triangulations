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
  onChange: function () {
    if (geom.edgesIntersect(
      vertices[0], vertices[1],
      vertices[2], vertices[3]
    )) {
      g.edgeStyle.color = 'red';
    } else {
      g.edgeStyle.color = 'black';
    }
  }
});

});
