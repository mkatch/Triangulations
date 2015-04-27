var steps = {

turn: function () {
  var vertices = Graph.fitVerticesInto(banana.vertices, 400, 400);
  var edges = banana.edges.slice();

  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    radius: 10,
    color: 'white'
  };
  g.edgeStyle = {
    width: 7,
    color: 'white',
  };
  g.draw($('#step-turn-this canvas'));

  triangulate.simple(vertices, edges, banana.faces);
  var qe = triangulate.makeQuadEdge(vertices, edges);
  triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
  triangulate.refineToRuppert(vertices, edges, qe.coEdges, qe.sideEdges, {
    minAngle: 32
  });

  g.draw($('#step-into-this canvas'));
},

sim: function () {
  $('#step-sim-7').on('impress:stepactivate', function () {
    $('.step.sim').addClass('foundation');
  });
  $('#step-sim-7').on('impress:stepleave', function () {
    $('.step.sim').removeClass('foundation');
  });
}

};
