// Cécilia & Manoach — navigation (carte → chapitre → stage → partie), profils, contrôleur de partie, célébrations, espace parents
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let current = 'home';
const state = { chap: null, stage: null, partie: null, game: null, lvl: 0, draft: null };

// ---------------- Parcours de l'histoire (dérivé des données de histoire.js) ----------------
const PARTIES = []; // les 70 parties, dans l'ordre de l'histoire
CHAPITRES.forEach(ch => ch.stages.forEach(st => st.parties.forEach(pa => PARTIES.push(Object.assign({ ch, st }, pa)))));
const partie = id => PARTIES.find(p => p.id === id);
const chapitre = id => CHAPITRES.find(c => c.id === id);
const stageDe = id => { for (const c of CHAPITRES) { const s = c.stages.find(x => x.id === id); if (s) return s; } return null; };
// Une partie s'ouvre quand la précédente a au moins une luciole
const ouverte = id => { const k = PARTIES.findIndex(p => p.id === id); return k <= 0 || Store.lucioles(PARTIES[k - 1].id) > 0; };
const lucStage = st => st.parties.reduce((a, p) => a + Store.lucioles(p.id), 0);
const lucChap = ch => ch.stages.reduce((a, s) => a + lucStage(s), 0);
const nbParties = ch => ch.stages.reduce((a, s) => a + s.parties.length, 0);
const chapFini = ch => ch.stages.every(s => s.parties.every(p => Store.lucioles(p.id) > 0));
// Personnages rencontrés jusqu'à ce chapitre (pour la fête de fin de chapitre)
function amisJusqua(ch) {
  const set = new Set(['cecilia', 'manoach']);
  CHAPITRES.filter(c => c.id <= ch.id).forEach(c => {
    if (c.id >= 3) set.add('etoile');
    c.stages.forEach(s => set.add(s.guide));
    if (c.ami) set.add(c.ami); (c.amis || []).forEach(a => set.add(a));
  });
  return [...set];
}

function show(id) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  current = id;
  if (RENDER[id]) RENDER[id]();
}
function applyLang() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
  $('#name-input').placeholder = t('yourName');
}
const avOf = p => Object.assign({}, AVATARS.find(a => a.id === p.avatar) || AVATARS[0], { shirt: p.shirt });
const starStr = s => '★'.repeat(s) + '☆'.repeat(3 - s);
const lockShake = b => { Sound.bad(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); floatText(innerWidth / 2, innerHeight * .2, t('locked'), 'bad'); };

