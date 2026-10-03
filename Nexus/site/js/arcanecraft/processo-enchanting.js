// ============================================================
// Arcane Craft - Wizard de Encantamento (Enchanting)
// Baseado nas Regras da Parte 3 e Modelo da Ficha de Encantamento (Enchanting Sheet)
// ============================================================
import { escHtml, toast } from '../utils.js';
import { listarPersonagens, getPersonagem, salvarPersonagem } from '../store.js';
import {
  GRAUS_MATERIAL,
  APENDICE3_ENCANTAMENTO,
  obterPropriedadesApendice3,
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

export const MODELOS_BASE_ENCHANTING = [
  {
    id: 'espada_mais_um',
    nome: 'Espada Longa +1 (Imbuição Arcana)',
    categoria: 'Arma Mágica',
    especializacao: 'Implemancer',
    raridade: 'Incomum',
    cdBase: 15,
    tempoDias: 4,
    custoBasePo: 250,
    objetoBase: 'Espada Longa de Forja Nobre (Aço Temperado)',
    grauObjeto: 'alta',
    essenciaTipo: 'Arcana',
    essenciaGrau: 'alta',
    origemEssencia: 'Fera Monstruosa Arcanizada ou Resíduo de Trama',
    catalisador: 'Pó de Diamante para Runas (50 po)',
    grauCatalisador: 'media',
    magiaVinculada: 'Arma Mágica (2º Círculo) ou Canalização Contínua',
    requerSintonizacao: false,
    propriedades: 'Concede +1 em jogadas de ataque e dano com esta arma. O dano é considerado mágico.'
  },
  {
    id: 'varinha_misseis',
    nome: 'Varinha de Mísseis Mágicos (Wand of Magic Missiles)',
    categoria: 'Implemento Mágico (Varinha)',
    especializacao: 'Implemancer',
    raridade: 'Incomum',
    cdBase: 15,
    tempoDias: 3,
    custoBasePo: 300,
    objetoBase: 'Haste Esculpida de Madeira-Ferro com Fio de Prata',
    grauObjeto: 'media',
    essenciaTipo: 'Arcana',
    essenciaGrau: 'alta',
    origemEssencia: 'Essência de Força Evocativa / Cristal de Faerzress',
    catalisador: 'Ponta de Cristal de Quartzo Claro Lapidado',
    grauCatalisador: 'media',
    magiaVinculada: 'Mísseis Mágicos (1º Círculo)',
    requerSintonizacao: false,
    propriedades: 'Possui 7 cargas. Com 1 ação, gasta 1 ou mais cargas para disparar Mísseis Mágicos (1d4+1 por dardo sem teste de ataque). Recupera 1d6+1 cargas ao amanhecer.'
  },
  {
    id: 'anel_protecao',
    nome: 'Anel de Proteção (+1 CA e Salvaguardas)',
    categoria: 'Item Maravilhoso (Anel)',
    especializacao: 'Wardwright',
    raridade: 'Rara',
    cdBase: 19,
    tempoDias: 10,
    custoBasePo: 800,
    objetoBase: 'Aro de Ouro Puro com Engaste de Mitral',
    grauObjeto: 'alta',
    essenciaTipo: 'Divina',
    essenciaGrau: 'alta',
    origemEssencia: 'Pena de Celestial ou Relíquia Abençoada de Templo',
    catalisador: 'Gema de Safira Estelar Lapidada',
    grauCatalisador: 'alta',
    magiaVinculada: 'Escudo da Fé (1º Círculo) ou Santuário',
    requerSintonizacao: true,
    propriedades: 'Requer Sintonização. Concede +1 na Classe de Armadura e +1 em todos os testes de Salvaguarda enquanto usado.'
  },
  {
    id: 'armadura_resistencia',
    nome: 'Armadura de Resistência Elemental',
    categoria: 'Armadura Mágica',
    especializacao: 'Wardwright',
    raridade: 'Rara',
    cdBase: 19,
    tempoDias: 14,
    custoBasePo: 1200,
    objetoBase: 'Armadura de Placas ou Cota de Malha Nobre',
    grauObjeto: 'alta',
    essenciaTipo: 'Elemental',
    essenciaGrau: 'alta',
    origemEssencia: 'Núcleo Elemental Puro (Fogo, Frio, Eletricidade ou Ácido)',
    catalisador: 'Pó de Platina e Runas Gravadas',
    grauCatalisador: 'alta',
    magiaVinculada: 'Proteção contra Energia (3º Círculo)',
    requerSintonizacao: true,
    propriedades: 'Requer Sintonização. Concede Resistência permanente ao tipo de dano elemental sintonizado na forja (ex: Fogo ou Frio).'
  },
  {
    id: 'bolsa_sem_fundo',
    nome: 'Bolsa Sem Fundo (Bag of Holding)',
    categoria: 'Item Maravilhoso (Espacial)',
    especializacao: 'Eclectist',
    raridade: 'Incomum',
    cdBase: 15,
    tempoDias: 4,
    custoBasePo: 350,
    objetoBase: 'Sacola de Couro Rústico com Costura Dupla Reforçada',
    grauObjeto: 'media',
    essenciaTipo: 'Arcana',
    essenciaGrau: 'alta',
    origemEssencia: 'Essência de Transmutação / Distorção Planar',
    catalisador: 'Pó de Fada e Seda Feérica',
    grauCatalisador: 'media',
    magiaVinculada: 'Corda Mágica (2º Círculo) ou Levitação',
    requerSintonizacao: false,
    propriedades: 'Armazena até 250 kg em um volume de até 1.8 m³, pesando sempre 7 kg exteriormente.'
  },
  {
    id: 'botas_aladas',
    nome: 'Botas Aladas (Winged Boots)',
    categoria: 'Item Maravilhoso (Pés)',
    especializacao: 'Eclectist',
    raridade: 'Incomum',
    cdBase: 16,
    tempoDias: 5,
    custoBasePo: 600,
    objetoBase: 'Par de Botas de Couro Macio de Alta Qualidade',
    grauObjeto: 'alta',
    essenciaTipo: 'Primitiva',
    essenciaGrau: 'alta',
    origemEssencia: 'Asas de Monstruosidade ou Penas de Pégaso',
    catalisador: 'Fios de Prata e Incenso de Vento',
    grauCatalisador: 'media',
    magiaVinculada: 'Voo (3º Círculo)',
    requerSintonizacao: true,
    propriedades: 'Requer Sintonização. Concede deslocamento de voo igual ao deslocamento de caminhada por até 4 horas diárias.'
  }
];

export function criarEstadoInicialEnchanting() {
  return {
    passoAtual: 1,
    // Passo 1: Encantador
    personagemId: '',
    nomeEncantador: 'Encantador Arcano',
    especializacao: 'Implemancer',
    atributoConjuracao: 'int', // 'int', 'sab', 'car'
    bonusArcanismo: 6,
    espacoMagiaMaximo: 3,
    // Passo 2: Objeto Base & Raridade
    escolaMagia: 'abjuracao',
    tierStrand: 1,
    nomeItemMagico: 'Espada Longa +1',
    categoriaItem: 'Arma Mágica',
    raridade: 'Incomum', // 'Comum', 'Incomum', 'Rara', 'Muito Rara', 'Lendária'
    cdBaseRaridade: 15,
    objetoBaseFisico: 'Espada Longa de Forja Nobre (Aço Temperado)',
    grauObjetoBase: 'alta',
    requerSintonizacao: false,
    propriedadesMagicas: 'Concede +1 em jogadas de ataque e dano. Dano considerado mágico.',
    tempoDiasRitual: 4,
    custoComponentesPo: 250,
    // Passo 3: Essência e Catalisadores
    tipoEssencia: 'Arcana', // 'Arcana', 'Divina', 'Primitiva', 'Elemental'
    grauEssencia: 'alta',
    origemEssencia: 'Fera Monstruosa Arcanizada ou Dragão',
    catalisadorRitual: 'Pó de Diamante para Runas (50 po)',
    grauCatalisador: 'media',
    magiaVinculada: 'Arma Mágica (2º Círculo)',
    // Passo 4: Círculo de Encantamento
    tipoCirculo: 'consagrado', // 'basico' (+1 CD), 'consagrado' (0 CD), 'platina' (-2 CD)
    horasPorDiaRitual: 6,
    assistentesArkanos: 0,
    // Passo 5 e 6: Rolagem e Esforço Acumulado
    modoRolagem: 'normal',
    modificadorExtraManual: 0,
    sessaoEsforco: null,
    ultimoResultado: null
  };
}

export function renderWizardEnchanting(container, state, onUpdateState, onIrParaBanco) {
  const passo = state.passoAtual || 1;

  // CD Base pela Raridade
  const cdsRaridade = {
    'Comum': 12,
    'Incomum': 15,
    'Rara': 19,
    'Muito Rara': 23,
    'Lendária': 28
  };
  const cdBase = cdsRaridade[state.raridade] || 15;
  state.cdBaseRaridade = cdBase;

  // Menor grau entre essência e catalisador
  const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
  const menorGrau = ordemGraus.indexOf(state.grauEssencia) <= ordemGraus.indexOf(state.grauCatalisador)
    ? state.grauEssencia
    : state.grauCatalisador;
  const modMenorGrau = GRAUS_MATERIAL[menorGrau]?.modificadorCd ?? 0;

  let modCirculo = 0;
  if (state.tipoCirculo === 'basico') modCirculo = 1;
  if (state.tipoCirculo === 'platina') modCirculo = -2;

  let modAssist = state.assistentesArkanos > 0 ? -1 : 0;

  const cdFinalCalculada = Math.max(10, cdBase + modMenorGrau + modCirculo + modAssist);
  const custoFinalPo = Math.round(Number(state.custoComponentesPo) * (GRAUS_MATERIAL[menorGrau]?.multiplicadorPreco ?? 1));

  const calc = {
    cdBase,
    menorGrau,
    cdFinalCalculada,
    custoFinalPo
  };

  container.innerHTML = `
    <div class="ac-wizard-container">

      <!-- HEADER ENCANTAMENTO -->
      <div class="ac-wizard-header" style="border-color: rgba(168, 85, 247, 0.45);">
        <div class="ac-wizard-title-row">
          <div class="ac-wizard-title">
            <span class="ac-wizard-icon">✨</span>
            <div>
              <h3>Processo de Encantamento Arcano (Enchanting)</h3>
              <p class="ac-wizard-subtitle">Regras da Parte 3 • Imbuição da Trama, Essências Mágicas, Varinhas, Armas e Armaduras</p>
            </div>
          </div>
          <div class="ac-wizard-badge-posto" style="background: rgba(168, 85, 247, 0.18); border-color: rgba(168, 85, 247, 0.5); color: #c084fc;">
            Ficha de Encantamento • Etapa ${passo} de 7
          </div>
        </div>

        <!-- TRACKER DE ETAPAS COM NAVEGAÇÃO DESLIZÁVEL -->
        <div class="ac-steps-tracker-wrapper">
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-ench-step-prev" type="button" aria-label="Passo anterior">‹</button>
          <div class="ac-steps-tracker" id="ac-ench-steps-tracker" role="tablist">
            ${[
              { num: 1, label: 'Encantador', icon: '🧙‍♂️' },
              { num: 2, label: 'Objeto & Raridade', icon: '⚔️' },
              { num: 3, label: 'Essência & Magia', icon: '🔮' },
              { num: 4, label: 'Círculo & Ritual', icon: '✨' },
              { num: 5, label: 'Revisão da Ficha', icon: '📋' },
              { num: 6, label: 'Rito de Imbuição', icon: '🎲' },
              { num: 7, label: 'Ficha Concluída', icon: '📜' }
            ].map(s => `
              <div class="ac-step-node ${s.num === passo ? 'ativo' : ''} ${s.num < passo ? 'concluido' : ''}"
                   onclick="window._acMudarPassoEnchanting(${s.num})" title="Ir para Passo ${s.num}: ${s.label}">
                <div class="ac-step-circle">${s.num < passo ? '✓' : s.icon}</div>
                <span class="ac-step-label">${s.label}</span>
              </div>
            `).join('')}
          </div>
          <button class="ac-nav-arrow-btn ac-step-arrow-btn" id="ac-ench-step-next" type="button" aria-label="Próximo passo">›</button>
        </div>
      </div>

      <!-- RESUMO RÁPIDO AO VIVO NO MOBILE -->
      <div class="ac-wizard-mobile-summary" aria-label="Resumo rápido de encantamento">
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CD FINAL</span>
          <span class="ac-mob-summary-val gold">${cdFinalCalculada}</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">RARIDADE</span>
          <span class="ac-mob-summary-val" style="color: #c084fc;">
            ${escHtml(state.raridade)}
          </span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">RITUAL</span>
          <span class="ac-mob-summary-val">${state.tempoDiasRitual} dias</span>
        </div>
        <div class="ac-mob-summary-item">
          <span class="ac-mob-summary-lbl">CUSTO</span>
          <span class="ac-mob-summary-val">${custoFinalPo} PO</span>
        </div>
      </div>

      <!-- BODY GRID -->
      <div class="ac-wizard-body-grid">
        
        <div class="ac-wizard-content-card">
          ${_renderConteudoPassoEnchanting(passo, state, {
            cdFinalCalculada,
            cdBase,
            menorGrau,
            custoFinalPo
          })}

          <div class="ac-wizard-nav-footer">
            <button class="btn btn-outline" id="ac-ench-btn-voltar" ${passo === 1 ? 'disabled style="opacity:0.4;"' : ''}>
              ← Voltar Passo
            </button>
            <div class="ac-nav-center-info">
              Passo ${passo} de 7 • ${passo === 7 ? 'Ficha Final de Encantamento' : 'Condução Guiada'}
            </div>
            ${passo < 6 ? `
              <button class="btn btn-primary" id="ac-ench-btn-avancar">
                Avançar Passo →
              </button>
            ` : passo === 6 ? `
              <button class="btn btn-primary" id="ac-ench-btn-avancar-ficha" ${!state.ultimoResultado ? 'disabled style="opacity:0.5;" title="Execute o rito de encantamento para avançar"' : ''}>
                Ver Ficha de Encantamento →
              </button>
            ` : `
              <button class="btn btn-primary" id="ac-ench-btn-novo-processo">
                Iniciar Novo Encantamento ✨
              </button>
            `}
          </div>
        </div>

        <!-- SIDEBAR DE PREVIEW ENCANTAMENTO -->
        <div class="ac-sheet-preview-sidebar">
          <div class="ac-sheet-mini-card">
            <div class="ac-sheet-mini-header" style="border-bottom-color: rgba(168, 85, 247, 0.3);">
              <span class="ac-sheet-mini-tag" style="background: rgba(168, 85, 247, 0.2); color: #c084fc;">Ficha de Encantamento</span>
              <h4 class="ac-sheet-mini-title">${escHtml(state.nomeItemMagico || 'Item Mágico Sem Nome')}</h4>
            </div>

            <div class="ac-sheet-mini-metrics">
              <div class="ac-metric-box">
                <span class="ac-metric-label">CD FINAL RITO</span>
                <span class="ac-metric-val" style="color: #c084fc;">${cdFinalCalculada}</span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">RARIDADE</span>
                <span class="ac-metric-val" style="color: #f59e0b; font-size: 0.95rem;">
                  ${state.raridade}
                </span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">TEMPO RITUAL</span>
                <span class="ac-metric-val">${state.tempoDiasRitual} dias</span>
              </div>
              <div class="ac-metric-box">
                <span class="ac-metric-label">CUSTO TOTAL</span>
                <span class="ac-metric-val">${custoFinalPo} po</span>
              </div>
            </div>

            <div class="ac-sheet-mini-list">
              <div class="ac-mini-row">
                <span class="k">Encantador:</span>
                <span class="v">${escHtml(state.nomeEncantador)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Especialização:</span>
                <span class="v">${escHtml(state.especializacao)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Bônus Arcanismo:</span>
                <span class="v text-highlight">+${state.bonusArcanismo}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Objeto Base:</span>
                <span class="v">${escHtml(state.objetoBaseFisico)}</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Essência Mágica:</span>
                <span class="v">${state.tipoEssencia} (${GRAUS_MATERIAL[state.grauEssencia]?.nome})</span>
              </div>
              <div class="ac-mini-row">
                <span class="k">Sintonização:</span>
                <span class="v">${state.requerSintonizacao ? 'Sim (Requer)' : 'Não'}</span>
              </div>
            </div>

            <div class="ac-sheet-mini-actions">
              <button class="btn btn-sm btn-outline w-100" id="ac-ench-btn-ver-materiais">
                📖 Consultar Tabela de Essências
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  _setupEventosEnchanting(container, state, onUpdateState, onIrParaBanco, calc);
}

function _renderConteudoPassoEnchanting(passo, state, calc) {
  switch (passo) {
    case 1:
      return _renderPasso1Ench(state);
    case 2:
      return _renderPasso2Ench(state);
    case 3:
      return _renderPasso3Ench(state);
    case 4:
      return _renderPasso4Ench(state, calc);
    case 5:
      return _renderPasso5Ench(state, calc);
    case 6:
      return _renderPasso6Ench(state, calc);
    case 7:
      return _renderPasso7Ench(state, calc);
    default:
      return '';
  }
}

// Passo 1: Encantador
function _renderPasso1Ench(state) {
  const chars = listarPersonagens();
  const especializacoes = [
    { id: 'Implemancer', icon: '⚔️', desc: 'Especialista em armas ofensivas mágicas (+1, +2, +3, flamejantes), varinhas de feitiços, cajados e cetros de comando.' },
    { id: 'Wardwright', icon: '🛡️', desc: 'Especialista em defesas mágicas: armaduras protetoras, escudos de repulsão, mantos de camuflagem e anéis de resistência.' },
    { id: 'Eclectist', icon: '✨', desc: 'Especialista em itens maravilhosos heterogêneos: bolsas dimensionais, botas de voo, tapetes, amuletos utilitários e pedras Ioun.' }
  ];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 1: Identificação do Encantador & Especialização Arcana</h4>
        <span class="ac-step-pill">Parte 3: Tradições de Encantamento</span>
      </div>
      <p class="ac-step-desc">
        O Encantamento exige a canalização contínua de energias mágicas através da Trama. O artesão deve ter aptidão arcana (Arcanismo ou proficiência em ferramentas de joalheiro/entalhador e habilidade de conjuração).
      </p>

      <div class="ac-form-group">
        <label class="ac-label">Vincular a um Personagem Conjurador:</label>
        <select class="ac-select" id="ac-ench-sel-personagem">
          <option value="">-- Usar Conjurador Autônomo / Personalizado --</option>
          ${chars.map(c => `
            <option value="${c.id}" ${state.personagemId === c.id ? 'selected' : ''}>
              ${escHtml(c.nome)} (Nível ${c.nivel || 1} • ${escHtml(c.classe || 'Mago/Bruxo/Druida')})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Nome do Encantador / Mago Ritualista:</label>
          <input type="text" class="ac-input" id="ac-ench-input-nome" value="${escHtml(state.nomeEncantador)}">
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Atributo de Conjuração Primário:</label>
          <select class="ac-select" id="ac-ench-sel-atributo">
            <option value="int" ${state.atributoConjuracao === 'int' ? 'selected' : ''}>Inteligência (Mago, Artífice)</option>
            <option value="sab" ${state.atributoConjuracao === 'sab' ? 'selected' : ''}>Sabedoria (Clérigo, Druida)</option>
            <option value="car" ${state.atributoConjuracao === 'car' ? 'selected' : ''}>Carisma (Bruxo, Feiticeiro, Bardo, Paladino)</option>
          </select>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Especialização do Encantador:</label>
        <div class="ac-cards-choice-grid">
          ${especializacoes.map(e => `
            <div class="ac-choice-card ${state.especializacao === e.id ? 'selecionado' : ''}"
                 onclick="window._acEnchEscolherEspec('${e.id}')">
              <div class="ac-choice-top">
                <span class="ac-choice-icon">${e.icon}</span>
                <span class="ac-choice-name">${e.id}</span>
              </div>
              <p class="ac-choice-desc">${e.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Bônus de Arcanismo / Encantamento:</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarBonus(-1)">-</button>
            <input type="number" class="ac-input text-center" id="ac-ench-input-bonus" value="${state.bonusArcanismo}" min="-2" max="25">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarBonus(1)">+</button>
          </div>
          <small class="ac-hint">Modificador de Conjuração + Bônus de Proficiência em Arcanismo.</small>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Espaço de Magia Mais Alto Disponível:</label>
          <select class="ac-select" id="ac-ench-sel-espaco">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
              <option value="${n}" ${state.espacoMagiaMaximo === n ? 'selected' : ''}>${n}º Círculo</option>
            `).join('')}
          </select>
        </div>
      </div>

    </div>
  `;
}

// Passo 2: Objeto Base & Raridade
function _renderPasso2Ench(state) {
  const raridades = ['Comum', 'Incomum', 'Rara', 'Muito Rara', 'Lendária'];
  const graus = Object.values(GRAUS_MATERIAL);

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 2: Objeto Base Mundano & Faixa de Raridade</h4>
        <span class="ac-step-pill">Regra: Recipiente Físico & Trama</span>
      </div>
      <p class="ac-step-desc">
        A magia precisa de uma âncora material sólida. Armas ou armaduras mal trabalhadas quebram sob a tensão da Trama. O objeto mundano deve ter qualidade compatível com a raridade do encantamento planejado.
      </p>

      <!-- CARREGAR MODELOS PRÉ-DEFINIDOS -->
      <div class="ac-quick-load-box">
        <div class="ac-quick-load-label">
          <span>⚡ Itens Mágicos Clássicos (Opcional):</span>
          <small class="text-muted">Carrega os parâmetros base para edição livre</small>
        </div>
        <div class="ac-quick-pills-row">
          ${MODELOS_BASE_ENCHANTING.map(m => `
            <button class="ac-quick-pill" onclick="window._acEnchCarregarModelo('${m.id}')">
              ${m.nome}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Faixa de Raridade do Item:</label>
          <select class="ac-select" id="ac-ench-sel-raridade">
            ${raridades.map(r => `
              <option value="${r}" ${state.raridade === r ? 'selected' : ''}>
                ${r} (CD Base: ${r === 'Comum' ? 12 : r === 'Incomum' ? 15 : r === 'Rara' ? 19 : r === 'Muito Rara' ? 23 : 28})
              </option>
            `).join('')}
          </select>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Nome do Item Mágico Planejado:</label>
          <input type="text" class="ac-input" id="ac-ench-input-nome-item" value="${escHtml(state.nomeItemMagico)}">
        </div>
      </div>

      <!-- OBJETO FÍSICO BASE -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">Vaso Físico / Objeto Base</span>
          <span class="ac-box-sub">A peça mundana que receberá o poder mágico</span>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Descrição do Objeto Físico Base:</label>
          <input type="text" class="ac-input" id="ac-ench-input-objeto-base" value="${escHtml(state.objetoBaseFisico)}">
          <small class="ac-hint">Ex: Espada Longa de Forja Nobre, Anel de Ouro Maciço, Par de Botas de Couro Superior.</small>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau de Qualidade do Objeto Físico Base:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauObjetoBase === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauObjetoBase" value="${g.id}" ${state.grauObjetoBase === g.id ? 'checked' : ''}
                       onchange="window._acEnchAlterarGrauObjeto('${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Requisito de Sintonização (Attunement):</label>
          <select class="ac-select" id="ac-ench-sel-sintonizacao">
            <option value="nao" ${!state.requerSintonizacao ? 'selected' : ''}>Não Requer Sintonização</option>
            <option value="sim" ${state.requerSintonizacao ? 'selected' : ''}>Requer Sintonização por um Usuário</option>
          </select>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Tempo de Ritual (Dias Dedicados):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarDias(-1)">-1d</button>
            <input type="number" class="ac-input text-center" id="ac-ench-input-dias" value="${state.tempoDiasRitual}" min="1" max="120">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarDias(1)">+1d</button>
          </div>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Propriedades Mágicas Concedidas ao Objeto:</label>
        <textarea class="ac-textarea" rows="2" id="ac-ench-input-props">${escHtml(state.propriedadesMagicas)}</textarea>
      </div>

    </div>
  `;
}

// Passo 3: Essência Mágica & Componentes Rituais
function _renderPasso3Ench(state) {
  const tipos = [
    { id: 'Arcana', desc: 'Magia tecida de dragões, aberrações cósmicas, fadas e energia do Cosmos.' },
    { id: 'Divina', desc: 'Canalizada de celestiais, anjos, relíquias sagradas ou planos infernais profanos.' },
    { id: 'Primitiva', desc: 'Força telúrica dos espíritos da natureza, feras titânicas, druidas e treants.' },
    { id: 'Elemental', desc: 'Essência viva dos planos primordiais: Fogo, Água, Terra ou Tempestade.' }
  ];
  const graus = Object.values(GRAUS_MATERIAL);
  const escolaAtual = state.escolaMagia || 'abjuracao';
  const tierAtual = state.tierStrand || 1;
  const propriedadesApendice3 = (APENDICE3_ENCANTAMENTO.tabela_propriedades[escolaAtual] && APENDICE3_ENCANTAMENTO.tabela_propriedades[escolaAtual][tierAtual]) || [];
  const strandInfo = APENDICE3_ENCANTAMENTO.tiers_strands.find(t => t.tier === tierAtual) || APENDICE3_ENCANTAMENTO.tiers_strands[0];

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 3: Escola de Magia, Tier/Strand & Essência Ritual</h4>
        <span class="ac-step-pill">Apêndice 3: Tabelas de Encantamento</span>
      </div>
      <p class="ac-step-desc">
        Selecione a <strong>Escola de Magia</strong> e o <strong>Tier / Strand de Poder</strong> para vincular propriedades místicas oficiais, calcular a CD do ritual e definir catalisadores.
      </p>

      <!-- TABELAS OFICIAIS DO APÊNDICE 3 (ESCOLA & TIER) -->
      <div class="ac-box-highlight" style="background: rgba(30, 41, 59, 0.6); border-color: rgba(168, 85, 247, 0.4);">
        <div class="ac-box-header">
          <span class="ac-box-tag" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe;">🔮 Catálogo Oficial do Apêndice 3 (8 Escolas & Strands)</span>
          <span class="ac-box-sub">${strandInfo.rotulo} • CD Base Ritual: ${strandInfo.cdBase} • Custo Ref.: ${strandInfo.custoPoSugerido} PO</span>
        </div>

        <!-- SELETOR DE ESCOLAS -->
        <div class="ac-form-group mb-2">
          <label class="ac-label">1. Escolha a Escola de Magia:</label>
          <div class="ac-pill-btn-group">
            ${APENDICE3_ENCANTAMENTO.escolas.map(esc => `
              <button type="button" class="ac-pill-btn ${escolaAtual === esc.id ? 'ativo' : ''}"
                      onclick="window._acEnchEscolherEscola('${esc.id}')">
                ${esc.icone} ${esc.nome}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- SELETOR DE STRANDS -->
        <div class="ac-form-group mb-2">
          <label class="ac-label">2. Escolha o Tier / Strand de Encantamento:</label>
          <div class="ac-pill-btn-group">
            ${APENDICE3_ENCANTAMENTO.tiers_strands.map(t => `
              <button type="button" class="ac-pill-btn ${tierAtual === t.tier ? 'ativo' : ''}"
                      onclick="window._acEnchEscolherTier(${t.tier})">
                ${t.rotulo}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- PROPRIEDADES SELECIONÁVEIS DO APÊNDICE 3 -->
        <div class="ac-form-group">
          <label class="ac-label">3. Propriedades Mágicas Oficiais Disponíveis (Clique para Aplicar):</label>
          <div class="ac-apendice3-prop-cards-grid">
            ${propriedadesApendice3.map(p => `
              <div class="ac-prop-card-selectable" style="padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 6px; cursor: pointer;"
                   onclick="window._acEnchAplicarPropriedadeApendice3('${escHtml(p.nome)}', '${escHtml(p.efeito)}', ${strandInfo.cdBase}, '${escHtml(strandInfo.tempoSugerido)}', ${strandInfo.custoPoSugerido}, '${escHtml(strandInfo.catalisadorSugerido)}')">
                <div style="font-weight: 700; color: #a855f7; font-size: 0.95rem; margin-bottom: 4px;">✨ ${escHtml(p.nome)}</div>
                <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.4; margin-bottom: 6px;">${escHtml(p.efeito)}</div>
                <div style="display: flex; gap: 6px; font-size: 0.75rem;">
                  <span class="ac-badge-tag">${escHtml(p.gatilho)}</span>
                  <span class="ac-pill-status">${escHtml(p.cargas)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- TIPO DA ESSÊNCIA -->
      <div class="ac-form-group">
        <label class="ac-label">Tipo Fundamental da Essência Mágica:</label>
        <div class="ac-cards-choice-grid">
          ${tipos.map(t => `
            <div class="ac-choice-card ${state.tipoEssencia === t.id ? 'selecionado' : ''}"
                 onclick="window._acEnchEscolherTipoEssencia('${t.id}')">
              <div class="ac-choice-top">
                <span class="ac-choice-name">${t.id}</span>
              </div>
              <p class="ac-choice-desc">${t.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">Origem & Pureza da Essência</span>
          <span class="ac-box-sub">De onde provém e seu grau</span>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Origem da Essência (Criatura ou Local de Poder):</label>
          <input type="text" class="ac-input" id="ac-ench-origem-essencia" value="${escHtml(state.origemEssencia)}">
          <small class="ac-hint">Ex: Núcleo de Elemental de Fogo, Lágrimas Celestiais, Sangue de Dragão, Cristais de Faerzress.</small>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau de Pureza da Essência:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauEssencia === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauEssencia" value="${g.id}" ${state.grauEssencia === g.id ? 'checked' : ''}
                       onchange="window._acEnchAlterarGrauEssencia('${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- CATALISADOR RITUAL -->
      <div class="ac-box-highlight">
        <div class="ac-box-header">
          <span class="ac-box-tag">Catalisadores & Focos Rituais</span>
          <span class="ac-box-sub">Pó de diamante, gemas puras, incenso aromático</span>
        </div>
        <div class="ac-form-grid-2">
          <div class="ac-form-group">
            <label class="ac-label">Nome do Catalisador / Foco:</label>
            <input type="text" class="ac-input" id="ac-ench-catalisador-nome" value="${escHtml(state.catalisadorRitual)}">
          </div>
          <div class="ac-form-group">
            <label class="ac-label">Magia / Feitiço Vinculado:</label>
            <input type="text" class="ac-input" id="ac-ench-magia-nome" value="${escHtml(state.magiaVinculada)}">
          </div>
        </div>
        <div class="ac-form-group">
          <label class="ac-label">Grau do Catalisador:</label>
          <div class="ac-grade-selector-bar">
            ${graus.map(g => `
              <label class="ac-grade-opt ${state.grauCatalisador === g.id ? 'selecionado' : ''}" style="border-color:${g.cor};">
                <input type="radio" name="grauCatalisador" value="${g.id}" ${state.grauCatalisador === g.id ? 'checked' : ''}
                       onchange="window._acEnchAlterarGrauCatalisador('${g.id}')">
                <span class="ac-grade-bullet" style="background:${g.cor};"></span>
                <span class="ac-grade-label-text"><strong>${g.nome}</strong> (${g.modificadorCd > 0 ? `+${g.modificadorCd}` : g.modificadorCd} CD)</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="ac-form-group">
        <label class="ac-label">Custo Estimado dos Componentes Rituais (PO):</label>
        <input type="number" class="ac-input" id="ac-ench-input-custo" value="${state.custoComponentesPo}">
      </div>

    </div>
  `;
}

// Passo 4: Círculo de Encantamento & Ritual
function _renderPasso4Ench(state, calc) {
  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 4: Círculo de Encantamento & Tempo de Ritual</h4>
        <span class="ac-step-pill">Parte 3: Rituais & Círculos</span>
      </div>
      <p class="ac-step-desc">
        O ritual deve ser conduzido dentro de um <strong>Círculo de Encantamento</strong> consagrado, desenhado no piso com pó de prata ou platina para estabilizar o fluxo de magia.
      </p>

      <div class="ac-form-grid-2">
        <div class="ac-form-group">
          <label class="ac-label">Tipo de Círculo Arcano:</label>
          <select class="ac-select" id="ac-ench-sel-circulo">
            <option value="consagrado" ${state.tipoCirculo === 'consagrado' ? 'selected' : ''}>Círculo de Prata Consagrada (Padrão: 0 CD)</option>
            <option value="platina" ${state.tipoCirculo === 'platina' ? 'selected' : ''}>Círculo Rúnico de Platina & Diamante (-2 na CD)</option>
            <option value="basico" ${state.tipoCirculo === 'basico' ? 'selected' : ''}>Círculo Básico de Giz Arcano (+1 na CD)</option>
          </select>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Assistentes Conjuradores (Canalizadores Adicionais):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarAssistentes(-1)">-</button>
            <input type="number" class="ac-input text-center" id="ac-ench-input-assistentes" value="${state.assistentesArkanos}" min="0" max="4">
            <button class="ac-spin-btn" onclick="window._acEnchAjustarAssistentes(1)">+</button>
          </div>
          <small class="ac-hint">Conjuradores adicionais estabilizam a Trama (-1 na CD com 1+ assistentes).</small>
        </div>
      </div>

      <div class="ac-calc-preview-card">
        <div class="ac-calc-row">
          <span>Tempo Total de Encantamento:</span>
          <strong class="gold">${state.tempoDiasRitual} dias contínuos</strong>
        </div>
        <div class="ac-calc-row">
          <span>Dedicação Diária no Círculo:</span>
          <strong>${state.horasPorDiaRitual || 6} horas de canalização por dia</strong>
        </div>
      </div>

    </div>
  `;
}

// Passo 5: Revisão
function _renderPasso5Ench(state, calc) {
  const modMenorGrau = GRAUS_MATERIAL[calc.menorGrau]?.modificadorCd ?? 0;
  let modCirc = 0;
  if (state.tipoCirculo === 'basico') modCirc = 1;
  if (state.tipoCirculo === 'platina') modCirc = -2;
  let modAss = state.assistentesArkanos > 0 ? -1 : 0;

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 5: Revisão da Ficha de Encantamento & CD Final</h4>
        <span class="ac-step-pill">Matriz Arcana</span>
      </div>
      <p class="ac-step-desc">
        Antes de acender as velas do círculo e iniciar os encantamentos rituais, revise todos os termos da sua ficha de encantamento.
      </p>

      <div class="ac-formula-breakdown-card">
        <div class="ac-formula-title">CÁLCULO DA DIFICULDADE DO RITO (CD FINAL)</div>
        <div class="ac-formula-grid">
          <div class="ac-formula-col">
            <span class="label">CD Base (${state.raridade})</span>
            <span class="val">${calc.cdBase}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Grau dos Reagentes (${GRAUS_MATERIAL[calc.menorGrau]?.nome})</span>
            <span class="val">${modMenorGrau >= 0 ? `+${modMenorGrau}` : modMenorGrau}</span>
          </div>
          <div class="ac-formula-op">+</div>
          <div class="ac-formula-col">
            <span class="label">Círculo & Assistentes</span>
            <span class="val">${(modCirc + modAss) >= 0 ? `+${modCirc + modAss}` : (modCirc + modAss)}</span>
          </div>
          <div class="ac-formula-op">=</div>
          <div class="ac-formula-col total">
            <span class="label">CD FINAL DO RITO</span>
            <span class="val" style="color:#c084fc;">${calc.cdFinalCalculada}</span>
          </div>
        </div>
      </div>

      <div class="ac-review-table">
        <div class="ac-review-row">
          <span class="k">Item Mágico:</span>
          <span class="v font-bold" style="color:#c084fc;">${escHtml(state.nomeItemMagico)} (${state.raridade})</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Encantador:</span>
          <span class="v">${escHtml(state.nomeEncantador)} (${escHtml(state.especializacao)}) • Arcanismo: +${state.bonusArcanismo}</span>
        </div>
        <div class="ac-review-row highlight">
          <span class="k">Meta de Esforço da Trama (UE):</span>
          <span class="v gold font-bold">${calcularEsforcoAlvo('enchanting', state, calc)} UE (estimativa de ${Math.ceil(calcularEsforcoAlvo('enchanting', state, calc) / 7)} ciclos de canalização)</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Dinâmica de Rito (D&D 5.5e):</span>
          <span class="v text-muted" style="font-size:0.85rem;">Sequência de ciclos rituais contra a CD ${calc.cdFinalCalculada}. Sobrecarga arcana e falhas acumulam Níveis de Exaustão (-2 cumulativo em cada d20 seguinte).</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Objeto Físico Base:</span>
          <span class="v">${escHtml(state.objetoBaseFisico)} • Grau ${GRAUS_MATERIAL[state.grauObjetoBase]?.nome}</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Essência Primária:</span>
          <span class="v">${state.tipoEssencia} • ${escHtml(state.origemEssencia)} (Grau ${GRAUS_MATERIAL[state.grauEssencia]?.nome})</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Duração do Ritual:</span>
          <span class="v">${state.tempoDiasRitual} dias contínuos</span>
        </div>
        <div class="ac-review-row">
          <span class="k">Custo dos Componentes:</span>
          <span class="v font-bold">${calc.custoFinalPo} po</span>
        </div>
      </div>

    </div>
  `;
}

// Passo 6: Rito de Imbuição (Ciclos de Harmonização & Esforço Acumulado)
function _renderPasso6Ench(state, calc) {
  const cd = calc.cdFinalCalculada;

  if (!state.sessaoEsforco) {
    state.sessaoEsforco = inicializarSessaoEsforco('enchanting', state, calc);
  }

  const arenaHtml = renderizarArenaEsforcoHTML(state.sessaoEsforco, {
    cdCiclo: cd,
    bonusBase: Number(state.bonusArcanismo),
    modificadorExtraManual: Number(state.modificadorExtraManual || 0),
    modoRolagem: state.modoRolagem || 'normal'
  }, {
    rolarCiclo: "window._acEnchRolarCiclo()",
    autoResolver: "window._acEnchAutoResolver()",
    descansar: "window._acEnchDescansar()",
    reiniciarSessao: "window._acEnchReiniciarSessao()",
    avancarFicha: "window._acEnchAvancarFicha()",
    setModo: "window._acEnchSetModoRolagem",
    ajustarExtra: "window._acEnchAjustarExtra"
  });

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 6: Rito de Imbuição Arcana • Harmonização de Trama & Esforço Acumulado</h4>
        <span class="ac-step-pill" style="border-color:#a855f7; color:#c084fc;">Regras Oficiais D&D 5.5e • Fadiga Mística & Exaustão</span>
      </div>
      <p class="ac-step-desc">
        O encantamento é um <strong>ritual contínuo por turnos de canalização da Trama</strong>: cada ciclo de invocação avança rumo à <strong>Meta de Esforço Arcano (${state.sessaoEsforco.esforcoAlvo} UE)</strong> contra a <strong>CD ${cd}</strong>. Sobrecargas místicas ou esforço ininterrupto causam <strong>Níveis de Exaustão (D&D 5.5e: -2 por nível)</strong>, turvando a concentração nas etapas seguintes se o conjurador não meditar e repousar!
      </p>

      <div class="ac-rules-pills-grid">
        <div class="ac-rule-pill-item win-nat">
          <strong>20 Natural (Harmonia Cósmica):</strong> Ressonância perfeita da Trama: avanço massivo de progresso arcano sem desgaste mental.
        </div>
        <div class="ac-rule-pill-item win">
          <strong>Sucesso (≥ CD):</strong> Imbuição estável. A magia é fixada com segurança, somando progresso ao Esforço Acumulado (UE).
        </div>
        <div class="ac-rule-pill-item fail">
          <strong>Falha (&lt; CD):</strong> Dissipação instável. Risco de ricochete místico (salvaguarda de CON ou Exaustão).
        </div>
        <div class="ac-rule-pill-item fail-nat">
          <strong>Exaustão (D&D 5.5e):</strong> -2 cumulativo em todos os testes de d20. Meditar e descansar recupera -1 nível.
        </div>
      </div>

      ${arenaHtml}

    </div>
  `;
}

// Passo 7: Ficha Oficial de Encantamento
function _renderPasso7Ench(state, calc) {
  const ult = state.ultimoResultado || {
    total: calc.cdFinalCalculada + 3,
    cdFinal: calc.cdFinalCalculada,
    sucesso: true,
    obraPrima: false,
    menorGrau: calc.menorGrau,
    dadoEscolhido: 16,
    modTotal: state.bonusArcanismo,
    logRegra: 'Item imbuído com perfeição.'
  };

  return `
    <div class="ac-step-section">
      <div class="ac-step-title-row">
        <h4>Passo 7: Ficha de Encantamento Oficial Concluída</h4>
        <span class="ac-step-pill">Modelo Oficial de Encantamento • Nord Games</span>
      </div>
      <p class="ac-step-desc">
        Abaixo está o modelo virtual oficial da <strong>Ficha de Encantamento</strong> da Parte 3 do livro, chancelada com as runas de aprovação arcana.
      </p>

      <div class="ac-official-sheet-card" id="ac-enchanting-sheet-print" style="border-color: rgba(168, 85, 247, 0.45);">
        
        <div class="ac-of-sheet-header" style="border-bottom-color: rgba(168, 85, 247, 0.3);">
          <div class="ac-of-sheet-seal">✨</div>
          <div class="ac-of-sheet-titles">
            <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 3</span>
            <h2 class="ac-of-sheet-main-title">FICHA DE PROCESSO DE ENCANTAMENTO (ENCHANTING SHEET)</h2>
            <span class="ac-of-sheet-sub">Registro de Rituais, Imbuição & Forja Mágica</span>
          </div>
          <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
            ${ult.obraPrima ? 'RESSONÂNCIA' : ult.sucesso ? 'IMBUÍDO' : 'DISSIPADO'}
          </div>
        </div>

        <div class="ac-of-sheet-grid-2">
          <div class="ac-of-field">
            <label>NOME DO ENCANTADOR / CONJURADOR</label>
            <div class="value">${escHtml(state.nomeEncantador)}</div>
          </div>
          <div class="ac-of-field">
            <label>ESPECIALIZAÇÃO & ARCANISMO</label>
            <div class="value">${escHtml(state.especializacao)} • Bônus Arcanismo: +${state.bonusArcanismo}</div>
          </div>
          <div class="ac-of-field">
            <label>CÍRCULO MÁGICO & INSTALAÇÕES</label>
            <div class="value">${state.tipoCirculo === 'platina' ? 'Círculo de Platina & Diamante' : 'Círculo de Prata Consagrada'}</div>
          </div>
          <div class="ac-of-field">
            <label>SINTONIZAÇÃO</label>
            <div class="value">${state.requerSintonizacao ? 'Requer Sintonização' : 'Livre de Sintonização'}</div>
          </div>
        </div>

        <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DO ITEM MÁGICO CONCEBIDO</div>
        <div class="ac-of-sheet-grid-3">
          <div class="ac-of-field">
            <label>NOME DO ITEM</label>
            <div class="value font-bold" style="color: #c084fc;">${escHtml(state.nomeItemMagico)}</div>
          </div>
          <div class="ac-of-field">
            <label>RARIDADE</label>
            <div class="value font-bold" style="color: #f59e0b;">${state.raridade}</div>
          </div>
          <div class="ac-of-field">
            <label>DURAÇÃO DO RITUAL</label>
            <div class="value">${state.tempoDiasRitual} dias contínuos</div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>PROPRIEDADES MÁGICAS & CANAIS DE PODER</label>
          <div class="value">${escHtml(state.propriedadesMagicas)} ${ult.obraPrima ? ' • [Propriedade Menor: Reluz com pulsação arcana pura]' : ''}</div>
        </div>

        <div class="ac-of-sheet-section-title">COMPONENTES, ESSÊNCIAS & RITUAL</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>ELEMENTO</th>
                <th>ESPECIFICAÇÃO</th>
                <th>ORIGEM</th>
                <th>GRAU / PUREZA</th>
                <th>MOD. CD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Objeto Base</strong></td>
                <td>${escHtml(state.objetoBaseFisico)}</td>
                <td>Forja Nobre / Artesanato</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauObjetoBase]?.cor}">${GRAUS_MATERIAL[state.grauObjetoBase]?.nome}</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td><strong>Essência Primária</strong></td>
                <td>Essência ${state.tipoEssencia}</td>
                <td>${escHtml(state.origemEssencia)}</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauEssencia]?.cor}">${GRAUS_MATERIAL[state.grauEssencia]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauEssencia]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauEssencia]?.modificadorCd}` : GRAUS_MATERIAL[state.grauEssencia]?.modificadorCd}</td>
              </tr>
              <tr>
                <td><strong>Catalisador / Magia</strong></td>
                <td>${escHtml(state.catalisadorRitual)} • ${escHtml(state.magiaVinculada)}</td>
                <td>Oficina Arcana</td>
                <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[state.grauCatalisador]?.cor}">${GRAUS_MATERIAL[state.grauCatalisador]?.nome}</span></td>
                <td>${GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd > 0 ? `+${GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd}` : GRAUS_MATERIAL[state.grauCatalisador]?.modificadorCd}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="ac-of-sheet-section-title">RESOLUÇÃO DO RITO • ESFORÇO DA TRAMA & CICLOS (D&D 5.5e)</div>
        <div class="ac-of-sheet-grid-4">
          <div class="ac-of-field">
            <label>CD FINAL DO RITO</label>
            <div class="value font-bold" style="color: #c084fc;">CD ${ult.cdFinal}</div>
          </div>
          <div class="ac-of-field">
            <label>ESFORÇO ACUMULADO (UE)</label>
            <div class="value font-bold gold">${ult.progressoAtual !== undefined ? ult.progressoAtual : (state.sessaoEsforco?.progressoAtual || ult.total)} / ${ult.esforcoAlvo || state.sessaoEsforco?.esforcoAlvo || 48} UE</div>
          </div>
          <div class="ac-of-field">
            <label>CICLOS DE RITUAL</label>
            <div class="value font-bold">${ult.ciclosCount || state.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1} ritos executados</div>
          </div>
          <div class="ac-of-field">
            <label>FADIGA / EXAUSTÃO MÍSTICA</label>
            <div class="value font-bold" style="color: ${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).cor};">
              Nível ${ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0} (${getInfoExaustao(ult.nivelExaustaoFinal ?? state.sessaoEsforco?.nivelExaustao ?? 0).rotulo})
            </div>
          </div>
        </div>

        <div class="ac-of-field" style="margin-top:8px;">
          <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
          <div class="value">${ult.logRegra}</div>
        </div>

        <!-- HISTÓRICO DE CICLOS DE RITUAL (D&D 5.5e) -->
        ${state.sessaoEsforco?.ciclosExecutados?.length > 0 ? `
          <div class="ac-of-sheet-section-title">HISTÓRICO DE RITUAIS & ESFORÇO DA TRAMA (D&D 5.5e)</div>
          <div class="ac-of-table-container">
            <table class="ac-of-table">
              <thead>
                <tr>
                  <th>RITO</th>
                  <th>DADO D20</th>
                  <th>BÔNUS</th>
                  <th>PEN. EXAUSTÃO</th>
                  <th>TOTAL VS CD</th>
                  <th>HARMONIA</th>
                  <th>ACUMULADO</th>
                  <th>EXAUSTÃO</th>
                  <th>RELATO DO CÍRCULO</th>
                </tr>
              </thead>
              <tbody>
                ${state.sessaoEsforco.ciclosExecutados.map(c => `
                  <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                    <td><strong>${c.tipo === 'descanso' ? '🛌 Meditação' : `#${c.numCiclo}`}</strong></td>
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
          <span>Assinatura do Mestre de Encantamento: <em>${escHtml(state.nomeEncantador)}</em></span>
          <span>Selo da Cidadela Arcana: <strong>Vínculo Permanente de Trama</strong></span>
          <span>Data: ${new Date().toLocaleDateString()}</span>
        </div>

      </div>

      <div class="ac-sheet-actions-bar">
        ${state.personagemId && ult.sucesso ? `
          <button class="btn btn-primary ac-btn-add-inv" id="ac-ench-btn-adicionar-inventario" style="background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%);">
            📥 Adicionar Item Mágico à Ficha do Personagem
          </button>
        ` : ''}

        <button class="btn btn-outline" id="ac-ench-btn-copiar-ficha">
          📋 Copiar Resumo da Ficha
        </button>

        <button class="btn btn-outline" id="ac-ench-btn-salvar-caderno">
          💾 Salvar no Caderno de Fichas
        </button>

        <button class="btn btn-outline" id="ac-ench-btn-imprimir">
          🖨️ Imprimir / Salvar PDF
        </button>

        <button class="btn btn-outline" id="ac-ench-btn-reiniciar">
          🔄 Novo Encantamento
        </button>
      </div>

    </div>
  `;
}

function _setupEventosEnchanting(container, state, onUpdateState, onIrParaBanco, calc) {
  // Inicializa deslizamento suave e centralização automática no passo ativo
  const stepsTracker = container.querySelector('#ac-ench-steps-tracker');
  const stepPrev = container.querySelector('#ac-ench-step-prev');
  const stepNext = container.querySelector('#ac-ench-step-next');
  if (stepsTracker) {
    tornarBarraDeslizavel(stepsTracker, {
      btnEsquerda: stepPrev,
      btnDireita: stepNext,
      passoScroll: 180,
      centralizarAtivo: true,
      seletorAtivo: '.ac-step-node.ativo'
    });
  }

  window._acMudarPassoEnchanting = (novoPasso) => {
    state.passoAtual = Math.max(1, Math.min(7, novoPasso));
    onUpdateState(state);
  };

  window._acEnchEscolherEspec = (espec) => {
    state.especializacao = espec;
    onUpdateState(state);
  };

  window._acEnchAjustarBonus = (delta) => {
    state.bonusArcanismo = Math.max(-2, Number(state.bonusArcanismo || 0) + delta);
    onUpdateState(state);
  };

  window._acEnchCarregarModelo = (modeloId) => {
    const mod = MODELOS_BASE_ENCHANTING.find(m => m.id === modeloId);
    if (!mod) return;
    state.nomeItemMagico = mod.nome;
    state.categoriaItem = mod.categoria;
    state.especializacao = mod.especializacao;
    state.raridade = mod.raridade;
    state.cdBaseRaridade = mod.cdBase;
    state.tempoDiasRitual = mod.tempoDias;
    state.custoComponentesPo = mod.custoBasePo;
    state.objetoBaseFisico = mod.objetoBase;
    state.grauObjetoBase = mod.grauObjeto;
    state.tipoEssencia = mod.essenciaTipo;
    state.grauEssencia = mod.essenciaGrau;
    state.origemEssencia = mod.origemEssencia;
    state.catalisadorRitual = mod.catalisador;
    state.grauCatalisador = mod.grauCatalisador;
    state.magiaVinculada = mod.magiaVinculada;
    state.requerSintonizacao = mod.requerSintonizacao;
    state.propriedadesMagicas = mod.propriedades;
    toast(`Modelo carregado: ${mod.nome}`);
    onUpdateState(state);
  };

  window._acEnchAlterarGrauObjeto = (grau) => {
    state.grauObjetoBase = grau;
    onUpdateState(state);
  };

  window._acEnchEscolherEscola = (escolaId) => {
    state.escolaMagia = escolaId;
    onUpdateState(state);
  };

  window._acEnchEscolherTier = (tierNum) => {
    state.tierStrand = Number(tierNum);
    const strand = APENDICE3_ENCANTAMENTO.tiers_strands.find(t => t.tier === Number(tierNum));
    if (strand) {
      state.cdBaseRaridade = strand.cdBase;
      state.custoComponentesPo = strand.custoPoSugerido;
    }
    onUpdateState(state);
  };

  window._acEnchAplicarPropriedadeApendice3 = (nome, efeito, cd, tempoStr, custo, catalisador) => {
    state.propriedadesMagicas = `[${nome}]: ${efeito}`;
    state.cdBaseRaridade = cd;
    state.custoComponentesPo = custo;
    if (catalisador) state.catalisadorRitual = catalisador;

    // Converte tempo estimado em dias
    if (tempoStr) {
      const match = tempoStr.match(/(\d+)/);
      if (match) state.tempoDiasRitual = Number(match[1]);
    }

    toast(`Propriedade "${nome}" aplicada! CD ${cd}, Custo ${custo} PO e efeitos vinculados ao ritual.`, 'success');
    onUpdateState(state);
  };

  window._acEnchAjustarDias = (delta) => {
    state.tempoDiasRitual = Math.max(1, Number(state.tempoDiasRitual || 1) + delta);
    onUpdateState(state);
  };

  window._acEnchEscolherTipoEssencia = (tipo) => {
    state.tipoEssencia = tipo;
    onUpdateState(state);
  };

  window._acEnchAlterarGrauEssencia = (grau) => {
    state.grauEssencia = grau;
    onUpdateState(state);
  };

  window._acEnchAlterarGrauCatalisador = (grau) => {
    state.grauCatalisador = grau;
    onUpdateState(state);
  };

  window._acEnchAjustarAssistentes = (delta) => {
    state.assistentesArkanos = Math.max(0, Math.min(4, Number(state.assistentesArkanos || 0) + delta));
    onUpdateState(state);
  };

  window._acEnchSetModoRolagem = (modo) => {
    state.modoRolagem = modo;
    onUpdateState(state);
  };

  window._acEnchAjustarExtra = (delta) => {
    state.modificadorExtraManual = Number(state.modificadorExtraManual || 0) + delta;
    onUpdateState(state);
  };

  window._acEnchRolarCiclo = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('enchanting', state, calc);
    }
    rolarCicloTrabalho(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusArcanismo),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoEnchanting(state, calc);
    onUpdateState(state);
  };

  window._acEnchAutoResolver = () => {
    if (!state.sessaoEsforco) {
      state.sessaoEsforco = inicializarSessaoEsforco('enchanting', state, calc);
    }
    autoResolverCiclos(state.sessaoEsforco, {
      cdCiclo: calc.cdFinalCalculada,
      bonusBase: Number(state.bonusArcanismo),
      modificadorExtraManual: Number(state.modificadorExtraManual || 0),
      modoRolagem: state.modoRolagem || 'normal'
    });
    _sincronizarResultadoEnchanting(state, calc);
    toast('Todos os ritos de encantamento restantes foram concluídos com gestão de fadiga!', 'success');
    onUpdateState(state);
  };

  window._acEnchDescansar = () => {
    if (!state.sessaoEsforco) return;
    const res = descansarSessao(state.sessaoEsforco);
    toast(res.mensagem, res.sucesso ? 'info' : 'warning');
    _sincronizarResultadoEnchanting(state, calc);
    onUpdateState(state);
  };

  window._acEnchReiniciarSessao = () => {
    state.sessaoEsforco = inicializarSessaoEsforco('enchanting', state, calc);
    state.ultimoResultado = null;
    toast('Círculo ritual reiniciado para nova sessão de encantamento.');
    onUpdateState(state);
  };

  window._acEnchAvancarFicha = () => {
    state.passoAtual = 7;
    onUpdateState(state);
  };

  // Botões de navegação
  const btnVoltar = container.querySelector('#ac-ench-btn-voltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      if (state.passoAtual > 1) {
        state.passoAtual--;
        onUpdateState(state);
      }
    });
  }

  const btnAvancar = container.querySelector('#ac-ench-btn-avancar');
  if (btnAvancar) {
    btnAvancar.addEventListener('click', () => {
      if (state.passoAtual < 6) {
        state.passoAtual++;
        onUpdateState(state);
      }
    });
  }

  const btnAvancarFicha = container.querySelector('#ac-ench-btn-avancar-ficha');
  if (btnAvancarFicha) {
    btnAvancarFicha.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  const btnNovoProcesso = container.querySelector('#ac-ench-btn-novo-processo');
  if (btnNovoProcesso) {
    btnNovoProcesso.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialEnchanting());
      toast('Novo processo de encantamento iniciado.');
      onUpdateState(state);
    });
  }

  const btnVerMateriais = container.querySelector('#ac-ench-btn-ver-materiais');
  if (btnVerMateriais && onIrParaBanco) {
    btnVerMateriais.addEventListener('click', () => {
      onIrParaBanco();
    });
  }

  // Inputs Passo 1
  const selChar = container.querySelector('#ac-ench-sel-personagem');
  if (selChar) {
    selChar.addEventListener('change', (e) => {
      state.personagemId = e.target.value;
      if (state.personagemId) {
        const char = getPersonagem(state.personagemId);
        if (char) {
          state.nomeEncantador = char.nome;
          const mod = Math.floor(((char.atributos?.[state.atributoConjuracao]?.total || 10) - 10) / 2);
          const prof = Math.floor(((char.nivel || 1) - 1) / 4) + 2;
          state.bonusArcanismo = mod + prof;
        }
      }
      onUpdateState(state);
    });
  }

  const inputNome = container.querySelector('#ac-ench-input-nome');
  if (inputNome) inputNome.addEventListener('input', (e) => { state.nomeEncantador = e.target.value; });

  const selAtr = container.querySelector('#ac-ench-sel-atributo');
  if (selAtr) {
    selAtr.addEventListener('change', (e) => {
      state.atributoConjuracao = e.target.value;
      if (state.personagemId) {
        const char = getPersonagem(state.personagemId);
        if (char) {
          const mod = Math.floor(((char.atributos?.[state.atributoConjuracao]?.total || 10) - 10) / 2);
          const prof = Math.floor(((char.nivel || 1) - 1) / 4) + 2;
          state.bonusArcanismo = mod + prof;
        }
      }
      onUpdateState(state);
    });
  }

  const inputBonus = container.querySelector('#ac-ench-input-bonus');
  if (inputBonus) inputBonus.addEventListener('change', (e) => { state.bonusArcanismo = Number(e.target.value); onUpdateState(state); });

  const selEspaco = container.querySelector('#ac-ench-sel-espaco');
  if (selEspaco) selEspaco.addEventListener('change', (e) => { state.espacoMagiaMaximo = Number(e.target.value); onUpdateState(state); });

  // Inputs Passo 2
  const selRaridade = container.querySelector('#ac-ench-sel-raridade');
  if (selRaridade) selRaridade.addEventListener('change', (e) => { state.raridade = e.target.value; onUpdateState(state); });
  const inputNomeItem = container.querySelector('#ac-ench-input-nome-item');
  if (inputNomeItem) inputNomeItem.addEventListener('input', (e) => { state.nomeItemMagico = e.target.value; });
  const inputObjBase = container.querySelector('#ac-ench-input-objeto-base');
  if (inputObjBase) inputObjBase.addEventListener('input', (e) => { state.objetoBaseFisico = e.target.value; });
  const selSint = container.querySelector('#ac-ench-sel-sintonizacao');
  if (selSint) selSint.addEventListener('change', (e) => { state.requerSintonizacao = e.target.value === 'sim'; onUpdateState(state); });
  const inputProps = container.querySelector('#ac-ench-input-props');
  if (inputProps) inputProps.addEventListener('input', (e) => { state.propriedadesMagicas = e.target.value; });

  // Inputs Passo 3
  const inputOrigem = container.querySelector('#ac-ench-origem-essencia');
  if (inputOrigem) inputOrigem.addEventListener('input', (e) => { state.origemEssencia = e.target.value; });
  const inputCat = container.querySelector('#ac-ench-catalisador-nome');
  if (inputCat) inputCat.addEventListener('input', (e) => { state.catalisadorRitual = e.target.value; });
  const inputMagia = container.querySelector('#ac-ench-magia-nome');
  if (inputMagia) inputMagia.addEventListener('input', (e) => { state.magiaVinculada = e.target.value; });
  const inputCusto = container.querySelector('#ac-ench-input-custo');
  if (inputCusto) inputCusto.addEventListener('change', (e) => { state.custoComponentesPo = Number(e.target.value); onUpdateState(state); });

  // Inputs Passo 4
  const selCirc = container.querySelector('#ac-ench-sel-circulo');
  if (selCirc) selCirc.addEventListener('change', (e) => { state.tipoCirculo = e.target.value; onUpdateState(state); });

  // Passo 6: Rolar
  const btnExecTeste = container.querySelector('#ac-ench-btn-executar-teste');
  if (btnExecTeste) {
    btnExecTeste.addEventListener('click', () => {
      _executarRolagemEnchanting(state, onUpdateState);
    });
  }

  const btnTentarDeNovo = container.querySelector('#ac-ench-btn-tentar-novamente');
  if (btnTentarDeNovo) {
    btnTentarDeNovo.addEventListener('click', () => {
      state.ultimoResultado = null;
      toast('Nova essência primária preparada: o objeto físico foi preservado intacto.');
      onUpdateState(state);
    });
  }

  const btnConcluirAvancar = container.querySelector('#ac-ench-btn-concluir-avancar');
  if (btnConcluirAvancar) {
    btnConcluirAvancar.addEventListener('click', () => {
      state.passoAtual = 7;
      onUpdateState(state);
    });
  }

  // Passo 7: Ações
  const btnAddInv = container.querySelector('#ac-ench-btn-adicionar-inventario');
  if (btnAddInv) {
    btnAddInv.addEventListener('click', () => {
      _adicionarAoInventarioEnchanting(state);
    });
  }

  const btnCopiarFicha = container.querySelector('#ac-ench-btn-copiar-ficha');
  if (btnCopiarFicha) {
    btnCopiarFicha.addEventListener('click', () => {
      _copiarFichaTextoEnchanting(state);
    });
  }

  const btnSalvarCaderno = container.querySelector('#ac-ench-btn-salvar-caderno');
  if (btnSalvarCaderno) {
    btnSalvarCaderno.addEventListener('click', () => {
      _salvarFichaNoCadernoEnchanting(state);
    });
  }

  const btnImprimir = container.querySelector('#ac-ench-btn-imprimir');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      imprimirFichaOficial('enchanting', state);
    });
  }

  const btnReiniciar = container.querySelector('#ac-ench-btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
      Object.assign(state, criarEstadoInicialEnchanting());
      toast('Novo processo de encantamento iniciado.');
      onUpdateState(state);
    });
  }
}

function _sincronizarResultadoEnchanting(state, calc) {
  const s = state.sessaoEsforco;
  if (!s) return;
  const ult = s.ultimoCiclo || {};
  const ciclosValidos = s.ciclosExecutados.filter(c => c.tipo !== 'descanso');
  const ciclosCount = ciclosValidos.length;
  const penalidade = s.nivelExaustao * 2;

  state.ultimoResultado = {
    dataHora: new Date().toISOString(),
    dado1: ult.dado1 || ult.dadoEscolhido || 12,
    dado2: ult.dado2,
    dadoEscolhido: ult.dadoEscolhido || 12,
    modTotal: ult.modTotalEfetivo !== undefined ? ult.modTotalEfetivo : (Number(state.bonusArcanismo) - penalidade),
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
      ? `Encantamento ancorado na Trama com sucesso após ${ciclosCount} ritos de canalização (${s.diasDecorridos} dias de ritual)! Meta de ${s.esforcoAlvo} UE de Esforço da Trama atingida. Nível final de fadiga mística: ${s.nivelExaustao} (Exaustão D&D 5.5e: -${penalidade} no d20).`
      : s.colapsado
        ? `Colapso do conjurador por Sobrecarga Mística (Nível 6 de Exaustão). O ritual foi paralisado após ${ciclosCount} ritos.`
        : `Ritual de encantamento em andamento: ${s.progressoAtual} de ${s.esforcoAlvo} UE acumulados (${ciclosCount} ritos executados). Nível de Exaustão atual: ${s.nivelExaustao}.`
  };
}

function _adicionarAoInventarioEnchanting(state) {
  if (!state.personagemId) {
    toast('Selecione um personagem no Passo 1 primeiro.', 'warning');
    return;
  }
  const char = getPersonagem(state.personagemId);
  if (!char) return;
  if (!char.inventario) char.inventario = [];

  const ult = state.ultimoResultado;

  const novoItem = {
    id: `item_ench_${Date.now()}`,
    nome: `${state.nomeItemMagico}${ult?.obraPrima ? ' (Ressonante)' : ''}`,
    quantidade: 1,
    peso: 1.0,
    equipado: false,
    sintonizado: false,
    tipo: state.categoriaItem,
    raridade: state.raridade,
    descricao: `${state.propriedadesMagicas}\n[Encantado no Arcane Craft por ${state.nomeEncantador} • Essência ${state.tipoEssencia}]`,
    notas: `Sintonização: ${state.requerSintonizacao ? 'Sim' : 'Não'} • Ritual: ${state.tempoDiasRitual} dias • CD ${ult?.cdFinal || state.cdBaseRaridade}`
  };

  char.inventario.push(novoItem);
  salvarPersonagem(char);
  toast(`Item Mágico "${novoItem.nome}" adicionado com sucesso ao inventário de ${char.nome}!`, 'success');
}

function _copiarFichaTextoEnchanting(state) {
  const ult = state.ultimoResultado;
  const texto = `=== FICHA DE PROCESSO DE ENCANTAMENTO (ARCANE CRAFT) ===
Item Mágico: ${state.nomeItemMagico} (${state.raridade})
Encantador: ${state.nomeEncantador} (${state.especializacao})
Objeto Base: ${state.objetoBaseFisico} [Grau: ${state.grauObjetoBase}]
Essência: ${state.tipoEssencia} - ${state.origemEssencia} [Grau: ${state.grauEssencia}]
Catalisador: ${state.catalisadorRitual} • Magia: ${state.magiaVinculada}
CD Final: ${ult?.cdFinal || state.cdBaseRaridade} | Esforço da Trama: ${ult?.progressoAtual || state.sessaoEsforco?.progressoAtual || '-'}/${ult?.esforcoAlvo || state.sessaoEsforco?.esforcoAlvo || '-'} UE (${ult?.ciclosCount || 1} ritos)
Exaustão Mística: Nível ${ult?.nivelExaustaoFinal ?? 0}
Resultado: ${ult?.sucesso ? (ult.obraPrima ? 'RESSONÂNCIA HARMÔNICA' : 'SUCESSO') : 'FALHA'}
Propriedades: ${state.propriedadesMagicas}
Data: ${new Date().toLocaleString()}`;

  navigator.clipboard.writeText(texto).then(() => {
    toast('Ficha copiada para a área de transferência!');
  });
}

function _salvarFichaNoCadernoEnchanting(state) {
  const s = state.sessaoEsforco;
  const ult = state.ultimoResultado;
  const ficha = {
    id: `ench_${Date.now()}`,
    tipoProcesso: 'enchanting',
    titulo: state.nomeItemMagico,
    subtitulo: `${state.raridade} • ${state.especializacao}`,
    data: new Date().toISOString(),
    artesao: state.nomeEncantador,
    sucesso: ult?.sucesso ?? true,
    obraPrima: ult?.obraPrima ?? false,
    cdFinal: ult?.cdFinal ?? state.cdBaseRaridade,
    totalRolado: ult?.total ?? '-',
    esforcoAlvo: ult?.esforcoAlvo ?? s?.esforcoAlvo ?? 48,
    esforcoAtingido: ult?.progressoAtual ?? s?.progressoAtual ?? 48,
    ciclosCount: ult?.ciclosCount ?? s?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length ?? 1,
    nivelExaustao: ult?.nivelExaustaoFinal ?? s?.nivelExaustao ?? 0,
    ciclosHistorico: ult?.ciclosHistorico || s?.ciclosExecutados || [],
    dados: { ...state }
  };

  salvarFichaProcesso(ficha);
  toast('Ficha arquivada com sucesso no Caderno do Artesão!');
}
