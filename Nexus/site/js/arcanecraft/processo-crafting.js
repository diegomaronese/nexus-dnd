// ============================================================
// Arcane Craft - Wizard de Criação de Itens (Crafting)
// Baseado nas Regras da Parte 1 e Modelo da Ficha de Criação (Crafting Sheet)
// ============================================================
import { escHtml, toast } from '../utils.js';
import { listarPersonagens, getPersonagem, salvarPersonagem } from '../store.js';
import {
  GRAUS_MATERIAL,
  POSTOS_ASSOCIACAO,
  METAIS_MATERIAIS_ESPECIAIS,
  APENDICE1_MATERIAIS,
  obterMateriaisApendice1,
  salvarFichaProcesso
} from './arcanecraft-dados.js';
import { tornarBarraDeslizavel } from './arcanecraft-ui.js';
import {
  calcularEsforcoAlvo,
  inicializarSessaoEsforco,
  rolarCicloTrabalho,
  descansarSessao,
  autoResolverCiclos,
  renderizarArenaEsforcoHTML,
  getInfoExaustao
} from './motor-esforco.js';
import { imprimirFichaOficial } from './impressao-arcanecraft.js';

// Predefinições de itens mundanos para carregamento rápido (opcional para o usuário)
export const MODELOS_BASE_CRAFTING = [
  {
    id: 'espada_longa',
    nome: 'Espada Longa',
    categoria: 'Arma Marcial Corpo a Corpo',
    especializacao: 'Ferreiro (Blacksmith)',
    ferramenta: 'Ferramentas de Ferreiro',
    cdBase: 14,
    tempoHoras: 16,
    custoBasePo: 15,
    materialPrimario: 'Lingotes de Ferro Nobre',
    qtdPrimaria: '4 barras (2 kg)',
    grauPrimario: 'media',
    materialSecundario: 'Tiras de Couro Curtido & Rebites',
    qtdSecundaria: '1 conjunto',
    grauSecundario: 'media',
    propriedades: 'Dano 1d8 cortante (Versátil 1d10)'
  },
  {
    id: 'armadura_placas',
    nome: 'Armadura de Placas Completa (Full Plate)',
    categoria: 'Armadura Pesada',
    especializacao: 'Ferreiro (Blacksmith)',
    ferramenta: 'Ferramentas de Ferreiro',
    cdBase: 18,
    tempoHoras: 120, // 15 dias de 8h
    custoBasePo: 1500,
    materialPrimario: 'Placas Forjadas de Aço Temperado',
    qtdPrimaria: '12 placas (30 kg)',
    grauPrimario: 'alta',
    materialSecundario: 'Cotas de Malha de Forro & Correias de Couro',
    qtdSecundaria: '1 conjunto completo',
    grauSecundario: 'media',
    propriedades: 'CA 18, Força 15 necessária, Desvantagem em Furtividade'
  },
  {
    id: 'cota_malha',
    nome: 'Cota de Malha (Chain Mail)',
    categoria: 'Armadura Pesada',
    especializacao: 'Ferreiro (Blacksmith)',
    ferramenta: 'Ferramentas de Ferreiro',
    cdBase: 15,
    tempoHoras: 48,
    custoBasePo: 75,
    materialPrimario: 'Anéis de Aço Interligados',
    qtdPrimaria: '8.000 elos (25 kg)',
    grauPrimario: 'media',
    materialSecundario: 'Túnica Acolchoada de Forro',
    qtdSecundaria: '1 unidade',
    grauSecundario: 'baixa',
    propriedades: 'CA 16, Força 13 necessária, Desvantagem em Furtividade'
  },
  {
    id: 'gibao_couro',
    nome: 'Gibão de Couro Batido (Studded Leather)',
    categoria: 'Armadura Leve',
    especializacao: 'Coureiro (Leatherworker)',
    ferramenta: 'Ferramentas de Coureiro',
    cdBase: 13,
    tempoHoras: 24,
    custoBasePo: 45,
    materialPrimario: 'Couro Espesso Maciço Curtido',
    qtdPrimaria: '3 peles (6 kg)',
    grauPrimario: 'media',
    materialSecundario: 'Rebites de Metal & Rebites de Latão',
    qtdSecundaria: '1 conjunto de reforço',
    grauSecundario: 'media',
    propriedades: 'CA 12 + Modificador de Destreza, sem penalidade de furtividade'
  },
  {
    id: 'arco_longo',
    nome: 'Arco Longo de Precisão',
    categoria: 'Arma Marcial À Distância',
    especializacao: 'Marceneiro (Woodworker)',
    ferramenta: 'Ferramentas de Carpinteiro / Entalhador',
    cdBase: 14,
    tempoHoras: 20,
    custoBasePo: 50,
    materialPrimario: 'Madeira Flexível de Carvalho ou Teixo',
    qtdPrimaria: '1 viga selecionada (1 kg)',
    grauPrimario: 'alta',
    materialSecundario: 'Corda Trançada de Tendão Animal',
    qtdSecundaria: '1 corda de grande tração',
    grauSecundario: 'media',
    propriedades: 'Dano 1d8 perfurante, Alcance 150/600 pés, Pesada, Duas Mãos'
  },
  {
    id: 'escudo_aco',
    nome: 'Escudo de Aço Polido',
    categoria: 'Escudo',
    especializacao: 'Ferreiro (Blacksmith)',
    ferramenta: 'Ferramentas de Ferreiro',
    cdBase: 12,
    tempoHoras: 12,
    custoBasePo: 10,
    materialPrimario: 'Chapa de Aço Conformada',
    qtdPrimaria: '1 chapa reforçada (3 kg)',
    grauPrimario: 'media',
    materialSecundario: 'Braçadeira e Empunhadura de Couro',
    qtdSecundaria: '1 conjunto',
    grauSecundario: 'baixa',
    propriedades: '+2 na Classe de Armadura'
  }
];

// Estado padrão do Wizard de Crafting
export function criarEstadoInicialCrafting() {
  return {
    passoAtual: 1, // 1 a 7
    // Passo 1: Artesão & Especialização
    personagemId: '',
    nomeArtesao: 'Artesão Autônomo',
    especializacao: 'Ferreiro (Blacksmith)',
    ferramenta: 'Ferramentas de Ferreiro',
    posto: 'aprendiz',
    bonusAtributoProficiencia: 5,
    // Passo 2: Especificações do Item
    categoriaItem: 'Arma Marcial Corpo a Corpo',
    nomeItem: 'Espada Longa Forjada',
    cdBase: 14,
    tempoHoras: 16,
    custoEstimadoPo: 15,
    propriedadesItem: 'Dano 1d8 cortante (Versátil 1d10)',
    pesoItem: 1.5,
    // Passo 3: Materiais e Graus
    materialPrimario: 'Lingotes de Ferro Nobre',
    qtdPrimaria: '4 barras (2 kg)',
    grauPrimario: 'media',
    materialSecundario: 'Tiras de Couro Curtido',
    qtdSecundaria: '1 conjunto de punho',
    grauSecundario: 'media',
    materialEspecial: 'nenhum', // 'nenhum', 'adamantite', 'mitral', 'prata', 'ferro_frio', 'madeira_ferro'
    // Passo 4: Oficina & Assistentes
    tipoInstalacao: 'padrao', // 'padrao' (0), 'improvisada' (+2), 'mestre' (-1)
    qualidadeFerramentas: 'padrao', // 'padrao' (0), 'gasta' (+1), 'mestre' (-1)
    assistentesQtd: 0,
    horasPorDia: 8,
    // Passo 5 e 6: Execução e Rolagem
    modoRolagem: 'normal', // 'normal', 'vantagem', 'desvantagem'
    modificadorExtraManual: 0,
    sessaoEsforco: null, // Sessão de múltiplas rolagens e exaustão D&D 5.5e
    ultimoResultado: null, // Resumo final consolidado
    // Ficha salva
    fichaGerada: null
  };
}

