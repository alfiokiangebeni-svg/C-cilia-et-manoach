// Cécilia & Manoach — le programme scolaire, EN DONNÉES (aucune logique).
// Référence : programmes de mathématiques de l'Éducation nationale (France), cycle 2 (CE2) et cycle 3 (CM1),
// avec leurs repères annuels de progression. 3e primaire = CE2 (8-9 ans), 4e primaire = CM1 (9-10 ans).
// « Enfant génie » : exactement les mêmes notions, en beaucoup plus difficile (nombres plus grands, tables jusqu'à 13…).
// Les générateurs de questions sont dans engine.js (GEN.<notion>) ; ici seulement les paramètres de chaque niveau.

const NIVEAUX = [
  { id: 'ce2',   classe: 'CE2', nom: { fr: '3e primaire', en: 'Year 3' }, ages: { fr: '8-9 ans', en: '8-9 yrs' }, icon: '🎒', color: '#ffb703' },
  { id: 'cm1',   classe: 'CM1', nom: { fr: '4e primaire', en: 'Year 4' }, ages: { fr: '9-10 ans', en: '9-10 yrs' }, icon: '🚀', color: '#06d6a0' },
  { id: 'genie', classe: '★',   nom: { fr: 'Enfant génie', en: 'Genius kid' }, ages: { fr: 'très difficile', en: 'very hard' }, icon: '🧠', color: '#9b5de5' },
];

