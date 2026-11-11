# Consignes pour Claude Code

**Académie scolaire – École primaire RDC** (V2.5) : 1re → 6e primaire, leçons, quiz /20, bulletin, examens, préparation ENAFEP ; plus l'histoire du livre, le village et les jeux (niveaux CE2 / CM1 / génie). Android hors-ligne. V1 = « NumZoo » (jeux de calcul). Objectif V2 : tout reconstruire autour du livre d'Alfio Kiangebeni *Cécilia, Manoach et la petite étoile du fleuve* (10 chapitres, 30 stages, 70 parties).

- **Le cahier des charges V2 est `docs/INSTRUCTION-V2.md`** : le suivre phase par phase.
- **L'académie** (`docs/ACADEMIE.md`) : `js/academie/` = `structure.js` (classes, matières, barème, badges), `banques.js` (questions écrites `[énoncé, réponse, [mauvaises], explication, image?]`), `lecons.js` (classe → matière → chapitres → leçons, sources `{b}`, `{g, n}`, `{a}`), `moteur.js` (`Acad`, `tirerQuestions`, `GEN_ACAD`), `ecrans.js` (écrans `academie`, `acad-*`, chargé après `app.js`). Quiz = 5 questions × 4 points, validation 14/20, une seule bonne réponse, une explication par question. Progression dans `profil.academie`. Modules complémentaires (anglais, informatique) toujours signalés. ENAFEP : examens blancs, jamais présentés comme officiels.
- `docs/HISTOIRE.md` : histoire, personnages, style. Ne pas changer les noms, apparences ou répliques des personnages du livre.
- Francesca, Rokaya et Mathias ne sont pas dans le livre : ne pas inventer leur apparence, utiliser des silhouettes tant que l'auteur ne les a pas décrits.

## Code
- Tout le jeu est dans `app/www/` : HTML/CSS/JS **sans framework ni dépendance**. Garder ce principe (APK < 1 Mo, hors-ligne).
- Ordre de chargement : `i18n.js → programme.js → histoire.js → contenus.js → carte-afrique.js → art.js → fx.js → engine.js → matieres.js → academie/structure.js → academie/banques.js → academie/lecons.js → academie/moteur.js → assets.js → scenes.js → games.js → mecaniques/village.js → app.js → academie/ecrans.js` (variables globales).
- **Matières** (écran « Matières », `SUJETS` dans `programme.js`) : maths, grammaire, conjugaison, orthographe, vocabulaire, sciences, histoire-géographie, EMC, anglais. Contenus en données dans `contenus.js` (niveau 0/1/2 par élément), générateurs dans `matieres.js`. Réponses en mots : la question porte `choix` (mauvaises réponses) et `cat` (grand tri) ; les jeux comparent avec `same()` et proposent avec `choixDe()`. `Play.matiere(id)` ; étoiles dans `profil.matieres`.
- L'histoire et les jeux sont débloqués (`TOUT_OUVERT = true` dans `app.js`), à la demande de l'auteur. L'académie respecte l'ordre (leçon validée à 14/20, classe suivante après l'examen ≥ 10/20 ou le positionnement) ; un parent peut choisir l'« ordre libre ».
- **Le village** (`VILLAGE` dans `programme.js`) : Suzanne et Albertine (marché, bénéfice), Tarzan le pêcheur, oncle Robert le menuisier, oncle Caleb le programmeur (robot), Axel l'agronome, cuisine, chasseur d'images (photos d'oiseaux, jamais de tir), Max le chien, jeu de dames, course de wewa, construire la route, carte de l'Afrique, jeux de mémoire (multiplications, additions, verbes). Jeux dans `js/mecaniques/village.js` ; `G.theme` habille la course (wewa) et la pêche (Tarzan). `Play.village(id)` ; étoiles dans `profil.village`. Images dans `img/village/`.
- Histoire, géographie et EMC : **RDC et Afrique** seulement (demande de l'auteur). Carte de l'Afrique : `carte-afrique.js` (tracés @svg-maps/world, CC BY 4.0, à créditer).
- **Programme scolaire français** : `programme.js` (données : NIVEAUX CE2 / CM1 / génie, NOTIONS avec paramètres par niveau et référence au programme) ; générateurs `GEN.<notion>` dans `engine.js`. Chaque partie de `histoire.js` a une `notion`. Voir `docs/PROGRAMME.md`.
- Le champ de profil `age` garde l'indice du niveau des jeux : 0 = CE2, 1 = CM1, 2 = génie (déduit de la classe : 1-3 → 0, 4 → 1, 5-6 → 2). La classe de l'académie est `profil.academie.classe`.
- Les jeux lisent leurs questions dans `G.sk` (jamais directement dans `SKILLS`), et `G.glouton` / `G.tri` pour Glouton et le Grand tri. Nombres affichés avec `fmt()` (espaces fines, virgule décimale) ; comparer avec `egal()`.
- Entraînement des tables 1 → 13 : `Play.table(op, n)` ; étoiles dans `profil.tables`.
- `histoire.js` = la structure en **données** (chapitres → stages → parties, mécaniques, personnages, pages du livre). Aucune logique.
- Une partie lance `GAME_FN.<meca>` s'il existe, sinon le jeu V1 indiqué par `MECANIQUES.<meca>.base`. L'API `G` reçoit en plus `G.cfg` (paramètres de la mécanique pour l'âge) et `G.partie`.
- Textes de l'histoire : `{ fr, en }` lus avec `tx()` ; textes d'interface avec `t()`. Repli : langue → anglais → français.
- Nouvelle mécanique = un module `js/mecaniques/<id>.js` qui définit `GAME_FN.<id> = G => {…}` (même API `G`), chargé avant `app.js`, + son robot dans `test/toutes-les-parties.js`. Textes en français et anglais.
- Images **3D toon** (générées avec ElevenLabs, voir `docs/PROMPTS-IMAGES.md`) : `img/persos/` (histoire), `img/avatars/` (joueurs), `img/jeux/` (avion, pirogue, poissons, paniers, Glouton…), `img/fruits/`, `img/animaux/`, `img/decors/`. Seul le coloriage reste en SVG (`art.js`). Pas d'images réalistes.
- Sauvegarde : clé `localStorage` `cm.v2` (lucioles par partie `'1.1.1'`, pages du livre). Les profils `numzoo.v1` sont migrés au premier lancement. Tout changement de format doit migrer les profils existants.
- Interface en français ; commentaires de code en français.

## Vérifier
- `cd app && npm test` : `STRUCTURE OK`, puis 210 manches de l'histoire, les manches de matières (notions hors maths × 3 niveaux), 45 manches du village (15 jeux × 3 niveaux) et 28 tables, toutes `OK`, `Manches réussies : 403 / 403` et `ERR []` ; puis le robot de l'académie : toutes les lignes `OK`, `leçons réussies par l’interface : 160 / 160`, `Académie : OK`.
- Nouvelle leçon ou banque : relancer `node test/academie.js` (contrôle : une seule bonne réponse, explication, images présentes, banque d'au moins 8 questions).
- Pour une modification visuelle : `node test/parcours-ecrans.js 0` puis regarder `app/test/out/` ; `npm run captures` pour `docs/captures/v2/`.
- Ajouter le robot de résolution de la nouvelle mécanique dans `test/toutes-les-parties.js`.

## Ne jamais
- Committer un `*.keystore` ou un mot de passe.
- Ajouter de permission Android, de traceur, de publicité ou d'appel réseau.
- Ajouter de violence : les « combats » se gagnent par le savoir.