export function renderWizardCrafting(container, state, onUpdateState, onIrParaBanco) {
  const passo = state.passoAtual || 1;

  // Cálculos dinâmicos em tempo real
  const modGrauPrimario = GRAUS_MATERIAL[state.grauPrimario]?.modificadorCd ?? 0;
  const modGrauSecundario = GRAUS_MATERIAL[state.grauSecundario]?.modificadorCd ?? 0;
  // Menor grau entre os ingredientes determina a qualidade final e o pior modificador (maior dificuldade)
  const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
  const menorGrau = ordemGraus.indexOf(state.grauPrimario) <= ordemGraus.indexOf(state.grauSecundario)
    ? state.grauPrimario
    : state.grauSecundario;
  const modMenorGrau = GRAUS_MATERIAL[menorGrau]?.modificadorCd ?? 0;

  let modInstalacao = 0;
  if (state.tipoInstalacao === 'improvisada') modInstalacao = 2;
  if (state.tipoInstalacao === 'mestre') modInstalacao = -1;

  let modFerramentas = 0;
  if (state.qualidadeFerramentas === 'gasta') modFerramentas = 1;
  if (state.qualidadeFerramentas === 'mestre') modFerramentas = -1;

  let modEspecialCd = 0;
  let multEspecial = 1;
  if (state.materialEspecial && state.materialEspecial !== 'nenhum') {
    const todosMats = [
      ...APENDICE1_MATERIAIS.metais,
      ...APENDICE1_MATERIAIS.gemas,
      ...APENDICE1_MATERIAIS.fibras_madeiras,
      ...APENDICE1_MATERIAIS.criaturas_exoticas
    ];
    const matEncontrado = todosMats.find(m => m.id === state.materialEspecial);
    if (matEncontrado) {
      modEspecialCd = matEncontrado.cdMod || 0;
      multEspecial = matEncontrado.tier ? Math.max(1, matEncontrado.tier) : 1;
    } else {
      if (state.materialEspecial === 'adamantite') { modEspecialCd = 2; multEspecial = 5; }
      if (state.materialEspecial === 'mitral') { modEspecialCd = 1; multEspecial = 4; }
      if (state.materialEspecial === 'prata') { modEspecialCd = 0; multEspecial = 2; }
    }
  }

  const cdFinalCalculada = Math.max(8, Number(state.cdBase) + modMenorGrau + modInstalacao + modFerramentas + modEspecialCd);

  // Redução de tempo por assistentes (cada assistente reduz 15%, até max 60%)
  const redAssist = Math.min(0.6, state.assistentesQtd * 0.15);
  let tempoHorasEfetivo = Math.max(2, Math.round(state.tempoHoras * (1 - redAssist)));
  let diasTrabalho = Math.ceil(tempoHorasEfetivo / (state.horasPorDia || 8));
  if (state.sessaoEsforco?.horasDecorridas > 0) {
    tempoHorasEfetivo = state.sessaoEsforco.horasDecorridas;
    diasTrabalho = state.sessaoEsforco.diasDecorridos;
  }

  const custoFinalPo = Math.round(Number(state.custoEstimadoPo) * multEspecial * (GRAUS_MATERIAL[menorGrau]?.multiplicadorPreco ?? 1));

  const calc = {
    cdFinalCalculada,
    menorGrau,
    tempoHorasEfetivo,
    diasTrabalho,
    custoFinalPo
  };

  container.innerHTML = `
    <div class="ac-wizard-container">

      <!-- CABEÇALHO DO WIZARD -->
      <div class="ac-wizard-header">
        <div class="ac-wizard-title-row">
          <div class="ac-wizard-title">
            <span class="ac-wizard-icon">⚒️</span>
            <div>
              <h3>Processo de Criação de Itens (Crafting)</h3>
              <p class="ac-wizard-subtitle">Regras da Parte 1 • Metalurgia, Armaduras, Couro, Marcenaria e Joalheria</p>
            </div>
          </div>
          <div class="ac-wizard-badge-posto">
            Ficha de Criação • Etapa ${passo} de 7
          </div>
        </div>

        <!-- PROGRESS BAR / PASSOS COM NAVEGAÇÃO DESLIZÁVEL -->
        <div class="ac-steps-tracker-wrapper">
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-craft-step-prev" type="button" aria-label="Passo anterior">‹</button>
          <div class="ac-steps-tracker" id="ac-craft-steps-tracker" role="tablist">
            ${[
              { num: 1, label: 'Artesão', icon: '👤' },
              { num: 2, label: 'Item & CD', icon: '🛡️' },
              { num: 3, label: 'Materiais & Graus', icon: '💎' },
              { num: 4, label: 'Oficina & Tempo', icon: '🛠️' },
              { num: 5, label: 'Revisão da Ficha', icon: '📋' },
              { num: 6, label: 'Teste de Criação', icon: '🎲' },
              { num: 7, label: 'Ficha Concluída', icon: '📜' }
            ].map(s => `
              <div class="ac-step-node ${s.num === passo ? 'ativo' : ''} ${s.num < passo ? 'concluido' : ''}"
                   onclick="window._acMudarPassoCrafting(${s.num})" title="Ir para Passo ${s.num}: ${s.label}">
                <div class="ac-step-circle">${s.num < passo ? '✓' : s.icon}</div>
                <span class="ac-step-label">${s.label}</span>
              </div>
            `).join('')}
          </div>
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-craft-step-next" type="button" aria-label="Próximo passo">›</button>
        </div>
      </div>

      <!-- RESUMO RÁPIDO AO VIVO NO MOBILE -->
      <div class="ac-wizard-mobile-summary" aria-label="Resumo rápido da criação">
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CD FINAL</span>
          <span class="ac-mob-summary-val gold">${cdFinalCalculada}</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">QUALIDADE</span>
          <span class="ac-mob-summary-val" style="color: ${GRAUS_MATERIAL[menorGrau]?.cor || '#c8a051'};">
            ${GRAUS_MATERIAL[menorGrau]?.nome || 'Média'}
          </span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">TEMPO</span>
          <span class="ac-mob-summary-val">${diasTrabalho}d (${tempoHorasEfetivo}h)</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CUSTO</span>
          <span class="ac-mob-summary-val">${custoFinalPo} PO</span>
        </div>
      </div>

      <!-- PAINEL CENTRAL DIVIDIDO: CONTEÚDO DO PASSO + BARRA LATERAL DE RESUMO DA FICHA -->
      <div class="ac-wizard-body-grid">
        
        <!-- COLUNA PRINCIPAL: FORMULÁRIO DO PASSO -->
        <div class="ac-wizard-content-card">
          ${_renderConteudoPasso(passo, state, {
            cdFinalCalculada,
            menorGrau,
            tempoHorasEfetivo,
            diasTrabalho,
            custoFinalPo
          })}

          <!-- BOTÕES DE NAVEGAÇÃO ENTRE PASSOS -->
          <div class="ac-wizard-nav-footer">
            <button class="btn btn-outline" id="ac-craft-btn-voltar" ${passo === 1 ? 'disabled style="opacity:0.4;"' : ''}>
              ← Voltar Passo
            </button>
            <div class="ac-nav-center-info">
              Passo ${passo} de 7 • ${passo === 7 ? 'Ficha Final de Criação' : 'Condução Guiada'}
            </div>
            ${passo < 6 ? `
              <button class="btn btn-primary" id="ac-craft-btn-avancar">
                Avançar Passo →
              </button>
            ` : passo === 6 ? `
              <button class="btn btn-primary" id="ac-craft-btn-avancar-ficha" ${!state.ultimoResultado ? 'disabled style="opacity:0.5;" title="Execute a rolagem do teste para avançar"' : ''}>
                Ver Ficha do Processo →
              </button>
            ` : `
              <button class="btn btn-primary" id="ac-craft-btn-novo-processo">
                Iniciar Novo Processo ⚒️
              </button>
            `}
          </div>
        </div>

        <!-- COLUNA LATERAL: ESPELHO DINÂMICO DA FICHA DE CRIAÇÃO (CRAFTING SHEET PREVIEW) -->
        <div class="ac-sheet-preview-sidebar">
          <div class="ac-sheet-mini-card">
            <div class="ac-sheet-mini-header">
              <span class="ac-sheet-mini-tag">Ficha de Processo</span>
              <h4 class="ac-sheet-mini-title">${escHtml(state.nomeItem || 'Item Sem Nome')}</h4>
            </div>

            <div class="ac-sheet-mini-metrics">
              <div class="ac-metric-box">
                <span class="ac-metric-label">CD FINAL</span>
                <span class="ac-metric-val gold">${cdFinalCalculada}</span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">QUALIDADE FINAL</span>
                <span class="ac-metric-val" style="color: ${GRAUS_MATERIAL[menorGrau]?.cor || '#c8a051'}; font-size: 0.95rem;">
                  ${GRAUS_MATERIAL[menorGrau]?.nome || 'Média'}
                </span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">TEMPO TOTAL</span>
                <span class="ac-metric-val">${tempoHorasEfetivo}h <small>(${diasTrabalho}d)</small></span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">CUSTO TOTAL</span>
                <span class="ac-metric-val">${custoFinalPo} po</span>
              </div>
            </div>

            <div class="ac-sheet-mini-list">
              <div class="ac-mini-row">
                <span class="k">Artesão:</span>
                <span class="v">${escHtml(state.nomeArtesao)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Especialização:</span>
                <span class="v">${escHtml(state.especializacao)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Ferramenta:</span>
                <span class="v">${escHtml(state.ferramenta)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Bônus de Teste:</span>
                <span class="v text-highlight">+${state.bonusAtributoProficiencia}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Material Base:</span>
                <span class="v">${escHtml(state.materialPrimario)} (${GRAUS_MATERIAL[state.grauPrimario]?.nome})</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Material Reforço:</span>
                <span class="v">${escHtml(state.materialSecundario)} (${GRAUS_MATERIAL[state.grauSecundario]?.nome})</span>
              </div>
              ${state.materialEspecial !== 'nenhum' ? `
                <div class="ac-mini-row highlight">
                  <span class="k">Material Especial:</span>
                  <span class="v" style="color:#f59e0b; font-weight:700;">${escHtml(state.materialEspecial.toUpperCase())}</span>
                </div>
              ` : ''}
              <div class="ac-mini-row">
                <span class="k">Oficina:</span>
                <span class="v">${state.tipoInstalacao === 'mestre' ? 'Oficina Mestre (-1 CD)' : state.tipoInstalacao === 'improvisada' ? 'Improvisada (+2 CD)' : 'Padrão (0)'}</span>
              </div>
            </div>

            <div class="ac-sheet-mini-actions">
              <button class="btn btn-sm btn-outline w-100" id="ac-craft-btn-ver-materiais">
                📖 Consultar Banco de Materiais
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  _setupEventosCrafting(container, state, onUpdateState, onIrParaBanco, calc);
}

function _renderConteudoPasso(passo, state, calc) {
  switch (passo) {
    case 1:
      return _renderPasso1(state);
    case 2:
      return _renderPasso2(state);
    case 3:
      return _renderPasso3(state);
    case 4:
      return _renderPasso4(state, calc);
    case 5:
      return _renderPasso5(state, calc);
    case 6:
      return _renderPasso6(state, calc);
    case 7:
      return _renderPasso7(state, calc);
    default:
      return '';
  }
}

// ==========================================
// PASSO 1: ARTESÃO & ESPECIALIZAÇÃO
// ==========================================
function _renderPasso1(state) {
  const chars = listarPersonagens();
  const especializacoes = [
    { id: 'Ferreiro (Blacksmith)', icon: '⚒️', ferramenta: 'Ferramentas de Ferreiro', desc: 'Armas de metal, armaduras pesadas e de malha, lâminas e escudos de aço.' },
    { id: 'Coureiro (Leatherworker)', icon: '🥋', ferramenta: 'Ferramentas de Coureiro', desc: 'Armaduras leves e médias de couro batido, cintos, aljavas e mochilas.' },
    { id: 'Marceneiro (Woodworker)', icon: '🪓', ferramenta: 'Ferramentas de Carpinteiro / Entalhador', desc: 'Arcos, bestas, hastes de armas de haste, escudos de madeira e cajados.' },
    { id: 'Alfaiate (Tailor)', icon: '🧵', ferramenta: 'Ferramentas de Tecelão', desc: 'Mantos de proteção, roupas nobres de alta costura, vestes de conjurador e forros.' },
    { id: 'Joalheiro (Jeweler)', icon: '💍', ferramenta: 'Ferramentas de Joalheiro', desc: 'Anéis, braceletes, engastes de pedras preciosas, coroas e relicários.' },
    { id: 'Engenhoqueiro (Tinkerer)', icon: '⚙️', ferramenta: 'Ferramentas de Engenhoqueiro', desc: 'Engrenagens, molas, relógios, armadilhas desmontáveis e mecanismos arcanos.' }
  ];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 1: Identificação do Artesão & Associação</h4>
        <span class="ac-step-pill">Regra: Associação & Ferramentas</span>
      </div>
      <p class="ac-step-desc">
        No sistema de criação, cada processo é assinado por um artesão capacitado com proficiência nas ferramentas específicas do ofício. Selecione um personagem existente na sua conta para carregar seus dados ou preencha como artesão autônomo.
      </p>

      <!-- VINCULAR PERSONAGEM EXISTENTE -->
      <div class="ac-form-group">
        <label class="ac-label">Vincular a um Personagem da Campanha:</label>
        <select class="ac-select" id="ac-craft-sel-personagem">
          <option value="">-- Usar Artesão Autônomo / Personalizado --</option>
          ${chars.map(c => `
            <option value="${c.id}" ${state.personagemId === c.id ? 'selected' : ''}>
              ${escHtml(c.nome)} (Nível ${c.nivel || 1} • ${escHtml(c.classe || 'Aventureiro')})
            </option>
          `).join('')}
        </select>
        <small class="ac-hint">Ao selecionar seu personagem, o item forjado poderá ser enviado diretamente para a ficha dele com um clique.</small>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Nome do Artesão:</label>
          <input type="text" class="ac-input" id="ac-craft-input-artesao" value="${escHtml(state.nomeArtesao)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Posto na Associação (Guilda):</label>
          <select class="ac-select" id="ac-craft-sel-posto">
            ${POSTOS_ASSOCIACAO.map(p => `
              <option value="${p.id}" ${state.posto === p.id ? 'selected' : ''}>
                ${p.nome} (${p.nomeEn}) - Níveis ${p.nivelSugerido}
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- ESPECIALIZAÇÕES DO OFÍCIO -->
      <div class="ac-form-group">
        <label class="ac-label">Especialização do Ofício:</label>
        <div class="ac-cards-choice-grid">
          ${especializacoes.map(esp => `
            <div class="ac-choice-card ${state.especializacao === esp.id ? 'selecionado' : ''}"
                 onclick="window._acCraftEscolherEspec('${esp.id}', '${esp.ferramenta}')">
              <div class="ac-choice-top">
                <span class="ac-choice-icon">${esp.icon}</span>
                <span class="ac-choice-name">${esp.id}</span>
              </div>
              <p class="ac-choice-desc">${esp.desc}</p>
              <span class="ac-choice-tag">${esp.ferramenta}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Ferramenta Exigida:</label>
          <input type="text" class="ac-input" id="ac-craft-input-ferramenta" value="${escHtml(state.ferramenta)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Bônus Total de Criação (Atributo + Proficiência):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarBonus(-1)">-</button>
            <input type="number" class="ac-input text-center" id="ac-craft-input-bonus" value="${state.bonusAtributoProficiencia}" min="-2" max="20">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarBonus(1)">+</button>
          </div>
          <small class="ac-hint">Geralmente Força ou Destreza + Bônus de Proficiência da ferramenta.</small>
        </div>
      </div>

    </div>
  `;
}

// ==========================================
// PASSO 2: ESPECIFICAÇÕES DO ITEM & CD BASE
// ==========================================
function _renderPasso2(state) {
  const categorias = [
    'Arma Marcial Corpo a Corpo',
    'Arma Simples Corpo a Corpo',
    'Arma Marcial À Distância',
    'Arma Simples À Distância',
    'Armadura Pesada',
    'Armadura Média',
    'Armadura Leve',
    'Escudo',
    'Vestimenta / Capa / Túnica',
    'Joia / Adorno de Metal Nobre',
    'Mecanismo de Engenhoqueiro',
    'Equipamento / Ferramenta de Aventura'
  ];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 2: Definição do Item & Características</h4>
        <span class="ac-step-pill">Regra: Categoria & Dificuldade</span>
      </div>
      <p class="ac-step-desc">
        Defina o que você está criando. O tipo e a complexidade do objeto determinam a Dificuldade Base (CD Base) e o tempo de trabalho necessário conforme a tabela de ofício.
      </p>

      <!-- CARREGAR MODELO PRÉ-DEFINIDO (FACILITADOR) -->
      <div class="ac-quick-load-box">
        <div class="ac-quick-load-label">
          <span>⚡ Ponto de Partida Rápido (Opcional):</span>
          <small class="text-muted">Carrega os parâmetros base e permite editar livremente</small>
        </div>
        <div class="ac-quick-pills-row">
          ${MODELOS_BASE_CRAFTING.map(m => `
            <button class="ac-quick-pill" onclick="window._acCraftCarregarModelo('${m.id}')">
              ${m.nome}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Categoria do Item:</label>
          <select class="ac-select" id="ac-craft-sel-categoria">
            ${categorias.map(cat => `
              <option value="${cat}" ${state.categoriaItem === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Nome do Item Projetado:</label>
          <input type="text" class="ac-input" id="ac-craft-input-nome" value="${escHtml(state.nomeItem)}">
        </div>
      </div>

      <div class="ac-form-grid-3">
        <div class="ac-form-group">
          <label class="ac-label">Dificuldade Base (CD Base):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarCdBase(-1)">-</button>
            <input type="number" class="ac-input text-center font-bold" id="ac-craft-input-cdbase" value="${state.cdBase}" min="8" max="30">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarCdBase(1)">+</button>
          </div>
          <small class="ac-hint">Itens simples: 10-12 • Marciais/Escudos: 13-15 • Placas/Complexos: 16-20</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Tempo de Trabalho (Horas):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarTempo(-8)">-8h</button>
            <input type="number" class="ac-input text-center" id="ac-craft-input-tempo" value="${state.tempoHoras}" min="2" max="500">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarTempo(8)">+8h</button>
          </div>
          <small class="ac-hint">8 horas = 1 dia de dedicação de um artesão.</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Peso Estimado (kg):</label>
          <input type="number" step="0.5" class="ac-input" id="ac-craft-input-peso" value="${state.pesoItem}">
          <small class="ac-hint">Peso do item concluído.</small>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Propriedades / Efeitos Mecânicos do Item:</label>
        <textarea class="ac-textarea" rows="2" id="ac-craft-input-props">${escHtml(state.propriedadesItem)}</textarea>
      </div>

    </div>
  `;
}

// ==========================================
// PASSO 3: MATERIAIS, QUANTIDADE & GRAUS
// ==========================================
function _renderPasso3(state) {
  const graus = Object.values(GRAUS_MATERIAL);

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 3: Materiais, Quantidade & Graus de Qualidade</h4>
        <span class="ac-step-pill">Regra Fundamental dos Graus</span>
      </div>
      <p class="ac-step-desc">
        A qualidade dos materiais é o coração do sistema: <strong>o menor grau de ingrediente usado determina a qualidade final do item forjado</strong> e aplica um modificador na CD de criação (materiais refinados facilitam o trabalho, enquanto materiais impuros impõem penalidades).
      </p>

      <!-- TABELA EXPLICATIVA DOS GRAUS -->
      <div class="ac-graus-banner-row">
        ${graus.map(g => `
          <div class="ac-grau-summary-card" style="border-color:${g.bordaBadge}; background:${g.bgBadge};">
            <div class="ac-grau-sum-title" style="color:${g.cor}; font-weight:700;">${g.nome}</div>
            <div class="ac-grau-sum-mod">${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} na CD</div>
            <div class="ac-grau-sum-desc">${g.descricao}</div>
          </div>
        `).join('')}
      </div>

      <!-- SELETOR RÁPIDO DO APÊNDICE 1 -->
      <div class="ac-box-highlight" style="background: rgba(30, 41, 59, 0.5); border-color: rgba(99, 102, 241, 0.4);">
        <div class="ac-box-header">
          <span class="ac-box-tag" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">📚 Catálogo Rápido do Apêndice 1 (Tiers 1 a 5)</span>
          <span class="ac-box-sub">Carregar diretamente materiais oficiais com suas propriedades</span>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Buscar Material do Apêndice 1:</label>
          <select class="ac-select" id="ac-craft-quick-apendice1" onchange="window._acCraftAplicarMatApendice1(this.value)">
            <option value="">-- Selecione para preencher materiais e efeitos --</option>
            <optgroup label="⚙️ Metais e Minérios (Appendix 1)">
              ${APENDICE1_MATERIAIS.metais.map(m => `
                <option value="${m.id}">Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}</option>
              `).join('')}
            </optgroup>
            <optgroup label="💎 Gemas e Cristais Arcanos (Appendix 1)">
              ${APENDICE1_MATERIAIS.gemas.map(m => `
                <option value="${m.id}">Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}</option>
              `).join('')}
            </optgroup>
            <optgroup label="🪵 Madeiras, Fibras e Tecidos (Appendix 1)">
              ${APENDICE1_MATERIAIS.fibras_madeiras.map(m => `
                <option value="${m.id}">Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}</option>
              `).join('')}
            </optgroup>
            <optgroup label="🐉 Produtos Exóticos de Criaturas (Appendix 1)">
              ${APENDICE1_MATERIAIS.criaturas_exoticas.map(m => `
                <option value="${m.id}">Tier ${m.tier}: ${m.nome} (${m.familia}) • ${m.propriedades}</option>
              `).join('')}
            </optgroup>
          </select>
          <small class="ac-hint">Ao selecionar, o material, grau sugerido e suas propriedades mecânicas são transferidos automaticamente para o item forjado.</small>
        </div>
      </div>

      <!-- MATERIAL PRIMÁRIO (BASE ESTRUTURAL) -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">Material 1: Base Estrutural Primária</span>
          <span class="ac-box-sub">Principal matéria do corpo do item</span>
        </div>
        <div class="ac-form-grid-2">
          <div class="ac-form-group">
            <label class="ac-label">Nome do Material Primário:</label>
            <input type="text" class="ac-input" id="ac-craft-mat1-nome" value="${escHtml(state.materialPrimario)}">
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Quantidade Necessária:</label>
            <input type="text" class="ac-input" id="ac-craft-mat1-qtd" value="${escHtml(state.qtdPrimaria)}">
          </div>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau de Qualidade do Material Primário:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauPrimario === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauPrimario" value="${g.id}" ${state.grauPrimario === g.id ? 'checked' : ''}
                       onchange="window._acCraftAlterarGrau('primario', '${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- MATERIAL SECUNDÁRIO (REFORÇO / ACABAMENTO) -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">Material 2: Fixadores & Acabamento</span>
          <span class="ac-box-sub">Tiras de couro, rebites, punhos, juntas</span>
        </div>
        <div class="ac-form-grid-2">
          <div class="ac-form-group">
            <label class="ac-label">Nome do Material Secundário:</label>
            <input type="text" class="ac-input" id="ac-craft-mat2-nome" value="${escHtml(state.materialSecundario)}">
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Quantidade / Lote:</label>
            <input type="text" class="ac-input" id="ac-craft-mat2-qtd" value="${escHtml(state.qtdSecundaria)}">
          </div>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau de Qualidade do Material Secundário:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauSecundario === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauSecundario" value="${g.id}" ${state.grauSecundario === g.id ? 'checked' : ''}
                       onchange="window._acCraftAlterarGrau('secundario', '${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- MATERIAL ESPECIAL / NOBRE (OPCIONAL) -->
      <div class="ac-form-group">
        <label class="ac-label">Material Nobre Especial (Opcional - Apêndice 1):</label>
        <select class="ac-select" id="ac-craft-sel-especial">
          <option value="nenhum" ${state.materialEspecial === 'nenhum' ? 'selected' : ''}>Nenhum (Metais/Madeiras Comuns)</option>
          <optgroup label="Metais Especiais (Appendix 1)">
            ${APENDICE1_MATERIAIS.metais.filter(m => m.tier >= 2).map(m => `
              <option value="${m.id}" ${state.materialEspecial === m.id ? 'selected' : ''}>
                Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}
              </option>
            `).join('')}
          </optgroup>
          <optgroup label="Madeiras e Fibras Raras (Appendix 1)">
            ${APENDICE1_MATERIAIS.fibras_madeiras.filter(m => m.tier >= 2).map(m => `
              <option value="${m.id}" ${state.materialEspecial === m.id ? 'selected' : ''}>
                Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}
              </option>
            `).join('')}
          </optgroup>
          <optgroup label="Colheita de Criaturas Raras (Appendix 1)">
            ${APENDICE1_MATERIAIS.criaturas_exoticas.filter(m => m.tier >= 2).map(m => `
              <option value="${m.id}" ${state.materialEspecial === m.id ? 'selected' : ''}>
                Tier ${m.tier}: ${m.nome} (${m.cdMod > 0 ? `+${m.cdMod}` : m.cdMod} CD) • ${m.propriedades}
              </option>
            `).join('')}
          </optgroup>
        </select>
        <small class="ac-hint">Materiais de maior Tier conferem propriedades mágicas e mecânicas permanentes à ficha do item criado.</small>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Custo Base de Mercado dos Materiais (PO):</label>
        <input type="number" class="ac-input" id="ac-craft-input-custo" value="${state.custoEstimadoPo}">
        <small class="ac-hint">Custo de compra dos suprimentos brutos.</small>
      </div>

    </div>
  `;
}

