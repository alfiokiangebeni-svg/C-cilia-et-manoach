// Robot : résout automatiquement les 70 parties × 3 âges = 210 manches dans le vrai jeu (Chromium).
// Chaque partie doit se terminer par la célébration, donner au moins une luciole, sans aucune erreur JavaScript.
// Usage : node test/toutes-les-parties.js [shots] [âge] [id1,id2…]
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
async function age(b, age, ids, shots) {
  const pg = await b.newPage({ viewport: { width: 800, height: 380 }, deviceScaleFactor: 1, hasTouch: true });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(a => { localStorage.clear(); Store.data.lang = 'fr'; Store.data.profiles = [Store.complet({ id: 'x', name: 'Test', avatar: 'kito', shirt: '#2ec4b6', age: a })]; Store.data.current = 'x'; Sound.on = false; }, age);
  await pg.addScriptTag({ content: SOLVER });
  const lignes = [];
  for (const id of ids) {
    await pg.evaluate(id => Play.start(id), id);
    let ok = false, last;
    for (let s = 0; s < 120; s++) {
      await pg.waitForTimeout(350);
      if (await pg.evaluate(() => document.getElementById('celebrate').classList.contains('on'))) { ok = true; break; }
      if (shots && s === 2) await pg.screenshot({ path: `${__dirname}/out/p_${age}_${id}.png` });
      last = await pg.evaluate(() => { try { return __step(); } catch (e) { return 'ERR ' + e.message; } });
      if (typeof last === 'string' && last.startsWith('ERR')) break;
    }
    const info = await pg.evaluate(id => ({ n: Store.lucioles(id), jeu: state.game, niv: state.lvl }), id);
    lignes.push(`${age} ${id} ${info.jeu}/${info.niv} ${ok && info.n > 0 ? 'OK' : 'FAIL ' + last} lucioles ${info.n}`);
    console.log(lignes[lignes.length - 1]);
    await pg.evaluate(() => { Celebrate.hide(); Play.stop(); });
  }
  const fin = await pg.evaluate(() => ({ total: Store.totalLucioles(), pages: Object.keys(Store.profile().livre).length }));
  await pg.close();
  return { lignes, errs, fin };
}
(async () => {
  const b = await chromium.launch();
  const ids = await (async () => { const pg = await b.newPage(); await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html')); const r = await pg.evaluate(() => PARTIES.map(p => p.id)); await pg.close(); return r; })();
  const shots = process.argv[2] === 'shots';
  const ages = process.argv[3] ? [+process.argv[3]] : [0, 1, 2];
  const liste = process.argv[4] ? process.argv[4].split(',') : ids;
  const res = await Promise.all(ages.map(a => age(b, a, liste, shots)));
  const toutes = res.flatMap(r => r.lignes), errs = res.flatMap(r => r.errs);
  res.forEach((r, k) => console.log(`âge ${ages[k]} : ${r.fin.total} lucioles, ${r.fin.pages} pages du livre`));
  console.log(`Manches réussies : ${toutes.filter(l => / OK /.test(l)).length} / ${toutes.length}`);
  console.log('ERR', JSON.stringify(errs));
  await b.close();
  if (toutes.some(l => / FAIL /.test(l)) || errs.length) process.exit(1);
})();
