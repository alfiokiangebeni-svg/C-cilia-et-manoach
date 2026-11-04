# Journal des versions

## [Non publié]
### Sécurité
- `build.sh` lit désormais le mot de passe du keystore depuis `NUMZOO_KS_PASS` au lieu de l'avoir en clair.
- Le keystore est exclu du dépôt (`.gitignore`).

### Outillage
- Tests rendus portables (chemins relatifs), renommés en français, lancés par `npm test`.
- Intégration continue GitHub Actions : les 63 niveaux et les écrans testés à chaque push.
- Documentation technique complète dans `docs/`.

## [1.0.0] — 31 octobre 2026
### Ajouté
- 7 jeux : course des nuages, pêche magique, le goûter, Glouton a faim, relie les étoiles, le grand tri, coloriage magique.
- 3 tranches d'âge (4-6, 7-9, 10-12 ans) × 3 niveaux par jeu.
- 6 avatars personnalisables, profils multiples, prénoms.
- Zoo de 21 animaux à débloquer, coloriage libre.
- 7 langues : français, anglais, allemand, portugais, espagnol, chinois, lingala.
- Espace parents protégé par une porte parentale.
- APK Android signé (`com.numzoo.app`, versionCode 1).
