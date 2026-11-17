'use strict';

/* ---------- Ícones ---------- */
const ICONES = {
  copiar: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
  nota: 'M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z',
  sino: 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  marcador: 'M17.63 5.84A2 2 0 0 0 16 5L5 5.01A2 2 0 0 0 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z',
  editar: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  arquivar: 'M20.54 5.23 19.15 3.55A1.45 1.45 0 0 0 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23A1.99 1.99 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5 6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z',
  desarquivar: 'M20.55 5.22 19.16 3.54A1.45 1.45 0 0 0 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.22A1.99 1.99 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5c0-.48-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z',
  lixo: 'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  restaurar: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
  apagar: 'M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z',
  paleta: 'M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  pino: 'M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z',
  pinoVazio: 'M14 4v5c0 1.12.37 2.16 1 3H9c.65-.86 1-1.9 1-3V4h4m3-2H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1z',
  lista: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  texto: 'M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z',
  mais: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  fechar: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  seta: 'M10 17l5-5-5-5v10z',
  setaBaixo: 'M7 10l5 5 5-5z',
  copiar: 'M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z',
};
function icone(nome) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONES[nome]}"/></svg>`;
}

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function el(tag, attrs = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k in e && typeof v !== 'string') e[k] = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat(Infinity)) if (f != null && f !== false) e.append(f.nodeType ? f : document.createTextNode(f));
  return e;
}
// copia para a área de transferência (com plano B para navegadores sem a API nova)
async function copiar(texto, msg = 'Copiado') {
  try { await navigator.clipboard.writeText(texto); }
  catch (e) { const t = el('textarea', { style: 'position:fixed;opacity:0' }); t.value = texto; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch (er) {} t.remove(); }
  aviso(msg);
}
function popItem(ancora, i) {
  abrirPop(ancora, el('div', { class: 'pop-item' },
    el('div', { class: 'pop-item-texto' }, i.texto),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); copiar(i.texto, 'Item copiado'); } }, 'Copiar')));
}
function textoDaNota(n) {
  const corpo = n.tipo === 'lista'
    ? n.itens.filter(i => i.texto.trim()).map(i => (i.feito ? '✓ ' : '• ') + i.texto).join('\n')
    : (n.texto || '');
  return [n.titulo, corpo].filter(x => x && x.trim()).join('\n\n');
}
function btnIcone(nome, titulo, onclick, extra = '') {
  return el('button', { class: 'icone-btn pequeno ' + extra, title: titulo, 'aria-label': titulo, html: icone(nome), onclick });
}
const pad = n => String(n).padStart(2, '0');
function paraLocalISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function textoLembrete(iso) {
  const d = new Date(iso);
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const dia = new Date(d); dia.setHours(0, 0, 0, 0);
  const diff = Math.round((dia - hoje) / 86400000);
  const hora = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diff === 0) return `Hoje, ${hora}`;
  if (diff === 1) return `Amanhã, ${hora}`;
  if (diff === -1) return `Ontem, ${hora}`;
  const opts = { day: 'numeric', month: 'short' };
  if (d.getFullYear() !== hoje.getFullYear()) opts.year = 'numeric';
  return `${d.toLocaleDateString('pt-BR', opts)}, ${hora}`;
}

const CORES = [
  ['', 'Padrão'], ['vermelho', 'Vermelho'], ['laranja', 'Laranja'], ['amarelo', 'Amarelo'], ['verde', 'Verde'],
  ['turquesa', 'Turquesa'], ['azul', 'Azul'], ['roxo', 'Roxo'], ['rosa', 'Rosa'], ['cinza', 'Cinza'],
  ['coral', 'Coral'], ['pessego', 'Pêssego'], ['areia', 'Areia'], ['lima', 'Lima'], ['menta', 'Menta'],
  ['ceu', 'Céu'], ['indigo', 'Índigo'], ['lavanda', 'Lavanda'], ['magenta', 'Magenta'], ['marrom', 'Marrom'],
];
// cor escolhida livremente (guardada como #rrggbb): pinta o fundo e ajusta o texto para continuar legível
function pintarCor(elm, cor) {
  elm.setAttribute('data-cor', cor || '');
  if (cor && cor[0] === '#') {
    const r = parseInt(cor.slice(1, 3), 16), g = parseInt(cor.slice(3, 5), 16), b = parseInt(cor.slice(5, 7), 16);
    const claro = (0.299 * r + 0.587 * g + 0.114 * b) > 150;
    elm.style.background = cor; elm.style.color = claro ? '#202124' : '#f1f3f4';
    elm.style.setProperty('--texto', claro ? '#202124' : '#f1f3f4'); elm.style.setProperty('--texto-2', claro ? '#5f6368' : '#c4c7c5');
  } else { elm.style.background = ''; elm.style.color = ''; elm.style.removeProperty('--texto'); elm.style.removeProperty('--texto-2'); }
}

/* ---------- Estado e persistência ---------- */
const estado = { notas: [], marcadores: [], notificados: new Set(), vista: 'notas', busca: '', config: {} };
let timerSalvar = null;

// No app Android (Capacitor) tudo fica no próprio celular, sem servidor
const NATIVO = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const Plug = NATIVO ? window.Capacitor.Plugins : null;

async function carregarConfig() {
  if (NATIVO) return;
  try { estado.config = await (await fetch('/api/config')).json(); } catch (e) { /* servidor fora */ }
}
function celularConfigurado() { return !!(estado.config.ntfy_topico || '').trim(); }
function alertaDe(n) { return { som: true, vibrar: true, celular: false, ...(n.alerta || {}) }; }

async function carregar() {
  await carregarConfig();
  if (NATIVO) {
    try {
      const { value } = await Plug.Preferences.get({ key: 'dados' });
      const d = value ? JSON.parse(value) : {};
      estado.notas = d.notas || [];
      estado.marcadores = d.marcadores || [];
    } catch (e) { aviso('Erro ao ler as notas salvas'); }
    limparLixeiraAntiga();
    render();
    prepararNativo();
    return;
  }
  try {
    const r = await fetch('/api/notas');
    const d = await r.json();
    estado.notas = d.notas || [];
    estado.marcadores = d.marcadores || [];
    estado.notificados = new Set(d.notificados || []);
  } catch (e) {
    aviso('Não consegui falar com o servidor. Ele está rodando?');
  }
  limparLixeiraAntiga();
  render();
}

function salvar() {
  clearTimeout(timerSalvar);
  timerSalvar = setTimeout(enviar, 300);
}
async function enviar() {
  clearTimeout(timerSalvar);
  timerSalvar = null;
  if (estado.vendo) { window.Nuvem?.salvarRemoto(); return; }   // vendo outro aparelho: salva lá, não aqui
  if (NATIVO) {
    try {
      await Plug.Preferences.set({ key: 'dados', value: JSON.stringify({ notas: estado.notas, marcadores: estado.marcadores }) });
      await reagendar();
      window.Nuvem?.publicar();
    } catch (e) { aviso('Erro ao salvar: ' + (e.message || e)); }
    return;
  }
  try {
    const r = await fetch('/api/notas', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas: estado.notas, marcadores: estado.marcadores }),
    });
    if (!r.ok) throw new Error(r.status);
    window.Nuvem?.publicar();
  } catch (e) {
    aviso('Erro ao salvar! Verifique se o servidor está rodando.');
  }
}
window.addEventListener('beforeunload', () => {
  if (timerSalvar && !NATIVO && !estado.vendo) {
    navigator.sendBeacon && fetch('/api/notas', {
      method: 'PUT', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas: estado.notas, marcadores: estado.marcadores }),
    });
  }
});

