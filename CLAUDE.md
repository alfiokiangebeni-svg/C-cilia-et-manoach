# Consignes pour Claude Code

Application éducative pour enfants (4-12 ans), Android hors-ligne. V1 = « NumZoo » (jeux de calcul). Objectif V2 : tout reconstruire autour du livre d'Alfio Kiangebeni *Cécilia, Manoach et la petite étoile du fleuve* (10 chapitres, 30 stages, 70 parties).

- **Le cahier des charges V2 est `docs/INSTRUCTION-V2.md`** : le suivre phase par phase.
- `docs/HISTOIRE.md` : histoire, personnages, style. Ne pas changer les noms, apparences ou répliques des personnages du livre.
- Francesca, Rokaya et Mathias ne sont pas dans le livre : ne pas inventer leur apparence, utiliser des silhouettes tant que l'auteur ne les a pas décrits.

## Code
- Tout le jeu est dans `app/www/` : HTML/CSS/JS **sans framework ni dépendance**. Garder ce principe (APK < 1 Mo, hors-ligne).
- Ordre de chargement : `i18n.js → histoire.js → art.js → fx.js → engine.js → assets.js → scenes.js → games.js → app.js` (variables globales).
- `histoire.js` = la structure en **données** (chapitres → stages → parties, mécaniques, personnages, pages du livre). Aucune logique.
- Une partie lance `GAME_FN.<meca>` s'il existe, sinon le jeu V1 indiqué par `MECANIQUES.<meca>.base`. L'API `G` reçoit en plus `G.cfg` (paramètres de la mécanique pour l'âge) et `G.partie`.
- Textes de l'histoire : `{ fr, en }` lus avec `tx()` ; textes d'interface avec `t()`. Repli : langue → anglais → français.
- Nouvelle mécanique = un module `js/mecaniques/<id>.js` qui définit `GAME_FN.<id> = G => {…}` (même API `G`), chargé avant `app.js`, + son robot dans `test/toutes-les-parties.js`. Textes en français et anglais.
- Dessins de jeu : SVG généré en JS dans `art.js`. Personnages et scènes de l'histoire : images WebP de `www/img/` (listées dans `img/assets.json`), avec repli automatique sur une silhouette (`assets.js`).
- Sauvegarde : clé `localStorage` `cm.v2` (lucioles par partie `'1.1.1'`, pages du livre). Les profils `numzoo.v1` sont migrés au premier lancement. Tout changement de format doit migrer les profils existants.
- Interface en français ; commentaires de code en français.

## Vérifier
- `cd app && npm test` : `STRUCTURE OK`, puis 210 lignes `OK` (70 parties × 3 âges), `Manches réussies : 210 / 210` et `ERR []`.
- Pour une modification visuelle : `node test/parcours-ecrans.js 0` puis regarder `app/test/out/` ; `npm run captures` pour `docs/captures/v2/`.
- Ajouter le robot de résolution de la nouvelle mécanique dans `test/toutes-les-parties.js`.

## Ne jamais
- Committer un `*.keystore` ou un mot de passe.
- Ajouter de permission Android, de traceur, de publicité ou d'appel réseau.
- Ajouter de violence : les « combats » se gagnent par le savoir.
