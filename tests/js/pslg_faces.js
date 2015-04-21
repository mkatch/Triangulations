$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 2],
  [2, 1]
];

var edges = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4]
];

c.draw({ fn: function(ctx) {
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.lineTo(30, 600);
  ctx.lineTo(800, 600);
  ctx.lineTo(800, 30);
  ctx.closePath();

  ctx.moveTo(10, 10);
  ctx.lineTo(100, 40);
  ctx.lineTo(30, 100);
  ctx.fillStyle = 'gray';
  ctx.closePath();
  ctx.fill();
}});

})