// Atualiza a lista de lembretes já disparados (para riscar o chip)
setInterval(async () => {
  if (NATIVO) { atualizarSeMudou(); return; }
  try {
    const d = await (await fetch('/api/notas')).json();
    const novo = new Set(d.notificados || []);
    if (novo.size !== estado.notificados.size) { estado.notificados = novo; renderConteudo(); }
  } catch (e) { /* servidor fora */ }
}, 30000);

function limparLixeiraAntiga() {
  if (estado.vendo) return;
  const limite = Date.now() - 7 * 86400000;
  const antes = estado.notas.length;
  estado.notas = estado.notas.filter(n => !(n.lixeira && n.lixeiraEm && n.lixeiraEm < limite));
  if (estado.notas.length !== antes) salvar();
}

// No celular, quem dispara é o Android: considera disparado quando a hora passou
const jaPassou = quando => new Date(quando).getTime() <= Date.now();
function lembreteDisparado(n) {
  if (NATIVO || estado.vendo) return !!n.lembrete && jaPassou(n.lembrete);
  return n.lembrete && estado.notificados.has(`${n.id}|${n.lembrete}`);
}
// Lembretes de itens específicos da lista
function itemDisparado(n, i) {
  if (NATIVO || estado.vendo) return !!i.lembrete && jaPassou(i.lembrete);
  return i.lembrete && estado.notificados.has(`${n.id}:${i.id}|${i.lembrete}`);
}
function itensComLembrete(n) {
  return n.tipo === 'lista' ? n.itens.filter(i => i.lembrete && !i.feito) : [];
}
function temLembrete(n) { return !!n.lembrete || itensComLembrete(n).length > 0; }
function proximoLembrete(n) {
  return [n.lembrete, ...itensComLembrete(n).map(i => i.lembrete)].filter(Boolean).sort()[0] || '';
}
function lembretesPendentes(n) {
  return (n.lembrete && !lembreteDisparado(n) ? 1 : 0) + itensComLembrete(n).filter(i => !itemDisparado(n, i)).length;
}

function novaNota(extra = {}) {
  return {
    id: uid(), tipo: 'texto', titulo: '', texto: '', itens: [], cor: '', fixada: false,
    arquivada: false, lixeira: false, lembrete: null, marcadores: [],
    alerta: { som: true, celular: celularConfigurado() },
    criada: Date.now(), editada: Date.now(), ...extra,
  };
}
function notaVazia(n) {
  return !n.titulo.trim() && !n.texto.trim() && !n.itens.some(i => i.texto.trim()) && !n.lembrete;
}
function tocar(n) { n.editada = Date.now(); salvar(); }

/* ---------- Aviso / desfazer ---------- */
let timerAviso;
function aviso(msg, desfazer) {
  const a = $('#aviso');
  a.replaceChildren(el('span', {}, msg));
  if (desfazer) a.append(el('button', { onclick: () => { desfazer(); a.hidden = true; } }, 'Desfazer'));
  a.hidden = false;
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => { a.hidden = true; }, 5000);
}

/* ---------- Ações em notas ---------- */
function acao(n, campo, valor, msg) {
  const antigo = { arquivada: n.arquivada, lixeira: n.lixeira, fixada: n.fixada, lixeiraEm: n.lixeiraEm };
  n[campo] = valor;
  if (campo === 'lixeira') { n.lixeiraEm = valor ? Date.now() : null; }
  if (campo === 'arquivada' && valor) n.fixada = false;
  tocar(n); render();
  if (msg) aviso(msg, () => { Object.assign(n, antigo); tocar(n); render(); });
}
function apagarDeVez(n) {
  if (!confirm('Excluir esta nota para sempre?')) return;
  estado.notas = estado.notas.filter(x => x !== n);
  salvar(); render();
}
function duplicar(n) {
  const c = novaNota({ ...structuredClone(n), id: uid(), criada: Date.now(), fixada: false });
  c.itens = c.itens.map(i => ({ ...i, id: uid() }));
  estado.notas.unshift(c); salvar(); render();
  aviso('Nota duplicada');
}

/* ---------- Popovers ---------- */
let popAtual = null;
function fecharPop() { if (popAtual) { popAtual.remove(); popAtual = null; } }
function abrirPop(ancora, conteudo) {
  fecharPop();
  const p = el('div', { class: 'popover', onclick: e => e.stopPropagation(), onmousedown: e => e.stopPropagation() }, conteudo);
  document.body.append(p);
  const r = ancora.getBoundingClientRect();
  const w = p.offsetWidth, h = p.offsetHeight;
  let x = Math.min(r.left, window.innerWidth - w - 8);
  let y = r.bottom + 4;
  if (y + h > window.innerHeight - 8) y = Math.max(8, r.top - h - 4);
  p.style.left = Math.max(8, x) + 'px'; p.style.top = y + 'px';
  popAtual = p;
  return p;
}
document.addEventListener('mousedown', fecharPop);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (popAtual) { fecharPop(); return; }
  if (fecharDialogoAtual) { fecharDialogoAtual(); return; }
  if (!$('#modal').hidden) fecharEditor();
});
let fecharDialogoAtual = null;

function popCor(ancora, n, aoMudar) {
  const livre = n.cor && n.cor[0] === '#';
  const seletor = el('input', { type: 'color', value: livre ? n.cor : '#ffcc80', class: 'cor-livre-input',
    oninput: e => { n.cor = e.target.value; tocar(n); aoMudar(); },
    onchange: () => fecharPop() });
  const botoes = CORES.map(([c, nome]) => el('button', {
    'data-cor': c, title: nome, 'aria-label': nome, class: n.cor === c ? 'sel' : '',
    onclick: () => { n.cor = c; tocar(n); fecharPop(); aoMudar(); },
  }));
  const pers = el('button', { class: 'cor-livre' + (livre ? ' sel' : ''), title: 'Personalizada', 'aria-label': 'Cor personalizada',
    style: livre ? `background:${n.cor}` : '', onclick: () => seletor.click() });
  const pal = el('div', { class: 'paleta' }, ...botoes, pers, seletor);
  abrirPop(ancora, pal);
}

// `n` é a nota ou um item da lista; `nota` é a nota dona (para salvar)
function popLembrete(ancora, n, aoMudar, nota = n) {
  const ehItem = n !== nota;
  const tocarN = () => tocar(nota);
  const agora = new Date();
  const em = (dias, h) => { const d = new Date(); d.setDate(d.getDate() + dias); d.setHours(h, 0, 0, 0); return d; };
  const opcoes = [];
  if (agora.getHours() < 17) opcoes.push(['Mais tarde hoje', em(0, 18)]);
  else if (agora.getHours() < 22) opcoes.push(['Daqui a 1 hora', new Date(Date.now() + 3600000)]);
  opcoes.push(['Amanhã', em(1, 8)]);
  const seg = new Date(); seg.setDate(seg.getDate() + ((8 - seg.getDay()) % 7 || 7)); seg.setHours(8, 0, 0, 0);
  opcoes.push(['Próxima semana', seg]);
  const definir = d => {
    n.lembrete = paraLocalISO(d);
    if (!n.alerta) n.alerta = { som: true, celular: celularConfigurado() };
    tocarN(); fecharPop(); aoMudar();
  };
  const inp = el('input', { type: 'datetime-local', value: n.lembrete || paraLocalISO(new Date(Date.now() + 3600000)) });
  abrirPop(ancora, [
    el('h4', {}, ehItem ? `Lembrete do item: ${n.texto.trim() || '(sem texto)'}` : 'Lembrete'),
    opcoes.map(([nome, d]) => el('button', { class: 'opcao', onclick: () => definir(d) },
      el('span', {}, nome), el('small', {}, textoLembrete(paraLocalISO(d))))),
    el('div', { class: 'personalizado' },
      el('small', {}, 'Escolher data e hora'),
      inp,
      el('button', { onclick: () => { if (inp.value) definir(new Date(inp.value)); } }, 'Salvar')),
    secaoAlerta(n, aoMudar, nota),
    n.lembrete ? el('button', { class: 'opcao', onclick: () => { n.lembrete = null; tocarN(); fecharPop(); aoMudar(); } },
      el('span', {}, 'Remover lembrete')) : null,
  ]);
}

