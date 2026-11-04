// Cécilia & Manoach — images des personnages et des scènes, avec repli sur une silhouette.
// Une image absente (pas encore livrée par l'auteur) est remplacée par une silhouette SVG aux couleurs du personnage :
// le jeu fonctionne toujours, et les vraies images arrivent sans changer de code (voir img/assets.json).
const Assets = {
  absentes: new Set(), // images déjà essayées et introuvables : on ne les redemande pas
  chemin: (perso, pose) => `img/persos/${perso}/${pose}.webp`,
  scene: id => `img/scenes/${id}.webp`,

  // Silhouette de remplacement : forme simple, aucune apparence inventée.
  silhouette(perso, cls = '') {
    const P = PERSONNAGES[perso] || { couleur: '#9AA0B5' }, c = P.couleur;
    const nom = typeof P.nom === 'object' ? tx(P.nom) : (P.nom || perso);
    let corps;
    if (perso === 'etoile') corps = `<path d="M60 8 L74 44 L112 46 L82 70 L93 108 L60 86 L27 108 L38 70 L8 46 L46 44 Z" fill="${c}" stroke="#E0A42E" stroke-width="4" stroke-linejoin="round"/>`;
    else if (perso === 'lune') corps = `<circle cx="60" cy="62" r="50" fill="${c}" stroke="#E0A42E" stroke-width="3"/>`;
    else if (perso === 'luciole') corps = `<ellipse cx="60" cy="70" rx="18" ry="26" fill="${c}"/><ellipse cx="38" cy="50" rx="18" ry="10" fill="#fff" opacity=".6"/><ellipse cx="82" cy="50" rx="18" ry="10" fill="#fff" opacity=".6"/>`;
    else if (perso === 'therese') corps = `<ellipse cx="60" cy="78" rx="48" ry="30" fill="${c}"/><circle cx="102" cy="66" r="14" fill="${c}"/>`;
    else if (perso === 'axel') corps = `<rect x="38" y="44" width="44" height="72" rx="14" fill="${c}"/><ellipse cx="60" cy="34" rx="56" ry="28" fill="#5DA35A"/>`;
    else if (perso === 'christian') corps = `<ellipse cx="56" cy="70" rx="28" ry="20" fill="${c}" stroke="#ccc" stroke-width="2"/><path d="M76 60 Q82 28 70 18" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M70 18 L104 22" stroke="#F2A23A" stroke-width="5" stroke-linecap="round"/><path d="M50 88 L46 116 M62 88 L66 116" stroke="#999" stroke-width="3"/>`;
    else corps = `<circle cx="60" cy="30" r="22" fill="${c}"/><path d="M24 116 Q24 58 60 56 Q96 58 96 116 Z" fill="${c}"/>`;
    return `<svg class="silhouette ${cls}" viewBox="0 0 120 120" role="img" aria-label="${esc(nom)}" data-perso="${perso}">${corps}</svg>`;
  },

  // Image d'un personnage dans une pose ; silhouette si l'image manque.
  perso(perso, pose, cls = '') {
    const P = PERSONNAGES[perso];
    pose = pose || (P && P.poses[0]);
    const src = this.chemin(perso, pose);
    if (this.absentes.has(src) || (P && P.neutre)) return this.silhouette(perso, cls);
    return `<img class="sprite ${cls}" src="${src}" alt="" data-perso="${perso}" data-cls="${cls}" onerror="Assets.repli(this)">`;
  },
  repli(img) {
    this.absentes.add(img.getAttribute('src'));
    const tmp = document.createElement('div'); tmp.innerHTML = this.silhouette(img.dataset.perso, img.dataset.cls || '');
    img.replaceWith(tmp.firstChild);
  },

  // Fond d'une scène (illustration du livre) ; sans image, le décor CSS du stage reste visible.
  fond(el, id) {
    const src = this.scene(id);
    if (this.absentes.has(src)) return;
    const im = new Image();
    im.onload = () => { el.style.backgroundImage = `url(${src})`; el.classList.add('avec-image'); };
    im.onerror = () => this.absentes.add(src);
    im.src = src;
  },
};
