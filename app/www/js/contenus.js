// Cécilia & Manoach — contenus des matières (français, sciences, histoire-géographie, EMC, anglais), EN DONNÉES.
// Programmes de l'Éducation nationale (France) : cycle 2 (CE2) et cycle 3 (CM1).
// Niveau d'un élément : 0 = dès le CE2, 1 = dès le CM1, 2 = enfant génie.
// QCM : [question, bonne réponse, [mauvaises réponses], niveau]

// ---------- Grammaire : nature des mots ----------
const NATURES = {
  nom: { fr: 'nom', mots: [['étoile', 0], ['fleuve', 0], ['tortue', 0], ['maison', 0], ['tambour', 0], ['mangue', 0], ['lune', 0], ['forêt', 0], ['héron', 0], ['luciole', 0], ['enfant', 0], ['baobab', 0], ['branche', 0], ['rivière', 1], ['escalier', 1], ['courage', 2], ['amitié', 2]] },
  verbe: { fr: 'verbe', mots: [['chante', 0], ['grimpe', 0], ['brillent', 0], ['regardez', 0], ['mange', 0], ['dort', 0], ['pleure', 0], ['grimpons', 0], ['écoutent', 0], ['attrapera', 1], ['partageons', 1], ['dormait', 1], ['scintillent', 2], ['réfléchirent', 2]] },
  adjectif: { fr: 'adjectif', mots: [['brillante', 0], ['timide', 0], ['courageuse', 0], ['joyeux', 0], ['immense', 0], ['lumineuse', 0], ['gentille', 0], ['magnifique', 0], ['minuscule', 0], ['sombre', 1], ['délicieuse', 1], ['paisible', 2], ['étincelant', 2]] },
  determinant: { fr: 'déterminant', mots: [['le', 0], ['la', 0], ['les', 0], ['un', 0], ['une', 0], ['des', 0], ['mon', 0], ['ta', 0], ['ses', 0], ['cette', 0], ['ce', 1], ['leurs', 1], ['chaque', 2], ['plusieurs', 2]] },
  pronom: { fr: 'pronom', mots: [['il', 0], ['elle', 0], ['nous', 0], ['vous', 0], ['ils', 0], ['je', 0], ['tu', 0], ['on', 1], ['lui', 2], ['leur', 2]] },
  adverbe: { fr: 'adverbe', mots: [['vite', 1], ['souvent', 1], ['toujours', 1], ['très', 1], ['doucement', 1], ['hier', 1], ['demain', 1], ['lentement', 1], ['jamais', 2], ['soudain', 2]] },
  preposition: { fr: 'préposition', mots: [['dans', 1], ['sur', 1], ['sous', 1], ['avec', 1], ['pour', 1], ['sans', 1], ['vers', 1], ['entre', 2], ['chez', 2]] },
  conjonction: { fr: 'conjonction', mots: [['mais', 2], ['donc', 2], ['car', 2], ['ni', 2], ['or', 2]] },
};
// Natures connues à chaque niveau
const NATURES_NIV = [['nom', 'verbe', 'adjectif', 'determinant', 'pronom'], ['nom', 'verbe', 'adjectif', 'determinant', 'pronom', 'adverbe', 'preposition'], ['nom', 'verbe', 'adjectif', 'determinant', 'pronom', 'adverbe', 'preposition', 'conjonction']];

// ---------- Grammaire : pluriel et féminin ----------
const PLURIELS = [
  ['un chat', 'des chats', ['des chat', 'des chatx'], 0], ['une étoile', 'des étoiles', ['des étoile', 'des étoilles'], 0],
  ['un oiseau', 'des oiseaux', ['des oiseaus', 'des oiseau'], 0], ['un jeu', 'des jeux', ['des jeus', 'des jeu'], 0],
  ['un bateau', 'des bateaux', ['des bateaus', 'des bateau'], 0], ['une souris', 'des souris', ['des souriss', 'des sourix'], 0],
  ['un nez', 'des nez', ['des nezs', 'des nés'], 0], ['un cheveu', 'des cheveux', ['des cheveus', 'des cheveu'], 0],
  ['un cheval', 'des chevaux', ['des chevals', 'des chevauxs'], 1], ['un journal', 'des journaux', ['des journals', 'des journeaux'], 1],
  ['un bijou', 'des bijoux', ['des bijous', 'des bijou'], 1], ['un genou', 'des genoux', ['des genous', 'des genou'], 1],
  ['un clou', 'des clous', ['des cloux', 'des clou'], 1], ['un travail', 'des travaux', ['des travails', 'des travaille'], 1],
  ['un hibou', 'des hiboux', ['des hibous', 'des hibou'], 1], ['un bal', 'des bals', ['des baux', 'des bales'], 2],
  ['un œil', 'des yeux', ['des œils', 'des œuils'], 2], ['un ciel', 'des cieux', ['des cieles', 'des cieus'], 2],
  ['un festival', 'des festivals', ['des festivaux', 'des festivales'], 2], ['un vitrail', 'des vitraux', ['des vitrails', 'des vitreaux'], 2],
  ['un acteur', 'une actrice', ['une acteure', 'une acteuse'], 1], ['un lion', 'une lionne', ['une lione', 'une lionnesse'], 1],
  ['un chanteur', 'une chanteuse', ['une chantrice', 'une chanteure'], 1], ['un héros', 'une héroïne', ['une hérosse', 'une héroïque'], 2],
];

