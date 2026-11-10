// Cécilia & Manoach — jeux du village (même API G que games.js).
// oiseaux (chasseur d'images), flair (Max le chien), route (construire la route), scene (marché, atelier, cuisine, champ),
// robot (programmer le robot de l'oncle Caleb), afrique (carte de l'Afrique), dames (jeu de dames pour enfants).
const VIMG = (src, cls = '') => IMG('village/' + src, cls);

// Boucle de questions commune : n questions de G.sk, propositions avec choixDe ; ok(q) après une bonne réponse.
function serie(G, { n, nbChoix, rendre, ok, pause = 1100 }) {
  const sk = G.sk, qs = genSet(sk, n || NQ(G.age));
  let i = 0, busy = false;
  function ask() {
    G.newQ(); busy = false;
    const q = qs[i]; G.setQuestion(qTxt(q));
    rendre(q, choixDe(q, nbChoix || [3, 4, 4][G.age], sk), (el, v) => choisir(el, v, q));
  }
  function choisir(el, v, q) {
    if (busy) return;
    const p = centerOf(el, G.area);
    if (same(v, q.ans)) {
      busy = true; el.classList.add('good'); G.correct(p.ax, p.ay);
      ok(q, el, i);
      G.later(() => { i++; G.progress(i / qs.length); if (i >= qs.length) G.done(); else ask(); }, pause);
    } else {
      el.classList.add('bad', 'shake'); G.later(() => el.classList.remove('shake', 'bad'), 500);
      if (G.wrong(p.ax, p.ay) >= 2) { const b = [...G.area.querySelectorAll('[data-v]')].find(x => same(x.dataset.v, q.ans)); if (b) b.classList.add('hint-glow'); }
    }
  }
  ask();
}

// ======================= Le chasseur d'images : photographier l'oiseau qui porte la bonne réponse =======================
GAME_FN.oiseaux = G => {
  const A = G.area; decor(A, 'arbre', 'oiseaux-bg');
  const PERCHOIRS = [[14, 30], [33, 22], [52, 34], [70, 24], [86, 36]];
  const COULEURS = ['jaune', 'rouge', 'bleu', 'vert', 'orange'];
  const album = h('div', 'album', `${VIMG('appareil')}<b>0</b>`); A.append(album);
  let photos = 0, oiseaux = [];
  serie(G, {
    nbChoix: [3, 4, 5][G.age],
    rendre(q, opts, choisir) {
      oiseaux.forEach(o => o.remove()); oiseaux = [];
      const places = shuffle(PERCHOIRS).slice(0, opts.length);
      opts.forEach((v, k) => {
        const o = h('button', 'oiseau' + motCls(v), `${VIMG('oiseau-' + COULEURS[k % 5])}<span class="num">${fmt(v)}</span>`);
        o.dataset.v = v; o.style.left = places[k][0] + '%'; o.style.top = places[k][1] + '%'; o.style.animationDelay = (k * .3) + 's';
        o.onclick = () => choisir(o, v); A.append(o); oiseaux.push(o);
      });
    },
    ok(q, el) {
      const f = h('div', 'flash'); A.append(f); G.later(() => f.remove(), 500); Sound.tap();
      G.later(() => { el.classList.add('envol'); photos++; album.querySelector('b').textContent = photos; }, 350);
    },
  });
};

// ======================= Max et son flair : trouver l'os sous le bon monticule =======================
GAME_FN.flair = G => {
  const A = G.area; decor(A, 'jardin', 'flair-bg');
  const max = h('div', 'max', VIMG('max-flaire')); A.append(max);
  const panier = h('div', 'os-compteur', `${VIMG('os')}<b>0</b>`); A.append(panier);
  let os = 0, buttes = [];
  serie(G, {
    pause: 1500,
    rendre(q, opts, choisir) {
      buttes.forEach(b => b.remove()); buttes = [];
      max.innerHTML = VIMG('max-flaire'); max.style.left = '2%'; max.classList.add('renifle');
      opts.forEach((v, k) => {
        const b = h('button', 'butte' + motCls(v), `${VIMG('monticule')}<span class="num">${fmt(v)}</span>`);
        b.dataset.v = v; b.style.left = (22 + k * (72 / opts.length)) + '%';
        b.onclick = () => choisir(b, v); A.append(b); buttes.push(b);
      });
    },
    ok(q, el) {
      max.classList.remove('renifle'); max.style.left = `calc(${el.style.left} - 4%)`;
      G.later(() => { max.innerHTML = VIMG('max-creuse'); Sound.chomp(); }, 500);
      G.later(() => { max.innerHTML = VIMG('max-os'); os++; panier.querySelector('b').textContent = os; }, 1100);
    },
  });
};

