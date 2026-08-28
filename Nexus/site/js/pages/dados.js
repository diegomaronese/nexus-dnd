// ============================================================
// Página: Rolador de Dados Virtual D&D 5.5e
// Rolagem completa com Vantagem, Desvantagem, Modificadores,
// Seleção de Quantidade, Histórico das últimas 10 rolagens e
// Gerenciamento completo de Atalhos Rápidos Personalizados
// com persistência local e sincronização na Nuvem (Google / Firestore).
// ============================================================
import { definirTituloHeader, navegar } from '../app.js';
import { toast, escHtml, abrirModal, fecharModal } from '../utils.js';
import {
  iniciarAuth,
  getUsuario,
  onAuthChange,
  listarAtalhosDadosCloud,
  salvarAtalhoDadosCloud,
  salvarTodosAtalhosDadosCloud,
  removerAtalhoDadosCloud
} from '../auth.js';

const STORAGE_KEY_HISTORICO = 'dnd5e_dados_historico';
const STORAGE_KEY_CONFIG = 'dnd5e_dados_config_atual';
const STORAGE_KEY_ATALHOS = 'dnd5e_dados_atalhos_customizados';

// Definição dos dados padrão do D&D com tons nobres medievais
export const DADOS_DND = [
  { tipo: 'd4', faces: 4, nome: 'd4', icone: '▲', cor: '#b87333', desc: '4 faces' },
  { tipo: 'd6', faces: 6, nome: 'd6', icone: '■', cor: '#507693', desc: '6 faces' },
  { tipo: 'd8', faces: 8, nome: 'd8', icone: '◆', cor: '#825a89', desc: '8 faces' },
  { tipo: 'd10', faces: 10, nome: 'd10', icone: '⬟', cor: '#2e7c6d', desc: '10 faces' },
  { tipo: 'd12', faces: 12, nome: 'd12', icone: '⬢', cor: '#9e2b2b', desc: '12 faces' },
  { tipo: 'd20', faces: 20, nome: 'd20', icone: '⬡', cor: '#c8a051', desc: '20 faces' },
  { tipo: 'd100', faces: 100, nome: 'd100', icone: '%', cor: '#851a1a', desc: 'Percentil' },
];

// Presets padrão iniciais de D&D 5.5e
export const PRESETS_DND_PADRAO = [
  { id: 'padrao_d20', nome: 'Teste d20 Padrão', tipo: 'd20', qtd: 1, mod: 0, modo: 'normal', desc: 'Teste de Atributo / Perícia', padrao: true },
  { id: 'padrao_atk_vant', nome: 'Ataque d20 (Vantagem)', tipo: 'd20', qtd: 1, mod: 4, modo: 'vantagem', desc: 'Jogada de Ataque c/ Vantagem', padrao: true },
  { id: 'padrao_espada_longa', nome: 'Espada Longa (1d8+3)', tipo: 'd8', qtd: 1, mod: 3, modo: 'normal', desc: 'Dano Versátil / 1 Mão', padrao: true },
  { id: 'padrao_espada_grande', nome: 'Espada Grande (2d6+3)', tipo: 'd6', qtd: 2, mod: 3, modo: 'normal', desc: 'Dano de 2 Mãos', padrao: true },
  { id: 'padrao_bola_fogo', nome: 'Bola de Fogo (8d6)', tipo: 'd6', qtd: 8, mod: 0, modo: 'normal', desc: 'Magia de 3º Círculo', padrao: true },
  { id: 'padrao_cura', nome: 'Curar Ferimentos (2d8+3)', tipo: 'd8', qtd: 2, mod: 3, modo: 'normal', desc: 'Cura Nível 2', padrao: true },
  { id: 'padrao_d100', nome: 'Tabela de Tesouro (1d100)', tipo: 'd100', qtd: 1, mod: 0, modo: 'normal', desc: 'Rolagem Percentil', padrao: true }
];

let _containerRef = null;
let _estadoAtual = _carregarConfigSalva();
let _estaRolando = false;
let _authRegistradoDados = false;
let _syncEmAndamento = false;

function _carregarConfigSalva() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (salvo) {
      const parsed = JSON.parse(salvo);
      return {
        tipo: parsed.tipo || 'd20',
        qtd: Math.max(1, Math.min(100, Number(parsed.qtd) || 1)),
        mod: Number(parsed.mod) || 0,
        modo: ['normal', 'vantagem', 'desvantagem'].includes(parsed.modo) ? parsed.modo : 'normal',
        descricao: parsed.descricao || ''
      };
    }
  } catch (e) {
    // fallback padrão
  }
  return {
    tipo: 'd20',
    qtd: 1,
    mod: 0,
    modo: 'normal',
    descricao: ''
  };
}

function _salvarConfigAtual() {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(_estadoAtual));
  } catch (e) {
    // Ignorar falha de quota
  }
}

// ============================================================
// Gerenciamento de Atalhos Rápidos (Local + Nuvem)
// ============================================================

/** Carrega a lista de atalhos rápidos do localStorage */
export function carregarAtalhos() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY_ATALHOS);
    if (dados) {
      const lista = JSON.parse(dados);
      if (Array.isArray(lista) && lista.length > 0) {
        return lista.map(item => ({
          id: item.id || ('atalho_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
          nome: item.nome || 'Atalho sem nome',
          tipo: DADOS_DND.some(d => d.tipo === item.tipo) ? item.tipo : 'd20',
          qtd: Math.max(1, Math.min(100, Number(item.qtd) || 1)),
          mod: Number(item.mod) || 0,
          modo: ['normal', 'vantagem', 'desvantagem'].includes(item.modo) ? item.modo : 'normal',
          desc: item.desc || '',
          padrao: Boolean(item.padrao),
          personalizado: Boolean(item.personalizado || !item.padrao),
          criadoEm: item.criadoEm || Date.now(),
          atualizadoEm: item.atualizadoEm || Date.now()
        }));
      }
    }
  } catch (e) {
    console.error('Erro ao ler atalhos de dados:', e);
  }
  return [...PRESETS_DND_PADRAO];
}

/** Salva a lista de atalhos no localStorage */
export function salvarAtalhosLocais(lista) {
  try {
    localStorage.setItem(STORAGE_KEY_ATALHOS, JSON.stringify(lista));
  } catch (e) {
    console.error('Erro ao salvar atalhos locais:', e);
  }
}

/** Sincroniza atalhos locais com a nuvem (Firestore) */
export async function sincronizarAtalhosCloud() {
  const usuario = getUsuario();
  if (!usuario || _syncEmAndamento) return;
  _syncEmAndamento = true;

  try {
    const cloudAtalhos = await listarAtalhosDadosCloud();
    const locaisAtalhos = carregarAtalhos();

    if (Array.isArray(cloudAtalhos) && cloudAtalhos.length > 0) {
      // Se há atalhos na nuvem, atualizar o cache local com os da nuvem
      salvarAtalhosLocais(cloudAtalhos);
    } else if (locaisAtalhos.length > 0) {
      // Se a nuvem está vazia mas há atalhos locais, faz upload para a nuvem
      await salvarTodosAtalhosDadosCloud(locaisAtalhos);
    }

    if (_containerRef && window.location.hash.includes('dados')) {
      _renderizarLayout(_containerRef);
    }
  } catch (err) {
    console.warn('Erro ao sincronizar atalhos com a nuvem:', err.message);
  } finally {
    _syncEmAndamento = false;
  }
}

