/* Minhas Notas — conexão entre aparelhos (celular, PC do trabalho, PC de casa).
 *
 * Cada aparelho continua com as PRÓPRIAS notas. Quando conectados com o mesmo código, cada um publica uma cópia
 * das suas notas em espacos/<código>/aparelhos/<id> (Firebase Realtime Database, via REST).
 * O botão do topo troca a "tela": ver/editar as notas de outro aparelho. A edição vai para a cópia dele na nuvem
 * e o dono junta (a versão mais nova de cada nota vence, pelo campo `editada`).
 * Quem não tem o código não lê nada (regras em regras-firebase.json).
 */
(function () {
  'use strict';
  const CFG = window.MN_NUVEM || null;          // { apiKey, databaseURL [, authHost, ns] } — ver nuvem-config.js
  const CHAVE = 'mn-nuvem';
  const ALFA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let local = null;            // notas deste aparelho guardadas enquanto vê outro
  let fotoRemota = new Map();  // id -> JSON da nota quando carregou a tela remota (para mandar só o que mudou)
  let publicados = new Set();  // ids que este aparelho publicou da última vez (para saber o que outro apagou)
  let timerPub = null, ocupado = false;

  const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; } };
  const gravar = c => { try { localStorage.setItem(CHAVE, JSON.stringify(c)); } catch (e) {} };
  let C = ler();
  const configurada = () => !!(CFG && CFG.databaseURL);
  const conectado = () => configurada() && !!C.codigo;
  const nomePadrao = () => (NATIVO ? 'Celular' : 'PC');
  if (!C.meuId) { C.meuId = 'a' + uid(); gravar(C); }

  // ── login anônimo (Identity Toolkit REST) ──
  const authBase = () => (CFG.authHost || 'https://');
  async function token() {
    if (!CFG.apiKey) return null;   // sem login: a proteção é o código secreto de 16 caracteres
    if (C.token && C.exp > Date.now() + 60000) return C.token;
    let r;
    if (C.refresh) {
      r = await fetch(authBase() + 'securetoken.googleapis.com/v1/token?key=' + CFG.apiKey, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(C.refresh) });
      if (r.ok) { const d = await r.json(); C.token = d.id_token; C.refresh = d.refresh_token; C.exp = Date.now() + Number(d.expires_in) * 1000; gravar(C); return C.token; }
    }
    r = await fetch(authBase() + 'identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + CFG.apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
    if (!r.ok) throw new Error('login ' + r.status);
    const d = await r.json(); C.token = d.idToken; C.refresh = d.refreshToken; C.exp = Date.now() + Number(d.expiresIn) * 1000; gravar(C);
    return C.token;
  }
  async function db(caminho, metodo = 'GET', corpo, extra = '') {
    const tk = await token();
    const url = CFG.databaseURL.replace(/\/$/, '') + '/espacos/' + C.codigo + (caminho ? '/' + caminho : '') + '.json?' + (tk ? 'auth=' + tk : '') +
      (CFG.ns ? '&ns=' + CFG.ns : '') + extra;
    const r = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
    if (!r.ok) throw new Error('nuvem ' + r.status);
    return r.json();
  }
  const comoMapa = lista => Object.fromEntries(lista.map(n => [n.id, n]));
  // o Firebase apaga listas vazias e campos null: devolve cada nota com todos os campos que o app espera
