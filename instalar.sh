#!/bin/bash
# Instala o Minhas Notas: copia para ~/minhas-notas, cria o atalho no menu
# e liga o serviço que dispara os lembretes (mesmo com a janela fechada).
set -e
ORIGEM="$(cd "$(dirname "$0")" && pwd)"
DESTINO="$HOME/minhas-notas"
command -v python3 >/dev/null || { echo "Precisa do python3 instalado."; exit 1; }
mkdir -p "$DESTINO"
if [ "$ORIGEM" != "$DESTINO" ]; then
  cp -r "$ORIGEM/servidor.py" "$ORIGEM/abrir.sh" "$ORIGEM/web" "$ORIGEM/icone.svg" "$DESTINO/"
fi
chmod +x "$DESTINO/abrir.sh"

mkdir -p ~/.config/systemd/user ~/.local/share/applications ~/.local/share/icons
cp "$DESTINO/icone.svg" ~/.local/share/icons/minhas-notas.svg
cat > ~/.config/systemd/user/minhas-notas.service <<SVC
[Unit]
Description=Minhas Notas (servidor local + lembretes)
After=graphical-session.target

[Service]
ExecStart=/usr/bin/env python3 $DESTINO/servidor.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
SVC
cat > ~/.local/share/applications/minhas-notas.desktop <<DSK
[Desktop Entry]
Type=Application
Name=Minhas Notas
Comment=Notas, listas e lembretes
Exec=$DESTINO/abrir.sh
Icon=minhas-notas
Categories=Office;
Terminal=false
StartupWMClass=MinhasNotas
StartupNotify=true
DSK
systemctl --user daemon-reload
systemctl --user enable --now minhas-notas.service
command -v notify-send >/dev/null || echo "Aviso: instale 'libnotify' (notify-send) para os lembretes aparecerem."
echo "Pronto! Procure 'Minhas Notas' no menu de aplicativos."
