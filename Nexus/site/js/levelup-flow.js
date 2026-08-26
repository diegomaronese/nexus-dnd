// ============================================================
// Motor de Fluxo de Level Up - Cards Dinâmicos
// Fase 1: Contexto + Fase 2: Steps dinâmicos
// ============================================================
import { CLASSES_INFO, ATRIBUTOS_KEYS, ATRIBUTOS_NOMES, ESCOLAS_SUBCLASSE_MAGO } from './dados-classes.js';
import { getClasse, getMagiasClasse, getMagiasPorCirculo } from './db.js';
import {
  calcMod, bonusProficiencia, getBonusTruquesOrdem, getEspacosMagia, getTruquesConhecidos, getMagiaPreparadas, semAcento
} from './utils.js';
import {
  getClassesArray, getCatalogoElegibilidadeMulticlasse, MULTICLASSE_PROFICIENCIAS
} from './multiclasse.js';
import {
  concedeAumentoAtributo, exigeDadivaEpica, exigeSubclasse,
  exigeEspecializacaoBardo, exigeEspecializacaoGuardiao, exigeEspecializacaoLadino,
  exigeEstiloLuta, exigeTrocaEstiloLutaGuerreiro, exigeExploradorHabil, exigeAcademico,
  exigeManobrasGuerreiro, getQuantidadeNovasManobras,
  obterCaracteristicasNivel, obterCaracteristicasEspecieNivel,
  obterCaracteristicasSubclasseNivel, obterMagiasDominioNivel,
  obterMagiasSemprePreparadasNivel
} from './levelup.js';

// ---- Fase 1: Construir contexto de level up ----

/**
 * Constrói o contexto completo para o fluxo de level up.
 * Reúne todas as flags, dados de classe e pendências necessárias.
 * @param {Object} char - Personagem atual
 * @param {Object} classeData - Dados carregados da classe (getClasse)
 * @param {Object} helpers - Funções auxiliares do sheet.js (ehSubclasseConjuradora, getSubclasseConjuradoraConjuracao, etc.)
 * @param {string|null} classeAlvoParam - Classe alvo para este nível (seja classe atual ou multiclasse)
 * @returns {Object} ctx - Contexto completo
 */
