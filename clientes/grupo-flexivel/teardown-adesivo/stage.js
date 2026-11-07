// Palco do teardown: estúdio claro no tom Marfim/Creme Oliva do manual Flexível, sombra suave no chão e a névoa de
// umidade do ar (micropartículas em deriva lenta, nunca gotas: pedido do cliente no FLX-002). frame(state, cam)
// posa o painel e desenha um quadro; tudo é função do estado, então filme e página ao vivo não divergem.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {buildPanel, P} from './panel.js';

const V3 = THREE.Vector3;
export const COL = {bg: '#eef0e2', ground: '#e3e8d6', shadow: '#2a363b'};

const MIST_VERT = /* glsl */ `attribute vec3 seed; uniform float uT; uniform float uPx; varying float vA;
  void main(){
    vec3 p = position;
    // deriva lateral lenta e difusa, com volta contínua na faixa
    p.x = mod(p.x + 0.035 * uT + 0.6, 1.3) - 0.65;
    p.y += 0.012 * sin(uT * 0.7 + seed.x * 6.283);
    p.z += 0.02 * sin(uT * 0.45 + seed.y * 6.283);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uPx * (5.0 + 9.0 * seed.z) * (3.0 / max(0.3, -mv.z));
    vA = 0.25 + 0.5 * seed.z;
    gl_Position = projectionMatrix * mv;
  }`;
const MIST_FRAG = /* glsl */ `uniform float uA; uniform vec3 uCol; varying float vA;
  void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
    gl_FragColor = vec4(uCol, uA * vA * (1.0 - smoothstep(0.0, 0.5, r))); }`;

export function createStage({canvas}) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COL.bg);
  scene.fog = new THREE.Fog(COL.bg, 6, 14);
  const camera = new THREE.PerspectiveCamera(28, 16 / 9, 0.02, 60);

  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;
  pm.dispose();

  const SUN = new V3(-0.45, 0.85, 0.35).normalize();
  const sun = new THREE.DirectionalLight('#fffbea', 2.0);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, {left: -1.4, right: 1.4, top: 1.4, bottom: -1.4, near: 0.5, far: 12});
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.01;
  sun.position.copy(SUN).multiplyScalar(5);
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#fffff4', '#cdd6c2', 0.55));

  const ground = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshStandardMaterial({color: COL.ground, roughness: 1}));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const panel = buildPanel();
  scene.add(panel.root);

  // névoa: posições sorteadas uma vez, movimento só no shader (função de uT)
  const N = 650;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N * 3);
  let r = 20261107;
  const rnd = () => ((r = (r * 16807) % 2147483647), (r - 1) / 2147483646);
  for (let i = 0; i < N; i++) {
    pos.set([-0.65 + 1.3 * rnd(), 0.13 + 0.26 * rnd(), -P.L / 2 - 0.1 + (P.L + 0.2) * rnd()], i * 3);
    seed.set([rnd(), rnd(), rnd()], i * 3);
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  mg.setAttribute('seed', new THREE.BufferAttribute(seed, 3));
  const mistMat = new THREE.ShaderMaterial({
    vertexShader: MIST_VERT,
    fragmentShader: MIST_FRAG,
    uniforms: {uT: {value: 0}, uPx: {value: 1}, uA: {value: 0}, uCol: {value: new THREE.Color('#5d9ba1')}},
    transparent: true,
    depthWrite: false,
  });
  const mist = new THREE.Points(mg, mistMat);
  mist.frustumCulled = false;
  scene.add(mist);

  const size = {w: 1600, h: 900, pr: 1};
  const resize = (w, h, pr) => {
    Object.assign(size, {w, h, pr});
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mistMat.uniforms.uPx.value = pr * (h / 900);
  };

  // st: {proc, explode, isolate, t}; cam: {tx, ty, tz, az, el, d (rad, m), sx, sy}
  const frame = (st, cam) => {
    panel.update(st);
    mistMat.uniforms.uT.value = st.t ?? 0;
    mistMat.uniforms.uA.value = 0.55 * st.proc.mist;
    mist.visible = st.proc.mist > 0.01;
    mist.position.y = panel.root.position.y + 0.075 * (st.explode ?? 0);
    camera.position.set(cam.tx + cam.d * Math.cos(cam.el) * Math.sin(cam.az), cam.ty + cam.d * Math.sin(cam.el), cam.tz + cam.d * Math.cos(cam.el) * Math.cos(cam.az));
    camera.lookAt(cam.tx, cam.ty, cam.tz);
    camera.setViewOffset(size.w, size.h, -(cam.sx ?? 0), -(cam.sy ?? 0), size.w, size.h);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
  };
  const pv = new V3();
  const project = (x, y, z) => {
    pv.set(x, y, z).project(camera);
    if (pv.z > 1) return null;
    return [(pv.x * 0.5 + 0.5) * size.w, (-pv.y * 0.5 + 0.5) * size.h];
  };
  return {renderer, scene, camera, panel, resize, frame, project, size};
}
