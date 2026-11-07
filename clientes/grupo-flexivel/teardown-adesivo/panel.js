// Telha termoacústica com Adesivo Monocomponente Flexível: o modelo do processo e a geometria.
// Uma entrada, o tempo do processo s (0..S, segundos de animação), comanda tudo: o aplicador lançando os cordões
// sobre o núcleo, a chapa descendo, a prensagem com pesos e a cura avançando com a umidade do ar.
// Referência: captações do laboratório Flexível (FLX-002: IMG_6135/6136 cordões, IMG_6138 chapa, IMG_6143 pesos,
// IMG_6141 perfil do sanduíche) e a ilustração de camadas enviada pelo cliente. Proporções de uma telha trapezoidal
// típica, esquemáticas: nenhum número de consumo ou de tempo de cura é afirmado.
import * as THREE from 'three';

// ------------------------------------------------------------ parâmetros (metros, esquemáticos)
export const P = {
  W: 1.0, // largura útil
  L: 1.6, // trecho de telha mostrado
  ribs: [-0.375, -0.125, 0.125, 0.375], // eixos das nervuras trapezoidais
  ribBase: 0.065, // meia base da nervura
  ribTop: 0.022, // meia crista
  ribH: 0.04, // altura da nervura
  core: 0.035, // núcleo no vale
  sheet: 0.004, // chapa (exagerada para leitura)
  liner: 0.003,
  beadR: 0.0055, // raio do cordão
  gapB: 0.003, // filme de adesivo curado sob o núcleo
  nCross: 7, // cordões transversais
};
// perfil superior do núcleo e da chapa: altura da nervura em x
export function prof(x) {
  let h = 0;
  for (const c of P.ribs) {
    const d = Math.abs(x - c);
    if (d <= P.ribTop) h = P.ribH;
    else if (d < P.ribBase) h = Math.max(h, (P.ribH * (P.ribBase - d)) / (P.ribBase - P.ribTop));
  }
  return h;
}
export const XS = (() => {
  const xs = [-P.W / 2];
  for (const c of P.ribs) xs.push(c - P.ribBase, c - P.ribTop, c + P.ribTop, c + P.ribBase);
  xs.push(P.W / 2);
  return xs;
})();
// cordões longitudinais: vales, cristas e bordas (como a grade das captações)
export const LONG_X = [-0.47, -0.375, -0.25, -0.125, 0, 0.125, 0.25, 0.375, 0.47];
export const CROSS_Z = Array.from({length: P.nCross}, (_, i) => -P.L / 2 + 0.12 + (i * (P.L - 0.24)) / (P.nCross - 1));
export const N_CORDS = LONG_X.length + P.nCross;

