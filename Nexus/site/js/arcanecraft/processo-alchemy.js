// ============================================================
// Arcane Craft - Wizard de Alquimia (Alchemy)
// Baseado nas Regras da Parte 2 e Modelo da Ficha de Alquimia (Alchemy Sheet)
// ============================================================
import { escHtml, toast } from '../utils.js';
import { listarPersonagens, getPersonagem, salvarPersonagem } from '../store.js';
import {
  GRAUS_MATERIAL,
  APENDICE2_ALQUIMIA,
  obterSubstratosApendice2,
  obterReagentesApendice2,
  obterReceitasBasicasApendice2,
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

export const MODELOS_BASE_ALCHEMY = [
  {
    id: 'pocao_cura_padrao',
    nome: 'Poção de Cura Comum (Healing Potion)',
    categoria: 'Poção de Restauração',
    ramo: 'Boticário (Apothecary)',
    ferramenta: 'Kit de Herbalismo',
    cdBase: 12,
    tempoHoras: 4,
    custoBasePo: 25,
    solvente: 'Água Destilada Purificada & Álcool Neutro',
    grauSolvente: 'media',
    reagenteAtivo: 'Raiz-Sangue (Bloodroot) Macerada',
    qtdAtivo: '2 colheres (erva fresca)',
    grauAtivo: 'media',
    catalisador: 'Mel Silvestre & Extrato de Menta',
    qtdCatalisador: '1 frasco estéril',
    grauCatalisador: 'baixa',
    efeito: 'Restaura 2d4 + 2 pontos de vida quando ingerida com 1 ação bônus.'
  },
  {
    id: 'pocao_cura_maior',
    nome: 'Poção de Cura Maior (Greater Healing)',
    categoria: 'Poção de Restauração',
    ramo: 'Boticário (Apothecary)',
    ferramenta: 'Suprimentos de Alquimia',
    cdBase: 16,
    tempoHoras: 8,
    custoBasePo: 100,
    solvente: 'Álcool Alquímico Tríplice Destilado',
    grauSolvente: 'alta',
    reagenteAtivo: 'Seiva de Âmbar Dourado ou Sangue Celestial',
    qtdAtivo: '1 ampola lacrada',
    grauAtivo: 'alta',
    catalisador: 'Pó de Pérola Purificada',
    qtdCatalisador: '1 dose de suspensão',
    grauCatalisador: 'alta',
    efeito: 'Restaura 4d4 + 4 pontos de vida quando ingerida.'
  },
  {
    id: 'fogo_alquimico',
    nome: 'Frasco de Fogo Alquímico Líquido',
    categoria: 'Reagente Ofensivo / Cáustico',
    ramo: 'Alkahest',
    ferramenta: 'Suprimentos de Alquimia',
    cdBase: 13,
    tempoHoras: 6,
    custoBasePo: 30,
    solvente: 'Óleo Mineral Volátil Concentrado',
    grauSolvente: 'media',
    reagenteAtivo: 'Cinzas Ardentes Eternas de Elemental ou Enxofre',
    qtdAtivo: '1 fração (pó pirofórico)',
    grauAtivo: 'media',
    catalisador: 'Pó de Carvão Betuminoso e Fósforo',
    qtdCatalisador: '1 porção',
    grauCatalisador: 'media',
    efeito: 'Arremesso até 6m. Inflama em contato com ar: alvo sofre 1d4 de dano de fogo no início de cada um dos seus turnos até apagar com CD 10.'
  },
  {
    id: 'acido_concentrado',
    nome: 'Frasco de Solvente Ácido Corrosivo',
    categoria: 'Reagente Ofensivo / Cáustico',
    ramo: 'Alkahest',
    ferramenta: 'Suprimentos de Alquimia',
    cdBase: 14,
    tempoHoras: 6,
    custoBasePo: 25,
    solvente: 'Solução Aquosa de Vitríolo Verde',
    grauSolvente: 'media',
    reagenteAtivo: 'Ácido Digestivo Concentrado de Lodo/Ooze',
    qtdAtivo: '1 frasco de lodo corrosivo',
    grauAtivo: 'alta',
    catalisador: 'Salitre Cristalizado',
    qtdCatalisador: '1 porção',
    grauCatalisador: 'media',
    efeito: 'Ataque à distância (arremesso 6m). Causa 2d6 de dano de ácido ou dissolve fechaduras e dobradiças metálicas ordinárias.'
  },
  {
    id: 'veneno_paralisante',
    nome: 'Toxina Paralisante de Raiz-de-Verme',
    categoria: 'Veneno / Toxina',
    ramo: 'Tintorista & Toxinas (Tincturer)',
    ferramenta: 'Kit de Venenos',
    cdBase: 16,
    tempoHoras: 12,
    custoBasePo: 120,
    solvente: 'Gordura Refinada de Fera Animal',
    grauSolvente: 'media',
    reagenteAtivo: 'Glândula de Veneno de Monstruosidade ou Raiz-de-Verme',
    qtdAtivo: '1 glândula inteira',
    grauAtivo: 'alta',
    catalisador: 'Óleo de Linhaça Espessante',
    qtdCatalisador: '1 frasco',
    grauCatalisador: 'media',
    efeito: 'Veneno de Ferimento (3 aplicações). Criatura ferida faz Salvaguarda de CON CD 13 ou fica Paralisada por 1 minuto (salvaguarda a cada turno).'
  },
  {
    id: 'oleo_afiacao',
    nome: 'Óleo de Afiação Alquímica (Precision Oil)',
    categoria: 'Óleo Especial de Revestimento',
    ramo: 'Boticário (Apothecary)',
    ferramenta: 'Suprimentos de Alquimia',
    cdBase: 15,
    tempoHoras: 8,
    custoBasePo: 75,
    solvente: 'Óleo Puro de Noz e Resina Translúcida',
    grauSolvente: 'alta',
    reagenteAtivo: 'Pó Diamantino de Polimento Mínimo',
    qtdAtivo: '1 dose de suspensão',
    grauAtivo: 'alta',
    catalisador: 'Casca de Carvalho de Ferro Calcinada',
    qtdCatalisador: '1 fração',
    grauCatalisador: 'media',
    efeito: 'Banhado em uma arma por 1 hora: concede +1 nas jogadas de ataque e dano e ignora resistências não mágicas por 1 hora.'
  }
];

export function criarEstadoInicialAlchemy() {
  return {
    passoAtual: 1,
    // Passo 1: Alquimista
    personagemId: '',
    nomeAlquimista: 'Alquimista Autônomo',
    ramo: 'Boticário (Apothecary)',
    ferramenta: 'Suprimentos de Alquimia',
    atributoChave: 'int', // 'int' ou 'sab'
    bonusAlquimia: 5,
    // Passo 2: Fórmula e Preparado
    categoria: 'Poção de Restauração',
    nomeFormula: 'Poção de Cura Comum',
    cdBase: 12,
    tempoHoras: 4,
    custoEstimadoPo: 25,
    efeitoFormula: 'Restaura 2d4 + 2 pontos de vida quando ingerida.',
    formaAplicacao: 'Ingestão (Poção / Bebida)',
    // Passo 3: Solvente e Reagentes
    solventeBase: 'Água Destilada Purificada & Álcool Neutro',
    grauSolvente: 'media',
    reagenteAtivo: 'Raiz-Sangue Macerada',
    qtdAtivo: '2 colheres',
    grauAtivo: 'media',
    catalisador: 'Mel Silvestre & Extrato de Menta',
    qtdCatalisador: '1 frasco estéril',
    grauCatalisador: 'baixa',
    estabilizador: 'nenhum', // 'nenhum', 'carvao', 'perola', 'enxofre'
    // Passo 4: Laboratório e Decantação
    instalacaoLab: 'padrao', // 'padrao' (0), 'portatil' (+2), 'mestre' (-1)
    metodoExtracao: 'destilacao', // 'destilacao', 'maceramento', 'decoccao'
    tempoDecantacaoHoras: 4,
    // Passo 5 e 6: Rolagem
    modoRolagem: 'normal',
    modificadorExtraManual: 0,
    sessaoEsforco: null,
    ultimoResultado: null
  };
}

export function renderWizardAlchemy(container, state, onUpdateState, onIrParaBanco) {
  const passo = state.passoAtual || 1;

  // Cálculo do menor grau entre solvente, ativo e catalisador
  const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
  const grausUsados = [state.grauSolvente, state.grauAtivo, state.grauCatalisador];
  grausUsados.sort((a, b) => ordemGraus.indexOf(a) - ordemGraus.indexOf(b));
  const menorGrau = grausUsados[0] || 'media';
  const modMenorGrau = GRAUS_MATERIAL[menorGrau]?.modificadorCd ?? 0;

  let modLab = 0;
  if (state.instalacaoLab === 'portatil') modLab = 2;
  if (state.instalacaoLab === 'mestre') modLab = -1;

  let modEstabilizador = 0;
  if (state.estabilizador === 'perola') modEstabilizador = -1;
  if (state.estabilizador === 'enxofre') modEstabilizador = -1;

  const cdFinalCalculada = Math.max(8, Number(state.cdBase) + modMenorGrau + modLab + modEstabilizador);
  const tempoTotal = Number(state.tempoHoras || 4) + Number(state.tempoDecantacaoHoras || 0);
  const custoFinalPo = Math.round(Number(state.custoEstimadoPo) * (GRAUS_MATERIAL[menorGrau]?.multiplicadorPreco ?? 1));

  const calc = {
    cdFinalCalculada,
    menorGrau,
    tempoTotal,
    custoFinalPo
  };

  container.innerHTML = `
    <div class="ac-wizard-container">

      <!-- HEADER ALQUIMIA -->
      <div class="ac-wizard-header" style="border-color: rgba(46, 124, 109, 0.4);">
        <div class="ac-wizard-title-row">
          <div class="ac-wizard-title">
            <span class="ac-wizard-icon">⚗️</span>
            <div>
              <h3>Processo de Alquimia & Destilação (Alchemy)</h3>
              <p class="ac-wizard-subtitle">Regras da Parte 2 • Poções, Elixires, Fogo Alquímico, Ácidos, Óleos e Toxinas</p>
            </div>
          </div>
          <div class="ac-wizard-badge-posto" style="background: rgba(46, 124, 109, 0.18); border-color: rgba(46, 124, 109, 0.5); color: #34d399;">
            Ficha de Alquimia • Etapa ${passo} de 7
          </div>
        </div>

        <!-- TRACKER DE ETAPAS COM NAVEGAÇÃO DESLIZÁVEL -->
        <div class="ac-steps-tracker-wrapper">
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-alch-step-prev" type="button" aria-label="Passo anterior">‹</button>
          <div class="ac-steps-tracker" id="ac-alch-steps-tracker" role="tablist">
            ${[
              { num: 1, label: 'Alquimista', icon: '🧑‍🔬' },
              { num: 2, label: 'Fórmula & Tipo', icon: '🧪' },
              { num: 3, label: 'Solvente & Reagentes', icon: '🌿' },
              { num: 4, label: 'Laboratório & Método', icon: '🔬' },
              { num: 5, label: 'Revisão da Ficha', icon: '📋' },
              { num: 6, label: 'Destilação & Teste', icon: '🎲' },
              { num: 7, label: 'Ficha Concluída', icon: '📜' }
            ].map(s => `
              <div class="ac-step-node ${s.num === passo ? 'ativo' : ''} ${s.num < passo ? 'concluido' : ''}"
                   onclick="window._acMudarPassoAlchemy(${s.num})" title="Ir para Passo ${s.num}: ${s.label}">
                <div class="ac-step-circle">${s.num < passo ? '✓' : s.icon}</div>
                <span class="ac-step-label">${s.label}</span>
              </div>
            `).join('')}
          </div>
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-alch-step-next" type="button" aria-label="Próximo passo">›</button>
        </div>
      </div>

      <!-- RESUMO RÁPIDO AO VIVO NO MOBILE -->
      <div class="ac-wizard-mobile-summary" aria-label="Resumo rápido de alquimia">
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CD FINAL</span>
          <span class="ac-mob-summary-val gold">${cdFinalCalculada}</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">QUALIDADE</span>
          <span class="ac-mob-summary-val" style="color: ${GRAUS_MATERIAL[menorGrau]?.cor || '#34d399'};">
            ${GRAUS_MATERIAL[menorGrau]?.nome || 'Média'}
          </span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">TEMPO TOTAL</span>
          <span class="ac-mob-summary-val">${tempoTotal}h</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CUSTO</span>
          <span class="ac-mob-summary-val">${custoFinalPo} PO</span>
        </div>
      </div>

      <!-- BODY GRID -->
      <div class="ac-wizard-body-grid">
        
        <div class="ac-wizard-content-card">
          ${_renderConteudoPassoAlchemy(passo, state, {
            cdFinalCalculada,
            menorGrau,
            tempoTotal,
            custoFinalPo
          })}

          <div class="ac-wizard-nav-footer">
            <button class="btn btn-outline" id="ac-alch-btn-voltar" ${passo === 1 ? 'disabled style="opacity:0.4;"' : ''}>
              ← Voltar Passo
            </button>
            <div class="ac-nav-center-info">
              Passo ${passo} de 7 • ${passo === 7 ? 'Ficha Final de Alquimia' : 'Condução Guiada'}
            </div>
            ${passo < 6 ? `
              <button class="btn btn-primary" id="ac-alch-btn-avancar">
                Avançar Passo →
              </button>
            ` : passo === 6 ? `
              <button class="btn btn-primary" id="ac-alch-btn-avancar-ficha" ${!state.ultimoResultado ? 'disabled style="opacity:0.5;" title="Execute a destilação para avançar"' : ''}>
                Ver Ficha de Alquimia →
              </button>
            ` : `
              <button class="btn btn-primary" id="ac-alch-btn-novo-processo">
                Iniciar Nova Destilação ⚗️
              </button>
            `}
          </div>
        </div>

        <!-- SIDEBAR DE PREVIEW ALQUIMIA -->
        <div class="ac-sheet-preview-sidebar">
          <div class="ac-sheet-mini-card">
            <div class="ac-sheet-mini-header" style="border-bottom-color: rgba(46, 124, 109, 0.3);">
              <span class="ac-sheet-mini-tag" style="background: rgba(46, 124, 109, 0.2); color: #34d399;">Ficha de Alquimia</span>
              <h4 class="ac-sheet-mini-title">${escHtml(state.nomeFormula || 'Solução Sem Nome')}</h4>
            </div>

            <div class="ac-sheet-mini-metrics">
              <div class="ac-metric-box">
                <span class="ac-metric-label">CD FINAL</span>
                <span class="ac-metric-val" style="color: #34d399;">${cdFinalCalculada}</span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">PUREZA FINAL</span>
                <span class="ac-metric-val" style="color: ${GRAUS_MATERIAL[menorGrau]?.cor || '#34d399'}; font-size: 0.95rem;">
                  ${GRAUS_MATERIAL[menorGrau]?.nome || 'Média'}
                </span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">TEMPO / REPOUSO</span>
                <span class="ac-metric-val">${tempoTotal}h</span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">CUSTO TOTAL</span>
                <span class="ac-metric-val">${custoFinalPo} po</span>
              </div>
            </div>

            <div class="ac-sheet-mini-list">
              <div class="ac-mini-row">
                <span class="k">Alquimista:</span>
                <span class="v">${escHtml(state.nomeAlquimista)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Ramo:</span>
                <span class="v">${escHtml(state.ramo)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Bônus Síntese:</span>
                <span class="v text-highlight">+${state.bonusAlquimia}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Solvente Base:</span>
                <span class="v">${escHtml(state.solventeBase)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Reagente Ativo:</span>
                <span class="v">${escHtml(state.reagenteAtivo)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Laboratório:</span>
                <span class="v">${state.instalacaoLab === 'mestre' ? 'Mestre (-1 CD)' : state.instalacaoLab === 'portatil' ? 'Portátil (+2 CD)' : 'Padrão (0)'}</span>
              </div>
            </div>

            <div class="ac-sheet-mini-actions">
              <button class="btn btn-sm btn-outline w-100" id="ac-alch-btn-ver-materiais">
                📖 Consultar Reagentes & Biomas
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  _setupEventosAlchemy(container, state, onUpdateState, onIrParaBanco, calc);
}

function _renderConteudoPassoAlchemy(passo, state, calc) {
  switch (passo) {
    case 1:
      return _renderPasso1Alch(state);
    case 2:
      return _renderPasso2Alch(state);
    case 3:
      return _renderPasso3Alch(state);
    case 4:
      return _renderPasso4Alch(state, calc);
    case 5:
      return _renderPasso5Alch(state, calc);
    case 6:
      return _renderPasso6Alch(state, calc);
    case 7:
      return _renderPasso7Alch(state, calc);
    default:
      return '';
  }
}

// Passo 1: Alquimista
function _renderPasso1Alch(state) {
  const chars = listarPersonagens();
  const ramos = [
    { id: 'Boticário (Apothecary)', icon: '🌱', ferramenta: 'Kit de Herbalismo', desc: 'Especialista em poções de cura, elixires revigorantes, sais reanimadores e antídotos.' },
    { id: 'Alkahest', icon: '🔥', ferramenta: 'Suprimentos de Alquimia', desc: 'Especialista em fogo alquímico, solventes corrosivos de metal, pós cegantes e ácidos.' },
    { id: 'Tintorista & Toxinas (Tincturer)', icon: '🧪', ferramenta: 'Kit de Venenos', desc: 'Especialista em venenos por contato, ferimento ou ingestão, óleos paralisantes e entorpecentes.' }
  ];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 1: Identificação do Alquimista & Ramo Científico</h4>
        <span class="ac-step-pill">Parte 2: Alquimia & Tradição</span>
      </div>
      <p class="ac-step-desc">
        A alquimia requer destilação meticulosa e conhecimento hermético de botânica, zoologia ou substâncias corrosivas. Escolha o ramo do praticante e associe ao seu personagem ou componha um alquimista autônomo.
      </p>

      <div class="ac-form-group">
        <label class="ac-label">Vincular a um Personagem Conjurador / Perito:</label>
        <select class="ac-select" id="ac-alch-sel-personagem">
          <option value="">-- Usar Alquimista Autônomo / Personalizado --</option>
          ${chars.map(c => `
            <option value="${c.id}" ${state.personagemId === c.id ? 'selected' : ''}>
              ${escHtml(c.nome)} (Nível ${c.nivel || 1} • ${escHtml(c.classe || 'Aventureiro')})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Nome do Alquimista:</label>
          <input type="text" class="ac-input" id="ac-alch-input-nome" value="${escHtml(state.nomeAlquimista)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Atributo Chave do Teste:</label>
          <select class="ac-select" id="ac-alch-sel-atributo">
            <option value="int" ${state.atributoChave === 'int' ? 'selected' : ''}>Inteligência (Ciência, Laboratório & Arcanismo)</option>
            <option value="sab" ${state.atributoChave === 'sab' ? 'selected' : ''}>Sabedoria (Intuição Herbalista, Medicina & Sobrevivência)</option>
          </select>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Ramo Alquímico de Especialização:</label>
        <div class="ac-cards-choice-grid">
          ${ramos.map(r => `
            <div class="ac-choice-card ${state.ramo === r.id ? 'selecionado' : ''}"
                 onclick="window._acAlchEscolherRamo('${r.id}', '${r.ferramenta}')">
              <div class="ac-choice-top">
                <span class="ac-choice-icon">${r.icon}</span>
                <span class="ac-choice-name">${r.id}</span>
              </div>
              <p class="ac-choice-desc">${r.desc}</p>
              <span class="ac-choice-tag">${r.ferramenta}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Kit / Ferramentas em Uso:</label>
          <input type="text" class="ac-input" id="ac-alch-input-ferramenta" value="${escHtml(state.ferramenta)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Bônus de Criação Alquímica (Atributo + Proficiência):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarBonus(-1)">-</button>
            <input type="number" class="ac-input text-center" id="ac-alch-input-bonus" value="${state.bonusAlquimia}" min="-2" max="20">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarBonus(1)">+</button>
          </div>
        </div>
      </div>

    </div>
  `;
}

// Passo 2: Fórmula e Preparado
function _renderPasso2Alch(state) {
  const categorias = [
    'Poção de Restauração / Cura',
    'Tônico / Elixir de Aprimoramento',
    'Reagente Ofensivo / Cáustico',
    'Veneno / Toxina',
    'Óleo Especial de Revestimento',
    'Solvente Universal'
  ];

  const formas = [
    'Ingestão (Poção / Bebida)',
    'Arremesso / Impacto (Frasco Quebrável)',
    'Revestimento de Arma (Óleo / Veneno de Ferimento)',
    'Contato / Toque Dérmico',
    'Inalação (Gás / Névoa Tóxica)'
  ];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 2: Definição da Fórmula Alquímica</h4>
        <span class="ac-step-pill">Regra: Solução & Efeitos</span>
      </div>
      <p class="ac-step-desc">
        Escolha uma fórmula pré-definida ou monte um composto original especificando seus efeitos, tempo de destilação e Dificuldade Base (CD Base).
      </p>

      <!-- CARREGAR MODELOS ALQUÍMICOS & APÊNDICE 2 -->
      <div class="ac-quick-load-box">
        <div class="ac-quick-load-label">
          <span>📜 Receitas Básicas do Apêndice 2 (Oficiais do Livro):</span>
          <small class="text-muted">Selecione para alimentar automaticamente a fórmula, CD, tempo e reagentes</small>
        </div>
        <select class="ac-select" onchange="window._acAlchCarregarReceitaApendice2(this.value)" style="margin-top: 6px;">
          <option value="">-- Selecionar Receita Básica do Apêndice 2 --</option>
          ${APENDICE2_ALQUIMIA.receitas_basicas.map(r => `
            <option value="${r.id}">Tier ${r.tier}: ${r.nome} (CD ${r.cdBase}, ${r.tempoHoras}h, ${r.custoPo} PO)</option>
          `).join('')}
        </select>
        <div class="ac-quick-pills-row" style="margin-top: 8px;">
          ${MODELOS_BASE_ALCHEMY.map(m => `
            <button class="ac-quick-pill" onclick="window._acAlchCarregarModelo('${m.id}')">
              ${m.nome}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Categoria do Preparado:</label>
          <select class="ac-select" id="ac-alch-sel-categoria">
            ${categorias.map(cat => `
              <option value="${cat}" ${state.categoria === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Nome da Fórmula / Preparado:</label>
          <input type="text" class="ac-input" id="ac-alch-input-formula" value="${escHtml(state.nomeFormula)}">
        </div>
      </div>

      <div class="ac-form-grid-3">
        <div class="ac-form-group">
          <label class="ac-label">CD Base da Fórmula:</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarCdBase(-1)">-</button>
            <input type="number" class="ac-input text-center font-bold" id="ac-alch-input-cdbase" value="${state.cdBase}" min="8" max="30">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarCdBase(1)">+</button>
          </div>
          <small class="ac-hint">Básica: 11-13 • Maior: 15-17 • Rara/Letal: 18-22</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Tempo de Destilação (Horas):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarTempo(-2)">-2h</button>
            <input type="number" class="ac-input text-center" id="ac-alch-input-tempo" value="${state.tempoHoras}" min="1" max="100">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarTempo(2)">+2h</button>
          </div>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Forma de Aplicação:</label>
          <select class="ac-select" id="ac-alch-sel-forma">
            ${formas.map(f => `
              <option value="${f}" ${state.formaAplicacao === f ? 'selected' : ''}>${f}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Efeitos Alquímicos & Propriedades:</label>
        <textarea class="ac-textarea" rows="2" id="ac-alch-input-efeito">${escHtml(state.efeitoFormula)}</textarea>
      </div>

    </div>
  `;
}

// Passo 3: Solvente e Reagentes
function _renderPasso3Alch(state) {
  const graus = Object.values(GRAUS_MATERIAL);

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 3: Solvente Base, Reagentes & Estabilizadores</h4>
        <span class="ac-step-pill">Regra de Pureza & CD</span>
      </div>
      <p class="ac-step-desc">
        A alquimia baseia-se em um <strong>Solvente Base Líquido</strong> que transporta o <strong>Princípio Ativo Primário</strong>. O menor grau de pureza entre os reagentes determina a pureza final da solução e ajusta a CD de criação.
      </p>

      <!-- SOLVENTE BASE -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">1. Solvente Base (Veículo Líquido)</span>
          <span class="ac-box-sub">Álcool alquímico, água destilada, óleo vegetal, salmoura</span>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Substratos Oficiais do Apêndice 2 (Tiers 1 a 5):</label>
          <select class="ac-select" onchange="window._acAlchAplicarSubstratoApendice2(this.value)">
            <option value="">-- Escolher Substrato do Apêndice 2 --</option>
            ${APENDICE2_ALQUIMIA.substratos.map(s => `
              <option value="${s.id}">Tier ${s.tier}: ${s.nome} (${s.estabilidade} • ${s.cdMod > 0 ? `+${s.cdMod}` : s.cdMod} CD)</option>
            `).join('')}
          </select>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Nome do Solvente:</label>
          <input type="text" class="ac-input" id="ac-alch-solvente-nome" value="${escHtml(state.solventeBase)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau de Pureza do Solvente:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauSolvente === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauSolvente" value="${g.id}" ${state.grauSolvente === g.id ? 'checked' : ''}
                       onchange="window._acAlchAlterarGrau('solvente', '${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- REAGENTE ATIVO -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">2. Reagente Primário (Princípio Ativo)</span>
          <span class="ac-box-sub">Erva colhida, glândula de monstro, fungo, mineral</span>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Reagentes Oficiais do Apêndice 2 (Tiers 1 a 5 & Criaturas):</label>
          <select class="ac-select" onchange="window._acAlchAplicarReagenteApendice2(this.value)">
            <option value="">-- Escolher Reagente do Apêndice 2 --</option>
            <optgroup label="Reagentes por Efeito (Tiers 1 a 5)">
              ${APENDICE2_ALQUIMIA.reagentes.map(r => `
                <option value="${r.id}">Tier ${r.tier}: ${r.nome} (${r.tipoEfeito}) • ${r.efeitoPrincipal}</option>
              `).join('')}
            </optgroup>
          </select>
        </div>
        <div class="ac-form-grid-2">
          <div class="ac-form-group">
            <label class="ac-label">Nome do Reagente Ativo:</label>
            <input type="text" class="ac-input" id="ac-alch-ativo-nome" value="${escHtml(state.reagenteAtivo)}">
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Quantidade / Fração:</label>
            <input type="text" class="ac-input" id="ac-alch-ativo-qtd" value="${escHtml(state.qtdAtivo)}">
          </div>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau do Reagente Ativo:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauAtivo === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauAtivo" value="${g.id}" ${state.grauAtivo === g.id ? 'checked' : ''}
                       onchange="window._acAlchAlterarGrau('ativo', '${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- REAGENTE CATALISADOR -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">3. Reagente Secundário / Catalisador</span>
          <span class="ac-box-sub">Sal marinho, pó de quartzo, menta, enxofre, carvão ativado</span>
        </div>
        <div class="ac-form-grid-2">
          <div class="ac-form-group">
            <label class="ac-label">Nome do Catalisador:</label>
            <input type="text" class="ac-input" id="ac-alch-catalisador-nome" value="${escHtml(state.catalisador)}">
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Quantidade / Lote:</label>
            <input type="text" class="ac-input" id="ac-alch-catalisador-qtd" value="${escHtml(state.qtdCatalisador)}">
          </div>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau do Catalisador:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauCatalisador === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauCatalisador" value="${g.id}" ${state.grauCatalisador === g.id ? 'checked' : ''}
                       onchange="window._acAlchAlterarGrau('catalisador', '${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- ESTABILIZADOR OPCIONAL -->
      <div class="ac-form-group">
        <label class="ac-label">Agente Estabilizador Químico (Opcional):</label>
        <select class="ac-select" id="ac-alch-sel-estabilizador">
          <option value="nenhum" ${state.estabilizador === 'nenhum' ? 'selected' : ''}>Nenhum Agente Estabilizador (0)</option>
          <option value="perola" ${state.estabilizador === 'perola' ? 'selected' : ''}>Pó de Pérola Purificada (-1 na CD)</option>
          <option value="enxofre" ${state.estabilizador === 'enxofre' ? 'selected' : ''}>Enxofre Sublimado (-1 na CD)</option>
          <option value="carvao" ${state.estabilizador === 'carvao' ? 'selected' : ''}>Carvão Vegetal Ativado (Neutraliza vapores nocivos)</option>
        </select>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Custo Estimado dos Reagentes (PO):</label>
        <input type="number" class="ac-input" id="ac-alch-input-custo" value="${state.custoEstimadoPo}">
      </div>

    </div>
  `;
}

// Passo 4: Laboratório e Métodos
function _renderPasso4Alch(state, calc) {
  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 4: Métodos de Laboratório & Decantação</h4>
        <span class="ac-step-pill">Parte 2: Instalações & Alambiques</span>
      </div>
      <p class="ac-step-desc">
        A reação exige recipientes herméticos, controle de temperatura e decantação adequada para estabilizar as ligações dos reagentes.
      </p>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Laboratório e Instalações:</label>
          <select class="ac-select" id="ac-alch-sel-lab">
            <option value="padrao" ${state.instalacaoLab === 'padrao' ? 'selected' : ''}>Laboratório Completo de Alquimia (0 CD)</option>
            <option value="mestre" ${state.instalacaoLab === 'mestre' ? 'selected' : ''}>Laboratório de Mestre com Vidrarias Reforçadas (-1 CD)</option>
            <option value="portatil" ${state.instalacaoLab === 'portatil' ? 'selected' : ''}>Kit Portátil de Campanha (+2 CD)</option>
          </select>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Método Principal de Extração:</label>
          <select class="ac-select" id="ac-alch-sel-metodo">
            <option value="destilacao" ${state.metodoExtracao === 'destilacao' ? 'selected' : ''}>Destilação Térmica Fracionada (Alambique)</option>
            <option value="maceramento" ${state.metodoExtracao === 'maceramento' ? 'selected' : ''}>Maceração a Frio com Almofariz e Pilão</option>
            <option value="decoccao" ${state.metodoExtracao === 'decoccao' ? 'selected' : ''}>Decocção e Fervura em Retorta</option>
          </select>
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Tempo de Decantação / Repouso (Horas):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarDecantacao(-2)">-2h</button>
            <input type="number" class="ac-input text-center" id="ac-alch-input-decantacao" value="${state.tempoDecantacaoHoras}" min="0" max="48">
            <button class="ac-spin-btn" onclick="window._acAlchAjustarDecantacao(2)">+2h</button>
          </div>
          <small class="ac-hint">Tempo para os sólidos precipitarem no fundo do frasco.</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Tempo Total Estimado de Preparo:</label>
          <div class="ac-input-display-static gold">
            ${calc.tempoTotal} horas
          </div>
        </div>
      </div>

    </div>
  `;
}

// Passo 5: Revisão
function _renderPasso5Alch(state, calc) {
  const modMenorGrau = GRAUS_MATERIAL[calc.menorGrau]?.modificadorCd ?? 0;
  let modLab = 0;
  if (state.instalacaoLab === 'portatil') modLab = 2;
  if (state.instalacaoLab === 'mestre') modLab = -1;
  let modEst = 0;
  if (state.estabilizador === 'perola' || state.estabilizador === 'enxofre') modEst = -1;

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 5: Revisão da Ficha de Alquimia & CD Final</h4>
        <span class="ac-step-pill">Balanço Químico</span>
      </div>
      <p class="ac-step-desc">
        Aqueça os queimadores e prepare o condensador. A Dificuldade Final reúne o grau de pureza dos reagentes com as instalações do seu laboratório.
      </p>

      <div class="ac-formula-breakdown-card">
        <div class="ac-formula-title">CÁLCULO DA DIFICULDADE DA DESTILAÇÃO (CD FINAL)</div>
        <div class="ac-formula-grid">
          <div class="ac-formula-col">
            <span class="label">CD da Fórmula</span>
            <span class="val">${state.cdBase}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Pureza (${GRAUS_MATERIAL[calc.menorGrau]?.nome})</span>
            <span class="val">${modMenorGrau >= 0 ? `+${modMenorGrau}` : modMenorGrau}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Laboratório / Estabilizador</span>
            <span class="val">${(modLab + modEst) >= 0 ? `+${modLab + modEst}` : (modLab + modEst)}</span>
          </div>
          <div class="ac-formula-op">=</div>
          <div class="ac-formula-col total">
            <span class="label">CD FINAL DA DESTILAÇÃO</span>
            <span class="val text-success">${calc.cdFinalCalculada}</span>
          </div>
        </div>
      </div>

      <div class="ac-review-table">
        <div class="ac-review-row">
          <span class="k">Fórmula / Solução:</span>
          <span class="v font-bold">${escHtml(state.nomeFormula)} (${escHtml(state.categoria)})</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Alquimista:</span>
          <span class="v">${escHtml(state.nomeAlquimista)} • Bônus Síntese: +${state.bonusAlquimia}</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Solvente Base:</span>
          <span class="v">${escHtml(state.solventeBase)} (${GRAUS_MATERIAL[state.grauSolvente]?.nome})</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Reagente Ativo:</span>
          <span class="v">${escHtml(state.reagenteAtivo)} (${escHtml(state.qtdAtivo)}) • ${GRAUS_MATERIAL[state.grauAtivo]?.nome}</span>
        </div>
        <div class="ac-review-row highlight">
          <span class="k">Meta de Esforço Acumulado (UE):</span>
          <span class="v gold font-bold">${calcularEsforcoAlvo('alchemy', state, calc)} UE (estimativa de ${Math.ceil(calcularEsforcoAlvo('alchemy', state, calc) / 7)} ciclos de destilação)</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Dinâmica de Síntese (D&D 5.5e):</span>
          <span class="v text-muted" style="font-size:0.85rem;">Sequência de ciclos de purificação contra o Nível de Instabilidade (CD ${calc.cdFinalCalculada}). Vapores e falhas acumulam Níveis de Exaustão (-2 cumulativo em cada d20 seguinte).</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Pureza Final Obtida:</span>
          <span class="v" style="color:${GRAUS_MATERIAL[calc.menorGrau]?.cor}; font-weight:700;">${GRAUS_MATERIAL[calc.menorGrau]?.nome}</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Tempo de Preparo & Repouso:</span>
          <span class="v">${calc.tempoTotal} horas</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Custo dos Ingredientes:</span>
          <span class="v font-bold">${calc.custoFinalPo} po</span>
        </div>
      </div>

    </div>
  `;
}

// Passo 6: Execução Alquímica (Ciclos de Destilação & Esforço Acumulado)
function _renderPasso6Alch(state, calc) {
  const cd = calc.cdFinalCalculada;

  if (!state.sessaoEsforco) {
    state.sessaoEsforco = inicializarSessaoEsforco('alchemy', state, calc);
  }

  const arenaHtml = renderizarArenaEsforcoHTML(state.sessaoEsforco, {
    cdCiclo: cd,
    bonusBase: Number(state.bonusAlquimia),
    modificadorExtraManual: Number(state.modificadorExtraManual || 0),
    modoRolagem: state.modoRolagem || 'normal'
  }, {
    rolarCiclo: "window._acAlchRolarCiclo()",
    autoResolver: "window._acAlchAutoResolver()",
    descansar: "window._acAlchDescansar()",
    reiniciarSessao: "window._acAlchReiniciarSessao()",
    avancarFicha: "window._acAlchAvancarFicha()",
    setModo: "window._acAlchSetModoRolagem",
    ajustarExtra: "window._acAlchAjustarExtra"
  });

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 6: Síntese Alquímica • Ciclos de Destilação & Esforço Acumulado</h4>
        <span class="ac-step-pill">Regras Oficiais D&D 5.5e • Vapores & Exaustão</span>
      </div>
      <p class="ac-step-desc">
        A alquimia exige <strong>ciclos sucessivos de purificação, decantação e equilíbrio de reagentes</strong>: cada etapa acumula estabilidade rumo à <strong>Meta de Esforço (${state.sessaoEsforco.esforcoAlvo} UE)</strong> contra a <strong>CD ${cd}</strong>. Vapores cáusticos ou trabalho contínuo geram <strong>Níveis de Exaustão (D&D 5.5e: -2 por nível)</strong>, turvando a percepção do alquimista se não gerenciar o descanso!
      </p>

      <div class="ac-rules-pills-grid">
        <div class="ac-rule-pill-item win-nat">
          <strong>20 Natural (Transcendental):</strong> Cristalização instantânea e salto massivo de estabilidade (+rendimento).
        </div>
        <div class="ac-rule-pill-item win">
          <strong>Sucesso (≥ CD):</strong> Decantação límpida. Avanço seguro no progresso acumulado da mistura.
        </div>
        <div class="ac-rule-pill-item fail">
          <strong>Falha (&lt; CD):</strong> Turbidez na solução. Risco de inalação de vapores tóxicos (teste de CON ou Exaustão).
        </div>
        <div class="ac-rule-pill-item fail-nat">
          <strong>Exaustão (D&D 5.5e):</strong> -2 cumulativo em d20. Descansar e ventilar o laboratório restaura -1 nível.
        </div>
      </div>

      ${arenaHtml}

    </div>
  `;
}

// Passo 7: Ficha Oficial de Alquimia
function _renderPasso7Alch(state, calc) {
  const ult = state.ultimoResultado || {
    total: calc.cdFinalCalculada + 2,
    cdFinal: calc.cdFinalCalculada,
    sucesso: true,
    obraPrima: false,
    menorGrau: calc.menorGrau,
    dadoEscolhido: 15,
    modTotal: state.bonusAlquimia,
    logRegra: 'Fórmula sintetizada com sucesso.'
  };

  const grauInfo = GRAUS_MATERIAL[ult.menorGrau || calc.menorGrau];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 7: Ficha de Alquimia Oficial Concluída</h4>
        <span class="ac-step-pill">Modelo Oficial de Alquimia • Nord Games</span>
      </div>
      <p class="ac-step-desc">
        Modelo virtual idêntico à <strong>Ficha de Alquimia</strong> ao final da Parte 2 do livro de regras, totalmente documentada e assinada.
      </p>

      <div class="ac-official-sheet-card" id="ac-alchemy-sheet-print" style="border-color: rgba(46, 124, 109, 0.45);">
        
        <div class="ac-of-sheet-header" style="border-bottom-color: rgba(46, 124, 109, 0.3);">
          <div class="ac-of-sheet-seal">⚗️</div>
          <div class="ac-of-sheet-titles">
            <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 2</span>
            <h2 class="ac-of-sheet-main-title">FICHA DE PREPARADO ALQUÍMICO (ALCHEMY SHEET)</h2>
            <span class="ac-of-sheet-sub">Caderno de Destilação, Soluções & Elixires</span>
          </div>
          <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
            ${ult.obraPrima ? 'TRANSCENDENTAL' : ult.sucesso ? 'ESTABILIZADA' : 'FALHA DE SÍNTESE'}
          </div>
        </div>

        <div class="ac-of-sheet-grid-2">
          <div class="ac-of-field">
            <label>NOME DO ALQUIMISTA / PRATICANTE</label>
            <div class="value">${escHtml(state.nomeAlquimista)}</div>
          </div>
          <div class="ac-of-field">
            <label>RAMO CIENTÍFICO & FERRAMENTAS</label>
            <div class="value">${escHtml(state.ramo)} • ${escHtml(state.ferramenta)}</div>
          </div>
          <div class="ac-of-field">
            <label>MÉTODO DE EXTRAÇÃO & LABORATÓRIO</label>
            <div class="value">${state.metodoExtracao.toUpperCase()} • ${state.instalacaoLab === 'mestre' ? 'Laboratório de Mestre' : 'Laboratório Padrão'}</div>
          </div>
          <div class="ac-of-field">
            <label>FORMA DE APLICAÇÃO</label>
            <div class="value">${escHtml(state.formaAplicacao)}</div>
          </div>
        </div>

        <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DA SOLUÇÃO / POÇÃO</div>
        <div class="ac-of-sheet-grid-3">
          <div class="ac-of-field">
            <label>NOME DA FÓRMULA</label>
            <div class="value font-bold" style="color: #34d399;">${escHtml(state.nomeFormula)} ${ult.obraPrima ? '(Dose Dupla)' : ''}</div>
          </div>
          <div class="ac-of-field">
            <label>CATEGORIA</label>
            <div class="value">${escHtml(state.categoria)}</div>
          </div>
          <div class="ac-of-field">
            <label>TEMPO DE PREPARO / REPOUSO</label>
            <div class="value">${calc.tempoTotal} horas</div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>EFEITOS & PROPRIEDADES DA SUBSTÂNCIA</label>
          <div class="value">${escHtml(state.efeitoFormula)}</div>
        </div>

        <div class="ac-of-sheet-section-title">COMPOSIÇÃO DE SOLVENTE & REAGENTES</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>FUNÇÃO</th>
                <th>SUBSTÂNCIA</th>
                <th>QUANTIDADE</th>
                <th>GRAU DE PUREZA</th>
                <th>MOD. CD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Solvente Base</strong></td>
                <td>${escHtml(state.solventeBase)}</td>
                <td>1 frasco de base líquida</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauSolvente]?.cor}">${GRAUS_MATERIAL[state.grauSolvente]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauSolvente]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauSolvente]?.modificadorCd}` : GRAUS_MATERIAL[state.grauSolvente]?.modificadorCd}</td>
              </tr>
              <tr>
                <td><strong>Reagente Ativo</strong></td>
                <td>${escHtml(state.reagenteAtivo)}</td>
                <td>${escHtml(state.qtdAtivo)}</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauAtivo]?.cor}">${GRAUS_MATERIAL[state.grauAtivo]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauAtivo]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauAtivo]?.modificadorCd}` : GRAUS_MATERIAL[state.grauAtivo]?.modificadorCd}</td>
              </tr>
              <tr>
                <td><strong>Catalisador</strong></td>
                <td>${escHtml(state.catalisador)}</td>
                <td>${escHtml(state.qtdCatalisador)}</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauCatalisador]?.cor}">${GRAUS_MATERIAL[state.grauCatalisador]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd}` : GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="ac-of-sheet-section-title">RESOLUÇÃO DE ALQUIMIA • ESFORÇO ACUMULADO & CICLOS (D&D 5.5e)</div>
        <div class="ac-of-sheet-grid-4">
          <div class="ac-of-field">
            <label>NÍVEL DE INSTABILIDADE (IL)</label>
            <div class="value font-bold" style="color: #34d399;">CD ${ult.cdFinal}</div>
          </div>
          <div class="ac-of-field">
            <label>ESTABILIDADE ACUMULADA (UE)</label>
            <div class="value font-bold gold">${ult.progressoAtual !== undefined ? ult.progressoAtual : (state.sessaoEsforco?.progressoAtual || ult.total)} / ${ult.esforcoAlvo || state.sessaoEsforco?.esforcoAlvo || 20} UE</div>
          </div>
          <div class="ac-of-field">
            <label>CICLOS DE DESTILAÇÃO</label>
            <div class="value font-bold">${ult.ciclosCount || state.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1} ciclos executados</div>
          </div>
          <div class="ac-of-field">
            <label>EXAUSTÃO DO ALQUIMISTA</label>
            <div class="value font-bold" style="color: ${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).cor};">
              Nível ${ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0} (${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).rotulo})
            </div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
          <div class="value">${ult.logRegra}</div>
        </div>

        <!-- HISTÓRICO DE CICLOS ALQUÍMICOS (D&D 5.5e) -->
        ${state.sessaoEsforco?.ciclosExecutados?.length > 0 ? `
          <div class="ac-of-sheet-section-title">HISTÓRICO DE DESTILAÇÕES & ESFORÇO ACUMULADO (D&D 5.5e)</div>
          <div class="ac-of-table-container">
            <table class="ac-of-table">
              <thead>
                <tr>
                  <th>CICLO</th>
                  <th>DADO D20</th>
                  <th>BÔNUS</th>
                  <th>PEN. EXAUSTÃO</th>
                  <th>TOTAL VS CD</th>
                  <th>ESTABILIDADE</th>
                  <th>ACUMULADO</th>
                  <th>EXAUSTÃO</th>
                  <th>PARECER DA BANCADA</th>
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

        <div class="ac-of-sheet-footer">
          <span>Assinatura do Alquimista: <em>${escHtml(state.nomeAlquimista)}</em></span>
          <span>Selo de Farmacopeia: <strong>Aprovado Arcane Craft</strong></span>
          <span>Data: ${new Date().toLocaleDateString()}</span>
        </div>

      </div>

      <div class="ac-sheet-actions-bar">
        ${state.personagemId && ult.sucesso ? `
          <button class="btn btn-primary ac-btn-add-inv" id="ac-alch-btn-adicionar-inventario" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%);">
            📥 Adicionar Poção/Solução ao Inventário do Personagem
          </button>
        ` : ''}

        <button class="btn btn-outline" id="ac-alch-btn-copiar-ficha">
          📋 Copiar Resumo da Ficha
        </button>

        <button class="btn btn-outline" id="ac-alch-btn-salvar-caderno">
          💾 Salvar no Caderno de Fichas
        </button>

        <button class="btn btn-outline" id="ac-alch-btn-imprimir">
          🖨️ Imprimir / Salvar PDF
        </button>

        <button class="btn btn-outline" id="ac-alch-btn-reiniciar">
          🔄 Nova Alquimia
        </button>
      </div>

    </div>
  `;
}

function _setupEventosAlchemy(container, state, onUpdateState, onIrParaBanco, calc) {
  // Inicializa deslizamento suave e centralização automática no passo ativo
  const stepsTracker = container.querySelector('#ac-alch-steps-tracker');
  const stepPrev = container.querySelector('#ac-alch-step-prev');
  const stepNext = container.querySelector('#ac-alch-step-next');
  if (stepsTracker) {
    tornarBarraDeslizavel(stepsTracker, {
      btnEsquerda: stepPrev,
      btnDireita: stepNext,
      passoScroll: 180,
      centralizarAtivo: true,
      seletorAtivo: '.ac-step-node.ativo'
    });
  }

  window._acMudarPassoAlchemy = (novoPasso) => {
    state.passoAtual = Math.max(1, Math.min(7, novoPasso));
    onUpdateState(state);
  };

  window._acAlchEscolherRamo = (ramo, ferramenta) => {
    state.ramo = ramo;
    state.ferramenta = ferramenta;
    onUpdateState(state);
  };

  window._acAlchAjustarBonus = (delta) => {
    state.bonusAlquimia = Math.max(-2, Number(state.bonusAlquimia || 0) + delta);
    onUpdateState(state);
  };

  window._acAlchCarregarModelo = (modeloId) => {
    const mod = MODELOS_BASE_ALCHEMY.find(m => m.id === modeloId);
    if (!mod) return;
    state.nomeFormula = mod.nome;
    state.categoria = mod.categoria;
    state.ramo = mod.ramo;
    state.ferramenta = mod.ferramenta;
    state.cdBase = mod.cdBase;
    state.tempoHoras = mod.tempoHoras;
    state.custoEstimadoPo = mod.custoBasePo;
    state.solventeBase = mod.solvente;
    state.grauSolvente = mod.grauSolvente;
    state.reagenteAtivo = mod.reagenteAtivo;
    state.qtdAtivo = mod.qtdAtivo;
    state.grauAtivo = mod.grauAtivo;
    state.catalisador = mod.catalisador;
    state.qtdCatalisador = mod.qtdCatalisador;
    state.grauCatalisador = mod.grauCatalisador;
    state.efeitoFormula = mod.efeito;
    toast(`Fórmula carregada: ${mod.nome}`);
    onUpdateState(state);
  };

  window._acAlchCarregarReceitaApendice2 = (recId) => {
    if (!recId) return;
    const rec = APENDICE2_ALQUIMIA.receitas_basicas.find(r => r.id === recId);
    if (!rec) return;

    state.nomeFormula = rec.nome;
    state.cdBase = rec.cdBase;
    state.tempoHoras = rec.tempoHoras;
    state.custoEstimadoPo = rec.custoPo;
    state.solventeBase = rec.substratoSugerido || state.solventeBase;
    state.reagenteAtivo = rec.reagentesSugeridos || state.reagenteAtivo;
    state.efeitoFormula = rec.efeito;
    toast(`Receita do Apêndice 2 carregada: ${rec.nome} (Tier ${rec.tier})!`, 'success');
    onUpdateState(state);
  };

  window._acAlchAplicarSubstratoApendice2 = (subId) => {
    if (!subId) return;
    const sub = APENDICE2_ALQUIMIA.substratos.find(s => s.id === subId);
    if (!sub) return;

    state.solventeBase = sub.nome;
    if (sub.tier === 1) state.grauSolvente = 'baixa';
    if (sub.tier === 2) state.grauSolvente = 'media';
    if (sub.tier === 3 || sub.tier === 4) state.grauSolvente = 'alta';
    if (sub.tier === 5) state.grauSolvente = 'suprema';

    toast(`Substrato "${sub.nome}" (Tier ${sub.tier}, ${sub.estabilidade}) aplicado!`, 'success');
    onUpdateState(state);
  };

  window._acAlchAplicarReagenteApendice2 = (reagId) => {
    if (!reagId) return;
    const reag = APENDICE2_ALQUIMIA.reagentes.find(r => r.id === reagId);
    if (!reag) return;

    state.reagenteAtivo = reag.nome;
    if (reag.tier === 1) state.grauAtivo = 'baixa';
    if (reag.tier === 2) state.grauAtivo = 'media';
    if (reag.tier === 3 || reag.tier === 4) state.grauAtivo = 'alta';
    if (reag.tier === 5) state.grauAtivo = 'suprema';

    if (reag.efeitoPrincipal && !state.efeitoFormula.includes(reag.efeitoPrincipal)) {
      state.efeitoFormula = state.efeitoFormula
        ? `${state.efeitoFormula} • [${reag.nome}]: ${reag.efeitoPrincipal}`
        : `[${reag.nome}]: ${reag.efeitoPrincipal}`;
    }

    toast(`Reagente "${reag.nome}" (Tier ${reag.tier}) aplicado! Efeitos integrados à fórmula.`, 'success');
    onUpdateState(state);
  };

  window._acAlchAjustarCdBase = (delta) => {
    state.cdBase = Math.max(8, Number(state.cdBase) + delta);
    onUpdateState(state);
  };

  window._acAlchAjustarTempo = (delta) => {
    state.tempoHoras = Math.max(1, Number(state.tempoHoras) + delta);
    onUpdateState(state);
  };

  window._acAlchAlterarGrau = (tipo, grau) => {
    if (tipo === 'solvente') state.grauSolvente = grau;
    if (tipo === 'ativo') state.grauAtivo = grau;
    if (tipo === 'catalisador') state.grauCatalisador = grau;
    onUpdateState(state);
  };

  window._acAlchAjustarDecantacao = (delta) => {
    state.tempoDecantacaoHoras = Math.max(0, Number(state.tempoDecantacaoHoras || 0) + delta);
    onUpdateState(state);
  };

  window._acAlchSetModoRolagem = (modo) => {
    state.modoRolagem = modo;
    onUpdateState(state);
  };

  window._acAlchAjustarExtra = (delta) => {
    state.modificadorExtraManual = Number(state.modificadorExtraManual || 0) + delta;
    onUpdateState(state);
  };

  window._acAlchRolarCiclo = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('alchemy', state, calc);
    }
    rolarCicloTrabalho(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusAlquimia),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoAlchemy(state, calc);
    onUpdateState(state);
  };

  window._acAlchAutoResolver = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('alchemy', state, calc);
    }
    autoResolverCiclos(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusAlquimia),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoAlchemy(state, calc);
    toast('Todos os ciclos de destilação foram concluídos!', 'success');
    onUpdateState(state);
  };

  window._acAlchDescansar = () => {
    if (!state.sessaoEsforco) return;
    const res = descansarSessao(state.sessaoEsforco);
    toast(res.mensagem, res.sucesso ? 'info' : 'warning');
    _sincronizarResultadoAlchemy(state, calc);
    onUpdateState(state);
  };

  window._acAlchReiniciarSessao = () => {
    state.sessaoEsforco = inicializarSessaoEsforco('alchemy', state, calc);
    state.ultimoResultado = null;
    toast('Alambique reiniciado para nova síntese.');
    onUpdateState(state);
  };

  window._acAlchAvancarFicha = () => {
    state.passoAtual = 7;
    onUpdateState(state);
  };

  // Botões de navegação
  const btnVoltar = container.querySelector('#ac-alch-btn-voltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      if (state.passoAtual > 1) {
        state.passoAtual--;
        onUpdateState(state);
      }
    });
  }

  const btnAvancar = container.querySelector('#ac-alch-btn-avancar');
  if (btnAvancar) {
    btnAvancar.addEventListener('click', () => {
      if (state.passoAtual < 6) {
        state.passoAtual++;
        onUpdateState(state);
      }
    });
  }

  const btnAvancarFicha = container.querySelector('#ac-alch-btn-avancar-ficha');
  if (btnAvancarFicha) {
    btnAvancarFicha.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  const btnNovoProcesso = container.querySelector('#ac-alch-btn-novo-processo');
  if (btnNovoProcesso) {
    btnNovoProcesso.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialAlchemy());
      toast('Novo processo de alquimia preparado.');
      onUpdateState(state);
    });
  }

  const btnVerMateriais = container.querySelector('#ac-alch-btn-ver-materiais');
  if (btnVerMateriais && onIrParaBanco) {
    btnVerMateriais.addEventListener('click', () => {
      onIrParaBanco();
    });
  }

  // Inputs Passo 1
  const selChar = container.querySelector('#ac-alch-sel-personagem');
  if (selChar) {
    selChar.addEventListener('change', (e) => {
      state.personagemId = e.target.value;
      if (state.personagemId) {
        const char = getPersonagem(state.personagemId);
        if (char) {
          state.nomeAlquimista = char.nome;
          const modInt = Math.floor(((char.atributos?.int?.total || 10) - 10) / 2);
          const modSab = Math.floor(((char.atributos?.sab?.total || 10) - 10) / 2);
          const prof = Math.floor(((char.nivel || 1) - 1) / 4) + 2;
          state.bonusAlquimia = (state.atributoChave === 'sab' ? modSab : modInt) + prof;
        }
      }
      onUpdateState(state);
    });
  }

  const inputNome = container.querySelector('#ac-alch-input-nome');
  if (inputNome) inputNome.addEventListener('input', (e) => { state.nomeAlquimista = e.target.value; });

  const selAtr = container.querySelector('#ac-alch-sel-atributo');
  if (selAtr) {
    selAtr.addEventListener('change', (e) => {
      state.atributoChave = e.target.value;
      if (state.personagemId) {
        const char = getPersonagem(state.personagemId);
        if (char) {
          const mod = Math.floor(((char.atributos?.[state.atributoChave]?.total || 10) - 10) / 2);
          const prof = Math.floor(((char.nivel || 1) - 1) / 4) + 2;
          state.bonusAlquimia = mod + prof;
        }
      }
      onUpdateState(state);
    });
  }

  const inputBonus = container.querySelector('#ac-alch-input-bonus');
  if (inputBonus) inputBonus.addEventListener('change', (e) => { state.bonusAlquimia = Number(e.target.value); onUpdateState(state); });

  // Inputs Passo 2
  const selCat = container.querySelector('#ac-alch-sel-categoria');
  if (selCat) selCat.addEventListener('change', (e) => { state.categoria = e.target.value; onUpdateState(state); });
  const inputFormula = container.querySelector('#ac-alch-input-formula');
  if (inputFormula) inputFormula.addEventListener('input', (e) => { state.nomeFormula = e.target.value; });
  const selForma = container.querySelector('#ac-alch-sel-forma');
  if (selForma) selForma.addEventListener('change', (e) => { state.formaAplicacao = e.target.value; onUpdateState(state); });
  const inputEfeito = container.querySelector('#ac-alch-input-efeito');
  if (inputEfeito) inputEfeito.addEventListener('input', (e) => { state.efeitoFormula = e.target.value; });

  // Inputs Passo 3
  const solvNome = container.querySelector('#ac-alch-solvente-nome');
  if (solvNome) solvNome.addEventListener('input', (e) => { state.solventeBase = e.target.value; });
  const ativoNome = container.querySelector('#ac-alch-ativo-nome');
  if (ativoNome) ativoNome.addEventListener('input', (e) => { state.reagenteAtivo = e.target.value; });
  const ativoQtd = container.querySelector('#ac-alch-ativo-qtd');
  if (ativoQtd) ativoQtd.addEventListener('input', (e) => { state.qtdAtivo = e.target.value; });
  const catNome = container.querySelector('#ac-alch-catalisador-nome');
  if (catNome) catNome.addEventListener('input', (e) => { state.catalisador = e.target.value; });
  const catQtd = container.querySelector('#ac-alch-catalisador-qtd');
  if (catQtd) catQtd.addEventListener('input', (e) => { state.qtdCatalisador = e.target.value; });
  const selEst = container.querySelector('#ac-alch-sel-estabilizador');
  if (selEst) selEst.addEventListener('change', (e) => { state.estabilizador = e.target.value; onUpdateState(state); });
  const inputCusto = container.querySelector('#ac-alch-input-custo');
  if (inputCusto) inputCusto.addEventListener('change', (e) => { state.custoEstimadoPo = Number(e.target.value); onUpdateState(state); });

  // Inputs Passo 4
  const selLab = container.querySelector('#ac-alch-sel-lab');
  if (selLab) selLab.addEventListener('change', (e) => { state.instalacaoLab = e.target.value; onUpdateState(state); });
  const selMetodo = container.querySelector('#ac-alch-sel-metodo');
  if (selMetodo) selMetodo.addEventListener('change', (e) => { state.metodoExtracao = e.target.value; onUpdateState(state); });

  // Passo 6: Executar
  const btnExecTeste = container.querySelector('#ac-alch-btn-executar-teste');
  if (btnExecTeste) {
    btnExecTeste.addEventListener('click', () => {
      _executarRolagemAlchemy(state, onUpdateState);
    });
  }

  const btnTentarDeNovo = container.querySelector('#ac-alch-btn-tentar-novamente');
  if (btnTentarDeNovo) {
    btnTentarDeNovo.addEventListener('click', () => {
      state.ultimoResultado = null;
      toast('Novo solvente base preparado: reagentes nobres foram preservados.');
      onUpdateState(state);
    });
  }

  const btnConcluirAvancar = container.querySelector('#ac-alch-btn-concluir-avancar');
  if (btnConcluirAvancar) {
    btnConcluirAvancar.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  // Passo 7: Ações
  const btnAddInv = container.querySelector('#ac-alch-btn-adicionar-inventario');
  if (btnAddInv) {
    btnAddInv.addEventListener('click', () => {
      _adicionarAoInventarioAlchemy(state);
    });
  }

  const btnCopiarFicha = container.querySelector('#ac-alch-btn-copiar-ficha');
  if (btnCopiarFicha) {
    btnCopiarFicha.addEventListener('click', () => {
      _copiarFichaTextoAlchemy(state);
    });
  }

  const btnSalvarCaderno = container.querySelector('#ac-alch-btn-salvar-caderno');
  if (btnSalvarCaderno) {
    btnSalvarCaderno.addEventListener('click', () => {
      _salvarFichaNoCadernoAlchemy(state);
    });
  }

  const btnImprimir = container.querySelector('#ac-alch-btn-imprimir');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      imprimirFichaOficial('alchemy', state);
    });
  }

  const btnReiniciar = container.querySelector('#ac-alch-btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialAlchemy());
      toast('Novo processo de alquimia iniciado.');
      onUpdateState(state);
    });
  }
}

