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

function lenSq (v) {
  return v[0] * v[0] + v[1] * v[1];
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

// Given a simple polygon, returns its orientation, namely 1, if it's clockwise,
// -1, if it's counter-clockwise, and 0 if the orientation is undefined, i.e.,
// the area is 0.
function polygonOrientation (vertices, poly) {
  var area = 0;
  var v = vertices[poly[poly.length - 1]];
  for (var i = 0; i < poly.length; ++i) {
    var u = v;
    v = vertices[poly[i]];
    area += (u[0] + v[0]) * (u[1] - v[1])
  }
  return Math.sign(area);
}

// Given a polygon a point, determines whether the point lies strictly inside
// the polygon using the even-odd rule.
function pointInPolygon (vertices, poly, w) {
  function edgeVSRay (u, v, y) {
    if (u[1] > v[1]) {
      var tmp = u;
      u = v;
      v = tmp;
    }
    if (y <= u[1] || v[1] <  y) {
      return null;
    }
    var t = (y - u[1]) / (v[1] - u[1]);
    return u[0] + t * (v[0] - u[0]);
  }

  var v = vertices[poly[poly.length - 1]];
  var result = false;
  for (var i = 0; i < poly.length; ++i) {
    var u = v;
    v = vertices[poly[i]];
    if (u[1] == v[1]) {
      if (u[1] == w[1] && (w[0] - u[0]) * (w[0] - v[0]) <= 0) {
        return false;
      }
      continue;
    } else {
      var x = edgeVSRay(u, v, w[1]);
      if (x != null && w[0] > x) {
        result = !result;
      }
    }
  }
  return result;
}

// Check wether point p is within triangle abc.
function pointInTriangle (a, b, c, p) {
  var u = span(a, b);
  var v = span(a, c);
  var w = span(a, p);

  var vxu = cross(v, u);
  var vxw = cross(v, w);
  if (vxu * vxw < 0)
    return false;

  var uxv = -vxu;
  var uxw = cross(u, w);
  if (uxv * uxw < 0)
    return false;

  return Math.abs(uxw) + Math.abs(vxw) < Math.abs(uxv);
}

function pointToEdgeDistSq (u, v, p) {
  var uv = span(u, v);
  var pu = span(p, u);
  var uvxpu = cross(uv, pu);
  return uvxpu * uvxpu / lenSq(uv);
}
