$(document).ready(function () {

var vertices = [
  [200, 300],
  [100, 200],
  [100, 300],
  [300, 400],
  [300, 300],
  [400, 200],
  [300, 200],
  [300, 100],
  [200, 200],
  [200, 100],
];

var edges = [];

var poly = [1, 2, 3, 4, 5, 6, 7, 8];

g = new Graph(vertices, edges, [[poly]]);
g.vertexStyle.radius = 0;
vertices[0].radius = 5;

g.makeInteractive({
  canvas: $('canvas'),
  clearCanvas: true,
  onChange: function(g) {
    vertices[0].color = geom.pointInPolygon(vertices, poly, vertices[0])
                      ? 'red' : 'black';
  }
});

})