function _sincronizarResultadoAlchemy(state, calc) {
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
    modTotal: ult.modTotalEfetivo !== undefined ? ult.modTotalEfetivo : (Number(state.bonusAlquimia) - penalidade),
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
      ? `Fórmula alquímica estabilizada após ${ciclosCount} ciclos de destilação (${s.diasDecorridos} dias de laboratório)! Meta de ${s.esforcoAlvo} UE alcançada. Estado final do alquimista: Nível ${s.nivelExaustao} de Exaustão (D&D 5.5e: -${penalidade} em d20).`
      : s.colapsado
        ? `Colapso do alquimista por Intoxicação e Exaustão Extrema (Nível 6). Síntese interrompida.`
        : `Destilação em andamento: ${s.progressoAtual} de ${s.esforcoAlvo} UE estabilizados (${ciclosCount} ciclos). Exaustão atual: Nível ${s.nivelExaustao}.`
  };
}

function _executarRolagemAlchemy(state, onUpdateState) {
  const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
  const grausUsados = [state.grauSolvente, state.grauAtivo, state.grauCatalisador];
  grausUsados.sort((a, b) => ordemGraus.indexOf(a) - ordemGraus.indexOf(b));
  const menorGrau = grausUsados[0] || 'media';
  const modMenorGrau = GRAUS_MATERIAL[menorGrau]?.modificadorCd ?? 0;

  let modLab = 0;
  if (state.instalacaoLab === 'portatil') modLab = 2;
  if (state.instalacaoLab === 'mestre') modLab = -1;

  let modEst = 0;
  if (state.estabilizador === 'perola' || state.estabilizador === 'enxofre') modEst = -1;

  const cdFinal = Math.max(8, Number(state.cdBase) + modMenorGrau + modLab + modEst);
  const modTotal = Number(state.bonusAlquimia) + Number(state.modificadorExtraManual || 0);

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
    logRegra = 'Destilação Transcendental (20 Natural)! Cristalização imaculada: a reação gerou rendimento dobrado (2 doses obtidas) com pureza suprema e potência prolongada.';
  } else if (falhaCritica) {
    logRegra = 'Falha Crítica (1 Natural): Explosão exotérmica no alambique! A vidraria quebrou, fumaça ácida inundou a bancada e todos os ingredientes foram consumidos.';
  } else if (sucesso) {
    logRegra = `Destilação bem-sucedida (Total ${total} vs CD ${cdFinal})! Solução límpida e estável com pureza "${GRAUS_MATERIAL[menorGrau]?.nome}". O frasco foi hermeticamente selado.`;
  } else {
    logRegra = `Instabilidade na síntese (Total ${total} vs CD ${cdFinal}): A mistura turvou. Pela regra oficial de alquimia, apenas o solvente líquido base é perdido; os reagentes nobres são filtrados e reaproveitados.`;
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
    toast(`Falha na destilação: Total ${total} vs CD ${cdFinal}.`, 'error');
  }

  onUpdateState(state);
}

