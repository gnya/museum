/**
 * @author gnya / https://twitter.com/gnya_a
 */


const get_vertex = (a) => {
  var S = a.preset.Solver;
  var s;

  if (S == RungeKuttaSolver) {
    s = new S(a.preset.x0, a.preset.n, a.preset.h);
  }

  var vertex = s.calc((t, x) => a.f(t, x));

  // centering & scaling
  var center = new THREE.Vector3();

  for (var p of vertex) center.add(p);
  center.divideScalar(a.preset.n + 1);

  for (var p of vertex) {
    p.sub(center).multiplyScalar(a.preset.scale);
  }

  return vertex;
}


const get_colors = (n) => {
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


const generate_line = (a) => {
  var geometry = new THREE.Geometry();

  geometry.vertices = get_vertex(a);
  geometry.colors   = get_colors(a.preset.n);

  var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: THREE.VertexColors
  });

  return new THREE.Line(geometry, material);
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
  var line = null;

  // drag controls
  var dragctrl;

  const update_attractor = () => {
    caption.innerHTML = attractors[attractor_i].caption;
    comment.innerHTML = attractors[attractor_i].comment;

    if (line != null) {
      line.geometry.dispose();
      line.material.dispose();
      scene.remove(line);
    }
    line = generate_line(attractors[attractor_i]);
    scene.add(line);
    dragctrl = new DragObjectControls(line);
  }

  update_attractor(); // first call


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
