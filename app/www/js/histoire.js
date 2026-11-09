// Cécilia & Manoach — toute la structure de l'histoire, EN DONNÉES UNIQUEMENT (aucune logique).
// 10 chapitres → 30 stages (3 par chapitre) → 70 parties (2 + 2 + 3 par chapitre).
// Textes : { fr, en } ; les autres langues retombent sur l'anglais. Les mots lingala restent en lingala.
// Les répliques nouvelles (chapitres 1 à 5) sont listées dans docs/DIALOGUES.md pour validation par l'auteur.

// ---------- Les mécaniques ----------
// base : jeu V1 utilisé tant que la mécanique n'a pas son propre module GAME_FN.<id> (phase 3).
// ages : paramètres propres à la mécanique pour les 4-6, 7-9 et 10-12 ans.
const MECANIQUES = {
  course:     { base: 'race',    icon: '🏃', ages: [{}, {}, {}] },
  peche:      { base: 'fish',    icon: '🎣', ages: [{}, {}, {}] },
  partage:    { base: 'feed',    icon: '🥭', ages: [{}, {}, {}] },
  glouton:    { base: 'monster', icon: '🤝', ages: [{}, {}, {}] },
  relier:     { base: 'link',    icon: '✨', ages: [{}, {}, {}] },
  tri:        { base: 'sort',    icon: '🧺', ages: [{}, {}, {}] },
  coloriage:  { base: 'color',   icon: '🎨', ages: [{}, {}, {}] },
  rangement:  { base: 'sort',    icon: '🧸', nouveau: true, ages: [{ objets: 4 }, { objets: 6 }, { objets: 8 }] },
  compter:    { base: 'fish',    icon: '🔢', nouveau: true, ages: [{ max: 10 }, { max: 100, pas: [2, 5, 10] }, { max: 100, mult: true }] },
  trace:      { base: 'link',    icon: '☄️', nouveau: true, ages: [{ points: 4 }, { points: 6 }, { points: 9 }] },
  lampe:      { base: 'fish',    icon: '🔦', nouveau: true, ages: [{ caches: 4, rayon: 1.4 }, { caches: 6, rayon: 1.1 }, { caches: 8, rayon: .8 }] },
  labyrinthe: { base: 'race',    icon: '🧭', nouveau: true, ages: [{ carrefours: 4 }, { carrefours: 6 }, { carrefours: 8 }] },
  frotter:    { base: 'monster', icon: '🧽', nouveau: true, ages: [{ seuil: .6 }, { seuil: .7 }, { seuil: .8 }] },
  sequence:   { base: 'sort',    icon: '🔁', nouveau: true, ages: [{ etapes: 3 }, { etapes: 4 }, { etapes: 5 }] },
  emotions:   { base: 'link',    icon: '😊', nouveau: true, ages: [{ choix: 2 }, { choix: 3 }, { choix: 4 }] },
  lingala:    { base: 'link',    icon: '🗣️', nouveau: true, ages: [{ mots: 3 }, { mots: 4 }, { mots: 5 }] },
  rythme:     { base: 'race',    icon: '🥁', nouveau: true, ages: [{ coups: 3 }, { coups: 5 }, { coups: 8 }] },
  escalade:   { base: 'race',    icon: '🌳', nouveau: true, ages: [{ pas: [1] }, { pas: [2, 5, 10] }, { suites: ['×2', '÷2'] }] },
  escalier:   { base: 'sort',    icon: '🪜', nouveau: true, ages: [{ marches: 4, max: 10 }, { marches: 6, max: 100 }, { marches: 8, max: 1000 }] },
  logique:    { base: 'monster', icon: '🧩', nouveau: true, ages: [{ type: ['intrus'] }, { type: ['intrus', 'suite'] }, { type: ['intrus', 'suite', 'qui'] }] },
  melange:    { base: 'race',    icon: '🌈', nouveau: true, ages: [{}, {}, {}] },
};

