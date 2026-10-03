// ============================================================
// Página Principal: Arcane Craft - Compêndio Avançado de Ofício
// Baseado no Livro de Regras (Partes 1, 2 e 3) e Apêndices 1, 2 e 3
// ============================================================
import { definirTituloHeader, navegar } from '../app.js';
import { toast, escHtml } from '../utils.js';
import {
  criarEstadoInicialCrafting,
  renderWizardCrafting
} from '../arcanecraft/processo-crafting.js';
import {
  criarEstadoInicialAlchemy,
  renderWizardAlchemy
} from '../arcanecraft/processo-alchemy.js';
import {
  criarEstadoInicialEnchanting,
  renderWizardEnchanting
} from '../arcanecraft/processo-enchanting.js';
import {
  renderBancoMateriais
} from '../arcanecraft/banco-materiais.js';
import {
  renderRegrasCompendio
} from '../arcanecraft/regras-compendio.js';
import {
  renderCadernoArtesao
} from '../arcanecraft/caderno-artesao.js';
import {
  tornarBarraDeslizavel
} from '../arcanecraft/arcanecraft-ui.js';

let _containerRef = null;

// Abas de topo do módulo Arcane Craft
let _abaPrincipal = 'oficina'; // 'oficina', 'banco', 'regras', 'caderno'

// Sub-aba dentro da Oficina de Criação (3 Processos Separados)
let _subProcessoOficina = 'crafting'; // 'crafting', 'alchemy', 'enchanting'

// Estados dos Wizards preservados em memória durante a sessão
let _stateCrafting = criarEstadoInicialCrafting();
let _stateAlchemy = criarEstadoInicialAlchemy();
let _stateEnchanting = criarEstadoInicialEnchanting();

export function renderArcaneCraft(container, param) {
  _containerRef = container;
  definirTituloHeader('Arcane Craft Compendium');

  if (param) {
    const p = String(param).toLowerCase().trim();
    if (p === 'crafting' || p === 'forja' || p === 'oficina/crafting') {
      _abaPrincipal = 'oficina';
      _subProcessoOficina = 'crafting';
    } else if (p === 'alchemy' || p === 'alquimia' || p === 'laboratorio' || p === 'oficina/alchemy') {
      _abaPrincipal = 'oficina';
      _subProcessoOficina = 'alchemy';
    } else if (p === 'enchanting' || p === 'encantamento' || p === 'circulo' || p === 'oficina/enchanting') {
      _abaPrincipal = 'oficina';
      _subProcessoOficina = 'enchanting';
    } else if (p === 'banco' || p === 'materiais') {
      _abaPrincipal = 'banco';
    } else if (p === 'regras' || p === 'compendio' || p === 'livro') {
      _abaPrincipal = 'regras';
    } else if (p === 'caderno' || p === 'fichas') {
      _abaPrincipal = 'caderno';
    }
  }

  _desenharModulo();
}

