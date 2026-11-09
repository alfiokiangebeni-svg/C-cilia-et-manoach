// Parcours complet de l'interface V2 avec captures : accueil → langue → profil → personnage → âge → carte
// → chapitre → stage → une partie par jeu V1 rhabillé → célébration de fin de chapitre → Mon livre.
// Usage : node test/parcours-ecrans.js [âge] [largeur×hauteur] [dossier]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [W, H] = (process.argv[3] || '800x380').split('x').map(Number);
const out = path.resolve(process.argv[4] || __dirname + '/out'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +(process.env.DSF || 2), hasTouch: true });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await pg.goto('file://' + path.resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => localStorage.clear()); await pg.reload();
  const jpg = !!process.argv[4]; // captures de la doc : JPEG (décors photographiques lourds en PNG)
  const S = n => pg.screenshot(jpg ? { path: `${out}/${n}.jpg`, type: 'jpeg', quality: 80 } : { path: `${out}/${n}.png` });
  const go = async (sel, n, ms = 500) => { await pg.click(sel, { force: true }); await pg.waitForTimeout(ms); if (n) await S(n); };
  await pg.waitForTimeout(600); await S('01_accueil');
  await go('#home-play', '02_langue');
  await go('.lang-btn >> nth=0', '03_profils');
  await go('.profile-card.add', '04_personnage');
  await go('#create-next', '05_niveau');
  await go('.age-card >> nth=' + (process.argv[2] || 0), '06_carte', 700);
  await go('.chap-card >> nth=0', '07_chapitre');
  await go('.stage-card >> nth=0', '08_stage');
  // Une partie par jeu V1 rhabillé
  const ex = { race: '2.2.1', fish: '6.2.1', feed: '1.2.2', monster: '4.2.2', link: '1.3.2', sort: '1.1.2', color: '10.3.2' };
  for (const [jeu, id] of Object.entries(ex)) { await pg.evaluate(id => Play.start(id), id); await pg.waitForTimeout(1200); await S(`09_partie_${id}_${jeu}`); }
  await pg.evaluate(() => Play.stop());
  // Chapitre 1 terminé : fête de fin de chapitre et page du livre
  await pg.evaluate(() => { CHAPITRES[0].stages.forEach(s => s.parties.forEach(p => { if (p.id !== '1.3.3') Store.setLucioles(p.id, 2); })); Play.start('1.3.3'); Play.finish({}); });
  await pg.waitForTimeout(2800); await S('10_fin_chapitre');
  await pg.evaluate(() => { Celebrate.hide(); Play.stop(); show('hub'); }); await pg.waitForTimeout(600); await S('11_carte_progres');
  await pg.evaluate(() => show('livre')); await pg.waitForTimeout(500); await S('12_livre');
  await go('.livre-cell >> nth=1', '13_page_livre');
  await pg.evaluate(() => Modal.close());
  await pg.evaluate(() => { Store.profile().tables = { '×2': 3, '×7': 2, '÷5': 1 }; show('tables'); }); await pg.waitForTimeout(500); await S('14_tables');
  await pg.evaluate(() => Play.table('×', 13)); await pg.waitForTimeout(1300); await S('15_table_x13');
  await pg.evaluate(() => Play.table('÷', 12)); await pg.waitForTimeout(1300); await S('16_table_div12');
  await pg.evaluate(() => { Play.stop(); Store.profile().age = 2; Play.start('7.3.3'); }); await pg.waitForTimeout(1300); await S('17_genie_probleme');
  await pg.evaluate(() => { Play.stop(); show('home'); });
  console.log('ERR', JSON.stringify(errs));
  await b.close();
  if (errs.length) process.exit(1);
})();
