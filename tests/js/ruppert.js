$(document).ready(function () {

var canvas = $('#canvas');

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
Graph.fitVerticesInto(vertices, canvas.width(), canvas.height());

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
Graph.markExternal(edges);

var face = [[0, 1, 2, 3, 4, 5, 6, 7, 8],[9,10,11]];

var diags = triangulate.face(vertices, face);
edges = edges.concat(diags);
var qe = triangulate.makeQuadEdge(vertices, edges);
triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
var trace = [];
var verticesBackup = vertices.slice();
var edgesBackup = edges.slice();
triangulate.refineToRuppert(vertices, edges, qe.coEdges, qe.sideEdges, {
  maxArea: 500,
  minAngle: 30,
  maxSteinerPoints: 300,
  trace: trace
});

g = new Graph(vertices, edges, [face]);
g.draw(canvas);//, { edgeNumbers: true });

$('#show-steps-button').click(function () {
  var vertices = verticesBackup.slice();
  var edges = edgesBackup.slice();
  var qe = triangulate.makeQuadEdge(vertices, edges);
  var coEdges = qe.coEdges, sideEdges = qe.sideEdges;
  var g = new Graph(vertices, edges, [face]);
  canvas.clearCanvas();
  g.draw(canvas, { edgeNumbers: true });
  var l = 0;
  var interval = setInterval(function () {
    console.log("tick: %d", l);
    if (l < trace.length) {
      var t = trace[l];
      ++l;
      if (t.split !== undefined) {
        for (var s = 0; s < t.split.length; ++s) {
          var j = t.split[s];
          triangulate.splitEdge(vertices, edges, coEdges, sideEdges, j);
        }
      }
      if (t.insert !== undefined) {
        var k = t.insert % 2, j = (t.insert - k) / 2;
        var a = vertices[edges[j][0]];
        var b = vertices[coEdges[j][k]];
        var c = vertices[edges[j][1]];
        var p = geom.circumcenter(a, b, c);
        var insert = triangulate.tryInsertPoint(
          vertices, edges, coEdges, sideEdges, p, j);
        console.log("insert j: %d, i: %d", j, coEdges[j][k]);
      }
      if (edges.length != t.edgeCnt)
        console.log("Oh no!");
      canvas.clearCanvas();
      g.draw(canvas);//, { edgeNumbers: true });
    } else {
      clearInterval(interval);
    }
  }, 50);
});

$('#canvas').click(function (event) {
  var m = [event.pageX - canvas.offset().left, event.pageY - canvas.offset().top];
  console.log(g.getVertexAt(m));
})

})