// ======================= Construire la route : chaque bonne réponse pose un tronçon =======================
GAME_FN.route = G => {
  const A = G.area; decor(A, 'route', 'route-bg');
  const n = NQ(G.age), route = h('div', 'route'), camion = h('div', 'camion', VIMG('camion')), panneaux = h('div', 'panneaux');
  for (let k = 0; k < n; k++) route.append(h('div', 'troncon'));
  A.append(route, camion, panneaux);
  serie(G, {
    n,
    rendre(q, opts, choisir) {
      panneaux.innerHTML = '';
      opts.forEach(v => { const b = h('button', 'panneau' + motCls(v), `${VIMG('panneau')}<span class="num">${fmt(v)}</span>`); b.dataset.v = v; b.onclick = () => choisir(b, v); panneaux.append(b); });
    },
    ok(q, el, i) {
      route.children[i].classList.add('fait'); Sound.whoosh();
      camion.style.left = `calc(${(i + 1) / n * 86}% )`;
    },
  });
};

// ======================= Scènes avec un personnage : marché, atelier, cuisine, champ =======================
// G.theme : { decor, hote (image), bouton (image des réponses), recompense (images qui s'ajoutent) }
GAME_FN.scene = G => {
  const A = G.area, T = G.theme; decor(A, T.decor, 'scene-bg scene-' + T.id);
  const hote = h('div', 'hote', VIMG(T.hote)); A.append(hote);
  const bulle = h('div', 'hote-bulle'); A.append(bulle);
  const recolte = h('div', 'recolte'); A.append(recolte);
  const reps = h('div', 'reponses'); A.append(reps);
  serie(G, {
    rendre(q, opts, choisir) {
      G.setQuestion(''); bulle.textContent = qTxt(q); bulle.classList.remove('pop'); void bulle.offsetWidth; bulle.classList.add('pop');
      Q_REPONSES.set(bulle.textContent, q.ans);
      reps.innerHTML = '';
      opts.forEach(v => { const b = h('button', 'rep' + motCls(v), `${VIMG(T.bouton)}<span class="num">${fmt(v)}</span>`); b.dataset.v = v; b.onclick = () => choisir(b, v); reps.append(b); });
    },
    ok(q, el, i) {
      const r = h('span', 'gain', VIMG(T.recompense[i % T.recompense.length])); recolte.append(r);
      hote.classList.remove('saute'); void hote.offsetWidth; hote.classList.add('saute');
    },
  });
};

// ======================= Programmer le robot de l'oncle Caleb =======================
GAME_FN.robot = G => {
  const A = G.area; decor(A, 'bureau', 'robot-bg');
  A.append(h('div', 'hote caleb', VIMG('caleb')));
  const grille = h('div', 'grille'), progs = h('div', 'programmes'); A.append(grille, progs);
  const D = { '→': [1, 0], '←': [-1, 0], '↓': [0, 1], '↑': [0, -1] };
  const deplier = s => s.split(' ').flatMap(m => { const k = parseInt(m, 10); const f = m.replace(/^\d+/, ''); return Array(k || 1).fill(f); });
  serie(G, {
    n: [5, 6, 7][G.age], pause: 1800,
    rendre(q, opts, choisir) {
      const { N, r, e, obst } = q.grille; grille.innerHTML = ''; grille.style.setProperty('--n', N); A.dataset.cle = q.text;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const c = h('div', 'case'); const k = x + ',' + y;
        if (obst.includes(k)) c.classList.add('mur');
        if (x === e[0] && y === e[1]) c.innerHTML = '<span class="etoile-but">⭐</span>';
        grille.append(c);
      }
      const rb = h('div', 'robot', VIMG('robot')); rb.style.setProperty('--x', r[0]); rb.style.setProperty('--y', r[1]); grille.append(rb);
      progs.innerHTML = '';
      opts.forEach(v => { const b = h('button', 'prog', v); b.dataset.v = v; b.onclick = () => choisir(b, v); progs.append(b); });
    },
    ok(q) {
      const rb = grille.querySelector('.robot'); let [x, y] = q.grille.r;
      deplier(q.ans).forEach((m, k) => G.later(() => { x += D[m][0]; y += D[m][1]; rb.style.setProperty('--x', x); rb.style.setProperty('--y', y); Sound.tap(); }, 150 + k * 180));
    },
  });
};