// ---------- Grammaire : fonctions dans la phrase ----------
// [phrase, fonction demandée, réponse, autres groupes de la phrase, niveau]
const FONCTIONS = [
  ['Cécilia compte les étoiles.', 'sujet', 'Cécilia', ['compte', 'les étoiles'], 0],
  ['La petite étoile tombe dans le fleuve.', 'sujet', 'La petite étoile', ['tombe', 'dans le fleuve'], 0],
  ['Manoach joue du tambour.', 'sujet', 'Manoach', ['joue', 'du tambour'], 0],
  ['Les lucioles brillent dans la nuit.', 'sujet', 'Les lucioles', ['brillent', 'dans la nuit'], 0],
  ['Thérèse porte les enfants sur son dos.', 'verbe', 'porte', ['Thérèse', 'les enfants'], 0],
  ['Le vieux baobab touche les nuages.', 'verbe', 'touche', ['Le vieux baobab', 'les nuages'], 0],
  ['Christian ouvre ses grandes ailes.', 'verbe', 'ouvre', ['Christian', 'ses grandes ailes'], 0],
  ['Dans le ciel brille la Lune.', 'sujet', 'la Lune', ['Dans le ciel', 'brille'], 1],
  ['Cécilia prend la petite étoile.', 'COD', 'la petite étoile', ['Cécilia', 'prend'], 1],
  ['Manoach mange une mangue.', 'COD', 'une mangue', ['Manoach', 'mange'], 1],
  ['Les enfants appellent les lucioles.', 'COD', 'les lucioles', ['Les enfants', 'appellent'], 1],
  ['Le héron transporte l’étoile.', 'COD', 'l’étoile', ['Le héron', 'transporte'], 1],
  ['Ce soir, les enfants comptent les étoiles.', 'complément de temps', 'Ce soir', ['les enfants', 'les étoiles'], 2],
  ['Au bord du fleuve, Thérèse se repose.', 'complément de lieu', 'Au bord du fleuve', ['Thérèse', 'se repose'], 2],
  ['Les enfants grimpent prudemment dans l’arbre.', 'complément de manière', 'prudemment', ['Les enfants', 'dans l’arbre'], 2],
  ['Demain, Christian volera jusqu’au ciel.', 'complément de temps', 'Demain', ['Christian', 'jusqu’au ciel'], 2],
];

// ---------- Grammaire : types et formes de phrases ----------
const PHRASES = [
  ['Où est tombée la petite étoile ?', 'interrogative', 0], ['Quelle belle nuit !', 'exclamative', 0], ['Les enfants comptent les étoiles.', 'déclarative', 0],
  ['Grimpez sur mon dos.', 'impérative', 0], ['As-tu froid, petite étoile ?', 'interrogative', 0], ['Comme le ciel est beau !', 'exclamative', 0],
  ['Le héron vole très haut.', 'déclarative', 0], ['Ne pleure pas.', 'impérative', 1], ['Thérèse connaît quelqu’un de très grand.', 'déclarative', 0],
  ['Appelez les lucioles !', 'impérative', 1], ['Est-ce que la Lune nous attend ?', 'interrogative', 1], ['Quel courage ils ont eu !', 'exclamative', 1],
];
const FORMES = [
  ['L’étoile ne brille plus.', 'négative', 1], ['L’étoile brille.', 'affirmative', 1], ['Christian ne vole jamais si haut.', 'négative', 1],
  ['Les enfants n’ont pas peur.', 'négative', 1], ['Les enfants ont du courage.', 'affirmative', 1], ['Personne ne dort ce soir.', 'négative', 2],
  ['Thérèse nage lentement.', 'affirmative', 1], ['Rien ne les arrête.', 'négative', 2], ['Je ne vois rien.', 'négative', 1], ['La Lune sourit.', 'affirmative', 1],
];

// ---------- Conjugaison ----------
const PERSONNES = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
// Verbes du 1er groupe sans difficulté d'orthographe (pas de -ger, -cer, -eler…), auxiliaire avoir
const VERBES_1 = ['chanter', 'jouer', 'danser', 'compter', 'parler', 'regarder', 'marcher', 'aimer', 'porter', 'sauter', 'chercher', 'laver', 'briller', 'grimper', 'écouter', 'trouver', 'donner', 'dessiner', 'aider', 'allumer'];
const VERBES_2 = ['finir', 'grandir', 'choisir', 'réussir', 'remplir', 'obéir', 'rougir', 'nourrir'];
// Verbes irréguliers du programme (CE2 : être, avoir, aller, faire, dire, venir, pouvoir, voir, vouloir, prendre)
const VERBES_IRR = {
  'être': { pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], imp: 'ét', fut: 'ser', ps: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'], pp: 'été', aux: 'avoir', impe: ['sois', 'soyons', 'soyez'] },
  'avoir': { pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], imp: 'av', fut: 'aur', ps: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'], pp: 'eu', aux: 'avoir', impe: ['aie', 'ayons', 'ayez'] },
  'aller': { pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], imp: 'all', fut: 'ir', ps: ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'], pp: 'allé', aux: 'être', impe: ['va', 'allons', 'allez'] },
  'faire': { pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], imp: 'fais', fut: 'fer', ps: ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'], pp: 'fait', aux: 'avoir', impe: ['fais', 'faisons', 'faites'] },
  'dire': { pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], imp: 'dis', fut: 'dir', ps: ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent'], pp: 'dit', aux: 'avoir', impe: ['dis', 'disons', 'dites'] },
  'venir': { pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], imp: 'ven', fut: 'viendr', ps: ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent'], pp: 'venu', aux: 'être', impe: ['viens', 'venons', 'venez'] },
  'pouvoir': { pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], imp: 'pouv', fut: 'pourr', ps: ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent'], pp: 'pu', aux: 'avoir', impe: null },
  'voir': { pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], imp: 'voy', fut: 'verr', ps: ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent'], pp: 'vu', aux: 'avoir', impe: ['vois', 'voyons', 'voyez'] },
  'vouloir': { pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], imp: 'voul', fut: 'voudr', ps: ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent'], pp: 'voulu', aux: 'avoir', impe: null },
  'prendre': { pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], imp: 'pren', fut: 'prendr', ps: ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent'], pp: 'pris', aux: 'avoir', impe: ['prends', 'prenons', 'prenez'] },
};
const TEMPS_NOMS = { pres: 'présent', imp: 'imparfait', fut: 'futur', pc: 'passé composé', ps: 'passé simple', cond: 'conditionnel présent', impe: 'impératif présent' };

