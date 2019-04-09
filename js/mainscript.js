/**
 * @author gnya / https://twitter.com/gnya_a
 */


const runge_kutta = (a, h, n, x) => {
  var vectors = new Array(n + 1);
  var t = 0.0;

  vectors[0] = x.clone();

  for (var i = 0; i < n; i++) {
    var x0 = x.clone();
    var k0 = a.f(t        , x0).multiplyScalar(h);

    var x1 = x.clone().addScaledVector(k0, .5);
    var k1 = a.f(t + h / 2, x1).multiplyScalar(h);

    var x2 = x.clone().addScaledVector(k1, .5);
    var k2 = a.f(t + h / 2, x2).multiplyScalar(h);

    var x3 = x.clone().add(k2);
    var k3 = a.f(t + h    , x3).multiplyScalar(h);

    k1.multiplyScalar(2);
    k2.multiplyScalar(2);
    x.add(k0.add(k1).add(k2).add(k3).divideScalar(6));

    vectors[i + 1] = x.clone();
  }

  return vectors;
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


const centering = (v, s = 1.) => {
  var c = new THREE.Vector3();

  for (var p of v) c.add(p);
  c.divideScalar(v.length);
  for (var p of v) p.sub(c).multiplyScalar(s);
}


const init = () => {
  // create webGL render
  var renderer = new THREE.WebGLRenderer({
    // give canvas block
    canvas: document.querySelector('#attractor_canvas'),
    alpha: true,
    antialias: true
  });
  //renderer.setClearColor(0xfaf5f0, 0);

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


  // runge kutta
  var attractor = new LorenzAttractor(10, 28, 8 / 3);
  var h = 0.01;
  var n = 30000;
  var x = new THREE.Vector3(0.1, 0, 0);
  var vertex = runge_kutta(attractor, h, n, x);

  var caption = document.querySelector('#caption');
  var comment = document.querySelector('#comment');
  caption.innerHTML += attractor.caption;
  comment.innerHTML += attractor.comment;

  // line color
  var colors = get_linecolor(n);

  // centering
  centering(vertex, attractor.scale);

  // create attractor
  var geo_line = new THREE.Geometry();
  for (var p of vertex) {
    geo_line.vertices.push(p.clone());
  }
  for (var c of colors) {
    geo_line.colors.push(c.clone());
  }

  var mat_line = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: THREE.VertexColors
  });
  var line = new THREE.Line(geo_line, mat_line);
  line.position.y = 50;
  scene.add(line);

  // drag controls
  var dragctrl = new DragObjectControls(line);


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
