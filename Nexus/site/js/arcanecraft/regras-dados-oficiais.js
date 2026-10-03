// ============================================================
// Arcane Crafts Compendium - Livro de Regras e Apêndices Oficiais
// Autor: Cássio Barros de Aguiar (2026)
// ============================================================

// ------------------------------------------------------------
// PARÂMETROS PADRÃO DE CRIAÇÃO (Crafting Materials Standard Values)
// ------------------------------------------------------------
export const TABELA_VALORES_CRAFTING = {
  Common: { tierFactor: 1, cm: 15, skillThreshold: 0, criticalMass: 0.20, unitPriceMin: 0.1, unitPriceMax: 10, unitEffortMin: 3, unitEffortMax: 10, tierDie: '1d20' },
  Uncommon: { tierFactor: 2, cm: 20, skillThreshold: -4, criticalMass: 0.30, unitPriceMin: 10, unitPriceMax: 100, unitEffortMin: 10, unitEffortMax: 25, tierDie: '2d8' },
  Rare: { tierFactor: 3, cm: 25, skillThreshold: -8, criticalMass: 0.40, unitPriceMin: 100, unitPriceMax: 300, unitEffortMin: 25, unitEffortMax: 50, tierDie: '1d12' },
  Exotic: { tierFactor: 4, cm: 30, skillThreshold: -12, criticalMass: 0.50, unitPriceMin: 300, unitPriceMax: 1000, unitEffortMin: 50, unitEffortMax: 75, tierDie: '1d8' },
  Mythic: { tierFactor: 5, cm: 35, skillThreshold: -16, criticalMass: 0.60, unitPriceMin: 1000, unitPriceMax: 5000, unitEffortMin: 75, unitEffortMax: 100, tierDie: '1d4' }
};

// Oficinas e Capacidade de Ressonância
export const OFICINAS_MANUFATURA = [
  { id: 'improvised', nome: 'Improvisada (Improvised)', tier: 'Improvised', bonus: 0, ressonancia: 0, desc: 'Bancada improvisada em acampamento sem ferramentas adequadas.' },
  { id: 'basic', nome: 'Básica (Basic Workshop)', tier: 'Basic', bonus: 5, ressonancia: 0, desc: 'Oficina profissional padrão de ferreiro ou artesão de vila.' },
  { id: 'superior', nome: 'Superior (Superior Workshop)', tier: 'Superior', bonus: 10, ressonancia: 2, desc: 'Oficina reforçada com ligas nobres e forjas avançadas. Suporta 2 pontos de ressonância.' },
  { id: 'master', nome: 'Mestre (Master Workshop)', tier: 'Master', bonus: 15, ressonancia: 4, desc: 'Oficina de mestre de guilda de alta precisão. Suporta 4 pontos de ressonância.' },
  { id: 'exalted', nome: 'Exaltada (Exalted Workshop)', tier: 'Exalted', bonus: 20, ressonancia: 6, desc: 'Oficina arcana de corte mágico e forjas elementais. Suporta 6 pontos de ressonância.' },
  { id: 'legendary', nome: 'Lendária (Legendary Workshop)', tier: 'Legendary', bonus: 25, ressonancia: 8, desc: 'Instalação mítica de lendas, capaz de forjar artefatos cósmicos. Suporta 8 pontos de ressonância.' }
];

// Estações de Refino
export const ESTACOES_REFINO = [
  { id: 'manual', nome: 'Manual / Kit Portátil', bonus: 0, capacidadeKg: 0.5 },
  { id: 'basic', nome: 'Estação Básica', bonus: 5, capacidadeKg: 2.0 },
  { id: 'superior', nome: 'Estação Superior', bonus: 10, capacidadeKg: 5.0 },
  { id: 'master', nome: 'Estação Mestre', bonus: 15, capacidadeKg: 10.0 },
  { id: 'exalted', nome: 'Estação Exaltada', bonus: 20, capacidadeKg: 20.0 },
  { id: 'legendary', nome: 'Estação Lendária', bonus: 25, capacidadeKg: 50.0 }
];

// Multiplicador de Qualidade de Itens (+1, +2, +3)
export const MULTIPLICADORES_QUALIDADE = {
  standard: { rotulo: 'Padrão (Mundano)', bonusCA: 0, bonusAtaqueDano: 0, multEsforco: 1, tierMinimo: 'Common' },
  plus1: { rotulo: 'Qualidade +1', bonusCA: 1, bonusAtaqueDano: 1, multEsforco: 2, tierMinimo: 'Common' },
  plus2: { rotulo: 'Qualidade +2', bonusCA: 2, bonusAtaqueDano: 2, multEsforco: 3, tierMinimo: 'Uncommon' },
  plus3: { rotulo: 'Qualidade +3', bonusCA: 3, bonusAtaqueDano: 3, multEsforco: 5, tierMinimo: 'Rare' }
};

