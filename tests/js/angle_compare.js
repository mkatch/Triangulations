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
    cmp = geom.angleCompare(g.vertices[0], g.vertices[1]);
    var r = cmp(g.vertices[2], g.vertices[3])
    vertices[2].color = r < 0 ? 'red' : 'black';
    vertices[3].color = r > 0 ? 'red' : 'black';  }
});

})
