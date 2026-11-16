#!/bin/bash
# Instala o Minhas Notas: copia para ~/minhas-notas, cria o atalho no menu
# e liga o serviço que dispara os lembretes (mesmo com a janela fechada).
set -e
ORIGEM="$(cd "$(dirname "$0")" && pwd)"
DESTINO="$HOME/minhas-notas"
command -v python3 >/dev/null || { echo "Precisa do python3 instalado."; exit 1; }
mkdir -p "$DESTINO"
if [ "$ORIGEM" != "$DESTINO" ]; then
  cp -r "$ORIGEM/servidor.py" "$ORIGEM/abrir.sh" "$ORIGEM/bolha.py" "$ORIGEM/reiniciar-bolha.sh" "$ORIGEM/web" "$ORIGEM/icone.svg" "$DESTINO/"
fi
chmod +x "$DESTINO/abrir.sh" "$DESTINO/bolha.py" "$DESTINO/reiniciar-bolha.sh"

mkdir -p ~/.config/systemd/user ~/.local/share/applications ~/.local/share/icons ~/.config/autostart
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
# Abrir sozinho ao ligar o PC: a bolinha flutuante e a janela do app
cat > ~/.config/autostart/minhas-notas-bolha.desktop <<DSK
[Desktop Entry]
Type=Application
Name=Minhas Notas (bolinha)
Comment=Ícone flutuante do Minhas Notas, sempre visível
Exec=/usr/bin/env python3 $DESTINO/bolha.py
Icon=minhas-notas
Terminal=false
X-GNOME-Autostart-enabled=true
X-GNOME-Autostart-Delay=3
DSK
cat > ~/.config/autostart/minhas-notas.desktop <<DSK
[Desktop Entry]
Type=Application
Name=Minhas Notas
Comment=Abre o Minhas Notas ao ligar o PC
Exec=$DESTINO/abrir.sh
Icon=minhas-notas
Terminal=false
X-GNOME-Autostart-enabled=true
X-GNOME-Autostart-Delay=5
DSK

systemctl --user daemon-reload
systemctl --user enable --now minhas-notas.service
command -v notify-send >/dev/null || echo "Aviso: instale 'libnotify' (notify-send) para os lembretes aparecerem."
python3 -c "import gi; gi.require_version('Gtk','3.0')" 2>/dev/null \
  && "$DESTINO/reiniciar-bolha.sh" \
  || echo "Aviso: instale 'python3-gobject' e 'gtk3' para a bolinha flutuante aparecer."
echo "Pronto! Procure 'Minhas Notas' no menu de aplicativos (a bolinha flutuante já está na tela)."
