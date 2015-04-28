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
},

pslg: function () {
  var vertices = [[424.25, 178.59375], [219.1875, 192.71875], [132.34375, 277.5625], [132.34375, 537.1875], [411.125, 537.1875], [482.84375, 485.65625], [534.375, 325.0625], [230.3125, 341.21875], [307.09375, 367.46875], [336.375, 441.21875], [225.25, 448.28125], [575.78125, 372.53125], [548.5, 474.5625], [716.1875, 448.28125]];
  var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 8], [8, 9], [9, 10], [10, 7], [11, 12], [12, 13], [13, 11], [6, 11], [1, 8], [5, 8]];
  var faces = [[[0, 1, 8, 5, 6]], [[1, 2, 3, 4, 5, 8, 9, 10, 7, 8]], [[11, 12, 13]]];

  vertices = Graph.fitVerticesInto(vertices, 600, 500);

  faces[0].color = 'rgba(255, 255, 255, 0.2)';
  faces[1].color = 'rgba(255, 255, 255, 0.4)';
  faces[2].color = 'rgba(255, 255, 255, 0.1)';

  var g = new Graph(vertices, edges, faces);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw($('#step-pslg-example canvas'));
},

simpleTri: function () {
  var vertices = [[248.5625, 206.65625], [124.28571, 302.34821], [165.72321, 538.08929], [392.85267999999996, 510.91964], [332.85267999999996, 582.36607], [458.56249999999994, 688.06696], [301.43303999999995, 770.91964], [347.13392999999996, 640.94196], [122.84374999999997, 563.78125], [125.71874999999997, 705.21875], [232.85268, 686.64732], [205.71875, 830.9375], [417.12946, 885.23214], [592.87054, 788.08929], [617.14286, 679.49107], [511.4375, 583.78125], [591.43304, 538.0625], [704.27232, 73.78125], [254.29911, 310.92411], [474.47915, 298.26635999999996], [528.57589, 433.7991099999999], [248.56695999999994, 463.7991099999999]];
  var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 0], [18, 19], [19, 20], [20, 21], [21, 18]];
  var faces = [[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [18, 19, 20, 21]]];

  var vertices = Graph.fitVerticesInto(vertices, 800, 600);
  for (var j = 0; j < edges.length; ++j)
    edges[j].width = 7;
  var c = $('#step-simple-triangulation canvas');
  var g = new Graph(vertices, edges.slice());
  g.vertexStyle = {
    radius: 10,
    color: 'white'
  };
  g.edgeStyle = {
    width: 3,
    color: 'white'
  };
  g.faceStyle = {
    color: 'rgba(255, 255, 255, 0.3)'
  }
  g.draw(c);

  var trace = [];
  triangulate.simple(vertices, g.edges, faces, trace);

  var interval;
  $('#step-simple-triangulation').on('impress:stepenter', function () {
    g.edges = edges.slice();
    g.faces = [];
    if (interval !== undefined)
      clearInterval(interval);
    var h = 0;
    interval = setInterval(function () {
      if (h < trace.length) {
        var t = trace[h];
        ++h;
        g.faces = [[t.selectFace]];
        g.edges.push(t.addDiag);
      } else {
        g.faces = faces;
        clearInterval(interval);
      }
      c.clearCanvas();
      g.draw(c);
    }, 500);
  });
  $('#step-simple-triangulation').on('impress:stepleave', function () {
    clearInterval(interval);
    interval = undefined;
  });
},

simpleTriBad: function () {
  var vertices = Graph.fitVerticesInto(banana.vertices, 400, 400);
  var edges = banana.edges.slice();
  triangulate.simple(vertices, edges, banana.faces);
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'black',
    radius: 10
  };
  g.edgeStyle = {
    color: 'black',
    width: 7
  };
  for (var j = banana.edges.length; j < edges.length; ++j)
    edges[j].width = 3;
  g.draw($('#step-simple-triangulation-bad canvas'));
},

delaunay: function () {
  var vertices = [[248.57143, 203.79075], [162.85714, 259.50504], [120.0, 365.21933], [151.42857, 490.93361], [262.85714, 569.50504], [385.71429, 496.6479], [420.0, 439.50504], [311.42857, 202.36218], [300, 300], [200, 400], [350, 420], [200, 300]];
  var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]];

  vertices = Graph.fitVerticesInto(vertices, 600, 800);
  Graph.markFixed(edges);
  Graph.markExternal(edges);

  edges.push([1, 11], [2, 9], [5, 10], [6, 10], [7, 8], [3, 9], [9, 11], [8, 11], [8, 10], [9, 10], [9, 4], [10, 4], [9, 8], [0, 11], [0, 8], [8, 6]);

  var canvas = $('#step-delaunay-example canvas')
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw(canvas);

  var tris = [[8, 9, 11], [5, 6, 10], [3, 4, 9]];
  for (var l = 0; l < tris.length; ++l) {
    var a = vertices[tris[l][0]];
    var b = vertices[tris[l][1]];
    var c = vertices[tris[l][2]];
    var p = geom.circumcenter(a, b, c);
    canvas.drawArc({
      x: p[0], y: p[1],
      radius: Math.sqrt(distSq(a, p)),
      strokeStyle: 'white',
      strokeWidth: 5,
      strokeDash: [10, 5]
    });
  }
},

cdt: function () {
  var vertices = [[300, 0], [300, 100], [220, 120], [100, 130], [380, 150], [230, 180]];
  var edges = [[0, 1], [2, 4], [0, 3], [0, 2], [0, 4], [1, 2], [1, 4], [2, 3], [2, 5], [3, 5], [4, 5]];
  var faces = [[[2, 4, 5]]];

  vertices = Graph.fitVerticesInto(vertices, 600, 600);
  edges[0].width = edges[1].width = 7;
  edges[0].dashed = edges[1].dashed = false;

  var canvas = $('#step-cdt-example canvas');
  var g = new Graph(vertices, edges, faces);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 5,
    dashed: true
  };
  g.faceStyle = {
    color: 'rgba(255, 255, 255, 0.3)'
  }
  g.draw(canvas);

  var a = vertices[2], b = vertices[5], c = vertices[4];
  var p = geom.circumcenter(a, b, c);
  canvas.drawArc({
    x: p[0], y: p[1],
    radius: Math.sqrt(distSq(a, p)),
    strokeStyle: 'white',
    strokeWidth: 5
  })
},

delaunayQuality: function () {
  var vertices = Graph.fitVerticesInto(banana.vertices, 400, 400);
  var edges = banana.edges.slice();
  triangulate.simple(vertices, edges, banana.faces);
  var qe = triangulate.makeQuadEdge(vertices, edges);
  triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw($('#step-delaunay-quality canvas'));
}

};