/** Cria ou atualiza um atalho rápido */
export async function salvarAtalho(dadosAtalho, idExistente = null) {
  let atalhos = carregarAtalhos();
  const agora = Date.now();

  const atalhoFormatado = {
    id: idExistente || ('atalho_' + agora + '_' + Math.random().toString(36).substr(2, 6)),
    nome: (dadosAtalho.nome || 'Novo Atalho').trim(),
    tipo: dadosAtalho.tipo || 'd20',
    qtd: Math.max(1, Math.min(100, Number(dadosAtalho.qtd) || 1)),
    mod: Number(dadosAtalho.mod) || 0,
    modo: ['normal', 'vantagem', 'desvantagem'].includes(dadosAtalho.modo) ? dadosAtalho.modo : 'normal',
    desc: (dadosAtalho.desc || '').trim(),
    personalizado: true,
    padrao: false,
    criadoEm: dadosAtalho.criadoEm || agora,
    atualizadoEm: agora
  };

  if (idExistente) {
    const idx = atalhos.findIndex(a => a.id === idExistente);
    if (idx >= 0) {
      atalhoFormatado.criadoEm = atalhos[idx].criadoEm || agora;
      atalhos[idx] = atalhoFormatado;
    } else {
      atalhos.unshift(atalhoFormatado);
    }
  } else {
    atalhos.unshift(atalhoFormatado);
  }

  salvarAtalhosLocais(atalhos);

  // Sincronizar com Firestore se logado
  if (getUsuario()) {
    try {
      await salvarAtalhoDadosCloud(atalhoFormatado);
    } catch (err) {
      console.warn('Erro ao salvar atalho na nuvem:', err);
    }
  }

  return atalhoFormatado;
}

/** Exclui um atalho rápido por ID */
export async function excluirAtalho(id) {
  let atalhos = carregarAtalhos();
  atalhos = atalhos.filter(a => a.id !== id);
  salvarAtalhosLocais(atalhos);

  // Remover da nuvem se logado
  if (getUsuario()) {
    try {
      await removerAtalhoDadosCloud(id);
    } catch (err) {
      console.warn('Erro ao remover atalho da nuvem:', err);
    }
  }

  return atalhos;
}

/** Restaura a lista de atalhos padrão */
export async function restaurarAtalhosPadrao() {
  const padroes = [...PRESETS_DND_PADRAO];
  salvarAtalhosLocais(padroes);

  if (getUsuario()) {
    try {
      await salvarTodosAtalhosDadosCloud(padroes);
    } catch (err) {
      console.warn('Erro ao restaurar atalhos na nuvem:', err);
    }
  }

  return padroes;
}

// ============================================================
// Histórico de Rolagens
// ============================================================

export function carregarHistorico() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY_HISTORICO);
    if (dados) {
      const lista = JSON.parse(dados);
      if (Array.isArray(lista)) return lista.slice(0, 10);
    }
  } catch (e) {
    console.error('Erro ao ler histórico de dados:', e);
  }
  return [];
}

export function salvarNoHistorico(resultado) {
  try {
    let historico = carregarHistorico();
    historico.unshift(resultado);
    historico = historico.slice(0, 10); // Mantém exatamente as últimas 10 rolagens
    localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(historico));
    return historico;
  } catch (e) {
    console.error('Erro ao salvar no histórico:', e);
    return [];
  }
}

export function limparHistorico() {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORICO);
  } catch (e) {
    // Ignorar
  }
}

// ============================================================
// Ponto de entrada da página de Rolagem de Dados
// ============================================================

export function renderDados(container) {
  _containerRef = container;
  definirTituloHeader('Dados');

  // Inicializar Firebase Auth e sincronização em segundo plano
  iniciarAuth().then(() => {
    if (!_authRegistradoDados) {
      _authRegistradoDados = true;
      onAuthChange((usuario) => {
        if (usuario) {
          sincronizarAtalhosCloud();
        }
        if (_containerRef && window.location.hash.includes('dados')) {
          _renderizarLayout(_containerRef);
        }
      });
    }
    // Se já autenticado no momento da renderização
    if (getUsuario()) {
      sincronizarAtalhosCloud();
    }
  });

  _renderizarLayout(container);
}

