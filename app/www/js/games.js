// Cécilia & Manoach — les 7 jeux, en images 3D (img/jeux, img/fruits, img/animaux, img/decors).
// Chaque jeu reçoit l'API `G` :
// G.area, G.age (niveau scolaire 0 = CE2, 1 = CM1, 2 = génie), G.lvl, G.av (avatar du joueur),
// G.sk (générateur de questions : notion du programme ou table), G.glouton, G.tri (réglages de Glouton et du Grand tri),
// G.later(fn, ms), G.raf(fn), G.correct(x,y), G.wrong(x,y) -> nb d'erreurs sur la question,
// G.newQ(), G.progress(f), G.done(extra), G.setQuestion(txt), G.alive()
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const centerOf = (el, area) => { const r = el.getBoundingClientRect(), a = area.getBoundingClientRect(); return { x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height / 2, ax: r.left + r.width / 2, ay: r.top + r.height / 2 }; };
const NQ = age => [8, 8, 10][age] || 8;
const IMG = (src, cls = '') => `<img class="${cls}" src="img/${src}.webp" alt="" draggable="false">`;
const avImg = av => `img/avatars/${(av && av.id) || 'amani'}.webp`;
const qTxt = q => q.q || `${q.text} = ?`;
const egal = (a, b) => Math.abs(a - b) < 1e-6;
// Réponses en nombres ou en mots (français, sciences…) : comparaison et propositions communes à tous les jeux
const same = (a, b) => (typeof b === 'number' ? egal(+a, b) : String(a) === String(b));
const choixDe = (q, n, sk) => (q.choix ? shuffle([q.ans, ...shuffle(q.choix).slice(0, n - 1)]) : choices(q.ans, n, sk));
const motCls = v => (typeof v === 'string' ? (v.length > 12 ? ' mot long' : v.length > 4 ? ' mot' : '') : '');
const decor = (A, nom, cls) => { A.className = 'game-area decor ' + cls; A.style.backgroundImage = `url(img/decors/${nom}.webp)`; };
// Les questions longues (problèmes) laissent plus de temps
const lente = sk => sk && ['probleme', 'proportion', 'melange'].includes(sk.notion);

const GAMES = [
  { id: 'race', icon: '✈️', color: '#3a86ff' },
  { id: 'fish', icon: '🎣', color: '#0096c7' },
  { id: 'feed', icon: '🥭', color: '#ff9f1c' },
  { id: 'monster', icon: '👾', color: '#20b39f' },
  { id: 'link', icon: '🌟', color: '#7b2cbf' },
  { id: 'sort', icon: '🧺', color: '#e76f51' },
  { id: 'color', icon: '🎨', color: '#f15bb5' },
];

const GAME_FN = {};