// ======================= La carte de l'Afrique =======================
GAME_FN.afrique = G => {
  const A = G.area; decor(A, 'nuit', 'afrique-bg');
  let svg = `<svg class="carte-afrique" viewBox="${AFRIQUE.viewBox}" xmlns="http://www.w3.org/2000/svg">`;
  AFRIQUE.pays.forEach(p => { svg += `<path data-id="${p.id}" d="${p.d}"/>`; });
  const carte = h('div', 'carte', svg + '</svg>'); A.append(carte);
  const reps = h('div', 'reponses-carte'); A.append(reps);
  const n = NQ(G.age), sk = G.sk, qs = genSet(sk, n);
  let i = 0, busy = false;
  const chemins = [...carte.querySelectorAll('path')];
  function ask() {
    G.newQ(); busy = false; const q = qs[i]; reps.innerHTML = '';
    chemins.forEach(c => c.classList.remove('cible', 'bon', 'faux', 'hint-glow'));
    G.setQuestion(qTxt(q)); A.dataset.cle = q.text;
    if (q.carte.mode === 'toucher') { reps.style.display = 'none'; return; }
    reps.style.display = '';
    carte.querySelector(`[data-id="${q.carte.cible}"]`).classList.add('cible');
    choixDe(q, [3, 4, 4][G.age], sk).forEach(v => { const b = h('button', 'rep-carte', esc(v)); b.dataset.v = v; b.onclick = () => repondre(b, v, q); reps.append(b); });
  }
  function bon(el, q) { busy = true; const p = centerOf(el, A); G.correct(p.ax, p.ay); carte.querySelector(`[data-id="${q.carte.cible}"]`).classList.add('bon'); G.later(() => { i++; G.progress(i / n); if (i >= n) G.done(); else ask(); }, 1100); }
  function faux(el) { const p = centerOf(el, A); return G.wrong(p.ax, p.ay); }
  function repondre(b, v, q) { if (busy) return; if (same(v, q.ans)) { b.classList.add('good'); bon(b, q); } else { b.classList.add('bad'); if (faux(b) >= 2) [...reps.children].find(x => same(x.dataset.v, q.ans)).classList.add('hint-glow'); } }
  carte.addEventListener('click', ev => {
    const c = ev.target.closest('path'); const q = qs[i];
    if (!c || busy || q.carte.mode !== 'toucher') return;
    if (c.dataset.id === q.ans) bon(c, q);
    else { c.classList.add('faux'); G.later(() => c.classList.remove('faux'), 600); if (faux(c) >= 2) carte.querySelector(`[data-id="${q.ans}"]`).classList.add('hint-glow'); }
  });
  ask();
};

