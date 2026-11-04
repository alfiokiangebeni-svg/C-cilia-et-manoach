# L'histoire de Cécilia et Manoach — intégration dans l'application

> **Statut : en attente du texte de l'histoire.**
> Ce document fixe les personnages et la façon dont l'histoire s'intégrera au jeu. Les cases « à compléter » doivent être remplies à partir de l'histoire originale ; rien n'y est inventé à la place de l'auteur.

## Les personnages

### Les acteurs principaux

| | Cécilia | Manoach |
|---|---|---|
| Rôle dans l'app | Actrice principale, guide et personnage jouable | Acteur principal, guide et personnage jouable |
| Âge | *à compléter* | *à compléter* |
| Apparence (peau, cheveux, coiffure, vêtements, accessoire) | *à compléter* | *à compléter* |
| Caractère | *à compléter* | *à compléter* |
| Ce qu'il/elle aime, sa phrase favorite | *à compléter* | *à compléter* |
| Rôle dans l'histoire | *à compléter* | *à compléter* |

### Les amis

| | Francesca | Rokaya | Mathias |
|---|---|---|---|
| Lien avec Cécilia et Manoach | *à compléter* | *à compléter* | *à compléter* |
| Âge | *à compléter* | *à compléter* | *à compléter* |
| Apparence | *à compléter* | *à compléter* | *à compléter* |
| Caractère, talent particulier | *à compléter* | *à compléter* | *à compléter* |
| Rôle dans l'histoire | *à compléter* | *à compléter* | *à compléter* |

### Autres personnages de l'histoire

*À compléter à partir du texte (parents, enseignants, animaux, lieux…).*

## Comment l'histoire entre dans le jeu

Le moteur de la V1 est déjà prêt pour cela : les personnages sont des avatars SVG paramétrables (`AVATARS` dans `app/www/js/art.js`), et chaque jeu est un module indépendant branché sur l'API `G` (voir [ARCHITECTURE.md](ARCHITECTURE.md)).

| Élément du jeu | Aujourd'hui (V1) | Avec l'histoire (V2) |
|---|---|---|
| Personnages jouables | Amani, Kito, Lila, Mei, Malik, Nia | **Cécilia, Manoach, Francesca, Rokaya, Mathias** dessinés d'après l'histoire |
| Écran d'accueil | Deux avatars génériques | Cécilia et Manoach accueillent l'enfant |
| Carte des jeux | Grille de 7 jeux | Carte des lieux de l'histoire : chaque jeu devient un chapitre |
| Avant chaque jeu | Une phrase de consigne | Courte scène illustrée : un personnage explique la mission |
| Pendant le jeu | Rival perroquet, monstre Glouton | Les amis encouragent, donnent des indices, deviennent coéquipiers |
| Récompense | Animaux du zoo | Objets ou souvenirs liés à l'histoire (à définir) |
| Célébration | Avatar du joueur qui danse | Cécilia, Manoach et les amis fêtent la réussite ensemble |

### Proposition de répartition (à adapter à l'histoire)

Chaque ami peut porter une compétence, ce qui donne à l'enfant un repère : « avec Rokaya on partage », « avec Mathias on trie ».

| Jeu V1 | Compétence | Personnage guide | Chapitre de l'histoire |
|---|---|---|---|
| Course des nuages | Calcul rapide | *à choisir* | *à relier* |
| Pêche magique | Reconnaître le résultat | *à choisir* | *à relier* |
| Le goûter | Partager / diviser | *à choisir* | *à relier* |
| Glouton a faim | Décomposer un nombre | *à choisir* | *à relier* |
| Relie les étoiles | Associer calcul et résultat | *à choisir* | *à relier* |
| Le grand tri | Classer (pair, plus petit que…) | *à choisir* | *à relier* |
| Coloriage magique | Calcul et motricité fine | *à choisir* | *à relier* |

## Ce qu'il faut fournir pour avancer

1. **Le texte de l'histoire** (même un brouillon, une page suffit pour commencer).
2. Pour chaque personnage : apparence et caractère, ou des dessins / photos de référence.
3. Les **lieux** importants (village, école, forêt, fleuve…) : ils deviendront les décors.
4. Si Cécilia, Manoach ou les amis sont de vrais enfants : l'accord de leurs parents pour utiliser leurs prénoms et leur ressemblance dans une application publiée.
