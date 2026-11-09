# Images des personnages — style toon

Les sprites du jeu (`app/www/img/persos/<perso>/<pose>.webp`) ont été générés avec **ElevenLabs** (modèle `gpt-image-2.5-sunburst`), en **style toon** : film d'animation 3D pour livre d'enfants, grands yeux expressifs, formes douces, fidèles aux descriptions de `HISTOIRE.md`. Pas d'images réalistes.

Planche de validation dans Figma : https://www.figma.com/design/GGKvZ97DyLH5Mit8QfXkJC

## Méthode

1. **Référence** de Cécilia et de Manoach (4 variantes, une retenue), sur fond magenta uni `#FF00FF`.
2. **Planches de poses** : 3 ou 4 copies du même personnage côte à côte, générées à partir de la référence (même visage, mêmes habits).
3. **Découpe et détourage** : `python3 outils/images/planche.py planche.png app/www/img/persos/<perso> pose1 pose2 …` (fond magenta → transparent, 512 px de haut, WebP ≤ 80 Ko).

Fond magenta obligatoire dans chaque prompt : « Background: one flat uniform pure magenta color (#FF00FF), no shadows, no floor, no props, no text, no labels. »

## Prompts utilisés

Style commun : *Stylized 3D animated feature film cartoon style for a children's picture book (not realistic), big expressive shiny eyes, soft rounded shapes.*

| Personnage | Description | Poses (de gauche à droite sur la planche) |
|---|---|---|
| Cécilia | 7-year-old Congolese girl, gentle and brave, dark brown skin, two afro puff pigtails tied with bright yellow ribbons, sleeveless orange dress with turquoise polka dots and wax-print patterns, barefoot | debout, contente (bras levés), pointe, réfléchit · applaudit, tient l'étoile, grimpe (branche), court |
| Manoach | 5-year-old Congolese boy, cheerful little brother, dark brown skin, short curly hair, turquoise shirt with orange patterns, orange shorts, barefoot, djembe on a strap | debout, content (saute), tambour, réfléchit · applaudit, grimpe, court |
| Petite étoile | small five-pointed golden-yellow glowing star, cute round face, big eyes, rosy cheeks, stubby points as arms and legs | triste (larmes), froide (tremble), sale (boue), propre · contente, pâle (jaune délavé), clin d'œil |
| Thérèse | wise kind old river turtle, green skin, golden-brown shell, pink flower on her head | nage, parle, sourit |
| Axel | giant old baobab with a kind face in the trunk, green moss eyebrows, hanging white flowers | calme, parle, sourit |
| Christian | shy kind white heron, long yellow-orange beak, small crest, long legs | debout, ailes ouvertes, vole avec l'étoile dans le bec, timide |
| Maman la Lune | full moon, creamy white glow, gentle motherly face, little arms | sourit, bras ouverts, câlin avec l'étoile |
| Luciole | cute firefly, glowing yellow-green belly, big eyes, antennae | ailes ouvertes, ailes fermées |

## Pas encore produit

- **Francesca, Rokaya, Mathias** : silhouettes neutres tant que l'auteur ne les a pas décrits.
- **Scènes et pages du livre** (`img/scenes/`) : à extraire des PDF du livre (voir `INSTRUCTION-V2.md`, section 7).

## Images des jeux (V2.1)

Même style, même méthode (planches sur fond magenta, `HAUTEUR=<px> python3 outils/images/planche.py …`).

| Fichiers | Contenu |
|---|---|
| `img/avatars/` | Amani, Kito, Lila, Mei, Malik, Nia (enfants de 8 ans, pleine silhouette) — le joueur pilote l'avion et pêche dans la pirogue |
| `img/jeux/` | avion (cockpit vide), perroquet, nuage ; pirogue (vide), seau, algue, corail ; 5 poissons ; paniers bleu et rouge, caisse ; Glouton (content, faim, mâche, triste) |
| `img/fruits/` | banane, pomme, fraise, carotte, orange, mangue, raisin, noix de coco |
| `img/animaux/` | singe, éléphant, lapin, girafe, panda, perroquet, koala, hippopotame |
| `img/decors/` | accueil (fleuve au crépuscule), nuit étoilée, course (ciel au-dessus du fleuve), pêche (fleuve en coupe), partage (natte devant la maison), Glouton (clairière), tri (cour du village) — 1280 × 720, ≤ 250 Ko |
