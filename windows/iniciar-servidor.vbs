' Liga o servidor do Minhas Notas escondido (sem janela preta). Usado no início do Windows.
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
If ServidorLigado() Then WScript.Quit
Set st = CreateObject("ADODB.Stream")
st.Type = 2: st.Charset = "utf-8": st.Open: st.LoadFromFile pasta & "\python.txt"
pyw = Trim(Replace(Replace(st.ReadText, vbCr, ""), vbLf, "")): st.Close
sh.CurrentDirectory = pasta
sh.Run """" & pyw & """ """ & pasta & "\servidor.py""", 0, False

Function ServidorLigado()
  On Error Resume Next
  Set http = CreateObject("MSXML2.ServerXMLHTTP")
  http.setTimeouts 500, 500, 500, 500
  http.Open "GET", "http://127.0.0.1:8765/", False
  http.Send
  ServidorLigado = (Err.Number = 0 And http.Status = 200)
End Function
