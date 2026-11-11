// Académie – moteur : générateurs propres à l'académie, quiz (5 questions × 4 points = /20), notation,
// progression, récompenses, bulletin, test de positionnement, examens de fin d'année, examens blancs ENAFEP.
// Aucune donnée pédagogique ici : elles sont dans structure.js, banques.js et lecons.js.

// ---------- Générateurs propres à l'académie ----------
// Chaque générateur renvoie { q, ans, opts?, expl } ; ans et opts en texte.
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const fmtFC = n => fmt(n) + ' FC';
const GEN_ACAD = {
  lettre() {
    const i = rnd(1, 24), apres = Math.random() < .6, l = ALPHABET[i], ans = apres ? ALPHABET[i + 1] : ALPHABET[i - 1];
    const opts = shuffle([ans, ...shuffle(ALPHABET.filter(x => x !== ans && x !== l)).slice(0, 3)]);
    return { q: `Quelle lettre vient ${apres ? 'juste après' : 'juste avant'} « ${l} » dans l’alphabet ?`, ans, opts, expl: `Dans l’alphabet : … ${ALPHABET[i - 1]}, ${l}, ${ALPHABET[i + 1]} …` };
  },
  voyelle() {
    const l = pick(ALPHABET), v = 'aeiouy'.includes(l), ans = v ? 'une voyelle' : 'une consonne';
    return { q: `La lettre « ${l} » est…`, ans, opts: ['une voyelle', 'une consonne'], expl: 'Les 6 voyelles sont a, e, i, o, u, y ; les autres lettres sont des consonnes.' };
  },
  compter(p) {
    const n = rnd(2, p.max || 10), e = pick(['🥭', '🍌', '🐟', '⭐', '🥚', '🌽', '🍊']);
    return { q: `Combien y a-t-il d’objets ?  ${e.repeat(n)}`, ans: String(n), num: n, expl: `On compte un par un : il y en a ${n}.` };
  },
  dizaines(p) {
    const n = rnd(11, p.max || 99), c = Math.floor(n / 100), d = Math.floor(n / 10) % 10, u = n % 10;
    const parts = [c ? `${c} centaine${c > 1 ? 's' : ''}` : '', `${d} dizaine${d > 1 ? 's' : ''}`, `${u} unité${u > 1 ? 's' : ''}`].filter(Boolean);
    return { q: `${parts.join(', ')} : quel nombre est-ce ?`, ans: String(n), num: n, expl: `${c ? c + ' × 100 + ' : ''}${d} × 10 + ${u} = ${fmt(n)}.` };
  },
  comparer(p) {
    const max = p.max || 100, a = rnd(Math.floor(max / 10), max), set = new Set([a]);
    while (set.size < 4) set.add(Math.max(1, a + rnd(-Math.ceil(max / 8), Math.ceil(max / 8))));
    const nb = [...set], grand = Math.random() < .5, ans = grand ? Math.max(...nb) : Math.min(...nb);
    return { q: `Quel est le ${grand ? 'plus grand' : 'plus petit'} nombre ?`, ans: fmt(ans), opts: shuffle(nb).map(fmt), expl: `On compare les chiffres de gauche à droite : ${fmt(ans)} est le ${grand ? 'plus grand' : 'plus petit'}.` };
  },
  multintro() {
    const k = rnd(2, 5), n = pick([2, 3, 4, 5, 10]);
    return { q: `${Array(k).fill(n).join(' + ')} = ? (c’est ${k} × ${n})`, ans: String(k * n), num: k * n, expl: `${k} fois ${n} : ${k} × ${n} = ${k * n}.` };
  },
  fraction(p) {
    const den = pick(p.den || [2, 3, 4]), num = rnd(1, den - 1), k = rnd(2, 10), tot = den * k, ans = num * k;
    const mots = { 2: 'moitié', 3: 'tiers', 4: 'quart' };
    const libelle = num === 1 && mots[den] ? `le ${mots[den]}`.replace('le moitié', 'la moitié') : `les ${num}/${den}`;
    return { q: `Combien font ${libelle} de ${tot} mangues ?`, ans: String(ans), num: ans, expl: `${tot} ÷ ${den} = ${k}${num > 1 ? `, puis ${k} × ${num} = ${ans}` : ''}.` };
  },
  decimaux(p) {
    const d = p.d || 1, f = Math.pow(10, d), a = rnd(11, 90 * f / (d === 1 ? 1 : 10)) / f, b = rnd(1, 50 * f / (d === 1 ? 1 : 10)) / f;
    const plus = Math.random() < .6, x = plus ? a : Math.max(a, b), y = plus ? b : Math.min(a, b), ans = r3(plus ? x + y : x - y);
    return { q: `${fmt(x)} ${plus ? '+' : '−'} ${fmt(y)} = ?`, ans: fmt(ans), num: ans, expl: `On aligne les virgules : ${fmt(x)} ${plus ? '+' : '−'} ${fmt(y)} = ${fmt(ans)}.` };
  },
  perimetre() {
    const L = rnd(5, 30), l = rnd(2, L - 1), ans = 2 * (L + l);
    return { q: `Un jardin rectangulaire mesure ${L} m sur ${l} m. Quel est son périmètre (en m) ?`, ans: String(ans), num: ans, expl: `Périmètre = 2 × (${L} + ${l}) = ${ans} m.` };
  },
  aire(p) {
    const L = p.grand ? rnd(12, 60) : rnd(3, 15), l = p.grand ? rnd(5, L - 1) : rnd(2, L - 1), carre = Math.random() < .25, ans = carre ? L * L : L * l;
    return carre
      ? { q: `Quelle est l’aire d’un carré de ${L} m de côté (en m²) ?`, ans: String(ans), num: ans, expl: `Aire du carré = côté × côté = ${L} × ${L} = ${ans} m².` }
      : { q: `Quelle est l’aire d’un champ rectangulaire de ${L} m sur ${l} m (en m²) ?`, ans: String(ans), num: ans, expl: `Aire = longueur × largeur = ${L} × ${l} = ${ans} m².` };
  },
  regle3() {
    const obj = pick([['cahiers', 'coûtent', 'FC', [200, 300, 500, 800]], ['kg de riz', 'coûtent', 'FC', [1200, 1500, 2000, 2500]], ['bouteilles d’eau', 'coûtent', 'FC', [500, 700, 1000]], ['litres d’essence', 'coûtent', 'FC', [2500, 2800, 3000]]]);
    const u = pick(obj[3]), a = rnd(2, 6), b = rnd(2, 12), pa = u * a, ans = u * b;
    return { q: `${a} ${obj[0]} ${obj[1]} ${fmtFC(pa)}. Combien ${obj[1]} ${b} ${obj[0]} (en FC) ?`, ans: String(ans), num: ans, expl: `1 → ${fmt(pa)} ÷ ${a} = ${fmtFC(u)} ; ${b} → ${fmt(u)} × ${b} = ${fmtFC(ans)}.` };
  },
  pourcent(p) {
    const pc = pick(p.pcts || [10, 25, 50]), base = pick([200, 400, 800, 1000, 2000, 4000, 5000, 10000, 20000]), ans = base * pc / 100;
    const ctx = pick([`Une réduction de ${pc} % sur un pagne à ${fmtFC(base)} : combien d’argent en moins (en FC) ?`, `Combien font ${pc} % de ${fmtFC(base)} (en FC) ?`, `${pc} % des ${fmt(base)} habitants du village vont au marché. Combien de personnes ?`]);
    return { q: ctx, ans: String(ans), num: ans, expl: `${pc} % de ${fmt(base)} = ${fmt(base)} × ${pc} ÷ 100 = ${fmt(ans)}.` };
  },
};

