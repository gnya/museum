/**
 * @author gnya / https://twitter.com/gnya_a
 */


class SystemSolver {
  constructor() {
    this.x0 = null;
    this.n = null;
    this.h = null;
  }

  calc(f) {
    throw new Error('Not Implemented');
  }
}


class RecurrenceSolver extends SystemSolver {
  constructor(x0, n = 30000) {
    super();
    this.n = n;
    this.x0 = x0;
  }

  calc(f) {
    var x = this.x0.clone();
    var v = new Array(this.n + 1);

    v[0] = x.clone();

    for (var i = 1; i < v.length; i++) {
      x = f(null, x);
      x[i] = x.clone();
    }

    return v;
  }
}


class RungeKuttaSolver extends SystemSolver {
  constructor(x0, n = 30000, h = 0.01) {
    super();
    this.x0 = x0;
    this.n = n;
    this.h = h;
  }

  calc(f) {
    var x = this.x0.clone();
    var v = new Array(this.n + 1);
    var t = 0.0;
    var x0, x1, x2, x3;
    var k0, k1, k2, k3;

    v[0] = x.clone();

    for (var i = 1; i < v.length; i++) {
      [x0, x1] = [x.clone(), x.clone()];
      [x2, x3] = [x.clone(), x.clone()];

      k0 = f(t             , x0);
      k0.multiplyScalar(this.h);

      x1.addScaledVector(k0, .5);
      k1 = f(t + this.h / 2, x1);
      k1.multiplyScalar(this.h);

      x2.addScaledVector(k1, .5);
      k2 = f(t + this.h / 2, x2);
      k2.multiplyScalar(this.h);

      x3.add(k2);
      k3 = f(t + this.h    , x3);
      k3.multiplyScalar(this.h);

      k1.multiplyScalar(2);
      k2.multiplyScalar(2);

      x.add(k0.add(k1).add(k2).add(k3).divideScalar(6));

      v[i] = x.clone();
    }

    return v;
  }
}
