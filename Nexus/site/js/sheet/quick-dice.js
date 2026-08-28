// ============================================================
// Rolagem Rápida de Dados Flutuante (Ficha do Personagem)
// Modal simplificado da mesa de dados com opções de dados e
// mostrador do valor rolado imediatamente ao clicar.
// ============================================================

import { DADOS_DND, gerarSvgDado, salvarNoHistorico } from '../pages/dados.js';
import { abrirModal, fecharModal, escHtml } from '../utils.js';

let _ultimoResultadoQuick = null;
let _historicoSessaoQuick = [];
let _estaRolandoQuick = false;

/**
 * Abre o modal de Rolagem Rápida de Dados na tela da ficha
 */
export function abrirModalRolagemRapida() {
  const tituloHtml = `
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="img/icons/ico-home-dados.png" style="width:22px;height:22px;object-fit:contain" alt="" onerror="this.outerHTML='<span style=\\'font-size:1.2rem\\'>🎲</span>'">
      <span>Rolagem Rápida de Dados</span>
    </div>
  `;

  const corpoHtml = `
    <div class="quick-dice-modal-body" id="quick-dice-modal-container">
      
      <!-- Mostrador do Valor Rolado -->
      <div id="quick-dice-display-slot">
        ${_gerarHtmlDisplay(_ultimoResultadoQuick)}
      </div>

      <!-- Seletor Rápido de Dados (Opções) -->
      <div class="quick-dice-selector-section">
        <div class="quick-dice-section-label">Escolha o dado para rolar:</div>
        <div class="quick-dice-grid" id="quick-dice-buttons-grid">
          ${DADOS_DND.map(d => `
            <button type="button" class="quick-dice-btn" data-quick-tipo="${d.tipo}" style="--dice-color: ${d.cor}" title="Rolar 1${d.nome}">
              <div class="quick-dice-btn-icon">
                ${gerarSvgDado(d.tipo, d.cor, false, 28)}
              </div>
              <div class="quick-dice-btn-label">${d.nome.toUpperCase()}</div>
              <div class="quick-dice-btn-sub">${d.faces} faces</div>
            </button>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  // Sem ações extras para manter a janela estritamente simplificada e elegante
  const acoesHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="fecharModal()" style="font-size:0.85rem">Fechar</button>
  `;

  abrirModal(tituloHtml, corpoHtml, acoesHtml);

  // Vincular eventos aos botões de dados
  _vincularEventosQuickDice();
}

/**
 * Gera o HTML do Mostrador de Valor Rolado
 */
function _gerarHtmlDisplay(resultado, emAnimacao = false, valorTemporario = null) {
  if (emAnimacao) {
    const dInfo = DADOS_DND.find(d => d.tipo === resultado?.tipo) || DADOS_DND[5];
    return `
      <div class="quick-dice-display is-rolling" style="border-color: ${dInfo.cor};">
        <div class="quick-dice-result-top">
          <span class="quick-dice-badge" style="background:${dInfo.cor}25;border-color:${dInfo.cor}60;color:#fff">
            ${gerarSvgDado(dInfo.tipo, dInfo.cor, true, 16)}
            <span>Rolar 1${dInfo.nome.toUpperCase()}</span>
          </span>
          <span style="font-size:0.75rem;color:var(--text-muted)">Rolando...</span>
        </div>
        <div class="quick-dice-number" style="color: ${dInfo.cor}; transform: scale(1.1);">${valorTemporario ?? '?'}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Sorteando resultado...</div>
      </div>
    `;
  }

  if (!resultado) {
    return `
      <div class="quick-dice-display empty-state-display">
        <div class="quick-dice-empty-state">
          <div class="quick-dice-empty-icon">${gerarSvgDado('d20', '#c8a051', false, 42)}</div>
          <div style="font-weight:600;color:var(--text);font-size:0.95rem;">Mesa de Dados Pronta</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">Clique em qualquer dado abaixo para rolar imediatamente.</div>
        </div>
      </div>
    `;
  }

  const dInfo = DADOS_DND.find(d => d.tipo === resultado.tipo) || DADOS_DND[5];
  let criticoBadge = '';
  let classeCritico = '';

  if (resultado.statusCritico === 'nat20') {
    classeCritico = 'is-nat20';
    criticoBadge = `
      <div class="quick-dice-crit-badge nat20">
        <img src="img/icons/ico-nat20.png" style="width:14px;height:14px;object-fit:contain" alt="" onerror="this.outerHTML='⭐'">
        <span>SUCESSO CRÍTICO (NATURAL 20!)</span>
      </div>
    `;
  } else if (resultado.statusCritico === 'nat1') {
    classeCritico = 'is-nat1';
    criticoBadge = `
      <div class="quick-dice-crit-badge nat1">
        <img src="img/icons/ico-nat1.png" style="width:14px;height:14px;object-fit:contain" alt="" onerror="this.outerHTML='💀'">
        <span>FALHA CRÍTICA (NATURAL 1!)</span>
      </div>
    `;
  }

  // Mini histórico da sessão rápida
  const historicoPillsHtml = _historicoSessaoQuick.length > 1 ? `
    <div class="quick-dice-history-strip">
      <span style="font-weight:600;margin-right:2px;">Recentes:</span>
      ${_historicoSessaoQuick.slice(0, 6).map((h, i) => `
        <span class="quick-dice-history-pill ${i === 0 ? 'pill-current' : ''}">
          <strong style="color:${h.cor}">${h.tipo.toUpperCase()}:</strong> ${h.valor}
        </span>
      `).join('')}
    </div>
  ` : '';

  return `
    <div class="quick-dice-display ${classeCritico}" style="border-color:${classeCritico ? '' : dInfo.cor + '70'};">
      <div class="quick-dice-result-top">
        <span class="quick-dice-badge" style="background:${dInfo.cor}25;border-color:${dInfo.cor}60;color:#fff">
          ${gerarSvgDado(dInfo.tipo, dInfo.cor, true, 16)}
          <span>1${dInfo.nome.toUpperCase()} (${dInfo.faces} faces)</span>
        </span>
        <span style="font-size:0.75rem;color:var(--text-muted);">${resultado.hora}</span>
      </div>

      <div class="quick-dice-number ${classeCritico ? '' : 'color-normal'}" style="${classeCritico ? '' : `color:${dInfo.cor};`}">
        ${resultado.total}
      </div>

      ${criticoBadge}

      ${historicoPillsHtml}
    </div>
  `;
}

/**
 * Executa a rolagem de um único dado selecionado
 */
function _executarRolagemDado(tipo) {
  if (_estaRolandoQuick) return;

  const dadoInfo = DADOS_DND.find(d => d.tipo === tipo) || DADOS_DND[5];
  const faces = dadoInfo.faces;
  _estaRolandoQuick = true;

  const displaySlot = document.getElementById('quick-dice-display-slot');
  const buttonsGrid = document.getElementById('quick-dice-buttons-grid');

  // Realçar botão ativo
  if (buttonsGrid) {
    buttonsGrid.querySelectorAll('.quick-dice-btn').forEach(btn => {
      const isSelected = btn.dataset.quickTipo === tipo;
      btn.classList.toggle('ativo', isSelected);
      const iconWrap = btn.querySelector('.quick-dice-btn-icon');
      if (iconWrap) {
        iconWrap.innerHTML = gerarSvgDado(btn.dataset.quickTipo, btn.style.getPropertyValue('--dice-color') || '#c8a051', isSelected, 28);
      }
    });
  }

  // Animação de sorteio rápido
  let frameCount = 0;
  const maxFrames = 5;
  const interval = setInterval(() => {
    frameCount++;
    const tempNum = Math.floor(Math.random() * faces) + 1;
    if (displaySlot) {
      displaySlot.innerHTML = _gerarHtmlDisplay({ tipo }, true, tempNum);
    }
    if (frameCount >= maxFrames) {
      clearInterval(interval);
      _finalizarRolagem(dadoInfo);
    }
  }, 30);
}

/**
 * Conclui a rolagem e grava no histórico
 */
function _finalizarRolagem(dadoInfo) {
  const faces = dadoInfo.faces;
  const valorRolado = Math.floor(Math.random() * faces) + 1;

  let statusCritico = null;
  if (dadoInfo.tipo === 'd20') {
    if (valorRolado === 20) statusCritico = 'nat20';
    else if (valorRolado === 1) statusCritico = 'nat1';
  }

  const agora = new Date();
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const resultado = {
    id: 'quick_roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    tipo: dadoInfo.tipo,
    faces: dadoInfo.faces,
    qtd: 1,
    mod: 0,
    modo: 'normal',
    descricao: 'Rolagem Rápida da Ficha',
    dadosMantidos: [valorRolado],
    dadosDescartados: [],
    paresAdvDisadv: [],
    somaDados: valorRolado,
    total: valorRolado,
    statusCritico,
    hora: horaFormatada,
    timestamp: Date.now()
  };

  _ultimoResultadoQuick = resultado;

  // Registrar na lista de recentes da sessão
  _historicoSessaoQuick.unshift({
    tipo: dadoInfo.tipo,
    valor: valorRolado,
    cor: dadoInfo.cor,
    statusCritico
  });
  if (_historicoSessaoQuick.length > 8) {
    _historicoSessaoQuick.pop();
  }

  // Salvar no histórico global de rolagens
  try {
    salvarNoHistorico(resultado);
  } catch (e) {
    // Ignorar falhas silenciosamente
  }

  _estaRolandoQuick = false;

  const displaySlot = document.getElementById('quick-dice-display-slot');
  if (displaySlot) {
    displaySlot.innerHTML = _gerarHtmlDisplay(resultado);
  }
}

/**
 * Vincula cliques aos botões de dados
 */
function _vincularEventosQuickDice() {
  const container = document.getElementById('quick-dice-modal-container');
  if (!container) return;

  container.querySelectorAll('[data-quick-tipo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tipo = btn.dataset.quickTipo;
      if (tipo) {
        _executarRolagemDado(tipo);
      }
    });
  });
}

/**
 * Configura o listener do botão flutuante de rolagem rápida (FAB)
 */
export function setupEventosRolagemRapida() {
  const btnFabDados = document.getElementById('fab-toggle-dados');
  if (btnFabDados) {
    btnFabDados.onclick = () => {
      abrirModalRolagemRapida();
    };
  }
}
