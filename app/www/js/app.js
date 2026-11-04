// NumZoo — navigation, profils, contrôleur de partie, célébrations, espace parents
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let current = 'home';
const state = { game: null, lvl: 0, draft: null };

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

// ---------------- Rendus des écrans ----------------
const RENDER = {
  home() {
    $('#logo').innerHTML = 'NumZoo'.split('').map(c => `<span>${c}</span>`).join('');
    $('#home-av1').innerHTML = avatarSVG(AVATARS[0], '', 'wink');
    $('#home-av2').innerHTML = avatarSVG(AVATARS[4]);
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
      const c = h('button', 'profile-card', `${avatarSVG(avOf(p))}<div class="nm">${esc(p.name)}</div><div class="st">⭐ ${Object.values(p.stars).reduce((a, b) => a + b, 0)} · ${AGES[p.age].range} ${t('years')}</div>`);
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
        const np = { id: 'p' + Date.now(), name: state.draft.name, avatar: state.draft.avatar, shirt: state.draft.shirt, age: a.id, stars: {}, zoo: [], pages: {} };
        Store.data.profiles.push(np); Store.data.current = np.id; Store.save(); show('hub');
      };
      box.append(c);
    });
  },
  hub() {
    const p = Store.profile(); if (!p) return show('profiles');
    $('#hub-player').innerHTML = `<span style="width:2.4rem;height:2.4rem;display:inline-block">${avatarHeadSVG(avOf(p))}</span> ${esc(p.name)}`;
    $('#hub-age').innerHTML = `${AGES[p.age].icon} ${AGES[p.age].range}`;
    $('#hub-stars').textContent = Store.totalStars();
    const g = $('#game-grid'); g.innerHTML = '';
    GAMES.forEach(gm => {
      const st = [0, 1, 2].map(l => Store.stars(gm.id, p.age, l)).reduce((a, b) => a + b, 0);
      const c = h('button', 'game-card', `<div class="ic">${gm.icon}</div><div class="nm">${t('g_' + gm.id)}</div><div class="stars">⭐ ${st}/9</div>`);
      c.style.background = gm.color;
      c.onclick = () => { Sound.tap(); state.game = gm.id; show('levels'); };
      g.append(c);
    });
    const z = h('button', 'game-card', `<div class="ic">🏞️</div><div class="nm">${t('myZoo')}</div><div class="stars">${p.zoo.length}/${ZOO_ANIMALS.length}</div>`);
    z.style.background = '#52b788'; z.onclick = () => { Sound.tap(); show('zoo'); }; g.append(z);
  },
  levels() {
    const p = Store.profile(), gm = GAMES.find(g => g.id === state.game);
    $('#levels-title').textContent = `${gm.icon} ${t('g_' + gm.id)}`;
    $('#levels-desc').textContent = t('d_' + gm.id);
    const box = $('#levels-list'); box.innerHTML = '';
    [0, 1, 2].forEach(l => {
      const st = Store.stars(gm.id, p.age, l), locked = l > 0 && !Store.stars(gm.id, p.age, l - 1);
      const b = h('button', 'level-btn' + (locked ? ' locked' : ''), `<div class="n">${l + 1}</div><div class="s">${starStr(st)}</div>`);
      b.onclick = () => {
        if (locked) { Sound.bad(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); floatText(innerWidth / 2, innerHeight * .2, t('locked'), 'bad'); return; }
        Sound.init(); Sound.tap(); Play.start(gm.id, l);
      };
      box.append(b);
    });
  },
  zoo() {
    const p = Store.profile(), g = $('#zoo-grid'); g.innerHTML = '';
    ZOO_ANIMALS.forEach((a, k) => { const c = h('div', 'zoo-cell' + (k < p.zoo.length ? '' : ' locked'), k < p.zoo.length ? `<span>${p.zoo[k]}</span>` : '?'); g.append(c); });
    $('#zoo-count').textContent = `${p.zoo.length} / ${ZOO_ANIMALS.length}`;
    const fp = $('#free-pages'); fp.innerHTML = '';
    COLOR_PAGES.forEach(pg => {
      const open = p.pages && p.pages[pg.id];
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
  start(game, lvl) {
    this.stop(); this.sid++;
    state.game = game; state.lvl = lvl;
    const p = Store.profile(), sid = this.sid, self = this;
    this.errors = 0; this.qErr = 0; this.streak = 0;
    show('play');
    const area = $('#area'); area.innerHTML = ''; area.className = 'game-area';
    $('#prog').style.width = '0';
    $('#play-level').textContent = `${GAMES.find(g => g.id === game).icon} ${t('level')} ${lvl + 1}`;
    const qEl = h('div', 'question'); area.append(qEl);
    const G = {
      area, age: p.age, lvl, av: avOf(p),
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
    const stars = e <= 1 ? 3 : e <= 4 ? 2 : 1;
    const animal = Store.setStars(state.game, p.age, state.lvl, stars);
    Celebrate.show(stars, animal, extra);
  },
  stop() { this.sid++; this.timers.forEach(clearTimeout); this.timers = []; this.rafs.forEach(cancelAnimationFrame); this.rafs = []; },
};

// ---------------- Célébration : feux d'artifice, guirlandes, lumières ----------------
const Celebrate = {
  show(stars, animal, extra) {
    const p = Store.profile(), c = $('#celebrate');
    $('#cel-garland-top').innerHTML = garlandHTML(20);
    $('#cel-garland-bottom').innerHTML = garlandHTML(20).replace('class="garland"', 'class="garland bottom"');
    $('#cel-avatar').innerHTML = avatarSVG(avOf(p), '', 'wink');
    $('#cel-title').textContent = `${t('bravo')} ${p.name} !`;
    $('#cel-sub').textContent = extra && extra.race !== undefined ? (extra.race ? '🏆 ' + t('youWon') : '🎉 ' + t('wellDone')) : '';
    const sp = $$('#cel-stars span'); sp.forEach(s => s.classList.remove('on'));
    sp.forEach((s, k) => { if (k < stars) setTimeout(() => { s.classList.add('on'); Sound.tone(880 + k * 220, .2, 'triangle', .18); }, 700 + k * 450); });
    const ca = $('#cel-animal');
    if (animal) { ca.style.display = 'flex'; ca.innerHTML = `<span class="em">${animal}</span> ${t('newAnimal')}`; } else ca.style.display = 'none';
    $('#cel-next').style.display = state.lvl < 2 ? '' : 'none';
    c.classList.add('on'); Sound.fanfare(); Fireworks.start(5000);
  },
  hide() { $('#celebrate').classList.remove('on'); Fireworks.stop(); },
};
$('#cel-map').onclick = () => { Sound.tap(); Celebrate.hide(); Play.stop(); show('hub'); };
$('#cel-replay').onclick = () => { Sound.tap(); Celebrate.hide(); Play.start(state.game, state.lvl); };
$('#cel-next').onclick = () => { Sound.tap(); Celebrate.hide(); Play.start(state.game, Math.min(2, state.lvl + 1)); };

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
$('#free-done').onclick = () => { Sound.fanfare(); Fireworks.start(3000, true); setTimeout(() => show('zoo'), 2600); };

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
    <div class="small-note">NumZoo V1.0 · 7 jeux × 3 niveaux × 3 âges · hors ligne, sans publicité, aucune donnée collectée.</div>
    <button class="btn blue" id="pp-close">${t('close')}</button>`);
  $$('#modal-box [data-l]').forEach(b => b.onclick = () => { LANG = b.dataset.l; Store.data.lang = LANG; Store.save(); applyLang(); parentPanel(); if (RENDER[current]) RENDER[current](); });
  $('#pp-sound').onclick = () => { Store.data.sound = !Store.data.sound; Sound.on = Store.data.sound; Store.save(); parentPanel(); RENDER.home(); };
  $$('#modal-box [data-age]').forEach(b => b.onclick = () => { p.age = +b.dataset.age; Store.save(); parentPanel(); if (RENDER[current]) RENDER[current](); });
  const confirm2 = (btn, fn) => { if (btn.dataset.armed) fn(); else { btn.dataset.armed = 1; btn.textContent = '⚠ ' + t('confirm'); } };
  const rs = $('#pp-reset'); if (rs) rs.onclick = () => confirm2(rs, () => { p.stars = {}; p.zoo = []; p.pages = {}; Store.save(); Modal.close(); if (RENDER[current]) RENDER[current](); });
  const dl = $('#pp-del'); if (dl) dl.onclick = () => confirm2(dl, () => { Store.data.profiles = Store.data.profiles.filter(x => x.id !== p.id); Store.data.current = null; Store.save(); Modal.close(); show('profiles'); });
  $('#pp-close').onclick = Modal.close;
}

// ---------------- Boutons et retour ----------------
function goBack() {
  if ($('#modal').classList.contains('on')) { Modal.close(); return true; }
  if ($('#celebrate').classList.contains('on')) { Celebrate.hide(); Play.stop(); show('levels'); return true; }
  switch (current) {
    case 'play': Play.stop(); show('levels'); return true;
    case 'levels': case 'zoo': show('hub'); return true;
    case 'free': show('zoo'); return true;
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
