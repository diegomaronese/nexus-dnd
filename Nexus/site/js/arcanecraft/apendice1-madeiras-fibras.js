// ============================================================
// Arcane Crafts Compendium - Apêndice 1: Madeiras & Fibras (16 Itens Oficiais)
// Páginas A1-30 a A1-36 do livro "The Artisan's Ledger"
// ============================================================

export const MADEIRAS_FIBRAS_APENDICE1 = [
  // --- MADEIRAS (Wood, p. A1-30 a A1-33) ---
  {
    id: 'common_woods',
    nome: 'Madeiras Comuns (Carvalho, Pinho, Freixo, Bétula)',
    nomeEn: 'Common Woods',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.25,
    custoPo: 0.25,
    unitEffort: 4,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Vegetal',
    virtudesArmas: {
      inatas: [
        'Limitações Estruturais: Impossível manufaturar armas com a propriedade Pesada. Armas cortantes têm dano fixo em 1; armas perfurantes sofrem -2 no dano. Quebra imediatamente em Falha Crítica.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      inatas: ['Instabilidade Fibrosa: Ao rolar 1 natural em ataque mágico, a magia ricocheteia e atinge o próprio conjurador!']
    },
    propriedades: 'Limitações Estruturais (sem armas pesadas, quebra em 1 natural) e Instabilidade Fibrosa em focos.',
    usos: 'Cabos básicos de ferramentas, lanças improvisadas, escudos de madeira leve',
    descricao: 'Madeiras acessíveis como carvalho, pinho e bétula. Fáceis de talhar, mas com severas limitações mecânicas.'
  },
  {
    id: 'high_quality_woods',
    nome: 'Madeiras Nobres (High-Quality Woods)',
    nomeEn: 'High-Quality Woods',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 1,
    custoPo: 1,
    unitEffort: 7,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Vegetal Nobre',
    virtudesArmas: {
      inatas: [
        'Desgaste Fibroso: Cada Falha Crítica impõe -1 permanente no dano; quebra se chegar a 0 (somente conserto por magia como Mending). Armas cortantes têm dano fixado em 1.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      inatas: ['Instabilidade Fibrosa: Ao rolar 1 natural em ataque mágico, a magia atinge o próprio usuário.']
    },
    propriedades: 'Grão denso com desgaste fibroso restaurável apenas por magias como Mending.',
    usos: 'Bainhas ornamentadas, arcos longos e escudos resistentes',
    descricao: 'Madeiras densas de grão elegante que aceitam polimentos finos e tratamentos alquímicos.'
  },
  {
    id: 'treated_quality_woods',
    nome: 'Madeiras Nobres Tratadas',
    nomeEn: 'Treated Quality Woods',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 3,
    custoPo: 3,
    unitEffort: 10,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Imersão Alquímica em Óleos Raros',
    virtudesArmas: {
      inatas: ['Limitação de Fio: Armas de dano cortante têm dano fixado em 1 (não seguram fio afiado como metais).']
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: { inatas: [] },
    propriedades: 'Textura quase metálica e resiliência a impactos severos que destruiriam madeiras normais.',
    usos: 'Arcos compostos de precisão, mastros de naus, escudos reforçados',
    descricao: 'Madeira imersa em sais minerais e resinas alquímicas por meses, adquirindo densidade molecular quase metálica.'
  },
  {
    id: 'black_ebony',
    nome: 'Ébano Negro',
    nomeEn: 'Black Ebony',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 20,
    custoPo: 20,
    unitEffort: 13,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Florestas Tropicais Profundas',
    virtudesArmas: {
      inatas: [
        'Estabilidade Estrutural: A primeira Falha Crítica feita em um ataque (físico ou mágico) com este item a cada turno é tratada como erro normal.',
        'Limitação de Fio: Armas cortantes corpo a corpo têm dano fixado em 1.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      inatas: ['Estabilidade Estrutural: A primeira Falha Crítica mágica no turno é tratada como erro normal.']
    },
    propriedades: 'Estabilidade Estrutural: Anula a primeira falha crítica por turno em ataques ou canalizações.',
    usos: 'Cajados marciais elegantes, cabos de armas pesadas, varinhas densas',
    descricao: 'Madeira preta pesadíssima que não flutua na água e, quando polida, adquire brilho de mármore negro.'
  },
  {
    id: 'petrified_wood',
    nome: 'Madeira Petrificada',
    nomeEn: 'Petrified Wood',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 75,
    custoPo: 75,
    unitEffort: 21,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Fóssil Mineralizado Ancestral',
    virtudesArmas: {
      inatas: [
        'Ao Acertar (On Hit): Se pelo menos um dado de dano rolar seu valor máximo, o alvo perde sua Reação até o início do seu próximo turno!',
        'No Acerto Crítico: Se pelo menos metade dos dados de dano rolar valor máximo, a margem de acerto crítico contra aquele alvo aumenta em 1 até o fim do seu próximo turno.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      inatas: [
        'Ao Acertar: Se um dado de dano rolar máximo, o alvo perde Reação até seu próximo turno.',
        'No Crítico: Aumenta a margem de crítico contra o alvo em 1.'
      ]
    },
    propriedades: 'Remove Reação do alvo ao rolar dano máximo e amplia margem crítica em acertos críticos.',
    usos: 'Bordões fósseis, clavas cerimoniais, focos arcanos de pedra viva',
    descricao: 'Estrutura celular original vegetal substituída por minerais ao longo de eras. Peso e dureza de pedra.'
  },
  {
    id: 'red_ironwood',
    nome: 'Pau-Ferro Vermelho (Red Ironwood)',
    nomeEn: 'Red Ironwood',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 20,
    custoPo: 20,
    unitEffort: 12,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Árvores Ferríferas',
    virtudesArmas: {
      inatas: ['Mimetismo Metálico: Esta madeira pode mimetizar as características físicas de qualquer metal comum (Ferro, Aço ou Bronze) para dano, peso e propriedades mecânicas, mantendo natureza orgânica (imune a Esquentar Metal, vulnerável a efeitos de madeira).']
    },
    virtudesArmaduras: {
      inatas: ['Mimetismo Metálico: Funciona como armadura de metal sem ser vulnerável a Esquentar Metal (ideal para Druidas).']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Mimetismo Metálico: Conta como metal para propósitos de combate, mas é imune a magias como Heat Metal.',
    usos: 'Armaduras de placas para druidas, escudos que não conduzem eletricidade',
    descricao: 'Fibras tão compactadas que possuem brilho metálico natural avermelhado semelhante a ferro cor de sangue.'
  },
  {
    id: 'blue_wood',
    nome: 'Madeira Azul (Blue Wood)',
    nomeEn: 'Blue Wood',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 40,
    custoPo: 40,
    unitEffort: 20,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Bosques Eólicos de Alta Altitude',
    virtudesArmas: {
      inatas: [
        'Impulso Eólico: A estrutura aerodinâmica permite que projéteis disparados por armas feitas deste material (como arcos ou bestas) dobrem seu alcance!',
        'Limitação de Fio: Armas cortantes têm dano fixado em 1.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: { inatas: [] },
    propriedades: 'Impulso Eólico: Dobra o alcance normal e longo de armas de disparo (arcos e bestas).',
    usos: 'Arcos de franco-atiradores, hastes de bestas leves de longo alcance',
    descricao: 'Madeira exótica cujos veios brilham em azul-celeste vibrante. Extremamente leve e aerodinâmica.'
  },
  {
    id: 'fey_tree_core',
    nome: 'Cerne de Árvore Feérica',
    nomeEn: 'Fey Tree Core',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 242,
    custoPo: 242,
    unitEffort: 44,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Convergência Feywild',
    virtudesArmas: {
      inatas: [
        'Letalidade Elegante: Quando usada em armas versáteis ou de duas mãos, a ressonância feérica amplifica os pontos vitais: o multiplicador de Acerto Crítico torna-se x3!',
        'Limitação de Fio: Dano cortante fixado em 1.'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Estabilidade Mágica: Magias canalizadas através do cerne têm refinamento feérico: todos os dados de dano de magias têm valor mínimo de 2 (se rolar 1, conte como 2).']
    },
    propriedades: 'Letalidade Elegante (crítico x3 com duas mãos) e Estabilidade Mágica (dano mínimo 2 em dados de magia).',
    usos: 'Lanças de cavaleiros feéricos, cajados floridos arcanos',
    descricao: 'Extraído do coração de árvores de convergência feérica. Brilho furta-cor que emite sons de sinos distantes.'
  },
  {
    id: 'underworld_ancestral_tree_core',
    nome: 'Cerne de Árvore Ancestral do Submundo',
    nomeEn: 'Underworld Ancestral Tree Core',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 650,
    custoPo: 650,
    unitEffort: 63,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'Abismos Subterrâneos Sem Luz',
    virtudesArmas: {
      inatas: ['Limitação de Fio: Dano cortante fixado em 1.'],
      arcanas: [
        'Herança Profunda: Escolha duas propriedades na criação: (1) Letalidade Brutal (multiplicador de crítico x3 em duas mãos); (2) Precisão Sombria (reduz margem de crítico em 1, de 20 para 19-20); (3) Vantagem Abissal (ao atacar com vantagem, role 3 dados e escolha o melhor).'
      ]
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: [
        'Canalização do Vazio: Escolha uma propriedade: (1) Reciclagem de Essência (d10 > 5 + círculo, espaço não é gasto); (2) Foco Crítico (reduz margem crítica de magias em 1).'
      ]
    },
    propriedades: 'Vantagem Abissal (rola 3 dados em vantagem), Letalidade Brutal (crítico x3) ou Reciclagem de Essência.',
    usos: 'Cajados do Subterrâneo profundo, grandes bastões sombrios',
    descricao: 'Madeira cinza-cadavérica com veios que brilham em violeta, absorvendo a luminosidade ambiente.'
  },
  {
    id: 'yggdrasil_core',
    nome: 'Cerne de Yggdrasil (Árvore-do-Mundo)',
    nomeEn: 'Yggdrasil Core',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 6000,
    custoPo: 6000,
    unitEffort: 120,
    categoria: 'fibra_madeira',
    subTipo: 'madeira',
    origem: 'A Própria Árvore Cósmica',
    virtudesArmas: {
      inatas: ['Limitação de Fio: Dano cortante fixado em 1.'],
      ressonantes: ['Destino Manifesto: Reduz a margem de acerto crítico da arma em 2 (ex: de 20 para 18-20)!']
    },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      arcanas: ['Fonte Infinita: O foco é canal da seiva mágica do cosmos. Ao lançar magia, role 1d10; se d10 > 1 + círculo gasto, o espaço não é consumido!']
    },
    propriedades: 'Destino Manifesto (margem crítica 18-20) e Fonte Infinita (recicla espaços de magia quase sempre).',
    usos: 'Cajados cósmicos de arcanistas supremos, artefatos míticos',
    descricao: 'Fragmento puro da Árvore-do-Mundo. Brilha em dourado e é morno ao toque, indestrutível por meios mundanos.'
  },

  // --- FIBRAS & TECIDOS (Fibers, p. A1-34 a A1-36) ---
  {
    id: 'wool',
    nome: 'Lã Natural',
    nomeEn: 'Wool',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.5,
    custoPo: 0.5,
    unitEffort: 9,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Animal Rústico',
    virtudesRoupas: {
      inatas: [
        'Isolamento Térmico: Concede proteção contra fontes naturais de frio (climas árticos e ventos gélidos).',
        'Especialização de Ofício: Escolha +1 em uma perícia social ou natural: Furtividade, Atuação, Intimidação, Persuasão, Enganação, Religião, Adestrar Animais ou Sobrevivência.'
      ]
    },
    virtudesArmaduras: {
      inatas: ['Inflamável: Ao sofrer dano de fogo, role 1d6; em resultado 1, a vestimenta pega fogo causando dano contínuo até ser apagada.']
    },
    propriedades: 'Isolamento Térmico contra frio e Especialização de Ofício (+1 em uma perícia escolhida).',
    usos: 'Mantos de viagem de inverno, forrações acolchoadas',
    descricao: 'Fibra densa e macia obtida da tosquia de ovelhas e feras peludas com retenção térmica fenomenal.'
  },
  {
    id: 'cotton_linen',
    nome: 'Algodão / Linho',
    nomeEn: 'Cotton/Linen',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.2,
    custoPo: 0.2,
    unitEffort: 6,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Plantas Cultivadas',
    virtudesRoupas: {
      inatas: [
        'Proteção Térmica: Concede proteção contra fontes naturais de calor (climas desérticos e sol prolongado).',
        'Especialização de Ofício: Escolha +1 em uma perícia: Furtividade, Atuação, Intimidação, Persuasão, Enganação, Religião, Adestrar Animais ou Sobrevivência.'
      ]
    },
    virtudesArmaduras: {
      inatas: ['Inflamável: Em resultado 1 num d6 após dano de fogo, pega fogo causando dano contínuo.']
    },
    propriedades: 'Proteção Térmica contra calor e Especialização de Ofício (+1 em perícia escolhida).',
    usos: 'Túnicas leves, roupas de aventureiro, acolchoados básicos',
    descricao: 'Fibras vegetais tecidas em panos respiráveis. A base de todas as vestimentas da civilização.'
  },
  {
    id: 'silk',
    nome: 'Seda Pura',
    nomeEn: 'Silk',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 100,
    custoPo: 100,
    unitEffort: 25,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Casulos de Bicho-da-Seda / Aranhas Gigantes',
    virtudesRoupas: {
      ressonantes: [
        'Elegância Funcional: Escolha 3 benefícios entre: +1 Furtividade, +1 Atuação, +1 Intimidação, +1 Persuasão, +1 Enganação, +1 Religião, +1 Adestrar Animais, +1 Sobrevivência (pode repetir a mesma perícia até o máximo de +2).'
      ]
    },
    propriedades: 'Elegância Funcional: Escolha 3 bônus de perícia (podendo acumular até +2 na mesma).',
    usos: 'Vestes de nobres, cordas de arco de alta tensão, mantos elegantes',
    descricao: 'Tecido luxuoso com caimento acetinado perfeito e resistência surpreendente para sua espessura fina.'
  },
  {
    id: 'fey_tree_fiber',
    nome: 'Fibra de Árvore Feérica',
    nomeEn: 'Fey Tree Fiber',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 300,
    custoPo: 300,
    unitEffort: 49,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Casca Interna de Árvores do Feywild',
    virtudesRoupas: {
      ressonantes: [
        'Dom Feérico: A vestimenta adapta-se à aura do usuário. Escolha 5 benefícios entre perícias (+1 cada, repetível até +2 na mesma).'
      ]
    },
    propriedades: 'Dom Feérico: 5 bônus de perícia distribuíveis, aroma de flores e orvalho.',
    usos: 'Mantos élficos de camuflagem, túnicas de corte feérica',
    descricao: 'Assemelha-se a fios de seda prateada entrelaçados com musgo luminescente, quase transparente sob certas luzes.'
  },
  {
    id: 'underworld_ancestral_tree_fiber',
    nome: 'Fibra de Árvore Ancestral do Submundo',
    nomeEn: 'Underworld Ancestral Tree Fiber',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 75,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Raízes de Árvores Abissais do Submundo',
    virtudesRoupas: {
      ressonantes: [
        'Maestria Profunda: Confere presença esmagadora ou sutileza sobrenatural. Escolha 10 benefícios entre perícias (+1 cada, repetível até +3 na mesma).'
      ]
    },
    propriedades: 'Maestria Profunda: 10 bônus de perícia distribuíveis (podendo acumular até +3 na mesma perícia).',
    usos: 'Mantos de sombras vivas, vestes de assassinos supremos',
    descricao: 'Fio filamentoso negro absoluto que não reflete luz, como névoa sólida gelada ao toque.'
  },
  {
    id: 'yggdrasil_fiber',
    nome: 'Fibra de Yggdrasil',
    nomeEn: 'Yggdrasil Fiber',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 120,
    categoria: 'fibra_madeira',
    subTipo: 'fibra',
    origem: 'Fibras Cósmicas da Árvore-do-Mundo',
    virtudesRoupas: {
      ressonantes: [
        'Bênção da Criação: Eleva o usuário a níveis quase divinos. Escolha 20 benefícios entre perícias (+1 cada, repetível até +4 na mesma perícia!).'
      ]
    },
    propriedades: 'Bênção da Criação: 20 bônus de perícia distribuíveis (podendo alcançar +4 em perícias escolhidas).',
    usos: 'Túnicas de divindades, vestimentas sagradas indestrutíveis',
    descricao: 'Malha de luz líquida alternando entre ouro e branco prismático que parece curar a alma de quem a veste.'
  }
];
