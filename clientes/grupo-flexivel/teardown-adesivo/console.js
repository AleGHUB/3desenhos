// Console do teardown na identidade Flexível (Guia 2026.9): Titillium Web nos títulos, IBM Plex Sans no texto,
// Verde Petróleo e Verde Inovação dominando, Âmbar (Amarelo Mostarda do manual) só para o adesivo, que é a peça
// trabalhando. Layout fixo de 1600 x 900; update(s) redesenha as partes vivas a partir do estado do quadro.
import {LOGO} from './logo.js';
import {N_CORDS, STEPS, S} from './panel.js';

export const C = {pet: '#013d3d', pet2: '#074e4d', ino: '#8dc63f', inoD: '#146e37', mar: '#ffffe4', gra: '#2a363b', ard: '#7b9095', amb: '#e9b44c', ambD: '#a8792c', line: 'rgba(1,61,61,.14)'};
export const VIEWS = ['hero', 'top', 'profile'];
export const VIEW_LABEL = {hero: 'Herói', top: 'Topo', profile: 'Perfil'};
export const DISPLAY = ['exploded', 'isolate', 'labels'];
export const DISPLAY_LABEL = {exploded: 'Explodir', isolate: 'Isolar adesivo', labels: 'Rótulos'};

const CSS = `
html body #app,html body #app .ui{font-family:'IBM Plex Sans','Segoe UI',system-ui,-apple-system,sans-serif!important}
#app{color:${C.gra};-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.ui{position:absolute;inset:0;pointer-events:none}
.ui *{box-sizing:border-box}
.ttl{font-family:'Titillium Web',system-ui,sans-serif}
.eb{font:600 12px 'IBM Plex Sans',sans-serif;letter-spacing:.18em;text-transform:uppercase}
.card{position:absolute;border-radius:10px}
.steps{background:${C.pet};color:${C.mar};box-shadow:0 10px 30px rgba(1,45,44,.18)}
.read{background:rgba(255,255,244,.94);border:1px solid ${C.line};box-shadow:0 6px 20px rgba(1,45,44,.07)}
.st{position:absolute;left:18px;right:16px;display:grid;grid-template-columns:34px 1fr;column-gap:12px;align-items:start;transition:none}
.st .n{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 15px 'Titillium Web',sans-serif;border:1.5px solid rgba(255,255,228,.35);color:rgba(255,255,228,.6)}
.st b{font:700 17px/1.15 'Titillium Web',sans-serif;color:rgba(255,255,228,.62);display:block;margin-top:3px}
.st span{font-size:12.5px;line-height:1.35;color:rgba(255,255,228,.5);display:block;margin-top:3px}
.st.on .n{background:${C.amb};border-color:${C.amb};color:${C.pet}}
.st.on b{color:${C.mar}}
.st.on span{color:rgba(255,255,228,.86)}
.st.done .n{border-color:${C.ino};color:${C.ino}}
.st.done b{color:rgba(255,255,228,.85)}
.mt{position:absolute;left:18px;right:18px}
.mt .k{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:${C.gra}}
.mt .k em{font-style:normal;font:700 15px 'Titillium Web',sans-serif;color:${C.pet}}
.mt .bar{margin-top:6px;height:5px;border-radius:3px;background:rgba(1,61,61,.1);overflow:hidden}
.mt .bar i{display:block;height:100%;width:0}
.pr{position:absolute;left:18px;right:16px;font-size:13px;line-height:1.35;display:flex;gap:9px;align-items:baseline;color:${C.gra}}
.pr:before{content:"";flex:none;width:7px;height:7px;border-radius:2px;background:${C.ino};transform:translateY(-1px)}
.bt{position:absolute;height:36px;padding:0 16px;display:flex;align-items:center;justify-content:center;border-radius:7px;font:600 14px 'Titillium Web',sans-serif;letter-spacing:.02em;white-space:nowrap;border:1.5px solid ${C.pet};color:${C.pet};background:rgba(255,255,244,.9)}
.bt.on{background:${C.pet};color:${C.mar}}
.bt.v{border-color:${C.line}}
.bt.v.on{border-color:${C.pet}}
.tl{position:absolute;height:36px}
.seg{position:absolute;top:0;height:36px;border-radius:6px;background:rgba(1,61,61,.08);overflow:hidden}
.seg i{position:absolute;left:0;top:0;bottom:0;background:rgba(141,198,63,.35)}
.seg span{position:absolute;left:10px;top:9px;font:600 13px 'Titillium Web',sans-serif;color:${C.pet};white-space:nowrap}
.seg.on span{color:${C.pet}}
.seg.on{box-shadow:inset 0 0 0 1.5px ${C.pet}}
.call{position:absolute;white-space:nowrap;width:232px;padding:7px 11px 8px;border-radius:7px;background:rgba(1,61,61,.82);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);box-shadow:0 6px 16px rgba(1,45,44,.18)}
.call b{display:flex;align-items:center;gap:8px;font:700 15px/1.15 'Titillium Web',sans-serif;color:${C.mar}}
.call b i{display:block;flex:none;width:9px;height:9px;border-radius:2px;background:${C.ino}}
.call.g{box-shadow:inset 3px 0 0 ${C.amb},0 6px 16px rgba(1,45,44,.22)}
.call.g b{color:#f4d58c}
.call.g b i{background:${C.amb}}
.call span{display:block;font-size:12px;line-height:1.3;color:rgba(255,255,228,.78);margin-top:2px;padding-left:17px;overflow:hidden;text-overflow:ellipsis}
.cta{position:absolute;left:44px;top:594px;width:304px;min-height:116px;background:${C.pet};color:${C.mar};border-radius:10px;padding:16px 18px;box-shadow:0 10px 30px rgba(1,45,44,.22)}
.cta b{display:block;font:900 21px/1.05 'Titillium Web',sans-serif;color:${C.ino}}
.cta span{display:block;margin-top:9px;font-size:12.5px;line-height:1.4;white-space:normal}
.cur{position:absolute;left:0;top:0;z-index:50;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
.ring{position:absolute;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:2px solid ${C.amb};opacity:0;z-index:49}
.chip{position:absolute;left:800px;top:28px;transform:translateX(-50%);height:30px;padding:0 14px;display:flex;align-items:center;gap:8px;border-radius:15px;background:rgba(255,255,244,.92);border:1px solid ${C.line};font-size:12.5px;color:${C.gra};white-space:nowrap}
.chip i{width:8px;height:8px;border-radius:50%;background:${C.ino}}
`;
const el = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h.trim();
  return d.firstElementChild;
};
const pct = (x) => `${Math.round(Math.min(1, Math.max(0, x)) * 100)}%`;

