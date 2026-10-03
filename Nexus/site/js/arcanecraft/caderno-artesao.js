// ============================================================
// Arcane Craft - Caderno do Artesão (Fichas Salvas & Histórico)
// ============================================================
import { escHtml, toast, abrirModal, fecharModal } from '../utils.js';
import {
  listarFichasProcesso,
  excluirFichaProcesso,
  GRAUS_MATERIAL,
  POSTOS_ASSOCIACAO
} from './arcanecraft-dados.js';
import { getInfoExaustao } from './motor-esforco.js';
import { abrirModalFichaOficial, imprimirFichaOficial } from './impressao-arcanecraft.js';

let _filtroTipoCaderno = 'todos'; // 'todos', 'crafting', 'alchemy', 'enchanting'

export function renderCadernoArtesao(container, onAbrirWizard) {
  const fichas = listarFichasProcesso();

  const filtradas = fichas.filter(f => {
    if (_filtroTipoCaderno === 'todos') return true;
    return f.tipoProcesso === _filtroTipoCaderno;
  });

  const totalCraft = fichas.filter(f => f.tipoProcesso === 'crafting').length;
  const totalAlch = fichas.filter(f => f.tipoProcesso === 'alchemy').length;
  const totalEnch = fichas.filter(f => f.tipoProcesso === 'enchanting').length;
  const totalObrasPrimas = fichas.filter(f => f.obraPrima).length;

  container.innerHTML = `
    <div class="ac-caderno-container">

      <!-- HERO DO CADERNO -->
      <div class="ac-banner-intro" style="border-color: rgba(200, 160, 81, 0.4);">
        <div class="ac-banner-intro-title">
          <span>📖 Caderno de Registros do Artesão</span>
          <span class="ac-badge-counter">${fichas.length} Fichas Arquivadas</span>
        </div>
        <p class="ac-banner-intro-desc">
          Arquivo cronológico com todos os projetos de Criação de Itens, fórmulas de Alquimia e rituais de Encantamento documentados. Você pode consultar qualquer ficha salva a qualquer momento, visualizar o espelho oficial e reimprimir.
        </p>
      </div>

      <!-- MÉTRICAS DO CADERNO -->
      <div class="ac-caderno-stats-grid">
        <div class="ac-caderno-stat-card">
          <span class="ac-stat-num gold">${fichas.length}</span>
          <span class="ac-stat-label">Total de Processos</span>
        </div>
        <div class="ac-caderno-stat-card">
          <span class="ac-stat-num" style="color:#c8a051;">${totalCraft}</span>
          <span class="ac-stat-label">Itens de Forja / Ofício</span>
        </div>
        <div class="ac-caderno-stat-card">
          <span class="ac-stat-num" style="color:#34d399;">${totalAlch}</span>
          <span class="ac-stat-label">Fórmulas Alquímicas</span>
        </div>
        <div class="ac-caderno-stat-card">
          <span class="ac-stat-num" style="color:#c084fc;">${totalEnch}</span>
          <span class="ac-stat-label">Rituais de Encantamento</span>
        </div>
        <div class="ac-caderno-stat-card">
          <span class="ac-stat-num" style="color:#f59e0b;">${totalObrasPrimas}</span>
          <span class="ac-stat-label">Obras-Primas (Nat 20)</span>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="ac-caderno-filter-bar">
        <div class="ac-filter-pill-group">
          <button class="ac-filter-pill ${_filtroTipoCaderno === 'todos' ? 'ativo' : ''}" data-tipo="todos">
            Todas (${fichas.length})
          </button>
          <button class="ac-filter-pill ${_filtroTipoCaderno === 'crafting' ? 'ativo' : ''}" data-tipo="crafting">
            <span class="ac-txt-desktop">⚒️ Criação de Itens (${totalCraft})</span>
            <span class="ac-txt-mobile">⚒️ Criação (${totalCraft})</span>
          </button>
          <button class="ac-filter-pill ${_filtroTipoCaderno === 'alchemy' ? 'ativo' : ''}" data-tipo="alchemy">
            ⚗️ Alquimia (${totalAlch})
          </button>
          <button class="ac-filter-pill ${_filtroTipoCaderno === 'enchanting' ? 'ativo' : ''}" data-tipo="enchanting">
            <span class="ac-txt-desktop">✨ Encantamento (${totalEnch})</span>
            <span class="ac-txt-mobile">✨ Encanto (${totalEnch})</span>
          </button>
        </div>

        <button class="btn btn-primary btn-sm" id="ac-caderno-btn-novo-processo">
          <span class="ac-txt-desktop">+ Novo Processo de Criação</span>
          <span class="ac-txt-mobile">+ Novo Processo</span>
        </button>
      </div>

      <!-- LISTA DE FICHAS ARQUIVADAS -->
      ${filtradas.length === 0 ? `
        <div class="ac-empty-caderno">
          <div class="ac-empty-icon">📜</div>
          <h3>Nenhuma ficha de processo encontrada</h3>
          <p>
            Você ainda não arquivou processos no seu Caderno. Inicie um processo de <strong>Criação de Itens</strong>, <strong>Alquimia</strong> ou <strong>Encantamento</strong> na Oficina para gerar suas fichas oficiais!
          </p>
          <button class="btn btn-primary" id="ac-empty-btn-iniciar">
            Ir para a Oficina de Criação →
          </button>
        </div>
      ` : `
        <div class="ac-fichas-cards-grid">
          ${filtradas.map(f => {
            const dataFmt = new Date(f.data).toLocaleDateString();
            const horaFmt = new Date(f.data).toLocaleTimeString();
            let icone = '⚒️';
            let cor = '#c8a051';
            let labelTipo = 'Criação de Item';
            if (f.tipoProcesso === 'alchemy') {
              icone = '⚗️';
              cor = '#34d399';
              labelTipo = 'Alquimia';
            } else if (f.tipoProcesso === 'enchanting') {
              icone = '✨';
              cor = '#c084fc';
              labelTipo = 'Encantamento';
            }

            return `
              <div class="ac-ficha-saved-card" style="border-top-color: ${cor};">
                <div class="ac-ficha-card-top">
                  <span class="ac-ficha-icon" style="background:${cor}22; border-color:${cor}55;">${icone}</span>
                  <div class="ac-ficha-card-titles">
                    <span class="ac-ficha-type-tag" style="color:${cor};">${labelTipo}</span>
                    <h4 class="ac-ficha-title">${escHtml(f.titulo)}</h4>
                    <span class="ac-ficha-sub">${escHtml(f.subtitulo || '')}</span>
                  </div>
                  <span class="ac-ficha-stamp-mini ${f.sucesso ? 'sucesso' : 'falha'}">
                    ${f.obraPrima ? 'OBRA-PRIMA' : f.sucesso ? 'SUCESSO' : 'FALHA'}
                  </span>
                </div>

                <div class="ac-ficha-card-meta">
                  <span><strong>Artesão:</strong> ${escHtml(f.artesao)}</span>
                  <span><strong>Dificuldade:</strong> CD ${f.cdFinal}</span>
                  <span><strong>Esforço:</strong> ${f.esforcoAtingido || f.dados?.ultimoResultado?.progressoAtual || f.dados?.sessaoEsforco?.progressoAtual || f.totalRolado} / ${f.esforcoAlvo || f.dados?.ultimoResultado?.esforcoAlvo || f.dados?.sessaoEsforco?.esforcoAlvo || '-'} UE (${f.ciclosCount || f.dados?.ultimoResultado?.ciclosCount || 1} ciclos)</span>
                  <span><strong>Exaustão:</strong> Nv ${f.nivelExaustao !== undefined ? f.nivelExaustao : (f.dados?.ultimoResultado?.nivelExaustaoFinal ?? 0)}</span>
                  <span><strong>Data:</strong> ${dataFmt} às ${horaFmt}</span>
                </div>

                <div class="ac-ficha-card-footer">
                  <button class="btn btn-sm btn-outline ac-btn-abrir-ficha" data-id="${f.id}">
                    📜 Abrir Ficha Completa
                  </button>
                  <button class="btn btn-sm btn-outline text-danger ac-btn-excluir-ficha" data-id="${f.id}" title="Excluir ficha">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}

    </div>
  `;

  _setupEventosCaderno(container, onAbrirWizard);
}

function _setupEventosCaderno(container, onAbrirWizard) {
  container.querySelectorAll('.ac-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      _filtroTipoCaderno = btn.dataset.tipo;
      renderCadernoArtesao(container, onAbrirWizard);
    });
  });

  const btnNovo = container.querySelector('#ac-caderno-btn-novo-processo');
  if (btnNovo && onAbrirWizard) {
    btnNovo.addEventListener('click', () => onAbrirWizard('crafting'));
  }

  const btnEmpty = container.querySelector('#ac-empty-btn-iniciar');
  if (btnEmpty && onAbrirWizard) {
    btnEmpty.addEventListener('click', () => onAbrirWizard('crafting'));
  }

  // Abrir Ficha Modal
  container.querySelectorAll('.ac-btn-abrir-ficha').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      _abrirModalFichaSalva(id);
    });
  });

  // Excluir Ficha
  container.querySelectorAll('.ac-btn-excluir-ficha').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Deseja realmente excluir esta ficha do seu Caderno de Registros?')) {
        excluirFichaProcesso(id);
        toast('Ficha removida do Caderno.');
        renderCadernoArtesao(container, onAbrirWizard);
      }
    });
  });
}

function _abrirModalFichaSalva(id) {
  const fichas = listarFichasProcesso();
  const f = fichas.find(x => x.id === id);
  if (!f) return;

  abrirModalFichaOficial(f.tipoProcesso, f, { isCaderno: true });
}
