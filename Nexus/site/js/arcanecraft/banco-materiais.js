// ============================================================
// Arcane Craft - Banco de Dados de Materiais & Apêndices
// Padrão de Cards Unificado com o Compêndio Principal do App
// Apêndice 1 (Criação), Apêndice 2 (Alquimia) e Apêndice 3 (Encantamento)
// ============================================================
import { escHtml, toast, abrirModal, fecharModal } from '../utils.js';
import {
  GRAUS_MATERIAL,
  APENDICE_COLHEITA,
  APENDICE_BIOMAS,
  APENDICE1_MATERIAIS,
  APENDICE2_ALQUIMIA,
  APENDICE3_ENCANTAMENTO,
  obterMateriaisApendice1,
  obterSubstratosApendice2,
  obterReagentesApendice2,
  obterReceitasBasicasApendice2,
  obterPropriedadesApendice3
} from './arcanecraft-dados.js';
import { REGRAS_CONDICOES } from './regras-dados-oficiais.js';
import { tornarBarraDeslizavel } from './arcanecraft-ui.js';

let _subAbaBanco = 'apendice1'; // 'apendice1', 'apendice2', 'apendice3', 'condicoes', 'simuladores'
let _filtroBusca = '';
let _filtroTier = 0; // 0 = todos
let _filtroCatApendice1 = 'todos'; // 'todos', 'metal', 'gema', 'fibra_madeira', 'criatura_exotica'
let _filtroSubApendice2 = 'substratos'; // 'substratos', 'reagentes', 'criaturas', 'receitas'
let _modoExibicaoSubstratos = 'cards'; // 'cards' ou 'tabela'
let _escolaApendice3 = 'abjuracao';
let _tierApendice3 = 1;

// Estados dos simuladores
let _simColheita = {
  indiceCriatura: 0,
  pericia: 'Sobrevivência',
  modificador: 5,
  resultado: null
};

let _simForrageamento = {
  idBioma: 'floresta',
  tempoHoras: 2,
  pericia: 'Natureza',
  modificador: 4,
  resultado: null
};

export function renderBancoMateriais(container) {
  container.innerHTML = `
    <div class="ac-banco-container">

      <!-- NAVEGAÇÃO DE SUB-ABAS DO BANCO DE DADOS COM SUPORTE A TOQUE, MOUSE DRAG, WHEEL E SETAS -->
      <div class="ac-tabs-nav-wrapper ac-banco-nav-wrapper">
        <button class="ac-nav-arrow-btn ac-nav-arrow-prev" id="ac-banco-nav-prev" type="button" aria-label="Sub-aba anterior" title="Rolar para a esquerda">
          ‹
        </button>
        <div class="ac-banco-nav-bar" id="ac-banco-sub-bar" role="tablist">
          <button class="ac-banco-nav-btn ${_subAbaBanco === 'apendice1' ? 'ativo' : ''}" data-sub="apendice1" type="button">
            <span class="ac-txt-desktop">🔨 Apêndice 1: Materiais de Criação</span>
            <span class="ac-txt-mobile">🔨 Materiais</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaBanco === 'apendice2' ? 'ativo' : ''}" data-sub="apendice2" type="button">
            <span class="ac-txt-desktop">🧪 Apêndice 2: Alquimia & Reagentes</span>
            <span class="ac-txt-mobile">🧪 Alquimia</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaBanco === 'apendice3' ? 'ativo' : ''}" data-sub="apendice3" type="button">
            <span class="ac-txt-desktop">🔮 Apêndice 3: Tabelas de Encantamento</span>
            <span class="ac-txt-mobile">🔮 Encanto</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaBanco === 'condicoes' ? 'ativo' : ''}" data-sub="condicoes" type="button">
            <span class="ac-txt-desktop">☣️ Condições, Mutações & Bosses</span>
            <span class="ac-txt-mobile">☣️ Condições</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaBanco === 'simuladores' ? 'ativo' : ''}" data-sub="simuladores" type="button">
            <span class="ac-txt-desktop">🧭 Simulador de Coleta & Biomas</span>
            <span class="ac-txt-mobile">🧭 Coleta</span>
          </button>
        </div>
        <button class="ac-nav-arrow-btn ac-nav-arrow-next" id="ac-banco-nav-next" type="button" aria-label="Próxima sub-aba" title="Rolar para a direita">
          ›
        </button>
      </div>

      <!-- BARRA DE PESQUISA & FILTROS GERAIS -->
      <div class="ac-search-box" style="margin-top: 14px;">
        <span class="ac-search-icon">🔍</span>
        <input type="text" id="ac-banco-search-input" placeholder="Pesquisar materiais, reagentes, efeitos, magias, graus..." value="${escHtml(_filtroBusca)}">
        ${_filtroBusca ? `<button class="ac-search-clear" id="ac-banco-search-clear">✕</button>` : ''}
      </div>

      <!-- CONTEÚDO DA SUB-ABA SELECIONADA -->
      <div class="ac-banco-content" id="ac-banco-content-area">
        ${_renderConteudoAbaBanco()}
      </div>

    </div>
  `;

  _setupEventosBanco(container);
}

function _renderConteudoAbaBanco() {
  switch (_subAbaBanco) {
    case 'apendice1':
      return _renderApendice1();
    case 'apendice2':
      return _renderApendice2();
    case 'apendice3':
      return _renderApendice3();
    case 'condicoes':
      return _renderCondicoesBanco();
    case 'simuladores':
      return _renderSimuladores();
    default:
      return '';
  }
}

// ============================================================
// HELPERS VISUAIS: TIERS, BADGES, RESUMOS
// ============================================================
function _getCorTier(tier) {
  switch (Number(tier)) {
    case 1: return '#94a3b8'; // Comum
    case 2: return '#22c55e'; // Incomum
    case 3: return '#3b82f6'; // Raro
    case 4: return '#a855f7'; // Muito Raro
    case 5: return '#f59e0b'; // Lendário
    default: return '#cbd5e1';
  }
}

function _obterClasseBadgeTier(tier) {
  switch (Number(tier)) {
    case 1: return 'c-badge-comum';
    case 2: return 'c-badge-incomum';
    case 3: return 'c-badge-raro';
    case 4: return 'c-badge-muito-raro';
    case 5: return 'c-badge-lendario';
    default: return 'c-badge-categoria';
  }
}

function _obterBadgeTier(tier) {
  const t = Number(tier) || 1;
  switch (t) {
    case 1: return { classe: 'c-badge-comum', label: 'Tier 1 (Comum)' };
    case 2: return { classe: 'c-badge-incomum', label: 'Tier 2 (Incomum)' };
    case 3: return { classe: 'c-badge-raro', label: 'Tier 3 (Raro)' };
    case 4: return { classe: 'c-badge-muito-raro', label: 'Tier 4 (Muito Raro)' };
    case 5: return { classe: 'c-badge-lendario', label: 'Tier 5 (Lendário)' };
    default: return { classe: 'c-badge-categoria', label: `Tier ${t}` };
  }
}

function _obterBadgeCd(cdMod) {
  if (cdMod === undefined || cdMod === null) return '';
  const num = Number(cdMod);
  if (num > 0) {
    return `<span class="c-badge c-badge-circulo" title="Penalidade na CD de Criação">+${num} CD</span>`;
  } else if (num < 0) {
    return `<span class="c-badge c-badge-incomum" title="Facilita a CD de Criação">${num} CD</span>`;
  } else {
    return `<span class="c-badge c-badge-categoria" title="CD Padrão">0 CD</span>`;
  }
}

function _resumoCurto(texto, maxLen = 115) {
  if (!texto) return '';
  const limpo = texto.replace(/\s+/g, ' ').trim();
  if (limpo.length <= maxLen) return limpo;
  return limpo.substring(0, maxLen).trim() + '…';
}

function _getCategoriaLabel(cat) {
  switch (cat) {
    case 'metal': return 'Metal / Minério';
    case 'gema': return 'Gema Preciosa';
    case 'fibra_madeira': return 'Madeira / Fibra';
    case 'criatura_exotica': return 'Produto de Criatura';
    default: return 'Material';
  }
}

