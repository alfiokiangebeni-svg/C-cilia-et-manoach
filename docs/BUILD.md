# Construire et signer l'APK

La V1 est construite **sans Gradle ni Android Studio**, avec les outils en ligne de commande du SDK Android. C'est rapide et reproductible.

## Prérequis (Debian / Ubuntu)

```bash
sudo apt install android-sdk aapt zipalign apksigner dalvik-exchange openjdk-17-jdk
# android.jar attendu dans /usr/lib/android-sdk/platforms/android-23/
# sinon : export ANDROID_JAR=/chemin/vers/android.jar
```

## Étapes de `app/android/build.sh`

1. Copie `app/www/` dans `assets/` (contenu du jeu).
2. `aapt` génère `R.java` à partir des ressources.
3. `javac` compile `MainActivity.java` (Java 8).
4. `dalvik-exchange` convertit en `classes.dex`.
5. `aapt` assemble l'APK non signé (`resources.arsc` non compressé).
6. `zipalign` aligne l'archive sur 4 octets.
7. `apksigner` signe avec le keystore, puis vérifie la signature.

Résultat : `app/android/build/CeciliaManoach.apk` (V2 : paquet `com.ceciliamanoach.app`, versionCode 2, `targetSdkVersion 34`, icône de la petite étoile).

## Signature : règles de sécurité

> ⚠️ Le fichier `numzoo.keystore` **n'est pas dans ce dépôt** et ne doit jamais l'être (il est exclu par `.gitignore`).
> Gardez-le en lieu sûr avec son mot de passe (deux copies hors ligne). **Sans ce fichier, impossible de publier une mise à jour** de l'application déjà installée : Android refusera l'APK.

```bash
export NUMZOO_KEYSTORE=~/cles/numzoo.keystore
export NUMZOO_KS_PASS='…'          # mot de passe du keystore
bash app/android/build.sh
```

Le script lit le mot de passe depuis l'environnement ; il n'apparaît plus en clair dans le code.

> **Action recommandée** : le mot de passe de la V1 figurait en clair dans l'ancien `build.sh`. Avant toute publication sur le Play Store, créez une nouvelle clé de téléversement avec un mot de passe fort et activez *Play App Signing*.

## Vérifier un APK publié

```bash
sha256sum releases/NumZoo-V1.0.apk     # comparer avec releases/SHA256SUMS
apksigner verify --print-certs releases/NumZoo-V1.0.apk
```

## Évolutions prévues

- Passer à `targetSdkVersion` 34+ (exigence Google Play), avec un build Gradle ou Capacitor.
- Produire un **AAB** (Android App Bundle) pour le Play Store.
- Cible iOS via WKWebView (même dossier `www/`).

## V2.0 — APK de test

`releases/CeciliaManoach-V2.0-test.apk` (1,5 Mo) : version de **test** de la phase 1 + personnages toon.

- Signé avec une **clé de test** temporaire (certificat `CN=Cecilia et Manoach`), qui n'est pas dans le dépôt. Elle ne doit pas servir pour le Play Store : la version publiée sera signée avec une vraie clé de téléversement (*Play App Signing*).
- Installation sur une tablette ou un téléphone : copier le fichier, l'ouvrir et autoriser « Installer des applications inconnues ». Il s'installe à côté de NumZoo V1 (identifiant différent) sans l'écraser.
- Les profils NumZoo ne sont pas repris d'une application à l'autre (stockage séparé par application Android) ; la migration `numzoo.v1` → `cm.v2` joue pour une mise à jour dans la même application.
- Empreinte : voir `releases/SHA256SUMS`.

Outils utilisés (Ubuntu) : `apt install android-sdk aapt zipalign apksigner dalvik-exchange` (android.jar API 23 pour la compilation, cible 34 dans le manifeste).

## V2.1 — APK de test

`releases/CeciliaManoach-V2.1-test.apk` (≈ 3 Mo, versionCode 3) : programme CE2 / CM1 / génie, tables 1 → 13, jeux en 3D. Même clé de test que la 2.0 : il s'installe **par-dessus** la 2.0 en gardant les profils.
