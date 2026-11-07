// Teardown Flexível · Adesivo Monocomponente. Uma página: o painel no centro, o console da marca em volta.
// Sem interação, a página faz o tour do roteiro (SCRIPT) com cursor; clique, arraste, roda ou tecla passam o controle
// ao visitante, e 25 s de silêncio devolvem ao tour. Na captura (?capture), render(t) é função pura de t.
import t400 from '@fontsource/titillium-web/files/titillium-web-latin-400-normal.woff2';
import t600 from '@fontsource/titillium-web/files/titillium-web-latin-600-normal.woff2';
import t700 from '@fontsource/titillium-web/files/titillium-web-latin-700-normal.woff2';
import t900 from '@fontsource/titillium-web/files/titillium-web-latin-900-normal.woff2';
import p400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2';
import p500 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2';
import p600 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2';
import {runSim} from 'teardown-kit/runtime.js';
import {createConsole, DISPLAY, VIEWS} from './console.js';
import {P, processAt, S, STEPS} from './panel.js';
import {createStage} from './stage.js';

// ------------------------------------------------------------ roteiro do filme
const T0 = 0.8; // o processo começa aqui
export const SCRIPT = [
  {t: 0, view: 'hero'},
  {t: 1.4, view: 'top'},
  {t: 6.6, view: 'hero'},
  {t: 10.6, view: 'profile'},
  {t: 13.8, view: 'hero'},
  {t: 20.6, display: 'exploded'},
  {t: 21.0, view: 'wide'},
  {t: 21.9, display: 'labels'},
  {t: 25.0, display: 'isolate'},
  {t: 27.6, display: 'isolate'},
  {t: 28.0, display: 'labels'},
  {t: 28.3, display: 'exploded'},
  {t: 28.6, view: 'hero'},
];
export const DURATION = 34;
const DEFAULTS = {duration: DURATION, fps: 60, theme: 'light', accent: '#8dc63f', hud: {enabled: false, title: 'Flexível · Adesivo Monocomponente', subtitle: ''}, director: {enabled: false}};
const D2R = Math.PI / 180;
const smoother = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const ss = (a, b, t) => smoother((t - a) / (b - a));
export const procTime = (t) => Math.min(S, Math.max(0, t - T0));

const displayOn = (t) => {
  const out = Object.fromEntries(DISPLAY.map((k) => [k, 0]));
  for (const e of SCRIPT) if (e.display && e.t <= t) out[e.display] ^= 1;
  return out;
};
const lastFlip = (k, t) => SCRIPT.filter((e) => e.display === k && e.t <= t).pop()?.t ?? -9;
const eased = (k, t, dur = 0.9) => {
  const on = displayOn(t)[k];
  const x = ss(lastFlip(k, t), lastFlip(k, t) + dur, t);
  return on ? x : 1 - x;
};

// ------------------------------------------------------------ câmeras (graus, metros), u = segundos na vista
export const VIEW_FN = {
  hero: (u) => ({tx: 0.0, ty: 0.06, tz: 0.0, az: 38 + 1.2 * u, el: 26, d: 4.0, sx: 0, sy: -6}),
  top: (u) => ({tx: 0, ty: 0.05, tz: 0.0, az: 24 + 1.0 * u, el: 48, d: 3.5, sx: 0, sy: -10}),
  profile: (u) => ({tx: 0.04, ty: 0.06, tz: 0.8, az: 16 + 1.4 * u, el: 14, d: 1.3, sx: 0, sy: -24}),
  wide: (u) => ({tx: 0, ty: 0.22, tz: 0, az: 46 + 2.0 * u, el: 20, d: 4.4, sx: 0, sy: -6}),
};
const VIEWS_T = SCRIPT.filter((e) => e.view).map((e) => [e.t, e.view]);
const blend = (a, b, k) => {
  const o = {};
  for (const key in b) o[key] = a[key] + (b[key] - a[key]) * k;
  o.d += Math.max(0, Math.max(a.d, b.d) + 0.25 - o.d) * Math.sin(Math.PI * k) * 0.6;
  return o;
};
const camFilm = (t) => {
  let i = 0;
  while (i < VIEWS_T.length - 1 && VIEWS_T[i + 1][0] <= t) i++;
  const cur = VIEW_FN[VIEWS_T[i][1]](t - VIEWS_T[i][0]);
  if (i === 0) return cur;
  const k = ss(VIEWS_T[i][0], VIEWS_T[i][0] + 1.7, t);
  return k < 1 ? blend(VIEW_FN[VIEWS_T[i - 1][1]](t - VIEWS_T[i - 1][0]), cur, k) : cur;
};
const viewFilm = (t) => VIEWS_T.filter(([a]) => a <= t).pop()[1];

