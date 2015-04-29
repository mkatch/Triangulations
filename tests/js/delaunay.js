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
];
Graph.markFixed(edges);

var face = [[0, 1, 2, 3, 4, 5, 6, 7, 8],[9,10,11]];

//var diags = triangulate.face(vertices, face);
//var all = edges.concat(diags);
var g = new Graph(vertices);
var diags = [];
var refineTrace = [];
//g.draw(c, { edgeNumbers: true });
//triangulate.refineToDelaunay(vertices, all, refineTrace);

g.makeInteractive({
  canvas: c,
  onChange: function(g) {
    diags = triangulate.face(vertices, face);
    var all = edges.concat(diags);
    refineTrace = [];
    var qe = triangulate.makeQuadEdge(vertices, all);
    triangulate.refineToDelaunay(vertices, all, qe.coEdges, qe.sideEdges,
      refineTrace);
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
  var l = 0;
  var interval = setInterval(function () {
    console.log("tick");
    if (l < refineTrace.length) {
      var t = refineTrace[l];
      ++l;
      if (t.ensured !== undefined)
        h.edges[t.ensured].color = 'black';
      if (t.markedUnsure !== undefined)
        for (var k = 0; k < t.markedUnsure.length; ++k)
          h.edges[t.markedUnsure[k]].color = 'red';
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
