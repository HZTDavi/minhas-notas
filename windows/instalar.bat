@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title Minhas Notas - instalação
set "ORIGEM=%~dp0"
set "DESTINO=%LOCALAPPDATA%\MinhasNotas"
echo.
echo   ==== Minhas Notas - instalação ====
echo.

rem ---- 1) Python (o app usa o Python para guardar as notas e mostrar os lembretes) ----
call :acharPython
if not defined PYW (
  echo   O Python não está instalado. Instalando pelo winget, aguarde...
  winget install -e --id Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements
  call :acharPython
)
if not defined PYW (
  echo.
  echo   Não consegui instalar o Python sozinho.
  echo   Instale pelo site https://www.python.org/downloads/ e marque "Add python.exe to PATH".
  echo   Depois rode este instalar.bat de novo.
  pause
  exit /b 1
)
echo   Python encontrado: !PYW!

rem ---- 2) Copia o app para %LOCALAPPDATA%\MinhasNotas (as notas ficam lá: dados.json) ----
if not exist "%DESTINO%" mkdir "%DESTINO%"
copy /Y "%ORIGEM%servidor.py" "%DESTINO%\" >nul
copy /Y "%ORIGEM%abrir.vbs" "%DESTINO%\" >nul
copy /Y "%ORIGEM%iniciar-servidor.vbs" "%DESTINO%\" >nul
copy /Y "%ORIGEM%desinstalar.bat" "%DESTINO%\" >nul
copy /Y "%ORIGEM%minhas-notas.ico" "%DESTINO%\" >nul
xcopy /E /I /Y /Q "%ORIGEM%web" "%DESTINO%\web" >nul
> "%DESTINO%\python.txt" echo !PYW!

rem ---- 3) Atalhos: Área de Trabalho, menu Iniciar e início automático (lembretes) ----
powershell -NoProfile -ExecutionPolicy Bypass -File "%ORIGEM%atalhos.ps1" -Destino "%DESTINO%"

rem ---- 4) Liga o servidor agora e abre o app ----
wscript.exe "%DESTINO%\abrir.vbs"
echo.
echo   Pronto. O Minhas Notas está na Área de Trabalho e no menu Iniciar.
echo   Ele também liga sozinho quando o PC é ligado, para os lembretes chegarem.
echo.
pause
exit /b 0

:acharPython
rem pergunta ao "py" (lançador do Python) onde está o python.exe e usa o pythonw.exe ao lado (sem janela preta)
set "PYW="
set "PY="
for %%L in ("%LOCALAPPDATA%\Programs\Python\Launcher\py.exe" "%WINDIR%\py.exe") do (
  if not defined PY if exist "%%~L" (
    for /f "usebackq delims=" %%I in (`call "%%~L" -3 -c "import sys;print(sys.executable)" 2^>nul`) do set "PY=%%I"
  )
)
if not defined PY (
  for /f "usebackq delims=" %%I in (`py -3 -c "import sys;print(sys.executable)" 2^>nul`) do set "PY=%%I"
)
if defined PY set "PYW=!PY:python.exe=pythonw.exe!"
if defined PYW if not exist "!PYW!" set "PYW="
exit /b 0
