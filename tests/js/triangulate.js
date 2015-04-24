$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [100, 200],
  [100, 300],
  [300, 400],
  [300, 300],
  [400, 200],
  [300, 200],
  [300, 100],
  [200, 200],
  [200, 100],

  [150, 200],
  [250, 300],
  [150, 300]
];

var edges = [
  [ 0,  1],
  [ 1,  2],
  [ 2,  3],
  [ 3,  4],
  [ 4,  5],
  [ 5,  6],
  [ 6,  7],
  [ 7,  8],
  [ 8,  0],

  [ 9, 10],
  [10, 11],
  [11,  9]
]

var face = [[0, 1, 2, 3, 4, 5, 6, 7, 8],[9,10,11]];

var g = new Graph(vertices);
var diags = [];
var refineTrace = [];
g.makeInteractive({
  canvas: c,
  onChange: function(g) {
    diags = triangulate.face(vertices, face);
    var all = edges.concat(diags);
    refineTrace = triangulate.refineToDelaunay(vertices, all, edges.length);
    var d = new Graph(vertices, all, [face]);
    c.clearCanvas();
    d.draw(c);

    var qe = triangulate.makeQuadEdge(vertices, all);
    for (var j = edges.length; j < all.length; ++j) {
      var edge = all[j];
      var coEdge = qe.coEdges[j];
      var w = vertices[edge[0]], y = vertices[edge[1]];
      var x = vertices[coEdge[0]], z = vertices[coEdge[1]];
      var p = geom.circumcenter(w, y, x);
      var r = Math.sqrt(distSq(w, p));
      c.drawArc({
        x: p[0], y: p[1],
        radius: r,
        strokeStyle: 'blue'
      });
      var p = geom.circumcenter(w, y, z);
      var r = Math.sqrt(distSq(w, p));
      c.drawArc({
        x: p[0], y: p[1],
        radius: r,
        strokeStyle: 'blue'
      });
      if (
        geom.pointInCircumcircle(w, y, x, z) ||
        geom.pointInCircumcircle(w, y, z, x)
      ) {
        console.log("Achtung!");
      }
    }
  }
});

$('#show-steps-button').click(function (event) {
  console.log("interval start");
  var h = new Graph(vertices, edges.concat(diags), [face]);
  var interval = setInterval(function () {
    console.log("tick");
    if (refineTrace.length > 0) {
      var t = refineTrace.shift();
      if (t.ensured !== undefined)
        h.setEdgeStyle(t.ensured, { strokeStyle: 'black' });
      if (t.markedUnsure !== undefined)
        for (var k = 0; k < t.markedUnsure.length; ++k)
          h.setEdgeStyle(t.markedUnsure[k], { strokeStyle: 'red' });
      if (t.flippedTo !== undefined)
        h.edges[t.ensured] = t.flippedTo;
    } else {
      clearInterval(interval);
    }
    c.clearCanvas();
    h.draw(c);
  }, 1000)
});

})