// ============================================================
// APÊNDICE 1: MATERIAIS DE CRIAÇÃO (Metais, Gemas, Madeiras, Exóticos)
// Cards no Padrão do Compêndio Principal
// ============================================================
function _renderApendice1() {
  const materiais = obterMateriaisApendice1(_filtroCatApendice1, _filtroTier, _filtroBusca);

  return `
    <div class="ac-section-banco">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>🔨 Apêndice 1: Materiais de Criação (Metais, Gemas, Fibras & Criaturas)</span>
          <span class="ac-badge-counter">${materiais.length} Itens Catalogados</span>
        </div>
        <p class="ac-banner-intro-desc">
          Catálogo dos materiais fundamentais para forja, carpintaria, alfaiataria e manufatura de armaduras e armas. Cada material possui seu <strong>Tier de Poder (1 a 5)</strong>, modificador de CD na forja e <strong>propriedades mecânicas concretas</strong>. Clique em qualquer card para abrir os detalhes completos.
        </p>
      </div>

      <!-- FILTROS DE CATEGORIA & TIER -->
      <div class="ac-filters-bar-row">
        <div class="ac-filter-group">
          <span class="ac-filter-lbl">Categoria:</span>
          <div class="ac-pill-btn-group">
            <button class="ac-pill-btn ${_filtroCatApendice1 === 'todos' ? 'ativo' : ''}" data-cat1="todos">Todos</button>
            <button class="ac-pill-btn ${_filtroCatApendice1 === 'metal' ? 'ativo' : ''}" data-cat1="metal">⚙️ Metais</button>
            <button class="ac-pill-btn ${_filtroCatApendice1 === 'gema' ? 'ativo' : ''}" data-cat1="gema">💎 Gemas</button>
            <button class="ac-pill-btn ${_filtroCatApendice1 === 'fibra_madeira' ? 'ativo' : ''}" data-cat1="fibra_madeira">🪵 Madeiras & Fibras</button>
            <button class="ac-pill-btn ${_filtroCatApendice1 === 'criatura_exotica' ? 'ativo' : ''}" data-cat1="criatura_exotica">🐉 Produtos Exóticos</button>
          </div>
        </div>

        <div class="ac-filter-group">
          <span class="ac-filter-lbl">Nível (Tier):</span>
          <div class="ac-pill-btn-group">
            <button class="ac-pill-btn ${_filtroTier === 0 ? 'ativo' : ''}" data-tier1="0">Todos</button>
            <button class="ac-pill-btn ${_filtroTier === 1 ? 'ativo' : ''}" data-tier1="1">Tier 1</button>
            <button class="ac-pill-btn ${_filtroTier === 2 ? 'ativo' : ''}" data-tier1="2">Tier 2</button>
            <button class="ac-pill-btn ${_filtroTier === 3 ? 'ativo' : ''}" data-tier1="3">Tier 3</button>
            <button class="ac-pill-btn ${_filtroTier === 4 ? 'ativo' : ''}" data-tier1="4">Tier 4</button>
            <button class="ac-pill-btn ${_filtroTier === 5 ? 'ativo' : ''}" data-tier1="5">Tier 5 (Lendário)</button>
          </div>
        </div>
      </div>

      <!-- GRID DE CARDS DOS MATERIAIS NO PADRÃO DO COMPÊNDIO -->
      <div class="compendio-grid" id="ac-grid-materiais-apendice1">
        ${materiais.length === 0 ? `
          <div class="ac-empty-state" style="grid-column: 1 / -1;">
            <p>Nenhum material encontrado com os filtros atuais.</p>
          </div>
        ` : materiais.map(m => {
          const badgeTier = _obterBadgeTier(m.tier);
          const corTier = _getCorTier(m.tier);
          const resumo = m.propriedades || m.descricao || 'Propriedades de integridade física e forja.';
          const matId = m.id || m.nome;

          return `
            <div class="compendio-card compendio-card-clickable ac-compendio-card" data-material-id="${escHtml(matId)}" style="border-left: 4px solid ${corTier};">
              <div class="compendio-card-header">
                <div>
                  <div class="compendio-card-title">${escHtml(m.nome)}</div>
                  <div class="compendio-card-subtitle">${escHtml(m.nomeEn ? `${m.nomeEn} • ` : '')}${_getCategoriaLabel(m.categoria)}</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                  <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
                  ${_obterBadgeCd(m.cdMod)}
                </div>
              </div>

              <div class="compendio-card-body">
                <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
                  ${escHtml(_resumoCurto(resumo, 120))}
                </p>

                <!-- DADOS PRINCIPAIS DO CARD -->
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 6px;">
                  <span class="c-badge c-badge-categoria" title="Custo Base Unitário">💰 ${m.custoPo} PO</span>
                  <span class="c-badge c-badge-categoria" title="Unidades de Esforço">⚡ ${m.unitEffort || 5} UE</span>
                  <span class="c-badge c-badge-sintonizacao" title="Crafting Mastery Exigido">CM ${m.cm || (10 + m.tier * 5)}</span>
                  ${m.afinidadeElemental ? `<span class="c-badge c-badge-escola" title="Afinidade Elemental">✨ ${escHtml(m.afinidadeElemental)}</span>` : ''}
                  ${(m.virtudesArmas?.inatas?.length || m.virtudesArmaduras?.inatas?.length || m.virtudesFoco?.inatas?.length) ? `<span class="c-badge c-badge-origem" title="Possui virtudes inatas para itens">🗡️🛡️ Virtudes</span>` : ''}
                  ${m.incompatibilidades && m.incompatibilidades !== 'Nenhuma' ? `<span class="c-badge c-badge-circulo" title="Restrições de uso">⚠️ Restrição</span>` : ''}
                </div>
              </div>

              <div class="compendio-card-footer">
                <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Modal de Detalhes Completos do Material
function _abrirModalMaterial(m) {
  const corTier = _getCorTier(m.tier);
  const badgeTier = _obterBadgeTier(m.tier);

  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <!-- HEADER BADGES -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
        <span class="c-badge c-badge-categoria">${_getCategoriaLabel(m.categoria)}</span>
        ${_obterBadgeCd(m.cdMod)}
        <span class="c-badge c-badge-sintonizacao">CM ${m.cm || (10 + m.tier * 5)} • Esforço: ${m.unitEffort || 5} UE</span>
        <span class="c-badge c-badge-categoria">💰 Custo Base: ${m.custoPo} PO</span>
      </div>

      <!-- DESCRIÇÃO GERAL -->
      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid ${corTier};">
        ${m.nomeEn ? `<div style="font-size: 0.84rem; margin-bottom: 6px; color: var(--ink); padding-bottom: 4px; border-bottom: 1px solid var(--border-light);"><strong>Nome Original (Inglês):</strong> <span style="font-style: italic; color: var(--gold-light);">${escHtml(m.nomeEn)}</span></div>` : ''}
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(m.descricao || 'Material catalogado para processos de criação.')}
        </div>
      </div>

      <!-- PROPRIEDADES MECÂNICAS NO ITEM FORJADO -->
      <div style="background: rgba(200, 160, 81, 0.08); border: 1px solid rgba(200, 160, 81, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
          <span style="color: var(--gold-light); font-size: 1.1rem;">✨</span>
          <strong style="color: var(--gold-light); font-family: 'Cinzel', serif; font-size: 0.95rem;">Efeito Mecânico no Item Forjado</strong>
        </div>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(m.propriedades)}
        </div>
      </div>

      <!-- INCOMPATIBILIDADES -->
      ${m.incompatibilidades && m.incompatibilidades !== 'Nenhuma' ? `
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 14px; color: #fca5a5;">
          <strong style="display: block; margin-bottom: 2px;">⚠️ Incompatibilidades & Restrições:</strong>
          <span style="font-size: 0.85rem;">${escHtml(m.incompatibilidades)}</span>
        </div>
      ` : ''}

      <!-- VIRTUDES INATAS -->
      ${(m.virtudesArmas?.inatas?.length || m.virtudesArmaduras?.inatas?.length || m.virtudesFoco?.inatas?.length) ? `
        <div style="margin-bottom: 14px;">
          <h4 style="font-size: 0.95rem; color: var(--gold-light); margin-bottom: 8px; font-family: 'Cinzel', serif; font-weight: 700;">
            Virtudes Inatas Específicas
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${m.virtudesArmas?.inatas?.length ? `
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-left: 3px solid #38bdf8; padding: 10px 12px; border-radius: var(--radius-sm);">
                <strong style="color: #38bdf8; font-size: 0.82rem; display: block; margin-bottom: 4px;">🗡️ Virtudes em Armas:</strong>
                <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; color: var(--ink); line-height: 1.45;">
                  ${m.virtudesArmas.inatas.map(v => `<li>${escHtml(v)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${m.virtudesArmaduras?.inatas?.length ? `
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-left: 3px solid #4ade80; padding: 10px 12px; border-radius: var(--radius-sm);">
                <strong style="color: #4ade80; font-size: 0.82rem; display: block; margin-bottom: 4px;">🛡️ Virtudes em Armaduras & Escudos:</strong>
                <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; color: var(--ink); line-height: 1.45;">
                  ${m.virtudesArmaduras.inatas.map(v => `<li>${escHtml(v)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${m.virtudesFoco?.inatas?.length ? `
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-left: 3px solid #c084fc; padding: 10px 12px; border-radius: var(--radius-sm);">
                <strong style="color: #c084fc; font-size: 0.82rem; display: block; margin-bottom: 4px;">🔮 Virtudes em Focos Arcanos & Implementos:</strong>
                <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; color: var(--ink); line-height: 1.45;">
                  ${m.virtudesFoco.inatas.map(v => `<li>${escHtml(v)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- DADOS ADICIONAIS GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 14px;">
        ${m.afinidadeElemental ? `
          <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Afinidade Elemental:</span>
            <strong style="color: var(--gold-light); font-size: 0.85rem;">${escHtml(m.afinidadeElemental)}</strong>
          </div>
        ` : ''}
        ${m.escolaAfinidade ? `
          <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Afinidade Arcana:</span>
            <strong style="color: #a78bfa; font-size: 0.85rem;">${escHtml(m.escolaAfinidade)}</strong>
          </div>
        ` : ''}
        ${m.familia ? `
          <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Origem de Criatura:</span>
            <strong style="color: #fb923c; font-size: 0.85rem;">${escHtml(m.familia)}</strong>
          </div>
        ` : ''}
        ${m.pesoMod ? `
          <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Impacto no Peso:</span>
            <strong style="color: var(--ink); font-size: 0.85rem;">${escHtml(m.pesoMod)}</strong>
          </div>
        ` : ''}
      </div>

      ${m.usos ? `
        <div style="margin-bottom: 14px; font-size: 0.85rem; color: var(--text-muted);">
          <strong style="color: var(--ink);">Aplicações & Usos Tradicionais:</strong> ${escHtml(m.usos)}
        </div>
      ` : ''}

      <!-- RODAPÉ DE INTEGRAÇÃO OFICINA -->
      <div style="padding: 10px 14px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #86efac; display: flex; align-items: center; gap: 8px;">
        <span>⚒️</span>
        <span>Este material alimenta automaticamente o <strong>Passo 3 (Seleção de Materiais)</strong> da Oficina de Criação de Itens.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">🔨 ${escHtml(m.nome)}</span> ${m.nomeEn ? `<small style="font-size:0.75rem; font-weight:400; color:var(--text-muted); font-style:italic;">(${escHtml(m.nomeEn)})</small>` : ''}`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// ============================================================
// APÊNDICE 2: ALQUIMIA (Substratos, Reagentes, Criaturas & Receitas)
// Cards no Padrão do Compêndio Principal
// ============================================================
function _renderApendice2() {
  return `
    <div class="ac-section-banco">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>🧪 Apêndice 2: Manual de Alquimia (Substratos, Reagentes & Receitas Básicas)</span>
        </div>
        <p class="ac-banner-intro-desc">
          Bases para preparação de elixires, poções, óleos e ácidos. Selecione entre os <strong>Substratos</strong> por estabilidade e tier, os <strong>Reagentes</strong> por propriedades químicas, a <strong>Lista de Criaturas</strong> ou as <strong>Receitas Básicas Oficiais</strong>. Clique em qualquer card para abrir os detalhes completos.
        </p>
      </div>

      <!-- SELETOR DE SUB-SEÇÃO DO APÊNDICE 2 -->
      <div class="ac-pill-btn-group" style="margin-bottom: 16px;">
        <button class="ac-pill-btn ${_filtroSubApendice2 === 'substratos' ? 'ativo' : ''}" data-sub2="substratos">
          <span class="ac-txt-desktop">💧 Substratos por Tier</span>
          <span class="ac-txt-mobile">💧 Substratos</span>
        </button>
        <button class="ac-pill-btn ${_filtroSubApendice2 === 'reagentes' ? 'ativo' : ''}" data-sub2="reagentes">
          <span class="ac-txt-desktop">🌿 Reagentes por Tier & Efeito</span>
          <span class="ac-txt-mobile">🌿 Reagentes</span>
        </button>
        <button class="ac-pill-btn ${_filtroSubApendice2 === 'criaturas' ? 'ativo' : ''}" data-sub2="criaturas">
          <span class="ac-txt-desktop">🐺 Reagentes de Criaturas (Por Família)</span>
          <span class="ac-txt-mobile">🐺 Criaturas</span>
        </button>
        <button class="ac-pill-btn ${_filtroSubApendice2 === 'receitas' ? 'ativo' : ''}" data-sub2="receitas">
          <span class="ac-txt-desktop">📜 Receitas Básicas Oficiais</span>
          <span class="ac-txt-mobile">📜 Receitas</span>
        </button>
      </div>

      ${_renderSubApendice2Conteudo()}
    </div>
  `;
}

function _renderSubApendice2Conteudo() {
  const q = _filtroBusca.toLowerCase().trim();

  // ------------------------------------------------------------
  // 1. SUBSTRATOS ALQUÍMICOS (CARDS NO PADRÃO DO COMPÊNDIO OU TABELA)
  // ------------------------------------------------------------
  if (_filtroSubApendice2 === 'substratos') {
    const substratos = APENDICE2_ALQUIMIA.substratos.filter(s =>
      !q || s.nome.toLowerCase().includes(q) || (s.nomeEn && s.nomeEn.toLowerCase().includes(q)) || (s.potencial && s.potencial.toLowerCase().includes(q)) || (s.tipo && s.tipo.toLowerCase().includes(q)) || (s.estabilidade && s.estabilidade.toLowerCase().includes(q)) || (s.descricao && s.descricao.toLowerCase().includes(q))
    );

    return `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span class="ac-badge-counter">${substratos.length} Substratos Catalogados (Tiers 1 a 5)</span>
        <div class="ac-pill-btn-group">
          <button class="ac-pill-btn ${_modoExibicaoSubstratos === 'cards' ? 'ativo' : ''}" data-view-sub="cards" title="Exibição em Cards">
            <span class="ac-txt-desktop">🃏 Visualização em Cards</span>
            <span class="ac-txt-mobile">🃏 Cards</span>
          </button>
          <button class="ac-pill-btn ${_modoExibicaoSubstratos === 'tabela' ? 'ativo' : ''}" data-view-sub="tabela" title="Exibição em Tabela">
            <span class="ac-txt-desktop">📋 Tabela Compacta</span>
            <span class="ac-txt-mobile">📋 Tabela</span>
          </button>
        </div>
      </div>

      ${_modoExibicaoSubstratos === 'cards' ? `
        <!-- GRID DE CARDS NO PADRÃO DO COMPÊNDIO -->
        <div class="compendio-grid" id="ac-grid-substratos">
          ${substratos.length === 0 ? `
            <div class="ac-empty-state" style="grid-column: 1 / -1;"><p>Nenhum substrato encontrado.</p></div>
          ` : substratos.map(s => {
            const badgeTier = _obterBadgeTier(s.tier);
            const corTier = _getCorTier(s.tier);
            const subId = s.id || s.nome;
            const resumo = s.potencial || s.efeitoPrimario || s.descricao || 'Solvente neutro para poções e elixires.';

            return `
              <div class="compendio-card compendio-card-clickable ac-compendio-card" data-substrato-id="${escHtml(subId)}" style="border-left: 4px solid ${corTier};">
                <div class="compendio-card-header">
                  <div>
                    <div class="compendio-card-title">${escHtml(s.nome)}</div>
                    <div class="compendio-card-subtitle">${escHtml(s.nomeEn ? `${s.nomeEn} • ` : '')}${escHtml(s.tipo || 'Líquido')}</div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                    <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
                    ${_obterBadgeCd(s.cdMod)}
                  </div>
                </div>

                <div class="compendio-card-body">
                  <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
                    ${escHtml(_resumoCurto(resumo, 120))}
                  </p>

                  <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 6px;">
                    <span class="c-badge c-badge-categoria" title="Custo Base">💰 ${s.custoPo} PO</span>
                    <span class="c-badge c-badge-categoria" title="Unidades de Esforço">⚡ ${s.unitEffort || 3} UE</span>
                    <span class="c-badge c-badge-categoria" title="Limite de Suspensão de Reagentes">💧 ${escHtml(s.limiteSuspensao || '30g')}</span>
                    <span class="c-badge c-badge-sintonizacao" title="Estabilidade">${escHtml(s.estabilidade)}</span>
                  </div>
                </div>

                <div class="compendio-card-footer">
                  <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- TABELA COMPACTA (LINHAS CLICÁVEIS ABREM O MODAL) -->
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th>Substrato Alquímico</th>
                <th>Tier</th>
                <th>Tipo & Método</th>
                <th>Suspensão</th>
                <th>Estabilidade / CD</th>
                <th>Potencial Alquímico</th>
                <th>Custo & UE</th>
              </tr>
            </thead>
            <tbody>
              ${substratos.map(s => {
                const subId = s.id || s.nome;
                return `
                  <tr class="ac-table-row-clickable" data-substrato-id="${escHtml(subId)}" title="Clique para abrir detalhes completos">
                    <td>
                      <strong style="color: #f1f5f9;">${escHtml(s.nome)}</strong>
                      <div class="ac-sub-txt">${escHtml(s.nomeEn || '')}</div>
                      <div class="ac-desc-small">${escHtml(s.fonte ? 'Fonte: ' + s.fonte : (s.descricao || ''))}</div>
                    </td>
                    <td>
                      <span class="ac-tier-badge" style="background:${_getCorTier(s.tier)}22; color:${_getCorTier(s.tier)}; border: 1px solid ${_getCorTier(s.tier)}66;">
                        Tier ${s.tier} (${s.tierNome || 'T' + s.tier})
                      </span>
                    </td>
                    <td>
                      <strong>${escHtml(s.tipo || 'Líquido')}</strong>
                      <div class="ac-sub-txt">${escHtml(s.metodoUso || 'Ingestão / Preparo')}</div>
                    </td>
                    <td>
                      <span class="ac-pill-status" style="background: rgba(59, 130, 246, 0.12); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3);">
                        ${escHtml(s.limiteSuspensao || '30g')}
                      </span>
                    </td>
                    <td>
                      <span class="ac-pill-status">${escHtml(s.estabilidade)}</span>
                      <div class="${s.cdMod > 0 ? 'ac-txt-danger' : 'ac-txt-success'}" style="font-weight: 700; font-size: 0.8rem; margin-top: 3px;">
                        ${s.cdMod > 0 ? `+${s.cdMod}` : (s.cdMod === 0 ? '0' : s.cdMod)} CD
                      </div>
                    </td>
                    <td style="max-width: 280px; font-size: 0.85rem;">
                      ${escHtml(s.potencial || s.efeitoPrimario || '—')}
                    </td>
                    <td style="white-space: nowrap;">
                      <strong>${s.custoPo} PO</strong>
                      <div class="ac-sub-txt">${s.unitEffort || 3} UE</div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }

  // ------------------------------------------------------------
  // 2. REAGENTES ALQUÍMICOS (CARDS NO PADRÃO DO COMPÊNDIO)
  // ------------------------------------------------------------
  if (_filtroSubApendice2 === 'reagentes') {
    const reagentes = APENDICE2_ALQUIMIA.reagentes.filter(r =>
      !q || r.nome.toLowerCase().includes(q) || (r.nomeEn && r.nomeEn.toLowerCase().includes(q)) || (r.tipoEfeito && r.tipoEfeito.toLowerCase().includes(q)) || (r.efeitoPrincipal && r.efeitoPrincipal.toLowerCase().includes(q)) || (r.canais && r.canais.toLowerCase().includes(q)) || (r.fontes && r.fontes.toLowerCase().includes(q))
    );

    return `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <span class="ac-badge-counter">${reagentes.length} Reagentes Catalogados</span>
      </div>

      <div class="compendio-grid" id="ac-grid-reagentes">
        ${reagentes.length === 0 ? `
          <div class="ac-empty-state" style="grid-column: 1 / -1;"><p>Nenhum reagente encontrado com a busca atual.</p></div>
        ` : reagentes.map(r => {
          const badgeTier = _obterBadgeTier(r.tier);
          const corTier = _getCorTier(r.tier);
          const reagId = r.id || r.nome;
          const resumo = r.efeitoPrincipal || r.efeitoFormula || r.descricao || 'Reagente vegetal, mineral ou animal.';

          return `
            <div class="compendio-card compendio-card-clickable ac-compendio-card" data-reagente-id="${escHtml(reagId)}" style="border-left: 4px solid ${corTier};">
              <div class="compendio-card-header">
                <div>
                  <div class="compendio-card-title">${escHtml(r.nome)}</div>
                  <div class="compendio-card-subtitle">${escHtml(r.nomeEn ? `${r.nomeEn} • ` : '')}${escHtml(r.tipoEfeito || 'Efeito Alquímico')}</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                  <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
                  ${r.dose ? `<span class="c-badge c-badge-categoria">Dose: ${escHtml(r.dose)}</span>` : ''}
                </div>
              </div>

              <div class="compendio-card-body">
                <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
                  ${escHtml(_resumoCurto(resumo, 120))}
                </p>

                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 6px;">
                  <span class="c-badge c-badge-categoria" title="Custo Base">💰 ${r.custoPo} PO</span>
                  <span class="c-badge c-badge-categoria" title="Unidades de Esforço">⚡ ${r.unitEffort || 5} UE</span>
                  <span class="c-badge c-badge-escola" title="Canais Alquímicos">Canais: ${escHtml(r.canais || 'Equilibrados')}</span>
                  ${r.efeitoCatalitico ? `<span class="c-badge c-badge-origem" title="Efeito Catalítico">🧪 Catalítico</span>` : ''}
                  ${r.canalInibitorio ? `<span class="c-badge c-badge-circulo" title="Canal Inibitório">⚠️ Inibitório</span>` : ''}
                </div>
              </div>

              <div class="compendio-card-footer">
                <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ------------------------------------------------------------
  // 3. REAGENTES DE CRIATURAS POR FAMÍLIA (CARDS NO PADRÃO DO COMPÊNDIO)
  // ------------------------------------------------------------
  if (_filtroSubApendice2 === 'criaturas') {
    const familias = APENDICE2_ALQUIMIA.reagentes_criaturas.filter(f =>
      !q || f.familia.toLowerCase().includes(q) || f.reagentes.some(r => r.nome.toLowerCase().includes(q) || r.uso.toLowerCase().includes(q))
    );

    return `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <span class="ac-badge-counter">${familias.length} Famílias de Criaturas Catalogadas</span>
      </div>

      <div class="compendio-grid" id="ac-grid-criaturas">
        ${familias.length === 0 ? `
          <div class="ac-empty-state" style="grid-column: 1 / -1;"><p>Nenhuma criatura encontrada com a busca atual.</p></div>
        ` : familias.map(f => {
          return `
            <div class="compendio-card compendio-card-clickable ac-compendio-card" data-criatura-familia="${escHtml(f.familia)}">
              <div class="compendio-card-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.4rem;">${f.icone}</span>
                  <div>
                    <div class="compendio-card-title">${escHtml(f.familia)}</div>
                    <div class="compendio-card-subtitle">${f.reagentes.length} partes catalogadas para colheita</div>
                  </div>
                </div>
                <span class="c-badge c-badge-origem">Fauna Mágica</span>
              </div>

              <div class="compendio-card-body">
                <p style="margin-bottom: 8px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                  Partes colhíveis com testes de Sobrevivência, Natureza, Medicina ou Arcanismo.
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 6px;">
                  ${f.reagentes.slice(0, 3).map(r => `
                    <span class="c-badge c-badge-categoria">⚗️ ${escHtml(r.nome)}</span>
                  `).join('')}
                  ${f.reagentes.length > 3 ? `<span class="c-badge c-badge-sintonizacao">+${f.reagentes.length - 3} mais</span>` : ''}
                </div>
              </div>

              <div class="compendio-card-footer">
                <span style="color: var(--accent); font-weight: 600;">Ver tabela de colheita completa &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ------------------------------------------------------------
  // 4. RECEITAS BÁSICAS OFICIAIS (CARDS NO PADRÃO DO COMPÊNDIO)
  // ------------------------------------------------------------
  const receitas = APENDICE2_ALQUIMIA.receitas_basicas.filter(rc =>
    !q || rc.nome.toLowerCase().includes(q) || rc.efeito.toLowerCase().includes(q) || rc.descricao.toLowerCase().includes(q)
  );

  return `
    <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span class="ac-badge-counter">${receitas.length} Fórmulas Alquímicas Oficiais</span>
    </div>

    <div class="compendio-grid" id="ac-grid-receitas">
      ${receitas.length === 0 ? `
        <div class="ac-empty-state" style="grid-column: 1 / -1;"><p>Nenhuma receita encontrada com a busca atual.</p></div>
      ` : receitas.map(rc => {
        const badgeTier = _obterBadgeTier(rc.tier);
        const corTier = _getCorTier(rc.tier);
        const recId = rc.id || rc.nome;
        const resumo = rc.efeito || rc.descricao || 'Fórmula oficial de preparação alquímica.';

        return `
          <div class="compendio-card compendio-card-clickable ac-compendio-card" data-receita-id="${escHtml(recId)}" style="border-left: 4px solid ${corTier};">
            <div class="compendio-card-header">
              <div>
                <div class="compendio-card-title">${escHtml(rc.nome)}</div>
                <div class="compendio-card-subtitle">Posto: ${escHtml(rc.posto)} • CD Base: ${rc.cdBase}</div>
              </div>
              <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
            </div>

            <div class="compendio-card-body">
              <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
                ${escHtml(_resumoCurto(resumo, 120))}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 6px;">
                <span class="c-badge c-badge-categoria">⏱️ ${rc.tempoHoras} horas</span>
                <span class="c-badge c-badge-categoria">💰 ${rc.custoPo} PO</span>
                <span class="c-badge c-badge-sintonizacao">💧 ${escHtml(rc.substratoSugerido || 'Substrato Comum')}</span>
              </div>
            </div>

            <div class="compendio-card-footer">
              <span style="color: var(--accent); font-weight: 600;">Ver fórmula completa &rarr;</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Modal de Detalhes Completos do Substrato
function _abrirModalSubstrato(s) {
  const corTier = _getCorTier(s.tier);
  const badgeTier = _obterBadgeTier(s.tier);

  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
        <span class="c-badge c-badge-categoria">${escHtml(s.tipo || 'Líquido')}</span>
        ${_obterBadgeCd(s.cdMod)}
        <span class="c-badge c-badge-categoria">💧 Suspensão: ${escHtml(s.limiteSuspensao || '30g')}</span>
        <span class="c-badge c-badge-categoria">💰 Custo: ${s.custoPo} PO</span>
        <span class="c-badge c-badge-sintonizacao">⚡ Esforço: ${s.unitEffort || 3} UE</span>
      </div>

      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid ${corTier};">
        ${s.nomeEn ? `<div style="font-size: 0.84rem; margin-bottom: 6px; color: var(--ink); padding-bottom: 4px; border-bottom: 1px solid var(--border-light);"><strong>Nome Original (Inglês):</strong> <span style="font-style: italic; color: var(--gold-light);">${escHtml(s.nomeEn)}</span></div>` : ''}
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(s.descricao || 'Substrato base para preparação de poções, óleos e elixires.')}
        </div>
      </div>

      <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
        <strong style="color: #93c5fd; font-family: 'Cinzel', serif; font-size: 0.95rem; display: block; margin-bottom: 4px;">
          🧪 Potencial & Efeito Primário
        </strong>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(s.potencial || s.efeitoPrimario || 'Solvente alquímico neutro.')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Estabilidade Química:</span>
          <strong style="color: var(--gold-light); font-size: 0.85rem;">${escHtml(s.estabilidade)}</strong>
        </div>
        <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Método de Aplicação:</span>
          <strong style="color: #38bdf8; font-size: 0.85rem;">${escHtml(s.metodoUso || 'Ingestão / Preparo')}</strong>
        </div>
        ${s.fonte ? `
          <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Fonte / Obtenção:</span>
            <strong style="color: #4ade80; font-size: 0.85rem;">${escHtml(s.fonte)}</strong>
          </div>
        ` : ''}
      </div>

      <div style="padding: 10px 14px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #93c5fd; display: flex; align-items: center; gap: 8px;">
        <span>💧</span>
        <span>Este substrato pode ser selecionado diretamente na bancada de <strong>Alquimia</strong> para dissolver os reagentes.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">💧 ${escHtml(s.nome)}</span> ${s.nomeEn ? `<small style="font-size:0.75rem; font-weight:400; color:var(--text-muted); font-style:italic;">(${escHtml(s.nomeEn)})</small>` : ''}`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// Modal de Detalhes Completos do Reagente
function _abrirModalReagente(r) {
  const corTier = _getCorTier(r.tier);
  const badgeTier = _obterBadgeTier(r.tier);

  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
        <span class="c-badge c-badge-categoria">${escHtml(r.tipoEfeito || 'Efeito Alquímico')}</span>
        ${r.dose ? `<span class="c-badge c-badge-categoria">Dose: ${escHtml(r.dose)}</span>` : ''}
        <span class="c-badge c-badge-categoria">💰 Custo: ${r.custoPo} PO</span>
        <span class="c-badge c-badge-sintonizacao">⚡ Esforço: ${r.unitEffort || 5} UE</span>
      </div>

      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid ${corTier};">
        ${r.nomeEn ? `<div style="font-size: 0.84rem; margin-bottom: 6px; color: var(--ink); padding-bottom: 4px; border-bottom: 1px solid var(--border-light);"><strong>Nome Original (Inglês):</strong> <span style="font-style: italic; color: var(--gold-light);">${escHtml(r.nomeEn)}</span></div>` : ''}
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(r.descricao || 'Reagente vegetal, mineral ou animal para fórmulas alquímicas.')}
        </div>
      </div>

      <div style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
        <strong style="color: #c084fc; font-family: 'Cinzel', serif; font-size: 0.95rem; display: block; margin-bottom: 4px;">
          🌿 Efeito Alquímico / Fórmula
        </strong>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(r.efeitoPrincipal || r.efeitoFormula || '—')}
        </div>
      </div>

      ${r.canais ? `
        <div style="background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid #818cf8;">
          <strong style="color: #818cf8; font-size: 0.85rem; display: block; margin-bottom: 2px;">Canais Alquímicos:</strong>
          <span style="font-family: monospace; font-weight: 700; font-size: 0.95rem; color: #a5b4fc;">[ ${escHtml(r.canais)} ]</span>
        </div>
      ` : ''}

      ${r.canalInibitorio ? `
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 14px; color: #fca5a5;">
          <strong style="display: block; margin-bottom: 2px;">⚠️ Canal Inibitório:</strong>
          <span style="font-size: 0.85rem;">${escHtml(r.canalInibitorio)}</span>
        </div>
      ` : ''}

      ${r.efeitoCatalitico ? `
        <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 14px; color: #86efac;">
          <strong style="display: block; margin-bottom: 2px;">🧪 Efeito Catalítico:</strong>
          <span style="font-size: 0.85rem;">${escHtml(r.efeitoCatalitico)}</span>
        </div>
      ` : ''}

      ${r.fontes ? `
        <div style="margin-bottom: 14px; font-size: 0.85rem; color: var(--text-muted);">
          <strong style="color: var(--ink);">Fontes & Biomas de Coleta:</strong> ${escHtml(r.fontes)}
        </div>
      ` : ''}

      <div style="padding: 10px 14px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #c084fc; display: flex; align-items: center; gap: 8px;">
        <span>🌿</span>
        <span>Reagente compatível com o <strong>Caldeirão Alquímico</strong> para criação de poções e elixires.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">🌿 ${escHtml(r.nome)}</span> ${r.nomeEn ? `<small style="font-size:0.75rem; font-weight:400; color:var(--text-muted); font-style:italic;">(${escHtml(r.nomeEn)})</small>` : ''}`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// Modal de Detalhes Completos da Receita
function _abrirModalReceita(rc) {
  const corTier = _getCorTier(rc.tier);
  const badgeTier = _obterBadgeTier(rc.tier);

  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge ${badgeTier.classe}">${badgeTier.label}</span>
        <span class="c-badge c-badge-categoria">Posto: ${escHtml(rc.posto)}</span>
        <span class="c-badge c-badge-categoria">CD Base: ${rc.cdBase}</span>
        <span class="c-badge c-badge-categoria">⏱️ ${rc.tempoHoras} horas</span>
        <span class="c-badge c-badge-categoria">💰 Custo: ${rc.custoPo} PO</span>
      </div>

      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid ${corTier};">
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(rc.descricao)}
        </div>
      </div>

      <div style="background: rgba(200, 160, 81, 0.08); border: 1px solid rgba(200, 160, 81, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
        <strong style="color: var(--gold-light); font-family: 'Cinzel', serif; font-size: 0.95rem; display: block; margin-bottom: 4px;">
          ⚗️ Efeito Alquímico Final
        </strong>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(rc.efeito)}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: var(--bg-input); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Substrato Sugerido:</span>
          <strong style="color: #38bdf8; font-size: 0.85rem;">${escHtml(rc.substratoSugerido)}</strong>
        </div>
        <div style="background: var(--bg-input); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Reagentes Exigidos:</span>
          <strong style="color: #4ade80; font-size: 0.85rem;">${escHtml(rc.reagentesSugeridos)}</strong>
        </div>
      </div>

      <div style="padding: 10px 14px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #86efac; display: flex; align-items: center; gap: 8px;">
        <span>📜</span>
        <span>Receita oficial autorizada pela <strong>Associação de Alquimistas</strong>.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">📜 ${escHtml(rc.nome)}</span>`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// Modal de Detalhes da Família de Criaturas
function _abrirModalCriaturaFamilia(f) {
  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
        <span style="font-size: 2.2rem;">${f.icone}</span>
        <div>
          <h3 style="margin: 0; font-family: 'Cinzel', serif; font-size: 1.2rem; color: var(--gold-light);">Família: ${escHtml(f.familia)}</h3>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${f.reagentes.length} partes alquímicas catalogadas para colheita</span>
        </div>
      </div>

      <div class="ac-table-container">
        <table class="ac-table">
          <thead>
            <tr>
              <th style="width: 35%;">Parte / Reagente</th>
              <th style="width: 65%;">Propriedade Alquímica & Aplicação</th>
            </tr>
          </thead>
          <tbody>
            ${f.reagentes.map(r => `
              <tr>
                <td>
                  <strong style="color: #f1f5f9;">⚗️ ${escHtml(r.nome)}</strong>
                </td>
                <td style="color: #cbd5e1; line-height: 1.5;">${escHtml(r.uso)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 14px; padding: 10px 14px; background: rgba(200, 160, 81, 0.08); border: 1px solid rgba(200, 160, 81, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--gold-light); display: flex; align-items: center; gap: 8px;">
        <span>🎲</span>
        <span>Use o <strong>Simulador de Coleta</strong> na aba correspondente para testar a extração destas partes em combate.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">${f.icone} ${escHtml(f.familia)}</span>`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// ============================================================
// APÊNDICE 3: TABELAS DE PROPRIEDADES DE ENCANTAMENTO
// ============================================================
function _renderApendice3() {
  const escolaInfo = APENDICE3_ENCANTAMENTO.escolas.find(e => e.id === _escolaApendice3) || APENDICE3_ENCANTAMENTO.escolas[0];
  const tierInfo = APENDICE3_ENCANTAMENTO.tiers_strands.find(t => t.tier === _tierApendice3) || APENDICE3_ENCANTAMENTO.tiers_strands[0];
  const propriedades = obterPropriedadesApendice3(_escolaApendice3, _tierApendice3);

  return `
    <div class="ac-section-banco">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>🔮 Apêndice 3: Tabelas de Propriedades por Escola de Magia & Tier/Strand</span>
        </div>
        <p class="ac-banner-intro-desc">
          Tabelas oficiais para realização dos rituais de encantamento. Selecione a <strong>Escola de Magia</strong> e o <strong>Tier/Strand</strong> desejado para consultar os efeitos arcanos disponíveis. Clique em qualquer linha ou card para abrir os detalhes completos.
        </p>
      </div>

      <!-- FILTROS DE ESCOLA & TIER/STRAND -->
      <div class="ac-filters-bar-row">
        <div class="ac-filter-group">
          <span class="ac-filter-lbl">Escola de Magia:</span>
          <div class="ac-pill-btn-group">
            ${APENDICE3_ENCANTAMENTO.escolas.map(esc => `
              <button class="ac-pill-btn ${_escolaApendice3 === esc.id ? 'ativo' : ''}" data-escola3="${esc.id}">
                ${esc.icone} ${esc.nome}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="ac-filter-group">
          <span class="ac-filter-lbl">Nível (Tier / Strands):</span>
          <div class="ac-pill-btn-group">
            ${APENDICE3_ENCANTAMENTO.tiers_strands.map(t => `
              <button class="ac-pill-btn ${_tierApendice3 === t.tier ? 'ativo' : ''}" data-tier3="${t.tier}">
                ${t.rotulo}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- BANNER DE RESUMO DO RITUAL DO TIER/STRAND -->
      <div class="ac-ritual-strand-card" style="border-left: 5px solid ${escolaInfo.cor}; background: rgba(30, 41, 59, 0.7);">
        <div class="ac-strand-header">
          <div>
            <h3 style="margin:0; color:${escolaInfo.cor}; font-size:1.15rem;">
              ${escolaInfo.icone} Escola de ${escolaInfo.nome} — ${tierInfo.rotulo}
            </h3>
            <span class="ac-sub-txt">${tierInfo.classificacao} • ${tierInfo.circuloMagia}</span>
          </div>
          <div class="ac-strand-metrics">
            <span class="ac-metric-badge">CD Ritual: <strong>${tierInfo.cdBase}</strong></span>
            <span class="ac-metric-badge">Tempo: <strong>${tierInfo.tempoSugerido}</strong></span>
            <span class="ac-metric-badge">Custo: <strong>${tierInfo.custoPoSugerido} PO</strong></span>
          </div>
        </div>
        <p class="ac-strand-catalisador">
          <strong>Catalisadores Recomendados:</strong> ${escHtml(tierInfo.catalisadorSugerido)}
        </p>
      </div>

      <!-- TABELA DE PROPRIEDADES DA ESCOLA & TIER SELECIONADOS -->
      <div class="ac-table-container" style="margin-top: 14px;">
        <table class="ac-table">
          <thead>
            <tr>
              <th style="width: 25%;">Propriedade Mágica</th>
              <th style="width: 45%;">Efeito Mecânico & Regras</th>
              <th style="width: 12%;">Cargas / Usos</th>
              <th style="width: 10%;">Ativação</th>
              <th style="width: 8%; text-align: center;">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            ${propriedades.map(p => `
              <tr class="ac-table-row-clickable" data-prop-encantamento="${escHtml(p.nome)}" title="Clique para abrir detalhes">
                <td>
                  <strong style="color: #f1f5f9;">✨ ${escHtml(p.nome)}</strong>
                </td>
                <td style="line-height: 1.5; color: #cbd5e1;">${escHtml(_resumoCurto(p.efeito, 140))}</td>
                <td><span class="ac-pill-status">${escHtml(p.cargas)}</span></td>
                <td><span class="ac-badge-tag">${escHtml(p.gatilho)}</span></td>
                <td style="text-align: center;">
                  <button class="c-badge c-badge-escola" type="button" style="cursor: pointer; border: none;">Ver &rarr;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

// Modal de Detalhes da Propriedade de Encantamento
function _abrirModalPropriedadeEncantamento(p, escolaInfo, tierInfo) {
  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge c-badge-escola">${escolaInfo.icone} Escola de ${escHtml(escolaInfo.nome)}</span>
        <span class="c-badge c-badge-sintonizacao">${escHtml(tierInfo.rotulo)}</span>
        <span class="c-badge c-badge-categoria">CD Ritual: ${tierInfo.cdBase}</span>
        <span class="c-badge c-badge-categoria">Cargas: ${escHtml(p.cargas)}</span>
        <span class="c-badge c-badge-categoria">Ativação: ${escHtml(p.gatilho)}</span>
      </div>

      <div style="background: rgba(200, 160, 81, 0.08); border: 1px solid rgba(200, 160, 81, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
        <strong style="color: var(--gold-light); font-family: 'Cinzel', serif; font-size: 0.95rem; display: block; margin-bottom: 4px;">
          ✨ Efeito Mecânico & Regras
        </strong>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(p.efeito)}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Tempo Sugerido de Ritual:</span>
          <strong style="color: var(--ink); font-size: 0.85rem;">${escHtml(tierInfo.tempoSugerido)}</strong>
        </div>
        <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Custo em Componentes:</span>
          <strong style="color: var(--gold-light); font-size: 0.85rem;">${tierInfo.custoPoSugerido} PO</strong>
        </div>
        <div style="background: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); grid-column: 1 / -1;">
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Catalisadores Recomendados:</span>
          <strong style="color: #cbd5e1; font-size: 0.85rem;">${escHtml(tierInfo.catalisadorSugerido)}</strong>
        </div>
      </div>

      <div style="padding: 10px 14px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #c084fc; display: flex; align-items: center; gap: 8px;">
        <span>🔮</span>
        <span>Esta propriedade pode ser vinculada a itens mágicos na Oficina de <strong>Encantamento</strong>.</span>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">🔮 ✨ ${escHtml(p.nome)}</span>`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// ============================================================
// CONDIÇÕES, MUTAÇÕES & BOSSES
// ============================================================
function _renderCondicoesBanco() {
  const eb = REGRAS_CONDICOES.embriaguez;
  const cr = REGRAS_CONDICOES.corrupcao;
  const mu = REGRAS_CONDICOES.mutacoes;
  const cv = REGRAS_CONDICOES.variacoesCriatura;

  return `
    <div class="ac-section-banco">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>☣️ Condições, Mutações & Variações de Criaturas</span>
        </div>
        <p class="ac-banner-intro-desc">
          Mecânicas oficiais do livro para estados físicos e psíquicos alterados: Embriaguez (6 níveis + ressaca), Corrupção (0 a 11), Mutações biológicas e as 20 Variações de Criaturas para encontros épicos de chefes.
        </p>
      </div>

      <!-- EMBRIAGUEZ -->
      <div class="ac-box-highlight" style="margin-bottom: 20px;">
        <div class="ac-box-header">
          <span class="ac-box-tag">🍺 ${eb.nome}</span>
          <span class="ac-box-sub">6 Níveis Cumulativos</span>
        </div>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr><th>Nível</th><th>Nome</th><th>Efeitos</th></tr>
            </thead>
            <tbody>
              ${eb.niveis.map(n => `
                <tr>
                  <td><strong>Nível ${n.nivel}</strong></td>
                  <td style="color:#f59e0b;"><strong>${n.nome}</strong></td>
                  <td>${n.efeito}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <small class="ac-hint mt-2"><strong>Ressaca:</strong> ${eb.ressaca}</small>
      </div>

      <!-- CORRUPÇÃO -->
      <div class="ac-box-highlight" style="margin-bottom: 20px;">
        <div class="ac-box-header">
          <span class="ac-box-tag">💀 ${cr.nome}</span>
          <span class="ac-box-sub">Marcos Progressivos (0 a 11)</span>
        </div>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr><th>Nível</th><th>Marco</th><th>Efeito</th></tr>
            </thead>
            <tbody>
              ${cr.marcos.map(m => `
                <tr>
                  <td><strong>Nível ${m.nivel}</strong></td>
                  <td style="color:#a855f7;"><strong>${m.nome}</strong></td>
                  <td>${m.efeito}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- MUTAÇÕES NO PADRÃO DO COMPÊNDIO -->
      <div class="ac-box-highlight" style="margin-bottom: 20px;">
        <div class="ac-box-header">
          <span class="ac-box-tag">🧬 ${mu.nome}</span>
          <span class="ac-box-sub">Gastos de Pontos de Mutação (Clique no card para abrir detalhes)</span>
        </div>
        <div class="compendio-grid">
          ${mu.pontos.map(p => `
            <div class="compendio-card compendio-card-clickable ac-compendio-card" data-mutacao-nome="${escHtml(p.nome)}" style="border-left: 4px solid #22c55e;">
              <div class="compendio-card-header">
                <div>
                  <div class="compendio-card-title">${escHtml(p.nome)}</div>
                  <div class="compendio-card-subtitle">Gasto de Pontos de Mutação</div>
                </div>
                <span class="c-badge c-badge-origem">🧬 Mutação</span>
              </div>
              <div class="compendio-card-body">
                <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
                  ${escHtml(_resumoCurto(p.desc, 110))}
                </p>
              </div>
              <div class="compendio-card-footer">
                <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 20 VARIAÇÕES DE CRIATURA -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">🐉 20 Variações de Criaturas (Boss Traits)</span>
          <span class="ac-box-sub">Modificadores de ND e Características Únicas (Clique para ver detalhes)</span>
        </div>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr><th>#</th><th>Variação</th><th>Categoria</th><th>Descrição do Efeito</th><th style="text-align: center;">Ação</th></tr>
            </thead>
            <tbody>
              ${cv.map(v => `
                <tr class="ac-table-row-clickable" data-variacao-num="${v.num}" title="Clique para abrir detalhes">
                  <td><strong>${v.num}</strong></td>
                  <td style="color:#38bdf8;"><strong>${v.nome}</strong></td>
                  <td><span class="ac-pill-status">${v.tipo}</span></td>
                  <td>${escHtml(_resumoCurto(v.desc, 120))}</td>
                  <td style="text-align: center;">
                    <button class="c-badge c-badge-escola" type="button" style="cursor: pointer; border: none;">Ver &rarr;</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function _abrirModalMutacao(p) {
  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge c-badge-origem">🧬 Mutação Biológica</span>
      </div>
      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid #22c55e;">
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(p.desc)}
        </div>
      </div>
      <div style="padding: 10px 14px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-sm); font-size: 0.82rem; color: #86efac;">
        Mutação adquirida mediante gasto de Pontos de Mutação conforme as regras de Corrupção & Aberrações.
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">🧬 ${escHtml(p.nome)}</span>`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

function _abrirModalVariacao(v) {
  const corpo = `
    <div class="ac-modal-detail-wrapper">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; align-items: center;">
        <span class="c-badge c-badge-categoria">Variação #${v.num}</span>
        <span class="c-badge c-badge-escola">${escHtml(v.tipo)}</span>
      </div>
      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid #38bdf8;">
        <strong style="color: #38bdf8; font-family: 'Cinzel', serif; font-size: 0.95rem; display: block; margin-bottom: 6px;">
          Descrição e Efeito do Chefe
        </strong>
        <div style="font-size: 0.88rem; color: var(--ink); line-height: 1.55;">
          ${escHtml(v.desc)}
        </div>
      </div>
    </div>
  `;

  abrirModal(
    `<span style="font-family:'Cinzel', serif;">🐉 ${escHtml(v.nome)}</span>`,
    corpo,
    '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>'
  );
}

// ============================================================
// SIMULADORES DE COLETA & FORRAGEAMENTO
// ============================================================
function _renderSimuladores() {
  return `
    <div class="ac-section-banco">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>🧭 Ferramentas de Mesa: Simulador de Coleta & Forrageamento</span>
        </div>
        <p class="ac-banner-intro-desc">
          Execute rolagens de dados para obter materiais diretamente de monstros abatidos ou expedicões em biomas selvagens, de acordo com as regras de colheita e forrageamento.
        </p>
      </div>

      <!-- SIMULADOR DE COLHEITA -->
      <div class="ac-sim-box" style="margin-bottom: 24px;">
        <div class="ac-sim-header">
          <span class="ac-sim-badge">🎲 Colheita de Criaturas</span>
          <h4>Extrair Materiais de Monstro Abatido</h4>
        </div>
        <div class="ac-sim-grid">
          <div class="ac-form-group">
            <label class="ac-label">Monstro Abatido:</label>
            <select class="ac-select" id="ac-sim-colh-criatura">
              ${APENDICE_COLHEITA.map((c, i) => `
                <option value="${i}" ${_simColheita.indiceCriatura === i ? 'selected' : ''}>
                  ${c.icone} ${c.tipo}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Perícia Utilizada:</label>
            <select class="ac-select" id="ac-sim-colh-pericia">
              <option value="Sobrevivência" ${_simColheita.pericia === 'Sobrevivência' ? 'selected' : ''}>Sobrevivência</option>
              <option value="Natureza" ${_simColheita.pericia === 'Natureza' ? 'selected' : ''}>Natureza</option>
              <option value="Arcanismo" ${_simColheita.pericia === 'Arcanismo' ? 'selected' : ''}>Arcanismo</option>
              <option value="Medicina" ${_simColheita.pericia === 'Medicina' ? 'selected' : ''}>Medicina</option>
            </select>
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Bônus de Perícia:</label>
            <input type="number" class="ac-input" id="ac-sim-colh-bonus" value="${_simColheita.modificador}">
          </div>
          <div class="ac-form-group" style="align-self: flex-end;">
            <button class="ac-btn-primary" id="ac-sim-colh-btn-rolar" style="width: 100%;">
              🎲 Rolar Teste (d20)
            </button>
          </div>
        </div>

        ${_simColheita.resultado ? `
          <div class="ac-sim-result-box ${_simColheita.resultado.sucesso ? 'sucesso' : 'falha'}" style="margin-top: 14px;">
            <div class="ac-sim-result-title">${escHtml(_simColheita.resultado.mensagem)}</div>
            <div class="ac-sim-result-desc">${escHtml(_simColheita.resultado.detalhe)}</div>
          </div>
        ` : ''}
      </div>

      <!-- SIMULADOR DE FORRAGEAMENTO -->
      <div class="ac-sim-box">
        <div class="ac-sim-header">
          <span class="ac-sim-badge">🌿 Forrageamento & Mineração</span>
          <h4>Buscar Ervas e Minérios em Biomas</h4>
        </div>
        <div class="ac-sim-grid">
          <div class="ac-form-group">
            <label class="ac-label">Bioma / Terreno:</label>
            <select class="ac-select" id="ac-sim-forr-bioma">
              ${APENDICE_BIOMAS.map(b => `
                <option value="${b.id}" ${_simForrageamento.idBioma === b.id ? 'selected' : ''}>
                  ${b.icone} ${b.nome}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Tempo Gasto:</label>
            <select class="ac-select" id="ac-sim-forr-horas">
              <option value="1" ${_simForrageamento.tempoHoras === 1 ? 'selected' : ''}>1 hora</option>
              <option value="2" ${_simForrageamento.tempoHoras === 2 ? 'selected' : ''}>2 horas (+1)</option>
              <option value="4" ${_simForrageamento.tempoHoras === 4 ? 'selected' : ''}>4 horas (+2)</option>
              <option value="8" ${_simForrageamento.tempoHoras === 8 ? 'selected' : ''}>8 horas (+4)</option>
            </select>
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Bônus de Natureza / Sobrevivência:</label>
            <input type="number" class="ac-input" id="ac-sim-forr-bonus" value="${_simForrageamento.modificador}">
          </div>
          <div class="ac-form-group" style="align-self: flex-end;">
            <button class="ac-btn-primary" id="ac-sim-forr-btn-rolar" style="width: 100%;">
              🎲 Forragear (d20)
            </button>
          </div>
        </div>

        ${_simForrageamento.resultado ? `
          <div class="ac-sim-result-box ${_simForrageamento.resultado.sucesso ? 'sucesso' : 'falha'}" style="margin-top: 14px;">
            <div class="ac-sim-result-title">${escHtml(_simForrageamento.resultado.mensagem)}</div>
            <div class="ac-sim-result-desc">${escHtml(_simForrageamento.resultado.detalhe)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function _setupEventosBanco(container) {
  // Inicializar deslizamento suave na barra de sub-abas
  const subBar = container.querySelector('#ac-banco-sub-bar');
  const prevBtn = container.querySelector('#ac-banco-nav-prev');
  const nextBtn = container.querySelector('#ac-banco-nav-next');
  if (subBar) {
    tornarBarraDeslizavel(subBar, {
      btnEsquerda: prevBtn,
      btnDireita: nextBtn,
      passoScroll: 220,
      centralizarAtivo: true,
      seletorAtivo: '.ac-banco-nav-btn.ativo'
    });

    subBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.ac-banco-nav-btn');
      if (btn && btn.dataset.sub) {
        e.preventDefault();
        _subAbaBanco = btn.dataset.sub;
        renderBancoMateriais(container);
      }
    });
  }

  // Navegação de Sub-abas (ouvintes diretos)
  container.querySelectorAll('.ac-banco-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      _subAbaBanco = btn.dataset.sub;
      renderBancoMateriais(container);
    });
  });

  // Campo de Busca
  const searchInput = container.querySelector('#ac-banco-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      _filtroBusca = e.target.value;
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  }

  const searchClear = container.querySelector('#ac-banco-search-clear');
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      _filtroBusca = '';
      renderBancoMateriais(container);
    });
  }

  _setupEventosSubAba(container);
}

function _setupEventosSubAba(container) {
  // Filtros Apêndice 1
  container.querySelectorAll('[data-cat1]').forEach(btn => {
    btn.addEventListener('click', () => {
      _filtroCatApendice1 = btn.dataset.cat1;
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  container.querySelectorAll('[data-tier1]').forEach(btn => {
    btn.addEventListener('click', () => {
      _filtroTier = Number(btn.dataset.tier1);
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  // Filtros Apêndice 2
  container.querySelectorAll('[data-sub2]').forEach(btn => {
    btn.addEventListener('click', () => {
      _filtroSubApendice2 = btn.dataset.sub2;
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  // Toggle de visualização de substratos (cards vs tabela)
  container.querySelectorAll('[data-view-sub]').forEach(btn => {
    btn.addEventListener('click', () => {
      _modoExibicaoSubstratos = btn.dataset.viewSub;
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  // Filtros Apêndice 3
  container.querySelectorAll('[data-escola3]').forEach(btn => {
    btn.addEventListener('click', () => {
      _escolaApendice3 = btn.dataset.escola3;
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  container.querySelectorAll('[data-tier3]').forEach(btn => {
    btn.addEventListener('click', () => {
      _tierApendice3 = Number(btn.dataset.tier3);
      const content = container.querySelector('#ac-banco-content-area');
      if (content) content.innerHTML = _renderConteudoAbaBanco();
      _setupEventosSubAba(container);
    });
  });

  // ------------------------------------------------------------
  // CLIQUES NOS CARDS & ITENS (ABRE MODAL DE DETALHES COMPLETOS)
  // ------------------------------------------------------------
  // 1. Materiais de Criação (Apêndice 1)
  container.querySelectorAll('[data-material-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      const matId = card.dataset.materialId;
      const todosMats = obterMateriaisApendice1('todos', 0, '');
      const mat = todosMats.find(m => String(m.id || m.nome) === matId || m.nome === matId);
      if (mat) _abrirModalMaterial(mat);
    });
  });

  // 2. Substratos Alquímicos (Apêndice 2)
  container.querySelectorAll('[data-substrato-id]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const subId = elem.dataset.substratoId;
      const sub = APENDICE2_ALQUIMIA.substratos.find(s => String(s.id || s.nome) === subId || s.nome === subId);
      if (sub) _abrirModalSubstrato(sub);
    });
  });

  // 3. Reagentes Alquímicos (Apêndice 2)
  container.querySelectorAll('[data-reagente-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      const reagId = card.dataset.reagenteId;
      const reag = APENDICE2_ALQUIMIA.reagentes.find(r => String(r.id || r.nome) === reagId || r.nome === reagId);
      if (reag) _abrirModalReagente(reag);
    });
  });

  // 4. Receitas Básicas (Apêndice 2)
  container.querySelectorAll('[data-receita-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      const recId = card.dataset.receitaId;
      const rec = APENDICE2_ALQUIMIA.receitas_basicas.find(rc => String(rc.id || rc.nome) === recId || rc.nome === recId);
      if (rec) _abrirModalReceita(rec);
    });
  });

  // 5. Famílias de Criaturas (Apêndice 2)
  container.querySelectorAll('[data-criatura-familia]').forEach(card => {
    card.addEventListener('click', (e) => {
      const famNome = card.dataset.criaturaFamilia;
      const fam = APENDICE2_ALQUIMIA.reagentes_criaturas.find(f => f.familia === famNome);
      if (fam) _abrirModalCriaturaFamilia(fam);
    });
  });

  // 6. Propriedades de Encantamento (Apêndice 3)
  container.querySelectorAll('[data-prop-encantamento]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const propNome = elem.dataset.propEncantamento;
      const propriedades = obterPropriedadesApendice3(_escolaApendice3, _tierApendice3);
      const prop = propriedades.find(p => p.nome === propNome);
      const escolaInfo = APENDICE3_ENCANTAMENTO.escolas.find(e => e.id === _escolaApendice3) || APENDICE3_ENCANTAMENTO.escolas[0];
      const tierInfo = APENDICE3_ENCANTAMENTO.tiers_strands.find(t => t.tier === _tierApendice3) || APENDICE3_ENCANTAMENTO.tiers_strands[0];
      if (prop) _abrirModalPropriedadeEncantamento(prop, escolaInfo, tierInfo);
    });
  });

  // 7. Mutações (Condições)
  container.querySelectorAll('[data-mutacao-nome]').forEach(card => {
    card.addEventListener('click', (e) => {
      const mutNome = card.dataset.mutacaoNome;
      const mut = REGRAS_CONDICOES.mutacoes.pontos.find(p => p.nome === mutNome);
      if (mut) _abrirModalMutacao(mut);
    });
  });

  // 8. 20 Variações de Criaturas (Condições)
  container.querySelectorAll('[data-variacao-num]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const vNum = Number(elem.dataset.variacaoNum);
      const variacao = REGRAS_CONDICOES.variacoesCriatura.find(v => v.num === vNum);
      if (variacao) _abrirModalVariacao(variacao);
    });
  });

  // Simuladores
  const selCriatura = container.querySelector('#ac-sim-colh-criatura');
  if (selCriatura) {
    selCriatura.addEventListener('change', (e) => {
      _simColheita.indiceCriatura = Number(e.target.value);
    });
  }
  const selPericia = container.querySelector('#ac-sim-colh-pericia');
  if (selPericia) {
    selPericia.addEventListener('change', (e) => {
      _simColheita.pericia = e.target.value;
    });
  }
  const inputBonusColh = container.querySelector('#ac-sim-colh-bonus');
  if (inputBonusColh) {
    inputBonusColh.addEventListener('change', (e) => {
      _simColheita.modificador = Number(e.target.value);
    });
  }
  const btnRolarColh = container.querySelector('#ac-sim-colh-btn-rolar');
  if (btnRolarColh) {
    btnRolarColh.addEventListener('click', () => {
      _executarSimColheita(container);
    });
  }

  const selBioma = container.querySelector('#ac-sim-forr-bioma');
  if (selBioma) {
    selBioma.addEventListener('change', (e) => {
      _simForrageamento.idBioma = e.target.value;
    });
  }
  const selHoras = container.querySelector('#ac-sim-forr-horas');
  if (selHoras) {
    selHoras.addEventListener('change', (e) => {
      _simForrageamento.tempoHoras = Number(e.target.value);
    });
  }
  const inputBonusForr = container.querySelector('#ac-sim-forr-bonus');
  if (inputBonusForr) {
    inputBonusForr.addEventListener('change', (e) => {
      _simForrageamento.modificador = Number(e.target.value);
    });
  }
  const btnRolarForr = container.querySelector('#ac-sim-forr-btn-rolar');
  if (btnRolarForr) {
    btnRolarForr.addEventListener('click', () => {
      _executarSimForrageamento(container);
    });
  }
}

function _executarSimColheita(container) {
  const criatura = APENDICE_COLHEITA[_simColheita.indiceCriatura];
  if (!criatura || !criatura.partes.length) return;

  const d20 = Math.floor(Math.random() * 20) + 1;
  const total = d20 + Number(_simColheita.modificador || 0);

  const partesOrdenadas = [...criatura.partes].sort((a, b) => a.cd - b.cd);
  const partesColetadas = partesOrdenadas.filter(p => total >= p.cd);

  if (partesColetadas.length > 0) {
    const melhorParte = partesColetadas[partesColetadas.length - 1];
    _simColheita.resultado = {
      sucesso: true,
      mensagem: `Sucesso na Colheita! Rolagem d20: ${d20} + ${_simColheita.modificador} = ${total}`,
      detalhe: `Você conseguiu extrair com sucesso: "${melhorParte.nome}" (Grau ${GRAUS_MATERIAL[melhorParte.grauSugerido]?.nome}). Pode ser utilizado diretamente na sua bancada de Criação ou Alquimia!`
    };
    toast(`Colhido com sucesso: ${melhorParte.nome}!`, 'success');
  } else {
    _simColheita.resultado = {
      sucesso: false,
      mensagem: `Falha na Colheita. Rolagem d20: ${d20} + ${_simColheita.modificador} = ${total}`,
      detalhe: `O corte atingiu a carcaça de forma irregular ou as glândulas romperam. As partes utilizáveis foram inutilizadas.`
    };
    toast('Nenhum material utilizável foi obtido.', 'warning');
  }

  renderBancoMateriais(container);
}

function _executarSimForrageamento(container) {
  const bioma = APENDICE_BIOMAS.find(b => b.id === _simForrageamento.idBioma) || APENDICE_BIOMAS[0];
  const d20 = Math.floor(Math.random() * 20) + 1;
  const bHoras = Math.floor(_simForrageamento.tempoHoras / 2);
  const total = d20 + Number(_simForrageamento.modificador || 0) + bHoras;

  const recursosColetados = bioma.recursos.filter(r => total >= r.cd);

  if (recursosColetados.length > 0) {
    const coletado = recursosColetados[recursosColetados.length - 1];
    _simForrageamento.resultado = {
      sucesso: true,
      mensagem: `Recurso Encontrado! Rolagem d20: ${d20} + bônus = ${total}`,
      detalhe: `Durante ${_simForrageamento.tempoHoras} horas de busca em ${bioma.nome}, você coletou: "${coletado.nome}" (${coletado.tipo}, Grau ${GRAUS_MATERIAL[coletado.grau]?.nome}). ${coletado.desc}`
    };
    toast(`Encontrado: ${coletado.nome}!`, 'success');
  } else {
    _simForrageamento.resultado = {
      sucesso: false,
      mensagem: `Nenhum recurso especial localizado. Rolagem d20: ${d20} + bônus = ${total}`,
      detalhe: `A área já havia sido explorada recentemente ou o clima adverso impediu a identificação de espécimes raros.`
    };
    toast('Nenhum recurso especial encontrado.', 'warning');
  }

  renderBancoMateriais(container);
}
