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

function mid (u, v) {
  return [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
}

var geom = (function () {

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
  // Compare angles ucd and vcd
  return function (u, v) {
    var cu = span(c, u);
    var cv = span(c, v);
    var cvxcu = cross(cv, cu)
    // Check if they happen to be equal
    if (cvxcu == 0 && dot(cu, cv) >= 0)
      return 0;
    var cuxcd = cross(cu, cd);
    var cvxcd = cross(cv, cd);
    // If one of the angles has magnitude 0, it must be strictly smaller than
    // the other one.
    if (cuxcd == 0 && dot(cd, cu) >= 0)
      return -1;
    if (cvxcd == 0 && dot(cd, cv) >= 0)
      return 1;
    // If the points u and v are on the same side of cd, the one that is on the
    // right side of the other must form a smaller angle.
    if (cuxcd * cvxcd >= 0)
      return cvxcu;
    // The one on the left side of cd side forms a smaller angle.
    return cuxcd;
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
  if (area > 0)
    return 1;
  else if (area < 0)
    return -1;
  else
    return 0;
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

// Check wether point p is within triangle abc or on its border.
function pointInTriangle (a, b, c) {
  var u = span(a, b);
  var v = span(a, c);
  var vxu = cross(v, u);
  var uxv = -vxu;

  return function (p) {
    var w = span(a, p);

    var vxw = cross(v, w);
    if (vxu * vxw < 0)
      return false;

    var uxw = cross(u, w);
    if (uxv * uxw < 0)
      return false;

    return Math.abs(uxw) + Math.abs(vxw) <= Math.abs(uxv);
  }
}

function pointToEdgeDistSq (u, v) {
  var uv = span(u, v);
  var uvLenSq = lenSq(uv);
  return function (p) {
    var uvxpu = cross(uv, span(p, u));
    return uvxpu * uvxpu / uvLenSq;
  };
}

// Return the center of the circumscribed circle of triangle abc.
function circumcenter (a, b, c) {
  // Taken from https://www.ics.uci.edu/~eppstein/junkyard/circumcenter.html
  var xa = a[0], ya = a[1], xb = b[0], yb = b[1], xc = c[0], yc = c[1];
  var d = 2 * ((xa - xc) * (yb - yc) - (xb - xc) * (ya - yc));
  var ka = ((xa - xc) * (xa + xc) + (ya - yc) * (ya + yc));
  var kb = ((xb - xc) * (xb + xc) + (yb - yc) * (yb + yc))
  var xp = ka * (yb - yc) - kb * (ya - yc);
  var yp = kb * (xa - xc) - ka * (xb - xc);
  return [xp / d, yp / d];
}

// Check whether v is strictly in the interior of the circumcircle of the
// triangle abc.
function pointInCircumcircle (a, b, c, v) {
  var p = circumcenter(a, b, c);
  return distSq(p, v) < distSq(a, p);
}

function triangleArea (a, b, c) {
  return ( a[0] * (b[1] - c[1])
         + b[0] * (c[1] - a[1])
         + c[0] * (a[1] - b[1]) ) / 2;
}

return {
  edgesIntersect: edgesIntersect,
  angleCompare: angleCompare,
  polygonOrientation: polygonOrientation,
  pointInPolygon: pointInPolygon,
  pointInTriangle: pointInTriangle,
  pointToEdgeDistSq: pointToEdgeDistSq,
  circumcenter: circumcenter,
  pointInCircumcircle: pointInCircumcircle
}

})();