// ---------- Orthographe : homophones grammaticaux ----------
// [phrase avec ___, réponse, série de choix, niveau]
const HOMOPHONES = [
  ['Manoach ___ un tambour.', 'a', ['a', 'à'], 0], ['Cécilia va ___ la rivière.', 'à', ['a', 'à'], 0], ['La tortue ___ une fleur rose.', 'a', ['a', 'à'], 0],
  ['Ils marchent ___ côté du fleuve.', 'à', ['a', 'à'], 0], ['Christian ___ peur de voler si haut.', 'a', ['a', 'à'], 0], ['Elle pense ___ sa maman, la Lune.', 'à', ['a', 'à'], 0],
  ['Cécilia ___ Manoach comptent les étoiles.', 'et', ['et', 'est'], 0], ['La petite étoile ___ tombée dans le fleuve.', 'est', ['et', 'est'], 0],
  ['Le ciel ___ noir ce soir.', 'est', ['et', 'est'], 0], ['Il prend une mangue ___ une banane.', 'et', ['et', 'est'], 0], ['Le héron ___ timide.', 'est', ['et', 'est'], 0],
  ['Les enfants ___ trouvé l’étoile.', 'ont', ['on', 'ont'], 0], ['Ce soir, ___ compte les étoiles.', 'on', ['on', 'ont'], 0], ['Les lucioles ___ formé un escalier.', 'ont', ['on', 'ont'], 0],
  ['Ils ___ grimpé dans l’arbre.', 'ont', ['on', 'ont'], 0], ['Écoute, ___ entend le tambour !', 'on', ['on', 'ont'], 0],
  ['Manoach joue de ___ tambour.', 'son', ['son', 'sont'], 0], ['Les étoiles ___ dans le ciel.', 'sont', ['son', 'sont'], 0], ['Cécilia et Manoach ___ frère et sœur.', 'sont', ['son', 'sont'], 0],
  ['Christian ouvre ___ bec.', 'son', ['son', 'sont'], 0], ['Ils ___ très courageux.', 'sont', ['son', 'sont'], 0],
  ['Cécilia range ___ jouets.', 'ses', ['ces', 'ses'], 1], ['Regarde ___ lucioles qui brillent !', 'ces', ['ces', 'ses'], 1], ['Le héron déploie ___ ailes.', 'ses', ['ces', 'ses'], 1],
  ['Qui a apporté ___ mangues ?', 'ces', ['ces', 'ses'], 1], ['La petite étoile ___ cache sous les feuilles.', 'se', ['ce', 'se'], 1], ['Regarde ___ baobab immense !', 'ce', ['ce', 'se'], 1],
  ['Christian ___ pose sur la branche.', 'se', ['ce', 'se'], 1], ['Les enfants ___ lavent les mains.', 'se', ['ce', 'se'], 1],
  ['Tu préfères une mangue ___ une banane ?', 'ou', ['ou', 'où'], 1], ['La maison ___ ils habitent est au bord du fleuve.', 'où', ['ou', 'où'], 1], ['Sais-tu ___ est tombée l’étoile ?', 'où', ['ou', 'où'], 1],
  ['L’étoile ___ perdue dans la forêt.', 's’est', ['c’est', 's’est'], 2], ['Manoach ___ endormi près du feu.', 's’est', ['c’est', 's’est'], 2], ['Je crois que ___ Thérèse qui connaît le chemin.', 'c’est', ['c’est', 's’est'], 2],
  ['Les enfants appellent ___ amis.', 'leurs', ['leur', 'leurs'], 2], ['Cécilia ___ donne des mangues.', 'leur', ['leur', 'leurs'], 2], ['Ils rangent ___ jouets.', 'leurs', ['leur', 'leurs'], 2],
  ['Christian ___ voler très haut.', 'peut', ['peu', 'peut', 'peux'], 2], ['Je ___ t’aider !', 'peux', ['peu', 'peut', 'peux'], 2], ['Il reste un ___ de lumière.', 'peu', ['peu', 'peut', 'peux'], 2],
  ['Je crois ___ a froid.', 'qu’elle', ['quel', 'quelle', 'qu’elle'], 2], ['Dis-moi ___ chemin il faut prendre.', 'quel', ['quel', 'quelle', 'qu’elle'], 2],
];