// ======================= Jeu de dames pour enfants (6 × 6) =======================
// Règles simplifiées : les pions avancent en diagonale ; on prend en sautant par-dessus un pion adverse ;
// un pion qui atteint le dernier rang devient une dame (elle va dans les deux sens). Prise non obligatoire, une seule prise par coup.
// Avant chaque coup, l'enfant répond à une question : bonne réponse = il joue, sinon il réessaie.
GAME_FN.dames = G => {
  const A = G.area; decor(A, 'jardin', 'dames-bg');
  const N = 6, plateau = h('div', 'damier'), info = h('div', 'dames-info'), reps = h('div', 'reponses-dames');
  A.append(plateau, info, reps);
  const B = Array.from({ length: N }, () => Array(N).fill(null));
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if ((x + y) % 2 === 1) { if (y < 2) B[y][x] = { c: 'n', d: false }; if (y > 3) B[y][x] = { c: 'b', d: false }; }
  const n = NQ(G.age), sk = G.sk, qs = genSet(sk, n + 6);
  let qi = 0, coups = 0, pris = 0, perdus = 0, peutJouer = false, sel = null, busy = false;
  const dirs = p => (p.d ? [-1, 1] : [p.c === 'b' ? -1 : 1]);
  function coupsDe(c) {
    const out = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const p = B[y][x]; if (!p || p.c !== c) continue;
      for (const dy of dirs(p)) for (const dx of [-1, 1]) {
        const x1 = x + dx, y1 = y + dy, x2 = x + 2 * dx, y2 = y + 2 * dy;
        if (x1 < 0 || y1 < 0 || x1 >= N || y1 >= N) continue;
        if (!B[y1][x1]) out.push({ x, y, tx: x1, ty: y1 });
        else if (B[y1][x1].c !== c && x2 >= 0 && y2 >= 0 && x2 < N && y2 < N && !B[y2][x2]) out.push({ x, y, tx: x2, ty: y2, prise: [x1, y1] });
      }
    }
    return out;
  }
  function jouer(m) {
    const p = B[m.y][m.x]; B[m.y][m.x] = null; B[m.ty][m.tx] = p;
    if (m.prise) { B[m.prise[1]][m.prise[0]] = null; if (p.c === 'b') pris++; else perdus++; Sound.chomp(); } else Sound.tap();
    if ((p.c === 'b' && m.ty === 0) || (p.c === 'n' && m.ty === N - 1)) p.d = true;
  }
  function dessiner() {
    plateau.innerHTML = '';
    const mes = peutJouer ? coupsDe('b') : [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = h('div', 'cd ' + ((x + y) % 2 ? 'sombre' : 'clair')); c.dataset.x = x; c.dataset.y = y;
      const p = B[y][x];
      if (p) { const pion = h('div', `pion ${p.c}${p.d ? ' dame' : ''}`); if (mes.some(m => m.x === x && m.y === y)) pion.classList.add('peut'); if (sel && sel.x === x && sel.y === y) pion.classList.add('sel'); c.append(pion); }
      if (sel && mes.some(m => m.x === sel.x && m.y === sel.y && m.tx === x && m.ty === y)) c.classList.add('cible');
      c.onclick = () => clic(x, y);
      plateau.append(c);
    }
    info.innerHTML = `⚪ ${pris} · ⚫ ${perdus}`;
  }
  function clic(x, y) {
    if (!peutJouer || busy) return;
    const mes = coupsDe('b');
    if (B[y][x] && B[y][x].c === 'b' && mes.some(m => m.x === x && m.y === y)) { sel = { x, y }; dessiner(); return; }
    const m = sel && mes.find(m => m.x === sel.x && m.y === sel.y && m.tx === x && m.ty === y);
    if (!m) return;
    jouer(m); sel = null; peutJouer = false; coups++; G.progress(Math.min(1, coups / n)); dessiner();
    busy = true; G.later(ordi, 700);
  }
  function ordi() {
    busy = false;
    if (fini()) return;
    const ms = coupsDe('n'); if (ms.length) { const pr = ms.filter(m => m.prise); jouer(pick(pr.length ? pr : ms)); }
    dessiner(); if (!fini()) question();
  }
  function fini() {
    const nb = c => B.flat().filter(p => p && p.c === c).length;
    if (coups >= n || !nb('n') || !coupsDe('n').length || !nb('b') || !coupsDe('b').length) { G.later(() => G.done({ race: pris >= perdus }), 600); return true; }
    return false;
  }
  function question() {
    G.newQ(); const q = qs[qi++ % qs.length]; G.setQuestion(qTxt(q)); reps.innerHTML = '';
    choixDe(q, 3, sk).forEach(v => {
      const b = h('button', 'rep-dames' + motCls(v), fmt(v)); b.dataset.v = v;
      b.onclick = () => {
        if (peutJouer) return; const p = centerOf(b, A);
        if (same(v, q.ans)) { G.correct(p.ax, p.ay); reps.innerHTML = ''; G.setQuestion(t('yourMove')); peutJouer = true; dessiner(); }
        else { b.classList.add('bad', 'shake'); if (G.wrong(p.ax, p.ay) >= 2) [...reps.children].find(x => same(x.dataset.v, q.ans)).classList.add('hint-glow'); }
      };
      reps.append(b);
    });
  }
  dessiner(); question();
};
