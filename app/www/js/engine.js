// Cécilia & Manoach — moteur pédagogique : générateurs de questions (programme CE2 / CM1 / génie), sauvegarde
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Niveaux scolaires (programme.js). Le champ profil.age garde l'indice 0 = CE2, 1 = CM1, 2 = génie.
const AGES = NIVEAUX.map((n, i) => ({ id: i, range: n.classe, key: 'niv' + i, color: n.color, icon: n.icon }));

// Compétence par âge (ligne) et niveau (colonne)
const SKILLS = [
  [ { ops: ['+'], max: 5, min: 1 }, { ops: ['+'], max: 10, min: 1 }, { ops: ['-'], max: 10 } ],
  [ { ops: ['+', '-'], max: 20 }, { ops: ['+', '-'], max: 100, tens: true }, { ops: ['×'], tables: [2, 3, 4, 5, 10] } ],
  [ { ops: ['×'], tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, { ops: ['÷'], tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, { ops: ['+', '-', '×', '÷'], big: true } ],
];
// Coloriage : calculs courts pour tenir dans les zones du dessin
const COLOR_SKILLS = [
  SKILLS[0],
  [ { ops: ['+'], max: 20 }, { ops: ['-'], max: 20 }, { ops: ['×'], tables: [2, 3, 4, 5, 10] } ],
  [ { ops: ['×'], tables: [2, 3, 4, 5, 6, 7, 8, 9] }, { ops: ['÷'], tables: [2, 3, 4, 5, 6, 7, 8, 9] }, { ops: ['×', '÷'], tables: [6, 7, 8, 9] } ],
];
// Le goûter (partage / division) a sa propre progression
const SHARE_SKILLS = [
  [ { ops: ['÷'], tables: [2], qmax: 3 }, { ops: ['÷'], tables: [2, 3], qmax: 3 }, { ops: ['÷'], tables: [2, 3, 4], qmax: 3 } ],
  [ { ops: ['÷'], tables: [2, 5, 10], qmax: 5 }, { ops: ['÷'], tables: [3, 4], qmax: 10 }, { ops: ['÷'], tables: [2, 3, 4, 5, 6], qmax: 10 } ],
  [ { ops: ['÷'], tables: [6, 7, 8, 9], qmax: 10 }, { ops: ['÷'], tables: [2, 3, 4, 5, 6, 7, 8, 9, 10], qmax: 10 }, { ops: ['÷'], tables: [3, 4, 5, 6, 7, 8, 9, 11, 12], qmax: 12 } ],
];
// Glouton : 'sum' = deux nombres dont la somme fait la cible ; 'prod' = le produit
const MONSTER_MODES = [
  [ { mode: 'sum', max: 5 }, { mode: 'sum', max: 10 }, { mode: 'sum', max: 10, three: false } ],
  [ { mode: 'sum', max: 20 }, { mode: 'sum', max: 100, tens: true }, { mode: 'prod', tables: [2, 3, 4, 5, 10] } ],
  [ { mode: 'prod', tables: [2, 3, 4, 5, 6, 7, 8, 9] }, { mode: 'prod', tables: [6, 7, 8, 9, 10] }, { mode: 'sum', max: 1000, hundreds: true } ],
];
// Le grand tri : règle de classement
const SORT_RULES = [
  [ { type: 'lt', n: 3 }, { type: 'lt', n: 5 }, { type: 'lt', n: 5 } ],
  [ { type: 'lt', n: 10 }, { type: 'parity' }, { type: 'parity' } ],
  [ { type: 'lt', n: 50 }, { type: 'parity' }, { type: 'lt', n: 100 } ],
];

// Toutes les réponses générées sont mémorisées (texte → réponse) : sert aux robots de test.
const Q_REPONSES = new Map(), Q_OBJ = new Map();
function retenir(q) { if (Q_REPONSES.size > 3000) { Q_REPONSES.clear(); Q_OBJ.clear(); } Q_REPONSES.set(q.text, q.ans); Q_OBJ.set(q.text, q); if (q.q) Q_REPONSES.set(q.q, q.ans); return q; }
function genQ(sk) {
  if (sk.notion) return retenir(GEN[sk.notion](sk));
  return retenir(genCalc(sk));
}
function genCalc(sk) {
  const op = pick(sk.ops);
  let a, b, ans;
  if (sk.big) {
    if (op === '+') { a = rnd(100, 600); b = rnd(20, 999 - a); ans = a + b; }
    else if (op === '-') { a = rnd(200, 999); b = rnd(20, a - 50); ans = a - b; }
    else if (op === '×') { a = rnd(12, 25); b = rnd(2, 9); ans = a * b; }
    else { b = rnd(3, 12); ans = rnd(4, 12); a = b * ans; }
    return { a, b, op, ans, text: `${a} ${op} ${b}` };
  }
  if (op === '+') {
    const mn = sk.min || 0;
    if (sk.tens) { a = rnd(11, 79); b = rnd(5, 100 - a); }
    else { a = rnd(mn, sk.max - mn); b = rnd(mn, sk.max - a); }
    ans = a + b;
  } else if (op === '-') {
    if (sk.tens) { a = rnd(25, 99); b = rnd(5, a - 5); }
    else { a = rnd(1, sk.max); b = rnd(0, a); }
    ans = a - b;
  } else if (op === '×') {
    const tb = pick(sk.tables), k = rnd(sk.kmin || 1, sk.kmax || 10);
    if (Math.random() < .5) { a = tb; b = k; } else { a = k; b = tb; }
    ans = a * b;
  } else {
    b = pick(sk.tables); ans = rnd(1, sk.qmax || 10); a = b * ans;
  }
  return { a, b, op, ans, text: `${a} ${op} ${b}` };
}
// Série de questions sans doublon immédiat
function genSet(sk, n, distinctAns) {
  const out = [], seen = new Set(), ans = new Set();
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const q = genQ(sk);
    if (seen.has(q.text)) continue;
    if (distinctAns && ans.has(q.ans)) continue;
    seen.add(q.text); ans.add(q.ans); out.push(q);
  }
  while (out.length < n) out.push(genQ(sk));
  return out;
}
// Mauvaises réponses plausibles
function distractors(ans, n, sk) {
  if (!Number.isInteger(ans)) return distractorsDec(ans, n);
  if (ans >= 1000) return distractorsGrands(ans, n);
  const s = new Set([ans]), out = [];
  const big = ans >= 20, cands = ans < 10 ? [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3] : [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 3];
  if (big) { const r = String(ans).split('').reverse().join(''); cands.push(+r); }
  let guard = 0;
  for (const c of shuffle(cands)) { if (out.length >= n) break; if (c >= 0 && !s.has(c) && (!big || c !== ans) && Number.isFinite(c)) { s.add(c); out.push(c); } }
  while (out.length < n && guard++ < 100) { const c = Math.max(0, ans + rnd(-5, 6)); if (!s.has(c)) { s.add(c); out.push(c); } }
  return out;
}
function distractorsDec(ans, n) {
  const d = Math.min(3, (String(ans).split('.')[1] || '').length), u = Math.pow(10, -d);
  const cands = shuffle([ans + u, ans - u, ans + 10 * u, ans - 10 * u, ans + 1, ans - 1, ans * 10, ans / 10, ans + 2 * u]).map(r3);
  const s = new Set([ans]), out = [];
  for (const c of cands) { if (out.length >= n) break; if (c > 0 && !s.has(c)) { s.add(c); out.push(c); } }
  while (out.length < n) { const c = r3(ans + rnd(1, 9) * u * (Math.random() < .5 ? -1 : 1)); if (c > 0 && !s.has(c)) { s.add(c); out.push(c); } }
  return out;
}
function distractorsGrands(ans, n) {
  const cands = shuffle([ans + 1, ans - 1, ans + 10, ans - 10, ans + 100, ans - 100, ans + 1000, ans - 1000, ans * 10, Math.round(ans / 10)]);
  const s = new Set([ans]), out = [];
  for (const c of cands) { if (out.length >= n) break; if (c > 0 && !s.has(c)) { s.add(c); out.push(c); } }
  while (out.length < n) { const c = ans + rnd(-50, 50); if (c > 0 && !s.has(c)) { s.add(c); out.push(c); } }
  return out;
}
function choices(ans, n = 3, sk) { return shuffle([ans, ...distractors(ans, n - 1, sk)]); }
// Autre calcul donnant le même résultat (pour le coloriage)
function exprFor(v, sk, avoid) {
  for (let i = 0; i < 400; i++) { const q = genQ(sk); if (q.ans === v && q.text !== avoid) return q; }
  return null;
}

// ---------- Générateurs du programme (une fonction par notion de programme.js) ----------
// Chaque générateur renvoie { text (court : relier, trier), q (question affichée), ans (nombre) }.
const r3 = x => Math.round(x * 1000) / 1000;
const fmt = v => { if (typeof v !== 'number') return String(v); const [e, d] = String(r3(Math.abs(v))).split('.'); return (v < 0 ? '−' : '') + e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? ',' + d : ''); };
const Q = (text, ans, q) => ({ text, ans: r3(ans), q: q || (text.includes('?') ? text : text + ' = ?') });
const rp = r => rnd(r[0], r[1]);
const GEN = {
  numeration(p) {
    const n = rnd(Math.ceil(p.max / 10), p.max), ch = String(n).split('').reverse();
    if (Math.random() < .3) { // « 42 centaines »
      const u = pick(p.max > 99999 ? [10, 100, 1000] : [10, 100]), k = rnd(12, p.max > 99999 ? 999 : 99), nom = { 10: 'dizaines', 100: 'centaines', 1000: 'milliers' }[u];
      return Q(`${k} ${nom}`, k * u);
    }
    const parts = ch.map((c, i) => +c * Math.pow(10, i)).filter(x => x).reverse();
    const ordre = p.max > 999999 ? shuffle(parts) : parts; // génie : termes dans le désordre
    return Q(ordre.map(fmt).join(' + '), parts.reduce((a, b) => a + b, 0));
  },
  comparer(p) { const v = p.dec ? r3(p.min + Math.random() * (p.max - p.min)) : rnd(p.min, p.max); const w = p.dec ? Math.round(v * 100) / 100 : v; return Q(fmt(w), w, `${fmt(w)}`); },
  add(p) { const a = rp(p.a), b = rp(p.b); return Q(`${fmt(a)} + ${fmt(b)}`, a + b); },
  sous(p) { const a = rp(p.a), b = Math.min(a - 1, rp(p.b)); return Q(`${fmt(a)} − ${fmt(b)}`, a - b); },
  complements(p) { const n = Math.round(p.T / p.pas), a = r3(rnd(1, n - 1) * p.pas); return Q(`${fmt(a)} + ? = ${fmt(p.T)}`, p.T - a, `${fmt(a)} + ? = ${fmt(p.T)}`); },
  doubles(p) {
    if (p.dec) { const n = pick([rnd(3, 99) / 10, rnd(11, 99), rnd(101, 999) / 100]); return Math.random() < .5 ? Q(`double de ${fmt(n)}`, n * 2) : Q(`moitié de ${fmt(n)}`, n / 2); }
    if (Math.random() < .5) { const n = rnd(6, p.max / 2); return Q(`double de ${fmt(n)}`, 2 * n); }
    const n = rnd(3, p.max / 2) * 2; return Q(`moitié de ${fmt(n)}`, n / 2);
  },
  x10(p) {
    if (Math.random() < .5) { const f = pick(p.fois), n = p.dec ? rnd(11, 999) / 100 : rnd(3, 99); return Q(`${fmt(n)} × ${fmt(f)}`, n * f); }
    const d = pick(p.div), n = p.dec ? rnd(3, 999) : rnd(2, 99) * d; return Q(`${fmt(n)} ÷ ${fmt(d)}`, n / d);
  },
  tables(p) { return genCalc(p); },
  divtables(p) { return genCalc(p); },
  partage(p) { return genCalc(p); },
  multpose(p) { const a = rp(p.a), b = rp(p.b); return Q(`${fmt(a)} × ${b}`, a * b); },
  divreste(p) { const b = rp(p.b); let a = rp(p.a); if (a % b === 0) a++; return Q(`${fmt(a)} ÷ ${b} : quotient`, Math.floor(a / b), `${fmt(a)} ÷ ${b} → quotient ?`); },
  multiples(p) { const v = rnd(p.min, p.max); return Q(fmt(v), v, fmt(v)); },
  fractions(p) {
    const d = pick(p.den), n = rnd(1, Math.min(p.numMax, d - 1)), k = rnd(2, p.kmax), q = d * k;
    const nom = n === 1 ? ({ 2: 'la moitié', 3: 'le tiers', 4: 'le quart' }[d] || `1/${d}`) : `${n}/${d}`;
    return Q(n === 1 && d <= 4 ? `${nom} de ${q}` : `${n}/${d} de ${q}`, n * k);
  },
  decimaux(p) {
    if (p.type === 'monnaie') { const e = rnd(1, 9), c = rnd(1, 19) * 5; return Math.random() < .5 ? Q(`${e} € ${c} c = ? c`, e * 100 + c, `${e} € ${c} c = ? centimes`) : Q(`${e} € + ${c} c`, e * 100 + c, `${e} € et ${c} c = ? centimes`); }
    const u = Math.pow(10, p.d), a = rnd(2, 9 * u) / u, b = rnd(1, 5 * u) / u;
    return Math.random() < .6 ? Q(`${fmt(a)} + ${fmt(b)}`, a + b) : Q(`${fmt(a + b)} − ${fmt(b)}`, a);
  },
  mesures(p) {
    const L = [
      [['m', 'cm', 100, 1, 9], ['km', 'm', 1000, 1, 9], ['kg', 'g', 1000, 1, 9], ['L', 'cL', 100, 1, 9], ['m', 'dm', 10, 2, 50]],
      [['km', 'm', 1000, 1, 20, 'mix'], ['kg', 'g', 1000, 1, 20, 'mix'], ['m', 'mm', 1000, 1, 9], ['L', 'mL', 1000, 1, 9], ['dm', 'cm', 10, 10, 99]],
      [['km', 'm', 1000, 'dec'], ['kg', 'g', 1000, 'dec'], ['L', 'cL', 100, 'dec'], ['m', 'cm', 100, 'dec'], ['t', 'kg', 1000, 'dec']],
    ][p.niveau];
    const [g, pt, f, a, b, mode] = pick(L);
    if (a === 'dec') { const v = rnd(11, 499) / 100; return Q(`${fmt(v)} ${g} = ? ${pt}`, v * f); }
    const v = rnd(a, b);
    if (mode === 'mix') { const r = rnd(1, f - 1); return Q(`${v} ${g} ${fmt(r)} ${pt} = ? ${pt}`, v * f + r); }
    return Q(`${v} ${g} = ? ${pt}`, v * f);
  },
  durees(p) {
    const T = [
      [() => { const h = rnd(1, 5); return Q(`${h} h = ? min`, h * 60); }, () => { const m = rnd(1, 9); return Q(`${m} min = ? s`, m * 60); }, () => { const h = rnd(1, 3), m = pick([15, 30, 45]); return Q(`${h} h ${m} min = ? min`, h * 60 + m); }],
      [() => { const h = rnd(1, 9), m = rnd(1, 11) * 5; return Q(`${h} h ${m} min = ? min`, h * 60 + m); }, () => { const m = rnd(2, 9), s = rnd(5, 55); return Q(`${m} min ${s} s = ? s`, m * 60 + s); }, () => { const j = rnd(1, 5); return Q(`${j} j = ? h`, j * 24); }],
      [() => { const h = rnd(1, 9); return Q(`${h} h = ? s`, h * 3600); }, () => { const j = rnd(2, 9), h = rnd(1, 23); return Q(`${j} j ${h} h = ? h`, j * 24 + h); }, () => { const s = rnd(2, 6); return Q(`${s} semaines = ? h`, s * 168); }, () => { const v = pick([1.5, 2.5, 0.25, 0.75, 3.5]); return Q(`${fmt(v)} h = ? min`, v * 60); }],
    ][p.niveau];
    return pick(T)();
  },
  perimetre(p) {
    const a = rp(p.cote), b = rp(p.cote);
    const t = pick(p.inverse ? ['pc', 'pr', 'ar', 'inv'] : p.aire ? ['pc', 'pr', 'ar'] : ['pc', 'pr']);
    if (t === 'pc') return Q(`carré ${a} cm : périmètre`, 4 * a, `Carré de ${a} cm de côté : périmètre ?`);
    if (t === 'pr') return Q(`rect. ${a} × ${b} : périmètre`, 2 * (a + b), `Rectangle ${a} cm × ${b} cm : périmètre ?`);
    if (t === 'ar') return Q(`rect. ${a} × ${b} : aire`, a * b, `Rectangle ${a} cm × ${b} cm : aire en cm² ?`);
    return Q(`carré P = ${4 * a} : côté`, a, `Carré de périmètre ${4 * a} cm : côté ?`);
  },
  suites(p) {
    const t = pick([...(p.double ? ['x2'] : []), ...(p.triple ? ['x3'] : []), ...(p.carres ? ['c'] : []), 'pas', 'pas']);
    let s;
    if (t === 'x2') { const a = rnd(2, 9); s = [a, a * 2, a * 4, a * 8, a * 16]; }
    else if (t === 'x3') { const a = rnd(1, 4); s = [a, a * 3, a * 9, a * 27, a * 81]; }
    else if (t === 'c') { const a = rnd(2, 8); s = [a, a + 1, a + 2, a + 3, a + 4].map(x => x * x); }
    else { const d = pick(p.pas) * (p.moins && Math.random() < .35 ? -1 : 1), a = r3(Math.abs(d) * rnd(4, 20) + rnd(0, 9) * (Number.isInteger(d) ? 1 : 0)); s = [0, 1, 2, 3, 4].map(i => r3(a + i * d)); }
    return Q(s.slice(0, 4).map(fmt).join(' · ') + ' · ?', s[4], s.slice(0, 4).map(fmt).join(', ') + ', … ?');
  },
  probleme(p) {
    const P = [
      [() => { const a = rnd(12, 48), b = rnd(11, 39); return [`Cécilia compte ${a} étoiles, puis encore ${b}. Combien en tout ?`, a + b]; },
       () => { const s = rnd(3, 9), m = rnd(4, 9); return [`Manoach a ${s} paniers de ${m} mangues. Combien de mangues ?`, s * m]; },
       () => { const a = rnd(30, 90), b = rnd(8, 29); return [`Thérèse voit ${a} nénuphars. ${b} s’envolent avec le vent. Combien en reste-t-il ?`, a - b]; },
       () => { const g = rnd(2, 5), q = rnd(3, 9); return [`${g * q} lucioles se rangent en ${g} groupes égaux. Combien par groupe ?`, q]; }],
      [() => { const b = rnd(4, 9), f = rnd(6, 12), t = rnd(5, 20); return [`Axel a ${b} branches de ${f} fleurs. ${t} fleurs tombent. Combien en reste-t-il ?`, b * f - t]; },
       () => { const pr = rnd(3, 9), n = rnd(4, 9), d = pr * n + rnd(1, 20) * 5; return [`Cécilia achète ${n} mangues à ${pr} € l’une. Elle paie avec ${d} €. Combien lui rend-on ?`, d - pr * n]; },
       () => { const g = rnd(4, 9), q = rnd(12, 25); return [`${g * q} lucioles forment ${g} marches égales. Combien de lucioles par marche ?`, q]; },
       () => { const j = rnd(3, 7), m = rnd(15, 45); return [`Christian vole ${m} minutes par jour pendant ${j} jours. Combien de minutes en tout ?`, j * m]; }],
      [() => { const pu = rnd(11, 39) / 4, n = rnd(3, 8); return [`Un cahier coûte ${fmt(pu)} €. Combien coûtent ${n} cahiers ?`, pu * n]; },
       () => { const g = rnd(12, 25), q = rnd(15, 40), r = rnd(1, g - 1); return [`${g * q + r} lucioles en groupes de ${g}. Combien de groupes complets ?`, q]; },
       () => { const f = pick([4, 5, 8]), a = f * rnd(15, 60); return [`L’escalier compte ${a} marches. Les 3/${f} sont déjà construites. Combien de marches sont construites ?`, a / f * 3]; },
       () => { const v = rnd(12, 45), h = pick([1.5, 2.5, 0.5]); return [`Christian vole à ${v} km par heure pendant ${fmt(h)} h. Quelle distance parcourt-il (km) ?`, v * h]; }],
    ][p.niveau];
    const [txt, ans] = pick(P)(); return Q(txt, ans, txt);
  },
  proportion(p) {
    if (p.niveau === 0) { const m = rnd(3, 9), n = rnd(4, 9); return Q(`1 sac = ${m} billes ; ${n} sacs = ?`, m * n, `1 sac contient ${m} billes. Combien de billes dans ${n} sacs ?`); }
    if (p.niveau === 1) { const u = rnd(2, 6), a = rnd(2, 4), b = a * rnd(2, 4); return Q(`${a} mangues → ${a * u} € ; ${b} mangues → ?`, b * u, `${a} mangues coûtent ${a * u} €. Combien coûtent ${b} mangues ?`); }
    const u = rnd(5, 25) / 2, a = rnd(2, 6), b = rnd(3, 9); return Q(`${a} kg → ${fmt(a * u)} € ; ${b} kg → ?`, b * u, `${a} kg de riz coûtent ${fmt(a * u)} €. Combien coûtent ${b} kg ?`);
  },
  melange(p) { const n = pick(p.notions); return GEN[n](Object.assign({ notion: n }, NOTIONS[n].p[p.niv || 0])); },
};

