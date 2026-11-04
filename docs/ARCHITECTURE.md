# Architecture technique — NumZoo V1

## Vue d'ensemble

```
┌──────────────────────────── APK Android (174 Ko) ────────────────────────────┐
│  MainActivity.java  ──  WebView plein écran, paysage, écran toujours allumé  │
│        │  file:///android_asset/index.html                                    │
│        ▼                                                                      │
│  index.html  ── 10 écrans <section class="screen"> + célébration + modale     │
│        │                                                                      │
│  i18n.js ─► art.js ─► fx.js ─► engine.js ─► games.js ─► app.js               │
│  textes     dessins   sons &    pédagogie    7 jeux      navigation,          │
│  7 langues  SVG       effets    sauvegarde               profils, parents     │
│                                      │                                        │
│                                localStorage (clé « numzoo.v1 »)               │
└───────────────────────────────────────────────────────────────────────────────┘
```

Aucune bibliothèque externe, aucune image bitmap dans le jeu (hors icônes de lancement) : tous les personnages, animaux et décors sont dessinés en **SVG généré par code**. C'est ce qui permet un APK de moins de 200 Ko.

## Couche Android — `app/android/`

| Fichier | Rôle |
|---|---|
| `src/com/numzoo/app/MainActivity.java` | Crée la WebView, active JavaScript et `localStorage`, masque les barres système (mode immersif), garde l'écran allumé |
| `AndroidManifest.xml` | Paquet `com.numzoo.app`, minSdk 21, targetSdk 29, `sensorLandscape`, **aucune permission** |
| `res/mipmap-*/ic_launcher.png` | Icône de lancement (5 densités) |
| `build.sh` | Chaîne de construction sans Gradle (voir [BUILD.md](BUILD.md)) |

Ponts Java ↔ JavaScript :
- **Bouton retour** : Java appelle `window.appBack()` ; le JS revient à l'écran précédent ou renvoie `'exit'` pour fermer l'application.
- **Mise en pause** : `onPause` appelle `window.appPause()`, qui suspend l'`AudioContext`.

## Couche jeu — `app/www/js/`

| Fichier | Lignes | Contenu |
|---|---|---|
| `i18n.js` | 140 | `LANGS`, table `STR` (7 langues), fonction `t(clé)` avec repli sur le français |
| `art.js` | 236 | `AVATARS` (6 personnages paramétrables : peau, coiffure, couleurs, accessoire), `avatarSVG`, Glouton, avion, bateau, `COLOR_PAGES` (dessins à colorier), `ZOO_ANIMALS` (21) |
| `fx.js` | 119 | `Sound` (sons synthétisés en Web Audio, aucun fichier audio), confettis, textes flottants, guirlandes, feux d'artifice sur `<canvas>` |
| `engine.js` | 117 | Tables pédagogiques (`AGES`, `SKILLS`, `SHARE_SKILLS`, `MONSTER_MODES`, `SORT_RULES`, `COLOR_SKILLS`), générateur de calculs `genQ`/`genSet`, distracteurs plausibles, sauvegarde `Store` |
| `games.js` | 374 | Les 7 jeux dans `GAME_FN`. Chaque jeu reçoit une API commune `G` |
| `app.js` | 280 | Navigation `show(id)`, rendus des écrans (`RENDER`), contrôleur de partie `Play`, célébrations, zoo, coloriage libre, porte et espace parents |

### L'API `G` commune aux jeux

Chaque jeu est une fonction `GAME_FN[id](G)`. Elle ne connaît rien d'autre que :

| Membre | Rôle |
|---|---|
| `G.area`, `G.age`, `G.lvl`, `G.av` | Zone de jeu, tranche d'âge (0-2), niveau (0-2), avatar du joueur |
| `G.setQuestion(txt)`, `G.progress(f)` | Afficher la question, remplir la barre de progression |
| `G.correct(x,y)`, `G.wrong(x,y)` | Retour visuel et sonore ; `wrong` renvoie le nombre d'erreurs sur la question |
| `G.newQ()`, `G.done(extra)` | Passer à la question suivante, terminer le niveau |
| `G.later(fn,ms)`, `G.raf(fn)`, `G.alive()` | Minuteries et animations annulées automatiquement si l'enfant quitte le jeu |

C'est ce contrat qui permettra d'ajouter de nouveaux jeux (chapitres de l'histoire de Cécilia et Manoach) sans toucher au reste.

### Sauvegarde

```js
localStorage['numzoo.v1'] = {
  lang: 'fr', sound: true, current: '<id profil>',
  profiles: [{ id, name, avatar, shirt, age, stars: { 'age.jeu.niveau': 1..3 }, zoo: ['🦁', …], pages: { lion: true } }]
}
```

- Une étoile au moins sur un niveau jamais réussi débloque l'animal suivant du zoo.
- Le niveau N+1 se déverrouille quand le niveau N a au moins une étoile.

### Espace parents

Protégé par une **porte parentale** (une multiplication à résoudre). Permet de changer la langue, le son, l'âge, d'effacer la progression ou de supprimer un profil.

## Choix de conception

- **Hors-ligne et léger** : pensé pour des tablettes Android d'entrée de gamme et des connexions limitées.
- **WebView plutôt que moteur de jeu** : un seul code HTML/JS, testable dans un navigateur, portable vers iOS (WKWebView) ou PC (Electron/Tauri) sans réécriture.
- **Interface sans lecture obligatoire** pour les 4-6 ans : grosses zones tactiles, icônes, retour sonore.
- **Pas de violence** : on « affronte » un perroquet à la course ou on nourrit un monstre gentil.

## Limites connues de la V1

- `targetSdkVersion 29` : Google Play exige aujourd'hui une cible plus récente ; à monter avant publication.
- Pas de voix off : les 4-6 ans qui ne lisent pas dépendent des icônes.
- Traductions lingala et chinoise à faire valider par des locuteurs natifs.
- Personnages génériques (Amani, Kito, Lila, Mei, Malik, Nia) : à remplacer par ceux de l'histoire.
