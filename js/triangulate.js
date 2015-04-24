var triangulate = (function () {

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
    var inabc = geom.pointInTriangle(a, b, c);
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

// Given a polygon as a list of vertex indices, returns it in a form of
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

// Checks wether any edge on path [nodeBeg, nodeEnd] intersects the segment ab.
// If nodeEnd is not provided, nodeBeg is interpreted as lying on a cycle and
// the whole cycle is tested. The edges that are spanned on equal (===) vertices
// are not considered intersecting.
function intersects (a, b, vertices, nodeBeg, nodeEnd) {
  function aux (node) {
    var c = vertices[node.i];
    var d = vertices[node.next.i];
    return c !== a && c !== b && d !== a && d !== b &&
           geom.edgesIntersect(a, b, c, d);
  }
  if (nodeEnd === undefined) {
    if (aux(nodeBeg))
      return true;
    nodeEnd = nodeBeg;
    nodeBeg = nodeBeg.next;
  }
  for (var node = nodeBeg; node !== nodeEnd; node = node.next) {
    if (aux(node))
      return true;
  }
  return false;
}

function findDeepestInside (a, b, c) {
  var inabc = geom.pointInTriangle(a, b, c);
  var acDistSq = geom.pointToEdgeDistSq(a, c);
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

// Given a triangulation graph, produces the quad-edge datastructure for fast
// local traversal. The result consists of two arrays: coEdges and sideEdges
// with one entry per edge each. The coEdges array is returned as list of vertex
// pairs, whereas sideEdges are represented by edge index quadruples. The output
// for external edges, which are not enclosed in any quad, is not defined.
//
// Consider edge ac enclosed by the quad abcd. Then its co-edge is bd and the
// side edges are: bc, cd, da, ab, in that order. Although the graph is not
// directed, the edges have direction implied by the implementation. The order
// of side edges is determined by the de facto orientation of the primary edge
// ac and its co-edge bd, but the directions of the side edges are arbitrary.
//
// WARNING: The procedure will change the orientation of edges.
function makeQuadEdge (vertices, edges) {
  // Prepare datas tructures for fast graph traversal.
  var coEdges = [];
  var sideEdges = [];
  for (var j = 0; j < edges.length; ++j) {
    coEdges[j] = [];
    sideEdges[j] = [];
  }

  // Find the outgoing edges for each vertex
  var outEdges = [];
  for (var i = 0; i < vertices.length; ++i)
    outEdges[i] = [];
  for (var j = 0; j < edges.length; ++j) {
    var e = edges[j];
    outEdges[e[0]].push(j);
    outEdges[e[1]].push(j);
  }

  // Process edges around each vertex.
  for (var i = 0; i < vertices.length; ++i) {
    var v = vertices[i];
    var js = outEdges[i];

    // Reverse edges, so that they point outward and sort them angularily.
    for (var k = 0; k < js.length; ++k) {
      var e = edges[js[k]];
      if (e[0] != i) {
        e[1] = e[0];
        e[0] = i;
      }
    }
    var angleCmp = geom.angleCompare(v, vertices[edges[js[0]][1]]);
    js.sort(function (j1, j2) {
      return angleCmp(vertices[edges[j1][1]], vertices[edges[j2][1]]);
    });

    // Associate each edge with neighbouring edges appropriately.
    for (var k = 0; k < js.length; ++k) {
      var jPrev = js[(js.length + k - 1) % js.length];
      var j     = js[k];
      var jNext = js[(k + 1) % js.length];
      // Node that although we could determine the whole co-edge just now, we
      // we choose to push only the endpoint edges[jPrev][1]. The other end,
      // i.e., edges[jNext][1] will be, or already was, put while processing the
      // edges of the opporite vertex, i.e., edges[j][1].
      coEdges[j].push(edges[jPrev][1]);
      sideEdges[j].push(jPrev, jNext);
    }
  }

  return { coEdges: coEdges, sideEdges: sideEdges };
}

function arraySubst2(a, x, y) {
  if (a[0] === x) a[0] = y;
  else            a[1] = y;
}

function arraySubst4(a, x, y) {
  if (a[0] === x) a[0] = y; else
  if (a[1] === x) a[1] = y; else
  if (a[2] === x) a[2] = y;
  else            a[3] = y;
}

// Given edges along with their quad-edge datastructure, flips the chosen edge
// j, maintaining the quad-edge structure integrity.
function flipEdge (edges, coEdges, sideEdges, j) {
  var edge = edges[j];
  var coEdge = coEdges[j];
  var j0 = sideEdges[j][0];
  var j1 = sideEdges[j][1];
  var j2 = sideEdges[j][2];
  var j3 = sideEdges[j][3];

  // Amend side edges
  arraySubst2(coEdges[j0], edge[0], coEdge[1]);
  arraySubst4(sideEdges[j0], j , j1);
  arraySubst4(sideEdges[j0], j3, j );

  arraySubst2(coEdges[j1], edge[0], coEdge[0]);
  arraySubst4(sideEdges[j1], j , j0);
  arraySubst4(sideEdges[j1], j2, j );

  arraySubst2(coEdges[j2], edge[1], coEdge[0]);
  arraySubst4(sideEdges[j2], j , j3);
  arraySubst4(sideEdges[j2], j1, j );

  arraySubst2(coEdges[j3], edge[1], coEdge[1]);
  arraySubst4(sideEdges[j3], j , j2);
  arraySubst4(sideEdges[j3], j0, j );

  // Flip
  edges[j] = coEdges[j];
  coEdges[j] = edge.slice(); // in order to not effect the input

  // Amend primary edge
  var tmp = sideEdges[j][0];
  sideEdges[j][0] = sideEdges[j][2];
  sideEdges[j][2] = tmp;
}

function isDelaunayEdge (vertices, edge, coEdge) {
  var a = vertices[edge[0]], c = vertices[edge[1]];
  var b = vertices[coEdge[0]], d = vertices[coEdge[1]];
  return !geom.pointInCircumcircle(a, c, b, d) &&
         !geom.pointInCircumcircle(a, c, d, b);
}

// Given edges along with their quad-edge datastructure, flips the chosen edge
// j it doesn't form a Delaunay triangulation with its enclosing quad. Returns
// true if a flip was performed.
function ensureDelaunayEdge (vertices, edges, coEdges, sideEdges, j) {
  if (!isDelaunayEdge(vertices, edges[j], coEdges[j])) {
    flipEdge(edges, coEdges, sideEdges, j);
    return true;
  }
  return false;
}

// Refines the given triangulation graph to be a Delaunay triangulation.
// The parameter fixedEdgeCnt indicates how many initial edges mut be
// preserved. Those are typically the borders of an object.
//
// The edges are modified in place and returned is the execution trace of the
// algorithm.
function refineToDelaunay (vertices, edges, fixedEdgeCnt) {
  var trace = [];
  var qe = makeQuadEdge(vertices, edges);
  var coEdges = qe.coEdges, sideEdges = qe.sideEdges;

  // We mark all edges as unsure, i.e., we don't know whether the enclosing
  // quads of those edges are properly triangulated.
  var unsureEdges = [];
  var unsure = [];
  for (var j = fixedEdgeCnt; j < edges.length; ++j) {
    unsureEdges.push(j);
    unsure[j] = true;
  }
  trace.push({ markedUnsure: unsureEdges.slice() });

  // The procedure used is the incremental Flip Algorithm. As long as there are
  // any, we fix the triangulation around an unsure edge and mark the
  // surrounding ones as unsure.
  while (unsureEdges.length > 0) {
    var j = unsureEdges.pop();
    traceEntry = {};
    if (ensureDelaunayEdge(vertices, edges, coEdges, sideEdges, j)) {
      traceEntry.flippedTo = edges[j].slice();
      var newUnsureCnt = 0;
      for (var k = 0; k < 4; ++k) {
        var sj = sideEdges[j][k];
        if (sj >= fixedEdgeCnt && !unsure[sj]) {
          unsureEdges.push(sj);
          unsure[sj] = true;
          ++newUnsureCnt;
        }
      }
      if (newUnsureCnt > 0)
        traceEntry.markedUnsure = unsureEdges.slice(-newUnsureCnt);
    }
    unsure[j] = false;
    traceEntry.ensured = j;
    trace.push(traceEntry);
  }

  return trace;
}

return {
  face: triangulateFace,
  makeQuadEdge: makeQuadEdge,
  flipEdge: flipEdge,
  refineToDelaunay: refineToDelaunay
}

})();
