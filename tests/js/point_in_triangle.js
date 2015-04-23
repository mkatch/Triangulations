$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [200, 200],
  [100, 100],
  [300, 200],
  [200, 300]
];

var faces = [[[3, 2, 1]]];

g = new Graph(vertices, [], faces);
g.setVertexStyle({ radius: 0 });
g.setVertexStyle(0, { radius: 5 });

g.makeInteractive({
  canvas: $('canvas'),
  clearCavas: true,
  onChange: function(g) {
    g.setVertexStyle(0, {
      radius: 5,
      fillStyle: geom.pointInTriangle(
        vertices[1], vertices[2], vertices[3],
        vertices[0]
      ) ? 'red' : 'black'
    });

    var distSq = geom.pointToEdgeDistSq(vertices[1], vertices[2], vertices[0]);
    $('#dist-sq').html(distSq.toString());
  }
});

})