// ---------------- Rendus des écrans ----------------
const RENDER = {
  home() {
    $('#logo').innerHTML = 'Cécilia & Manoach'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    $('#home-av1').innerHTML = Assets.perso('cecilia', 'contente', 'avatar');
    $('#home-av2').innerHTML = Assets.perso('manoach', 'content', 'avatar');
    $('#home-sound').textContent = Store.data.sound ? '🔊' : '🔇';
    $('#home-lang').textContent = (LANGS.find(l => l.code === LANG) || LANGS[0]).flag;
  },
  lang() {
    const g = $('#lang-grid'); g.innerHTML = '';
    LANGS.forEach(l => {
      const b = h('button', 'lang-btn' + (l.code === LANG ? ' sel' : ''), `<span class="flag">${l.flag}</span>${l.name}`);
      b.onclick = () => { Sound.init(); Sound.tap(); LANG = l.code; Store.data.lang = l.code; Store.save(); applyLang(); show('profiles'); };
      g.append(b);
    });
  },
  profiles() {
    const box = $('#profile-list'); box.innerHTML = '';
    Store.data.profiles.forEach(p => {
      const c = h('button', 'profile-card', `${avatarSVG(avOf(p))}<div class="nm">${esc(p.name)}</div><div class="st">✨ ${Store.totalLucioles(p)} · ${AGES[p.age].range} ${t('years')}</div>`);
      c.onclick = () => { Sound.tap(); Store.data.current = p.id; Store.save(); show('hub'); };
      box.append(c);
    });
    if (Store.data.profiles.length < 4) {
      const add = h('button', 'profile-card add', '＋'); add.onclick = () => { Sound.tap(); state.draft = { avatar: AVATARS[0].id, shirt: AVATARS[0].shirt, name: '' }; $('#name-input').value = ''; show('create'); };
      box.append(add);
    }
  },
  create() {
    const d = state.draft, ap = $('#avatar-pick'), sp = $('#shirt-pick'); ap.innerHTML = ''; sp.innerHTML = '';
    AVATARS.forEach(a => {
      const b = h('button', a.id === d.avatar ? 'sel' : '', avatarSVG(Object.assign({}, a, { shirt: a.id === d.avatar ? d.shirt : a.shirt })));
      b.onclick = () => { Sound.tap(); d.avatar = a.id; d.shirt = a.shirt; if (!$('#name-input').value || AVATARS.some(x => x.name === $('#name-input').value)) $('#name-input').value = a.name; RENDER.create(); };
      ap.append(b);
    });
    SHIRTS.forEach(c => { const b = h('button', c === d.shirt ? 'sel' : ''); b.style.background = c; b.onclick = () => { Sound.tap(); d.shirt = c; RENDER.create(); }; sp.append(b); });
    if (!$('#name-input').value) $('#name-input').value = AVATARS.find(a => a.id === d.avatar).name;
  },
  age() {
    const box = $('#age-list'); box.innerHTML = '';
    AGES.forEach(a => {
      const c = h('button', 'age-card', `<div class="ic">${a.icon}</div><div class="rg">${a.range}</div><div class="nm">${t(a.key)}</div>`);
      c.style.background = a.color;
      c.onclick = () => {
        Sound.tap();
        const p = state.draft.editing ? Store.profile() : null;
        if (p) { p.age = a.id; Store.save(); show('hub'); return; }
        const np = Store.complet({ id: 'p' + Date.now(), name: state.draft.name, avatar: state.draft.avatar, shirt: state.draft.shirt, age: a.id });
        Store.data.profiles.push(np); Store.data.current = np.id; Store.save(); show('hub');
      };
      box.append(c);
    });
  },
  // Carte des 10 chapitres
  hub() {
    const p = Store.profile(); if (!p) return show('profiles');
    $('#hub-player').innerHTML = `<span style="width:2.4rem;height:2.4rem;display:inline-block">${avatarHeadSVG(avOf(p))}</span> ${esc(p.name)}`;
    $('#hub-age').innerHTML = `${AGES[p.age].icon} ${AGES[p.age].range}`;
    $('#hub-stars').textContent = `${Store.totalLucioles()} / ${PARTIES.length * 3}`;
    const g = $('#chap-grid'); g.innerHTML = '';
    CHAPITRES.forEach(ch => {
      const locked = !ouverte(ch.stages[0].parties[0].id), fini = chapFini(ch);
      const c = h('button', 'chap-card' + (locked ? ' locked' : '') + (fini ? ' fini' : ''),
        `<div class="num">${ch.id}</div><div class="nm">${esc(tx(ch.titre))}</div><div class="stars">✨ ${lucChap(ch)}/${nbParties(ch) * 3}</div>`);
      c.dataset.chap = ch.id;
      c.onclick = () => { if (locked) return lockShake(c); Sound.tap(); state.chap = ch.id; show('chapitre'); };
      g.append(c);
    });
    const nb = Object.keys(p.livre).length;
    const z = h('button', 'chap-card livre-card', `<div class="num">📖</div><div class="nm">${t('myBook')}</div><div class="stars">${nb}/${PAGES_LIVRE.length}</div>`);
    z.onclick = () => { Sound.tap(); show('livre'); }; g.append(z);
  },
  // Un chapitre : ses 3 stages
  chapitre() {
    const ch = chapitre(state.chap);
    $('#chap-title').textContent = `${ch.id}. ${tx(ch.titre)}`;
    $('#chap-stars').textContent = `${lucChap(ch)} / ${nbParties(ch) * 3}`;
    const box = $('#stage-list'); box.innerHTML = '';
    ch.stages.forEach(st => {
      const locked = !ouverte(st.parties[0].id);
      const c = h('button', 'stage-card decor-' + st.decor + (locked ? ' locked' : ''),
        `<div class="perso">${Assets.perso(st.guide)}</div><div class="num">${st.id}</div><div class="nm">${esc(tx(st.titre))}</div><div class="stars">✨ ${lucStage(st)}/${st.parties.length * 3}</div>`);
      c.dataset.stage = st.id;
      c.onclick = () => { if (locked) return lockShake(c); Sound.tap(); state.stage = st.id; show('stage'); };
      box.append(c);
    });
  },
  // Un stage : scène d'ouverture + ses parties
  stage() {
    const st = stageDe(state.stage), p = Store.profile();
    $('#stage-title').textContent = `${st.id} · ${tx(st.titre)}`;
    $('#stage-stars').textContent = `${lucStage(st)} / ${st.parties.length * 3}`;
    Scenes.stage($('#stage-scene'), st);
    const box = $('#partie-list'); box.innerHTML = '';
    st.parties.forEach(pa => {
      const n = Store.lucioles(pa.id), locked = !ouverte(pa.id), M = MECANIQUES[pa.meca];
      const b = h('button', 'partie-btn' + (locked ? ' locked' : ''),
        `<div class="ic">${M.icon}</div><div class="nm">${esc(tx(pa.titre))}</div><div class="s">${starStr(n)}</div>`);
      b.dataset.partie = pa.id;
      b.onclick = () => { if (locked) return lockShake(b); Sound.init(); Sound.tap(); Play.start(pa.id); };
      box.append(b);
    });
  },
  // Mon livre : les pages débloquées à la fin des chapitres
  livre() {
    const p = Store.profile(), g = $('#livre-grid'); g.innerHTML = '';
    PAGES_LIVRE.forEach(pg => {
      const open = p.livre[pg.id];
      const c = h('button', 'livre-cell' + (open ? '' : ' locked'), open ? (pg.id === 'dedicace' ? '💛' : pg.id) : '🔒');
      c.onclick = () => { if (!open) { Sound.bad(); return; } Sound.tap(); Modal.open(Scenes.page(pg) + `<button class="btn blue" id="pg-close">${t('close')}</button>`); Assets.fond($('#livre-ill'), 'page-' + pg.id); $('#pg-close').onclick = Modal.close; };
      g.append(c);
    });
    $('#livre-count').textContent = `${Object.keys(p.livre).length} / ${PAGES_LIVRE.length}`;
    const fp = $('#free-pages'); fp.innerHTML = '';
    COLOR_PAGES.forEach(pg => {
      const open = p.coloriages[pg.id];
      const b = h('button', 'btn ' + (open ? 'pink' : ''), `🎨 ${open ? pg.emoji : '🔒'}`);
      if (!open) b.style.setProperty('--c', '#adb5bd');
      b.onclick = () => { if (!open) { Sound.bad(); return; } Sound.tap(); Free.open(pg); };
      fp.append(b);
    });
  },
};
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ---------------- Contrôleur de partie ----------------
const Play = {
  sid: 0, timers: [], rafs: [], errors: 0, qErr: 0, streak: 0,
  // Lance une partie de l'histoire ('chapitre.stage.partie'). La mécanique utilise son module GAME_FN.<meca>
  // s'il existe, sinon le jeu V1 rhabillé indiqué dans MECANIQUES (phase 1).
  start(id) {
    this.stop(); this.sid++;
    const pa = partie(id), p = Store.profile(), sid = this.sid, self = this, M = MECANIQUES[pa.meca];
    const game = GAME_FN[pa.meca] ? pa.meca : M.base, lvl = pa.niv[p.age];
    state.partie = id; state.stage = pa.st.id; state.chap = pa.ch.id; state.game = game; state.lvl = lvl;
    this.errors = 0; this.qErr = 0; this.streak = 0;
    show('play');
    const area = $('#area'); area.innerHTML = ''; area.className = 'game-area';
    $('#prog').style.width = '0';
    $('#play-level').textContent = `${M.icon} ${pa.id}`;
    const qEl = h('div', 'question'); area.append(qEl);
    const G = {
      area, age: p.age, lvl, av: avOf(p), cfg: M.ages[p.age], partie: pa,
      alive: () => sid === self.sid,
      later(fn, ms) { const id = setTimeout(() => { if (sid === self.sid) fn(); }, ms); self.timers.push(id); return id; },
      raf(fn) { const loop = () => { if (sid !== self.sid) return; fn(); self.rafs.push(requestAnimationFrame(loop)); }; loop(); },
      setQuestion(txt) { qEl.textContent = txt; qEl.classList.remove('pop'); void qEl.offsetWidth; qEl.classList.add('pop'); if (!qEl.isConnected) area.append(qEl); },
      newQ() { self.qErr = 0; },
      progress(f) { $('#prog').style.width = Math.round(f * 100) + '%'; },
      correct(x, y) { self.onGood(x, y); },
      wrong(x, y) { return self.onBad(x, y); },
      done(extra) { if (sid === self.sid) self.finish(extra || {}); },
    };
    GAME_FN[game](G);
    if (!qEl.isConnected) area.append(qEl);
  },
  onGood(x, y) {
    Sound.good(); burst(x, y); floatText(x, y - 30, pick(['+1', '✔', '👍', '★']));
    this.streak++;
    if (this.streak % 3 === 0) {
      const b = h('div', 'streak-badge', `🔥 ${t('streak')}`); $('#area').append(b); setTimeout(() => b.remove(), 1400);
      const gl = h('div', 'mini-garland', garlandHTML(14)); $('#area').append(gl); setTimeout(() => gl.remove(), 2100);
      Sound.streak(); burst(innerWidth / 2, innerHeight * .4, undefined, 24);
    }
  },
  onBad(x, y) {
    Sound.bad(); this.errors++; this.qErr++; this.streak = 0;
    floatText(x, y - 30, t('tryAgain'), 'bad');
    return this.qErr;
  },
  finish(extra) {
    const p = Store.profile(), e = this.errors;
    const n = e <= 1 ? 3 : e <= 4 ? 2 : 1;
    Store.setLucioles(state.partie, n);
    // Chapitre terminé : ses pages du livre se débloquent
    const ch = partie(state.partie).ch, nouvelles = [];
    if (chapFini(ch)) ch.pages.forEach(pg => { if (!p.livre[pg]) { p.livre[pg] = true; nouvelles.push(pg); } });
    Store.save();
    Celebrate.show(n, nouvelles, extra, nouvelles.length ? ch : null);
  },
  stop() { this.sid++; this.timers.forEach(clearTimeout); this.timers = []; this.rafs.forEach(cancelAnimationFrame); this.rafs = []; },
};

