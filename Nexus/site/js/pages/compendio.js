// ============================================================
// Compêndio D&D 5.5 - Livro de Regras e Wiki do Sistema
// Acesso para consulta de Classes, Espécies, Antecedentes,
// Talentos, Magias, Equipamentos, Regras, Bestiário e Multiverso
// ============================================================

import {
  getClasse,
  getMagiasClasse,
  getAntecedentes,
  getEspecies,
  getTalentos,
  getArmas,
  getArmaduras,
  getEquipamentoAventura,
  getFerramentas,
  getMontariasVeiculos,
  getServicos,
  getItensMagicos,
  getIndiceMagias,
  getMagiasPorCirculo,
  getCriaturas,
  getMonstros,
  getGlossario,
  getCapitulo1Regras,
  getCapitulo2Criacao,
  getMultiverso
} from '../db.js';

import { CLASSES_INFO, NOMES_CLASSES, getIconeClasse } from '../dados-classes.js';
import { abrirModal, fecharModal, mdParaHtml, escHtml, semAcento } from '../utils.js';
import { definirTituloHeader, navegar } from '../app.js';

// Estado interno do Compêndio
let _secaoAtiva = 'classes';
let _subSecaoAtiva = '';
let _itemSelecionado = null;
let _buscaTexto = '';
let _filtroAdicional = 'todos';
let _filtroEscola = 'todas';
let _filtroClasse = 'todas';
let _filtroRitual = false;
let _filtroConcentracao = false;
let _navScrollLeft = 0;

// Cache em memória para buscas rápidas no compêndio
let _cacheMagiasCompletas = null;
let _cacheTalentos = null;
let _cacheEspecies = null;
let _cacheAntecedentes = null;
let _cacheArmas = null;
let _cacheArmaduras = null;
let _cacheEquipAventura = null;
let _cacheFerramentas = null;
let _cacheMontarias = null;
let _cacheServicos = null;
let _cacheItensMagicos = null;
let _cacheCriaturas = null;
let _cacheMonstros = null;
let _cacheGlossario = null;

const ICONE_BUSCA_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
let _cacheCapitulo1 = null;
let _cacheCapitulo2 = null;
let _cacheMultiverso = null;

/**
 * Rola apenas o container horizontal para manter o elemento visível, sem afetar o scroll vertical da página
 */
function _scrollHorizontalParaElemento(containerHorizontal, elementoFilho, behavior = 'smooth') {
  if (!containerHorizontal || !elementoFilho) return;
  const cRect = containerHorizontal.getBoundingClientRect();
  const eRect = elementoFilho.getBoundingClientRect();
  const scrollLeftAtual = containerHorizontal.scrollLeft;

  if (eRect.left < cRect.left) {
    containerHorizontal.scrollTo({
      left: Math.max(0, scrollLeftAtual - (cRect.left - eRect.left) - 16),
      behavior
    });
  } else if (eRect.right > cRect.right) {
    containerHorizontal.scrollTo({
      left: scrollLeftAtual + (eRect.right - cRect.right) + 16,
      behavior
    });
  }
}

/**
 * Ponto de entrada da página de Compêndio
 * @param {HTMLElement} container
 * @param {string} rotaParam - ex: "classes/Mago" ou "magias"
 */
export async function renderCompendio(container, rotaParam = '') {
  definirTituloHeader('Compêndio');

  // Parsear parâmetros de rota
  if (rotaParam) {
    const partes = rotaParam.split('/');
    const secao = partes[0] || '';
    if (secao) _secaoAtiva = secao;

    if (secao === 'classes') {
      _itemSelecionado = partes[1] ? decodeURIComponent(partes[1]) : null;
      _subSecaoAtiva = partes[2] || '';
    } else if (
      secao === 'equipamento' ||
      secao === 'regras' ||
      secao === 'glossario' ||
      secao === 'bestiario' ||
      secao === 'criaturas'
    ) {
      _itemSelecionado = null;
      _subSecaoAtiva = partes[1] || '';
    } else {
      _itemSelecionado = partes[1] ? decodeURIComponent(partes[1]) : null;
      _subSecaoAtiva = partes[2] || '';
    }
  } else {
    _itemSelecionado = null;
    _subSecaoAtiva = '';
  }

  const existingNav = container.querySelector('#compendio-nav-bar');
  const conteudoEl = container.querySelector('#compendio-secao-conteudo');

  if (!existingNav || !conteudoEl) {
    container.innerHTML = `
      <div class="compendio-container">
        <!-- Cabeçalho do Compêndio -->
        <div class="compendio-hero">
          <div>
            <div class="compendio-hero-title">
              <img src="img/icons/ico-home-compendio.png" class="compendio-hero-ico" alt="">
              <span>Compêndio</span>
            </div>
            <div class="compendio-hero-desc">
              Biblioteca de consulta completa das regras e informações do Livro do Jogador, Guia do Mestre e Manual dos Monstros.
            </div>
          </div>
        </div>

        <!-- Navegação Principal entre Seções -->
        <nav class="compendio-nav" id="compendio-nav-bar">
          <button class="compendio-nav-item ${_secaoAtiva === 'classes' ? 'ativo' : ''}" data-secao="classes"><img src="img/icons/ico-cat-classes.png" class="nav-cat-icon" alt=""> Classes</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'especies' ? 'ativo' : ''}" data-secao="especies"><img src="img/icons/ico-cat-especies.png" class="nav-cat-icon" alt=""> Espécies</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'antecedentes' ? 'ativo' : ''}" data-secao="antecedentes"><img src="img/icons/ico-cat-antecedentes.png" class="nav-cat-icon" alt=""> Antecedentes</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'talentos' ? 'ativo' : ''}" data-secao="talentos"><img src="img/icons/ico-cat-talentos.png" class="nav-cat-icon" alt=""> Talentos</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'magias' ? 'ativo' : ''}" data-secao="magias"><img src="img/icons/ico-cat-magias.png" class="nav-cat-icon" alt=""> Magias</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'equipamento' ? 'ativo' : ''}" data-secao="equipamento"><img src="img/icons/ico-cat-itens.png" class="nav-cat-icon" alt=""> Equipamento</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'itens_magicos' || _secaoAtiva === 'magicos' ? 'ativo' : ''}" data-secao="itens_magicos"><img src="img/icons/ico-cat-itens.png" class="nav-cat-icon" alt=""> Itens Mágicos</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'bestiario' || _secaoAtiva === 'criaturas' ? 'ativo' : ''}" data-secao="bestiario"><img src="img/icons/ico-cat-monstros.png" class="nav-cat-icon" alt=""> Bestiário</button>
          <button class="compendio-nav-item ${_secaoAtiva === 'regras' || _secaoAtiva === 'glossario' ? 'ativo' : ''}" data-secao="regras"><img src="img/icons/ico-cat-regras.png" class="nav-cat-icon" alt=""> Glossário e Regras</button>
        </nav>

        <!-- Conteúdo da Seção Ativa -->
        <div id="compendio-secao-conteudo">
          <div class="text-center" style="padding: 40px; color: var(--text-muted);">
            Carregando informações do compêndio...
          </div>
        </div>
      </div>
    `;

    const navBar = container.querySelector('#compendio-nav-bar');
    if (navBar) {
      navBar.addEventListener('scroll', () => {
        _navScrollLeft = navBar.scrollLeft;
      }, { passive: true });

      // Eventos de clique na navegação
      navBar.querySelectorAll('.compendio-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const secao = btn.dataset.secao;
          _secaoAtiva = secao;
          _subSecaoAtiva = '';
          _itemSelecionado = null;
          _buscaTexto = '';
          _filtroAdicional = 'todos';
          _filtroEscola = 'todas';
          _filtroClasse = 'todas';
          _filtroRitual = false;
          _filtroConcentracao = false;
          navegar(`compendio/${secao}`, { manterScroll: true });
        });
      });

      if (_navScrollLeft > 0) {
        navBar.scrollLeft = _navScrollLeft;
      }
      const activeBtn = navBar.querySelector('.compendio-nav-item.ativo');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
      }
    }
  } else {
    // Se a barra de navegação já existe, apenas atualiza os botões ativos sem recriar o DOM
    existingNav.querySelectorAll('.compendio-nav-item').forEach(btn => {
      const isAtivo = btn.dataset.secao === _secaoAtiva || 
        (_secaoAtiva === 'magicos' && btn.dataset.secao === 'itens_magicos') ||
        (_secaoAtiva === 'criaturas' && btn.dataset.secao === 'bestiario') ||
        (_secaoAtiva === 'glossario' && btn.dataset.secao === 'regras');
      btn.classList.toggle('ativo', isAtivo);
    });
    const activeBtn = existingNav.querySelector('.compendio-nav-item.ativo');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  // Renderizar a seção atual
  await _renderizarSecaoAtiva(container.querySelector('#compendio-secao-conteudo'));
}

/**
 * Despacha a renderização para a seção correta
 */
async function _renderizarSecaoAtiva(container) {
  switch (_secaoAtiva) {
    case 'classes':
      await _renderClasses(container);
      break;
    case 'especies':
      await _renderEspecies(container);
      break;
    case 'antecedentes':
      await _renderAntecedentes(container);
      break;
    case 'talentos':
      await _renderTalentos(container);
      break;
    case 'magias':
      await _renderMagias(container);
      break;
    case 'equipamento':
      await _renderEquipamento(container);
      break;
    case 'itens_magicos':
    case 'magicos':
      await _renderItensMagicos(container);
      break;
    case 'bestiario':
    case 'criaturas':
      await _renderBestiario(container);
      break;
    case 'regras':
    case 'glossario':
      await _renderRegras(container);
      break;
    default:
      await _renderClasses(container);
  }
}

// ============================================================
// 1. SEÇÃO: CLASSES
// ============================================================

