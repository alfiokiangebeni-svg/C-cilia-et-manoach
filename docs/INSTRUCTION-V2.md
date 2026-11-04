# Instruction pour Claude Code — Version 2 : « Cécilia & Manoach et la petite étoile »

> **À qui s'adresse ce document** : à Claude Code, qui reprend ce dépôt pour transformer NumZoo (V1) en un jeu entièrement construit sur le livre d'Alfio Kiangebeni, *Cécilia, Manoach et la petite étoile du fleuve*.
> **À lire d'abord** : `CLAUDE.md`, `docs/HISTOIRE.md` (histoire, personnages, style), `docs/ARCHITECTURE.md` (moteur V1).

---

## 1. La mission en une phrase

L'enfant accompagne **Cécilia (7 ans) et Manoach (5 ans)** dans une suite d'épreuves pour aider **la petite étoile**, tombée dans le fleuve Congo, à **rejoindre sa maman, la Lune**. Chaque épreuve réussie apporte des **lucioles** qui construisent peu à peu **l'escalier de lumière** jusqu'au ciel, comme dans le livre.

**Message à transmettre** : on réussit ensemble ce qu'on ne peut pas faire seul (*Mosapi moko elongolaka sili te*).

## 2. Chiffres fixés par l'auteur

| | |
|---|---|
| Chapitres | **10** (sections de l'histoire) |
| Stages | **30** au total (3 par chapitre) |
| Parties | **70** au total (7 par chapitre : 2 + 2 + 3 par stage) |
| Âges | 4-6, 7-9, 10-12 ans : **les mêmes 70 parties**, la difficulté s'adapte à l'âge du profil |
| Personnages | Images **3D ou 2D de qualité professionnelle**, dans le style des illustrations du livre |

Une **partie** = une manche de mini-jeu (6 à 8 actions, 1 à 3 minutes). Un **stage** = un lieu ou un moment de l'histoire, ouvert par une courte scène illustrée. Un **chapitre** = une section de l'histoire, clos par une page du livre débloquée.

## 3. Le design

Deux sources, à combiner :

1. **L'interface reste celle de NumZoo** : gros boutons ronds en relief, police Fredoka, barre de progression, célébration (rayons, feux d'artifice, guirlandes), porte parentale. Ne pas réinventer les composants : les recolorer.
2. **L'univers visuel est celui du livre** (voir `docs/HISTOIRE.md`, section Style visuel) :
   - palette nuit : ciel `#1B1F4B` → `#5B3F8C` → `#E9A46A` (crépuscule), lucioles `#E8F56B`, étoile `#FFD84A`, fond des pages `#FAF3E3`, texte `#2B2140`, accent doré `#E0A42E` ;
   - décors : fleuve qui reflète les lumières, palmiers, roseaux, baobab Axel, maison au toit de chaume, forêt dense ;
   - particules de lucioles animées en fond sur tous les écrans (canvas, ≤ 40 particules sur tablette d'entrée de gamme).

## 4. Les 10 chapitres, 30 stages et 70 parties

Légende des mécaniques : voir section 5. Les chapitres 1 à 5 sont des **ajouts de l'auteur** pour le jeu (ranger la maison, chercher dans la forêt, sortir l'étoile de la boue, la laver) ; les chapitres 6 à 10 suivent le livre page par page.

