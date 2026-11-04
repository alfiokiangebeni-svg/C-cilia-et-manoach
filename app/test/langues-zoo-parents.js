const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => { Store.data.profiles = [{ id: 'x', name: 'Malik', avatar: 'malik', shirt: '#06d6a0', age: 1, stars: {'1.race.0':3,'1.race.1':2,'1.fish.0':1}, zoo: ['🦁','🐘','🦒','🦓','🐒','🦛','🐊','🦜'], pages: {lion:true, turtle:true} }]; Store.data.current = 'x'; Sound.on = false; });
  const S = n => pg.screenshot({ path: `${__dirname}/out/z_${n}.png` });
  await pg.evaluate(() => { LANG='zh'; applyLang(); show('hub'); }); await pg.waitForTimeout(400); await S('1hub_zh');
  await pg.evaluate(() => { LANG='ln'; applyLang(); show('zoo'); }); await pg.waitForTimeout(400); await S('2zoo_ln');
  await pg.evaluate(() => { LANG='de'; applyLang(); Free.open(COLOR_PAGES[1]); }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const z=[...document.querySelectorAll('#free-stage .zone')]; const c=['#8ac926','#ff595e','#1982c4','#ffca3a','#6a4c93','#f15bb5','#2a9d8f','#ff924c']; z.forEach((e,i)=>e.setAttribute('fill',c[i%8])); }); await S('3free_de');
  await pg.evaluate(() => { LANG='pt'; applyLang(); show('hub'); parentGate(parentPanel); }); await pg.waitForTimeout(300); await S('4gate');
  await pg.evaluate(() => parentPanel()); await pg.waitForTimeout(300); await S('5panel');
  await pg.evaluate(() => { Modal.close(); LANG='es'; applyLang(); state.game='race'; state.lvl=1; Celebrate.show(2,'🦓',{race:false}); }); await pg.waitForTimeout(2600); await S('6cel_es');
  console.log(JSON.stringify(errs)); await b.close();
})();
