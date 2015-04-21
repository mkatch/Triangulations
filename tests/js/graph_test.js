$(document).ready(function () {

var c = $('#canvas');

var vertices = [
  [ 50, 100],
  [150,  50],
  [150, 150],
  [250,  50],
  [250, 150],
  [350, 100],
  [450,  50],
  [350, 150],
  [350, 250],
  [250, 250],
  [150, 250],
  [150, 350]
];

var edges = [
  [ 0,  1],
  [ 0,  2],
  [ 1,  2],
  [ 3,  4],
  [ 3,  5],
  [ 4,  5],
  [ 4,  7],
  [ 4,  9],
  [ 5,  6],
  [ 7,  8],
  [ 8,  9],
  [10, 11]
];

(new Graph(vertices, edges, [], { autoFaces: true })).makeInteractive(c);

})