// ---------- Orthographe : accords dans le groupe nominal ----------
// [groupe nominal avec (adjectif), réponse, mauvaises réponses, niveau]
const ACCORDS = [
  ['des étoiles (brillant)', 'brillantes', ['brillants', 'brillante'], 0], ['une tortue (lent)', 'lente', ['lent', 'lentes'], 0], ['des hérons (blanc)', 'blancs', ['blanches', 'blanc'], 0],
  ['une nuit (noir)', 'noire', ['noir', 'noires'], 0], ['des mangues (sucré)', 'sucrées', ['sucrés', 'sucrée'], 0], ['des fleuves (immense)', 'immenses', ['immense', 'immensent'], 0],
  ['une maison (petit)', 'petite', ['petit', 'petites'], 0], ['des lucioles (lumineux)', 'lumineuses', ['lumineux', 'lumineuse'], 0], ['des enfants (courageux)', 'courageux', ['courageuxs', 'courageuse'], 0],
  ['une (beau) nuit', 'belle', ['beau', 'bel'], 1], ['une (vieux) tortue', 'vieille', ['vieux', 'vieuse'], 1], ['une voix (doux)', 'douce', ['doux', 'douse'], 1],
  ['une amie (gentil)', 'gentille', ['gentil', 'gentile'], 1], ['une eau (frais)', 'fraîche', ['fraise', 'frais'], 1], ['des (nouveau) amis', 'nouveaux', ['nouveaus', 'nouvels'], 1],
  ['une (long) route', 'longue', ['longe', 'long'], 1], ['une branche (sec)', 'sèche', ['secque', 'sec'], 1], ['une étoile (heureux)', 'heureuse', ['heureux', 'heureuxe'], 1],
  ['des (beau) arbres', 'beaux', ['beaus', 'bels'], 2], ['un (vieux) arbre', 'vieil', ['vieux', 'vieille'], 2], ['un (nouveau) ami', 'nouvel', ['nouveau', 'nouvelle'], 2],
  ['une (fou) idée', 'folle', ['fou', 'foue'], 2], ['des fleurs (orange)', 'orange', ['oranges', 'orangées'], 2], ['des tambours (marron)', 'marron', ['marrons', 'marronnes'], 2],
  ['une robe (blanc)', 'blanche', ['blanque', 'blance'], 2], ['une fête (public)', 'publique', ['public', 'publics'], 2],
];

// ---------- Orthographe : mots à savoir écrire ----------
const MOTS_ORTHO = [
  ['maintenant', ['maintenent', 'mintenant'], 0], ['toujours', ['toujour', 'toujourt'], 0], ['beaucoup', ['beaucou', 'bocoup'], 0], ['aujourd’hui', ['aujourdui', 'aujourd’ui'], 0],
  ['longtemps', ['lontemps', 'longtemp'], 0], ['éléphant', ['éléfant', 'éléphan'], 0], ['pendant', ['pandant', 'pendan'], 0], ['souvent', ['souvant', 'souven'], 0],
  ['oiseau', ['oizeau', 'oisau'], 0], ['lampe', ['lanpe', 'lamppe'], 0], ['jambe', ['janbe', 'jammbe'], 0], ['pompier', ['ponpier', 'pompié'], 0],
  ['quatre', ['catre', 'quattre'], 0], ['cahier', ['cahié', 'caier'], 0], ['garçon', ['garcon', 'garsson'], 0], ['guitare', ['gitare', 'guittare'], 0],
  ['parce que', ['parsque', 'parce-que'], 1], ['quelquefois', ['quelquefoi', 'quèlquefois'], 1], ['d’abord', ['d’abort', 'dabord'], 1], ['ensemble', ['ansemble', 'ensembe'], 1],
  ['hôpital', ['hopital', 'ôpital'], 1], ['rhinocéros', ['rinocéros', 'rhinocérot'], 1], ['bibliothèque', ['bibliotèque', 'bibliothéque'], 1], ['photographie', ['fotographie', 'photografie'], 1],
  ['automne', ['autonne', 'automme'], 1], ['immense', ['imense', 'immence'], 1], ['pigeon', ['pijon', 'pigon'], 1], ['ennemi', ['énemi', 'ennemit'], 1],
  ['rythme', ['rythmme', 'rhythme'], 2], ['dilemme', ['dilemne', 'dilème'], 2], ['parallèle', ['paralèle', 'parrallèle'], 2], ['accueillir', ['acceuillir', 'accueuillir'], 2],
  ['chrysanthème', ['chrisanthème', 'chrysantème'], 2], ['hippopotame', ['hipopotame', 'hippopotamme'], 2], ['aquarelle', ['acquarelle', 'aquarele'], 2], ['occurrence', ['occurence', 'ocurrence'], 2],
];

// ---------- Vocabulaire ----------
const CONTRAIRES = [['grand', 'petit', 0], ['chaud', 'froid', 0], ['jour', 'nuit', 0], ['monter', 'descendre', 0], ['lent', 'rapide', 0], ['haut', 'bas', 0], ['ouvrir', 'fermer', 0],
  ['triste', 'joyeux', 0], ['plein', 'vide', 0], ['entrer', 'sortir', 0], ['propre', 'sale', 0], ['allumer', 'éteindre', 0], ['gagner', 'perdre', 0], ['dedans', 'dehors', 0],
  ['possible', 'impossible', 1], ['lisible', 'illisible', 1], ['connu', 'inconnu', 1], ['adroit', 'maladroit', 1], ['patient', 'impatient', 1],
  ['légal', 'illégal', 2], ['régulier', 'irrégulier', 2], ['honnête', 'malhonnête', 2], ['responsable', 'irresponsable', 2]];
const SYNONYMES = [['content', 'heureux', 1], ['commencer', 'débuter', 1], ['beau', 'joli', 1], ['regarder', 'observer', 1], ['finir', 'terminer', 1], ['briller', 'scintiller', 1],
  ['aider', 'secourir', 1], ['peur', 'frayeur', 1], ['courageux', 'intrépide', 2], ['minuscule', 'infime', 2], ['triste', 'mélancolique', 2], ['calme', 'serein', 2], ['lumineux', 'éclatant', 2]];
