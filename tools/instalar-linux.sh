#!/bin/bash
# Instalador de uma linha do Minhas Notas para Linux:
#   curl -fsSL https://minhas-notas-22fae.web.app/linux.sh | bash
set -e
SITE="https://minhas-notas-22fae.web.app"
command -v python3 >/dev/null || { echo "Precisa do python3 (sudo apt install python3 / sudo dnf install python3)."; exit 1; }
command -v unzip >/dev/null || { echo "Precisa do unzip (sudo apt install unzip / sudo dnf install unzip)."; exit 1; }
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
echo "Baixando o Minhas Notas..."
curl -fsSL "$SITE/MinhasNotas-Linux.zip" -o "$T/mn.zip"
unzip -q "$T/mn.zip" -d "$T"
cd "$T/minhas-notas" && bash ./instalar.sh