export async function buildLevelUpContext(char, classeData, helpers = {}, classeAlvoParam = null) {
  const classesAtuais = getClassesArray(char);
  const classeAlvo = classeAlvoParam || char.classe || (classesAtuais[0]?.classe) || 'Guerreiro';

  // Carregar classeData da classe alvo se necessário
  if (!classeData || semAcento(classeData.nome || '') !== semAcento(classeAlvo)) {
    classeData = await getClasse(classeAlvo);
  }

  const classeExistente = classesAtuais.find(c => semAcento(c.classe) === semAcento(classeAlvo));
  const ehNovaClasse = !classeExistente;
  const nivelAtualClasse = classeExistente ? classeExistente.nivel : 0;
  const novoNivelClasse = nivelAtualClasse + 1;
  const subclasseAtual = classeExistente ? (classeExistente.subclasse || '') : '';

  const nivelAtual = char.nivel || 1;
  const nivelNovo = nivelAtual + 1;
  const info = CLASSES_INFO[classeAlvo] || CLASSES_INFO[char.classe] || { dado_vida: 8 };
  const modCon = calcMod(char.atributos.constituicao);

  const ehAnao = semAcento(char.especie || '') === 'Anao' || char.especie === 'Anão';
  const bonusPvAnao = ehAnao ? 1 : 0;
  const temVigoroso = (char.talentos || []).some(t => (typeof t === 'string' ? t : t?.nome) === 'Vigoroso');
  const bonusPvVigoroso = temVigoroso ? 2 : 0;
  const bonusPvPassivos = bonusPvAnao + bonusPvVigoroso;
  const hpGanhoFixo = Math.max(1, Math.floor(info.dado_vida / 2) + 1 + modCon) + bonusPvPassivos;

  // Catálogo de elegibilidade multiclasse
  const catalogoMulticlasse = getCatalogoElegibilidadeMulticlasse(char);

  // Proficiências de multiclasse (se for primeiro nível em nova classe)
  const proficienciasMulticlasse = ehNovaClasse ? MULTICLASSE_PROFICIENCIAS[classeAlvo] : null;
  const precisaPericiaMulticlasse = ehNovaClasse && !!proficienciasMulticlasse?.escolha_pericia;
  const opcoesPericiaMulticlasse = proficienciasMulticlasse?.escolha_pericia?.opcoes || null;
  const precisaInstrumentoMulticlasse = ehNovaClasse && !!proficienciasMulticlasse?.escolha_instrumento;

  // Flags de regras para a classe alvo no seu respectivo novo nível
  const precisaSubclasse = exigeSubclasse(classeAlvo, novoNivelClasse) && !subclasseAtual;
  const ganhaASI = concedeAumentoAtributo(classeAlvo, novoNivelClasse);
  const exigeDadivaEpicaNivel = exigeDadivaEpica(classeAlvo, novoNivelClasse);
  const precisaExpertiseBardo = exigeEspecializacaoBardo(classeAlvo, novoNivelClasse);
  const precisaExpertiseGuardiao = exigeEspecializacaoGuardiao(classeAlvo, novoNivelClasse);
  const precisaEstiloLuta = exigeEstiloLuta(classeAlvo, novoNivelClasse);
  // Troca de Estilo de Luta do Guerreiro: opcional
  const podeTrocarEstiloLutaGuerreiro = exigeTrocaEstiloLutaGuerreiro(classeAlvo, novoNivelClasse);
  // Especialização adicional do Ladino (nível 6): opcional
  const precisaExpertiseLadino = exigeEspecializacaoLadino(classeAlvo, novoNivelClasse);
  const precisaExploradorHabil = exigeExploradorHabil(classeAlvo, novoNivelClasse);
  const precisaAcademico = exigeAcademico(classeAlvo, novoNivelClasse);

  let manobrasGuerreiro = null;
  if (classeAlvo === 'Guerreiro') {
    const opcoesDisponiveis = classeData?.subclasses
      ?.find(sc => sc.nome === 'Mestre da Batalha')?.opcoes_manobra || [];
    manobrasGuerreiro = {
      opcoesDisponiveis,
      qtdNova: getQuantidadeNovasManobras(novoNivelClasse),
      manobrasConhecidasAtuais: char.manobras_conhecidas || []
    };
  }

  // Características ganhas neste nível na classe alvo
  const caracteristicas = await obterCaracteristicasNivel(classeAlvo, novoNivelClasse);
  const caracteristicasEspecie = await obterCaracteristicasEspecieNivel(char.especie, nivelNovo, char.tracos_escolhidos);
  const caracteristicasSubclasse = subclasseAtual
    ? await obterCaracteristicasSubclasseNivel(classeAlvo, subclasseAtual, novoNivelClasse)
    : [];
  const magiasDominioNivel = subclasseAtual
    ? await obterMagiasDominioNivel(classeAlvo, subclasseAtual, novoNivelClasse)
    : [];
  const magiasSempreNivel = subclasseAtual
    ? await obterMagiasSemprePreparadasNivel(classeAlvo, subclasseAtual, novoNivelClasse)
    : [];

  // Subclasses disponíveis
  let subclassesDisponiveis = [];
  if (precisaSubclasse && classeData?.subclasses) {
    subclassesDisponiveis = classeData.subclasses
      .filter(sc => !sc.nome.toLowerCase().startsWith('subclasses de'));
  }

  // Conjuração para a classe alvo
  const ehSubConj = (classeAlvo === char.classe && helpers.ehSubclasseConjuradora?.()) || false;
  const ehConjurador = !!(info.conjurador || ehSubConj);
  const tipoConj = info.tipo_conjuracao || (ehSubConj ? 'conhecidas' : 'preparadas');

  let conjuracao = null;
  if (ehConjurador) {
    const tabela = classeData?.tabela_caracteristicas;
    let truquesAtual = tabela ? getTruquesConhecidos(tabela, nivelAtualClasse) : 0;
    let truquesNovo = tabela ? getTruquesConhecidos(tabela, novoNivelClasse) : 0;
    let magiasAtual = tabela ? getMagiaPreparadas(tabela, nivelAtualClasse) : 0;
    let magiasNovo = tabela ? getMagiaPreparadas(tabela, novoNivelClasse) : 0;

    // Para subclasses conjuradoras, calcular limites da tabela da subclasse
    if (ehSubConj && helpers.getSubclasseConjuradoraConjuracao) {
      const subAtual = helpers.getSubclasseConjuradoraConjuracao();
      const nivelOriginal = char.nivel;
      char.nivel = nivelNovo;
      const subNovo = helpers.getSubclasseConjuradoraConjuracao();
      char.nivel = nivelOriginal;
      truquesAtual = subAtual?.truques || 0;
      truquesNovo = subNovo?.truques || 0;
      magiasAtual = subAtual?.preparadas || 0;
      magiasNovo = subNovo?.preparadas || 0;
    }

    if (classeAlvo === 'Clérigo' || classeAlvo === 'Druida') {
      truquesAtual += getBonusTruquesOrdem(char);
      truquesNovo += getBonusTruquesOrdem(char);
    }

    // Espaços de magia no nível novo da classe
    let espacosNovo = tabela ? getEspacosMagia(tabela, novoNivelClasse) : {};
    if (ehSubConj && Object.keys(espacosNovo).length === 0 && helpers.getSubclasseConjuradoraConjuracao) {
      const nivelOriginal = char.nivel;
      char.nivel = nivelNovo;
      const subNovo = helpers.getSubclasseConjuradoraConjuracao();
      char.nivel = nivelOriginal;
      espacosNovo = subNovo?.espacos || {};
    }
    const maxCirculoNovo = Math.max(...Object.keys(espacosNovo).map(Number), 0);

    const espacosAntes = nivelAtualClasse >= 1 ? getEspacosMagia(tabela, nivelAtualClasse) : {};
    const ganhouNovoCirculo = Object.entries(espacosNovo).some(([c, d]) =>
      (d?.total || 0) > 0 && (espacosAntes[c]?.total || 0) === 0);

    const subclasseEfetiva = subclasseAtual;
    const escolaSubclasse = classeAlvo === 'Mago' &&
      Object.prototype.hasOwnProperty.call(ESCOLAS_SUBCLASSE_MAGO, subclasseEfetiva)
      ? ESCOLAS_SUBCLASSE_MAGO[subclasseEfetiva] : null;
    let subclasseArcana = null;
    if (escolaSubclasse) {
      let quantidade = 0;
      if (novoNivelClasse === 3) {
        quantidade += 2;
      } else if (ganhouNovoCirculo) {
        quantidade += 1;
      }
      if (quantidade > 0) {
        subclasseArcana = { escola: escolaSubclasse, quantidade, circuloMax: maxCirculoNovo };
      }
    }

    conjuracao = {
      tipoConj,
      truquesAtual,
      truquesNovo,
      truquesGanhos: truquesNovo - truquesAtual,
      magiasAtual,
      magiasNovo,
      magiasGanhas: magiasNovo - magiasAtual,
      maxCirculoNovo,
      espacosNovo,
      ehMago: classeAlvo === 'Mago',
      subclasseArcana,
      ganhouNovoCirculo
    };
  }

  // Requirements: array de pendências obrigatórias
  const requirements = [];
  if (precisaPericiaMulticlasse) requirements.push({ tipo: 'multiclasse_pericia', label: 'Perícia de Multiclasse' });
  if (precisaInstrumentoMulticlasse) requirements.push({ tipo: 'multiclasse_instrumento', label: 'Instrumento Musical de Multiclasse' });
  if (precisaSubclasse) requirements.push({ tipo: 'subclasse', label: 'Escolher subclasse' });
  if (exigeDadivaEpicaNivel) requirements.push({ tipo: 'dadiva_epica', label: 'Dádiva Épica ou Outro Talento' });
  else if (ganhaASI) requirements.push({ tipo: 'asi', label: 'Distribuir 2 pontos de atributo ou Talento' });
  if (precisaExpertiseBardo) requirements.push({ tipo: 'bardo_expertise', label: 'Especialização do Bardo (2 perícias)' });
  if (precisaExpertiseGuardiao) requirements.push({ tipo: 'guardiao_expertise', label: 'Especialista do Guardião (2 perícias)' });
  if (precisaEstiloLuta) requirements.push({ tipo: 'estilo_luta', label: 'Escolher Estilo de Luta' });
  if (precisaExploradorHabil) requirements.push({ tipo: 'explorador_habil', label: 'Explorador Hábil (1 perícia + 2 idiomas)' });
  if (precisaAcademico) requirements.push({ tipo: 'academico', label: 'Acadêmico do Mago (1 perícia)' });
  if (ehConjurador && conjuracao) {
    if (conjuracao.truquesGanhos > 0) requirements.push({ tipo: 'truques', label: `Selecionar ${conjuracao.truquesGanhos} truque(s)` });
    if (tipoConj === 'conhecidas' && conjuracao.magiasGanhas > 0) requirements.push({ tipo: 'magias_conhecidas', label: `Selecionar ${conjuracao.magiasGanhas} magia(s)` });
    if (conjuracao.ehMago && novoNivelClasse > 1) requirements.push({ tipo: 'grimorio', label: 'Grimório: +2 magias' });
    if (conjuracao.subclasseArcana) requirements.push({
      tipo: 'subclasse_magias_arcana',
      label: `${conjuracao.subclasseArcana.escola}: +${conjuracao.subclasseArcana.quantidade} magia(s)`
    });
  }

  // Bônus de proficiência
  const bonusAnterior = bonusProficiencia(nivelAtual);
  const bonusNovo = bonusProficiencia(nivelNovo);

  return {
    char,
    classeData,
    info,
    classeAlvo,
    ehNovaClasse,
    classesAtuais,
    nivelAtualClasse,
    novoNivelClasse,
    subclasseAtual,
    catalogoMulticlasse,
    proficienciasMulticlasse,
    precisaPericiaMulticlasse,
    opcoesPericiaMulticlasse,
    precisaInstrumentoMulticlasse,
    nivelAtual,
    nivelNovo,
    modCon,
    bonusPvAnao,
    bonusPvVigoroso,
    bonusPvPassivos,
    hpGanhoFixo,
    precisaSubclasse,
    ganhaASI,
    exigeDadivaEpica: exigeDadivaEpicaNivel,
    precisaExpertiseBardo,
    precisaExpertiseGuardiao,
    precisaEstiloLuta,
    podeTrocarEstiloLutaGuerreiro,
    precisaExpertiseLadino,
    precisaExploradorHabil,
    precisaAcademico,
    manobrasGuerreiro,
    caracteristicas,
    caracteristicasEspecie,
    caracteristicasSubclasse,
    magiasDominioNivel,
    magiasSempreNivel,
    subclassesDisponiveis,
    ehConjurador,
    conjuracao,
    requirements,
    bonusAnterior,
    bonusNovo,
    bonusMudou: bonusNovo !== bonusAnterior,
    helpers
  };
}