// ------------------------------------------------------------ rótulos com linhas
const PARTS = [
  {key: 'telha', name: 'Telha em aço', sub: 'chapa trapezoidal externa'},
  {key: 'adesivo', name: 'Adesivo Monocomponente', sub: 'une a chapa ao núcleo isolante', glue: true},
  {key: 'nucleo', name: 'Núcleo isolante', sub: 'EPS · PIR · PUR'},
  {key: 'inferior', name: 'Adesivo curado', sub: 'une o núcleo ao forro', glue: true},
  {key: 'forro', name: 'Forro metálico', sub: 'face interna'},
];
function makeLabels(st) {
  return (proc, extra, o) => {
    if (o < 0.02) return [];
    const A = st.panel.anchors();
    const pts = PARTS.filter((p) => p.key !== 'telha' || proc.sheetIn > 0.5).map((p) => ({p, at: st.project(...A[p.key])})).filter((x) => x.at);
    const out = [];
    // uma coluna, na ordem física das camadas (de cima para baixo), para as linhas não se cruzarem
    const colL = pts;
    const stack = (col, x, w) => {
      let y = 250;
      for (const c of col) {
        y = Math.max(y, Math.min(740, c.at[1]));
        out.push({name: c.p.name, sub: c.p.sub, glue: !!c.p.glue, at: c.at, label: [x, y], w, o: o * (extra.iso && !c.p.glue ? 0.35 : 1)});
        y += 56;
      }
    };
    stack(colL, 364, 232);
    return out;
  };
}

// ------------------------------------------------------------ cursor do operador
const REST = [[820, 470], [760, 430], [900, 520], [840, 400]];
function makeCursor(ui) {
  const EV = [];
  for (const e of SCRIPT.filter((x) => x.t > 0)) {
    if (e.display) EV.push({t: e.t, spot: ui.spots[e.display]});
    if (e.view && ui.spots[e.view]) EV.push({t: e.t, spot: ui.spots[e.view]});
  }
  for (const st of STEPS.slice(1)) EV.push({t: T0 + st.from, spot: ui.spots['step' + st.n]});
  EV.sort((a, b) => a.t - b.t);
  const WP = [[0, 980, 640]];
  EV.forEach((e, i) => {
    WP.push([e.t - 0.18, ...e.spot], [e.t + 0.25, ...e.spot], [e.t + 1.5, ...REST[i % REST.length]]);
  });
  WP.sort((a, b) => a[0] - b[0]);
  return (t) => {
    let i = 0;
    while (i < WP.length - 2 && t > WP[i + 1][0]) i++;
    const [t0, x0, y0] = WP[i];
    const [t1, x1, y1] = WP[i + 1];
    const k = ss(t0, t1, t);
    let press = false;
    let ring = 0;
    let rx = 0;
    let ry = 0;
    for (const e of EV) {
      if (t >= e.t - 0.07 && t < e.t + 0.09) press = true;
      if (t >= e.t && t < e.t + 0.55) {
        ring = 1 - (t - e.t) / 0.55;
        [rx, ry] = e.spot;
      }
    }
    return {x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, press, ring, ringX: rx, ringY: ry};
  };
}

