$(document).ready(function () {

var vertices = [
  [200, 200],
  [100, 300],
  [300, 200],
  [200, 100]
];

var edges = [
  [0, 1],
  [0, 2],
  [0, 3]
];

var g = new Graph(vertices, edges);
g.makeInteractive({
  canvas: $('#canvas'),
  clearCanvas: true,
  onChange: function(g) {
    cmp = angleCompare(g.vertices[0], g.vertices[1]);
    g.setVertexStyle(2, null);
    g.setVertexStyle(3, null);
    if (cmp(g.vertices[2], g.vertices[3]))
      g.setVertexStyle(2, { fillStyle: 'red' });
    if (cmp(g.vertices[3], g.vertices[2]))
      g.setVertexStyle(3, { fillStyle: 'red' });
  }
});

})