function _adicionarAoInventarioAlchemy(state) {
  if (!state.personagemId) {
    toast('Selecione um personagem no Passo 1 primeiro.', 'warning');
    return;
  }
  const char = getPersonagem(state.personagemId);
  if (!char) return;
  if (!char.inventario) char.inventario = [];

  const ult = state.ultimoResultado;
  const qtdDoses = ult?.obraPrima ? 2 : 1;

  const novoItem = {
    id: `item_alch_${Date.now()}`,
    nome: `${state.nomeFormula}${ult?.obraPrima ? ' (Transcendental)' : ''}`,
    quantidade: qtdDoses,
    peso: 0.2,
    equipado: false,
    sintonizado: false,
    tipo: state.categoria,
    raridade: state.grauAtivo === 'suprema' ? 'Muito Raro' : state.grauAtivo === 'alta' ? 'Incomum' : 'Comum',
    descricao: `${state.efeitoFormula}\n[Destilado no Arcane Craft por ${state.nomeAlquimista} • Pureza: ${GRAUS_MATERIAL[ult?.menorGrau || 'media']?.nome}]`,
    notas: `Aplicação: ${state.formaAplicacao} • Doses: ${qtdDoses}`
  };

  char.inventario.push(novoItem);
  salvarPersonagem(char);
  toast(`"${novoItem.nome}" (${qtdDoses} dose${qtdDoses > 1 ? 's' : ''}) adicionada ao inventário de ${char.nome}!`, 'success');
}