// p : paramètres pour [CE2, CM1, Génie]. ref : la compétence du programme officiel.
// glouton / tri : réglages pour les jeux qui en ont besoin (Glouton, Grand tri).
const NOTIONS = {
  numeration: {
    titre: { fr: 'Les grands nombres', en: 'Big numbers' }, domaine: 'nombres',
    ref: { fr: 'Nombres et calculs — composer, décomposer les nombres entiers (CE2 : jusqu’à 10 000 ; CM1 : jusqu’au million)', en: 'Place value' },
    p: [{ max: 9999 }, { max: 999999 }, { max: 9999999 }],
  },
  comparer: {
    titre: { fr: 'Comparer et ranger', en: 'Compare and order' }, domaine: 'nombres',
    ref: { fr: 'Comparer, ranger, encadrer des nombres entiers puis décimaux (CM1)', en: 'Compare numbers' },
    p: [{ min: 400, max: 1600 }, { min: 30000, max: 70000 }, { min: 2.8, max: 4.2, dec: 2 }],
    tri: [{ type: 'lt', n: 1000 }, { type: 'lt', n: 50000 }, { type: 'lt', n: 3.5 }],
  },
  add: {
    titre: { fr: 'Additions', en: 'Additions' }, domaine: 'calcul',
    ref: { fr: 'Calcul mental et posé : addition de nombres entiers (CE2 : < 1 000 ; CM1 : < 10 000)', en: 'Addition' },
    p: [{ a: [120, 650], b: [25, 340] }, { a: [1200, 6500], b: [250, 3400] }, { a: [12000, 650000], b: [2500, 340000] }],
  },
  sous: {
    titre: { fr: 'Soustractions', en: 'Subtractions' }, domaine: 'calcul',
    ref: { fr: 'Calcul mental et posé : soustraction de nombres entiers', en: 'Subtraction' },
    p: [{ a: [150, 999], b: [15, 140] }, { a: [1500, 9999], b: [150, 1400] }, { a: [50000, 999999], b: [1500, 49999] }],
  },
  complements: {
    titre: { fr: 'Compléments', en: 'Number bonds' }, domaine: 'calcul',
    ref: { fr: 'Calcul mental : compléments à 100 (CE2), à 1 000 (CM1), à l’unité pour les décimaux', en: 'Number bonds' },
    p: [{ T: 100, pas: 5 }, { T: 1000, pas: 10 }, { T: 1, pas: 0.05 }],
    glouton: [{ mode: 'cible', T: 100, pas: 5 }, { mode: 'cible', T: 1000, pas: 10 }, { mode: 'cible', T: 1, pas: 0.05 }],
  },
  doubles: {
    titre: { fr: 'Doubles et moitiés', en: 'Doubles and halves' }, domaine: 'calcul',
    ref: { fr: 'Calcul mental : doubles et moitiés', en: 'Doubles and halves' },
    p: [{ max: 100 }, { max: 1000 }, { max: 100, dec: true }],
  },
  x10: {
    titre: { fr: '× 10, × 100, ÷ 10', en: '× 10, × 100, ÷ 10' }, domaine: 'calcul',
    ref: { fr: 'Multiplier, diviser par 10, 100, 1 000', en: 'Multiply by 10, 100' },
    p: [{ fois: [10, 100], div: [10], dec: false }, { fois: [10, 100, 1000], div: [10, 100], dec: false }, { fois: [10, 100, 1000], div: [10, 100, 1000], dec: true }],
  },
  tables: {
    titre: { fr: 'Tables de multiplication', en: 'Times tables' }, domaine: 'calcul',
    ref: { fr: 'Mémoriser les tables de multiplication (CE2 : 2 à 9 ; CM1 : jusqu’à 12 ; génie : jusqu’à 13)', en: 'Times tables' },
    p: [{ ops: ['×'], tables: [2, 3, 4, 5, 6, 7, 8, 9], kmin: 1, kmax: 10 }, { ops: ['×'], tables: [3, 4, 6, 7, 8, 9, 11, 12], kmin: 2, kmax: 12 }, { ops: ['×'], tables: [7, 8, 9, 11, 12, 13], kmin: 6, kmax: 13 }],
    glouton: [{ mode: 'prod', tables: [2, 3, 4, 5, 6, 7, 8, 9] }, { mode: 'prod', tables: [6, 7, 8, 9, 11, 12] }, { mode: 'prod', tables: [11, 12, 13] }],
  },
  divtables: {
    titre: { fr: 'Tables de division', en: 'Division facts' }, domaine: 'calcul',
    ref: { fr: 'Division exacte à l’aide des tables', en: 'Division facts' },
    p: [{ ops: ['÷'], tables: [2, 3, 4, 5, 6, 7, 8, 9], qmax: 10 }, { ops: ['÷'], tables: [6, 7, 8, 9, 11, 12], qmax: 12 }, { ops: ['÷'], tables: [7, 8, 9, 11, 12, 13], qmax: 13 }],
  },
  multpose: {
    titre: { fr: 'Multiplications', en: 'Multiplication' }, domaine: 'calcul',
    ref: { fr: 'Multiplication posée (CE2 : par un nombre à 1 chiffre ; CM1 : à 2 chiffres)', en: 'Long multiplication' },
    p: [{ a: [12, 49], b: [2, 5] }, { a: [21, 99], b: [11, 25] }, { a: [120, 999], b: [12, 99] }],
  },
  divreste: {
    titre: { fr: 'Division avec reste', en: 'Division with remainder' }, domaine: 'calcul',
    ref: { fr: 'Division euclidienne : quotient et reste (introduite en CE2, posée en CM1)', en: 'Division with remainder' },
    p: [{ a: [11, 50], b: [2, 5] }, { a: [30, 99], b: [3, 9] }, { a: [120, 999], b: [6, 13] }],
  },
  partage: {
    titre: { fr: 'Partager équitablement', en: 'Fair sharing' }, domaine: 'calcul',
    ref: { fr: 'Résoudre des problèmes de partage (sens de la division)', en: 'Sharing' },
    p: [{ ops: ['÷'], tables: [2, 3, 4, 5], qmax: 6 }, { ops: ['÷'], tables: [3, 4, 5, 6], qmax: 8 }, { ops: ['÷'], tables: [6, 7, 8, 9, 11, 12, 13], qmax: 13 }],
  },
  multiples: {
    titre: { fr: 'Multiples et divisibilité', en: 'Multiples' }, domaine: 'nombres',
    ref: { fr: 'Nombres pairs/impairs, multiples ; critères de divisibilité par 2, 3, 5, 9, 10 (CM1)', en: 'Multiples and divisibility' },
    p: [{ min: 10, max: 200 }, { min: 30, max: 999 }, { min: 100, max: 9999 }],
    tri: [{ type: 'mult', k: 5 }, { type: 'mult', k: 3 }, { type: 'mult', k: 7 }],
  },
  fractions: {
    titre: { fr: 'Fractions', en: 'Fractions' }, domaine: 'nombres',
    ref: { fr: 'CE2 : moitié, tiers, quart ; CM1 : fraction d’une quantité (3/4 de 20)', en: 'Fractions of amounts' },
    p: [{ den: [2, 3, 4], numMax: 1, kmax: 10 }, { den: [2, 3, 4, 5, 10], numMax: 4, kmax: 10 }, { den: [3, 5, 6, 8, 12], numMax: 11, kmax: 12 }],
  },
  decimaux: {
    titre: { fr: 'Nombres décimaux et monnaie', en: 'Decimals and money' }, domaine: 'nombres',
    ref: { fr: 'CE2 : euros et centimes ; CM1 : nombres décimaux (dixièmes, centièmes), addition et soustraction', en: 'Decimals and money' },
    p: [{ type: 'monnaie' }, { type: 'dec', d: 1 }, { type: 'dec', d: 2 }],
  },
  mesures: {
    titre: { fr: 'Longueurs, masses, contenances', en: 'Measures' }, domaine: 'mesures',
    ref: { fr: 'Grandeurs et mesures : unités de longueur, masse, contenance et conversions', en: 'Units and conversions' },
    p: [{ niveau: 0 }, { niveau: 1 }, { niveau: 2 }],
  },
  durees: {
    titre: { fr: 'Heures et durées', en: 'Time' }, domaine: 'mesures',
    ref: { fr: 'Grandeurs et mesures : heures, minutes, secondes, jours ; calcul de durées', en: 'Time' },
    p: [{ niveau: 0 }, { niveau: 1 }, { niveau: 2 }],
  },
  perimetre: {
    titre: { fr: 'Périmètres et aires', en: 'Perimeter and area' }, domaine: 'geometrie',
    ref: { fr: 'Espace et géométrie : périmètre du carré et du rectangle ; aire (CM1)', en: 'Perimeter and area' },
    p: [{ cote: [2, 12], aire: false }, { cote: [3, 20], aire: true }, { cote: [8, 45], aire: true, inverse: true }],
  },
  suites: {
    titre: { fr: 'Suites de nombres', en: 'Number patterns' }, domaine: 'nombres',
    ref: { fr: 'Compter de 2 en 2, de 5 en 5, de 10 en 10, de 25 en 25… ; régularités', en: 'Number patterns' },
    p: [{ pas: [2, 5, 10, 25, 100], moins: false }, { pas: [25, 50, 250, 1000], moins: true, double: true }, { pas: [0.25, 0.5, 125], moins: true, double: true, triple: true, carres: true }],
  },
  probleme: {
    titre: { fr: 'Problèmes', en: 'Word problems' }, domaine: 'problemes',
    ref: { fr: 'Résoudre des problèmes en une étape (CE2) puis en deux étapes (CM1)', en: 'Word problems' },
    p: [{ niveau: 0 }, { niveau: 1 }, { niveau: 2 }],
  },
  proportion: {
    titre: { fr: 'Proportionnalité', en: 'Proportion' }, domaine: 'problemes',
    ref: { fr: 'Situations de proportionnalité simples (CM1)', en: 'Proportion' },
    p: [{ niveau: 0 }, { niveau: 1 }, { niveau: 2 }],
  },
  melange: {
    titre: { fr: 'Tout ce qu’on a appris', en: 'Everything we learned' }, domaine: 'revision',
    ref: { fr: 'Révision de l’année', en: 'Year review' },
    p: [{ notions: ['add', 'sous', 'tables', 'doubles', 'mesures', 'durees', 'suites'] },
        { notions: ['tables', 'divtables', 'multpose', 'fractions', 'decimaux', 'mesures', 'perimetre'] },
        { notions: ['tables', 'divtables', 'multpose', 'divreste', 'fractions', 'decimaux', 'proportion', 'perimetre'] }],
  },
};