// Liga/desliga som e celular só para este lembrete
function secaoAlerta(n, aoMudar, nota = n) {
  const a = alertaDe(n);
  const mudar = (campo, valor) => {
    n.alerta = { ...alertaDe(n), [campo]: valor };
    tocar(nota);
    if (n.lembrete) aoMudar();
  };
  if (NATIVO) {
    return el('div', { class: 'alerta-opcoes' },
      el('small', {}, 'Quando lembrar:'),
      el('label', { class: 'interruptor' },
        el('span', {}, '🔊 Tocar som'),
        el('input', { type: 'checkbox', checked: a.som, onchange: e => mudar('som', e.target.checked) })),
      el('label', { class: 'interruptor' },
        el('span', {}, '📳 Vibrar'),
        el('input', { type: 'checkbox', checked: a.vibrar, onchange: e => mudar('vibrar', e.target.checked) })));
  }
  const temCel = celularConfigurado();
  return el('div', { class: 'alerta-opcoes' },
    el('small', {}, 'Quando lembrar:'),
    el('label', { class: 'interruptor' },
      el('span', {}, '🔊 Tocar som no PC'),
      el('input', { type: 'checkbox', checked: a.som, onchange: e => mudar('som', e.target.checked) })),
    el('label', { class: 'interruptor' + (temCel ? '' : ' desligado') },
      el('span', {}, '📱 Vibrar o celular'),
      el('input', { type: 'checkbox', checked: temCel && a.celular, disabled: !temCel, onchange: e => mudar('celular', e.target.checked) })),
    temCel ? null : el('button', { class: 'link', onclick: () => { fecharPop(); dialogoConfig(); } }, 'Configurar celular…'),
  );
}

function iconesAlerta(n) {
  const a = alertaDe(n);
  if (NATIVO) return (a.som ? ' 🔊' : '') + (a.vibrar ? ' 📳' : '');
  return (a.som ? ' 🔊' : '') + (a.celular && celularConfigurado() ? ' 📱' : '');
}

function popMarcadores(ancora, n, aoMudar) {
  const busca = el('input', { class: 'busca-marc', placeholder: 'Nome do marcador' });
  const lista = el('div');
  const desenhar = () => {
    const q = busca.value.trim().toLowerCase();
    lista.replaceChildren(
      ...estado.marcadores.filter(m => m.nome.toLowerCase().includes(q)).map(m => el('label', { class: 'marc' },
        el('input', { type: 'checkbox', checked: n.marcadores.includes(m.id), onchange: e => {
          n.marcadores = e.target.checked ? [...n.marcadores, m.id] : n.marcadores.filter(x => x !== m.id);
          tocar(n); aoMudar();
        } }), m.nome)),
    );
    const existe = estado.marcadores.some(m => m.nome.toLowerCase() === q);
    if (q && !existe) lista.append(el('button', { class: 'opcao', onclick: () => {
      const m = { id: uid(), nome: busca.value.trim() };
      estado.marcadores.push(m); n.marcadores.push(m.id); tocar(n); busca.value = ''; desenhar(); aoMudar(); renderLateral();
    } }, el('span', { html: icone('mais') + ' ' }), `Criar "${busca.value.trim()}"`));
  };
  busca.addEventListener('input', desenhar);
  busca.addEventListener('keydown', e => { if (e.key === 'Enter') { const b = lista.querySelector('.opcao'); b && b.click(); } });
  desenhar();
  abrirPop(ancora, [el('h4', {}, 'Marcar nota'), busca, lista]);
  busca.focus();
}

function popMais(ancora, n, aoMudar, noEditor) {
  abrirPop(ancora, [
    el('button', { class: 'opcao', onclick: () => { fecharPop(); popMarcadores(ancora, n, aoMudar); } }, 'Adicionar marcador'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); if (noEditor) fecharEditor(); duplicar(n); } }, 'Fazer uma cópia'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); alternarTipo(n); aoMudar(); } },
      n.tipo === 'lista' ? 'Converter em texto' : 'Converter em lista'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); if (noEditor) fecharEditor(); acao(n, 'lixeira', true, 'Nota movida para a lixeira'); } }, 'Excluir nota'),
  ]);
}

function alternarTipo(n) {
  if (n.tipo === 'texto') {
    n.itens = n.texto.split('\n').filter(l => l.trim()).map(t => ({ id: uid(), texto: t.replace(/^\s*[-•*]\s*/, ''), feito: false }));
    n.texto = ''; n.tipo = 'lista';
  } else {
    n.texto = n.itens.map(i => i.texto).join('\n');
    n.itens = []; n.tipo = 'texto';
  }
  tocar(n);
}

/* ---------- Lateral ---------- */
function renderLateral() {
  const nav = $('#lateral');
  const qtdLembretes = estado.notas.filter(n => !n.lixeira).reduce((t, n) => t + lembretesPendentes(n), 0);
  const item = (vista, ic, nome, contador) => el('button', {
    class: 'item-lateral' + (estado.vista === vista ? ' ativo' : ''), title: nome,
    onclick: () => { estado.vista = vista; nav.classList.remove('aberta'); render(); },
  }, el('span', { html: icone(ic) }), el('span', { class: 'rotulo' }, nome), contador ? el('span', { class: 'contador rotulo' }, contador) : null);
  nav.replaceChildren(
    item('notas', 'nota', 'Notas'),
    item('lembretes', 'sino', 'Lembretes', qtdLembretes || ''),
    ...[...estado.marcadores].sort((a, b) => a.nome.localeCompare(b.nome)).map(m => item('m:' + m.id, 'marcador', m.nome)),
    el('button', { class: 'item-lateral', title: 'Editar marcadores', onclick: dialogoMarcadores },
      el('span', { html: icone('editar') }), el('span', { class: 'rotulo' }, 'Editar marcadores')),
    item('arquivo', 'arquivar', 'Arquivo'),
    item('lixeira', 'lixo', 'Lixeira'),
  );
}

/* ---------- Conteúdo ---------- */
function filtrar() {
  const v = estado.vista;
  const q = estado.busca.trim().toLowerCase();
  let lista = estado.notas.filter(n => {
    if (v === 'lixeira') return n.lixeira;
    if (n.lixeira) return false;
    if (q) return true; // busca em tudo (exceto lixeira)
    if (v === 'arquivo') return n.arquivada;
    if (v === 'lembretes') return temLembrete(n);
    if (v.startsWith('m:')) return n.marcadores.includes(v.slice(2));
    return !n.arquivada;
  });
  if (q) {
    lista = lista.filter(n => {
      const nomes = n.marcadores.map(id => estado.marcadores.find(m => m.id === id)?.nome || '').join(' ');
      return [n.titulo, n.texto, nomes, ...n.itens.map(i => i.texto)].join(' ').toLowerCase().includes(q);
    });
  }
  if (v === 'lembretes' && !q) lista.sort((a, b) => proximoLembrete(a).localeCompare(proximoLembrete(b)));
  else lista.sort((a, b) => (b.ordem ?? b.criada) - (a.ordem ?? a.criada));
  return lista;
}

