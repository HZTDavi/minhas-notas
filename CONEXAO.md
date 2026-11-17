# Conectar aparelhos (celular, PC do trabalho, PC de casa)

Cada aparelho continua com as próprias notas. O botão do topo ("💻 PC do trabalho ▾") troca a tela para ver e editar as notas de outro aparelho conectado.
As notas passam por um banco de dados gratuito do Google (Firebase), e só quem tem o código da conexão consegue ler.

## 1. Criar o projeto Firebase (uma vez só, ~5 minutos)

1. Abra https://console.firebase.google.com e entre com a sua conta Google.
2. Clique em **Criar um projeto** (ou "Adicionar projeto"). Nome: `minhas-notas`. Pode desligar o Google Analytics. Clique em **Criar projeto**.
3. No menu da esquerda: **Criação > Authentication > Vamos começar**. Na aba **Método de login**, escolha **Anônimo**, ative e salve.
4. No menu da esquerda: **Criação > Realtime Database > Criar banco de dados**. Escolha o local **Estados Unidos (us-central1)**, depois **Iniciar no modo bloqueado** e clique em **Ativar**.
5. Ainda no Realtime Database, abra a aba **Regras**, apague tudo, cole o conteúdo do arquivo `regras-firebase.json` e clique em **Publicar**.
6. Na engrenagem (canto de cima, à esquerda) > **Configurações do projeto**. Em "Seus apps", clique no ícone **</>** (Web), dê o nome `minhas-notas` e clique em **Registrar app**.
   Vai aparecer um bloco `firebaseConfig`. Copie o **apiKey** e o **databaseURL** e mande para o Claude, ou cole em `web/nuvem-config.js`:

```js
window.MN_NUVEM = { apiKey: 'AIza...', databaseURL: 'https://minhas-notas-xxxxx-default-rtdb.firebaseio.com' };
```

O plano gratuito (Spark) sobra para notas: 1 GB guardado e 10 GB por mês de transferência.

## 2. Conectar os aparelhos

1. No primeiro aparelho: menu **⋮ > Conectar aparelhos…**. Dê um nome (ex.: "PC do trabalho") e clique em **Criar conexão**. Aparece um código como `K7QF-2M9X-H3TR-8WZD`.
2. Nos outros aparelhos: **⋮ > Conectar aparelhos…**. Dê um nome (ex.: "Celular"), digite o código e clique em **Entrar**.
3. Pronto. Use o botão do topo para trocar entre os aparelhos.

## Como funciona

- Cada aparelho publica uma cópia das próprias notas em `espacos/<código>/aparelhos/<id>`, cerca de 1,5 s depois de cada mudança.
- Quando você edita as notas de outro aparelho, só a nota mudada é enviada para a cópia dele. Quando aquele aparelho abrir (ou dentro de 15 s, se já estiver aberto), ele junta as mudanças. Em cada nota, vale a versão editada por último.
- As notas de um aparelho só mudam quando o app dele está aberto. Exemplo: o celular edita uma nota do PC do trabalho com o PC desligado; a mudança entra quando o Minhas Notas abrir de novo no PC.
- **Desconectar este aparelho** apaga a cópia dele na nuvem. As notas no próprio aparelho continuam.
