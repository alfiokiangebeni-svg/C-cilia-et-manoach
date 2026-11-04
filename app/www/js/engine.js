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

// ---------- Sauvegarde (localStorage dans la WebView) ----------
const Store = {
  key: 'numzoo.v1',
  data: { lang: null, sound: true, profiles: [], current: null },
  load() { try { const d = JSON.parse(localStorage.getItem(this.key)); if (d) this.data = Object.assign(this.data, d); } catch (e) {} },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {} },
  profile() { return this.data.profiles.find(p => p.id === this.data.current) || null; },
  stars(game, age, lvl) { const p = this.profile(); return (p && p.stars[`${age}.${game}.${lvl}`]) || 0; },
  setStars(game, age, lvl, s) {
    const p = this.profile(), k = `${age}.${game}.${lvl}`, first = !p.stars[k];
    if (!p.stars[k] || p.stars[k] < s) p.stars[k] = s;
    let newAnimal = null;
    if (first) { const idx = p.zoo.length; if (idx < ZOO_ANIMALS.length) { newAnimal = ZOO_ANIMALS[idx]; p.zoo.push(newAnimal); } }
    this.save(); return newAnimal;
  },
  totalStars() { const p = this.profile(); return p ? Object.values(p.stars).reduce((a, b) => a + b, 0) : 0; },
};
