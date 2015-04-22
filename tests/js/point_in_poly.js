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

var faces = [[[1, 2, 3, 4, 5, 6, 7, 8]]];

g = new Graph(vertices, edges, faces);
g.setVertexStyle({ radius: 0 });
g.setVertexStyle(0, { radius: 5 });

g.makeInteractive({
  canvas: $('canvas'),
  onChange: function(g) {
    g.setVertexStyle(0, {
      radius: 5,
      fillStyle: pointInPolygon(vertices, faces[0][0], vertices[0])
                 ? 'red' : 'black'
    });
  }
});

})
