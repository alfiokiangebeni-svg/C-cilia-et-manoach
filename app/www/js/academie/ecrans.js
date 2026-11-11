// Académie – écrans : accueil (classes, matières), matière (chapitres, leçons), leçon, quiz / examen,
// résultat, bulletin imprimable, récompenses, préparation ENAFEP, tableau de bord parent / enseignant.
// Chargé après app.js : réutilise show(), RENDER, h(), esc(), Modal, Sound, Fireworks, parentGate().

const ACAD_ECRANS = ['academie', 'acad-matiere', 'acad-lecon', 'acad-quiz', 'acad-resultat', 'acad-bulletin', 'acad-recompenses', 'acad-enafep', 'acad-suivi'];
ACAD_ECRANS.forEach(id => {
  const s = h('section', 'screen acad-screen', `<div class="topbar"><button class="round" data-back>⬅</button><div class="title"></div><div class="acad-chips"></div></div><div class="acad-body"></div>`);
  s.id = id;
  s.querySelector('[data-back]').addEventListener('click', () => { Sound.tap(); goBack(); });
  document.body.insertBefore(s, $('#modal'));
});
const AE = id => ({ titre: $(`#${id} .title`), chips: $(`#${id} .acad-chips`), corps: $(`#${id} .acad-body`) });
const acadState = { classe: null, mat: null, lecon: null, session: null, resultat: null, periode: null };
const illu = (s, cls = '') => (s && s.includes('/') ? `<img class="acad-illu ${cls}" src="img/${s}.webp" alt="" draggable="false">` : `<span class="acad-emoji ${cls}">${s || '📘'}</span>`);
const noteTxt = n => `${fmt(Math.round(n * 10) / 10)}/20`;
const statutIc = { ok: '✅', cours: '⏳', non: '⚪' };
const dureeTxt = s => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min` : `${Math.floor(s / 60)} min`);
const dateTxt = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// ---------------- Accueil de l'académie : les 6 classes et les matières ----------------
RENDER.academie = () => {
  const p = Store.profile(); if (!p) return show('profiles');
  const a = p.academie, E = AE('academie');
  if (!acadState.classe || !Acad.classeOuverte(acadState.classe)) acadState.classe = a.classe;
  E.titre.textContent = 'Académie scolaire – École primaire RDC';
  E.chips.innerHTML = `<button class="chip" id="ac-joueur">${teteHTML(avOf(p).id)} ${esc(p.name)}</button><div class="chip">⭐ ${Acad.recompenses().etoiles}</div><button class="chip" id="ac-parents">👪</button>`;
  $('#ac-parents').onclick = () => { Sound.tap(); parentGate(() => { Modal.close(); show('acad-suivi'); }); };
  $('#ac-joueur').onclick = () => { Sound.tap(); show('profiles'); };
  const C = classeAcad(acadState.classe);
  let html = `<div class="acad-cycles">${CYCLES.map(cy => `<div class="acad-cycle" style="--c:${cy.couleur}"><div class="cy-nom">${cy.icon} ${cy.nom}</div><div class="cy-classes">${cy.classes.map(n => {
    const ouv = Acad.classeOuverte(n), cl = classeAcad(n);
    return `<button class="acad-classe${n === acadState.classe ? ' sel' : ''}${ouv ? '' : ' locked'}${n === a.classe ? ' actuelle' : ''}" data-classe="${n}" style="--c:${cl.couleur}"><b>${n}<sup>${n === 1 ? 're' : 'e'}</sup></b><small>${ouv ? cl.ages : '🔒'}</small></button>`;
  }).join('')}</div></div>`).join('')}</div>`;
  html += `<h2 class="acad-h">${C.nom} ${acadState.classe === a.classe ? '<span class="tag">ma classe</span>' : ''}</h2><div class="acad-mats">`;
  MATIERES_ACAD.forEach(M => {
    const av = Acad.avancement(acadState.classe, M.id);
    if (!av.total) return;
    html += `<button class="acad-mat" data-mat="${M.id}" style="--c:${M.couleur}"><span class="ic">${M.icon}</span><b>${M.nom}</b>${M.complementaire ? '<i class="compl">module complémentaire</i>' : ''}<span class="barre"><span style="width:${av.pct}%"></span></span><small>${av.ok}/${av.total} leçons validées</small></button>`;
  });
  html += `</div><div class="acad-actions">
    <button class="btn violet" id="ac-diag">🧪 Test de positionnement</button>
    <button class="btn orange" id="ac-exam">🎓 Examen de fin d’année</button>
    ${acadState.classe === 6 ? '<button class="btn red" id="ac-enafep">📝 Préparation ENAFEP</button>' : ''}
    <button class="btn blue" id="ac-bull">📄 Bulletin</button>
    <button class="btn green" id="ac-recomp">🏆 Récompenses</button>
    <button class="btn" id="ac-jeux" style="--c:#e9a46a">🎮 Histoire et jeux</button></div>`;
  E.corps.innerHTML = html;
  $$('#academie [data-classe]').forEach(b => b.onclick = () => {
    const n = +b.dataset.classe;
    if (!Acad.classeOuverte(n)) { lockShake(b); return Modal.open(`<h2>🔒 ${classeAcad(n).nom}</h2><p>Cette classe s’ouvre quand l’examen de fin d’année de la classe précédente est réussi (au moins ${EXAMEN.seuil}/20), ou après le test de positionnement.</p><p>Un parent peut aussi choisir l’« ordre libre » dans le tableau de bord.</p><button class="btn violet" id="m-diag">🧪 Test de positionnement</button> <button class="btn blue" id="m-x">OK</button>`), $('#m-x').onclick = Modal.close, $('#m-diag').onclick = () => { Modal.close(); demarrerPositionnement(); }; }
    Sound.tap(); acadState.classe = n; RENDER.academie();
  });
  $$('#academie [data-mat]').forEach(b => b.onclick = () => { Sound.tap(); acadState.mat = b.dataset.mat; show('acad-matiere'); });
  $('#ac-diag').onclick = () => { Sound.init(); Sound.tap(); demarrerPositionnement(); };
  $('#ac-exam').onclick = () => { Sound.init(); Sound.tap(); demarrerExamen('annee', acadState.classe); };
  if ($('#ac-enafep')) $('#ac-enafep').onclick = () => { Sound.tap(); show('acad-enafep'); };
  $('#ac-bull').onclick = () => { Sound.tap(); show('acad-bulletin'); };
  $('#ac-recomp').onclick = () => { Sound.tap(); show('acad-recompenses'); };
  $('#ac-jeux').onclick = () => { Sound.tap(); show('hub'); };
};

// ---------------- Une matière : chapitres et leçons ----------------
RENDER['acad-matiere'] = () => {
  const E = AE('acad-matiere'), M = matiereAcad(acadState.mat), n = acadState.classe, av = Acad.avancement(n, M.id);
  E.titre.textContent = `${M.icon} ${M.nom} · ${classeAcad(n).nom}`;
  E.chips.innerHTML = `<div class="chip">✅ ${av.ok} · ⏳ ${av.cours} · ⚪ ${av.non}</div>`;
  let html = M.complementaire ? '<p class="acad-note">Module complémentaire : il ne fait pas partie du programme national de l’enseignement primaire.</p>' : '';
  (PROGRAMME_ACAD[n][M.id] || []).forEach(([titre], ci) => {
    const maitrise = Acad.chapitreMaitrise(n, M.id, ci + 1);
    html += `<div class="acad-chap"><h3>Chapitre ${ci + 1} · ${esc(titre)} ${maitrise ? '<span class="tag ok">🏅 maîtrisé</span>' : ''}</h3>`;
    leconsDe(n, M.id).filter(l => l.chap === ci + 1).forEach(l => {
      const st = Acad.statut(l.id), r = Acad.rec(l.id), ouv = Acad.leconOuverte(l.id);
      html += `<button class="acad-lecon st-${st}${ouv ? '' : ' locked'}" data-lecon="${l.id}">${illu(l.illu, 'petit')}<span class="txt"><b>${l.num}. ${esc(l.titre)}</b><small>${esc(l.objectif)}</small></span><span class="etat">${ouv ? statutIc[st] : '🔒'}${r ? `<small>${noteTxt(r.best)}</small><i>${'★'.repeat(Acad.etoiles(l.id))}</i>` : ''}</span></button>`;
    });
    html += '</div>';
  });
  E.corps.innerHTML = html;
  $$('#acad-matiere [data-lecon]').forEach(b => b.onclick = () => {
    if (!Acad.leconOuverte(b.dataset.lecon)) { lockShake(b); return floatText(innerWidth / 2, innerHeight * .25, 'Valide d’abord la leçon précédente (14/20)', 'bad'); }
    Sound.tap(); acadState.lecon = b.dataset.lecon; show('acad-lecon');
  });
};

// ---------------- Une leçon : explication, exemple, petit exercice, quiz ----------------
RENDER['acad-lecon'] = () => {
  const E = AE('acad-lecon'), l = leconAcad(acadState.lecon), M = matiereAcad(l.mat), r = Acad.rec(l.id);
  acadState.debutLecon = Date.now();
  E.titre.textContent = `${M.icon} ${l.titre}`;
  E.chips.innerHTML = r ? `<div class="chip">${statutIc[Acad.statut(l.id)]} meilleure note ${noteTxt(r.best)}</div>` : '';
  const essai = tirerQuestions(l.src, 1, [])[0];
  E.corps.innerHTML = `<article class="acad-carte">
    <div class="lec-tete">${illu(l.illu, 'grand')}<div><small>${classeAcad(l.classe).nom} · ${M.nom} · chapitre ${l.chap} : ${esc(l.chapTitre)}</small><h2>${esc(l.titre)}</h2></div></div>
    <p class="obj">🎯 <b>Objectif :</b> ${esc(l.objectif)}</p>
    <div class="bloc expl"><h4>📖 J’apprends</h4><p>${esc(l.explication)}</p></div>
    <div class="bloc ex"><h4>🏡 Exemple de la vie de tous les jours</h4><p>${esc(l.exemple)}</p></div>
    ${essai ? `<div class="bloc essai"><h4>✏️ Petit exercice (non noté)</h4><p class="q">${esc(essai.q)}</p>${essai.img ? illu(essai.img, 'q-img') : ''}<div class="opts">${essai.opts.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><p class="fb"></p></div>` : ''}
    <div class="lec-go"><p>Quiz de validation : <b>${QUIZ.questions} questions</b>, <b>${QUIZ.points} points</b> chacune, note sur 20. Leçon validée à partir de <b>${QUIZ.seuil}/20</b>.</p><button class="btn green big" id="lec-quiz">▶ Commencer le quiz</button></div>
  </article>`;
  if (essai) $$('#acad-lecon .essai .opt').forEach(b => b.onclick = () => {
    const ok = juste(essai, b.dataset.o);
    $$('#acad-lecon .essai .opt').forEach(x => { x.disabled = true; if (x.dataset.o === essai.ans) x.classList.add('juste'); });
    if (!ok) b.classList.add('faux');
    ok ? Sound.good() : Sound.bad();
    $('#acad-lecon .essai .fb').textContent = (ok ? 'Bravo ! ' : 'Pas tout à fait. ') + essai.expl;
  });
  $('#lec-quiz').onclick = () => { Sound.init(); Sound.tap(); Acad.temps(l.mat, (Date.now() - acadState.debutLecon) / 1000); demarrerQuiz(l.id); };
};

// ---------------- Session de questions (quiz, examen, ENAFEP, positionnement) ----------------
function demarrerSession(s) {
  acadState.session = Object.assign({ i: 0, reps: [], debut: Date.now(), feedback: true }, s);
  show('acad-quiz');
}
function demarrerQuiz(id) {
  const l = leconAcad(id);
  demarrerSession({ type: 'quiz', lecon: id, titre: l.titre, qs: Acad.quizLecon(id) });
}
function demarrerExamen(type, classe, domaine) {
  if (type === 'annee') return demarrerSession({ type, classe, titre: `Examen de fin d’année · ${classeAcad(classe).nom}`, qs: Acad.examenAnnee(classe), minutes: EXAMEN.minutes, feedback: false });
  const D = ENAFEP.domaines.find(d => d.id === domaine);
  demarrerSession({ type: 'enafep', classe: 6, domaine, titre: `Examen blanc ENAFEP · ${D.nom}`, qs: Acad.examenEnafep(domaine), minutes: D.minutes, feedback: false });
}
function demarrerPositionnement() {
  demarrerSession({ type: 'diag', titre: 'Test de positionnement', classeDiag: 1, qs: Acad.positionnement(1), resultats: [], feedback: false });
}
RENDER['acad-quiz'] = () => afficherQuestion();
function afficherQuestion() {
  const S = acadState.session, E = AE('acad-quiz'), q = S.qs[S.i];
  E.titre.textContent = S.titre;
  E.chips.innerHTML = `<div class="chip">${S.type === 'diag' ? classeAcad(S.classeDiag).nom + ' · ' : ''}Question ${S.i + 1} / ${S.qs.length}</div>${S.minutes ? '<div class="chip" id="aq-chrono">⏱</div>' : ''}`;
  const pts = S.type === 'quiz' ? `<span class="pts">${QUIZ.points} points</span>` : '';
  E.corps.innerHTML = `<div class="acad-carte quiz-carte">
    <div class="q-prog">${S.qs.map((_, k) => `<span class="${k < S.i ? (S.feedback ? (S.ok[k] ? 'ok' : 'ko') : 'fait') : k === S.i ? 'ici' : ''}"></span>`).join('')}</div>
    <div class="q-type">${{ qcm: 'Choisis la bonne réponse', vf: 'Vrai ou faux', calcul: 'Calcul', probleme: 'Problème', comprehension: 'Compréhension', image: 'Identifie l’image' }[q.type] || ''} ${pts}</div>
    <p class="q">${esc(q.q)}</p>${q.img ? illu(q.img, 'q-img') : ''}
    ${q.saisie ? `<div class="saisie"><div class="ecran" id="aq-ecran"></div><div class="pave">${['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '⌫'].map(k => `<button class="touche" data-k="${k}">${k}</button>`).join('')}</div><button class="btn green" id="aq-ok">Valider</button></div>`
      : `<div class="opts ${q.opts.length > 3 || q.opts.some(o => o.length > 28) ? 'col' : ''}">${q.opts.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`}
    <p class="fb"></p><div class="suite"></div></div>`;
  S.ok = S.ok || [];
  const repondre = rep => {
    if (S.reps[S.i] !== undefined) return;
    S.reps[S.i] = rep;
    const ok = juste(q, rep); S.ok[S.i] = ok;
    if (S.feedback) {
      ok ? Sound.good() : Sound.bad();
      $$('#acad-quiz .opt').forEach(x => { x.disabled = true; if (x.dataset.o === q.ans) x.classList.add('juste'); else if (x.dataset.o === rep) x.classList.add('faux'); });
      $('#acad-quiz .fb').innerHTML = ok ? '✅ Bonne réponse !' : `❌ La bonne réponse était : <b>${esc(q.ans)}</b>`;
      const b = h('button', 'btn blue', S.i + 1 < S.qs.length ? 'Question suivante ➜' : 'Voir ma note ➜'); b.id = 'aq-suite';
      b.onclick = () => { Sound.tap(); suivante(); };
      $('#acad-quiz .suite').append(b);
    } else { Sound.tap(); setTimeout(suivante, 250); }
  };
  $$('#acad-quiz .opt').forEach(b => b.onclick = () => repondre(b.dataset.o));
  if (q.saisie) {
    let v = '';
    $$('#acad-quiz .touche').forEach(b => b.onclick = () => { Sound.tap(); const k = b.dataset.k; v = k === '⌫' ? v.slice(0, -1) : (v + k).slice(0, 12); $('#aq-ecran').textContent = v; });
    $('#aq-ok').onclick = () => { if (!v) return; $('#aq-ok').disabled = true; repondre(v); if (S.feedback && !S.ok[S.i]) $('#acad-quiz .fb').innerHTML = `❌ La bonne réponse était : <b>${esc(q.ans)}</b>`; };
  }
  chrono();
}
function chrono() {
  const S = acadState.session; clearInterval(acadState.tic);
  if (!S || !S.minutes) return;
  const tick = () => {
    const reste = Math.max(0, S.minutes * 60 - (Date.now() - S.debut) / 1000), el = $('#aq-chrono');
    if (el) { el.textContent = `⏱ ${Math.floor(reste / 60)}:${String(Math.floor(reste % 60)).padStart(2, '0')}`; el.classList.toggle('urgent', reste < 60); }
    if (reste <= 0 && current === 'acad-quiz') { clearInterval(acadState.tic); terminerSession(); }
  };
  tick(); acadState.tic = setInterval(tick, 1000);
}
function suivante() {
  const S = acadState.session;
  if (S.type === 'diag' && S.i + 1 === S.qs.length) {
    const bonnes = S.ok.filter(Boolean).length;
    S.resultats.push({ classe: S.classeDiag, bonnes });
    if (bonnes >= POSITIONNEMENT.seuil && S.classeDiag < 6) {
      S.classeDiag++; S.qs = Acad.positionnement(S.classeDiag); S.i = 0; S.reps = []; S.ok = [];
      return afficherQuestion();
    }
    return terminerSession();
  }
  if (S.i + 1 < S.qs.length) { S.i++; afficherQuestion(); } else terminerSession();
}
function terminerSession() {
  const S = acadState.session; clearInterval(acadState.tic);
  const sec = (Date.now() - S.debut) / 1000;
  let R;
  if (S.type === 'quiz') R = Acad.enregistrerQuiz(S.lecon, S.qs, S.reps, sec);
  else if (S.type === 'diag') R = Acad.finirPositionnement(S.resultats);
  else R = Acad.enregistrerExamen(S.type, S.classe, S.qs, S.reps, sec, S.domaine);
  acadState.resultat = Object.assign({ session: S }, R);
  show('acad-resultat');
}

// ---------------- Résultat : note, corrections, appréciation ----------------
RENDER['acad-resultat'] = () => {
  const E = AE('acad-resultat'), R = acadState.resultat, S = R.session;
  E.chips.innerHTML = '';
  let html = '';
  if (S.type === 'diag') {
    E.titre.textContent = 'Test de positionnement';
    html = `<div class="acad-carte res-tete"><div class="gros">🧪</div><h2>Classe conseillée : ${classeAcad(R.conseil).nom}</h2>
      <table class="acad-table"><tr><th>Classe</th><th>Bonnes réponses</th></tr>${S.resultats.map(r => `<tr><td>${classeAcad(r.classe).nom}</td><td>${r.bonnes} / ${POSITIONNEMENT.parClasse} ${r.bonnes >= POSITIONNEMENT.seuil ? '✅' : '⏳'}</td></tr>`).join('')}</table>
      <p>Les classes jusqu’à la ${classeAcad(R.conseil).nom} sont ouvertes. Les classes précédentes restent disponibles pour réviser.</p>
      <button class="btn green big" id="rs-ok">Commencer</button></div>`;
    E.corps.innerHTML = html + badgesHTML(R.badges);
    $('#rs-ok').onclick = () => { Sound.tap(); acadState.classe = R.conseil; show('academie'); };
    if (R.badges.length) Sound.fanfare();
    return;
  }
  const B = baremeDe(R.note), quiz = S.type === 'quiz';
  E.titre.textContent = quiz ? `Résultat · ${S.titre}` : S.titre;
  html += `<div class="acad-carte res-tete" style="--c:${B.couleur}"><div class="note">${noteTxt(R.note)}</div><div class="mention">${B.nom}</div>
    <div class="maitrise">Niveau de maîtrise : <b>${B.maitrise}</b></div>
    <div>✅ ${R.bonnes} bonne${R.bonnes > 1 ? 's' : ''} réponse${R.bonnes > 1 ? 's' : ''} · ❌ ${S.qs.length - R.bonnes} erreur${S.qs.length - R.bonnes > 1 ? 's' : ''}</div>`;
  if (quiz) html += R.valide ? `<p class="ok">🎉 Leçon validée ! ${R.premier ? 'La leçon suivante est ouverte.' : ''}</p>` : `<p class="ko">Il faut au moins ${QUIZ.seuil}/20 pour valider. Relis la leçon, puis refais un quiz : ce seront ${QUIZ.questions} nouvelles questions.</p>`;
  if (S.type === 'annee') html += R.note >= EXAMEN.seuil ? `<p class="ok">🎓 Examen réussi : diplôme de fin de ${classeAcad(S.classe).nom} ! ${R.monte ? `La ${classeAcad(S.classe + 1).nom} est ouverte.` : ''}</p>` : `<p class="ko">Il faut au moins ${EXAMEN.seuil}/20 pour réussir l’examen. Révise les leçons non validées.</p>`;
  if (S.type === 'enafep') html += `<p class="acad-note">${ENAFEP.avertissement}</p>`;
  if (!quiz) html += `<table class="acad-table"><tr><th>Domaine</th><th>Résultat</th></tr>${Object.entries(R.parMat).map(([m, v]) => `<tr><td>${matiereAcad(m).icon} ${matiereAcad(m).nom}</td><td>${v.ok} / ${v.n}</td></tr>`).join('')}</table><p>Durée : ${dureeTxt(R.t)}</p>`;
  html += `<div class="res-actions">${quiz ? (R.valide ? `${suivanteDe(S.lecon) ? '<button class="btn green big" id="rs-next">Leçon suivante ➜</button>' : ''}<button class="btn blue" id="rs-mat">Retour à la matière</button><button class="btn orange" id="rs-encore">Refaire un quiz</button>`
    : '<button class="btn blue big" id="rs-lecon">📖 Revoir la leçon</button><button class="btn green big" id="rs-encore">🔁 5 nouvelles questions</button>')
    : '<button class="btn blue" id="rs-home">Retour à l’académie</button>'}</div></div>`;
  html += badgesHTML(R.badges);
  html += `<h3 class="acad-h">Correction</h3><div class="corrections">${R.res.map((x, k) => `<div class="corr ${x.ok ? 'ok' : 'ko'}"><b>${k + 1}. ${esc(x.q.q)}</b>
    <div>Ta réponse : ${x.rep === undefined ? '<i>pas de réponse</i>' : esc(x.rep)} ${x.ok ? '✅' : '❌'}</div>${x.ok ? '' : `<div>Bonne réponse : <b>${esc(x.q.ans)}</b></div><div class="explication">💡 ${esc(x.q.expl)}</div>`}</div>`).join('')}</div>`;
  E.corps.innerHTML = html;
  if ((quiz && R.valide) || (S.type === 'annee' && R.note >= EXAMEN.seuil) || R.badges.length) { Sound.fanfare(); Fireworks.start(2500, true); } else Sound.tap();
  const on = (id, fn) => { const b = $('#' + id); if (b) b.onclick = () => { Sound.tap(); fn(); }; };
  on('rs-next', () => { acadState.lecon = suivanteDe(S.lecon).id; show('acad-lecon'); });
  on('rs-mat', () => show('acad-matiere'));
  on('rs-encore', () => demarrerQuiz(S.lecon));
  on('rs-lecon', () => show('acad-lecon'));
  on('rs-home', () => show(S.type === 'enafep' ? 'acad-enafep' : 'academie'));
};
const suivanteDe = id => { const l = leconAcad(id), ls = leconsDe(l.classe, l.mat); return ls[ls.indexOf(l) + 1] || null; };
const badgesHTML = bs => (bs && bs.length ? `<div class="acad-carte nouveaux-badges"><h3>Nouveau badge !</h3>${bs.map(b => `<div class="badge on"><span>${b.icon}</span><b>${b.nom}</b></div>`).join('')}</div>` : '');

// ---------------- Bulletin imprimable ----------------
RENDER['acad-bulletin'] = () => {
  const E = AE('acad-bulletin'), p = Store.profile(), per = acadState.periode || periodeDe(), B = Acad.bulletin(per);
  E.titre.textContent = 'Bulletin';
  E.chips.innerHTML = PERIODES.map(x => `<button class="chip${x.id === per ? ' sel' : ''}" data-per="${x.id}">${x.nom}</button>`).join('');
  const prog = B.progression === null ? '—' : (B.progression >= 0 ? '▲ +' : '▼ ') + fmt(B.progression) + ' point' + (Math.abs(B.progression) > 1 ? 's' : '');
  E.corps.innerHTML = `<div class="acad-carte bulletin-doc" id="bulletin-doc">
    <div class="bul-tete"><div><b>ACADÉMIE SCOLAIRE – ÉCOLE PRIMAIRE RDC</b><small>Bulletin d’entraînement (application Cécilia &amp; Manoach) — ce n’est pas un bulletin officiel</small></div><div class="bul-ic">📘</div></div>
    <table class="bul-id"><tr><td>Élève : <b>${esc(p.name)}</b></td><td>Classe : <b>${classeAcad(B.classe).nom}</b></td></tr><tr><td>Période : <b>${B.periode.nom}</b></td><td>Année scolaire : <b>${B.annee}</b></td></tr></table>
    ${B.mats.length ? `<table class="acad-table bul-notes"><tr><th>Matière</th><th>Moyenne</th><th>Évaluations</th><th>Appréciation</th></tr>${B.mats.map(m => `<tr><td>${esc(m.nom)}${m.complementaire ? ' <i>(complémentaire)</i>' : ''}</td><td><b>${noteTxt(m.moy)}</b></td><td>${m.nb}</td><td>${baremeDe(m.moy).nom}</td></tr>`).join('')}</table>` : '<p>Aucune note pour cette période.</p>'}
    <table class="bul-id"><tr><td>Moyenne générale : <b>${B.moy === null ? '—' : noteTxt(B.moy)}</b></td><td>Taux de réussite : <b>${B.taux === null ? '—' : B.taux + ' %'}</b></td></tr>
    <tr><td>Progression (période précédente) : <b>${prog}</b></td><td>Évaluations : <b>${B.nb}</b></td></tr></table>
    <p>✅ <b>Matières maîtrisées :</b> ${B.maitrisees.length ? esc(B.maitrisees.join(', ')) : '—'}</p>
    <p>📌 <b>Matières à renforcer :</b> ${B.aRenforcer.length ? esc(B.aRenforcer.join(', ')) : '—'}</p>
    <p class="bul-app">📝 <b>Appréciation générale :</b> ${esc(B.appreciation)}</p>
    <div class="bul-sign"><span>Signature du parent</span><span>Signature de l’enseignant</span></div>
    <small>Barème : 18-20 Excellent · 16-17 Très bien · 14-15 Bien · 10-13 À renforcer · 0-9 Insuffisant. Moyenne générale calculée sur les matières du programme national. Édité le ${dateTxt(Date.now())}.</small>
  </div><div class="res-actions"><button class="btn blue big" id="bul-print">🖨️ Imprimer / PDF</button></div>`;
  $$('#acad-bulletin [data-per]').forEach(b => b.onclick = () => { Sound.tap(); acadState.periode = b.dataset.per; RENDER['acad-bulletin'](); });
  $('#bul-print').onclick = () => { Sound.tap(); imprimer(`Bulletin ${p.name} ${B.periode.nom} ${B.annee}`); };
};
// Impression : sur Android, l'activité ouvre le service d'impression (enregistrer en PDF) ; dans un navigateur, window.print()
function imprimer(titre) {
  // la classe n'agit que dans @media print : on la laisse, le service d'impression d'Android lit la page plus tard
  document.body.classList.add('impression');
  try { if (window.AndroidApp && AndroidApp.imprimer) return AndroidApp.imprimer(titre); } catch (e) {}
  const t0 = document.title; document.title = titre; window.print(); document.title = t0;
}

// ---------------- Récompenses ----------------
RENDER['acad-recompenses'] = () => {
  const E = AE('acad-recompenses'), R = Acad.recompenses(), a = Acad.p();
  E.titre.textContent = 'Mes récompenses';
  E.chips.innerHTML = `<div class="chip">⭐ ${R.etoiles}</div><div class="chip">🔥 ${R.serie} jour${R.serie > 1 ? 's' : ''} de suite</div>`;
  E.corps.innerHTML = `<p class="acad-note">Les récompenses se gagnent en apprenant et en étant régulier, jamais en allant vite.</p>
    <h3 class="acad-h">Badges</h3><div class="badges">${BADGES.map(b => `<div class="badge${a.badges[b.id] ? ' on' : ''}"><span>${b.icon}</span><b>${b.nom}</b><small>${a.badges[b.id] ? dateTxt(a.badges[b.id]) : regleTxt(b.regle)}</small></div>`).join('')}</div>
    <h3 class="acad-h">🎓 Diplômes</h3><div class="badges">${CLASSES_ACAD.map(c => `<div class="badge diplome${R.diplomes.includes(c.n) ? ' on' : ''}"><span>📜</span><b>Fin de ${c.nom}</b><small>${R.diplomes.includes(c.n) ? 'obtenu' : `examen ≥ ${EXAMEN.seuil}/20`}</small></div>`).join('')}</div>
    <h3 class="acad-h">🏆 Trophées (matière terminée) : ${R.trophees.length}</h3><div class="liste">${R.trophees.map(t => `<span class="tag">${matiereAcad(t.mat).icon} ${matiereAcad(t.mat).nom} · ${classeAcad(t.classe).nom}</span>`).join('') || '—'}</div>
    <h3 class="acad-h">🏅 Médailles (chapitre maîtrisé) : ${R.medailles.length}</h3><div class="liste">${R.medailles.map(m => `<span class="tag">${matiereAcad(m.mat).icon} ${esc(m.titre)} · ${m.classe}<sup>e</sup></span>`).join('') || '—'}</div>`;
};
const regleTxt = R => R.lecons ? `${R.lecons} leçons validées` : R.moyenne ? `moyenne ≥ ${R.moyenne}/20 sur ${R.quiz} quiz` : R.notePleine ? 'un quiz à 20/20' : R.serieQuiz ? `${R.serieQuiz} quiz réussis de suite` : R.joursSuite ? `${R.joursSuite} jours d’affilée` : R.reussiApresEchec ? 'réussir après un échec' : R.positionnement ? 'faire le test de positionnement' : '';

// ---------------- Préparation ENAFEP (6e primaire) ----------------
RENDER['acad-enafep'] = () => {
  const E = AE('acad-enafep'), a = Acad.p(), hist = a.examens.filter(e => e.type === 'enafep').slice(-15).reverse();
  E.titre.textContent = '📝 Préparation à l’ENAFEP';
  E.chips.innerHTML = '';
  E.corps.innerHTML = `<p class="acad-note">⚠️ ${ENAFEP.avertissement} Les questions reprennent le programme de 5e et 6e primaire dans les trois domaines de l’examen : français, mathématiques et culture générale.</p>
    <div class="acad-mats">${ENAFEP.domaines.map(D => {
      const n = a.examens.filter(e => e.type === 'enafep' && e.domaine === D.id), best = n.length ? Math.max(...n.map(e => e.note)) : null;
      return `<button class="acad-mat" data-dom="${D.id}" style="--c:${D.id === 'fr' ? '#3a86ff' : D.id === 'ma' ? '#ef476f' : '#2a9d8f'}"><span class="ic">${D.id === 'fr' ? '📘' : D.id === 'ma' ? '🔢' : '🌍'}</span><b>${D.nom}</b><small>${D.questions} questions · ${D.minutes} min</small><small>${best === null ? 'pas encore passé' : 'meilleure note ' + noteTxt(best)}</small></button>`;
    }).join('')}</div>
    <h3 class="acad-h">Historique des examens blancs</h3>
    ${hist.length ? `<table class="acad-table"><tr><th>Date</th><th>Domaine</th><th>Note</th><th>Durée</th></tr>${hist.map(e => `<tr><td>${dateTxt(e.d)}</td><td>${ENAFEP.domaines.find(d => d.id === e.domaine).nom}</td><td><b>${noteTxt(e.note)}</b></td><td>${dureeTxt(e.t)}</td></tr>`).join('')}</table>` : '<p>Aucun examen blanc pour le moment.</p>'}`;
  $$('#acad-enafep [data-dom]').forEach(b => b.onclick = () => { Sound.init(); Sound.tap(); demarrerExamen('enafep', 6, b.dataset.dom); });
};

// ---------------- Tableau de bord parent / enseignant ----------------
RENDER['acad-suivi'] = () => {
  const E = AE('acad-suivi'), p = Store.profile(), a = p.academie, sept = Object.entries(a.temps.jours).filter(([j]) => (Date.now() - new Date(j)) / 864e5 < 7).reduce((s, [, v]) => s + v, 0);
  const notes = a.quiz.map(x => x.note), moy = notes.length ? notes.reduce((s, x) => s + x, 0) / notes.length : null;
  E.titre.textContent = `👪 Suivi de ${p.name}`;
  E.chips.innerHTML = '';
  E.corps.innerHTML = `<div class="suivi-kpi">
      <div><b>${classeAcad(a.classe).nom}</b><small>classe actuelle</small></div>
      <div><b>${a.quiz.length}</b><small>quiz passés</small></div>
      <div><b>${moy === null ? '—' : noteTxt(moy)}</b><small>moyenne des quiz</small></div>
      <div><b>${dureeTxt(a.temps.total)}</b><small>temps d’apprentissage</small></div>
      <div><b>${dureeTxt(sept)}</b><small>ces 7 derniers jours</small></div>
      <div><b>${a.diag ? classeAcad(a.diag.conseil).nom : '—'}</b><small>positionnement</small></div></div>
    <h3 class="acad-h">Recommandations</h3><ul class="reco">${Acad.recommandations().map(r => `<li>${esc(r.texte)}</li>`).join('') || '<li>Continuer les leçons dans l’ordre.</li>'}</ul>
    <h3 class="acad-h">Progression par matière (${classeAcad(a.classe).nom})</h3>
    <table class="acad-table"><tr><th>Matière</th><th>Leçons validées</th><th>En cours</th><th>Moyenne</th><th>Temps</th></tr>${MATIERES_ACAD.map(M => {
      const av = Acad.avancement(a.classe, M.id), n = a.quiz.filter(x => x.m === M.id).map(x => x.note);
      return av.total ? `<tr><td>${M.icon} ${M.nom}</td><td>${av.ok}/${av.total}</td><td>${av.cours}</td><td>${n.length ? noteTxt(n.reduce((s, x) => s + x, 0) / n.length) : '—'}</td><td>${dureeTxt(a.temps.mat[M.id] || 0)}</td></tr>` : '';
    }).join('')}</table>
    <h3 class="acad-h">Difficultés récurrentes</h3>${Acad.difficultes(8).length ? `<table class="acad-table"><tr><th>Question</th><th>Erreurs</th><th>Leçon</th></tr>${Acad.difficultes(8).map(e => `<tr><td>${esc(e.q)}</td><td>${e.n}</td><td>${esc((leconAcad(e.l) || {}).titre || '')}</td></tr>`).join('')}</table>` : '<p>Aucune erreur enregistrée.</p>'}
    <h3 class="acad-h">Derniers quiz et examens</h3><table class="acad-table"><tr><th>Date</th><th>Évaluation</th><th>Note</th></tr>${[...a.quiz.slice(-10).map(x => ({ d: x.d, t: (leconAcad(x.id) || {}).titre, n: x.note })), ...a.examens.slice(-5).map(e => ({ d: e.d, t: e.type === 'annee' ? `Examen ${classeAcad(e.classe).nom}` : `ENAFEP blanc ${e.domaine}`, n: e.note }))].sort((x, y) => y.d - x.d).slice(0, 12).map(x => `<tr><td>${dateTxt(x.d)}</td><td>${esc(x.t || '')}</td><td><b>${noteTxt(x.n)}</b></td></tr>`).join('')}</table>
    <h3 class="acad-h">Réglages</h3>
    <div class="row"><b>Classe :</b> ${CLASSES_ACAD.map(c => `<button class="btn" data-setcl="${c.n}" style="--c:${c.couleur};${a.classe === c.n ? 'outline:.25rem solid #2b2d42' : ''}">${c.n}<sup>${c.n === 1 ? 're' : 'e'}</sup></button>`).join('')}</div>
    <div class="row"><b>Ordre des leçons :</b> <button class="btn ${a.ordreLibre ? 'orange' : 'green'}" id="sv-ordre">${a.ordreLibre ? '🔓 Ordre libre' : '🔒 Ordre imposé (recommandé)'}</button></div>
    <div class="row"><button class="btn blue" id="sv-bull">📄 Bulletin</button><button class="btn violet" id="sv-diag">🧪 Test de positionnement</button><button class="btn" id="sv-parents" style="--c:#8d99ae">⚙️ Langue, son, profil</button></div>
    <p class="small-note">Toutes les données restent sur cet appareil (aucune connexion Internet).</p>`;
  $$('#acad-suivi [data-setcl]').forEach(b => b.onclick = () => { Sound.tap(); a.classe = +b.dataset.setcl; acadState.classe = a.classe; Store.save(); RENDER['acad-suivi'](); });
  $('#sv-ordre').onclick = () => { Sound.tap(); a.ordreLibre = !a.ordreLibre; Store.save(); RENDER['acad-suivi'](); };
  $('#sv-bull').onclick = () => { Sound.tap(); show('acad-bulletin'); };
  $('#sv-diag').onclick = () => { Sound.tap(); demarrerPositionnement(); };
  $('#sv-parents').onclick = () => { Sound.tap(); parentPanel(); };
};

// ---------------- Navigation : l'académie devient l'accueil après le choix du profil ----------------
const goBackAvantAcad = goBack;
goBack = function () {
  if ($('#modal').classList.contains('on') || $('#celebrate').classList.contains('on')) return goBackAvantAcad();
  switch (current) {
    case 'hub': show('academie'); return true;
    case 'academie': show('profiles'); return true;
    case 'acad-matiere': case 'acad-bulletin': case 'acad-recompenses': case 'acad-enafep': case 'acad-suivi': show('academie'); return true;
    case 'acad-lecon': show('acad-matiere'); return true;
    case 'acad-quiz': {
      clearInterval(acadState.tic); const S = acadState.session;
      show(S && S.type === 'quiz' ? 'acad-lecon' : S && S.type === 'enafep' ? 'acad-enafep' : 'academie'); return true;
    }
    case 'acad-resultat': { const S = acadState.resultat.session; show(S.type === 'quiz' ? 'acad-matiere' : S.type === 'enafep' ? 'acad-enafep' : 'academie'); return true; }
    default: return goBackAvantAcad();
  }
};

// ---------------- Création du profil : choix de la classe (1re → 6e) ou test de positionnement ----------------
// Le niveau des jeux (profil.age : 0 = CE2, 1 = CM1, 2 = génie) est déduit de la classe ; un parent peut le changer.
const ageDeClasse = n => (n <= 3 ? 0 : n === 4 ? 1 : 2);
RENDER.age = () => {
  $('#age .title').textContent = 'Choisis ta classe';
  const box = $('#age-list'); box.innerHTML = '';
  const creer = (classe, diag) => {
    Sound.tap();
    const p = state.draft.editing ? Store.profile() : null;
    if (p) { p.academie.classe = classe; p.age = ageDeClasse(classe); Store.save(); return show('academie'); }
    const np = Store.complet({ id: 'p' + Date.now(), name: state.draft.name, avatar: state.draft.avatar, shirt: state.draft.shirt, age: ageDeClasse(classe), academie: { classe } });
    Store.data.profiles.push(np); Store.data.current = np.id; Store.save();
    acadState.classe = classe;
    if (diag) demarrerPositionnement(); else show('academie');
  };
  CLASSES_ACAD.forEach(C => {
    const c = h('button', 'age-card', `<div class="ic">${C.n}<sup>${C.n === 1 ? 're' : 'e'}</sup></div><div class="rg">${C.nom}</div><div class="nm">${C.ages}</div>`);
    c.style.background = C.couleur; c.dataset.classe = C.n;
    c.onclick = () => creer(C.n, false);
    box.append(c);
  });
  const d = h('button', 'age-card', `<div class="ic">🧪</div><div class="rg">Je ne sais pas</div><div class="nm">test de positionnement</div>`);
  d.style.background = '#8d99ae'; d.dataset.classe = 'diag';
  d.onclick = () => creer(1, true);
  box.append(d);
};