| Ch. | Stage | Parties | Ce que fait l'enfant | Mécaniques |
|---|---|---|---|---|
| **1. La maison au bord du fleuve** | 1.1 Ranger la chambre | 2 | Ranger les jouets à leur place ; plier et trier les habits par couleur | Rangement, Tri |
| | 1.2 Préparer la soirée | 2 | Dérouler la natte et apporter les bons objets ; partager les mangues | Rangement, Partage |
| | 1.3 Compter les étoiles | 3 | « Une, deux, trois… » ; relier les constellations ; repérer l'étoile qui bouge | Compter, Relier, Observation |
| **2. Plouf !** | 2.1 L'étoile filante | 2 | Suivre du doigt la trajectoire ; deviner où elle va tomber | Tracé, Observation |
| | 2.2 Courir sur la berge | 2 | Course jusqu'au fleuve en évitant les roseaux | Course |
| | 2.3 Le courant l'emporte | 3 | La lumière dérive vers la forêt : la suivre, choisir le bon bras du fleuve | Course, Labyrinthe |
| **3. La forêt** | 3.1 L'entrée de la forêt | 2 | Retrouver les traces lumineuses ; trier les bons chemins | Objets cachés, Tri |
| | 3.2 La forêt sombre | 2 | Éclairer avec la lampe et trouver les objets cachés | Lampe, Objets cachés |
| | 3.3 Le marais | 3 | Labyrinthe vers la petite lumière ; compter les grenouilles ; l'étoile appelle à l'aide | Labyrinthe, Compter |
| **4. La boue** | 4.1 Découvrir l'étoile coincée | 2 | Dégager les feuilles et les branches qui la recouvrent | Frotter, Rangement |
| | 4.2 Creuser | 2 | Creuser autour sans la blesser ; enlever les cailloux par nombre | Frotter, Calcul |
| | 4.3 Tirer ensemble | 3 | Tirer en rythme à plusieurs : chaque bonne réponse fait avancer l'étoile | Rythme, Calcul |
| **5. Le bain de la petite étoile** | 5.1 Aller chercher l'eau | 2 | Remplir les seaux (mesurer, compter) ; porter l'eau | Partage, Calcul |
| | 5.2 Laver l'étoile | 2 | Savon, frotter chaque branche, rincer : les étapes dans le bon ordre | Frotter, Séquence |
| | 5.3 Sécher et consoler | 3 | Sécher, réchauffer (« tiède comme une mangue ») ; reconnaître ses émotions ; « Mbote ! » : elle raconte qu'elle veut rejoindre Mama | Émotions, Lingala |
| **6. Thérèse la tortue** *(livre p. 5-6)* | 6.1 Rencontrer Thérèse | 2 | Lui parler ; apprendre les mots lingala du fleuve (Ebale…) | Lingala, Relier |
| | 6.2 Sur le dos de Thérèse | 2 | Traverser le fleuve en choisissant les bons passages | Pêche, Course |
| | 6.3 L'autre rive | 3 | Éviter les remous ; compter les nénuphars ; accoster chez Axel | Course, Compter |
| **7. Axel le baobab** *(p. 6-7)* | 7.1 Le pied du baobab | 2 | Trouver les prises pour grimper ; ranger les fleurs d'Axel | Escalade, Tri |
| | 7.2 Branche après branche | 2 | Chaque bonne réponse = une branche (suites de nombres) | Escalade |
| | 7.3 Tout en haut | 3 | Le ciel est trop loin, l'étoile pâlit : lui redonner de la lumière en résolvant vite | Escalade, Course |
| **8. Christian et les amis** *(p. 8)* | 8.1 Christian le héron | 2 | Rassurer Christian, timide ; associer chaque animal à ce qu'il sait faire | Émotions, Relier |
| | 8.2 « Et si nous étions nombreux ? » | 2 | Réfléchir ensemble : énigmes de logique ; Francesca, Rokaya et Mathias arrivent | Logique |
| | 8.3 Tous ensemble | 3 | Chaque ami apporte une pièce du plan ; réunir l'équipe complète | Logique, Glouton |
| **9. Le tambour et les lucioles** *(p. 9)* | 9.1 Le tambour de Manoach | 2 | Reproduire les rythmes « boum, boum, boum » | Rythme |
| | 9.2 « Lucioles ! » | 2 | Appeler les lucioles par groupes (compter par 2, 5, 10 ; multiplications) | Relier, Compter |
| | 9.3 L'escalier de lumière | 3 | Placer les marches dans l'ordre jusqu'au ciel | Escalier |
| **10. Chez Maman la Lune** *(p. 10-12)* | 10.1 L'envol de Christian | 2 | Guider Christian, l'étoile dans le bec, sur l'escalier | Course |
| | 10.2 Plus haut, toujours plus haut | 2 | Dernières épreuves mélangeant tout ce qui a été appris | Mélange |
| | 10.3 Mama ! | 3 | Retrouvailles ; colorier la scène finale ; le clin d'œil et le proverbe | Coloriage, Émotions |