// ---------- Les personnages ----------
// couleur : teinte de la silhouette de remplacement tant que l'image n'est pas fournie. fete : pose utilisée pour la fête de fin de chapitre.
const PERSONNAGES = {
  cecilia:   { nom: 'Cécilia',   couleur: '#F28C28', fete: 'applaudit', poses: ['debout', 'contente', 'pointe', 'reflechit', 'applaudit', 'tient-etoile', 'grimpe', 'court'] },
  manoach:   { nom: 'Manoach',   couleur: '#2EC4B6', fete: 'applaudit', poses: ['debout', 'content', 'tambour', 'reflechit', 'applaudit', 'grimpe', 'court'] },
  etoile:    { nom: { fr: 'La petite étoile', en: 'The little star' }, couleur: '#FFD84A', fete: 'contente', poses: ['triste', 'froide', 'sale', 'propre', 'contente', 'pale', 'clin-oeil'] },
  therese:   { nom: 'Thérèse',   couleur: '#5DA35A', fete: 'sourit', poses: ['nage', 'parle', 'sourit'] },
  axel:      { nom: 'Axel',      couleur: '#8B6B4A', fete: 'sourit', poses: ['calme', 'parle', 'sourit'] },
  christian: { nom: 'Christian', couleur: '#F4F1EA', fete: 'ailes-ouvertes', poses: ['debout', 'ailes-ouvertes', 'vole-etoile', 'timide'] },
  lune:      { nom: { fr: 'Maman la Lune', en: 'Mama Moon' }, couleur: '#FFF4D6', fete: 'bras-ouverts', poses: ['sourit', 'bras-ouverts', 'calin'] },
  luciole:   { nom: { fr: 'Luciole', en: 'Firefly' }, couleur: '#E8F56B', fete: 'ailes-ouvertes', poses: ['ailes-ouvertes', 'ailes-fermees'] },
  // Pas dans le livre : silhouettes neutres tant que l'auteur ne les a pas décrits.
  francesca: { nom: 'Francesca', couleur: '#9AA0B5', neutre: true, poses: ['debout', 'content', 'aide'] },
  rokaya:    { nom: 'Rokaya',    couleur: '#9AA0B5', neutre: true, poses: ['debout', 'content', 'aide'] },
  mathias:   { nom: 'Mathias',   couleur: '#9AA0B5', neutre: true, poses: ['debout', 'content', 'aide'] },
};

// ---------- Les pages du livre (« Mon livre ») ----------
// Résumés provisoires (docs/HISTOIRE.md) en attendant le texte exact et les illustrations du livre.
const PAGES_LIVRE = [
  { id: 'dedicace', fr: 'À l’esprit de la famille et à la force de l’unité.', en: 'To the spirit of family and the strength of unity.' },
  { id: 1, fr: 'Au bord du grand fleuve Congo, Cécilia et Manoach comptent les étoiles : « Une, deux, trois… mille ! »', en: 'By the great Congo River, Cecilia and Manoach count the stars: “One, two, three… a thousand!”' },
  { id: 2, fr: 'Une étoile glisse du ciel, file au-dessus des palmiers et… plouf ! tombe dans le fleuve.', en: 'A star slides down from the sky, over the palm trees and… splash! into the river.' },
  { id: 3, fr: '« Mbote, petite étoile ! Tu as froid ? » — « Je me suis perdue. Je veux retourner chez ma maman, la Lune. »', en: '“Mbote, little star! Are you cold?” — “I’m lost. I want to go back to my mama, the Moon.”' },
  { id: 4, fr: 'Cécilia la prend dans ses mains, tiède comme une mangue au soleil. « Ne pleure pas. On va t’aider. »', en: 'Cecilia holds her, warm as a mango in the sun. “Don’t cry. We’ll help you.”' },
  { id: 5, fr: 'Thérèse la tortue : « Je suis bien trop lente, mais je connais quelqu’un de très, très grand. Montez sur mon dos ! »', en: 'Thérèse the turtle: “I’m far too slow, but I know someone very, very tall. Climb on my back!”' },
  { id: 6, fr: 'Axel, le vieux baobab : « Grimpez, les enfants. Je vous tiendrai. »', en: 'Axel, the old baobab: “Climb, children. I will hold you.”' },
  { id: 7, fr: 'Ils grimpent branche après branche, mais le ciel est encore trop loin, et la petite étoile commence à pâlir.', en: 'They climb branch after branch, but the sky is still too far, and the little star starts to fade.' },
  { id: 8, fr: 'Christian, le héron blanc : « Je vole haut, mais pas jusqu’aux étoiles. » — « Et si nous étions nombreux ? »', en: 'Christian, the white heron: “I fly high, but not up to the stars.” — “What if there were many of us?”' },
  { id: 9, fr: 'Boum, boum, boum ! « Lucioles ! » Des milliers de lucioles forment un chemin brillant jusqu’au ciel.', en: 'Boom, boom, boom! “Fireflies!” Thousands of fireflies make a shining path up to the sky.' },
  { id: 10, fr: 'Christian prend l’étoile dans son bec et suit l’escalier de lucioles. Plus haut… toujours plus haut !', en: 'Christian takes the star in his beak and follows the firefly staircase. Higher… ever higher!' },
  { id: 11, fr: '« Mama ! » — « Ma petite étoile ! » Elle reprend sa place et brille plus fort que toutes les autres.', en: '“Mama!” — “My little star!” She takes her place again and shines brighter than all the others.' },
  { id: 12, fr: '« Une, deux, trois… et toi, notre amie. » Mosapi moko elongolaka sili te.', en: '“One, two, three… and you, our friend.” Mosapi moko elongolaka sili te.' },
];

