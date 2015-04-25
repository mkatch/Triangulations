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

var diags = triangulate.face(vertices, face);
edges = edges.concat(diags);
var qe = triangulate.makeQuadEdge(vertices, edges);
var g = new Graph(vertices, edges);
g.draw(c);

c.mousemove(function (event) {
  var m = [event.pageX - c.offset().left, event.pageY - c.offset().top];
  //var m = [132, 231];
  //console.log(m);
  var t = triangulate.findEnclosingTriangle(
    vertices, edges, qe.coEdges, qe.sideEdges, m, 2 * 12);
  if (t !== undefined) {
    var k = t % 2;
    var j = (t - k) / 2;
    var poly = [edges[j][0], edges[j][1], qe.coEdges[j][k]];
    g.faces = [[poly]];
    c.clearCanvas();
    g.draw(c);
  }
});

})