// Condições Adicionais do Livro de Regras
export const REGRAS_CONDICOES = {
  embriaguez: {
    nome: 'Embriaguez (Drunkenness)',
    desc: 'Estado progressivo de intoxicação alcoólica com 6 níveis cumulativos e ressaca posterior.',
    niveis: [
      { nivel: 1, nome: 'Euforia (Euphoria)', efeito: 'Vantagem em testes contra Frightened e resistência a dano de queda. Desvantagem em Sabedoria (Insight) e salvaguardas de Carisma. Vantagem em Persuasão contra outras criaturas ébrias.' },
      { nivel: 2, nome: 'Hiporeflexia (Hyporeflexia)', efeito: 'Não adiciona modificador de Destreza na CA. Desvantagem em salvaguardas de Força e Destreza.' },
      { nivel: 3, nome: 'Confusão (Confusion)', efeito: 'Desvantagem em jogadas de ataque, testes de habilidade e salvaguardas de Inteligência e Sabedoria. Para lançar magia, teste de habilidade de conjuração (CD 10 + círculo da magia) ou o espaço é gasto sem efeito.' },
      { nivel: 4, nome: 'Agressividade (Aggressiveness)', efeito: 'Perde capacidade de manter concentração. No início de cada turno de combate, salvaguarda de Sabedoria CD 14 ou deve usar sua ação para atacar a criatura mais próxima. Bárbaros ativam Fúria automaticamente.' },
      { nivel: 5, nome: 'Estupor (Stupor)', efeito: 'No início de cada turno em combate, salvaguarda de Constituição CD 16 ou cai caído (prone), vomita e perde ação e movimento naquele turno. Duas falhas consecutivas causam incapacidade por 1d4 horas.' },
      { nivel: 6, nome: 'Coma Alcoólico (Alcoholic Coma)', efeito: 'Inconsciente até perder todos os níveis de embriaguez. A cada nível reduzido, sofre (Nível Atual)d4 de dano de veneno. Se chegar a 0 PV por esse dano, morre instantaneamente.' }
    ],
    ressaca: 'Ao sóbrio após nível 2+, ganha vulnerabilidade a dano de trovão e penalidade em todas as jogadas e testes igual ao nível máximo atingido, com duração de 2x horas do nível máximo.'
  },
  corrupcao: {
    nome: 'Corrupção (Corruption)',
    desc: 'Degradação da alma causada por Alquimia Sombria ou manipulação de encantamentos profanos (Níveis 0 a 11).',
    marcos: [
      { nivel: 3, nome: 'Sussurros do Vazio (Whispers of the Void)', efeito: 'Percebe ecos do Plano Etéreo, enxergando e ouvindo espíritos. Pode negociar pequenos favores em troca de redução de PV máximo.' },
      { nivel: 5, nome: 'Toque Gelado (Chilling Touch)', efeito: 'Pequenas plantas murcham ao toque e insetos morrem ao redor. Aprende o truque Toque Arrepiante (Chill Touch). Impossível ocultar a corrupção por meios mundanos.' },
      { nivel: 7, nome: 'Vínculo Cadavérico (Cadaveric Bond)', efeito: 'Não precisa mais comer, beber ou respirar. Aura de 3 metros que amedronta animais mundanos e impõe desvantagem em testes contra doenças e venenos a criaturas vivas.' },
      { nivel: 9, nome: 'Vigor Profano (Profane Vigor)', efeito: 'Sempre que causar dano necrótico a um alvo vivo, ganha PV temporários iguais ao seu nível de personagem.' },
      { nivel: 10, nome: 'O Limiar (The Threshold)', efeito: 'Tipo de criatura muda para Morto-Vivo (Undead). Magias de reviver falham automaticamente. Vantagem em testes contra a morte. Cura somente através de Alquimia Sombria ou efeitos de Mortos-Vivos.' },
      { nivel: 11, nome: 'Extinção (Extinction)', efeito: 'A alma é completamente aniquilada. Morte permanente e irreversível sem possibilidade de ressurreição por qualquer meio.' }
    ]
  },
  mutacoes: {
    nome: 'Mutações (Mutations)',
    desc: 'Estados físicos alterados que concedem poder bruto ao custo de estabilidade mental e isolamento biológico (8 níveis cumulativos).',
    pontos: [
      { nome: 'Precisão Letal (Lethal Precision)', desc: '+1 em jogadas de ataque e dano para cada 2 pontos de mutação.' },
      { nome: 'Massa Biológica (Biological Mass)', desc: '+1 em rolagens de Dado de Vida para cada 2 pontos de mutação.' },
      { nome: 'Carapaça Endurecida (Hardened Carapace)', desc: '+1 na CA para cada 2 pontos de mutação.' },
      { nome: 'Reflexos Primitivos (Primal Reflexes)', desc: '+1 na Iniciativa para cada ponto de mutação.' },
      { nome: 'Velocidade Bestial (Bestial Speed)', desc: '+1,5 metros (+5 pés) no deslocamento base para cada ponto.' },
      { nome: 'Armas Naturais (Natural Weapons)', desc: 'Ganha ataque de Mordida ou Garras (1d6 + FOR); aumenta um tamanho de dado por ponto.' }
    ]
  },
  variacoesCriatura: [
    { num: 1, nome: 'Gigantismo (Exacerbated Growth)', tipo: 'Física', desc: 'Aumenta uma categoria de tamanho, alcance +1,5m e dado adicional de dano em ataques baseados em Força.' },
    { num: 2, nome: 'Nanismo Congênito (Congenital Dwarfism)', tipo: 'Física', desc: 'Diminui uma categoria de tamanho, vantagem em Furtividade e +1 na CA.' },
    { num: 3, nome: 'Carapaça Natural (Natural Carapace)', tipo: 'Defensiva', desc: 'CA aumenta em valor igual a 1/4 do ND da criatura (mínimo +1, máximo +5).' },
    { num: 4, nome: 'Resiliência Dérmica (Dermal Resilience)', tipo: 'Defensiva', desc: 'Redução de Dano (RD) igual ao bônus de proficiência contra dano não-mágico de concussão, perfuração e corte.' },
    { num: 5, nome: 'Canhão de Vidro (Glass Cannon)', tipo: 'Combate', desc: 'CA diminui em 2; em troca, o ataque principal ganha 1 dado de dano adicional e todos os dados de dano sobem um degrau (ex: d6 vira d8).' },
    { num: 6, nome: 'Nulificação Arcana (Arcane Nullification)', tipo: 'Mágica', desc: 'Imune a magias de círculo igual ou inferior a 1/4 do ND (máximo círculo 4).' },
    { num: 7, nome: 'Barreira Mística (Mystic Barrier)', tipo: 'Mágica', desc: 'Resistência à Magia (vantagem em salvaguardas) e bônus nessas salvaguardas igual à metade do bônus de proficiência.' },
    { num: 8, nome: 'Vigor Sobrenatural (Supernatural Vigor)', tipo: 'Vitalidade', desc: 'PV máximo aumenta em 5x o ND.' },
    { num: 9, nome: 'Fator de Cura (Healing Factor)', tipo: 'Vitalidade', desc: 'No início do turno, regenera PV igual a ND + modificador de Constituição se tiver pelo menos 1 PV.' },
    { num: 10, nome: 'Adaptação Elemental (Elemental Adaptation)', tipo: 'Vitalidade', desc: 'Resistência a um elemento comum ao ambiente (ou Imunidade se já tiver resistência).' },
    { num: 11, nome: 'Atributos Esmagadores (Overwhelming Attributes)', tipo: 'Atributos', desc: 'Um valor de atributo aumenta em ND/5 (arredondado para cima), podendo ultrapassar 30.' },
    { num: 12, nome: 'Reflexos Prematuros (Twitch Reflexes)', tipo: 'Atributos', desc: 'Adiciona modificador de Destreza à rolagem de Iniciativa.' },
    { num: 13, nome: 'Prodígio (Prodigy)', tipo: 'Atributos', desc: 'Ganha um Talento de combate (ex: Sentinela, Conjurador de Guerra, etc.).' },
    { num: 14, nome: 'Sentidos Ancestrais (Ancestral Senses)', tipo: 'Sentidos', desc: 'Ganha Percepção às Cegas (18m), Sentido Sísmico (18m) ou Visão Verdadeira (9m).' },
    { num: 15, nome: 'Ataque Implacável (Relentless Assault)', tipo: 'Combate', desc: 'Ganha um ataque adicional sempre que usar a ação de Ataque ou Multiataque.' },
    { num: 16, nome: 'Crítico Brutal (Brutal Critical)', tipo: 'Combate', desc: 'Margem de ameaça crítica torna-se 19-20 e o dado base aumenta um tamanho (d8 vira d10, etc.).' },
    { num: 17, nome: 'Celeridade (Celerity)', tipo: 'Combate', desc: 'Deslocamento base aumenta em 4,5m (15 pés) e pode disparar (Dash) como ação bônus.' },
    { num: 18, nome: 'Biologia Encantada (Spellbound Biology)', tipo: 'Mágica', desc: 'Lança magia específica à vontade se círculo <= ND/8, ou com Recarga 5-6 se <= ND/4.' },
    { num: 19, nome: 'Fenômeno Vivo (Auras)', tipo: 'Mágica', desc: 'Aura permanente de 4,5m a 9m baseada em magia de círculo <= ND/4 (ex: Lentidão, Medo, Névoa Fétida).' },
    { num: 20, nome: 'Infusão Elemental (Elemental Infusion)', tipo: 'Combate', desc: 'Ataques causam dano elemental adicional igual a (ND/5)d4.' }
  ]
};

