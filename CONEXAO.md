# Conectar aparelhos (celular, PC do trabalho, PC de casa)

Cada aparelho continua com as próprias notas. O botão do topo ("💻 PC do trabalho ▾") troca a tela para ver e editar as notas de outro aparelho conectado.
As notas passam por um banco de dados gratuito do Google (Firebase), e só quem tem o código da conexão consegue ler.

## 1. Projeto Firebase (já está feito)

O projeto é **minhas-notas-22fae** (plano gratuito), com o banco `https://minhas-notas-22fae-default-rtdb.firebaseio.com`.
O endereço está em `web/nuvem-config.js` e as regras em `regras-firebase.json`. Não há login: a proteção é o código secreto de 16 caracteres.
- Sem o código, nada pode ser lido nem gravado.
- Também não dá para listar as conexões que existem.

Para mudar as regras: `firebase deploy --only database --project minhas-notas-22fae` (com um `firebase.json` apontando para `regras-firebase.json`).

## 2. Conectar os aparelhos

1. No primeiro aparelho: menu **⋮ > Conectar aparelhos…**. Dê um nome (ex.: "PC do trabalho") e clique em **Criar conexão**. Aparece um código como `K7QF-2M9X-H3TR-8WZD`.
2. Nos outros aparelhos: **⋮ > Conectar aparelhos…**. Dê um nome (ex.: "Celular"), digite o código e clique em **Entrar**.
3. Pronto. Use o botão do topo para trocar entre os aparelhos.

## Como funciona

- Cada aparelho publica uma cópia das próprias notas em `espacos/<código>/aparelhos/<id>`, cerca de 1,5 s depois de cada mudança.
- Quando você edita as notas de outro aparelho, só a nota mudada é enviada para a cópia dele. Quando aquele aparelho abrir (ou dentro de 15 s, se já estiver aberto), ele junta as mudanças. Em cada nota, vale a versão editada por último.
- As notas de um aparelho só mudam quando o app dele está aberto. Exemplo: o celular edita uma nota do PC do trabalho com o PC desligado; a mudança entra quando o Minhas Notas abrir de novo no PC.
- **Desconectar este aparelho** apaga a cópia dele na nuvem. As notas no próprio aparelho continuam.
