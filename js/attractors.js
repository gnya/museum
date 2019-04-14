/**
 * @author gnya / https://twitter.com/gnya_a
 */


class Attractor {
  constructor() {
    this.scale = null;
    this.caption = null;
    this.comment = null;
    this.math = null;
  }

  f(t, u) {
    throw new Error('Not Implemented');
  }
}


class LorenzAttractor extends Attractor {
  constructor(p, r, b) {
    super();
    this.scale = 7;
    this.caption = 'Lorenz System, 1963';
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


class NoseHooverAttractor extends Attractor {
  constructor(a) {
    super();
    this.scale = 50;
    this.caption = 'Nosé-Hoover System, 1986';
    this.comment = 'S. Nosé (b. 1951) and W. Hoover (b. 1936)';
    this.a = a;
  }

  f(t, u) {
    var v = new THREE.Vector3();

    // dx/dt =   y
    // dy/dt = - x + y * z
    // dz/dt =   a - y^2
    v.x =   u.y;
    v.y = - u.x + u.y * u.z;
    v.z =   this.a - u.y**2;

    return v;
  }
}


class HalvorsenAttractor extends Attractor {
  constructor(a) {
    super();
    this.scale = 16;
    this.caption = 'Halvorsen Chaotic Attractor';
    this.comment = 'Arne Dehli Halvorsen (unpublished)';
    this.a = a;
  }

  f(t, u) {
    var v = new THREE.Vector3();

    // dx/dt = -a * x - 4 * y - 4 * z - y^2
    // dy/dt = -a * y - 4 * z - 4 * x - z^2
    // dz/dt = -a * z - 4 * x - 4 * y - x^2
    v.x = - this.a * u.x - 4 * u.y - 4 * u.z - u.y**2;
    v.y = - this.a * u.y - 4 * u.z - 4 * u.x - u.z**2;
    v.z = - this.a * u.z - 4 * u.x - 4 * u.y - u.x**2;

    return v;
  }
}

class BurkeShawAttractor extends Attractor {
  constructor(S, V) {
    super();
    this.scale = 75;
    this.caption = 'Burke-Shaw Chaotic Attractor, 1981';
    this.comment = 'B. Burke (b. 1941) and R. Shaw (b. 1946)';
    this.S = S;
    this.V = V;
  }

  f(t, u) {
    var v = new THREE.Vector3();

    // dx/dt = -S * (x + y)
    // dy/dt = -y - S * x * z
    // dz/dt = S * x * y + V
    v.x = - this.S * (u.x + u.y);
    v.y = - u.y - this.S * u.x * u.z;
    v.z =   this.S * u.x * u.y + this.V;

    return v;
  }
}

class ChenAttractor extends Attractor {
  constructor(a, b, c) {
    super();
    this.scale = 8;
    this.caption = 'Chen Chaotic Attractor, 1981';
    this.comment = 'Guanrong Chen (b. 1948)';
    this.a = a;
    this.b = b;
    this.c = c;
  }

  f(t, u) {
    var v = new THREE.Vector3();

    // dx/dt = a * (y - x)
    // dy/dt = c * y - x * z
    // dz/dt = x * y - b * z
    v.x = this.a * (u.y - u.x);
    v.y = this.c * u.y - u.x * u.z;
    v.z = u.x * u.y - this.b * u.z;

    return v;
  }
}
