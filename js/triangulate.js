// Given a polygon as a list ov vertex indices, returns it in a form of
// a doubly linked list.
function makeLinkedPoly(poly) {
  var linkedPoly = { i: poly[0] };
  var node = linkedPoly;
  for (var l = 1; l < poly.length; ++l) {
    var prevNode = node;
    node = { i: poly[l] };
    prevNode.next = node;
    node.prev = prevNode;
  }
  node.next = linkedPoly;
  linkedPoly.prev = node;
  return linkedPoly;
}

function findConvexVertex(vertices, poly) {
  var node = poly;
  do {
    var a = vertices[poly.prev.i];
    var b = vertices[poly.i];
    var c = vertices[poly.next.i];
  } while (node !== poly);
  return null;
}

function triangulateFace(vertices, face) {
  // Convert the polygon components into linked lists. We assume the first
  // polygon is the outermost, and the rest, if present, are holes.
  var polies = [makeLinkedPoly(face[0])];
  var holes = [];
  for (var k = 1; k < face.length; ++k) {
    holes.push(makeLinkedPoly(face[k]));
  }

  // We handle only the outer polygons. We start with only one, but more are
  // to come because of splitting. The holes are eventually merged in.
  // In each iteration a diagonal is added.
  var diagonals = [];
  while (polies.length > 0) {
    var poly = polies.pop();

    // First we find a locally convex vertex.
    var node = poly;
    var a, b, c;
    var convex = false;
    do {
      a = vertices[node.prev.i];
      b = vertices[node.i];
      c = vertices[node.next.i];
      convex = cross(span(a, b), span(b, c)) < 0;
      node = node.next;
    } while (!convex && node !== poly);
    if (!convex)
      continue;
    var aNode = node.prev.prev;
    var bNode = node.prev;
    var cNode = node;

    // We try to make a diagonal out of ac. This is possible only if it lies
    // completely inside the polygon.
    var acOK = true;

    // Ensuring there are no intersections of ac with other edges doesn't
    // guarantee that ac lies within the poly. It is also possible that the
    // whole polygon is inside the triangle abc. Therefore we early reject the
    // case when the immediate neighbors of vertices a and c are inside abc.
    // Note that if ac is already an edge, it will also be rejected.
    var inabc = pointInTriangle(a, b, c);
    acOK = !inabc(vertices[aNode.prev.i]) && !inabc(vertices[cNode.next.i]);

    // Now we proceed with checking the intersections with ac.
    if (acOK)
      acOK = !intersects(a, c, vertices, cNode.next, aNode.prev);
    for (var l = 0; acOK && l < holes.length; ++l)
      acOK = !intersects(a, c, vertices, holes[l]);


    var split;
    var fromNode;
    var toNode;
    if (acOK) {
      // No intersections. We can easily connect a and c.
      fromNode = cNode;
      toNode = aNode;
      split = true;
    } else {
      //return diagonals;
      // If there are intersections, we have to find the closes vertex to b in
      // the direction perpendicular to ac, i.e., furthest from ac. It is
      // guaranteed that such a vertex forms a legal diagonal with b.
      var findBest = findDeepestInside(a, b, c);
      var best = cNode.next !== aNode
               ? findBest(vertices, cNode.next, aNode) : undefined;
      var lHole = -1;
      for (var l = 0; l < holes.length; ++l) {
        var newBest = findBest(vertices, holes[l], holes[l], best);
        if (newBest !== best)
          lHole = l;
        best = newBest;
      }

      fromNode = bNode;
      toNode = best;

      if (lHole < 0) {
        // The nearest vertex does not come from a hole. It is lies on the outer
        // polygon itself (or is undefined).
        split = true;
      } else {
        // The nearest vertex is found on a hole. The hole will be merged into
        // the currently processed poly, so we remove it from the hole list.
        holes.splice(lHole, 1);
        split = false;
      }
    }

    if (toNode == undefined) {
      // It was a triangle all along!
      continue;
    }

    diagonals.push([fromNode.i, toNode.i]);

    // TODO: Elaborate
    var poly1 = { i: fromNode.i, next: fromNode.next };
    poly1.prev = { i: toNode.i, prev: toNode.prev, next: poly1 };
    fromNode.next.prev = poly1;
    toNode.prev.next = poly1.prev;

    fromNode.next = toNode;
    toNode.prev = fromNode;
    var poly2 = fromNode;

    if (split)
      polies.push(poly1, poly2);
    else
      polies.push(poly2);
  }
  return diagonals;
}

// Checks wether any edge on path [nodeBeg, nodeEnd] intersects the segment ab.
// If nodeEnd is not provided, nodeBeg is interpreted as lying on a cycle and
// the whole cycle is tested.
function intersects (a, b, vertices, nodeBeg, nodeEnd) {
  if (nodeEnd === undefined) {
    if (edgesIntersect(a, b, vertices[nodeBeg.i], vertices[nodeBeg.next.i]))
      return true;
    nodeEnd = nodeBeg;
    nodeBeg = nodeBeg.next;
  }
  for (var node = nodeBeg; node !== nodeEnd; node = node.next) {
    if (edgesIntersect(a, b, vertices[node.i], vertices[node.next.i]))
      return true;
  }
  return false;
}

function findDeepestInside (a, b, c) {
  var inabc = pointInTriangle(a, b, c);
  var acDistSq = pointToEdgeDistSq(a, c);
  return function (vertices, nodeBeg, nodeEnd, bestNode) {
    var maxDepthSq = bestNode != undefined
                   ? acDistSq(vertices[bestNode.i]) : -1;
    var node = nodeBeg;
    do {
      var v = vertices[node.i];
      if (inabc(v)) {
        var depthSq = acDistSq(v);
        if (depthSq > maxDepthSq) {
          maxDepthSq = depthSq;
          bestNode = node;
        }
      }
      node = node.next;
    } while (node !== nodeEnd);
    return bestNode;
  }
}

function linkedPolyToString(poly) {
  var node = poly;
  var s = "";
  do {
    s += node.i + " ";
    node = node.next;
  } while (node !== poly);
  return s;
}
