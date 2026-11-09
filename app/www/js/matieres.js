// Cécilia & Manoach — générateurs des matières (français, sciences, histoire-géographie, EMC, anglais).
// Les contenus sont dans contenus.js ; les notions et leurs réglages par niveau dans programme.js.
// Une question à réponse en mots : { text (court), q (affichée), ans (texte), choix (mauvaises réponses), cat (pour le tri) }.

const QC = (text, ans, choix, q) => ({ text, ans, choix: [...new Set(choix)].filter(c => c !== ans), q: q || text });
// Tire un élément du niveau de l'enfant ; au-dessus du CE2, une fois sur deux un élément de son propre niveau.
function tirer(liste, niv, idx) {
  const ok = liste.filter(x => x[idx] <= niv), dur = ok.filter(x => x[idx] === niv);
  return pick(niv > 0 && dur.length && Math.random() < .5 ? dur : ok);
}
const majuscule = s => s.charAt(0).toUpperCase() + s.slice(1);
// QCM : s'il y a trop peu de questions au niveau de l'enfant, on ajoute celles du niveau suivant
const qcm = (banque, niv) => { const n = banque.filter(x => x[3] <= niv).length < 8 ? Math.min(2, niv + 1) : niv; const [q, a, f] = tirer(banque, n, 3); return QC(q, a, f, q); };

// ---------- Conjugaison ----------
const IMP_FIN = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], FUT_FIN = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
function groupe(v) { return VERBES_IRR[v] ? 3 : VERBES_2.includes(v) ? 2 : 1; }
function conjuguer(v, temps, i) {
  const irr = VERBES_IRR[v], g = groupe(v), rad = v.slice(0, -2);
  if (temps === 'pres') return irr ? irr.pres[i] : g === 1 ? rad + ['e', 'es', 'e', 'ons', 'ez', 'ent'][i] : rad + ['is', 'is', 'it', 'issons', 'issez', 'issent'][i];
  if (temps === 'imp') return (irr ? irr.imp : g === 1 ? rad : rad + 'iss') + IMP_FIN[i];
  if (temps === 'fut') return (irr ? irr.fut : v) + FUT_FIN[i];
  if (temps === 'cond') return (irr ? irr.fut : v) + IMP_FIN[i];
  if (temps === 'ps') return irr ? irr.ps[i] : g === 1 ? rad + ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'][i] : rad + ['is', 'is', 'it', 'îmes', 'îtes', 'irent'][i];
  if (temps === 'pc') {
    const aux = irr ? irr.aux : 'avoir', pp = irr ? irr.pp : g === 1 ? rad + 'é' : rad + 'i';
    return VERBES_IRR[aux].pres[i] + ' ' + (aux === 'être' && i >= 3 ? pp + 's' : pp);
  }
  if (temps === 'impe') { const k = { 1: 0, 3: 1, 4: 2 }[i]; return irr ? irr.impe[k] : g === 1 ? rad + ['e', 'ons', 'ez'][k] : rad + ['is', 'issons', 'issez'][k]; }
}
// Pronom de la question (il/elle, ils/elles au hasard ; pas de féminin avec l'auxiliaire être pour éviter l'accord)
function pronom(i, v) {
  const p = PERSONNES[i];
  return (i === 2 || i === 5) && !(VERBES_IRR[v] && VERBES_IRR[v].aux === 'être') && Math.random() < .5 ? (i === 2 ? 'elle' : 'elles') : p;
}
// Pronom + forme, avec élision (j’aime, j’ai)
const elide = (pr, forme) => (pr === 'je' && /^[aeéèêiouh]/i.test(forme) ? 'j’' + forme : pr + ' ' + forme);
function avecPronom(i, forme, v) { return elide(pronom(i, v), forme); }
function verbesNiv(niv, p) { const l = [...VERBES_1, ...Object.keys(VERBES_IRR)]; return niv >= 1 || p.groupe2 ? [...l, ...VERBES_2] : l; }
function questionConj(p, temps) {
  const niv = p.niv || 0;
  let v = pick(verbesNiv(niv, p));
  if (temps === 'impe') while (!VERBES_IRR[v] ? false : !VERBES_IRR[v].impe) v = pick(verbesNiv(niv, p));
  const pers = temps === 'impe' ? [1, 3, 4] : (p.pers || [0, 1, 2, 3, 4, 5]);
  const i = pick(pers), forme = conjuguer(v, temps, i);
  if (temps === 'impe') {
    const faux = [conjuguer(v, 'pres', i), ...[1, 3, 4].filter(j => j !== i).map(j => conjuguer(v, 'impe', j)), conjuguer(v, 'imp', i)];
    return QC(`(${PERSONNES[i]}) ${v}`, forme, faux, `${majuscule(TEMPS_NOMS.impe)} : (${PERSONNES[i]}) ${v} → ?`);
  }
  const pr = pronom(i, v), ans = elide(pr, forme);
  const autres = ['pres', 'imp', 'fut', 'ps', 'cond'].filter(t => t !== temps).map(t => conjuguer(v, t, i));
  const voisins = [0, 1, 2, 3, 4, 5].filter(j => j !== i).map(j => conjuguer(v, temps, j));
  const faux = [...autres, ...shuffle(voisins).slice(0, 2)].map(f => elide(pr, f));
  return QC(`${pr} (${v}) · ${TEMPS_NOMS[temps]}`, ans, faux, `${majuscule(TEMPS_NOMS[temps])} : ${pr} (${v}) → ?`);
}