function _renderizarLayout(container, ultimoResultado = null) {
  const historico = carregarHistorico();
  const atalhos = carregarAtalhos();
  const usuario = getUsuario();
  const dadoAtivoInfo = DADOS_DND.find(d => d.tipo === _estadoAtual.tipo) || DADOS_DND[5];

  container.innerHTML = `
    <div class="dice-page-container">
      
      <!-- Cabeçalho da Página -->
      <div class="dice-hero">
        <div>
          <div class="dice-hero-title">
            <img src="img/icons/ico-home-dados.png" class="page-hero-ico" alt="">
            <span>Mesa de Dados</span>
          </div>
          <div class="dice-hero-desc">
            Role qualquer combinação de dados das regras de D&D com vantagens, desvantagens, modificadores, histórico e atalhos rápidos sincronizados na nuvem.
          </div>
        </div>
      </div>

      <!-- SEÇÃO 1: Seleção do Tipo de Dado -->
      <div class="card dice-card-section">
        <div class="dice-section-label">
          <span>Escolha o Tipo de Dado</span>
          <span class="dice-selected-indicator" style="color: ${dadoAtivoInfo.cor}">Selecionado: <strong>${dadoAtivoInfo.nome.toUpperCase()}</strong> (${dadoAtivoInfo.desc})</span>
        </div>
        
        <div class="dice-types-grid">
          ${DADOS_DND.map(d => {
            const selecionado = d.tipo === _estadoAtual.tipo;
            return `
              <button type="button" class="dice-type-btn ${selecionado ? 'ativo' : ''}" data-tipo="${d.tipo}" style="--dice-color: ${d.cor}">
                <div class="dice-type-icon-wrap">
                  ${_gerarSvgDado(d.tipo, d.cor, selecionado)}
                </div>
                <div class="dice-type-label">${d.nome.toUpperCase()}</div>
                <div class="dice-type-sub">${d.faces} faces</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SEÇÃO 2: Configuração da Rolagem (Qtd, Modo, Modificador, Motivo) -->
      <div class="card dice-card-section">
        <div class="dice-section-label dice-section-label-col">
          <span class="dice-section-title">Configuração da Rolagem</span>
          <span class="dice-formula-preview">Fórmula: <strong>${_montarFormulaTexto(_estadoAtual)}</strong></span>
        </div>

        <div class="dice-config-grid">
          
          <!-- 1. Quantidade de Dados -->
          <div class="dice-config-box">
            <label class="dice-field-label">Quantidade de Dados</label>
            <div class="dice-stepper">
              <button type="button" class="dice-step-btn" id="btn-qtd-minus" title="Diminuir quantidade">-</button>
              <input type="number" id="input-dice-qtd" class="dice-step-input" min="1" max="100" value="${_estadoAtual.qtd}">
              <button type="button" class="dice-step-btn" id="btn-qtd-plus" title="Aumentar quantidade">+</button>
            </div>
            <div class="dice-quick-pills">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `
                <button type="button" class="dice-quick-pill ${Number(_estadoAtual.qtd) === n ? 'ativo' : ''}" data-qtd-val="${n}">${n}</button>
              `).join('')}
            </div>
          </div>

          <!-- 2. Modificador (+/-) -->
          <div class="dice-config-box">
            <label class="dice-field-label">Modificador</label>
            <div class="dice-stepper">
              <button type="button" class="dice-step-btn" id="btn-mod-minus" title="Diminuir bônus">-</button>
              <input type="number" id="input-dice-mod" class="dice-step-input" value="${_estadoAtual.mod}">
              <button type="button" class="dice-step-btn" id="btn-mod-plus" title="Aumentar bônus">+</button>
            </div>
            <div class="dice-quick-pills">
              ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(m => `
                <button type="button" class="dice-quick-pill ${Number(_estadoAtual.mod) === m ? 'ativo' : ''}" data-mod-val="${m}">
                  ${m >= 0 ? (m === 0 ? '0' : `+${m}`) : m}
                </button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- 3. Modo de Vantagem / Desvantagem -->
        <div class="dice-mode-section">
          <label class="dice-field-label">Modo de Rolagem</label>
          <div class="dice-mode-selector">
            <button type="button" class="dice-mode-btn ${(!_estadoAtual.modo || _estadoAtual.modo === 'normal') ? 'ativo' : ''}" data-modo="normal">
              <span class="dice-mode-icon"><img src="img/icons/ico-modo-normal.png" class="mode-icon-img" alt=""></span>
              <div class="dice-mode-info">
                <span class="dice-mode-title">Normal</span>
                <span class="dice-mode-desc">1 rolagem padrão</span>
              </div>
            </button>
            <button type="button" class="dice-mode-btn mode-vantagem ${_estadoAtual.modo === 'vantagem' ? 'ativo' : ''}" data-modo="vantagem">
              <span class="dice-mode-icon"><img src="img/icons/ico-modo-vantagem.png" class="mode-icon-img" alt=""></span>
              <div class="dice-mode-info">
                <span class="dice-mode-title">Vantagem</span>
                <span class="dice-mode-desc">Rola 2x, pega o maior</span>
              </div>
            </button>
            <button type="button" class="dice-mode-btn mode-desvantagem ${_estadoAtual.modo === 'desvantagem' ? 'ativo' : ''}" data-modo="desvantagem">
              <span class="dice-mode-icon"><img src="img/icons/ico-modo-desvantagem.png" class="mode-icon-img" alt=""></span>
              <div class="dice-mode-info">
                <span class="dice-mode-title">Desvantagem</span>
                <span class="dice-mode-desc">Rola 2x, pega o menor</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 4. Motivo / Descrição Opcional -->
        <div class="dice-desc-section">
          <label class="dice-field-label" for="input-dice-desc">Descrição / Motivo da Rolagem (Opcional)</label>
          <input type="text" id="input-dice-desc" class="dice-input-text" placeholder="Ex: Ataque c/ Espada, Teste de Atletismo, Bola de Fogo..." value="${escHtml(_estadoAtual.descricao || '')}">
        </div>

        <!-- Botão Principal de Rolagem -->
        <div class="dice-action-wrap" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" id="btn-executar-rolagem" class="dice-roll-main-btn" ${_estaRolando ? 'disabled' : ''} style="flex: 1; min-width: 220px;">
            <span class="dice-roll-icon">${_gerarSvgDado(_estadoAtual.tipo, dadoAtivoInfo.cor, true, 26)}</span>
            <span class="dice-roll-text">
              ${_estaRolando ? 'Rolando dados...' : `Rolar ${_montarFormulaTexto(_estadoAtual)}`}
            </span>
          </button>
          <button type="button" id="btn-salvar-como-atalho-rapido" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; padding: 0 16px; font-weight: 600;" title="Salvar esta configuração como um novo Atalho Rápido">
            <span>⭐</span>
            <span>Salvar como Atalho</span>
          </button>
        </div>

      </div>

      <!-- SEÇÃO 3: Exibição do Resultado Atual (se houver) -->
      <div id="dice-resultado-slot">
        ${ultimoResultado ? _gerarHtmlResultado(ultimoResultado) : ''}
      </div>

      <!-- SEÇÃO 4: Atalhos Rápidos Personalizados & Sincronização na Nuvem -->
      <div class="card dice-card-section" id="secao-atalhos-rapidos">
        <div class="dice-presets-header">
          <div class="dice-presets-title-wrap">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 1.05rem; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 6px;">
                <span>⚡</span> Atalhos Rápidos
              </span>
              ${usuario ? `
                <span class="c-badge" style="background: rgba(46, 204, 113, 0.18); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.4); font-size: 0.7rem; font-weight: 600;">
                  ● Nuvem Google Sincronizada
                </span>
              ` : `
                <span class="c-badge" style="background: rgba(200, 160, 81, 0.12); color: #c8a051; border: 1px solid rgba(200, 160, 81, 0.3); font-size: 0.7rem; font-weight: 600;">
                  💾 Salvo no Navegador (Offline)
                </span>
              `}
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted)">Clique no atalho para rolar instantaneamente. Você pode criar, editar e excluir seus próprios atalhos.</span>
          </div>

          <div class="dice-presets-actions-bar">
            <button type="button" class="btn btn-sm btn-primary" id="btn-novo-atalho" style="display: flex; align-items: center; gap: 5px;">
              <span>＋</span>
              <span>Novo Atalho</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" id="btn-restaurar-atalhos" title="Restaurar a lista de atalhos padrão do D&D" style="display: flex; align-items: center; gap: 5px;">
              <span>↺</span>
              <span>Padrões</span>
            </button>
          </div>
        </div>

        <div class="dice-presets-grid">
          ${atalhos.length === 0 ? `
            <div class="dice-preset-empty-box">
              <p>Nenhum atalho rápido configurado.</p>
              <button type="button" class="btn btn-sm btn-primary" id="btn-criar-primeiro-atalho" style="margin-top: 8px;">＋ Criar Meu Primeiro Atalho</button>
            </div>
          ` : atalhos.map(p => _gerarHtmlCardAtalho(p)).join('')}
        </div>
      </div>

      <!-- SEÇÃO 5: Histórico das Últimas 10 Rolagens -->
      <div class="card dice-card-section" id="secao-historico">
        <div class="dice-history-header">
          <div class="dice-section-label" style="margin-bottom: 0;">
            <span>📜 Histórico das Últimas 10 Rolagens</span>
            <span class="c-badge" style="background: var(--bg-input); border-color: var(--border); font-size: 0.72rem;">
              ${historico.length} / 10 salvas
            </span>
          </div>
          ${historico.length > 0 ? `
            <button type="button" class="btn btn-sm btn-secondary" id="btn-limpar-historico" title="Limpar histórico">
              <img src="img/icons/ico-limpar-historico.png" class="btn-icon-img" alt=""> Limpar
            </button>
          ` : ''}
        </div>

        <div class="dice-history-list" id="dice-history-container">
          ${historico.length === 0 ? `
            <div class="dice-history-empty">
              <img src="img/icons/ico-home-dados.png" style="width: 48px; height: 48px; opacity: 0.45; object-fit: contain; margin-bottom: 8px;" alt="">
              <p>Nenhuma rolagem realizada ainda nesta sessão.</p>
              <span style="font-size: 0.8rem; color: var(--text-muted);">As suas últimas 10 rolagens aparecerão detalhadas aqui.</span>
            </div>
          ` : historico.map((h, i) => _gerarHtmlItemHistorico(h, i)).join('')}
        </div>
      </div>

    </div>
  `;

  _vincularEventos(container);
}

