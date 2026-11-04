// NumZoo — les 7 jeux. Chaque jeu reçoit l'API `G` :
// G.area, G.age, G.lvl, G.av (avatar), G.later(fn, ms), G.raf(fn), G.correct(x,y), G.wrong(x,y) -> nb d'erreurs sur la question,
// G.newQ(), G.progress(f), G.done(extra), G.setQuestion(txt), G.alive()
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const centerOf = (el, area) => { const r = el.getBoundingClientRect(), a = area.getBoundingClientRect(); return { x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height / 2, ax: r.left + r.width / 2, ay: r.top + r.height / 2 }; };
const NQ = age => (age === 0 ? 6 : 8);

const GAMES = [
  { id: 'race', icon: '✈️', color: '#3a86ff' },
  { id: 'fish', icon: '🎣', color: '#0096c7' },
  { id: 'feed', icon: '🍌', color: '#ff9f1c' },
  { id: 'monster', icon: '👾', color: '#20b39f' },
  { id: 'link', icon: '🌟', color: '#7b2cbf' },
  { id: 'sort', icon: '🧺', color: '#e76f51' },
  { id: 'color', icon: '🎨', color: '#f15bb5' },
];

const GAME_FN = {};

// ======================= 1. Course des nuages =======================
GAME_FN.race = G => {
  const A = G.area; A.className = 'game-area race';
  A.append(h('div', 'layer far'), h('div', 'layer near'), h('div', 'speedlines'));
  const lanes = [38, 60, 82];
  const pw = h('div', 'plane-wrap', planeSVG(G.av)); pw.style.top = `calc(${lanes[1]}% - 4rem)`; A.append(pw);
  const bar = h('div', 'racebar', `<span class="flag">🏁</span>`);
  const me = h('div', 'tok', avatarHeadSVG(G.av)), rival = h('div', 'tok', '🦜');
  bar.append(rival, me); A.append(bar);
  const n = NQ(G.age), sk = SKILLS[G.age][G.lvl], qs = genSet(sk, n);
  const rivalTime = [95, 75, 60][G.age] * 1000;
  let i = 0, done = 0, rivalP = 0, busy = false, clouds = [];
  const t0 = performance.now();
  const setTok = () => { me.style.left = (6 + done / n * 84) + '%'; rival.style.left = (6 + rivalP * 84) + '%'; };
  setTok();
  G.raf(function tick() { rivalP = Math.min(1, (performance.now() - t0) / rivalTime); setTok(); });

  function ask() {
    G.newQ(); busy = false;
    const q = qs[i]; G.setQuestion(`${q.text} = ?`);
    const opts = choices(q.ans, 3, sk);
    clouds.forEach(c => c.remove()); clouds = [];
    opts.forEach((v, k) => {
      const c = h('button', 'lane-cloud ring', v);
      c.style.top = `calc(${lanes[k]}% - 2.3rem)`; c.style.right = '-30%'; c.style.transition = 'right .5s ease ' + (k * .08) + 's, transform .2s';
      c.onclick = () => pickCloud(c, v, k, q);
      A.append(c); clouds.push(c);
      G.later(() => { c.style.right = '8%'; }, 30);
    });
  }
  function pickCloud(c, v, k, q) {
    if (busy) return;
    pw.style.top = `calc(${lanes[k]}% - 4rem)`;
    const p = centerOf(c, A);
    if (v === q.ans) {
      busy = true; c.classList.add('good'); G.correct(p.ax, p.ay); Sound.whoosh();
      A.classList.add('boost'); pw.style.left = '55%';
      done++; setTok(); G.progress(done / n);
      G.later(() => { A.classList.remove('boost'); pw.style.left = '6%'; i++; if (i >= n) G.done({ race: rivalP < 1 }); else ask(); }, 900);
    } else {
      c.classList.add('bad', 'shake');
      const e = G.wrong(p.ax, p.ay);
      G.later(() => { c.classList.remove('shake'); pw.style.top = `calc(${lanes[1]}% - 4rem)`; }, 450);
      if (e >= 2) clouds.find(x => +x.textContent === q.ans).classList.add('hint-glow');
    }
  }
  ask();
};

