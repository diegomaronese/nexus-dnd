// ============================================================
// Arcane Crafts Compendium - Apêndice 1: Metais (44 Metais Oficiais)
// Páginas A1-2 a A1-23 do livro "The Artisan's Ledger"
// ============================================================

export const METAIS_APENDICE1 = [
  // --- TIER 1: COMMON (8 Metais) ---
  {
    id: 'copper',
    nome: 'Cobre',
    nomeEn: 'Copper',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.5,
    custoPo: 0.5,
    unitEffort: 5,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral',
    virtudesArmas: {
      inatas: ['Ductilidade: Penalidade de -1 no dano.', 'Fragilidade: O objeto quebra ou se deforma severamente em uma Falha Crítica (1 natural).']
    },
    virtudesArmaduras: {
      inatas: ['Ductilidade: Penalidade de -1 na CA.', 'Fragilidade: O objeto quebra ou se deforma severamente ao sofrer um Acerto Crítico.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Ductilidade (-1 dano/CA) e Fragilidade (quebra em erro crítico ou acerto crítico sofrido).',
    usos: 'Ligas de bronze/latão, ornamentos, componentes de baixa exigência',
    descricao: 'Metal avermelhado de brilho quente e alta maleabilidade. Desenvolve pátina esverdeada (azeviche) com o tempo.'
  },
  {
    id: 'iron',
    nome: 'Ferro',
    nomeEn: 'Iron',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 1,
    custoPo: 1,
    unitEffort: 7,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral',
    virtudesArmas: {
      inatas: ['Desgaste Rápido: Penalidade de -1 no dano.', 'Integridade: Em Falha Crítica, sofre penalidade permanente de -1 no dano até ser reparado. Se chegar a 0, quebra.']
    },
    virtudesArmaduras: {
      inatas: ['Desgaste Rápido: Penalidade de -1 na CA.', 'Integridade: Ao sofrer Acerto Crítico, sofre penalidade permanente de -1 na CA até ser reparado. Se a CA cair para 10, quebra.']
    },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens feitos deste material não podem servir como foco de conjuração.']
    },
    propriedades: 'Desgaste Rápido (-1 dano/CA) e Degradação por Integridade em críticos.',
    usos: 'Armas e armaduras básicas de milícia e infantaria',
    descricao: 'O metal mais abundante nas forjas. Cinza escuro quando bruto e prateado polido. Sujeito a ferrugem.'
  },
  {
    id: 'bronze',
    nome: 'Bronze',
    nomeEn: 'Bronze',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 2,
    custoPo: 2,
    unitEffort: 7,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga (90% Cobre / 10% Estanho)',
    virtudesArmas: {
      inatas: ['Versatilidade de Empunhadura: Penalidade de -1 no dano; contudo, se o usuário tiver Destreza 17+, a leveza da liga concede +1 de bônus no dano.', 'Integridade: Em Falha Crítica, penalidade de -1 permanente no dano até ser reparado.']
    },
    virtudesArmaduras: {
      inatas: ['Propriedades Defensivas: -1 na CA, mas oferece Resistência a dano de Fogo de fontes ambientais (calor extremo/fogo natural).', 'Integridade: Em Acerto Crítico sofrido, penalidade de -1 permanente na CA até ser reparado.']
    },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens usados como foco mágico têm penalidade de -1 na CD de suas magias.']
    },
    propriedades: 'Leveza ágil (+1 dano com DES 17+) e Resistência a fogo ambiental em armaduras (-1 CA).',
    usos: 'Armaduras costeiras, escudos, armas balanceadas',
    descricao: 'Liga metálica dourado-escura resistente à corrosão marinha, com ressonância cristalina ao impacto.'
  },
  {
    id: 'brass',
    nome: 'Latão',
    nomeEn: 'Brass',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 2,
    custoPo: 2,
    unitEffort: 7,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga (60% Cobre / 40% Zinco)',
    virtudesArmas: {
      inatas: ['Versatilidade de Empunhadura: Penalidade de -1 no dano; contudo, se o usuário tiver Força 17+, a densidade concede +1 de bônus no dano por impacto pesado.', 'Integridade: Em Falha Crítica, penalidade permanente de -1 no dano.']
    },
    virtudesArmaduras: {
      inatas: ['Propriedades Defensivas: Resistência a dano de Frio de fontes ambientais (neve ou frio extremo).', 'Integridade: Ao sofrer Acerto Crítico, sofre penalidade permanente de -1 na CA até ser reparado.']
    },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens usados como foco mágico têm penalidade de -1 na CD de suas magias.']
    },
    propriedades: 'Impacto denso (+1 dano com FOR 17+) e Resistência ao frio ambiental em armaduras.',
    usos: 'Mecanismos de precisão, instrumentos de sopro, armaduras de desfile',
    descricao: 'Liga amarelada brilhante semelhante ao ouro, mais rígida e ressonante, altamente resistente à oxidação.'
  },
  {
    id: 'steel',
    nome: 'Aço Comum',
    nomeEn: 'Steel',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 3,
    custoPo: 3,
    unitEffort: 8,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga (98% Ferro / 2% Carvão)',
    virtudesArmas: {
      inatas: ['Integridade: Em Falha Crítica, penalidade permanente de -1 no dano até ser reparado. Se chegar a 0, quebra.']
    },
    virtudesArmaduras: {
      inatas: ['Integridade: Ao sofrer Acerto Crítico, sofre penalidade permanente de -1 na CA até ser reparado. Se a CA cair para 10, quebra.']
    },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens de aço comum não podem servir como foco de conjuração.']
    },
    propriedades: 'Padrão ouro militar. Equilíbrio ideal entre dureza e flexibilidade sem bônus adicionais.',
    usos: 'Armas militares, armaduras de placas e cotas de malha',
    descricao: 'Liga refinada de ferro e carbono, o padrão militar de durabilidade nos campos de batalha.'
  },
  {
    id: 'additive_steel',
    nome: 'Aço Aditivado',
    nomeEn: 'Additive Steel',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 5,
    custoPo: 5,
    unitEffort: 8,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga (88% Ferro / 2% Carvão / 10% Níquel)',
    virtudesArmas: { inatas: [] },
    virtudesArmaduras: { inatas: [] },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens de aço aditivado não podem servir como foco de conjuração.']
    },
    propriedades: 'Superfície vitrificada sem porosidade que repele sangue e sujeira. Resistência a desgaste sem perda de integridade.',
    usos: 'Armamentos de elite, espadas de capitães de guarda',
    descricao: 'Versão enriquecida de aço com níquel que elimina porosidades e apresenta brilho vítreo imaculado.'
  },
  {
    id: 'pure_silver',
    nome: 'Prata Pura',
    nomeEn: 'Pure Silver',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 5,
    custoPo: 5,
    unitEffort: 10,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral Nobre',
    virtudesArmas: {
      inatas: ['Integridade: Em Falha Crítica, penalidade de -1 permanente no dano até ser reparado.']
    },
    virtudesArmaduras: {
      inatas: ['Integridade: Ao sofrer Acerto Crítico, penalidade de -1 permanente na CA até ser reparado.']
    },
    virtudesFoco: {
      inatas: ['Condutividade Espiritual: Se o conjurador tiver Atributo de Conjuração 17+, o foco concede +1 de bônus no dano de suas magias.']
    },
    propriedades: 'Condutividade Espiritual (+1 dano em magias com Atributo 17+) e pureza lunar.',
    usos: 'Focos de conjuração, lâminas banhadas contra licantropos',
    descricao: 'Metal nobre de brilho lunar intenso e refletividade sem igual. Extremamente dúctil e associado à pureza.'
  },
  {
    id: 'damascus_steel',
    nome: 'Aço Damasco',
    nomeEn: 'Damascus Steel',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 10,
    custoPo: 10,
    unitEffort: 10,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Forja Padrão Dobrada',
    virtudesArmas: {
      inatas: ['Fio de Precisão: Devido às camadas macroscópicas, mantém fio resiliente. Se o usuário tiver FOR ou DES 17+, concede +1 de bônus no dano.']
    },
    virtudesArmaduras: {
      inatas: ['Refração Defensiva: Estrutura laminada dissipa impactos cinéticos. Concede +1 na CA especificamente contra ataques físicos à distância.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Fio de Precisão (+1 dano com FOR/DES 17+) e Refração Defensiva (+1 CA contra projéteis).',
    usos: 'Lâminas afiadíssimas, peitorais contra arqueiros',
    descricao: 'Metal lendário com padrões ondulados que lembram água corrente, combinando extrema dureza e flexibilidade.'
  },

  // --- TIER 2: UNCOMMON (5 Metais) ---
  {
    id: 'gold',
    nome: 'Ouro Puro',
    nomeEn: 'Gold',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 50,
    custoPo: 50,
    unitEffort: 17,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral Precioso',
    virtudesArmas: {
      inatas: ['Condutor Áureo: Pode ser utilizado como Foco Arcano.', 'Integridade: -1 dano em Falha Crítica até ser reparado.']
    },
    virtudesArmaduras: {
      inatas: ['Condutor Áureo: Armadura pode ser utilizada como Foco Arcano.', 'Integridade: -1 CA em Acerto Crítico sofrido.']
    },
    virtudesFoco: {
      inatas: ['Precisão Arcana: Quando usado como foco, concede +1 de bônus nas jogadas de ataque de suas magias.']
    },
    propriedades: 'Condutor Áureo (funciona como Foco Arcano) e Precisão Arcana (+1 em ataques mágicos).',
    usos: 'Armaduras sacramentais, cetros, armas clericais e arcanas',
    descricao: 'Metal denso, amarelo e brilhante, imune à oxidação e altamente condutor das energias da Trama.'
  },
  {
    id: 'titanium',
    nome: 'Titânio',
    nomeEn: 'Titanium',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 70,
    custoPo: 70,
    unitEffort: 16,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral Tecnológico',
    virtudesArmas: {
      inatas: ['Memória de Forma: A primeira Falha Crítica cometida em combate é tratada como um erro normal (não quebra nem penaliza).']
    },
    virtudesArmaduras: {
      inatas: ['Leveza Estrutural: Remove a desvantagem em testes de Destreza (Furtividade).', 'Inércia Química: A CA da armadura é imune a efeitos de corrosão (como Pudim Negro ou Monstro da Ferrugem).']
    },
    virtudesFoco: {
      inatas: ['Foco Mágico: Itens de titânio não podem servir como foco de conjuração.']
    },
    propriedades: 'Memória de Forma (anula 1 erro crítico), remove desvantagem em Furtividade e imunidade à corrosão.',
    usos: 'Armaduras pesadas silenciosas, armas elásticas duráveis',
    descricao: 'Metal prateado de baixa densidade e incrível resistência à tração e a ácidos agressivos.'
  },
  {
    id: 'tungsten',
    nome: 'Tungstênio',
    nomeEn: 'Tungsten',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 50,
    custoPo: 50,
    unitEffort: 22,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral Denso',
    virtudesArmas: {
      inatas: ['Impacto Cinético: Em Acerto Crítico, a força do impacto abala a estrutura do alvo, impondo -1 de penalidade na sua CA.']
    },
    virtudesArmaduras: {
      inatas: ['Densidade Impenetrável: Qualquer dado de dano físico (concussão, perfuração ou corte) que resulte em 1 contra o usuário é ignorado e causa 0 de dano.']
    },
    virtudesFoco: {
      inatas: ['Impacto Cinético: Em Acerto Crítico com magia, impõe -1 de penalidade na CA do alvo.']
    },
    propriedades: 'Impacto Cinético (-1 CA no alvo em crítico) e ignora rolagens de dano físico de valor 1.',
    usos: 'Maças pesadas, pontas de flecha perfurantes, couraças densas',
    descricao: 'Metal de densidade esmagadora e ponto de fusão altíssimo, quase indestrutível sob pressão comum.'
  },
  {
    id: 'chrome_vanadium_damascus',
    nome: 'Aço Damasco Cromo-Vanádio',
    nomeEn: 'Chrome-Vanadium Damascus Steel',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 80,
    custoPo: 80,
    unitEffort: 25,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga Especial (96% Damasco / 2% Cromo / 2% Vanádio)',
    virtudesArmas: {
      inatas: ['Debilitação Estrutural: Em Acerto Crítico, a margem de acerto crítico de todos os ataques contra aquele alvo é reduzida em 1 (ex: de 20 para 19-20) até o final do seu próximo turno.']
    },
    virtudesArmaduras: {
      inatas: ['Dureza Refletiva: Concede +1 de bônus na CA e reduz o dano sofrido de ataques físicos à distância em -1.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Debilitação Estrutural (amplia margem de crítico contra o alvo em 1) e Dureza Refletiva (+1 CA e -1 dano de projéteis).',
    usos: 'Armas perfurantes e cortantes de alta precisão, armaduras anti-disparo',
    descricao: 'Liga de alto desempenho espelhada e azulada, famosa por reter o fio afiado mesmo após impactos violentos.'
  },
  {
    id: 'platinum',
    nome: 'Platina Pura',
    nomeEn: 'Platinum',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 500,
    custoPo: 500,
    unitEffort: 25,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Mineral Nobre Imperial',
    virtudesArmas: {
      inatas: ['Pureza Inalterável: Ataques feitos com armas de platina são considerados mágicos para superar resistências e imunidades.']
    },
    virtudesArmaduras: {
      inatas: ['Absorção Absoluta: Qualquer dado de dano (físico ou mágico) que resulte em 1 contra o usuário causa 0 de dano.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Arma considerada mágica de forma inata; armadura anula qualquer rolagem de dano 1.',
    usos: 'Armas de paladinos, armaduras sagradas, insígnias de autoridade',
    descricao: 'Metal nobre branco-acinzentado, denso e imune a desgastes, com fortes ligações divinas.'
  },

  // --- TIER 3: RARE (14 Metais) ---
  {
    id: 'star_metal',
    nome: 'Metal Estelar (Meteorito)',
    nomeEn: 'Star Metal',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 26,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Extraterrestre',
    virtudesArmas: { inatas: ['Receptáculo Cósmico: Requer apenas metade do trabalho arcano para receber encantamentos mágicos adicionais.'] },
    virtudesArmaduras: { inatas: ['Receptáculo Cósmico: Requer apenas metade do trabalho arcano para receber encantamentos mágicos adicionais.'] },
    virtudesFoco: { inatas: ['Receptáculo Cósmico: Requer metade do trabalho arcano para receber encantamentos.'] },
    propriedades: 'Receptáculo Cósmico: Reduz pela metade o trabalho de encantamento mágico.',
    usos: 'Itens base para rituais de encantamento avançado',
    descricao: 'Recuperado de meteoritos caídos do firmamento. Prata quase branca com pontos brilhantes como estrelas.'
  },
  {
    id: 'magic_steel',
    nome: 'Aço Mágico',
    nomeEn: 'Magic Steel',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 300,
    custoPo: 300,
    unitEffort: 50,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga Arcana Fundida',
    virtudesArmas: { arcanas: ['Memória do Artesão: Ao forjar, o criador pode infundir um Truque que conhece. O portador sintonizado pode lançar esse truque à vontade.'] },
    virtudesArmaduras: { arcanas: ['Memória do Artesão: O portador sintonizado pode lançar o truque infundido na forja à vontade.'] },
    virtudesFoco: { arcanas: ['Memória do Artesão: Concede 1 truque adicional permanente à escolha do criador.'] },
    propriedades: 'Memória do Artesão (Arcana): Grava um truque conhecido pelo criador para uso à vontade pelo portador sintonizado.',
    usos: 'Armas e armaduras híbridas para conjuradores marciais',
    descricao: 'Liga azul-celeste profunda que pulsa com luz rítmica interior, absorvendo magias durante o estado líquido.'
  },
  {
    id: 'mithral',
    nome: 'Mitral',
    nomeEn: 'Mithral',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 45,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Veios Subterrâneos Nobres',
    virtudesArmas: {
      inatas: ['Propriedade Cinética: Armas Pesadas perdem a propriedade Pesada. Armas Leves ganham Arremesso (20/60) ou Acuidade. Qualquer outra arma ganha a propriedade Leve.']
    },
    virtudesArmaduras: {
      inatas: ['Ergonomia Superior: Remove requisitos de Força. Armaduras sem requisito de Força contam 1 categoria mais leve (Pesada->Média->Leve) para proficiência. Sem desvantagem em Furtividade ou Natação. Imunidade à degradação por corrosão.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Propriedade Cinética (Armas perdem Pesada/ganham Leve ou Acuidade) e Ergonomia Superior (Armaduras sem requisito de FOR, sem desvantagem em Furtividade).',
    usos: 'Armaduras leves de placas, espadas ágeis, escudos aerodinâmicos',
    descricao: 'Metal raro conhecido como "Verdadeira Prata", incrivelmente leve e mais resistente que o melhor aço.'
  },
  {
    id: 'adamantine',
    nome: 'Adamantite',
    nomeEn: 'Adamantine',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 50,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Veios Profundos / Magmáticos',
    virtudesArmas: {
      inatas: ['Impacto Destrutivo: Ao desferir um Acerto Crítico com uma arma sem a propriedade Leve, o multiplicador de dano crítico torna-se x3 (em vez de x2).']
    },
    virtudesArmaduras: {
      inatas: ['Fortificação Inabalável: Qualquer acerto crítico desferido contra o usuário torna-se um acerto normal.']
    },
    virtudesFoco: { inatas: [] },
    propriedades: 'Impacto Destrutivo (Crítico com armas médias/pesadas causa x3 de dano) e Fortificação Inabalável (imunidade a acertos críticos).',
    usos: 'Armas de impacto massivo, armaduras pesadas impenetráveis',
    descricao: 'O metal mais duro da existência, de brilho azul-escuro fosco. Quase impossível de ser riscado.'
  },
  {
    id: 'darksteel',
    nome: 'Aço Negro (Darksteel)',
    nomeEn: 'Darksteel',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 39,
    incompatibilidades: 'Aço Cromático (Chromatic Steel)',
    categoria: 'metal',
    origem: 'Planos Inferiores / Sombrios',
    virtudesArmas: {
      inatas: ['Lâmina do Esquecimento: O dano físico da arma é inteiramente convertido em Dano Necrótico.', 'Maldição (Vínculo Sombrio): O usuário não pode desequipar voluntariamente nem arremessar a arma. Se desarmado à força, salvaguarda de SAB CD 13 ou entra em fúria cega atacando quem segurar o item.']
    },
    virtudesArmaduras: {
      ressonantes: ['Manto da Não-Vida: Concede Resistência a Dano Necrótico.']
    },
    virtudesFoco: {
      arcanas: ['Ressonância Mórbida: O dano de magias da escola de Necromancia aumenta em metade do Bônus de Proficiência (arredondado para cima).']
    },
    propriedades: 'Dano convertido para Necrótico, Resistência a Necrótico em armaduras e bônus em magias de Necromancia.',
    usos: 'Armas de cavaleiros da morte, armaduras profanas',
    descricao: 'Metal negro que parece absorver a luz ao seu redor. Gelado ao toque, sussurros ecoam de suas lâminas.'
  },
  {
    id: 'chromatic_steel',
    nome: 'Aço Cromático',
    nomeEn: 'Chromatic Steel',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 300,
    custoPo: 300,
    unitEffort: 40,
    incompatibilidades: 'Aço Negro (Darksteel)',
    categoria: 'metal',
    origem: 'Fusão Elemental Primitiva',
    virtudesArmas: {
      inatas: ['Infusão Elemental: O dano físico da arma é convertido em um elemento aleatório (Ácido, Frio, Fogo, Força, Relâmpago, Veneno, Psíquico, Radiante ou Trovão) rolado em d100.']
    },
    virtudesArmaduras: {
      ressonantes: ['Égide Elemental: O usuário recebe Resistência a um tipo de dano elemental definido aleatoriamente durante a forja.']
    },
    virtudesFoco: {
      arcanas: ['Amplificação Sintonizada: Magias do elemento associado ao item recebem bônus no dano igual a metade do Bônus de Proficiência (arredondado para cima).']
    },
    propriedades: 'Infusão Elemental aleatória em armas, Resistência elemental em armaduras e amplificação mágica de dano.',
    usos: 'Armas de lâmina prismática, armaduras com égide de elementos',
    descricao: 'Aço fascinante com brilho iridescente oscilante entre as cores do arco-íris, imbuído de instabilidade planar.'
  },
  {
    id: 'infernal_steel',
    nome: 'Aço Infernal',
    nomeEn: 'Infernal Steel',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 250,
    custoPo: 250,
    unitEffort: 38,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Planos Inferiores (Baator / Abismo)',
    virtudesArmas: {
      ressonantes: ['Ferida Maligna: Dano causado por esta arma não pode ser recuperado por nenhum meio até o alvo completar um Descanso Longo. Criaturas estabilizadas a 0 PV não podem ser acordadas até o fim do descanso.']
    },
    virtudesArmaduras: {
      inatas: ['Couraça da Tortura: Redução de Dano de -1 contra todos os ataques físicos de concussão, corte e perfuração.']
    },
    virtudesFoco: {
      arcanas: ['Vínculo Transplanar: Se o portador morrer e sua alma viajar para outro plano, o item é transportado automaticamente para junto dela.']
    },
    propriedades: 'Ferida Maligna (inibe cura até descanso longo), Redução de dano -1 e Vínculo Transplanar da alma.',
    usos: 'Armaduras carniceiras, espadas amaldiçoadas',
    descricao: 'Metal avermelhado escuro, quente ao toque e exalando enxofre. Absorve o sangue derramado sobre suas faces.'
  },
  {
    id: 'harmonic_copper',
    nome: 'Cobre Harmônico',
    nomeEn: 'Harmonic Copper',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 31,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Acústica Planar',
    virtudesArmas: {
      inatas: ['Pura Estabilidade: Em vez de rolar dados de dano, a arma sempre causa seu dano médio fixo (metade do dado + 0,5).']
    },
    virtudesArmaduras: {
      inatas: ['Sincronia Defensiva: A ressonância do metal ajusta-se aos movimentos do usuário para dissipar impactos. Concede +1 na CA.']
    },
    virtudesFoco: {
      inatas: ['Pura Estabilidade: O dano de magias com dados fixos pode causar o dano médio direto.']
    },
    propriedades: 'Pura Estabilidade (dano médio fixo sem variância), +1 na CA em armaduras e Perfeição Mecânica em engrenagens (AC 20 e resistência a dano).',
    usos: 'Relógios mecânicos perfeitos, armas de consistência cirúrgica, couraças harmônicas',
    descricao: 'Metal rosado vibrante que emite zumbido suave constante. Não oxida para verde e cancela ruídos caóticos.'
  },
  {
    id: 'cold_iron',
    nome: 'Ferro Frio',
    nomeEn: 'Cold Iron',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 30,
    incompatibilidades: 'Ouro Sagrado, Aço Dracônico, Prata Aberrante, Bronze Elemental, Liga Abjeta',
    categoria: 'metal',
    origem: 'Mineral Antinatural',
    virtudesArmas: {
      ressonantes: ['Flagelo da Natureza: Causa +1d6 de dano extra contra Fadas, Feras e Plantas. O dano reduz o PV máximo do alvo até descanso longo.']
    },
    virtudesArmaduras: {
      arcanas: ['Aura Repulsiva: Fadas, Feras e Plantas têm Desvantagem em todas as jogadas de ataque contra o usuário.']
    },
    virtudesFoco: {
      inatas: ['Rejeição Biológica: Qualquer Fada, Fera ou Planta em contato físico com o item por mais de 1 minuto sofre a condição Envenenado.']
    },
    propriedades: 'Flagelo da Natureza (+1d6 e redução de PV max contra Fadas/Feras/Plantas) e Aura Repulsiva defensiva.',
    usos: 'Armamentos de caçadores de fadas, correntes antimágicas naturais',
    descricao: 'Forjado exclusivamente a martelamento a frio sem nunca ser exposto ao fogo. Veneno natural contra entidades silvestres.'
  },
  {
    id: 'holy_gold',
    nome: 'Ouro Sagrado',
    nomeEn: 'Holy Gold',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 30,
    incompatibilidades: 'Ferro Frio, Aço Dracônico, Prata Aberrante, Bronze Elemental, Liga Abjeta',
    categoria: 'metal',
    origem: 'Consagração Divina',
    virtudesArmas: {
      ressonantes: ['Julgamento Planar: Causa +1d6 de dano extra contra Ínferos e Celestiais, reduzindo o PV máximo do alvo até descanso longo.']
    },
    virtudesArmaduras: {
      arcanas: ['Radiância Protetora: Ínferos e Celestiais têm Desvantagem em jogadas de ataque contra o usuário.']
    },
    virtudesFoco: {
      inatas: ['Rejeição Sagrada: Ínferos e Celestiais em contato físico direto por mais de 1 minuto sofrem a condição Envenenado.']
    },
    propriedades: 'Julgamento Planar (+1d6 contra Ínferos/Celestiais) e Radiância Protetora (desvantagem em ataques recebidos).',
    usos: 'Armas de inquisidores e paladinos da ordem pura',
    descricao: 'Ouro de pureza transcendental resfriado em água benta e forjado com preces ininterruptas. Imune a sujeira e manchas.'
  },
  {
    id: 'draconic_steel',
    nome: 'Aço Dracônico',
    nomeEn: 'Draconic Steel',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 30,
    incompatibilidades: 'Ferro Frio, Ouro Sagrado, Prata Aberrante, Bronze Elemental, Liga Abjeta',
    categoria: 'metal',
    origem: 'Infusão de Sangue de Dragão',
    virtudesArmas: {
      ressonantes: ['Flagelo dos Céus: Causa +1d6 de dano extra contra Dragões e reduz seu PV máximo, impedindo regeneração dracônica.']
    },
    virtudesArmaduras: {
      arcanas: ['Presença Dominante: Dragões têm Desvantagem em todas as jogadas de ataque contra quem usar esta armadura.']
    },
    virtudesFoco: {
      inatas: ['Aversão Dracônica: Dragões em contato direto por mais de 1 minuto sofrem a condição Envenenado.']
    },
    propriedades: 'Flagelo dos Céus (+1d6 contra Dragões) e Presença Dominante que confunde o instinto de répteis alados.',
    usos: 'Equipamento de dragoon e matadores de dragão',
    descricao: 'Liga metálica temperada em sangue de dragão ou forjada em ninhos incandescentes. Padrão de escamas sobrepostas.'
  },
  {
    id: 'aberrant_silver',
    nome: 'Prata Aberrante',
    nomeEn: 'Aberrant Silver',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 30,
    incompatibilidades: 'Ferro Frio, Ouro Sagrado, Aço Dracônico, Bronze Elemental, Liga Abjeta',
    categoria: 'metal',
    origem: 'Alinhamento Astral / Far Realm',
    virtudesArmas: {
      ressonantes: ['Âncora de Realidade: Causa +1d6 de dano extra contra Aberrações, Gigantes e Monstruosidades, reduzindo o PV máximo do alvo.']
    },
    virtudesArmaduras: {
      arcanas: ['Distorção Defensiva: Aberrações, Gigantes e Monstruosidades têm Desvantagem em ataques contra o usuário.']
    },
    virtudesFoco: {
      inatas: ['Rejeição Transdimensional: Aberrações, Gigantes ou Monstruosidades em contato com o item por mais de 1 minuto sofrem Envenenado.']
    },
    propriedades: 'Âncora de Realidade (+1d6 contra Aberrações/Gigantes/Monstruosidades) e Distorção Defensiva.',
    usos: 'Armas contra entidades de além-túmulo e rifts dimensionais',
    descricao: 'Variante de prata com reflexos oleosos que parece sugar a luminosidade ao redor. Distorce o espaço adjacente.'
  },
  {
    id: 'elemental_bronze',
    nome: 'Bronze Elemental',
    nomeEn: 'Elemental Bronze',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 150,
    custoPo: 150,
    unitEffort: 30,
    incompatibilidades: 'Ferro Frio, Ouro Sagrado, Aço Dracônico, Prata Aberrante, Liga Abjeta',
    categoria: 'metal',
    origem: 'Gemas Elementais Maceradas',
    virtudesArmas: {
      ressonantes: ['Desestabilização de Forma: Causa +1d6 de dano extra contra Elementais, Lodos e Constructos, reduzindo o PV máximo.']
    },
    virtudesArmaduras: {
      arcanas: ['Interferência Cinética: Elementais, Lodos e Constructos têm Desvantagem em ataques contra quem usar a armadura.']
    },
    virtudesFoco: {
      inatas: ['Rejeição Elemental: Lodos e Elementais sofrem Envenenado ao toque; Constructos devem passar em salvaguarda de CON CD 13 ou ficam incapacitados.']
    },
    propriedades: 'Desestabilização de Forma (+1d6 contra Elementais/Lodos/Constructos) e Sobrecarga de Comandos.',
    usos: 'Armas de demolição autômata, escudos contra elementais',
    descricao: 'Bronze âmbar profundo saturado com pó de gemas elementais. Emite faíscas estáticas espontâneas.'
  },
  {
    id: 'loathsome_alloy',
    nome: 'Liga Abjeta',
    nomeEn: 'Loathsome Alloy',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 300,
    custoPo: 300,
    unitEffort: 50,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Liga Amálgama dos 5 Metais de Oposição (20% cada)',
    virtudesArmas: {
      arcanas: ['Flagelo da Civilização: Causa +1d6 de dano extra contra Humanoides e reduz o PV máximo do alvo.', 'Maldição Natural (Corrosão Vital): Humanoides sintonizados sofrem Desvantagem em Salvaguardas, Ataques e -1 em todos os atributos.']
    },
    virtudesArmaduras: {
      arcanas: ['Presença Abjeta: Humanoides têm Desvantagem em ataques contra o usuário. A armadura impõe -1 na CA e a Maldição Natural de Corrosão Vital.']
    },
    virtudesFoco: {
      inatas: ['Rejeição Sistêmica: Qualquer Humanoide em contato físico por mais de 1 minuto sofre a condição Envenenado.']
    },
    propriedades: 'Patógeno sólido artificial contra humanoides (+1d6 dano e redução de PV max), mas severamente amaldiçoada.',
    usos: 'Armas de guerra biológica e tortura de tiranos',
    descricao: 'Metal de coloração verde lodosa com odor de carne em decomposição e suor frio. Oily ao toque.'
  },

  // --- TIER 4: EXOTIC (12 Metais) ---
  {
    id: 'black_ice',
    nome: 'Gelo Negro',
    nomeEn: 'Black Ice',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Bronze Ígneo (Ignan Bronze)',
    categoria: 'metal',
    origem: 'Fusão Criogênica Quântica',
    virtudesArmas: { ressonantes: ['Punho do Inverno: O golpe congela sangue e tecidos, causando +1d8 de dano de Frio adicional.'] },
    virtudesArmaduras: { arcanas: ['Manto do Gelo Eterno: Concede Imunidade a Dano de Fogo, mas impõe -1 de penalidade na CA pela fragilidade vítrea.'] },
    virtudesFoco: { ressonantes: ['Amplificação Criogênica: Adiciona +1d8 ao dano de frio causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Punho do Inverno (+1d8 frio), Imunidade a Fogo (-1 CA) e Zero Absoluto (dano de frio permanente por toque).',
    usos: 'Lâminas congelantes glaciais, armaduras com manto de inverno',
    descricao: 'Material paradoxal que une dureza de cristal com maleabilidade de aço. O ar condensa em névoa ao seu redor.'
  },
  {
    id: 'ignan_bronze',
    nome: 'Bronze Ígneo',
    nomeEn: 'Ignan Bronze',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Gelo Negro (Black Ice)',
    categoria: 'metal',
    origem: 'Plano Elemental do Fogo',
    virtudesArmas: { ressonantes: ['Lâmina de Magma: Cauteriza ferimentos instantaneamente, causando +1d8 de dano de Fogo adicional.'] },
    virtudesArmaduras: { arcanas: ['Coração da Forja: Concede Imunidade a Dano de Frio, mas impõe -1 de penalidade na CA pela maleabilidade térmica constante.'] },
    virtudesFoco: { ressonantes: ['Canalização Volátil: Adiciona +1d8 ao dano de fogo causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Lâmina de Magma (+1d8 fogo), Imunidade a Frio (-1 CA) e Núcleo Incandescente.',
    usos: 'Machados e espadas flamejantes, couraças vulcânicas',
    descricao: 'Metal que parece bronze derretido perpétuo, mas perfeitamente sólido e rígido. Gotas de água assobiam vapor ao toque.'
  },
  {
    id: 'swamp_iron',
    nome: 'Ferro Pantanoso',
    nomeEn: 'Swamp Iron',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Ferro Ácido (Acid Iron)',
    categoria: 'metal',
    origem: 'Pântanos Ancestrais Decrépitos',
    virtudesArmas: { ressonantes: ['Injeção de Toxina: Libera fluido parasitário nos tecidos, causando +1d8 de dano de Veneno adicional.'] },
    virtudesArmaduras: { arcanas: ['Escudo de Corrosão: Concede Imunidade a Dano de Ácido, mas impõe -1 na CA pela textura porosa.'] },
    virtudesFoco: { ressonantes: ['Foco Venéfico: Adiciona +1d8 ao dano de veneno causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Injeção de Toxina (+1d8 veneno), Imunidade a Ácido (-1 CA) e Parasitismo Metálico (drena vitalidade ao toque).',
    usos: 'Armamentos toxicológicos, defesas contra saliva ácida',
    descricao: 'Metal orgânico de cor verde-musgo escura que parece suar bile. Exala odor pungente de pântano podre.'
  },
  {
    id: 'acid_iron',
    nome: 'Ferro Ácido',
    nomeEn: 'Acid Iron',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Ferro Pantanoso (Swamp Iron)',
    categoria: 'metal',
    origem: 'Tanques de Vitríolo Ancestral',
    virtudesArmas: { ressonantes: ['Lâmina Vitriólica: Rasga armaduras com descarga corrosiva, causando +1d8 de dano de Ácido adicional.'] },
    virtudesArmaduras: { arcanas: ['Filtragem Biológica: Concede Imunidade a Dano de Veneno, mas impõe -1 na CA pelo desgaste interno constante.'] },
    virtudesFoco: { ressonantes: ['Catalisador Corrosivo: Adiciona +1d8 ao dano de ácido causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Lâmina Vitriólica (+1d8 ácido), Imunidade a Veneno (-1 CA) e Simbiose Dolorosa (micro-espinhos nos tecidos).',
    usos: 'Lâminas corrosivas, armaduras filtrantes de toxinas',
    descricao: 'Metal amarelado com superfície efervescente e microfilamentos que se ancoram na carne do portador.'
  },
  {
    id: 'capacitive_copper',
    nome: 'Cobre Capacitivo',
    nomeEn: 'Capacitive Copper',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Aço Trovejante (Thundering Steel)',
    categoria: 'metal',
    origem: 'Eletrólise de Tempestade',
    virtudesArmas: { ressonantes: ['Descarga Galvânica: O impacto libera a carga elétrica acumulada, causando +1d8 de dano de Relâmpago adicional.'] },
    virtudesArmaduras: { arcanas: ['Dissipação de Onda: A malha absorve vibrações, concedendo Imunidade a Dano de Trovão (-1 na CA por agitação molecular).'] },
    virtudesFoco: { ressonantes: ['Foco Condutivo: Adiciona +1d8 ao dano de relâmpago causado por qualquer magia lançada.'] },
    propriedades: 'Descarga Galvânica (+1d8 relâmpago), Imunidade a Trovão (-1 CA) e Sobrecarga Reativa.',
    usos: 'Armas de choque, armaduras à prova de choque sônico',
    descricao: 'Metal bronzeado com veios azul-neon que faíscam constantemente, exalando cheiro forte de ozônio.'
  },
  {
    id: 'thundering_steel',
    nome: 'Aço Trovejante',
    nomeEn: 'Thundering Steel',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Cobre Capacitivo (Capacitive Copper)',
    categoria: 'metal',
    origem: 'Cânticos Ressonantes Harmônicos',
    virtudesArmas: { ressonantes: ['Ruptura Sônica: O golpe libera estrondo destrutivo, causando +1d8 de dano de Trovão adicional.'] },
    virtudesArmaduras: { arcanas: ['Gaiola de Dissipação: A vibração constante repele eletricidade, concedendo Imunidade a Dano de Relâmpago (-1 na CA).'] },
    virtudesFoco: { ressonantes: ['Ressonância Ampliada: Adiciona +1d8 ao dano de trovão causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Ruptura Sônica (+1d8 trovão), Imunidade a Relâmpago (-1 CA) e Vibração Instável.',
    usos: 'Martelos de guerra sônicos, couraças repelentes de raios',
    descricao: 'Liga metálica cinza-fosca que parece borrada a olho nu devido à sua vibração de altíssima frequência.'
  },
  {
    id: 'spectral_silver',
    nome: 'Prata Espectral',
    nomeEn: 'Spectral Silver',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Ouro Radiante (Radiant Gold)',
    categoria: 'metal',
    origem: 'Convergência Espiritual / Ectoplasma',
    virtudesArmas: { ressonantes: ['Toque do Além: A lâmina corta a força vital do alvo, causando +1d8 de dano Necrótico adicional.'] },
    virtudesArmaduras: { arcanas: ['Véu do Oblívio: Densidade espiritual anula energias luminosas, concedendo Imunidade a Dano Radiante (-1 na CA).'] },
    virtudesFoco: { ressonantes: ['Catalisador Necrológico: Adiciona +1d8 ao dano necrótico causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Toque do Além (+1d8 necrótico), Imunidade a Radiante (-1 CA) e Aura de Atrofia de PV.',
    usos: 'Gadanhas fantasmagóricas, armaduras de espectro',
    descricao: 'Prata fosca pálida que parece absorver luz e deixa rastro de névoa acinzentada, como se presa no plano etéreo.'
  },
  {
    id: 'radiant_gold',
    nome: 'Ouro Radiante',
    nomeEn: 'Radiant Gold',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 60,
    incompatibilidades: 'Prata Espectral (Spectral Silver)',
    categoria: 'metal',
    origem: 'Cumes Solares / Chamas Sagradas',
    virtudesArmas: { ressonantes: ['Brilho Divino: Causa +1d8 de dano Radiante adicional em cada golpe.'] },
    virtudesArmaduras: { arcanas: ['Bastião Vital: A energia viva do metal expurga a morte, concedendo Imunidade a Dano Necrótico (-1 na CA).'] },
    virtudesFoco: { ressonantes: ['Prisma Solar: Adiciona +1d8 ao dano radiante causado diretamente por qualquer magia lançada.'] },
    propriedades: 'Brilho Divino (+1d8 radiante), Imunidade a Necrótico (-1 CA) e Aura Incandescente.',
    usos: 'Armas de campeões solares, armaduras aurorais',
    descricao: 'Ouro de brilho impossivelmente intenso que emite luz quente perpétua, como se abrigasse um pequeno sol.'
  },
  {
    id: 'dimensional_metal',
    nome: 'Metal Dimensional',
    nomeEn: 'Dimensional Metal',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 850,
    custoPo: 850,
    unitEffort: 65,
    incompatibilidades: 'Platina Carismática (Charismatic Platinum)',
    categoria: 'metal',
    origem: 'Vácuo Interplanar / Plano Astral',
    virtudesArmas: { arcanas: ['Corte Hiperespacial: A arma corta através de dimensões, causando +1d8 de dano de Força adicional.'] },
    virtudesArmaduras: { arcanas: ['Distorção de Campo: Redireciona fluxos puros de mana, concedendo Imunidade a Dano de Força (-1 na CA).'] },
    virtudesFoco: { arcanas: ['Lente de Vácuo: Adiciona +1d8 ao dano de Força causado por magias do usuário.'] },
    propriedades: 'Corte Hiperespacial (+1d8 força), Imunidade a Força (-1 CA), Instabilidade de Fase e Vazio de Identidade.',
    usos: 'Lâminas espaciais, proteções contra mísseis mágicos puros',
    descricao: 'Substância paradoxal que flui como mercúrio mas mantém rigidez cristalina com cores que o olho humano mal processa.'
  },
  {
    id: 'charismatic_platinum',
    nome: 'Platina Carismática',
    nomeEn: 'Charismatic Platinum',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 850,
    custoPo: 850,
    unitEffort: 65,
    incompatibilidades: 'Metal Dimensional (Dimensional Metal)',
    categoria: 'metal',
    origem: 'Isolamento Psíquico Meditativo',
    virtudesArmas: { arcanas: ['Estilhaço Mental: O impacto projeta choque psíquico na mente do alvo, causando +1d8 de dano Psíquico adicional.'] },
    virtudesArmaduras: { arcanas: ['Mente Espelhada: Reflete e dissipa ataques mentais, concedendo Imunidade a Dano Psíquico (-1 na CA).'] },
    virtudesFoco: { arcanas: ['Amplificador Ideolinguístico: Adiciona +1d8 ao dano psíquico causado por magias do usuário.'] },
    propriedades: 'Estilhaço Mental (+1d8 psíquico), Imunidade a Psíquico (-1 CA) e Esvaziamento Cognitivo.',
    usos: 'Armaduras contra ilitides, lâminas psíquicas de inquisidores da mente',
    descricao: 'Platina hipnótica e iridescente que sussurra na mente de quem a observa, absorvendo pensamentos e memórias.'
  },
  {
    id: 'crystalline_steel',
    nome: 'Aço Cristalino',
    nomeEn: 'Crystalline Steel',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 550,
    custoPo: 550,
    unitEffort: 55,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Vidro Vulcânico Fundido com Aço',
    virtudesArmas: { inatas: ['Fio de Vidro: Precisão excepcional concedendo +2 nas jogadas de ataque e dano; se rolar 1 natural, a arma se estilhaça e é destruída!'] },
    virtudesArmaduras: { inatas: ['Reflexo Perfeito: Desvia ataques com facilidade (+2 na CA); contudo, quebra e torna-se inútil se sofrer um acerto crítico!'] },
    virtudesFoco: { inatas: ['Foco Prismático: Reduz o custo em ouro de componentes materiais de magias em 10% (mínimo 1 PO).', 'Condutividade Arcaica: Requer apenas metade do tempo ou custo em ouro para ser encantado.'] },
    propriedades: 'Fio de Vidro (+2 ataque/dano, quebra em 1), Reflexo Perfeito (+2 CA, quebra em crítico) e Condutividade Arcaica.',
    usos: 'Armas de duelos cerimoniais letais, focos arcanos econômicos',
    descricao: 'Liga translúcida e prismática com a transparência do quartzo e a resistência do metal, projetando arco-íris sob a luz.'
  },
  {
    id: 'crystalline_silver',
    nome: 'Prata Cristalina',
    nomeEn: 'Crystalline Silver',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 1000,
    custoPo: 1000,
    unitEffort: 75,
    incompatibilidades: 'Nenhuma',
    categoria: 'metal',
    origem: 'Câmara de Silêncio Absoluto',
    virtudesArmas: { ressonantes: ['Foco de Precisão: A estrutura molecular alinhada reduz a margem de acerto crítico da arma em 1 (ex: de 20 para 19-20).'] },
    virtudesArmaduras: { arcanas: ['Refração de Magias: O portador sintonizado ganha Imunidade aos efeitos e dano de Truques (Cantrips) direcionados contra ele.'] },
    virtudesFoco: { arcanas: ['Economia Ressonante: Ao lançar magia de 1º círculo ou superior, role 1d10; se o resultado for maior que 5 + círculo gasto, o espaço não é consumido!'] },
    propriedades: 'Foco de Precisão (reduz margem crítica em 1), Imunidade a Truques em armaduras e Economia Ressonante de espaços de magia.',
    usos: 'Lâminas de duelistas arcanos, mantos e escudos contra magos',
    descricao: 'Variante geométrica lapidada de prata que brilha com luz branca pura. Tão clara que permite ver através com leve distorção.'
  },

  // --- TIER 5: MYTHIC (5 Metais) ---
  {
    id: 'divine_platinum',
    nome: 'Platina Divina',
    nomeEn: 'Divine Platinum',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 4000,
    custoPo: 4000,
    unitEffort: 100,
    incompatibilidades: 'Todos os outros metais Míticos',
    categoria: 'metal',
    origem: 'Forja Consecrada dos Deuses',
    virtudesArmas: { ressonantes: ['Veredito Absoluto: O golpe ignora qualquer proteção material ou espiritual; o dano não pode ser reduzido, ignorando totalmente resistências e imunidades do alvo!'] },
    virtudesArmaduras: { arcanas: ['Bastião do Éter: Concede Resistência a dano físico não-mágico (concussão, perfuração, corte) e Imunidade a 1 elemento escolhido na forja.'] },
    virtudesFoco: { arcanas: ['Soberania Elemental: Escolha um elemento na forja; magias desse elemento ignoram resistências e causam metade do dano em criaturas com imunidade.'] },
    propriedades: 'Veredito Absoluto (dano irredutível ignorando imunidades), Bastião do Éter e Soberania Elemental.',
    usos: 'Armamentos de avatares divinos e relíquias sagradas',
    descricao: 'Metal de brancura ofuscante que emite luz própria sagrada e repele qualquer sujeira ou sangue. Forjado em estado de jejum e graça.'
  },
  {
    id: 'titanic_gold',
    nome: 'Ouro Titânico',
    nomeEn: 'Titanic Gold',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 4500,
    custoPo: 4500,
    unitEffort: 100,
    incompatibilidades: 'Todos os outros metais Míticos',
    categoria: 'metal',
    origem: 'Bigorna de Rocha Primordial',
    virtudesArmas: { ressonantes: ['Fúria Primordial: Escolha 1 elemento na criação; a arma canaliza essa energia causando +1d8 de dano elemental adicional.'] },
    virtudesArmaduras: { arcanas: ['Égide dos Titãs: Escolha 2 elementos na forja; o usuário torna-se completamente Imune ao dano desses dois elementos!'] },
    virtudesFoco: { arcanas: ['Domínio Elemental: Escolha 2 elementos; ao causar dano mágico com eles, as resistências dos alvos são completamente ignoradas.'] },
    propriedades: 'Fúria Primordial (+1d8 dano elemental), Imunidade a 2 elementos em armaduras e Domínio Elemental em focos.',
    usos: 'Armaduras colossais de titãs, martelos de quebra-mundo',
    descricao: 'Metal denso e dourado com veios que brilham como magma resfriado, temperado em sangue de gigantes ancestrais.'
  },
  {
    id: 'underworld_silver',
    nome: 'Prata do Submundo',
    nomeEn: 'Underworld Silver',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 3000,
    custoPo: 3000,
    unitEffort: 100,
    incompatibilidades: 'Todos os outros metais Míticos',
    categoria: 'metal',
    origem: 'Rio das Almas (Hades / Shadowfell)',
    virtudesArmas: { ressonantes: ['Atrofia Vital: Drena a essência existencial; o dano causado reduz diretamente o PV máximo do alvo até descanso longo.'] },
    virtudesArmaduras: { arcanas: ['Proteção do Purgatório: Ao atingir 0 PV, o usuário é estabilizado e transportado para um semiplano paralelo como fantasma imune a dano, deixando uma moeda negra no local da queda.'] },
    virtudesFoco: { arcanas: ['Conjuração Macabra: Dano de magias de 1º círculo ou superior reduz diretamente o PV atual e máximo do alvo.'] },
    propriedades: 'Atrofia Vital (redução permanente de PV max), Proteção do Purgatório e Conjuração Macabra.',
    usos: 'Lâminas ceifadoras de reis mortos, armaduras espectrais purgatórias',
    descricao: 'Prata com pátina de cinzas que não reflete rostos, apenas silhuetas sombrias, forjada com sacrifício de exaustão.'
  },
  {
    id: 'immortal_copper',
    nome: 'Cobre Imortal',
    nomeEn: 'Immortal Copper',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 100,
    incompatibilidades: 'Todos os outros metais Míticos',
    categoria: 'metal',
    origem: 'Bênção da Fênix / Yggdrasil',
    virtudesArmas: { ressonantes: ['Sifão de Vitalidade: Todo dano causado pela arma na rodada é acumulado como PV temporários para o usuário (acumula com outras fontes).'] },
    virtudesArmaduras: { arcanas: ['Retribuição Orgânica: Sempre que sofrer dano a PV reais, ganha instantaneamente PV temporários iguais à metade da vida perdida!'] },
    virtudesFoco: { arcanas: ['Vínculo Hemomântico: Metade do dano causado por magias de 1º círculo ou superior é convertida em PV temporários para o conjurador.'] },
    propriedades: 'Sifão de Vitalidade (dano converte em PV temporários), Retribuição Orgânica e Vínculo Hemomântico.',
    usos: 'Armas de regeneradores eternos, couraças que preservam a vida',
    descricao: 'Metal avermelhado profundo cujos veios pulsam como batimentos cardíacos, regenerando arranhões sob a luz solar ou sangue.'
  },
  {
    id: 'weave_fragment',
    nome: 'Fragmento da Trama (Weave Fragment)',
    nomeEn: 'Weave Fragment',
    tier: 5,
    tierNome: 'Mythic',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 100,
    incompatibilidades: 'Todos os outros metais Míticos',
    categoria: 'metal',
    origem: 'Convergência Planar / Magia Selvagem',
    virtudesArmas: { ressonantes: ['Corte de Realidade: A arma desliza pelas falhas da existência, reduzindo a margem de acerto crítico em 2 (ex: de 20 para 18-20)!'] },
    virtudesArmaduras: { arcanas: ['Nulificação Seletiva: Concede Imunidade a magias de 3º círculo ou inferior (o usuário pode escolher ser afetado se for benefício).'] },
    virtudesFoco: { arcanas: ['Eficiência de Mystra: Ao lançar uma magia, role 1d10; se o resultado for maior que 1 + círculo gasto, o espaço de magia não é consumido!'] },
    propriedades: 'Corte de Realidade (margem de crítico 18-20), Nulificação Seletiva (imunidade a magias de até 3º círculo) e Eficiência de Mystra.',
    usos: 'Cajados arquimagos arcanos, mantos de ruptura de realidade, espadas do destino',
    descricao: 'Obsidiana translúcida fundida com ametista e filamentos violeta de pura luz mágica, tecida sem martelamento direto.'
  }
];
