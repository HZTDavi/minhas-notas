#!/bin/bash
# Abre o Minhas Notas numa janela própria (sem abas nem barra de endereço)
PASTA="$(cd "$(dirname "$0")" && pwd)"
URL=http://127.0.0.1:8765
systemctl --user start minhas-notas.service 2>/dev/null
for _ in $(seq 20); do curl -s -o /dev/null "$URL" && break; sleep 0.25; done
for nav in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge; do
  if command -v "$nav" >/dev/null; then
    exec "$nav" --user-data-dir="$PASTA/.janela" --class=MinhasNotas --app="$URL" \
      --no-first-run --no-default-browser-check
  fi
done
exec xdg-open "$URL"
