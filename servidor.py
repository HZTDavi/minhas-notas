#!/usr/bin/env python3
"""Minhas Notas - servidor local.

Serve a interface, guarda as notas em dados.json e dispara os lembretes
como notificação do sistema (funciona mesmo com o navegador fechado).
Opcional por lembrete: tocar som no PC e vibrar o celular (via app ntfy).
"""
import json
import os
import shutil
import subprocess
import threading
import time
import urllib.request
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PASTA = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(PASTA, "web")
DADOS = os.path.join(PASTA, "dados.json")
NOTIFICADOS = os.path.join(PASTA, "notificados.json")
CONFIG = os.path.join(PASTA, "config.json")
HOST, PORTA = "127.0.0.1", 8765
SONS = "/usr/share/sounds/freedesktop/stereo"
SONS_DISPONIVEIS = {
    "alarme": "alarm-clock-elapsed.oga",
    "sino": "bell.oga",
    "telefone": "phone-incoming-call.oga",
    "mensagem": "message-new-instant.oga",
    "concluido": "complete.oga",
}
CONFIG_PADRAO = {"som": "alarme", "duracao_max": 60, "ntfy_servidor": "https://ntfy.sh", "ntfy_topico": ""}

trava = threading.Lock()


def ler_json(caminho, padrao):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return padrao


def gravar_json(caminho, dados):
    tmp = caminho + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
    os.replace(tmp, caminho)


def config():
    return {**CONFIG_PADRAO, **ler_json(CONFIG, {})}


def _tocador():
    return shutil.which("pw-play") or shutil.which("paplay")


def _arquivo_som(nome=None):
    nome = nome or config()["som"]
    return os.path.join(SONS, SONS_DISPONIVEIS.get(nome, SONS_DISPONIVEIS["alarme"]))


def notificar(titulo, texto, com_som=False):
    """Mostra a notificação. Com som, o alarme toca em loop até a
    notificação ser fechada (ou clicada em "Parar alarme"), com limite de tempo."""
    titulo = titulo or "Lembrete"
    texto = texto or ""
    if not shutil.which("notify-send"):
        cmd = ["gdbus", "call", "--session",
               "--dest", "org.freedesktop.Notifications",
               "--object-path", "/org/freedesktop/Notifications",
               "--method", "org.freedesktop.Notifications.Notify",
               "Minhas Notas", "0", "appointment-soon", titulo, texto,
               "[]", "{'urgency': <byte 2>}", "-1"]
        try:
            r = subprocess.run(cmd, timeout=10, check=False, capture_output=True, text=True)
        except Exception as e:  # noqa: BLE001
            print("Falha ao notificar:", e, flush=True)
            return False
        if r.returncode == 0 and com_som:
            tocar_som(vezes=2)
        return r.returncode == 0

    cmd = ["notify-send", "-a", "Minhas Notas", "-u", "critical", "-i", "appointment-soon", "-p"]
    if com_som:
        cmd += ["-A", "parar=Parar alarme"]
    cmd += [titulo, texto]
    try:
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        primeira = proc.stdout.readline().strip()  # ID da notificação = apareceu
    except Exception as e:  # noqa: BLE001
        print("Falha ao notificar:", e, flush=True)
        return False
    if not primeira.isdigit():
        proc.wait(timeout=10)
        print("Falha ao notificar:", proc.stderr.read().strip(), flush=True)
        return False
    print(f"Notificação {primeira} exibida" + (" com alarme" if com_som else ""), flush=True)
    if com_som:
        parar = threading.Event()
        tocar_alarme(parar)

        def _esperar_fechar():
            try:
                proc.wait(timeout=max(5, int(config()["duracao_max"])) + 5)
            except subprocess.TimeoutExpired:
                proc.kill()
            parar.set()
            print(f"Notificação {primeira} fechada — alarme parado", flush=True)
        threading.Thread(target=_esperar_fechar, daemon=True).start()
    return True


