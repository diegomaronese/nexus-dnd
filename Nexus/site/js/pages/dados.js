// ============================================================
// Página: Rolador de Dados Virtual D&D 5.5e
// Rolagem completa com Vantagem, Desvantagem, Modificadores,
// Seleção de Quantidade e Histórico das últimas 10 rolagens.
// ============================================================
import { definirTituloHeader, navegar } from '../app.js';
import { toast, escHtml } from '../utils.js';

const STORAGE_KEY_HISTORICO = 'dnd5e_dados_historico';
const STORAGE_KEY_CONFIG = 'dnd5e_dados_config_atual';

// Definição dos dados padrão do D&D
const DADOS_DND = [
  { tipo: 'd4', faces: 4, nome: 'd4', icone: '▲', cor: '#e67e22', desc: '4 faces' },
  { tipo: 'd6', faces: 6, nome: 'd6', icone: '■', cor: '#3498db', desc: '6 faces' },
  { tipo: 'd8', faces: 8, nome: 'd8', icone: '◆', cor: '#9b59b6', desc: '8 faces' },
  { tipo: 'd10', faces: 10, nome: 'd10', icone: '⬟', cor: '#1abc9c', desc: '10 faces' },
  { tipo: 'd12', faces: 12, nome: 'd12', icone: '⬢', cor: '#e74c3c', desc: '12 faces' },
  { tipo: 'd20', faces: 20, nome: 'd20', icone: '⬡', cor: '#f39c12', desc: '20 faces' },
  { tipo: 'd100', faces: 100, nome: 'd100', icone: '%', cor: '#ec1c24', desc: 'Percentil' },
];

// Presets de rolagens comuns de D&D
const PRESETS_DND = [
  { nome: 'Teste d20 Padrão', tipo: 'd20', qtd: 1, mod: 0, modo: 'normal', desc: 'Teste de Atributo / Perícia' },
  { nome: 'Ataque d20 (Vantagem)', tipo: 'd20', qtd: 1, mod: 4, modo: 'vantagem', desc: 'Jogada de Ataque c/ Vantagem' },
  { nome: 'Espada Longa (1d8+3)', tipo: 'd8', qtd: 1, mod: 3, modo: 'normal', desc: 'Dano Versátil / 1 Mão' },
  { nome: 'Espada Grande (2d6+3)', tipo: 'd6', qtd: 2, mod: 3, modo: 'normal', desc: 'Dano de 2 Mãos' },
  { nome: 'Bola de Fogo (8d6)', tipo: 'd6', qtd: 8, mod: 0, modo: 'normal', desc: 'Magia de 3º Círculo' },
  { nome: 'Curar Ferimentos (2d8+3)', tipo: 'd8', qtd: 2, mod: 3, modo: 'normal', desc: 'Cura Nível 2' },
  { nome: 'Tabela de Tesouro (1d100)', tipo: 'd100', qtd: 1, mod: 0, modo: 'normal', desc: 'Rolagem Percentil' }
];

let _containerRef = null;
let _estadoAtual = _carregarConfigSalva();
let _estaRolando = false;

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

/**
 * Ponto de entrada da página de Rolagem de Dados
 */
export function renderDados(container) {
  _containerRef = container;
  definirTituloHeader('Dados');
  _renderizarLayout(container);
}