// Chiffres romains (siècles)
function romain(n) { const T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of T) while (n >= v) { s += r; n -= v; } return s; }

Object.assign(GEN, {
  // --- Grammaire ---
  nature(p) {
    const niv = p.niv || 0, ns = NATURES_NIV[niv];
    let n, mot; do { n = pick(ns); const ok = NATURES[n].mots.filter(m => m[1] <= niv); mot = ok.length ? pick(ok)[0] : null; } while (!mot);
    return QC(mot, NATURES[n].fr, shuffle(ns.filter(x => x !== n)).map(x => NATURES[x].fr), `« ${mot} » est un…`);
  },
  pluriel(p) {
    const [a, b, f] = tirer(PLURIELS, p.niv || 0, 3), fem = !b.startsWith('des ');
    return QC(a, b, f, `${fem ? 'Au féminin' : 'Au pluriel'} : ${a} → ?`);
  },
  fonction(p) {
    const [ph, fn, a, f] = tirer(FONCTIONS, p.niv || 0, 4);
    return QC(`${fn} : ${ph}`, a, f, `« ${ph} » Quel est ${fn === 'COD' ? 'le COD' : 'le ' + fn} ?`);
  },
  phrases(p) {
    const niv = p.niv || 0;
    if (niv >= 1 && Math.random() < .4) { const [ph, a] = tirer(FORMES, niv, 2); return QC(ph + ' (forme)', a, ['affirmative', 'négative'], `« ${ph} » Forme de la phrase ?`); }
    const [ph, a] = tirer(PHRASES, niv, 2);
    return QC(ph, a, ['déclarative', 'interrogative', 'exclamative', 'impérative'], `« ${ph} » Type de phrase ?`);
  },
  // --- Conjugaison ---
  conjPresent(p) { return questionConj(p, 'pres'); },
  conjFutur(p) { return questionConj(p, 'fut'); },
  conjImparfait(p) { return questionConj(p, 'imp'); },
  conjPasseCompose(p) { return questionConj(p, 'pc'); },
  conjPasseSimple(p) { return questionConj(p, 'ps'); },
  conjImperatif(p) { return questionConj(p, 'impe'); },
  conjTemps(p) {
    const temps = p.temps, t = pick(temps), v = pick(verbesNiv(p.niv || 0, p)), i = t === 'ps' ? pick([2, 5]) : rnd(0, 5);
    const forme = avecPronom(i, conjuguer(v, t, i), v);
    return QC(forme, TEMPS_NOMS[t], temps.map(x => TEMPS_NOMS[x]), `« ${forme} » : quel temps ?`);
  },
  // --- Orthographe ---
  homophones(p) {
    const [ph, a, serie] = tirer(HOMOPHONES, p.niv || 0, 3), debut = ph.startsWith('___');
    const c = s => (debut ? majuscule(s) : s);
    return QC(ph, c(a), serie.map(c), ph);
  },
  accord(p) { const [gn, a, f] = tirer(ACCORDS, p.niv || 0, 3); return QC(gn, a, f, `Accorde : ${gn}`); },
  motsJustes(p) {
    const [m, f] = tirer(MOTS_ORTHO, p.niv || 0, 2), opts = shuffle([m, ...f]);
    return QC(opts.join(' / '), m, f, `Lequel est bien écrit : ${opts.join(', ')} ?`);
  },
  // --- Vocabulaire ---
  vocabulaire(p) {
    const niv = p.niv || 0, syn = niv >= 1 && Math.random() < .5, L = syn ? SYNONYMES : CONTRAIRES;
    const [m, a] = tirer(L, niv, 2), autres = shuffle(L.filter(x => x[1] !== a && x[0] !== m)).slice(0, 4).map(x => x[1]);
    return QC(`${syn ? 'synonyme' : 'contraire'} de ${m}`, a, autres, `${syn ? 'Synonyme' : 'Contraire'} de « ${m} » ?`);
  },
  dictionnaire(p) {
    const niv = p.niv || 0, grp = pick(DICO.filter(g => g[1] === niv))[0];
    let mots = shuffle(grp);
    if (niv === 0) { const vus = new Set(); mots = mots.filter(w => !vus.has(w[0]) && vus.add(w[0])); }
    mots = mots.slice(0, 4);
    const a = mots.slice().sort((x, y) => x.localeCompare(y, 'fr'))[0];
    return QC(mots.join(', '), a, mots, `Lequel vient en premier dans le dictionnaire : ${mots.join(', ')} ?`);
  },
  lingala() {
    const [ln, fr] = pick(LINGALA);
    return QC(ln, fr, LINGALA.map(x => x[1]), `« ${ln} » (lingala) veut dire…`);
  },
  // --- Sciences ---
  vivant(p) { const [m, c] = tirer(VIVANT, p.niv || 0, 2); return Object.assign(QC(m, c ? 'non vivant' : 'vivant', ['vivant', 'non vivant'], `${majuscule(m)} : vivant ou non vivant ?`), { cat: c }); },
  conducteurs(p) { const [m, c] = tirer(CONDUCTEURS, Math.max(1, p.niv || 0), 2); return Object.assign(QC(m, c ? 'isolant' : 'conducteur', ['conducteur', 'isolant'], `${majuscule(m)} : conducteur ou isolant ?`), { cat: c }); },
  animaux(p) { return qcm(SCIENCES.animaux, p.niv || 0); },
  alimentation(p) { return qcm(SCIENCES.alimentation, p.niv || 0); },
  corps(p) { return qcm(SCIENCES.corps, p.niv || 0); },
  matiere(p) { return qcm(SCIENCES.matiere, p.niv || 0); },
  ciel(p) { return qcm(SCIENCES.ciel, p.niv || 0); },
  plantes(p) { return qcm(SCIENCES.plantes, p.niv || 0); },
  energie(p) { return qcm(SCIENCES.energie, p.niv || 0); },
  // --- Histoire, géographie, EMC ---
  temps(p) {
    const niv = p.niv || 0, r = Math.random();
    if (r < .35) { const n = rnd(1, [20, 100, 2000][niv]), R = romain(n); return QC(R, String(n), [String(n + 1), String(Math.max(1, n - 1)), String(n + 10)], `En chiffres romains, ${R} = ?`); }
    if (niv >= 1 && r < .7) {
      const an = rnd(niv === 2 ? 1 : 400, 2025), s = Math.floor((an - 1) / 100) + 1;
      const S = n => romain(n) + (n === 1 ? 'er' : 'e');
      return QC(`siècle de ${an}`, S(s), [S(s + 1), S(Math.max(1, s - 1)), S(Math.floor(an / 100) || 2)], `L’année ${an} est au… siècle ?`);
    }
    return qcm(CALENDRIER, niv);
  },
  histoire(p) { return qcm(HISTOIRE, Math.max(1, p.niv || 0)); },
  geographie(p) { return qcm(GEOGRAPHIE, p.niv || 0); },
  emc(p) { return qcm(EMC, p.niv || 0); },
  // --- Anglais ---
  anglais(p) {
    const [fr, en, cat] = tirer(ANGLAIS, p.niv || 0, 3);
    const memes = ANGLAIS.filter(x => x[2] === cat && x[1] !== en).map(x => x[1]), autres = ANGLAIS.filter(x => x[1] !== en).map(x => x[1]);
    return QC(fr, en, shuffle(memes.length >= 3 ? memes : [...memes, ...shuffle(autres)]).slice(0, 4), `« ${fr} » en anglais ?`);
  },
});