// Notions compatibles avec chaque jeu V1 (vérifié par test/structure.js).
const NOTIONS_PAR_JEU = {
  race: null, fish: null, link: ['numeration', 'add', 'sous', 'complements', 'doubles', 'x10', 'tables', 'divtables', 'multpose', 'divreste', 'fractions', 'decimaux', 'mesures', 'durees', 'perimetre', 'suites', 'ppcm', 'pgcd'],
  sort: ['comparer', 'multiples', 'add', 'sous', 'tables'], feed: ['partage'], monster: ['complements', 'tables'], color: ['tables'],
};

// =====================================================================
// Les autres matières (générateurs dans matieres.js, contenus dans contenus.js)
// jeux : jeux possibles (QCM : avion ou pêche ; paires : relier ; deux catégories : grand tri).
// =====================================================================
const N3 = (a, b, c) => [Object.assign({}, a), Object.assign({}, b || a), Object.assign({}, c || b || a)];
Object.assign(NOTIONS, {
  // ---- Grammaire ----
  nature: { titre: { fr: 'Nature des mots', en: 'Word classes' }, domaine: 'grammaire', jeux: ['fish', 'race', 'link'],
    ref: { fr: 'Identifier les classes de mots : nom, verbe, adjectif, déterminant, pronom (CE2) ; adverbe, préposition (CM1) ; conjonction', en: 'Word classes' }, p: N3({}) },
  pluriel: { titre: { fr: 'Pluriel et féminin', en: 'Plurals and feminine' }, domaine: 'grammaire', jeux: ['race', 'fish', 'link'],
    ref: { fr: 'Accord en genre et en nombre : pluriels en -s, -x, -aux ; féminins particuliers', en: 'Plurals and feminine' }, p: N3({}) },
  fonction: { titre: { fr: 'Sujet, verbe, compléments', en: 'Subject, verb, objects' }, domaine: 'grammaire', jeux: ['race', 'fish'],
    ref: { fr: 'Identifier le verbe et le sujet (CE2), le complément d’objet (CM1), les compléments circonstanciels', en: 'Sentence functions' }, p: N3({}) },
  phrases: { titre: { fr: 'Types et formes de phrases', en: 'Sentence types' }, domaine: 'grammaire', jeux: ['race', 'fish'],
    ref: { fr: 'Phrases déclaratives, interrogatives, exclamatives, impératives ; forme affirmative et négative', en: 'Sentence types' }, p: N3({}) },
  // ---- Conjugaison ----
  conjPresent: { titre: { fr: 'Le présent', en: 'Present tense' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Présent des verbes du 1er groupe, être, avoir, aller, faire, dire, venir, pouvoir, voir, vouloir, prendre ; 2e groupe (CM1)', en: 'Present tense' }, p: N3({}) },
  conjFutur: { titre: { fr: 'Le futur', en: 'Future tense' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Futur simple des verbes étudiés', en: 'Future tense' }, p: N3({}) },
  conjImparfait: { titre: { fr: 'L’imparfait', en: 'Imperfect' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Imparfait des verbes étudiés', en: 'Imperfect tense' }, p: N3({}) },
  conjPasseCompose: { titre: { fr: 'Le passé composé', en: 'Perfect tense' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Passé composé avec être et avoir', en: 'Perfect tense' }, p: N3({}) },
  conjPasseSimple: { titre: { fr: 'Le passé simple', en: 'Past historic' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Passé simple aux 3es personnes (CM1) ; toutes les personnes (génie)', en: 'Past historic' }, p: N3({ pers: [2, 5] }, { pers: [2, 5] }, { pers: [0, 1, 2, 3, 4, 5] }) },
  conjImperatif: { titre: { fr: 'L’impératif', en: 'Imperative' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Impératif présent (CM1)', en: 'Imperative' }, p: N3({}) },
  conjTemps: { titre: { fr: 'Reconnaître le temps', en: 'Which tense?' }, domaine: 'conjugaison', jeux: ['race', 'fish'],
    ref: { fr: 'Identifier le temps d’un verbe conjugué', en: 'Identify the tense' },
    p: N3({ temps: ['pres', 'imp', 'fut', 'pc'] }, { temps: ['pres', 'imp', 'fut', 'pc', 'ps'] }, { temps: ['pres', 'imp', 'fut', 'pc', 'ps', 'cond'] }) },
  // ---- Orthographe ----
  homophones: { titre: { fr: 'Homophones', en: 'Homophones' }, domaine: 'orthographe', jeux: ['race', 'fish'],
    ref: { fr: 'a/à, et/est, on/ont, son/sont (CE2) ; ces/ses, ce/se, ou/où (CM1) ; c’est/s’est, leur/leurs, peu/peut/peux…', en: 'Homophones' }, p: N3({}) },
  accord: { titre: { fr: 'Accords dans le groupe nominal', en: 'Agreement' }, domaine: 'orthographe', jeux: ['race', 'fish'],
    ref: { fr: 'Accord de l’adjectif avec le nom (genre et nombre), féminins irréguliers', en: 'Adjective agreement' }, p: N3({}) },
  motsJustes: { titre: { fr: 'Écrire les mots', en: 'Spelling' }, domaine: 'orthographe', jeux: ['race', 'fish'],
    ref: { fr: 'Orthographe lexicale : mots invariables et mots fréquents, m devant m, b, p, lettres muettes', en: 'Spelling' }, p: N3({}) },
  // ---- Vocabulaire ----
  vocabulaire: { titre: { fr: 'Contraires et synonymes', en: 'Opposites and synonyms' }, domaine: 'vocabulaire', jeux: ['link', 'race', 'fish'],
    ref: { fr: 'Contraires (CE2), synonymes et préfixes (CM1)', en: 'Opposites and synonyms' }, p: N3({}) },
  dictionnaire: { titre: { fr: 'Ordre alphabétique', en: 'Alphabetical order' }, domaine: 'vocabulaire', jeux: ['race', 'fish'],
    ref: { fr: 'Utiliser le dictionnaire : ordre alphabétique (1re, 2e, 3e lettre…)', en: 'Alphabetical order' }, p: N3({}) },
  lingala: { titre: { fr: 'Les mots lingala du livre', en: 'Lingala words from the book' }, domaine: 'vocabulaire', jeux: ['link', 'race'],
    ref: { fr: 'Ouverture aux langues : le lexique du livre', en: 'Lingala words' }, p: N3({}) },
  // ---- Sciences ----
  vivant: { titre: { fr: 'Vivant ou non vivant', en: 'Living or not' }, domaine: 'sciences', jeux: ['sort'],
    ref: { fr: 'Le vivant : distinguer le vivant du non-vivant', en: 'Living things' }, p: N3({}),
    tri: N3({ type: 'cat', labels: [{ fr: 'Vivant', en: 'Living' }, { fr: 'Non vivant', en: 'Not living' }] }) },
  animaux: { titre: { fr: 'Les animaux', en: 'Animals' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'Classer les animaux, cycles de vie (métamorphoses)', en: 'Animals' }, p: N3({}) },
  alimentation: { titre: { fr: 'Se nourrir', en: 'Food' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'Régimes alimentaires des animaux, groupes d’aliments, chaînes alimentaires', en: 'Food and diets' }, p: N3({}) },
  corps: { titre: { fr: 'Le corps humain', en: 'The human body' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'Organes, squelette, muscles, sens, santé', en: 'Human body' }, p: N3({}) },
  matiere: { titre: { fr: 'L’eau et la matière', en: 'Water and matter' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'États de l’eau (solide, liquide, gaz) et changements d’état', en: 'States of matter' }, p: N3({}) },
  ciel: { titre: { fr: 'La Terre, le Soleil, la Lune', en: 'Earth, Sun and Moon' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'La Terre dans le système solaire, jour et nuit, saisons', en: 'Solar system' }, p: N3({}) },
  plantes: { titre: { fr: 'Les plantes', en: 'Plants' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'Besoins des végétaux, germination, de la fleur au fruit', en: 'Plants' }, p: N3({}) },
  energie: { titre: { fr: 'Électricité et énergie', en: 'Electricity and energy' }, domaine: 'sciences', jeux: ['race', 'fish'],
    ref: { fr: 'Circuits électriques, sécurité, énergies renouvelables', en: 'Electricity and energy' }, p: N3({}) },
  conducteurs: { titre: { fr: 'Conducteur ou isolant', en: 'Conductor or insulator' }, domaine: 'sciences', jeux: ['sort'],
    ref: { fr: 'Matériaux conducteurs et isolants', en: 'Conductors and insulators' }, p: N3({}),
    tri: N3({ type: 'cat', labels: [{ fr: 'Conducteur', en: 'Conductor' }, { fr: 'Isolant', en: 'Insulator' }] }) },
  // ---- Histoire, géographie, EMC ----
  temps: { titre: { fr: 'Le temps qui passe', en: 'Time and calendar' }, domaine: 'histoire-geographie', jeux: ['race', 'fish'],
    ref: { fr: 'Calendrier, siècles, chiffres romains, repères chronologiques', en: 'Calendar, centuries' }, p: N3({}) },
  histoire: { titre: { fr: 'Histoire de la RDC et de l’Afrique', en: 'History of the DRC and Africa' }, domaine: 'histoire-geographie', jeux: ['race', 'fish'],
    ref: { fr: 'Histoire de la RDC (royaume Kongo, colonisation, indépendance) et de l’Afrique (Égypte, empire du Mali, indépendances)', en: 'History of the DRC and Africa' }, p: N3({}) },
  geographie: { titre: { fr: 'Géographie de la RDC et de l’Afrique', en: 'Geography of the DRC and Africa' }, domaine: 'histoire-geographie', jeux: ['race', 'fish'],
    ref: { fr: 'Géographie de la RDC (fleuve, provinces, villes, parcs) et de l’Afrique (pays, fleuves, lacs, déserts, capitales)', en: 'Geography of the DRC and Africa' }, p: N3({}) },
  emc: { titre: { fr: 'Vivre ensemble', en: 'Citizenship' }, domaine: 'emc', jeux: ['race', 'fish'],
    ref: { fr: 'Enseignement moral et civique : respect, règles, symboles de la RDC, droits de l’enfant, environnement', en: 'Citizenship' }, p: N3({}) },
  // ---- Anglais ----
  anglais: { titre: { fr: 'Mots anglais', en: 'English words' }, domaine: 'anglais', jeux: ['link', 'race', 'fish'],
    ref: { fr: 'Langues vivantes : couleurs, nombres, animaux, famille, politesse, jours, corps, nourriture', en: 'English vocabulary' }, p: N3({}) },
});

// ---- Nouvelles notions : commerce, PPCM / PGCD, problèmes de la vie, programmation, carte de l'Afrique ----
Object.assign(NOTIONS, {
  commerce: { titre: { fr: 'Acheter, vendre, bénéfice', en: 'Buying, selling, profit' }, domaine: 'problemes', jeux: ['race', 'fish'],
    ref: { fr: 'Problèmes de monnaie : prix, monnaie rendue (CE2) ; prix d’achat, prix de vente, bénéfice et perte (CM1) ; pourcentages (génie)', en: 'Money problems' }, p: N3({}) },
  ppcm: { titre: { fr: 'PPCM', en: 'Least common multiple' }, domaine: 'nombres', jeux: ['race', 'fish', 'link'],
    ref: { fr: 'Multiples communs : plus petit multiple commun de deux nombres (prolongement du CM1)', en: 'LCM' }, p: N3({ max: 6 }, { max: 12 }, { max: 30 }) },
  pgcd: { titre: { fr: 'PGCD', en: 'Greatest common divisor' }, domaine: 'nombres', jeux: ['race', 'fish', 'link'],
    ref: { fr: 'Diviseurs communs : plus grand diviseur commun de deux nombres (prolongement du CM1)', en: 'GCD' }, p: N3({ dmax: 5, k: 4 }, { dmax: 9, k: 6 }, { dmax: 15, k: 9 }) },
  cuisine: { titre: { fr: 'En cuisine', en: 'Cooking' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Problèmes de recettes : proportionnalité, fractions, masses, contenances, durées', en: 'Cooking problems' }, p: N3({}) },
  menuiserie: { titre: { fr: 'L’atelier de l’oncle Robert', en: 'Uncle Robert’s workshop' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Longueurs, conversions, périmètres et aires, partages ; prix et bénéfice', en: 'Lengths and areas' }, p: N3({}) },
  agronomie: { titre: { fr: 'Le champ d’Axel l’agronome', en: 'Axel’s field' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Multiplication en rangées, aires et périmètres de champs, masses, rendement, hectare', en: 'Farming problems' }, p: N3({}) },
  peche: { titre: { fr: 'La pêche de Tarzan', en: 'Tarzan’s fishing' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Problèmes de pêche : additions, partages, prix au kilo, vitesse', en: 'Fishing problems' }, p: N3({}) },
  trajets: { titre: { fr: 'En wewa', en: 'By moto-taxi' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Trajets : prix des courses, monnaie, distances, vitesses, durées', en: 'Trips' }, p: N3({}) },
  chantier: { titre: { fr: 'Le chantier de la route', en: 'Building the road' }, domaine: 'vie', jeux: ['race', 'fish'],
    ref: { fr: 'Longueurs (m, km), partages, aires, multiples communs', en: 'Road building' }, p: N3({}) },
  programmation: { titre: { fr: 'Programmer le robot', en: 'Program the robot' }, domaine: 'sciences', jeux: ['robot'],
    ref: { fr: 'Sciences et technologie : écrire un programme de déplacement (algorithmique, boucles pour le génie)', en: 'Coding' },
    p: N3({ taille: 4, obstacles: 0, max: 5 }, { taille: 5, obstacles: 3, max: 7 }, { taille: 6, obstacles: 6, max: 10, boucles: true }) },
  carteAfrique: { titre: { fr: 'La carte de l’Afrique', en: 'Map of Africa' }, domaine: 'histoire-geographie', jeux: ['afrique'],
    ref: { fr: 'Se repérer sur la carte de l’Afrique : pays et capitales', en: 'Map of Africa' },
    p: N3({ taille: 900, modes: ['toucher', 'nom'], connus: ['cd', 'cg', 'ao', 'eg', 'dz', 'za', 'ng', 'ma', 'ly', 'sd', 'td', 'et', 'ke', 'tz', 'ml', 'ne', 'cm', 'mg', 'zm', 'ss', 'cf', 'na', 'mz', 'mr', 'so', 'bw'], ouvert: 0 },
      { taille: 150, modes: ['toucher', 'nom', 'capitale'], ouvert: 1 }, { taille: 12, modes: ['toucher', 'nom', 'capitale', 'capitale'], ouvert: 1, capitales: true }) },
});

// Le village : les personnages et leurs jeux (écran « Le village »)
const VILLAGE = [
  { id: 'marche', nom: { fr: 'Suzanne et Albertine au marché', en: 'Suzanne and Albertine at the market' }, img: 'suzanne', jeu: 'scene', notion: 'commerce',
    theme: { id: 'marche', decor: 'marche', hote: 'albertine', bouton: 'billet', recompense: ['piece', 'billet'] } },
  { id: 'tarzan', nom: { fr: 'Tarzan le pêcheur', en: 'Tarzan the fisherman' }, img: 'tarzan', jeu: 'fish', notion: 'peche', theme: { id: 'tarzan', pecheur: 'tarzan' } },
  { id: 'robert', nom: { fr: 'Oncle Robert le menuisier', en: 'Uncle Robert the carpenter' }, img: 'robert', jeu: 'scene', notion: 'menuiserie',
    theme: { id: 'atelier', decor: 'atelier', hote: 'robert', bouton: 'planche', recompense: ['tabouret', 'planche'] } },
  { id: 'caleb', nom: { fr: 'Oncle Caleb le programmeur', en: 'Uncle Caleb the programmer' }, img: 'caleb', jeu: 'robot', notion: 'programmation' },
  { id: 'agronome', nom: { fr: 'Axel l’agronome', en: 'Axel the agronomist' }, img: 'axel-agronome', jeu: 'scene', notion: 'agronomie',
    theme: { id: 'champ', decor: 'champ', hote: 'axel-agronome', bouton: 'plantule', recompense: ['mais', 'plantule'] } },
  { id: 'cuisine', nom: { fr: 'On cuisine !', en: 'Let’s cook!' }, img: 'marmite', jeu: 'scene', notion: 'cuisine',
    theme: { id: 'cuisine', decor: 'cuisine', hote: 'suzanne', bouton: 'riz', recompense: ['tomates', 'oignons', 'manioc', 'poisson-grille', 'huile', 'riz'] } },
  { id: 'oiseaux', nom: { fr: 'Le chasseur d’images', en: 'The bird photographer' }, img: 'appareil', jeu: 'oiseaux', notion: 'tables' },
  { id: 'max', nom: { fr: 'Max et son flair', en: 'Max’s nose' }, img: 'max-assis', jeu: 'flair', notion: 'melange' },
  { id: 'dames', nom: { fr: 'Le jeu de dames', en: 'Draughts' }, img: 'piece', jeu: 'dames', notion: 'tables' },
  { id: 'wewa', nom: { fr: 'La course de wewa', en: 'The moto-taxi race' }, img: 'wewa', jeu: 'race', notion: 'trajets', theme: { id: 'wewa', decor: 'avenue', vehicule: 'village/wewa' } },
  { id: 'route', nom: { fr: 'Construire la route', en: 'Build the road' }, img: 'camion', jeu: 'route', notion: 'chantier' },
  { id: 'afrique', nom: { fr: 'La carte de l’Afrique', en: 'Map of Africa' }, img: null, icon: '🌍', jeu: 'afrique', notion: 'carteAfrique' },
];

// Les matières (écran « Matières »)
const SUJETS = [
  { id: 'maths', icon: '🔢', color: '#3a86ff', titre: { fr: 'Mathématiques', en: 'Maths' },
    notions: ['numeration', 'comparer', 'add', 'sous', 'complements', 'doubles', 'x10', 'tables', 'divtables', 'multpose', 'divreste', 'partage', 'multiples', 'ppcm', 'pgcd', 'fractions', 'decimaux', 'mesures', 'durees', 'perimetre', 'suites', 'probleme', 'proportion', 'commerce', 'melange'] },
  { id: 'vie', icon: '🏘️', color: '#e07a5f', titre: { fr: 'Problèmes de la vie', en: 'Everyday problems' }, notions: ['cuisine', 'menuiserie', 'agronomie', 'peche', 'trajets', 'chantier'] },
  { id: 'grammaire', icon: '✏️', color: '#e85d04', titre: { fr: 'Grammaire', en: 'Grammar' }, notions: ['nature', 'pluriel', 'fonction', 'phrases'] },
  { id: 'conjugaison', icon: '⏰', color: '#d62828', titre: { fr: 'Conjugaison', en: 'Verbs' }, notions: ['conjPresent', 'conjFutur', 'conjImparfait', 'conjPasseCompose', 'conjPasseSimple', 'conjImperatif', 'conjTemps'] },
  { id: 'orthographe', icon: '🔤', color: '#f15bb5', titre: { fr: 'Orthographe', en: 'Spelling' }, notions: ['homophones', 'accord', 'motsJustes'] },
  { id: 'vocabulaire', icon: '📖', color: '#9b5de5', titre: { fr: 'Vocabulaire', en: 'Vocabulary' }, notions: ['vocabulaire', 'dictionnaire', 'lingala'] },
  { id: 'sciences', icon: '🔬', color: '#06a77d', titre: { fr: 'Sciences', en: 'Science' }, notions: ['vivant', 'animaux', 'alimentation', 'corps', 'plantes', 'matiere', 'ciel', 'energie', 'conducteurs', 'programmation'] },
  { id: 'histoire-geographie', icon: '🗺️', color: '#b5838d', titre: { fr: 'Histoire et géographie (RDC, Afrique)', en: 'History and geography (DRC, Africa)' }, notions: ['temps', 'histoire', 'geographie', 'carteAfrique'] },
  { id: 'emc', icon: '🤝', color: '#2a9d8f', titre: { fr: 'Vivre ensemble', en: 'Citizenship' }, notions: ['emc'] },
  { id: 'anglais', icon: '🇬🇧', color: '#457b9d', titre: { fr: 'Anglais', en: 'English' }, notions: ['anglais'] },
];
