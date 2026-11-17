# Minhas Notas

Notas, listas e lembretes, no estilo "bloco de notas inteligente". Roda no PC (Linux) e no Android.

## Estrutura

| Caminho | O que é |
|---|---|
| `web/` | A interface (HTML/CSS/JS puro, sem build). **Usada pelos dois apps.** |
| `servidor.py` | Servidor local do PC (Python, só biblioteca padrão): serve `web/`, salva as notas em `dados.json` e dispara os lembretes como notificação do sistema (com som em loop até fechar, e opção de enviar ao celular via ntfy). |
| `bolha.py` | Bolinha flutuante (GTK3) sempre por cima das janelas; abre/minimiza o app. |
| `abrir.sh` | Abre o app numa janela própria do navegador. |
| `instalar.sh` | Instala no PC: serviço systemd, atalho no menu, bolinha e início automático. |
| `windows/` | Versão para Windows: `instalar.bat` (instala o Python pelo winget se faltar, copia para `%LOCALAPPDATA%\MinhasNotas`, cria atalhos e início automático), `abrir.vbs` (janela própria do Edge), `desinstalar.bat`. `empacotar.sh` gera `dist/MinhasNotas-Windows.zip`. |
| `android-app/` | App Android (Capacitor 7). Notas salvas no próprio celular; lembretes com notificações nativas; atalho no botão de acessibilidade. |

`web/app.js` detecta onde está rodando: no Android (`Capacitor.isNativePlatform()`) usa o armazenamento do celular e agenda os lembretes no sistema; no PC conversa com o `servidor.py` (`/api/notas`).

## Rodar no PC

```bash
./instalar.sh          # ou, só para testar: python3 servidor.py  e abrir http://127.0.0.1:8765
```

Dados pessoais (`dados.json`, `notificados.json`, `config.json`, `.janela/`) ficam fora do Git (veja `.gitignore`).

## Rodar no Windows

Baixe `MinhasNotas-Windows.zip` na página de Releases, extraia e dê dois cliques em `instalar.bat` (veja o `LEIA-ME.txt` de dentro).
No Windows, os lembretes usam as notificações do próprio sistema; com som, o alarme toca até clicar em "Parar alarme".
Para gerar o zip de novo: `windows/empacotar.sh`.

## Gerar o APK do Android

Precisa de Node.js, JDK 21 e Android SDK (com `ANDROID_HOME` apontando para ele).

```bash
cd android-app
npm install
./copiar-web.sh                 # copia ../web para www/
npx cap sync android
cd android && ./gradlew assembleDebug
# APK em android/app/build/outputs/apk/debug/app-debug.apk
adb install -r android/app/build/outputs/apk/debug/app-debug.apk   # instala por cima, mantendo as notas
```

Sempre que mudar algo em `web/`, rode de novo `./copiar-web.sh` e `npx cap sync android` antes de compilar.

> Atualizações só instalam por cima de um app já instalado se o APK for assinado com a **mesma chave** (a chave de debug é por PC). Com outra chave é preciso desinstalar — e isso apaga as notas do celular (exporte um backup antes pelo menu ⋮).
