#!/bin/bash
# Publica uma versão nova no site de downloads (Firebase Hosting): pacotes Linux, Windows, APK e versao.json.
# Os apps instalados leem versao.json e mostram "Nova versão disponível".
# Uso: tools/publicar.sh "o que mudou nesta versão"
set -e
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"; cd "$RAIZ"
FIREBASE="${FIREBASE:-firebase}"
VERSAO=$(grep -oP "VERSAO_APP = '\K[^']+" web/atualizar.js)
NOVIDADES="${1:-Melhorias e correções}"
P="$RAIZ/publicar"; rm -rf "$P"; mkdir -p "$P"; TMP="$(mktemp -d)"

# Linux: mesma estrutura do instalar.sh (pasta minhas-notas/)
mkdir -p "$TMP/minhas-notas"
cp servidor.py bolha.py abrir.sh reiniciar-bolha.sh instalar.sh icone.svg LEIA-ME.txt "$TMP/minhas-notas/"
cp -r web "$TMP/minhas-notas/web"
(cd "$TMP" && zip -qr "$P/MinhasNotas-Linux.zip" minhas-notas)
# Windows
windows/empacotar.sh >/dev/null && cp dist/MinhasNotas-Windows.zip "$P/"
# Android: o plano gratuito do Firebase não aceita .apk -> vai como release no GitHub (privado; o celular do dono está logado)
cp tools/instalar-linux.sh "$P/linux.sh"; cp tools/instalar-windows.ps1 "$P/windows.ps1"
rm -rf "$TMP"
APK_TAG="android-v$VERSAO"
cp android-app/android/app/build/outputs/apk/debug/app-debug.apk "dist/MinhasNotas-$VERSAO.apk"
gh release view "$APK_TAG" --repo HZTDavi/minhas-notas >/dev/null 2>&1 || gh release create "$APK_TAG" "dist/MinhasNotas-$VERSAO.apk" --repo HZTDavi/minhas-notas --title "Minhas Notas Android $VERSAO" --notes "$NOVIDADES"
APK_URL="https://github.com/HZTDavi/minhas-notas/releases/tag/$APK_TAG"

python3 - "$P" "$VERSAO" "$NOVIDADES" "$APK_URL" <<'PY'
import json, sys, html
p, v, nov, apk = sys.argv[1:5]
json.dump({"versao": v, "novidades": nov, "linux": "MinhasNotas-Linux.zip", "windows": "MinhasNotas-Windows.zip", "android": apk},
          open(f"{p}/versao.json", "w"), ensure_ascii=False)
pagina = open("tools/pagina-download.html").read().replace("{{VERSAO}}", html.escape(v)).replace("{{NOVIDADES}}", html.escape(nov)).replace("{{APK}}", apk)
open(f"{p}/index.html", "w").write(pagina)
PY
"$FIREBASE" deploy --only hosting --project minhas-notas-22fae
echo "Publicado: versão $VERSAO — https://minhas-notas-22fae.web.app"
