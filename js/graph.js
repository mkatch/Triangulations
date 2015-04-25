function Graph (vertices, edges, faces) {
  this.vertices = vertices === undefined ? [] : vertices;
  this.edges    = edges    === undefined ? [] : edges;
  this.faces    = faces    === undefined ? [] : faces;
}

Graph.prototype = (function () {

  var DEFAULT_VERTEX_STYLE = {
    fillStyle: 'black',
    radius: 4
  };
  var vertexStyle;
  var vertexStyles = {};
  function getVertexStyle(i) {
      return $.extend({}, DEFAULT_VERTEX_STYLE, vertexStyle, vertexStyles[i]);
  }
  function setVertexStyle() {
    switch (arguments.length) {
      case 1: vertexStyle = arguments[0]; break;
      case 2:
        if ($.isEmptyObject(arguments[1])) {
          delete vertexStyles[arguments[0]];
        } else {
          vertexStyles[arguments[0]] = arguments[1];
        }
        break;
    }
  }

  var DEFAULT_EDGE_STYLE = {
    strokeStyle: 'black',
    strokeWidth: 3,
    strokeDash: null
  };
  var edgeStyle;
  var edgeStyles = {};
  function getEdgeStyle(i) {
    return $.extend({}, DEFAULT_EDGE_STYLE, edgeStyle, edgeStyles[i]);
  }
  function setEdgeStyle() {
    switch (arguments.length) {
      case 1: edgeStyle = arguments[0]; break;
      case 2:
        if ($.isEmptyObject(arguments[1])) {
          delete edgeStyles[arguments[0]];
        } else {
          edgeStyles[arguments[0]] = arguments[1];
        }
        break;
    }
  }

  var DEFAULT_FACE_STYLE = 'gray';
  var faceStyle;
  var faceStyles = {};
  function getFaceStyle(k) {
    if (faceStyles[k] != undefined) {
      return faceStyles[k];
    } else if (faceStyle != undefined) {
      return faceStyle;
    } else {
      return DEFAULT_FACE_STYLE;
    }
  }
  function setFaceStyle() {
    switch (arguments.length) {
      case 1: faceStyle = arguments[0]; break;
      case 2:
        if ($.isEmptyObject(arguments[1])) {
          delete faceStyles[arguments[0]];
        } else {
          faceStyles[arguments[0]] = arguments[1];
        }
        break;
    }
  }

return {
  constructor: Graph,

  getVertexStyle: getVertexStyle,
  setVertexStyle: setVertexStyle,

  getEdgeStyle: getEdgeStyle,
  setEdgeStyle: setEdgeStyle,

  getFaceStyle: getFaceStyle,
  setFaceStyle: setFaceStyle,

  // Returns the orientation of a face, defined as the orientation of the
  // outermost polygon component.
  faceOrientation: function (k) {
    var face = this.faces[k];
    // The outermost polygon is the one with the leftmost vertex. This may not
    // be true if there are tangent polygons, but we don't bother.
    var outerPoly = face[0];
    var xMin = this.vertices[outerPoly[0]][0];
    for (var l = 0; l < face.length; ++l) {
      var poly = face[l];
      for (var m = 0; m < poly.length; ++m) {
        var i = poly[m];
        var x = this.vertices[i][0];
        if (x < xMin) {
          outerPoly = poly;
          break;
        }
      }
    }
    return geom.polygonOrientation(this.vertices, outerPoly);
  },

  draw: function (c, settings) {
    if (settings === undefined)
      settings = {}
    var vertices = this.vertices;

    // Draw faces
    for (var k = 0; k < this.faces.length; ++k) {
      var face = this.faces[k];
      var style = this.getFaceStyle(k);
      //if (this.faceOrientation(k) <= 0)
      //  continue;
      c.draw({ fn: function (ctx) {
        ctx.beginPath();
        for (var l = 0; l < face.length; ++l) {
          var poly = face[l];
          var v = vertices[poly[0]];
          ctx.moveTo(v[0], v[1]);
          for (var m = 1; m < poly.length; ++m) {
            v = vertices[poly[m]];
            ctx.lineTo(v[0], v[1]);
          }
          ctx.closePath();
        }
        ctx.fillStyle = style;
        ctx.fill();
      }});
    }

    // Draw edges
    for (var j = 0; j < this.edges.length; ++j) {
      var e = this.edges[j];
      var u = this.vertices[e[0]];
      var v = this.vertices[e[1]];
      var style = this.getEdgeStyle(j);
      c.drawLine($.extend(style, {
        x1: u[0], y1: u[1],
        x2: v[0], y2: v[1]
      }));
      if (settings.edgeNumbers) {
        var w = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
        c.drawArc({
          x: w[0], y: w[1],
          fillStyle: 'white',
          radius: 12
        });
        c.drawText({
          x: w[0], y: w[1],
          fillStyle: 'black',
          text: j
        });
      }
    }

    // Draw vertices
    for (var i = 0; i < this.vertices.length; ++i) {
      var v = this.vertices[i];
      var style = this.getVertexStyle(i);
      c.drawArc($.extend(style, { x: v[0], y:v[1] }));
    }
  },

  makeInteractive: function (settings) {
    var g = this;
    var c = settings.canvas;
    function triggerChanged () {
      if (settings.autoFaces)
        g.computeFaces();
      if (settings.onChange != undefined)
        settings.onChange(g);
      if (settings.clearCanvas)
        c.clearCanvas();
      g.draw(c, settings);
    }

    triggerChanged(this);
    var vHeld = null;

    c.mousedown((function (event) {
      var m = [event.pageX - c.offset().left, event.pageY - c.offset().top];
      for (var i = 0; i < this.vertices.length; ++i) {
        var v = this.vertices[i];
        var radius = Math.max(this.getVertexStyle(i).radius, 4);
        if (distSq(v, m) <= radius * radius) {
          vHeld = v;
          return;
        }
      }
      vHeld = null;
    }).bind(this));

    c.mousemove((function (event) {
      if (vHeld == null) {
        return;
      }
      vHeld[0] = event.pageX - c.offset().left;
      vHeld[1] = event.pageY - c.offset().top;
      triggerChanged(this);
    }).bind(this));

    c.mouseup(function (event) {
      vHeld = null;
    });
  },

  // Assuming the graph is planar, computes its faces.
  computeFaces: function () {
    var vertices = this.vertices;
    var edges = this.edges.slice(); // We don't wanna modify the original edges
    var n = vertices.length;
    var m = edges.length;

    // Direct the edges
    for (var j = 0; j < m; ++j) {
        var e = edges[j];
        edges.push([e[1], e[0]]);
    }
    m *= 2;

    // For each vertex, find outgoing edges.
    var outEdges = [];
    for (var i = 0; i < n; ++i)
      outEdges[i] = [];
    for (var j = 0; j < m; ++j) {
      var e = edges[j];
      outEdges[e[0]].push(j);
    }

    // Add looping edges for isolated vertices.
    for (var i = 0; i < n; ++i) {
      if (outEdges[i].length == 0) {
        edges.push([i, i]);
        outEdges[i].push(m);
        ++m;
      }
    }

    // Initialize the edge-taken array.
    var taken = [];
    for (var j = 0; j < m; ++j)
      taken[j] = false;

    // For every edge, find the polygon it belongs to.
    var polies = [];
    for (var j0 = 0; j0 < m; ++j0) {
      if (taken[j0])
        continue;
      var iPrev = edges[j0][0];
      var i = edges[j0][1];
      var iFirst = iPrev;
      var poly = [iPrev];
      while (i != iFirst) {
        // Find the edge with the smallest angle with respect to the incoming
        // direction.
        var cmp = geom.angleCompare(vertices[i], vertices[iPrev]);
        var kBest = -1;
        var vBest = null;
        for (var k = 0; k < outEdges[i].length; ++k) {
          var j = outEdges[i][k];
          if (edges[j][1] == iPrev)
            continue;
          var v = vertices[edges[j][1]];
          if (kBest < 0 || cmp(v, vBest) < 0) {
            kBest = k;
            vBest = v;
          }
        }
        // Turn back in case of a dead-end. It is guaranteed that the returning
        // edge is the only outgoing left.
        if (kBest < 0)
          kBest = 0;

        // Mark the next edge as taken.
        jBest = outEdges[i][kBest];
        taken[jBest] = true;
        outEdges[i][kBest] = outEdges[i].pop(); // Tricky array remove.

        // Proceed
        poly.push(i);
        iPrev = i;
        i = edges[jBest][1];
      }
      polies.push(poly);
    }

    // Some faces, namely those with holes, consist of multiple polygons. Here,
    // we assemble them.

    // Find the full polygons and the holes.
    var faces = [];
    var holes = [];
    for (var k = 0; k < polies.length; ++k) {
      if (geom.polygonOrientation(vertices, polies[k]) > 0)
        faces.push([polies[k]]);
      else
        holes.push(polies[k]);
    }

    // Distribute holes to their respective faces. Holes not inside any filled
    // poly, belong to the "outer" (infinite) face.
    var outerFace = [];
    for (var l = 0; l < holes.length; ++l) {
      var hole = holes[l];
      var v = vertices[hole[0]];
      var foundFace = false;
      for (var k = 0; k < faces.length; ++k) {
        var poly = faces[k][0];
        if (geom.pointInPolygon(vertices, poly, v)) {
          faces[k].push(hole);
          foundFace = true;
          break;
        }
      }
      if (!foundFace)
        outerFace.push(hole);
    }
    faces.push(outerFace);

    this.faces = faces;
  }
};

})();
