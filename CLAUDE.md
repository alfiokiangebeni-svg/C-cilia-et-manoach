# Consignes pour Claude Code

Application éducative pour enfants (4-12 ans), Android hors-ligne. V1 = « NumZoo » (jeux de calcul). Objectif V2 : tout reconstruire autour de l'histoire de **Cécilia et Manoach** (acteurs principaux) et de leurs amis **Francesca, Rokaya et Mathias**. Voir `docs/HISTOIRE.md` avant toute modification liée aux personnages : ne pas inventer de traits ou d'événements qui ne sont pas dans l'histoire fournie par l'auteur.

## Code
- Tout le jeu est dans `app/www/` : HTML/CSS/JS **sans framework ni dépendance**. Garder ce principe (APK < 1 Mo, hors-ligne).
- Ordre de chargement : `i18n.js → art.js → fx.js → engine.js → games.js → app.js` (variables globales).
- Nouveau jeu = une fonction `GAME_FN.<id> = G => {…}` + une entrée dans `GAMES` + ses textes `g_<id>`/`d_<id>` dans les **7 langues** de `i18n.js`.
- Dessins : SVG généré en JS dans `art.js`, jamais d'image bitmap.
- Sauvegarde : clé `localStorage` `numzoo.v1`. Tout changement de format doit migrer les profils existants.
- Interface en français ; commentaires de code en français.

## Vérifier
- `cd app && npm test` doit afficher 63 lignes `OK` et `ERR []`.
- Pour une modification visuelle : `node test/parcours-ecrans.js 0` puis regarder `app/test/out/`.
- Ajouter le robot de résolution du nouveau jeu dans `test/tous-les-niveaux.js`.

## Ne jamais
- Committer un `*.keystore` ou un mot de passe.
- Ajouter de permission Android, de traceur, de publicité ou d'appel réseau.
- Ajouter de violence : les « combats » se gagnent par le savoir.
