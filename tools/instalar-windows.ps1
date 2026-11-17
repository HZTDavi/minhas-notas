# Instalador de uma linha do Minhas Notas para Windows (cole no PowerShell):
#   irm https://minhas-notas-22fae.web.app/windows.ps1 | iex
$ErrorActionPreference = 'Stop'
$site = 'https://minhas-notas-22fae.web.app'
$t = Join-Path $env:TEMP ('minhas-notas-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $t | Out-Null
Write-Host 'Baixando o Minhas Notas...'
Invoke-WebRequest "$site/MinhasNotas-Windows.zip" -OutFile "$t\mn.zip" -UseBasicParsing
Expand-Archive "$t\mn.zip" -DestinationPath $t -Force
Start-Process -FilePath "$t\MinhasNotas-Windows\instalar.bat" -WorkingDirectory "$t\MinhasNotas-Windows" -Wait