// ---------- Sauvegarde V2 (localStorage dans la WebView) ----------
// localStorage['cm.v2'] = { version: 2, lang, sound, current, profiles: [{ id, name, avatar, shirt, age,
//   lucioles: { '1.1.1': 1..3 }, livre: { 1: true, dedicace: true }, coloriages: { lion: true },
//   tables: { 'x7': 1..3, '÷12': 1..3 } }] }   (entraînement des tables de 1 à 13)
// Au premier lancement, les profils NumZoo (clé 'numzoo.v1') sont repris : nom, personnage, âge, langue, son.
// L'ancienne clé n'est pas effacée (aucune perte possible).
const Store = {
  key: 'cm.v2', ancienne: 'numzoo.v1',
  data: { version: 2, lang: null, sound: true, profiles: [], current: null },
  load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(this.key)); } catch (e) {}
    if (d) this.data = Object.assign(this.data, d);
    else this.migrer();
    this.data.profiles.forEach(Store.complet);
  },
  migrer() {
    let v1 = null;
    try { v1 = JSON.parse(localStorage.getItem(this.ancienne)); } catch (e) {}
    if (!v1 || !Array.isArray(v1.profiles)) return false;
    this.data.lang = v1.lang || null;
    this.data.sound = v1.sound !== false;
    this.data.profiles = v1.profiles.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, shirt: p.shirt, age: p.age || 0, lucioles: {}, livre: {}, coloriages: {} }));
    this.data.current = v1.current || null;
    this.save(); return true;
  },
  complet(p) { p.lucioles = p.lucioles || {}; p.livre = p.livre || {}; p.coloriages = p.coloriages || {}; p.tables = p.tables || {}; p.matieres = p.matieres || {}; p.village = p.village || {}; if (!(p.age >= 0 && p.age <= 2)) p.age = 0;
    // Académie (V2.5) : les anciens profils CE2 / CM1 / génie commencent en 3e / 4e / 5e primaire
    const a = p.academie = p.academie || { classe: [3, 4, 5][p.age] };
    a.lecons = a.lecons || {}; a.quiz = a.quiz || []; a.examens = a.examens || []; a.badges = a.badges || {}; a.erreurs = a.erreurs || {};
    a.jours = a.jours || []; a.temps = a.temps || { total: 0, mat: {}, jours: {} }; a.diag = a.diag || null; a.ordreLibre = !!a.ordreLibre;
    if (!(a.classe >= 1 && a.classe <= 6)) a.classe = 3;
    return p; },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {} },
  profile() { return this.data.profiles.find(p => p.id === this.data.current) || null; },
  lucioles(id) { const p = this.profile(); return (p && p.lucioles[id]) || 0; },
  // Renvoie true si la partie est réussie pour la première fois
  setLucioles(id, n) {
    const p = this.profile(), first = !p.lucioles[id];
    if (!p.lucioles[id] || p.lucioles[id] < n) p.lucioles[id] = n;
    this.save(); return first;
  },
  totalLucioles(p) { p = p || this.profile(); return p ? Object.values(p.lucioles).reduce((a, b) => a + b, 0) : 0; },
};