def tocar_alarme(parar):
    """Toca o som em loop até `parar` ser acionado ou acabar o tempo máximo."""
    tocador, arquivo = _tocador(), _arquivo_som()
    if not tocador or not os.path.exists(arquivo):
        print("Sem tocador de som ou arquivo:", arquivo, flush=True)
        return
    limite = time.monotonic() + max(5, int(config()["duracao_max"]))

    def _loop():
        while not parar.is_set() and time.monotonic() < limite:
            som = subprocess.Popen([tocador, arquivo], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            while som.poll() is None:
                if parar.wait(0.1) or time.monotonic() >= limite:
                    som.terminate()
                    som.wait()
                    break
            parar.wait(0.4)  # pequena pausa entre os toques
    threading.Thread(target=_loop, daemon=True).start()


def tocar_som(nome=None, vezes=1):
    """Toca o som algumas vezes (usado no botão "Ouvir")."""
    tocador, arquivo = _tocador(), _arquivo_som(nome)
    if not tocador or not os.path.exists(arquivo):
        return

    def _tocar():
        for _ in range(vezes):
            subprocess.run([tocador, arquivo], timeout=30, check=False, capture_output=True)
    threading.Thread(target=_tocar, daemon=True).start()


def enviar_celular(titulo, texto):
    """Envia para o app ntfy no celular, com prioridade máxima (vibra forte)."""
    cfg = config()
    topico = (cfg.get("ntfy_topico") or "").strip()
    if not topico:
        return False
    corpo = json.dumps({
        "topic": topico,
        "title": titulo or "Lembrete",
        "message": texto or "⏰",
        "priority": 5,
        "tags": ["alarm_clock"],
    }).encode("utf-8")
    req = urllib.request.Request(cfg["ntfy_servidor"].rstrip("/"), data=corpo, method="POST",
                                 headers={"Content-Type": "application/json", "User-Agent": "minhas-notas"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return 200 <= r.status < 300
    except Exception as e:  # noqa: BLE001
        print("Falha ao enviar ao celular:", e, flush=True)
        return False


def resumo(nota):
    if nota.get("tipo") == "lista":
        itens = [i.get("texto", "") for i in nota.get("itens", []) if not i.get("feito")]
        return "\n".join("• " + t for t in itens[:6])
    return (nota.get("texto") or "")[:200]


def verificar_lembretes():
    while True:
        try:
            with trava:
                notas = ler_json(DADOS, {"notas": []}).get("notas", [])
                enviados = set(ler_json(NOTIFICADOS, []))
            agora = datetime.now()
            ok = []
            # Monta a lista de lembretes: da nota inteira e de itens específicos
            lembretes = []
            for n in notas:
                if n.get("lixeira"):
                    continue
                if n.get("lembrete"):
                    lembretes.append((f"{n.get('id')}|{n['lembrete']}", n["lembrete"], n.get("alerta"),
                                      "⏰ " + (n.get("titulo") or "Lembrete"), resumo(n)))
                if n.get("tipo") == "lista":
                    for i in n.get("itens", []):
                        if i.get("lembrete") and not i.get("feito"):
                            lembretes.append((f"{n.get('id')}:{i.get('id')}|{i['lembrete']}", i["lembrete"], i.get("alerta"),
                                              "⏰ " + (i.get("texto") or "Item da lista"),
                                              "Da lista: " + (n.get("titulo") or "sem título")))
            for chave, quando, alerta, titulo, corpo in lembretes:
                try:
                    if datetime.fromisoformat(quando) > agora:
                        continue
                except ValueError:
                    continue
                alerta = {"som": True, "celular": False, **(alerta or {})}
                # PC: só marca como enviado se a notificação realmente apareceu;
                # se falhar (ex.: logo após ligar o PC), tenta de novo na próxima volta.
                if chave not in enviados and notificar(titulo, corpo, com_som=alerta["som"]):
                    ok.append(chave)
                # Celular: controle separado, para não reenviar se só o PC falhou
                if alerta["celular"] and chave + "|cel" not in enviados:
                    if enviar_celular(titulo, corpo):
                        ok.append(chave + "|cel")
            if ok:
                with trava:
                    gravar_json(NOTIFICADOS, sorted(set(ler_json(NOTIFICADOS, [])) | set(ok)))
        except Exception as e:  # noqa: BLE001
            print("Erro nos lembretes:", e, flush=True)
        time.sleep(20)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=WEB, **kw)

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, codigo, obj):
        corpo = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def _origem_ok(self):
        origem = self.headers.get("Origin")
        return not origem or origem in (f"http://{HOST}:{PORTA}", f"http://localhost:{PORTA}")

    def _corpo(self):
        tamanho = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(tamanho).decode("utf-8") or "{}")

    def do_GET(self):
        if self.path.startswith("/api/notas"):
            with trava:
                dados = ler_json(DADOS, {"notas": [], "marcadores": []})
                dados["notificados"] = ler_json(NOTIFICADOS, [])
            return self._json(200, dados)
        if self.path.startswith("/api/config"):
            return self._json(200, {**config(), "sons": list(SONS_DISPONIVEIS)})
        return super().do_GET()

    def do_PUT(self):
        if not self._origem_ok():
            return self._json(403, {"erro": "origem não permitida"})
        if self.path.startswith("/api/notas"):
            try:
                dados = self._corpo()
                assert isinstance(dados.get("notas"), list)
            except Exception:  # noqa: BLE001
                return self._json(400, {"erro": "dados inválidos"})
            with trava:
                gravar_json(DADOS, {"notas": dados["notas"],
                                    "marcadores": dados.get("marcadores", [])})
            return self._json(200, {"ok": True})
        if self.path.startswith("/api/config"):
            try:
                novo = self._corpo()
            except Exception:  # noqa: BLE001
                return self._json(400, {"erro": "dados inválidos"})
            cfg = config()
            for k in CONFIG_PADRAO:
                if k in novo:
                    cfg[k] = novo[k]
            with trava:
                gravar_json(CONFIG, cfg)
            return self._json(200, {"ok": True})
        return self._json(404, {"erro": "não encontrado"})

    def do_POST(self):
        if not self._origem_ok():
            return self._json(403, {"erro": "origem não permitida"})
        if self.path.startswith("/api/testar-notificacao"):
            ok = notificar("⏰ Teste de alarme", "Feche esta notificação (ou clique em Parar alarme) e o som para.", com_som=True)
            return self._json(200, {"ok": ok})
        if self.path.startswith("/api/testar-som"):
            try:
                nome = self._corpo().get("som")
            except Exception:  # noqa: BLE001
                nome = None
            tocar_som(nome)
            return self._json(200, {"ok": True})
        if self.path.startswith("/api/testar-celular"):
            ok = enviar_celular("⏰ Minhas Notas", "Teste: se o celular vibrou, está tudo certo! 📱")
            return self._json(200, {"ok": ok})
        return self._json(404, {"erro": "não encontrado"})


if __name__ == "__main__":
    threading.Thread(target=verificar_lembretes, daemon=True).start()
    print(f"Minhas Notas rodando em http://{HOST}:{PORTA}", flush=True)
    ThreadingHTTPServer((HOST, PORTA), Handler).serve_forever()