// ======================= 1. Course dans le ciel (avion piloté par l'enfant) =======================
GAME_FN.race = G => {
  const A = G.area; decor(A, 'course', 'race');
  A.append(h('div', 'speedlines'));
  const lanes = [40, 62, 84];
  const pw = h('div', 'plane-wrap', `<div class="pilote" style="background-image:url(${avImg(G.av)})"></div>${IMG('jeux/avion', 'avion')}`);
  pw.style.top = `calc(${lanes[1]}% - 4rem)`; A.append(pw);
  const bar = h('div', 'racebar', `<span class="flag">🏁</span>`);
  const me = h('div', 'tok tete'), rival = h('div', 'tok', IMG('jeux/perroquet'));
  me.style.backgroundImage = `url(${avImg(G.av)})`;
  bar.append(rival, me); A.append(bar);
  const n = NQ(G.age), sk = G.sk, qs = genSet(sk, n);
  const rivalTime = [95, 80, 55][G.age] * 1000 * (lente(sk) ? 1.8 : 1);
  let i = 0, done = 0, rivalP = 0, busy = false, clouds = [];
  const t0 = performance.now();
  const setTok = () => { me.style.left = (6 + done / n * 84) + '%'; rival.style.left = (6 + rivalP * 84) + '%'; };
  setTok();
  G.raf(function tick() { rivalP = Math.min(1, (performance.now() - t0) / rivalTime); setTok(); });

  function ask() {
    G.newQ(); busy = false;
    const q = qs[i]; G.setQuestion(qTxt(q));
    const opts = choixDe(q, 3, sk);
    clouds.forEach(c => c.remove()); clouds = [];
    opts.forEach((v, k) => {
      const c = h('button', 'lane-cloud' + motCls(v), `<span>${fmt(v)}</span>`); c.dataset.v = v;
      c.style.top = `calc(${lanes[k]}% - 2.6rem)`; c.style.right = '-30%'; c.style.transition = 'right .5s ease ' + (k * .08) + 's, transform .2s';
      c.onclick = () => pickCloud(c, v, k, q);
      A.append(c); clouds.push(c);
      G.later(() => { c.style.right = '6%'; }, 30);
    });
  }
  function pickCloud(c, v, k, q) {
    if (busy) return;
    pw.style.top = `calc(${lanes[k]}% - 4rem)`;
    const p = centerOf(c, A);
    if (same(v, q.ans)) {
      busy = true; c.classList.add('good'); G.correct(p.ax, p.ay); Sound.whoosh();
      A.classList.add('boost'); pw.style.left = '50%';
      done++; setTok(); G.progress(done / n);
      G.later(() => { A.classList.remove('boost'); pw.style.left = '4%'; i++; if (i >= n) G.done({ race: rivalP < 1 }); else ask(); }, 900);
    } else {
      c.classList.add('bad', 'shake');
      const e = G.wrong(p.ax, p.ay);
      G.later(() => { c.classList.remove('shake'); pw.style.top = `calc(${lanes[1]}% - 4rem)`; }, 450);
      if (e >= 2) clouds.find(x => same(x.dataset.v, q.ans)).classList.add('hint-glow');
    }
  }
  ask();
};