// ==========================================
// PASSO 4: OFICINA, FERRAMENTAS & TEMPO
// ==========================================
function _renderPasso4(state, calc) {
  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 4: Instalações, Ferramentas & Assistentes</h4>
        <span class="ac-step-pill">Regra: Infraestrutura de Ofício</span>
      </div>
      <p class="ac-step-desc">
        A forja requer bigorna, fole e carvão; a marcenaria exige bancada estável; a joalharia exige queimador de precisão. Trabalhar sem estrutura adequada eleva a dificuldade ou invalida a tentativa.
      </p>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Condição das Instalações:</label>
          <select class="ac-select" id="ac-craft-sel-instalacao">
            <option value="padrao" ${state.tipoInstalacao === 'padrao' ? 'selected' : ''}>Oficina Padrão Completa (Modificador: 0)</option>
            <option value="mestre" ${state.tipoInstalacao === 'mestre' ? 'selected' : ''}>Oficina Mestre de Guilda (-1 na CD)</option>
            <option value="improvisada" ${state.tipoInstalacao === 'improvisada' ? 'selected' : ''}>Forja / Bancada Improvisada (+2 na CD)</option>
          </select>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Estado das Ferramentas:</label>
          <select class="ac-select" id="ac-craft-sel-ferramentas">
            <option value="padrao" ${state.qualidadeFerramentas === 'padrao' ? 'selected' : ''}>Ferramentas Padrão em Bom Estado (Modificador: 0)</option>
            <option value="mestre" ${state.qualidadeFerramentas === 'mestre' ? 'selected' : ''}>Ferramentas de Mestre / Qualidade Superior (-1 na CD)</option>
            <option value="gasta" ${state.qualidadeFerramentas === 'gasta' ? 'selected' : ''}>Ferramentas Desgastadas / Improvisadas (+1 na CD)</option>
          </select>
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Assistentes Qualificados (Ajudantes de Oficina):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarAssistentes(-1)">-</button>
            <input type="number" class="ac-input text-center" id="ac-craft-input-assistentes" value="${state.assistentesQtd}" min="0" max="6">
            <button class="ac-spin-btn" onclick="window._acCraftAjustarAssistentes(1)">+</button>
          </div>
          <small class="ac-hint">Cada assistente reduz o tempo total em 15% (max 60%).</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Horas Dedicadas por Dia:</label>
          <input type="number" class="ac-input" id="ac-craft-input-horas-dia" value="${state.horasPorDia || 8}" min="4" max="16">
          <small class="ac-hint">O expediente padrão de ofício em D&D é de 8 horas diárias.</small>
        </div>
      </div>

      <!-- RESUMO DE TEMPO CALCULADO -->
      <div class="ac-calc-preview-card">
        <div class="ac-calc-row">
          <span>Tempo Base:</span>
          <strong>${state.tempoHoras} horas</strong>
        </div>
        <div class="ac-calc-row">
          <span>Aceleração por Assistentes (${state.assistentesQtd}):</span>
          <strong>-${Math.round(Math.min(0.6, state.assistentesQtd * 0.15) * 100)}%</strong>
        </div>
        <div class="ac-calc-row total">
          <span>Tempo Efetivo de Trabalho:</span>
          <strong class="gold">${calc.tempoHorasEfetivo} horas (${calc.diasTrabalho} dias de oficina)</strong>
        </div>
      </div>

    </div>
  `;
}

// ==========================================
// PASSO 5: REVISÃO DA FICHA & CÁLCULO DA CD
// ==========================================
function _renderPasso5(state, calc) {
  const modMenorGrau = GRAUS_MATERIAL[calc.menorGrau]?.modificadorCd ?? 0;
  let modInst = 0;
  if (state.tipoInstalacao === 'improvisada') modInst = 2;
  if (state.tipoInstalacao === 'mestre') modInst = -1;
  let modFerr = 0;
  if (state.qualidadeFerramentas === 'gasta') modFerr = 1;
  if (state.qualidadeFerramentas === 'mestre') modFerr = -1;

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 5: Revisão da Ficha de Criação & Dificuldade Final</h4>
        <span class="ac-step-pill">Cálculo das Regras Oficiais</span>
      </div>
      <p class="ac-step-desc">
        Antes de acender a forja e iniciar a confecção, revise todos os termos da sua ficha de processo. A Dificuldade Final (CD Final) é o alvo que o seu teste de artesão deve igualar ou superar.
      </p>

      <!-- FÓRMULA DETALHADA DA CD -->
      <div class="ac-formula-breakdown-card">
        <div class="ac-formula-title">DECOMPOSIÇÃO DA DIFICULDADE (CD FINAL)</div>
        <div class="ac-formula-grid">
          <div class="ac-formula-col">
            <span class="label">CD Base do Item</span>
            <span class="val">${state.cdBase}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Menor Grau (${GRAUS_MATERIAL[calc.menorGrau]?.nome})</span>
            <span class="val">${modMenorGrau >= 0 ? `+${modMenorGrau}` : modMenorGrau}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Instalações / Ferramentas</span>
            <span class="val">${(modInst + modFerr) >= 0 ? `+${modInst + modFerr}` : (modInst + modFerr)}</span>
          </div>
          <div class="ac-formula-op">=</div>
          <div class="ac-formula-col total">
            <span class="label">CD FINAL DE CRIAÇÃO</span>
            <span class="val gold">${calc.cdFinalCalculada}</span>
          </div>
        </div>
      </div>

      <!-- RESUMO DA FICHA COMPLETA -->
      <div class="ac-review-table">
        <div class="ac-review-row">
          <span class="k">Projeto / Item:</span>
          <span class="v font-bold">${escHtml(state.nomeItem)} (${escHtml(state.categoriaItem)})</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Artesão Responsável:</span>
          <span class="v">${escHtml(state.nomeArtesao)} • Bônus de Teste: +${state.bonusAtributoProficiencia}</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Material Base:</span>
          <span class="v">${escHtml(state.materialPrimario)} (${escHtml(state.qtdPrimaria)}) • Grau ${GRAUS_MATERIAL[state.grauPrimario]?.nome}</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Material Secundário:</span>
          <span class="v">${escHtml(state.materialSecundario)} (${escHtml(state.qtdSecundaria)}) • Grau ${GRAUS_MATERIAL[state.grauSecundario]?.nome}</span>
        </div>
        ${state.materialEspecial !== 'nenhum' ? `
          <div class="ac-review-row highlight">
            <span class="k">Material Nobre:</span>
            <span class="v gold font-bold">${escHtml(state.materialEspecial.toUpperCase())}</span>
          </div>
        ` : ''}
        <div class="ac-review-row">
          <span class="k">Qualidade Final Prevista:</span>
          <span class="v" style="color:${GRAUS_MATERIAL[calc.menorGrau]?.cor}; font-weight:700;">
            ${GRAUS_MATERIAL[calc.menorGrau]?.nome} (${GRAUS_MATERIAL[calc.menorGrau]?.impactoItem})
          </span>
        </div>
        <div class="ac-review-row highlight">
          <span class="k">Meta de Esforço Acumulado (UE):</span>
          <span class="v gold font-bold">${calcularEsforcoAlvo('crafting', state, calc)} UE (estimativa de ${Math.ceil(calcularEsforcoAlvo('crafting', state, calc) / 7)} ciclos de trabalho)</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Dinâmica de Rolagens (D&D 5.5e):</span>
          <span class="v text-muted" style="font-size:0.85rem;">Sequência de rolagens por turnos contra CD ${calc.cdFinalCalculada}. Falhas acumulam Níveis de Exaustão (-2 cumulativo em cada d20 seguinte).</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Tempo Total de Ofício:</span>
          <span class="v">${calc.tempoHorasEfetivo} horas (${calc.diasTrabalho} dias de trabalho de 8 horas)</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Custo Total de Matéria-Prima:</span>
          <span class="v font-bold">${calc.custoFinalPo} po</span>
        </div>
      </div>

    </div>
  `;
}