// ---------- Les leçons, à plat, avec leur identifiant ----------
const LECONS_ACAD = [];
CLASSES_ACAD.forEach(C => MATIERES_ACAD.forEach(M => {
  ((PROGRAMME_ACAD[C.n] || {})[M.id] || []).forEach(([chap, lecons], ci) => lecons.forEach((le, li) => {
    LECONS_ACAD.push(Object.assign({ id: `${C.n}-${M.id}-${ci + 1}-${li + 1}`, classe: C.n, mat: M.id, chap: ci + 1, chapTitre: chap, num: li + 1 }, le));
  }));
}));
const leconAcad = id => LECONS_ACAD.find(l => l.id === id);
const leconsDe = (classe, mat) => LECONS_ACAD.filter(l => l.classe === classe && (!mat || l.mat === mat));
const matiereAcad = id => MATIERES_ACAD.find(m => m.id === id);
const classeAcad = n => CLASSES_ACAD.find(c => c.n === n);
const baremeDe = note => BAREME.find(b => note >= b.min);

// ---------- Questions : normalisation en { key, type, q, ans, opts, expl, img } ----------
// Comparaison stricte (majuscules comprises : « le fleuve » ≠ « Le fleuve ») ; seuls les espaces sont normalisés
const normal = s => String(s).replace(/[\u202f\u00a0]/g, ' ').replace(/\s+/g, ' ').trim();
function depuisBanque(item) {
  const [q, r, f, expl, img] = item;
  if (!img && /…$/.test(q) && Math.random() < .3) { // vrai / faux
    const vrai = Math.random() < .5, cand = vrai ? r : pick(f);
    return { key: q + '|' + r, type: 'vf', q: `Vrai ou faux ? ${q.replace(/…$/, '')} ${cand}.`, ans: vrai ? 'Vrai' : 'Faux', opts: ['Vrai', 'Faux'], expl: `${vrai ? 'Vrai' : 'Faux'} : ${q.replace(/…$/, '')} ${r}. ${expl}` };
  }
  return { key: q + '|' + r, type: img ? 'image' : (/^«/.test(q) ? 'comprehension' : 'qcm'), q, ans: r, opts: shuffle([r, ...f]), expl, img: img || '' };
}
function depuisGen(src) {
  if (src.a) {
    const o = GEN_ACAD[src.a](src.p || {});
    const nb = o.num !== undefined;
    return { key: o.q + '|' + o.ans, type: nb ? 'calcul' : 'qcm', q: o.q, ans: o.ans, opts: o.opts || (nb ? choices(o.num, 4).map(fmt) : [o.ans]), expl: o.expl, num: nb ? o.num : undefined };
  }
  const N = NOTIONS[src.g], n = src.n || 0;
  const o = GEN[src.g](Object.assign({ notion: src.g }, N.p[Math.min(n, N.p.length - 1)], { niv: n }, src.p || {}));
  const q = o.q || o.text;
  if (typeof o.ans === 'number') {
    const long = q.length > 40;
    const expl = /= \?$/.test(q) ? q.replace(/\?$/, fmt(o.ans)) + '.' : `La réponse est ${fmt(o.ans)}.`;
    return { key: q, type: long ? 'probleme' : 'calcul', q: long ? q : (q.includes('?') ? q : q + ' = ?'), ans: fmt(o.ans), num: o.ans, opts: choices(o.ans, 4).map(fmt), expl };
  }
  const titre = tx(N.titre);
  return { key: q, type: 'qcm', q, ans: String(o.ans), opts: shuffle([String(o.ans), ...shuffle(o.choix || []).slice(0, 3).map(String)]), expl: `La bonne réponse est « ${o.ans} » (${titre}).` };
}
const SOURCES_EXCLUES = { programmation: 1, carteAfrique: 1, comparer: 1 };
// Tire n questions distinctes dans les sources ; évite les clés de « eviter » tant que c'est possible.
function tirerQuestions(sources, n, eviter) {
  eviter = new Set(eviter || []);
  const out = [], pris = new Set(), srcs = sources.filter(s => !(s.g && SOURCES_EXCLUES[s.g]));
  for (let essai = 0; out.length < n && essai < 400; essai++) {
    const s = srcs[(out.length + essai) % srcs.length], strict = essai < 250;
    let q = null;
    if (s.b) {
      const banque = BANQUES[s.b] || [];
      const cle = it => it[0] + '|' + it[1];
      let libres = banque.filter(it => !pris.has(cle(it)) && !eviter.has(cle(it)));
      if (!libres.length && !strict) libres = banque.filter(it => !pris.has(cle(it)));
      if (libres.length) q = depuisBanque(pick(libres));
    } else {
      try { q = depuisGen(s); } catch (e) { q = null; }
      if (q && strict && eviter.has(q.key)) q = null;
    }
    if (!q || pris.has(q.key)) continue;
    // une seule bonne réponse : aucune mauvaise réponse ne doit être égale à la bonne
    q.opts = [...new Set(q.opts.map(String))];
    if (!q.opts.includes(q.ans)) q.opts.push(q.ans);
    if (q.opts.length < 2) continue;
    q.opts = q.type === 'vf' ? q.opts : shuffle(q.opts);
    // saisie au clavier pour une partie des calculs
    if (q.type === 'calcul' && Math.random() < .4) q.saisie = true;
    pris.add(q.key); out.push(q);
  }
  return out;
}
const juste = (q, rep) => (q.num !== undefined && q.saisie ? egal(+String(rep).replace(/\s/g, '').replace(',', '.'), q.num) : normal(rep) === normal(q.ans));

