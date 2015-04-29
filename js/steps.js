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
},

flip: function () {
  var baseCanvas = $('#step-edge-reversed canvas.base');
  var vertices = [[200, 50], [100, 350], [240, 450], [400, 300]];
  var edges = [[0, 2], [0, 1], [1, 2], [2, 3], [3, 0]];
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw(baseCanvas);

  var arcCanvas = $('#step-edge-reversed canvas.arcs');
  var a = vertices[0], b = vertices[1], c = vertices[2], d = vertices[3];
  var p = geom.circumcenter(a, b, c);
  arcCanvas.drawArc({
    x: p[0], y: p[1],
    radius: Math.sqrt(distSq(a, p)),
    strokeStyle: 'white',
    strokeWidth: 5,
    strokeDash: [10, 5]
  });
  p = geom.circumcenter(a, c, d);
  arcCanvas.drawArc({
    x: p[0], y: p[1],
    radius: Math.sqrt(distSq(a, p)),
    strokeStyle: 'white',
    strokeWidth: 5,
    strokeDash: [10, 5]
  });

  vertices[0][1] += 100
  var flipCanvas = $('#step-flip-2 canvas');
  g.draw(flipCanvas);
  var phis = [[1, 5], [0, 3.4], [2, 8], [4, -1]];
  var fs = [[0.3, 0.6], [0.2, 1], [0.4, 0.5], [0.3, 0.7]];
  var aplis = [[150, 100], [60, 40], [90, 40], [30, 20]];
  var dt = 1 / 30;
  var interval;
  var vertices0 = vertices.slice();
  var t = 0;
  for (var j = 1; j < edges.length; ++j)
    edges[j].fixed = true;
  $('#step-flip-2').on('impress:stepenter', function () {
    if (interval !== undefined)
      clearInterval(interval);
    interval = setInterval(function () {
      t += dt;
      for (var i = 0; i < vertices.length; ++i) {
        var phi = phis[i], ampl = aplis[i], f = fs[i], v0 = vertices0[i];
        vertices[i] = [
          v0[0] + ampl[0] * Math.sin(phi[0] + 2 * Math.PI * f[0] * t),
          v0[1] + ampl[1] * Math.sin(phi[1] + 2 * Math.PI * f[1] * t)
        ];
      }
      var qe = triangulate.makeQuadEdge(vertices, edges);
      triangulate.refineToDelaunay(vertices, edges, qe.coEdges, qe.sideEdges);
      flipCanvas.clearCanvas();
      g.draw(flipCanvas);
    }, dt * 1000);
  });
  $('#step-flip-2').on('impress:stepleave', function () {
    clearInterval(interval);
    interval = undefined;
  });
},

flipProof: function () {
  var canvas1 = $('#step-flip-algo-proof-2 canvas.step-1');
  var canvas2 = $('#step-flip-algo-proof-2 canvas.step-2');
  var a = [92, 172], b = [76, 394], c = [374, 394], d = [178, 66];
  var p = [344, 226];
  var vertices = [p, a, b, c];
  var edges = [[0, 1], [0, 3], [1, 2], [2, 3], [3, 1]];
  edges[0].dashed = edges[1].dashed = true;
  var q = geom.circumcenter(a, b, c);
  canvas1.drawArc({
    x: q[0], y: q[1],
    radius: Math.sqrt(distSq(a, q)),
    fillStyle: 'rgba(255, 255, 255, 0.3)'
  });
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw(canvas1);
  vertices.push(d);
  edges.push([4, 0], [4, 1], [4, 3]);
  edges[5].dashed = true;
  g.draw(canvas2);
  var r = geom.circumcenter(c, d, a);
  canvas2.drawArc({
    x: r[0], y: r[1],
    radius: Math.sqrt(distSq(a, r)),
    fillStyle: 'rgba(255, 255, 255, 0.3)'
  });
},

flipAngle: function () {
  var vertices = Graph.fitVerticesInto(
    [[249, 346], [94, 270], [68, 34], [300, 100]],
    400, 400, 40
  );
  for (var i = 0; i < 4; ++i)
    vertices.push([vertices[i][0] + 400, vertices[i][1]]);
  var edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], [0, 2],
    [4, 5], [5, 6], [6, 7], [7, 4], [5, 7]];
  var g = new Graph(vertices, edges);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 7
  };
  g.draw($('#step-flip-algo-angles-2 canvas'));
},

flipVisu: function () {
  var canvas = $('#step-flip-visu canvas')
  var vertices = [[518.5625, 100.9375], [240.0, 142.375], [162.69615, 248.0172], [295.70982, 383.77679], [108.06828, 349.01822], [34.290179, 453.79464], [35.71875, 593.78125], [340.0, 593.78125], [401.4375, 679.5], [635.71875, 716.65625], [694.28125, 526.65625], [617.15625, 429.5], [645.71875, 236.65625], [520.0, 183.78125], [508.5625, 380.9375], [591.4375, 578.0625], [508.5625, 613.78125], [428.5625, 530.9375]];
  var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 0], [14, 15], [15, 16], [16, 17], [17, 14]];
  var faces = [[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [14, 15, 16, 17]]];
  vertices = Graph.fitVerticesInto(vertices, 800, 600);
  for (var j = 0; j < edges.length; ++j) {
    edges[j].fixed = true;
    edges[j].width = 7;
  }
  triangulate.simple(vertices, edges, faces);
  var edges0 = edges.slice();
  var g = new Graph(vertices, edges, faces);
  g.vertexStyle = {
    color: 'white',
    radius: 10
  };
  g.edgeStyle = {
    color: 'white',
    width: 3
  };
  g.faceStyle = {
    color: 'rgba(255, 255, 255, 0.3)'
  }
  g.draw(canvas);

  var qe = triangulate.makeQuadEdge(vertices, edges);
  var trace = [];
  triangulate.refineToDelaunay(
    vertices, edges, qe.coEdges, qe.sideEdges, trace);
  var interval;
  var edgesBase = edges;
  $('#step-flip-visu').on('impress:stepenter', function () {
    var edges = edges0.slice();
    var h = new Graph(vertices, edges, faces);
    h.vertexStyle = g.vertexStyle;
    h.edgeStyle = g.edgeStyle;
    h.faceStyle = g.faceStyle;
    if (interval !== undefined)
      clearInterval(interval);
    var l = 0;
    interval = setInterval(function () {
      if (l < trace.length) {
        var t = trace[l];
        ++l;
        if (t.ensured !== undefined)
          edges[t.ensured].color = 'white';
        if (t.markedUnsure !== undefined)
          for (var k = 0; k < t.markedUnsure.length; ++k)
          edges[t.markedUnsure[k]].color = 'black';
        if (t.flippedTo !== undefined)
          edges[t.ensured] = t.flippedTo;
      } else {
        clearInterval(interval);
      }
      canvas.clearCanvas();
      h.draw(canvas);
    }, 300);
  });
  $('#step-flip-fisu').on('impress:stepleave', function () {
    clearInterval(interval);
    interval = undefined;
  })
}

};