// ------------------------------------------------------------ o processo: s em segundos de animação
export const STEPS = [
  {key: 'cordoes', n: 1, name: 'Cordões sobre o núcleo', sub: 'O adesivo vai em grade sobre o EPS, PIR ou PUR', from: 0, to: 7.5},
  {key: 'chapa', n: 2, name: 'Chapa posicionada', sub: 'A chapa desce com o adesivo ainda líquido', from: 7.5, to: 10},
  {key: 'prensa', n: 3, name: 'Prensagem', sub: 'Pesos mantêm a chapa assentada', from: 10, to: 12.5},
  {key: 'cura', n: 4, name: 'Cura com a umidade do ar', sub: 'Reatividade prolongada, colagem confiável', from: 12.5, to: 19},
];
export const S = 19;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => {
  const u = clamp01(x);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
export const LIFT = 0.75;

export function processAt(s) {
  s = Math.min(S, Math.max(0, s));
  const k1 = clamp01(s / 5); // passe longitudinal do aplicador (linear: movimento contínuo)
  const k2 = clamp01((s - 5) / 2.3); // passe transversal: a mesma barra, girada, cruza a largura
  const cross = CROSS_Z.map(() => k2);
  const lift = LIFT * (1 - ease((s - 7.5) / 2.5));
  const press = ease((s - 10) / 2.2);
  const weights = ease((s - 9.9) / 1.2) * (1 - ease((s - 17.2) / 1.2));
  const cure = clamp01((s - 12.9) / 5.6);
  // a chapa fica translúcida durante a cura para mostrar o adesivo mudando de tom
  const xray = ease((s - 12.5) / 0.8) * (1 - ease((s - 18.2) / 0.8));
  const sheetIn = ease((s - 7.0) / 0.6);
  const mist = ease((s - 11.8) / 1.0) * (1 - ease((s - 18.2) / 0.8));
  const step = STEPS.findIndex((x) => s < x.to) === -1 ? 3 : STEPS.findIndex((x) => s < x.to);
  const cords = LONG_X.length * (k1 >= 1 ? 1 : 0) + cross.filter((c) => c >= 1).length;
  return {s, k1, k2, cross, lift, press, weights, cure, mist, xray, sheetIn, step, cords, contact: lift < 0.002};
}

// ------------------------------------------------------------ materiais
const amber = new THREE.Color('#e9b44c');
const cured = new THREE.Color('#a8792c');
function glueMaterial() {
  const m = new THREE.MeshStandardMaterial({color: amber, roughness: 0.28, metalness: 0, envMapIntensity: 0.9});
  m.userData.front = {value: -9};
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = m.userData.front;
    sh.uniforms.uCured = {value: cured};
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWz;').replace('#include <project_vertex>', '#include <project_vertex>\nvWz = (modelMatrix * vec4(transformed, 1.0)).z;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWz; uniform float uFront; uniform vec3 uCured;\nfloat cureK(){ return 1.0 - smoothstep(uFront - 0.14, uFront + 0.14, vWz); }')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uCured, cureK());')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.62, cureK());');
  };
  return m;
}

// ------------------------------------------------------------ geometria
function sheetGeo(thick) {
  const sh = new THREE.Shape();
  sh.moveTo(XS[0], prof(XS[0]) + thick);
  for (const x of XS.slice(1)) sh.lineTo(x, prof(x) + thick);
  for (const x of [...XS].reverse()) sh.lineTo(x, prof(x));
  const g = new THREE.ExtrudeGeometry(sh, {depth: P.L, bevelEnabled: false, curveSegments: 1});
  g.translate(0, 0, -P.L / 2);
  return g;
}
function coreGeo() {
  const sh = new THREE.Shape();
  sh.moveTo(-P.W / 2, 0);
  sh.lineTo(P.W / 2, 0);
  for (const x of [...XS].reverse()) sh.lineTo(x, P.core + prof(x));
  const g = new THREE.ExtrudeGeometry(sh, {depth: P.L, bevelEnabled: false, curveSegments: 1});
  g.translate(0, 0, -P.L / 2);
  return g;
}
// cordão transversal acompanhando o perfil, com origem em x = -W/2 para crescer da borda
function crossGeo(r, y0) {
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = -P.W / 2 + 0.02 + (i / 200) * (P.W - 0.04);
    pts.push(new THREE.Vector3(x + P.W / 2, y0 + prof(x) + r, 0));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 200, r, 10, false);
}
function longGeo(r) {
  const g = new THREE.CylinderGeometry(r, r, P.L - 0.04, 12, 1, false);
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, (P.L - 0.04) / 2);
  return g;
}

// trocar transparent exige recompilar (three define OPAQUE no shader)
function setAlpha(m, a) {
  const tr = a < 0.999;
  if (m.transparent !== tr) {
    m.transparent = tr;
    m.needsUpdate = true;
  }
  m.opacity = a;
  m.depthWrite = a > 0.5;
}

