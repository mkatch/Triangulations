function dot (u, v) {
    return u[0] * v[0] + u[1] * v[1];
}

function cross (u, v) {
  return u[0] * v[1] - u[1] * v[0];
}

function span (u, v) {
  return [v[0] - u[0], v[1] - u[1]];
}

function distSq (u, v) {
  var dx = u[0] - v[0];
  var dy = u[1] - v[1];
  return dx * dx + dy * dy;
}

// Returns boolean indicating whether edges ab and cd intersect.
function edgesIntersect (a, b, c, d) {
  // The edges intersect only if the endpoints of one edge are on the opposite
  // sides of the other (both ways).
  var u = span(a, b);
  var su = cross(u, span(a, c)) * cross(u, span(a, d));
  // If su is positive, the endpoints c and d are on the same side of
  // edge ab.
  if (su > 0) {
    return false;
  }
  var v = span(c, d);
  var sv = cross(v, span(c, a)) * cross(v, span(c, b));
  if (sv > 0) {
    return false;
  }
  // We still have to check for collinearity.
  if (su == 0 && sv == 0) {
    var abLenSq = distSq(a, b);
    return distSq(a, c) <= abLenSq || distSq(a, d) <= abLenSq;
  }
  return true;
}

// Given an origin c and direction defining vertex d, returns a comparator for
// points. The points are compared according to the angle they create with
// the vector cd.
function angleCompare (c, d) {
  var cd = span(c, d);
  // Check wether the angle ucd is smaller than vcd.
  return function (u, v) {
    var cu = span(c, u);
    var cdxcu = cross(cd, cu);
    if (cdxcu == 0 && dot(cd, cu) >= 0) {
      // The magnitude of ucd is 0. Such input shouldn't be present, but we
      // handle it for completeness.
      return true;
    }
    var cv = span(c, v);
    var cdxcv = cross(cd, cv);
    if (cdxcv == 0 && dot(cd, cv) >= 0) {
      return false;
    }
    if (cdxcu * cdxcv >= 0) {
      // The points u and v are on the same side of cd.
      return cross(cu, cv) >= 0;
    }
    // The one on the positive side has smaller angle.
    return cdxcu > 0;
  }
}

/*
function PSLGFaces(vertices, edges) {
  var n = vertices.length;
  var m = edges.length;

  // Direct the edges
  var edges = edges.slice();
  for (var j = 0; j < m; ++j) {
      var e = edges[j];
      edges.push([e[1], e[0]]);
  }
  m *= 2;

  // For each vertex, find outgoing edges.
  var outEdges = [];
  for (var i = 0; i < n; ++i) {
    outEdges[i] = [];
  }
  for (var j = 0; j < m; ++j) {
    var e = edges[j];
    adj[e[0]].push(j);
  }

  // Initialize edge-taken array
  var taken = [];
  for (var j = 0; j < m; ++j) {
    taken[j] = false;
  }

  for (var j0 = 0; j0 < m; ++j0) {
    if (taken[j0]) {
      continue;
    }
    var prev = edges[j0][0];
    var i = edges[j0][1];
    var first = prev;
    var face = [vertices[prev], vertices[i]];
    while (i != first) {

    }
  }
}
*/
