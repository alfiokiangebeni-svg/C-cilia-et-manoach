const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => { LANG='fr'; applyLang(); Store.data.profiles = [Store.complet({ id: 'x', name: 'Test', avatar: 'nia', shirt: '#ff6b6b', age: 0 })]; Store.data.current = 'x'; Sound.on = false; });
  for (const [age,l] of [[0,0],[1,1],[2,2],[0,1],[2,1],[1,2]]) {
    await pg.evaluate(([age,l]) => { Store.profile().age = age; const pa = partie('10.3.2'); pa.niv = [l, l, l]; Play.start('10.3.2'); }, [age,l]);
    await pg.waitForTimeout(500); await pg.screenshot({ path: `${__dirname}/out/c_${age}${l}.png` });
  }
  console.log(JSON.stringify(errs)); await b.close();
})();
