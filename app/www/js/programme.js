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
  race: null, fish: null, link: ['numeration', 'add', 'sous', 'complements', 'doubles', 'x10', 'tables', 'divtables', 'multpose', 'divreste', 'fractions', 'decimaux', 'mesures', 'durees', 'perimetre', 'suites'],
  sort: ['comparer', 'multiples', 'add', 'sous', 'tables'], feed: ['partage'], monster: ['complements', 'tables'], color: ['tables'],
};
