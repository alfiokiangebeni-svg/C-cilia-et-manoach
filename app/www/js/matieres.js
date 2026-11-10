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
  conjMelange(p) {
    const t = pick(p.temps);
    return questionConj(t === 'ps' && (p.niv || 0) < 2 ? Object.assign({}, p, { pers: [2, 5] }) : p, t);
  },
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

// =====================================================================
// Le village : problèmes de la vie (marché, cuisine, menuiserie, champ, pêche, wewa, chantier),
// PPCM / PGCD, programmation du robot, carte de l'Afrique. Prix en francs congolais (FC).
// =====================================================================
const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);
const ppcm = (a, b) => a / pgcd(a, b) * b;
const FC = v => `${fmt(v)} FC`;
const P = (txt, ans) => Q(txt, ans, txt); // problème : la question affichée est le texte entier
// Choisit un problème au niveau : banque[niveau] = liste de fonctions qui renvoient [texte, réponse]
const probleme = (banque, niv) => { const [t, a] = pick(banque[niv])(); return P(t, a); };

const PB = {
  commerce: [
    [() => { const p = pick([200, 250, 500, 1000]), n = rnd(2, 6); return [`Suzanne vend une mangue ${FC(p)}. Combien coûtent ${n} mangues (en FC) ?`, p * n]; },
     () => { const p = rnd(3, 9) * 100, d = pick([1000, 2000, 5000]); return [`Tu achètes un pain à ${FC(p)} et tu donnes ${FC(d)}. Combien Albertine te rend-elle (FC) ?`, d - p]; },
     () => { const a = rnd(2, 6) * 100, b = rnd(2, 6) * 100; return [`Albertine vend des tomates à ${FC(a)} et des oignons à ${FC(b)}. Combien pour les deux (FC) ?`, a + b]; },
     () => { const a = rnd(10, 40) * 100, b = rnd(5, 30) * 100; return [`Suzanne achète des bananes ${FC(a)} et les revend ${FC(a + b)}. Combien gagne-t-elle (FC) ?`, b]; }],
    [() => { const a = rnd(40, 90) * 100, b = rnd(10, 40) * 100; return [`Suzanne achète un régime de bananes ${FC(a)} et le revend ${FC(a + b)}. Quel est son bénéfice (FC) ?`, b]; },
     () => { const n = rnd(10, 30), pa = rnd(2, 4) * 100, pv = pa + rnd(1, 3) * 100; return [`Albertine achète ${n} mangues à ${FC(pa)} et les revend ${FC(pv)} pièce. Bénéfice total (FC) ?`, n * (pv - pa)]; },
     () => { const a = rnd(30, 80) * 100, b = rnd(5, 20) * 100; return [`Suzanne achète un pagne ${FC(a)} et veut gagner ${FC(b)}. À quel prix doit-elle le vendre (FC) ?`, a + b]; },
     () => { const a = rnd(40, 90) * 100, b = rnd(5, 15) * 100; return [`Albertine achète des avocats ${FC(a)} mais les revend seulement ${FC(a - b)}. Quelle est sa perte (FC) ?`, b]; }],
    [() => { const n = rnd(8, 20), pa = rnd(10, 16) * 100 + 50, pv = pa + rnd(2, 6) * 50; return [`Suzanne achète ${n} kg de riz à ${FC(pa)} le kg et le revend ${FC(pv)} le kg. Bénéfice (FC) ?`, n * (pv - pa)]; },
     () => { const a = pick([4000, 8000, 12000, 20000]), pc = pick([10, 20, 25, 50]); return [`Albertine veut un bénéfice de ${pc} % sur un achat de ${FC(a)}. Prix de vente (FC) ?`, a * (100 + pc) / 100]; },
     () => { const n = pick([10, 12, 15, 20]), pa = rnd(30, 50) * 100, g = n * rnd(2, 8) * 100; return [`Albertine achète ${n} pagnes à ${FC(pa)} et veut gagner ${FC(g)} en tout. Prix de vente d’un pagne (FC) ?`, pa + g / n]; },
     () => { const pa = rnd(20, 60) * 100, n = rnd(3, 9), pv = Math.ceil((pa + rnd(5, 20) * 100) / n / 100) * 100; return [`Suzanne achète un sac de mangues ${FC(pa)}, en tire ${n} tas vendus ${FC(pv)} chacun. Bénéfice (FC) ?`, n * pv - pa]; }],
  ],
  cuisine: [
    [() => { const b = rnd(1, 4), k = pick([2, 3]); return [`Le pondu pour 4 personnes demande ${b} bottes de feuilles de manioc. Combien pour ${4 * k} personnes ?`, b * k]; },
     () => { const t = rnd(2, 5), p = rnd(3, 8); return [`Il faut ${t} tomates par plat. Combien de tomates pour ${p} plats ?`, t * p]; },
     () => { const g = pick([250, 500]); return [`La recette demande ${g} g de riz. Combien de grammes pour 2 fois la recette ?`, g * 2]; },
     () => { const m = pick([15, 20, 25, 30]); return [`Le manioc cuit ${m} minutes, puis le poisson ${m} minutes. Combien de minutes en tout ?`, 2 * m]; }],
    [() => { const g = pick([200, 300, 400]), p = pick([9, 12, 15]); return [`Pour 6 personnes, il faut ${g} g de riz. Combien de grammes pour ${p} personnes ?`, g / 6 * p]; },
     () => { const n = rnd(3, 6), m = pick([25, 35, 45]); return [`Une marmite de fufu cuit ${m} min. Combien de minutes pour ${n} marmites l’une après l’autre ?`, n * m]; },
     () => { const l = pick([1, 2, 3]); return [`La moitié de ${l} L d’huile de palme, c’est combien de centilitres ?`, l * 50]; },
     () => { const b = pick([24, 36, 48]), p = pick([4, 6]); return [`Albertine fait ${b} beignets et les partage entre ${p} enfants. Combien chacun ?`, b / p]; }],
    [() => { const g = pick([600, 750, 900]), p = pick([10, 14, 6]); return [`Pour 4 personnes : ${g} g de manioc. Combien de grammes pour ${p} personnes ?`, g / 4 * p]; },
     () => { const l = pick([2, 3, 4]); return [`Les 3/4 de ${l} L d’eau, c’est combien de centilitres ?`, l * 75]; },
     () => { const f = pick([250, 300]), b = pick([6, 12]), n = pick([30, 36, 48]); return [`${f} g de farine pour ${b} beignets. Combien de grammes pour ${n} beignets ?`, f / b * n]; },
     () => { const p = rnd(12, 20) * 100, n = rnd(3, 6); return [`Un kilo de poisson coûte ${FC(p)}. Combien coûtent ${n},5 kg (FC) ?`, p * (n + .5)]; }],
  ],
  menuiserie: [
    [() => { const c = pick([30, 40, 50, 60, 80]); return [`Oncle Robert a une planche de 2 m. Il coupe ${c} cm. Combien de centimètres reste-t-il ?`, 200 - c]; },
     () => { const l = pick([30, 40, 45, 50]); return [`Un tabouret a 4 pieds de ${l} cm. Longueur totale de bois pour les pieds (cm) ?`, 4 * l]; },
     () => { const c = pick([40, 50, 60, 70]); return [`Le dessus d’une table est un carré de ${c} cm de côté. Quel est son périmètre (cm) ?`, 4 * c]; },
     () => { const n = rnd(3, 9); return [`Il faut 8 clous par chaise. Combien de clous pour ${n} chaises ?`, 8 * n]; }],
    [() => { const m = pick([2, 3, 4]), k = pick([4, 5, 8]); return [`Oncle Robert coupe une planche de ${m} m en ${k} morceaux égaux. Longueur d’un morceau (cm) ?`, m * 100 / k]; },
     () => { const a = pick([120, 150, 180]), b = pick([60, 80, 90]); return [`Une table mesure ${a} cm sur ${b} cm. Quel est son périmètre (cm) ?`, 2 * (a + b)]; },
     () => { const a = pick([40, 50, 60]), b = pick([30, 40, 45]); return [`Une étagère mesure ${a} cm sur ${b} cm. Quelle est son aire (cm²) ?`, a * b]; },
     () => { const n = rnd(5, 12); return [`Il faut 12 clous par tabouret. Combien de clous pour ${n} tabourets ?`, 12 * n]; }],
    [() => { const m = pick([2.4, 3.6, 4.8]), c = pick([30, 40, 60]); return [`Une planche de ${fmt(m)} m est coupée en morceaux de ${c} cm. Combien de morceaux ?`, Math.round(m * 100 / c)]; },
     () => { const a = pick([1.2, 1.5, 2]), b = pick([0.8, 0.6, 0.5]); return [`Un plateau mesure ${fmt(a)} m sur ${fmt(b)} m. Aire en m² ?`, a * b]; },
     () => { const v = rnd(12, 25) * 1000, b = rnd(4, 9) * 1000 + 500; return [`Oncle Robert vend un tabouret ${FC(v)}. Le bois et les clous ont coûté ${FC(b)}. Bénéfice (FC) ?`, v - b]; },
     () => { const p = pick([360, 480, 600]); return [`Le cadre carré d’une fenêtre a un périmètre de ${p} cm. Longueur d’un côté (cm) ?`, p / 4]; }],
  ],
  agronomie: [
    [() => { const r = rnd(4, 9), p = rnd(5, 9); return [`Axel l’agronome plante ${r} rangées de ${p} plants de maïs. Combien de plants ?`, r * p]; },
     () => { const a = rnd(20, 45), b = rnd(15, 40); return [`Axel récolte ${a} kg de haricots le matin et ${b} kg l’après-midi. Combien en tout (kg) ?`, a + b]; },
     () => { const c = rnd(3, 8), s = rnd(3, 6); return [`Le maïs pousse de ${c} cm par semaine. De combien pousse-t-il en ${s} semaines (cm) ?`, c * s]; },
     () => { const t = rnd(30, 90), m = rnd(10, 25); return [`Axel a ${t} graines. Il en sème ${m}. Combien lui en reste-t-il ?`, t - m]; }],
    [() => { const a = rnd(15, 40), b = rnd(8, 20); return [`Un champ rectangulaire mesure ${a} m sur ${b} m. Quelle est son aire (m²) ?`, a * b]; },
     () => { const r = pick([8, 10, 12]), p = rnd(15, 30); return [`${r * p} plants sont répartis en ${r} rangées égales. Combien par rangée ?`, p]; },
     () => { const s = 25, n = rnd(10, 20), x = rnd(1, 24); return [`Axel met ${s * n + x} kg de maïs dans des sacs de ${s} kg. Combien de sacs pleins ?`, n]; },
     () => { const a = rnd(20, 50), b = rnd(10, 30); return [`Pour clôturer un champ de ${a} m sur ${b} m, combien de mètres de clôture faut-il ?`, 2 * (a + b)]; }],
    [() => { return [`Un hectare, c’est combien de mètres carrés ?`, 10000]; },
     () => { const r = pick([2, 3, 4]), h = pick([1.5, 2.5, 0.5]); return [`Le rendement est de ${r} tonnes par hectare. Combien de kilos sur ${fmt(h)} ha ?`, r * h * 1000]; },
     () => { const a = rnd(30, 60), b = rnd(20, 40); return [`Un champ mesure ${a} m sur ${b} m. Axel en cultive la moitié. Aire cultivée (m²) ?`, a * b / 2]; },
     () => { const k = rnd(200, 600), p = rnd(4, 9) * 100; return [`Axel vend ${k} kg de manioc à ${FC(p)} le kg. Combien gagne-t-il (FC) ?`, k * p]; }],
  ],
  peche: [
    [() => { const a = rnd(8, 25), b = rnd(5, 20); return [`Tarzan le pêcheur attrape ${a} poissons le matin et ${b} le soir. Combien en tout ?`, a + b]; },
     () => { const n = rnd(3, 6), p = pick([500, 1000, 1500]); return [`Tarzan vend ${n} poissons à ${FC(p)} chacun. Combien gagne-t-il (FC) ?`, n * p]; },
     () => { const a = rnd(30, 60), b = rnd(10, 25); return [`Tarzan a ${a} poissons. Il en vend ${b}. Combien lui en reste-t-il ?`, a - b]; },
     () => { const p = pick([2, 3, 4]), q = rnd(4, 9); return [`Tarzan range ${p * q} poissons dans ${p} paniers égaux. Combien par panier ?`, q]; }],
    [() => { const k = rnd(12, 48), p = pick([2000, 2500, 3000]); return [`Tarzan pêche ${k} kg de poisson et vend le kilo ${FC(p)}. Combien gagne-t-il (FC) ?`, k * p]; },
     () => { const p = pick([6, 8, 12]), q = rnd(8, 15); return [`Tarzan range ${p * q} poissons dans ${p} paniers égaux. Combien par panier ?`, q]; },
     () => { const j = rnd(4, 7), n = rnd(12, 30); return [`Tarzan pêche ${n} poissons par jour pendant ${j} jours. Combien en tout ?`, n * j]; },
     () => { const a = rnd(50, 99) * 100, b = rnd(10, 40) * 100; return [`Tarzan vend sa pêche ${FC(a)}. L’essence de la pirogue a coûté ${FC(b)}. Que lui reste-t-il (FC) ?`, a - b]; }],
    [() => { const v = pick([4, 6, 8]), h = pick([1.5, 2.5, 3.5]); return [`La pirogue de Tarzan avance à ${v} km par heure. Distance en ${fmt(h)} h (km) ?`, v * h]; },
     () => { const k = pick([12.5, 7.5, 15.5]), p = pick([2400, 3200, 2800]); return [`Tarzan vend ${fmt(k)} kg de poisson à ${FC(p)} le kg. Recette (FC) ?`, k * p]; },
     () => { const v = rnd(400, 700) * 100, c = rnd(80, 200) * 100; return [`Recette ${FC(v)}, dépenses ${FC(c)} pour l’essence et le filet. Bénéfice (FC) ?`, v - c]; },
     () => { const p = pick([3, 4, 5]), t = pick([120, 180, 240]); return [`${p} pêcheurs partagent ${t} poissons en parts égales. Combien chacun ?`, t / p]; }],
  ],
  trajets: [
    [() => { const p = pick([500, 1000, 1500]), n = rnd(2, 5); return [`Une course en wewa coûte ${FC(p)}. Combien pour ${n} courses (FC) ?`, p * n]; },
     () => { const d = rnd(2, 9); return [`De la maison au marché, il y a ${d} km. Combien de km pour l’aller et le retour ?`, 2 * d]; },
     () => { const p = pick([1000, 1500]), d = pick([2000, 5000]); return [`La course coûte ${FC(p)}. Tu paies avec ${FC(d)}. Combien te rend le chauffeur (FC) ?`, d - p]; },
     () => { const a = rnd(10, 30), b = rnd(10, 30); return [`Le wewa roule ${a} min jusqu’à l’école, puis ${b} min jusqu’au marché. Combien de minutes en tout ?`, a + b]; }],
    [() => { const v = pick([20, 25, 30, 40]), h = rnd(2, 4); return [`Un wewa roule à ${v} km par heure. Quelle distance en ${h} heures (km) ?`, v * h]; },
     () => { const p = rnd(15, 35) * 100, d = pick([5000, 10000]); return [`La course coûte ${FC(p)}. Tu paies avec ${FC(d)}. Monnaie rendue (FC) ?`, d - p]; },
     () => { const c = rnd(6, 12), p = pick([1000, 1500, 2000]); return [`Le chauffeur fait ${c} courses à ${FC(p)} dans la matinée. Combien gagne-t-il (FC) ?`, c * p]; },
     () => { const d = pick([120, 150, 180]), j = pick([3, 5, 6]); return [`Le wewa parcourt ${d} km en ${j} jours, autant chaque jour. Combien de km par jour ?`, d / j]; }],
    [() => { const l = pick([3, 4, 5]), p = pick([2950, 3100, 2800]); return [`Un plein de ${l} L d’essence à ${FC(p)} le litre coûte combien (FC) ?`, l * p]; },
     () => { const v = pick([30, 40, 60]), d = pick([10, 15, 20]); return [`À ${v} km/h, combien de minutes pour parcourir ${d} km ?`, d / v * 60]; },
     () => { const r = rnd(40, 90) * 1000, e = rnd(8, 20) * 1000; return [`Le chauffeur gagne ${FC(r)} et dépense ${FC(e)} d’essence. Bénéfice (FC) ?`, r - e]; },
     () => { const a = pick([6, 8, 10]), b = pick([9, 12, 15]); return [`Un wewa passe toutes les ${a} min, un bus toutes les ${b} min. Ils partent ensemble : dans combien de minutes repartent-ils ensemble ?`, ppcm(a, b)]; }],
  ],
  chantier: [
    [() => { const a = rnd(2, 8) * 100, b = rnd(1, 5) * 100; return [`Le lundi, on construit ${a} m de route et le mardi ${b} m. Combien de mètres en tout ?`, a + b]; },
     () => { const t = 1000, f = rnd(2, 8) * 100; return [`La route doit faire ${fmt(t)} m. ${f} m sont faits. Combien de mètres reste-t-il ?`, t - f]; },
     () => { const c = rnd(3, 8), n = rnd(2, 5); return [`Le camion transporte ${c} tonnes de cailloux par voyage. Combien en ${n} voyages ?`, c * n]; },
     () => { const k = rnd(2, 6); return [`La route mesure ${k} km. Combien de mètres ?`, k * 1000]; }],
    [() => { const t = rnd(3, 9) * 1000, j = pick([4, 5, 8]); return [`On construit ${fmt(t)} m de route en ${j} jours, autant chaque jour. Combien de mètres par jour ?`, t / j]; },
     () => { const k = rnd(2, 9), m = rnd(1, 9) * 100; return [`${k} km ${m} m de route, c’est combien de mètres ?`, k * 1000 + m]; },
     () => { const l = rnd(5, 12) * 100, la = pick([6, 7, 8]); return [`Une route de ${l} m de long et ${la} m de large : quelle aire à goudronner (m²) ?`, l * la]; },
     () => { const c = rnd(12, 25), v = rnd(6, 12); return [`Le camion fait ${v} voyages de ${c} tonnes. Combien de tonnes en tout ?`, c * v]; }],
    [() => { const k = pick([2.5, 3.75, 1.25]); return [`${fmt(k)} km de route, c’est combien de mètres ?`, k * 1000]; },
     () => { const l = pick([1.5, 2.4, 3.2]), la = pick([7, 8]); return [`Une route de ${fmt(l)} km et de ${la} m de large : aire en m² ?`, l * 1000 * la]; },
     () => { const e = rnd(4, 8), t = e * rnd(2, 6) * 1000; return [`${e} équipes construisent ensemble ${fmt(t)} m en parts égales. Combien de mètres par équipe ?`, t / e]; },
     () => { const a = pick([4, 6]), b = pick([10, 15]); return [`Un panneau tous les ${a * 50} m et un lampadaire tous les ${b * 20} m. Distance avant qu’ils soient de nouveau au même endroit (m) ?`, ppcm(a * 50, b * 20)]; }],
  ],
};