function renderConteudo() {
  const c = $('#conteudo');
  const v = estado.vista;
  $('#criar').hidden = v === 'lixeira' || v === 'arquivo';
  const notas = filtrar();
  c.replaceChildren();

  if (v === 'lixeira' && notas.length) {
    c.append(el('div', { class: 'aviso-lixeira' }, 'As notas na lixeira são excluídas depois de 7 dias. ',
      el('button', { onclick: () => {
        if (!confirm('Esvaziar a lixeira? Isso não pode ser desfeito.')) return;
        estado.notas = estado.notas.filter(n => !n.lixeira); salvar(); render();
      } }, 'Esvaziar lixeira')));
  }

  if (!notas.length) {
    const vazios = {
      notas: ['nota', 'As notas que você criar aparecerão aqui'],
      lembretes: ['sino', 'Notas com lembretes futuros aparecem aqui'],
      arquivo: ['arquivar', 'As notas arquivadas aparecem aqui'],
      lixeira: ['lixo', 'Nenhuma nota na lixeira'],
    };
    const [ic, txt] = estado.busca ? ['nota', 'Nenhum resultado encontrado'] : (vazios[v] || ['marcador', 'Nenhuma nota com este marcador ainda']);
    c.append(el('div', { class: 'vazio-tela', html: icone(ic) }, el('p', {}, txt)));
    return;
  }

  const fixadas = notas.filter(n => n.fixada && !n.arquivada && v !== 'lixeira');
  const outras = notas.filter(n => !fixadas.includes(n));
  if (fixadas.length) {
    c.append(el('div', { class: 'secao-titulo' }, 'Fixadas'), grade(fixadas));
    if (outras.length) c.append(el('div', { class: 'secao-titulo' }, 'Outras'));
  }
  if (outras.length) c.append(grade(outras));
  ajustarGrade();
}

function grade(notas) {
  const g = el('div', { class: 'grade' }, notas.map(cartao));
  // Arrastar só faz sentido onde a ordem é a manual
  const v = estado.vista;
  if (!estado.busca.trim() && v !== 'lembretes' && v !== 'lixeira') ativarArrastar(g);
  return g;
}

/* ---------- Arrastar para reordenar ---------- */
let acabouDeArrastar = false;
const chaveOrdem = n => n.ordem ?? n.criada;

function ativarArrastar(g) {
  g.addEventListener('pointerdown', e => {
    const card = e.target.closest('.cartao');
    if (!card || e.button !== 0 || e.target.closest('button,input,label,.popover')) return;
    const toque = e.pointerType !== 'mouse';
    const x0 = e.clientX, y0 = e.clientY;
    let arrastando = false, fantasma = null, dx = 0, dy = 0, timerToque = null;
    let ultimo = { x: x0, y: y0 };
    let ultimoAlvo = null;

    const iniciar = () => {
      arrastando = true;
      fecharPop();
      const r = card.getBoundingClientRect();
      dx = x0 - r.left; dy = y0 - r.top;
      fantasma = card.cloneNode(true);
      fantasma.classList.add('fantasma');
      Object.assign(fantasma.style, { width: r.width + 'px', height: r.height + 'px' });
      document.body.append(fantasma);
      card.classList.add('arrastando');
      document.body.classList.add('modo-arrastar');
      mover(ultimo.x, ultimo.y);
      if (navigator.vibrate && toque) navigator.vibrate(15);
    };

    const mover = (x, y) => {
      fantasma.style.transform = `translate(${x - dx}px, ${y - dy}px) rotate(2deg)`;
      fantasma.style.visibility = 'hidden';
      const alvo = document.elementFromPoint(x, y)?.closest('.cartao');
      fantasma.style.visibility = '';
      if (alvo === card) return;
      // Evita "vai e volta": cada vizinho só troca uma vez até o ponteiro sair dele
      if (!alvo || alvo.parentElement !== g) { ultimoAlvo = null; return; }
      if (alvo === ultimoAlvo) return;
      ultimoAlvo = alvo;
      const cards = [...g.children];
      const de = cards.indexOf(card), para = cards.indexOf(alvo);
      animarTroca(g, () => (de < para ? alvo.after(card) : alvo.before(card)));
      // Rolagem automática perto das bordas
      if (y < 80) window.scrollBy(0, -12); else if (y > window.innerHeight - 60) window.scrollBy(0, 12);
    };

    const aoMover = ev => {
      ultimo = { x: ev.clientX, y: ev.clientY };
      if (!arrastando) {
        const longe = Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6;
        if (toque) { if (longe) cancelar(); return; } // no toque, precisa segurar antes
        if (longe) iniciar(); else return;
      }
      ev.preventDefault();
      mover(ev.clientX, ev.clientY);
    };

    const bloquearRolagem = ev => { if (arrastando) ev.preventDefault(); };

    const cancelar = () => {
      clearTimeout(timerToque);
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
      window.removeEventListener('touchmove', bloquearRolagem);
    };

    const soltar = () => {
      cancelar();
      if (!arrastando) return;
      acabouDeArrastar = true;
      setTimeout(() => { acabouDeArrastar = false; }, 50);
      const r = card.getBoundingClientRect();
      fantasma.style.transition = 'transform .18s ease-out';
      fantasma.style.transform = `translate(${r.left}px, ${r.top}px)`;
      setTimeout(() => {
        fantasma.remove();
        card.classList.remove('arrastando');
        document.body.classList.remove('modo-arrastar');
      }, 180);
      salvarOrdem(g);
    };

    window.addEventListener('pointermove', aoMover, { passive: false });
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    if (toque) {
      window.addEventListener('touchmove', bloquearRolagem, { passive: false });
      timerToque = setTimeout(iniciar, 350);
    }
  });
}

// Os outros cartões deslizam até a nova posição (técnica FLIP)
function animarTroca(g, mudar) {
  const cards = [...g.children].filter(c => !c.classList.contains('arrastando'));
  const antes = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
  mudar();
  for (const c of cards) {
    const a = antes.get(c), d = c.getBoundingClientRect();
    const mx = a.left - d.left, my = a.top - d.top;
    if (!mx && !my) continue;
    c.style.transition = 'none';
    c.style.transform = `translate(${mx}px, ${my}px)`;
    requestAnimationFrame(() => {
      c.style.transition = 'transform .2s ease';
      c.style.transform = '';
    });
  }
}

// Reaproveita as "posições" das notas desta grade na nova ordem,
// assim a ordem fica certa também em relação a notas de outras telas.
function salvarOrdem(g) {
  const notas = [...g.children].map(c => estado.notas.find(n => n.id === c.dataset.id)).filter(Boolean);
  const chaves = notas.map(chaveOrdem).sort((a, b) => b - a);
  for (let i = 1; i < chaves.length; i++) if (chaves[i] >= chaves[i - 1]) chaves[i] = chaves[i - 1] - 0.001;
  let mudou = false;
  notas.forEach((n, i) => { if (chaveOrdem(n) !== chaves[i]) { n.ordem = chaves[i]; mudou = true; } });
  if (mudou) salvar();
}

