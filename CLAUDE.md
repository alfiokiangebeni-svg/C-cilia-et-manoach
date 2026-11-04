# Consignes pour Claude Code

Application éducative pour enfants (4-12 ans), Android hors-ligne. V1 = « NumZoo » (jeux de calcul). Objectif V2 : tout reconstruire autour du livre d'Alfio Kiangebeni *Cécilia, Manoach et la petite étoile du fleuve* (10 chapitres, 30 stages, 70 parties).

- **Le cahier des charges V2 est `docs/INSTRUCTION-V2.md`** : le suivre phase par phase.
- `docs/HISTOIRE.md` : histoire, personnages, style. Ne pas changer les noms, apparences ou répliques des personnages du livre.
- Francesca, Rokaya et Mathias ne sont pas dans le livre : ne pas inventer leur apparence, utiliser des silhouettes tant que l'auteur ne les a pas décrits.

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