/**
 * Calcula a exigência de "Versado em Escola" (magias grátis de subclasse arcana do Mago)
 * de forma reativa ao estado do fluxo de level-up: usa `state.subclasse` (escolha feita
 * nesta mesma sessão) com fallback para `ctx.char.subclasse` (escolha de level-ups anteriores).
 * Não depende do valor congelado calculado em `buildLevelUpContext`, que só enxerga
 * `char.subclasse` no momento em que o contexto foi construído.
 * @param {Object} ctx - Contexto do buildLevelUpContext
 * @param {Object} state - Estado atual das escolhas do usuário
 * @returns {{ escola: string, quantidade: number, circuloMax: number } | null}
 */
export function calcularSubclasseArcana(ctx, state) {
  const subclasseEfetiva = state?.subclasse || ctx.subclasseAtual || ctx.char?.subclasse;
  const classeAlvo = ctx.classeAlvo || ctx.char?.classe;
  const escolaSubclasse = classeAlvo === 'Mago' &&
    Object.prototype.hasOwnProperty.call(ESCOLAS_SUBCLASSE_MAGO, subclasseEfetiva)
    ? ESCOLAS_SUBCLASSE_MAGO[subclasseEfetiva] : null;
  if (!escolaSubclasse || !ctx.conjuracao) return null;
  let quantidade = 0;
  if ((ctx.novoNivelClasse || ctx.nivelNovo) === 3) {
    quantidade += 2;
  } else if (ctx.conjuracao.ganhouNovoCirculo) {
    quantidade += 1;
  }
  if (quantidade === 0) return null;
  return { escola: escolaSubclasse, quantidade, circuloMax: ctx.conjuracao.maxCirculoNovo };
}

