// Cécilia & Manoach — scènes d'histoire : ouverture d'un stage (illustration + personnage + bulle) et pages du livre.
// Les illustrations viennent du livre (img/scenes/<id>.webp) ; sans elles, le décor CSS du stage s'affiche.
const Scenes = {
  // Ouverture d'un stage : décor, personnage guide qui parle, réplique d'intro.
  stage(el, stage) {
    el.className = 'scene decor-' + stage.decor;
    el.innerHTML = `<div class="scene-perso">${Assets.perso(stage.guide, null, 'respire')}</div>
      <div class="bulle"><b>${esc(nomDe(stage.guide))}</b>${esc(tx(stage.intro))}</div>`;
    Assets.fond(el, 'stage-' + stage.id);
  },
  // Une page du livre : illustration (si fournie) et texte.
  page(pg) {
    const titre = pg.id === 'dedicace' ? t('dedication') : `${t('bookPage')} ${pg.id}`;
    return `<div class="livre-page"><div class="livre-ill" id="livre-ill"></div><div class="livre-num">${titre}</div><div class="livre-txt">${esc(tx(pg))}</div></div>`;
  },
};
const nomDe = perso => { const P = PERSONNAGES[perso]; return P ? tx(P.nom) : perso; };