async function _renderClasses(container) {
  delete container.dataset.classeAberta;

  const todasClasses = [
    { nome: 'Artífice', dado: 'd8', attr: 'Inteligência', desc: 'Mestres da invenção mágica e infusões de itens.' },
    { nome: 'Bárbaro', dado: 'd12', attr: 'Força', desc: 'Guerreiros ferozes impulsionados por uma fúria primal inigualável.' },
    { nome: 'Bardo', dado: 'd8', attr: 'Carisma', desc: 'Mestres da música, encanto, histórias e magias de apoio versáteis.' },
    { nome: 'Bruxo', dado: 'd8', attr: 'Carisma', desc: 'Portadores de magia mística concedida por patronos transcendentais.' },
    { nome: 'Clérigo', dado: 'd8', attr: 'Sabedoria', desc: 'Campeões divinos que empunham magias sagradas e expulsam profanos.' },
    { nome: 'Druida', dado: 'd8', attr: 'Sabedoria', desc: 'Guardiões da natureza capazes de se transformar em feras majestosas.' },
    { nome: 'Feiticeiro', dado: 'd6', attr: 'Carisma', desc: 'Conjuradores inatos com magia fluindo no próprio sangue e metamagia.' },
    { nome: 'Guardião', dado: 'd10', attr: 'Destreza / Sabedoria', desc: 'Rastreadores e caçadores que dominam o combate ermo e magias naturais.' },
    { nome: 'Guerreiro', dado: 'd10', attr: 'Força ou Destreza', desc: 'Mestres consumados de armas, armaduras e manobras táticas de batalha.' },
    { nome: 'Ladino', dado: 'd8', attr: 'Destreza', desc: 'Especialistas em furtividade, precisão de ataque e desativação de armadilhas.' },
    { nome: 'Mago', dado: 'd6', attr: 'Inteligência', desc: 'Estudiosos supremos das artes arcanas com o mais vasto repertório de magias.' },
    { nome: 'Monge', dado: 'd8', attr: 'Destreza / Sabedoria', desc: 'Mestres do poder marcial corporal e canalizadores da energia espiritual.' },
    { nome: 'Paladino', dado: 'd10', attr: 'Força / Carisma', desc: 'Guerreiros sagrados juramentados que canalizam punições divinas devastadoras.' }
  ];

  // Pré-carregamento em background das classes para garantir abertura 100% instantânea no clique
  todasClasses.forEach(c => {
    getClasse(c.nome);
    const infoBasica = CLASSES_INFO[c.nome] || {};
    if (infoBasica.conjurador) {
      getMagiasClasse(c.nome);
    }
  });

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Classes de Personagem</h2>
      <p>
        Selecione uma classe para consultar todas as suas características de nível 1 a 20, tabela de progressão, subclasses e lista de magias.
      </p>
    </div>

    <div class="compendio-grid">
      ${todasClasses.map(c => {
        const icone = getIconeClasse(c.nome);
        return `
        <div class="compendio-card compendio-card-clickable" data-classe="${c.nome}">
          <div class="compendio-card-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              ${icone ? `<img src="${icone}" class="classe-icon-card" alt="">` : ''}
              <div>
                <div class="compendio-card-title">${c.nome}</div>
                <div class="compendio-card-subtitle">Dado de Vida: ${c.dado} • Atributo: ${c.attr}</div>
              </div>
            </div>
          </div>
          <div class="compendio-card-body">
            ${c.desc}
          </div>
          <div class="compendio-card-footer">
            <span style="color: var(--accent); font-weight: 600;">Ver detalhes e progressão &rarr;</span>
          </div>
        </div>
      `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('[data-classe]').forEach(card => {
    card.addEventListener('click', () => {
      _abrirModalClasse(card.dataset.classe);
    });
  });

  if (_itemSelecionado) {
    const nomeItem = _itemSelecionado;
    _itemSelecionado = null;
    _abrirModalClasse(nomeItem, _subSecaoAtiva || 'caracteristicas');
  }
}

/**
 * Visualização da classe em modal de alta performance e detalhes completos
 */
async function _abrirModalClasse(nomeClasse, subAbaInicial = 'caracteristicas') {
  const dados = await getClasse(nomeClasse);
  if (!dados) return;

  const infoBasica = CLASSES_INFO[nomeClasse] || {};
  const magiasClasse = infoBasica.conjurador ? await getMagiasClasse(nomeClasse) : null;
  const temMagias = magiasClasse && magiasClasse.magias && magiasClasse.magias.length > 0;

  const armadurasLista = (infoBasica.armaduras || infoBasica.proficiencias_armaduras || []).join(', ') || 'Nenhuma';
  const armasLista = (infoBasica.armas || infoBasica.proficiencias_armas || []).join(', ') || 'Simples';
  const ferramentasLista = (infoBasica.proficiencias_ferramentas || []).join(', ') || 'Nenhuma';
  const periciasLista = (infoBasica.pericias_opcoes || infoBasica.opcoes_pericias || []).join(', ') || 'Qualquer perícia';
  const numPericias = infoBasica.num_pericias || infoBasica.qtd_pericias || 2;

  const corpo = `
    <div class="modal-classe-conteudo" style="font-size: 0.88rem; line-height: 1.6;">
      <!-- Resumo da Classe -->
      <div style="background: var(--bg-input); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; border-left: 3px solid var(--accent);">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; align-items: center;">
          <span class="c-badge c-badge-categoria" style="font-size: 0.8rem; font-weight: 700;">
            Dado de Vida: ${infoBasica.dado_vida || dados.dado_vida || 'd8'}
          </span>
          <span class="c-badge c-badge-categoria">
            Atributo: ${infoBasica.atributo_primario || 'Varia'}
          </span>
          <span class="c-badge c-badge-categoria">
            Salvaguardas: ${(infoBasica.salvaguardas || []).join(', ')}
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px; font-size: 0.8rem; color: var(--text-muted); padding-top: 8px; border-top: 1px solid var(--border-light);">
          <div><strong style="color: var(--ink);">Armaduras:</strong> ${armadurasLista}</div>
          <div><strong style="color: var(--ink);">Armas:</strong> ${armasLista}</div>
          <div><strong style="color: var(--ink);">Ferramentas:</strong> ${ferramentasLista}</div>
          <div><strong style="color: var(--ink);">Perícias (${numPericias}):</strong> ${periciasLista}</div>
        </div>
      </div>

      <!-- Sub-navegação do Modal -->
      <div class="compendio-detail-nav" id="modal-classe-nav" style="margin-bottom: 14px; position: sticky; top: -16px; background: var(--bg-card); z-index: 2; padding: 4px 0;">
        <button class="compendio-detail-tab ${subAbaInicial === 'caracteristicas' ? 'ativo' : ''}" data-modal-subaba="caracteristicas">
          Características (${(dados.caracteristicas || []).length})
        </button>
        <button class="compendio-detail-tab ${subAbaInicial === 'tabela' ? 'ativo' : ''}" data-modal-subaba="tabela">
          Tabela de Progressão
        </button>
        <button class="compendio-detail-tab ${subAbaInicial === 'subclasses' ? 'ativo' : ''}" data-modal-subaba="subclasses">
          Subclasses (${(dados.subclasses || []).length})
        </button>
        ${temMagias ? `
          <button class="compendio-detail-tab ${subAbaInicial === 'magias' ? 'ativo' : ''}" data-modal-subaba="magias">
            Magias (${magiasClasse.magias.length})
          </button>
        ` : ''}
      </div>

      <!-- Conteúdo da sub-aba dentro do modal -->
      <div id="modal-classe-subaba-conteudo" style="min-height: 200px;"></div>
    </div>
  `;

  const iconeModal = getIconeClasse(nomeClasse);
  const tituloModal = iconeModal
    ? `<span style="display:inline-flex;align-items:center;gap:10px;"><img src="${iconeModal}" class="classe-icon-card" style="width:26px;height:26px;" alt=""><span>${escHtml(nomeClasse)}</span></span>`
    : escHtml(nomeClasse);

  abrirModal(tituloModal, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');

  const navModal = document.getElementById('modal-classe-nav');
  const subContainer = document.getElementById('modal-classe-subaba-conteudo');

  function trocarAba(novaAba) {
    if (!navModal || !subContainer) return;
    navModal.querySelectorAll('.compendio-detail-tab').forEach(tab => {
      const isAtivo = tab.dataset.modalSubaba === novaAba;
      tab.classList.toggle('ativo', isAtivo);
      if (isAtivo) {
        _scrollHorizontalParaElemento(navModal, tab);
      }
    });

    if (novaAba === 'tabela') {
      _renderTabelaProgressao(subContainer, dados);
    } else if (novaAba === 'subclasses') {
      _renderSubclasses(subContainer, dados);
    } else if (novaAba === 'magias' && temMagias) {
      _renderMagiasClasse(subContainer, nomeClasse, magiasClasse);
    } else {
      _renderCaracteristicasClasse(subContainer, dados);
    }
  }

  if (navModal) {
    navModal.querySelectorAll('[data-modal-subaba]').forEach(tab => {
      tab.addEventListener('click', () => {
        trocarAba(tab.dataset.modalSubaba);
      });
    });
  }

  trocarAba(subAbaInicial);
}

/**
 * Renderiza características de classe com acordeões
 */
function _renderCaracteristicasClasse(container, dados) {
  const caracteristicas = dados.caracteristicas || [];
  if (caracteristicas.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Nenhuma característica detalhada encontrada.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${caracteristicas.map((c, i) => `
        <div class="compendio-accordion">
          <div class="compendio-accordion-header ${i === 0 ? 'aberto' : ''}" data-acc-index="${i}">
            <span>
              <strong>${escHtml(c.nome)}</strong>
              <span class="c-badge c-badge-categoria" style="margin-left: 8px;">Nível ${c.nivel}</span>
            </span>
            <span class="acc-icon">${i === 0 ? '▲' : '▼'}</span>
          </div>
          <div class="compendio-accordion-body" id="acc-body-${i}" style="${i === 0 ? '' : 'display: none;'}">
            ${mdParaHtml(c.descricao || '')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.compendio-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const idx = header.dataset.accIndex;
      const body = document.getElementById(`acc-body-${idx}`);
      const icon = header.querySelector('.acc-icon');
      const aberto = header.classList.toggle('aberto');
      body.style.display = aberto ? 'block' : 'none';
      icon.textContent = aberto ? '▲' : '▼';
    });
  });
}

/**
 * Renderiza a Tabela de Progressão de 1 a 20 da classe
 */
function _renderTabelaProgressao(container, dados) {
  const tabela = dados.tabela_caracteristicas || [];
  if (tabela.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Tabela não disponível para esta classe.</p></div>`;
    return;
  }

  // Descobrir colunas dinâmicas da tabela
  const todasChaves = new Set();
  tabela.forEach(linha => {
    Object.keys(linha).forEach(k => todasChaves.add(k));
  });

  // Ordenar colunas lógicas
  const colunasPrincipais = ['nivel', 'bonus_proficiencia', 'caracteristicas'];
  const colunasExtras = Array.from(todasChaves).filter(k => !colunasPrincipais.includes(k));
  const colunasOrdenadas = [...colunasPrincipais.filter(k => todasChaves.has(k)), ...colunasExtras];

  const nomesColunas = {
    nivel: 'Nível',
    bonus_proficiencia: 'Bônus Prof.',
    caracteristicas: 'Características',
    furia: 'Fúrias',
    dano_furia: 'Dano de Fúria',
    artes_marciais: 'Artes Marciais',
    pontos_feitiçaria: 'Pontos Feitiçaria',
    truques_conhecidos: 'Truques',
    magias_preparadas: 'Magias Prep.',
    espacos_magia: 'Espaços de Magia'
  };

  container.innerHTML = `
    <div class="card" style="padding: 12px; overflow: hidden;">
      <div class="table-wrapper">
        <table class="compendio-table">
          <thead>
            <tr>
              ${colunasOrdenadas.map(col => `<th>${nomesColunas[col] || col.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tabela.map(linha => `
              <tr>
                ${colunasOrdenadas.map(col => {
                  let valor = linha[col];
                  if (typeof valor === 'object' && valor !== null) {
                    valor = Object.entries(valor).map(([k, v]) => `${k}º: ${v}`).join(' | ');
                  }
                  if (Array.isArray(valor)) {
                    valor = valor.join(', ');
                  }
                  return `<td>${escHtml(String(valor || '—'))}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Renderiza subclasses de uma classe
 */
function _renderSubclasses(container, dados) {
  const subclasses = dados.subclasses || [];
  if (subclasses.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Nenhuma subclasse cadastrada.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${subclasses.map(sub => `
        <div class="card">
          <div class="card-header">
            <h2>${escHtml(sub.nome)}</h2>
          </div>
          ${sub.descricao ? `<div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 14px;">${mdParaHtml(sub.descricao)}</div>` : ''}
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(sub.caracteristicas || []).map(feat => `
              <div style="background: var(--bg-input); border-radius: var(--radius-sm); padding: 12px; border-left: 3px solid var(--accent);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="color: #ffffff; font-size: 0.92rem;">${escHtml(feat.nome)}</strong>
                  <span class="c-badge c-badge-categoria">Nível ${feat.nivel || '—'}</span>
                </div>
                <div style="font-size: 0.83rem; color: var(--ink); line-height: 1.5;">
                  ${mdParaHtml(feat.descricao || '')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Renderiza magias de uma classe específica
 */
function _renderMagiasClasse(container, nomeClasse, magiasClasse) {
  const lista = magiasClasse.magias || [];

  container.innerHTML = `
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-magias-classe" placeholder="Buscar magia de ${nomeClasse}...">
      </div>
      <div class="compendio-count-badge" id="contagem-magias-classe">
        Total: ${lista.length} magias
      </div>
    </div>

    <div class="compendio-grid-dense" id="grid-magias-classe">
      ${_gerarCardsMagiaHTML(lista)}
    </div>
  `;

  const inputBusca = container.querySelector('#busca-magias-classe');
  const grid = container.querySelector('#grid-magias-classe');
  const contador = container.querySelector('#contagem-magias-classe');

  inputBusca.addEventListener('input', () => {
    const termo = semAcento(inputBusca.value);
    const filtradas = lista.filter(m => semAcento(m.nome).includes(termo) || semAcento(m.escola || '').includes(termo));
    grid.innerHTML = _gerarCardsMagiaHTML(filtradas);
    contador.textContent = `Total: ${filtradas.length} magias`;
    _atribuirEventosDetalhesMagia(grid);
  });

  _atribuirEventosDetalhesMagia(grid);
}

// ============================================================
// 2. SEÇÃO: ESPÉCIES (RAÇAS)
// ============================================================

function _obterResumoEspecie(esp) {
  const resumos = {
    'Aasimar': 'Mortais tocados pela centelha celestial dos Planos Superiores, trazendo luz, cura e fúria divina.',
    'Anão': 'Resilientes mestres da pedra e forja, com afinidade subterrânea e resistência a venenos.',
    'Draconato': 'Descendentes de dragões com armas de sopro elementais, escamas resistentes e poder draconato.',
    'Elfo': 'Seres graciosos de Faéria com visão na penumbra, transe meditativo e herança ancestral mágica.',
    'Gnomo': 'Inventores astutos e mágicos de estatura diminuta, com astúcia mental e talentos engenhosos.',
    'Golias': 'Descendentes imponentes de gigantes, dotados de força elemental, porte poderoso e resistência física.',
    'Humano': 'O povo mais versátil e ambicioso do multiverso, dotado de adaptabilidade e inspiração heroica.',
    'Orc': 'Guerreiros robustos dotados de vigor implacável, adrenalina em batalha e determinação inabalável.',
    'Pequenino': 'Povo alegre, ágil e incrivelmente sortudo, capaz de se esgueirar com facilidade e bravura.',
    'Tiferino': 'Portadores de um legado ancestral dos Planos Inferiores com poderes sobrenaturais e taumaturgia.',
    'Kenku': 'Humanoides corvos com memória prodigiosa, mimetismo de sons e talento para cópias perfeitas.'
  };
  if (resumos[esp.nome]) return resumos[esp.nome];
  if (esp.descricao) {
    const primeiraFrase = esp.descricao.split('\n')[0].replace(/\*\*/g, '').trim();
    if (primeiraFrase.length > 130) return primeiraFrase.slice(0, 127) + '...';
    return primeiraFrase;
  }
  return 'Espécie jogável com características e traços únicos.';
}

async function _renderEspecies(container) {
  if (!_cacheEspecies) {
    _cacheEspecies = await getEspecies();
  }
  const especies = _cacheEspecies?.especies || [];

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Espécies de Personagem</h2>
      <p>
        Consulte as características raciais, traços únicos, deslocamentos, tamanhos e linhagens.
      </p>
    </div>

    <div class="compendio-grid">
      ${especies.map(esp => `
        <div class="compendio-card compendio-card-clickable" data-especie-nome="${esp.nome}">
          <div class="compendio-card-header">
            <div>
              <div class="compendio-card-title">${escHtml(esp.nome)}</div>
              <div class="compendio-card-subtitle">
                ${esp.tipo_criatura || 'Humanoide'} • ${esp.tamanho || 'Médio'} • ${esp.deslocamento || '9 m'}
              </div>
            </div>
          </div>
          <div class="compendio-card-body">
            <p style="margin-bottom: 8px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${_obterResumoEspecie(esp)}</p>
            <div style="margin-top: 6px;">
              <strong style="font-size: 0.78rem; color: var(--accent);">Traços:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
                ${(esp.tracos || []).map(t => `<span class="c-badge c-badge-categoria">${escHtml(t.nome)}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="compendio-card-footer">
            <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-especie-nome]').forEach(card => {
    card.addEventListener('click', () => {
      const esp = especies.find(e => e.nome === card.dataset.especieNome);
      if (esp) _abrirModalEspecie(esp);
    });
  });
}

function _abrirModalEspecie(esp) {
  const corpo = `
    <div style="font-size: 0.88rem; line-height: 1.6;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="c-badge c-badge-categoria">Tipo: ${esp.tipo_criatura || 'Humanoide'}</span>
        <span class="c-badge c-badge-categoria">Tamanho: ${esp.tamanho || 'Médio'}</span>
        <span class="c-badge c-badge-categoria">Deslocamento: ${esp.deslocamento || '9 m'}</span>
      </div>
      
      <p style="margin-bottom: 16px; color: var(--text-muted);">${mdParaHtml(esp.descricao || '')}</p>

      <h3 style="font-size: 1.05rem; color: var(--gold-light); margin-bottom: 10px; font-weight: 700; font-family: 'Cinzel', serif;">Traços Raciais</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${(esp.tracos || []).map(t => `
          <div style="background: var(--bg-input); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
            <strong style="color: #ffffff; display: block; margin-bottom: 2px;">${escHtml(t.nome)}</strong>
            <div style="font-size: 0.83rem; color: var(--ink);">${mdParaHtml(t.descricao || '')}</div>
          </div>
        `).join('')}
      </div>

      ${esp.linhagens && esp.linhagens.length > 0 ? `
        <h3 style="font-size: 1.05rem; color: var(--gold-light); margin: 16px 0 10px; font-weight: 700; font-family: 'Cinzel', serif;">Linhagens / Sub-raças</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${esp.linhagens.map(lin => `
            <div style="background: var(--surface-variant); padding: 10px 12px; border-radius: var(--radius-sm);">
              <strong style="color: var(--accent);">${escHtml(lin.nome)}</strong>
              <div style="font-size: 0.83rem; margin-top: 4px;">${mdParaHtml(lin.descricao || '')}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  abrirModal(esp.nome, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

// ============================================================
// 3. SEÇÃO: ANTECEDENTES (BACKGROUNDS)
// ============================================================

function _formatarListaTexto(val) {
  if (!val) return '—';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

async function _renderAntecedentes(container) {
  if (!_cacheAntecedentes) {
    _cacheAntecedentes = await getAntecedentes();
  }
  const antecedentes = _cacheAntecedentes?.antecedentes || [];

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Antecedentes (Origens)</h2>
      <p>
        No D&D 5.5, os antecedentes definem seus bônus de atributos (+2/+1 ou +1/+1/+1), seu Talento de Origem, proficiências em perícias e ferramentas.
      </p>
    </div>

    <div class="compendio-grid">
      ${antecedentes.map(ant => `
        <div class="compendio-card compendio-card-clickable" data-ant-nome="${escHtml(ant.nome)}">
          <div class="compendio-card-header">
            <div>
              <div class="compendio-card-title">${escHtml(ant.nome)}</div>
              <div class="compendio-card-subtitle">Talento: ${escHtml(ant.talento || '—')}</div>
            </div>
            <span class="c-badge c-badge-origem">Origem</span>
          </div>
          <div class="compendio-card-body">
            <div style="margin-bottom: 6px;">
              <strong>Atributos:</strong> <span style="color: var(--accent);">${escHtml(_formatarListaTexto(ant.valores_atributo || ant.atributos))}</span>
            </div>
            <div style="margin-bottom: 6px;">
              <strong>Perícias:</strong> <span style="color: var(--text-muted);">${escHtml(_formatarListaTexto(ant.pericias))}</span>
            </div>
            <div>
              <strong>Ferramenta:</strong> <span style="color: var(--text-muted);">${escHtml(_formatarListaTexto(ant.ferramentas || ant.ferramenta))}</span>
            </div>
          </div>
          <div class="compendio-card-footer">
            <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-ant-nome]').forEach(card => {
    card.addEventListener('click', () => {
      const ant = antecedentes.find(a => a.nome === card.dataset.antNome);
      if (ant) _abrirModalAntecedente(ant);
    });
  });
}

function _abrirModalAntecedente(ant) {
  const corpo = `
    <div style="font-size: 0.88rem; line-height: 1.6;">
      <div style="background: var(--bg-input); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px;">
        <div style="margin-bottom: 4px;"><strong>Opções de Atributos:</strong> ${escHtml(_formatarListaTexto(ant.valores_atributo || ant.atributos))}</div>
        <div style="margin-bottom: 4px;"><strong>Talento Concedido:</strong> <span style="color: var(--accent); font-weight: 700;">${escHtml(ant.talento || '—')}</span></div>
        <div style="margin-bottom: 4px;"><strong>Proficiências em Perícias:</strong> ${escHtml(_formatarListaTexto(ant.pericias))}</div>
        <div><strong>Proficiência em Ferramenta:</strong> ${escHtml(_formatarListaTexto(ant.ferramentas || ant.ferramenta))}</div>
        ${ant.idiomas_obrigatorios || ant.idiomas_opcoes ? `
          <div style="margin-top: 4px;"><strong>Idiomas:</strong> ${escHtml([
            ...(Array.isArray(ant.idiomas_obrigatorios) ? ant.idiomas_obrigatorios : (ant.idiomas_obrigatorios ? [ant.idiomas_obrigatorios] : [])),
            ...(ant.idiomas_adicionais ? [`+${ant.idiomas_adicionais} adicionais`] : [])
          ].join(', '))}</div>
        ` : ''}
      </div>

      ${ant.descricao ? `<div style="margin-bottom: 14px; color: var(--text-muted);">${mdParaHtml(ant.descricao)}</div>` : ''}

      <h3 style="font-size: 1.05rem; color: var(--gold-light); margin-bottom: 6px; font-weight: 700; font-family: 'Cinzel', serif;">Equipamento Inicial</h3>
      <div style="font-size: 0.85rem; color: var(--ink);">
        ${mdParaHtml(ant.equipamento || ant.equipamento_inicial || 'Consulte as opções de equipamento recomendadas no livro.')}
      </div>
    </div>
  `;

  abrirModal(ant.nome, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

// ============================================================
// 4. SEÇÃO: TALENTOS
// ============================================================

function _obterResumoTalento(t) {
  if (t.descricao && !t.descricao.startsWith('Você adquire os seguintes benefícios.')) {
    const limpo = t.descricao.split('\n')[0].replace(/\*\*/g, '').trim();
    return limpo.length > 130 ? limpo.slice(0, 127) + '...' : limpo;
  }
  const bens = t.beneficios || [];
  const principal = bens.find(b => b.nome !== 'Aumento no Valor de Atributo' && b.nome !== 'Repetível') || bens[0];
  if (principal && principal.descricao) {
    const texto = principal.descricao.split('\n')[0].replace(/\*\*/g, '').trim();
    return texto.length > 130 ? texto.slice(0, 127) + '...' : texto;
  }
  return 'Talento especial com benefícios e aprimoramentos.';
}

async function _renderTalentos(container) {
  if (!_cacheTalentos) {
    _cacheTalentos = await getTalentos();
  }
  const talentos = _cacheTalentos?.talentos || _cacheTalentos?.todos || Object.values(_cacheTalentos?.por_categoria || {}).flat() || [];

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Catálogo de Talentos</h2>
      <p>
        Explore todos os talentos de Origem, Gerais, Estilos de Luta e Dádivas Épicas do sistema.
      </p>
    </div>

    <!-- Barra de Filtros e Busca -->
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-talento" placeholder="Buscar talento por nome, pré-requisito ou benefício...">
      </div>
      <div class="compendio-count-badge" id="contagem-talentos">
        Total: ${talentos.length} talentos
      </div>
    </div>

    <!-- Sub-nav de Categorias -->
    <div class="compendio-subnav" id="subnav-talentos">
      <button class="compendio-subnav-btn ${_filtroAdicional === 'todos' ? 'ativo' : ''}" data-cat="todos">Todos (${talentos.length})</button>
      <button class="compendio-subnav-btn ${_filtroAdicional === 'origem' ? 'ativo' : ''}" data-cat="origem">De Origem</button>
      <button class="compendio-subnav-btn ${_filtroAdicional === 'geral' ? 'ativo' : ''}" data-cat="geral">Gerais</button>
      <button class="compendio-subnav-btn ${_filtroAdicional === 'estilo' ? 'ativo' : ''}" data-cat="estilo">Estilos de Luta</button>
      <button class="compendio-subnav-btn ${_filtroAdicional === 'dadiva' ? 'ativo' : ''}" data-cat="dadiva">Dádivas Épicas</button>
    </div>

    <!-- Grid de Talentos -->
    <div class="compendio-grid" id="grid-talentos">
      ${_gerarCardsTalentosHTML(talentos)}
    </div>
  `;

  const inputBusca = container.querySelector('#busca-talento');
  const grid = container.querySelector('#grid-talentos');
  const contador = container.querySelector('#contagem-talentos');
  const subnav = container.querySelector('#subnav-talentos');

  function vincularEventosCards() {
    grid.querySelectorAll('[data-talento-nome]').forEach(card => {
      card.addEventListener('click', () => {
        const talento = talentos.find(t => t.nome === card.dataset.talentoNome);
        if (talento) _abrirModalTalento(talento);
      });
    });
  }

  function filtrar() {
    const termo = semAcento(inputBusca.value || '');
    const cat = _filtroAdicional;

    const filtrados = talentos.filter(t => {
      const matchCat = _categoriaTalentoCombina(t.categoria, cat);
      const matchTexto = !termo ||
        semAcento(t.nome || '').includes(termo) ||
        semAcento(t.descricao || '').includes(termo) ||
        semAcento(t.prerequisito || t.pre_requisito || '').includes(termo) ||
        (t.beneficios || []).some(b => semAcento(b.nome || '').includes(termo) || semAcento(b.descricao || '').includes(termo));
      return matchCat && matchTexto;
    });

    grid.innerHTML = _gerarCardsTalentosHTML(filtrados);
    contador.textContent = `Total: ${filtrados.length} talentos`;
    vincularEventosCards();
  }

  vincularEventosCards();

  inputBusca.addEventListener('input', filtrar);

  subnav.querySelectorAll('.compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      subnav.querySelectorAll('.compendio-subnav-btn').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      _scrollHorizontalParaElemento(subnav, btn);
      _filtroAdicional = btn.dataset.cat;
      filtrar();
    });
  });
}

function _categoriaTalentoCombina(categoriaTalento, filtro) {
  if (!filtro || filtro === 'todos') return true;
  const normal = semAcento(categoriaTalento || '').toLowerCase();
  if (filtro === 'origem') return normal.includes('origem');
  if (filtro === 'geral') return normal.includes('geral');
  if (filtro === 'estilo') return normal.includes('estilo');
  if (filtro === 'dadiva') return normal.includes('dadiva') || normal.includes('dádiva');
  return normal === filtro;
}

function _gerarCardsTalentosHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhum talento encontrado com os filtros aplicados.</p></div>`;
  }

  return lista.map(t => {
    const catNormal = semAcento(t.categoria || '').toLowerCase();
    let badgeClass = 'c-badge-categoria';
    let badgeTexto = t.categoria || 'Geral';
    if (catNormal.includes('origem')) {
      badgeClass = 'c-badge-origem';
      badgeTexto = 'De Origem';
    } else if (catNormal.includes('dadiva') || catNormal.includes('dádiva')) {
      badgeClass = 'c-badge-dadiva';
      badgeTexto = 'Dádiva Épica';
    } else if (catNormal.includes('estilo')) {
      badgeClass = 'c-badge-escola';
      badgeTexto = 'Estilo de Luta';
    } else {
      badgeTexto = 'Geral';
    }

    const prereq = t.prerequisito || t.pre_requisito;
    const temBeneficios = Array.isArray(t.beneficios) && t.beneficios.length > 0;

    return `
      <div class="compendio-card compendio-card-clickable" data-talento-nome="${escHtml(t.nome)}">
        <div class="compendio-card-header">
          <div>
            <div class="compendio-card-title">${escHtml(t.nome)}</div>
            <div class="compendio-card-subtitle">
              ${prereq && prereq !== 'Nenhum' ? `Pré-requisito: ${escHtml(prereq)}` : 'Sem pré-requisito'}
            </div>
          </div>
          <span class="c-badge ${badgeClass}">${escHtml(badgeTexto)}</span>
        </div>
        <div class="compendio-card-body">
          <p style="margin-bottom: 8px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">
            ${_obterResumoTalento(t)}
          </p>
          ${temBeneficios ? `
            <div style="margin-top: 6px;">
              <strong style="font-size: 0.78rem; color: var(--accent);">Benefícios:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
                ${t.beneficios.map(b => `<span class="c-badge c-badge-categoria">${escHtml(b.nome)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="compendio-card-footer">
          <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

function _abrirModalTalento(t) {
  const catNormal = semAcento(t.categoria || '').toLowerCase();
  let badgeClass = 'c-badge-categoria';
  let badgeTexto = t.categoria || 'Geral';
  if (catNormal.includes('origem')) {
    badgeClass = 'c-badge-origem';
    badgeTexto = 'De Origem';
  } else if (catNormal.includes('dadiva') || catNormal.includes('dádiva')) {
    badgeClass = 'c-badge-dadiva';
    badgeTexto = 'Dádiva Épica';
  } else if (catNormal.includes('estilo')) {
    badgeClass = 'c-badge-escola';
    badgeTexto = 'Estilo de Luta';
  } else {
    badgeTexto = 'Geral';
  }

  const prereq = t.prerequisito || t.pre_requisito;
  const temBeneficios = Array.isArray(t.beneficios) && t.beneficios.length > 0;
  const descricaoIntro = (t.descricao && t.descricao !== 'Você adquire os seguintes benefícios.') ? t.descricao : '';

  const corpo = `
    <div style="font-size: 0.88rem; line-height: 1.6;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="c-badge ${badgeClass}">${escHtml(badgeTexto)}</span>
        ${prereq && prereq !== 'Nenhum' ? `<span class="c-badge c-badge-categoria">Pré-requisito: ${escHtml(prereq)}</span>` : '<span class="c-badge c-badge-categoria">Sem pré-requisito</span>'}
      </div>

      ${t.aumento_atributo ? `
        <div style="background: var(--bg-input); padding: 10px 12px; border-radius: var(--radius-sm); margin-bottom: 12px; border-left: 3px solid var(--accent);">
          <strong style="color: var(--accent);">Aumento no Valor de Atributo:</strong>
          <span style="color: var(--ink);">${escHtml(t.aumento_atributo)}</span>
        </div>
      ` : ''}

      ${descricaoIntro ? `<div style="margin-bottom: 14px; color: var(--text-muted);">${mdParaHtml(descricaoIntro)}</div>` : ''}

      ${temBeneficios ? `
        <h3 style="font-size: 1.05rem; color: var(--gold-light); margin-bottom: 10px; font-weight: 700; font-family: 'Cinzel', serif;">Benefícios do Talento</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${t.beneficios.map(b => `
            <div style="background: var(--bg-input); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
              <strong style="color: #ffffff; display: block; margin-bottom: 2px;">${escHtml(b.nome)}</strong>
              <div style="font-size: 0.84rem; color: var(--ink);">${mdParaHtml(b.descricao || '')}</div>
            </div>
          `).join('')}
        </div>
      ` : (t.descricao ? `<div style="font-size: 0.88rem; color: var(--ink);">${mdParaHtml(t.descricao)}</div>` : '')}
    </div>
  `;

  abrirModal(t.nome, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

// ============================================================
// 5. SEÇÃO: MAGIAS (GRIMÓRIO COMPLETO)
// ============================================================

async function _renderMagias(container) {
  // Carregar magias se não estiver em cache
  if (!_cacheMagiasCompletas) {
    container.innerHTML = `<div class="text-center" style="padding: 40px;"><p>Carregando grimório de magias completo...</p></div>`;
    const circulos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const resultados = await Promise.all(circulos.map(c => getMagiasPorCirculo(c)));
    let todas = [];
    resultados.forEach(res => {
      if (res && res.magias) {
        todas = todas.concat(res.magias);
      }
    });
    _cacheMagiasCompletas = todas;
  }

  const todasMagias = _cacheMagiasCompletas;

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Grimório de Magias</h2>
      <p>
        Consulte todas as magias do jogo. Filtre por círculo, classe, escola de magia, tempo de conjuração e rituais.
      </p>
    </div>

    <!-- Toolbar de Busca e Filtros -->
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-magia" placeholder="Buscar magia pelo nome ou descrição...">
      </div>

      <!-- Filtro de Escola -->
      <select class="form-select" id="filtro-escola" style="width: auto; font-size: 0.82rem; padding: 7px 28px 7px 10px;">
        <option value="todas">Todas as Escolas</option>
        <option value="Abjuração">Abjuração</option>
        <option value="Adivinhação">Adivinhação</option>
        <option value="Conjuração">Conjuração</option>
        <option value="Encantamento">Encantamento</option>
        <option value="Evocação">Evocação</option>
        <option value="Ilusão">Ilusão</option>
        <option value="Necromancia">Necromancia</option>
        <option value="Transmutação">Transmutação</option>
      </select>

      <!-- Filtro de Classe -->
      <select class="form-select" id="filtro-classe-magia" style="width: auto; font-size: 0.82rem; padding: 7px 28px 7px 10px;">
        <option value="todas">Todas as Classes</option>
        <option value="Artífice">Artífice</option>
        <option value="Bardo">Bardo</option>
        <option value="Bruxo">Bruxo</option>
        <option value="Clérigo">Clérigo</option>
        <option value="Druida">Druida</option>
        <option value="Feiticeiro">Feiticeiro</option>
        <option value="Guardião">Guardião</option>
        <option value="Mago">Mago</option>
        <option value="Paladino">Paladino</option>
      </select>

      <div class="compendio-count-badge" id="contagem-magias">
        Total: ${todasMagias.length} magias
      </div>
    </div>

    <!-- Sub-nav de Círculos -->
    <div class="compendio-subnav" id="subnav-circulos">
      <button class="compendio-subnav-btn ${_filtroAdicional === 'todos' ? 'ativo' : ''}" data-circulo="todos">Todos</button>
      <button class="compendio-subnav-btn ${_filtroAdicional === '0' ? 'ativo' : ''}" data-circulo="0">Truques</button>
      ${[1,2,3,4,5,6,7,8,9].map(c => `
        <button class="compendio-subnav-btn ${_filtroAdicional === String(c) ? 'ativo' : ''}" data-circulo="${c}">${c}º Círculo</button>
      `).join('')}
    </div>

    <!-- Grid de Magias -->
    <div class="compendio-grid-dense" id="grid-magias">
      ${_gerarCardsMagiaHTML(todasMagias)}
    </div>
  `;

  const inputBusca = container.querySelector('#busca-magia');
  const selectEscola = container.querySelector('#filtro-escola');
  const selectClasse = container.querySelector('#filtro-classe-magia');
  const grid = container.querySelector('#grid-magias');
  const contador = container.querySelector('#contagem-magias');
  const subnav = container.querySelector('#subnav-circulos');

  function filtrarMagias() {
    const termo = semAcento(inputBusca.value);
    const circulo = _filtroAdicional;
    const escola = selectEscola.value;
    const classe = selectClasse.value;

    const filtradas = todasMagias.filter(m => {
      const matchCirculo = circulo === 'todos' || String(m.circulo) === circulo;
      const matchEscola = escola === 'todas' || m.escola === escola;
      const matchClasse = classe === 'todas' || (m.classes && m.classes.some(c => semAcento(c) === semAcento(classe)));
      const matchTexto = !termo ||
        semAcento(m.nome).includes(termo) ||
        semAcento(m.descricao || '').includes(termo) ||
        semAcento(m.tempo_conjuracao || '').includes(termo);

      return matchCirculo && matchEscola && matchClasse && matchTexto;
    });

    grid.innerHTML = _gerarCardsMagiaHTML(filtradas);
    contador.textContent = `Total: ${filtradas.length} magias`;
    _atribuirEventosDetalhesMagia(grid);
  }

  inputBusca.addEventListener('input', filtrarMagias);
  selectEscola.addEventListener('change', filtrarMagias);
  selectClasse.addEventListener('change', filtrarMagias);

  subnav.querySelectorAll('.compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      subnav.querySelectorAll('.compendio-subnav-btn').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      _scrollHorizontalParaElemento(subnav, btn);
      _filtroAdicional = btn.dataset.circulo;
      filtrarMagias();
    });
  });

  _atribuirEventosDetalhesMagia(grid);
}

function _gerarCardsMagiaHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhuma magia encontrada com os filtros selecionados.</p></div>`;
  }

  return lista.map(m => {
    const ehTruque = m.circulo === 0 || m.circulo === '0';
    const circTexto = ehTruque ? 'Truque' : `${m.circulo}º Círculo`;

    return `
      <div class="compendio-card compendio-card-clickable" data-magia-nome="${escHtml(m.nome)}" data-magia-circulo="${m.circulo}">
        <div class="compendio-card-header">
          <div style="min-width: 0;">
            <div class="compendio-card-title" style="font-size: 0.95rem;">${escHtml(m.nome)}</div>
            <div class="compendio-card-subtitle" style="font-size: 0.72rem;">${escHtml(m.escola || '')}</div>
          </div>
          <span class="c-badge c-badge-circulo">${circTexto}</span>
        </div>
        <div class="compendio-card-body" style="font-size: 0.78rem;">
          <div style="color: var(--text-muted); margin-bottom: 4px;">Tempo: ${escHtml(m.tempo_conjuracao || '1 Ação')}</div>
          <div style="color: var(--text-muted); margin-bottom: 4px;">Alcance: ${escHtml(m.alcance || 'Pessoal')}</div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
            ${m.ritual ? '<span class="c-badge c-badge-ritual">Ritual</span>' : ''}
            ${m.duracao && m.duracao.toLowerCase().includes('concentra') ? '<span class="c-badge c-badge-conc">Concentração</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function _atribuirEventosDetalhesMagia(container) {
  container.querySelectorAll('[data-magia-nome]').forEach(card => {
    card.addEventListener('click', async () => {
      const nome = card.dataset.magiaNome;
      const circulo = parseInt(card.dataset.magiaCirculo, 10);
      let magia = null;

      if (_cacheMagiasCompletas) {
        magia = _cacheMagiasCompletas.find(m => m.nome === nome);
      }
      if (!magia) {
        const dadosCirc = await getMagiasPorCirculo(circulo);
        magia = dadosCirc?.magias?.find(m => m.nome === nome);
      }

      if (magia) {
        _abrirModalMagia(magia);
      }
    });
  });
}

function _abrirModalMagia(m) {
  const ehTruque = m.circulo === 0 || m.circulo === '0';
  const circTexto = ehTruque ? 'Truque' : `${m.circulo}º Círculo`;

  const corpo = `
    <div style="font-size: 0.88rem; line-height: 1.6;">
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="c-badge c-badge-circulo">${circTexto}</span>
        <span class="c-badge c-badge-escola">${escHtml(m.escola || 'Magia')}</span>
        ${m.ritual ? '<span class="c-badge c-badge-ritual">Ritual</span>' : ''}
        ${m.duracao && m.duracao.toLowerCase().includes('concentra') ? '<span class="c-badge c-badge-conc">Concentração</span>' : ''}
      </div>

      <div style="background: var(--bg-input); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; font-size: 0.82rem;">
        <div><strong>Tempo de Conjuração:</strong> ${escHtml(m.tempo_conjuracao || '1 Ação')}</div>
        <div><strong>Alcance:</strong> ${escHtml(m.alcance || '9 metros')}</div>
        <div><strong>Componentes:</strong> ${escHtml(m.componentes || 'V, S')}</div>
        <div><strong>Duração:</strong> ${escHtml(m.duracao || 'Instantânea')}</div>
      </div>

      <div style="margin-bottom: 14px;">
        ${mdParaHtml(m.descricao || '')}
      </div>

      ${m.em_circulos_superiores || m.circulos_superiores ? `
        <div style="background: var(--surface-variant); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent); margin-top: 10px;">
          <strong style="color: var(--accent); font-size: 0.85rem;">Em Círculos Superiores:</strong>
          <div style="font-size: 0.83rem; margin-top: 2px;">
            ${mdParaHtml(m.em_circulos_superiores || m.circulos_superiores || '')}
          </div>
        </div>
      ` : ''}

      ${m.classes && (Array.isArray(m.classes) ? m.classes.length > 0 : !!m.classes) ? `
        <div style="margin-top: 14px; font-size: 0.78rem; color: var(--text-muted);">
          <strong>Classes:</strong> ${Array.isArray(m.classes) ? m.classes.join(', ') : m.classes}
        </div>
      ` : ''}
    </div>
  `;

  abrirModal(m.nome, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

// ============================================================
// 6. SEÇÃO: EQUIPAMENTO
// ============================================================

async function _renderEquipamento(container) {
  const subSecao = _subSecaoAtiva || 'armas';

  const existingSubnav = container.querySelector('#subnav-equipamento');
  const existingEqContainer = container.querySelector('#compendio-equipamento-conteudo');

  if (existingSubnav && existingEqContainer) {
    existingSubnav.querySelectorAll('.compendio-subnav-btn').forEach(btn => {
      const isAtivo = btn.dataset.sub === subSecao;
      btn.classList.toggle('ativo', isAtivo);
      if (isAtivo) {
        _scrollHorizontalParaElemento(existingSubnav, btn);
      }
    });

    if (subSecao === 'armaduras') {
      await _renderTabelaArmaduras(existingEqContainer);
    } else if (subSecao === 'aventura') {
      await _renderEquipamentoAventura(existingEqContainer);
    } else if (subSecao === 'ferramentas') {
      await _renderFerramentas(existingEqContainer);
    } else if (subSecao === 'montarias') {
      await _renderMontariasVeiculos(existingEqContainer);
    } else if (subSecao === 'servicos') {
      await _renderServicos(existingEqContainer);
    } else {
      await _renderTabelaArmas(existingEqContainer);
    }
    return;
  }

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Equipamento & Mercadorias</h2>
      <p>
        Tabelas completas de armas com propriedades de Maestria, armaduras, ferramentas de artesão, veículos e serviços.
      </p>
    </div>

    <!-- Sub-nav de Equipamentos -->
    <div class="compendio-subnav" id="subnav-equipamento">
      <button class="compendio-subnav-btn ${subSecao === 'armas' ? 'ativo' : ''}" data-sub="armas">Armas</button>
      <button class="compendio-subnav-btn ${subSecao === 'armaduras' ? 'ativo' : ''}" data-sub="armaduras">Armaduras & Escudos</button>
      <button class="compendio-subnav-btn ${subSecao === 'aventura' ? 'ativo' : ''}" data-sub="aventura">Equipamento de Aventura</button>
      <button class="compendio-subnav-btn ${subSecao === 'ferramentas' ? 'ativo' : ''}" data-sub="ferramentas">Ferramentas</button>
      <button class="compendio-subnav-btn ${subSecao === 'montarias' ? 'ativo' : ''}" data-sub="montarias">Montarias & Veículos</button>
      <button class="compendio-subnav-btn ${subSecao === 'servicos' ? 'ativo' : ''}" data-sub="servicos">Serviços & Despesas</button>
    </div>

    <!-- Conteúdo do Sub-Equipamento -->
    <div id="compendio-equipamento-conteudo"></div>
  `;

  const subnav = container.querySelector('#subnav-equipamento');
  if (subnav) {
    subnav.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    subnav.scrollLeft = 0;
  }

  container.querySelectorAll('#subnav-equipamento .compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.dataset.sub;
      _subSecaoAtiva = sub;
      navegar(`compendio/equipamento/${sub}`, { manterScroll: true });
    });
  });

  const eqContainer = document.getElementById('compendio-equipamento-conteudo');

  if (subSecao === 'armaduras') {
    await _renderTabelaArmaduras(eqContainer);
  } else if (subSecao === 'aventura') {
    await _renderEquipamentoAventura(eqContainer);
  } else if (subSecao === 'ferramentas') {
    await _renderFerramentas(eqContainer);
  } else if (subSecao === 'montarias') {
    await _renderMontariasVeiculos(eqContainer);
  } else if (subSecao === 'servicos') {
    await _renderServicos(eqContainer);
  } else {
    await _renderTabelaArmas(eqContainer);
  }
}

async function _renderTabelaArmas(container) {
  if (!_cacheArmas) {
    _cacheArmas = await getArmas();
  }
  const armas = _cacheArmas?.armas || [];

  container.innerHTML = `
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-arma" placeholder="Buscar arma, maestria ou propriedade...">
      </div>
      <div class="compendio-count-badge" id="contagem-armas">
        Total: ${armas.length} armas
      </div>
    </div>

    <div class="card" style="padding: 12px; overflow: hidden;">
      <div class="table-wrapper">
        <table class="compendio-table" id="tabela-armas">
          <thead>
            <tr>
              <th>Arma</th>
              <th>Categoria</th>
              <th>Dano</th>
              <th>Propriedades</th>
              <th>Maestria</th>
              <th>Custo</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            ${_gerarLinhasArmasHTML(armas)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const input = container.querySelector('#busca-arma');
  const tbody = container.querySelector('#tabela-armas tbody');
  const contador = container.querySelector('#contagem-armas');

  input.addEventListener('input', () => {
    const termo = semAcento(input.value);
    const filtradas = armas.filter(a =>
      semAcento(a.nome).includes(termo) ||
      semAcento(a.categoria || '').includes(termo) ||
      semAcento(a.maestria || '').includes(termo) ||
      semAcento(a.propriedades || '').includes(termo)
    );
    tbody.innerHTML = _gerarLinhasArmasHTML(filtradas);
    contador.textContent = `Total: ${filtradas.length} armas`;
  });
}

function _gerarLinhasArmasHTML(lista) {
  if (lista.length === 0) {
    return `<tr><td colspan="7" class="text-center" style="padding: 20px; color: var(--text-muted);">Nenhuma arma encontrada.</td></tr>`;
  }
  return lista.map(a => `
    <tr>
      <td><strong>${escHtml(a.nome)}</strong></td>
      <td><span style="font-size: 0.78rem; color: var(--text-muted);">${escHtml(a.categoria || '—')}</span></td>
      <td><span style="font-weight: 700; color: var(--accent);">${escHtml(a.dano || '—')}</span></td>
      <td><span style="font-size: 0.8rem;">${escHtml(a.propriedades || '—')}</span></td>
      <td><span class="c-badge c-badge-categoria" style="font-weight: 700;">${escHtml(a.maestria || '—')}</span></td>
      <td>${escHtml(a.custo || '—')}</td>
      <td>${escHtml(a.peso || '—')}</td>
    </tr>
  `).join('');
}

async function _renderTabelaArmaduras(container) {
  if (!_cacheArmaduras) {
    _cacheArmaduras = await getArmaduras();
  }
  const armaduras = _cacheArmaduras?.armaduras || [];

  container.innerHTML = `
    <div class="card" style="padding: 12px; overflow: hidden;">
      <div class="table-wrapper">
        <table class="compendio-table">
          <thead>
            <tr>
              <th>Armadura</th>
              <th>Categoria</th>
              <th>Classe de Armadura (CA)</th>
              <th>Força Necessária</th>
              <th>Furtividade</th>
              <th>Custo</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            ${armaduras.map(arm => `
              <tr>
                <td><strong>${escHtml(arm.nome)}</strong></td>
                <td><span class="c-badge c-badge-categoria">${escHtml(arm.categoria || '—')}</span></td>
                <td><span style="font-weight: 700; color: var(--accent);">${escHtml(arm.ca || '—')}</span></td>
                <td>${escHtml(arm.requisito_forca || '—')}</td>
                <td>${arm.furtividade === 'Desvantagem' ? '<span class="c-badge c-badge-conc">Desvantagem</span>' : '—'}</td>
                <td>${escHtml(arm.custo || '—')}</td>
                <td>${escHtml(arm.peso || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function _renderEquipamentoAventura(container) {
  if (!_cacheEquipAventura) {
    _cacheEquipAventura = await getEquipamentoAventura();
  }
  const itens = _cacheEquipAventura?.itens || [];

  container.innerHTML = `
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-aventura" placeholder="Buscar item de aventura...">
      </div>
      <div class="compendio-count-badge" id="contagem-aventura">
        Total: ${itens.length} itens
      </div>
    </div>

    <div class="compendio-grid" id="grid-aventura">
      ${_gerarCardsAventuraHTML(itens)}
    </div>
  `;

  const input = container.querySelector('#busca-aventura');
  const grid = container.querySelector('#grid-aventura');
  const contador = container.querySelector('#contagem-aventura');

  input.addEventListener('input', () => {
    const termo = semAcento(input.value);
    const filtrados = itens.filter(i =>
      semAcento(i.nome).includes(termo) ||
      semAcento(i.descricao || '').includes(termo)
    );
    grid.innerHTML = _gerarCardsAventuraHTML(filtrados);
    contador.textContent = `Total: ${filtrados.length} itens`;
  });
}

function _gerarCardsAventuraHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhum item encontrado.</p></div>`;
  }
  return lista.map(item => `
    <div class="compendio-card">
      <div class="compendio-card-header">
        <div class="compendio-card-title">${escHtml(item.nome)}</div>
        <span class="c-badge c-badge-categoria">${escHtml(item.custo || '—')}</span>
      </div>
      <div class="compendio-card-meta">
        <span>Peso: ${escHtml(item.peso || '—')}</span>
        ${item.tipo_uso ? `<span>Tipo: ${escHtml(item.tipo_uso)}</span>` : ''}
      </div>
      <div class="compendio-card-body">
        ${mdParaHtml(item.descricao || '')}
      </div>
    </div>
  `).join('');
}

async function _renderFerramentas(container) {
  if (!_cacheFerramentas) {
    _cacheFerramentas = await getFerramentas();
  }
  const listaFerramentas = _cacheFerramentas?.ferramentas || [];

  const atributos = ['Todos os Atributos', 'Força', 'Destreza', 'Inteligência', 'Sabedoria', 'Carisma'];
  const categorias = ['Todas as Categorias', 'Ferramentas de Artesão', 'Outras Ferramentas'];

  container.innerHTML = `
    <!-- Card explicativo de Regras e Proficiência -->
    <div class="card mb-3" style="padding: 14px 16px; background: rgba(30, 41, 59, 0.4); border-left: 3px solid var(--accent, #6366f1);">
      <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" id="toggle-regras-ferramentas">
        <div style="font-weight: 700; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
          <span>Proficiência e Regras com Ferramentas</span>
        </div>
        <span id="seta-regras-ferramentas" style="font-size: 0.8rem; color: var(--text-muted);">▼ Mostrar Regras</span>
      </div>
      <div id="corpo-regras-ferramentas" style="display: none; margin-top: 10px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
        <p style="margin-bottom: 8px;">
          Uma ferramenta ajuda você a realizar testes de atributo de forma especializada, fabricar certos itens ou ambos.
        </p>
        <p style="margin-bottom: 8px;">
          <strong>Proficiência com Ferramentas:</strong> Se você tem proficiência com uma ferramenta, adicione seu <em>Bônus de Proficiência</em> a qualquer teste de atributo que use a ferramenta. Se você tem proficiência em uma perícia usada com esse teste, também tem <strong>Vantagem</strong> no teste.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 8px;">
          <div style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px;">
            <strong>Usar Objeto:</strong> Ação e CD padrão para atividades específicas durante o jogo.
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px;">
            <strong>Fabricação:</strong> Itens e equipamentos que podem ser produzidos com a ferramenta.
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Busca e Filtros -->
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-ferramenta" placeholder="Buscar ferramenta por nome, ação, item fabricável...">
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <select id="filtro-cat-ferramenta" class="form-select" style="width: auto; min-width: 170px; padding: 6px 28px 6px 10px; font-size: 0.82rem; height: 36px;">
          ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>
        <select id="filtro-attr-ferramenta" class="form-select" style="width: auto; min-width: 150px; padding: 6px 28px 6px 10px; font-size: 0.82rem; height: 36px;">
          ${atributos.map(attr => `<option value="${attr}">${attr}</option>`).join('')}
        </select>
      </div>
      <div class="compendio-count-badge" id="contagem-ferramentas">
        Total: ${listaFerramentas.length} ferramentas
      </div>
    </div>

    <!-- Grid de Cards de Ferramentas -->
    <div class="compendio-grid" id="grid-ferramentas">
      ${_gerarCardsFerramentasHTML(listaFerramentas)}
    </div>
  `;

  // Toggle de regras
  const toggleBtn = container.querySelector('#toggle-regras-ferramentas');
  const corpoRegras = container.querySelector('#corpo-regras-ferramentas');
  const setaRegras = container.querySelector('#seta-regras-ferramentas');
  if (toggleBtn && corpoRegras) {
    toggleBtn.addEventListener('click', () => {
      const aberto = corpoRegras.style.display !== 'none';
      corpoRegras.style.display = aberto ? 'none' : 'block';
      setaRegras.textContent = aberto ? '▼ Mostrar Regras' : '▲ Ocultar Regras';
    });
  }

  const input = container.querySelector('#busca-ferramenta');
  const selectCat = container.querySelector('#filtro-cat-ferramenta');
  const selectAttr = container.querySelector('#filtro-attr-ferramenta');
  const grid = container.querySelector('#grid-ferramentas');
  const contador = container.querySelector('#contagem-ferramentas');

  function filtrarFerramentas() {
    const termo = semAcento(input.value || '');
    const catSel = selectCat.value;
    const attrSel = selectAttr.value;

    const filtradas = listaFerramentas.filter(f => {
      if (catSel !== 'Todas as Categorias' && f.categoria !== catSel) {
        return false;
      }
      if (attrSel !== 'Todos os Atributos' && f.atributo !== attrSel) {
        return false;
      }
      if (termo) {
        const matchNome = semAcento(f.nome || '').includes(termo);
        const matchAttr = semAcento(f.atributo || '').includes(termo);
        const matchUsar = semAcento(f.usar_objeto || '').includes(termo);
        const matchFab = semAcento(f.fabricacao || '').includes(termo);
        const matchVar = semAcento(f.variantes || '').includes(termo);
        if (!matchNome && !matchAttr && !matchUsar && !matchFab && !matchVar) {
          return false;
        }
      }
      return true;
    });

    grid.innerHTML = _gerarCardsFerramentasHTML(filtradas);
    contador.textContent = `Total: ${filtradas.length} ferramentas`;
    _atribuirEventosFerramentas(grid, listaFerramentas);
  }

  input.addEventListener('input', filtrarFerramentas);
  selectCat.addEventListener('change', filtrarFerramentas);
  selectAttr.addEventListener('change', filtrarFerramentas);
  _atribuirEventosFerramentas(grid, listaFerramentas);
}

function _gerarCardsFerramentasHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhuma ferramenta encontrada com os filtros aplicados.</p></div>`;
  }

  return lista.map(f => {
    return `
      <div class="compendio-card compendio-card-clickable" data-ferramenta-nome="${escHtml(f.nome)}">
        <div class="compendio-card-header">
          <div>
            <div class="compendio-card-title">${escHtml(f.nome)}</div>
            <div class="compendio-card-subtitle">${escHtml(f.categoria || 'Ferramenta')}</div>
          </div>
          <span class="c-badge c-badge-categoria">${escHtml(f.custo || '—')}</span>
        </div>

        <div class="compendio-card-meta" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <span class="badge badge-primary" style="font-size: 0.72rem; padding: 2px 8px;">${escHtml(f.atributo || 'Atributo')}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Peso: ${escHtml(f.peso || '—')}</span>
        </div>

        <div class="compendio-card-body" style="font-size: 0.82rem; display: flex; flex-direction: column; gap: 8px;">
          ${f.usar_objeto ? `
            <div style="background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 8px; border: 1px solid rgba(255,255,255,0.05);">
              <strong style="color: var(--accent, #818cf8);">Usar Objeto:</strong>
              <div style="margin-top: 2px; color: var(--text-secondary);">${escHtml(f.usar_objeto)}</div>
            </div>
          ` : ''}

          ${f.fabricacao ? `
            <div>
              <strong style="color: #34d399;">Fabricação:</strong>
              <div style="margin-top: 2px; color: var(--text-muted); line-height: 1.4;">${escHtml(f.fabricacao)}</div>
            </div>
          ` : ''}

          ${f.variantes ? `
            <div>
              <strong style="color: #fbbf24;">Variantes:</strong>
              <div style="margin-top: 2px; color: var(--text-muted); line-height: 1.4;">${escHtml(f.variantes)}</div>
            </div>
          ` : ''}
        </div>

        <div class="compendio-card-footer">
          <span style="color: var(--accent); font-weight: 600;">Ver detalhes &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

function _atribuirEventosFerramentas(container, lista) {
  container.querySelectorAll('[data-ferramenta-nome]').forEach(card => {
    card.addEventListener('click', () => {
      const nome = card.dataset.ferramentaNome;
      const f = lista.find(item => item.nome === nome);
      if (f) _abrirModalFerramenta(f);
    });
  });
}

function _abrirModalFerramenta(f) {
  const corpo = `
    <div style="font-size: 0.9rem; line-height: 1.6;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 12px;">
        <span class="badge badge-secondary">${escHtml(f.categoria)}</span>
        <span class="badge badge-accent">${escHtml(f.custo)}</span>
        <span class="badge badge-primary">Atributo: ${escHtml(f.atributo)}</span>
        <span class="badge" style="background: rgba(255,255,255,0.1);">Peso: ${escHtml(f.peso)}</span>
      </div>

      <div class="card mb-3" style="padding: 12px; background: rgba(99, 102, 241, 0.08); border-left: 3px solid var(--accent, #6366f1);">
        <strong style="color: var(--accent, #818cf8); font-size: 0.95rem;">Ação Usar Objeto</strong>
        <p style="margin-top: 4px; margin-bottom: 0; color: #fff;">
          ${escHtml(f.usar_objeto || '—')}
        </p>
      </div>

      ${f.fabricacao ? `
        <div class="card mb-3" style="padding: 12px; background: rgba(52, 211, 153, 0.08); border-left: 3px solid #10b981;">
          <strong style="color: #34d399; font-size: 0.95rem;">Itens Fabricáveis</strong>
          <p style="margin-top: 4px; margin-bottom: 0; color: var(--text-secondary);">
            ${escHtml(f.fabricacao)}
          </p>
        </div>
      ` : ''}

      ${f.variantes ? `
        <div class="card mb-3" style="padding: 12px; background: rgba(251, 191, 36, 0.08); border-left: 3px solid #f59e0b;">
          <strong style="color: #fbbf24; font-size: 0.95rem;">Variantes Disponíveis</strong>
          <p style="margin-top: 4px; margin-bottom: 0; color: var(--text-secondary);">
            ${escHtml(f.variantes)}
          </p>
        </div>
      ` : ''}

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; font-size: 0.82rem; color: var(--text-muted);">
        <strong>Regra de Proficiência:</strong> Adicione seu Bônus de Proficiência ao teste de ${escHtml(f.atributo)}. Se também possuir proficiência na perícia aplicável a esse teste, você ganha <em>Vantagem</em> no teste.
      </div>
    </div>
  `;

  abrirModal(f.nome, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

async function _renderMontariasVeiculos(container) {
  if (!_cacheMontarias) {
    _cacheMontarias = await getMontariasVeiculos();
  }
  const tabelas = _cacheMontarias?.tabelas || [];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${tabelas.map(tab => `
        <div class="card" style="padding: 12px;">
          <div class="table-wrapper">
            <table class="compendio-table">
              <thead>
                <tr>
                  ${(tab.cabecalhos || []).map(c => `<th>${escHtml(c)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${(tab.dados || []).map(linha => `
                  <tr>
                    ${(tab.cabecalhos || []).map(c => `<td>${escHtml(String(linha[c] || '—'))}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function _renderServicos(container) {
  if (!_cacheServicos) {
    _cacheServicos = await getServicos();
  }
  const tabelas = _cacheServicos?.tabelas || [];

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${tabelas.map(tab => `
        <div class="card" style="padding: 12px;">
          <div class="table-wrapper">
            <table class="compendio-table">
              <thead>
                <tr>
                  ${(tab.cabecalhos || []).map(c => `<th>${escHtml(c)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${(tab.dados || []).map(linha => `
                  <tr>
                    ${(tab.cabecalhos || []).map(c => `<td>${escHtml(String(linha[c] || '—'))}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// 6.1 SEÇÃO: ITENS MÁGICOS
// ============================================================

function _checarRaridadeItemMagico(itemRaridade, selRaridade) {
  if (!selRaridade || selRaridade === 'todos') return true;
  const rarNorm = semAcento(itemRaridade || '').toLowerCase().trim();
  const selNorm = semAcento(selRaridade).toLowerCase().trim();

  if (selNorm === 'comum') {
    return rarNorm === 'comum';
  }
  if (selNorm === 'incomum') {
    return rarNorm === 'incomum';
  }
  if (selNorm === 'raro') {
    return rarNorm === 'raro';
  }
  if (selNorm === 'muito raro') {
    return rarNorm === 'muito raro';
  }
  if (selNorm === 'lendario') {
    return rarNorm === 'lendario';
  }
  if (selNorm === 'artefato') {
    return rarNorm === 'artefato';
  }
  if (selNorm === 'variavel') {
    return rarNorm.includes('variavel') || rarNorm.includes('+1') || rarNorm.includes('+2') || rarNorm.includes('+3');
  }
  return rarNorm === selNorm;
}

function _checarTipoItemMagico(itemTipo, selTipo) {
  if (!selTipo || selTipo === 'todos') return true;
  const tipoNorm = semAcento(itemTipo || '').toLowerCase().trim();
  const selTipoNorm = semAcento(selTipo).toLowerCase().trim();

  if (tipoNorm === selTipoNorm) return true;

  if (selTipoNorm === 'armadura') {
    return tipoNorm === 'armadura' || tipoNorm === 'escudo' || tipoNorm.startsWith('armadura');
  }

  if (selTipoNorm === 'arma') {
    return tipoNorm === 'arma' || tipoNorm.startsWith('arma ');
  }

  if (selTipoNorm === 'tatuagem magica' || selTipoNorm === 'tatuagem') {
    return tipoNorm.includes('tatuagem');
  }

  const partes = tipoNorm.split(/[,/]| ou /).map(p => p.trim());
  return partes.includes(selTipoNorm) || tipoNorm.includes(selTipoNorm);
}

function _obterClasseBadgeRaridade(raridade) {
  const norm = semAcento(raridade || '').toLowerCase();
  if (norm.includes('artefato')) return 'c-badge-artefato';
  if (norm.includes('lendario')) return 'c-badge-lendario';
  if (norm.includes('muito raro')) return 'c-badge-muito-raro';
  if (norm.includes('incomum')) return 'c-badge-incomum';
  if (norm.includes('raro')) return 'c-badge-raro';
  if (norm.includes('comum')) return 'c-badge-comum';
  return 'c-badge-categoria';
}

async function _renderItensMagicos(container) {
  if (!_cacheItensMagicos) {
    const dados = await getItensMagicos();
    _cacheItensMagicos = Array.isArray(dados) ? dados : (dados?.itens_magicos || []);
  }
  const itens = _cacheItensMagicos || [];

  const qtdComum = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Comum')).length;
  const qtdIncomum = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Incomum')).length;
  const qtdRaro = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Raro')).length;
  const qtdMuitoRaro = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Muito Raro')).length;
  const qtdLendario = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Lendário')).length;
  const qtdArtefato = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Artefato')).length;
  const qtdVariavel = itens.filter(it => _checarRaridadeItemMagico(it.raridade, 'Variável')).length;

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Itens Mágicos</h2>
      <p>
        Acervo completo com centenas de itens mágicos: armas lendárias, anéis, pergaminhos, poções, varinhas, cetros, cajados, armaduras e itens maravilhosos.
      </p>
    </div>

    <!-- Barra de Busca e Filtros -->
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-item-magico" placeholder="Buscar por nome, tipo, propriedade ou efeito...">
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <select id="filtro-tipo-magico" class="form-select" style="width: auto; min-width: 150px; padding: 6px 28px 6px 10px; font-size: 0.82rem; height: 36px;">
          <option value="todos">Todos os Tipos</option>
          <option value="Arma">Armas</option>
          <option value="Armadura">Armaduras & Escudos</option>
          <option value="Poção">Poções</option>
          <option value="Pergaminho">Pergaminhos</option>
          <option value="Varinha">Varinhas</option>
          <option value="Cajado">Cajados</option>
          <option value="Cetro">Cetros</option>
          <option value="Anel">Anéis</option>
          <option value="Tatuagem Mágica">Tatuagens Mágicas</option>
          <option value="Item Maravilhoso">Itens Maravilhosos</option>
        </select>
        <label class="form-check" style="margin: 0; padding: 0; font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">
          <input type="checkbox" id="filtro-sintonizacao-magico" style="width: 16px; height: 16px;">
          Requer Sintonização
        </label>
      </div>
      <div class="compendio-count-badge" id="contagem-itens-magicos">
        Total: ${itens.length} itens mágicos
      </div>
    </div>

    <!-- Subnav de Raridades -->
    <div class="compendio-subnav" id="subnav-raridades-magicos">
      <button class="compendio-subnav-btn ativo" data-raridade="todos">Todas (${itens.length})</button>
      <button class="compendio-subnav-btn" data-raridade="Comum">Comum (${qtdComum})</button>
      <button class="compendio-subnav-btn" data-raridade="Incomum">Incomum (${qtdIncomum})</button>
      <button class="compendio-subnav-btn" data-raridade="Raro">Raro (${qtdRaro})</button>
      <button class="compendio-subnav-btn" data-raridade="Muito Raro">Muito Raro (${qtdMuitoRaro})</button>
      <button class="compendio-subnav-btn" data-raridade="Lendário">Lendário (${qtdLendario})</button>
      <button class="compendio-subnav-btn" data-raridade="Artefato">Artefato (${qtdArtefato})</button>
      ${qtdVariavel > 0 ? `<button class="compendio-subnav-btn" data-raridade="Variável">Variável (${qtdVariavel})</button>` : ''}
    </div>

    <!-- Grid de Itens Mágicos -->
    <div class="compendio-grid" id="grid-itens-magicos">
      ${_gerarCardsItensMagicosHTML(itens)}
    </div>
  `;

  const inputBusca = container.querySelector('#busca-item-magico');
  const selectTipo = container.querySelector('#filtro-tipo-magico');
  const checkSint = container.querySelector('#filtro-sintonizacao-magico');
  const grid = container.querySelector('#grid-itens-magicos');
  const contador = container.querySelector('#contagem-itens-magicos');
  const subnavRaridades = container.querySelector('#subnav-raridades-magicos');
  let raridadeSelecionada = 'todos';

  function vincularEventosCards() {
    grid.querySelectorAll('[data-item-magico-nome]').forEach(card => {
      card.addEventListener('click', () => {
        const item = itens.find(it => it.nome === card.dataset.itemMagicoNome);
        if (item) _abrirModalItemMagico(item);
      });
    });
  }

  function filtrar() {
    const termo = semAcento(inputBusca.value || '');
    const tipo = selectTipo.value;
    const apenasSintonizacao = checkSint.checked;
    const raridade = raridadeSelecionada;

    const filtrados = itens.filter(it => {
      // Filtro Raridade
      if (!_checarRaridadeItemMagico(it.raridade, raridade)) {
        return false;
      }

      // Filtro Tipo
      if (!_checarTipoItemMagico(it.tipo, tipo)) {
        return false;
      }

      // Filtro Sintonização
      if (apenasSintonizacao && !it.sintonizacao) {
        return false;
      }

      // Filtro Texto
      if (termo) {
        const matchNome = semAcento(it.nome || '').includes(termo);
        const matchTipo = semAcento(it.tipo || '').includes(termo);
        const matchSubtipo = semAcento(it.subtipo || '').includes(termo);
        const matchTipoLinha = semAcento(it.tipo_linha || '').includes(termo);
        const matchResumo = semAcento(it.resumo || '').includes(termo);
        const matchDesc = semAcento(it.descricao || '').includes(termo);
        const matchSint = semAcento(it.detalhe_sintonizacao || '').includes(termo);
        if (!matchNome && !matchTipo && !matchSubtipo && !matchTipoLinha && !matchResumo && !matchDesc && !matchSint) {
          return false;
        }
      }

      return true;
    });

    grid.innerHTML = _gerarCardsItensMagicosHTML(filtrados);
    contador.textContent = `Total: ${filtrados.length} itens mágicos`;
    vincularEventosCards();
  }

  vincularEventosCards();

  inputBusca.addEventListener('input', filtrar);
  selectTipo.addEventListener('change', filtrar);
  checkSint.addEventListener('change', filtrar);

  subnavRaridades.querySelectorAll('.compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      subnavRaridades.querySelectorAll('.compendio-subnav-btn').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      _scrollHorizontalParaElemento(subnavRaridades, btn);
      raridadeSelecionada = btn.dataset.raridade;
      filtrar();
    });
  });
}

function _gerarCardsItensMagicosHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhum item mágico encontrado com os filtros aplicados.</p></div>`;
  }

  return lista.map(it => {
    const badgeRaridade = _obterClasseBadgeRaridade(it.raridade);

    return `
      <div class="compendio-card compendio-card-clickable" data-item-magico-nome="${escHtml(it.nome)}">
        <div class="compendio-card-header">
          <div>
            <div class="compendio-card-title">${escHtml(it.nome)}</div>
            <div class="compendio-card-subtitle" style="color: var(--text-muted); font-weight: 500;">
              ${escHtml(it.tipo)}${it.subtipo ? ` (${escHtml(it.subtipo)})` : ''}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="c-badge ${badgeRaridade}">${escHtml(it.raridade || 'Mágico')}</span>
            ${it.sintonizacao ? '<span class="c-badge c-badge-sintonizacao" style="font-size: 0.65rem;">Sintonização</span>' : ''}
          </div>
        </div>
        <div class="compendio-card-body">
          <p style="margin-bottom: 8px; font-size: 0.83rem; color: var(--ink); line-height: 1.45;">
            ${escHtml(it.resumo || (it.descricao ? (it.descricao.length > 130 ? it.descricao.substring(0, 130) + '…' : it.descricao) : ''))}
          </p>
        </div>
        <div class="compendio-card-footer">
          <span style="color: var(--accent); font-weight: 600;">Ver detalhes completos &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

function _abrirModalItemMagico(it) {
  const badgeRaridade = _obterClasseBadgeRaridade(it.raridade);
  const tipoLinha = it.tipo_linha || `${it.tipo}${it.subtipo ? ' (' + it.subtipo + ')' : ''}, ${it.raridade || 'Mágico'}`;
  const sintTexto = it.detalhe_sintonizacao || (it.sintonizacao ? 'Requer Sintonização' : '');

  const corpo = `
    <div style="font-size: 0.88rem; line-height: 1.6;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; align-items: center;">
        <span class="c-badge c-badge-categoria" style="font-weight: 700;">${escHtml(it.tipo)}${it.subtipo ? ` (${escHtml(it.subtipo)})` : ''}</span>
        <span class="c-badge ${badgeRaridade}">${escHtml(it.raridade || 'Mágico')}</span>
        ${sintTexto ? `<span class="c-badge c-badge-sintonizacao">${escHtml(sintTexto)}</span>` : ''}
      </div>

      <div style="background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 16px; border-left: 3px solid var(--accent);">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
          ${escHtml(tipoLinha)}
        </div>
      </div>

      <div class="md-content" style="color: var(--ink); line-height: 1.65;">
        ${mdParaHtml(it.descricao || it.resumo || 'Sem descrição disponível.')}
      </div>
    </div>
  `;

  abrirModal(it.nome, corpo, `<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>`);
}

// ============================================================
// 7. SEÇÃO: BESTIÁRIO (CRIATURAS E MONSTROS)
// ============================================================

async function _renderBestiario(container) {
  if (!_cacheCriaturas) {
    _cacheCriaturas = await getCriaturas();
  }
  if (!_cacheMonstros) {
    _cacheMonstros = await getMonstros();
  }

  const criaturasBase = _cacheCriaturas?.criaturas || (Array.isArray(_cacheCriaturas) ? _cacheCriaturas : []);
  const monstrosBase = Array.isArray(_cacheMonstros) ? _cacheMonstros : (_cacheMonstros?.monstros || []);

  const subSecao = _subSecaoAtiva || 'monstros';
  const listaAtiva = subSecao === 'criaturas' ? criaturasBase : monstrosBase;
  const isMonstros = subSecao === 'monstros';

  // Obter lista única de NDs para o filtro da lista ativa
  const ndsUnicos = Array.from(new Set(listaAtiva.map(c => c.nd).filter(Boolean)));
  const ordenarNd = (a, b) => {
    const parse = (val) => {
      if (typeof val === 'string') {
        const clean = val.split(' ')[0];
        if (clean === '1/8') return 0.125;
        if (clean === '1/4') return 0.25;
        if (clean === '1/2') return 0.5;
        return parseFloat(clean) || 0;
      }
      return Number(val) || 0;
    };
    return parse(a) - parse(b);
  };
  ndsUnicos.sort(ordenarNd);

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Bestiário</h2>
      <p>
        Acervo completo de criaturas do Livro do Jogador e monstros temíveis do Manual dos Monstros.
      </p>
    </div>

    <!-- Sub-navegação do Bestiário -->
    <div class="compendio-subnav" id="subnav-bestiario">
      <button class="compendio-subnav-btn ${isMonstros ? 'ativo' : ''}" data-subsecao="monstros">
        Monstros (${monstrosBase.length})
      </button>
      <button class="compendio-subnav-btn ${!isMonstros ? 'ativo' : ''}" data-subsecao="criaturas">
        Criaturas (${criaturasBase.length})
      </button>
    </div>

    <!-- Barra de Busca e Filtros do Bestiário -->
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-criatura" placeholder="Buscar ${isMonstros ? 'monstro' : 'criatura'} por nome, tipo, traço ou ação...">
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <select id="filtro-nd-criatura" class="form-select" style="width: auto; min-width: 140px; padding: 6px 28px 6px 10px; font-size: 0.82rem; height: 36px;">
          <option value="todos">Todos os NDs</option>
          ${ndsUnicos.map(nd => `<option value="${nd}">ND ${nd}</option>`).join('')}
        </select>
      </div>
      <div class="compendio-count-badge" id="contagem-criaturas">
        Total: ${listaAtiva.length} ${isMonstros ? 'monstros' : 'criaturas'}
      </div>
    </div>

    <!-- Grid de Criaturas/Monstros -->
    <div class="compendio-grid" id="grid-criaturas">
      ${_gerarCardsCriaturasHTML(listaAtiva, isMonstros)}
    </div>
  `;

  // Event listeners para as abas de subseção
  container.querySelectorAll('#subnav-bestiario .compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _subSecaoAtiva = btn.dataset.subsecao;
      navegar(`compendio/bestiario/${_subSecaoAtiva}`, { manterScroll: true });
    });
  });

  const input = container.querySelector('#busca-criatura');
  const selectNd = container.querySelector('#filtro-nd-criatura');
  const grid = container.querySelector('#grid-criaturas');
  const contador = container.querySelector('#contagem-criaturas');

  function filtrarCriaturas() {
    const termo = semAcento(input.value || '');
    const ndSel = selectNd.value;

    const filtradas = listaAtiva.filter(c => {
      if (ndSel !== 'todos' && c.nd !== ndSel) {
        return false;
      }
      if (termo) {
        const matchNome = semAcento(c.nome || '').includes(termo);
        const matchNd = semAcento(String(c.nd || '')).includes(termo);
        const matchTipo = semAcento(c.tipo_tamanho || '').includes(termo);
        const matchTracos = c.tracos ? c.tracos.some(t => semAcento(t.nome || '').includes(termo) || semAcento(t.descricao || '').includes(termo)) : false;
        const matchAcoes = c.acoes ? c.acoes.some(a => semAcento(a.nome || '').includes(termo) || semAcento(a.descricao || '').includes(termo)) : false;
        const matchLore = c.descricao_lore ? semAcento(c.descricao_lore).includes(termo) : false;
        if (!matchNome && !matchNd && !matchTipo && !matchTracos && !matchAcoes && !matchLore) {
          return false;
        }
      }
      return true;
    });

    grid.innerHTML = _gerarCardsCriaturasHTML(filtradas, isMonstros);
    contador.textContent = `Total: ${filtradas.length} ${isMonstros ? 'monstros' : 'criaturas'}`;
    _atribuirEventosCriaturas(grid, listaAtiva);
  }

  input.addEventListener('input', filtrarCriaturas);
  selectNd.addEventListener('change', filtrarCriaturas);
  _atribuirEventosCriaturas(grid, listaAtiva);
}

function _gerarCardsCriaturasHTML(lista, isMonstros = false) {
  if (lista.length === 0) {
    return `<div class="empty-state" style="grid-column: 1 / -1;"><p>Nenhum registro encontrado com os filtros aplicados.</p></div>`;
  }

  return lista.map(c => `
    <div class="compendio-card compendio-card-clickable" data-criatura-nome="${escHtml(c.nome)}">
      <div class="compendio-card-header">
        <div>
          <div class="compendio-card-title">${escHtml(c.nome)}</div>
          <div class="compendio-card-subtitle">${escHtml(c.tipo_tamanho || 'Fera')}</div>
        </div>
        <span class="c-badge c-badge-circulo">ND ${escHtml(c.nd || '1/4')}</span>
      </div>
      <div class="compendio-card-body" style="font-size: 0.8rem;">
        <div><strong>CA:</strong> ${escHtml(c.ca || '10')} | <strong>PV:</strong> ${escHtml(c.pv || '10')}</div>
        <div><strong>Deslocamento:</strong> ${escHtml(c.deslocamento || '9 m')}</div>
        ${c.descricao_lore ? `<div style="margin-top: 4px; color: var(--text-muted); font-size: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escHtml(c.descricao_lore)}</div>` : ''}
      </div>
      <div class="compendio-card-footer">
        <span style="color: var(--accent); font-weight: 600;">Ver bloco de estatísticas &rarr;</span>
      </div>
    </div>
  `).join('');
}

function _atribuirEventosCriaturas(container, criaturas) {
  container.querySelectorAll('[data-criatura-nome]').forEach(card => {
    card.addEventListener('click', () => {
      const nome = card.dataset.criaturaNome;
      const c = criaturas.find(item => item.nome === nome);
      if (c) _abrirModalCriatura(c);
    });
  });
}

function _abrirModalCriatura(c) {
  const attrs = c.atributos || {};

  const corpo = `
    <div class="statblock-criatura">
      <div class="statblock-nome">${escHtml(c.nome)}</div>
      <div class="statblock-meta">${escHtml(c.tipo_tamanho || 'Fera')}</div>

      <div class="statblock-linha"><strong>Classe de Armadura:</strong> ${escHtml(c.ca || '10')}</div>
      <div class="statblock-linha"><strong>Pontos de Vida:</strong> ${escHtml(c.pv || '10')}</div>
      ${c.iniciativa ? `<div class="statblock-linha"><strong>Iniciativa:</strong> ${escHtml(c.iniciativa)}</div>` : ''}
      <div class="statblock-linha"><strong>Deslocamento:</strong> ${escHtml(c.deslocamento || '9 m')}</div>

      <div class="statblock-attr-grid">
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">FOR</div>
          <div class="statblock-attr-val">${attrs.For?.valor || '10'} (${attrs.For?.modificador || '+0'})${attrs.For?.salvaguarda && attrs.For?.salvaguarda !== attrs.For?.modificador ? `<br><small>SG: ${attrs.For?.salvaguarda}</small>` : ''}</div>
        </div>
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">DES</div>
          <div class="statblock-attr-val">${attrs.Des?.valor || '10'} (${attrs.Des?.modificador || '+0'})${attrs.Des?.salvaguarda && attrs.Des?.salvaguarda !== attrs.Des?.modificador ? `<br><small>SG: ${attrs.Des?.salvaguarda}</small>` : ''}</div>
        </div>
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">CON</div>
          <div class="statblock-attr-val">${attrs.Con?.valor || '10'} (${attrs.Con?.modificador || '+0'})${attrs.Con?.salvaguarda && attrs.Con?.salvaguarda !== attrs.Con?.modificador ? `<br><small>SG: ${attrs.Con?.salvaguarda}</small>` : ''}</div>
        </div>
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">INT</div>
          <div class="statblock-attr-val">${attrs.Int?.valor || '10'} (${attrs.Int?.modificador || '+0'})${attrs.Int?.salvaguarda && attrs.Int?.salvaguarda !== attrs.Int?.modificador ? `<br><small>SG: ${attrs.Int?.salvaguarda}</small>` : ''}</div>
        </div>
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">SAB</div>
          <div class="statblock-attr-val">${attrs.Sab?.valor || '10'} (${attrs.Sab?.modificador || '+0'})${attrs.Sab?.salvaguarda && attrs.Sab?.salvaguarda !== attrs.Sab?.modificador ? `<br><small>SG: ${attrs.Sab?.salvaguarda}</small>` : ''}</div>
        </div>
        <div class="statblock-attr-col">
          <div class="statblock-attr-nome">CAR</div>
          <div class="statblock-attr-val">${attrs.Car?.valor || '10'} (${attrs.Car?.modificador || '+0'})${attrs.Car?.salvaguarda && attrs.Car?.salvaguarda !== attrs.Car?.modificador ? `<br><small>SG: ${attrs.Car?.salvaguarda}</small>` : ''}</div>
        </div>
      </div>

      ${c.testes_resistencia ? `<div class="statblock-linha"><strong>Testes de Resistência:</strong> ${escHtml(c.testes_resistencia)}</div>` : ''}
      ${c.pericias ? `<div class="statblock-linha"><strong>Perícias:</strong> ${escHtml(c.pericias)}</div>` : ''}
      ${c.vulnerabilidades ? `<div class="statblock-linha"><strong>Vulnerabilidades a Dano:</strong> ${escHtml(c.vulnerabilidades)}</div>` : ''}
      ${c.resistencias ? `<div class="statblock-linha"><strong>Resistências a Dano:</strong> ${escHtml(c.resistencias)}</div>` : ''}
      ${c.imunidades_dano ? `<div class="statblock-linha"><strong>Imunidades a Dano:</strong> ${escHtml(c.imunidades_dano)}</div>` : ''}
      ${c.imunidades_condicao ? `<div class="statblock-linha"><strong>Imunidades a Condição:</strong> ${escHtml(c.imunidades_condicao)}</div>` : ''}
      ${c.sentidos ? `<div class="statblock-linha"><strong>Sentidos:</strong> ${escHtml(c.sentidos)}</div>` : ''}
      ${c.idiomas ? `<div class="statblock-linha"><strong>Idiomas:</strong> ${escHtml(c.idiomas)}</div>` : ''}
      <div class="statblock-linha"><strong>Nível de Desafio:</strong> ${escHtml(c.nd || '0')}</div>

      ${c.tracos && c.tracos.length > 0 ? `
        <div class="statblock-secao-titulo">Traços & Características</div>
        ${c.tracos.map(t => `<div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>${escHtml(t.nome)}.</strong> ${mdParaHtml(t.descricao || '')}</div>`).join('')}
      ` : ''}

      ${c.acoes && c.acoes.length > 0 ? `
        <div class="statblock-secao-titulo">Ações</div>
        ${c.acoes.map(a => `<div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>${escHtml(a.nome)}.</strong> ${mdParaHtml(a.descricao || '')}</div>`).join('')}
      ` : ''}

      ${c.reacoes && c.reacoes.length > 0 ? `
        <div class="statblock-secao-titulo">Reações</div>
        ${c.reacoes.map(r => `<div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>${escHtml(r.nome)}.</strong> ${mdParaHtml(r.descricao || '')}</div>`).join('')}
      ` : ''}

      ${c.acoes_lendarias && c.acoes_lendarias.length > 0 ? `
        <div class="statblock-secao-titulo">Ações Lendárias</div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">O monstro pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção pode ser usada por vez e apenas no final do turno de outra criatura.</p>
        ${c.acoes_lendarias.map(al => `<div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>${escHtml(al.nome)}.</strong> ${mdParaHtml(al.descricao || '')}</div>`).join('')}
      ` : ''}

      ${c.acoes_covil && c.acoes_covil.length > 0 ? `
        <div class="statblock-secao-titulo">Ações de Covil</div>
        ${c.acoes_covil.map(ac => `<div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>${escHtml(ac.nome)}.</strong> ${mdParaHtml(ac.descricao || '')}</div>`).join('')}
      ` : ''}

      ${c.descricao_lore ? `
        <div class="statblock-secao-titulo">Descrição & Lore</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${escHtml(c.descricao_lore)}</div>
      ` : ''}
    </div>
  `;

  abrirModal(`${c.nome}`, corpo, '<button class="btn btn-secondary" onclick="fecharModal()">Fechar</button>');
}

// ============================================================
// 8. SEÇÃO: GLOSSÁRIO E REGRAS
// ============================================================

async function _renderRegras(container) {
  const subSecao = _subSecaoAtiva || 'glossario';

  const existingSubnav = container.querySelector('#subnav-regras');
  const existingRContainer = container.querySelector('#compendio-regras-conteudo');

  if (existingSubnav && existingRContainer) {
    existingSubnav.querySelectorAll('.compendio-subnav-btn').forEach(btn => {
      const isAtivo = btn.dataset.sub === subSecao;
      btn.classList.toggle('ativo', isAtivo);
      if (isAtivo) {
        _scrollHorizontalParaElemento(existingSubnav, btn);
      }
    });

    if (subSecao === 'capitulo1') {
      await _renderCapitulo1(existingRContainer);
    } else if (subSecao === 'capitulo2') {
      await _renderCapitulo2(existingRContainer);
    } else if (subSecao === 'multiverso') {
      await _renderMultiverso(existingRContainer);
    } else {
      await _renderGlossario(existingRContainer);
    }
    return;
  }

  container.innerHTML = `
    <div class="compendio-secao-header">
      <h2>Glossário e Regras</h2>
      <p>
        Guia de regras do D&D 5.5: consulte termos e condições no glossário, regras de combate e jogabilidade, criação de personagem e a cosmologia do multiverso.
      </p>
    </div>

    <!-- Sub-nav de Regras -->
    <div class="compendio-subnav" id="subnav-regras">
      <button class="compendio-subnav-btn ${subSecao === 'glossario' ? 'ativo' : ''}" data-sub="glossario">Glossário de Regras</button>
      <button class="compendio-subnav-btn ${subSecao === 'capitulo1' ? 'ativo' : ''}" data-sub="capitulo1">Jogando o Jogo</button>
      <button class="compendio-subnav-btn ${subSecao === 'capitulo2' ? 'ativo' : ''}" data-sub="capitulo2">Criação</button>
      <button class="compendio-subnav-btn ${subSecao === 'multiverso' ? 'ativo' : ''}" data-sub="multiverso">O Multiverso</button>
    </div>

    <div id="compendio-regras-conteudo"></div>
  `;

  const subnav = container.querySelector('#subnav-regras');
  if (subnav) {
    subnav.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    subnav.scrollLeft = 0;
  }

  container.querySelectorAll('#subnav-regras .compendio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.dataset.sub;
      _subSecaoAtiva = sub;
      navegar(`compendio/regras/${sub}`, { manterScroll: true });
    });
  });

  const rContainer = document.getElementById('compendio-regras-conteudo');

  if (subSecao === 'capitulo1') {
    await _renderCapitulo1(rContainer);
  } else if (subSecao === 'capitulo2') {
    await _renderCapitulo2(rContainer);
  } else if (subSecao === 'multiverso') {
    await _renderMultiverso(rContainer);
  } else {
    await _renderGlossario(rContainer);
  }
}

async function _renderGlossario(container) {
  if (!_cacheGlossario) {
    _cacheGlossario = await getGlossario();
  }
  const termos = _cacheGlossario?.termos || [];

  container.innerHTML = `
    <div class="compendio-toolbar">
      <div class="compendio-search-wrap">
        <span class="compendio-search-icon">${ICONE_BUSCA_SVG}</span>
        <input type="text" class="compendio-search-input" id="busca-glossario" placeholder="Buscar regra ou condição (ex: Vantagem, Agarrado, Invisível)...">
      </div>
      <div class="compendio-count-badge" id="contagem-glossario">
        Total: ${termos.length} termos
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;" id="lista-glossario">
      ${_gerarTermosGlossarioHTML(termos)}
    </div>
  `;

  const input = container.querySelector('#busca-glossario');
  const lista = container.querySelector('#lista-glossario');
  const contador = container.querySelector('#contagem-glossario');

  function filtrarGlossario() {
    const termo = semAcento(input.value);
    const filtrados = termos.filter(t =>
      semAcento(t.nome).includes(termo) ||
      semAcento(t.descricao || '').includes(termo)
    );
    lista.innerHTML = _gerarTermosGlossarioHTML(filtrados);
    contador.textContent = `Total: ${filtrados.length} termos`;
    _atribuirEventosAccordion(lista);
  }

  input.addEventListener('input', filtrarGlossario);
  _atribuirEventosAccordion(lista);
}

function _gerarTermosGlossarioHTML(lista) {
  if (lista.length === 0) {
    return `<div class="empty-state"><p>Nenhum termo de regra encontrado.</p></div>`;
  }

  return lista.map((t, idx) => `
    <div class="compendio-accordion">
      <div class="compendio-accordion-header" data-acc-index="${idx}">
        <span>
          <strong>${escHtml(t.nome)}</strong>
        </span>
        <span class="acc-icon">▼</span>
      </div>
      <div class="compendio-accordion-body" id="acc-glossario-${idx}" style="display: none;">
        ${mdParaHtml(t.descricao || '')}
      </div>
    </div>
  `).join('');
}

function _atribuirEventosAccordion(container) {
  container.querySelectorAll('.compendio-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const idx = header.dataset.accIndex;
      const body = container.querySelector(`#acc-glossario-${idx}`);
      if (!body) return;
      const icon = header.querySelector('.acc-icon');
      const aberto = header.classList.toggle('aberto');
      body.style.display = aberto ? 'block' : 'none';
      icon.textContent = aberto ? '▲' : '▼';
    });
  });
}

async function _renderCapitulo1(container) {
  if (!_cacheCapitulo1) {
    _cacheCapitulo1 = await getCapitulo1Regras();
  }
  const texto = _cacheCapitulo1?.texto_completo || '';

  container.innerHTML = `
    <div class="card compendio-doc-container">
      ${mdParaHtml(texto)}
    </div>
  `;
}

async function _renderCapitulo2(container) {
  if (!_cacheCapitulo2) {
    _cacheCapitulo2 = await getCapitulo2Criacao();
  }
  const texto = _cacheCapitulo2?.texto_completo || '';

  container.innerHTML = `
    <div class="card compendio-doc-container">
      ${mdParaHtml(texto)}
    </div>
  `;
}

async function _renderMultiverso(container) {
  if (!_cacheMultiverso) {
    _cacheMultiverso = await getMultiverso();
  }
  const texto = _cacheMultiverso?.texto_completo || '';

  container.innerHTML = `
    <div class="card compendio-doc-container">
      ${mdParaHtml(texto)}
    </div>
  `;
}