// Handler global para abrir diretamente qualquer oficina/processo a partir de regras ou links
window._acAbrirOficina = function(processoAlvo) {
  _abaPrincipal = 'oficina';
  _subProcessoOficina = processoAlvo || 'crafting';
  _desenharModulo();
  const el = document.getElementById('ac-main-area-target') || document.getElementById('app-content');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

function _desenharModulo() {
  if (!_containerRef) return;

  _containerRef.innerHTML = `
    <div class="arcanecraft-layout">

      <!-- CABEÇALHO DO MÓDULO (PADRÃO NEXUS D&D) -->
      <div class="arcanecraft-hero">
        <div>
          <div class="arcanecraft-hero-title">
            <img src="img/icons/ico-classe-artifice.png" class="page-hero-ico" alt="Arcane Craft">
            <span>Arcane Craft Compendium</span>
            <span class="badge-beta">BETA</span>
          </div>
          <div class="arcanecraft-hero-desc">
            Virtualização completa das regras de <strong>Criação de Itens (Crafting)</strong>, <strong>Alquimia (Alchemy)</strong> e <strong>Encantamento (Enchanting)</strong>. Condução guiada passo a passo para forjar equipamentos, destilar poções e imbuir itens com base nos modelos oficiais de ficha de processo e apêndices de materiais.
          </div>
        </div>
      </div>

      <!-- BARRA DE NAVEGAÇÃO PRINCIPAL (ABAS DE TOPO) COM SUPORTE TOTAL A TOQUE, MOUSE DRAG, WHEEL E SETAS -->
      <div class="ac-tabs-nav-wrapper">
          <button class="ac-nav-arrow-btn ac-nav-arrow-prev" id="ac-tab-nav-prev" type="button" aria-label="Aba anterior" title="Rolar abas para a esquerda">
            ‹
          </button>
          <div class="ac-tabs-bar" id="ac-main-tabs-bar" role="tablist" aria-label="Navegação do Compêndio Arcane Craft">
            <button class="ac-tab-btn ${_abaPrincipal === 'oficina' ? 'ativo' : ''}" data-tab="oficina" role="tab" type="button" aria-selected="${_abaPrincipal === 'oficina'}">
              <span class="ac-tab-icon">⚒️</span>
              <span class="ac-tab-label-group">
                <span class="ac-tab-title">
                  <span class="ac-txt-desktop">Oficina de Criação</span>
                  <span class="ac-txt-mobile">Oficina</span>
                </span>
                <span class="ac-tab-subtitle">Processos Guiados</span>
              </span>
            </button>
            <button class="ac-tab-btn ${_abaPrincipal === 'banco' ? 'ativo' : ''}" data-tab="banco" role="tab" type="button" aria-selected="${_abaPrincipal === 'banco'}">
              <span class="ac-tab-icon">📚</span>
              <span class="ac-tab-label-group">
                <span class="ac-tab-title">
                  <span class="ac-txt-desktop">Banco de Dados</span>
                  <span class="ac-txt-mobile">Banco</span>
                </span>
                <span class="ac-tab-subtitle">Materiais & Apêndices</span>
              </span>
            </button>
            <button class="ac-tab-btn ${_abaPrincipal === 'regras' ? 'ativo' : ''}" data-tab="regras" role="tab" type="button" aria-selected="${_abaPrincipal === 'regras'}">
              <span class="ac-tab-icon">📜</span>
              <span class="ac-tab-label-group">
                <span class="ac-tab-title">
                  <span class="ac-txt-desktop">Livro de Regras</span>
                  <span class="ac-txt-mobile">Regras</span>
                </span>
                <span class="ac-tab-subtitle">Regras Oficiais 5.5e</span>
              </span>
            </button>
            <button class="ac-tab-btn ${_abaPrincipal === 'caderno' ? 'ativo' : ''}" data-tab="caderno" role="tab" type="button" aria-selected="${_abaPrincipal === 'caderno'}">
              <span class="ac-tab-icon">📖</span>
              <span class="ac-tab-label-group">
                <span class="ac-tab-title">
                  <span class="ac-txt-desktop">Caderno do Artesão</span>
                  <span class="ac-txt-mobile">Caderno</span>
                </span>
                <span class="ac-tab-subtitle">Fichas & Histórico</span>
              </span>
            </button>
          </div>
          <button class="ac-nav-arrow-btn ac-nav-arrow-next" id="ac-tab-nav-next" type="button" aria-label="Próxima aba" title="Rolar abas para a direita">
            ›
          </button>
        </div>

        <!-- ÁREA DE CONTEÚDO DINÂMICO CONFORME A ABA SELECIONADA -->
      <div class="ac-main-area" id="ac-main-area-target">
        ${_abaPrincipal === 'oficina' ? _renderSeletorSubProcessos() : ''}
        <div id="ac-sub-content-container"></div>
      </div>

    </div>
  `;

  _setupEventosModulo();
  _renderizarConteudoAba();
}

function _renderSeletorSubProcessos() {
  return `
    <div class="ac-subprocess-selector-card">
      <div class="ac-subprocess-intro">
        <span class="ac-subprocess-label">ESCOLHA O PROCESSO DE CRIAÇÃO:</span>
        <span class="ac-subprocess-hint">Cada processo segue as regras e o modelo de ficha específico da respectiva parte do livro</span>
      </div>

      <div class="ac-subprocess-buttons-grid">
        <button class="ac-sub-btn ${_subProcessoOficina === 'crafting' ? 'ativo' : ''}" data-processo="crafting" type="button">
          <div class="ac-sub-btn-icon">⚒️</div>
          <div class="ac-sub-btn-info">
            <span class="ac-sub-btn-title">
              <span class="ac-txt-desktop">Parte 1: Criação de Itens (Crafting)</span>
              <span class="ac-txt-mobile">1. Criação de Itens</span>
            </span>
            <span class="ac-sub-btn-desc">Armas, Armaduras, Escudos e Jóias</span>
          </div>
        </button>

        <button class="ac-sub-btn ${_subProcessoOficina === 'alchemy' ? 'ativo' : ''}" data-processo="alchemy" type="button">
          <div class="ac-sub-btn-icon" style="background: rgba(46, 124, 109, 0.2); border-color: rgba(46, 124, 109, 0.4);">⚗️</div>
          <div class="ac-sub-btn-info">
            <span class="ac-sub-btn-title">
              <span class="ac-txt-desktop">Parte 2: Alquimia (Alchemy)</span>
              <span class="ac-txt-mobile">2. Alquimia & Poções</span>
            </span>
            <span class="ac-sub-btn-desc">Poções de Cura, Elixires e Óleos</span>
          </div>
        </button>

        <button class="ac-sub-btn ${_subProcessoOficina === 'enchanting' ? 'ativo' : ''}" data-processo="enchanting" type="button">
          <div class="ac-sub-btn-icon" style="background: rgba(168, 85, 247, 0.2); border-color: rgba(168, 85, 247, 0.4);">✨</div>
          <div class="ac-sub-btn-info">
            <span class="ac-sub-btn-title">
              <span class="ac-txt-desktop">Parte 3: Encantamento (Enchanting)</span>
              <span class="ac-txt-mobile">3. Encantamento</span>
            </span>
            <span class="ac-sub-btn-desc">Essências Mágicas e Varinhas</span>
          </div>
        </button>
      </div>
    </div>
  `;
}

function _renderizarConteudoAba() {
  const target = _containerRef.querySelector('#ac-sub-content-container');
  if (!target) return;

  if (_abaPrincipal === 'oficina') {
    if (_subProcessoOficina === 'crafting') {
      renderWizardCrafting(
        target,
        _stateCrafting,
        (novoState) => {
          _stateCrafting = novoState;
          _renderizarConteudoAba();
        },
        () => {
          // Callback para ir direto ao banco de materiais
          _abaPrincipal = 'banco';
          _desenharModulo();
        }
      );
    } else if (_subProcessoOficina === 'alchemy') {
      renderWizardAlchemy(
        target,
        _stateAlchemy,
        (novoState) => {
          _stateAlchemy = novoState;
          _renderizarConteudoAba();
        },
        () => {
          _abaPrincipal = 'banco';
          _desenharModulo();
        }
      );
    } else if (_subProcessoOficina === 'enchanting') {
      renderWizardEnchanting(
        target,
        _stateEnchanting,
        (novoState) => {
          _stateEnchanting = novoState;
          _renderizarConteudoAba();
        },
        () => {
          _abaPrincipal = 'banco';
          _desenharModulo();
        }
      );
    }
  } else if (_abaPrincipal === 'banco') {
    renderBancoMateriais(target);
  } else if (_abaPrincipal === 'regras') {
    renderRegrasCompendio(target, (processoAlvo) => {
      _abaPrincipal = 'oficina';
      _subProcessoOficina = processoAlvo || 'crafting';
      _desenharModulo();
      const el = document.getElementById('ac-main-area-target') || document.getElementById('app-content');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  } else if (_abaPrincipal === 'caderno') {
    renderCadernoArtesao(target, (processoAlvo) => {
      _abaPrincipal = 'oficina';
      _subProcessoOficina = processoAlvo || 'crafting';
      _desenharModulo();
    });
  }
}

function _setupEventosModulo() {
  // Inicializa deslizamento suave com suporte a toque, mouse drag, roda e setas
  const mainTabsBar = _containerRef.querySelector('#ac-main-tabs-bar');
  const btnPrev = _containerRef.querySelector('#ac-tab-nav-prev');
  const btnNext = _containerRef.querySelector('#ac-tab-nav-next');
  if (mainTabsBar) {
    tornarBarraDeslizavel(mainTabsBar, {
      btnEsquerda: btnPrev,
      btnDireita: btnNext,
      passoScroll: 260,
      centralizarAtivo: true,
      seletorAtivo: '.ac-tab-btn.ativo'
    });

    // Delegação de eventos no container de abas para troca garantida
    mainTabsBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.ac-tab-btn');
      if (btn && btn.dataset.tab) {
        e.preventDefault();
        _abaPrincipal = btn.dataset.tab;
        _desenharModulo();
      }
    });
  }

  // Troca de Abas Principais (ouvintes diretos em cada botão para redundância)
  _containerRef.querySelectorAll('.ac-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      _abaPrincipal = btn.dataset.tab;
      _desenharModulo();
    });
  });

  // Troca de Sub-Processos na Oficina
  _containerRef.querySelectorAll('.ac-sub-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      _subProcessoOficina = btn.dataset.processo;
      _desenharModulo();
    });
  });
}