// ---- Fase 2: Motor de steps dinâmicos ----

/**
 * Definição declarativa dos steps.
 * Cada step tem id, título, tipo, e funções de visibilidade/completude.
 */
const STEP_DEFINITIONS = [
  {
    id: 'ganhos_nivel',
    titulo: 'Ganhos do Nível',
    tipo: 'ganho',
    obrigatorio: true,
    // Sempre visível - todo level up mostra o que se ganha e permite selecionar classe/multiclasse
    visivel: () => true,
    completo: (ctx, state) => {
      if (ctx.precisaPericiaMulticlasse && !state?.multiclassePericia) return false;
      if (ctx.precisaInstrumentoMulticlasse && !state?.multiclasseInstrumento) return false;
      return true;
    }
  },
  {
    id: 'escolha_subclasse',
    titulo: 'Escolha de Subclasse',
    tipo: 'escolha',
    obrigatorio: true,
    visivel: (ctx) => ctx.precisaSubclasse,
    completo: (ctx, state) => !!state.subclasse
  },
  {
    id: 'aumento_atributo',
    titulo: 'Aumento de Atributo ou Talento',
    tipo: 'escolha',
    obrigatorio: true,
    visivel: (ctx) => ctx.ganhaASI,
    completo: (ctx, state) => {
      if (state.asiModo === 'talento') {
        if (!state.talento) return false;
        if (state.talento === 'Aumento no Valor de Atributo' && state.pontosDistribuidos !== 2) return false;
        if (state.talento === 'Dádiva da Proficiência em Perícia' &&
            (state.escolhasTalento || []).length !== 1) return false;
        if (state.talento === 'Iniciado em Magia') {
          const im = state.iniciadoEmMagia;
          if (!im || !im.lista || !im.atributo || (im.truques?.length || 0) < 2 || !im.magia) return false;
        }
        return true;
      }
      if (state.asiModo === 'atributo') return state.pontosDistribuidos === 2;
      return false;
    }
  },
  {
    id: 'escolhas_classe',
    titulo: 'Escolhas de Classe',
    tipo: 'escolha',
    obrigatorio: true,
    visivel: (ctx) => ctx.precisaExpertiseBardo || ctx.precisaExpertiseGuardiao ||
                       ctx.precisaEstiloLuta ||
                       ctx.precisaExploradorHabil || ctx.precisaAcademico,
    completo: (ctx, state) => {
      if (ctx.precisaExpertiseBardo && (state.bardoExpertise || []).length !== 2) return false;
      if (ctx.precisaExpertiseGuardiao && (state.guardiaoExpertise || []).length !== 2) return false;
      if (ctx.precisaEstiloLuta && !state.estiloLuta) return false;
      if (ctx.precisaExploradorHabil && (!state.exploradorExpertise || (state.exploradorIdiomas || []).length !== 2)) return false;
      if (ctx.precisaAcademico && (state.academicoExpertise || []).length !== 1) return false;
      return true;
    }
  },
  {
    id: 'selecao_magias',
    titulo: 'Seleção de Magias',
    tipo: 'magia',
    obrigatorio: true,
    visivel: (ctx, state) => {
      if (!ctx.ehConjurador || !ctx.conjuracao) return false;
      const c = ctx.conjuracao;
      const subclasseArcana = calcularSubclasseArcana(ctx, state);
      const origensEspeciais = ['especie', 'sempre', 'especie_legado', 'iniciado_em_magia', 'tocado_por_fadas', 'tocado_pelas_sombras', 'conjurador_ritualista'];
      const temTruqueTrocavel = (ctx.char.magias_conhecidas || []).some(m => m.circulo === 0 && !origensEspeciais.includes(m?.origem));
      return c.truquesGanhos > 0 || (c.tipoConj === 'conhecidas' && c.magiasGanhas > 0) || (c.ehMago && (ctx.novoNivelClasse || ctx.nivelNovo) > 1) || !!subclasseArcana || temTruqueTrocavel;
    },
    completo: (ctx, state) => {
      const c = ctx.conjuracao;
      if (!c) return true;
      if (c.truquesGanhos > 0 && (state.truquesSelecionados || []).length !== c.truquesGanhos) return false;
      if (c.tipoConj === 'conhecidas' && c.magiasGanhas > 0 && (state.magiasSelecionadas || []).length !== c.magiasGanhas) return false;
      if (c.ehMago && (ctx.novoNivelClasse || ctx.nivelNovo) > 1 && (state.grimorioSelecionados || []).length !== 2) return false;
      const subclasseArcana = calcularSubclasseArcana(ctx, state);
      if (subclasseArcana && (state.subclasseMagiasSelecionados || []).length !== subclasseArcana.quantidade) return false;
      return true;
    }
  },
  {
    id: 'manobras_guerreiro',
    titulo: 'Manobras (Mestre da Batalha)',
    tipo: 'escolha',
    obrigatorio: true,
    visivel: (ctx, state) => exigeManobrasGuerreiro(ctx.classeAlvo || ctx.char.classe, state?.subclasse || ctx.subclasseAtual || ctx.char.subclasse, ctx.novoNivelClasse || ctx.nivelNovo),
    completo: (ctx, state) => {
      if (!ctx.manobrasGuerreiro) return false;
      if ((state.manobrasNovasSelecionadas || []).length !== ctx.manobrasGuerreiro.qtdNova) return false;
      if (state.manobraTrocarDe && !state.manobraTrocarPara) return false;
      return true;
    }
  },
  {
    id: 'revisao_confirmacao',
    titulo: 'Revisão e Confirmação',
    tipo: 'revisao',
    obrigatorio: true,
    // Sempre visível
    visivel: () => true,
    completo: () => true
  }
];