export function buildPanel() {
  const root = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({color: '#d3dadb', metalness: 0.5, roughness: 0.46, envMapIntensity: 0.55});
  const linerMat = new THREE.MeshStandardMaterial({color: '#c5cdce', metalness: 0.45, roughness: 0.5, envMapIntensity: 0.5});
  const coreMat = new THREE.MeshStandardMaterial({color: '#f4f3e8', roughness: 0.93, metalness: 0});
  const weightMat = new THREE.MeshStandardMaterial({color: '#3d4a4e', roughness: 0.55, metalness: 0.3});
  const toolMat = new THREE.MeshStandardMaterial({color: '#013d3d', roughness: 0.4, metalness: 0.2});
  const glueTop = glueMaterial();
  const glueBot = glueMaterial();
  glueBot.userData.front.value = 9; // filme inferior: já curado
  const fades = [linerMat, coreMat];
  const shadowy = (m) => ((m.castShadow = true), (m.receiveShadow = true), m);

  const liner = shadowy(new THREE.Mesh(new THREE.BoxGeometry(P.W, P.liner, P.L), linerMat));
  const gB = new THREE.Group();
  for (const x of LONG_X) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.018, P.gapB, P.L - 0.04), glueBot);
    m.position.set(x, P.gapB / 2, 0);
    gB.add(m);
  }
  for (const z of CROSS_Z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(P.W - 0.04, P.gapB, 0.014), glueBot);
    m.position.set(0, P.gapB / 2, z);
    gB.add(m);
  }
  const core = shadowy(new THREE.Mesh(coreGeo(), coreMat));
  const gT = new THREE.Group();
  const longs = LONG_X.map((x) => {
    const m = shadowy(new THREE.Mesh(longGeo(P.beadR), glueTop));
    m.position.set(x, 0, -P.L / 2 + 0.02);
    gT.add(m);
    return m;
  });
  const crosses = CROSS_Z.map((z) => {
    const m = shadowy(new THREE.Mesh(crossGeo(P.beadR, 0), glueTop));
    m.position.set(-P.W / 2, 0, z);
    gT.add(m);
    return m;
  });
  const top = shadowy(new THREE.Mesh(sheetGeo(P.sheet), steelMat));

  // aplicador: barra com bicos sobre a largura (o recipiente perfurado das captações)
  const tool = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.BoxGeometry(P.W + 0.08, 0.03, 0.05), toolMat);
  bar.castShadow = true;
  tool.add(bar);
  const threads = LONG_X.map((x) => {
    const n = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.02, 10), toolMat);
    n.rotation.x = Math.PI;
    n.position.set(x, -0.024, 0);
    tool.add(n);
    const th = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 1, 8), glueTop);
    tool.add(th);
    return th;
  });

  // a mesma barra, girada 90°, para o passe transversal (bicos nas posições dos cordões transversais)
  const tool2 = new THREE.Group();
  const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, P.L + 0.08), toolMat);
  bar2.castShadow = true;
  tool2.add(bar2);
  const threads2 = CROSS_Z.map((z) => {
    const n = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.02, 10), toolMat);
    n.rotation.x = Math.PI;
    n.position.set(0, -0.024, z);
    tool2.add(n);
    const th = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 1, 8), glueTop);
    tool2.add(th);
    return th;
  });

  // adesivo como camada contínua (vista explodida depois da prensagem e da cura)
  const planeTopMat = new THREE.MeshStandardMaterial({color: '#c99a45', roughness: 0.5, metalness: 0, transparent: true, opacity: 0, side: THREE.DoubleSide});
  const planeBotMat = planeTopMat.clone();
  const planeTop = new THREE.Mesh(sheetGeo(0.003), planeTopMat);
  const planeBot = new THREE.Mesh(new THREE.BoxGeometry(P.W, P.gapB, P.L), planeBotMat);
  planeTop.receiveShadow = planeBot.receiveShadow = true;

  // pesos de prensagem
  const weights = [-0.42, 0.42].map((z) => {
    const m = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.26), weightMat));
    m.position.z = z;
    root.add(m);
    return m;
  });

  root.add(liner, gB, core, gT, top, tool, tool2, planeTop, planeBot);
  const crestTop = (x) => prof(x);

  // st: {proc, explode 0..1, isolate 0..1}
  function update(st) {
    const p = st.proc;
    const e = st.explode ?? 0;
    const iso = st.isolate ?? 0;
    const sq = p.press;
    const yLiner = P.liner / 2;
    const yGB = P.liner;
    const yCore = P.liner + P.gapB;
    const coreTop = yCore + P.core; // vale do núcleo
    const beadH = 2 * P.beadR * (1 - 0.55 * sq); // espessura do cordão sob a chapa
    liner.position.y = yLiner - 0.12 * e;
    gB.position.y = yGB - 0.06 * e;
    core.position.y = yCore;
    gT.position.y = coreTop + 0.075 * e;
    for (const [i, m] of longs.entries()) {
      m.scale.set(1 + 0.8 * sq, 1 - 0.55 * sq, Math.max(0.0001, p.k1));
      m.position.y = prof(LONG_X[i]) + P.beadR - 0.62 * sq * P.beadR;
      m.visible = p.k1 > 0.001;
    }
    for (const [i, m] of crosses.entries()) {
      // cresce pelo índice do tubo (da borda para dentro), sem deformar o perfil
      m.geometry.setDrawRange(0, Math.ceil(m.geometry.index.count * p.cross[i] / 60) * 60);
      m.scale.set(1, 1, 1 + 0.7 * sq);
      m.position.y = -1.65 * sq * P.beadR;
      m.visible = p.cross[i] > 0.001;
    }
    top.position.y = coreTop + beadH + p.lift + 0.17 * e;
    for (const w of weights) {
      w.position.y = top.position.y + P.ribH + P.sheet + 0.035 + (1 - p.weights) * 0.45 + 0.26 * e;
      w.visible = p.weights > 0.01;
    }
    // aplicador: corre ao longo do comprimento durante o passe longitudinal
    tool.visible = p.s < 5.0;
    const tz = -P.L / 2 + 0.02 + (P.L - 0.04) * p.k1;
    const ty = coreTop + 0.16 + 0.075 * e;
    tool.position.set(0, ty, tz);
    for (const [i, th] of threads.entries()) {
      const yb = coreTop + 0.075 * e + prof(LONG_X[i]) + P.beadR;
      const len = Math.max(0.001, ty - 0.034 - yb);
      th.scale.y = len;
      th.position.set(LONG_X[i], -0.034 - len / 2, 0);
      th.visible = p.k1 < 0.999;
    }
    tool2.visible = p.s >= 5 && p.k2 < 0.999;
    const tx = -P.W / 2 + 0.02 + (P.W - 0.04) * p.k2;
    tool2.position.set(tx, ty, 0);
    for (const [i, th] of threads2.entries()) {
      const yb = coreTop + 0.075 * e + prof(tx) + P.beadR;
      const len = Math.max(0.001, ty - 0.034 - yb);
      th.scale.y = len;
      th.position.set(0, -0.034 - len / 2, CROSS_Z[i]);
    }
    // camada contínua: os cordões dão lugar a um plano homogêneo entre as camadas
    const pl = st.plane ?? 0;
    planeTopMat.opacity = pl;
    planeBotMat.opacity = pl;
    planeTopMat.depthWrite = planeBotMat.depthWrite = pl > 0.5;
    planeTop.visible = planeBot.visible = pl > 0.01;
    planeTop.position.y = gT.position.y;
    planeBot.position.y = gB.position.y + P.gapB / 2;
    gT.visible = pl < 0.6;
    gB.visible = pl < 0.6;
    // cura: a frente avança ao longo do comprimento
    glueTop.userData.front.value = -P.L / 2 - 0.25 + p.cure * (P.L + 0.5);
    // isolar o adesivo: o resto fica translúcido
    for (const m of fades) setAlpha(m, 1 - 0.86 * iso);
    const sa = Math.min(1 - 0.86 * iso, 1 - 0.78 * p.xray) * p.sheetIn;
    setAlpha(steelMat, sa);
    top.visible = sa > 0.01;
    top.castShadow = sa > 0.5;
    root.position.y = 0.13 * e;
  }
  // pontos de cada parte para os rótulos (no referencial da cena)
  const anchors = (st) => {
    const ry = root.position.y;
    return {
      telha: [P.W / 2, top.position.y + ry + P.sheet, 0.42],
      adesivo: [0.47, gT.position.y + ry + P.beadR, 0.3],
      nucleo: [P.W / 2, core.position.y + ry + P.core * 0.5, 0.18],
      inferior: [P.W / 2 - 0.03, gB.position.y + ry + P.gapB, 0.06],
      forro: [P.W / 2, liner.position.y + ry, -0.06],
      pesos: [0.17, weights[1].position.y + ry + 0.035, 0.42],
      aplicador: [0.5, tool.position.y + ry, tool.position.z],
    };
  };
  return {root, update, anchors, crestTop, materials: {glueTop, glueBot}};
}
