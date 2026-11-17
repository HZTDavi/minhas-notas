param([string]$Destino)
# Cria os atalhos do Minhas Notas (Área de Trabalho, menu Iniciar e Inicializar)
$sh = New-Object -ComObject WScript.Shell
function Atalho($caminho, $script) {
  $l = $sh.CreateShortcut($caminho)
  $l.TargetPath = "$env:WINDIR\System32\wscript.exe"
  $l.Arguments = '"' + (Join-Path $Destino $script) + '"'
  $l.WorkingDirectory = $Destino
  $l.IconLocation = (Join-Path $Destino 'minhas-notas.ico')
  $l.Save()
}
Atalho (Join-Path ([Environment]::GetFolderPath('Desktop')) 'Minhas Notas.lnk') 'abrir.vbs'
Atalho (Join-Path ([Environment]::GetFolderPath('Programs')) 'Minhas Notas.lnk') 'abrir.vbs'
Atalho (Join-Path ([Environment]::GetFolderPath('Startup')) 'Minhas Notas (lembretes).lnk') 'iniciar-servidor.vbs'