function _renderizarLayout(container, ultimoResultado = null) {
  const historico = carregarHistorico();
  const dadoAtivoInfo = DADOS_DND.find(d => d.tipo === _estadoAtual.tipo) || DADOS_DND[5];

  container.innerHTML = `
    <div class="dice-page-container">
      
      <!-- Cabeçalho da Página -->
      <div class="dice-hero">
        <div>
          <div class="dice-hero-title">
            <span>🎲 Mesa de Dados - D&D 5.5e</span>
          </div>
          <div class="dice-hero-desc">
            Role qualquer combinação de dados das regras de D&D com vantagens, desvantagens, modificadores e histórico em tempo real.
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
        <div class="dice-section-label">
          <span>Configuração da Rolagem</span>
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
              ${[1, 2, 3, 4, 6, 8, 10].map(n => `
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
              ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 10].map(m => `
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
              <span class="dice-mode-icon">⚪</span>
              <div class="dice-mode-info">
                <span class="dice-mode-title">Normal</span>
                <span class="dice-mode-desc">1 rolagem padrão</span>
              </div>
            </button>
            <button type="button" class="dice-mode-btn mode-vantagem ${_estadoAtual.modo === 'vantagem' ? 'ativo' : ''}" data-modo="vantagem">
              <span class="dice-mode-icon">🟢</span>
              <div class="dice-mode-info">
                <span class="dice-mode-title">Vantagem</span>
                <span class="dice-mode-desc">Rola 2x, pega o maior</span>
              </div>
            </button>
            <button type="button" class="dice-mode-btn mode-desvantagem ${_estadoAtual.modo === 'desvantagem' ? 'ativo' : ''}" data-modo="desvantagem">
              <span class="dice-mode-icon">🔴</span>
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
        <div class="dice-action-wrap">
          <button type="button" id="btn-executar-rolagem" class="dice-roll-main-btn" ${_estaRolando ? 'disabled' : ''}>
            <span class="dice-roll-icon">🎲</span>
            <span class="dice-roll-text">
              ${_estaRolando ? 'Rolando dados...' : `Rolar ${_montarFormulaTexto(_estadoAtual)}`}
            </span>
          </button>
        </div>

      </div>

      <!-- SEÇÃO 3: Exibição do Resultado Atual (se houver) -->
      <div id="dice-resultado-slot">
        ${ultimoResultado ? _gerarHtmlResultado(ultimoResultado) : ''}
      </div>

      <!-- SEÇÃO 4: Presets Rápidos de D&D -->
      <div class="card dice-card-section">
        <div class="dice-section-label">
          <span>Atalhos Rápidos de D&D</span>
          <span style="font-size: 0.75rem; color: var(--text-muted)">Clique para rolar instantaneamente</span>
        </div>
        <div class="dice-presets-grid">
          ${PRESETS_DND.map((p, idx) => `
            <button type="button" class="dice-preset-btn" data-preset-idx="${idx}">
              <div class="dice-preset-title">${p.nome}</div>
              <div class="dice-preset-formula">${p.qtd}${p.tipo}${p.mod ? (p.mod > 0 ? `+${p.mod}` : p.mod) : ''} ${p.modo !== 'normal' ? `(${p.modo})` : ''}</div>
              <div class="dice-preset-desc">${p.desc}</div>
            </button>
          `).join('')}
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
              🗑️ Limpar
            </button>
          ` : ''}
        </div>

        <div class="dice-history-list" id="dice-history-container">
          ${historico.length === 0 ? `
            <div class="dice-history-empty">
              <span style="font-size: 2rem; opacity: 0.5;">🎲</span>
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

  // 6. Botão Executar Rolagem
  container.querySelector('#btn-executar-rolagem')?.addEventListener('click', () => {
    if (_estaRolando) return;
    _executarRolagem(container, _estadoAtual);
  });

  // 7. Atalhos / Presets Rápidos
  container.querySelectorAll('[data-preset-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.presetIdx, 10);
      const preset = PRESETS_DND[idx];
      if (preset) {
        _estadoAtual = {
          tipo: preset.tipo,
          qtd: preset.qtd,
          mod: preset.mod,
          modo: preset.modo,
          descricao: preset.desc
        };
        _salvarConfigAtual();
        _executarRolagem(container, _estadoAtual);
      }
    });
  });

  // 8. Limpar Histórico
  container.querySelector('#btn-limpar-historico')?.addEventListener('click', () => {
    limparHistorico();
    toast('Histórico de rolagens limpo', 'info');
    _renderizarLayout(container);
  });

  // 9. Re-rolar item do histórico
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

function _atualizarTextoBotao(container) {
  const btn = container.querySelector('#btn-executar-rolagem');
  if (btn && !_estaRolando) {
    const spanText = btn.querySelector('.dice-roll-text');
    if (spanText) {
      spanText.textContent = `Rolar ${_montarFormulaTexto(_estadoAtual)}`;
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

  // Realizar o sorteio criptográfico ou pseudo-aleatório seguro
  const rolar1Dado = () => Math.floor(Math.random() * faces) + 1;

  let dadosMantidos = [];
  let dadosDescartados = [];
  let paresAdvDisadv = [];

  if (modo === 'vantagem' || modo === 'desvantagem') {
    // Para cada dado da quantidade, rola 2 vezes
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
        // Desvantagem: menor
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
    // Modo Normal
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

  // Simular breve animação de rotação/flip de dados (250ms)
  setTimeout(() => {
    salvarNoHistorico(resultado);
    _estaRolando = false;
    _renderizarLayout(container, resultado);

    // Rolar suavemente para o resultado se a tela for pequena
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
        <span>🎯 SUCEsSO CRÍTICO (NATURAL 20!)</span>
      </div>
    `;
  } else if (res.statusCritico === 'nat1') {
    classeCritico = 'res-nat1';
    badgeCritico = `
      <div class="dice-crit-badge badge-nat1">
        <span>💀 FALHA CRÍTICA (NATURAL 1!)</span>
      </div>
    `;
  }

  // Montagem da quebra visual de dados
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
function _gerarSvgDado(tipo, cor, ativo) {
  const stroke = ativo ? '#ffffff' : cor;
  const fill = ativo ? cor : 'rgba(255,255,255,0.04)';
  
  switch (tipo) {
    case 'd4':
      return `
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 36,34 4,34" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="20" y1="4" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="2 2"/>
          <line x1="4" y1="34" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="36" y1="34" x2="20" y2="24" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="31" font-size="9" font-weight="700" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">4</text>
        </svg>
      `;
    case 'd6':
      return `
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
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
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 35,20 20,37 5,20" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="5" y1="20" x2="35" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="20" y1="3" x2="20" y2="37" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="24" font-size="11" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">8</text>
        </svg>
      `;
    case 'd10':
      return `
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 36,15 20,37 4,15" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="20" y1="3" x2="20" y2="37" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="4" y1="15" x2="20" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="36" y1="15" x2="20" y2="20" stroke="${stroke}" stroke-width="1.5"/>
          <text x="20" y="24" font-size="10" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">10</text>
        </svg>
      `;
    case 'd12':
      return `
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 34,14 29,32 11,32 6,14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="20,11 28,17 25,27 15,27 12,17" fill="none" stroke="${stroke}" stroke-width="1.2"/>
          <text x="20" y="23" font-size="10" font-weight="800" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">12</text>
        </svg>
      `;
    case 'd20':
      return `
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
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
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
          <text x="20" y="24" font-size="10" font-weight="900" fill="${ativo ? '#ffffff' : cor}" text-anchor="middle">d%</text>
        </svg>
      `;
    default:
      return `<span style="font-size: 1.5rem;">🎲</span>`;
  }
}