function cartao(n) {
  const naLixeira = n.lixeira;
  const atualizar = () => renderConteudo();
  const c = el('article', { class: 'cartao', 'data-cor': n.cor, 'data-id': n.id, tabindex: 0,
    onclick: e => { if (!acabouDeArrastar && !naLixeira && !e.target.closest('button,input,label')) abrirEditor(n); },
    onkeydown: e => { if (e.key === 'Enter' && e.target === c && !naLixeira) abrirEditor(n); },
  });
  pintarCor(c, n.cor);
  if (!naLixeira) {
    c.append(btnIcone(n.fixada ? 'pino' : 'pinoVazio', n.fixada ? 'Desafixar' : 'Fixar',
      () => { n.fixada = !n.fixada; if (n.fixada) n.arquivada = false; tocar(n); render(); }, 'fixar' + (n.fixada ? ' ligado' : '')));
  }
  if (n.titulo) c.append(el('h3', {}, n.titulo));
  if (n.tipo === 'lista') {
    const pend = n.itens.filter(i => !i.feito && i.texto.trim());
    const feitos = n.itens.filter(i => i.feito && i.texto.trim());
    const mostrar = pend.slice(0, 10);
    for (const i of mostrar) {
      // item numa linha só (o cartão fica pequeno); tocar no texto abre o item inteiro com a opção de copiar
      c.append(el('div', { class: 'item' },
        el('input', { type: 'checkbox', disabled: naLixeira, onclick: e => e.stopPropagation(), onchange: () => { i.feito = true; tocar(n); atualizar(); } }),
        el('span', { class: 'texto-item', title: i.texto, onclick: e => { e.stopPropagation(); popItem(e.currentTarget, i); } }, i.texto,
          i.lembrete ? el('small', { class: 'lembrete-item' + (itemDisparado(n, i) ? ' passou' : ''), title: 'Lembrete deste item' },
            '⏰ ' + textoLembrete(i.lembrete) + iconesAlerta(i)) : null)));
    }
    const resto = pend.length - mostrar.length;
    if (resto > 0) c.append(el('div', { class: 'mais-itens' }, `+ ${resto} ${resto === 1 ? 'item' : 'itens'}`));
    if (feitos.length) c.append(el('div', { class: 'mais-itens' }, `✓ ${feitos.length} ${feitos.length === 1 ? 'item concluído' : 'itens concluídos'}`));
  } else if (n.texto) {
    c.append(el('div', { class: 'texto' }, n.texto));
  }
  if (!n.titulo && !n.texto.trim() && !n.itens.some(i => i.texto.trim())) c.append(el('div', { class: 'vazio' }, 'Nota vazia'));

  const chips = el('div', { class: 'chips' });
  if (n.lembrete) {
    chips.append(el('span', { class: 'chip' + (lembreteDisparado(n) ? ' passou' : ''), title: 'Lembrete', html: icone('sino') },
      textoLembrete(n.lembrete) + iconesAlerta(n),
      naLixeira ? null : el('button', { class: 'x', title: 'Remover lembrete', onclick: () => { n.lembrete = null; tocar(n); render(); } }, '✕')));
  }
  for (const id of n.marcadores) {
    const m = estado.marcadores.find(x => x.id === id);
    if (m) chips.append(el('span', { class: 'chip' }, m.nome,
      naLixeira ? null : el('button', { class: 'x', title: 'Remover marcador', onclick: () => { n.marcadores = n.marcadores.filter(x => x !== id); tocar(n); atualizar(); } }, '✕')));
  }
  if (chips.children.length) c.append(chips);

  const barra = el('div', { class: 'barra' });
  if (naLixeira) {
    barra.append(
      btnIcone('apagar', 'Excluir para sempre', () => apagarDeVez(n)),
      btnIcone('restaurar', 'Restaurar', () => acao(n, 'lixeira', false, 'Nota restaurada')));
  } else {
    barra.append(
      btnIcone('sino', 'Lembrete', e => popLembrete(e.currentTarget, n, render)),
      btnIcone('paleta', 'Cor', e => popCor(e.currentTarget, n, atualizar)),
      btnIcone('copiar', 'Copiar texto', e => { e.stopPropagation(); copiar(textoDaNota(n), 'Texto copiado'); }),
      n.arquivada
        ? btnIcone('desarquivar', 'Desarquivar', () => acao(n, 'arquivada', false, 'Nota desarquivada'))
        : btnIcone('arquivar', 'Arquivar', () => acao(n, 'arquivada', true, 'Nota arquivada')),
      btnIcone('lixo', 'Excluir', () => acao(n, 'lixeira', true, 'Nota movida para a lixeira')),
      btnIcone('marcador', 'Marcadores', e => popMarcadores(e.currentTarget, n, atualizar)),
    );
  }
  c.append(barra);
  return c;
}

// Grade em "alvenaria": cada cartão ocupa linhas conforme sua altura
const roGrade = new ResizeObserver(entradas => { for (const e of entradas) dimensionar(e.target); });
function dimensionar(card) {
  const linha = 4, gap = 16;
  const g = getComputedStyle(card.parentElement);
  const gapReal = parseFloat(g.rowGap) || gap;
  card.style.gridRowEnd = `span ${Math.ceil((card.getBoundingClientRect().height + gapReal) / (linha + gapReal))}`;
}
function ajustarGrade() {
  roGrade.disconnect();
  document.querySelectorAll('.cartao').forEach(c => { dimensionar(c); roGrade.observe(c); });
}

function render() { renderLateral(); renderConteudo(); }

/* ---------- Editor ---------- */
let editando = null;
let ehNova = false;

function abrirEditor(n, nova = false) {
  editando = n; ehNova = nova;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  desenharEditor(true);
}

function fecharEditor() {
  if (!editando) return;
  const n = editando;
  fecharPop();
  n.itens = n.itens.filter(i => i.texto.trim());
  if (notaVazia(n)) {
    estado.notas = estado.notas.filter(x => x !== n);
    if (!ehNova) aviso('Nota vazia descartada');
  } else if (ehNova && !estado.notas.includes(n)) {
    estado.notas.push(n);
  }
  editando = null;
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  enviar(); render();
}
$('#modal').addEventListener('mousedown', e => { if (e.target.id === 'modal') fecharEditor(); });

function autoAltura(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }

