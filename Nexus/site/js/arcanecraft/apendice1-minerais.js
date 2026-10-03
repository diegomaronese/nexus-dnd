// ============================================================
// Arcane Crafts Compendium - Apêndice 1: Minerais & Gemas (13 Itens Oficiais)
// Páginas A1-24 a A1-29 do livro "The Artisan's Ledger"
// ============================================================

export const MINERAIS_APENDICE1 = [
  // Common (A1-24)
  {
    id: 'coal',
    nome: 'Carvão Mineral',
    nomeEn: 'Coal',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.1,
    custoPo: 0.1,
    unitEffort: 4,
    afinidadeElemental: 'Fogo',
    categoria: 'gema',
    origem: 'Mineral Sedimentar',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: { inatas: [] },
    propriedades: 'Afinidade Elemental com Fogo. Combustível essencial para forjas de alta temperatura.',
    usos: 'Combustível de forjas, ligas de aço, filtros químicos',
    descricao: 'Rocha sedimentar combustível preta ou marrom escura de brilho fosco a vítreo.'
  },
  {
    id: 'quartz',
    nome: 'Quartzo Translúcido',
    nomeEn: 'Quartz',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 4,
    custoPo: 4,
    unitEffort: 8,
    afinidadeElemental: 'Frio',
    categoria: 'gema',
    origem: 'Mineral Cristalino',
    virtudesArmas: {
      inatas: ['Fragilidade Estrutural: Em Falha Crítica, sofre penalidade permanente de -2 no dano até ser reparado. Se o dano atingir 0, quebra.'],
      ressonantes: ['Armazenamento Elemental: Se o usuário lançar magia elemental, o próximo ataque físico bem-sucedido causa +1d4 de dano do mesmo elemento.']
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Ressonância de Dano: Ao lançar magia de dano elemental, pode rerrolar qualquer resultado "1" no dado de dano (usando o novo resultado).']
    },
    propriedades: 'Ressonância de Dano (rerrola 1s em dano elemental) e Armazenamento Elemental (+1d4 no próximo ataque).',
    usos: 'Focos de gelo, lâminas cristalinas, prismas ópticos',
    descricao: 'Cristal translúcido ou leitoso de brilho vítreo que vibra perto de fontes elementais de frio.'
  },

  // Uncommon (A1-25)
  {
    id: 'jade',
    nome: 'Jade Nobre',
    nomeEn: 'Jade',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 70,
    custoPo: 70,
    unitEffort: 25,
    afinidadeElemental: 'Ácido e Veneno',
    categoria: 'gema',
    origem: 'Pedra Ornamental',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Ressonância de Escola: Adiciona +1 na CD de salvaguarda para magias de uma escola específica escolhida na criação.']
    },
    propriedades: 'Ressonância de Escola (+1 na CD de magias de uma escola escolhida) e Afinidade com Ácido/Veneno.',
    usos: 'Focos arcanos especializados, talismãs de proteção espiritual',
    descricao: 'Pedra ornamental que varia do verde-oliva ao esmeralda pálido, com dureza excepcional e textura cerosa.'
  },
  {
    id: 'amethyst',
    nome: 'Ametista Profunda',
    nomeEn: 'Amethyst',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 60,
    custoPo: 60,
    unitEffort: 22,
    afinidadeElemental: 'Relâmpago e Radiante',
    categoria: 'gema',
    origem: 'Geodos Vulcânicos',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Precisão de Escola: Concede +1 de bônus nas jogadas de ataque mágico para magias da escola escolhida na criação.']
    },
    propriedades: 'Precisão de Escola (+1 em ataques mágicos de uma escola escolhida) e Afinidade com Relâmpago/Radiante.',
    usos: 'Varinhas, cetros de evocação e adivinhação',
    descricao: 'Variedade de quartzo de cor violeta intensa que cresce em geodos com facetas geométricas perfeitas.'
  },
  {
    id: 'obsidian',
    nome: 'Obsidiana Negra',
    nomeEn: 'Obsidian',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 50,
    custoPo: 50,
    unitEffort: 19,
    afinidadeElemental: 'Necrótico e Trovão',
    categoria: 'gema',
    origem: 'Vidro Vulcânico',
    virtudesArmas: {
      inatas: ['Fio Agudo: A margem de acerto crítico da arma aumenta em 1 (ex: de 20 para 19-20).', 'Integridade Precária: Em Falha Crítica, o equipamento se estilhaça e quebra imediatamente, tornando-se inutilizável.']
    },
    virtudesArmaduras: {
      inatas: ['Defesa Espinhosa: Atacante que acertar o usuário com ataque desarmado sofre 1d4 de dano de corte.', 'Integridade Precária: Ao sofrer Acerto Crítico, a armadura se quebra imediatamente.']
    },
    virtudesFoco: {
      inatas: ['Integridade Precária: Em Falha Crítica, quebra imediatamente.'],
      arcanas: ['Foco Letal: A margem de acerto crítico para ataques mágicos lançados através do foco aumenta em 1 (ex: de 20 para 19-20).']
    },
    propriedades: 'Fio Agudo / Foco Letal (margem de crítico ampliada em 1), mas com Integridade Precária (quebra em erro crítico ou crítico sofrido).',
    usos: 'Adagas de sacrifício, flechas letais, couraças laminadas',
    descricao: 'Vidro vulcânico preto extremamente suave e brilhante, gerando fios microscópicos mais afiados que o melhor aço.'
  },

  // Rare (A1-26)
  {
    id: 'diamond',
    nome: 'Diamante Puro',
    nomeEn: 'Diamond',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 42,
    afinidadeElemental: 'Radiante e Psíquico',
    categoria: 'gema',
    origem: 'Cárstico Profundo',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Focalização Superior: Concede +2 de bônus nas jogadas de ataque mágico para magias de DUAS escolas de magia escolhidas na criação.']
    },
    propriedades: 'Focalização Superior (+2 em ataques mágicos de duas escolas) e condutor incorruptível.',
    usos: 'Componentes rituais nobres, focos supremos de canalização',
    descricao: 'O mineral mais duro conhecido, transparente com brilho adamantino inigualável que refrata a luz em arco-íris cósmico.'
  },
  {
    id: 'bloodstone',
    nome: 'Pedra de Sangue (Heliotrópio)',
    nomeEn: 'Bloodstone',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 250,
    custoPo: 250,
    unitEffort: 45,
    afinidadeElemental: 'Necrótico e Força',
    categoria: 'gema',
    origem: 'Jaspe Ferrífero',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Nexo Arcano Triplo: Adiciona +1 na CD de salvaguarda para magias de TRÊS escolas de magia escolhidas na criação.']
    },
    propriedades: 'Nexo Arcano Triplo (+1 na CD de 3 escolas de magia) e Afinidade com Necrótico/Força.',
    usos: 'Amuletos de necromancia e transmutação, anéis de poder',
    descricao: 'Variedade de calcedônia verde-escura salpicada com manchas vermelhas brilhantes de óxido de ferro semelhantes a gotas de sangue.'
  },

  // Exotic (A1-26, A1-27)
  {
    id: 'pink_diamond',
    nome: 'Diamante Rosa',
    nomeEn: 'Pink Diamond',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 700,
    custoPo: 700,
    unitEffort: 70,
    afinidadeElemental: 'Frio e Veneno',
    categoria: 'gema',
    origem: 'Deformação Cristalina Rara',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Prisma de Especialização: Escolha uma das três propriedades: (1) Perfuração Elemental (ignora resistência ao elemento escolhido em ataques mágicos); (2) Empoderamento Arcano (+2 nas jogadas de ataque mágico gerais); (3) Foco Crítico (margem crítica de magias reduzida em 1, de 20 para 19-20).'
      ]
    },
    propriedades: 'Prisma de Especialização (escolhe Perfuração Elemental, +2 em ataques mágicos ou Margem Crítica 19-20).',
    usos: 'Cajados de arquimagos, tiaras de rainhas arcanas',
    descricao: 'Uma das gemas mais raras da existência, variando do pastel delicado ao fúcsia vibrante. Refração arcana extrema.'
  },
  {
    id: 'mana_stone',
    nome: 'Pedra de Mana',
    nomeEn: 'Mana Stone',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 1000,
    custoPo: 1000,
    unitEffort: 75,
    afinidadeElemental: 'Trovão e Relâmpago',
    categoria: 'gema',
    origem: 'Bateria Pura de Mana Condensado',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Núcleo de Instabilidade Fluida: Escolha uma propriedade: (1) Dissipação de Resistência (ignora resistência ao elemento escolhido para magias de salvaguarda); (2) Autoridade Arcana (+1 na CD de salvaguarda de TODAS as suas magias); (3) Reciclagem de Mana (ao lançar magia, role 1d10; se > 5 + círculo usado, o espaço não é consumido).'
      ]
    },
    propriedades: 'Núcleo de Instabilidade Fluida (+1 em TODAS as CDs de magia, ignora resistências em salvaguarda ou Reciclagem de Mana d10).',
    usos: 'Orbes de poder de alta patente, baterias de rituais monumentais',
    descricao: 'Gema pulsante azul-índigo que abriga uma nebulosa viva em constante movimento interior. Gelada ao toque.'
  },
  {
    id: 'lava_stone',
    nome: 'Pedra de Lava',
    nomeEn: 'Lava Stone',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 666,
    custoPo: 666,
    unitEffort: 66,
    afinidadeElemental: 'Fogo e Ácido',
    categoria: 'gema',
    origem: 'Vulcões Primordiais',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Catalisador de Fusão Elemental: Escolha uma propriedade: (1) Penetração Dupla (ignora resistência ao elemento escolhido); (2) Intensificação de Massa (sobe a escala de dados de dano da magia em 1 degrau: d4->d6->d8->d10->d12); (3) Sobrecarga Térmica (magias de dois elementos contam como lançadas em espaço 1 círculo superior).'
      ]
    },
    propriedades: 'Intensificação de Massa (dados de dano de magia sobem um degrau até d12), Penetração Dupla ou Sobrecarga Térmica.',
    usos: 'Varinhas magmáticas, orbes de calor geodésico',
    descricao: 'Rocha porosa e enegrecida com veios de magma perpétuo brilhando no interior em tom laranja vibrante.'
  },

  // Mythic (A1-28, A1-29)
  {
    id: 'massive_star_dust',
    nome: 'Pó Estelar Maciço',
    nomeEn: 'Massive Star Dust',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 4350,
    custoPo: 4350,
    unitEffort: 89,
    afinidadeElemental: 'Frio, Fogo, Veneno e Ácido',
    categoria: 'gema',
    origem: 'Fragmento de Galáxia Solidificada',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Singularidade Astral: Escolha uma propriedade: (1) Aniquilação Elemental (ignora resistência E imunidade ao elemento escolhido em ataques mágicos); (2) Foco Cósmico (margem crítica de magias reduzida em 2, de 20 para 18-20); (3) Estabilidade Universal (magias de ataque causam dano médio máximo sem rolar dados).'
      ]
    },
    propriedades: 'Aniquilação Elemental (ignora resistência e imunidade), Foco Cósmico (crítico 18-20) e Estabilidade Universal.',
    usos: 'Artefatos estelares de destruição cósmica, cetros de deuses astrais',
    descricao: 'Material paradoxal como pedaço de galáxia engarrafada. Preto profundo salpicado de estrelas vivas em movimento.'
  },
  {
    id: 'primordial_stone',
    nome: 'Pedra Primordial',
    nomeEn: 'Primordial Stone',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 4750,
    custoPo: 4750,
    unitEffort: 92,
    afinidadeElemental: 'Necrótico, Trovão e Psíquico',
    categoria: 'gema',
    origem: 'Núcleo da Criação',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Vontade do Gênesis: Escolha uma propriedade: (1) Penetração Absoluta (ignora resistência e imunidade para magias de salvaguarda); (2) Eficiência Primordial (se d10 > 1 + círculo gasto, o espaço não é consumido); (3) Quebrador da Natureza (criaturas imunes a Envenenado/Paralisado perdem imunidade contra o foco); (4) Potenciador de Destruição (+2 na CD de magias de dano).'
      ]
    },
    propriedades: 'Vontade do Gênesis: Penetração Absoluta, Eficiência Primordial (d10 > 1+slot), Quebrador de Imunidades a condições ou +2 na CD.',
    usos: 'Focos de nível divino, selos de criação planar',
    descricao: 'Pedra que pulsa com as cores fundamentais da criação (vermelho incandescente, azul abissal, verde vibrante e marrom telúrico).'
  },
  {
    id: 'living_core_rock',
    nome: 'Rocha do Núcleo Vivo',
    nomeEn: 'Living Core Rock',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 100,
    afinidadeElemental: 'Radiante, Relâmpago e Força',
    categoria: 'gema',
    origem: 'Coração do Mundo Geotérmico',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Sobrecarga Tectônica: Escolha uma propriedade: (1) Vulnerabilidade Forçada (magias de alvo único de um elemento ignoram resistências, tratam imunidade como resistência ou impõem VULNERABILIDADE se o alvo não tiver defesa!); (2) Intensificação de Massa Superior (sobe DOIS degraus na escala de dano: d4->d8, d6->d10, d8->d12, d10->2d8, d12->1d20); (3) Herança do Núcleo (+1 propriedade adicional de qualquer material Raro ou Exótico).'
      ]
    },
    propriedades: 'Sobrecarga Tectônica: Impõe Vulnerabilidade Forçada, sobe dano em 2 degraus (d8->d12, d12->d20) ou herda virtude de outro material.',
    usos: 'Focos titânicos, martelos do coração do mundo',
    descricao: 'Substância semi-líquida pulsante como magma denso que bate no ritmo de um coração telúrico gigante.'
  }
];
