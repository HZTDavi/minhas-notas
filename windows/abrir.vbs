' Abre o Minhas Notas numa janela própria do Edge (sem abas nem barra de endereço).
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
url = "http://127.0.0.1:8765"
If Not ServidorLigado() Then
  sh.Run "wscript.exe """ & pasta & "\iniciar-servidor.vbs""", 0, True
  For i = 1 To 40
    If ServidorLigado() Then Exit For
    WScript.Sleep 250
  Next
End If
On Error Resume Next
sh.Run "msedge --app=" & url & " --user-data-dir=""" & pasta & "\janela"" --no-first-run --no-default-browser-check", 1, False
If Err.Number <> 0 Then
  Err.Clear
  sh.Run url, 1, False
End If

Function ServidorLigado()
  On Error Resume Next
  Set http = CreateObject("MSXML2.ServerXMLHTTP")
  http.setTimeouts 500, 500, 500, 500
  http.Open "GET", url & "/", False
  http.Send
  ServidorLigado = (Err.Number = 0 And http.Status = 200)
End Function
