$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [ 10,  10],
  [100, 100],
  [100,  10],
  [ 10, 100]
];

var segments = [
  [0, 1],
  [2, 3]
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
  var style = 'black';
  if (segmentsIntersect(vertices[0], vertices[1], vertices[2], vertices[3])) {
    style = 'red';
  }

  c.clearCanvas();
  for (var i = 0; i < segments.length; ++i) {
    var s = segments[i];
    var u = vertices[s[0]]; var v = vertices[s[1]];
    c.drawLine({
      strokeStyle: style,
      strokeWidth: 2,
      x1: u[0], y1: u[1],
      x2: v[0], y2: v[1]
    });
  }
  for (var i = 0; i < vertices.length; ++i) {
    var v = vertices[i];
    c.drawArc({
      fillStyle: style,
      x: v[0], y: v[1],
      radius: 5
    });
  }
}

})