// Groupes de mots pour l'ordre alphabétique : CE2 = 1re lettre différente, CM1 = même 1re lettre, génie = mêmes 3 premières lettres
const DICO = [
  [['arbre', 'baobab', 'ciel', 'étoile', 'fleuve', 'lune', 'mangue', 'nuit', 'tortue', 'héron', 'rivière', 'pirogue', 'jungle', 'oiseau'], 0],
  [['branche', 'bateau', 'bijou', 'boue'], 1], [['canard', 'ciel', 'château', 'courage'], 1], [['lune', 'lampe', 'luciole', 'livre'], 1], [['mangue', 'miel', 'moustique', 'maison'], 1], [['tortue', 'tambour', 'terre', 'tigre'], 1],
  [['tortue', 'tornade', 'torrent', 'tortiller'], 2], [['étoile', 'étoffe', 'étourdi', 'étonné'], 2], [['branche', 'brancard', 'brandir', 'branlant'], 2], [['lumière', 'lumineux', 'lumbago', 'lumignon'], 2], [['chanter', 'chantier', 'chanson', 'chance'], 2],
];
// Les mots lingala du livre (docs/HISTOIRE.md)
const LINGALA = [['Mbote', 'Bonjour'], ['Mama', 'Maman'], ['Monzoto', 'Étoile'], ['Ebale', 'Le fleuve'], ['Melesi', 'Merci']];

// ---------- Sciences et technologie ----------
const VIVANT = [['chat', 0, 0], ['arbre', 0, 0], ['poisson', 0, 0], ['fleur', 0, 0], ['héron', 0, 0], ['tortue', 0, 0], ['fourmi', 0, 0], ['herbe', 0, 0], ['baobab', 0, 0],
  ['caillou', 1, 0], ['nuage', 1, 0], ['chaise', 1, 0], ['vélo', 1, 0], ['sable', 1, 0], ['verre', 1, 0], ['robot', 1, 0], ['montre', 1, 0], ['eau', 1, 0],
  ['champignon', 0, 1], ['mousse', 0, 1], ['corail', 0, 1], ['levure', 0, 2], ['plancton', 0, 2], ['lichen', 0, 2], ['sel', 1, 1], ['bougie', 1, 1], ['fossile', 1, 2], ['flocon', 1, 2], ['coquillage vide', 1, 2]];
const CONDUCTEURS = [['clou en fer', 0, 1], ['fil de cuivre', 0, 1], ['papier aluminium', 0, 1], ['trombone', 0, 1], ['pièce de monnaie', 0, 1], ['cuillère en métal', 0, 1], ['mine de crayon (graphite)', 0, 2],
  ['règle en plastique', 1, 1], ['bâton de bois sec', 1, 1], ['verre', 1, 1], ['gomme', 1, 1], ['feuille de papier', 1, 1], ['pelote de laine', 1, 1], ['ballon en caoutchouc', 1, 2]];
