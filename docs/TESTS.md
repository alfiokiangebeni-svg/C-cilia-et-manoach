# Tests et preuves de fonctionnement

Les tests pilotent le vrai jeu dans Chromium (Playwright), en écran paysage de téléphone (800 × 380), avec le tactile activé.

## Les scripts — `app/test/`

| Script | Ce qu'il vérifie |
|---|---|
| `tous-les-niveaux.js` | Un « robot » résout **les 63 niveaux** (3 âges × 7 jeux × 3 niveaux), vérifie la célébration, les étoiles et le remplissage complet du zoo. Échoue au moindre niveau bloqué ou erreur JS. |
| `parcours-ecrans.js [âge]` | Parcours complet : accueil → langue → profil → personnage → âge → carte → chaque jeu. Capture chaque écran. |
| `langues-zoo-parents.js` | Carte en chinois, zoo en lingala, coloriage libre en allemand, porte et espace parents en portugais, célébration en espagnol. |
| `coloriage.js` | Le coloriage magique pour chaque combinaison âge/niveau (les calculs tiennent-ils dans les zones ?). |
| `icone.js` | Génère l'icône 512 px à partir du dessin de Glouton. |

```bash
cd app
npm install
npx playwright install chromium
npm test               # les 63 niveaux (~10 min)
npm run test:ecrans    # captures dans app/test/out/
```

Les mêmes tests tournent automatiquement sur GitHub à chaque push (`.github/workflows/tests.yml`) ; les captures sont jointes à chaque exécution.

## Résultats de référence

Exécution du **4 novembre 2026** sur le code de la V1.0 : [app/test/resultats-v1/tous-les-niveaux-2026-11-04.txt](../app/test/resultats-v1/tous-les-niveaux-2026-11-04.txt)

| Mesure | Résultat |
|---|---|
| Niveaux réussis | **63 / 63** |
| Erreurs JavaScript | **0** |
| Zoo complété | 21 / 21 animaux |
| Parcours d'écrans | 0 erreur |
| Langues / parents | 0 erreur |

Les fichiers `out_*.txt` du même dossier sont les résultats obtenus lors du développement initial.

## Intégrité de l'APK publié

Le contenu de `releases/NumZoo-V1.0.apk` a été décompressé et comparé fichier par fichier avec `app/www/` : les 8 fichiers (HTML, CSS, 6 scripts) sont **identiques octet pour octet**. L'APK correspond donc exactement au code source de ce dépôt.

| | |
|---|---|
| SHA-256 | `5864e3f0b626ecfbd770464ce8b02c8b808b163c9e9191390fee319a57e4d531` |
| Signature | Certificat `CN=NumZoo, O=NumZoo, C=CD` (fichiers `META-INF/NUMZOO.*`) |

## Galerie

| | | |
|---|---|---|
| ![](captures/g_race.png) Course des nuages | ![](captures/g_fish.png) Pêche magique | ![](captures/g_feed.png) Le goûter |
| ![](captures/g_monster.png) Glouton a faim | ![](captures/g_link.png) Relie les étoiles | ![](captures/g_sort.png) Le grand tri |
| ![](captures/g_color.png) Coloriage magique | ![](captures/z_2zoo_ln.png) Zoo (lingala) | ![](captures/z_5panel.png) Espace parents |
| ![](captures/z_6cel_es.png) Célébration | ![](captures/07_levels.png) Niveaux | ![](captures/01_home.png) Accueil |