function _gerarHtmlCardAtalho(p) {
  const dadoInfo = DADOS_DND.find(d => d.tipo === p.tipo) || DADOS_DND[5];
  const modTxt = p.mod !== 0 ? (p.mod > 0 ? `+${p.mod}` : `${p.mod}`) : '';
  const formulaStr = `${p.qtd}${p.tipo}${modTxt ? ` ${modTxt}` : ''}${p.modo !== 'normal' ? ` (${p.modo})` : ''}`;

  return `
    <div class="dice-preset-btn" data-atalho-id="${escHtml(p.id)}">
      <div class="dice-preset-top-row">
        <span class="dice-preset-badge-tag" style="background: ${dadoInfo.cor}22; color: ${dadoInfo.cor}; border: 1px solid ${dadoInfo.cor}66;">
          ${p.tipo.toUpperCase()}
        </span>
        
        <div class="dice-preset-actions" onclick="event.stopPropagation();">
          <button type="button" class="dice-preset-act-btn act-edit" data-edit-atalho-id="${escHtml(p.id)}" title="Editar este atalho">
            ✏️
          </button>
          <button type="button" class="dice-preset-act-btn act-delete" data-delete-atalho-id="${escHtml(p.id)}" title="Excluir este atalho">
            🗑️
          </button>
        </div>
      </div>

      <div class="dice-preset-title" title="${escHtml(p.nome)}">${escHtml(p.nome)}</div>
      <div class="dice-preset-formula">
        <span>${formulaStr}</span>
      </div>
      <div class="dice-preset-desc" title="${escHtml(p.desc || 'Sem observações')}">${escHtml(p.desc || 'Rolagem rápida')}</div>
    </div>
  `;
}

function _montarFormulaTexto(cfg) {
  const modTxt = cfg.mod !== 0 ? (cfg.mod > 0 ? `+${cfg.mod}` : `${cfg.mod}`) : '';
  const modoTxt = cfg.modo === 'vantagem' ? ' (Vantagem)' : (cfg.modo === 'desvantagem' ? ' (Desvantagem)' : '');
  return `${cfg.qtd}${cfg.tipo}${modTxt ? ` ${modTxt}` : ''}${modoTxt}`;
}

