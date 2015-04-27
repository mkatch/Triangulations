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
    color: 'white'
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


sim4: function () {
  var interval;
  $('#step-sim-4').on('impress:stepactivate', function () {
    var c = $('#step-sim-4 canvas');
    c.clearCanvas();

    var vertices = Graph.fitVerticesInto(banana.vertices, 800, 500);
    var edges = banana.edges.slice();
    //triangulate.simple(vertices, edges, banana.faces);
    //var qe = triangulate.makeQuadEdge(vertices, edges);
    //triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
    //triangulate.refineToRuppert(vertices, edges, qe.coEdges, qe.sideEdges);

    var g = new Graph(vertices, edges);
    g.vertexStyle = {
      radius: 10,
      color: 'black'
    };
    g.edgeStyle = {
      width: 7,
      color: 'black'
    }
    g.draw(c);

    var sim = new Sim({
      vertices: vertices,
      edges: edges,
      yMax: 590,
      g: 100,
      k: 200,
    });
    var dt = 1 / 30;

    if (interval !== undefined)
      clearInterval(interval);
    interval = setInterval(function () {
      sim.step(dt);
      c.clearCanvas();
      g.draw(c);
    }, dt * 1000);
  });
  $('#step-sim-4').on('impress:stepleave', function () {
    clearInterval(interval);
    interval = undefined;
  });
},

sim7: function () {
  var interval;
  $('#step-sim-7').on('impress:stepactivate', function () {
    $('.step.sim').addClass('foundation');
    $('#step-sim-4 canvas').css('visibility', 'hidden');
    var c = $('#step-sim-7 canvas');
    c.clearCanvas();

    var vertices = Graph.fitVerticesInto(banana.vertices, 800, 500);
    var edges = banana.edges.slice();
    triangulate.simple(vertices, edges, banana.faces);
    var qe = triangulate.makeQuadEdge(vertices, edges);
    triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
    //triangulate.refineToRuppert(vertices, edges, qe.coEdges, qe.sideEdges);

    var g = new Graph(vertices, edges);
    g.vertexStyle = {
      radius: 10,
      color: 'white'
    };
    g.edgeStyle = {
      width: 7,
      color: 'white'
    }
    g.draw(c);

    var sim = new Sim({
      vertices: vertices,
      edges: edges,
      yMax: 590,
      g: 100,
      k: 200,
    });
    var dt = 1 / 30;

    if (interval !== undefined)
      clearInterval(interval);
    interval = setInterval(function () {
      sim.step(dt);
      c.clearCanvas();
      g.draw(c);
    }, dt * 1000);
  });
  $('#step-sim-7').on('impress:stepleave', function () {
    clearInterval(interval);
    interval = undefined;
    $('.step.sim').removeClass('foundation');
  });
  $('.step.sim').on('impress:stepenter', function () {
    $('#step-sim-4 canvas').css('visibility', 'visible');
  });
},

goodNews: function () {
  var vertices = [[147.85714, 310.21932], [84.28571399999998, 496.6479], [278.57142999999996, 530.93362], [305.71428999999995, 566.6479], [404.28571999999997, 434.50504], [356.42857, 315.21933], [266.42857, 324.50504], [287.14286, 425.21933], [192.23636999999997, 423.01354000000003], [169.28571999999997, 463.79076000000003], [147.85713999999996, 410.93362], [241.42856999999998, 362.36218], [244.28570999999997, 280.93361000000004]];
  var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 0], [1, 9], [0, 2]];

  vertices = Graph.fitVerticesInto(vertices, 400, 400);
  edges[13].dashed = true;
  edges[14].dashed = true;

  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw($('#step-good-news-proof-3 canvas'));
}

};
