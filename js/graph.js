function Graph (vertices, edges, faces) {
  this.vertices = vertices === undefined ? [] : vertices;
  this.edges    = edges    === undefined ? [] : edges;
  this.faces    = faces    === undefined ? [] : faces;

  this.vertexStyle = {
    color: 'black',
    radius: 4,
    showLabel: false
  };
  this.edgeStyle = {
    color: 'black',
    width: 3,
    showLabel: false
  };
  this.faceStyle = {
    color: 'gray'
  };
}

Graph.markFixed = function (edges) {
  for (var j = 0; j < edges.length; ++j)
    edges[j].fixed = true;
}

Graph.markExternal = function (edges) {
  for (var j = 0; j < edges.length; ++j)
    edges[j].external = true;
}

Graph.resetStyle = function (x) {
  delete x.color;
  delete x.width;
  delete x.dashed;
  delete x.radius;
  delete x.showLabel;
}

Graph.prototype = (function () {

  function getVertexStyle (v, defStyle) {
    return {
      color:     v.color     !== undefined ? v.color     : defStyle.color,
      radius:    v.radius    !== undefined ? v.radius    : defStyle.radius,
      showLabel: v.showLabel !== undefined ? v.showLabel : defStyle.showLabel
    };
  }

  function getEdgeStyle (e, defStyle) {
    return {
      color:     e.color     !== undefined ? e.color     : defStyle.color,
      width:     e.width     !== undefined ? e.width     : defStyle.width,
      dashed:    e.dashed    !== undefined ? e.dashed    : defStyle.dashed,
      showLabel: e.showLabel !== undefined ? v.showLabel : defStyle.showLabel
    };
  }

  function getFaceStyle (f, defStyle) {
    return f.color !== undefined ? f.color : defStyle.color;
  }

  function drawVertex (c, v, style) {
    c.drawArc({
      x: v[0], y: v[1],
      fillStyle: style.color,
      radius: style.radius
    });
  }

  function drawEdge (c, u, v, style) {
    c.drawLine({
      x1: u[0], y1: u[1],
      x2: v[0], y2: v[1],
      strokeStyle: style.color,
      strokeWidth: style.width,
      strokeDash: style.dashed ? [2 * style.width, style.width] : undefined
    });
  }

  function drawFace (c, f, vertices, style) {
    c.draw({ fn: function (ctx) {
      ctx.beginPath();
      for (var l = 0; l < f.length; ++l) {
        var poly = f[l];
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

  function drawLabel (c, p, l) {
    c.drawArc({
      x: p[0], y: p[1],
      fillStyle: 'white',
      radius: 8
    });
    c.drawText({
      x: p[0], y: p[1],
      fillStyle: 'black',
      fontSize: 9,
      text: l
    });
  }

return {
  constructor: Graph,

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

  draw: function (c) {
    for (var k = 0; k < this.faces.length; ++k) {
      var face = this.faces[k];
      var style = getFaceStyle(face, this.faceStyle);
      drawFace(c, face, this.vertices, style);
    }

    for (var j = 0; j < this.edges.length; ++j) {
      var e = this.edges[j];
      var u = this.vertices[e[0]];
      var v = this.vertices[e[1]];
      var style = getEdgeStyle(e, this.edgeStyle);
      drawEdge(c, u, v, style);
      if (style.showLabel)
        drawLabel(c, mid(u, v), j);
    }

    for (var i = 0; i < this.vertices.length; ++i) {
      var v = this.vertices[i];
      var style = getVertexStyle(v, this.vertexStyle);
      drawVertex(c, v, style);
      if (style.showLabel)
        drawLabel(c, v, i);
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
      g.draw(c);
    }

    triggerChanged(this);
    var vHeld = null;

    c.mousedown((function (event) {
      var m = [event.pageX - c.offset().left, event.pageY - c.offset().top];
      var i = this.getVertexAt(m);
      vHeld = i === undefined ? null : this.vertices[i];
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

  getVertexAt: function (m) {
    for (var i = 0; i < this.vertices.length; ++i) {
      var v = this.vertices[i];
      if (distSq(v, m) <= 16)
        return i;
    }
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