// ---------------- Célébration : feux d'artifice, guirlandes, lumières ----------------
const Celebrate = {
  show(stars, pages, extra, finChap) {
    const p = Store.profile(), c = $('#celebrate');
    $('#cel-garland-top').innerHTML = garlandHTML(20);
    $('#cel-garland-bottom').innerHTML = garlandHTML(20).replace('class="garland"', 'class="garland bottom"');
    $('#cel-avatar').innerHTML = avatarSVG(avOf(p), '', 'wink');
    $('#cel-title').textContent = finChap ? t('allTogether') : `${t('bravo')} ${p.name} !`;
    $('#cel-sub').textContent = extra && extra.race !== undefined ? (extra.race ? '🏆 ' + t('youWon') : '🎉 ' + t('wellDone')) : '';
    const sp = $$('#cel-stars span'); sp.forEach(s => s.classList.remove('on'));
    sp.forEach((s, k) => { if (k < stars) setTimeout(() => { s.classList.add('on'); Sound.tone(880 + k * 220, .2, 'triangle', .18); }, 700 + k * 450); });
    const ca = $('#cel-animal');
    if (pages && pages.length) { ca.style.display = 'flex'; ca.innerHTML = `<span class="em">📖</span> ${t('pageUnlocked')}`; } else ca.style.display = 'none';
    // Fin de chapitre : Cécilia, Manoach et les personnages rencontrés fêtent ensemble
    $('#cel-amis').innerHTML = finChap ? amisJusqua(finChap).map(a => Assets.perso(a, null, 'danse')).join('') : '';
    $('#cel-next').style.display = this.suivante() ? '' : 'none';
    c.classList.add('on'); Sound.fanfare(); Fireworks.start(5000);
  },
  hide() { $('#celebrate').classList.remove('on'); Fireworks.stop(); },
  suivante() { const k = PARTIES.findIndex(p => p.id === state.partie); return PARTIES[k + 1] || null; },
};
$('#cel-map').onclick = () => { Sound.tap(); Celebrate.hide(); Play.stop(); show('hub'); };
$('#cel-replay').onclick = () => { Sound.tap(); Celebrate.hide(); Play.start(state.partie); };
// Partie suivante : dans le même stage on enchaîne ; sinon on passe par la scène d'ouverture du stage suivant
$('#cel-next').onclick = () => {
  Sound.tap(); const nx = Celebrate.suivante(), cur = partie(state.partie); Celebrate.hide();
  if (!nx) { Play.stop(); show('hub'); return; }
  if (nx.st === cur.st) Play.start(nx.id); else { Play.stop(); state.chap = nx.ch.id; state.stage = nx.st.id; show('stage'); }
};

