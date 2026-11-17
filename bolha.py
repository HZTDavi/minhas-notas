#!/usr/bin/env python3
"""Bolinha flutuante do Minhas Notas.

Fica sempre por cima das janelas. Clique: abre/traz o app para frente
(se já estiver na frente, minimiza). Arraste para mudar de lugar.
Botão direito: menu. Mostra quantos lembretes faltam hoje.
"""
import json
import math
import os
import subprocess
import urllib.request
from datetime import datetime

os.environ["GDK_BACKEND"] = "x11"  # no Wayland só assim dá para ficar sempre por cima
import cairo  # noqa: E402
import gi  # noqa: E402

gi.require_version("Gtk", "3.0")
gi.require_version("Gdk", "3.0")
gi.require_version("GdkPixbuf", "2.0")
gi.require_version("GdkX11", "3.0")
from gi.repository import Gdk, GdkPixbuf, GdkX11, GLib, Gtk  # noqa: E402

PASTA = os.path.dirname(os.path.abspath(__file__))
ICONE = os.path.join(PASTA, "web", "icones", "icone-192.png")
ABRIR = os.path.join(PASTA, "abrir.sh")
CONFIG = os.path.expanduser("~/.config/minhas-notas/bolha.json")
API = "http://127.0.0.1:8765/api/notas"
TAM = 68  # tamanho da bolinha em pixels


def ler_pos():
    try:
        with open(CONFIG) as f:
            d = json.load(f)
            return int(d["x"]), int(d["y"])
    except Exception:  # noqa: BLE001
        return None


def gravar_pos(x, y):
    os.makedirs(os.path.dirname(CONFIG), exist_ok=True)
    with open(CONFIG, "w") as f:
        json.dump({"x": x, "y": y}, f)


def xprop(*args):
    try:
        return subprocess.run(["xprop", *args], capture_output=True, text=True, timeout=3).stdout
    except Exception:  # noqa: BLE001
        return ""


def janela_do_app():
    """Procura a janela do Minhas Notas (classe MinhasNotas) entre as janelas X11."""
    lista = xprop("-root", "_NET_CLIENT_LIST")
    for parte in lista.split("#")[-1].split(","):
        xid = parte.strip()
        if xid.startswith("0x") and '"MinhasNotas"' in xprop("-id", xid, "WM_CLASS"):
            return int(xid, 16)
    return None


def janela_ativa():
    saida = xprop("-root", "_NET_ACTIVE_WINDOW")
    try:
        return int(saida.split("#")[-1].strip().split(",")[0], 16)
    except ValueError:
        return None


def contar_lembretes_hoje():
    """Lembretes de hoje que ainda não tocaram (da nota e de itens)."""
    try:
        with urllib.request.urlopen(API, timeout=3) as r:
            d = json.load(r)
    except Exception:  # noqa: BLE001
        return 0
    enviados = set(d.get("notificados", []))
    hoje = datetime.now().strftime("%Y-%m-%d")
    total = 0
    for n in d.get("notas", []):
        if n.get("lixeira"):
            continue
        q = n.get("lembrete")
        if q and q.startswith(hoje) and f"{n['id']}|{q}" not in enviados:
            total += 1
        if n.get("tipo") == "lista":
            for i in n.get("itens", []):
                q = i.get("lembrete")
                if q and not i.get("feito") and q.startswith(hoje) and f"{n['id']}:{i['id']}|{q}" not in enviados:
                    total += 1
    return total


