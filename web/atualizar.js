/* Minhas Notas — avisa quando há versão nova e atualiza.
 * PC (Linux/Windows): o servidor baixa o pacote novo, troca só os arquivos do programa (as notas ficam) e reinicia.
 * Celular: abre o download do APK novo; o Android pede para tocar em "Atualizar".
 */
const VERSAO_APP = '1.4.0';
(function () {
  'use strict';
  const SITE = 'https://minhas-notas-22fae.web.app';
  const maior = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
  let ultima = null;

  async function buscar() {
    const r = await fetch(SITE + '/versao.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }
  async function checar(manual) {
    try {
      const v = await buscar(); ultima = v;
      if (maior(v.versao, VERSAO_APP)) {
        const adiada = (() => { try { return JSON.parse(localStorage.getItem('mn-adiar') || '{}'); } catch (e) { return {}; } })();
        if (manual || adiada.versao !== v.versao || Date.now() > (adiada.ate || 0)) mostrar(v);
      } else if (manual) aviso(`Você já está na versão mais nova (${VERSAO_APP})`);
    } catch (e) { if (manual) aviso('Não consegui procurar atualização. Tem internet?'); }
  }
  function faixa() {
    let f = document.getElementById('faixa-atualizacao');
    if (!f) { f = el('div', { class: 'faixa-atualizacao', id: 'faixa-atualizacao' }); const c = document.getElementById('conteudo'); c.parentNode.insertBefore(f, c.previousElementSibling || c); }
    return f;
  }
  function mostrar(v) {
    const f = faixa(); f.hidden = false;
    f.replaceChildren(
      el('div', { class: 'txt' }, el('b', {}, `Nova versão ${v.versao} disponível`), v.novidades ? el('span', {}, ' — ' + v.novidades) : null),
      el('div', { class: 'botoes' },
        el('button', { class: 'link', onclick: () => { try { localStorage.setItem('mn-adiar', JSON.stringify({ versao: v.versao, ate: Date.now() + 86400000 })); } catch (e) {} f.hidden = true; } }, 'Depois'),
        el('button', { class: 'botao-atualizar', onclick: () => atualizar(v) }, 'Atualizar agora')));
  }
  async function atualizar(v) {
    const f = faixa();
    if (NATIVO) {   // celular: baixa o APK pelo navegador; o Android confirma a instalação
      f.replaceChildren(el('div', { class: 'txt' }, 'Baixando a versão nova… Quando terminar, abra o arquivo e toque em ', el('b', {}, 'Atualizar'), '. Suas notas continuam.'));
      location.href = /^https?:/.test(v.android || '') ? v.android : SITE + '/' + (v.android || '');
      return;
    }
    f.replaceChildren(el('div', { class: 'txt' }, el('b', {}, 'Atualizando…'), ' não feche o app.'));
    try {
      const r = await fetch('/api/atualizar', { method: 'POST' });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.mensagem || ('erro ' + r.status));
    } catch (e) {
      f.replaceChildren(el('div', { class: 'txt' }, 'Não deu para atualizar sozinho: ' + e.message + ' Baixe em ', el('a', { href: SITE, target: '_blank' }, SITE.replace('https://', '')), '.'));
      return;
    }
    // espera o servidor voltar com o código novo e recarrega
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try { const r = await fetch('/api/notas', { cache: 'no-store' }); if (r.ok && i > 1) { location.reload(); return; } } catch (e) {}
    }
    f.replaceChildren(el('div', { class: 'txt' }, 'Atualizado. Feche e abra o Minhas Notas.'));
  }

  window.Atualizar = { checar: () => checar(true), versao: VERSAO_APP };
  setTimeout(() => checar(false), 4000);
  setInterval(() => checar(false), 6 * 3600000);
})();