// ------------------------------------------------------------
// PARTE 2: ALQUIMIA (Substrates, Reagents, Synthesis Formulas)
// ------------------------------------------------------------
export const METODOS_USO_SUBSTRATOS = [
  'Ingestão (Poção / Alimento)',
  'Inalação (Gás / Vapor)',
  'Contato Dérmico (Óleo / Pomada)',
  'Arremesso / Detonação (Fulminante / Bomba)',
  'Injeção Sanguínea (Lodo / Quimera)'
];

// ------------------------------------------------------------
// PARTE 3: ENCANTAMENTOS (Codex, Origin & Application Strands)
// ------------------------------------------------------------
export const VERTENTES_ORIGEM = [
  { id: 'Erudition', nome: 'Erudição (The Sage)', atributo: 'int', ferramenta: 'Suprimentos de Calígrafo ou Ferramentas de Cartógrafo', criaturas: 'Elementais, Dragões, Ínferos', essencias: 'Ataques elementais, magias conhecidas, criaturas ordeiras' },
  { id: 'Liturgy', nome: 'Liturgia (The Herald)', atributo: 'car', ferramenta: 'Instrumento Musical', criaturas: 'Fadas, Humanoides, Celestiais', essencias: 'Perícias sociais, idiomas, auras, controle de batalha' },
  { id: 'Consecration', nome: 'Consagração (The Warden)', atributo: 'car', ferramenta: 'Ferramentas de Navegador ou Sapateiro', criaturas: 'Constructos, Celestiais, Gigantes', essencias: 'Resistências/imunidades, salvaguardas, armadura natural, cura' },
  { id: 'Animalism', nome: 'Animalismo (The Shaper)', atributo: 'sab', ferramenta: 'Kit de Envenenador ou Ferramentas de Entalhador', criaturas: 'Feras, Plantas, Gigantes', essencias: 'Ataques em matilha, sentidos aguçados, metamorfose' },
  { id: 'Abnegation', nome: 'Abnegação (The Ghost)', atributo: 'sab', ferramenta: 'Ferramentas de Ladrão ou Kit de Disfarce', criaturas: 'Aberrações, Monstruosidades, Lodos', essencias: 'Velocidades especiais (escalada/natação), invisibilidade, amorfo' },
  { id: 'Profanation', nome: 'Profanação (The Hollow)', atributo: 'int', ferramenta: 'Kit de Falsificação ou Conjunto de Jogos', criaturas: 'Ínferos, Mortos-Vivos, Lodos', essencias: 'Atributos 18+, ações lendárias, regeneração, vida falsa' }
];

