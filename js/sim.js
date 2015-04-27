function Sim (settings) {
  var settings  = settings          !== undefined ? settings          : {};
  this.vertices = settings.vertices !== undefined ? settings.vertices : [];
  this.edges    = settings.edges    !== undefined ? settings.edges    : [];
  this.k        = settings.k        !== undefined ? settings.k        : 10;
  this.g        = settings.g        !== undefined ? settings.g        : 10;
  this.d        = settings.d        !== undefined ? settings.d        : 0.5;
  this.yMax     = settings.yMax     !== undefined ? settings.yMax     : 100;

  this.vels = [];
  for (var i = 0; i < this.vertices.length; ++i)
    this.vels[i] = [0, 0];

  this.lengths = [];
  for (var j = 0; j < this.edges.length; ++j) {
    var e = this.edges[j];
    var u = this.vertices[e[0]], v = this.vertices[e[1]];
    this.lengths[j] = Math.sqrt(distSq(u, v));
  }
}

Sim.prototype = {
  constructor: Sim,

  step: function (dt) {
    var accs = [];
    for (var i = 0; i < this.vertices.length; ++i)
      accs[i] = [0, this.g];

    for (var j = 0; j < this.edges.length; ++j) {
      var e = this.edges[j];
      var iu = e[0], u = this.vertices[iu], accu = accs[iu];
      var iv = e[1], v = this.vertices[iv], accv = accs[iv];
      var uv = span(u, v);
      var length = Math.sqrt(lenSq(uv));
      var alpha = this.k * (length - this.lengths[j]) / length;
      var dxacc = alpha * uv[0], dyacc = alpha * uv[1];
      accu[0] += dxacc, accu[1] += dyacc;
      accv[0] -= dxacc, accv[1] -= dyacc;
    }

    for (var i = 0; i < this.vertices.length; ++i) {
      var u = this.vertices[i];
      var vel = this.vels[i];
      var acc = accs[i];
      var beta = Math.exp(-this.d * dt);
      vel[0] += dt * acc[0], vel[1] += dt * acc[1];
      vel[0] *= beta       , vel[1] *= beta;
        u[0] += dt * vel[0],   u[1] += dt * vel[1];

      u[1] = Math.min(this.yMax, u[1]);
    }
  }
}
