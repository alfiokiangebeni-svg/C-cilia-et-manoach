# Académie scolaire – École primaire RDC (V2.5)

Le jeu « Cécilia & Manoach » devient une académie scolaire numérique : un enfant peut commencer en
1re primaire, progresser jusqu'en 6e primaire et se préparer à l'ENAFEP. L'histoire du livre, le village,
les matières et les tables de la V2.4 sont **conservés** et restent accessibles depuis l'académie
(bouton « 🎮 Histoire et jeux »).

## 1. Audit du projet existant (V2.4)

| Élément | Constat | Décision |
|---|---|---|
| Moteur HTML/CSS/JS sans dépendance, hors ligne, APK < 1 Mo | sain, rapide | conservé ; l'académie suit le même principe |
| Générateurs de questions (`engine.js`, `matieres.js`) : 65 notions, 3 niveaux | réutilisables | réutilisés comme sources des quiz (`{ g: 'notion', n }`) |
| Banques de contenus (`contenus.js`) : grammaire, conjugaison, sciences, RDC, Afrique | réutilisables | réutilisées via les générateurs |
| Profils `cm.v2` + migration `numzoo.v1` | sain | étendu avec `profil.academie`, migration automatique |
| 70 parties de l'histoire, 15 jeux du village, 28 tables | appréciés, testés | conservés sans changement |
| Niveaux CE2 / CM1 / génie (programme français) | ne couvrent que 2 classes | remplacés à l'entrée par les 6 classes RDC ; le niveau des jeux est déduit de la classe |
| Pas de leçons, pas de notes /20, pas de bulletin, pas de suivi parent | manque | créés |
| `TOUT_OUVERT = true` (demande de l'auteur) | conservé pour l'histoire et les jeux | l'académie, elle, respecte l'ordre (option « ordre libre » pour les parents) |

## 2. Architecture

```
js/academie/structure.js  données : cycles, 6 classes, 12 matières, barème, périodes, examens, ENAFEP, badges
js/academie/banques.js    données : 45 banques, 391 questions écrites [énoncé, réponse, mauvaises réponses, explication, image]
js/academie/lecons.js     données : classe → matière → chapitres → leçons (titre, objectif, explication, exemple, sources)
js/academie/moteur.js     logique : générateurs propres (alphabet, dizaines, règle de trois, %…), quiz, notes,
                          progression, badges, bulletin, positionnement, examens, ENAFEP
js/academie/ecrans.js     interface : académie, matière, leçon, quiz, résultat, bulletin, récompenses, ENAFEP, suivi parent
```

Le contenu est séparé de la logique : ajouter une leçon = ajouter une ligne `L(...)` dans `lecons.js` ;
ajouter des questions = compléter une banque de `banques.js`. Les sources d'une leçon :
`{ b: 'banque' }`, `{ g: 'notion', n: 0|1|2, p: {...} }` (générateurs existants) ou `{ a: 'générateur' }` (académie).

### Sauvegarde (`profil.academie`)
`classe` (1 → 6), `lecons` (meilleure note, tentatives, questions déjà vues, échecs), `quiz` (historique),
`examens`, `badges`, `erreurs` (difficultés récurrentes), `jours` (régularité), `temps` (total, par matière, par jour),
`diag` (positionnement), `ordreLibre`. Les anciens profils CE2 / CM1 / génie commencent en 3e / 4e / 5e primaire ;
leurs lucioles, tables et étoiles sont conservées.

## 3. Pédagogie et règles

- **Leçon** : titre, objectif, « J'apprends » (explication), exemple de la vie congolaise, illustration,
  petit exercice non noté, puis quiz de validation.
- **Quiz** : exactement 5 questions × 4 points = /20. Types : QCM, calcul (choix ou saisie au clavier),
  problème, compréhension de texte, identification d'image, vrai/faux. Une seule bonne réponse.
- **Non-répétition** : les 15 dernières questions vues d'une leçon sont évitées au tirage suivant.
- **Barème** : 18-20 Excellent · 16-17 Très bien · 14-15 Bien · 10-13 À renforcer · 0-9 Insuffisant.
  Validation à **14/20**. En dessous : correction détaillée, « Revoir la leçon », « 5 nouvelles questions ».
- **Progression** : leçons dans l'ordre de chaque matière ; chapitre « maîtrisé » seulement si toutes ses leçons
  sont validées ; classe supérieure ouverte par l'examen de fin d'année (≥ 10/20) ou le test de positionnement.
- **Positionnement** : 4 questions (2 français, 2 maths) par classe en partant de la 1re ; on monte tant que
  l'enfant réussit 3/4 ; la classe conseillée est la première non réussie.
- **Examen de fin d'année** : 20 questions de toute la classe (5 français, 5 maths, 2 sciences, 2 histoire,
  2 géographie, 2 EC&M, 2 autres), 30 minutes, correction par matière.