**Total : 10 chapitres, 30 stages, 70 parties.** Vérifier ce total dans un test automatique.

### Francesca, Rokaya et Mathias

Ils ne sont pas dans le livre. Ils apparaissent à partir du chapitre 3 comme amis venus aider (un par chapitre 3, 4 et 5), puis tous ensemble au chapitre 8, qui illustre la phrase du livre « Et si nous étions nombreux ? ».
**Ne pas inventer leur apparence ni leur caractère** : utiliser des emplacements neutres (silhouettes) tant que l'auteur ne les a pas décrits dans `docs/HISTOIRE.md`.

## 5. Les mécaniques de jeu

Réutiliser au maximum les 7 jeux de la V1 en les **rhabillant** dans l'univers du livre. Chaque mécanique est un module `GAME_FN.<id>` qui respecte l'API `G` existante et reçoit ses paramètres selon l'âge.

| Mécanique | Base V1 | Description |
|---|---|---|
| Course | `race` | Choisir la bonne réponse pour avancer (berge, fleuve, envol de Christian) |
| Pêche | `fish` | Attraper l'élément qui porte la bonne réponse (passages sur le fleuve) |
| Partage | `feed` | Répartir mangues, eau, lucioles |
| Glouton | `monster` | Deux nombres qui font la cible (rassembler l'équipe) |
| Relier | `link` | Relier calcul et résultat, mot lingala et image, animal et talent |
| Tri | `sort` | Ranger dans le bon panier (habits, chemins, fleurs) |
| Coloriage | `color` | Colorier des illustrations du livre (contours simplifiés) |
| Rangement | nouveau | Glisser-déposer les objets à leur place (maison, natte) |
| Compter | nouveau | Toucher et compter (étoiles, grenouilles, nénuphars) |
| Tracé | nouveau | Suivre une trajectoire avec le doigt |
| Objets cachés / Lampe | nouveau | Explorer une scène sombre avec une lampe-torche |
| Labyrinthe | nouveau | Choisir le bon chemin à chaque carrefour (calcul ou logique) |
| Frotter | nouveau | Frotter l'écran pour enlever boue, feuilles, savon (masque sur canvas) |
| Séquence | nouveau | Remettre des étapes dans l'ordre |
| Émotions | nouveau | Reconnaître l'émotion d'un personnage, choisir le geste qui aide |
| Lingala | nouveau | Mbote, Mama, Monzoto, Ebale, Melesi : écouter, associer, répéter |
| Rythme | nouveau | Reproduire un rythme de tambour (Web Audio) |
| Escalade | nouveau | Monter branche par branche (suites, plus grand / plus petit) |
| Escalier | nouveau | Ordonner des nombres pour construire les marches |
| Logique | nouveau | Petites énigmes (suites, intrus, qui sait faire quoi) |

**Difficulté par âge** (exemples) : Compter jusqu'à 10 / 100 / multiplications ; Escalade +1 / +2, +5, +10 / suites ×2 et ÷ ; Rythme 3 / 5 / 8 coups. Reprendre les tables `SKILLS` de `engine.js` pour toutes les parties de calcul.

## 6. Récompenses et progression

- Chaque partie donne **1 à 3 lucioles** (les étoiles de la V1). Maximum : 210.
- Les lucioles gagnées apparaissent sur la **carte** et construisent l'**escalier de lumière** du fleuve jusqu'à la Lune : la progression se voit d'un coup d'œil.
- La **petite étoile** sert de jauge d'émotion sur la carte : triste au début, elle s'illumine à chaque chapitre (elle pâlit au chapitre 7, comme dans le livre).
- Chaque chapitre terminé débloque une **page du livre** dans « Mon livre » (illustration + texte, lecture à voix haute plus tard). Les 12 pages remplacent le zoo de la V1.
- Une partie se déverrouille quand la précédente a au moins 1 luciole.
- Célébration de fin de chapitre : Cécilia, Manoach et les personnages rencontrés fêtent ensemble.

## 7. Les images des personnages

L'auteur veut des personnages **3D ou 2D de qualité professionnelle**, fidèles au livre. Le jeu ne doit pas dépendre du code pour les dessiner :

1. **Scènes d'histoire** : utiliser directement les illustrations du livre. L'auteur dépose les PDF dans `docs/histoire/` (FR et EN) ; extraire les pages avec `pdftoppm`, retirer le bandeau de texte, exporter en **WebP 1280 px**, dans `app/www/img/scenes/`.
2. **Personnages de jeu (sprites)** : images détourées (PNG ou WebP avec transparence, 512 px de haut), dans `app/www/img/persos/<perso>/<pose>.webp`. Poses nécessaires :

   | Personnage | Poses |
   |---|---|
   | Cécilia | debout, contente, pointe du doigt, réfléchit, applaudit, tient l'étoile, grimpe, court |
   | Manoach | debout, content, joue du tambour, réfléchit, applaudit, grimpe, court |
   | Petite étoile | triste (larmes), froide (tremble), sale (boueuse), propre, contente, pâle, clin d'œil |
   | Thérèse | nage, parle, sourit |
   | Axel | visage calme, parle, sourit |
   | Christian | debout, ailes ouvertes, vole avec l'étoile, timide |
   | Lune | sourit, bras ouverts, câlin |
   | Luciole | 2 images (ailes ouvertes/fermées) |
   | Francesca, Rokaya, Mathias | debout, content, aide (quand l'auteur les aura décrits) |

3. **Fichier `app/www/img/assets.json`** : liste chaque image attendue. Si une image manque, le jeu affiche une **silhouette de remplacement** (SVG simple, aux couleurs du personnage) : le jeu fonctionne toujours, et les vraies images arrivent sans changer de code.
4. Fournir à l'auteur, dans `docs/PROMPTS-IMAGES.md`, la liste des images à produire avec une description par pose dans le style du livre, pour qu'il les génère avec le même outil que ses illustrations.
5. Un détourage provisoire des personnages depuis les pages du livre (par exemple avec `rembg`) est acceptable pour les maquettes, pas pour la version publiée.
6. Animations : légers mouvements en CSS (respiration, rebond, balancement), changement de pose aux moments clés. Pas de moteur 3D.

**Budget** : APK ou AAB ≤ 80 Mo. Décors ≤ 250 Ko, sprites ≤ 80 Ko chacun.

## 8. Textes, langues et voix

- Langues prioritaires : **français et anglais** (le livre existe dans les deux). Les autres langues de la V1 retombent sur l'anglais en attendant leurs traductions.
- Les **mots lingala** du livre restent en lingala dans toutes les langues.
- Reprendre les répliques du livre telles quelles (« Mbote, petite étoile ! », « On va t'aider », « Grimpez, les enfants. Je vous tiendrai. », « Et si nous étions nombreux ? », « Mama ! »). Les nouvelles répliques des chapitres 1 à 5 doivent rester courtes, dans le même ton, et être listées dans `docs/DIALOGUES.md` pour validation par l'auteur.
- Voix off pour les 4-6 ans : prévoir les emplacements audio (`app/www/audio/<langue>/<id>.mp3`) dès maintenant, enregistrements plus tard.

## 9. Architecture technique

- Garder l'architecture V1 : **HTML/CSS/JS sans framework dans une WebView Android**, hors-ligne, aucune permission.
- Nouveaux fichiers :
  - `js/histoire.js` : toute la structure **en données** (chapitres → stages → parties, mécanique, paramètres par âge, personnage guide, réplique d'intro). Aucune logique.
  - `js/scenes.js` : scènes d'intro (image + bulle + personnage), pages du livre débloquées.
  - `js/mecaniques/*.js` : un fichier par mécanique nouvelle.
  - `js/assets.js` : chargement des images avec repli sur silhouette.
- Nouvelle sauvegarde `localStorage['cm.v2']` : profils, lucioles par partie `'chapitre.stage.partie'`, pages débloquées. Migrer les profils `numzoo.v1` (nom, âge, langue) sans perte.
- Android : nouvel identifiant `com.ceciliamanoach.app`, nom « Cécilia & Manoach », `versionCode 2`, `versionName 2.0`, **`targetSdkVersion 34`** minimum. Nouvelle icône : la petite étoile.
- Le keystore et son mot de passe ne sont jamais dans le dépôt (`NUMZOO_KS_PASS`, voir `docs/BUILD.md`).

## 10. Plan de travail par phases

Travailler sur une branche par phase, ouvrir une pull request, faire valider l'auteur avant de passer à la suite.

| Phase | Contenu | Terminé quand… |
|---|---|---|
| **1. Squelette** | `histoire.js` complet (70 parties), carte des 10 chapitres, écrans stage et partie, sauvegarde `cm.v2`, migration V1, silhouettes de remplacement | On navigue dans les 30 stages et les 70 parties ; les 7 jeux V1 rhabillés sont jouables ; test « 70 parties » vert |
| **2. Univers visuel** | Palette du livre, décors des 10 chapitres, lucioles animées, escalier de lumière, étoile-jauge, page « Mon livre » | Captures validées par l'auteur |
| **3. Nouvelles mécaniques** | Rangement, Compter, Tracé, Lampe, Labyrinthe, Frotter, Séquence, Émotions, Lingala, Rythme, Escalade, Escalier, Logique | Chaque mécanique a son robot de test ; les 70 parties × 3 âges se terminent automatiquement |
| **4. Images pro** | `assets.json`, `PROMPTS-IMAGES.md`, intégration des sprites fournis par l'auteur | Plus aucune silhouette sur les personnages du livre |
| **5. Textes et voix** | Dialogues FR/EN, `DIALOGUES.md`, emplacements audio | L'auteur a validé tous les textes |
| **6. Publication** | targetSdk 34, AAB, icône, captures Play Store, test sur tablette réelle | APK/AAB signé dans `releases/`, CHANGELOG à jour |

## 11. Tests obligatoires

- `test/tous-les-niveaux.js` devient `test/toutes-les-parties.js` : **70 parties × 3 âges = 210 manches** résolues automatiquement, 0 erreur JavaScript.
- Test de structure : 10 chapitres, 30 stages, 70 parties, chaque partie a une mécanique existante et des paramètres pour les 3 âges.
- Test des images : chaque entrée de `assets.json` existe ou a une silhouette.
- Captures d'écran à 800 × 380 (téléphone) et 1280 × 800 (tablette) à chaque phase, dans `docs/captures/v2/`.

## 12. Règles à respecter

- Fidélité au livre : ne pas changer les noms, les apparences ni les répliques des personnages du livre.
- Aucune violence, aucun échec humiliant : en cas d'erreur, un personnage encourage (« Essaie encore, on est ensemble ! »).
- Zones tactiles ≥ 48 dp, sessions courtes, aucune lecture obligatoire pour les 4-6 ans.
- Aucune publicité, aucun traceur, aucun achat intégré, aucun accès réseau.

## 13. Questions à poser à l'auteur

1. Apparence, âge, caractère et talent de **Francesca, Rokaya et Mathias**.
2. Les images des personnages : seront-elles produites par l'auteur (même outil que le livre) ou faut-il un illustrateur ?
3. Le dépôt GitHub est **public** : l'auteur accepte-t-il d'y publier les illustrations du livre, ou faut-il passer le dépôt en privé ?
4. Le nom définitif de l'application.
