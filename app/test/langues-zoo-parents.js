// Langues (anglais complet, autres langues → repli anglais), Mon livre, coloriage libre, porte et espace parents, célébration.
const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => { Store.data.profiles = [Store.complet({ id: 'x', name: 'Malik', avatar: 'malik', shirt: '#06d6a0', age: 1, lucioles: { '1.1.1': 3, '1.1.2': 2, '1.2.1': 1 }, livre: { 1: true, 2: true }, coloriages: { lion: true, turtle: true } })]; Store.data.current = 'x'; Sound.on = false; });
  const S = n => pg.screenshot({ path: `${__dirname}/out/z_${n}.png` });
  await pg.evaluate(() => { LANG = 'en'; applyLang(); show('hub'); }); await pg.waitForTimeout(500); await S('1carte_en');
  await pg.evaluate(() => { LANG = 'ln'; applyLang(); state.stage = '1.1'; show('stage'); }); await pg.waitForTimeout(500); await S('2stage_ln');
  await pg.evaluate(() => { LANG = 'zh'; applyLang(); show('livre'); }); await pg.waitForTimeout(400); await S('3livre_zh');
  await pg.evaluate(() => { LANG = 'de'; applyLang(); Free.open(COLOR_PAGES[1]); }); await pg.waitForTimeout(300); await S('4free_de');
  await pg.evaluate(() => { LANG = 'pt'; applyLang(); show('hub'); parentGate(parentPanel); }); await pg.waitForTimeout(300); await S('5gate');
  await pg.evaluate(() => parentPanel()); await pg.waitForTimeout(300); await S('6panel');
  await pg.evaluate(() => { Modal.close(); LANG = 'es'; applyLang(); state.partie = '1.2.1'; Celebrate.show(2, [1], { race: false }, CHAPITRES[7]); }); await pg.waitForTimeout(2600); await S('7cel_es');
  console.log(JSON.stringify(errs)); await b.close();
})();