/**
 * Constrói a lista de steps visíveis para o contexto atual.
 * @param {Object} ctx - Contexto do buildLevelUpContext
 * @param {Object} state - Estado atual das escolhas do usuário
 * @returns {Array} Steps visíveis (com ordem recalculada)
 */
export function buildVisibleSteps(ctx, state) {
  const visibles = STEP_DEFINITIONS.filter(s => s.visivel(ctx, state));
  return visibles.map((s, i) => ({
    ...s,
    titulo: s.id === 'aumento_atributo' && ctx.exigeDadivaEpica
      ? 'Dádiva Épica ou Outro Talento'
      : s.titulo,
    ordem: i,
    _completo: s.completo(ctx, state)
  }));
}

/**
 * Cria o estado inicial vazio para o fluxo de level up.
 * @param {Object|null} ctx - Contexto opcional para pré-popular classeAlvo
 */
export function createInitialState(ctx = null) {
  return {
    // Classe Alvo / Multiclasse
    classeAlvo: ctx?.classeAlvo || ctx?.char?.classe || '',
    multiclassePericia: '',
    multiclasseInstrumento: '',
    // HP
    hpModo: 'fixo',
    hpRolado: 1,
    // Subclasse
    subclasse: '',
    // ASI
    asiModo: 'atributo',
    aumentos: {}, // { chave: valor }
    pontosDistribuidos: 0,
    talento: '',
    talentoData: null,
    talentoASI: '',
    escolhasTalento: [],
    talentoTipoEscolha: '',
    resilienteAtributo: '',
    iniciadoEmMagia: null,
    dadivaResistenciaEnergia: [],
    // Escolhas de classe
    bardoExpertise: [],
    guardiaoExpertise: [],
    estiloLuta: '',
    estiloLutaTrocarDe: '',
    estiloLutaTrocarPara: '',
    ladinoExpertise: [],
    exploradorExpertise: '',
    exploradorIdiomas: [],
    academicoExpertise: [],
    // Magias
    truquesSelecionados: [],
    magiasSelecionadas: [],
    grimorioSelecionados: [],
    subclasseMagiasSelecionados: [],
    trocarDe: '',
    trocarPara: '',
    trocarParaCirculo: 0,
    truqueTrocarDe: '',
    truqueTrocarPara: '',
    // Manobras (Mestre da Batalha)
    manobrasNovasSelecionadas: [],
    manobraTrocarDe: '',
    manobraTrocarPara: '',
    // Navegação
    stepAtual: 0
  };
}

/**
 * Motor de navegação: avança para o próximo step visível.
 */
export function proximoStep(steps, state) {
  const idx = state.stepAtual;
  if (idx < steps.length - 1) {
    return idx + 1;
  }
  return idx;
}

/**
 * Motor de navegação: volta para o step anterior visível.
 */
export function stepAnterior(steps, state) {
  const idx = state.stepAtual;
  if (idx > 0) {
    return idx - 1;
  }
  return idx;
}

/**
 * Verifica se todos os steps obrigatórios estão completos.
 */
export function todosStepsCompletos(steps) {
  return steps.every(s => !s.obrigatorio || s._completo);
}