export const VERTENTES_APLICACAO = [
  { id: 'Relic', nome: 'Relíquia (Relic)', desc: 'Encanta matéria inanimada (armas, armaduras, anéis, focos). Requer sintonização para virtudes arcanas.' },
  { id: 'Binding', nome: 'Vinculação (Binding)', desc: 'Sigilo etéreo tecido na força vital de um ser consciente. Consome Dados de Vida Reservados (1 a 9 HD). Permite 1 benéfica e 1 maldição.' },
  { id: 'Anchorage', nome: 'Ancoragem (Anchorage)', desc: 'Rito monumental fixado em área geográfica através de polígonos de âncoras (Relíquias sincronizadas).' }
];

export const TABELA_ES_TRABALHO = [
  { pontosMin: 100, slots: 1 },
  { pontosMin: 150, slots: 2 },
  { pontosMin: 200, slots: 3 },
  { pontosMin: 250, slots: 4 },
  { pontosMin: 300, slots: 5 },
  { pontosMin: 400, slots: 6 },
  { pontosMin: 500, slots: 7 }
];

export const CUSTO_SLOT_POR_TIER = {
  Minor: 1,
  Major: 2,
  Greater: 3,
  Arcane: 4,
  Primordial: 5
};

export const CD_TESTE_INTENCAO = {
  Minor: 15,
  Major: 25,
  Greater: 35,
  Arcane: 45,
  Primordial: 55,
  Artifact: 65
};

export const HIT_DICE_RESERVADO_BINDING = {
  Minor: 1,
  Major: 3,
  Greater: 5,
  Arcane: 7,
  Primordial: 9
};

// Re-exportar bancos existentes estruturados
export * from './arcanecraft-dados.js';