// ======================= 2. Pêche magique =======================
GAME_FN.fish = G => {
  const A = G.area; A.className = 'game-area sea';
  A.append(h('div', 'waves'));
  const boat = h('div', 'boat-wrap', boatSVG(G.av)); A.append(boat);
  const bucket = h('div', 'bucket', '🪣 0'); A.append(bucket);
  ['8%', '30%', '72%', '90%'].forEach((l, k) => { const s = h('div', 'seaweed', k % 2 ? '🌿' : '🪸'); s.style.left = l; s.style.animationDelay = k * .4 + 's'; A.append(s); });
  const svgL = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svgL.setAttribute('class', 'link-svg'); svgL.style.zIndex = 7; A.append(svgL);
  const n = NQ(G.age), sk = SKILLS[G.age][G.lvl], qs = genSet(sk, n);
  const COLS = ['#ff6b6b', '#ffd23f', '#9b5de5', '#06d6a0', '#ff9f1c'];
  let i = 0, caught = 0, fish = [], busy = false;

  G.later(function bubbles() { if (!G.alive()) return; const b = h('i', 'bubble'); b.style.left = rnd(5, 95) + '%'; b.style.top = rnd(70, 95) + '%'; A.append(b); G.later(() => b.remove(), 4000); G.later(bubbles, 600); }, 300);

  function ask() {
    G.newQ(); busy = false;
    const q = qs[i]; G.setQuestion(`${q.text} = ?`);
    fish.forEach(f => f.el.remove()); fish = [];
    const opts = choices(q.ans, G.age === 0 ? 3 : 4, sk);
    const W = A.clientWidth, H = A.clientHeight;
    opts.forEach((v, k) => {
      const el = h('button', 'fish', fishSVG(COLS[(k + i) % COLS.length], v));
      const dir = Math.random() < .5 ? 1 : -1;
      const f = { el, v, x: rnd(0, W * .7), y: H * (.42 + k * (.48 / opts.length)), dir, sp: (0.6 + Math.random() * .6) * [0.7, 1, 1.2][G.age], ph: Math.random() * 6, stop: false };
      if (dir < 0) el.classList.add('flip');
      el.onclick = () => tapFish(f, q);
      A.append(el); fish.push(f);
    });
  }
  G.raf(function swim() {
    const W = A.clientWidth;
    fish.forEach(f => {
      if (f.stop) return;
      f.x += f.dir * f.sp * (W / 900); f.ph += .05;
      const fw = f.el.offsetWidth;
      if (f.x > W - fw) { f.dir = -1; f.el.classList.add('flip'); }
      if (f.x < 0) { f.dir = 1; f.el.classList.remove('flip'); }
      f.el.style.transform = `translate(${f.x}px, ${f.y + Math.sin(f.ph) * 8}px)`;
    });
  });
  function tapFish(f, q) {
    if (busy || f.stop) return;
    const p = centerOf(f.el, A);
    if (f.v === q.ans) {
      busy = true; f.stop = true; G.correct(p.ax, p.ay);
      const tip = centerOf(boat, A); const tx = tip.x + boat.offsetWidth * .45, ty = tip.y - boat.offsetHeight * .25;
      svgL.innerHTML = `<line x1="${tx}" y1="${ty}" x2="${p.x}" y2="${p.y}" style="stroke:#333;stroke-width:3;filter:none;animation-duration:.35s"/>`;
      G.later(() => {
        f.el.style.transition = 'transform .6s ease-in'; f.el.style.transform = `translate(${tx - f.el.offsetWidth / 2}px, ${ty - f.el.offsetHeight / 2}px) rotate(-60deg) scale(.4)`;
        svgL.innerHTML = '';
      }, 400);
      G.later(() => { caught++; bucket.textContent = '🪣 ' + caught; G.progress(caught / n); i++; if (i >= n) G.done(); else ask(); }, 1100);
    } else {
      f.el.classList.add('shake'); f.sp *= 2.2; G.later(() => { f.el.classList.remove('shake'); f.sp /= 2.2; }, 900);
      const e = G.wrong(p.ax, p.ay);
      if (e >= 2) { const g = fish.find(x => x.v === q.ans); g.el.classList.add('hint-glow'); g.sp = .25; }
    }
  }
  ask();
};