function _vincularEventos(container) {
  // 1. Troca de Tipo de Dado
  container.querySelectorAll('.dice-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      _estadoAtual.tipo = tipo;
      _salvarConfigAtual();
      _renderizarLayout(container);
    });
  });

  // 2. Quantidade de Dados (Input e Stepper)
  const inputQtd = container.querySelector('#input-dice-qtd');
  if (inputQtd) {
    inputQtd.addEventListener('change', () => {
      let val = parseInt(inputQtd.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 100) val = 100;
      _estadoAtual.qtd = val;
      _salvarConfigAtual();
      _atualizarTextoBotao(container);
    });
  }

  container.querySelector('#btn-qtd-minus')?.addEventListener('click', () => {
    let val = Math.max(1, (parseInt(_estadoAtual.qtd, 10) || 1) - 1);
    _estadoAtual.qtd = val;
    _salvarConfigAtual();
    _renderizarLayout(container);
  });

  container.querySelector('#btn-qtd-plus')?.addEventListener('click', () => {
    let val = Math.min(100, (parseInt(_estadoAtual.qtd, 10) || 1) + 1);
    _estadoAtual.qtd = val;
    _salvarConfigAtual();
    _renderizarLayout(container);
  });

  container.querySelectorAll('[data-qtd-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      _estadoAtual.qtd = parseInt(btn.dataset.qtdVal, 10) || 1;
      _salvarConfigAtual();
      _renderizarLayout(container);
    });
  });

  // 3. Modificador (Input e Stepper)
  const inputMod = container.querySelector('#input-dice-mod');
  if (inputMod) {
    inputMod.addEventListener('change', () => {
      let val = parseInt(inputMod.value, 10);
      if (isNaN(val)) val = 0;
      _estadoAtual.mod = val;
      _salvarConfigAtual();
      _atualizarTextoBotao(container);
    });
  }

  container.querySelector('#btn-mod-minus')?.addEventListener('click', () => {
    _estadoAtual.mod = (parseInt(_estadoAtual.mod, 10) || 0) - 1;
    _salvarConfigAtual();
    _renderizarLayout(container);
  });

  container.querySelector('#btn-mod-plus')?.addEventListener('click', () => {
    _estadoAtual.mod = (parseInt(_estadoAtual.mod, 10) || 0) + 1;
    _salvarConfigAtual();
    _renderizarLayout(container);
  });

  container.querySelectorAll('[data-mod-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      _estadoAtual.mod = parseInt(btn.dataset.modVal, 10) || 0;
      _salvarConfigAtual();
      _renderizarLayout(container);
    });
  });

  // 4. Modos de Rolagem (Normal, Vantagem, Desvantagem)
  container.querySelectorAll('.dice-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _estadoAtual.modo = btn.dataset.modo || 'normal';
      _salvarConfigAtual();
      _renderizarLayout(container);
    });
  });

  // 5. Descrição / Motivo
  const inputDesc = container.querySelector('#input-dice-desc');
  if (inputDesc) {
    inputDesc.addEventListener('input', () => {
      _estadoAtual.descricao = inputDesc.value;
      _salvarConfigAtual();
    });
  }

  // 6. Botão Executar Rolagem Principal
  container.querySelector('#btn-executar-rolagem')?.addEventListener('click', () => {
    if (_estaRolando) return;
    _executarRolagem(container, _estadoAtual);
  });

  // 7. Botão "Salvar como Atalho" direto da configuração ativa
  container.querySelector('#btn-salvar-como-atalho-rapido')?.addEventListener('click', () => {
    _abrirModalCriarEditarAtalho(null, {
      tipo: _estadoAtual.tipo,
      qtd: _estadoAtual.qtd,
      mod: _estadoAtual.mod,
      modo: _estadoAtual.modo,
      desc: _estadoAtual.descricao || '',
      nome: _estadoAtual.descricao ? `Rolagem de ${_estadoAtual.descricao}` : `Atalho ${_montarFormulaTexto(_estadoAtual)}`
    });
  });

  // 8. Botão Novo Atalho
  container.querySelector('#btn-novo-atalho')?.addEventListener('click', () => {
    _abrirModalCriarEditarAtalho();
  });
  container.querySelector('#btn-criar-primeiro-atalho')?.addEventListener('click', () => {
    _abrirModalCriarEditarAtalho();
  });

  // 9. Botão Restaurar Atalhos Padrão
  container.querySelector('#btn-restaurar-atalhos')?.addEventListener('click', () => {
    abrirModal(
      'Restaurar Atalhos Padrão',
      `
        <div style="font-size: 0.9rem; line-height: 1.6;">
          <p>Deseja restaurar a lista com os <strong>7 atalhos padrão</strong> do D&D 5.5e?</p>
          <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 8px;">
            Esta ação substituirá a lista atual de atalhos e sincronizará automaticamente na nuvem se você estiver logado.
          </p>
        </div>
      `,
      `
        <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" id="btn-confirmar-restaurar-atalhos">Restaurar Padrões</button>
      `
    );

    document.getElementById('btn-confirmar-restaurar-atalhos')?.addEventListener('click', async () => {
      fecharModal();
      await restaurarAtalhosPadrao();
      toast('Atalhos padrão restaurados com sucesso!', 'success');
      _renderizarLayout(container);
    });
  });

  // 10. Clicar no Atalho para Rolar Instantaneamente
  container.querySelectorAll('.dice-preset-btn[data-atalho-id]').forEach(card => {
    card.addEventListener('click', () => {
      const atalhoId = card.dataset.atalhoId;
      const atalhos = carregarAtalhos();
      const atalho = atalhos.find(a => a.id === atalhoId);
      if (atalho) {
        _estadoAtual = {
          tipo: atalho.tipo,
          qtd: atalho.qtd,
          mod: atalho.mod,
          modo: atalho.modo,
          descricao: atalho.desc || atalho.nome
        };
        _salvarConfigAtual();
        _executarRolagem(container, _estadoAtual);
      }
    });
  });

  // 11. Editar Atalho Rápido
  container.querySelectorAll('[data-edit-atalho-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const atalhoId = btn.dataset.editAtalhoId;
      const atalhos = carregarAtalhos();
      const atalho = atalhos.find(a => a.id === atalhoId);
      if (atalho) {
        _abrirModalCriarEditarAtalho(atalho);
      }
    });
  });

  // 12. Excluir Atalho Rápido
  container.querySelectorAll('[data-delete-atalho-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const atalhoId = btn.dataset.deleteAtalhoId;
      const atalhos = carregarAtalhos();
      const atalho = atalhos.find(a => a.id === atalhoId);
      if (atalho) {
        abrirModal(
          'Excluir Atalho Rápido',
          `
            <div style="font-size: 0.9rem; line-height: 1.6;">
              <p>Tem certeza que deseja excluir o atalho <strong>${escHtml(atalho.nome)}</strong>?</p>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; margin-top: 8px;">
                <span style="color: #f39c12; font-weight: 700;">${atalho.qtd}${atalho.tipo}${atalho.mod !== 0 ? (atalho.mod > 0 ? ` +${atalho.mod}` : ` ${atalho.mod}`) : ''} ${atalho.modo !== 'normal' ? `(${atalho.modo})` : ''}</span>
                ${atalho.desc ? `<div style="font-size: 0.78rem; color: var(--text-muted);">${escHtml(atalho.desc)}</div>` : ''}
              </div>
            </div>
          `,
          `
            <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
            <button type="button" class="btn btn-danger" id="btn-confirmar-excluir-atalho">Excluir Atalho</button>
          `
        );

        document.getElementById('btn-confirmar-excluir-atalho')?.addEventListener('click', async () => {
          fecharModal();
          await excluirAtalho(atalhoId);
          toast(`Atalho "${atalho.nome}" excluído`, 'info');
          _renderizarLayout(container);
        });
      }
    });
  });

  // 13. Limpar Histórico
  container.querySelector('#btn-limpar-historico')?.addEventListener('click', () => {
    limparHistorico();
    toast('Histórico de rolagens limpo', 'info');
    _renderizarLayout(container);
  });

  // 14. Re-rolar item do histórico
  container.querySelectorAll('[data-reroll-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const historico = carregarHistorico();
      const idx = parseInt(btn.dataset.rerollIdx, 10);
      const item = historico[idx];
      if (item) {
        _estadoAtual = {
          tipo: item.tipo,
          qtd: item.qtd,
          mod: item.mod,
          modo: item.modo,
          descricao: item.descricao || ''
        };
        _salvarConfigAtual();
        _executarRolagem(container, _estadoAtual);
      }
    });
  });
}

/**
 * Modal completo para Criação e Edição de Atalho Rápido
 */