- **ENAFEP (6e)** : examens blancs **non officiels** par domaine (français, mathématiques, culture générale),
  20 questions chronométrées, programme de 5e-6e, corrections détaillées, historique. L'application affiche
  clairement qu'il ne s'agit pas d'une épreuve officielle.
- **Récompenses** : étoiles (1 à 3 par leçon validée), 12 badges (Champion de lecture, Génie des
  mathématiques, Petit scientifique, Explorateur de la RDC, Champion de civisme, Excellent élève, Sans faute,
  Belle série, Élève régulier, Une semaine d'efforts, Persévérant, Je connais mon niveau), médailles
  (chapitres), trophées (matières terminées), diplômes (examens réussis), séries de jours. Aucune récompense
  pour la vitesse.
- **Bulletin** par trimestre : notes par matière, moyenne générale (matières du programme national),
  taux de réussite, matières maîtrisées / à renforcer, appréciation, progression par rapport au trimestre
  précédent ; impression ou PDF (service d'impression d'Android, sans permission).
- **Tableau de bord parent / enseignant** (derrière la porte de sécurité) : classe, quiz, moyenne, temps
  d'apprentissage, progression par matière, difficultés récurrentes, derniers résultats, recommandations,
  réglages (classe, ordre libre, positionnement).

## 4. Classes et matières intégrées

160 leçons, 6 classes × 12 matières :

| | Fr | Ma | ST | Hi | Gé | EC | LN | Art | EPS | ITP | Anglais* | Info* |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1re | 6 | 6 | 2 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 1 |
| 2e | 5 | 5 | 5 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 3e | 7 | 7 | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |
| 4e | 7 | 7 | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |
| 5e | 6 | 6 | 3 | 2 | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |
| 6e | 6 | 7 | 2 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |

\* modules complémentaires, signalés comme tels : ils ne font pas partie du programme national.

## 5. Références

- Ministère de l'EPSP, Direction des programmes scolaires et matériel didactique,
  *Programme national de l'enseignement primaire* (2009), archivé par l'UNESCO.
- ENAFEP (Examen national de fin d'études primaires) : trois domaines, français, mathématiques, culture générale.
- Constitution de la RDC du 18 février 2006 ; 26 provinces depuis 2015.

## 6. Lacunes pédagogiques connues (à faire valider)

1. **Validation enseignant** : les leçons et les 391 questions écrites sont une adaptation pédagogique ; elles
   n'ont pas été vérifiées ligne par ligne avec les manuels officiels MINEDU-NC. Une relecture par un
   inspecteur ou un enseignant congolais est indispensable avant diffusion.
2. **Langues nationales** : seul le lingala est traité ; kikongo, swahili et tshiluba sont à ajouter (avec des locuteurs).
3. **Éducation physique** : uniquement des questions de connaissances (règles, santé) ; la pratique ne peut pas
   être évaluée par l'application.
4. **Rédaction et résumé** : évalués par QCM (choisir la phrase correcte, le meilleur résumé) ; l'écriture libre
   n'est pas corrigée automatiquement.
5. **1re et 2e primaire** : l'enfant doit savoir lire les consignes ; une lecture audio des consignes serait utile.
6. **Volume** : 1 à 7 leçons par matière et par classe ; le programme officiel est plus vaste (histoire, géographie,
   sciences et arts surtout). Les banques ont 8 à 12 questions : à enrichir pour limiter les répétitions.
7. **Synchronisation** : l'application n'a aucun accès réseau (règle du projet). La progression reste sur
   l'appareil ; une synchronisation demanderait une décision de l'auteur et une permission Internet.
8. **Examens ENAFEP** : examens blancs d'entraînement uniquement, jamais présentés comme officiels.

## 7. Tests

`npm test` lance `structure.js`, `toutes-les-parties.js` (403 manches de la V2.4) et `academie.js`, un robot qui
utilise l'interface réelle : contrôle des données, création d'un profil, verrouillage, échec puis 5 nouvelles
questions, les 160 leçons réussies, examen de fin d'année et passage de classe, 3 examens blancs ENAFEP,
positionnement, bulletin et impression, récompenses, tableau de bord parent, migration d'un ancien profil.
`node test/academie.js captures` écrit des captures dans `app/test/out/`.