class Bolha(Gtk.Window):
    def __init__(self):
        super().__init__(type=Gtk.WindowType.TOPLEVEL)
        self.set_title("Minhas Notas (bolha)")
        self.set_wmclass("minhas-notas-bolha", "MinhasNotasBolha")
        self.set_decorated(False)
        self.set_resizable(False)
        self.set_keep_above(True)
        self.stick()  # aparece em todas as áreas de trabalho
        self.set_skip_taskbar_hint(True)
        self.set_skip_pager_hint(True)
        self.set_accept_focus(False)  # não rouba o foco da janela atual
        self.set_type_hint(Gdk.WindowTypeHint.DOCK)
        self.set_focus_on_map(False)
        self.set_default_size(TAM, TAM)
        self.set_size_request(TAM, TAM)
        self.set_app_paintable(True)
        visual = self.get_screen().get_rgba_visual()
        if visual:
            self.set_visual(visual)

        self.ICO = int(TAM * 1.18)
        self.icone = GdkPixbuf.Pixbuf.new_from_file_at_scale(ICONE, self.ICO, self.ICO, True)
        self.pendentes = 0
        self.sobre = False
        self.apertou = None
        self.arrastando = False

        self.add_events(Gdk.EventMask.BUTTON_PRESS_MASK | Gdk.EventMask.BUTTON_RELEASE_MASK
                        | Gdk.EventMask.POINTER_MOTION_MASK | Gdk.EventMask.ENTER_NOTIFY_MASK
                        | Gdk.EventMask.LEAVE_NOTIFY_MASK)
        self.connect("draw", self.desenhar)
        self.connect("button-press-event", self.apertar)
        self.connect("button-release-event", self.soltar)
        self.connect("motion-notify-event", self.mover)
        self.connect("enter-notify-event", lambda *_: self._hover(True))
        self.connect("leave-notify-event", lambda *_: self._hover(False))
        self.connect("configure-event", self.ao_mudar)
        self.connect("destroy", Gtk.main_quit)
        self.connect("realize", lambda *_: self.forma_do_clique())

        pos = ler_pos()
        if pos:
            self.move(*pos)
        else:
            geo = Gdk.Display.get_default().get_primary_monitor() or Gdk.Display.get_default().get_monitor(0)
            r = geo.get_workarea()
            self.move(r.x + r.width - TAM - 24, r.y + r.height // 2)
        self.set_tooltip_text("Minhas Notas — clique para abrir, arraste para mover")
        self.atualizar_contador()
        GLib.timeout_add_seconds(30, self.atualizar_contador)
        self._timer_pos = None

    # ---------- desenho ----------
    def desenhar(self, _w, cr):
        cr.set_operator(0)  # limpa (transparente)
        cr.paint()
        cr.set_operator(2)
        s = TAM
        # sombra
        cr.set_source_rgba(0, 0, 0, 0.30 if self.sobre else 0.22)
        cr.arc(s / 2, s / 2 + 1.5, s / 2 - 1.5, 0, 2 * math.pi)
        cr.fill()
        escala = 1.0 if self.sobre else 0.94
        cr.save()
        cr.translate(s / 2, s / 2)
        cr.scale(escala, escala)
        cr.arc(0, 0, s / 2 - 3, 0, 2 * math.pi)
        cr.clip()
        Gdk.cairo_set_source_pixbuf(cr, self.icone, -self.ICO / 2, -self.ICO / 2)
        cr.paint()
        cr.restore()
        if self.pendentes:
            r = 10
            cx, cy = s - r - 1, r + 1
            cr.set_source_rgb(0.89, 0.27, 0.24)
            cr.arc(cx, cy, r, 0, 2 * math.pi)
            cr.fill_preserve()
            cr.set_source_rgb(1, 1, 1)
            cr.set_line_width(2)
            cr.stroke()
            txt = str(self.pendentes) if self.pendentes < 10 else "9+"
            cr.select_font_face("Sans", 0, 1)
            cr.set_font_size(11)
            ext = cr.text_extents(txt)
            cr.move_to(cx - ext.width / 2 - ext.x_bearing, cy - ext.height / 2 - ext.y_bearing)
            cr.show_text(txt)
        return False

    def forma_do_clique(self):
        s, r = TAM, TAM / 2 - 2
        reg = cairo.Region()
        def circulo(cx, cy, rr):
            for y in range(int(cy - rr), int(cy + rr) + 1):
                dy = y + 0.5 - cy
                if abs(dy) > rr:
                    continue
                dx = math.sqrt(rr * rr - dy * dy)
                reg.union(cairo.RectangleInt(int(cx - dx), y, max(1, int(2 * dx)), 1))
        circulo(s / 2, s / 2, r)
        if self.pendentes:
            circulo(s - 11, 11, 10)
        self.input_shape_combine_region(reg)

    def _hover(self, sim):
        self.sobre = sim
        self.queue_draw()

    def atualizar_contador(self):
        novo = contar_lembretes_hoje()
        if novo != self.pendentes:
            self.pendentes = novo
            if self.get_realized():
                self.forma_do_clique()
            self.set_tooltip_text(f"Minhas Notas — {novo} lembrete(s) hoje" if novo else
                                  "Minhas Notas — clique para abrir, arraste para mover")
            self.queue_draw()
        return True

    # ---------- clique e arrastar ----------
    def apertar(self, _w, ev):
        if ev.button == 3:
            self.menu(ev)
            return True
        if ev.button == 1:
            wx, wy = self.get_position()
            # onde o mouse e a bolinha estavam quando o botão foi apertado
            self.apertou = (ev.x_root, ev.y_root, wx, wy)
            self.arrastando = False
        return True

    def mover(self, _w, ev):
        # A própria bolinha segue o mouse (o GNOME não arrasta janelas do tipo "dock")
        if not self.apertou:
            return True
        x0, y0, wx, wy = self.apertou
        dx, dy = ev.x_root - x0, ev.y_root - y0
        if not self.arrastando and math.hypot(dx, dy) > 4:
            self.arrastando = True
        if self.arrastando:
            self.move(int(wx + dx), int(wy + dy))
        return True

    def soltar(self, _w, ev):
        if ev.button == 1 and self.apertou:
            arrastou = self.arrastando
            self.apertou = None
            self.arrastando = False
            if arrastou:
                self.manter_na_tela()
            else:
                self.alternar_app(ev.time)
        return True

    def manter_na_tela(self):
        """Se soltar fora da tela, puxa a bolinha de volta para dentro."""
        x, y = self.get_position()
        disp = Gdk.Display.get_default()
        mon = disp.get_monitor_at_point(x + TAM // 2, y + TAM // 2)
        r = mon.get_geometry()
        nx = min(max(x, r.x), r.x + r.width - TAM)
        ny = min(max(y, r.y), r.y + r.height - TAM)
        if (nx, ny) != (x, y):
            self.move(nx, ny)

    def ao_mudar(self, *_):
        # salva a posição um pouco depois de parar de arrastar
        if self._timer_pos:
            GLib.source_remove(self._timer_pos)
        self._timer_pos = GLib.timeout_add(600, self._salvar_pos)
        return False

    def _salvar_pos(self):
        self._timer_pos = None
        x, y = self.get_position()
        gravar_pos(x, y)
        return False

    # ---------- abrir / minimizar o app ----------
    def alternar_app(self, momento):
        xid = janela_do_app()
        if not xid:
            subprocess.Popen([ABRIR], start_new_session=True,
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        disp = GdkX11.X11Display.get_default()
        janela = GdkX11.X11Window.foreign_new_for_display(disp, xid)
        if janela_ativa() == xid:
            janela.iconify()
        else:
            janela.show()
            janela.focus(momento)

    def menu(self, ev):
        m = Gtk.Menu()
        for rotulo, acao in (("Abrir Minhas Notas", lambda *_: self.alternar_app(Gtk.get_current_event_time())),
                             ("Esconder a bolinha por 1 hora", lambda *_: self.esconder(3600)),
                             ("Fechar a bolinha", lambda *_: Gtk.main_quit())):
            it = Gtk.MenuItem(label=rotulo)
            it.connect("activate", acao)
            m.append(it)
        m.show_all()
        m.popup_at_pointer(ev)
        self._menu = m

    def esconder(self, segundos):
        self.hide()
        GLib.timeout_add_seconds(segundos, lambda: (self.show_all(), self.set_keep_above(True), False)[-1])


if __name__ == "__main__":
    import fcntl
    os.makedirs(os.path.dirname(CONFIG), exist_ok=True)
    trava = open(CONFIG + ".lock", "w")
    try:
        fcntl.flock(trava, fcntl.LOCK_EX | fcntl.LOCK_NB)  # só uma bolinha por vez
    except OSError:
        raise SystemExit(0)
    b = Bolha()
    b.show_all()
    Gtk.main()
