function cross(u, v) {
  return u[0] * v[1] - u[1] * v[0];
}

function span(u, v) {
  return [v[0] - u[0], v[1] - u[1]];
}

function side(u, v) {
  var c = cross(u, v);
  if (c < 0) {
    return -1;
  } else if (c > 0) {
    return 1;
  } else {
    return 0;
  }
}

function distSq(u, v) {
  var dx = u[0] - v[0];
  var dy = u[1] - v[1];
  return dx * dx + dy * dy;
}

function segmentsIntersect(a, b, c, d) {
  // The segments intersect only if the endpoints of one segment are on the
  // opposite sides of the other (both ways).
  var u = span(a, b);
  var su = cross(u, span(a, c)) * cross(u, span(a, d));
  // If su is positive, the endpoints c and d are on the same side of
  // segment ab.
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
