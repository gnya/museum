/**
 * @author gnya / https://twitter.com/gnya_a
 */


 class MuseumManager {
   constructor(x0, n = 30000, h = 0.01) {
     this.x0 = x0;
     this.n = n;
     this.h = h;

     this.vertex = null;
     this.colors = null;

     var geometry = new THREE.Geometry();

     geometry.vertices = new Array(this.n + 1);
     geometry.colors   = new Array(this.n + 1);

     var material = new THREE.LineBasicMaterial({
       color: 0xffffff,
       vertexColors: THREE.VertexColors
     });

     this.line = new THREE.Line(geometry, material);
   }

   calc_vertex(a) {
     var s;

     if (a instanceof LorenzAttractor) {
       s = new RungeKuttaSolver(this.x0, this.n, this.h);
     }

     if (a instanceof NoseHooverAttractor) {
       s = new RungeKuttaSolver(this.x0, this.n, this.h);
     }

     if (a instanceof HalvorsenAttractor) {
       s = new RungeKuttaSolver(this.x0, this.n, this.h);
     }

     if (a instanceof BurkeShawAttractor) {
       s = new RungeKuttaSolver(this.x0, this.n, this.h);
     }

     if (a instanceof ChenAttractor) {
       s = new RungeKuttaSolver(this.x0, this.n, this.h);
     }

     this.vertex = s.calc(a);

     // centering & scaling
     var center = new THREE.Vector3();

     for (var p of this.vertex) center.add(p);
     center.divideScalar(this.n + 1);
     for (var p of this.vertex) {
       p.sub(center).multiplyScalar(a.scale);
     }
   }

   calc_colors() {
     this.colors = get_linecolor(this.n + 1);
   }

   update_vertex(a) {
     this.calc_vertex(a);

     for (var i = 0; i < this.n + 1; i++) {
       this.line.geometry.vertices[i] = this.vertex[i].clone();
     }

     this.line.geometry.verticesNeedUpdate = true;
   }

   update_colors() {
     this.calc_colors();

     for (var i = 0; i < this.n + 1; i++) {
       this.line.geometry.colors[i] = this.colors[i].clone();
     }

     this.line.geometry.colorsNeedUpdate = true;
   }
 }


const get_linecolor = (n) => {
  var colors = new Array(n + 1);

  for (var i = 0; i < n + 1; i++) {
    // calculate HSV
    var w = Math.sqrt(i / n);
    var h = 0.15  + 0.35 * w;
    var s = 0.04  + 0.59 * w;
    var v = 0.98  - 0.24  * w;

    // convert HSV to HSL
    var l = (2 - s) * v / 2;

    if (l !== 0) {
      if (l === 1) {
        s = 0;
      } else if (l < 0.5) {
        s = s / (2 - s);
      } else {
        s = s * v / (2 - l * 2);
      }
    }

    var c = new THREE.Color();

    c.setHSL(h, s, l);

    colors[i] = c;
  }

  return colors;
}


const init = () => {
  // create webGL render
  var renderer = new THREE.WebGLRenderer({
    // give canvas block
    canvas: document.querySelector('#attractor_canvas'),
    alpha: true,
    antialias: true
  });

  // create scene
  var scene = new THREE.Scene();

  // create camera
  var camera = new THREE.PerspectiveCamera(45);
  camera.position.set(0, 0, 1000);

  // on resize
  const resize = () => {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    renderer.setPixelRatio(window.devicePixcelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resize(); // first call
  window.addEventListener('resize', resize);

  // strange attractor
  var attractors = [
    new LorenzAttractor(10, 28, 8 / 3),
    new NoseHooverAttractor(1.5),
    new HalvorsenAttractor(1.3),
    new BurkeShawAttractor(10, 4.272),
    new ChenAttractor(36, 3, 28.7),
  ];
  var attractor_i = 0;
  var caption = document.querySelector('#caption');
  var comment = document.querySelector('#comment');
  var math = document.querySelector('#math');

  var x0 = new THREE.Vector3(0.2, -0.1, 0.1);
  var manager = new MuseumManager(x0);

  manager.update_colors();
  scene.add(manager.line);

  const update_attractor = () => {
    caption.innerHTML = attractors[attractor_i].caption;
    comment.innerHTML = attractors[attractor_i].comment;
    manager.update_vertex(attractors[attractor_i]);
  }

  update_attractor();

  // drag controls
  var dragctrl = new DragObjectControls(manager.line);


  var older = document.querySelector('#older');
  var newer = document.querySelector('#newer');
  older.addEventListener('mousedown', (e) => {
    attractor_i++;
    attractor_i %= attractors.length;
    update_attractor();
  });
  newer.addEventListener('mousedown', (e) => {
    attractor_i--;
    attractor_i = (attractor_i + attractors.length) % attractors.length;
    update_attractor();
  });


  // main loop
  const tick = () => {
    // mouse operation
    dragctrl.update();

    // rendering
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  tick();
}


window.addEventListener('load', init);