Object.assign(GEN, {
  commerce(p) { return probleme(PB.commerce, p.niv || 0); },
  cuisine(p) { return probleme(PB.cuisine, p.niv || 0); },
  menuiserie(p) { return probleme(PB.menuiserie, p.niv || 0); },
  agronomie(p) { return probleme(PB.agronomie, p.niv || 0); },
  peche(p) { return probleme(PB.peche, p.niv || 0); },
  trajets(p) { return probleme(PB.trajets, p.niv || 0); },
  chantier(p) { return probleme(PB.chantier, p.niv || 0); },
  ppcm(p) {
    let a, b; do { a = rnd(2, p.max); b = rnd(2, p.max); } while (a === b || (p.niv === 0 && ppcm(a, b) > 30));
    return Q(`PPCM(${a} ; ${b})`, ppcm(a, b), p.niv === 0 ? `Plus petit multiple commun de ${a} et ${b} ?` : `PPCM de ${a} et ${b} ?`);
  },
  pgcd(p) {
    const d = rnd(2, p.dmax); let a, b; do { a = d * rnd(2, p.k); b = d * rnd(2, p.k); } while (a === b);
    return Q(`PGCD(${a} ; ${b})`, pgcd(a, b), p.niv === 0 ? `Plus grand diviseur commun de ${a} et ${b} ?` : `PGCD de ${a} et ${b} ?`);
  },
  // Programmation : amener le robot sur l'étoile. La réponse est un programme de flèches.
  programmation(p) {
    const N = p.taille, obst = new Set();
    let r, e, chemin;
    for (let essai = 0; essai < 200; essai++) {
      obst.clear();
      r = [rnd(0, N - 1), rnd(0, N - 1)]; e = [rnd(0, N - 1), rnd(0, N - 1)];
      if (Math.abs(r[0] - e[0]) + Math.abs(r[1] - e[1]) < 2) continue;
      for (let k = 0; k < p.obstacles; k++) { const o = [rnd(0, N - 1), rnd(0, N - 1)]; if (String(o) !== String(r) && String(o) !== String(e)) obst.add(String(o)); }
      chemin = cheminRobot(N, r, e, obst); if (chemin && chemin.length <= p.max) break; chemin = null;
    }
    if (!chemin) { obst.clear(); r = [0, 0]; e = [N - 1, N - 1]; chemin = cheminRobot(N, r, e, obst); }
    const ecrire = c => (p.boucles ? compresser(c) : c.join(' '));
    const ans = ecrire(chemin), faux = new Set();
    const MV = ['→', '←', '↑', '↓'], OPP = { '→': '←', '←': '→', '↑': '↓', '↓': '↑' };
    for (let g = 0; g < 60 && faux.size < 4; g++) {
      const c = chemin.slice(), t = rnd(0, 3);
      if (t === 0) c[rnd(0, c.length - 1)] = pick(MV);
      else if (t === 1) c.pop();
      else if (t === 2) c.push(pick(MV));
      else { const i = rnd(0, c.length - 1); c[i] = OPP[c[i]]; }
      const f = ecrire(c);
      if (f !== ans && !arrive(N, r, e, obst, c)) faux.add(f);
    }
    return Object.assign(QC(`robot ${r} → ${e} [${[...obst].join(' ')}]`, ans, [...faux], 'Quel programme amène le robot jusqu’à l’étoile ?'), { grille: { N, r, e, obst: [...obst] } });
  },
  // Carte de l'Afrique : trouver un pays, le nommer, ou donner sa capitale
  carteAfrique(p) {
    const ok = AFRIQUE.pays.filter(x => x.taille >= p.taille && (!p.capitales || x.capitale));
    const cible = pick(ok.filter(x => !p.connus || p.connus.includes(x.id) || Math.random() < p.ouvert));
    const mode = pick(p.modes);
    const autres = shuffle(ok.filter(x => x.id !== cible.id));
    if (mode === 'toucher') return Object.assign(Q(`pays ${cible.id}`, 0, `Touche : ${cible.fr}`), { ans: cible.id, carte: { mode, cible: cible.id } });
    if (mode === 'capitale' && cible.capitale) return Object.assign(QC(`capitale ${cible.id}`, cible.capitale, autres.filter(x => x.capitale).slice(0, 4).map(x => x.capitale), `Quelle est la capitale du pays en jaune (${cible.fr}) ?`), { carte: { mode, cible: cible.id } });
    return Object.assign(QC(`nom ${cible.id}`, cible.fr, autres.slice(0, 4).map(x => x.fr), 'Quel est le pays en jaune ?'), { carte: { mode: 'nom', cible: cible.id } });
  },
});
// Plus court chemin du robot (sans traverser les obstacles)
function cheminRobot(N, r, e, obst) {
  const D = { '→': [1, 0], '←': [-1, 0], '↓': [0, 1], '↑': [0, -1] }, vu = new Map([[String(r), []]]), file = [r];
  while (file.length) {
    const c = file.shift(), ch = vu.get(String(c));
    if (String(c) === String(e)) return ch;
    for (const [m, [dx, dy]] of Object.entries(D)) {
      const n = [c[0] + dx, c[1] + dy], k = String(n);
      if (n[0] < 0 || n[1] < 0 || n[0] >= N || n[1] >= N || obst.has(k) || vu.has(k)) continue;
      vu.set(k, [...ch, m]); file.push(n);
    }
  }
  return null;
}
function arrive(N, r, e, obst, prog) {
  const D = { '→': [1, 0], '←': [-1, 0], '↓': [0, 1], '↑': [0, -1] }; let c = r.slice();
  for (const m of prog) { const n = [c[0] + D[m][0], c[1] + D[m][1]]; if (n[0] < 0 || n[1] < 0 || n[0] >= N || n[1] >= N || obst.has(String(n))) return false; c = n; }
  return String(c) === String(e);
}
// « → → → ↑ ↑ » devient « 3→ 2↑ » (boucles, niveau génie)
function compresser(c) { const out = []; for (let i = 0; i < c.length;) { let j = i; while (j < c.length && c[j] === c[i]) j++; out.push((j - i > 1 ? j - i : '') + c[i]); i = j; } return out.join(' '); }