const SCIENCES = {
  animaux: [
    ['Le héron est…', 'un oiseau', ['un mammifère', 'un poisson'], 0], ['La tortue est…', 'un reptile', ['un amphibien', 'un mammifère'], 0], ['Le dauphin est…', 'un mammifère', ['un poisson', 'un reptile'], 0],
    ['La grenouille est…', 'un amphibien', ['un reptile', 'un poisson'], 1], ['Le requin est…', 'un poisson', ['un mammifère', 'un reptile'], 0], ['La chauve-souris est…', 'un mammifère', ['un oiseau', 'un insecte'], 1],
    ['Le crocodile est…', 'un reptile', ['un amphibien', 'un mammifère'], 0], ['Combien de pattes a un insecte ?', '6', ['8', '4'], 0], ['Combien de pattes a une araignée ?', '8', ['6', '10'], 0],
    ['La baleine est…', 'un mammifère', ['un poisson', 'un reptile'], 1], ['Le manchot est…', 'un oiseau', ['un mammifère', 'un poisson'], 1], ['Un animal sans squelette intérieur est…', 'un invertébré', ['un vertébré', 'un mammifère'], 2],
    ['Les mammifères nourrissent leurs petits avec…', 'du lait', ['des graines', 'des insectes'], 0], ['La chenille devient…', 'un papillon', ['une abeille', 'une libellule'], 0], ['Le têtard devient…', 'une grenouille', ['un poisson', 'un serpent'], 1],
  ],
  alimentation: [
    ['La girafe mange des feuilles : elle est…', 'herbivore', ['carnivore', 'omnivore'], 0], ['Le lion mange d’autres animaux : il est…', 'carnivore', ['herbivore', 'omnivore'], 0], ['Le lapin est…', 'herbivore', ['carnivore', 'omnivore'], 0],
    ['Le héron mange des poissons : il est…', 'carnivore', ['herbivore', 'omnivore'], 0], ['L’être humain mange de tout : il est…', 'omnivore', ['herbivore', 'carnivore'], 1], ['L’ours brun est…', 'omnivore', ['herbivore', 'carnivore'], 1],
    ['Le riz fait partie des…', 'féculents', ['produits laitiers', 'matières grasses'], 0], ['Le lait fait partie des…', 'produits laitiers', ['féculents', 'fruits et légumes'], 0], ['La mangue fait partie des…', 'fruits et légumes', ['féculents', 'produits sucrés'], 0],
    ['Le beurre fait partie des…', 'matières grasses', ['produits laitiers', 'féculents'], 1], ['Le poisson fait partie du groupe…', 'viandes, poissons, œufs', ['féculents', 'produits laitiers'], 1], ['Les pâtes font partie des…', 'féculents', ['fruits et légumes', 'matières grasses'], 0],
    ['Dans « herbe → lapin → renard », le renard mange…', 'le lapin', ['l’herbe', 'rien'], 1], ['Les végétaux qui fabriquent leur matière grâce à la lumière sont des…', 'producteurs', ['consommateurs', 'décomposeurs'], 2],
    ['Les vers de terre et les champignons qui recyclent les déchets sont des…', 'décomposeurs', ['producteurs', 'prédateurs'], 2],
  ],
  corps: [
    ['Quel organe fait circuler le sang ?', 'le cœur', ['les poumons', 'l’estomac'], 0], ['Avec quel organe respire-t-on ?', 'les poumons', ['le cœur', 'le foie'], 0], ['Où commence la digestion ?', 'dans la bouche', ['dans l’estomac', 'dans les poumons'], 0],
    ['Quel organe commande le corps ?', 'le cerveau', ['le cœur', 'l’estomac'], 0], ['On sent les odeurs avec…', 'le nez', ['les oreilles', 'la langue'], 0], ['Le toucher se fait grâce à…', 'la peau', ['les yeux', 'le nez'], 0],
    ['Combien d’os environ dans le squelette d’un adulte ?', '206', ['26', '1 000'], 1], ['Combien de dents de lait a un enfant ?', '20', ['32', '10'], 1], ['Combien de dents a un adulte ?', '32', ['20', '42'], 1],
    ['Les os du crâne protègent…', 'le cerveau', ['le cœur', 'les poumons'], 0], ['Pour bouger, les os sont tirés par…', 'les muscles', ['les nerfs', 'les veines'], 1], ['L’articulation entre la cuisse et la jambe est…', 'le genou', ['le coude', 'le poignet'], 1],
    ['Quels organes filtrent le sang pour faire l’urine ?', 'les reins', ['les poumons', 'l’estomac'], 2], ['Le cœur est…', 'un muscle', ['un os', 'un poumon'], 2], ['L’air entre dans les poumons quand on…', 'inspire', ['expire', 'digère'], 1],
  ],
  matiere: [
    ['À quelle température l’eau gèle-t-elle ?', '0 °C', ['10 °C', '100 °C'], 0], ['À quelle température l’eau bout-elle ?', '100 °C', ['50 °C', '0 °C'], 0], ['La glace, c’est de l’eau…', 'solide', ['liquide', 'gazeuse'], 0],
    ['La vapeur d’eau, c’est de l’eau…', 'gazeuse', ['solide', 'liquide'], 0], ['Le passage de solide à liquide s’appelle…', 'la fusion', ['la solidification', 'la condensation'], 1], ['Le passage de liquide à solide s’appelle…', 'la solidification', ['la fusion', 'l’évaporation'], 1],
    ['Le passage de liquide à gaz s’appelle…', 'la vaporisation', ['la condensation', 'la fusion'], 1], ['La buée sur une vitre froide, c’est…', 'la condensation', ['la fusion', 'la solidification'], 1], ['Le sucre mis dans l’eau…', 'se dissout', ['disparaît pour toujours', 'devient de la glace'], 1],
    ['Quand un glaçon fond, sa masse…', 'ne change pas', ['diminue', 'augmente'], 2], ['L’air est-il de la matière ?', 'oui', ['non', 'seulement quand il y a du vent'], 2], ['Les nuages se forment par…', 'condensation', ['fusion', 'solidification'], 2],
  ],
  ciel: [
    ['Combien de temps met la Terre pour tourner sur elle-même ?', '24 heures', ['1 semaine', '365 jours'], 0], ['Combien de temps met la Terre pour faire le tour du Soleil ?', '365 jours', ['24 heures', '30 jours'], 0], ['Le Soleil est…', 'une étoile', ['une planète', 'un satellite'], 0],
    ['La Lune tourne autour…', 'de la Terre', ['du Soleil seulement', 'de Mars'], 0], ['La planète la plus proche du Soleil est…', 'Mercure', ['Mars', 'Neptune'], 1], ['Combien de planètes compte le système solaire ?', '8', ['9', '12'], 1],
    ['La plus grosse planète du système solaire est…', 'Jupiter', ['la Terre', 'Saturne'], 1], ['La planète rouge est…', 'Mars', ['Vénus', 'Jupiter'], 0], ['La planète aux grands anneaux est…', 'Saturne', ['Mercure', 'Mars'], 0],
    ['La Lune brille car elle renvoie la lumière…', 'du Soleil', ['des lucioles', 'de la Terre'], 1], ['Le jour et la nuit viennent de…', 'la rotation de la Terre sur elle-même', ['la Lune qui cache le Soleil', 'les nuages'], 1],
    ['La planète la plus éloignée du Soleil est…', 'Neptune', ['Uranus', 'Saturne'], 2], ['Les saisons viennent de…', 'l’inclinaison de l’axe de la Terre', ['la distance à la Lune', 'les nuages'], 2], ['La Lune fait le tour de la Terre en environ…', 'un mois', ['un jour', 'un an'], 2],
  ],
  plantes: [
    ['Par où une plante puise-t-elle l’eau ?', 'par les racines', ['par les fleurs', 'par les feuilles'], 0], ['Pour germer, une graine a besoin…', 'd’eau et de chaleur', ['de sel', 'de nuit complète'], 0], ['Après la fleur, la plante forme…', 'un fruit', ['une racine', 'une tige'], 1],
    ['Les graines se trouvent dans…', 'le fruit', ['la racine', 'la tige'], 0], ['La partie qui porte les feuilles est…', 'la tige', ['la racine', 'la graine'], 0], ['Les feuilles ont besoin de… pour fabriquer la matière de la plante', 'lumière', ['bruit', 'obscurité'], 1],
    ['Le pollen est souvent transporté par…', 'les insectes', ['les poissons', 'les cailloux'], 1], ['Le baobab est…', 'un arbre', ['une herbe', 'un champignon'], 0], ['Le jour, les plantes vertes rejettent…', 'de l’oxygène', ['du sable', 'de la fumée'], 2],
    ['Une plante privée de lumière…', 'jaunit et dépérit', ['pousse plus vite', 'devient bleue'], 1],
  ],
  energie: [
    ['Pour qu’une ampoule s’allume, le circuit doit être…', 'fermé', ['ouvert', 'coupé'], 0], ['Une pile fournit…', 'de l’électricité', ['de l’eau', 'de la lumière du Soleil'], 0], ['Ne jamais toucher…', 'une prise électrique avec les doigts', ['une pile de 4,5 V', 'un interrupteur'], 0],
    ['Le vent est une énergie…', 'renouvelable', ['non renouvelable', 'interdite'], 1], ['Le pétrole est une énergie…', 'non renouvelable', ['renouvelable', 'infinie'], 1], ['Les panneaux solaires utilisent l’énergie…', 'du Soleil', ['du vent', 'du charbon'], 1],
    ['Le charbon est une énergie…', 'non renouvelable', ['renouvelable', 'éolienne'], 1], ['Un barrage produit de l’électricité avec…', 'l’eau', ['le sable', 'le pétrole'], 1], ['Une éolienne tourne grâce…', 'au vent', ['à la pluie', 'au Soleil'], 0],
    ['Le cuivre des fils électriques est…', 'conducteur', ['isolant', 'liquide'], 2],
  ],
};

