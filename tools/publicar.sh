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
open(f"{p}/index.html", "w").write(f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Minhas Notas — downloads</title><style>body{{font:16px/1.5 system-ui,sans-serif;max-width:560px;margin:40px auto;padding:0 16px;background:#202124;color:#e8eaed}}
a.b{{display:block;margin:12px 0;padding:14px 16px;border-radius:10px;background:#2d2e30;color:#fff;text-decoration:none;border:1px solid #5f6368}}a.b:hover{{border-color:#e8a400}}small{{color:#9aa0a6}}</style></head><body>
<h1>📝 Minhas Notas</h1><p>Versão <b>{html.escape(v)}</b><br><small>{html.escape(nov)}</small></p>
<a class="b" href="MinhasNotas-Linux.zip">🐧 Linux — extraia e rode <b>./instalar.sh</b></a>
<a class="b" href="MinhasNotas-Windows.zip">🪟 Windows — extraia e rode <b>instalar.bat</b></a>
<a class="b" href="{apk}">📱 Android — baixe e toque em Instalar/Atualizar</a>
<p><small>Suas notas ficam no seu aparelho; atualizar não apaga nada. Depois desta instalação, o próprio app avisa quando sair versão nova.</small></p></body></html>""")
PY
"$FIREBASE" deploy --only hosting --project minhas-notas-22fae
echo "Publicado: versão $VERSAO — https://minhas-notas-22fae.web.app"
