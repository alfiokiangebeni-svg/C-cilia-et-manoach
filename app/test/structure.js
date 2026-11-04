// Test de structure (sans navigateur) : 10 chapitres, 30 stages, 70 parties ;
// chaque partie a une mécanique existante et des paramètres pour les 3 âges ;
// chaque image de assets.json existe ou a une silhouette de remplacement.
const fs = require('fs'), path = require('path'), vm = require('vm');
const www = path.resolve(__dirname, '../www');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(www + '/js/histoire.js', 'utf8') + ';Object.assign(this,{CHAPITRES,MECANIQUES,PERSONNAGES,PAGES_LIVRE});', ctx);
const { CHAPITRES, MECANIQUES, PERSONNAGES, PAGES_LIVRE } = ctx;
const jeux = fs.readFileSync(www + '/js/games.js', 'utf8');
const existe = id => new RegExp(`GAME_FN\\.${id}\\s*=`).test(jeux) || fs.existsSync(`${www}/js/mecaniques/${id}.js`);
const erreurs = [], ok = (c, m) => { if (!c) erreurs.push(m); };

ok(CHAPITRES.length === 10, `10 chapitres attendus, ${CHAPITRES.length} trouvés`);
let stages = 0, parties = 0; const ids = new Set();
CHAPITRES.forEach((ch, ci) => {
  ok(ch.id === ci + 1, `chapitre ${ci + 1} : id ${ch.id}`);
  ok(ch.titre && ch.titre.fr && ch.titre.en, `chapitre ${ch.id} : titre fr/en`);
  ok(Array.isArray(ch.pages) && ch.pages.length > 0, `chapitre ${ch.id} : aucune page du livre débloquée`);
  ok(ch.stages.length === 3, `chapitre ${ch.id} : 3 stages attendus`);
  const n = ch.stages.reduce((a, s) => a + s.parties.length, 0);
  ok(n === 7, `chapitre ${ch.id} : 7 parties attendues, ${n}`);
  ch.stages.forEach((st, si) => {
    stages++;
    ok(st.id === `${ch.id}.${si + 1}`, `stage ${st.id} : id attendu ${ch.id}.${si + 1}`);
    ok(st.parties.length === (si === 2 ? 3 : 2), `stage ${st.id} : ${si === 2 ? 3 : 2} parties attendues`);
    ok(PERSONNAGES[st.guide], `stage ${st.id} : guide inconnu ${st.guide}`);
    ok(st.intro && st.intro.fr && st.intro.en, `stage ${st.id} : intro fr/en`);
    st.parties.forEach((pa, pi) => {
      parties++;
      ok(pa.id === `${st.id}.${pi + 1}`, `partie ${pa.id} : id attendu ${st.id}.${pi + 1}`);
      ok(!ids.has(pa.id), `partie ${pa.id} en double`); ids.add(pa.id);
      const M = MECANIQUES[pa.meca];
      ok(M, `partie ${pa.id} : mécanique inconnue ${pa.meca}`);
      if (M) {
        ok(existe(pa.meca) || existe(M.base), `partie ${pa.id} : ni GAME_FN.${pa.meca} ni le jeu de base ${M.base}`);
        ok(Array.isArray(M.ages) && M.ages.length === 3, `mécanique ${pa.meca} : paramètres pour 3 âges`);
      }
      ok(Array.isArray(pa.niv) && pa.niv.length === 3 && pa.niv.every(v => v >= 0 && v <= 2), `partie ${pa.id} : niv pour les 3 âges (0-2)`);
      ok(pa.titre && pa.titre.fr && pa.titre.en, `partie ${pa.id} : titre fr/en`);
    });
  });
});
ok(stages === 30, `30 stages attendus, ${stages}`);
ok(parties === 70, `70 parties attendues, ${parties}`);
// Les 12 pages du livre (+ dédicace) sont toutes débloquables
const debloq = new Set(CHAPITRES.flatMap(c => c.pages).map(String));
PAGES_LIVRE.forEach(p => ok(debloq.has(String(p.id)), `page du livre ${p.id} jamais débloquée`));
ok(PAGES_LIVRE.filter(p => typeof p.id === 'number').length === 12, '12 pages du livre attendues');

// Images : chaque entrée existe ou a une silhouette
const A = JSON.parse(fs.readFileSync(www + '/img/assets.json', 'utf8'));
let presentes = 0, silhouettes = 0;
A.persos.forEach(e => {
  if (fs.existsSync(`${www}/${e.fichier}`)) { presentes++; ok(fs.statSync(`${www}/${e.fichier}`).size <= 80 * 1024, `${e.fichier} > 80 Ko`); }
  else { ok(PERSONNAGES[e.perso], `${e.fichier} : ni image ni silhouette`); silhouettes++; }
});
Object.entries(PERSONNAGES).forEach(([id, P]) => P.poses.forEach(pose => ok(A.persos.some(e => e.perso === id && e.pose === pose), `assets.json : pose manquante ${id}/${pose}`)));
A.scenes.forEach(e => { if (fs.existsSync(`${www}/${e.fichier}`)) ok(fs.statSync(`${www}/${e.fichier}`).size <= 250 * 1024, `${e.fichier} > 250 Ko`); });

console.log(`Structure : ${CHAPITRES.length} chapitres, ${stages} stages, ${parties} parties`);
console.log(`Images : ${presentes} sprites présents, ${silhouettes} remplacés par une silhouette, ${A.scenes.length} scènes attendues`);
if (erreurs.length) { erreurs.forEach(e => console.log('FAIL', e)); process.exit(1); }
console.log('STRUCTURE OK');