// ---------- Histoire et géographie (Questionner le monde CE2, Histoire-géographie CM1) ----------
const HISTOIRE = [
  ['Qui était le chef gaulois vaincu à Alésia ?', 'Vercingétorix', ['Clovis', 'Charlemagne'], 1], ['La bataille d’Alésia a eu lieu en…', '52 av. J.-C.', ['800', '1789'], 1],
  ['Les peintures de la grotte de Lascaux datent de…', 'la Préhistoire', ['le Moyen Âge', 'la Renaissance'], 0], ['Qui fut couronné empereur en l’an 800 ?', 'Charlemagne', ['Louis XIV', 'Napoléon'], 1],
  ['Quel roi est surnommé le Roi-Soleil ?', 'Louis XIV', ['Henri IV', 'François Ier'], 1], ['Louis XIV a fait construire le château de…', 'Versailles', ['Chambord', 'la Bastille'], 1],
  ['La prise de la Bastille a eu lieu le…', '14 juillet 1789', ['11 novembre 1918', '8 mai 1945'], 0], ['Napoléon Bonaparte est sacré empereur en…', '1804', ['1789', '1515'], 1],
  ['François Ier a gagné la bataille de Marignan en…', '1515', ['1789', '800'], 1], ['Qui a délivré Orléans pendant la guerre de Cent Ans ?', 'Jeanne d’Arc', ['Marianne', 'Catherine de Médicis'], 1],
  ['Le roi des Francs baptisé vers 496 est…', 'Clovis', ['Charlemagne', 'Louis XIV'], 1], ['Christophe Colomb arrive en Amérique en…', '1492', ['1789', '1914'], 1],
  ['Gutenberg a mis au point…', 'l’imprimerie', ['l’électricité', 'le téléphone'], 1], ['Les châteaux forts ont été construits au…', 'Moyen Âge', ['XXe siècle', 'temps des Gaulois'], 0],
  ['Jules César était un général…', 'romain', ['gaulois', 'chinois'], 1], ['La Déclaration des droits de l’homme et du citoyen date de…', '1789', ['1515', '1945'], 1],
  ['La guerre de Cent Ans opposait la France à…', 'l’Angleterre', ['l’Espagne', 'l’Italie'], 2], ['Napoléon est vaincu à Waterloo en…', '1815', ['1804', '1789'], 2],
  ['Le premier roi capétien, en 987, est…', 'Hugues Capet', ['Clovis', 'Charles VII'], 2], ['Henri IV signe l’édit de Nantes en…', '1598', ['1492', '1715'], 2],
  ['La Renaissance est née en…', 'Italie', ['Angleterre', 'Russie'], 2], ['Le traité de Verdun (843) partage l’empire de…', 'Charlemagne', ['Napoléon', 'Clovis'], 2],
];
const GEOGRAPHIE = [
  ['Le fleuve Congo coule en…', 'Afrique', ['Europe', 'Asie'], 0], ['Le plus grand océan du monde est l’océan…', 'Pacifique', ['Atlantique', 'Indien'], 0], ['Entre l’Europe et l’Amérique se trouve l’océan…', 'Atlantique', ['Pacifique', 'Indien'], 0],
  ['La capitale de la France est…', 'Paris', ['Lyon', 'Marseille'], 0], ['La capitale de la République démocratique du Congo est…', 'Kinshasa', ['Brazzaville', 'Lubumbashi'], 0], ['La capitale de la Belgique est…', 'Bruxelles', ['Liège', 'Anvers'], 0],
  ['Le Soleil se lève à…', 'l’est', ['l’ouest', 'au nord'], 0], ['Le Soleil se couche à…', 'l’ouest', ['l’est', 'au sud'], 0], ['Sur une carte, le nord est en général…', 'en haut', ['en bas', 'à gauche'], 0],
  ['Le plus long fleuve de France est…', 'la Loire', ['la Seine', 'le Rhône'], 1], ['Le plus haut sommet des Alpes est…', 'le mont Blanc', ['le Kilimandjaro', 'le Puy de Dôme'], 1], ['Le plus grand désert chaud du monde est…', 'le Sahara', ['le Kalahari', 'le Gobi'], 1],
  ['Le fleuve Congo se jette dans l’océan…', 'Atlantique', ['Indien', 'Pacifique'], 1], ['Le plus long fleuve d’Afrique est…', 'le Nil', ['le Congo', 'le Niger'], 1], ['La capitale du Congo-Brazzaville est…', 'Brazzaville', ['Kinshasa', 'Pointe-Noire'], 1],
  ['La capitale du Sénégal est…', 'Dakar', ['Abidjan', 'Bamako'], 2], ['La capitale du Cameroun est…', 'Yaoundé', ['Douala', 'Libreville'], 2], ['La capitale du Japon est…', 'Tokyo', ['Pékin', 'Séoul'], 2],
  ['Le plus haut sommet d’Afrique est…', 'le Kilimandjaro', ['le mont Blanc', 'l’Everest'], 2], ['Le plus haut sommet du monde est…', 'l’Everest', ['le mont Blanc', 'le Kilimandjaro'], 2],
];
const CALENDRIER = [
  ['Combien de jours dans une semaine ?', '7', ['5', '10'], 0], ['Combien de mois dans une année ?', '12', ['10', '52'], 0], ['Quelle saison vient après l’été ?', 'l’automne', ['l’hiver', 'le printemps'], 0],
  ['Combien d’années dans un siècle ?', '100', ['10', '1 000'], 0], ['Quel mois vient après mars ?', 'avril', ['mai', 'février'], 0], ['Combien d’années dans un millénaire ?', '1 000', ['100', '10'], 1],
  ['Combien de jours a une année bissextile ?', '366', ['365', '360'], 1], ['Combien de semaines environ dans une année ?', '52', ['12', '100'], 1],
];

