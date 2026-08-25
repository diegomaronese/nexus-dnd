// ============================================================
// Regras e Automação de Multiclasse para D&D 5.5 (2024 / Livro do Jogador)
// ============================================================
import { CLASSES_INFO, ATRIBUTO_NOME_PARA_KEY, ATRIBUTOS_NOMES, NOMES_CLASSES, PERICIAS } from './dados-classes.js';
import { calcMod, bonusProficiencia, semAcento } from './utils.js';

/**
 * Pré-requisitos de atributo para Multiclasse segundo o Livro do Jogador (p. 44).
 * Para adquirir um nível em uma nova classe, o personagem deve possuir valor >= 13
 * no(s) atributo(s) primário(s) da nova classe E de todas as suas classes atuais.
 */
export const MULTICLASSE_PREREQUISITOS = {
  'Artífice': {
    atributos: [{ chave: 'inteligencia', min: 13, nome: 'Inteligência' }]
  },
  'Bárbaro': {
    atributos: [{ chave: 'forca', min: 13, nome: 'Força' }]
  },
  'Bardo': {
    atributos: [{ chave: 'carisma', min: 13, nome: 'Carisma' }]
  },
  'Bruxo': {
    atributos: [{ chave: 'carisma', min: 13, nome: 'Carisma' }]
  },
  'Clérigo': {
    atributos: [{ chave: 'sabedoria', min: 13, nome: 'Sabedoria' }]
  },
  'Druida': {
    atributos: [{ chave: 'sabedoria', min: 13, nome: 'Sabedoria' }]
  },
  'Feiticeiro': {
    atributos: [{ chave: 'carisma', min: 13, nome: 'Carisma' }]
  },
  'Guardião': {
    tipo: 'AND',
    atributos: [
      { chave: 'destreza', min: 13, nome: 'Destreza' },
      { chave: 'sabedoria', min: 13, nome: 'Sabedoria' }
    ]
  },
  'Guerreiro': {
    tipo: 'OR',
    atributos: [
      { chave: 'forca', min: 13, nome: 'Força' },
      { chave: 'destreza', min: 13, nome: 'Destreza' }
    ]
  },
  'Ladino': {
    atributos: [{ chave: 'destreza', min: 13, nome: 'Destreza' }]
  },
  'Mago': {
    atributos: [{ chave: 'inteligencia', min: 13, nome: 'Inteligência' }]
  },
  'Monge': {
    tipo: 'AND',
    atributos: [
      { chave: 'destreza', min: 13, nome: 'Destreza' },
      { chave: 'sabedoria', min: 13, nome: 'Sabedoria' }
    ]
  },
  'Paladino': {
    tipo: 'AND',
    atributos: [
      { chave: 'forca', min: 13, nome: 'Força' },
      { chave: 'carisma', min: 13, nome: 'Carisma' }
    ]
  }
};

/**
 * Proficiências concedidas ao adquirir o 1º nível em uma nova classe (Multiclasse)
 * Conforme Livro do Jogador (Capítulo 3).
 */