function desenharEditor(focar = false, focoItem = null) {
  const n = editando;
  const ed = $('#editor');
  pintarCor(ed, n.cor);
  const redesenhar = (f = null) => desenharEditor(false, f);
  const mudou = () => { tocar(n); };

  const titulo = el('textarea', { class: 'titulo', placeholder: 'Título', rows: 1,
    oninput: e => { n.titulo = e.target.value.replace(/\n/g, ' '); autoAltura(e.target); mudou(); },
    onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); const p = ed.querySelector('textarea, .itens input[type=text], .novo-item input'); p && p.focus(); } },
  });
  const linhaTitulo = el('div', { class: 'linha-titulo' }, titulo,
    btnIcone(n.fixada ? 'pino' : 'pinoVazio', n.fixada ? 'Desafixar' : 'Fixar', () => { n.fixada = !n.fixada; if (n.fixada) n.arquivada = false; mudou(); redesenhar(); }, n.fixada ? 'ligado' : ''));

  titulo.value = n.titulo;
  requestAnimationFrame(() => autoAltura(titulo));
  const area = el('div', { class: 'area' }, linhaTitulo);

  if (n.tipo === 'texto') {
    const t = el('textarea', { placeholder: 'Criar uma nota…', oninput: e => { n.texto = e.target.value; autoAltura(e.target); mudou(); } });
    t.value = n.texto;
    area.append(t);
    requestAnimationFrame(() => autoAltura(t));
  } else {
    area.append(editorLista(n, redesenhar, focoItem));
  }

  const chips = el('div', { class: 'chips' });
  if (n.lembrete) chips.append(el('span', { class: 'chip' + (lembreteDisparado(n) ? ' passou' : ''), html: icone('sino') }, textoLembrete(n.lembrete) + iconesAlerta(n),
    el('button', { class: 'x', title: 'Remover lembrete', onclick: () => { n.lembrete = null; mudou(); redesenhar(); } }, '✕')));
  for (const id of n.marcadores) {
    const m = estado.marcadores.find(x => x.id === id);
    if (m) chips.append(el('span', { class: 'chip' }, m.nome,
      el('button', { class: 'x', title: 'Remover marcador', onclick: () => { n.marcadores = n.marcadores.filter(x => x !== id); mudou(); redesenhar(); } }, '✕')));
  }
  if (chips.children.length) area.append(chips);

  const info = el('div', { class: 'rodape-info' }, 'Editada ' + new Date(n.editada).toLocaleString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }));

  const barra = el('div', { class: 'barra-ed' },
    btnIcone('sino', 'Lembrete', e => popLembrete(e.currentTarget, n, () => redesenhar())),
    btnIcone('paleta', 'Cor', e => popCor(e.currentTarget, n, () => redesenhar())),
    btnIcone('copiar', 'Copiar texto', () => copiar(textoDaNota(n), 'Texto copiado')),
    btnIcone(n.tipo === 'lista' ? 'texto' : 'lista', n.tipo === 'lista' ? 'Converter em texto' : 'Converter em lista', () => { alternarTipo(n); redesenhar(); }),
    btnIcone('marcador', 'Marcadores', e => popMarcadores(e.currentTarget, n, () => { redesenhar(); renderLateral(); })),
    n.arquivada
      ? btnIcone('desarquivar', 'Desarquivar', () => { fecharEditor(); acao(n, 'arquivada', false, 'Nota desarquivada'); })
      : btnIcone('arquivar', 'Arquivar', () => { const nova = ehNova; fecharEditor(); if (nova && !estado.notas.includes(n)) return; acao(n, 'arquivada', true, 'Nota arquivada'); }),
    btnIcone('copiar', 'Fazer uma cópia', () => { fecharEditor(); if (estado.notas.includes(n)) duplicar(n); }),
    btnIcone('lixo', 'Excluir', () => { fecharEditor(); if (estado.notas.includes(n)) acao(n, 'lixeira', true, 'Nota movida para a lixeira'); }),
    el('button', { class: 'fechar', onclick: fecharEditor }, 'Fechar'),
  );

  ed.replaceChildren(area, info, barra);

  if (focoItem) {
    const alvo = ed.querySelector(`.itens input[data-id="${focoItem}"]`);
    if (alvo) { alvo.focus(); alvo.setSelectionRange(alvo.value.length, alvo.value.length); }
  }

  if (focar) {
    if (n.tipo === 'lista' && !n.titulo) titulo.focus();
    else if (n.tipo === 'texto') { const t = $('textarea', ed); t.focus(); t.setSelectionRange(t.value.length, t.value.length); }
    else titulo.focus();
  }
}

let mostrarConcluidos = true;
function editorLista(n, redesenhar, focoItem) {
  const caixa = el('div', { class: 'itens' });
  const pend = n.itens.filter(i => !i.feito);
  const feitos = n.itens.filter(i => i.feito);

  const linhaItem = i => {
    const txt = el('input', { type: 'text', value: i.texto,
      oninput: e => { i.texto = e.target.value; tocar(n); },
      onkeydown: e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const novo = { id: uid(), texto: '', feito: false };
          n.itens.splice(n.itens.indexOf(i) + 1, 0, novo);
          tocar(n); redesenhar(novo.id);
        } else if (e.key === 'Backspace' && !i.texto) {
          e.preventDefault();
          const lista = i.feito ? feitos : pend;
          const ant = lista[lista.indexOf(i) - 1];
          n.itens = n.itens.filter(x => x !== i); tocar(n); redesenhar(ant ? ant.id : 'novo');
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          const todos = [...caixa.querySelectorAll('input[type=text]')];
          const alvo = todos[todos.indexOf(e.target) + (e.key === 'ArrowDown' ? 1 : -1)];
          if (alvo) { e.preventDefault(); alvo.focus(); }
        }
      },
    });
    txt.dataset.id = i.id;
    const abrirLembrete = e => popLembrete(e.currentTarget, i, () => redesenhar(), n);
    return el('div', { class: 'item-ed' + (i.feito ? ' feito' : '') },
      el('input', { type: 'checkbox', checked: i.feito, onchange: () => { i.feito = !i.feito; tocar(n); redesenhar(); } }),
      txt,
      i.lembrete
        ? el('button', { class: 'chip lembrete-item-ed' + (itemDisparado(n, i) ? ' passou' : ''), title: 'Alterar lembrete deste item', onclick: abrirLembrete },
          '⏰ ' + textoLembrete(i.lembrete) + iconesAlerta(i))
        : btnIcone('sino', 'Lembrete só para este item', abrirLembrete, 'sino-item'),
      btnIcone('copiar', 'Copiar este item', () => copiar(i.texto, 'Item copiado')),
      btnIcone('fechar', 'Remover item', () => { n.itens = n.itens.filter(x => x !== i); tocar(n); redesenhar(); }));
  };

  caixa.append(...pend.map(linhaItem));
  const novoInp = el('input', { type: 'text', placeholder: 'Item da lista',
    oninput: e => {
      // Cria o item sem redesenhar tudo, para não perder as teclas seguintes
      const novo = { id: uid(), texto: e.target.value, feito: false };
      n.itens.push(novo); tocar(n);
      pend.push(novo);
      const linha = linhaItem(novo);
      novoInp.parentElement.before(linha);
      novoInp.value = '';
      const t = linha.querySelector('input[type=text]');
      t.focus(); t.setSelectionRange(t.value.length, t.value.length);
    },
  });
  novoInp.dataset.id = 'novo';
  caixa.append(el('div', { class: 'novo-item', html: icone('mais') }, novoInp));

  if (feitos.length) {
    const sec = el('div', { class: 'concluidos' },
      el('button', { onclick: () => { mostrarConcluidos = !mostrarConcluidos; redesenhar(); }, html: icone(mostrarConcluidos ? 'setaBaixo' : 'seta') },
        `${feitos.length} ${feitos.length === 1 ? 'item concluído' : 'itens concluídos'}`));
    if (mostrarConcluidos) sec.append(...feitos.map(linhaItem));
    caixa.append(sec);
  }

  return caixa;
}

/* ---------- Diálogo de marcadores ---------- */
function dialogoMarcadores() {
  const modal = $('#modal');
  const ed = $('#editor');
  pintarCor(ed, ''); ed.removeAttribute('data-cor');
  modal.hidden = false;
  const fechar = () => { modal.hidden = true; modal.removeEventListener('mousedown', foraClique); salvar(); render(); };
  const foraClique = e => { if (e.target === modal) fechar(); };
  modal.addEventListener('mousedown', foraClique);

  const desenhar = () => {
    const novo = el('input', { placeholder: 'Criar novo marcador', onkeydown: e => { if (e.key === 'Enter') criar(); } });
    const criar = () => {
      const nome = novo.value.trim();
      if (!nome || estado.marcadores.some(m => m.nome.toLowerCase() === nome.toLowerCase())) return;
      estado.marcadores.push({ id: uid(), nome }); salvar(); desenhar(); renderLateral();
      $('.dialogo input', ed).focus();
    };
    ed.replaceChildren(el('div', { class: 'dialogo' },
      el('div', { class: 'area' },
        el('h2', {}, 'Editar marcadores'),
        el('div', { class: 'linha' }, el('span', { class: 'icone-btn pequeno', html: icone('mais') }), novo, btnIcone('lista', 'Criar', criar)),
        ...estado.marcadores.map(m => el('div', { class: 'linha' },
          btnIcone('lixo', 'Excluir marcador', () => {
            if (!confirm(`Excluir o marcador "${m.nome}"? As notas não serão apagadas.`)) return;
            estado.marcadores = estado.marcadores.filter(x => x !== m);
            estado.notas.forEach(n => { n.marcadores = n.marcadores.filter(x => x !== m.id); });
            if (estado.vista === 'm:' + m.id) estado.vista = 'notas';
            salvar(); desenhar(); renderLateral();
          }),
          el('input', { value: m.nome, onchange: e => { const v = e.target.value.trim(); if (v) { m.nome = v; salvar(); renderLateral(); } } }),
          el('span', { class: 'icone-btn pequeno', html: icone('editar') })))),
      el('div', { class: 'acoes' }, el('button', { onclick: fechar }, 'Concluído'))));
  };
  desenhar();
  $('.dialogo input', ed).focus();
}

