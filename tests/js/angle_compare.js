$(document).ready(function () {

var c = $('#canvas');

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

draw();

var holding = null
c.mousedown(function (e) {
  var m = [e.pageX - c.offset().left, e.pageY - c.offset().top];
  for (var i = 0; i < vertices.length; ++i) {
    var v = vertices[i];
    if (distSq(v, m) <= 9) {
      holding = v;
      console.log(v);
      return;
    }
  }
  holding = null;
});
c.mousemove(function (e) {
  if (holding != null) {
    holding[0] = e.pageX - c.offset().left;
    holding[1] = e.pageY - c.offset().top;
    draw();
  }
});
c.mouseup(function () {
  holding = null;
});

function draw() {
  var styles = ['black', 'black', 'black', 'black'];
  var cmp = angleCompare(vertices[0], vertices[1]);

  if (cmp(vertices[2], vertices[3])) {
    styles[2] = 'red';
  }
  if (cmp(vertices[3], vertices[2])) {
    styles[3] = 'red';
  }

  c.clearCanvas();
  for (var i = 0; i < edges.length; ++i) {
    var e = edges[i];
    var u = vertices[e[0]]; var v = vertices[e[1]];
    c.drawLine({
      strokeStyle: 'black',
      strokeWidth: 2,
      x1: u[0], y1: u[1],
      x2: v[0], y2: v[1]
    });
  }
  for (var i = 0; i < vertices.length; ++i) {
    var v = vertices[i];
    c.drawArc({
      fillStyle: styles[i],
      x: v[0], y: v[1],
      radius: 5
    });
  }
}

})