// ======================= 2. Pêche sur le fleuve (l'enfant pêche depuis la pirogue) =======================
GAME_FN.fish = G => {
  const A = G.area; decor(A, 'peche', 'sea');
  const boat = h('div', 'boat-wrap', `<div class="pecheur" style="background-image:url(${avImg(G.av)})"></div>${IMG('jeux/bateau', 'bateau')}`); A.append(boat);
  const bucket = h('div', 'bucket', `${IMG('jeux/seau')}<b>0</b>`); A.append(bucket);
  [['algue', '6%'], ['corail', '26%'], ['algue', '70%'], ['corail', '88%']].forEach(([im, l], k) => { const s = h('div', 'seaweed', IMG('jeux/' + im)); s.style.left = l; s.style.animationDelay = k * .4 + 's'; A.append(s); });
  const svgL = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svgL.setAttribute('class', 'link-svg'); svgL.style.zIndex = 7; A.append(svgL);
  const n = NQ(G.age), sk = G.sk, qs = genSet(sk, n);
  const COLS = ['rouge', 'jaune', 'violet', 'vert', 'orange'];
  let i = 0, caught = 0, fish = [], busy = false;

  G.later(function bubbles() { if (!G.alive()) return; const b = h('i', 'bubble'); b.style.left = rnd(5, 95) + '%'; b.style.top = rnd(70, 95) + '%'; A.append(b); G.later(() => b.remove(), 4000); G.later(bubbles, 600); }, 300);

  function ask() {
    G.newQ(); busy = false;
    const q = qs[i]; G.setQuestion(qTxt(q));
    fish.forEach(f => f.el.remove()); fish = [];
    const opts = choixDe(q, [3, 4, 5][G.age], sk);
    const W = A.clientWidth, H = A.clientHeight;
    opts.forEach((v, k) => {
      const el = h('button', 'fish', `${IMG('jeux/poisson-' + COLS[(k + i) % COLS.length], 'corps')}<span class="num${motCls(v)}">${fmt(v)}</span>`); el.dataset.v = v;
      const dir = Math.random() < .5 ? 1 : -1;
      const f = { el, v, x: rnd(0, W * .7), y: H * (.4 + k * (.46 / opts.length)), dir, sp: (0.6 + Math.random() * .6) * [0.8, 1, 1.3][G.age], ph: Math.random() * 6, stop: false };
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
    if (same(f.v, q.ans)) {
      busy = true; f.stop = true; G.correct(p.ax, p.ay);
      const b = centerOf(boat, A); const tx = b.x + boat.offsetWidth * .2, ty = b.y - boat.offsetHeight * .45;
      svgL.innerHTML = `<line x1="${tx}" y1="${ty}" x2="${p.x}" y2="${p.y}" style="stroke:#333;stroke-width:3;filter:none;animation-duration:.35s"/>`;
      G.later(() => {
        f.el.style.transition = 'transform .6s ease-in'; f.el.style.transform = `translate(${tx - f.el.offsetWidth / 2}px, ${ty - f.el.offsetHeight / 2}px) rotate(-60deg) scale(.4)`;
        svgL.innerHTML = '';
      }, 400);
      G.later(() => { caught++; bucket.querySelector('b').textContent = caught; G.progress(caught / n); i++; if (i >= n) G.done(); else ask(); }, 1100);
    } else {
      f.el.classList.add('shake'); f.sp *= 2.2; G.later(() => { f.el.classList.remove('shake'); f.sp /= 2.2; }, 900);
      const e = G.wrong(p.ax, p.ay);
      if (e >= 2) { const g = fish.find(x => same(x.v, q.ans)); g.el.classList.add('hint-glow'); g.sp = .25; }
    }
  }
  ask();
};

// ======================= 3. Le goûter : partager les fruits =======================
GAME_FN.feed = G => {
  const A = G.area; decor(A, 'partage', 'feed');
  const n = NQ(G.age), sk = G.sk, qs = genSet(sk, n);
  const PAIRS = [['mangue', 'perroquet', '🥭', '🦜'], ['banane', 'singe', '🍌', '🐒'], ['pomme', 'elephant', '🍎', '🐘'], ['fraise', 'lapin', '🍓', '🐰'], ['carotte', 'girafe', '🥕', '🦒'], ['orange', 'panda', '🍊', '🐼'], ['raisin', 'koala', '🍇', '🐨'], ['coco', 'hippo', '🥥', '🦛']];
  const basket = h('div', 'basket'), table = h('div', 'feed-table'), ans = h('div', 'answers');
  A.append(basket, table, ans);
  let i = 0, busy = false;
  const fruitImg = f => IMG('fruits/' + f, 'fruit');
  function ask() {
    G.newQ(); busy = false;
    const q = qs[i], [fr, an, efr, ean] = PAIRS[i % PAIRS.length];
    G.setQuestion(`${q.a} ${efr} ÷ ${q.b} ${ean} = ?`);
    const peu = q.a <= 24;
    basket.className = 'basket' + (q.a <= 12 ? ' few' : '');
    basket.innerHTML = peu ? Array.from({ length: q.a }, () => `<span>${fruitImg(fr)}</span>`).join('') : `<span class="lot">${fruitImg(fr)} × ${q.a}</span>`;
    table.innerHTML = '';
    const showEach = q.b <= 6;
    for (let k = 0; k < (showEach ? q.b : 1); k++) {
      const a = h('div', 'feed-animal', `<div class="em">${IMG('animaux/' + an, 'animal')}</div><div class="plate"></div>`);
      if (!showEach) a.querySelector('.em').insertAdjacentHTML('beforeend', `<span class="fois">× ${q.b}</span>`);
      table.append(a);
    }
    ans.innerHTML = '';
    choices(q.ans, G.age === 0 ? 3 : 4, sk).forEach(v => {
      const b = h('button', 'ans', fmt(v)); b.dataset.v = v; b.onclick = () => choose(b, v, q, fr, showEach && peu); ans.append(b);
    });
  }
  function choose(b, v, q, fr, anim) {
    if (busy) return;
    const p = centerOf(b, A);
    if (egal(v, q.ans)) {
      busy = true; b.classList.add('good'); G.correct(p.ax, p.ay);
      const plates = [...table.querySelectorAll('.plate')], fruits = [...basket.querySelectorAll('span')];
      if (anim && fruits.length === q.a) {
        fruits.forEach((f, k) => G.later(() => { f.style.visibility = 'hidden'; const s = h('span', null, fruitImg(fr)); plates[k % plates.length].append(s); if (k % 3 === 0) Sound.tap(); }, k * Math.min(120, 1400 / q.a)));
      } else {
        basket.style.opacity = .3; plates.forEach(pl => pl.innerHTML = `${fruitImg(fr)} × ${q.ans}`);
      }
      const wait = anim ? Math.min(1600, q.a * Math.min(120, 1400 / q.a)) + 700 : 1100;
      G.later(() => { basket.style.opacity = 1; G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, wait);
    } else {
      b.classList.add('bad', 'shake'); G.later(() => b.classList.remove('shake'), 400);
      if (G.wrong(p.ax, p.ay) >= 2) [...ans.children].find(x => egal(+x.dataset.v, q.ans)).classList.add('hint-glow');
    }
  }
  ask();
};

// ======================= 4. Glouton a faim : deux nombres qui font la cible =======================
GAME_FN.monster = G => {
  const A = G.area; decor(A, 'glouton', 'monster-bg');
  const cfg = G.glouton, n = NQ(G.age);
  const mw = h('div', 'monster-wrap'); const bubble = h('div', 'target-bubble'); const tiles = h('div', 'tiles');
  A.append(mw, bubble, tiles);
  const sym = cfg.mode === 'prod' ? '×' : '+';
  const ok = (x, y, T) => (cfg.mode === 'prod' ? egal(x * y, T) : egal(x + y, T));
  const ETATS = { '': 'glouton', open: 'glouton-faim', chew: 'glouton-mache', sad: 'glouton-triste' };
  let i = 0, T = 0, sel = [], busy = false;
  const setM = s => { mw.className = 'monster-wrap ' + s; mw.innerHTML = IMG('jeux/' + ETATS[s], 'monster'); };
  function makeRound() {
    let a, b;
    if (cfg.mode === 'prod') { a = pick(cfg.tables); b = rnd(2, cfg.tables.some(t => t > 10) ? 13 : 10); }
    else if (cfg.mode === 'cible') { const k = Math.round(cfg.T / cfg.pas); a = r3(rnd(1, k - 1) * cfg.pas); b = r3(cfg.T - a); }
    else if (cfg.hundreds) { a = rnd(1, 8) * 100 + rnd(0, 9) * 10; b = rnd(1, 9 - Math.floor(a / 100)) * 100 + rnd(0, 9) * 10; if (a + b > 1000) b = 1000 - a; }
    else if (cfg.tens) { a = rnd(10, 80); b = rnd(5, 100 - a); }
    else { a = rnd(cfg.max > 5 ? 1 : 0, cfg.max - 1); b = rnd(1, cfg.max - a); }
    T = cfg.mode === 'prod' ? a * b : cfg.mode === 'cible' ? cfg.T : a + b;
    const vals = [a, b];
    let guard = 0;
    while (vals.length < 6 && guard++ < 300) {
      let d;
      if (cfg.mode === 'prod') d = rnd(2, 13);
      else if (cfg.mode === 'cible') d = r3(rnd(1, Math.round(cfg.T / cfg.pas) - 1) * cfg.pas);
      else if (cfg.hundreds) d = rnd(1, 9) * 100 + rnd(0, 9) * 10;
      else d = rnd(0, Math.max(cfg.max, 9));
      if (!vals.some(v => egal(v, d))) vals.push(d);
    }
    return shuffle(vals);
  }
  function ask() {
    G.newQ(); busy = false; sel = []; setM('');
    const vals = makeRound();
    bubble.textContent = `? ${sym} ? = ${fmt(T)}`; G.setQuestion('');
    tiles.innerHTML = '';
    vals.forEach(v => { const b = h('button', 'tile', fmt(v)); b.dataset.v = v; b.onclick = () => tap(b); tiles.append(b); });
  }
  function tap(b) {
    if (busy) return;
    Sound.tap();
    if (b.classList.contains('sel')) { b.classList.remove('sel'); sel = sel.filter(x => x !== b); setM(sel.length ? 'open' : ''); return; }
    b.classList.add('sel'); sel.push(b); setM('open');
    if (sel.length < 2) return;
    busy = true;
    const [x, y] = sel.map(s => +s.dataset.v), p = centerOf(b, A);
    bubble.textContent = `${fmt(x)} ${sym} ${fmt(y)} = ${fmt(T)}`;
    if (ok(x, y, T)) {
      const m = centerOf(mw, A);
      sel.forEach(s => { s.style.transition = 'transform .45s ease-in'; const c = centerOf(s, A); s.style.transform = `translate(${m.x - c.x}px, ${m.y - c.y}px) scale(.2)`; });
      G.correct(p.ax, p.ay);
      G.later(() => { sel.forEach(s => s.classList.add('used')); setM('chew'); Sound.chomp(); }, 450);
      G.later(() => { G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, 1400);
    } else {
      bubble.textContent = `${fmt(x)} ${sym} ${fmt(y)} ≠ ${fmt(T)}`;
      setM('sad'); const e = G.wrong(p.ax, p.ay);
      G.later(() => {
        sel.forEach(s => s.classList.remove('sel')); sel = []; setM(''); busy = false; bubble.textContent = `? ${sym} ? = ${fmt(T)}`;
        if (e >= 2) { const tl = [...tiles.children]; outer: for (const p1 of tl) for (const p2 of tl) if (p1 !== p2 && ok(+p1.dataset.v, +p2.dataset.v, T)) { p1.classList.add('hint-glow'); p2.classList.add('hint-glow'); break outer; } }
      }, 900);
    }
  }
  ask();
};

// ======================= 5. Relie les étoiles =======================
GAME_FN.link = G => {
  const A = G.area; decor(A, 'nuit', 'night');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'link-svg');
  const cols = h('div', 'link-cols'), L = h('div', 'link-col'), R = h('div', 'link-col');
  cols.append(L, R); A.append(svg, cols);
  const per = G.age === 2 ? 5 : 4, rounds = 2, sk = G.sk;
  let round = 0, matched = 0, selL = null, selR = null;
  G.setQuestion('');
  function build() {
    G.newQ(); svg.innerHTML = ''; L.innerHTML = ''; R.innerHTML = ''; selL = selR = null;
    const qs = genSet(sk, per, true);
    shuffle(qs).forEach(q => { const b = h('button', 'node', q.text); b.dataset.a = q.ans; b.onclick = () => tap(b, 'L'); L.append(b); });
    shuffle(qs).forEach(q => { const b = h('button', 'node res', fmt(q.ans)); b.dataset.a = q.ans; b.onclick = () => tap(b, 'R'); R.append(b); });
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

// ======================= 6. Le grand tri : deux paniers =======================
// Catégorie d'une question : règle sur la réponse (nombres) ou catégorie donnée par la question (mots)
const catQ = (rule, q) => (rule.type === 'cat' ? q.cat : catTri(rule, q.ans));
const catTri = (rule, v) => (rule.type === 'lt' ? (v < rule.n ? 0 : 1) : rule.type === 'mult' ? (Math.round(v) % rule.k === 0 ? 0 : 1) : (Math.round(v) % 2 === 0 ? 0 : 1));
GAME_FN.sort = G => {
  const A = G.area; decor(A, 'tri', 'sort-bg');
  const rule = G.tri, sk = G.sk, n = NQ(G.age);
  const crate = h('div', 'crate', `${IMG('jeux/caisse')}<span></span>`), bins = h('div', 'bins');
  A.append(crate, bins);
  const cat = q => catQ(rule, q);
  const labels = rule.type === 'cat' ? rule.labels.map(tx) : rule.type === 'lt' ? [`< ${fmt(rule.n)}`, `≥ ${fmt(rule.n)}`] : rule.type === 'mult' ? [`${t('multOf')} ${rule.k}`, `${t('notMultOf')} ${rule.k}`] : [t('even'), t('odd')];
  const binEls = labels.map((lb, k) => { const b = h('button', 'bin', `${IMG(k ? 'jeux/panier-rouge' : 'jeux/panier-bleu')}<span class="lb">${lb}</span><span class="cnt"></span>`); b.onclick = () => drop(k, b); bins.append(b); return b; });
  // Série équilibrée entre les deux paniers
  const pool = genSet(sk, 80), want = shuffle(Array.from({ length: n }, (_, k) => k % 2));
  const qs = []; const used = new Set();
  want.forEach(c => { const q = pool.find(x => cat(x) === c && !used.has(x.text)) || pool.find(x => !used.has(x.text)); used.add(q.text); qs.push(q); });
  let i = 0, busy = false; const counts = [0, 0];
  const txt = crate.querySelector('span');
  G.setQuestion('');
  function ask() {
    G.newQ(); busy = false;
    crate.style.transition = 'none'; crate.style.left = '50%'; crate.style.top = ''; crate.style.transform = 'translateX(-50%)'; crate.style.opacity = 1;
    txt.textContent = qs[i].text; crate.classList.remove('enter'); void crate.offsetWidth; crate.classList.add('enter');
    G.later(() => { crate.style.transition = ''; }, 50);
  }
  function drop(k, b) {
    if (busy) return;
    const q = qs[i], p = centerOf(b, A);
    if (cat(q) === k) {
      busy = true;
      const c = centerOf(crate, A);
      crate.style.transform = `translate(calc(-50% + ${p.x - c.x}px), ${p.y - c.y}px) scale(.35)`; crate.style.opacity = .2;
      G.correct(p.ax, p.ay); if (rule.type !== 'cat' && q.text !== fmt(q.ans)) floatText(p.ax, p.ay - 60, `${q.text} = ${fmt(q.ans)}`);
      counts[k]++; b.querySelector('.cnt').textContent = counts[k];
      G.later(() => { G.progress((i + 1) / n); i++; if (i >= n) G.done(); else ask(); }, 900);
    } else {
      crate.classList.add('shake'); G.later(() => crate.classList.remove('shake'), 400);
      if (G.wrong(p.ax, p.ay) >= 2) { binEls[cat(q)].classList.add('hint-glow'); G.later(() => binEls.forEach(x => x.classList.remove('hint-glow')), 2500); if (rule.type !== 'cat' && q.text !== fmt(q.ans)) txt.textContent = `${q.text} = ${fmt(q.ans)}`; }
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
  const page = COLOR_PAGES[G.lvl], sk = G.sk;
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
    const b = h('button', 'pal', fmt(qs[k].ans)); b.dataset.v = qs[k].ans; b.style.background = c;
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
          const p = Store.profile(); p.coloriages = p.coloriages || {}; p.coloriages[page.id] = true; Store.save();
          G.later(() => G.done(), 900);
        }
      } else {
        zEl.classList.remove('wrong'); void zEl.getBBox(); zEl.classList.add('wrong');
        if (G.wrong(ev.clientX, ev.clientY) >= 2) { const b = palBtns.find(x => egal(+x.dataset.v, qs[z.c].ans)); b.classList.add('hint-glow'); G.later(() => b.classList.remove('hint-glow'), 2500); }
      }
    });
  });
};