/* ---------- Topo / menus ---------- */
$('#criar-nota').onclick = () => abrirEditor(novaNota(marcadorDaVista()), true);
$('#criar-lista').onclick = () => abrirEditor(novaNota({ tipo: 'lista', ...marcadorDaVista() }), true);
$('#criar-lembrete').onclick = e => {
  const n = novaNota(marcadorDaVista());
  popLembrete(e.currentTarget, n, () => abrirEditor(n, true));
};
function marcadorDaVista() {
  const extra = {};
  if (estado.vista.startsWith('m:')) extra.marcadores = [estado.vista.slice(2)];
  return extra;
}

$('#btn-menu').onclick = () => {
  const nav = $('#lateral');
  if (window.innerWidth <= 760) nav.classList.toggle('aberta');
  else nav.classList.toggle('recolhida');
};

$('#busca').addEventListener('input', e => { estado.busca = e.target.value; renderConteudo(); });

$('#btn-tema').onclick = () => {
  const escuroAgora = getComputedStyle(document.documentElement).colorScheme.includes('dark');
  const novo = escuroAgora ? 'light' : 'dark';
  document.documentElement.dataset.theme = novo;
  try { localStorage.setItem('tema', novo); } catch (e) { /* sem armazenamento */ }
};

/* ---------- Configurações de som e celular ---------- */
const NOMES_SONS = { alarme: 'Despertador', sino: 'Sino', telefone: 'Telefone tocando', mensagem: 'Mensagem', concluido: 'Concluído' };
function dialogoConfig() {
  const modal = $('#modal');
  const ed = $('#editor');
  pintarCor(ed, ''); ed.removeAttribute('data-cor');
  modal.hidden = false;
  const cfg = { ...estado.config };
  const fechar = () => { modal.hidden = true; modal.removeEventListener('mousedown', foraClique); fecharDialogoAtual = null; render(); };
  const foraClique = e => { if (e.target === modal) fechar(); };
  modal.addEventListener('mousedown', foraClique);
  fecharDialogoAtual = fechar;

  const gerarTopico = () => 'notas-' + Array.from(crypto.getRandomValues(new Uint8Array(10)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');
  const som = el('select', {}, (cfg.sons || Object.keys(NOMES_SONS)).map(s => el('option', { value: s, selected: s === cfg.som }, NOMES_SONS[s] || s)));
  const rep = el('select', {}, [[30, '30 segundos'], [60, '1 minuto'], [120, '2 minutos'], [300, '5 minutos']].map(([v, t]) => el('option', { value: v, selected: v === Number(cfg.duracao_max || 60) }, t)));
  const topico = el('input', { value: cfg.ntfy_topico || gerarTopico(), spellcheck: false });
  const status = el('small', { class: 'status' });

  const gravar = async (extra = {}) => {
    const novo = { som: som.value, duracao_max: Number(rep.value), ntfy_topico: topico.value.trim(), ...extra };
    const r = await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novo) });
    if (!r.ok) throw new Error();
    await carregarConfig();
  };

  ed.replaceChildren(el('div', { class: 'dialogo config' },
    el('div', { class: 'area' },
      el('h2', {}, '🔊 Som no computador'),
      el('div', { class: 'campo' }, el('span', {}, 'Som do alarme'), som,
        el('button', { class: 'link', onclick: () => fetch('/api/testar-som', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ som: som.value }) }) }, '▶ Ouvir')),
      el('div', { class: 'campo' }, el('span', {}, 'Tocar por até'), rep),
      el('small', { class: 'dica' }, 'O alarme toca sem parar até você fechar a notificação (ou clicar em "Parar alarme").'),

      el('h2', {}, '📱 Vibrar no celular'),
      el('ol', {},
        el('li', {}, 'Instale o app gratuito ', el('b', {}, 'ntfy'), ' no celular (Play Store ou App Store).'),
        el('li', {}, 'No app, toque em ', el('b', {}, '+'), ' e inscreva-se neste canal (copie exatamente):'),
      ),
      el('div', { class: 'campo' }, topico,
        el('button', { class: 'link', onclick: () => { navigator.clipboard?.writeText(topico.value); aviso('Nome do canal copiado'); } }, 'Copiar')),
      el('ol', { start: 3 },
        el('li', {}, 'Clique em ', el('b', {}, 'Salvar e testar no celular'), ' — o celular deve vibrar.'),
        el('li', {}, 'Dica: no app ntfy, deixe as notificações de prioridade máxima com vibração ligada.')),
      el('p', { class: 'nota-privacidade' }, 'Os lembretes marcados com 📱 passam pelo serviço ntfy.sh para chegar ao celular. O nome do canal é secreto: quem não souber o nome não vê as mensagens. As demais notas nunca saem deste computador.'),
      el('div', { class: 'campo' },
        el('button', { class: 'link', onclick: async () => {
          if (!topico.value.trim()) return;
          status.textContent = 'Enviando…';
          try {
            await gravar();
            const r = await (await fetch('/api/testar-celular', { method: 'POST' })).json();
            status.textContent = r.ok ? '✅ Enviado! O celular vibrou?' : '❌ Não consegui enviar. A internet está funcionando?';
          } catch (e) { status.textContent = '❌ Erro ao salvar'; }
        } }, 'Salvar e testar no celular'),
        celularConfigurado() ? el('button', { class: 'link perigo', onclick: async () => {
          topico.value = ''; await gravar({ ntfy_topico: '' }); aviso('Celular desativado'); fechar();
        } }, 'Desativar celular') : null),
      status),
    el('div', { class: 'acoes' },
      el('button', { onclick: async () => {
        try { await gravar(); aviso('Configurações salvas'); fechar(); } catch (e) { aviso('Erro ao salvar'); }
      } }, 'Salvar'))));
}

$('#btn-mais').onclick = e => {
  if (NATIVO) return menuNativo(e.currentTarget);
  abrirPop(e.currentTarget, [
    el('button', { class: 'opcao', onclick: () => { fecharPop(); dialogoConfig(); } }, 'Som e celular…'),
    el('button', { class: 'opcao', onclick: async () => {
      fecharPop();
      await fetch('/api/testar-notificacao', { method: 'POST' });
      aviso('Alarme de teste disparado — feche a notificação para o som parar.');
    } }, 'Testar alarme'),
    el('button', { class: 'opcao', onclick: () => {
      fecharPop();
      const blob = new Blob([JSON.stringify({ notas: estado.notas, marcadores: estado.marcadores }, null, 1)], { type: 'application/json' });
      const a = el('a', { href: URL.createObjectURL(blob), download: `minhas-notas-${paraLocalISO(new Date()).slice(0, 10)}.json` });
      a.click(); URL.revokeObjectURL(a.href);
    } }, 'Exportar backup'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); $('#arquivo-importar').click(); } }, 'Importar backup'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Nuvem?.dialogo(); } }, 'Conectar aparelhos…'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Atualizar?.instalarOutro(); } }, 'Instalar em outro aparelho…'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Atualizar?.checar(); } }, 'Procurar atualização' + (typeof VERSAO_APP !== 'undefined' ? ` (versão ${VERSAO_APP})` : '')),
  ]);
};
$('#arquivo-importar').onchange = async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.notas)) throw new Error();
    const ids = new Set(estado.notas.map(n => n.id));
    const novas = d.notas.filter(n => !ids.has(n.id)).map(n => ({ ...novaNota(), ...n }));
    const mIds = new Set(estado.marcadores.map(m => m.id));
    estado.marcadores.push(...(d.marcadores || []).filter(m => !mIds.has(m.id)));
    estado.notas.push(...novas);
    salvar(); render();
    aviso(`${novas.length} nota(s) importada(s)`);
  } catch (err) {
    aviso('Arquivo inválido');
  }
};