function _abrirModalCriarEditarAtalho(atalhoParaEditar = null, dadosIniciais = null) {
  const ehEdicao = Boolean(atalhoParaEditar);
  const idAlvo = atalhoParaEditar?.id || null;

  const tempState = {
    nome: atalhoParaEditar?.nome || dadosIniciais?.nome || '',
    tipo: atalhoParaEditar?.tipo || dadosIniciais?.tipo || _estadoAtual.tipo || 'd20',
    qtd: atalhoParaEditar ? atalhoParaEditar.qtd : (dadosIniciais?.qtd || _estadoAtual.qtd || 1),
    mod: atalhoParaEditar ? atalhoParaEditar.mod : (dadosIniciais?.mod || _estadoAtual.mod || 0),
    modo: atalhoParaEditar ? atalhoParaEditar.modo : (dadosIniciais?.modo || _estadoAtual.modo || 'normal'),
    desc: atalhoParaEditar?.desc || dadosIniciais?.desc || ''
  };

  const tituloModal = ehEdicao ? '✏️ Editar Atalho Rápido' : '⚡ Novo Atalho Rápido';

  const corpoHtml = `
    <form id="form-modal-atalho" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 14px;">
      
      <!-- Nome do Atalho -->
      <div>
        <label class="dice-field-label" for="modal-input-nome">Nome do Atalho *</label>
        <input type="text" id="modal-input-nome" class="dice-input-text" required placeholder="Ex: Fúria do Bárbaro, Bola de Fogo, Iniciativa..." value="${escHtml(tempState.nome)}">
      </div>

      <!-- Tipo de Dado -->
      <div>
        <label class="dice-field-label">Tipo de Dado</label>
        <div class="modal-dice-types-grid" id="modal-types-container">
          ${DADOS_DND.map(d => {
            const ativo = d.tipo === tempState.tipo;
            return `
              <button type="button" class="modal-dice-type-btn ${ativo ? 'ativo' : ''}" data-modal-tipo="${d.tipo}" style="--dice-color: ${d.cor}">
                <div>${_gerarSvgDado(d.tipo, d.cor, ativo, 24)}</div>
                <span class="modal-dice-type-label">${d.nome.toUpperCase()}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Configuração de Qtd e Modificador -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        
        <!-- Quantidade -->
        <div class="dice-config-box" style="margin-bottom: 0;">
          <label class="dice-field-label">Quantidade</label>
          <div class="dice-stepper">
            <button type="button" class="dice-step-btn" id="modal-btn-qtd-minus">-</button>
            <input type="number" id="modal-input-qtd" class="dice-step-input" min="1" max="100" value="${tempState.qtd}">
            <button type="button" class="dice-step-btn" id="modal-btn-qtd-plus">+</button>
          </div>
          <div class="dice-quick-pills" style="margin-top: 6px;">
            ${[1, 2, 3, 4, 6, 8].map(n => `
              <button type="button" class="dice-quick-pill modal-pill-qtd ${Number(tempState.qtd) === n ? 'ativo' : ''}" data-val="${n}">${n}</button>
            `).join('')}
          </div>
        </div>

        <!-- Modificador -->
        <div class="dice-config-box" style="margin-bottom: 0;">
          <label class="dice-field-label">Modificador</label>
          <div class="dice-stepper">
            <button type="button" class="dice-step-btn" id="modal-btn-mod-minus">-</button>
            <input type="number" id="modal-input-mod" class="dice-step-input" value="${tempState.mod}">
            <button type="button" class="dice-step-btn" id="modal-btn-mod-plus">+</button>
          </div>
          <div class="dice-quick-pills" style="margin-top: 6px;">
            ${[0, 1, 2, 3, 4, 5].map(m => `
              <button type="button" class="dice-quick-pill modal-pill-mod ${Number(tempState.mod) === m ? 'ativo' : ''}" data-val="${m}">
                ${m === 0 ? '0' : `+${m}`}
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Modo de Rolagem -->
      <div>
        <label class="dice-field-label">Modo de Rolagem</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
          <button type="button" class="btn btn-sm ${tempState.modo === 'normal' ? 'btn-primary' : 'btn-secondary'} modal-modo-btn" data-modal-modo="normal">
            Normal
          </button>
          <button type="button" class="btn btn-sm ${tempState.modo === 'vantagem' ? 'btn-primary' : 'btn-secondary'} modal-modo-btn" data-modal-modo="vantagem" style="${tempState.modo === 'vantagem' ? 'background: #27ae60; border-color: #2ecc71;' : ''}">
            Vantagem
          </button>
          <button type="button" class="btn btn-sm ${tempState.modo === 'desvantagem' ? 'btn-primary' : 'btn-secondary'} modal-modo-btn" data-modal-modo="desvantagem" style="${tempState.modo === 'desvantagem' ? 'background: #c0392b; border-color: #e74c3c;' : ''}">
            Desvantagem
          </button>
        </div>
      </div>

      <!-- Descrição / Observação -->
      <div>
        <label class="dice-field-label" for="modal-input-desc">Descrição / Detalhes (Opcional)</label>
        <input type="text" id="modal-input-desc" class="dice-input-text" placeholder="Ex: Dano cortante com bônus de Força, Magia de 3º círculo..." value="${escHtml(tempState.desc)}">
      </div>

      <!-- Pré-visualização da Fórmula -->
      <div style="background: rgba(200, 160, 81, 0.08); border: 1px solid rgba(200, 160, 81, 0.25); border-radius: 6px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.8rem; color: var(--text-muted);">Pré-visualização:</span>
        <span id="modal-preview-formula" style="font-weight: 800; color: #f39c12; font-size: 0.95rem;">
          ${_montarFormulaTexto(tempState)}
        </span>
      </div>

    </form>
  `;

  const acoesHtml = `
    <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
    <button type="button" class="btn btn-primary" id="btn-salvar-modal-atalho-confirmar">
      ${ehEdicao ? 'Salvar Alterações' : 'Criar Atalho'}
    </button>
  `;

  abrirModal(tituloModal, corpoHtml, acoesHtml);

  // Vincular eventos interativos dentro do modal
  const modalCorpo = document.getElementById('modal-corpo');
  if (!modalCorpo) return;

  const atualizarPreview = () => {
    const previewEl = modalCorpo.querySelector('#modal-preview-formula');
    if (previewEl) {
      previewEl.textContent = _montarFormulaTexto(tempState);
    }
  };

  // 1. Tipo de dado
  modalCorpo.querySelectorAll('[data-modal-tipo]').forEach(btn => {
    btn.addEventListener('click', () => {
      tempState.tipo = btn.dataset.modalTipo;
      modalCorpo.querySelectorAll('[data-modal-tipo]').forEach(b => {
        const ativo = b.dataset.modalTipo === tempState.tipo;
        b.classList.toggle('ativo', ativo);
        const d = DADOS_DND.find(x => x.tipo === b.dataset.modalTipo);
        if (d) {
          const divIcon = b.querySelector('div');
          if (divIcon) divIcon.innerHTML = _gerarSvgDado(d.tipo, d.cor, ativo, 24);
        }
      });
      atualizarPreview();
    });
  });

  // 2. Steppers e inputs de Qtd
  const inputQtd = modalCorpo.querySelector('#modal-input-qtd');
  if (inputQtd) {
    inputQtd.addEventListener('input', () => {
      tempState.qtd = Math.max(1, Math.min(100, parseInt(inputQtd.value, 10) || 1));
      atualizarPreview();
    });
  }

  modalCorpo.querySelector('#modal-btn-qtd-minus')?.addEventListener('click', () => {
    tempState.qtd = Math.max(1, (parseInt(tempState.qtd, 10) || 1) - 1);
    if (inputQtd) inputQtd.value = tempState.qtd;
    atualizarPills();
    atualizarPreview();
  });

  modalCorpo.querySelector('#modal-btn-qtd-plus')?.addEventListener('click', () => {
    tempState.qtd = Math.min(100, (parseInt(tempState.qtd, 10) || 1) + 1);
    if (inputQtd) inputQtd.value = tempState.qtd;
    atualizarPills();
    atualizarPreview();
  });

  modalCorpo.querySelectorAll('.modal-pill-qtd').forEach(p => {
    p.addEventListener('click', () => {
      tempState.qtd = parseInt(p.dataset.val, 10);
      if (inputQtd) inputQtd.value = tempState.qtd;
      atualizarPills();
      atualizarPreview();
    });
  });

  // 3. Steppers e inputs de Mod
  const inputMod = modalCorpo.querySelector('#modal-input-mod');
  if (inputMod) {
    inputMod.addEventListener('input', () => {
      tempState.mod = parseInt(inputMod.value, 10) || 0;
      atualizarPreview();
    });
  }

  modalCorpo.querySelector('#modal-btn-mod-minus')?.addEventListener('click', () => {
    tempState.mod = (parseInt(tempState.mod, 10) || 0) - 1;
    if (inputMod) inputMod.value = tempState.mod;
    atualizarPills();
    atualizarPreview();
  });

  modalCorpo.querySelector('#modal-btn-mod-plus')?.addEventListener('click', () => {
    tempState.mod = (parseInt(tempState.mod, 10) || 0) + 1;
    if (inputMod) inputMod.value = tempState.mod;
    atualizarPills();
    atualizarPreview();
  });

  modalCorpo.querySelectorAll('.modal-pill-mod').forEach(p => {
    p.addEventListener('click', () => {
      tempState.mod = parseInt(p.dataset.val, 10);
      if (inputMod) inputMod.value = tempState.mod;
      atualizarPills();
      atualizarPreview();
    });
  });

  const atualizarPills = () => {
    modalCorpo.querySelectorAll('.modal-pill-qtd').forEach(p => {
      p.classList.toggle('ativo', Number(p.dataset.val) === Number(tempState.qtd));
    });
    modalCorpo.querySelectorAll('.modal-pill-mod').forEach(p => {
      p.classList.toggle('ativo', Number(p.dataset.val) === Number(tempState.mod));
    });
  };

  // 4. Modos
  modalCorpo.querySelectorAll('.modal-modo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tempState.modo = btn.dataset.modalModo;
      modalCorpo.querySelectorAll('.modal-modo-btn').forEach(b => {
        const ativo = b.dataset.modalModo === tempState.modo;
        b.className = `btn btn-sm ${ativo ? 'btn-primary' : 'btn-secondary'} modal-modo-btn`;
        if (b.dataset.modalModo === 'vantagem' && ativo) {
          b.style.background = '#27ae60';
          b.style.borderColor = '#2ecc71';
        } else if (b.dataset.modalModo === 'desvantagem' && ativo) {
          b.style.background = '#c0392b';
          b.style.borderColor = '#e74c3c';
        } else {
          b.style.background = '';
          b.style.borderColor = '';
        }
      });
      atualizarPreview();
    });
  });

  // 5. Salvar Atalho
  document.getElementById('btn-salvar-modal-atalho-confirmar')?.addEventListener('click', async () => {
    const inputNome = modalCorpo.querySelector('#modal-input-nome');
    const inputDesc = modalCorpo.querySelector('#modal-input-desc');

    const nome = inputNome ? inputNome.value.trim() : '';
    if (!nome) {
      toast('Por favor, informe um nome para o atalho.', 'warning');
      inputNome?.focus();
      return;
    }

    tempState.nome = nome;
    tempState.desc = inputDesc ? inputDesc.value.trim() : '';

    fecharModal();
    await salvarAtalho(tempState, idAlvo);
    toast(ehEdicao ? `Atalho "${nome}" atualizado!` : `Atalho "${nome}" criado com sucesso!`, 'success');

    if (_containerRef) {
      _renderizarLayout(_containerRef);
    }
  });
}

