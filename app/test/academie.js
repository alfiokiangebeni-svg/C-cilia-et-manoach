// Académie scolaire : robot qui suit l'interface réelle (Playwright).
// - contrôle des données : 6 classes, matières, leçons complètes, banques (une seule bonne réponse, explication, images présentes)
// - chaque leçon : quiz de 5 questions résolu par l'interface → 20/20, leçon validée
// - échec (< 14/20) : on revoit la leçon et 5 nouvelles questions sont tirées
// - verrouillage : leçon suivante fermée tant que la précédente n'est pas validée ; classe supérieure fermée
// - examen de fin d'année (passage en classe supérieure), examens blancs ENAFEP, test de positionnement
// - bulletin, récompenses, tableau de bord parent, migration d'un ancien profil
// Usage : node test/academie.js [captures]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = path.resolve(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
const SHOTS = process.argv[2] === 'captures';
const ERR = [], log = (ok, msg) => { console.log((ok ? 'OK  ' : 'ERR ') + msg); if (!ok) ERR.push(msg); };

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 1, hasTouch: true });
  pg.on('pageerror', e => ERR.push('pageerror ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) ERR.push('console ' + m.text()); });
  const www = path.resolve(__dirname, '../www');
  await pg.goto('file://' + www + '/index.html');
  await pg.evaluate(() => localStorage.clear()); await pg.reload(); await pg.waitForTimeout(300);
  const S = async n => { if (SHOTS) await pg.screenshot({ path: `${out}/acad_${n}.png` }); };

  // ---------- 1. Données ----------
  const D = await pg.evaluate(() => {
    const err = [], parClasse = {};
    CLASSES_ACAD.forEach(C => { parClasse[C.n] = {}; MATIERES_ACAD.forEach(M => { const n = leconsDe(C.n, M.id).length; parClasse[C.n][M.id] = n; if (!n) err.push(`${C.n} ${M.id} sans leçon`); }); });
    LECONS_ACAD.forEach(l => {
      ['titre', 'objectif', 'explication', 'exemple'].forEach(k => { if (!l[k] || l[k].length < 5) err.push(l.id + ' ' + k); });
      l.src.forEach(s => { if (s.b && !BANQUES[s.b]) err.push(l.id + ' banque ' + s.b); if (s.g && !GEN[s.g]) err.push(l.id + ' gen ' + s.g); if (s.a && !GEN_ACAD[s.a]) err.push(l.id + ' acad ' + s.a); });
    });
    const imgs = new Set(); let nb = 0;
    Object.entries(BANQUES).forEach(([k, B]) => {
      if (B.length < 8) err.push(`banque ${k} : ${B.length} questions (< 8)`);
      B.forEach(([q, r, f, e, im]) => {
        nb++;
        if (!q || !r || !Array.isArray(f) || !f.length || !e) err.push(`${k} incomplète : ${q}`);
        if (f.includes(r)) err.push(`${k} bonne réponse parmi les mauvaises : ${q}`);
        if (new Set(f).size !== f.length) err.push(`${k} doublon : ${q}`);
        if (im) imgs.add(im);
      });
      const cles = B.map(x => x[0] + '|' + x[1]); if (new Set(cles).size !== cles.length) err.push(`${k} question en double`);
    });
    const banquesUtilisees = new Set(LECONS_ACAD.flatMap(l => l.src.filter(s => s.b).map(s => s.b)));
    Object.keys(BANQUES).forEach(k => { if (!banquesUtilisees.has(k)) err.push(`banque ${k} jamais utilisée`); });
    return { err, parClasse, lecons: LECONS_ACAD.length, banques: Object.keys(BANQUES).length, questions: nb, imgs: [...imgs] };
  });
  D.imgs.forEach(i => { if (!fs.existsSync(`${www}/img/${i}.webp`)) D.err.push('image absente ' + i); });
  log(!D.err.length, `données : ${D.lecons} leçons, ${D.banques} banques, ${D.questions} questions écrites ${D.err.length ? JSON.stringify(D.err.slice(0, 10)) : ''}`);
  Object.entries(D.parClasse).forEach(([c, m]) => console.log(`    ${c}e : ` + Object.entries(m).map(([k, v]) => `${k} ${v}`).join(' · ')));

  // ---------- 2. Création d'un profil en 3e primaire ----------
  await pg.click('#home-play', { force: true }); await pg.waitForTimeout(250);
  await pg.click('.lang-btn >> nth=0', { force: true }); await pg.waitForTimeout(250);
  await pg.click('.profile-card.add', { force: true }); await pg.waitForTimeout(250);
  await pg.fill('#name-input', 'Kiese'); await pg.click('#create-next', { force: true }); await pg.waitForTimeout(250);
  await S('01_classes');
  await pg.click('.age-card[data-classe="3"]', { force: true }); await pg.waitForTimeout(400);
  log(await pg.evaluate(() => current === 'academie' && Acad.classe() === 3 && Store.profile().age === 0), 'profil créé en 3e primaire → écran Académie');
  await S('02_academie');
  log(await pg.evaluate(() => !Acad.classeOuverte(4) && Acad.classeOuverte(1)), '4e primaire fermée, classes inférieures ouvertes');

  // Outil : répondre à la question courante (juste ou faux) par l'interface
  const repondre = async juste => {
    const q = await pg.evaluate(() => { const S = acadState.session, q = S.qs[S.i]; return { ans: q.ans, opts: q.opts, saisie: !!q.saisie, num: q.num }; });
    if (q.saisie) {
      const v = juste ? String(q.num).replace('.', ',') : '9999999';
      for (const ch of v) await pg.click(`#acad-quiz .touche[data-k="${ch}"]`, { force: true });
      await pg.click('#aq-ok', { force: true });
    } else {
      const choix = juste ? q.ans : q.opts.find(o => o !== q.ans);
      await pg.evaluate(c => [...document.querySelectorAll('#acad-quiz .opt')].find(b => b.dataset.o === c).click(), choix);
    }
    const suite = await pg.$('#aq-suite'); if (suite) await suite.click(); else await pg.waitForTimeout(300);
  };
  const faireQuiz = async (juste, n) => { for (let i = 0; i < n; i++) await repondre(typeof juste === 'function' ? juste(i) : juste); await pg.waitForTimeout(150); };

  // ---------- 3. Verrouillage et échec ----------
  await pg.click('#academie [data-mat="ma"]', { force: true }); await pg.waitForTimeout(300);
  await S('03_matiere');
  log(await pg.evaluate(() => !Acad.leconOuverte('3-ma-2-1') && Acad.leconOuverte('3-ma-1-1')), 'leçon 2 fermée tant que la leçon 1 n’est pas validée');
  await pg.click('[data-lecon="3-ma-1-1"]', { force: true }); await pg.waitForTimeout(300); await S('04_lecon');
  await pg.click('#lec-quiz', { force: true }); await pg.waitForTimeout(200); await S('05_question');
  const premieres = await pg.evaluate(() => acadState.session.qs.map(q => q.key));
  await faireQuiz(i => i < 3, 5); // 3 bonnes, 2 fausses → 12/20
  await S('06_resultat_echec');
  const r1 = await pg.evaluate(() => ({ note: acadState.resultat.note, valide: Acad.valide('3-ma-1-1'), btn: !!document.querySelector('#rs-lecon') && !!document.querySelector('#rs-encore'), corr: document.querySelectorAll('.corr.ko .explication').length }));
  log(r1.note === 12 && !r1.valide && r1.btn && r1.corr === 2, `échec 12/20 : non validée, « Revoir la leçon » et « 5 nouvelles questions », 2 explications (${JSON.stringify(r1)})`);
  await pg.click('#rs-encore', { force: true }); await pg.waitForTimeout(200);
  const secondes = await pg.evaluate(() => acadState.session.qs.map(q => q.key));
  const communes = secondes.filter(k => premieres.includes(k)).length;
  log(communes === 0, `nouveau quiz : ${communes} question(s) déjà posée(s)`);
  await faireQuiz(true, 5);
  log(await pg.evaluate(() => acadState.resultat.note === 20 && Acad.valide('3-ma-1-1') && Acad.leconOuverte('3-ma-2-1') && !!Store.profile().academie.badges.persevere), 'réussite 20/20 : validée, leçon suivante ouverte, badge « Persévérant »');
  await S('07_resultat_reussite');

  // ---------- 4. Toutes les leçons des 6 classes par l'interface ----------
  await pg.evaluate(() => { Store.profile().academie.ordreLibre = true; Store.save(); });
  const ids = await pg.evaluate(() => LECONS_ACAD.map(l => l.id));
  let ok = 0; const rates = [];
  for (const id of ids) {
    await pg.evaluate(id => { acadState.lecon = id; acadState.classe = leconAcad(id).classe; show('acad-lecon'); }, id);
    await pg.click('#lec-quiz', { force: true });
    const n = await pg.evaluate(() => acadState.session.qs.length);
    await faireQuiz(true, n);
    const r = await pg.evaluate(id => ({ note: acadState.resultat.note, v: Acad.valide(id) }), id);
    if (n === 5 && r.note === 20 && r.v) ok++; else rates.push(`${id} n=${n} ${JSON.stringify(r)}`);
  }
  log(ok === ids.length, `leçons réussies par l’interface : ${ok} / ${ids.length} ${rates.slice(0, 5).join(' ; ')}`);

  // ---------- 5. Examen de fin d'année, ENAFEP, positionnement ----------
  await pg.evaluate(() => { Store.profile().academie.ordreLibre = false; Store.profile().academie.classe = 3; Store.save(); acadState.classe = 3; show('academie'); });
  await pg.click('#ac-exam', { force: true }); await pg.waitForTimeout(200); await S('08_examen');
  await faireQuiz(i => i !== 0, 20);
  const ex = await pg.evaluate(() => ({ note: acadState.resultat.note, classe: Acad.classe(), monte: acadState.resultat.monte }));
  log(ex.note === 19 && ex.classe === 4 && ex.monte, `examen de 3e : ${ex.note}/20, passage en 4e`);
  await S('09_examen_resultat');
  await pg.evaluate(() => { Store.profile().academie.classe = 6; acadState.classe = 6; show('academie'); }); await pg.waitForTimeout(200);
  await pg.click('#ac-enafep', { force: true }); await pg.waitForTimeout(200); await S('10_enafep');
  for (const dom of ['fr', 'ma', 'cg']) {
    await pg.click(`#acad-enafep [data-dom="${dom}"]`, { force: true }); await pg.waitForTimeout(150);
    const n = await pg.evaluate(() => acadState.session.qs.length);
    await faireQuiz(i => i % 4 !== 0, n);
    const r = await pg.evaluate(() => ({ note: acadState.resultat.note, avert: document.querySelector('#acad-resultat').textContent.includes('pas une épreuve officielle') }));
    log(n === 20 && r.note === 15 && r.avert, `ENAFEP blanc ${dom} : ${n} questions, ${r.note}/20, avertissement non officiel`);
    await pg.click('#rs-home', { force: true }); await pg.waitForTimeout(150);
  }
  log(await pg.evaluate(() => document.querySelectorAll('#acad-enafep .acad-table tr').length === 4), 'historique ENAFEP : 3 examens blancs');
  await S('11_enafep_historique');
  await pg.evaluate(() => show('academie')); await pg.click('#ac-diag', { force: true }); await pg.waitForTimeout(150);
  // réussit les classes 1 et 2, échoue en 3e → classe conseillée : 3e
  let cl = 1;
  for (let guard = 0; guard < 30 && (await pg.evaluate(() => current)) === 'acad-quiz'; guard++) {
    cl = await pg.evaluate(() => acadState.session.classeDiag);
    await repondre(cl < 3);
  }
  const dg = await pg.evaluate(() => ({ conseil: acadState.resultat.conseil, classe: Acad.classe(), badge: !!Store.profile().academie.badges.positionne }));
  log(dg.conseil === 3 && dg.classe === 3 && dg.badge, `positionnement : classe conseillée ${dg.conseil}e`);
  await S('12_positionnement');

  // ---------- 6. Bulletin, récompenses, tableau de bord ----------
  await pg.evaluate(() => show('acad-bulletin')); await pg.waitForTimeout(200); await S('13_bulletin');
  const bu = await pg.evaluate(() => { const B = Acad.bulletin(); return { moy: B.moy, n: document.querySelectorAll('.bul-notes tr').length, txt: document.querySelector('#bulletin-doc').textContent }; });
  log(bu.moy > 0 && bu.n > 5 && /Moyenne générale/.test(bu.txt) && /Kiese/.test(bu.txt), `bulletin : moyenne ${bu.moy}, ${bu.n - 1} matières`);
  await pg.evaluate(() => { window.print = () => { window.__imprime = true; }; }); await pg.click('#bul-print', { force: true });
  log(await pg.evaluate(() => window.__imprime === true), 'bouton Imprimer / PDF');
  await pg.evaluate(() => show('acad-recompenses')); await pg.waitForTimeout(200); await S('14_recompenses');
  const rc = await pg.evaluate(() => { const R = Acad.recompenses(); return { b: R.badges.length, d: R.diplomes.length, t: R.trophees.length, m: R.medailles.length }; });
  log(rc.b >= 8 && rc.d === 1 && rc.t > 50 && rc.m > 100, `récompenses : ${JSON.stringify(rc)}`);
  await pg.evaluate(() => show('academie')); await pg.click('#ac-parents', { force: true }); await pg.waitForTimeout(150);
  await pg.evaluate(() => { const t = document.querySelector('.gate-q').textContent.match(/(\d+) × (\d+)/); [...document.querySelectorAll('#modal-box [data-v]')].find(b => +b.dataset.v === t[1] * t[2]).click(); });
  await pg.waitForTimeout(250); await S('15_suivi');
  log(await pg.evaluate(() => current === 'acad-suivi' && /Recommandations/.test(document.querySelector('#acad-suivi').textContent)), 'tableau de bord parent derrière la porte de sécurité');

  // ---------- 7. Retour et anciens jeux ----------
  await pg.evaluate(() => show('academie')); await pg.click('#ac-jeux', { force: true }); await pg.waitForTimeout(200);
  log(await pg.evaluate(() => current === 'hub' && document.querySelectorAll('.chap-card').length >= 14), 'histoire, village, matières et tables toujours accessibles');
  await pg.evaluate(() => goBack());
  log(await pg.evaluate(() => current === 'academie'), 'retour de la carte vers l’académie');

  // ---------- 8. Migration d'un ancien profil (V2.4, sans académie) ----------
  await pg.evaluate(() => localStorage.setItem('cm.v2', JSON.stringify({ version: 2, lang: 'fr', sound: false, current: 'a', profiles: [{ id: 'a', name: 'Ancien', avatar: 'lion', age: 1, lucioles: { '1.1.1': 3 }, tables: { '×7': 2 } }] })));
  await pg.reload(); await pg.waitForTimeout(300);
  const mg = await pg.evaluate(() => { const p = Store.data.profiles[0]; return { classe: p.academie.classe, luc: p.lucioles['1.1.1'], tab: p.tables['×7'] }; });
  log(mg.classe === 4 && mg.luc === 3 && mg.tab === 2, `migration : ancien profil CM1 → 4e primaire, progression conservée`);

  await b.close();
  console.log(`\nAcadémie : ${ERR.length ? 'ÉCHEC' : 'OK'}`);
  console.log('ERR', JSON.stringify(ERR.slice(0, 20)));
  process.exit(ERR.length ? 1 : 0);
})();
