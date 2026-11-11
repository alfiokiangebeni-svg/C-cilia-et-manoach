// Académie – programme des 6 classes, EN DONNÉES : classe → matière → chapitres → leçons.
// Une leçon : titre, objectif, explication (adaptée à l'âge), exemple concret (vie quotidienne congolaise),
// illustration (emoji ou image de img/), sources des questions du quiz :
//   { b: 'banque' }                       → BANQUES (banques.js)
//   { g: 'notion', n: 0|1|2, p: {...} }   → générateurs existants GEN (engine.js / matieres.js), niveau n
//   { a: 'gen', p: {...} }                → générateurs de l'académie GEN_ACAD (moteur.js)
// Les identifiants des leçons sont calculés : '<classe>-<matière>-<chapitre>-<leçon>' (ex. '3-ma-2-1').
const L = (titre, objectif, explication, exemple, src, illu) => ({ titre, objectif, explication, exemple, src, illu: illu || '' });

const PROGRAMME_ACAD = {
  // ============================== 1re PRIMAIRE ==============================
  1: {
    fr: [
      ['Les lettres', [
        L('L’alphabet', 'Connaître l’ordre des lettres de l’alphabet.', 'L’alphabet a 26 lettres, toujours dans le même ordre : a b c d e f g h i j k l m n o p q r s t u v w x y z.', 'Le maître appelle les élèves dans l’ordre de l’alphabet : Amani, Bisimwa, Cécilia…', [{ a: 'lettre' }], '🔤'),
        L('Voyelles et consonnes', 'Reconnaître les voyelles et les consonnes.', 'Il y a 6 voyelles : a, e, i, o, u, y. Toutes les autres lettres sont des consonnes.', 'Dans « papa », il y a la consonne p et la voyelle a.', [{ a: 'voyelle' }], '🅰️'),
      ]],
      ['Lire et écrire', [
        L('Les syllabes', 'Découper un mot en syllabes.', 'Une syllabe est un morceau de mot que l’on prononce d’un seul coup de voix. On frappe dans les mains à chaque syllabe.', 'Ma-ni-oc : on frappe 3 fois. Ma-man : 2 fois.', [{ b: 'f1_syllabes' }], '👏'),
        L('Les mots simples', 'Reconnaître et lire des mots simples.', 'Un mot est fait de lettres. On regarde la première lettre et on lit les syllabes une à une.', 'Sur le marché, Cécilia lit « mangue » sur la pancarte de maman Suzanne.', [{ b: 'f1_mots' }], 'fruits/mangue'),
        L('Lire une phrase', 'Comprendre une phrase courte.', 'Une phrase commence par une majuscule et finit par un point. Elle dit qui fait quoi.', '« Manoach joue du tambour. » : c’est Manoach qui joue.', [{ b: 'f1_lecture' }], '📖'),
        L('Bien écrire les mots', 'Reconnaître l’orthographe d’un mot simple.', 'Pour bien écrire un mot, on écoute chaque son et on écrit la bonne lettre.', 'On écrit « école » avec un é au début.', [{ b: 'f1_ecriture' }], '✏️'),
      ]],
    ],
    ma: [
      ['Les nombres jusqu’à 100', [
        L('Compter des objets', 'Dénombrer une petite collection.', 'Pour compter, on touche chaque objet une seule fois en disant les nombres dans l’ordre : 1, 2, 3…', 'Maman pose des mangues sur la table : on compte 1, 2, 3, 4, 5 mangues.', [{ a: 'compter', p: { max: 12 } }], '🥭'),
        L('Dizaines et unités', 'Écrire un nombre avec des dizaines et des unités.', '10 unités font 1 dizaine. Dans 34, il y a 3 dizaines et 4 unités.', '3 paquets de 10 bonbons et 4 bonbons seuls : 34 bonbons.', [{ a: 'dizaines', p: { max: 99 } }], '🔟'),
        L('Comparer les nombres', 'Trouver le plus grand ou le plus petit nombre.', 'On compare d’abord les dizaines, puis les unités. 45 est plus grand que 38 car 4 dizaines > 3 dizaines.', 'Kiese a 45 billes et Mbuyi 38 : Kiese en a plus.', [{ a: 'comparer', p: { max: 100 } }], '⚖️'),
      ]],
      ['Additionner et soustraire', [
        L('L’addition', 'Ajouter deux petits nombres.', 'Additionner, c’est ajouter. On écrit avec le signe + : 4 + 3 = 7.', 'Tu as 4 mangues, papa t’en donne 3 : tu as 4 + 3 = 7 mangues.', [{ g: 'add', p: { a: [1, 10], b: [1, 9] } }, { g: 'add', p: { a: [10, 40], b: [1, 9] } }], '➕'),
        L('La soustraction', 'Enlever une quantité.', 'Soustraire, c’est enlever. On écrit avec le signe − : 9 − 4 = 5.', 'Il y a 9 oranges, on en mange 4 : il en reste 9 − 4 = 5.', [{ g: 'sous', p: { a: [5, 20], b: [1, 5] } }], '➖'),
      ]],
      ['Les formes', [
        L('Les formes géométriques', 'Reconnaître le carré, le rectangle, le triangle et le cercle.', 'Le carré a 4 côtés égaux. Le rectangle a 4 côtés, 2 longs et 2 courts. Le triangle a 3 côtés. Le cercle est rond.', 'La roue de la wewa est un cercle ; la porte de la maison est un rectangle.', [{ b: 'm1_formes' }], '🔺'),
      ]],
    ],
    st: [
      ['Mon corps', [
        L('Les parties du corps et les 5 sens', 'Nommer les sens et les organes qui les permettent.', 'Nous avons 5 sens : la vue (yeux), l’ouïe (oreilles), l’odorat (nez), le goût (langue) et le toucher (peau).', 'Au marché, on sent l’odeur du poisson fumé avec le nez.', [{ b: 's1_corps' }], '👀'),
        L('L’hygiène', 'Adopter les bons gestes de propreté.', 'Se laver les mains avec du savon, se brosser les dents, boire de l’eau propre : cela protège des maladies.', 'Avant de manger le fufu, Manoach se lave les mains avec du savon.', [{ b: 's1_hygiene' }], '🧼'),
      ]],
    ],
    hi: [
      ['Ma famille', [
        L('Les membres de la famille', 'Nommer les membres de sa famille.', 'Dans la famille, il y a les parents, les enfants, les grands-parents, les oncles, les tantes et les cousins.', 'Oncle Robert est le frère de papa ; ses enfants sont les cousins de Cécilia.', [{ b: 'h1_famille' }], '👨‍👩‍👧‍👦'),
      ]],
    ],
    ge: [
      ['L’école et le quartier', [
        L('Se repérer', 'Utiliser devant, derrière, sur, sous ; reconnaître son quartier.', 'Pour dire où se trouve une chose, on utilise des mots comme devant, derrière, sur, sous, à gauche, à droite.', 'Le cahier est sur la table ; le cartable est sous le banc.', [{ b: 'g1_reperes' }], '🏫'),
      ]],
    ],
    ec: [
      ['Vivre ensemble', [
        L('La politesse', 'Utiliser les mots de politesse.', 'Bonjour, merci, s’il vous plaît, pardon, au revoir : ces mots montrent le respect.', 'En entrant chez grand-mère, Cécilia dit « Mbote, nkoko ! » puis « Merci » pour le repas.', [{ b: 'c1_politesse' }], '🙏'),
        L('L’hygiène et la santé', 'Prendre soin de soi et des autres.', 'Être propre protège sa santé et celle de toute la famille.', 'On jette les épluchures à la poubelle et pas dans la rue.', [{ b: 's1_hygiene' }], '🧽'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Saluer et nommer', 'Connaître quelques mots courants en lingala.', 'Le lingala est l’une des 4 langues nationales de la RDC, avec le kikongo, le swahili et le tshiluba.', '« Mbote mama ! » : bonjour maman !', [{ b: 'ln_salut' }], '🗣️'),
        L('Compter en lingala', 'Compter de 1 à 10 en lingala.', 'moko (1), mibale (2), misato (3), minei (4), mitano (5), motoba (6), sambo (7), mwambe (8), libwa (9), zomi (10).', 'Au marché : « mangolo mibale » = deux mangues.', [{ b: 'ln_nombres' }], '🔢'),
      ]],
    ],
    ar: [
      ['Couleurs et musique', [
        L('Les couleurs', 'Reconnaître et mélanger les couleurs.', 'Les couleurs primaires sont le rouge, le jaune et le bleu. En les mélangeant, on obtient les autres.', 'Bleu + jaune = vert, comme les feuilles du manguier.', [{ b: 'a_couleurs' }], '🎨'),
      ]],
    ],
    ep: [
      ['Bouger et jouer', [
        L('Les règles du sport', 'Connaître les bons gestes avant, pendant et après le sport.', 'On s’échauffe avant, on boit de l’eau pendant, on s’étire après. On respecte les règles et les camarades.', 'Avant le match de football dans la cour, les élèves courent doucement pour s’échauffer.', [{ b: 'e_sport' }], '⚽'),
      ]],
    ],
    tp: [
      ['Le jardin et les métiers', [
        L('Outils et métiers', 'Reconnaître les outils et les métiers du village.', 'Chaque métier utilise ses outils : la houe pour le cultivateur, la scie pour le menuisier.', 'Oncle Robert, le menuisier, fabrique des tabourets en bois.', [{ b: 't_agri' }], '🌱'),
      ]],
    ],
    an: [
      ['First words', [
        L('Mes premiers mots d’anglais', 'Connaître des mots simples en anglais (module complémentaire).', 'En anglais, on dit « hello » pour bonjour, « one, two, three » pour un, deux, trois.', '« Good morning, teacher! » : bonjour, maître !', [{ g: 'anglais', n: 0 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['L’ordinateur', [
        L('Découvrir l’ordinateur', 'Nommer les parties d’un ordinateur (module complémentaire).', 'L’ordinateur a un écran, un clavier et une souris. Il obéit à des programmes.', 'Oncle Caleb, le programmeur, tape ses instructions sur le clavier.', [{ b: 'i_numerique' }], '💻'),
      ]],
    ],
  },

  // ============================== 2e PRIMAIRE ==============================
  2: {
    fr: [
      ['Lecture', [
        L('Lire un texte court', 'Comprendre un petit texte et répondre à une question.', 'On lit tout le texte, puis on cherche dans le texte la phrase qui répond à la question.', 'Le texte dit « Tarzan pêche sur le fleuve » : à la question « Où ? », on répond « sur le fleuve ».', [{ b: 'f2_lecture' }], '📖'),
      ]],
      ['Grammaire élémentaire', [
        L('Le nom et le verbe', 'Reconnaître le nom et le verbe dans une phrase.', 'Le nom désigne une personne, un animal ou une chose (maman, chat, table). Le verbe dit ce que l’on fait (manger, courir).', '« Le chien aboie » : chien est un nom, aboie est un verbe.', [{ g: 'nature', n: 0 }], '🔍'),
        L('Singulier et pluriel', 'Mettre un nom au pluriel.', 'Au pluriel, on ajoute souvent un -s : un chat → des chats.', 'Une mangue → des mangues.', [{ g: 'pluriel', n: 0 }], '➕'),
        L('Les types de phrases', 'Reconnaître une phrase qui raconte, qui pose une question, qui crie une émotion.', 'La phrase déclarative finit par un point ( . ), l’interrogative par ? et l’exclamative par !', '« Où vas-tu ? » est une question.', [{ g: 'phrases', n: 0 }], '❓'),
      ]],
      ['Conjugaison introductive', [
        L('Le présent', 'Conjuguer les verbes en -er au présent.', 'Au présent : je chante, tu chantes, il chante, nous chantons, vous chantez, ils chantent.', 'Cécilia danse ; nous dansons.', [{ g: 'conjPresent', n: 0 }], '⏰'),
      ]],
    ],
    ma: [
      ['Les nombres jusqu’à 1 000', [
        L('Centaines, dizaines, unités', 'Lire et écrire les nombres jusqu’à 1 000.', '10 dizaines font 1 centaine. 345 = 3 centaines, 4 dizaines et 5 unités.', 'Un sac contient 100 arachides : 3 sacs, 4 paquets de 10 et 5 arachides = 345.', [{ a: 'dizaines', p: { max: 999 } }], '💯'),
        L('Comparer jusqu’à 1 000', 'Comparer et ranger des nombres jusqu’à 1 000.', 'On compare d’abord les centaines, puis les dizaines, puis les unités.', '508 est plus grand que 499.', [{ a: 'comparer', p: { max: 1000 } }], '⚖️'),
      ]],
      ['Les opérations', [
        L('Additions et soustractions', 'Calculer des additions et soustractions jusqu’à 1 000.', 'On pose l’opération en alignant unités sous unités, dizaines sous dizaines. On n’oublie pas la retenue.', 'Maman a 350 FC et gagne 125 FC : 350 + 125 = 475 FC.', [{ g: 'add', p: { a: [20, 500], b: [10, 400] } }, { g: 'sous', p: { a: [100, 999], b: [10, 99] } }], '🧮'),
        L('La multiplication', 'Comprendre la multiplication comme une addition répétée.', '4 × 3, c’est 3 + 3 + 3 + 3 = 12. On apprend les tables de 2, 5 et 10.', '4 paquets de 3 bonbons : 4 × 3 = 12 bonbons.', [{ a: 'multintro' }, { g: 'tables', p: { ops: ['×'], tables: [2, 5, 10], kmin: 1, kmax: 10 } }], '✖️'),
        L('Le partage', 'Partager en parts égales.', 'Partager 12 mangues entre 3 enfants : chacun reçoit 4 mangues, car 3 × 4 = 12.', 'Grand-mère partage 10 beignets entre 2 enfants : 5 chacun.', [{ g: 'partage', p: { ops: ['÷'], tables: [2, 3, 4, 5], qmax: 6 } }], '🍰'),
      ]],
    ],
    st: [
      ['Les êtres vivants', [
        L('L’alimentation', 'Classer les aliments.', 'Il faut manger varié : fruits et légumes, céréales et manioc, poisson, œufs, haricots, lait.', 'Un bon repas : du riz, du poisson et des feuilles de manioc (pondu).', [{ g: 'alimentation', n: 0 }], '🍲'),
        L('Les animaux', 'Reconnaître les familles d’animaux.', 'Les mammifères allaitent leurs petits, les oiseaux ont des plumes, les poissons vivent dans l’eau.', 'Le héron du fleuve est un oiseau ; le singe est un mammifère.', [{ g: 'animaux', n: 0 }], 'animaux/singe'),
        L('Les plantes', 'Connaître les parties de la plante.', 'La plante a des racines, une tige, des feuilles, des fleurs et des fruits. Elle a besoin d’eau et de lumière.', 'Axel l’agronome arrose ses plants de maïs.', [{ g: 'plantes', n: 0 }], '🌱'),
      ]],
      ['Le milieu', [
        L('La météo', 'Observer le temps qu’il fait.', 'En RDC, il y a la saison sèche et la saison des pluies. Le thermomètre mesure la température.', 'Pendant la saison des pluies, il pleut presque chaque après-midi à Kinshasa.', [{ b: 's2_meteo' }], '🌦️'),
        L('Protéger l’environnement', 'Adopter des gestes qui protègent la nature.', 'On ne jette pas de déchets dans la nature, on plante des arbres, on économise l’eau.', 'Les élèves ramassent les sachets plastiques autour de l’école.', [{ b: 's2_environnement' }], '🌍'),
      ]],
    ],
    hi: [
      ['Le temps qui passe', [
        L('Passé, présent, futur', 'Situer des événements dans le temps.', 'Hier, c’est le passé ; aujourd’hui, le présent ; demain, le futur. Les grands-parents racontent le passé.', 'Grand-père raconte comment était le village quand il était petit.', [{ b: 'h1_famille' }], '⏳'),
      ]],
    ],
    ge: [
      ['Mon environnement', [
        L('L’école, le quartier, le fleuve', 'Décrire les lieux proches.', 'Le quartier a des rues, des maisons, un marché, une école. Le fleuve Congo passe à Kinshasa.', 'Pour aller au marché, Cécilia passe devant l’église puis tourne à droite.', [{ b: 'g1_reperes' }], '🏘️'),
      ]],
    ],
    ec: [
      ['Le civisme', [
        L('Les règles de vie', 'Respecter les règles de la classe et du quartier.', 'Les règles nous aident à bien vivre ensemble : écouter, partager, ranger, ne pas se battre.', 'Au lieu de se disputer pour le ballon, les enfants jouent chacun leur tour.', [{ b: 'c2_civisme' }], '🤝'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Mots de tous les jours', 'Enrichir son vocabulaire en lingala.', 'Le lingala est parlé à Kinshasa et dans tout le nord-ouest du pays, et dans la musique congolaise.', '« Ndako » = maison, « kelasi » = école, « mai » = eau.', [{ b: 'ln_salut' }, { b: 'ln_nombres' }], '🗣️'),
      ]],
    ],
    ar: [
      ['La musique', [
        L('Les instruments', 'Reconnaître les familles d’instruments.', 'Instruments à percussion (tam-tam), à cordes (guitare), à vent (flûte). Le likembe a des lamelles.', 'Manoach joue du tambour : boum, boum, boum !', [{ b: 'a_musique' }], '🥁'),
      ]],
    ],
    ep: [
      ['Jeux collectifs', [
        L('Jouer en équipe', 'Connaître les règles des jeux d’équipe.', 'Au football, chaque équipe a 11 joueurs. On respecte l’arbitre et l’adversaire : c’est le fair-play.', 'Après le match, les deux équipes se serrent la main.', [{ b: 'e_sport' }], '🏃'),
      ]],
    ],
    tp: [
      ['Le champ', [
        L('Cultiver et élever', 'Connaître les étapes du travail au champ et l’élevage.', 'On prépare le sol, on sème, on arrose, on désherbe, puis on récolte.', 'Axel plante le maïs au début de la saison des pluies.', [{ b: 't_agri' }], '🌽'),
      ]],
    ],
    an: [
      ['Words', [
        L('Couleurs et nombres', 'Dire les couleurs et les nombres en anglais (module complémentaire).', 'red = rouge, blue = bleu, green = vert ; one, two, three…', 'The mango is yellow : la mangue est jaune.', [{ g: 'anglais', n: 0 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['Le numérique', [
        L('Utiliser l’ordinateur', 'Connaître le clavier, la souris, l’écran (module complémentaire).', 'Le clavier sert à écrire, la souris à pointer, l’écran à voir.', 'Cécilia tape son prénom au clavier.', [{ b: 'i_numerique' }], '🖱️'),
      ]],
    ],
  },

  // ============================== 3e PRIMAIRE ==============================
  3: {
    fr: [
      ['Lecture et compréhension', [
        L('Comprendre un texte', 'Retrouver une information dans un texte.', 'On lit le texte en entier, on lit la question, puis on cherche la réponse dans le texte avant de choisir.', 'Le texte dit « chaque samedi » : Albertine va au marché le samedi.', [{ b: 'f3_lecture' }], '📖'),
      ]],
      ['Grammaire', [
        L('La nature des mots', 'Identifier nom, verbe, adjectif, déterminant, pronom.', 'Le déterminant accompagne le nom (le, une, mon). L’adjectif décrit le nom (grand, rouge). Le pronom remplace le nom (il, elle).', '« Le grand héron pêche » : le (déterminant), grand (adjectif), héron (nom), pêche (verbe).', [{ g: 'nature', n: 0 }], '🔍'),
        L('Le sujet et le verbe', 'Trouver le sujet du verbe.', 'Le sujet dit qui fait l’action. On le trouve en posant la question « Qui est-ce qui… ? ».', '« Les lucioles brillent » : qui est-ce qui brille ? Les lucioles (sujet).', [{ g: 'fonction', n: 0 }], '🎯'),
      ]],
      ['Conjugaison', [
        L('Présent et futur', 'Conjuguer au présent et au futur.', 'Futur : je chanterai, tu chanteras, il chantera, nous chanterons, vous chanterez, ils chanteront.', 'Demain, nous irons au fleuve.', [{ g: 'conjPresent', n: 0 }, { g: 'conjFutur', n: 0 }], '⏰'),
        L('L’imparfait', 'Conjuguer à l’imparfait.', 'Terminaisons : -ais, -ais, -ait, -ions, -iez, -aient.', 'Autrefois, grand-père pêchait sur le fleuve.', [{ g: 'conjImparfait', n: 0 }], '⏳'),
      ]],
      ['Orthographe', [
        L('Les homophones', 'Choisir entre a/à, est/et, son/sont.', '« a » peut se remplacer par « avait » ; « est » par « était » ; « son » par « mon ».', 'Le héron est (était) blanc et (et puis) timide.', [{ g: 'homophones', n: 0 }], '✍️'),
        L('Les accords', 'Accorder le nom et l’adjectif.', 'L’adjectif prend le genre et le nombre du nom : un fleuve immense, des fleuves immenses.', 'une robe orange, des pagnes colorés.', [{ g: 'accord', n: 0 }], '🔗'),
      ]],
    ],
    ma: [
      ['Les nombres jusqu’à 100 000', [
        L('Lire les grands nombres', 'Lire, écrire et décomposer les nombres jusqu’à 100 000.', 'On sépare les classes par 3 chiffres : 45 320 = 45 milliers et 320 unités.', 'Le stade compte 45 320 places.', [{ g: 'numeration', p: { max: 99999 } }, { a: 'comparer', p: { max: 100000 } }], '🔢'),
      ]],
      ['Les quatre opérations', [
        L('Addition et soustraction posées', 'Calculer des additions et des soustractions posées.', 'On aligne les chiffres par colonne et on commence par les unités. On pense aux retenues.', 'Albertine a vendu pour 12 500 FC le matin et 8 300 FC l’après-midi : 20 800 FC.', [{ g: 'add', n: 0, p: { a: [1200, 6500], b: [250, 3400] } }, { g: 'sous', p: { a: [1500, 9999], b: [150, 1400] } }], '🧮'),
        L('Les tables de multiplication', 'Connaître les tables de 2 à 9.', 'Connaître ses tables permet de calculer vite et juste. 7 × 8 = 56.', '8 rangées de 7 plants de maïs : 56 plants.', [{ g: 'tables', n: 0 }], '✖️'),
        L('La division simple', 'Diviser un nombre par un nombre à un chiffre.', 'Diviser, c’est partager en parts égales. 35 ÷ 5 = 7 car 5 × 7 = 35.', '35 cahiers partagés entre 5 élèves : 7 cahiers chacun.', [{ g: 'divtables', n: 0 }, { g: 'divreste', n: 0 }], '➗'),
      ]],
      ['Fractions et mesures', [
        L('Les fractions élémentaires', 'Comprendre la moitié, le tiers, le quart.', 'La moitié, c’est partager en 2 parts égales ; le tiers, en 3 ; le quart, en 4.', 'La moitié de 10 beignets = 5 beignets.', [{ g: 'fractions', n: 0 }, { a: 'fraction', p: { den: [2, 3, 4] } }], '🍕'),
        L('Les mesures', 'Convertir les longueurs, masses et contenances.', '1 m = 100 cm ; 1 kg = 1 000 g ; 1 L = 100 cL.', 'Un sac de 2 kg de riz pèse 2 000 g.', [{ g: 'mesures', n: 0 }, { g: 'durees', n: 0 }], '📏'),
        L('Problèmes du marché', 'Résoudre des problèmes d’achat et de vente.', 'On lit l’énoncé, on cherche la question, on choisit l’opération, on calcule et on vérifie.', 'Suzanne vend 3 tas de tomates à 500 FC : 1 500 FC.', [{ g: 'probleme', n: 0 }, { g: 'commerce', n: 0 }], '🛒'),
      ]],
    ],
    st: [
      ['Le corps humain', [
        L('Le corps et le mouvement', 'Connaître les os, les muscles et les articulations.', 'Les os forment le squelette. Les muscles tirent sur les os pour bouger. Les articulations permettent de plier.', 'Quand Manoach frappe le tambour, il plie le coude.', [{ g: 'corps', n: 0 }], '🦴'),
        L('La digestion (introduction)', 'Suivre le trajet des aliments.', 'Bouche → œsophage → estomac → intestin grêle → gros intestin. Les nutriments passent dans le sang.', 'Bien mâcher le fufu aide l’estomac.', [{ b: 's3_digestion' }], '🍽️'),
      ]],
      ['La matière et le vivant', [
        L('Vivant ou non vivant', 'Distinguer le vivant du non-vivant.', 'Un être vivant naît, se nourrit, grandit, se reproduit et meurt.', 'Le manguier est vivant ; la pierre ne l’est pas.', [{ g: 'vivant', n: 0 }, { g: 'matiere', n: 0 }], '🌿'),
      ]],
    ],
    hi: [
      ['Histoire de la communauté', [
        L('La vie de la communauté', 'Connaître les autorités et les lieux de la communauté.', 'Le chef coutumier, le chef de quartier, le bourgmestre organisent la vie commune. Les anciens transmettent l’histoire.', 'Le chef de quartier réunit les habitants pour nettoyer les caniveaux.', [{ b: 'h3_communaute' }], '🏘️'),
        L('Se repérer dans le temps', 'Lire les siècles et ranger les dates.', 'Un siècle dure 100 ans. On écrit les siècles en chiffres romains : XXe siècle = 20e siècle.', 'L’indépendance (1960) a eu lieu au XXe siècle.', [{ g: 'temps', n: 0 }], '📅'),
      ]],
    ],
    ge: [
      ['Géographie élémentaire', [
        L('Lire une carte', 'Utiliser les points cardinaux et la légende.', 'Le nord est en haut de la carte. La légende explique les symboles. Le soleil se lève à l’est.', 'Sur la carte, le lac Kivu est à l’est de la RDC.', [{ b: 'g3_reperes' }], '🧭'),
        L('Les paysages de la RDC', 'Connaître les grands paysages congolais.', 'La RDC a une grande forêt, des savanes, des montagnes à l’est et le fleuve Congo.', 'Le fleuve Congo traverse le pays et passe à Kisangani et à Kinshasa.', [{ g: 'geographie', n: 0 }], '🏞️'),
      ]],
    ],
    ec: [
      ['Droits et devoirs', [
        L('Les droits de l’enfant', 'Connaître ses droits et ses devoirs.', 'Chaque enfant a droit à un nom, à l’école, aux soins, à la protection. Il a aussi le devoir de respecter les autres.', 'L’acte de naissance prouve le nom et la nationalité.', [{ b: 'c3_droits' }], '🧒'),
        L('Le civisme', 'Agir en bon citoyen.', 'Le bon citoyen respecte les règles, le bien commun et les autres.', 'On ne casse pas le robinet public : il sert à tout le quartier.', [{ g: 'emc', n: 0 }], '🤝'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Vocabulaire du livre', 'Comprendre les mots lingala de l’histoire.', 'Le livre de Cécilia et Manoach contient des mots lingala : ebale (fleuve), monzoto (étoile)…', '« Monzoto ya ebale » : l’étoile du fleuve.', [{ g: 'lingala', n: 0 }, { b: 'ln_salut' }], '⭐'),
      ]],
    ],
    ar: [
      ['Arts', [
        L('Couleurs et instruments', 'Mélanger les couleurs, reconnaître des instruments.', 'Couleurs primaires et secondaires ; instruments à vent, à cordes, à percussion.', 'Le tissu kuba mélange l’ocre, le noir et le beige.', [{ b: 'a_couleurs' }, { b: 'a_musique' }], '🎨'),
      ]],
    ],
    ep: [
      ['Sports collectifs', [
        L('Règles et santé', 'Connaître les règles des sports collectifs.', 'Football : 11 joueurs ; basket-ball : 5 ; volley-ball : 6. L’échauffement évite les blessures.', 'Le match de basket commence par un entre-deux.', [{ b: 'e_sport' }], '🏀'),
      ]],
    ],
    tp: [
      ['Produire', [
        L('Les métiers de production', 'Associer métiers, outils et produits.', 'Le cultivateur produit des vivres, l’éleveur des œufs et du lait, l’artisan des objets.', 'Oncle Robert fabrique un tabouret : il mesure, scie, assemble.', [{ b: 't_agri' }, { g: 'menuiserie', n: 0 }], '🔨'),
      ]],
    ],
    an: [
      ['Vocabulary', [
        L('Animaux et famille', 'Nommer animaux et membres de la famille en anglais (module complémentaire).', 'dog = chien, cat = chat, mother = mère, father = père.', 'My mother sells tomatoes : ma mère vend des tomates.', [{ g: 'anglais', n: 1 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['Programmer', [
        L('Les instructions', 'Comprendre qu’un programme est une suite d’instructions (module complémentaire).', 'Un programme dit à la machine quoi faire, étape par étape, dans le bon ordre.', 'Oncle Caleb programme son robot : avance, avance, tourne à droite.', [{ b: 'i_numerique' }], '🤖'),
      ]],
    ],
  },

  // ============================== 4e PRIMAIRE ==============================
  4: {
    fr: [
      ['Analyse grammaticale', [
        L('Classes de mots', 'Identifier toutes les classes de mots, dont l’adverbe et la préposition.', 'L’adverbe modifie le verbe (vite, lentement). La préposition relie (à, de, dans, sur).', '« La tortue nage lentement dans le fleuve » : lentement (adverbe), dans (préposition).', [{ g: 'nature', n: 1 }], '🔍'),
        L('Les fonctions dans la phrase', 'Trouver sujet, verbe, complément.', 'Le complément d’objet répond à « quoi ? » ou « qui ? » après le verbe ; le complément circonstanciel à « où ? quand ? comment ? ».', '« Tarzan attrape un poisson le matin » : un poisson (COD), le matin (CC de temps).', [{ g: 'fonction', n: 1 }], '🎯'),
      ]],
      ['Conjugaison', [
        L('Le passé composé', 'Conjuguer au passé composé.', 'Passé composé = auxiliaire avoir ou être au présent + participe passé : j’ai mangé, elle est partie.', 'Hier, nous sommes allés au marché.', [{ g: 'conjPasseCompose', n: 1 }], '⏪'),
        L('Reconnaître les temps', 'Identifier le temps d’un verbe.', 'Présent, imparfait, futur, passé composé : chaque temps a ses terminaisons.', '« vous compterez » est au futur.', [{ g: 'conjTemps', n: 0 }], '🕰️'),
      ]],
      ['Rédaction', [
        L('Écrire des phrases correctes', 'Construire des phrases claires et les relier.', 'Une phrase : majuscule, sujet, verbe, complément, point. Les mots de liaison (mais, alors, donc) relient les idées.', '« Il pleuvait, alors nous sommes restés à la maison. »', [{ b: 'f4_redaction' }], '📝'),
      ]],
      ['Orthographe et vocabulaire', [
        L('Mots justes et homophones', 'Écrire correctement les mots fréquents.', 'On vérifie les mots invariables et les homophones (on/ont, ce/se, ou/où).', 'Où est le marché ? Au bout de la rue ou près du fleuve ?', [{ g: 'homophones', n: 1 }, { g: 'motsJustes', n: 1 }], '✍️'),
        L('Synonymes et contraires', 'Enrichir son vocabulaire.', 'Un synonyme a le même sens ; un contraire a le sens opposé.', 'rapide / lent ; content = joyeux.', [{ g: 'vocabulaire', n: 1 }], '📚'),
      ]],
    ],
    ma: [
      ['Les grands nombres', [
        L('Nombres jusqu’au million', 'Lire, écrire, comparer de grands nombres.', 'Classe des millions, des milliers, des unités : 1 250 000 = un million deux cent cinquante mille.', 'La ville compte 1 250 000 habitants.', [{ g: 'numeration', n: 1 }, { a: 'comparer', p: { max: 1000000 } }], '🔢'),
        L('Multiplier et diviser', 'Poser une multiplication et une division.', 'Multiplication posée : on multiplie chaque chiffre et on additionne. Division : quotient et reste.', '23 caisses de 12 bouteilles : 276 bouteilles.', [{ g: 'multpose', n: 1 }, { g: 'divreste', n: 1 }], '🧮'),
      ]],
      ['Fractions et décimaux', [
        L('Les fractions', 'Lire et utiliser des fractions simples.', 'Dans 3/4, le 4 (dénominateur) dit en combien de parts on coupe, le 3 (numérateur) combien on en prend.', 'Les 3/4 de 20 mangues = 15 mangues.', [{ g: 'fractions', n: 1 }, { a: 'fraction', p: { den: [2, 3, 4, 5, 8, 10] } }], '🍕'),
        L('Les nombres décimaux (introduction)', 'Lire et additionner des nombres décimaux simples.', 'La virgule sépare la partie entière de la partie décimale : 2,5 = 2 unités et 5 dixièmes.', 'Une planche de 2,5 m et une de 1,3 m : 3,8 m.', [{ a: 'decimaux', p: { d: 1 } }], '🔟'),
      ]],
      ['Géométrie et mesures', [
        L('Périmètres', 'Calculer le périmètre d’un carré et d’un rectangle.', 'Le périmètre est le tour de la figure. Rectangle : 2 × (longueur + largeur). Carré : 4 × côté.', 'Clôturer un jardin de 8 m sur 5 m : 2 × (8 + 5) = 26 m de grillage.', [{ g: 'perimetre', n: 0 }, { a: 'perimetre' }], '📐'),
        L('Surfaces', 'Calculer l’aire d’un rectangle et d’un carré.', 'L’aire est la surface à l’intérieur. Rectangle : longueur × largeur. Unité : m², cm².', 'Un champ de 20 m sur 10 m a une aire de 200 m².', [{ a: 'aire' }], '⬛'),
        L('Problèmes', 'Résoudre des problèmes à plusieurs étapes.', 'On cherche les étapes : d’abord ce qu’on peut calculer, puis la réponse à la question.', 'Tarzan vend 4 poissons à 1 500 FC : 6 000 FC.', [{ g: 'probleme', n: 1 }, { g: 'peche', n: 1 }], '🧩'),
      ]],
    ],
    st: [
      ['Le corps humain', [
        L('Respiration et circulation', 'Comprendre le rôle des poumons et du cœur.', 'Les poumons prennent l’oxygène de l’air ; le cœur pompe le sang qui le transporte dans tout le corps.', 'Après la course de wewa, le cœur de Manoach bat plus vite.', [{ b: 's4_corps' }], '❤️'),
      ]],
      ['Les écosystèmes', [
        L('Chaînes alimentaires', 'Comprendre qui mange qui dans un milieu.', 'Les plantes (producteurs) sont mangées par les herbivores, eux-mêmes mangés par les carnivores. Les décomposeurs recyclent.', 'Herbe → antilope → lion.', [{ b: 's4_ecosysteme' }], '🦁'),
        L('Matière et énergie', 'Connaître les états de l’eau et les sources d’énergie.', 'L’eau peut être solide (glace), liquide ou gazeuse (vapeur). Le soleil, l’eau et le vent sont des énergies.', 'Le barrage d’Inga utilise la force du fleuve.', [{ g: 'matiere', n: 1 }, { g: 'energie', n: 1 }], '⚡'),
      ]],
    ],
    hi: [
      ['L’Afrique et le Congo', [
        L('Histoire africaine', 'Connaître les grandes civilisations africaines.', 'L’Égypte ancienne, l’empire du Mali, le royaume Kongo, le royaume Kuba : l’Afrique a une histoire très riche.', 'Mbanza-Kongo était la capitale du royaume Kongo.', [{ b: 'h4_afrique_congo' }], '🏛️'),
        L('Histoire du Congo', 'Situer les grandes étapes de l’histoire du Congo.', 'Royaume Kongo, arrivée des Portugais (1482), État indépendant (1885), Congo belge (1908), indépendance (1960).', 'Le 30 juin, on fête l’indépendance.', [{ g: 'histoire', n: 0 }], '🇨🇩'),
      ]],
    ],
    ge: [
      ['La RDC', [
        L('Les provinces de la RDC', 'Connaître les provinces et leurs chefs-lieux.', 'Depuis 2015, la RDC compte 26 provinces, dont la ville-province de Kinshasa.', 'Goma est le chef-lieu du Nord-Kivu.', [{ b: 'g4_provinces' }], '🗺️'),
        L('Les ressources naturelles', 'Connaître les richesses du sol et de la forêt.', 'Cuivre et cobalt (Katanga), diamant (Kasaï), coltan (Kivu), pétrole (Moanda), forêt, eau.', 'Le cobalt du Katanga sert à fabriquer des batteries.', [{ b: 'g4_ressources' }], '💎'),
      ]],
    ],
    ec: [
      ['La nation', [
        L('Les symboles de la RDC', 'Connaître le drapeau, la devise, l’hymne.', 'Devise : Justice, Paix, Travail. Hymne : Debout Congolais. Drapeau bleu ciel, étoile jaune, bande rouge bordée de jaune.', 'Le lundi, les élèves chantent « Debout Congolais » au lever du drapeau.', [{ b: 'c4_symboles' }], '🇨🇩'),
        L('Vivre ensemble', 'Régler les conflits et respecter les autres.', 'On discute calmement, on écoute, on demande l’aide d’un adulte.', 'Deux élèves se disputent : le chef de classe les aide à se parler.', [{ g: 'emc', n: 1 }], '🤝'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Lingala du quotidien', 'Utiliser le lingala dans des situations simples.', 'Saluer, compter, nommer les objets de la maison et de l’école.', '« Matondo mingi » : merci beaucoup.', [{ g: 'lingala', n: 1 }, { b: 'ln_nombres' }], '🗣️'),
      ]],
    ],
    ar: [
      ['Musique congolaise', [
        L('Les instruments et la rumba', 'Connaître le patrimoine musical congolais.', 'La rumba congolaise est inscrite au patrimoine de l’UNESCO (2021). Le likembe et le tam-tam sont des instruments traditionnels.', 'Aux fêtes, l’orchestre joue la rumba.', [{ b: 'a_musique' }], '🎶'),
      ]],
    ],
    ep: [
      ['Santé et sport', [
        L('Bien faire du sport', 'Connaître échauffement, hydratation, fair-play.', 'Le sport fait du bien au cœur et aux muscles si on s’échauffe et si on boit de l’eau.', 'Le maître d’EPS fait courir la classe 5 minutes avant le match.', [{ b: 'e_sport' }], '🏐'),
      ]],
    ],
    tp: [
      ['Agriculture', [
        L('Le travail agricole', 'Organiser un petit champ.', 'Rangées, semis, arrosage, désherbage, récolte : chaque étape compte.', 'Axel plante 4 rangées de 7 plants de maïs : 28 plants.', [{ b: 't_agri' }, { g: 'agronomie', n: 1 }], '🌽'),
      ]],
    ],
    an: [
      ['Everyday English', [
        L('Phrases de tous les jours', 'Comprendre des mots et phrases courantes (module complémentaire).', 'I am = je suis ; I have = j’ai ; days of the week : Monday, Tuesday…', 'Today is Monday : aujourd’hui, c’est lundi.', [{ g: 'anglais', n: 1 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['Sécurité numérique', [
        L('Être prudent sur Internet', 'Protéger ses informations (module complémentaire).', 'On ne donne jamais son adresse, son mot de passe ni ses photos à un inconnu.', 'Un inconnu demande l’école de Cécilia : elle ne répond pas et prévient sa maman.', [{ b: 'i_numerique' }], '🔒'),
      ]],
    ],
  },

  // ============================== 5e PRIMAIRE ==============================
  5: {
    fr: [
      ['Grammaire approfondie', [
        L('Fonctions et compléments', 'Distinguer COD, COI et compléments circonstanciels.', 'COD : « quoi ? » sans préposition. COI : « à qui ? de quoi ? ». CC : où, quand, comment, pourquoi.', '« Albertine donne une mangue à son frère » : une mangue (COD), à son frère (COI).', [{ g: 'fonction', n: 2 }], '🎯'),
        L('Accords difficiles', 'Accorder adjectifs et participes.', 'Avec être, le participe passé s’accorde avec le sujet : elles sont parties.', 'Les pirogues sont arrivées.', [{ g: 'accord', n: 1 }, { g: 'pluriel', n: 2 }], '🔗'),
      ]],
      ['Conjugaison', [
        L('Le passé simple et l’imparfait', 'Utiliser les temps du récit.', 'Le passé simple raconte les actions courtes (il arriva) ; l’imparfait décrit le décor (il faisait nuit).', 'Il faisait nuit quand l’étoile tomba dans le fleuve.', [{ g: 'conjPasseSimple', n: 1 }, { g: 'conjImparfait', n: 1 }], '📜'),
      ]],
      ['Rédaction et résumé', [
        L('Rédiger un texte', 'Organiser un récit et soigner la ponctuation.', 'Un récit a un début, un déroulement et une fin. On évite les répétitions avec des pronoms.', 'Cécilia prend l’étoile. Elle la tient doucement.', [{ b: 'f4_redaction' }], '📝'),
        L('Résumer un texte', 'Dégager l’idée principale et résumer.', 'Résumer, c’est dire l’essentiel en peu de mots : on garde qui, quoi, pourquoi ; on enlève les détails.', '« Albertine fait un bénéfice pour payer ses études. »', [{ b: 'f5_resume' }], '🗜️'),
      ]],
      ['Vocabulaire', [
        L('Le dictionnaire', 'Ranger des mots par ordre alphabétique et trouver leur sens.', 'Dans le dictionnaire, les mots sont rangés par ordre alphabétique, lettre après lettre.', 'arbre vient avant baobab, qui vient avant ciel.', [{ g: 'dictionnaire', n: 2 }, { g: 'vocabulaire', n: 2 }], '📚'),
      ]],
    ],
    ma: [
      ['Décimaux et fractions', [
        L('Les nombres décimaux', 'Calculer avec les nombres décimaux.', 'On aligne les virgules pour additionner ou soustraire. 3,75 + 1,5 = 5,25.', 'Un tissu de 3,75 m et un de 1,5 m : 5,25 m.', [{ a: 'decimaux', p: { d: 2 } }, { g: 'decimaux', n: 1 }], '🔟'),
        L('Fractions', 'Calculer une fraction d’une quantité, comparer des fractions.', 'Les 2/5 de 30 : 30 ÷ 5 = 6, puis 6 × 2 = 12.', 'Les 2/5 des 30 élèves aiment le football : 12 élèves.', [{ g: 'fractions', n: 2 }, { a: 'fraction', p: { den: [3, 4, 5, 6, 8, 10] } }], '🍕'),
      ]],
      ['Proportionnalité', [
        L('Situations de proportionnalité', 'Reconnaître et utiliser la proportionnalité.', 'Deux grandeurs sont proportionnelles quand on passe de l’une à l’autre en multipliant toujours par le même nombre.', '1 cahier = 500 FC ; 4 cahiers = 2 000 FC.', [{ g: 'proportion', n: 1 }, { a: 'regle3' }], '⚖️'),
        L('Pourcentages (introduction)', 'Calculer un pourcentage simple.', '50 % = la moitié ; 25 % = le quart ; 10 % = le dixième.', 'Une réduction de 10 % sur 2 000 FC = 200 FC.', [{ a: 'pourcent', p: { pcts: [10, 25, 50] } }], '％'),
      ]],
      ['Mesures', [
        L('Conversions et durées', 'Convertir longueurs, masses, capacités, durées.', 'km, hm, dam, m, dm, cm, mm : on multiplie par 10 à chaque rang vers la droite.', '3 km = 3 000 m ; 2 h 30 min = 150 min.', [{ g: 'mesures', n: 1 }, { g: 'durees', n: 1 }], '📏'),
        L('Problèmes', 'Résoudre des problèmes de la vie courante.', 'Lire, chercher les données utiles, choisir les opérations, calculer, vérifier.', 'Achat, vente, bénéfice : bénéfice = prix de vente − prix d’achat.', [{ g: 'commerce', n: 1 }, { g: 'trajets', n: 1 }], '🛒'),
      ]],
    ],
    st: [
      ['Santé et nutrition', [
        L('La santé', 'Prévenir les maladies courantes.', 'Le paludisme vient du moustique, le choléra de l’eau sale. Moustiquaire, eau propre et vaccins protègent.', 'La famille dort sous une moustiquaire imprégnée.', [{ b: 's5_sante' }], '🩺'),
        L('La nutrition', 'Composer un repas équilibré.', 'Aliments énergétiques (manioc, riz), constructeurs (poisson, haricots), protecteurs (fruits, légumes).', 'Riz + poisson + pondu + une banane : repas équilibré.', [{ b: 's5_nutrition' }], '🥗'),
      ]],
      ['L’électricité', [
        L('Le circuit électrique', 'Comprendre le circuit, les conducteurs et les isolants.', 'Le courant circule dans un circuit fermé. Les métaux sont conducteurs ; le plastique est isolant.', 'Le fil de cuivre est entouré de plastique pour nous protéger.', [{ b: 's5_electricite' }, { g: 'conducteurs', n: 1 }], '💡'),
      ]],
    ],
    hi: [
      ['Colonisation et Afrique', [
        L('La colonisation', 'Connaître la période coloniale.', 'Conférence de Berlin (1884-1885), État indépendant du Congo (1885-1908), Congo belge (1908-1960).', 'Sous Léopold II, la récolte forcée du caoutchouc a causé de grandes souffrances.', [{ b: 'h5_colonisation' }], '📜'),
        L('L’histoire africaine', 'Connaître des figures et des dates de l’Afrique.', 'Soundiata Keïta, Mansa Moussa, les indépendances africaines, l’OUA (1963), Nelson Mandela.', 'Le Ghana devient indépendant en 1957.', [{ g: 'histoire', n: 1 }, { b: 'h4_afrique_congo' }], '🌍'),
      ]],
    ],
    ge: [
      ['L’Afrique', [
        L('Géographie de l’Afrique', 'Connaître fleuves, déserts, sommets et pays d’Afrique.', 'Le Nil est le plus long fleuve, le Sahara le plus grand désert, le Kilimandjaro le plus haut sommet.', 'L’Union africaine siège à Addis-Abeba.', [{ b: 'g5_afrique' }, { g: 'geographie', n: 1 }], '🌍'),
      ]],
    ],
    ec: [
      ['Les institutions', [
        L('Les institutions de la RDC', 'Connaître le rôle des institutions.', 'Le président de la République, le Parlement (Assemblée nationale et Sénat), le gouvernement, les cours et tribunaux.', 'Les députés votent les lois à l’Assemblée nationale.', [{ b: 'c6_institutions' }], '🏛️'),
        L('Droits et devoirs du citoyen', 'Agir en citoyen responsable.', 'Le citoyen a des droits (éducation, santé, vote à 18 ans) et des devoirs (respecter la loi, payer l’impôt, protéger le bien commun).', 'À 18 ans, on peut voter.', [{ b: 'c3_droits' }, { g: 'emc', n: 2 }], '🗳️'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Lingala : révision', 'Réviser le vocabulaire courant.', 'Salutations, nombres, objets, famille.', '« Ndeko » = frère ou sœur, ami.', [{ g: 'lingala', n: 2 }, { b: 'ln_salut' }], '🗣️'),
      ]],
    ],
    ar: [
      ['Arts', [
        L('Arts plastiques et musique', 'Réviser couleurs, instruments, patrimoine.', 'Couleurs primaires et secondaires, familles d’instruments, rumba congolaise.', 'Les tissus kuba et la rumba font partie du patrimoine congolais.', [{ b: 'a_couleurs' }, { b: 'a_musique' }], '🎭'),
      ]],
    ],
    ep: [
      ['Sports', [
        L('Sports collectifs et santé', 'Connaître règles et bienfaits du sport.', 'Chaque sport a ses règles et son nombre de joueurs. Le sport régulier renforce le cœur.', 'Handball : 7 joueurs ; volley-ball : 6.', [{ b: 'e_sport' }], '🤾'),
      ]],
    ],
    tp: [
      ['Produire et vendre', [
        L('Production et commerce', 'Calculer un coût et un bénéfice.', 'Bénéfice = prix de vente − prix d’achat (et des frais).', 'Le menuisier achète le bois 6 000 FC et vend le tabouret 10 000 FC : 4 000 FC de bénéfice.', [{ g: 'commerce', n: 1 }, { b: 't_agri' }], '💰'),
      ]],
    ],
    an: [
      ['English', [
        L('Vocabulaire et phrases', 'Comprendre des phrases simples (module complémentaire).', 'Questions : What is your name? How old are you? Where do you live?', 'I live in Kinshasa.', [{ g: 'anglais', n: 2 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['Culture numérique', [
        L('Le bon usage du numérique', 'Utiliser les écrans avec prudence (module complémentaire).', 'Mot de passe secret, pauses régulières, vérifier les informations, demander l’aide d’un adulte.', 'Après 30 minutes d’écran, Manoach va jouer dehors.', [{ b: 'i_numerique' }], '📱'),
      ]],
    ],
  },

  // ============================== 6e PRIMAIRE ==============================
  6: {
    fr: [
      ['Lecture approfondie', [
        L('Comprendre et déduire', 'Comprendre l’implicite d’un texte.', 'Certaines réponses ne sont pas écrites : on les déduit des indices du texte (inférence).', '« Le pêcheur rangea sa pirogue en regardant le ciel gris » : un orage arrive.', [{ b: 'f6_lecture' }], '🕵️'),
        L('Résumer', 'Résumer un texte en gardant l’essentiel.', 'Idée principale + idées importantes, sans détails ni répétitions.', 'Un bon titre résume le texte en quelques mots.', [{ b: 'f5_resume' }], '🗜️'),
      ]],
      ['Analyse grammaticale', [
        L('Nature et fonction', 'Analyser les mots d’une phrase.', 'La nature dit ce qu’est le mot (nom, verbe…) ; la fonction dit son rôle (sujet, COD…).', '« Les élèves révisent l’ENAFEP » : élèves (nom, sujet).', [{ g: 'nature', n: 2 }, { g: 'fonction', n: 2 }], '🔍'),
        L('Orthographe grammaticale', 'Maîtriser homophones et accords.', 'On remplace pour vérifier : a/avait, est/était, son/mon, ces/ses, leur/leurs.', 'Ces élèves aiment leurs maîtres.', [{ g: 'homophones', n: 2 }, { g: 'accord', n: 2 }], '✍️'),
      ]],
      ['Conjugaison', [
        L('Tous les temps', 'Conjuguer et reconnaître tous les temps étudiés.', 'Présent, imparfait, futur, passé composé, passé simple, conditionnel, impératif.', 'Si j’étais président, je construirais des écoles.', [{ g: 'conjTemps', n: 2 }, { g: 'conjMelange', n: 2, p: { temps: ['pres', 'imp', 'fut', 'pc', 'ps'] } }, { g: 'conjImperatif', n: 2 }], '🕰️'),
      ]],
      ['Rédaction', [
        L('Écrire un texte organisé', 'Organiser ses idées et bien ponctuer.', 'Introduction, développement, conclusion ; connecteurs logiques (d’abord, ensuite, enfin, car, donc).', 'D’abord je révise, ensuite je m’entraîne, enfin je me repose.', [{ b: 'f4_redaction' }], '📝'),
      ]],
    ],
    ma: [
      ['Fractions et proportionnalité', [
        L('Fractions', 'Calculer avec les fractions.', 'Fraction d’une quantité : on divise par le dénominateur et on multiplie par le numérateur.', 'Les 3/4 de 2 000 FC = 1 500 FC.', [{ g: 'fractions', n: 2 }, { a: 'fraction', p: { den: [4, 5, 6, 8, 10, 12] } }], '🍕'),
        L('La règle de trois', 'Résoudre un problème par la règle de trois.', 'On calcule d’abord la valeur pour 1 (on divise), puis pour la quantité demandée (on multiplie).', '3 cahiers coûtent 1 500 FC → 1 cahier 500 FC → 7 cahiers 3 500 FC.', [{ a: 'regle3' }, { g: 'proportion', n: 2 }], '⚖️'),
        L('Les pourcentages', 'Calculer et utiliser les pourcentages.', 'x % de N = N × x ÷ 100. Réduction : on enlève ; augmentation : on ajoute.', '20 % de 5 000 FC = 1 000 FC.', [{ a: 'pourcent', p: { pcts: [5, 10, 20, 25, 50, 75] } }], '％'),
      ]],
      ['Géométrie', [
        L('Angles, droites, triangles, cercle', 'Connaître les figures et leurs propriétés.', 'Angle droit 90°, somme des angles d’un triangle 180°, diamètre = 2 × rayon.', 'La roue de la wewa a un rayon de 30 cm : diamètre 60 cm.', [{ b: 'm6_geometrie' }], '📐'),
        L('Aires et périmètres', 'Calculer aires et périmètres.', 'Rectangle : aire L × l, périmètre 2 × (L + l). Carré : aire c × c, périmètre 4 × c.', 'Un terrain de 25 m sur 12 m : aire 300 m².', [{ a: 'aire', p: { grand: true } }, { g: 'perimetre', n: 2 }], '⬛'),
      ]],
      ['Problèmes complexes', [
        L('Problèmes à étapes', 'Résoudre des problèmes à plusieurs étapes.', 'On écrit chaque étape avec sa phrase réponse. On vérifie que le résultat est raisonnable.', 'Achat, vente, bénéfice, partage, durée : on combine les opérations.', [{ g: 'probleme', n: 2 }, { g: 'commerce', n: 2 }, { g: 'chantier', n: 2 }], '🧩'),
        L('Grands nombres et décimaux', 'Calculer avec grands nombres et décimaux.', 'On aligne les chiffres par rang (et les virgules) ; on vérifie par un ordre de grandeur.', '12,75 + 8,5 = 21,25.', [{ a: 'decimaux', p: { d: 2 } }, { g: 'add', n: 2, p: { a: [12000, 650000], b: [2500, 340000] } }], '🔢'),
      ]],
    ],
    st: [
      ['Anatomie et physiologie', [
        L('Les grandes fonctions du corps', 'Connaître squelette, circulation, respiration, excrétion.', 'Le cœur et les vaisseaux (circulation), les poumons (respiration), les reins (excrétion), les nerfs (relation).', 'Les artères partent du cœur ; les veines y reviennent.', [{ b: 's6_corps' }, { b: 's4_corps' }], '🫀'),
        L('Santé et environnement', 'Réviser santé, nutrition, électricité, écosystèmes.', 'Prévenir les maladies, bien se nourrir, utiliser l’électricité sans danger, protéger les écosystèmes.', 'Moustiquaire, eau potable, repas équilibré.', [{ b: 's5_sante' }, { b: 's5_nutrition' }, { b: 's4_ecosysteme' }], '🔬'),
      ]],
    ],
    hi: [
      ['Histoire de la RDC', [
        L('L’indépendance', 'Connaître l’indépendance et ses acteurs.', 'Table ronde de Bruxelles (1960), indépendance le 30 juin 1960, Joseph Kasa-Vubu président, Patrice Lumumba Premier ministre.', 'Le 30 juin est la fête nationale.', [{ b: 'h6_rdc' }], '🇨🇩'),
        L('La RDC après 1960', 'Situer les grandes périodes depuis l’indépendance.', 'Mobutu (1965-1997), le Zaïre (1971-1997), la RDC (1997), la Constitution de 2006.', 'Léopoldville devient Kinshasa en 1966.', [{ g: 'histoire', n: 2 }, { b: 'h6_rdc' }], '📜'),
      ]],
    ],
    ge: [
      ['Géographie de la RDC', [
        L('La RDC : relief, fleuves, voisins', 'Connaître la géographie physique de la RDC.', '2e plus grand pays d’Afrique, 9 voisins, traversée par l’équateur, fleuve Congo, lacs de l’Est.', 'Le lac Tanganyika est le 2e lac le plus profond du monde.', [{ b: 'g6_rdc' }], '🗺️'),
        L('Provinces et ressources', 'Réviser provinces, chefs-lieux et ressources.', '26 provinces ; cuivre, cobalt, diamant, coltan, pétrole, forêt, hydroélectricité.', 'Lubumbashi, chef-lieu du Haut-Katanga, ville du cuivre.', [{ b: 'g4_provinces' }, { b: 'g4_ressources' }], '💎'),
      ]],
    ],
    ec: [
      ['Institutions nationales', [
        L('L’État et ses institutions', 'Connaître l’organisation de l’État.', 'Pouvoir exécutif (président, gouvernement), législatif (Parlement), judiciaire (cours et tribunaux). Constitution du 18 février 2006.', 'Le président est élu pour 5 ans.', [{ b: 'c6_institutions' }], '🏛️'),
        L('Symboles, droits et devoirs', 'Réviser symboles nationaux, droits et devoirs.', 'Devise Justice, Paix, Travail ; hymne Debout Congolais ; droits de l’enfant (CIDE 1989).', 'Chaque citoyen respecte la loi et le bien commun.', [{ b: 'c4_symboles' }, { b: 'c3_droits' }], '⚖️'),
      ]],
    ],
    ln: [
      ['Le lingala', [
        L('Lingala : consolidation', 'Utiliser le vocabulaire lingala étudié.', 'Révision des mots et nombres.', '« Mbote ndeko, ozali malamu ? » : bonjour ami, tu vas bien ?', [{ g: 'lingala', n: 2 }, { b: 'ln_nombres' }], '🗣️'),
      ]],
    ],
    ar: [
      ['Patrimoine artistique', [
        L('Arts et patrimoine', 'Connaître le patrimoine artistique congolais.', 'Rumba congolaise (UNESCO 2021), tissus kuba, instruments traditionnels.', 'Le likembe se joue avec les pouces.', [{ b: 'a_musique' }, { b: 'a_couleurs' }], '🎭'),
      ]],
    ],
    ep: [
      ['Sport et santé', [
        L('Préparer son corps', 'Connaître échauffement, récupération, règles.', 'Échauffement, hydratation, récupération ; règles des sports collectifs.', 'Avant l’ENAFEP, une bonne nuit et un petit-déjeuner aident aussi.', [{ b: 'e_sport' }], '🏃'),
      ]],
    ],
    tp: [
      ['Entreprendre', [
        L('Petit projet productif', 'Planifier une production et calculer un bénéfice.', 'Coûts, prix de vente, bénéfice ; organisation du travail en étapes.', 'Un jardin scolaire vend ses légumes au marché.', [{ g: 'commerce', n: 2 }, { b: 't_agri' }], '💼'),
      ]],
    ],
    an: [
      ['English', [
        L('Anglais : révision', 'Réviser le vocabulaire étudié (module complémentaire).', 'Nombres, couleurs, famille, corps, jours, nourriture.', 'Thank you very much! : merci beaucoup !', [{ g: 'anglais', n: 2 }], '🇬🇧'),
      ]],
    ],
    in: [
      ['Culture numérique', [
        L('Informatique et société', 'Comprendre le rôle du numérique (module complémentaire).', 'Programmes, données, sécurité, usage responsable des écrans.', 'Un programme est une suite d’instructions.', [{ b: 'i_numerique' }], '💻'),
      ]],
    ],
  },
};