// ---------------- Coloriage libre ----------------
const Free = {
  page: null, color: FREE_PALETTE[0],
  open(pg) {
    this.page = pg; show('free');
    const zones = renderColorPage(pg, $('#free-stage'), null);
    zones.forEach(z => z.addEventListener('click', ev => { z.setAttribute('fill', this.color); Sound.tap(); burst(ev.clientX, ev.clientY, [this.color], 8); }));
    const pal = $('#free-pal'); pal.innerHTML = '';
    FREE_PALETTE.forEach(c => {
      const b = h('button', 'pal small' + (c === this.color ? ' sel' : '')); b.style.background = c;
      b.onclick = () => { Sound.tap(); this.color = c; [...pal.children].forEach(x => x.classList.remove('sel')); b.classList.add('sel'); };
      pal.append(b);
    });
  },
};
$('#free-done').onclick = () => { Sound.fanfare(); Fireworks.start(3000, true); setTimeout(() => show('livre'), 2600); };

// ---------------- Espace parents (porte de sécurité) ----------------
const Modal = {
  open(html) { $('#modal-box').innerHTML = html; $('#modal').classList.add('on'); },
  close() { $('#modal').classList.remove('on'); },
};
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') Modal.close(); });
function parentGate(onOk) {
  const a = rnd(6, 9), b = rnd(6, 9), ans = a * b;
  const opts = shuffle([ans, ans + rnd(1, 4), ans - rnd(1, 5), ans + 10]);
  Modal.open(`<h2>🔐 ${t('parents')}</h2><div>${t('parentGate')}</div><div class="gate-q">${a} × ${b} ?</div><div class="gate-ans">${opts.map(o => `<button class="btn blue" data-v="${o}">${o}</button>`).join('')}</div><button class="btn red" id="gate-x">✕</button>`);
  $$('#modal-box [data-v]').forEach(btn => btn.onclick = () => { if (+btn.dataset.v === ans) onOk(); else Modal.close(); });
  $('#gate-x').onclick = Modal.close;
}
function parentPanel() {
  const p = Store.profile();
  Modal.open(`<h2>⚙️ ${t('parents')}</h2>
    <div class="row"><b>${t('language')} :</b> ${LANGS.map(l => `<button class="lang-btn${l.code === LANG ? ' sel' : ''}" data-l="${l.code}" style="font-size:1.2rem;padding:.3rem .6rem">${l.flag}</button>`).join('')}</div>
    <div class="row"><b>${t('sound')} :</b> <button class="btn ${Store.data.sound ? 'green' : 'red'}" id="pp-sound">${Store.data.sound ? '🔊' : '🔇'}</button></div>
    ${p ? `<div class="row"><b>${esc(p.name)} — ${t('changeAge')} :</b> ${AGES.map(a => `<button class="btn" data-age="${a.id}" style="--c:${a.color};font-size:1.2rem;${p.age === a.id ? 'outline:.25rem solid #2b2d42' : ''}">${a.range}</button>`).join('')}</div>
    <div class="row"><button class="btn orange" id="pp-reset">↺ ${t('reset')}</button><button class="btn red" id="pp-del">🗑 ${t('del')}</button></div>` : ''}
    <div class="small-note">Cécilia &amp; Manoach V2.0 · ${CHAPITRES.length} chapitres · ${PARTIES.length} parties · 3 âges · hors ligne, sans publicité, aucune donnée collectée.</div>
    <button class="btn blue" id="pp-close">${t('close')}</button>`);
  $$('#modal-box [data-l]').forEach(b => b.onclick = () => { LANG = b.dataset.l; Store.data.lang = LANG; Store.save(); applyLang(); parentPanel(); if (RENDER[current]) RENDER[current](); });
  $('#pp-sound').onclick = () => { Store.data.sound = !Store.data.sound; Sound.on = Store.data.sound; Store.save(); parentPanel(); RENDER.home(); };
  $$('#modal-box [data-age]').forEach(b => b.onclick = () => { p.age = +b.dataset.age; Store.save(); parentPanel(); if (RENDER[current]) RENDER[current](); });
  const confirm2 = (btn, fn) => { if (btn.dataset.armed) fn(); else { btn.dataset.armed = 1; btn.textContent = '⚠ ' + t('confirm'); } };
  const rs = $('#pp-reset'); if (rs) rs.onclick = () => confirm2(rs, () => { p.lucioles = {}; p.livre = {}; p.coloriages = {}; Store.save(); Modal.close(); if (RENDER[current]) RENDER[current](); });
  const dl = $('#pp-del'); if (dl) dl.onclick = () => confirm2(dl, () => { Store.data.profiles = Store.data.profiles.filter(x => x.id !== p.id); Store.data.current = null; Store.save(); Modal.close(); show('profiles'); });
  $('#pp-close').onclick = Modal.close;
}