// ------------------------------------------------------------ montagem
// fontes da marca embutidas (página offline)
{
  const face = (fam, w, b64) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
  const css = document.createElement('style');
  css.textContent = [[400, t400], [600, t600], [700, t700], [900, t900]].map(([w, b]) => face('Titillium Web', w, b)).join('') + [[400, p400], [500, p500], [600, p600]].map(([w, b]) => face('IBM Plex Sans', w, b)).join('');
  document.head.appendChild(css);
}

runSim(DEFAULTS, async ({canvas, capture}) => {
  await Promise.all(['900 40px "Titillium Web"', '700 16px "Titillium Web"', '600 14px "Titillium Web"', '400 14px "IBM Plex Sans"', '600 12px "IBM Plex Sans"'].map((f) => document.fonts.load(f))).catch(() => {});
  const app = document.getElementById('app');
  const W = 1600;
  const H = 900;
  const st = createStage({canvas});
  const ui = createConsole(app);
  const labels = makeLabels(st);
  const cursorAt = makeCursor(ui);
  const fitStyle = document.createElement('style');
  fitStyle.textContent = `#app{position:absolute!important;inset:auto!important;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}html,body{background:#eef0e2}`;
  document.head.appendChild(fitStyle);
  let scale = 1;
  const resize = () => {
    scale = Math.min(innerWidth / W, innerHeight / H);
    app.style.transform = `translate(${(innerWidth - W * scale) / 2}px, ${(innerHeight - H * scale) / 2}px) scale(${scale})`;
    st.resize(W, H, capture ? devicePixelRatio || 1 : Math.min(2, Math.max(0.75, (devicePixelRatio || 1) * scale)));
  };
  resize();

  // ---------------- estado ao vivo
  const now = () => performance.now() / 1000;
  const live = {manual: false, last: -1e9, s: 0, playing: true, tPrev: now(), on: {exploded: 0, isolate: 0, labels: 0}, flip: {exploded: -9, isolate: -9, labels: -9}, view: 'hero', viewT: 0, prevCam: null, off: {az: 0, el: 0, d: 0}};
  let filmT = 0;
  const takeOver = () => {
    if (!live.manual) {
      live.manual = true;
      live.s = procTime(filmT);
      const d = displayOn(filmT);
      for (const k of DISPLAY) {
        live.on[k] = d[k];
        live.flip[k] = -9;
      }
      live.view = viewFilm(filmT) === 'wide' ? 'hero' : viewFilm(filmT);
      live.prevCam = camFilm(filmT);
      live.viewT = now();
      live.off = {az: 0, el: 0, d: 0};
    }
    live.last = now();
  };
  const setView = (v, t = now()) => {
    live.prevCam = camLive(t);
    live.view = v;
    live.viewT = t;
    live.off = {az: 0, el: 0, d: 0};
  };
  function camLive(t) {
    const cur = VIEW_FN[live.view](t - live.viewT);
    const k = live.prevCam ? ss(live.viewT, live.viewT + 1.2, t) : 1;
    const c = k < 1 ? blend(live.prevCam, cur, k) : cur;
    return {...c, az: c.az + live.off.az, el: Math.min(80, Math.max(2, c.el + live.off.el)), d: Math.max(0.6, c.d + live.off.d)};
  }
  const easedLive = (k, t) => {
    const x = ss(live.flip[k], live.flip[k] + 0.9, t);
    return live.on[k] ? x : 1 - x;
  };

  if (!capture) {
    const ptr = (e) => {
      const r = app.getBoundingClientRect();
      return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale];
    };
    const hit = (x, y) => {
      for (const n of ui.root.querySelectorAll('[data-k]')) {
        const L = n.offsetLeft;
        const T = n.offsetTop;
        if (x >= L && x <= L + n.offsetWidth && y >= T && y <= T + n.offsetHeight) return n;
      }
      return null;
    };
    let drag = null;
    addEventListener('pointerdown', (e) => {
      takeOver();
      const [x, y] = ptr(e);
      const n = hit(x, y);
      const t = now();
      if (!n) {
        drag = {x: e.clientX, y: e.clientY};
        return;
      }
      const k = n.dataset.k;
      if (DISPLAY.includes(k)) {
        live.on[k] ^= 1;
        live.flip[k] = t;
        if (k === 'exploded' && live.on[k] && live.view === 'profile') setView('hero', t);
      } else if (VIEWS.includes(k)) setView(k, t);
      else if (k === 'play') {
        if (live.s >= S) live.s = 0;
        live.playing = !live.playing;
      } else if (k === 'timeline') {
        const u = (x - ui.TL.x) / ui.TL.w;
        live.s = Math.min(S, Math.max(0, u * S));
        drag = {scrub: true};
      }
    });
    addEventListener('pointermove', (e) => {
      if (!drag) return;
      live.last = now();
      if (drag.scrub) {
        const [x] = ptr(e);
        live.s = Math.min(S, Math.max(0, ((x - ui.TL.x) / ui.TL.w) * S));
        return;
      }
      live.off.az -= ((e.clientX - drag.x) / scale) * 0.25;
      live.off.el += ((e.clientY - drag.y) / scale) * 0.18;
      drag.x = e.clientX;
      drag.y = e.clientY;
    });
    addEventListener('pointerup', () => (drag = null));
    addEventListener(
      'wheel',
      (e) => {
        takeOver();
        live.off.d = Math.min(3, Math.max(-2, live.off.d + e.deltaY * 0.0015));
        e.preventDefault();
      },
      {passive: false},
    );
    addEventListener('keydown', (e) => {
      takeOver();
      const t = now();
      const keys = {e: 'exploded', i: 'isolate', l: 'labels'};
      if (keys[e.key]) {
        live.on[keys[e.key]] ^= 1;
        live.flip[keys[e.key]] = t;
      } else if (['1', '2', '3', '4'].includes(e.key)) live.s = STEPS[+e.key - 1].from;
      else if (e.key === ' ') live.playing = !live.playing;
    });
  }

  // ---------------- um quadro
  const draw = (t, s) => {
    const plane = (s.proc.cure >= 1 ? 1 : 0) * smoother((s.explode - 0.55) / 0.45);
    st.frame({proc: s.proc, explode: s.explode, isolate: s.isolate, plane, t}, {...s.cam, az: s.cam.az * D2R, el: s.cam.el * D2R});
    ui.update({
      proc: s.proc,
      on: s.on,
      view: s.view,
      playing: s.playing,
      callouts: labels(s.proc, {iso: s.isolate > 0.5}, s.labels),
      cursor: s.cursor,
      cta: s.cta,
      live: !capture,
      manual: s.manual,
    });
  };
  const filmState = (t) => {
    const on = displayOn(t);
    return {
      proc: processAt(procTime(t)),
      explode: eased('exploded', t),
      isolate: eased('isolate', t),
      labels: eased('labels', t, 0.6),
      on,
      view: viewFilm(t),
      cam: camFilm(t),
      playing: true,
      cursor: cursorAt(t),
      cta: ss(30.2, 31.0, t),
    };
  };

  return {
    resize,
    render(t) {
      filmT = t;
      if (capture || !live.manual) return draw(t, filmState(t)), {};
      const tn = now();
      if (tn - live.last > 25) {
        live.manual = false;
        return draw(t, filmState(t)), {};
      }
      const dt = Math.min(0.1, tn - live.tPrev);
      live.tPrev = tn;
      if (live.playing && live.s < S) live.s = Math.min(S, live.s + dt);
      draw(tn, {
        proc: processAt(live.s),
        explode: easedLive('exploded', tn),
        isolate: easedLive('isolate', tn),
        labels: easedLive('labels', tn),
        on: live.on,
        view: live.view,
        cam: camLive(tn),
        playing: live.playing && live.s < S,
        cursor: null,
        cta: 0,
        manual: true,
      });
      return {};
    },
  };
});
