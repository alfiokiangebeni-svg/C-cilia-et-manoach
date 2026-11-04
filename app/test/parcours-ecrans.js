const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  const S = n => pg.screenshot({ path: `${__dirname}/out/${n}.png` });
  await pg.waitForTimeout(600); await S('01_home');
  await pg.click('#home-play', { force: true }); await pg.waitForTimeout(400); await S('02_lang');
  await pg.click('.lang-btn >> nth=0', { force: true }); await pg.waitForTimeout(400); await S('03_profiles');
  await pg.click('.profile-card.add', { force: true }); await pg.waitForTimeout(400); await S('04_create');
  await pg.click('#create-next', { force: true }); await pg.waitForTimeout(400); await S('05_age');
  await pg.click('.age-card >> nth=' + (process.argv[2] || 0), { force: true }); await pg.waitForTimeout(500); await S('06_hub');
  const games = ['race','fish','feed','monster','link','sort','color'];
  for (let g = 0; g < 7; g++) {
    await pg.evaluate(gi => { state.game = GAMES[gi].id; show('levels'); }, g);
    if (g === 0) { await pg.waitForTimeout(300); await S('07_levels'); }
    await pg.evaluate(() => Play.start(state.game, 0));
    await pg.waitForTimeout(1200); await S('g_' + games[g]);
  }
  await pg.evaluate(() => Play.stop());
  console.log('ERR', JSON.stringify(errs));
  await b.close();
})();
