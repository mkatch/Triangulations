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

console.log(PSLGFaces(vertices, edges));

})
