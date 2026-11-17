#!/bin/bash
# Monta dist/MinhasNotas-Windows.zip: tudo que o PC Windows precisa, numa pasta só.
set -e
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"; SAIDA="$RAIZ/dist"; TMP="$(mktemp -d)"; P="$TMP/MinhasNotas-Windows"
mkdir -p "$P" "$SAIDA"
cp "$RAIZ/windows/"{instalar.bat,desinstalar.bat,atalhos.ps1,abrir.vbs,iniciar-servidor.vbs,minhas-notas.ico} "$P/"
cp "$RAIZ/servidor.py" "$P/"; cp -r "$RAIZ/web" "$P/web"
# Windows: fins de linha CRLF nos scripts e LEIA-ME
for f in instalar.bat desinstalar.bat atalhos.ps1 abrir.vbs iniciar-servidor.vbs; do sed -i 's/\r\?$/\r/' "$P/$f"; done
sed 's/\r\?$/\r/' "$RAIZ/windows/LEIA-ME.txt" > "$P/LEIA-ME.txt"
rm -f "$SAIDA/MinhasNotas-Windows.zip"; (cd "$TMP" && zip -qr "$SAIDA/MinhasNotas-Windows.zip" MinhasNotas-Windows)
rm -rf "$TMP"; echo "$SAIDA/MinhasNotas-Windows.zip"