// ---------- Profil académie ----------
const jourDe = d => (d || new Date()).toISOString().slice(0, 10);
const periodeDe = d => { const m = (d || new Date()).getMonth() + 1; return PERIODES.find(p => p.mois.includes(m)).id; };
// Année scolaire : de septembre à août (ex. « 2026-2027 »)
const anneeDe = d => { d = d || new Date(); const y = d.getFullYear(); return d.getMonth() + 1 >= 9 ? `${y}-${y + 1}` : `${y - 1}-${y}`; };

const Acad = {
  p() { const p = Store.profile(); return p && p.academie; },
  classe() { const a = this.p(); return a ? a.classe : 1; },
  // Accès : classes jusqu'à la classe atteinte ; leçons dans l'ordre de la matière (sauf « ordre libre » choisi par un parent)
  classeOuverte(n) { const a = this.p(); return !!a && (a.ordreLibre || n <= a.classe); },
  rec(id) { const a = this.p(); return (a && a.lecons[id]) || null; },
  valide(id) { const r = this.rec(id); return !!(r && r.best >= QUIZ.seuil); },
  statut(id) { const r = this.rec(id); return !r || !r.tentatives ? 'non' : r.best >= QUIZ.seuil ? 'ok' : 'cours'; },
  etoiles(id) { const r = this.rec(id); if (!r || r.best < QUIZ.seuil) return 0; return r.best >= 18 ? 3 : r.best >= 16 ? 2 : 1; },
  leconOuverte(id) {
    const l = leconAcad(id), a = this.p();
    if (!this.classeOuverte(l.classe)) return false;
    if (a.ordreLibre) return true;
    const liste = leconsDe(l.classe, l.mat), k = liste.indexOf(l);
    return k <= 0 || this.valide(liste[k - 1].id);
  },
  chapitreMaitrise(classe, mat, chap) { return leconsDe(classe, mat).filter(l => l.chap === chap).every(l => this.valide(l.id)); },
  avancement(classe, mat) {
    const ls = leconsDe(classe, mat), ok = ls.filter(l => this.valide(l.id)).length, cours = ls.filter(l => this.statut(l.id) === 'cours').length;
    return { total: ls.length, ok, cours, non: ls.length - ok - cours, pct: ls.length ? Math.round(100 * ok / ls.length) : 0 };
  },
  // ----- Quiz d'une leçon -----
  quizLecon(id) {
    const l = leconAcad(id), r = this.rec(id);
    return tirerQuestions(l.src, QUIZ.questions, r ? r.vus : []);
  },
  noter(qs, reps) {
    const res = qs.map((q, i) => ({ q, rep: reps[i], ok: reps[i] !== undefined && juste(q, reps[i]) }));
    const bonnes = res.filter(x => x.ok).length;
    return { res, bonnes, note: bonnes * QUIZ.points * (QUIZ.questions / qs.length) };
  },
  // Enregistre un quiz de leçon ; renvoie { note, valide, premier, badges: [nouveaux] }
  enregistrerQuiz(id, qs, reps, secondes) {
    const a = this.p(), l = leconAcad(id), { res, bonnes, note } = this.noter(qs, reps);
    const r = a.lecons[id] = a.lecons[id] || { best: 0, tentatives: 0, vus: [], echecs: 0 };
    const avant = r.best >= QUIZ.seuil;
    r.tentatives++; r.derniere = Date.now(); r.best = Math.max(r.best, note);
    if (note < QUIZ.seuil) r.echecs++;
    r.vus = [...qs.map(q => q.key), ...r.vus].slice(0, 15);
    a.quiz.push({ id, c: l.classe, m: l.mat, note, d: Date.now(), t: Math.round(secondes || 0) });
    if (a.quiz.length > 500) a.quiz.splice(0, a.quiz.length - 500);
    res.filter(x => !x.ok).forEach(x => {
      const e = a.erreurs[x.q.key] = a.erreurs[x.q.key] || { n: 0, l: id, q: x.q.q };
      e.n++; e.d = Date.now();
    });
    const cles = Object.keys(a.erreurs);
    if (cles.length > 200) cles.sort((x, y) => a.erreurs[x].d - a.erreurs[y].d).slice(0, cles.length - 200).forEach(k => delete a.erreurs[k]);
    this.temps(l.mat, secondes);
    const persevere = !avant && note >= QUIZ.seuil && r.echecs > 0;
    const badges = this.verifierBadges({ persevere });
    Store.save();
    return { res, bonnes, note, valide: note >= QUIZ.seuil, premier: !avant && note >= QUIZ.seuil, badges };
  },
  temps(mat, s) {
    const a = this.p(); if (!a || !s) return;
    s = Math.min(Math.round(s), 3600);
    a.temps.total += s; a.temps.mat[mat] = (a.temps.mat[mat] || 0) + s;
    const j = jourDe(); a.temps.jours[j] = (a.temps.jours[j] || 0) + s;
    const jours = Object.keys(a.temps.jours).sort(); if (jours.length > 120) delete a.temps.jours[jours[0]];
    if (!a.jours.includes(j)) { a.jours.push(j); if (a.jours.length > 400) a.jours.shift(); }
  },
  // ----- Récompenses -----
  joursDeSuite() {
    const a = this.p(), set = new Set(a.jours); let n = 0, d = new Date();
    if (!set.has(jourDe(d))) d = new Date(d.getTime() - 864e5);
    while (set.has(jourDe(d))) { n++; d = new Date(d.getTime() - 864e5); }
    return n;
  },
  verifierBadges(ctx) {
    const a = this.p(), nouveaux = [], nbVal = mats => LECONS_ACAD.filter(l => mats.includes(l.mat) && this.valide(l.id)).length;
    const notes = a.quiz.map(x => x.note), moy = notes.length ? notes.reduce((s, x) => s + x, 0) / notes.length : 0;
    let serie = 0; for (let i = a.quiz.length - 1; i >= 0 && a.quiz[i].note >= QUIZ.seuil; i--) serie++;
    BADGES.forEach(B => {
      if (a.badges[B.id]) return;
      const R = B.regle; let ok = false;
      if (R.matiere) ok = nbVal([R.matiere]) >= R.lecons;
      else if (R.matieres) ok = nbVal(R.matieres) >= R.lecons;
      else if (R.moyenne) ok = notes.length >= R.quiz && moy >= R.moyenne;
      else if (R.notePleine) ok = notes.includes(20);
      else if (R.serieQuiz) ok = serie >= R.serieQuiz;
      else if (R.joursSuite) ok = this.joursDeSuite() >= R.joursSuite;
      else if (R.reussiApresEchec) ok = !!(ctx && ctx.persevere);
      else if (R.positionnement) ok = !!a.diag;
      if (ok) { a.badges[B.id] = Date.now(); nouveaux.push(B); }
    });
    return nouveaux;
  },
  // Médailles (chapitres maîtrisés), trophées (matières terminées dans une classe), diplômes (examens réussis)
  recompenses() {
    const a = this.p(), medailles = [], trophees = [], etoiles = LECONS_ACAD.reduce((s, l) => s + this.etoiles(l.id), 0);
    CLASSES_ACAD.forEach(C => MATIERES_ACAD.forEach(M => {
      const chaps = (PROGRAMME_ACAD[C.n][M.id] || []);
      chaps.forEach(([titre], ci) => { if (this.chapitreMaitrise(C.n, M.id, ci + 1)) medailles.push({ classe: C.n, mat: M.id, titre }); });
      if (chaps.length && leconsDe(C.n, M.id).every(l => this.valide(l.id))) trophees.push({ classe: C.n, mat: M.id });
    }));
    const diplomes = a.examens.filter(e => e.type === 'annee' && e.note >= EXAMEN.seuil).map(e => e.classe).filter((c, i, t) => t.indexOf(c) === i);
    return { etoiles, medailles, trophees, diplomes, badges: BADGES.filter(B => a.badges[B.id]), serie: this.joursDeSuite() };
  },
  // ----- Examen de fin d'année (20 questions de toute la classe) -----
  REPARTITION: { fr: 5, ma: 5, st: 2, hi: 2, ge: 2, ec: 2, autres: 2 },
  questionsDe(classes, mats, n) {
    const ls = LECONS_ACAD.filter(l => classes.includes(l.classe) && mats.includes(l.mat));
    const out = [], cles = new Set();
    for (let essai = 0; out.length < n && essai < n * 6; essai++) {
      const l = ls[essai % ls.length === 0 ? rnd(0, ls.length - 1) : rnd(0, ls.length - 1)];
      const [q] = tirerQuestions(l.src, 1, [...cles]);
      if (q && !cles.has(q.key)) { q.mat = l.mat; q.lecon = l.id; cles.add(q.key); out.push(q); }
    }
    return out;
  },
  examenAnnee(classe) {
    const R = this.REPARTITION, out = [];
    ['fr', 'ma', 'st', 'hi', 'ge', 'ec'].forEach(m => out.push(...this.questionsDe([classe], [m], R[m])));
    out.push(...this.questionsDe([classe], ['ln', 'ar', 'ep', 'tp'], R.autres));
    return out;
  },
  examenEnafep(domaineId) {
    const D = ENAFEP.domaines.find(d => d.id === domaineId);
    return this.questionsDe([5, 6], D.matieres, D.questions);
  },
  // Enregistre un examen ; note ramenée sur 20 ; détail par matière
  enregistrerExamen(type, classe, qs, reps, secondes, domaine) {
    const a = this.p(), res = qs.map((q, i) => ({ q, rep: reps[i], ok: reps[i] !== undefined && juste(q, reps[i]) }));
    const bonnes = res.filter(x => x.ok).length, note = Math.round(20 * bonnes / qs.length * 10) / 10;
    const parMat = {};
    res.forEach(x => { const m = x.q.mat; parMat[m] = parMat[m] || { ok: 0, n: 0 }; parMat[m].n++; if (x.ok) parMat[m].ok++; });
    const e = { type, classe, domaine: domaine || null, note, bonnes, total: qs.length, parMat, d: Date.now(), t: Math.round(secondes || 0) };
    a.examens.push(e); if (a.examens.length > 100) a.examens.shift();
    this.temps(domaine || 'examen', secondes);
    let monte = false;
    if (type === 'annee' && note >= EXAMEN.seuil && classe === a.classe && a.classe < 6) { a.classe++; monte = true; }
    const badges = this.verifierBadges();
    Store.save();
    return Object.assign({ res, monte, badges }, e);
  },
  // ----- Test de positionnement : 4 questions par classe (2 français, 2 maths), on monte tant qu'on réussit -----
  positionnement(classe) {
    return [...this.questionsDe([classe], ['fr'], POSITIONNEMENT.parClasse / 2), ...this.questionsDe([classe], ['ma'], POSITIONNEMENT.parClasse / 2)];
  },
  finirPositionnement(resultats) { // resultats : [{ classe, bonnes }]
    const a = this.p(), rate = resultats.find(r => r.bonnes < POSITIONNEMENT.seuil);
    const conseil = rate ? rate.classe : Math.min(6, resultats[resultats.length - 1].classe);
    a.diag = { d: Date.now(), conseil, resultats };
    a.classe = conseil;
    const badges = this.verifierBadges();
    Store.save();
    return { conseil, badges };
  },
  // ----- Bulletin d'une période -----
  bulletin(periode, annee) {
    const a = this.p(); annee = annee || anneeDe(); periode = periode || periodeDe();
    const dans = (x, per) => anneeDe(new Date(x.d)) === annee && periodeDe(new Date(x.d)) === per;
    const calc = per => {
      const notes = {};
      a.quiz.filter(x => dans(x, per)).forEach(x => { (notes[x.m] = notes[x.m] || []).push(x.note); });
      a.examens.filter(x => x.type === 'annee' && dans(x, per)).forEach(x => Object.entries(x.parMat).forEach(([m, v]) => { (notes[m] = notes[m] || []).push(20 * v.ok / v.n); }));
      const mats = MATIERES_ACAD.filter(M => notes[M.id]).map(M => {
        const n = notes[M.id], moy = Math.round(10 * n.reduce((s, x) => s + x, 0) / n.length) / 10;
        return { id: M.id, nom: M.nom, complementaire: !!M.complementaire, moy, nb: n.length, reussis: n.filter(x => x >= QUIZ.seuil).length };
      });
      const off = mats.filter(m => !m.complementaire), base = off.length ? off : mats;
      const moy = base.length ? Math.round(10 * base.reduce((s, m) => s + m.moy, 0) / base.length) / 10 : null;
      const tot = mats.reduce((s, m) => s + m.nb, 0), ok = mats.reduce((s, m) => s + m.reussis, 0);
      return { mats, moy, taux: tot ? Math.round(100 * ok / tot) : null, nb: tot };
    };
    const k = PERIODES.findIndex(p => p.id === periode), cur = calc(periode);
    const prec = k > 0 ? calc(PERIODES[k - 1].id) : null;
    const B = cur.moy !== null ? baremeDe(cur.moy) : null;
    return Object.assign(cur, {
      periode: PERIODES[k], annee, classe: a.classe,
      maitrisees: cur.mats.filter(m => m.moy >= QUIZ.seuil).map(m => m.nom),
      aRenforcer: cur.mats.filter(m => m.moy < QUIZ.seuil).map(m => m.nom),
      appreciation: B ? `${B.nom} — ${this.phrase(B, cur)}` : 'Pas encore de note pour cette période.',
      progression: prec && prec.moy !== null && cur.moy !== null ? Math.round(10 * (cur.moy - prec.moy)) / 10 : null,
    });
  },
  phrase(B, cur) {
    const t = { Excellent: 'Travail remarquable, continue ainsi !', 'Très bien': 'Très bon travail, régulier et sérieux.', Bien: 'Bon travail ; les notions sont acquises.', 'À renforcer': 'Des efforts à poursuivre : revois les leçons non validées.', Insuffisant: 'Il faut reprendre les leçons avec l’aide d’un adulte.' }[B.nom];
    return t + (cur.mats.length < 3 ? ' (peu de matières évaluées)' : '');
  },
  // ----- Tableau de bord : difficultés et recommandations -----
  difficultes(n) {
    const a = this.p();
    return Object.values(a.erreurs).filter(e => e.n >= 1).sort((x, y) => y.n - x.n || y.d - x.d).slice(0, n || 8);
  },
  recommandations() {
    const a = this.p(), out = [];
    const aRevoir = LECONS_ACAD.filter(l => this.statut(l.id) === 'cours').sort((x, y) => (a.lecons[y.id].echecs || 0) - (a.lecons[x.id].echecs || 0)).slice(0, 4);
    aRevoir.forEach(l => out.push({ type: 'revoir', lecon: l.id, texte: `Revoir « ${l.titre} » (${matiereAcad(l.mat).nom}, ${classeAcad(l.classe).nom}) : meilleure note ${a.lecons[l.id].best}/20.` }));
    MATIERES_ACAD.filter(M => !M.complementaire).forEach(M => {
      const suiv = leconsDe(a.classe, M.id).find(l => !this.valide(l.id) && this.leconOuverte(l.id) && this.statut(l.id) === 'non');
      if (suiv && out.length < 8) out.push({ type: 'suivante', lecon: suiv.id, texte: `Commencer « ${suiv.titre} » en ${M.nom}.` });
    });
    const ls = leconsDe(a.classe), pct = ls.filter(l => this.valide(l.id)).length / (ls.length || 1);
    if (pct >= .7 && !a.examens.some(e => e.type === 'annee' && e.classe === a.classe && e.note >= EXAMEN.seuil)) out.unshift({ type: 'examen', texte: `${Math.round(pct * 100)} % des leçons de ${classeAcad(a.classe).nom} sont validées : l’examen de fin d’année peut être passé.` });
    if (!a.diag) out.push({ type: 'diag', texte: 'Faire le test de positionnement pour vérifier la classe conseillée.' });
    return out;
  },
};
