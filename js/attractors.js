/**
 * @author gnya / https://twitter.com/gnya_a
 */


class Attractor {
  constructor() {
    this.scale = null;
    this.caption = null;
    this.comment = null;
  }

  f(t, u) {
    throw new Error('Not Implemented');
  }
}


class LorenzAttractor extends Attractor {
  constructor(p, r, b) {
    super();
    this.scale = 8;
    this.caption = 'Lorenz Attractor, 1963';
    this.comment = 'Edward Lorenz (b. 1917)';
    this.p = p;
    this.r = r;
    this.b = b;
  }

  f(t, u) {
    var v = new THREE.Vector3();

    // dx/dt = - p * x + p * y
    // dy/dt = - x * z + r * x - y
    // dz/dt =   z * y - b * z
    v.x = - this.p * u.x + this.p * u.y;
    v.y = - u.x    * u.z + this.r * u.x - u.y;
    v.z =   u.x    * u.y - this.b * u.z;

    return v;
  }
}