export function createConsole(app) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  const ui = el(`<div class="ui"></div>`);
  app.appendChild(ui);
  const add = (h) => {
    const n = el(h);
    ui.appendChild(n);
    return n;
  };
  const spots = {};

  // ------------------------------------------------------------ cabeçalho
  add(`<div style="position:absolute;left:44px;top:38px;width:150px;color:${C.pet}">${LOGO}</div>`);
  add(`<div class="eb" style="position:absolute;left:46px;top:100px;color:${C.inoD}">Telha termoacústica · camadas e processo</div>`);
  add(`<div class="ttl" style="position:absolute;left:44px;top:116px;font-size:46px;font-weight:900;line-height:1;color:${C.pet};letter-spacing:-.01em;white-space:nowrap">Adesivo Monocomponente</div>`);
  add(`<div style="position:absolute;left:46px;top:172px;font-size:15.5px;color:${C.gra}">Um componente. Cura com a umidade do ar. Para PIR, PUR e EPS.</div>`);

  // ------------------------------------------------------------ etapas
  add(`<div class="card steps" style="left:44px;top:226px;width:304px;height:352px"></div>`);
  add(`<div class="eb" style="position:absolute;left:62px;top:246px;color:rgba(255,255,228,.6);font-size:11px">Etapas do processo</div>`);
  const stepEls = STEPS.map((st, i) => add(`<div class="st" style="left:62px;top:${280 + i * 74}px;width:276px"><div class="n">${st.n}</div><div><b>${st.name}</b><span>${st.sub}</span></div></div>`));

  // ------------------------------------------------------------ leitura do processo + propriedades
  add(`<div class="card read" style="left:1252px;top:226px;width:304px;height:470px"></div>`);
  add(`<div class="eb" style="position:absolute;left:1270px;top:246px;color:${C.inoD};font-size:11px">Leitura do processo</div>`);
  const meter = (y, label, color) => {
    const n = add(`<div class="mt" style="left:1270px;top:${y}px;width:268px"><div class="k"><span>${label}</span><em></em></div><div class="bar"><i style="background:${color}"></i></div></div>`);
    return {v: n.querySelector('em'), b: n.querySelector('.bar i')};
  };
  const mCords = meter(276, 'Cordões aplicados', C.amb);
  const mSheet = meter(330, 'Chapa', C.pet);
  const mPress = meter(384, 'Prensagem', C.pet2);
  const mCure = meter(438, 'Cura (esquemático)', C.ambD);
  add(`<div style="position:absolute;left:1270px;top:486px;width:268px;height:1px;background:${C.line}"></div>`);
  add(`<div class="eb" style="position:absolute;left:1270px;top:502px;color:${C.inoD};font-size:11px">O que o adesivo entrega</div>`);
  ['Boa viscosidade e espalhabilidade', 'Adesão entre metal e núcleo isolante', 'Tempo de reatividade prolongado', 'Colagem confiável, inclusive manual'].forEach((t, i) =>
    add(`<div class="pr" style="left:1270px;top:${532 + i * 38}px;width:270px">${t}</div>`),
  );

  // ------------------------------------------------------------ controles
  const btn = (x, w, key, label, cls = '') => {
    const n = add(`<div class="bt ${cls}" data-k="${key}" style="left:${x}px;top:818px;width:${w}px">${label}</div>`);
    spots[key] = [x + w / 2, 836];
    return n;
  };
  const dispBtn = {exploded: btn(44, 108, 'exploded', 'Explodir'), isolate: btn(160, 136, 'isolate', 'Isolar adesivo'), labels: btn(304, 94, 'labels', 'Rótulos')};
  const viewBtn = {hero: btn(426, 80, 'hero', 'Herói', 'v'), top: btn(512, 72, 'top', 'Topo', 'v'), profile: btn(590, 80, 'profile', 'Perfil', 'v')};
  const play = btn(700, 46, 'play', '❚❚');
  const TL = {x: 756, w: 800};
  const tl = add(`<div class="tl" data-k="timeline" style="left:${TL.x}px;top:818px;width:${TL.w}px"></div>`);
  const segs = STEPS.map((st) => {
    const x = (st.from / S) * TL.w;
    const w = ((st.to - st.from) / S) * TL.w - 4;
    const n = el(`<div class="seg" style="left:${x}px;width:${w}px"><i></i><span>${st.n} · ${st.name.split(' ')[0]}</span></div>`);
    tl.appendChild(n);
    spots['step' + st.n] = [TL.x + x + 22, 836];
    return n;
  });

  // ------------------------------------------------------------ rótulos, CTA, cursor
  const lines = add(`<svg style="position:absolute;left:0;top:0" width="1600" height="900"></svg>`);
  const callLayer = add(`<div style="position:absolute;inset:0"></div>`);
  const cta = add(`<div class="cta"><b>Fale com os nossos especialistas</b><span>+55 (47) 3270-1900<br>grupoflexivel.com.br · Jaraguá do Sul, SC</span></div>`);
  const chip = add(`<div class="chip"><i></i><span>Tour automático. Clique, arraste ou role para assumir o controle.</span></div>`);
  const ring = add(`<div class="ring"></div>`);
  const cur = add(`<svg class="cur" width="22" height="28" viewBox="0 0 22 28"><path d="M2 2v20l5.5-5 3.6 8.2 3.4-1.5-3.5-8H18z" fill="${C.pet}" stroke="${C.mar}" stroke-width="1.6" stroke-linejoin="round"/></svg>`);
  add(`<div style="position:absolute;right:44px;top:44px;font-size:12.5px;color:${C.gra};opacity:.75;text-align:right;line-height:1.5">Flexível · soluções e sistemas em poliuretano<br>Vista esquemática, fora de escala</div>`);
  add(`<div style="position:absolute;left:0;right:0;top:872px;text-align:center;font-size:11px;letter-spacing:.08em;color:${C.gra};opacity:.5">3Desenhos - PROTÓTIPO - 2026</div>`);

  const update = (s) => {
    const p = s.proc;
    stepEls.forEach((n, i) => {
      n.classList.toggle('on', i === p.step && p.s < S);
      n.classList.toggle('done', i < p.step || p.s >= S);
      n.querySelector('.n').textContent = i < p.step || p.s >= S ? '✓' : STEPS[i].n;
    });
    mCords.v.textContent = `${p.cords} / ${N_CORDS}`;
    mCords.b.style.width = pct(p.cords / N_CORDS);
    mSheet.v.textContent = p.contact ? 'em contato' : p.s < 7.5 ? 'aguardando' : 'descendo';
    mSheet.b.style.width = pct(1 - p.lift / 0.42);
    mPress.v.textContent = pct(p.press);
    mPress.b.style.width = pct(p.press);
    mCure.v.textContent = pct(p.cure);
    mCure.b.style.width = pct(p.cure);
    for (const k of DISPLAY) dispBtn[k].classList.toggle('on', !!s.on[k]);
    for (const k of VIEWS) viewBtn[k].classList.toggle('on', s.view === k);
    play.textContent = s.playing ? '❚❚' : '▶';
    segs.forEach((n, i) => {
      const st = STEPS[i];
      n.querySelector('i').style.width = pct((p.s - st.from) / (st.to - st.from));
      n.classList.toggle('on', i === p.step);
    });
    // rótulos
    let svg = '';
    callLayer.innerHTML = '';
    for (const c of s.callouts) {
      const [ax, ay] = c.at;
      const [lx, ly] = c.label;
      const left = lx < ax;
      const ex = left ? lx + c.w : lx;
      svg += `<path d="M${ax} ${ay} L${ex} ${ly}" stroke="${c.glue ? C.amb : C.pet}" stroke-width="1.4" fill="none" opacity="${c.o}"/><circle cx="${ax}" cy="${ay}" r="3.5" fill="${c.glue ? C.amb : C.pet}" opacity="${c.o}"/>`;
      const n = el(`<div class="call${c.glue ? ' g' : ''}" style="left:${lx}px;top:${ly - 23}px;opacity:${c.o}"><b><i></i>${c.name}</b><span>${c.sub}</span></div>`);
      callLayer.appendChild(n);
    }
    lines.innerHTML = svg;
    cta.style.opacity = s.cta;
    cta.style.transform = `translateY(${(1 - s.cta) * 14}px)`;
    chip.style.display = s.live && !s.manual ? 'flex' : 'none';
    const c = s.cursor;
    cur.style.display = c ? 'block' : 'none';
    if (c) {
      cur.style.transform = `translate(${c.x - 2}px, ${c.y - 2}px) scale(${c.press ? 0.9 : 1})`;
      ring.style.opacity = c.ring * 0.9;
      ring.style.left = `${c.ringX}px`;
      ring.style.top = `${c.ringY}px`;
      ring.style.transform = `scale(${1.6 - 0.6 * c.ring})`;
    } else ring.style.opacity = 0;
  };
  return {update, spots, root: ui, TL};
}
