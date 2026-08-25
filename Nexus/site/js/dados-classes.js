// ============================================================
// Dados de referência das 12 classes do D&D 5.5 (2024)
// Informações hard-coded para cálculos e automação
// ============================================================
export const CLASSES_INFO = {
  "Bárbaro": {
    dado_vida: 12,
    atributo_primario: "Força",
    salvaguardas: ["Força", "Constituição"],
    armaduras: ["Leve", "Média", "Escudo"],
    armas: ["Simples", "Marcial"],
    pericias_opcoes: ["Lidar com Animais", "Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência"],
    num_pericias: 2,
    conjurador: false,
    atributo_conjuracao: null
  },
  "Bardo": {
    dado_vida: 8,
    atributo_primario: "Carisma",
    salvaguardas: ["Destreza", "Carisma"],
    armaduras: ["Leve"],
    armas: ["Simples"],
    pericias_opcoes: null, // Qualquer perícia
    num_pericias: 3,
    conjurador: true,
    atributo_conjuracao: "Carisma",
    tipo_conjuracao: "conhecidas"
  },
  "Bruxo": {
    dado_vida: 8,
    atributo_primario: "Carisma",
    salvaguardas: ["Sabedoria", "Carisma"],
    armaduras: ["Leve"],
    armas: ["Simples"],
    pericias_opcoes: ["Arcanismo", "Enganação", "História", "Intimidação", "Investigação", "Natureza", "Religião"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Carisma",
    tipo_conjuracao: "conhecidas"
  },
  "Clérigo": {
    dado_vida: 8,
    atributo_primario: "Sabedoria",
    salvaguardas: ["Sabedoria", "Carisma"],
    armaduras: ["Leve", "Média", "Escudo"],
    armas: ["Simples"],
    pericias_opcoes: ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Sabedoria",
    tipo_conjuracao: "preparadas"
  },
  "Druida": {
    dado_vida: 8,
    atributo_primario: "Sabedoria",
    salvaguardas: ["Inteligência", "Sabedoria"],
    armaduras: ["Leve", "Escudo"],
    armas: ["Simples"],
    pericias_opcoes: ["Arcanismo", "Lidar com Animais", "Intuição", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Sabedoria",
    tipo_conjuracao: "preparadas"
  },
  "Feiticeiro": {
    dado_vida: 6,
    atributo_primario: "Carisma",
    salvaguardas: ["Constituição", "Carisma"],
    armaduras: [],
    armas: ["Simples"],
    pericias_opcoes: ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Carisma",
    tipo_conjuracao: "conhecidas"
  },
  "Guardião": {
    dado_vida: 10,
    atributo_primario: "Destreza e Sabedoria",
    salvaguardas: ["Força", "Destreza"],
    armaduras: ["Leve", "Média", "Escudo"],
    armas: ["Simples", "Marcial"],
    pericias_opcoes: ["Lidar com Animais", "Atletismo", "Furtividade", "Intuição", "Investigação", "Natureza", "Percepção", "Sobrevivência"],
    num_pericias: 3,
    conjurador: true,
    atributo_conjuracao: "Sabedoria",
    tipo_conjuracao: "preparadas"
  },
  "Guerreiro": {
    dado_vida: 10,
    atributo_primario: "Força ou Destreza",
    salvaguardas: ["Força", "Constituição"],
    armaduras: ["Leve", "Média", "Pesada", "Escudo"],
    armas: ["Simples", "Marcial"],
    pericias_opcoes: ["Acrobacia", "Lidar com Animais", "Atletismo", "História", "Intimidação", "Intuição", "Percepção", "Persuasão", "Sobrevivência"],
    num_pericias: 2,
    conjurador: false,
    atributo_conjuracao: null
  },
  "Ladino": {
    dado_vida: 8,
    atributo_primario: "Destreza",
    salvaguardas: ["Destreza", "Inteligência"],
    armaduras: ["Leve"],
    // Classes.md:4152: "Armas Simples e Armas Marciais que tem a propriedade
    // Acuidade ou Leve" -- as duas propriedades, não só Acuidade. Um único
    // item "Marcial (...)" (não dois itens separados) preserva a categoria
    // "Marcial" única esperada pelos dois consumidores que resolvem esta
    // string contra a propriedade de uma arma específica
    // (creator/passo-equipamento.js:temProficienciaArma e
    // sheet/condicoes.js:sheetTemProfArma) -- ambos já fazem
    // `info.armas.some(a => a.includes('Leve'))` (mesma checagem usada para
    // o Monge), então bastou incluir a palavra "Leve" em algum item de
    // `armas`; nenhum dos dois arquivos precisou mudar.
    armas: ["Simples", "Marcial (Acuidade ou Leve)"],
    pericias_opcoes: ["Acrobacia", "Atletismo", "Enganação", "Furtividade", "Intimidação", "Intuição", "Investigação", "Percepção", "Persuasão", "Prestidigitação"],
    num_pericias: 4,
    conjurador: false,
    atributo_conjuracao: null
  },
  "Mago": {
    dado_vida: 6,
    atributo_primario: "Inteligência",
    salvaguardas: ["Inteligência", "Sabedoria"],
    armaduras: [],
    armas: ["Simples"],
    pericias_opcoes: ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Religião"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Inteligência",
    tipo_conjuracao: "preparadas"
  },
  "Monge": {
    dado_vida: 8,
    atributo_primario: "Destreza e Sabedoria",
    salvaguardas: ["Força", "Destreza"],
    armaduras: [],
    armas: ["Simples", "Marcial (Leve)"],
    pericias_opcoes: ["Acrobacia", "Atletismo", "Furtividade", "História", "Intuição", "Religião"],
    num_pericias: 2,
    conjurador: false,
    atributo_conjuracao: null
  },
  "Paladino": {
    dado_vida: 10,
    atributo_primario: "Força e Carisma",
    salvaguardas: ["Sabedoria", "Carisma"],
    armaduras: ["Leve", "Média", "Pesada", "Escudo"],
    armas: ["Simples", "Marcial"],
    pericias_opcoes: ["Atletismo", "Intimidação", "Intuição", "Medicina", "Persuasão", "Religião"],
    num_pericias: 2,
    conjurador: true,
    atributo_conjuracao: "Carisma",
    tipo_conjuracao: "preparadas"
  }
};

export const NOMES_CLASSES = Object.keys(CLASSES_INFO);

export const ESCOLAS_SUBCLASSE_MAGO = {
  'Abjurador': 'Abjuração',
  'Adivinhador': 'Adivinhação',
  'Evocador': 'Evocação',
  'Ilusionista': 'Ilusão'
};

// Lista completa de todas as perícias com seus atributos associados
export const PERICIAS = [
  { nome: "Acrobacia", atributo: "Destreza" },
  { nome: "Lidar com Animais", atributo: "Sabedoria" },
  { nome: "Arcanismo", atributo: "Inteligência" },
  { nome: "Atletismo", atributo: "Força" },
  { nome: "Atuação", atributo: "Carisma" },
  { nome: "Enganação", atributo: "Carisma" },
  { nome: "Furtividade", atributo: "Destreza" },
  { nome: "História", atributo: "Inteligência" },
  { nome: "Intimidação", atributo: "Carisma" },
  { nome: "Intuição", atributo: "Sabedoria" },
  { nome: "Investigação", atributo: "Inteligência" },
  { nome: "Medicina", atributo: "Sabedoria" },
  { nome: "Natureza", atributo: "Inteligência" },
  { nome: "Percepção", atributo: "Sabedoria" },
  { nome: "Persuasão", atributo: "Carisma" },
  { nome: "Prestidigitação", atributo: "Destreza" },
  { nome: "Religião", atributo: "Inteligência" },
  { nome: "Sobrevivência", atributo: "Sabedoria" }
];

// Nomes legíveis dos atributos
export const ATRIBUTOS_NOMES = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma"
};

// Array base para atributos (nome da chave em JS)
export const ATRIBUTOS_KEYS = ["forca", "destreza", "constituicao", "inteligencia", "sabedoria", "carisma"];

// Mapeamento de nomes de atributos para chaves
export const ATRIBUTO_NOME_PARA_KEY = {
  "Força": "forca",
  "Destreza": "destreza",
  "Constituição": "constituicao",
  "Inteligência": "inteligencia",
  "Sabedoria": "sabedoria",
  "Carisma": "carisma"
};

// Standard Array para distribuição de atributos
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Custo de point buy por valor de atributo
export const POINT_BUY_CUSTOS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};
export const POINT_BUY_TOTAL = 27;