// ======================= 3. Le goûter (partage) =======================
GAME_FN.feed = G => {
  const A = G.area; A.className = 'game-area feed';
  const n = NQ(G.age), sk = SHARE_SKILLS[G.age][G.lvl], qs = genSet(sk, n);
  const PAIRS = [['🍌', '🐒'], ['🍎', '🐘'], ['🍓', '🐰'], ['🥕', '🦒'], ['🍊', '🐼'], ['🥭', '🦜'], ['🍇', '🐨'], ['🥥', '🦛']];
  const basket = h('div', 'basket'), table = h('div', 'feed-table'), ans = h('div', 'answers');
  A.append(basket, table, ans);
  let i = 0, busy = false;
  function ask() {
    G.newQ(); busy = false;
    const q = qs[i], [fr, an] = PAIRS[i % PAIRS.length];
    G.setQuestion(`${q.a} ${fr} ÷ ${q.b} ${an} = ?`);
    basket.className = 'basket' + (q.a <= 12 ? ' few' : '');
    basket.innerHTML = q.a <= 12 ? Array.from({ length: q.a }, () => `<span>${fr}</span>`).join('') : `<span style="font-size:3rem">${fr} × ${q.a}</span>`;
    table.innerHTML = '';
    const showEach = q.b <= 6;
    for (let k = 0; k < (showEach ? q.b : 1); k++) {
      const a = h('div', 'feed-animal', `<div class="em">${an}</div><div class="plate"></div>`);
      if (!showEach) a.querySelector('.em').innerHTML = `${an}<span style="font-size:2rem"> × ${q.b}</span>`;
      table.append(a);
    }
    ans.innerHTML = '';
    choices(q.ans, G.age === 0 ? 3 : 4, sk).forEach(v => {
      const b = h('button', 'ans', v); b.onclick = () => choose(b, v, q, fr, showEach); ans.append(b);
    });
  }
  function choose(b, v, q, fr, showEach) {
    if (busy) return;
    const p = centerOf(b, A);
    if (v === q.ans) {
      busy = true; b.classList.add('good'); G.correct(p.ax, p.ay);
      const plates = [...table.querySelectorAll('.plate')], fruits = [...basket.querySelectorAll('span')];
      if (showEach && fruits.length === q.a) {
        fruits.forEach((f, k) => G.later(() => { f.style.visibility = 'hidden'; const s = h('span', null, fr); plates[k % plates.length].append(s); if (k % 3 === 0) Sound.tap(); }, k * Math.min(120, 1400 / q.a)));
      } else {
        basket.style.opacity = .3; plates.forEach(pl => pl.innerHTML = `${fr} × ${q.ans}`);
        if (!plates.length) table.querySelector('.em').insertAdjacentHTML('afterend', `<div class="plate">${fr} × ${q.ans}</div>`);
      }
      const wait = showEach ? Math.min(1600, q.a * Math.min(120, 1400 / q.a)) + 700 : 1100;
      G.later(() => { basket.style.opacity = 1; G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, wait);
    } else {
      b.classList.add('bad', 'shake'); G.later(() => b.classList.remove('shake'), 400);
      if (G.wrong(p.ax, p.ay) >= 2) [...ans.children].find(x => +x.textContent === q.ans).classList.add('hint-glow');
    }
  }
  ask();
};

// ======================= 4. Glouton a faim =======================
GAME_FN.monster = G => {
  const A = G.area; A.className = 'game-area monster-bg';
  const cfg = MONSTER_MODES[G.age][G.lvl], n = NQ(G.age);
  const mw = h('div', 'monster-wrap', monsterSVG('')); const bubble = h('div', 'target-bubble'); const tiles = h('div', 'tiles');
  A.append(mw, bubble, tiles);
  const sym = cfg.mode === 'sum' ? '+' : '×';
  const ok = (x, y, T) => (cfg.mode === 'sum' ? x + y === T : x * y === T);
  let i = 0, T = 0, sel = [], busy = false;
  const setM = s => { mw.innerHTML = monsterSVG(s); };
  function makeRound() {
    let a, b;
    if (cfg.mode === 'prod') { a = pick(cfg.tables); b = rnd(2, 10); }
    else if (cfg.hundreds) { a = rnd(1, 8) * 100 + rnd(0, 9) * 10; b = rnd(1, 9 - Math.floor(a / 100)) * 100 + rnd(0, 9) * 10; if (a + b > 1000) b = 1000 - a; }
    else if (cfg.tens) { a = rnd(10, 80); b = rnd(5, 100 - a); }
    else { a = rnd(cfg.max > 5 ? 1 : 0, cfg.max - 1); b = rnd(1, cfg.max - a); }
    T = cfg.mode === 'sum' ? a + b : a * b;
    const vals = [a, b];
    let guard = 0;
    while (vals.length < 6 && guard++ < 300) {
      let d;
      if (cfg.mode === 'prod') d = rnd(2, 10);
      else if (cfg.hundreds) d = rnd(1, 9) * 100 + rnd(0, 9) * 10;
      else d = rnd(0, Math.max(cfg.max, 9));
      if (d !== a && d !== b && !vals.includes(d)) vals.push(d);
    }
    return shuffle(vals);
  }
  function ask() {
    G.newQ(); busy = false; sel = []; setM('');
    const vals = makeRound();
    bubble.textContent = `? ${sym} ? = ${T}`; G.setQuestion('');
    tiles.innerHTML = '';
    vals.forEach(v => { const b = h('button', 'tile', v); b.dataset.v = v; b.onclick = () => tap(b); tiles.append(b); });
  }
  function tap(b) {
    if (busy) return;
    Sound.tap();
    if (b.classList.contains('sel')) { b.classList.remove('sel'); sel = sel.filter(x => x !== b); setM(sel.length ? 'open' : ''); return; }
    b.classList.add('sel'); sel.push(b); setM('open');
    if (sel.length < 2) return;
    busy = true;
    const [x, y] = sel.map(s => +s.dataset.v), p = centerOf(b, A);
    bubble.textContent = `${x} ${sym} ${y} = ${T}`;
    if (ok(x, y, T)) {
      const m = centerOf(mw, A);
      sel.forEach(s => { s.style.transition = 'transform .45s ease-in'; const c = centerOf(s, A); s.style.transform = `translate(${m.x - c.x}px, ${m.y - c.y}px) scale(.2)`; });
      G.correct(p.ax, p.ay);
      G.later(() => { sel.forEach(s => s.classList.add('used')); setM('chew'); Sound.chomp(); }, 450);
      G.later(() => { G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, 1400);
    } else {
      bubble.textContent = `${x} ${sym} ${y} ≠ ${T}`;
      setM('sad'); const e = G.wrong(p.ax, p.ay);
      G.later(() => {
        sel.forEach(s => s.classList.remove('sel')); sel = []; setM(''); busy = false; bubble.textContent = `? ${sym} ? = ${T}`;
        if (e >= 2) { const tl = [...tiles.children]; outer: for (const p1 of tl) for (const p2 of tl) if (p1 !== p2 && ok(+p1.dataset.v, +p2.dataset.v, T)) { p1.classList.add('hint-glow'); p2.classList.add('hint-glow'); break outer; } }
      }, 900);
    }
  }
  ask();
};

// ======================= 5. Relie les étoiles =======================
GAME_FN.link = G => {
  const A = G.area; A.className = 'game-area night';
  A.append(h('div', 'star-bg'));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'link-svg');
  const cols = h('div', 'link-cols'), L = h('div', 'link-col'), R = h('div', 'link-col');
  cols.append(L, R); A.append(svg, cols);
  const per = G.age === 0 ? 3 : 4, rounds = 2, sk = SKILLS[G.age][G.lvl];
  let round = 0, matched = 0, selL = null, selR = null;
  G.setQuestion('');
  function build() {
    G.newQ(); svg.innerHTML = ''; L.innerHTML = ''; R.innerHTML = ''; selL = selR = null;
    const qs = genSet(sk, per, true);
    shuffle(qs).forEach(q => { const b = h('button', 'node', q.text); b.dataset.a = q.ans; b.onclick = () => tap(b, 'L'); L.append(b); });
    shuffle(qs).forEach(q => { const b = h('button', 'node res', q.ans); b.dataset.a = q.ans; b.onclick = () => tap(b, 'R'); R.append(b); });
  }
  function tap(b, side) {
    if (b.classList.contains('done')) return;
    Sound.tap();
    if (side === 'L') { if (selL) selL.classList.remove('sel'); selL = b; } else { if (selR) selR.classList.remove('sel'); selR = b; }
    b.classList.add('sel');
    if (!(selL && selR)) return;
    const l = selL, r = selR; selL = selR = null;
    l.classList.remove('sel'); r.classList.remove('sel');
    const p = centerOf(r, A);
    if (l.dataset.a === r.dataset.a) {
      const a = centerOf(l, A);
      const lr = l.getBoundingClientRect(), rr = r.getBoundingClientRect(), ar = A.getBoundingClientRect();
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', lr.right - ar.left); line.setAttribute('y1', a.y); line.setAttribute('x2', rr.left - ar.left); line.setAttribute('y2', p.y);
      svg.append(line); l.classList.add('done'); r.classList.add('done'); G.correct(p.ax, p.ay); G.newQ();
      matched++; G.progress(matched / (per * rounds));
      if (matched % per === 0) G.later(() => { round++; if (round >= rounds) G.done(); else build(); }, 1000);
    } else {
      l.classList.add('bad'); r.classList.add('bad');
      G.later(() => { l.classList.remove('bad'); r.classList.remove('bad'); }, 450);
      if (G.wrong(p.ax, p.ay) >= 2) { const m = [...R.children].find(x => x.dataset.a === l.dataset.a); if (m) m.classList.add('hint-glow'); G.later(() => m && m.classList.remove('hint-glow'), 2500); }
    }
  }
  build();
};

// ======================= 6. Le grand tri =======================
GAME_FN.sort = G => {
  const A = G.area; A.className = 'game-area sort-bg';
  const rule = SORT_RULES[G.age][G.lvl], sk = SKILLS[G.age][G.lvl], n = NQ(G.age);
  const belt = h('div', 'belt'), crate = h('div', 'crate'), bins = h('div', 'bins');
  A.append(belt, crate, bins);
  const cat = v => (rule.type === 'lt' ? (v < rule.n ? 0 : 1) : (v % 2 === 0 ? 0 : 1));
  const labels = rule.type === 'lt' ? [`< ${rule.n}`, `≥ ${rule.n}`] : [t('even'), t('odd')];
  const binEls = labels.map((lb, k) => { const b = h('button', 'bin', `${lb}<span class="cnt"></span>`); b.style.background = k ? '#ef476f' : '#3a86ff'; b.onclick = () => drop(k, b); bins.append(b); return b; });
  // Série équilibrée entre les deux paniers
  const pool = genSet(sk, 60), want = shuffle(Array.from({ length: n }, (_, k) => k % 2));
  const qs = []; const used = new Set();
  want.forEach(c => { const q = pool.find(x => cat(x.ans) === c && !used.has(x.text)) || pool.find(x => !used.has(x.text)); used.add(q.text); qs.push(q); });
  let i = 0, busy = false; const counts = [0, 0];
  G.setQuestion('');
  function ask() {
    G.newQ(); busy = false;
    crate.style.transition = 'none'; crate.style.left = '50%'; crate.style.top = ''; crate.style.transform = 'translateX(-50%)'; crate.style.opacity = 1;
    crate.textContent = qs[i].text; crate.classList.remove('enter'); void crate.offsetWidth; crate.classList.add('enter');
    G.later(() => { crate.style.transition = ''; }, 50);
  }
  function drop(k, b) {
    if (busy) return;
    const q = qs[i], p = centerOf(b, A);
    if (cat(q.ans) === k) {
      busy = true;
      const c = centerOf(crate, A);
      crate.style.transform = `translate(calc(-50% + ${p.x - c.x}px), ${p.y - c.y}px) scale(.35)`; crate.style.opacity = .2;
      G.correct(p.ax, p.ay); floatText(p.ax, p.ay - 60, `${q.text} = ${q.ans}`);
      counts[k]++; b.querySelector('.cnt').textContent = '📦 ' + counts[k];
      G.later(() => { G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, 900);
    } else {
      crate.classList.add('shake'); G.later(() => crate.classList.remove('shake'), 400);
      if (G.wrong(p.ax, p.ay) >= 2) { binEls[cat(q.ans)].classList.add('hint-glow'); G.later(() => binEls.forEach(x => x.classList.remove('hint-glow')), 2500); crate.textContent = `${q.text} = ${q.ans}`; }
    }
  }
  ask();
};

// ======================= 7. Coloriage magique =======================
function renderColorPage(page, stage, labels) {
  let s = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">`;
  page.zones.forEach((z, k) => {
    const inner = z.shape || `<path d="${z.d}"/>`;
    s += `<g class="zone" data-i="${k}" fill="#ffffff">${inner}</g>`;
  });
  s += page.decor;
  if (labels) page.zones.forEach((z, k) => {
    const txt = String(labels[k]).replace(/ /g, ''), fs = Math.max(11, Math.min(19, (z.w || 60) / (txt.length * .6)));
    const tr = z.rot ? ` transform="rotate(-90 ${z.lx} ${z.ly - fs * .35})"` : '';
    s += `<text class="lbl" id="lbl${k}" x="${z.lx}" y="${z.ly}" style="font-size:${fs.toFixed(1)}px"${tr}>${txt}</text>`;
  });
  stage.innerHTML = s + '</svg>';
  return [...stage.querySelectorAll('.zone')];
}
GAME_FN.color = G => {
  const A = G.area; A.className = 'game-area color-bg';
  const page = COLOR_PAGES[G.lvl], sk = COLOR_SKILLS[G.age][G.lvl];
  const stage = h('div', 'color-stage'), pal = h('div', 'palette'); A.append(stage, pal);
  const qs = genSet(sk, page.colors.length, true); // une valeur par couleur
  const labels = page.zones.map((z, k) => {
    const base = qs[z.c];
    const firstIdx = page.zones.findIndex(w => w.c === z.c);
    if (firstIdx === k) return base.text;
    const alt = exprFor(base.ans, sk, base.text); return (alt || base).text;
  });
  const zones = renderColorPage(page, stage, labels);
  G.setQuestion('');
  let cur = null, filled = 0;
  const palBtns = shuffle(page.colors.map((c, k) => ({ c, k }))).map(({ c, k }) => {
    const b = h('button', 'pal', qs[k].ans); b.style.background = c;
    b.onclick = () => { Sound.tap(); palBtns.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); cur = k; };
    pal.append(b); return b;
  });
  zones.forEach(zEl => {
    zEl.addEventListener('click', ev => {
      const k = +zEl.dataset.i, z = page.zones[k];
      if (zEl.dataset.ok) return;
      if (cur === null) { palBtns.forEach(b => { b.classList.add('shake'); G.later(() => b.classList.remove('shake'), 400); }); return; }
      if (cur === z.c) {
        zEl.setAttribute('fill', page.colors[z.c]); zEl.dataset.ok = 1; document.getElementById('lbl' + k).style.opacity = 0;
        G.correct(ev.clientX, ev.clientY); filled++; G.progress(filled / zones.length); G.newQ();
        if (filled === zones.length) {
          const p = Store.profile(); p.pages = p.pages || {}; p.pages[page.id] = true; Store.save();
          G.later(() => G.done(), 900);
        }
      } else {
        zEl.classList.remove('wrong'); void zEl.getBBox(); zEl.classList.add('wrong');
        if (G.wrong(ev.clientX, ev.clientY) >= 2) { const b = palBtns.find(x => x.style.background && +x.textContent === qs[z.c].ans); b.classList.add('hint-glow'); G.later(() => b.classList.remove('hint-glow'), 2500); }
      }
    });
  });
};