// ---------- Enseignement moral et civique ----------
const EMC = [
  ['La devise de la République française est…', 'Liberté, Égalité, Fraternité', ['Travail, Famille, Patrie', 'Paix, Joie, Amour'], 0], ['Les couleurs du drapeau français sont…', 'bleu, blanc, rouge', ['vert, jaune, rouge', 'bleu, jaune, vert'], 0],
  ['L’hymne national français s’appelle…', 'La Marseillaise', ['Frère Jacques', 'L’Internationale'], 0], ['La fête nationale française a lieu le…', '14 juillet', ['1er janvier', '25 décembre'], 0],
  ['La femme au bonnet phrygien qui représente la République s’appelle…', 'Marianne', ['Jeanne d’Arc', 'Joséphine'], 1], ['Le chef de l’État en France est…', 'le président de la République', ['le maire', 'le roi'], 1],
  ['En France, on peut voter à partir de…', '18 ans', ['12 ans', '30 ans'], 1], ['Un camarade est triste. Que faire ?', 'L’écouter et l’aider', ['Se moquer de lui', 'Faire comme si de rien n’était'], 0],
  ['Un enfant est embêté tous les jours dans la cour. Je…', 'préviens un adulte', ['ne dis rien', 'rejoins ceux qui l’embêtent'], 0], ['Les règles de la classe servent à…', 'bien vivre ensemble', ['punir les élèves', 'faire peur'], 0],
  ['Tous les enfants ont le droit…', 'd’aller à l’école', ['de ne jamais dormir', 'de conduire une voiture'], 0], ['Qui dirige la commune ?', 'le maire', ['le président', 'le directeur d’école'], 1],
  ['La Convention internationale des droits de l’enfant a été adoptée en…', '1989', ['1789', '2010'], 2], ['En France, les lois sont votées par…', 'le Parlement', ['le maire', 'les enfants'], 2],
  ['« Mosapi moko elongolaka sili te » veut dire qu’…', 'ensemble, on est plus fort', ['il faut rester seul', 'il faut aller vite'], 0],
];

// ---------- Anglais ----------
// [français, anglais, catégorie, niveau]
const ANGLAIS = [
  ['rouge', 'red', 'couleur', 0], ['bleu', 'blue', 'couleur', 0], ['vert', 'green', 'couleur', 0], ['jaune', 'yellow', 'couleur', 0], ['noir', 'black', 'couleur', 0], ['blanc', 'white', 'couleur', 0], ['rose', 'pink', 'couleur', 0],
  ['un', 'one', 'nombre', 0], ['deux', 'two', 'nombre', 0], ['trois', 'three', 'nombre', 0], ['cinq', 'five', 'nombre', 0], ['huit', 'eight', 'nombre', 0], ['dix', 'ten', 'nombre', 0], ['douze', 'twelve', 'nombre', 1], ['vingt', 'twenty', 'nombre', 1], ['quarante-deux', 'forty-two', 'nombre', 2], ['cent', 'one hundred', 'nombre', 2],
  ['chat', 'cat', 'animal', 0], ['chien', 'dog', 'animal', 0], ['oiseau', 'bird', 'animal', 0], ['poisson', 'fish', 'animal', 0], ['tortue', 'turtle', 'animal', 0], ['lapin', 'rabbit', 'animal', 1], ['singe', 'monkey', 'animal', 1], ['héron', 'heron', 'animal', 2],
  ['mère', 'mother', 'famille', 0], ['père', 'father', 'famille', 0], ['sœur', 'sister', 'famille', 0], ['frère', 'brother', 'famille', 0], ['grand-mère', 'grandmother', 'famille', 1],
  ['bonjour', 'hello', 'politesse', 0], ['merci', 'thank you', 'politesse', 0], ['au revoir', 'goodbye', 'politesse', 0], ['s’il te plaît', 'please', 'politesse', 1],
  ['lundi', 'Monday', 'jour', 1], ['mercredi', 'Wednesday', 'jour', 1], ['dimanche', 'Sunday', 'jour', 1], ['janvier', 'January', 'mois', 1], ['juillet', 'July', 'mois', 2],
  ['la tête', 'the head', 'corps', 1], ['la main', 'the hand', 'corps', 1], ['les yeux', 'the eyes', 'corps', 1], ['la pomme', 'the apple', 'nourriture', 1], ['le pain', 'the bread', 'nourriture', 1], ['l’eau', 'the water', 'nourriture', 1],
  ['l’étoile', 'the star', 'nature', 1], ['la lune', 'the moon', 'nature', 1], ['le fleuve', 'the river', 'nature', 2], ['les enfants', 'the children', 'nature', 2],
];
