#!/bin/bash
# NumZoo — construction de l'APK sans Gradle (aapt + javac + d8/dx + zipalign + apksigner).
# Le keystore et son mot de passe ne sont JAMAIS dans le dépôt :
#   export NUMZOO_KEYSTORE=/chemin/vers/numzoo.keystore
#   export NUMZOO_KS_PASS='votre-mot-de-passe'
# Sans keystore existant, une clé de développement est générée (ne pas l'utiliser pour le Play Store).
set -e
cd "$(dirname "$0")"
SDK=${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}
KS=${NUMZOO_KEYSTORE:-../numzoo.keystore}
: "${NUMZOO_KS_PASS:?Définir NUMZOO_KS_PASS (mot de passe du keystore)}"

rm -rf build && mkdir -p build/gen build/classes build/apk
rm -rf assets && mkdir assets && cp -r ../www/* assets/
aapt package -f -m -J build/gen -M AndroidManifest.xml -S res -I "$SDK"
javac -nowarn --release 8 -classpath "$SDK" -d build/classes build/gen/com/numzoo/app/R.java src/com/numzoo/app/*.java 2>&1 | grep -v "^warning\|^Note" || true
dalvik-exchange --dex --output=build/apk/classes.dex build/classes
aapt package -f -0 arsc -M AndroidManifest.xml -S res -A assets -I "$SDK" -F build/unsigned.apk build/apk
zipalign -f -p 4 build/unsigned.apk build/aligned.apk
[ -f "$KS" ] || keytool -genkeypair -keystore "$KS" -alias numzoo -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "$NUMZOO_KS_PASS" -keypass "$NUMZOO_KS_PASS" -dname "CN=NumZoo, O=NumZoo, C=CD" >/dev/null 2>&1
apksigner sign --ks "$KS" --ks-pass env:NUMZOO_KS_PASS --key-pass env:NUMZOO_KS_PASS --out build/NumZoo.apk build/aligned.apk
apksigner verify -v build/NumZoo.apk | head -4
ls -la build/NumZoo.apk