export const MULTICLASSE_PROFICIENCIAS = {
  'Artífice': {
    armaduras: ['Leve', 'Média', 'Escudo'],
    armas: [],
    ferramentas: ['Ferramentas de Ladrão', 'Ferramentas de Funileiro']
  },
  'Bárbaro': {
    armaduras: ['Escudo'],
    armas: ['Marcial']
  },
  'Bardo': {
    armaduras: ['Leve'],
    armas: [],
    escolha_pericia: { qtd: 1, opcoes: null }, // Qualquer perícia
    escolha_instrumento: { qtd: 1 }
  },
  'Bruxo': {
    armaduras: ['Leve'],
    armas: []
  },
  'Clérigo': {
    armaduras: ['Leve', 'Média', 'Escudo'],
    armas: []
  },
  'Druida': {
    armaduras: ['Leve', 'Escudo'],
    armas: []
  },
  'Feiticeiro': {
    armaduras: [],
    armas: []
  },
  'Guardião': {
    armaduras: ['Leve', 'Média', 'Escudo'],
    armas: ['Marcial'],
    escolha_pericia: {
      qtd: 1,
      opcoes: ['Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Lidar com Animais', 'Natureza', 'Percepção', 'Sobrevivência']
    }
  },
  'Guerreiro': {
    armaduras: ['Leve', 'Média', 'Escudo'],
    armas: ['Marcial']
  },
  'Ladino': {
    armaduras: ['Leve'],
    armas: [],
    escolha_pericia: {
      qtd: 1,
      opcoes: ['Acrobacia', 'Atletismo', 'Enganação', 'Furtividade', 'Intimidação', 'Intuição', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação']
    },
    ferramentas: ['Ferramentas de Ladrão']
  },
  'Mago': {
    armaduras: [],
    armas: []
  },
  'Monge': {
    armaduras: [],
    armas: []
  },
  'Paladino': {
    armaduras: ['Leve', 'Média', 'Escudo'],
    armas: ['Marcial']
  }
};

/**
 * Tabela de Espaços de Magia para Conjuradores Multiclasse (Livro do Jogador p. 45).
 * Círculos de 1º a 9º por Nível de Conjurador Combinado.
 */
export const TABELA_ESPACOS_MULTICLASSE = {
  1:  { 1: 2 },
  2:  { 1: 3 },
  3:  { 1: 4, 2: 2 },
  4:  { 1: 4, 2: 3 },
  5:  { 1: 4, 2: 3, 3: 2 },
  6:  { 1: 4, 2: 3, 3: 3 },
  7:  { 1: 4, 2: 3, 3: 3, 4: 1 },
  8:  { 1: 4, 2: 3, 3: 3, 4: 2 },
  9:  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
};

/**
 * Tabela de Espaços de Magia de Pacto do Bruxo (Magia de Pacto).
 */
export const TABELA_ESPACOS_PACTO_BRUXO = {
  1:  { espacos: 1, circulo: 1 },
  2:  { espacos: 2, circulo: 1 },
  3:  { espacos: 2, circulo: 2 },
  4:  { espacos: 2, circulo: 2 },
  5:  { espacos: 2, circulo: 3 },
  6:  { espacos: 2, circulo: 3 },
  7:  { espacos: 2, circulo: 4 },
  8:  { espacos: 2, circulo: 4 },
  9:  { espacos: 2, circulo: 5 },
  10: { espacos: 2, circulo: 5 },
  11: { espacos: 3, circulo: 5 },
  12: { espacos: 3, circulo: 5 },
  13: { espacos: 3, circulo: 5 },
  14: { espacos: 3, circulo: 5 },
  15: { espacos: 3, circulo: 5 },
  16: { espacos: 3, circulo: 5 },
  17: { espacos: 4, circulo: 5 },
  18: { espacos: 4, circulo: 5 },
  19: { espacos: 4, circulo: 5 },
  20: { espacos: 4, circulo: 5 }
};

/**
 * Retorna a lista normalizada de classes do personagem.
 * @param {Object} personagem
 * @returns {Array<{ classe: string, nivel: number, subclasse: string }>}
 */
export function getClassesArray(personagem) {
  if (!personagem) return [];
  if (Array.isArray(personagem.classes) && personagem.classes.length > 0) {
    return personagem.classes.map(c => ({
      classe: c.classe || '',
      nivel: Number(c.nivel) || 1,
      subclasse: c.subclasse || ''
    }));
  }
  if (personagem.classe) {
    return [{
      classe: personagem.classe,
      nivel: Number(personagem.nivel) || 1,
      subclasse: personagem.subclasse || ''
    }];
  }
  return [];
}

/**
 * Retorna se o personagem possui níveis na classe informada.
 * @param {Object} personagem
 * @param {string} nomeClasse
 * @returns {boolean}
 */
export function hasClasse(personagem, nomeClasse) {
  const classes = getClassesArray(personagem);
  return classes.some(c => semAcento(c.classe) === semAcento(nomeClasse));
}

/**
 * Retorna o nível do personagem em uma classe específica.
 * @param {Object} personagem
 * @param {string} nomeClasse
 * @returns {number}
 */
export function getNivelClasse(personagem, nomeClasse) {
  const classes = getClassesArray(personagem);
  const found = classes.find(c => semAcento(c.classe) === semAcento(nomeClasse));
  return found ? found.nivel : 0;
}

/**
 * Retorna a subclasse do personagem em uma classe específica.
 * @param {Object} personagem
 * @param {string} nomeClasse
 * @returns {string}
 */
export function getSubclasseClasse(personagem, nomeClasse) {
  const classes = getClassesArray(personagem);
  const found = classes.find(c => semAcento(c.classe) === semAcento(nomeClasse));
  return found ? (found.subclasse || '') : '';
}

/**
 * Retorna se o personagem é multiclasse (possui mais de 1 classe).
 * @param {Object} personagem
 * @returns {boolean}
 */
export function ehMulticlasse(personagem) {
  const classes = getClassesArray(personagem);
  return classes.length > 1;
}

/**
 * Formata a lista de classes do personagem como texto.
 * Exemplo: "Paladino 3 (Juramento da Devoção) / Guerreiro 2"
 * @param {Object} personagem
 * @param {Object} [opcoes]
 * @param {boolean} [opcoes.incluirSubclasse=true]
 * @returns {string}
 */
export function formatarClasses(personagem, opcoes = { incluirSubclasse: true }) {
  const classes = getClassesArray(personagem);
  if (classes.length === 0) return personagem?.classe || 'Sem classe';

  return classes.map(c => {
    let str = `${c.classe} ${c.nivel}`;
    if (opcoes.incluirSubclasse && c.subclasse) {
      str += ` (${c.subclasse})`;
    }
    return str;
  }).join(' / ');
}

/**
 * Verifica se um personagem atende aos pré-requisitos para multiclasse de uma classe.
 * Conforme regras do Livro do Jogador (p. 44):
 * - Deve possuir valor >= 13 nos atributos da NOVA classe.
 * - Deve possuir valor >= 13 nos atributos de TODAS as suas classes ATUAIS.
 *
 * @param {Object} personagem
 * @param {string} novaClasse
 * @returns {{ elegivel: boolean, motivos: string[], classesBloqueadas: Object }}
 */
export function verificarPrerequisitosMulticlasse(personagem, novaClasse) {
  const atributos = personagem?.atributos || {};
  const classesAtuais = getClassesArray(personagem);
  const motivos = [];
  const classesBloqueadas = {};

  // Função interna para testar se os atributos atendem à regra de uma classe
  function testaClasse(nomeClasse) {
    const prereq = MULTICLASSE_PREREQUISITOS[nomeClasse];
    if (!prereq) return { ok: true, msg: '' };

    const { tipo, atributos: lista } = prereq;
    if (tipo === 'OR') {
      const atendePeloMenosUm = lista.some(a => (atributos[a.chave] || 0) >= a.min);
      if (!atendePeloMenosUm) {
        const desc = lista.map(a => `${a.nome} ${a.min}+ (atual: ${atributos[a.chave] || 0})`).join(' ou ');
        return { ok: false, msg: `${nomeClasse} requer ${desc}` };
      }
      return { ok: true, msg: '' };
    }

    // Default: tipo 'AND' ou único atributo
    const faltantes = lista.filter(a => (atributos[a.chave] || 0) < a.min);
    if (faltantes.length > 0) {
      const desc = faltantes.map(a => `${a.nome} ${a.min}+ (atual: ${atributos[a.chave] || 0})`).join(' e ');
      return { ok: false, msg: `${nomeClasse} requer ${desc}` };
    }
    return { ok: true, msg: '' };
  }

  // 1. Testar pré-requisitos de todas as classes que o personagem já possui
  for (const c of classesAtuais) {
    const res = testaClasse(c.classe);
    if (!res.ok) {
      motivos.push(`Classe atual (${res.msg})`);
      classesBloqueadas[c.classe] = res.msg;
    }
  }

  // 2. Se a classe alvo for nova (não pertence às classes atuais), testar seus requisitos
  const jaTemClasse = classesAtuais.some(c => semAcento(c.classe) === semAcento(novaClasse));
  if (!jaTemClasse) {
    const resNova = testaClasse(novaClasse);
    if (!resNova.ok) {
      motivos.push(`Nova classe (${resNova.msg})`);
      classesBloqueadas[novaClasse] = resNova.msg;
    }
  }

  return {
    elegivel: motivos.length === 0,
    motivos,
    classesBloqueadas
  };
}

/**
 * Retorna o status de elegibilidade de todas as 12 classes para multiclasse.
 * @param {Object} personagem
 * @returns {Array<{ classe: string, jaPossui: boolean, nivelAtual: number, elegivel: boolean, motivo: string }>}
 */
export function getCatalogoElegibilidadeMulticlasse(personagem) {
  const classesAtuais = getClassesArray(personagem);
  return NOMES_CLASSES.map(nome => {
    const cExistente = classesAtuais.find(c => semAcento(c.classe) === semAcento(nome));
    const jaPossui = !!cExistente;
    const nivelAtual = cExistente ? cExistente.nivel : 0;
    const checagem = verificarPrerequisitosMulticlasse(personagem, nome);
    return {
      classe: nome,
      jaPossui,
      nivelAtual,
      elegivel: checagem.elegivel,
      motivo: checagem.motivos.join('; ')
    };
  });
}

/**
 * Calcula o nível de conjurador combinado para fins de Espaços de Magia Multiclasse.
 * Livro do Jogador p. 44-45:
 * - Todos os níveis em Bardo, Clérigo, Druida, Feiticeiro, Mago (1:1)
 * - Metade dos níveis em Guardião e Paladino (arredondado para CIMA: Math.ceil(nivel / 2))
 * - Metade dos níveis em Artífice (arredondado para CIMA: Math.ceil(nivel / 2))
 * - Um terço dos níveis em Guerreiro Cavaleiro Místico ou Ladino Trapaceiro Arcano (Math.floor(nivel / 3))
 *
 * @param {Object} personagem
 * @param {Array<Object>} [classesArray] - Opcional se for simular antes de aplicar
 * @returns {number} Nível de conjurador combinado
 */
export function calcularNivelConjuradorMulticlasse(personagem, classesArray = null) {
  const classes = classesArray || getClassesArray(personagem);
  let nivelConjurador = 0;
  let temConjuradorNaoBruxo = false;

  for (const c of classes) {
    const nome = c.classe;
    const nivel = c.nivel || 1;
    const subclasse = c.subclasse || '';

    // Conjuradores Totais
    if (['Bardo', 'Clérigo', 'Druida', 'Feiticeiro', 'Mago'].includes(nome)) {
      nivelConjurador += nivel;
      temConjuradorNaoBruxo = true;
    }
    // Meio-Conjuradores (Paladino, Guardião, Artífice) -> Math.ceil(nivel / 2)
    else if (['Guardião', 'Paladino', 'Artífice'].includes(nome)) {
      nivelConjurador += Math.ceil(nivel / 2);
      temConjuradorNaoBruxo = true;
    }
    // 1/3 Conjuradores (Cavaleiro Místico, Trapaceiro Arcano)
    else if (
      (nome === 'Guerreiro' && semAcento(subclasse) === semAcento('Cavaleiro Místico')) ||
      (nome === 'Ladino' && semAcento(subclasse) === semAcento('Trapaceiro Arcano'))
    ) {
      nivelConjurador += Math.floor(nivel / 3);
      temConjuradorNaoBruxo = true;
    }
  }

  return { nivelConjurador, temConjuradorNaoBruxo };
}

/**
 * Calcula os espaços de magia combinados para multiclasse.
 * @param {Object} personagem
 * @param {Array<Object>} [classesArray]
 * @returns {Object} Espaços de magia
 */
export function calcularEspacosMagiaMulticlasse(personagem, classesArray = null) {
  const { nivelConjurador } = calcularNivelConjuradorMulticlasse(personagem, classesArray);
  if (nivelConjurador <= 0) return {};

  const nivelLimitado = Math.min(20, Math.max(1, nivelConjurador));
  const row = TABELA_ESPACOS_MULTICLASSE[nivelLimitado] || {};
  const espacos = {};
  for (let i = 1; i <= 9; i++) {
    if (row[i]) {
      espacos[i] = { total: row[i], usados: 0 };
    }
  }
  return espacos;
}

/**
 * Calcula a reserva de dados de vida do personagem por tipo de dado (d6, d8, d10, d12).
 * @param {Object} personagem
 * @returns {Array<{ tipo: string, dado: number, total: number, usados: number, classes: string[] }>}
 */
export function calcularReservaDadosVida(personagem) {
  const classes = getClassesArray(personagem);
  const mapa = {};

  for (const c of classes) {
    const info = CLASSES_INFO[c.classe];
    const dado = info?.dado_vida || 8;
    const tipo = `d${dado}`;

    if (!mapa[tipo]) {
      mapa[tipo] = {
        tipo,
        dado,
        total: 0,
        classes: []
      };
    }
    mapa[tipo].total += c.nivel;
    mapa[tipo].classes.push(`${c.classe} (${c.nivel})`);
  }

  // Obter distribuição de usados se existir estrutura detalhada
  const usadosMapa = personagem.dados_vida_usados_detalhe || {};
  let totalUsadosGeral = personagem.dados_vida_usados || 0;

  const resultado = Object.values(mapa).sort((a, b) => b.dado - a.dado);
  for (const item of resultado) {
    item.usados = usadosMapa[item.tipo] ?? Math.min(item.total, totalUsadosGeral);
    totalUsadosGeral = Math.max(0, totalUsadosGeral - item.usados);
    item.disponiveis = Math.max(0, item.total - item.usados);
  }

  return resultado;
}

/**
 * Aplica proficiências ganhas ao adquirir o 1º nível de multiclasse em uma nova classe.
 * @param {Object} personagem
 * @param {string} novaClasse
 * @param {Object} [escolhas] - { pericia: '...', instrumento: '...' }
 */
export function aplicarProficienciasMulticlasse(personagem, novaClasse, escolhas = {}) {
  const profs = MULTICLASSE_PROFICIENCIAS[novaClasse];
  if (!profs) return;

  if (!personagem.proficiencias_extra) personagem.proficiencias_extra = [];
  if (!personagem.pericias_proficientes) personagem.pericias_proficientes = [];
  if (!personagem.proficiencias_ferramentas) personagem.proficiencias_ferramentas = [];
  if (!personagem.proficiencias_instrumentos) personagem.proficiencias_instrumentos = [];

  // Armaduras
  if (Array.isArray(profs.armaduras)) {
    for (const arm of profs.armaduras) {
      if (!personagem.proficiencias_extra.includes(arm)) {
        personagem.proficiencias_extra.push(arm);
      }
    }
  }

  // Armas
  if (Array.isArray(profs.armas)) {
    for (const arma of profs.armas) {
      if (!personagem.proficiencias_extra.includes(arma)) {
        personagem.proficiencias_extra.push(arma);
      }
    }
  }

  // Ferramentas
  if (Array.isArray(profs.ferramentas)) {
    for (const ferr of profs.ferramentas) {
      if (!personagem.proficiencias_ferramentas.includes(ferr)) {
        personagem.proficiencias_ferramentas.push(ferr);
      }
    }
  }

  // Escolha de perícia
  if (escolhas.pericia && !personagem.pericias_proficientes.includes(escolhas.pericia)) {
    personagem.pericias_proficientes.push(escolhas.pericia);
  }

  // Escolha de instrumento
  if (escolhas.instrumento && !personagem.proficiencias_instrumentos.includes(escolhas.instrumento)) {
    personagem.proficiencias_instrumentos.push(escolhas.instrumento);
  }
}