// Atalho: "c" cria nota, "/" pesquisa
document.addEventListener('keydown', e => {
  if (!$('#modal').hidden || e.ctrlKey || e.metaKey || e.altKey) return;
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'c') { e.preventDefault(); $('#criar-nota').click(); }
  if (e.key === 'l') { e.preventDefault(); $('#criar-lista').click(); }
  if (e.key === '/') { e.preventDefault(); $('#busca').focus(); }
});

window.addEventListener('resize', () => requestAnimationFrame(ajustarGrade));

/* ---------- Somente no app Android ---------- */
// Um "canal" do Android por combinação de som/vibração
const CANAIS = [
  { id: 'som-vib', name: 'Lembretes com som e vibração', sound: 'alarme.ogg', vibration: true },
  { id: 'som', name: 'Lembretes só com som', sound: 'alarme.ogg', vibration: false },
  { id: 'vib', name: 'Lembretes só com vibração', sound: 'silencio.ogg', vibration: true },
  { id: 'silencio', name: 'Lembretes silenciosos', sound: 'silencio.ogg', vibration: false },
];
const canalDe = a => (a.som && a.vibrar ? 'som-vib' : a.som ? 'som' : a.vibrar ? 'vib' : 'silencio');
const idNumerico = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return (Math.abs(h) % 2000000000) + 1; };

function resumoNota(n) {
  if (n.tipo === 'lista') return n.itens.filter(i => !i.feito && i.texto.trim()).slice(0, 6).map(i => '• ' + i.texto).join('\n');
  return (n.texto || '').slice(0, 300);
}

async function prepararNativo() {
  const LN = Plug.LocalNotifications;
  try {
    for (const c of CANAIS) await LN.createChannel({ ...c, importance: 5, visibility: 1, lights: true });
    const p = await LN.checkPermissions();
    if (p.display !== 'granted') await LN.requestPermissions();
  } catch (e) { console.error(e); }
  // Tocar na notificação abre a nota
  LN.addListener('localNotificationActionPerformed', ev => {
    const n = estado.notas.find(x => x.id === ev.notification?.extra?.nota);
    if (n && !n.lixeira) { if (editando) fecharEditor(); abrirEditor(n); }
  });
  // Botão "voltar" do Android fecha o que estiver aberto antes de sair
  Plug.App.addListener('backButton', () => {
    if (popAtual) return fecharPop();
    if (fecharDialogoAtual) return fecharDialogoAtual();
    if (!$('#modal').hidden) return fecharEditor();
    if ($('#lateral').classList.contains('aberta')) return $('#lateral').classList.remove('aberta');
    if (estado.busca) { $('#busca').value = ''; estado.busca = ''; return renderConteudo(); }
    if (estado.vista !== 'notas') { estado.vista = 'notas'; return render(); }
    Plug.App.minimizeApp();
  });
  Plug.App.addListener('appStateChange', s => {
    if (s.isActive) atualizarSeMudou(true);
    else if (timerSalvar) enviar(); // saiu do app: salva na hora o que estava pendente
  });
  reagendar();
}

// Reagenda no Android todos os lembretes futuros (da nota e dos itens)
async function reagendar() {
  const LN = Plug.LocalNotifications;
  const pend = await LN.getPending();
  if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
  const agora = Date.now(), lista = [];
  const add = (chave, quando, alerta, titulo, corpo, notaId) => {
    const d = new Date(quando);
    if (!(d.getTime() > agora)) return;
    lista.push({
      id: idNumerico(chave), title: titulo, body: corpo || ' ', largeBody: corpo || ' ',
      schedule: { at: d, allowWhileIdle: true }, channelId: canalDe(alertaDe({ alerta })),
      smallIcon: 'ic_stat_notas', iconColor: '#F59E0B', extra: { nota: notaId },
    });
  };
  for (const n of estado.notas) {
    if (n.lixeira) continue;
    if (n.lembrete) add(`${n.id}|${n.lembrete}`, n.lembrete, n.alerta, '⏰ ' + (n.titulo || 'Lembrete'), resumoNota(n), n.id);
    if (n.tipo === 'lista') for (const i of n.itens) {
      if (i.lembrete && !i.feito) add(`${n.id}:${i.id}|${i.lembrete}`, i.lembrete, i.alerta,
        '⏰ ' + (i.texto || 'Item da lista'), 'Da lista: ' + (n.titulo || 'sem título'), n.id);
    }
  }
  if (lista.length) await LN.schedule({ notifications: lista });
}

// Risca os lembretes que já passaram (no celular não há servidor avisando)
let ultimoPendente = -1;
function atualizarSeMudou(forcar = false) {
  const total = estado.notas.filter(n => !n.lixeira).reduce((t, n) => t + lembretesPendentes(n), 0);
  if (forcar || total !== ultimoPendente) { ultimoPendente = total; if (!editando) render(); }
}

function menuNativo(ancora) {
  abrirPop(ancora, [
    el('button', { class: 'opcao', onclick: async () => {
      fecharPop();
      await Plug.LocalNotifications.schedule({ notifications: [{
        id: 1, title: '⏰ Teste de lembrete', body: 'Se apareceu, os lembretes estão funcionando! 🎉',
        schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true }, channelId: 'som-vib',
        smallIcon: 'ic_stat_notas', iconColor: '#F59E0B',
      }] });
      aviso('Lembrete de teste em 5 segundos — pode bloquear a tela');
    } }, 'Testar lembrete'),
    el('button', { class: 'opcao', onclick: async () => {
      fecharPop();
      try {
        const nome = `minhas-notas-${paraLocalISO(new Date()).slice(0, 10)}.json`;
        const r = await Plug.Filesystem.writeFile({ path: nome, directory: 'CACHE', encoding: 'utf8',
          data: JSON.stringify({ notas: estado.notas, marcadores: estado.marcadores }, null, 1) });
        await Plug.Share.share({ title: 'Backup Minhas Notas', url: r.uri, dialogTitle: 'Salvar backup em…' });
      } catch (e) { if (!/cancel/i.test(e.message || '')) aviso('Não consegui exportar'); }
    } }, 'Exportar backup'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); $('#arquivo-importar').click(); } }, 'Importar backup'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Nuvem?.dialogo(); } }, 'Conectar aparelhos…'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Atualizar?.instalarOutro(); } }, 'Instalar em outro aparelho…'),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); window.Atualizar?.checar(); } }, 'Procurar atualização' + (typeof VERSAO_APP !== 'undefined' ? ` (versão ${VERSAO_APP})` : '')),
    el('button', { class: 'opcao', onclick: () => { fecharPop(); dialogoMarcadores(); } }, 'Editar marcadores'),
  ]);
}

if (NATIVO) document.documentElement.classList.add('nativo');

carregar();