// ==========================================
// PASSO 6: EXECUÇÃO & TESTE DE CRIAÇÃO (CICLOS & ESFORÇO ACUMULADO)
// ==========================================
function _renderPasso6(state, calc) {
  const cd = calc.cdFinalCalculada;

  if (!state.sessaoEsforco) {
    state.sessaoEsforco = inicializarSessaoEsforco('crafting', state, calc);
  }

  const arenaHtml = renderizarArenaEsforcoHTML(state.sessaoEsforco, {
    cdCiclo: cd,
    bonusBase: Number(state.bonusAtributoProficiencia),
    modificadorExtraManual: Number(state.modificadorExtraManual || 0),
    modoRolagem: state.modoRolagem || 'normal'
  }, {
    rolarCiclo: "window._acCraftRolarCiclo()",
    autoResolver: "window._acCraftAutoResolver()",
    descansar: "window._acCraftDescansar()",
    reiniciarSessao: "window._acCraftReiniciarSessao()",
    avancarFicha: "window._acCraftAvancarFicha()",
    setModo: "window._acCraftSetModoRolagem",
    ajustarExtra: "window._acCraftAjustarExtra"
  });

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 6: Execução da Forja • Ciclos de Trabalho & Esforço Acumulado</h4>
        <span class="ac-step-pill">Regras Oficiais D&D 5.5e • Fadiga & Exaustão</span>
      </div>
      <p class="ac-step-desc">
        A manufatura é um <strong>processo contínuo por turnos de trabalho</strong>: cada ciclo de martelo e forja avança rumo à <strong>Meta de Esforço Acumulado (${state.sessaoEsforco.esforcoAlvo} UE)</strong> contra a <strong>CD ${cd}</strong>. Rolagens desfavoráveis ou esforço contínuo geram <strong>Níveis de Exaustão (D&D 5.5e: -2 por nível)</strong>, prejudicando os testes seguintes se o artífice não gerenciar o descanso!
      </p>

      <!-- CARD DE REGRAS DE RESOLUÇÃO DO LIVRO -->
      <div class="ac-rules-pills-grid">
        <div class="ac-rule-pill-item win-nat">
          <strong>20 Natural (Golpe de Mestre):</strong> Avanço massivo de progresso na forja sem acumular fadiga.
        </div>
        <div class="ac-rule-pill-item win">
          <strong>Sucesso (≥ CD):</strong> Trabalho eficiente. Progresso pleno somado ao Esforço Acumulado (UE).
        </div>
        <div class="ac-rule-pill-item fail">
          <strong>Falha (&lt; CD):</strong> Atraso na têmpera ou imperfeições. Risco de fadiga (teste de CON ou Exaustão).
        </div>
        <div class="ac-rule-pill-item fail-nat">
          <strong>Exaustão (D&D 5.5e):</strong> -2 cumulativo em todas as jogadas de d20 por nível. Descanso alivia -1 nível.
        </div>
      </div>

      <!-- ARENA INTERATIVA DE ESFORÇO & CICLOS -->
      ${arenaHtml}

    </div>
  `;
}

// ==========================================
// PASSO 7: FICHA VIRTUAL CONCLUÍDA (CRAFTING SHEET)
// ==========================================
function _renderPasso7(state, calc) {
  const ult = state.ultimoResultado || {
    total: calc.cdFinalCalculada + 2,
    cdFinal: calc.cdFinalCalculada,
    sucesso: true,
    obraPrima: false,
    menorGrau: calc.menorGrau,
    dadoEscolhido: 15,
    modTotal: state.bonusAtributoProficiencia,
    logRegra: 'Item forjado com sucesso.'
  };

  const grauInfo = GRAUS_MATERIAL[ult.menorGrau || calc.menorGrau];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 7: Ficha de Criação Oficial Concluída</h4>
        <span class="ac-step-pill">Modelo Oficial de Ficha • Nord Games</span>
      </div>
      <p class="ac-step-desc">
        Abaixo está o espelho exato do modelo de <strong>Ficha de Criação de Item</strong> apresentado ao final da Parte 1 do livro de regras, totalmente preenchida e chancelada pelo resultado do teste.
      </p>

      <!-- MODELO VISUAL DA FICHA DO LIVRO (CRAFTING SHEET) -->
      <div class="ac-official-sheet-card" id="ac-crafting-sheet-print">
        
        <!-- CABEÇALHO DA FICHA DO LIVRO -->
        <div class="ac-of-sheet-header">
          <div class="ac-of-sheet-seal">⚒️</div>
          <div class="ac-of-sheet-titles">
            <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 1</span>
            <h2 class="ac-of-sheet-main-title">FICHA DE PROCESSO DE CRIAÇÃO (CRAFTING SHEET)</h2>
            <span class="ac-of-sheet-sub">Registro de Ateliê, Oficina e Forja de Itens</span>
          </div>
          <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
            ${ult.obraPrima ? 'OBRA-PRIMA' : ult.sucesso ? 'CONCLUÍDO' : 'FALHA DE OFÍCIO'}
          </div>
        </div>

        <!-- SEÇÃO 1: DADOS DO ARTESÃO & ASSOCIAÇÃO -->
        <div class="ac-of-sheet-grid-2">
          <div class="ac-of-field">
            <label>NOME DO ARTESÃO / CRIADOR</label>
            <div class="value">${escHtml(state.nomeArtesao)}</div>
          </div>
          <div class="ac-of-field">
            <label>ASSOCIAÇÃO / GUILDA & POSTO</label>
            <div class="value">${escHtml(POSTOS_ASSOCIACAO.find(p => p.id === state.posto)?.nome || 'Oficial')} (${escHtml(state.especializacao)})</div>
          </div>
          <div class="ac-of-field">
            <label>FERRAMENTAS PROFICIENTES</label>
            <div class="value">${escHtml(state.ferramenta)} (Bônus: +${state.bonusAtributoProficiencia})</div>
          </div>
          <div class="ac-of-field">
            <label>INSTALAÇÕES & OFICINA</label>
            <div class="value">${state.tipoInstalacao === 'mestre' ? 'Oficina Mestre de Guilda' : state.tipoInstalacao === 'improvisada' ? 'Instalação Improvisada' : 'Oficina Padrão Completa'}</div>
          </div>
        </div>

        <!-- SEÇÃO 2: DADOS DO ITEM & PROJETO -->
        <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DO ITEM PROJETADO</div>
        <div class="ac-of-sheet-grid-3">
          <div class="ac-of-field">
            <label>NOME DO ITEM</label>
            <div class="value font-bold gold">${escHtml(state.nomeItem)}</div>
          </div>
          <div class="ac-of-field">
            <label>CATEGORIA</label>
            <div class="value">${escHtml(state.categoriaItem)}</div>
          </div>
          <div class="ac-of-field">
            <label>PESO / CARGA</label>
            <div class="value">${state.pesoItem} kg</div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>PROPRIEDADES MECÂNICAS & EFEITOS</label>
          <div class="value">${escHtml(state.propriedadesItem)} ${state.materialEspecial !== 'nenhum' ? `• Material Nobre: ${state.materialEspecial.toUpperCase()}` : ''}</div>
        </div>

        <!-- SEÇÃO 3: TABELA DE MATERIAIS & GRAUS -->
        <div class="ac-of-sheet-section-title">MATERIAIS, QUANTIDADES & GRAUS DE QUALIDADE</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>PAPEL</th>
                <th>MATERIAL</th>
                <th>QUANTIDADE</th>
                <th>GRAU DO MATERIAL</th>
                <th>MOD. CD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Base Estrutural</strong></td>
                <td>${escHtml(state.materialPrimario)}</td>
                <td>${escHtml(state.qtdPrimaria)}</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauPrimario]?.cor}">${GRAUS_MATERIAL[state.grauPrimario]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauPrimario]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauPrimario]?.modificadorCd}` : GRAUS_MATERIAL[state.grauPrimario]?.modificadorCd}</td>
              </tr>
              <tr>
                <td><strong>Fixação / Reforço</strong></td>
                <td>${escHtml(state.materialSecundario)}</td>
                <td>${escHtml(state.qtdSecundaria)}</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauSecundario]?.cor}">${GRAUS_MATERIAL[state.grauSecundario]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauSecundario]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauSecundario]?.modificadorCd}` : GRAUS_MATERIAL[state.grauSecundario]?.modificadorCd}</td>
              </tr>
              ${state.materialEspecial !== 'nenhum' ? `
                <tr class="row-special">
                  <td><strong>Elemento Nobre</strong></td>
                  <td>${escHtml(state.materialEspecial.toUpperCase())}</td>
                  <td>1 cota</td>
                  <td><span class="ac-grau-pill" style="color:#a855f7;">Suprema / Especial</span></td>
                  <td>+1 ou +2</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <!-- SEÇÃO 4: DIFICULDADE, TEMPO E RESOLUÇÃO -->
        <div class="ac-of-sheet-section-title">RESOLUÇÃO DE FORJA • ESFORÇO ACUMULADO & CICLOS (D&D 5.5e)</div>
        <div class="ac-of-sheet-grid-4">
          <div class="ac-of-field">
            <label>DIFICULDADE DO PROCESSO</label>
            <div class="value font-bold gold">CD ${ult.cdFinal}</div>
          </div>
          <div class="ac-of-field">
            <label>ESFORÇO ACUMULADO (UE)</label>
            <div class="value font-bold gold">${ult.progressoAtual !== undefined ? ult.progressoAtual : (state.sessaoEsforco?.progressoAtual || ult.total)} / ${ult.esforcoAlvo || state.sessaoEsforco?.esforcoAlvo || 20} UE</div>
          </div>
          <div class="ac-of-field">
            <label>CICLOS DE TRABALHO</label>
            <div class="value font-bold">${ult.ciclosCount || state.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1} ciclos executados</div>
          </div>
          <div class="ac-of-field">
            <label>EXAUSTÃO DO ARTESÃO</label>
            <div class="value font-bold" style="color: ${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).cor};">
              Nível ${ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0} (${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).rotulo})
            </div>
          </div>
        </div>

        <div class="ac-of-sheet-grid-3" style="margin-top:8px;">
          <div class="ac-of-field">
            <label>TEMPO DE TRABALHO DEDICADO</label>
            <div class="value">${calc.tempoHorasEfetivo} horas (${calc.diasTrabalho} dias)</div>
          </div>
          <div class="ac-of-field">
            <label>CUSTO TOTAL DE MATERIAIS</label>
            <div class="value">${calc.custoFinalPo} po</div>
          </div>
          <div class="ac-of-field">
            <label>QUALIDADE FINAL DO ITEM</label>
            <div class="value font-bold" style="color:${grauInfo?.cor}">${grauInfo?.nome}</div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
          <div class="value">${ult.logRegra}</div>
        </div>

        <!-- SEÇÃO 5: HISTÓRICO DE CICLOS & ESFORÇO ACUMULADO (D&D 5.5e) -->
        ${state.sessaoEsforco?.ciclosExecutados?.length > 0 ? `
          <div class="ac-of-sheet-section-title">HISTÓRICO DE CICLOS DE TRABALHO & ESFORÇO ACUMULADO (D&D 5.5e)</div>
          <div class="ac-of-table-container">
            <table class="ac-of-table">
              <thead>
                <tr>
                  <th>CICLO</th>
                  <th>DADO D20</th>
                  <th>BÔNUS</th>
                  <th>PEN. EXAUSTÃO</th>
                  <th>TOTAL VS CD</th>
                  <th>PROGRESSO</th>
                  <th>ACUMULADO</th>
                  <th>EXAUSTÃO</th>
                  <th>PARECER DO TURNO</th>
                </tr>
              </thead>
              <tbody>
                ${state.sessaoEsforco.ciclosExecutados.map(c => `
                  <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                    <td><strong>${c.tipo === 'descanso' ? '🛌 Repouso' : `#${c.numCiclo}`}</strong></td>
                    <td>${c.tipo === 'descanso' ? '-' : c.dadoEscolhido}</td>
                    <td>${c.tipo === 'descanso' ? '-' : (c.bonusBase >= 0 ? `+${c.bonusBase}` : c.bonusBase)}</td>
                    <td>${c.penalidadeExaustao > 0 ? `<span style="color:#ef4444; font-weight:700;">-${c.penalidadeExaustao}</span>` : '0'}</td>
                    <td>${c.tipo === 'descanso' ? '-' : `<strong>${c.total}</strong> vs ${c.cdCiclo}`}</td>
                    <td><strong class="gold">+${c.progressoCiclo} UE</strong></td>
                    <td>${c.progressoAcumulado} / ${c.esforcoAlvo}</td>
                    <td><span class="ac-exaustao-pill exaust-${c.nivelExaustao}">Nv ${c.nivelExaustao}</span></td>
                    <td class="ac-table-relato-td">${escHtml(c.eventoDesc)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- RODAPÉ DA FICHA -->
        <div class="ac-of-sheet-footer">
          <span>Assinatura do Artífice: <em>${escHtml(state.nomeArtesao)}</em></span>
          <span>Selo da Guilda: <strong>Arquivado no Arcane Craft</strong></span>
          <span>Data: ${new Date().toLocaleDateString()}</span>
        </div>

      </div>

      <!-- BOTÕES DE AÇÃO COM A FICHA -->
      <div class="ac-sheet-actions-bar">
        ${state.personagemId && ult.sucesso ? `
          <button class="btn btn-primary ac-btn-add-inv" id="ac-craft-btn-adicionar-inventario">
            📥 Adicionar Item à Ficha do Personagem
          </button>
        ` : !state.personagemId && ult.sucesso ? `
          <button class="btn btn-outline" id="ac-craft-btn-vincular-salvar">
            Vincular Personagem e Guardar no Inventário
          </button>
        ` : ''}

        <button class="btn btn-outline" id="ac-craft-btn-copiar-ficha">
          📋 Copiar Resumo da Ficha
        </button>

        <button class="btn btn-outline" id="ac-craft-btn-salvar-caderno">
          💾 Salvar no Caderno de Fichas
        </button>

        <button class="btn btn-outline" id="ac-craft-btn-imprimir">
          🖨️ Imprimir / Salvar PDF
        </button>

        <button class="btn btn-outline" id="ac-craft-btn-reiniciar">
          🔄 Novo Processo
        </button>
      </div>

    </div>
  `;
}

// ==========================================
// CONFIGURAÇÃO DE EVENTOS DO WIZARD DE CRAFTING
// ==========================================
function _setupEventosCrafting(container, state, onUpdateState, onIrParaBanco, calc) {
  // Inicializa deslizamento suave e centralização automática no passo ativo
  const stepsTracker = container.querySelector('#ac-craft-steps-tracker');
  const stepPrev = container.querySelector('#ac-craft-step-prev');
  const stepNext = container.querySelector('#ac-craft-step-next');
  if (stepsTracker) {
    tornarBarraDeslizavel(stepsTracker, {
      btnEsquerda: stepPrev,
      btnDireita: stepNext,
      passoScroll: 180,
      centralizarAtivo: true,
      seletorAtivo: '.ac-step-node.ativo'
    });
  }

  // Funções expostas globalmente para onclick inline dos seletores
  window._acMudarPassoCrafting = (novoPasso) => {
    state.passoAtual = Math.max(1, Math.min(7, novoPasso));
    onUpdateState(state);
  };

  window._acCraftEscolherEspec = (espec, ferramenta) => {
    state.especializacao = espec;
    state.ferramenta = ferramenta;
    onUpdateState(state);
  };

  window._acCraftAjustarBonus = (delta) => {
    state.bonusAtributoProficiencia = Math.max(-2, Number(state.bonusAtributoProficiencia || 0) + delta);
    onUpdateState(state);
  };

  window._acCraftCarregarModelo = (modeloId) => {
    const mod = MODELOS_BASE_CRAFTING.find(m => m.id === modeloId);
    if (!mod) return;
    state.nomeItem = mod.nome;
    state.categoriaItem = mod.categoria;
    state.especializacao = mod.especializacao;
    state.ferramenta = mod.ferramenta;
    state.cdBase = mod.cdBase;
    state.tempoHoras = mod.tempoHoras;
    state.custoEstimadoPo = mod.custoBasePo;
    state.materialPrimario = mod.materialPrimario;
    state.qtdPrimaria = mod.qtdPrimaria;
    state.grauPrimario = mod.grauPrimario;
    state.materialSecundario = mod.materialSecundario;
    state.qtdSecundaria = mod.qtdSecundaria;
    state.grauSecundario = mod.grauSecundario;
    state.propriedadesItem = mod.propriedades;
    toast(`Modelo carregado: ${mod.nome}`);
    onUpdateState(state);
  };

  window._acCraftAjustarCdBase = (delta) => {
    state.cdBase = Math.max(8, Number(state.cdBase) + delta);
    onUpdateState(state);
  };

  window._acCraftAjustarTempo = (delta) => {
    state.tempoHoras = Math.max(2, Number(state.tempoHoras) + delta);
    onUpdateState(state);
  };

  window._acCraftAlterarGrau = (tipo, grau) => {
    if (tipo === 'primario') state.grauPrimario = grau;
    if (tipo === 'secundario') state.grauSecundario = grau;
    onUpdateState(state);
  };

  window._acCraftAplicarMatApendice1 = (matId) => {
    if (!matId) return;
    const todosMats = [
      ...APENDICE1_MATERIAIS.metais,
      ...APENDICE1_MATERIAIS.gemas,
      ...APENDICE1_MATERIAIS.fibras_madeiras,
      ...APENDICE1_MATERIAIS.criaturas_exoticas
    ];
    const mat = todosMats.find(m => m.id === matId);
    if (!mat) return;

    state.materialPrimario = mat.nome;
    if (mat.grauMin) state.grauPrimario = mat.grauMin;
    if (mat.tier >= 2) state.materialEspecial = mat.id;

    // Adiciona propriedade no item se ainda não constar
    if (mat.propriedades && !state.propriedadesItem.includes(mat.propriedades)) {
      state.propriedadesItem = state.propriedadesItem
        ? `${state.propriedadesItem} • [${mat.nome}]: ${mat.propriedades}`
        : `[${mat.nome}]: ${mat.propriedades}`;
    }

    toast(`Material "${mat.nome}" (Tier ${mat.tier}) aplicado! Propriedades adicionadas ao item.`, 'success');
    onUpdateState(state);
  };

  window._acCraftAjustarAssistentes = (delta) => {
    state.assistentesQtd = Math.max(0, Math.min(6, Number(state.assistentesQtd || 0) + delta));
    onUpdateState(state);
  };

  window._acCraftSetModoRolagem = (modo) => {
    state.modoRolagem = modo;
    onUpdateState(state);
  };

  window._acCraftAjustarExtra = (delta) => {
    state.modificadorExtraManual = Number(state.modificadorExtraManual || 0) + delta;
    onUpdateState(state);
  };

  window._acCraftRolarCiclo = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('crafting', state, calc);
    }
    rolarCicloTrabalho(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusAtributoProficiencia),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoCrafting(state, calc);
    onUpdateState(state);
  };

  window._acCraftAutoResolver = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('crafting', state, calc);
    }
    autoResolverCiclos(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusAtributoProficiencia),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoCrafting(state, calc);
    toast('Todos os ciclos restantes foram processados com gestão de fadiga!', 'success');
    onUpdateState(state);
  };

  window._acCraftDescansar = () => {
    if (!state.sessaoEsforco) return;
    const res = descansarSessao(state.sessaoEsforco);
    toast(res.mensagem, res.sucesso ? 'info' : 'warning');
    _sincronizarResultadoCrafting(state, calc);
    onUpdateState(state);
  };

  window._acCraftReiniciarSessao = () => {
    state.sessaoEsforco = inicializarSessaoEsforco('crafting', state, calc);
    state.ultimoResultado = null;
    toast('Bancada reiniciada para nova sessão de forja.');
    onUpdateState(state);
  };

  window._acCraftAvancarFicha = () => {
    state.passoAtual = 7;
    onUpdateState(state);
  };

  // Botões de navegação
  const btnVoltar = container.querySelector('#ac-craft-btn-voltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      if (state.passoAtual > 1) {
        state.passoAtual--;
        onUpdateState(state);
      }
    });
  }

  const btnAvancar = container.querySelector('#ac-craft-btn-avancar');
  if (btnAvancar) {
    btnAvancar.addEventListener('click', () => {
      if (state.passoAtual < 6) {
        state.passoAtual++;
        onUpdateState(state);
      }
    });
  }

  const btnAvancarFicha = container.querySelector('#ac-craft-btn-avancar-ficha');
  if (btnAvancarFicha) {
    btnAvancarFicha.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  const btnNovoProcesso = container.querySelector('#ac-craft-btn-novo-processo');
  if (btnNovoProcesso) {
    btnNovoProcesso.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialCrafting());
      toast('Novo processo de criação iniciado.');
      onUpdateState(state);
    });
  }

  const btnVerMateriais = container.querySelector('#ac-craft-btn-ver-materiais');
  if (btnVerMateriais && onIrParaBanco) {
    btnVerMateriais.addEventListener('click', () => {
      onIrParaBanco();
    });
  }

  // Inputs Passo 1
  const selChar = container.querySelector('#ac-craft-sel-personagem');
  if (selChar) {
    selChar.addEventListener('change', (e) => {
      state.personagemId = e.target.value;
      if (state.personagemId) {
        const char = getPersonagem(state.personagemId);
        if (char) {
          state.nomeArtesao = char.nome;
          // Calcular bônus aproximado de força ou destreza + proficiência
          const modFor = Math.floor(((char.atributos?.for?.total || 10) - 10) / 2);
          const modDes = Math.floor(((char.atributos?.des?.total || 10) - 10) / 2);
          const prof = Math.floor(((char.nivel || 1) - 1) / 4) + 2;
          state.bonusAtributoProficiencia = Math.max(modFor, modDes) + prof;
        }
      }
      onUpdateState(state);
    });
  }

  const inputArtesao = container.querySelector('#ac-craft-input-artesao');
  if (inputArtesao) {
    inputArtesao.addEventListener('input', (e) => { state.nomeArtesao = e.target.value; });
  }
  const selPosto = container.querySelector('#ac-craft-sel-posto');
  if (selPosto) {
    selPosto.addEventListener('change', (e) => { state.posto = e.target.value; onUpdateState(state); });
  }
  const inputFerramenta = container.querySelector('#ac-craft-input-ferramenta');
  if (inputFerramenta) {
    inputFerramenta.addEventListener('input', (e) => { state.ferramenta = e.target.value; });
  }
  const inputBonus = container.querySelector('#ac-craft-input-bonus');
  if (inputBonus) {
    inputBonus.addEventListener('change', (e) => { state.bonusAtributoProficiencia = Number(e.target.value); onUpdateState(state); });
  }

  // Inputs Passo 2
  const selCat = container.querySelector('#ac-craft-sel-categoria');
  if (selCat) {
    selCat.addEventListener('change', (e) => { state.categoriaItem = e.target.value; onUpdateState(state); });
  }
  const inputNome = container.querySelector('#ac-craft-input-nome');
  if (inputNome) {
    inputNome.addEventListener('input', (e) => { state.nomeItem = e.target.value; });
  }
  const inputProps = container.querySelector('#ac-craft-input-props');
  if (inputProps) {
    inputProps.addEventListener('input', (e) => { state.propriedadesItem = e.target.value; });
  }
  const inputPeso = container.querySelector('#ac-craft-input-peso');
  if (inputPeso) {
    inputPeso.addEventListener('change', (e) => { state.pesoItem = Number(e.target.value); onUpdateState(state); });
  }

  // Inputs Passo 3
  const mat1Nome = container.querySelector('#ac-craft-mat1-nome');
  if (mat1Nome) mat1Nome.addEventListener('input', (e) => { state.materialPrimario = e.target.value; });
  const mat1Qtd = container.querySelector('#ac-craft-mat1-qtd');
  if (mat1Qtd) mat1Qtd.addEventListener('input', (e) => { state.qtdPrimaria = e.target.value; });

  const mat2Nome = container.querySelector('#ac-craft-mat2-nome');
  if (mat2Nome) mat2Nome.addEventListener('input', (e) => { state.materialSecundario = e.target.value; });
  const mat2Qtd = container.querySelector('#ac-craft-mat2-qtd');
  if (mat2Qtd) mat2Qtd.addEventListener('input', (e) => { state.qtdSecundaria = e.target.value; });

  const selEspecial = container.querySelector('#ac-craft-sel-especial');
  if (selEspecial) {
    selEspecial.addEventListener('change', (e) => { state.materialEspecial = e.target.value; onUpdateState(state); });
  }
  const inputCusto = container.querySelector('#ac-craft-input-custo');
  if (inputCusto) {
    inputCusto.addEventListener('change', (e) => { state.custoEstimadoPo = Number(e.target.value); onUpdateState(state); });
  }

  // Inputs Passo 4
  const selInstalacao = container.querySelector('#ac-craft-sel-instalacao');
  if (selInstalacao) {
    selInstalacao.addEventListener('change', (e) => { state.tipoInstalacao = e.target.value; onUpdateState(state); });
  }
  const selFerr = container.querySelector('#ac-craft-sel-ferramentas');
  if (selFerr) {
    selFerr.addEventListener('change', (e) => { state.qualidadeFerramentas = e.target.value; onUpdateState(state); });
  }
  const inputHorasDia = container.querySelector('#ac-craft-input-horas-dia');
  if (inputHorasDia) {
    inputHorasDia.addEventListener('change', (e) => { state.horasPorDia = Number(e.target.value); onUpdateState(state); });
  }

  // Passo 6: Botão de Rolar Teste
  const btnExecTeste = container.querySelector('#ac-craft-btn-executar-teste');
  if (btnExecTeste) {
    btnExecTeste.addEventListener('click', () => {
      _executarRolagemCrafting(state, onUpdateState);
    });
  }

  const btnTentarDeNovo = container.querySelector('#ac-craft-btn-tentar-novamente');
  if (btnTentarDeNovo) {
    btnTentarDeNovo.addEventListener('click', () => {
      state.ultimoResultado = null;
      toast('Novo dia de oficina: apenas o material base foi reposto.');
      onUpdateState(state);
    });
  }

  const btnConcluirAvancar = container.querySelector('#ac-craft-btn-concluir-avancar');
  if (btnConcluirAvancar) {
    btnConcluirAvancar.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  // Passo 7: Ações da Ficha Concluída
  const btnAddInv = container.querySelector('#ac-craft-btn-adicionar-inventario');
  if (btnAddInv) {
    btnAddInv.addEventListener('click', () => {
      _adicionarAoInventario(state);
    });
  }

  const btnVincularSalvar = container.querySelector('#ac-craft-btn-vincular-salvar');
  if (btnVincularSalvar) {
    btnVincularSalvar.addEventListener('click', () => {
      state.passoAtual = 1;
      toast('Escolha um personagem no Passo 1 e avance até o final para enviar ao inventário.');
      onUpdateState(state);
    });
  }

  const btnCopiarFicha = container.querySelector('#ac-craft-btn-copiar-ficha');
  if (btnCopiarFicha) {
    btnCopiarFicha.addEventListener('click', () => {
      _copiarFichaTexto(state);
    });
  }

  const btnSalvarCaderno = container.querySelector('#ac-craft-btn-salvar-caderno');
  if (btnSalvarCaderno) {
    btnSalvarCaderno.addEventListener('click', () => {
      _salvarFichaNoCaderno(state);
    });
  }

  const btnImprimir = container.querySelector('#ac-craft-btn-imprimir');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      imprimirFichaOficial('crafting', state);
    });
  }

  const btnReiniciar = container.querySelector('#ac-craft-btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialCrafting());
      toast('Novo processo de criação preparado.');
      onUpdateState(state);
    });
  }
}

function _sincronizarResultadoCrafting(state, calc) {
  const s = state.sessaoEsforco;
  if (!s) return;
  const ult = s.ultimoCiclo || {};
  const ciclosValidos = s.ciclosExecutados.filter(c => c.tipo !== 'descanso');
  const ciclosCount = ciclosValidos.length;
  const penalidade = s.nivelExaustao * 2;

  state.ultimoResultado = {
    dataHora: new Date().toISOString(),
    dado1: ult.dado1 || ult.dadoEscolhido || 10,
    dado2: ult.dado2,
    dadoEscolhido: ult.dadoEscolhido || 10,
    modTotal: ult.modTotalEfetivo !== undefined ? ult.modTotalEfetivo : (Number(state.bonusAtributoProficiencia) - penalidade),
    total: ult.total !== undefined ? ult.total : calc.cdFinalCalculada,
    cdFinal: calc.cdFinalCalculada,
    sucesso: s.concluido,
    obraPrima: s.obraPrimaObtida,
    falhaCritica: s.colapsado,
    menorGrau: calc.menorGrau,
    esforcoAlvo: s.esforcoAlvo,
    progressoAtual: s.progressoAtual,
    ciclosCount,
    horasDecorridas: s.horasDecorridas,
    diasDecorridos: s.diasDecorridos,
    nivelExaustaoFinal: s.nivelExaustao,
    ciclosHistorico: [...s.ciclosExecutados],
    logRegra: s.concluido
      ? `Manufatura concluída com sucesso após ${ciclosCount} ciclos de trabalho (${s.diasDecorridos} dias de forja)! Meta de ${s.esforcoAlvo} UE de Esforço Acumulado atingida. Nível final de fadiga do artesão: ${s.nivelExaustao} (Exaustão D&D 5.5e: -${penalidade} no d20).`
      : s.colapsado
        ? `Colapso do artífice por Exaustão Extrema (Nível 6). A forja foi paralisada após ${ciclosCount} ciclos.`
        : `Manufatura em andamento: ${s.progressoAtual} de ${s.esforcoAlvo} UE acumulados (${ciclosCount} ciclos executados). Nível de Exaustão atual: ${s.nivelExaustao}.`
  };
}

function _executarRolagemCrafting(state, onUpdateState) {
  // Menor grau
  const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
  const menorGrau = ordemGraus.indexOf(state.grauPrimario) <= ordemGraus.indexOf(state.grauSecundario)
    ? state.grauPrimario
    : state.grauSecundario;
  const modMenorGrau = GRAUS_MATERIAL[menorGrau]?.modificadorCd ?? 0;

  let modInst = 0;
  if (state.tipoInstalacao === 'improvisada') modInst = 2;
  if (state.tipoInstalacao === 'mestre') modInst = -1;

  let modFerr = 0;
  if (state.qualidadeFerramentas === 'gasta') modFerr = 1;
  if (state.qualidadeFerramentas === 'mestre') modFerr = -1;

  let modEsp = 0;
  if (state.materialEspecial === 'adamantite') modEsp = 2;
  if (state.materialEspecial === 'mitral') modEsp = 1;

  const cdFinal = Math.max(8, Number(state.cdBase) + modMenorGrau + modInst + modFerr + modEsp);
  const modTotal = Number(state.bonusAtributoProficiencia) + Number(state.modificadorExtraManual || 0);

  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  let dadoEscolhido = r1;

  if (state.modoRolagem === 'vantagem') dadoEscolhido = Math.max(r1, r2);
  if (state.modoRolagem === 'desvantagem') dadoEscolhido = Math.min(r1, r2);

  const total = dadoEscolhido + modTotal;
  const obraPrima = dadoEscolhido === 20;
  const falhaCritica = dadoEscolhido === 1;
  const sucesso = !falhaCritica && (obraPrima || total >= cdFinal);

  let logRegra = '';
  if (obraPrima) {
    logRegra = 'Obra-Prima Incomparável! 20 Natural na forja: o item foi concebido em metade do tempo com acabamento lendário. O valor de mercado é duplicado (+100%) e todos os materiais foram consumidos.';
  } else if (falhaCritica) {
    logRegra = 'Falha Crítica (1 Natural): Desastre na têmpera! Uma trinca fatal partiu a peça. Todos os materiais foram destruídos e a oficina necessita de reparos.';
  } else if (sucesso) {
    logRegra = `Sucesso com maestria (Total ${total} vs CD ${cdFinal})! O item foi concluído com a qualidade "${GRAUS_MATERIAL[menorGrau]?.nome}". A receita passa a ter Sucesso Automático em novas tentativas.`;
  } else {
    logRegra = `Falha no teste (Total ${total} vs CD ${cdFinal}): O processo não alcançou o padrão exigido. Pela regra oficial, apenas o material base ("${state.materialPrimario}") é perdido; os demais componentes continuam intactos na bancada e podem ser reutilizados após 1 dia.`;
  }

  state.ultimoResultado = {
    dataHora: new Date().toISOString(),
    dado1: r1,
    dado2: state.modoRolagem !== 'normal' ? r2 : null,
    dadoEscolhido,
    modTotal,
    total,
    cdFinal,
    sucesso,
    obraPrima,
    falhaCritica,
    menorGrau,
    logRegra
  };

  if (sucesso) {
    toast(`Sucesso! Total ${total} superou CD ${cdFinal}.`, 'success');
  } else {
    toast(`Falha no teste: Total ${total} vs CD ${cdFinal}.`, 'error');
  }

  onUpdateState(state);
}

function _adicionarAoInventario(state) {
  if (!state.personagemId) {
    toast('Selecione um personagem no Passo 1 primeiro.', 'warning');
    return;
  }
  const char = getPersonagem(state.personagemId);
  if (!char) {
    toast('Personagem não encontrado.', 'error');
    return;
  }
  if (!char.inventario) char.inventario = [];

  const ult = state.ultimoResultado;
  const menorGrau = ult?.menorGrau || state.grauPrimario;
  const grauInfo = GRAUS_MATERIAL[menorGrau];

  let nomeFinal = state.nomeItem;
  if (ult?.obraPrima) nomeFinal = `${nomeFinal} (Obra-Prima)`;
  else if (menorGrau === 'suprema') nomeFinal = `${nomeFinal} (Supremo)`;
  else if (menorGrau === 'baixa') nomeFinal = `${nomeFinal} (Rústico)`;

  const novoItem = {
    id: `item_craft_${Date.now()}`,
    nome: nomeFinal,
    quantidade: 1,
    peso: Number(state.pesoItem || 1),
    equipado: false,
    sintonizado: false,
    tipo: state.categoriaItem,
    raridade: menorGrau === 'suprema' ? 'Muito Raro' : menorGrau === 'alta' ? 'Incomum' : 'Comum',
    descricao: `${state.propriedadesItem}\n[Forjado no Arcane Craft por ${state.nomeArtesao} • Qualidade: ${grauInfo?.nome}]`,
    notas: `Forjado em ${new Date().toLocaleDateString()} • CD ${ult?.cdFinal || state.cdBase} (Rolagem: ${ult?.total || '-'})`
  };

  char.inventario.push(novoItem);
  salvarPersonagem(char);
  toast(`Item "${nomeFinal}" adicionado com sucesso à ficha de ${char.nome}!`, 'success');
}

function _copiarFichaTexto(state) {
  const ult = state.ultimoResultado;
  const texto = `=== FICHA DE PROCESSO DE CRIAÇÃO (ARCANE CRAFT) ===
Item: ${state.nomeItem} (${state.categoriaItem})
Artesão: ${state.nomeArtesao} (${state.especializacao})
Posto: ${state.posto} • Ferramenta: ${state.ferramenta}
Material Primário: ${state.materialPrimario} (${state.qtdPrimaria}) [Grau: ${state.grauPrimario}]
Material Secundário: ${state.materialSecundario} (${state.qtdSecundaria}) [Grau: ${state.grauSecundario}]
Material Nobre: ${state.materialEspecial}
CD Final: ${ult?.cdFinal || state.cdBase} | Rolagem: ${ult?.total || '-'}
Resultado: ${ult?.sucesso ? (ult.obraPrima ? 'OBRA-PRIMA' : 'SUCESSO') : 'FALHA'}
Parecer: ${ult?.logRegra || 'Concluído'}
Data: ${new Date().toLocaleString()}`;

  navigator.clipboard.writeText(texto).then(() => {
    toast('Texto da Ficha copiado para a área de transferência!');
  }).catch(() => {
    toast('Erro ao copiar texto.');
  });
}

function _salvarFichaNoCaderno(state) {
  const s = state.sessaoEsforco;
  const ult = state.ultimoResultado;
  const ficha = {
    id: `craft_${Date.now()}`,
    tipoProcesso: 'crafting',
    titulo: state.nomeItem,
    subtitulo: `${state.categoriaItem} • ${state.especializacao}`,
    data: new Date().toISOString(),
    artesao: state.nomeArtesao,
    sucesso: ult?.sucesso ?? true,
    obraPrima: ult?.obraPrima ?? false,
    cdFinal: ult?.cdFinal ?? state.cdBase,
    totalRolado: ult?.total ?? '-',
    esforcoAlvo: ult?.esforcoAlvo ?? s?.esforcoAlvo ?? 20,
    esforcoAtingido: ult?.progressoAtual ?? s?.progressoAtual ?? 20,
    ciclosCount: ult?.ciclosCount ?? s?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length ?? 1,
    nivelExaustao: ult?.nivelExaustaoFinal ?? s?.nivelExaustao ?? 0,
    ciclosHistorico: ult?.ciclosHistorico || s?.ciclosExecutados || [],
    dados: { ...state }
  };

  salvarFichaProcesso(ficha);
  toast('Ficha arquivada com sucesso no Caderno do Artesão!');
}