const lista = v => Array.isArray(v) ? v.filter(x => x != null) : Object.values(v || {});
const normal = n => ({ tipo: 'texto', titulo: '', texto: '', cor: '', fixada: false, arquivada: false, lixeira: false, lembrete: null,
    ...n, itens: lista(n.itens), marcadores: lista(n.marcadores) });
  const comoLista = mapa => Object.values(mapa || {}).filter(n => n && n.id).map(normal);

  // ── este aparelho: publica e junta o que outros editaram aqui ──
  async function juntarProprio() {
    if (!conectado() || estado.vendo) return false;
    const remotas = comoLista(await db('aparelhos/' + C.meuId + '/notas'));
    const porId = new Map(estado.notas.map(n => [n.id, n]));
    let mudou = false;
    for (const r of remotas) {
      const l = porId.get(r.id);
      if (!l) { if (!publicados.has(r.id)) { estado.notas.push(r); mudou = true; } }            // nota nova criada por outro aparelho
      else if ((r.editada || 0) > (l.editada || 0) && !(typeof editando !== 'undefined' && editando && editando.id === r.id)) {   // editada lá depois daqui
        estado.notas[estado.notas.indexOf(l)] = r; mudou = true; }
    }
    // outro aparelho apagou de vez uma nota que este tinha publicado
    const ids = new Set(remotas.map(n => n.id));
    if (publicados.size) { const antes = estado.notas.length; estado.notas = estado.notas.filter(n => !(publicados.has(n.id) && !ids.has(n.id))); if (estado.notas.length !== antes) mudou = true; }
    if (mudou) { render(); salvar(); }
    return mudou;
  }
  function publicar() {
    if (!conectado() || estado.vendo) return;
    clearTimeout(timerPub);
    timerPub = setTimeout(async () => {
      if (ocupado) return publicar(); ocupado = true;
      try {
        await juntarProprio();
        await db('aparelhos/' + C.meuId, 'PUT', { nome: C.meuNome || nomePadrao(), tipo: NATIVO ? 'celular' : 'pc', atualizado: { '.sv': 'timestamp' },
          notas: comoMapa(estado.notas), marcadores: estado.marcadores || [] });
        publicados = new Set(estado.notas.map(n => n.id)); C.publicados = [...publicados]; gravar(C); atualizarBotao();
      } catch (e) { console.warn('publicar', e); } finally { ocupado = false; }
    }, 1500);
  }
  publicados = new Set(C.publicados || []);

  // ── outros aparelhos ──
  async function aparelhos() {
    const d = await db('aparelhos', 'GET', undefined, '&shallow=true') || {};
    const lista = [];
    for (const id of Object.keys(d)) { try { const [nome, tipo, atualizado] = await Promise.all(['nome', 'tipo', 'atualizado'].map(k => db('aparelhos/' + id + '/' + k))); lista.push({ id, nome, tipo, atualizado }); } catch (e) {} }
    return lista.sort((a, b) => (a.id === C.meuId ? -1 : b.id === C.meuId ? 1 : (a.nome || '').localeCompare(b.nome || '')));
  }
  async function ver(id, nome) {
    if (id === C.meuId || !id) return voltar();
    try {
      const d = await db('aparelhos/' + id) || {};
      if (!estado.vendo) local = { notas: estado.notas, marcadores: estado.marcadores };
      estado.vendo = { id, nome: d.nome || nome || 'Outro aparelho', atualizado: d.atualizado };
      estado.notas = comoLista(d.notas); estado.marcadores = lista(d.marcadores);
      fotoRemota = new Map(estado.notas.map(n => [n.id, JSON.stringify(n)]));
      render(); atualizarBotao(); aviso('Vendo as notas de ' + estado.vendo.nome);
    } catch (e) { aviso('Não consegui abrir esse aparelho. Tem internet?'); }
  }
  function voltar() {
    if (estado.vendo && local) { clearTimeout(timerRemoto); enviarRemoto(); estado.notas = local.notas; estado.marcadores = local.marcadores; }
    estado.vendo = null; local = null; render(); atualizarBotao(); juntarProprio().catch(() => {});
  }
  // editando as notas de outro aparelho: manda só o que mudou (a nota inteira, ou null se apagou de vez)
  let timerRemoto = null;
  function salvarRemoto() { clearTimeout(timerRemoto); timerRemoto = setTimeout(enviarRemoto, 600); }
  async function enviarRemoto() {
    if (!estado.vendo) return;
    const patch = {}; const atuais = new Map(estado.notas.map(n => [n.id, n]));
    for (const [id, n] of atuais) { const j = JSON.stringify(n); if (fotoRemota.get(id) !== j) patch[id] = n; }
    for (const id of fotoRemota.keys()) if (!atuais.has(id)) patch[id] = null;
    if (!Object.keys(patch).length) return;
    try { await db('aparelhos/' + estado.vendo.id + '/notas', 'PATCH', patch);
      for (const [id, n] of Object.entries(patch)) n ? fotoRemota.set(id, JSON.stringify(n)) : fotoRemota.delete(id);
    } catch (e) { aviso('Não consegui salvar no outro aparelho. Tem internet?'); }
  }
  async function atualizarRemoto() {
    if (!estado.vendo || !$('#modal').hidden || popAtual) return;   // não mexe com a tela no meio de uma edição
    try { const d = await db('aparelhos/' + estado.vendo.id) || {}; const novas = comoLista(d.notas);
      if (JSON.stringify(novas.map(n => [n.id, n.editada]).sort()) !== JSON.stringify(estado.notas.map(n => [n.id, n.editada]).sort())) {
        estado.notas = novas; fotoRemota = new Map(novas.map(n => [n.id, JSON.stringify(n)])); estado.vendo.atualizado = d.atualizado; renderConteudo(); }
    } catch (e) {}
  }
  setInterval(() => { if (!conectado()) return; if (estado.vendo) atualizarRemoto(); else juntarProprio().catch(() => {}); }, 15000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && conectado()) (estado.vendo ? atualizarRemoto() : juntarProprio()).catch?.(() => {}); });

  // ── conectar / desconectar ──
  const gerarCodigo = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => ALFA[b % 32]).join('');
  const formatar = c => c.match(/.{1,4}/g).join('-');
  const limpar = c => (c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/O/g, '0').replace(/I/g, '1');
  async function criar(nome) {
    C.codigo = gerarCodigo(); C.meuNome = nome || nomePadrao(); gravar(C); publicados = new Set();
    // publica já (sem esperar), para o código funcionar no outro aparelho na hora
    await db('aparelhos/' + C.meuId, 'PUT', { nome: C.meuNome, tipo: NATIVO ? 'celular' : 'pc', atualizado: { '.sv': 'timestamp' }, notas: comoMapa(estado.notas), marcadores: estado.marcadores || [] });
    publicados = new Set(estado.notas.map(n => n.id)); C.publicados = [...publicados]; gravar(C); atualizarBotao(); return C.codigo; }
  async function entrar(codigo, nome) {
    const cod = limpar(codigo); if (cod.length !== 16) throw new Error('O código tem 16 letras e números');
    const antigo = C.codigo; C.codigo = cod;
    let d; try { d = await db('aparelhos', 'GET', undefined, '&shallow=true'); } catch (e) { C.codigo = antigo; throw new Error('Sem conexão com a internet'); }
    if (!d) { C.codigo = antigo; throw new Error('Código não encontrado. Confira as letras.'); }
    C.meuNome = nome || nomePadrao(); gravar(C); publicados = new Set(); publicar(); return true;
  }
  async function desconectar() {
    if (estado.vendo) voltar();
    try { await db('aparelhos/' + C.meuId, 'DELETE'); } catch (e) {}
    delete C.codigo; delete C.publicados; publicados = new Set(); gravar(C); atualizarBotao();
  }

  // ── interface ──
  const tempo = t => { if (!t) return ''; const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : `há ${Math.round(m / 1440)} d`; };
  const icone = tipo => (tipo === 'celular' ? '📱' : '💻');
  function atualizarBotao() {
    const b = $('#btn-aparelho'); if (!b) return;
    b.hidden = !conectado();
    b.textContent = (estado.vendo ? '👁 ' + estado.vendo.nome : icone(NATIVO ? 'celular' : 'pc') + ' ' + (C.meuNome || 'Este aparelho')) + ' ▾';
    b.classList.toggle('remoto', !!estado.vendo);
    const f = $('#faixa-remoto'); if (f) { f.hidden = !estado.vendo;
      if (estado.vendo) f.replaceChildren(el('span', {}, `Você está vendo as notas de ${estado.vendo.nome}` + (estado.vendo.atualizado ? ` (atualizado ${tempo(estado.vendo.atualizado)})` : '') + '. O que mudar aqui vai para lá.'),
        el('button', { class: 'link', onclick: voltar }, 'Voltar para este aparelho')); }
  }
  async function menuAparelhos(ancora) {
    const caixa = el('div', { class: 'menu-aparelhos' }, el('h4', {}, 'Ver notas de…'), el('div', { class: 'carregando' }, 'Carregando…'));
    abrirPop(ancora, caixa);
    try {
      const lista = await aparelhos();
      caixa.replaceChildren(el('h4', {}, 'Ver notas de…'), ...lista.map(a => el('button', { class: 'opcao' + ((estado.vendo ? estado.vendo.id : C.meuId) === a.id ? ' sel' : ''),
        onclick: () => { fecharPop(); a.id === C.meuId ? voltar() : ver(a.id, a.nome); } },
        el('span', {}, icone(a.tipo) + ' ' + (a.nome || 'Aparelho') + (a.id === C.meuId ? ' (este)' : '')), el('small', {}, tempo(a.atualizado)))),
        el('button', { class: 'opcao', onclick: () => { fecharPop(); dialogo(); } }, el('span', {}, '⚙ Conectar aparelhos…')));
    } catch (e) { caixa.replaceChildren(el('p', { class: 'carregando' }, 'Sem conexão com a internet.')); }
  }
  function dialogo() {
    const modal = $('#modal'), ed = $('#editor');
    pintarCor(ed, ''); ed.removeAttribute('data-cor'); modal.hidden = false;
    const fechar = () => { modal.hidden = true; modal.removeEventListener('mousedown', fora); fecharDialogoAtual = null; render(); atualizarBotao(); };
    const fora = e => { if (e.target === modal) fechar(); };
    modal.addEventListener('mousedown', fora); fecharDialogoAtual = fechar;
    const nome = el('input', { value: C.meuNome || nomePadrao(), maxlength: 30, placeholder: 'Ex.: PC do trabalho' });
    const status = el('small', { class: 'status' });
    const corpo = [];
    if (!configurada()) {
      corpo.push(el('p', {}, 'A conexão entre aparelhos ainda não foi configurada neste app (falta o projeto Firebase). Veja o LEIA-ME de conexão.'));
    } else if (conectado()) {
      corpo.push(el('p', {}, 'Este aparelho está conectado. Para conectar outro, abra o Minhas Notas nele, vá em ', el('b', {}, 'Conectar aparelhos'), ' e digite este código:'),
        el('div', { class: 'codigo-grande' }, formatar(C.codigo)),
        el('div', { class: 'campo' }, el('button', { class: 'link', onclick: () => { navigator.clipboard?.writeText(formatar(C.codigo)); aviso('Código copiado'); } }, 'Copiar código')),
        el('div', { class: 'campo' }, el('span', {}, 'Nome deste aparelho'), nome,
          el('button', { class: 'link', onclick: () => { C.meuNome = nome.value.trim() || nomePadrao(); gravar(C); publicar(); atualizarBotao(); aviso('Nome salvo'); } }, 'Salvar')),
        el('p', { class: 'nota-privacidade' }, 'Cada aparelho continua com as próprias notas. Use o botão do topo para trocar de aparelho. Quem não tiver o código não vê nada.'),
        el('div', { class: 'campo' }, el('button', { class: 'link perigo', onclick: async () => { await desconectar(); fechar(); aviso('Aparelho desconectado'); } }, 'Desconectar este aparelho')));
    } else {
      const cod = el('input', { placeholder: 'XXXX-XXXX-XXXX-XXXX', maxlength: 19, spellcheck: false, autocapitalize: 'characters' });
      corpo.push(el('p', {}, 'Conecte o celular, o PC do trabalho e o PC de casa para ver as notas de um no outro.'),
        el('div', { class: 'campo' }, el('span', {}, 'Nome deste aparelho'), nome),
        el('h2', {}, 'Primeiro aparelho'),
        el('div', { class: 'campo' }, el('button', { class: 'link', onclick: async () => { status.textContent = 'Criando…';
          try { await criar(nome.value.trim()); dialogo(); } catch (e) { delete C.codigo; gravar(C); status.textContent = 'Não consegui criar. Tem internet?'; } } }, 'Criar conexão (gera o código)')),
        el('h2', {}, 'Já tenho um código'),
        el('div', { class: 'campo' }, cod, el('button', { class: 'link', onclick: async () => {
          status.textContent = 'Conectando…';
          try { await entrar(cod.value, nome.value.trim()); aviso('Conectado!'); dialogo(); } catch (e) { status.textContent = e.message; } } }, 'Entrar')),
        status);
    }
    ed.replaceChildren(el('div', { class: 'dialogo config' }, el('div', { class: 'area' }, el('h2', {}, '🔗 Conectar aparelhos'), ...corpo),
      el('div', { class: 'acoes' }, el('button', { onclick: fechar }, 'Fechar'))));
  }

  window.Nuvem = { conectado, configurada, publicar, salvarRemoto, juntar: juntarProprio, dialogo, menuAparelhos, atualizarBotao, ver, voltar };
  // ao abrir: junta o que mudou fora e publica a versão atual
  setTimeout(() => { atualizarBotao(); if (conectado()) publicar(); }, 1500);
})();