// ---------------- Boutons et retour ----------------
function goBack() {
  if ($('#modal').classList.contains('on')) { Modal.close(); return true; }
  if ($('#celebrate').classList.contains('on')) { Celebrate.hide(); Play.stop(); show('stage'); return true; }
  switch (current) {
    case 'play': Play.stop(); show('stage'); return true;
    case 'stage': show('chapitre'); return true;
    case 'chapitre': case 'livre': show('hub'); return true;
    case 'free': show('livre'); return true;
    case 'hub': show('profiles'); return true;
    case 'age': show(state.draft && state.draft.editing ? 'hub' : 'create'); return true;
    case 'create': show('profiles'); return true;
    case 'profiles': case 'lang': show('home'); return true;
    default: return false;
  }
}
window.appBack = () => (goBack() ? 'ok' : 'exit');
window.appPause = () => { if (Sound.ctx) Sound.ctx.suspend(); };
document.addEventListener('visibilitychange', () => { if (!document.hidden && Sound.ctx) Sound.ctx.resume(); });
$$('[data-back]').forEach(b => b.addEventListener('click', () => { Sound.tap(); goBack(); }));

$('#home-play').onclick = () => { Sound.init(); Sound.tap(); show(Store.data.lang ? 'profiles' : 'lang'); };
$('#home-lang').onclick = () => { Sound.init(); Sound.tap(); show('lang'); };
$('#home-sound').onclick = () => { Sound.init(); Store.data.sound = !Store.data.sound; Sound.on = Store.data.sound; Store.save(); Sound.tap(); RENDER.home(); };
$('#prof-parents').onclick = () => { Sound.tap(); parentGate(parentPanel); };
$('#hub-age').onclick = () => { Sound.tap(); parentGate(parentPanel); };
$('#create-next').onclick = () => {
  Sound.tap();
  state.draft.name = ($('#name-input').value || '').trim() || AVATARS.find(a => a.id === state.draft.avatar).name;
  state.draft.editing = false; show('age');
};
$('#name-input').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
window.addEventListener('resize', () => { if (Fireworks.cv && Fireworks.cv.classList.contains('on')) Fireworks.resize(); });

// ---------------- Démarrage ----------------
Store.load();
LANG = Store.data.lang || (LANGS.find(l => (navigator.language || 'fr').startsWith(l.code)) || LANGS[0]).code;
Sound.on = Store.data.sound !== false;
applyLang();
show('home');
