// ============================================================
// Arcane Crafts Compendium - Apêndice 1: Produtos de Criaturas (35 Itens Oficiais)
// Páginas A1-37 a A1-62 do livro "The Artisan's Ledger"
// ============================================================

export const CRIATURAS_APENDICE1 = [
  // --- SUB-PRODUTOS BÁSICOS (A1-37 a A1-43) ---
  {
    id: 'rawhide',
    nome: 'Couro Cru (Rawhide)',
    nomeEn: 'Rawhide',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.5,
    custoPo: 0.5,
    unitEffort: 3,
    categoria: 'criatura_exotica',
    familia: 'Fera Comum',
    virtudesArmaduras: {
      inatas: ['Fragilidade Estrutural: A armadura quebra imediatamente ao sofrer um Acerto Crítico.']
    },
    virtudesRoupas: {
      inatas: ['Proteção Térmica: Proteção natural contra calor solar e ventos quentes.']
    },
    propriedades: 'Proteção rústica preliminar, suscetível a quebra em acertos críticos.',
    usos: 'Armaduras leves de couro cru, tiras rústicas, botas funcionais',
    descricao: 'Pele animal limpa e seca ao sol sem curtimento profundo com óleos ou taninos.'
  },
  {
    id: 'fur_pelt',
    nome: 'Peles & Pelagens (Fur/Pelt)',
    nomeEn: 'Fur/Pelt',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 1,
    custoPo: 1,
    unitEffort: 4,
    categoria: 'criatura_exotica',
    familia: 'Fera Peluda',
    virtudesArmaduras: {
      inatas: ['Fragilidade Estrutural: Quebra imediatamente ao sofrer um Acerto Crítico.']
    },
    virtudesRoupas: {
      inatas: [
        'Isolamento Térmico: Excelente proteção contra frio ártico natural.',
        'Presença Imponente: Se o usuário tiver Força 17+, recebe +1 de bônus em Intimidação.'
      ]
    },
    propriedades: 'Isolamento Térmico e Presença Imponente (+1 em Intimidação com FOR 17+).',
    usos: 'Capotes de inverno, mantos bárbaros de pele de lobo e urso',
    descricao: 'Couro que preserva os pelos originais de lobos, ursos ou cervos montanheses.'
  },
  {
    id: 'tanned_leather',
    nome: 'Couro Curtido (Tanned Leather)',
    nomeEn: 'Tanned Leather',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 1,
    custoPo: 1,
    unitEffort: 6,
    categoria: 'criatura_exotica',
    familia: 'Animal Civilizado',
    virtudesArmaduras: {
      inatas: [
        'Degradação Estrutural: Cada Acerto Crítico sofrido impõe -1 permanente na CA da armadura; se a CA total chegar a 10, a armadura é destruída.'
      ]
    },
    virtudesRoupas: {
      inatas: ['Material de Referência: Padrão ouro neutro para vestimentas de aventura sem penalidades.']
    },
    propriedades: 'Padrão ouro para armaduras de couro flexíveis com degradação gradual em críticos.',
    usos: 'Armadura de couro batido, gibão, cinturões, coldres',
    descricao: 'Pele tratada quimicamente com taninos e óleos que impedem a putrefação e garantem flexibilidade duradoura.'
  },
  {
    id: 'treated_leather',
    nome: 'Couro Nobre Tratado',
    nomeEn: 'Treated Leather',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 3,
    custoPo: 3,
    unitEffort: 8,
    categoria: 'criatura_exotica',
    familia: 'Animal Nobre',
    virtudesArmaduras: {
      inatas: ['Material de Referência: Padrão ouro refinado de aventuras sem penalidades.']
    },
    virtudesRoupas: {
      inatas: [
        'Versatilidade Social: Na criação, escolha: +1 em Persuasão (estilo nobre) OU +1 em Intimidação (estilo caçador experiente).',
        'Isolamento Térmico: Ceras protegem contra calor natural.'
      ]
    },
    propriedades: 'Versatilidade Social (+1 em Persuasão ou Intimidação) e impermeabilidade com brilho acetinado.',
    usos: 'Botas de montaria nobre, gibões de duelistas e mensageiros',
    descricao: 'Couro curtido com polimento manual e ceras impermeabilizantes que reluzem suavemente à luz.'
  },
  {
    id: 'bones',
    nome: 'Ossos de Criaturas',
    nomeEn: 'Bones',
    tier: 1,
    tierNome: 'Common',
    unitPrice: 0.1,
    custoPo: 0.1,
    unitEffort: 3,
    categoria: 'criatura_exotica',
    familia: 'Esqueletos',
    virtudesArmas: {
      inatas: ['Fragilidade Óssea: Cada Falha Crítica com a arma impõe penalidade permanente de -1 no dano. Quebra se o dano chegar a 0 (conserto requer Mending).']
    },
    virtudesArmaduras: {
      inatas: [
        'Ruído Estrutural: O chacoalhar contínuo das placas ósseas impõe Desvantagem em testes de Furtividade.',
        'Degradação por Impacto: Cada Acerto Crítico sofrido impõe -1 permanente na CA da armadura.'
      ]
    },
    virtudesFoco: {
      inatas: ['Instabilidade de Canalização: Em Falha Crítica lançando magia, escolha: foco quebra por sobrecarga OU sofre metade do dano da magia.']
    },
    propriedades: 'Material tribal primitivo; impõe ruído na furtividade e quebra em falhas críticas.',
    usos: 'Lanças rústicas, armaduras bárbaras de ossos, focos de xamãs',
    descricao: 'Material esbranquiçado ou amarelado cozido para remover medula e seco à sombra.'
  },
  {
    id: 'chitin',
    nome: 'Quitina de Insetoide/Crustáceo',
    nomeEn: 'Chitin',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 12,
    custoPo: 12,
    unitEffort: 18,
    categoria: 'criatura_exotica',
    familia: 'Ankheg, Aranhas Gigantes, Caranguejos',
    virtudesArmas: {
      inatas: [
        'Toxina Residual: Ataques feitos com armas de quitina causam +1d6 de dano de Veneno extra contra humanoides.',
        'Finitude Biológica: Cada Falha Crítica impõe -1 no dano; se chegar a zero quebra e não pode ser consertada nem por magia.'
      ]
    },
    virtudesArmaduras: {
      inatas: [
        'Casca Defletiva: O usuário ignora qualquer dano cortante de valor inferior a 3 (rolagens de dano 1 e 2 viram 0).',
        'Desgaste de Placas: Cada acerto crítico sofrido causa -1 na CA da armadura (irreparável).'
      ]
    },
    propriedades: 'Toxina Residual (+1d6 veneno contra humanoides) e Casca Defletiva (anula dano cortante de valores 1 e 2).',
    usos: 'Armaduras segmentadas leves e espadas serrilhadas',
    descricao: 'Estrutura externa calcificada surpreendentemente leve com farpas naturais e bordas serrilhadas.'
  },
  {
    id: 'ivory',
    nome: 'Marfim Nobre',
    nomeEn: 'Ivory',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 75,
    custoPo: 75,
    unitEffort: 25,
    categoria: 'criatura_exotica',
    familia: 'Elefantes, Mamutes, Feras Colossais',
    virtudesArmas: {
      inatas: ['Precisão de Estocada: Se o usuário tiver Destreza 17+, recebe +2 de bônus no dano com armas perfurantes ou cortantes.']
    },
    virtudesArmaduras: {
      inatas: ['Fluidez Silenciosa: Armaduras feitas de marfim (exceto leves) não impõem desvantagem em Furtividade ou Atletismo (Natação).']
    },
    virtudesFoco: {
      arcanas: ['Ressonância de Escola: Escolha uma escola de magia na criação; o foco concede +1 na CD de salvaguarda dessa escola.']
    },
    propriedades: 'Precisão de Estocada (+2 no dano com DES 17+), Fluidez Silenciosa em armaduras médias/pesadas e +1 na CD de magia.',
    usos: 'Punhais cerimoniais, armaduras de placas laminadas silenciosas, varinhas esculpidas',
    descricao: 'Material nobre e denso extraído de presas de feras colossais. Brilho leitoso que permite entalhes riquíssimos.'
  },
  {
    id: 'tusks_teeth',
    nome: 'Presas & Dentes Predatórios',
    nomeEn: 'Tusks/Teeth',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 11,
    custoPo: 11,
    unitEffort: 21,
    categoria: 'criatura_exotica',
    familia: 'Predadores Alfa e Feras Selvagens',
    virtudesArmas: {
      inatas: [
        'Natureza Perfurante: O dano da arma é convertido em Perfurante.',
        'Ferida Lacerante: Em Acerto Crítico, o alvo sofre 1d6 de sangramento no início de cada um dos seus turnos (salvaguarda de CON CD 13 ou cura mágica para estancar).'
      ]
    },
    virtudesArmaduras: {
      inatas: ['Retaliação Espinhosa: Criaturas que fizerem ataque desarmado ou tentarem agarrar você sofrem 1d4 de dano perfurante.']
    },
    virtudesFoco: {
      arcanas: ['Ressonância Mórbida: Concede +1 de bônus em ataques mágicos de magias da escola de Necromancia.']
    },
    propriedades: 'Ferida Lacerante (sangramento 1d6/turno em crítico) e Retaliação Espinhosa (1d4 perfurante ao ser agarrado).',
    usos: 'Lanças dentadas, adagas pontiagudas, escudos de combate com espigões',
    descricao: 'Dentes e presas conoidais pontiagudas com ranhuras naturais que canalizam fluidos e sangue.'
  },
  {
    id: 'horns',
    nome: 'Chifres & Galhadas',
    nomeEn: 'Horns',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 14,
    custoPo: 14,
    unitEffort: 14,
    categoria: 'criatura_exotica',
    familia: 'Touros Gigantes, Cervos Nobres, Rinocerontes',
    virtudesArmas: {
      inatas: [
        'Propriedades de Combate por Tipo de Arma: Em Armas Pesadas (Carga Brutal: +1d8 de perfuração e empurrão ao mover 6m); em Armas com Alcance (Sentinela Natural: Ataque de Oportunidade quando inimigo entra no alcance); em Armas Leves (Agilidade Orgânica: Ataque com ação bônus se mão livre); em Armas com Acuidade (Foco do Caçador: +1d6 com vantagem).'
      ]
    },
    virtudesArmaduras: {
      inatas: ['Defesa Espinhosa: Inimigos que tentarem ataques desarmados ou agarro sofrem 1d4 de dano perfurante.']
    },
    propriedades: 'Habilidades de combate exclusivas conforme o tipo de arma (Carga Brutal, Sentinela, etc.).',
    usos: 'Lanças de carga, maças cornudas, elmos e ombreiras farpadas',
    descricao: 'Material denso e estriado que pode ser curvado a quente sem partir, mantendo pontas duríssimas.'
  },
  {
    id: 'claws',
    nome: 'Garras Predatórias',
    nomeEn: 'Claws',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 13,
    custoPo: 13,
    unitEffort: 17,
    categoria: 'criatura_exotica',
    familia: 'Felinos Gigantes, Hárpias, Lobos Terríveis',
    virtudesArmas: {
      inatas: ['Agilidade Predatória: Armas feitas deste material ganham a propriedade Acuidade (se já tiverem, ganham +1 em jogadas de ataque).']
    },
    virtudesFoco: {
      arcanas: ['Ataque com Garras: Sempre que usar uma ação para lançar um Truque, pode desferir um ataque de garra como Ação Bônus (1d4 + mod. conjuração de dano cortante).']
    },
    propriedades: 'Agilidade Predatória (concede Acuidade à arma ou +1 no ataque) e Ataque de Garra com Truque.',
    usos: 'Kataras, garras de combate, adagas de arremesso, focos animalescos',
    descricao: 'Garras curvas afiadíssimas de base endurecida, conferindo visual agressivo e primal ao equipamento.'
  },
  {
    id: 'scales_plates',
    nome: 'Escamas & Placas Répteis',
    nomeEn: 'Scales/Plates',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 50,
    custoPo: 50,
    unitEffort: 25,
    categoria: 'criatura_exotica',
    familia: 'Crocodilos Gigantes, Wyverns, Basiliscos',
    virtudesArmaduras: {
      inatas: [
        'Herança Elemental: A couraça retém a defesa da criatura original. Se a fera tinha Resistência ou Imunidade a um elemento (Fogo, Frio, Ácido, Relâmpago, Veneno), o usuário reduz todo o dano desse elemento em 2.'
      ]
    },
    propriedades: 'Herança Elemental: Reduz o dano elemental associado à criatura em 2 pontos permanentemente.',
    usos: 'Armaduras de escamas, escudos dragônicos',
    descricao: 'Escamas sobrepostas ou placas hexagonais rígidas com resistência natural ao desgaste do combate.'
  },
  {
    id: 'carapaces_shells',
    nome: 'Carapaças & Cascos Colossais',
    nomeEn: 'Carapaces/Shells/Exoskeletons',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 30,
    custoPo: 30,
    unitEffort: 22,
    categoria: 'criatura_exotica',
    familia: 'Crustáceos Gigantes, Tartarugas Ancestrais, Besouros',
    virtudesArmaduras: {
      inatas: [
        'Dureza Inabalável: Absorve impacto cinético. Em Armaduras Médias: Reduz dano físico sofrido em 1. Em Armaduras Pesadas: Reduz dano físico sofrido em 2 (impõe -1,5m de deslocamento pelo volume).'
      ]
    },
    propriedades: 'Dureza Inabalável: Reduz dano físico recebido em 1 (armadura média) ou 2 (armadura pesada).',
    usos: 'Grandes escudos torre, peitorais abobadados ultra-resistentes',
    descricao: 'Estruturas arqueadas calcificadas de mineralização biológica contínua, semelhantes a rocha viva.'
  },
  {
    id: 'tendons',
    nome: 'Tendões Elásticos',
    nomeEn: 'Tendons',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 12,
    custoPo: 12,
    unitEffort: 12,
    categoria: 'criatura_exotica',
    familia: 'Grandes Feras Ágeis',
    virtudesArmaduras: {
      inatas: ['Absorção Elástica: A trama de tendões sobre a armadura reduz todo dano de Concussão em 1.']
    },
    virtudesRoupas: {
      inatas: ['Impulso Cinético: Quando trançados em botas/calças, aumentam a distância de salto em +3,0 metros!']
    },
    propriedades: 'Absorção Elástica (-1 dano concussão) e Impulso Cinético (+3m no salto).',
    usos: 'Cordas de arcos de alta tração, correias de botas de salto',
    descricao: 'Feixes de fibras translúcidas e elásticas trançadas com óleo vegetal para reter tensão mecânica.'
  },
  {
    id: 'membranes',
    nome: 'Membranas Alares',
    nomeEn: 'Membranes',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 14,
    custoPo: 14,
    unitEffort: 25,
    categoria: 'criatura_exotica',
    familia: 'Morcegos Gigantes, Mantas, Manto Negro',
    virtudesRoupas: {
      inatas: [
        'Planamento Instintivo: Quando integradas em capas ou mantos, não sofre nenhum dano de queda de qualquer altura, desde que possa abrir os braços e não esteja incapacitado.'
      ]
    },
    propriedades: 'Planamento Instintivo: Anula totalmente o dano de queda de qualquer altura.',
    usos: 'Capas de planar, asas delta de emergência de explorador',
    descricao: 'Tecido fino e resistente que estica sem rasgar, costurado com tendões finos em pregas expansíveis.'
  },
  {
    id: 'feathers',
    nome: 'Penas Majestosas',
    nomeEn: 'Feathers',
    tier: 2,
    tierNome: 'Uncommon',
    unitPrice: 12,
    custoPo: 12,
    unitEffort: 24,
    categoria: 'criatura_exotica',
    familia: 'Pégaso, Grifos, Águias Gigantes, Roc',
    virtudesArmaduras: {
      inatas: ['Leveza Etérea: O peso total da armadura é reduzido pela metade, facilitando transporte por personagens ágeis.']
    },
    virtudesRoupas: {
      inatas: ['Passo Leve: O usuário não sofre penalidade de movimento em terreno difícil de fontes não-mágicas.']
    },
    propriedades: 'Leveza Etérea (reduz peso da armadura em 50%) e Passo Leve (ignora terreno difícil mundano).',
    usos: 'Mantos élficos, armaduras leves acolchoadas, plumas de elmo',
    descricao: 'Penas resistentes de criaturas voadoras com iridescência natural que repele água e sujeira.'
  },

  // --- MATERIAIS DE CRIATURAS POR FAMÍLIA (Rare, ND 9+ e Mutação 3+, p. A1-44 a A1-57) ---
  {
    id: 'aberrant_material',
    nome: 'Material Aberrante',
    nomeEn: 'Aberrant Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Bestial, Celestial, Constructo, Dracônico, Elemental, Feérico, Demoníaco, Gigante, Humanoide, Monstruoso, Gelatinoso, Fibroso, Necrótico',
    categoria: 'criatura_exotica',
    familia: 'Aberração (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Considerada mágica contra Aberrações.', 'Anátema Aberrante: Escolha 1: (+1d6 dano / +2 no acerto / margem crítica -1 / primeiro ataque atinge todas aberrações ao alcance).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: Escolha 1 contra Aberrações: (-4 dano elemental / primeiro ataque da rodada tem desvantagem / vantagem em salvaguardas / +2 na CA).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: Escolha 1 contra Aberrações: (+1d6 dano / +2 acerto mágico / +1 na CD / magia de alvo único atinge alvo secundário a 1,5m).']
    },
    virtudesEquipamento: {
      inatas: ['Herança Base: Mantém propriedades do material base.'],
      ressonantes: ['Corrupção por Contato: Aberrações em contato por >1 min fazem salvaguarda de CON (CD 8 + metade do CR) ou sofrem desvantagem em tudo por 24h.']
    },
    propriedades: 'Nexo Mágico e Anátema contra Aberrações; Corrupção por Contato biológico.',
    usos: 'Lâminas psiônicas, proteções contra mentes alienígenas',
    descricao: 'Vibra em frequência que desestabiliza os sentidos mortais com texturas que parecem se mover sozinhas.'
  },
  {
    id: 'bestial_material',
    nome: 'Material Bestial',
    nomeEn: 'Bestial Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Fera (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Feras.', 'Anátema Bestial: Escolha 1: (+1d6 dano / +2 no acerto / margem crítica -1 / varredura em todas as feras).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: Escolha 1: (Redução de 3 no dano físico / primeiro ataque tem desvantagem / vantagem em testes contra magias / +2 em testes mentais).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano a 1,5m).']
    },
    propriedades: 'Anátema Bestial e Resistência Física Fixa (-3 no dano físico em armaduras).',
    usos: 'Couraças de caçador alfa, armas primitivas de ápice',
    descricao: 'Transborda vitalidade selvagem. Pelos arrepiam sozinhos e emitem calor animal constante.'
  },
  {
    id: 'celestial_material',
    nome: 'Material Celestial',
    nomeEn: 'Celestial Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Celestial (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Celestiais.', 'Anátema Celestial: (+1d6 dano / +2 acerto / margem crítica -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque tem desvantagem / vantagem em testes / +2 em testes contra magias).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano a 1,5m).']
    },
    propriedades: 'Luz sagrada perpétua que repele impurezas e anátema celestial.',
    usos: 'Armaduras radiantes, lâminas santificadas',
    descricao: 'Emite luminescência suave mesmo na escuridão absoluta. Toque quente com autoridade esmagadora.'
  },
  {
    id: 'constructable_material',
    nome: 'Material de Constructo',
    nomeEn: 'Constructable Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Constructo (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Constructos.', 'Anátema Constructo: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem em testes / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Engrenagens e cerâmica rúnica que pulsam com lógica artificial e anátema de autômatos.',
    usos: 'Mecanismos de cerâmica rúnica, armaduras modulares',
    descricao: 'Metais refinados e cerâmicas alquímicas com zumbido elétrico suave e integridade desafiadora.'
  },
  {
    id: 'draconic_material',
    nome: 'Material Dracônico (Sub-produto)',
    nomeEn: 'Draconic Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Dragão (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Dragões.', 'Anátema Dracônico: (+1d6 dano / +2 acerto / crítico -1 / varredura em dragões).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / desvantagem no primeiro ataque / vantagem em testes / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Terror primordial dracônico, anátema contra répteis alados e redução elemental de 4.',
    usos: 'Lanças perfuradoras de dragões, peitorais com cristas de dragão',
    descricao: 'Ossos e escamas com cor metálica profunda que parecem pulsar com o calor de forja eterna.'
  },
  {
    id: 'elemental_material',
    nome: 'Material Elemental',
    nomeEn: 'Elemental Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Elemental (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Elementais.', 'Anátema Elemental: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem em testes / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Cristais energizados e brasas sólidas com anátema elemental e proteção mística.',
    usos: 'Lâminas tempestuosas, couraças de brasas puras',
    descricao: 'Manifestação física de um plano elemental que emite partículas cintilantes e calor ou frio vivo.'
  },
  {
    id: 'fey_material',
    nome: 'Material Feérico',
    nomeEn: 'Fey Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Fada (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Fadas.', 'Anátema Feérico: (+1d6 dano / +2 acerto / crítico -1 / varredura em fadas).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem em testes / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Luz prismática interna caprichosa que repele ferro frio e domina entidades silvestres.',
    usos: 'Bordões feéricos, capas de folhas vivas',
    descricao: 'Fibras e madrepérolas extraídas de arquifadas que mudam de cor e exalam cheiro de chuva de verão.'
  },
  {
    id: 'demonic_material',
    nome: 'Material Demoníaco',
    nomeEn: 'Demonic Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Ínfero (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Ínferos.', 'Anátema Demoníaco: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem em testes / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Calor sufocante e cheiro de enxofre com anátema abissal.',
    usos: 'Armaduras farpadas de sangue negro, lâminas canibais',
    descricao: 'Chifres negros e couro avermelhado que soltam pequenos filetes de fumaça escura das frestas.'
  },
  {
    id: 'gigantic_material',
    nome: 'Material Gigante',
    nomeEn: 'Gigantic Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Gigante (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Gigantes.', 'Anátema Gigante: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (Resistência Fixa: reduz dano físico em 3 / primeiro ataque com desvantagem / vantagem / +2 em salvaguardas).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Densidade monumental que reduz o dano físico sofrido em 3 pontos.',
    usos: 'Grandes clavas e montantes titanicos, peitorais colossais',
    descricao: 'Ossos maciços e couro espesso que retêm a força telúrica de gigantes dos picos isolados.'
  },
  {
    id: 'humanoid_material',
    nome: 'Material Humanoide (Relíquia de Campeão)',
    nomeEn: 'Humanoid Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 300,
    custoPo: 300,
    unitEffort: 85,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Humanoide (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Humanoides.', 'Anátema Humanoide: (+1d6 dano / +2 acerto / crítico -1 / varredura em humanoides).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (Reduz dano físico em 3 / primeiro ataque com desvantagem / vantagem / +2 em salvaguardas).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Essência da Vontade de heróis lendários gravada na matéria biológica.',
    usos: 'Armaduras de linhagem, lâminas com almas ancestrais',
    descricao: 'Ossos entalhados com runas pessoais ou cabelos trançados de campeões épicos que superaram limites mortais.'
  },
  {
    id: 'monstrous_material',
    nome: 'Material Monstruoso',
    nomeEn: 'Monstrous Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Monstruosidade (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Monstruosidades.', 'Anátema Monstruoso: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Biologia híbrida e instável com anátema monstruoso e absorção de choques.',
    usos: 'Armaduras de couraça de bulette, armas de garras de quimera',
    descricao: 'Couros de hidra e garras quiméricas com texturas irregulares que exalam ferocidade antinatural.'
  },
  {
    id: 'gelatinous_material',
    nome: 'Material Gelatinoso',
    nomeEn: 'Gelatinous Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Lodo / Ooze (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Lodos.', 'Anátema Gelatinoso: (+1d6 dano / +2 acerto / crítico -1 / varredura).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Flexibilidade de deformação que absorve impactos e anátema contra lodos vorazes.',
    usos: 'Mantos vítreos flexíveis, chicotes e lâminas gelatinosas',
    descricao: 'Membranas semi-sólidas e fluidos coagulados de cubos gelatinosos com umidade perene.'
  },
  {
    id: 'fibrous_material',
    nome: 'Material Fibroso (Planta Rara)',
    nomeEn: 'Fibrous Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Planta (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Plantas.', 'Anátema Vegetal: (+1d6 dano / +2 acerto / crítico -1 / varredura em plantas).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Madeira e trepadeiras em estado de crescimento latente com pulso de seiva vegetal.',
    usos: 'Arcos vivos com cordas vegetais, escudos com raízes ativas',
    descricao: 'Cerne hiperdenso de entes anciões com veios que lembram músculos vegetais.'
  },
  {
    id: 'necrotic_material',
    nome: 'Material Necrótico',
    nomeEn: 'Necrotic Material',
    tier: 3,
    tierNome: 'Rare',
    unitPrice: 200,
    custoPo: 200,
    unitEffort: 65,
    incompatibilidades: 'Outros materiais de criaturas',
    categoria: 'criatura_exotica',
    familia: 'Morto-Vivo (CR 9+ / Mutação 3+)',
    virtudesArmas: {
      ressonantes: ['Nexo Mágico: Supera resistências de Mortos-Vivos.', 'Anátema Necrótico: (+1d6 dano / +2 acerto / crítico -1 / varredura em mortos-vivos).']
    },
    virtudesArmaduras: {
      ressonantes: ['Vestimenta da Abstração: (-4 dano elemental / primeiro ataque com desvantagem / vantagem / +2 em testes).']
    },
    virtudesFoco: {
      ressonantes: ['Foco Transgressivo: (+1d6 dano / +2 acerto mágico / +1 CD / eco arcano).']
    },
    propriedades: 'Ectoplasma condensado e ossos enegrecidos que drenam luz ao redor e aniquilam mortos-vivos.',
    usos: 'Lâminas contra liches, mantos imunes ao apodrecimento',
    descricao: 'Extraído de liches antigos e cavaleiros da morte, emanando névoa fina acinzentada fria como túmulo.'
  },

  // --- MATERIAIS DE NÍVEL EXÓTICO A MÍTICO (A1-58 a A1-62) ---
  {
    id: 'creature_core',
    nome: 'Núcleo de Criatura (Creature Core)',
    nomeEn: 'Creature Core',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 1000,
    custoPo: 1000,
    unitEffort: 72,
    incompatibilidades: 'Núcleo Interplanar e materiais Míticos',
    categoria: 'criatura_exotica',
    familia: 'Criaturas Ápice (CR 14+ / Mutação 5+)',
    virtudesArmas: {
      ressonantes: [
        'Legado de Sangue: Concede 1 propriedade da lista de Materiais Raros do tipo da criatura.',
        'Vontade do Ápice: Escolha 1: Perfuração de Resistência não-física da criatura / Eco de Ação (invoca 1 ação da criatura 1x por descanso curto) / Transmutação de Atributo (+1 até 22 se a criatura tinha 25+) / Palavra de Sacrifício (+1d8 dano sofrido e causado).'
      ]
    },
    virtudesArmaduras: {
      ressonantes: [
        'Égide da Existência: Escolha 1: Dualidade Defensiva (2 resistências da criatura) / Percepção Total (todos os sentidos da criatura) / Vigor Absoluto (1 imunidade a condição) / Preço da Imunidade (ganha 1 imunidade da criatura ao custo de -1 CA e 2 vulnerabilidades).'
      ]
    },
    virtudesFoco: {
      ressonantes: [
        'Ressonância da Alma: Escolha 1: Grimório Vivo (mantém 2 magias da criatura preparadas) / Perfuração Arcana / Vínculo de Sangue.'
      ]
    },
    propriedades: 'Vontade do Ápice e Égide da Existência: Permite herdar ações, sentidos e imunidades de criaturas lendárias!',
    usos: 'Armamentos que canalizam a força viva de predadores ápice',
    descricao: 'Vapor cintilante ou cristal translúcido que pulsa no ritmo do coração da criatura de quem foi extraído.'
  },
  {
    id: 'interplanar_material',
    nome: 'Material Interplanar',
    nomeEn: 'Interplanar Material',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 750,
    custoPo: 750,
    unitEffort: 63,
    incompatibilidades: 'Essência de Criatura e materiais Míticos',
    categoria: 'criatura_exotica',
    familia: 'Seres Extradimensionais (CR 14+)',
    virtudesArmas: {
      ressonantes: [
        'Triplicidade Planar: Escolha 3 propriedades da lista de materiais raros do tipo da criatura (podendo acumular até 2 da mesma, ex: +4 no acerto!).',
        'Sincronia Dimensional: Ignora penalidades de movimento e desvantagens causadas pelo clima do plano de origem.'
      ]
    },
    virtudesArmaduras: {
      ressonantes: ['Triplicidade Planar (escolhe 3 propriedades da lista rara) e Sincronia Dimensional.']
    },
    virtudesFoco: {
      ressonantes: ['Triplicidade Planar e Âncora Dimensional (facilita conjuração de magias planares).']
    },
    propriedades: 'Triplicidade Planar (combina até 3 propriedades raras com bônus acumulados de até +4) e Sincronia Dimensional.',
    usos: 'Lâminas astrais, mantos de transição planar, âncoras de teletransporte',
    descricao: 'Oscila entre solidez absoluta e semi-transparência enevoada, deixando um rastro de poeira estelar ao se mover.'
  },
  {
    id: 'mythic_material',
    nome: 'Material Mítico Experimental',
    nomeEn: 'Mythic Material',
    tier: 4,
    tierNome: 'Exotic',
    unitPrice: 1500,
    custoPo: 1500,
    unitEffort: 85,
    incompatibilidades: 'Repele qualquer outro material especial; item deve ser 100% desta substância',
    categoria: 'criatura_exotica',
    familia: 'Entidades Únicas Inigualáveis',
    virtudesArmas: { ressonantes: ['Soberania Criativa: O Mestre define os poderes exclusivos do item no momento da forja (com base nos tiers Comum a Exótico).'] },
    virtudesArmaduras: { ressonantes: ['Soberania Criativa: O Mestre define as propriedades defensivas personalizadas.'] },
    virtudesFoco: { ressonantes: ['Soberania Criativa: Poder de canalização único de nível cósmico.'] },
    propriedades: 'Soberania Criativa: Combinação livre de poderes lendários customizados pelo Mestre.',
    usos: 'Itens de artefatos únicos de campanha',
    descricao: 'Substância singular em toda a existência: sangue do primeiro dragão, engrenagem de autômato primordial.'
  },
  {
    id: 'legendary_material',
    nome: 'Material Lendário (Quintessência)',
    nomeEn: 'Legendary Material',
    tier: 5,
    tierNome: 'Legendary',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 100,
    incompatibilidades: 'Material Divino',
    categoria: 'criatura_exotica',
    familia: 'Dragões Antigos, Beholders Supremos, Príncipes Elementais (CR 19+ / Mutação 7+)',
    virtudesArmas: {
      ressonantes: [
        'Legado do Monarca: Herda 1 propriedade de Essência OU 3 propriedades Raras da criatura.',
        'Arsenal Épico: Escolha 1: Golpe do Destino (gasta Reação para transformar acerto normal em Crítico 1x por combate!) / Vigor Titânico (+2 em atributo se criatura tinha 25+) / Reflexo Lendário (usa Reação para realizar 1 Ação Lendária da criatura!) / Infusão Elemental (+1d12 de dano elemental).'
      ]
    },
    virtudesArmaduras: {
      ressonantes: [
        'Bastião Absoluto: Escolha 1: Impenetrável (ganha Imunidade da criatura ou Resistência a dano físico) / Reflexo Lendário (1 Ação Lendária da criatura por rodada via Reação!) / Célere (adquire voo/natação da criatura).'
      ]
    },
    virtudesFoco: {
      ressonantes: [
        'Cetro da Primazia: Escolha 1: Maestria de Condição (+2 na CD de magias que causem condição que a fera era imune) / Vigor Titânico / Eco Elemental (+1d12 em magias).'
      ]
    },
    propriedades: 'Golpe do Destino (crítico garantido 1x por combate), Reflexo Lendário (Ações Lendárias da criatura!) e Bastião Absoluto.',
    usos: 'Artefatos maiores capazes de decidir guerras continentais',
    descricao: 'Ossos de metal estelar ou corações que continuam batendo séculos após a morte da criatura.'
  },
  {
    id: 'divine_material',
    nome: 'Material Divino (Substância dos Deuses)',
    nomeEn: 'Divine Material',
    tier: 5,
    tierNome: 'Divine',
    unitPrice: 5000,
    custoPo: 5000,
    unitEffort: 150,
    incompatibilidades: 'Qualquer Material Lendário',
    categoria: 'criatura_exotica',
    familia: 'Divindades e Avatares',
    virtudesArmas: {
      ressonantes: [
        'Onipotência Material: Golpe Garantido (ataques acertam automaticamente se o alvo tiver menos de 50% dos PV máximos!).'
      ]
    },
    virtudesArmaduras: {
      ressonantes: [
        'Casca Divina (God-Shell): Concede Resistência a TODO dano mágico!'
      ]
    },
    virtudesFoco: {
      ressonantes: [
        'Dualidade Divina: Permite ao usuário manter CONCENTRAÇÃO EM DUAS MAGIAS SIMULTANEAMENTE!'
      ]
    },
    propriedades: 'Golpe Garantido (<50% PV acerta sempre), Casca Divina (resistência a toda magia) e Dualidade Divina (concentração dupla em magias!).',
    usos: 'Armas de campeões dos deuses, relíquias sagradas de eras passadas',
    descricao: 'Fragmento de trono celestial, lâmina quebrada de uma divindade ou sangue dourado cristalizado. Dobra o espaço e tempo ao redor.'
  },
  {
    id: 'natural_armor',
    nome: 'Armadura Natural de Criatura',
    nomeEn: 'Natural Armor',
    tier: 2,
    tierNome: 'Variable (CR 0 a 19+)',
    unitPrice: 160,
    custoPo: 160,
    unitEffort: 30,
    incompatibilidades: 'Constructos não-biológicos',
    categoria: 'criatura_exotica',
    familia: 'Qualquer Criatura Biológica',
    virtudesArmaduras: {
      inatas: [
        'Regra de Armadura Natural: Se a armadura natural (AN) da fera era 12-13 (Leve); 13-16 (Leve ou Média); 15-19 (Qualquer Armadura); 20+ (Qualquer Armadura com +1 bônus na CA). A CA final é até AN - 1.',
        'Propriedades por ND: ND 4-8 concede sentido da fera e +1 na CA; ND 9-13 concede resistência elemental e +3 em perícia; ND 14-18 concede imunidade elemental (-1 CA) e função de Foco Arcano; ND 19+ concede +2 em atributo acima de 25, deslocamento da criatura ou Reação Lendária!'
      ]
    },
    propriedades: 'Converte a carcaça e defesas naturais da fera em armadura personalizada com bônus de CA, resistências e reações lendárias baseadas no ND.',
    usos: 'Armaduras orgânicas personalizadas feitas sob medida da caça',
    descricao: 'Tratamento das couraças, placas ósseas e escamas integradas diretamente da presa abatida pelo grupo.'
  }
];
