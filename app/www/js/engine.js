// NumZoo — moteur pédagogique : génération de calculs selon l'âge et le niveau, sauvegarde
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const AGES = [
  { id: 0, range: '4 – 6', key: 'age1', color: '#ffb703', icon: '🐣' },
  { id: 1, range: '7 – 9', key: 'age2', color: '#06d6a0', icon: '🚀' },
  { id: 2, range: '10 – 12', key: 'age3', color: '#9b5de5', icon: '🏆' },
];

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

function genQ(sk) {
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
    const tb = pick(sk.tables), k = rnd(1, 10);
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
  const s = new Set([ans]), out = [];
  const big = ans >= 20, cands = ans < 10 ? [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3] : [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 3];
  if (big) { const r = String(ans).split('').reverse().join(''); cands.push(+r); }
  let guard = 0;
  for (const c of shuffle(cands)) { if (out.length >= n) break; if (c >= 0 && !s.has(c) && (!big || c !== ans) && Number.isFinite(c)) { s.add(c); out.push(c); } }
  while (out.length < n && guard++ < 100) { const c = Math.max(0, ans + rnd(-5, 6)); if (!s.has(c)) { s.add(c); out.push(c); } }
  return out;
}
function choices(ans, n = 3, sk) { return shuffle([ans, ...distractors(ans, n - 1, sk)]); }
// Autre calcul donnant le même résultat (pour le coloriage)
function exprFor(v, sk, avoid) {
  for (let i = 0; i < 400; i++) { const q = genQ(sk); if (q.ans === v && q.text !== avoid) return q; }
  return null;
}

// ---------- Sauvegarde V2 (localStorage dans la WebView) ----------
// localStorage['cm.v2'] = { version: 2, lang, sound, current, profiles: [{ id, name, avatar, shirt, age,
//   lucioles: { '1.1.1': 1..3 }, livre: { 1: true, dedicace: true }, coloriages: { lion: true } }] }
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
  complet(p) { p.lucioles = p.lucioles || {}; p.livre = p.livre || {}; p.coloriages = p.coloriages || {}; if (!(p.age >= 0 && p.age <= 2)) p.age = 0; return p; },
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