function _copiarFichaTextoAlchemy(state) {
  const ult = state.ultimoResultado;
  const texto = `=== FICHA DE PROCESSO ALQUÍMICO (ARCANE CRAFT) ===
Fórmula: ${state.nomeFormula} (${state.categoria})
Alquimista: ${state.nomeAlquimista} (${state.ramo})
Solvente: ${state.solventeBase} [Grau: ${state.grauSolvente}]
Reagente Ativo: ${state.reagenteAtivo} (${state.qtdAtivo}) [Grau: ${state.grauAtivo}]
Catalisador: ${state.catalisador} (${state.qtdCatalisador}) [Grau: ${state.grauCatalisador}]
CD Final: ${ult?.cdFinal || state.cdBase} | Rolagem: ${ult?.total || '-'}
Resultado: ${ult?.sucesso ? (ult.obraPrima ? 'TRANSCENDENTAL' : 'SUCESSO') : 'FALHA'}
Efeitos: ${state.efeitoFormula}
Data: ${new Date().toLocaleString()}`;

  navigator.clipboard.writeText(texto).then(() => {
    toast('Ficha copiada para a área de transferência!');
  });
}

function _salvarFichaNoCadernoAlchemy(state) {
  const s = state.sessaoEsforco;
  const ult = state.ultimoResultado;
  const ficha = {
    id: `alch_${Date.now()}`,
    tipoProcesso: 'alchemy',
    titulo: state.nomeFormula,
    subtitulo: `${state.categoria} • ${state.ramo}`,
    data: new Date().toISOString(),
    artesao: state.nomeAlquimista,
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