function _atualizarTextoBotao(container) {
  const btn = container.querySelector('#btn-executar-rolagem');
  if (btn && !_estaRolando) {
    const spanText = btn.querySelector('.dice-roll-text');
    if (spanText) {
      spanText.textContent = `Rolar ${_montarFormulaTexto(_estadoAtual)}`;
    }
    const iconSpan = btn.querySelector('.dice-roll-icon');
    if (iconSpan) {
      const dadoAtivoInfo = DADOS_DND.find(d => d.tipo === _estadoAtual.tipo) || DADOS_DND[5];
      iconSpan.innerHTML = _gerarSvgDado(_estadoAtual.tipo, dadoAtivoInfo.cor, true, 26);
    }
  }
  const preview = container.querySelector('.dice-formula-preview strong');
  if (preview) {
    preview.textContent = _montarFormulaTexto(_estadoAtual);
  }
}

/**
 * Motor de rolagem de dados
 */
function _executarRolagem(container, config) {
  _estaRolando = true;
  const btnRoll = container.querySelector('#btn-executar-rolagem');
  if (btnRoll) {
    btnRoll.classList.add('rolando');
    const spanText = btnRoll.querySelector('.dice-roll-text');
    if (spanText) spanText.textContent = 'Rolando dados...';
  }

  const dadoInfo = DADOS_DND.find(d => d.tipo === config.tipo) || DADOS_DND[5];
  const faces = dadoInfo.faces;
  const qtd = Math.max(1, Math.min(100, Number(config.qtd) || 1));
  const mod = Number(config.mod) || 0;
  const modo = config.modo || 'normal';

  // Realizar o sorteio
  const rolar1Dado = () => Math.floor(Math.random() * faces) + 1;

  let dadosMantidos = [];
  let dadosDescartados = [];
  let paresAdvDisadv = [];

  if (modo === 'vantagem' || modo === 'desvantagem') {
    for (let i = 0; i < qtd; i++) {
      const r1 = rolar1Dado();
      const r2 = rolar1Dado();
      let mantido, descartado;

      if (modo === 'vantagem') {
        if (r1 >= r2) {
          mantido = r1;
          descartado = r2;
        } else {
          mantido = r2;
          descartado = r1;
        }
      } else {
        if (r1 <= r2) {
          mantido = r1;
          descartado = r2;
        } else {
          mantido = r2;
          descartado = r1;
        }
      }

      dadosMantidos.push(mantido);
      dadosDescartados.push(descartado);
      paresAdvDisadv.push({ r1, r2, mantido, descartado });
    }
  } else {
    for (let i = 0; i < qtd; i++) {
      dadosMantidos.push(rolar1Dado());
    }
  }

  const somaDados = dadosMantidos.reduce((a, b) => a + b, 0);
  const total = somaDados + mod;

  // Verificação de Sucesso Crítico (Nat 20) ou Falha Crítica (Nat 1) em d20
  let statusCritico = null;
  if (config.tipo === 'd20' && qtd === 1) {
    const valorD20 = dadosMantidos[0];
    if (valorD20 === 20) {
      statusCritico = 'nat20';
    } else if (valorD20 === 1) {
      statusCritico = 'nat1';
    }
  }

  const agora = new Date();
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const resultado = {
    id: 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    tipo: config.tipo,
    faces,
    qtd,
    mod,
    modo,
    descricao: config.descricao || '',
    dadosMantidos,
    dadosDescartados,
    paresAdvDisadv,
    somaDados,
    total,
    statusCritico,
    hora: horaFormatada,
    timestamp: Date.now()
  };

  setTimeout(() => {
    salvarNoHistorico(resultado);
    _estaRolando = false;
    _renderizarLayout(container, resultado);

    const resSlot = container.querySelector('#dice-resultado-slot');
    if (resSlot) {
      resSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 260);
}

/**
 * Gera o Card de Resultado em Destaque
 */
function _gerarHtmlResultado(res) {
  const dadoInfo = DADOS_DND.find(d => d.tipo === res.tipo) || DADOS_DND[5];
  
  let classeCritico = '';
  let badgeCritico = '';

  if (res.statusCritico === 'nat20') {
    classeCritico = 'res-nat20';
    badgeCritico = `
      <div class="dice-crit-badge badge-nat20">
        <img src="img/icons/ico-nat20.png" class="crit-icon-img" alt="">
        <span>SUCESSO CRÍTICO (NATURAL 20!)</span>
      </div>
    `;
  } else if (res.statusCritico === 'nat1') {
    classeCritico = 'res-nat1';
    badgeCritico = `
      <div class="dice-crit-badge badge-nat1">
        <img src="img/icons/ico-nat1.png" class="crit-icon-img" alt="">
        <span>FALHA CRÍTICA (NATURAL 1!)</span>
      </div>
    `;
  }

  let detalheDadosHtml = '';
  if (res.modo === 'vantagem' || res.modo === 'desvantagem') {
    detalheDadosHtml = res.paresAdvDisadv.map((par, i) => `
      <div class="dice-adv-pair">
        ${res.qtd > 1 ? `<span class="dice-pair-num">#${i+1}:</span>` : ''}
        <span class="dice-single-chip chip-kept" title="Dado mantido">${par.mantido}</span>
        <span class="dice-single-chip chip-discarded" title="Dado descartado">${par.descartado}</span>
      </div>
    `).join('');
  } else {
    detalheDadosHtml = `
      <div class="dice-chips-wrap">
        ${res.dadosMantidos.map(d => `
          <span class="dice-single-chip ${d === res.faces ? 'chip-max' : (d === 1 ? 'chip-min' : '')}">${d}</span>
        `).join('')}
      </div>
    `;
  }

  const modStr = res.mod !== 0 ? (res.mod > 0 ? `+ ${res.mod}` : `- ${Math.abs(res.mod)}`) : '';
  const formulaStr = _montarFormulaTexto(res);

  return `
    <div class="card dice-result-card ${classeCritico}">
      
      <div class="dice-result-top">
        <div class="dice-result-meta">
          <span class="dice-result-time">🕒 ${res.hora}</span>
          ${res.descricao ? `<span class="dice-result-desc">🏷️ ${escHtml(res.descricao)}</span>` : ''}
        </div>
        <div class="dice-result-formula-tag">${formulaStr}</div>
      </div>

      ${badgeCritico}

      <div class="dice-result-main-block">
        <div class="dice-result-total-box">
          <div class="dice-result-number">${res.total}</div>
          <div class="dice-result-total-label">TOTAL FINAL</div>
        </div>

        <div class="dice-result-breakdown">
          <div class="dice-breakdown-row">
            <span class="dice-breakdown-label">Dados [${res.qtd}${res.tipo}]:</span>
            <div class="dice-breakdown-values">
              ${detalheDadosHtml}
              ${(res.qtd > 1 || res.modo !== 'normal') ? `<span class="dice-subtotal">Soma = <strong>${res.somaDados}</strong></span>` : ''}
            </div>
          </div>

          ${res.mod !== 0 ? `
            <div class="dice-breakdown-row">
              <span class="dice-breakdown-label">Modificador:</span>
              <span class="dice-mod-val"><strong>${res.mod > 0 ? `+${res.mod}` : res.mod}</strong></span>
            </div>
          ` : ''}

          <div class="dice-equation-summary">
            Cálculo: <strong>${res.somaDados}</strong> ${modStr ? `${modStr}` : ''} = <strong style="color: #ffffff; font-size: 1.05rem;">${res.total}</strong>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * Gera o Card individual do Histórico
 */
function _gerarHtmlItemHistorico(item, idx) {
  const formulaStr = _montarFormulaTexto(item);
  let badgeCrit = '';
  if (item.statusCritico === 'nat20') {
    badgeCrit = '<span class="c-badge" style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; border-color: rgba(46, 204, 113, 0.4); font-size: 0.65rem;">Nat 20</span>';
  } else if (item.statusCritico === 'nat1') {
    badgeCrit = '<span class="c-badge" style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; border-color: rgba(231, 76, 60, 0.4); font-size: 0.65rem;">Nat 1</span>';
  }

  let detalheChips = '';
  if (item.modo === 'vantagem' || item.modo === 'desvantagem') {
    detalheChips = item.paresAdvDisadv.map(p => `
      <span class="dice-hist-pair">
        <span class="hist-kept">${p.mantido}</span>
        <span class="hist-disc">${p.descartado}</span>
      </span>
    `).join(' ');
  } else {
    detalheChips = item.dadosMantidos.join(', ');
  }

  return `
    <div class="dice-history-item">
      <div class="dice-history-left">
        <div class="dice-history-top-line">
          <span class="dice-history-index">#${idx + 1}</span>
          <span class="dice-history-time">${item.hora}</span>
          <span class="dice-history-formula">${formulaStr}</span>
          ${badgeCrit}
          ${item.descricao ? `<span class="dice-history-desc">${escHtml(item.descricao)}</span>` : ''}
        </div>
        <div class="dice-history-details">
          Dados: [${detalheChips}] ${item.mod !== 0 ? `| Mod: ${item.mod > 0 ? `+${item.mod}` : item.mod}` : ''}
        </div>
      </div>

      <div class="dice-history-right">
        <div class="dice-history-total ${item.statusCritico === 'nat20' ? 'hist-nat20' : (item.statusCritico === 'nat1' ? 'hist-nat1' : '')}">
          ${item.total}
        </div>
        <button type="button" class="dice-reroll-btn" data-reroll-idx="${idx}" title="Rolar novamente esta mesma fórmula">
          🔄
        </button>
      </div>
    </div>
  `;
}

/**
 * Gera SVGs estilizados para cada tipo de dado poliédrico de D&D
 */
export function gerarSvgDado(tipo, cor, ativo, tamanho = 36) {
  const stroke = ativo ? '#ffffff' : cor;
  const fill = ativo ? cor : 'rgba(255,255,255,0.04)';
  const t = tamanho;
  
  switch (tipo) {
    case 'd4':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 36,34 4,34" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="20" y1="4" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="2 2"/>
          <line x1="4" y1="34" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="36" y1="34" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="31" font-size="9" font-weight="700" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">4</text>
        </svg>
      `;
    case 'd6':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <rect x="7" y="7" width="26" height="26" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
          <circle cx="14" cy="14" r="2.5" fill="${ativo ? '#ffffff' : cor}"/>
          <circle cx="26" cy="14" r="2.5" fill="${ativo ? '#ffffff' : cor}"/>
          <circle cx="14" cy="26" r="2.5" fill="${ativo ? '#ffffff' : cor}"/>
          <circle cx="26" cy="26" r="2.5" fill="${ativo ? '#ffffff' : cor}"/>
          <circle cx="20" cy="20" r="2.5" fill="${ativo ? '#ffffff' : cor}"/>
        </svg>
      `;
    case 'd8':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 35,20 20,37 5,20" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="5" y1="20" x2="35" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="20" y1="3" x2="20" y2="37" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="24" font-size="11" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">8</text>
        </svg>
      `;
    case 'd10':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 36,15 20,37 4,15" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="20" y1="3" x2="20" y2="37" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="4" y1="15" x2="20" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="36" y1="15" x2="20" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="24" font-size="10" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">10</text>
        </svg>
      `;
    case 'd12':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 34,14 29,32 11,32 6,14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="20,11 28,17 25,27 15,27 12,17" fill="none" stroke="${stroke}" stroke-width="1.2"/>
          <text x="20" y="23" font-size="10" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">12</text>
        </svg>
      `;
    case 'd20':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 36,12 36,28 20,37 4,28 4,12" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="20,10 31,23 9,23" fill="none" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="20" y1="3" x2="20" y2="10" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="36" y1="12" x2="31" y2="23" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="4" y1="12" x2="9" y2="23" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="20" y1="37" x2="9" y2="23" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="20" y1="37" x2="31" y2="23" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="21" font-size="10" font-weight="900" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">20</text>
        </svg>
      `;
    case 'd100':
      return `
        <svg width="${t}" height="${t}" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
          <text x="20" y="24" font-size="10" font-weight="900" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">d%</text>
        </svg>
      `;
    default:
      return `<img src="img/icons/ico-home-dados.png" class="dice-roll-icon-img" alt="">`;
  }
}
const _gerarSvgDado = gerarSvgDado;
