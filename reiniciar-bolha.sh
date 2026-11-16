#!/bin/bash
# Fecha a bolinha (se estiver aberta) e abre de novo
for pid in $(pgrep -x python3); do
  if tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null | grep -q "minhas-notas/bolha.py"; then kill $pid; fi
done
sleep 0.5
setsid python3 "$HOME/minhas-notas/bolha.py" >/dev/null 2>&1 &
