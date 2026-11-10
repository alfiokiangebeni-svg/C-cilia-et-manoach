// Robot : résout automatiquement les 70 parties × 3 niveaux (CE2, CM1, génie) = 210 manches, puis les 28 entraînements de tables.
// Chaque partie doit se terminer par la célébration, donner au moins une luciole, sans aucune erreur JavaScript.
// Usage : node test/toutes-les-parties.js [shots] [âge] [parties id1,id2…] [matières id1,id2…] [village id1,id2…]
// Inclut aussi les 12 jeux du village aux 3 niveaux.
// Inclut aussi les 30 notions des autres matières (français, sciences, histoire-géo, EMC, anglais) aux 3 niveaux.
const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const SOLVER = `
window.__num = t => parseFloat(String(t).replace(/[\\s\\u202f]/g, '').replace('−', '-').replace(',', '.'));
window.__ev = s => Function('return (' + s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/[\\u202f]/g,'') + ')')();
window.__rep = txt => { if (Q_REPONSES.has(txt)) return Q_REPONSES.get(txt); const m = txt.match(/^(.*) = \\?$/); if (m && Q_REPONSES.has(m[1])) return Q_REPONSES.get(m[1]); return __ev(m ? m[1] : txt); };
window.__eq = (a, b) => (typeof a === 'number' && !isNaN(+b) && String(b).trim() !== '' ? Math.abs(a - b) < 1e-6 : String(a) === String(b));
window.__step = () => {
  const g = state.game, q = document.querySelector('.question');
  const qt = q ? q.textContent : '';
  const clickEl = e => { if (!e) return false; e.click(); return true; };
  if (g === 'race') { if (!qt) return 'noq'; const a = __rep(qt); return clickEl([...document.querySelectorAll('.lane-cloud')].find(c => __eq(a, c.dataset.v) && !c.classList.contains('good'))); }
  if (g === 'fish') { if (!qt) return 'noq'; const a = __rep(qt); return clickEl([...document.querySelectorAll('.fish')].find(c => __eq(a, c.dataset.v))); }
  if (g === 'feed') { const n = qt.match(/\\d+/g); const a = n[0] / n[1]; return clickEl([...document.querySelectorAll('.ans')].find(c => __eq(+c.dataset.v, a) && !c.classList.contains('good'))); }
  if (g === 'monster') {
    const bt = document.querySelector('.target-bubble').textContent; const m = bt.match(/\\? ([+×]) \\? = (.+)$/); if (!m) return 'busy';
    const T = __num(m[2]), tl = [...document.querySelectorAll('.tile:not(.used)')];
    for (const x of tl) for (const y of tl) if (x !== y && __eq(m[1] === '+' ? +x.dataset.v + +y.dataset.v : x.dataset.v * y.dataset.v, T)) { x.click(); y.click(); return true; }
    return 'nopair:' + bt;
  }
  if (g === 'link') { const l = document.querySelector('.link-col .node:not(.done)'); if (!l) return 'busy'; l.click(); return clickEl([...document.querySelectorAll('.node.res:not(.done)')].find(r => r.dataset.a === l.dataset.a)); }
  if (g === 'sort') {
    const txt = document.querySelector('.crate span').textContent.split(' = ')[0];
    const q = Q_OBJ.get(txt) || { ans: __num(txt) };
    return clickEl(document.querySelectorAll('.bin')[catQ(state.tri, q)]);
  }
  // Jeux du village : la réponse vient du texte de la question (ou de la clé posée sur la zone de jeu)
  const zone = document.getElementById('area'), cle = zone.dataset.cle;
  const viaCle = () => (cle && Q_OBJ.has(cle) ? Q_OBJ.get(cle) : null);
  if (['oiseaux', 'flair', 'route', 'scene'].includes(g)) {
    const txt = g === 'scene' ? document.querySelector('.hote-bulle').textContent : qt; if (!txt) return 'noq';
    const a = __rep(txt); return clickEl([...zone.querySelectorAll('[data-v]')].find(b => __eq(a, b.dataset.v) && !b.classList.contains('good')));
  }
  if (g === 'robot') { const q = viaCle(); if (!q) return 'noq'; return clickEl([...zone.querySelectorAll('.prog')].find(b => b.dataset.v === q.ans && !b.classList.contains('good'))); }
  if (g === 'afrique') {
    const q = viaCle(); if (!q) return 'noq';
    if (q.carte.mode === 'toucher') { const pth = zone.querySelector('path[data-id="' + q.ans + '"]'); if (pth.classList.contains('bon')) return 'busy'; pth.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; }
    return clickEl([...zone.querySelectorAll('.rep-carte')].find(b => b.dataset.v === q.ans && !b.classList.contains('good')));
  }
  if (g === 'memoire') {
    if (zone.querySelectorAll('.carte-mem.ouverte:not(.trouvee)').length) return 'busy';
    const libres = [...zone.querySelectorAll('.carte-mem:not(.trouvee)')]; if (!libres.length) return 'busy';
    const a = libres[0], b = libres.find(c => c !== a && c.dataset.k === a.dataset.k); a.click(); b.click(); return true;
  }
  if (g === 'dames') {
    const reps = [...zone.querySelectorAll('.rep-dames')];
    if (reps.length) { const a = __rep(qt); return clickEl(reps.find(b => __eq(a, b.dataset.v))); }
    const cible = zone.querySelector('.cd.cible'); if (cible) return clickEl(cible);
    const p = zone.querySelector('.pion.peut'); return p ? clickEl(p.parentElement) : 'busy';
  }
  if (g === 'color') {
    const z = [...document.querySelectorAll('.color-stage .zone')].find(z => !z.dataset.ok); if (!z) return 'busy';
    const i = z.dataset.i, v = __rep(document.getElementById('lbl' + i).textContent);
    const pal = [...document.querySelectorAll('.pal')].find(p => __eq(+p.dataset.v, v)); if (!pal) return 'nopal ' + v;
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
  const matieres = process.argv[5] ? process.argv[5].split(',') : process.argv[4] ? [] : await pg.evaluate(() => SUJETS.filter(S => S.id !== 'maths').flatMap(S => S.notions));
  for (const id of matieres) {
    await pg.evaluate(id => Play.matiere(id), id);
    let ok = false, last;
    for (let s = 0; s < 120; s++) {
      await pg.waitForTimeout(350);
      if (await pg.evaluate(() => document.getElementById('celebrate').classList.contains('on'))) { ok = true; break; }
      if (shots && s === 2) await pg.screenshot({ path: `${__dirname}/out/m_${age}_${id}.png` });
      last = await pg.evaluate(() => { try { return __step(); } catch (e) { return 'ERR ' + e.message; } });
      if (typeof last === 'string' && last.startsWith('ERR')) break;
    }
    lignes.push(`${age} matière ${id} ${ok ? 'OK' : 'FAIL ' + last}`); console.log(lignes[lignes.length - 1]);
    await pg.evaluate(() => { Celebrate.hide(); Play.stop(); });
  }
  const village = process.argv[6] ? process.argv[6].split(',') : process.argv[4] ? [] : await pg.evaluate(() => VILLAGE.map(v => v.id));
  for (const id of village) {
    await pg.evaluate(id => Play.village(id), id);
    let ok = false, last;
    for (let s = 0; s < 160; s++) {
      await pg.waitForTimeout(350);
      if (await pg.evaluate(() => document.getElementById('celebrate').classList.contains('on'))) { ok = true; break; }
      if (shots && s === 2) await pg.screenshot({ path: `${__dirname}/out/v_${age}_${id}.png` });
      last = await pg.evaluate(() => { try { return __step(); } catch (e) { return 'ERR ' + e.message; } });
      if (typeof last === 'string' && last.startsWith('ERR')) break;
    }
    lignes.push(`${age} village ${id} ${ok ? 'OK' : 'FAIL ' + last}`); console.log(lignes[lignes.length - 1]);
    await pg.evaluate(() => { Celebrate.hide(); Play.stop(); });
  }
  if (age === 1 && !process.argv[4]) for (const op of ['×', '÷']) for (let n = 0; n <= 13; n++) {
    await pg.evaluate(([op, n]) => Play.table(op, n), [op, n]);
    let ok = false, last;
    for (let s = 0; s < 120; s++) {
      await pg.waitForTimeout(350);
      if (await pg.evaluate(() => document.getElementById('celebrate').classList.contains('on'))) { ok = true; break; }
      last = await pg.evaluate(() => { try { return __step(); } catch (e) { return 'ERR ' + e.message; } });
      if (typeof last === 'string' && last.startsWith('ERR')) break;
    }
    lignes.push(`table ${op}${n || ' toutes'} ${ok ? 'OK' : 'FAIL ' + last}`); console.log(lignes[lignes.length - 1]);
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
  console.log(`Manches réussies : ${toutes.filter(l => / OK( |$)/.test(l)).length} / ${toutes.length}`);
  console.log('ERR', JSON.stringify(errs));
  await b.close();
  if (toutes.some(l => / FAIL /.test(l)) || errs.length) process.exit(1);
})();