// ---------- Les 10 chapitres ----------
// pages : pages du livre débloquées à la fin du chapitre. etoile : humeur de la petite étoile (jauge sur la carte).
// Chaque stage : decor, guide (personnage qui présente), intro (réplique d'ouverture).
// Chaque partie : meca (mécanique), notion (compétence du programme scolaire, voir programme.js),
// niv (variante 0-2 pour les 3 niveaux : page de coloriage, réglages de repli).
const CHAPITRES = [
  { id: 1, titre: { fr: 'La maison au bord du fleuve', en: 'The house by the river' }, pages: [1], etoile: null, stages: [
    { id: '1.1', titre: { fr: 'Ranger la chambre', en: 'Tidy the bedroom' }, decor: 'maison', guide: 'cecilia',
      intro: { fr: 'Avant de regarder les étoiles, on range la chambre !', en: 'Before watching the stars, let’s tidy the bedroom!' }, parties: [
      { id: '1.1.1', meca: 'rangement', notion: 'comparer', niv: [0, 0, 0], titre: { fr: 'Les jouets', en: 'The toys' } },
      { id: '1.1.2', meca: 'tri', notion: 'multiples', niv: [0, 0, 0], titre: { fr: 'Les habits', en: 'The clothes' } },
    ] },
    { id: '1.2', titre: { fr: 'Préparer la soirée', en: 'Get ready for the evening' }, decor: 'maison', guide: 'manoach',
      intro: { fr: 'On déroule la natte dehors. Qui a faim de mangues ?', en: 'We roll out the mat outside. Who wants mangoes?' }, parties: [
      { id: '1.2.1', meca: 'rangement', notion: 'comparer', niv: [0, 0, 0], titre: { fr: 'La natte', en: 'The mat' } },
      { id: '1.2.2', meca: 'partage', notion: 'partage', niv: [0, 0, 0], titre: { fr: 'Les mangues', en: 'The mangoes' } },
    ] },
    { id: '1.3', titre: { fr: 'Compter les étoiles', en: 'Count the stars' }, decor: 'nuit', guide: 'cecilia',
      intro: { fr: 'Une, deux, trois… mille !', en: 'One, two, three… a thousand!' }, parties: [
      { id: '1.3.1', meca: 'compter', notion: 'numeration', niv: [0, 0, 0], titre: { fr: 'Une, deux, trois…', en: 'One, two, three…' } },
      { id: '1.3.2', meca: 'relier', notion: 'add', niv: [0, 0, 0], titre: { fr: 'Les constellations', en: 'The constellations' } },
      { id: '1.3.3', meca: 'lampe', notion: 'sous', niv: [1, 1, 1], titre: { fr: 'L’étoile qui bouge', en: 'The moving star' } },
    ] },
  ] },
  { id: 2, titre: { fr: 'Plouf !', en: 'Splash!' }, pages: [2], etoile: 'triste', stages: [
    { id: '2.1', titre: { fr: 'L’étoile filante', en: 'The shooting star' }, decor: 'nuit', guide: 'manoach',
      intro: { fr: 'Regarde ! Une étoile glisse du ciel !', en: 'Look! A star is sliding down from the sky!' }, parties: [
      { id: '2.1.1', meca: 'trace', notion: 'suites', niv: [0, 0, 0], titre: { fr: 'Suivre l’étoile', en: 'Follow the star' } },
      { id: '2.1.2', meca: 'lampe', notion: 'numeration', niv: [0, 0, 0], titre: { fr: 'Où va-t-elle tomber ?', en: 'Where will it fall?' } },
    ] },
    { id: '2.2', titre: { fr: 'Courir sur la berge', en: 'Run along the bank' }, decor: 'berge', guide: 'cecilia',
      intro: { fr: 'Plouf ! Vite, au fleuve !', en: 'Splash! Quick, to the river!' }, parties: [
      { id: '2.2.1', meca: 'course', notion: 'add', niv: [0, 0, 0], titre: { fr: 'Jusqu’au fleuve', en: 'To the river' } },
      { id: '2.2.2', meca: 'course', notion: 'sous', niv: [1, 1, 1], titre: { fr: 'Attention aux roseaux', en: 'Mind the reeds' } },
    ] },
    { id: '2.3', titre: { fr: 'Le courant l’emporte', en: 'The current carries it away' }, decor: 'fleuve', guide: 'manoach',
      intro: { fr: 'La petite lumière part vers la forêt. Suivons-la !', en: 'The little light drifts towards the forest. Let’s follow it!' }, parties: [
      { id: '2.3.1', meca: 'course', notion: 'complements', niv: [1, 1, 1], titre: { fr: 'Suivre la lumière', en: 'Follow the light' } },
      { id: '2.3.2', meca: 'labyrinthe', notion: 'doubles', niv: [0, 0, 0], titre: { fr: 'Le bon bras du fleuve', en: 'The right branch of the river' } },
      { id: '2.3.3', meca: 'labyrinthe', notion: 'probleme', niv: [1, 1, 1], titre: { fr: 'Encore un carrefour', en: 'Another fork' } },
    ] },
  ] },
  { id: 3, titre: { fr: 'La forêt', en: 'The forest' }, pages: [3], etoile: 'triste', ami: 'francesca', stages: [
    { id: '3.1', titre: { fr: 'L’entrée de la forêt', en: 'The edge of the forest' }, decor: 'foret', guide: 'cecilia',
      intro: { fr: 'Des petites traces de lumière… par ici !', en: 'Little traces of light… this way!' }, parties: [
      { id: '3.1.1', meca: 'lampe', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'Les traces lumineuses', en: 'The glowing traces' } },
      { id: '3.1.2', meca: 'tri', notion: 'multiples', niv: [1, 1, 1], titre: { fr: 'Les bons chemins', en: 'The right paths' } },
    ] },
    { id: '3.2', titre: { fr: 'La forêt sombre', en: 'The dark forest' }, decor: 'foret', guide: 'manoach',
      intro: { fr: 'Il fait tout noir… On allume la lampe ?', en: 'It’s all dark… Shall we turn on the lamp?' }, parties: [
      { id: '3.2.1', meca: 'lampe', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'La lampe', en: 'The lamp' } },
      { id: '3.2.2', meca: 'lampe', notion: 'x10', niv: [1, 1, 1], titre: { fr: 'Les objets cachés', en: 'Hidden objects' } },
    ] },
    { id: '3.3', titre: { fr: 'Le marais', en: 'The marsh' }, decor: 'marais', guide: 'cecilia',
      intro: { fr: 'Chut… tu entends ? Quelqu’un appelle à l’aide !', en: 'Shh… do you hear? Someone is calling for help!' }, parties: [
      { id: '3.3.1', meca: 'labyrinthe', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'Vers la petite lumière', en: 'To the little light' } },
      { id: '3.3.2', meca: 'compter', notion: 'probleme', niv: [1, 1, 1], titre: { fr: 'Les grenouilles', en: 'The frogs' } },
      { id: '3.3.3', meca: 'labyrinthe', notion: 'doubles', niv: [2, 2, 2], titre: { fr: 'L’appel à l’aide', en: 'The call for help' } },
    ] },
  ] },
  { id: 4, titre: { fr: 'La boue', en: 'The mud' }, pages: ['dedicace'], etoile: 'sale', ami: 'rokaya', stages: [
    { id: '4.1', titre: { fr: 'L’étoile coincée', en: 'The stuck star' }, decor: 'marais', guide: 'manoach',
      intro: { fr: 'Elle est là, sous les feuilles !', en: 'There she is, under the leaves!' }, parties: [
      { id: '4.1.1', meca: 'frotter', notion: 'complements', niv: [0, 0, 0], titre: { fr: 'Dégager les feuilles', en: 'Clear the leaves' } },
      { id: '4.1.2', meca: 'rangement', notion: 'comparer', niv: [1, 1, 1], titre: { fr: 'Ôter les branches', en: 'Remove the branches' } },
    ] },
    { id: '4.2', titre: { fr: 'Creuser', en: 'Dig' }, decor: 'marais', guide: 'cecilia',
      intro: { fr: 'Doucement, on creuse autour sans lui faire mal.', en: 'Gently, we dig around without hurting her.' }, parties: [
      { id: '4.2.1', meca: 'frotter', notion: 'complements', niv: [1, 1, 1], titre: { fr: 'Creuser doucement', en: 'Dig gently' } },
      { id: '4.2.2', meca: 'glouton', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'Les cailloux', en: 'The pebbles' } },
    ] },
    { id: '4.3', titre: { fr: 'Tirer ensemble', en: 'Pull together' }, decor: 'marais', guide: 'manoach',
      intro: { fr: 'Tous ensemble : un, deux, trois… tirez !', en: 'All together: one, two, three… pull!' }, parties: [
      { id: '4.3.1', meca: 'rythme', notion: 'suites', niv: [1, 1, 1], titre: { fr: 'En rythme', en: 'In rhythm' } },
      { id: '4.3.2', meca: 'course', notion: 'multpose', niv: [1, 1, 1], titre: { fr: 'Encore un effort', en: 'One more push' } },
      { id: '4.3.3', meca: 'glouton', notion: 'tables', niv: [2, 2, 2], titre: { fr: 'Elle est libre !', en: 'She is free!' } },
    ] },
  ] },
  { id: 5, titre: { fr: 'Le bain de la petite étoile', en: 'The little star’s bath' }, pages: [4], etoile: 'propre', ami: 'mathias', stages: [
    { id: '5.1', titre: { fr: 'Aller chercher l’eau', en: 'Fetch the water' }, decor: 'berge', guide: 'cecilia',
      intro: { fr: 'Elle est toute sale. Il nous faut de l’eau !', en: 'She is all muddy. We need water!' }, parties: [
      { id: '5.1.1', meca: 'partage', notion: 'partage', niv: [1, 1, 1], titre: { fr: 'Remplir les seaux', en: 'Fill the buckets' } },
      { id: '5.1.2', meca: 'glouton', notion: 'complements', niv: [1, 1, 1], titre: { fr: 'Porter l’eau', en: 'Carry the water' } },
    ] },
    { id: '5.2', titre: { fr: 'Laver l’étoile', en: 'Wash the star' }, decor: 'maison', guide: 'manoach',
      intro: { fr: 'Savon, on frotte, on rince !', en: 'Soap, scrub, rinse!' }, parties: [
      { id: '5.2.1', meca: 'frotter', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'Frotter chaque branche', en: 'Scrub each point' } },
      { id: '5.2.2', meca: 'sequence', notion: 'comparer', niv: [1, 1, 1], titre: { fr: 'Dans le bon ordre', en: 'In the right order' } },
    ] },
    { id: '5.3', titre: { fr: 'Sécher et consoler', en: 'Dry and comfort' }, decor: 'maison', guide: 'cecilia',
      intro: { fr: 'Mbote, petite étoile ! Tu as froid ?', en: 'Mbote, little star! Are you cold?' }, parties: [
      { id: '5.3.1', meca: 'frotter', notion: 'complements', niv: [1, 1, 1], titre: { fr: 'Tiède comme une mangue', en: 'Warm as a mango' } },
      { id: '5.3.2', meca: 'emotions', notion: 'divtables', niv: [1, 1, 1], titre: { fr: 'Ce qu’elle ressent', en: 'How she feels' } },
      { id: '5.3.3', meca: 'lingala', notion: 'mesures', niv: [1, 1, 1], titre: { fr: 'Mbote !', en: 'Mbote!' } },
    ] },
  ] },
  { id: 6, titre: { fr: 'Thérèse la tortue', en: 'Thérèse the turtle' }, livre: '5-6', pages: [5], etoile: 'contente', stages: [
    { id: '6.1', titre: { fr: 'Rencontrer Thérèse', en: 'Meet Thérèse' }, decor: 'fleuve', guide: 'therese',
      intro: { fr: 'Je suis bien trop lente, mais je connais quelqu’un de très, très grand.', en: 'I’m far too slow, but I know someone very, very tall.' }, parties: [
      { id: '6.1.1', meca: 'emotions', notion: 'durees', niv: [1, 1, 1], titre: { fr: 'Parler à Thérèse', en: 'Talk to Thérèse' } },
      { id: '6.1.2', meca: 'lingala', notion: 'mesures', niv: [1, 1, 1], titre: { fr: 'Les mots du fleuve', en: 'River words' } },
    ] },
    { id: '6.2', titre: { fr: 'Sur le dos de Thérèse', en: 'On Thérèse’s back' }, decor: 'fleuve', guide: 'therese',
      intro: { fr: 'Montez sur mon dos !', en: 'Climb on my back!' }, parties: [
      { id: '6.2.1', meca: 'peche', notion: 'divtables', niv: [1, 1, 1], titre: { fr: 'Les bons passages', en: 'The right passages' } },
      { id: '6.2.2', meca: 'course', notion: 'multpose', niv: [1, 1, 1], titre: { fr: 'Traverser l’Ebale', en: 'Cross the Ebale' } },
    ] },
    { id: '6.3', titre: { fr: 'L’autre rive', en: 'The other bank' }, decor: 'fleuve', guide: 'manoach',
      intro: { fr: 'Attention aux remous ! On y est presque.', en: 'Watch out for the whirlpools! Almost there.' }, parties: [
      { id: '6.3.1', meca: 'course', notion: 'divreste', niv: [1, 1, 1], titre: { fr: 'Les remous', en: 'The whirlpools' } },
      { id: '6.3.2', meca: 'compter', notion: 'probleme', niv: [1, 1, 1], titre: { fr: 'Les nénuphars', en: 'The water lilies' } },
      { id: '6.3.3', meca: 'peche', notion: 'fractions', niv: [2, 2, 2], titre: { fr: 'Accoster chez Axel', en: 'Landing at Axel’s' } },
    ] },
  ] },
  { id: 7, titre: { fr: 'Axel le baobab', en: 'Axel the baobab' }, livre: '6-7', pages: [6, 7], etoile: 'pale', stages: [
    { id: '7.1', titre: { fr: 'Le pied du baobab', en: 'At the foot of the baobab' }, decor: 'baobab', guide: 'axel',
      intro: { fr: 'Grimpez, les enfants. Je vous tiendrai.', en: 'Climb, children. I will hold you.' }, parties: [
      { id: '7.1.1', meca: 'escalade', notion: 'suites', niv: [1, 1, 1], titre: { fr: 'Les prises', en: 'The footholds' } },
      { id: '7.1.2', meca: 'tri', notion: 'multiples', niv: [1, 1, 1], titre: { fr: 'Les fleurs d’Axel', en: 'Axel’s flowers' } },
    ] },
    { id: '7.2', titre: { fr: 'Branche après branche', en: 'Branch after branch' }, decor: 'baobab', guide: 'cecilia',
      intro: { fr: 'Encore une branche… et encore une !', en: 'One more branch… and another!' }, parties: [
      { id: '7.2.1', meca: 'escalade', notion: 'suites', niv: [1, 1, 1], titre: { fr: 'Plus haut', en: 'Higher' } },
      { id: '7.2.2', meca: 'escalade', notion: 'x10', niv: [2, 2, 2], titre: { fr: 'Encore plus haut', en: 'Even higher' } },
    ] },
    { id: '7.3', titre: { fr: 'Tout en haut', en: 'At the very top' }, decor: 'baobab', guide: 'manoach',
      intro: { fr: 'Le ciel est encore trop loin… et la petite étoile pâlit !', en: 'The sky is still too far… and the little star is fading!' }, parties: [
      { id: '7.3.1', meca: 'escalade', notion: 'fractions', niv: [2, 2, 2], titre: { fr: 'La dernière branche', en: 'The last branch' } },
      { id: '7.3.2', meca: 'course', notion: 'divreste', niv: [2, 2, 2], titre: { fr: 'Vite, de la lumière !', en: 'Quick, some light!' } },
      { id: '7.3.3', meca: 'course', notion: 'probleme', niv: [2, 2, 2], titre: { fr: 'Tiens bon, petite étoile', en: 'Hold on, little star' } },
    ] },
  ] },
  { id: 8, titre: { fr: 'Christian et les amis', en: 'Christian and the friends' }, livre: '8', pages: [8], etoile: 'pale', amis: ['francesca', 'rokaya', 'mathias'], stages: [
    { id: '8.1', titre: { fr: 'Christian le héron', en: 'Christian the heron' }, decor: 'fleuve', guide: 'christian',
      intro: { fr: 'Je vole haut, mais pas jusqu’aux étoiles.', en: 'I fly high, but not up to the stars.' }, parties: [
      { id: '8.1.1', meca: 'emotions', notion: 'perimetre', niv: [1, 1, 1], titre: { fr: 'Rassurer Christian', en: 'Reassure Christian' } },
      { id: '8.1.2', meca: 'relier', notion: 'divtables', niv: [1, 1, 1], titre: { fr: 'Qui sait faire quoi ?', en: 'Who can do what?' } },
    ] },
    { id: '8.2', titre: { fr: '« Et si nous étions nombreux ? »', en: '“What if there were many of us?”' }, decor: 'fleuve', guide: 'cecilia',
      intro: { fr: 'Et si nous étions nombreux ?', en: 'What if there were many of us?' }, parties: [
      { id: '8.2.1', meca: 'logique', notion: 'tables', niv: [1, 1, 1], titre: { fr: 'Réfléchir ensemble', en: 'Think together' } },
      { id: '8.2.2', meca: 'logique', notion: 'complements', niv: [2, 2, 2], titre: { fr: 'Les amis arrivent', en: 'The friends arrive' } },
    ] },
    { id: '8.3', titre: { fr: 'Tous ensemble', en: 'All together' }, decor: 'fleuve', guide: 'manoach',
      intro: { fr: 'Chacun apporte quelque chose. Ensemble, on peut !', en: 'Everyone brings something. Together, we can!' }, parties: [
      { id: '8.3.1', meca: 'logique', notion: 'tables', niv: [2, 2, 2], titre: { fr: 'Le plan', en: 'The plan' } },
      { id: '8.3.2', meca: 'glouton', notion: 'complements', niv: [2, 2, 2], titre: { fr: 'Chacun sa pièce', en: 'Everyone’s piece' } },
      { id: '8.3.3', meca: 'glouton', notion: 'tables', niv: [2, 2, 2], titre: { fr: 'L’équipe complète', en: 'The whole team' } },
    ] },
  ] },
  { id: 9, titre: { fr: 'Le tambour et les lucioles', en: 'The drum and the fireflies' }, livre: '9', pages: [9], etoile: 'contente', stages: [
    { id: '9.1', titre: { fr: 'Le tambour de Manoach', en: 'Manoach’s drum' }, decor: 'nuit', guide: 'manoach',
      intro: { fr: 'Boum, boum, boum !', en: 'Boom, boom, boom!' }, parties: [
      { id: '9.1.1', meca: 'rythme', notion: 'suites', niv: [1, 1, 1], titre: { fr: 'Boum, boum, boum', en: 'Boom, boom, boom' } },
      { id: '9.1.2', meca: 'rythme', notion: 'tables', niv: [2, 2, 2], titre: { fr: 'Plus fort !', en: 'Louder!' } },
    ] },
    { id: '9.2', titre: { fr: '« Lucioles ! »', en: '“Fireflies!”' }, decor: 'nuit', guide: 'cecilia',
      intro: { fr: 'Lucioles !', en: 'Fireflies!' }, parties: [
      { id: '9.2.1', meca: 'relier', notion: 'tables', niv: [2, 2, 2], titre: { fr: 'Par petits groupes', en: 'In small groups' } },
      { id: '9.2.2', meca: 'compter', notion: 'multpose', niv: [2, 2, 2], titre: { fr: 'Des milliers', en: 'Thousands' } },
    ] },
    { id: '9.3', titre: { fr: 'L’escalier de lumière', en: 'The staircase of light' }, decor: 'nuit', guide: 'cecilia',
      intro: { fr: 'Un chemin brillant jusqu’au ciel !', en: 'A shining path up to the sky!' }, parties: [
      { id: '9.3.1', meca: 'escalier', notion: 'comparer', niv: [1, 1, 1], titre: { fr: 'Les premières marches', en: 'The first steps' } },
      { id: '9.3.2', meca: 'escalier', notion: 'comparer', niv: [2, 2, 2], titre: { fr: 'Plus de marches', en: 'More steps' } },
      { id: '9.3.3', meca: 'escalier', notion: 'multiples', niv: [2, 2, 2], titre: { fr: 'Jusqu’au ciel', en: 'Up to the sky' } },
    ] },
  ] },
  { id: 10, titre: { fr: 'Chez Maman la Lune', en: 'At Mama Moon’s' }, livre: '10-12', pages: [10, 11, 12], etoile: 'clin-oeil', stages: [
    { id: '10.1', titre: { fr: 'L’envol de Christian', en: 'Christian takes off' }, decor: 'ciel', guide: 'christian',
      intro: { fr: 'Plus haut… toujours plus haut !', en: 'Higher… ever higher!' }, parties: [
      { id: '10.1.1', meca: 'course', notion: 'decimaux', niv: [2, 2, 2], titre: { fr: 'Sur l’escalier', en: 'On the staircase' } },
      { id: '10.1.2', meca: 'course', notion: 'proportion', niv: [2, 2, 2], titre: { fr: 'Le bec bien serré', en: 'Beak held tight' } },
    ] },
    { id: '10.2', titre: { fr: 'Plus haut, toujours plus haut', en: 'Higher, ever higher' }, decor: 'ciel', guide: 'manoach',
      intro: { fr: 'On y est presque ! Tout ce qu’on a appris, ensemble !', en: 'Almost there! Everything we learned, together!' }, parties: [
      { id: '10.2.1', meca: 'melange', notion: 'melange', niv: [2, 2, 2], titre: { fr: 'Tout ensemble', en: 'All together' } },
      { id: '10.2.2', meca: 'melange', notion: 'melange', niv: [2, 2, 2], titre: { fr: 'La dernière épreuve', en: 'The last challenge' } },
    ] },
    { id: '10.3', titre: { fr: 'Mama !', en: 'Mama!' }, decor: 'lune', guide: 'lune',
      intro: { fr: 'Ma petite étoile !', en: 'My little star!' }, parties: [
      { id: '10.3.1', meca: 'emotions', notion: 'durees', niv: [2, 2, 2], titre: { fr: 'Les retrouvailles', en: 'Together again' } },
      { id: '10.3.2', meca: 'coloriage', notion: 'tables', niv: [0, 1, 2], titre: { fr: 'Colorier la scène', en: 'Colour the scene' } },
      { id: '10.3.3', meca: 'emotions', notion: 'divtables', niv: [2, 2, 2], titre: { fr: 'Le clin d’œil', en: 'The wink' } },
    ] },
  ] },
];

const PROVERBE = { ln: 'Mosapi moko elongolaka sili te', fr: 'Un seul doigt ne peut pas enlever un pou.', en: 'One finger alone cannot remove a louse.' };
