/**
 * @author gnya / https://twitter.com/gnya_a
 */


class DragObjectControls {
  constructor(object, c = 0.1, eps = 1.0e-10) {
    this.object = object
    this.c = c;
    this.eps = eps;

    this.is_click = false;

    this.p_bgn = new THREE.Vector2();
    this.q     = new THREE.Quaternion();

    this.v_old = new THREE.Vector2();
    this.u     = new THREE.Vector2();
    this.e     = new THREE.Vector2();

    const dragstart = (x, y) => {
      this.is_click = true;

      this.p_bgn.set(x, y);
      this.q.copy(this.object.quaternion);

      this.v_old.set(0, 0);
      this.u.set(0, 0);
      this.e.set(0, 0);
    }

    const dragmove = (x, y) => {
      if (this.is_click) {
        var p_end = new THREE.Vector2(x, y);

        this.u.subVectors(p_end, this.p_bgn);
      }
    }

    const dragend = () => {
      this.is_click = false;
    }

    // for pc
    document.addEventListener('mousedown', (e) => {
      dragstart(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', (e) => {
      dragmove(e.clientX, e.clientY);
    });
    document.addEventListener('mouseup', (e) => {
      dragend();
    });

    // for mobile device
    document.addEventListener('touchstart', (e) => {
      dragstart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    });
    document.addEventListener('touchmove', (e) => {
      dragmove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    });
    document.addEventListener('touchend', (e) => {
      dragend();
    });
  }

  update() {
    if (this.is_click || this.e.length() > this.eps) {
      var v = new THREE.Vector2();

      this.e.subVectors(this.u, this.v_old)

      v.add(this.v_old).addScaledVector(this.e, this.c);
      this.v_old.copy(v);

      var axis = new THREE.Vector3(v.y, v.x, 0);
      var theta = v.length() * 0.005;
      var r = new THREE.Quaternion();

      axis.normalize ();
      r.setFromAxisAngle(axis, theta);
      this.object.quaternion.multiplyQuaternions(r, this.q);
    }
  }
}
