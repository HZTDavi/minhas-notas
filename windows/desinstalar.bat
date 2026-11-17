@echo off
chcp 65001 >nul
title Minhas Notas - desinstalar
set "DESTINO=%LOCALAPPDATA%\MinhasNotas"
echo Desligando o Minhas Notas...
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*MinhasNotas*servidor.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
del /Q "%USERPROFILE%\Desktop\Minhas Notas.lnk" 2>nul
powershell -NoProfile -Command "Remove-Item -ErrorAction SilentlyContinue (Join-Path ([Environment]::GetFolderPath('Desktop')) 'Minhas Notas.lnk'), (Join-Path ([Environment]::GetFolderPath('Programs')) 'Minhas Notas.lnk'), (Join-Path ([Environment]::GetFolderPath('Startup')) 'Minhas Notas (lembretes).lnk')"
del /Q "%DESTINO%\servidor.py" "%DESTINO%\abrir.vbs" "%DESTINO%\iniciar-servidor.vbs" "%DESTINO%\minhas-notas.ico" "%DESTINO%\python.txt" 2>nul
rmdir /S /Q "%DESTINO%\web" 2>nul
rmdir /S /Q "%DESTINO%\janela" 2>nul
echo.
echo Pronto. Suas notas NÃO foram apagadas: continuam em %DESTINO%\dados.json
echo (se quiser apagar tudo, apague a pasta %DESTINO%).
pause
