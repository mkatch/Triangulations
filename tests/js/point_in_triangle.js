$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [200, 200],
  [100, 100],
  [300, 200],
  [200, 300],
  [  0,   0],
];

var faces = [[[3, 2, 1]]];
var g = new Graph(vertices, [], faces);


g.makeInteractive({
  canvas: c,
  onChange: function(g) {
    var inTriangle = geom.pointInTriangle(
      vertices[1], vertices[2], vertices[3]);
    vertices[0].color = inTriangle(vertices[0]) ? 'red' : 'black';
    vertices[4] = geom.circumcenter(vertices[1], vertices[2], vertices[3]);
    c.clearCanvas();
    c.drawArc({
      x: vertices[4][0], y: vertices[4][1],
      radius: Math.sqrt(distSq(vertices[4], vertices[1])),
      strokeStyle: 'black'
    });
    var d = geom.pointToEdgeDistSq(vertices[1], vertices[2])(vertices[0]);
    $('#dist-sq').html(d.toString());
  }
});

})
