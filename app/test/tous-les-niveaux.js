const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const SOLVER = `
window.__ev = s => Function('return (' + s.replace(/×/g,'*').replace(/÷/g,'/') + ')')();
window.__step = () => {
  const g = state.game, q = document.querySelector('.question');
  const qt = q ? q.textContent : '';
  const clickEl = e => { if (!e) return false; e.click(); return true; };
  if (g === 'race') { const m = qt.match(/^(.*) = \\?$/); if (!m) return 'noq'; const a = __ev(m[1]); return clickEl([...document.querySelectorAll('.lane-cloud')].find(c => +c.textContent === a && !c.classList.contains('good'))); }
  if (g === 'fish') { const m = qt.match(/^(.*) = \\?$/); if (!m) return 'noq'; const a = __ev(m[1]); return clickEl([...document.querySelectorAll('.fish')].find(c => +c.textContent.trim() === a)); }
  if (g === 'feed') { const n = qt.match(/\\d+/g); const a = n[0] / n[1]; return clickEl([...document.querySelectorAll('.ans')].find(c => +c.textContent === a && !c.classList.contains('good'))); }
  if (g === 'monster') {
    const bt = document.querySelector('.target-bubble').textContent; const m = bt.match(/\\? ([+×]) \\? = (\\d+)/); if (!m) return 'busy';
    const T = +m[2], tl = [...document.querySelectorAll('.tile:not(.used)')];
    for (const x of tl) for (const y of tl) if (x !== y && (m[1] === '+' ? +x.dataset.v + +y.dataset.v === T : x.dataset.v * y.dataset.v === T)) { x.click(); y.click(); return true; }
    return 'nopair:' + bt;
  }
  if (g === 'link') { const l = document.querySelector('.link-col .node:not(.done)'); if (!l) return 'busy'; l.click(); return clickEl([...document.querySelectorAll('.node.res:not(.done)')].find(r => r.dataset.a === l.dataset.a)); }
  if (g === 'sort') {
    const c = document.querySelector('.crate'); const txt = c.textContent.split('=')[0]; const v = __ev(txt);
    const rule = SORT_RULES[Store.profile().age][state.lvl]; const k = rule.type === 'lt' ? (v < rule.n ? 0 : 1) : (v % 2 ? 1 : 0);
    return clickEl(document.querySelectorAll('.bin')[k]);
  }
  if (g === 'color') {
    const z = [...document.querySelectorAll('.color-stage .zone')].find(z => !z.dataset.ok); if (!z) return 'busy';
    const i = z.dataset.i, v = __ev(document.getElementById('lbl' + i).textContent);
    const pal = [...document.querySelectorAll('.pal')].find(p => +p.textContent === v); if (!pal) return 'nopal ' + v;
    pal.click(); z.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 })); return true;
  }
}`;
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 1, hasTouch: true });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => { Store.data.lang = 'fr'; Store.data.profiles = [{ id: 'x', name: 'Test', avatar: 'kito', shirt: '#2ec4b6', age: 0, stars: {}, zoo: [], pages: {} }]; Store.data.current = 'x'; Sound.on = false; });
  await pg.addScriptTag({ content: SOLVER });
  const games = ['race','fish','feed','monster','link','sort','color'];
  const shots = process.argv[2] === 'shots';
  const ages = process.argv[3] ? [+process.argv[3]] : [0,1,2]; const gl = process.argv[4] ? process.argv[4].split(',') : games;
  for (const age of ages) for (const g of gl) for (let l = 0; l < 3; l++) {
    await pg.evaluate(([age,g,l]) => { Store.profile().age = age; state.game = g; Play.start(g, l); }, [age,g,l]);
    let ok = false, last;
    for (let s = 0; s < 80; s++) {
      await pg.waitForTimeout(g === 'feed' ? 800 : 500);
      if (await pg.evaluate(() => document.getElementById('celebrate').classList.contains('on'))) { ok = true; break; }
      if (shots && s === 1 && (age===1 || l===2)) await pg.screenshot({ path: `${__dirname}/out/p_${age}_${g}_${l}.png` });
      last = await pg.evaluate(() => { try { return __step(); } catch (e) { return 'ERR ' + e.message; } });
      if (typeof last === 'string' && last.startsWith('ERR')) break;
    }
    const st = await pg.evaluate(([g,age,l]) => Store.stars(g, age, l), [g,age,l]);
    if (shots && age===0 && g==='race' && l===0) { await pg.waitForTimeout(2500); await pg.screenshot({ path: __dirname + '/out/cel.png' }); }
    console.log(age, g, l, ok ? 'OK' : 'FAIL ' + last, 'stars', st);
    await pg.evaluate(() => { Celebrate.hide(); Play.stop(); });
  }
  console.log('zoo', await pg.evaluate(() => Store.profile().zoo.join('')));
  console.log('ERR', JSON.stringify(errs));
  await b.close();
})();