// Mapeamento dos ícones de cada classe
export const ICONES_CLASSES = {
  "Artífice": "img/icons/ico-classe-artifice.png",
  "Bárbaro": "img/icons/ico-classe-barbaro.png",
  "Bardo": "img/icons/ico-classe-bardo.png",
  "Bruxo": "img/icons/ico-classe-bruxo.png",
  "Clérigo": "img/icons/ico-classe-clerigo.png",
  "Druida": "img/icons/ico-classe-druida.png",
  "Feiticeiro": "img/icons/ico-classe-feiticeiro.png",
  "Guardião": "img/icons/ico-classe-patrulheiro.png",
  "Patrulheiro": "img/icons/ico-classe-patrulheiro.png",
  "Guerreiro": "img/icons/ico-classe-guerreiro.png",
  "Ladino": "img/icons/ico-classe-ladino.png",
  "Mago": "img/icons/ico-classe-mago.png",
  "Monge": "img/icons/ico-classe-monge.png",
  "Paladino": "img/icons/ico-classe-paladino.png"
};

/**
 * Retorna o caminho do ícone correspondente à classe fornecida.
 * Trata variações de acentuação, maiúsculas e sinonímias (Guardião / Patrulheiro / Ranger).
 * @param {string} nomeClasse
 * @returns {string|null}
 */
export function getIconeClasse(nomeClasse) {
  if (!nomeClasse) return null;
  if (ICONES_CLASSES[nomeClasse]) return ICONES_CLASSES[nomeClasse];
  const limpo = String(nomeClasse).trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const mapa = {
    artifice: 'img/icons/ico-classe-artifice.png',
    barbaro: 'img/icons/ico-classe-barbaro.png',
    bardo: 'img/icons/ico-classe-bardo.png',
    bruxo: 'img/icons/ico-classe-bruxo.png',
    clerigo: 'img/icons/ico-classe-clerigo.png',
    druida: 'img/icons/ico-classe-druida.png',
    feiticeiro: 'img/icons/ico-classe-feiticeiro.png',
    guardiao: 'img/icons/ico-classe-patrulheiro.png',
    patrulheiro: 'img/icons/ico-classe-patrulheiro.png',
    ranger: 'img/icons/ico-classe-patrulheiro.png',
    guerreiro: 'img/icons/ico-classe-guerreiro.png',
    ladino: 'img/icons/ico-classe-ladino.png',
    mago: 'img/icons/ico-classe-mago.png',
    monge: 'img/icons/ico-classe-monge.png',
    paladino: 'img/icons/ico-classe-paladino.png'
  };
  return mapa[limpo] || null;
}

