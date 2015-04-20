function Graph (vertices, edges) {
  this.vertices = vertices.slice();
  this.edges = edges.slice();
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

return {
  constructor: Graph,

  getVertexStyle: getVertexStyle,
  setVertexStyle: setVertexStyle,

  getEdgeStyle: getEdgeStyle,
  setEdgeStyle: setEdgeStyle,

  draw: function (c) {
    c.clearCanvas();

    for (var j = 0; j < this.edges.length; ++j) {
      var e = this.edges[j];
      var u = this.vertices[e[0]];
      var v = this.vertices[e[1]];
      var style = this.getEdgeStyle(j);
      c.drawLine($.extend(style, {
        x1: u[0], y1: u[1],
        x2: v[0], y2: v[1]
      }));
    }

    for (var i = 0; i < this.vertices.length; ++i) {
      var v = this.vertices[i];
      var style = this.getVertexStyle(i);
      c.drawArc($.extend(style, { x: v[0], y:v[1] }));
    }
  },

  makeInteractive: function (c, onChange) {
    if (onChange != undefined) {
      onChange(this);
    }
    this.draw(c);

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
      if (onChange != undefined) {
        onChange(this);
      }
      this.draw(c);
    }).bind(this));

    c.mouseup(function (event) {
      vHeld = null;
    });
  }
};

})();
