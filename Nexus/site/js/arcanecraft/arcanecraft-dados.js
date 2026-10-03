// ============================================================
// Arcane Craft - Base de Conhecimento, Regras e Catálogos
// Baseado no Livro de Regras e Apêndices 1, 2 e 3
// (The Ultimate Guide to Alchemy, Crafting & Enchanting)
// ============================================================

export * from './apendices-dados.js';

export const GRAUS_MATERIAL = {
  baixa: {
    id: 'baixa',
    nome: 'Baixa',
    nomeEn: 'Low',
    cdColeta: 10,
    modificadorCd: 2, // +2 na CD de criação (mais difícil de trabalhar)
    multiplicadorPreco: 0.5,
    cor: '#8a735a',
    bgBadge: 'rgba(138, 115, 90, 0.18)',
    bordaBadge: 'rgba(138, 115, 90, 0.45)',
    descricao: 'Material bruto, desgastado ou impuro. Mais fácil de coletar, porém impõe +2 na CD da criação.',
    impactoItem: 'Item padrão ou com acabamento rústico. Menor durabilidade em testes extremos.'
  },
  media: {
    id: 'media',
    nome: 'Média',
    nomeEn: 'Medium',
    cdColeta: 15,
    modificadorCd: 0, // CD padrão
    multiplicadorPreco: 1.0,
    cor: '#507693',
    bgBadge: 'rgba(80, 118, 147, 0.18)',
    bordaBadge: 'rgba(80, 118, 147, 0.45)',
    descricao: 'Material de qualidade comercial padrão de mercado. Não altera a CD de criação.',
    impactoItem: 'Qualidade confiável e acabamento regular de artesão.'
  },
  alta: {
    id: 'alta',
    nome: 'Alta',
    nomeEn: 'High',
    cdColeta: 20,
    modificadorCd: -2, // -2 na CD de criação (facilita o trabalho)
    multiplicadorPreco: 2.5,
    cor: '#c8a051',
    bgBadge: 'rgba(200, 160, 81, 0.18)',
    bordaBadge: 'rgba(200, 160, 81, 0.45)',
    descricao: 'Material refinado, puro e bem selecionado. Reduz a CD da criação em -2.',
    impactoItem: 'Acabamento superior de obra de mestre. Durabilidade aprimorada e estética refinada.'
  },
  suprema: {
    id: 'suprema',
    nome: 'Suprema',
    nomeEn: 'Supreme',
    cdColeta: 25,
    modificadorCd: -4, // -4 na CD de criação
    multiplicadorPreco: 5.0,
    cor: '#a855f7',
    bgBadge: 'rgba(168, 85, 247, 0.18)',
    bordaBadge: 'rgba(168, 85, 247, 0.45)',
    descricao: 'Material lendário e imaculado, de pureza incomparável. Reduz a CD da criação em -4.',
    impactoItem: 'Obra-prima perfeita. Potência máxima, beleza inigualável e valor de venda duplicado.'
  }
};

export const POSTOS_ASSOCIACAO = [
  { id: 'novato', nome: 'Novato', nomeEn: 'Novice', nivelSugerido: '1-4', desc: 'Iniciante nas artes do ofício. Conhece apenas técnicas fundamentais e receitas comuns.' },
  { id: 'aprendiz', nome: 'Aprendiz', nomeEn: 'Apprentice', nivelSugerido: '5-8', desc: 'Dominou o básico e já opera oficinas sob supervisão. Cria itens de complexidade intermediária.' },
  { id: 'oficial', nome: 'Oficial / Artífice', nomeEn: 'Journeyman', nivelSugerido: '9-12', desc: 'Artesão qualificado e autônomo. Pode assinar suas próprias obras e instruir aprendizes.' },
  { id: 'mestre', nome: 'Mestre', nomeEn: 'Master', nivelSugerido: '13-16', desc: 'Veterano consagrado. Domina criações raras e técnicas secretas da associação.' },
  { id: 'grao_mestre', nome: 'Grão-Mestre', nomeEn: 'Grandmaster', nivelSugerido: '17-20', desc: 'Lenda viva da profissão. Capaz de conceber itens lendários e transmutar o impossível.' }
];

export const ETAPAS_CRIACAO = [
  {
    numero: 1,
    titulo: 'Treinamento e Associação',
    icone: '🏛️',
    resumo: 'Definição da disciplina, ferramentas e filiação.',
    detalhes: 'O personagem deve possuir proficiência nas ferramentas específicas do ofício e estar em posto compatível na Associação (Guilda) ou atuar no Underground (mercado paralelo com riscos e sem taxas de associação).'
  },
  {
    numero: 2,
    titulo: 'Aquisição da Receita',
    icone: '📜',
    resumo: 'Fórmula, diagrama ou instruções detalhadas.',
    detalhes: 'Para fabricar qualquer item, o artesão necessita de uma receita conhecida compatível com seu posto. Receitas podem ser aprendidas na guilda, compradas no mercado negro, encontradas em masmorras ou pesquisadas.'
  },
  {
    numero: 3,
    titulo: 'Reunir Ingredientes e Graus',
    icone: '💎',
    resumo: 'Materiais com notas de qualidade (Baixa a Suprema).',
    detalhes: 'Cada receita exige ingredientes essenciais. O grau de cada ingrediente (Baixa, Média, Alta ou Suprema) altera a CD da criação (+2, 0, -2 ou -4). O menor grau de ingrediente usado determina a qualidade final do item criado.'
  },
  {
    numero: 4,
    titulo: 'Instalações e Ferramentas',
    icone: '🛠️',
    resumo: 'Espaço de trabalho adequado e equipamentos.',
    detalhes: 'A forja exige bigorna e fole; a alquimia exige laboratório e vidrarias aquecidas; o encantamento requer círculo arcano estabilizado. Sem as instalações adequadas, o trabalho é impossível ou realizado com severa desvantagem.'
  },
  {
    numero: 5,
    titulo: 'Processo e Teste de Criação',
    icone: '🎲',
    resumo: 'Rolagem contra a CD ajustada e aplicação das regras.',
    detalhes: 'O artesão gasta o tempo estipulado e realiza o teste de habilidade. Em caso de Sucesso, o item é criado e a receita garante Sucesso Automático em produções futuras. Em caso de Falha, apenas o primeiro ingrediente (ingrediente base) é perdido; os demais continuam intactos e pode-se tentar de novo após 1 dia.'
  }
];

export const DISCIPLINAS_REGRAS = {
  criacao: {
    id: 'criacao',
    nome: 'Criação de Itens (Crafting)',
    subtitulo: 'Metalurgia, Armaduras, Marcenaria, Couro e Joalheria',
    icone: '⚒️',
    cor: '#c8a051',
    visaoGeral: 'A disciplina de Criação de Itens abrange a transformação mecânica e manual de matérias-primas em equipamentos físicos, armas, armaduras, vestimentas, componentes de engenharia e joias ornamentais.',
    especializacoes: [
      { nome: 'Ferreiro (Blacksmith)', ferramentas: 'Ferramentas de Ferreiro', foco: 'Armas de metal, lâminas, armaduras de placas e malha, escudos e ferragens reforçadas.' },
      { nome: 'Coureiro (Leatherworker)', ferramentas: 'Ferramentas de Coureiro', foco: 'Armaduras de couro, gibões batidos, cintos de poções, aljavas e mochilas estruturadas.' },
      { nome: 'Marceneiro (Woodworker)', ferramentas: 'Ferramentas de Carpinteiro / Entalhador', foco: 'Arcos, bestas, escudos de madeira, hastes de lanças, cajados e carretas.' },
      { nome: 'Alfaiate (Tailor)', ferramentas: 'Ferramentas de Tecelão', foco: 'Mantos resistentes, roupas nobres, vestes de conjurador, forros e lonas impermeáveis.' },
      { nome: 'Joalheiro (Jeweler)', ferramentas: 'Ferramentas de Joalheiro', foco: 'Anéis, amuletos, camafeus, engastes de gemas e peças para focar energias mágicas.' },
      { nome: 'Engenhoqueiro (Tinkerer)', ferramentas: 'Ferramentas de Engenhoqueiro', foco: 'Mecanismos de corda, relógios, armadilhas desmontáveis, gazuas reforçadas e pistões.' }
    ],
    instalacoes: 'Forja a carvão/magma com bigorna e fole para metalurgia; bancada de corte e costura para couro e alfaiataria; torno e bancada firme para marcenaria e engenharia.',
    tempoRegra: 'Itens simples levam de 2 a 8 horas. Armaduras completas e peças de alta complexidade demandam dias ou semanas de trabalho dedicado (8 horas de ofício por dia). Assistentes qualificados adicionam +25 po de progresso por dia de trabalho conjunto.',
    falhaSucessoRegra: 'Em caso de Sucesso, todos os ingredientes são consumidos e o item é concluído com a qualidade do menor ingrediente. No Sucesso Automático (após a 1ª confecção bem-sucedida daquela receita pelo personagem), novos itens iguais não necessitam de teste a menos que se queira acelerar o tempo pela metade. Em caso de Falha, o tempo do dia é gasto e apenas o primeiro ingrediente listado é perdido; os demais materiais são salvos.'
  },
  alquimia: {
    id: 'alquimia',
    nome: 'Alquimia (Alchemy)',
    subtitulo: 'Poções, Solventes, Elixires, Óleos e Toxinas',
    icone: '⚗️',
    cor: '#2e7c6d',
    visaoGeral: 'A Alquimia lida com a destilação de essências vitais, minerais e reagentes para produzir líquidos, pós e vapores que alteram o corpo e a matéria com velocidade impressionante.',
    especializacoes: [
      { nome: 'Boticário (Apothecary)', ferramentas: 'Kit de Herbalismo / Suprimentos de Alquimia', foco: 'Poções de cura de todos os graus, tônicos de vigor, antídotos contra venenos e sais reanimadores.' },
      { nome: 'Alkahest', ferramentas: 'Suprimentos de Alquimia', foco: 'Fogo alquímico, frascos de ácido corrosivo concentrado, solventes universais e fumaça ofuscante.' },
      { nome: 'Tintorista & Preparador de Toxinas (Tincturer)', ferramentas: 'Kit de Venenos / Suprimentos de Alquimia', foco: 'Venenos por contato, ingestão ou ferimento; óleos de paralisia, soníferos e revestimentos de armas.' }
    ],
    instalacoes: 'Laboratório alquímico dotado de alambiques de vidro reforçado, retortas, almofariz com pilão, queimadores de chama controlada e recipientes herméticos.',
    tempoRegra: 'A maioria dos preparados alquímicos requer de 4 a 18 horas para destilação e decocção. Algumas poções exigem descanso de 24 horas para decantação química.',
    falhaSucessoRegra: 'Testes de Alquimia utilizam Inteligência ou Sabedoria (conforme a especialização do artesão). Na falha, a reação desestabiliza: apenas o solvente ou reagente base inicial é arruinado; os ingredientes preciosos não misturados são conservados.'
  },
  encantamento: {
    id: 'encantamento',
    nome: 'Encantamento (Enchanting)',
    subtitulo: 'Essências Mágicas, Imbuição e Itens Sobrenaturais',
    icone: '✨',
    cor: '#825a89',
    visaoGeral: 'O Encantamento é a suprema arte de tecer a Trama da magia em objetos materiais estáveis, utilizando Essências Mágicas (Arcanas, Divinas ou Primitivas) como condutores permanentes de feitiços.',
    especializacoes: [
      { nome: 'Implemancer', ferramentas: 'Ferramentas de Entalhador / Joalheiro + Arcanismo', foco: 'Varinhas arcanas, cetros de comando, cajados elementais e armas com bônus mágicos ofensivos.' },
      { nome: 'Wardwright', ferramentas: 'Ferramentas de Ferreiro / Coureiro + Arcanismo', foco: 'Armaduras mágicas de proteção, escudos antimagia, anéis de resistência e mantos defensivos.' },
      { nome: 'Eclectist', ferramentas: 'Ferramentas do Ofício correspondente + Arcanismo', foco: 'Itens maravilhosos (Bolsas Sem Fundo, Botas Aladas, Tapetes Voadores, Cordas de Escalada e amuletos diversos).' }
    ],
    instalacoes: 'Oficina arcana com Círculo de Encantamento gravado em prata ou pó de diamante, pedestal focalizador e estabilizador de Trama mágica.',
    tempoRegra: 'Itens comuns/incomuns levam de 1 a 4 dias de trabalho. Itens raros levam semanas e itens lendários podem requerer meses de rituais contínuos com conjuração diária.',
    falhaSucessoRegra: 'O encantador deve ser capaz de lançar a magia ou usar uma essência mágica que contenha a escola necessária. Falhas no teste de Arcanismo preservam o item físico base e consomem apenas a essência primária ou catalisador estabilizador.'
  }
};

// ============================================================
// APÊNDICE 1 - Harvester's Handbook (Colheita de Criaturas)
// ============================================================
export const APENDICE_COLHEITA = [
  {
    tipo: 'Fera (Beast)',
    icone: '🐺',
    pericias: ['Sobrevivência', 'Medicina'],
    tempoBase: '30 min a 2 horas',
    descricao: 'Animais naturais e feras predadoras. Fontes ricas de couro, peles, presas, tendões e gordura.',
    partes: [
      { nome: 'Couro / Pele Flexível', grauSugerido: 'baixa', cd: 10, uso: 'Armaduras leves, bolsas e capas de proteção.' },
      { nome: 'Couro Espesso e Maciço', grauSugerido: 'media', cd: 15, uso: 'Gibão batido, botas de montaria e cintos.' },
      { nome: 'Presas e Garras Predatórias', grauSugerido: 'media', cd: 14, uso: 'Adagas primitivas, pontas de flecha e empunhaduras.' },
      { nome: 'Gordura e Óleo Animal Refinado', grauSugerido: 'baixa', cd: 11, uso: 'Base de solventes alquímicos e lubrificação.' },
      { nome: 'Essência Primitiva de Fera Alfa', grauSugerido: 'alta', cd: 20, uso: 'Encantamento de vigor e poções de força de urso.' }
    ]
  },
  {
    tipo: 'Monstruosidade (Monstrosity)',
    icone: '🦂',
    pericias: ['Sobrevivência', 'Natureza'],
    tempoBase: '1 a 3 horas',
    descricao: 'Criaturas híbridas e anômalas (Grifos, Manticoras, Quimeras, Basiliscos, Ursos-Coruja).',
    partes: [
      { nome: 'Placas Quitinosas / Carapaça', grauSugerido: 'media', cd: 15, uso: 'Escudos de escamas e reforço de armaduras.' },
      { nome: 'Glândula de Veneno Puro', grauSugerido: 'alta', cd: 19, uso: 'Alquimia de toxinas corrosivas e anestésicas.' },
      { nome: 'Olho Petrificante ou Órgão Sensorial', grauSugerido: 'alta', cd: 21, uso: 'Encantamento de visão no escuro ou petrificação.' },
      { nome: 'Plumas / Asas de Monstruosidade', grauSugerido: 'media', cd: 16, uso: 'Mantos de levitação e asas de voo mágico.' },
      { nome: 'Essência de Monstruosidade Primitiva', grauSugerido: 'alta', cd: 20, uso: 'Armas viciosas e poções de transformação.' }
    ]
  },
  {
    tipo: 'Dragão (Dragon)',
    icone: '🐉',
    pericias: ['Sobrevivência', 'Arcanismo'],
    tempoBase: '3 a 8 horas',
    descricao: 'A mais cobiçada de todas as fontes de materiais. Cada parte de um dragão irradia poder arcano.',
    partes: [
      { nome: 'Escamas Dracônicas Endurecidas', grauSugerido: 'alta', cd: 20, uso: 'Cota de Escamas Dracônica (resistência elemental).' },
      { nome: 'Escamas Pristinas de Dragão Adulto', grauSugerido: 'suprema', cd: 25, uso: 'Armadura de Placas de Dragão com imunidade.' },
      { nome: 'Glândula de Sopro Elemental (Fogo/Gelo/Ácido/Raio)', grauSugerido: 'suprema', cd: 24, uso: 'Poção de Sopro de Dragão, Cajado de Chamas.' },
      { nome: 'Sangue Dracônico Concentrado', grauSugerido: 'alta', cd: 22, uso: 'Tinta mágica de pergaminhos e óleos de poder.' },
      { nome: 'Essência Arcana Dracônica Maior', grauSugerido: 'suprema', cd: 26, uso: 'Armas de Matar Dragões, Espada da Chama e Cetros.' }
    ]
  },
  {
    tipo: 'Elemental (Elemental)',
    icone: '🔥',
    pericias: ['Arcanismo', 'Natureza'],
    tempoBase: '1 hora (deve ser colhido antes da dispersão)',
    descricao: 'Manifestações vivas dos quatro planos elementais (Fogo, Água, Terra, Ar).',
    partes: [
      { nome: 'Cinzas Ardentes Eternas (Fogo)', grauSugerido: 'media', cd: 16, uso: 'Fogo Alquímico supremo e armas ardentes.' },
      { nome: 'Gotas de Água Primordial (Água)', grauSugerido: 'alta', cd: 18, uso: 'Poções de respiração aquática e antídotos.' },
      { nome: 'Núcleo de Pedra Sísmica (Terra)', grauSugerido: 'alta', cd: 19, uso: 'Armaduras de pedra, martelos de impacto.' },
      { nome: 'Sopro de Éter Volátil (Ar)', grauSugerido: 'alta', cd: 18, uso: 'Botas de velocidade e anéis de queda suave.' },
      { nome: 'Essência Elemental Pura', grauSugerido: 'alta', cd: 22, uso: 'Varinhas de relâmpago, escudos elementais.' }
    ]
  },
  {
    tipo: 'Ínfero (Fiend - Demônio/Diabo)',
    icone: '😈',
    pericias: ['Arcanismo', 'Religião'],
    tempoBase: '1 a 2 horas',
    descricao: 'Entidades dos Planos Infernais e Abismo. Exigem compostos sagrados ou sal para manuseio seguro.',
    partes: [
      { nome: 'Chifres Corrompidos e Sulfurosos', grauSugerido: 'media', cd: 16, uso: 'Cabos de adagas ímpias e cálices arcanos.' },
      { nome: 'Couro Infernal Resistente ao Fogo', grauSugerido: 'alta', cd: 20, uso: 'Armaduras leves com resistência a dano de fogo.' },
      { nome: 'Sangue de Diabo / Demônio', grauSugerido: 'alta', cd: 19, uso: 'Venenos corrosivos e óleos de perdição.' },
      { nome: 'Essência Divina Corrompida (Abissal)', grauSugerido: 'suprema', cd: 25, uso: 'Armas amaldiçoadas e itens de ilusão obscura.' }
    ]
  },
  {
    tipo: 'Celestial (Celestial)',
    icone: '🪽',
    pericias: ['Religião', 'Medicina'],
    tempoBase: '1 a 2 horas',
    descricao: 'Seres de luz e pureza do Plano Superior. A colheita deve ser respeitosa e justificada.',
    partes: [
      { nome: 'Penas Radiantes Imaculadas', grauSugerido: 'alta', cd: 20, uso: 'Mantos de proteção sagrada e setas de luz.' },
      { nome: 'Lágrimas Celestiais / Sangue Dourado', grauSugerido: 'suprema', cd: 25, uso: 'Elixir da Panaceia e Poções de Cura Suprema.' },
      { nome: 'Aura / Ectoplasma Luminescente', grauSugerido: 'alta', cd: 22, uso: 'Armas do Alvorecer e escudos solares.' },
      { nome: 'Essência Divina Radiante Sublime', grauSugerido: 'suprema', cd: 27, uso: 'Vingadora Sagrada e Amuletos de Proteção Divina.' }
    ]
  },
  {
    tipo: 'Morto-Vivo (Undead)',
    icone: '💀',
    pericias: ['Religião', 'Arcanismo'],
    tempoBase: '30 min a 1 hora',
    descricao: 'Cadáveres animados, espectros, múmias e vampiros. Fontes de energia necrótica.',
    partes: [
      { nome: 'Ossos Envelhecidos Imbuídos de Morte', grauSugerido: 'baixa', cd: 11, uso: 'Gazuas fúnebres e amuletos menores.' },
      { nome: 'Pó de Múmia Preservado', grauSugerido: 'alta', cd: 19, uso: 'Óleos de maldição e poções de necromancia.' },
      { nome: 'Ectoplasma Espectral Condensado', grauSugerido: 'media', cd: 16, uso: 'Óleo etéreo e poções de intangibilidade.' },
      { nome: 'Presas Vampíricas', grauSugerido: 'alta', cd: 21, uso: 'Armas vampíricas que drenam vida.' },
      { nome: 'Essência de Morte e Trevas', grauSugerido: 'alta', cd: 22, uso: 'Varinhas de raio do enfraquecimento e foices necróticas.' }
    ]
  },
  {
    tipo: 'Fada (Fey)',
    icone: '🧚',
    pericias: ['Natureza', 'Arcanismo'],
    tempoBase: '30 min a 1 hora',
    descricao: 'Criaturas de Faerie e do Plano Feérico. Tecidos de sonhos e natureza vibrante.',
    partes: [
      { nome: 'Pó de Fada Brilhante', grauSugerido: 'media', cd: 15, uso: 'Poções de levitação e pó de desaparecimento.' },
      { nome: 'Pétalas Crepusculares Feéricas', grauSugerido: 'alta', cd: 19, uso: 'Elixir de charme e sono encantado.' },
      { nome: 'Cabelos / Fibras de Seda Feérica', grauSugerido: 'alta', cd: 20, uso: 'Corda de escalada e mantos de camuflagem.' },
      { nome: 'Essência Primitiva Encantada', grauSugerido: 'alta', cd: 22, uso: 'Varinha de riso histérico e anéis de ilusão.' }
    ]
  },
  {
    tipo: 'Gigante (Giant)',
    icone: '🗿',
    pericias: ['Sobrevivência', 'Medicina'],
    tempoBase: '2 a 4 horas',
    descricao: 'Colossos ancestrais (Colina, Pedra, Fogo, Gelo, Nuvem, Tempestade).',
    partes: [
      { nome: 'Tendões e Músculos Titânicos', grauSugerido: 'media', cd: 16, uso: 'Cordas de arco de grande tração e esteios.' },
      { nome: 'Unhas e Ossos Espessos de Gigante', grauSugerido: 'media', cd: 15, uso: 'Clavas pesadas e martelos de guerra.' },
      { nome: 'Couro Colossal Curtido', grauSugerido: 'alta', cd: 20, uso: 'Armaduras de couro supremo e sacolas gigantes.' },
      { nome: 'Unhas / Cabelo de Gigante da Nuvem/Tempestade', grauSugerido: 'suprema', cd: 24, uso: 'Cintos de Força do Gigante da Nuvem.' },
      { nome: 'Essência de Força Titânica', grauSugerido: 'alta', cd: 22, uso: 'Poção de Força do Gigante (todos os tipos).' }
    ]
  },
  {
    tipo: 'Aberração (Aberration)',
    icone: '👁️',
    pericias: ['Arcanismo', 'Investigação'],
    tempoBase: '1 a 3 horas',
    descricao: 'Criaturas do Reino Distante (Devoradores de Mentes, Beholders, Gibbering Mouthers).',
    partes: [
      { nome: 'Lodo Psiônico de Tentáculo', grauSugerido: 'media', cd: 16, uso: 'Venenos de atordoamento mental e tinturas.' },
      { nome: 'Pedúnculo Ocular Menor', grauSugerido: 'alta', cd: 21, uso: 'Varinhas de telecinese e raios de lentidão.' },
      { nome: 'Massa Encefálica Aberrante', grauSugerido: 'suprema', cd: 25, uso: 'Elixires de telepatia e anéis de leitura mental.' },
      { nome: 'Essência Arcana Alienígena', grauSugerido: 'suprema', cd: 24, uso: 'Itens de distorção espacial e sondas psiônicas.' }
    ]
  },
  {
    tipo: 'Planta e Fungo Monstruoso',
    icone: '🌿',
    pericias: ['Natureza', 'Kit de Herbalismo'],
    tempoBase: '30 min a 1 hora',
    descricao: 'Shambling Mounds, Treants, Micônides e vinhas estranguladoras.',
    partes: [
      { nome: 'Fibras Vegetais Indestrutíveis', grauSugerido: 'baixa', cd: 11, uso: 'Cordas de alta tenacidade e arcos.' },
      { nome: 'Seiva Paralisante / Cáustica', grauSugerido: 'media', cd: 15, uso: 'Venenos de contato e colas alquímicas.' },
      { nome: 'Casca de Madeira-Ferro Ancestral', grauSugerido: 'alta', cd: 19, uso: 'Escudos de carvalho e bastões mágicos.' },
      { nome: 'Esporos Micônides Psíquicos', grauSugerido: 'alta', cd: 20, uso: 'Poções de comunicação mental e névoa sonífera.' }
    ]
  },
  {
    tipo: 'Lodo e Gosma (Ooze)',
    icone: '🧪',
    pericias: ['Natureza', 'Suprimentos de Alquimia'],
    tempoBase: '30 min',
    descricao: 'Pudins Negros, Gelatinous Cubes e Lodos Cinzentos.',
    partes: [
      { nome: 'Ácido Digestivo Concentrado', grauSugerido: 'media', cd: 15, uso: 'Frascos de ácido solvente de metal.' },
      { nome: 'Membrana Gelatinosa Estabilizada', grauSugerido: 'media', cd: 14, uso: 'Recipientes herméticos e adesivos de vedação.' },
      { nome: 'Fluido Transparente de Cubo', grauSugerido: 'alta', cd: 19, uso: 'Poções de camuflagem e óleos de deslizamento.' }
    ]
  },
  {
    tipo: 'Construto (Construct)',
    icone: '⚙️',
    pericias: ['Investigação', 'Ferramentas de Engenhoqueiro'],
    tempoBase: '1 a 2 horas',
    descricao: 'Golens, autômatos mecânicos e armaduras animadas.',
    partes: [
      { nome: 'Placas de Liga de Ferro / Bronze Reforçado', grauSugerido: 'media', cd: 14, uso: 'Reparos de armaduras e escudos pesados.' },
      { nome: 'Engrenagens e Molas de Precisão', grauSugerido: 'alta', cd: 18, uso: 'Mecanismos de armadilhas e autômatos menores.' },
      { nome: 'Núcleo de Força Golemica / Foco de Cristal', grauSugerido: 'suprema', cd: 24, uso: 'Manual dos Golens e itens de força mecânica.' }
    ]
  }
];

// ============================================================
// APÊNDICE 2 - Forager's Handbook (Coleta na Natureza / Biomas)
// ============================================================
export const APENDICE_BIOMAS = [
  {
    id: 'floresta',
    nome: 'Floresta Temperada & Bosques',
    icone: '🌲',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Rica em madeira de qualidade, fungos medicinais, raízes nutritivas e flores raras.',
    recursos: [
      { nome: 'Raiz-Sangue (Bloodroot)', tipo: 'Planta', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Erva adstringente usada para estancar sangramentos em pomadas básicas.' },
      { nome: 'Casca de Carvalho de Ferro', tipo: 'Madeira', grau: 'media', cd: 14, tempo: '2h', desc: 'Casca espessa que serve de base para poções de pele de árvore e cabos resistentes.' },
      { nome: 'Cogumelos Fluorescentes da Penumbra', tipo: 'Fungo', grau: 'media', cd: 15, tempo: '2h', desc: 'Emitem luz azulada e contêm alcaloide para óleos de visão no escuro.' },
      { nome: 'Flor-da-Lua Feérica', tipo: 'Flor Rara', grau: 'alta', cd: 20, tempo: '3h', desc: 'Desabrocha somente sob o luar; ingrediente essencial de elixires de invisibilidade.' },
      { nome: 'Seiva de Âmbar Dourado Ancestral', tipo: 'Resina', grau: 'suprema', cd: 25, tempo: '4h', desc: 'Resina petrificada milenar usada como catalisador de itens de cura suprema.' }
    ]
  },
  {
    id: 'montanha',
    nome: 'Montanhas & Cordilheiras',
    icone: '⛰️',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Região de penhascos íngremes, rica em minérios metálicos puros, gemas brutas e líquens resistentes.',
    recursos: [
      { nome: 'Líquen Cinzento de Rocha', tipo: 'Líquen', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Líquen alcalino que neutraliza azedumes em tinturas menores.' },
      { nome: 'Veio de Minério de Ferro Nobre', tipo: 'Mineral', grau: 'media', cd: 14, tempo: '3h', desc: 'Minério com baixíssimo teor de enxofre, forja lâminas afiadas.' },
      { nome: 'Geodo de Cristais de Quartzo Claro', tipo: 'Gema', grau: 'media', cd: 16, tempo: '2h', desc: 'Foco puro para canalização de raios arcanos e prismas de luz.' },
      { nome: 'Veio de Mitral em Bruto', tipo: 'Metal Nobre', grau: 'alta', cd: 21, tempo: '4h', desc: 'Metal prateado levíssimo que permite forjar armaduras sem restrição de furtividade.' },
      { nome: 'Coração de Adamantite Pura', tipo: 'Metal Supremo', grau: 'suprema', cd: 26, tempo: '5h', desc: 'O metal mais duro do mundo conhecido; anula acertos críticos em armaduras.' }
    ]
  },
  {
    id: 'pantano',
    nome: 'Pântanos & Brejos Nebulosos',
    icone: '🌿',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Ambiente lodoso e perigoso, berço das mais letais toxinas, fungos parasitários e águas estabilizadas.',
    recursos: [
      { nome: 'Musgo de Lama Pungente', tipo: 'Musgo', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Usado como emplastro emergencial e desodorizador de trilha.' },
      { nome: 'Raiz-de-Verme Paralisante', tipo: 'Raiz', grau: 'media', cd: 15, tempo: '2h', desc: 'Gera óleo anestesiante que paralisa membros de animais feridos.' },
      { nome: 'Cogumelo Chapéu-da-Morte Negro', tipo: 'Fungo Tóxico', grau: 'alta', cd: 19, tempo: '2h', desc: 'A mais pura matéria-prima para veneno de contato letal.' },
      { nome: 'Lótus Negra do Miasma', tipo: 'Flor Venenosa', grau: 'alta', cd: 21, tempo: '3h', desc: 'Pétalas que liberam fumaça alucinógena ao entrar em contato com álcool alquímico.' },
      { nome: 'Gota de Água Primitiva do Brejo Ancião', tipo: 'Fluido Sagrado', grau: 'suprema', cd: 25, tempo: '4h', desc: 'Água que nunca evapora; base indispensável para elixires de longevidade.' }
    ]
  },
  {
    id: 'deserto',
    nome: 'Deserto & Terras Áridas',
    icone: '🏜️',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Dunas escaldantes e cânions secos, onde se colhem resinas balsâmicas, areias de fulgurita e venenos secos.',
    recursos: [
      { nome: 'Casca de Cacto de Polpa D’água', tipo: 'Planta', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Retém umidade para soluções hidratantes e pomadas de queimadura.' },
      { nome: 'Resina Aromática de Mirra do Deserto', tipo: 'Resina', grau: 'media', cd: 14, tempo: '2h', desc: 'Emprega aroma de conservação usado na mumificação e óleos aromáticos.' },
      { nome: 'Veneno Seco de Escorpião das Areias', tipo: 'Toxina', grau: 'alta', cd: 19, tempo: '2h', desc: 'Pó que queima as veias de quem recebe um talho com a arma banhada.' },
      { nome: 'Areia de Sílica Fundida (Fulgurita de Raio)', tipo: 'Mineral', grau: 'alta', cd: 21, tempo: '3h', desc: 'Tubo de vidro puro formado por descarga de raio; base para varinhas de eletricidade.' },
      { nome: 'Flor de Pedra do Oásis Eterno', tipo: 'Flor Cristalina', grau: 'suprema', cd: 25, tempo: '4h', desc: 'Petrifica a água ao seu redor; matéria-prima para poções de invulnerabilidade ao fogo.' }
    ]
  },
  {
    id: 'artico',
    nome: 'Ártico, Geleiras & Tundra',
    icone: '❄️',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Gelo eterno e ventos cortantes que produzem minerais de gelo negro e flores criogênicas.',
    recursos: [
      { nome: 'Musgo Criogênico da Tundra', tipo: 'Musgo', grau: 'baixa', cd: 11, tempo: '1h', desc: 'Conserva ingredientes perecíveis em temperaturas abaixo de zero.' },
      { nome: 'Salmourão Branco Polar', tipo: 'Mineral', grau: 'media', cd: 14, tempo: '2h', desc: 'Sal especial que evita a putrefação de carnes e tecidos colhidos.' },
      { nome: 'Flor-de-Gelo (Frost Lotus)', tipo: 'Flor Rara', grau: 'alta', cd: 20, tempo: '3h', desc: 'Pétalas transparentes que exalam vapor gelado; produz óleo de congelamento.' },
      { nome: 'Cristal de Gelo Perene (True Ice)', tipo: 'Mineral Mágico', grau: 'suprema', cd: 25, tempo: '4h', desc: 'Gelo que jamais derrete à temperatura ambiente; usado na Forja de Armas Gélidas.' }
    ]
  },
  {
    id: 'costa',
    nome: 'Costa Marítima & Recifes',
    icone: '🌊',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Praias, costões rochosos e piscinas de maré ricas em algas luminescentes, corais e sal purificado.',
    recursos: [
      { nome: 'Alga Salgada Seca', tipo: 'Alga', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Empregada em ligas têxteis impermeáveis e caldos de decocção.' },
      { nome: 'Areia de Sílica Dourada', tipo: 'Mineral', grau: 'media', cd: 13, tempo: '1h', desc: 'Areia fina ideal para soprar frascos de vidro de poções de alta resistência.' },
      { nome: 'Coral de Fogo Marinho', tipo: 'Animal/Mineral', grau: 'alta', cd: 19, tempo: '2h', desc: 'Estrutura calcária que arde em contato com oxigênio; base de bombas incendiárias aquáticas.' },
      { nome: 'Pérola de Ostra Gigante das Profundezas', tipo: 'Gema', grau: 'alta', cd: 21, tempo: '3h', desc: 'Gema orgânica para anéis de natação e poções de respiração aquática.' },
      { nome: 'Sal de Maré dos Tritões', tipo: 'Sal Arcano', grau: 'suprema', cd: 25, tempo: '4h', desc: 'Purifica qualquer veneno num raio de 10 passos quando dissolvido em vinho.' }
    ]
  },
  {
    id: 'pradaria',
    nome: 'Pradarias & Planícies Silvestres',
    icone: '🌾',
    pericias: ['Sobrevivência', 'Natureza'],
    descricao: 'Campos abertos de gramíneas, fáceis de navegar, fontes de linho selvagem, sementes e flores antídotos.',
    recursos: [
      { nome: 'Linho Rústico Silvestre', tipo: 'Fibra', grau: 'baixa', cd: 10, tempo: '1h', desc: 'Fios para cordas de embalar e bandagens higiênicas.' },
      { nome: 'Flor-de-Campo Amarela (Antídoto)', tipo: 'Flor', grau: 'media', cd: 14, tempo: '1h', desc: 'Substância amarga que alivia envenenamentos alimentares.' },
      { nome: 'Erva-do-Vento (Speedgrass)', tipo: 'Erva', grau: 'alta', cd: 19, tempo: '2h', desc: 'Acelera a circulação sanguínea; ingrediente de poções de agilidade e velocidade.' },
      { nome: 'Trigo Dourado das Fadas', tipo: 'Grão Sagrado', grau: 'suprema', cd: 24, tempo: '3h', desc: 'Grão que alimenta dez homens com uma única espiga em pães de viagem místicos.' }
    ]
  },
  {
    id: 'subterraneo',
    nome: 'Subterrâneo Profundo (Underdark)',
    icone: '🕳️',
    pericias: ['Sobrevivência', 'Natureza', 'Arcanismo'],
    descricao: 'Cavernas abissais banhadas pela radiação de Faerzress, fungos gigantes e minerais de bioluminescência.',
    recursos: [
      { nome: 'Liquen de Pedra Profunda', tipo: 'Líquen', grau: 'baixa', cd: 11, tempo: '1h', desc: 'Nutre-se de rocha úmida e serve de argamassa para selar frascos.' },
      { nome: 'Madeira do Fungo Zurkhwood', tipo: 'Madeira Fúngica', grau: 'media', cd: 15, tempo: '2h', desc: 'Haste lenhosa resistente à umidade, excelente para arcos drow e móveis subterrâneos.' },
      { nome: 'Minério de Shimmer Ore Luminoso', tipo: 'Mineral', grau: 'alta', cd: 21, tempo: '3h', desc: 'Mineral fosforescente que conduz eletricidade mágica com perda zero.' },
      { nome: 'Cristais Radiantes de Faerzress', tipo: 'Cristal Mágico', grau: 'suprema', cd: 26, tempo: '4h', desc: 'Cristais saturados de magia pura do Underdark; essência direta para varinhas de teleporte.' }
    ]
  }
];

// ============================================================
// APÊNDICE 3 - Essências Mágicas, Metais Nobres e Gemas
// ============================================================
export const APENDICE_ESSENCIAS = [
  {
    tipo: 'Arcana',
    icone: '🔮',
    cor: '#3b82f6',
    origem: 'Monstros arcanos, dragões, fadas arcanas, distorções dimensionais e rituais de magos.',
    raridades: [
      { raridade: 'Comum', posto: 'Novato', cdSintese: 12, custoPo: 50, exemplos: 'Truques permanentes, varinhas leves de luz ou som.' },
      { raridade: 'Incomum', posto: 'Aprendiz', cdSintese: 15, custoPo: 200, exemplos: 'Armas +1, Varinha de Mísseis Mágicos, Bolsa Sem Fundo.' },
      { raridade: 'Rara', posto: 'Oficial', cdSintese: 19, custoPo: 1000, exemplos: 'Armas +2, Capa de Invisibilidade, Anel de Proteção.' },
      { raridade: 'Muito Rara', posto: 'Mestre', cdSintese: 23, custoPo: 5000, exemplos: 'Armas +3, Bastão de Poder, Livros de Atributo.' },
      { raridade: 'Lendária', posto: 'Grão-Mestre', cdSintese: 28, custoPo: 25000, exemplos: 'Espada Vorpal, Cetro dos Reis, Varinha de Orcus.' }
    ]
  },
  {
    tipo: 'Divina',
    icone: '☀️',
    cor: '#eab308',
    origem: 'Celestiais, anjos, ínferos (divina profana), relíquias sagradas de templos e sacerdotes.',
    raridades: [
      { raridade: 'Comum', posto: 'Novato', cdSintese: 12, custoPo: 50, exemplos: 'Símbolos sagrados reluzentes, água benta permanente.' },
      { raridade: 'Incomum', posto: 'Aprendiz', cdSintese: 15, custoPo: 200, exemplos: 'Manto de Proteção Divina, Amuleto de Devoção +1.' },
      { raridade: 'Rara', posto: 'Oficial', cdSintese: 19, custoPo: 1000, exemplos: 'Maça da Ruína, Escudo Solar, Amuleto de Devoção +2.' },
      { raridade: 'Muito Rara', posto: 'Mestre', cdSintese: 23, custoPo: 5000, exemplos: 'Vingadora Sagrada (essência base), Cetro de Cura Máxima.' },
      { raridade: 'Lendária', posto: 'Grão-Mestre', cdSintese: 28, custoPo: 25000, exemplos: 'Artefatos dos Deuses, Escudo Solar dos Santos.' }
    ]
  },
  {
    tipo: 'Primitiva',
    icone: '🍃',
    cor: '#22c55e',
    origem: 'Feras ancestrais, elementais, espíritos da floresta, círculos druídicos e titãs.',
    raridades: [
      { raridade: 'Comum', posto: 'Novato', cdSintese: 12, custoPo: 50, exemplos: 'Tocha inextinguível druídica, cantil de água fresca perpétua.' },
      { raridade: 'Incomum', posto: 'Aprendiz', cdSintese: 15, custoPo: 200, exemplos: 'Armas de casca de ferro +1, Botas Élficas, Manto Élfico.' },
      { raridade: 'Rara', posto: 'Oficial', cdSintese: 19, custoPo: 1000, exemplos: 'Armadura de Couro de Fera +2, Anel de Andar sobre as Águas.' },
      { raridade: 'Muito Rara', posto: 'Mestre', cdSintese: 23, custoPo: 5000, exemplos: 'Cinto de Força do Gigante, Cajado das Florestas.' },
      { raridade: 'Lendária', posto: 'Grão-Mestre', cdSintese: 28, custoPo: 25000, exemplos: 'Manto do Arquidruida Ancestral, Martelo dos Titãs.' }
    ]
  }
];

export const METAIS_MATERIAIS_ESPECIAIS = [
  { nome: 'Adamantite', tipo: 'Metal', desc: 'O metal mais duro do multiverso. Transforma acertos normais em armas que anulam dureza de objetos e em armaduras que tornam qualquer acerto crítico em acerto normal.' },
  { nome: 'Mitral', tipo: 'Metal', desc: 'Metal prateado brilhante, incrivelmente leve e flexível. Armaduras pesadas ou médias de mitral eliminam a desvantagem em testes de Furtividade e requisitos de Força.' },
  { nome: 'Prata Alquímica', tipo: 'Metal/Tratamento', desc: 'Prata infundida nas ranhuras de corte e impacto de armas. Ignora a resistência a danos mundanos de licantropos e mortos-vivos.' },
  { nome: 'Ferro Frio', tipo: 'Metal', desc: 'Ferro forjado sem fogo ou calor convencional. Provoca dor excruciante e anula defesas naturais de fadas e seres feéricos.' },
  { nome: 'Madeira-Ferro', tipo: 'Madeira', desc: 'Troncos de árvores fossilizadas e magificadas por druidas. Possuem a dureza e gume do aço, mas são aceitas por tradições druídicas.' },
  { nome: 'Seda de Aranha Gigante', tipo: 'Tecido', desc: 'Fios extremamente finos e quase inquebráveis. Tecem cordas ultra-leves e forros para armaduras acolchoadas de alta proteção.' }
];

// ============================================================
// CATÁLOGO DE RECEITAS DO SISTEMA (Criação, Alquimia, Encantamento)
// ============================================================
export const RECEITAS_CATALOGO = [
  // --- CRIAÇÃO DE ITENS (MUNDANA & FORJA) ---
  {
    id: 'rec_espada_longa',
    nome: 'Espada Longa de Forja Nobre',
    disciplina: 'criacao',
    postoMinimo: 'novato',
    ferramenta: 'Ferramentas de Ferreiro',
    instalacao: 'Forja com bigorna e braseiro a carvão',
    tempoHoras: 8,
    cdBase: 13,
    custoPo: 15,
    tipo: 'Arma Marcial',
    peso: '1.5 kg',
    ingredientes: [
      { nome: 'Barra de Aço / Ferro Refinado', papel: 'base', qtd: 2, grauPadrao: 'media', desc: 'Estrutura da lâmina e espiga.' },
      { nome: 'Couro Bovino para Empunhadura', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Revestimento aderente da empunhadura.' },
      { nome: 'Pomo e Guarda de Bronze', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Contrapeso de balanceamento.' }
    ],
    resultadoItem: {
      nome: 'Espada Longa',
      tipo: 'Arma Marcial Corpo a Corpo',
      dano: '1d8 cortante (Versátil 1d10)',
      peso: 1.5,
      propriedades: 'Versátil'
    },
    descricao: 'Forjada com equilíbrio ideal entre lâmina e pomo, polida em óleo mineral para resistir à oxidação.'
  },
  {
    id: 'rec_adaga_furtiva',
    nome: 'Adaga de Aço e Ponta Agulha',
    disciplina: 'criacao',
    postoMinimo: 'novato',
    ferramenta: 'Ferramentas de Ferreiro',
    instalacao: 'Bancada de forja pequena',
    tempoHoras: 4,
    cdBase: 11,
    custoPo: 2,
    tipo: 'Arma Simples',
    peso: '0.5 kg',
    ingredientes: [
      { nome: 'Lâmina de Aço de Mola', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Aço carbono temperado para manter o fio.' },
      { nome: 'Tira de Couro Tratado', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Fita de amarração do cabo.' }
    ],
    resultadoItem: {
      nome: 'Adaga Furtiva',
      tipo: 'Arma Simples Corpo a Corpo',
      dano: '1d4 perfurante',
      peso: 0.5,
      propriedades: 'Acuidade, Leve, Arremesso (distância 6/18)'
    },
    descricao: 'Arma leve de rápido desembainhar, ideal para ataques furtivos e arremessos precisos.'
  },
  {
    id: 'rec_arco_longo',
    nome: 'Arco Longo de Teixo e Chifre',
    disciplina: 'criacao',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Carpinteiro / Entalhador',
    instalacao: 'Oficina de marcenaria com morsa de curvatura',
    tempoHoras: 16,
    cdBase: 14,
    custoPo: 25,
    tipo: 'Arma Marcial à Distância',
    peso: '1 kg',
    ingredientes: [
      { nome: 'Vara de Madeira Nobre (Teixo ou Freixo)', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Madeira elástica e resistente.' },
      { nome: 'Corda Trançada de Tendão de Fera', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Fio de alta tração que não esgarça na chuva.' },
      { nome: 'Reforço de Chifre ou Osso na Empunhadura', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Apoio de flecha reforçado.' }
    ],
    resultadoItem: {
      nome: 'Arco Longo Composto',
      tipo: 'Arma Marcial à Distância',
      dano: '1d8 perfurante',
      peso: 1.0,
      propriedades: 'Munição (distância 45/180), Pesada, Duas Mãos'
    },
    descricao: 'Arco de longo alcance com curvatura composta, propulsão maciça para flechas pesadas.'
  },
  {
    id: 'rec_gibao_couro_batido',
    nome: 'Gibão de Couro Batido Reforçado',
    disciplina: 'criacao',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Coureiro',
    instalacao: 'Bancada de corte e tina de fervura de óleo',
    tempoHoras: 24,
    cdBase: 13,
    custoPo: 22,
    tipo: 'Armadura Leve',
    peso: '6 kg',
    ingredientes: [
      { nome: 'Couro Espesso Tratado em Cera', papel: 'base', qtd: 3, grauPadrao: 'media', desc: 'Placas de couro endurecidas por fervura.' },
      { nome: 'Rebites de Ferro e Fivelas de Bronze', papel: 'auxiliar', qtd: 2, grauPadrao: 'media', desc: 'Rebites salientes para dissipar cortes.' },
      { nome: 'Forro de Linho Acolchoado', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Proteção interna contra assaduras.' }
    ],
    resultadoItem: {
      nome: 'Gibão de Couro Batido',
      tipo: 'Armadura Leve',
      ca: '12 + modificador de Destreza',
      peso: 6.0,
      propriedades: 'Sem desvantagem em Furtividade'
    },
    descricao: 'Armadura leve que oferece mobilidade completa combinada com a dureza de couro curtido em óleo.'
  },
  {
    id: 'rec_armadura_placas',
    nome: 'Armadura de Placas Completa (Full Plate)',
    disciplina: 'criacao',
    postoMinimo: 'mestre',
    ferramenta: 'Ferramentas de Ferreiro',
    instalacao: 'Grande Forja com bigorna dupla, fornalha e marretas hidráulicas',
    tempoHoras: 120, // 15 dias de 8h
    cdBase: 18,
    custoPo: 750,
    tipo: 'Armadura Pesada',
    peso: '30 kg',
    ingredientes: [
      { nome: 'Chapas de Aço Forjado Temperado', papel: 'base', qtd: 6, grauPadrao: 'alta', desc: 'Chapas curvadas sobre medida para o corpo.' },
      { nome: 'Cota de Malha Interna de Anéis Rebitados', papel: 'auxiliar', qtd: 2, grauPadrao: 'media', desc: 'Proteção das axilas e juntas.' },
      { nome: 'Correias de Couro Fino com Fivelas de Bronze', papel: 'auxiliar', qtd: 2, grauPadrao: 'media', desc: 'Sistema de ajuste de peso corporal.' },
      { nome: 'Acolchoado de Lã Nobre Interno', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Amortecimento de impacto contundente.' }
    ],
    resultadoItem: {
      nome: 'Armadura de Placas',
      tipo: 'Armadura Pesada',
      ca: '18 (fixo)',
      peso: 30.0,
      propriedades: 'Requer Força 15; Desvantagem em testes de Furtividade'
    },
    descricao: 'O ápice da metalurgia defensiva mundana. Placas encaixadas cobrem todo o corpo do guerreiro.'
  },
  {
    id: 'rec_escudo_reforcado',
    nome: 'Escudo de Madeira-Ferro e Aço',
    disciplina: 'criacao',
    postoMinimo: 'novato',
    ferramenta: 'Ferramentas de Ferreiro / Carpinteiro',
    instalacao: 'Oficina de forja básica',
    tempoHoras: 6,
    cdBase: 12,
    custoPo: 5,
    tipo: 'Escudo',
    peso: '3 kg',
    ingredientes: [
      { nome: 'Madeira Maciça Curvada', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Corpo do escudo absorvedor de impacto.' },
      { nome: 'Borda e Umbo Central de Ferro', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Reforço perimetral contra golpes de machado.' },
      { nome: 'Braçadeiras de Couro com Fecho', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Fixação firme no antebraço.' }
    ],
    resultadoItem: {
      nome: 'Escudo Reforçado',
      tipo: 'Escudo',
      ca: '+2 na CA',
      peso: 3.0,
      propriedades: 'Empunhado em uma das mãos'
    },
    descricao: 'Escudo clássico em formato de gota ou broquel reforçado com ferragens nas bordas.'
  },

  // --- ALQUIMIA ---
  {
    id: 'rec_pocao_cura_comum',
    nome: 'Poção de Cura Comum (2d4+2)',
    disciplina: 'alquimia',
    postoMinimo: 'novato',
    ferramenta: 'Kit de Herbalismo / Suprimentos de Alquimia',
    instalacao: 'Bancada de infusão com fogareiro',
    tempoHoras: 4,
    cdBase: 12,
    custoPo: 25,
    tipo: 'Poção Mágica / Alquímica',
    peso: '0.2 kg',
    ingredientes: [
      { nome: 'Raiz-Sangue ou Folhas de Cura Feérica', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Princípio ativo de regeneração celular.' },
      { nome: 'Água Destilada Pura com Açúcar Alquímico', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Solvente estéril que preserva o gosto adocicado.' },
      { nome: 'Frasco de Vidro Hermético com Rolha', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Recipiente selado à cera.' }
    ],
    resultadoItem: {
      nome: 'Poção de Cura',
      tipo: 'Poção (Comum)',
      efeito: 'Recupera 2d4 + 2 pontos de vida ao ser bebida.',
      peso: 0.2
    },
    descricao: 'Líquido vermelho cintilante que estanca cortes e fecha feridas em segundos.'
  },
  {
    id: 'rec_pocao_cura_maior',
    nome: 'Poção de Cura Maior (4d4+4)',
    disciplina: 'alquimia',
    postoMinimo: 'aprendiz',
    ferramenta: 'Suprimentos de Alquimia',
    instalacao: 'Laboratório alquímico com alambique de refluxo',
    tempoHoras: 10,
    cdBase: 15,
    custoPo: 100,
    tipo: 'Poção Mágica / Alquímica',
    peso: '0.2 kg',
    ingredientes: [
      { nome: 'Flor-da-Lua Feérica ou Sangue Dracônico Diluído', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Agente potente de cicatrização acelerada.' },
      { nome: 'Extrato de Raiz-Sangue Concentrada', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Concentrado denso de ervas vitais.' },
      { nome: 'Solvente de Álcool Etílico Alquímico', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Solução estabilizadora de alta pureza.' }
    ],
    resultadoItem: {
      nome: 'Poção de Cura Maior',
      tipo: 'Poção (Incomum)',
      efeito: 'Recupera 4d4 + 4 pontos de vida ao ser ingerida.',
      peso: 0.2
    },
    descricao: 'Brilho carmesim profundo. Repara fraturas ósseas e regenera órgãos danificados.'
  },
  {
    id: 'rec_pocao_cura_superior',
    nome: 'Poção de Cura Superior (8d4+8)',
    disciplina: 'alquimia',
    postoMinimo: 'oficial',
    ferramenta: 'Suprimentos de Alquimia',
    instalacao: 'Laboratório Alquímico Avançado',
    tempoHoras: 24,
    cdBase: 18,
    custoPo: 500,
    tipo: 'Poção Mágica / Alquímica',
    peso: '0.2 kg',
    ingredientes: [
      { nome: 'Seiva de Âmbar Dourado Ancestral ou Lágrima Celestial', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Catalisador de milagre biológico.' },
      { nome: 'Pó de Fada Brilhante Refinado', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Mantém a energia mágica sem sedimentar.' },
      { nome: 'Vidro Alquímico Reforçado com Chumbo Suave', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Frasco que impede a dissipação luminosa.' }
    ],
    resultadoItem: {
      nome: 'Poção de Cura Superior',
      tipo: 'Poção (Rara)',
      efeito: 'Recupera 8d4 + 8 pontos de vida instantaneamente.',
      peso: 0.2
    },
    descricao: 'Elixir cintilante como rubi liquefeito, com fios dourados em suspensão.'
  },
  {
    id: 'rec_fogo_alquimico',
    nome: 'Frasco de Fogo Alquímico',
    disciplina: 'alquimia',
    postoMinimo: 'novato',
    ferramenta: 'Suprimentos de Alquimia',
    instalacao: 'Mesa de destilação segura (risco de combustão)',
    tempoHoras: 6,
    cdBase: 13,
    custoPo: 25,
    tipo: 'Substância Volátil',
    peso: '0.5 kg',
    ingredientes: [
      { nome: 'Cinzas Ardentes Eternas ou Enxofre Vulcânico', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Composto pirofórico que arde em contato com oxigênio.' },
      { nome: 'Óleo Mineral Inflamável e Piche Fino', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Veículo viscoso que adere às superfícies.' },
      { nome: 'Frasco de Barro Quebradiço com Selo de Chumbo', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Quebra com facilidade ao impacto.' }
    ],
    resultadoItem: {
      nome: 'Fogo Alquímico (Frasco)',
      tipo: 'Item de Aventura / Granada Alquímica',
      efeito: 'Arremesso até 6m. Causa 1d4 de dano de fogo no início de cada turno do alvo até ser apagado com ação (CD 10 Destreza).',
      peso: 0.5
    },
    descricao: 'Substância gelatinosa que entra em chamas ferozes no momento exato em que o frasco estilhaça.'
  },
  {
    id: 'rec_acido_sulfurico',
    nome: 'Frasco de Ácido Concentrado',
    disciplina: 'alquimia',
    postoMinimo: 'novato',
    ferramenta: 'Suprimentos de Alquimia',
    instalacao: 'Capela de exaustão com máscara de pano úmido',
    tempoHoras: 6,
    cdBase: 12,
    custoPo: 12,
    tipo: 'Substância Corrosiva',
    peso: '0.5 kg',
    ingredientes: [
      { nome: 'Ácido Digestivo Concentrado de Lodo ou Salitre Puro', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Composto altamente corrosivo.' },
      { nome: 'Água Destilada Ácida', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Equilíbrio da solução.' },
      { nome: 'Frasco de Vidro Espesso Anti-Ácido', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Vidro temperado com silicato.' }
    ],
    resultadoItem: {
      nome: 'Ácido (Frasco)',
      tipo: 'Item de Aventura',
      efeito: 'Ataque de arremesso até 6m. Causa 2d6 de dano de ácido ao atingir uma criatura ou corrói fechaduras metálicas.',
      peso: 0.5
    },
    descricao: 'Líquido verde borbulhante que dissolve carne, couro e madeira com facilidade brutal.'
  },
  {
    id: 'rec_antidoto_universal',
    nome: 'Antídoto Alquímico Universal',
    disciplina: 'alquimia',
    postoMinimo: 'novato',
    ferramenta: 'Kit de Herbalismo',
    instalacao: 'Bancada de preparo com almofariz',
    tempoHoras: 4,
    cdBase: 12,
    custoPo: 25,
    tipo: 'Poção',
    peso: '0.2 kg',
    ingredientes: [
      { nome: 'Flor-de-Campo Amarela ou Carvão Ativado Vegetal', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Agente quelante de toxinas.' },
      { nome: 'Leite Destilado e Tintura de Menta', papel: 'auxiliar', qtd: 1, grauPadrao: 'baixa', desc: 'Proteção gástrica contra irritações.' }
    ],
    resultadoItem: {
      nome: 'Antídoto',
      tipo: 'Poção',
      efeito: 'Concede Vantagem em salvaguardas contra veneno por 1 hora e neutraliza um veneno ativo no organismo.',
      peso: 0.2
    },
    descricao: 'Mistura esbranquiçada e amarga que combate rapidamente toxinas em circulação no sangue.'
  },
  {
    id: 'rec_veneno_paralisia',
    nome: 'Toxina Paralisante de Contato',
    disciplina: 'alquimia',
    postoMinimo: 'aprendiz',
    ferramenta: 'Kit de Venenos',
    instalacao: 'Laboratório isolado com exaustão',
    tempoHoras: 12,
    cdBase: 16,
    custoPo: 120,
    tipo: 'Veneno',
    peso: '0.1 kg',
    ingredientes: [
      { nome: 'Glândula de Veneno de Monstruosidade ou Raiz-de-Verme', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Neurotoxina bloqueadora de impulsos motores.' },
      { nome: 'Gordura Animal Refinada como Aglutinante', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Permite fixar a toxina na lâmina sem secar rápido.' }
    ],
    resultadoItem: {
      nome: 'Veneno Paralisante (Dose)',
      tipo: 'Veneno (Contato / Ferimento)',
      efeito: 'Aplica-se em até 3 armas ou munições. Criatura ferida deve passar em Salvaguarda de Constituição CD 13 ou fica Paralisada por 1 minuto.',
      peso: 0.1
    },
    descricao: 'Óleo denso e translúcido que adormece as terminações nervosas ao menor corte.'
  },

  // --- ENCANTAMENTO ---
  {
    id: 'rec_espada_mais_um',
    nome: 'Espada Longa +1 (Imbuição Arcana)',
    disciplina: 'encantamento',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Joalheiro / Entalhador + Arcanismo',
    instalacao: 'Oficina arcana com Círculo de Encantamento gravado em prata',
    tempoHoras: 32, // 4 dias
    cdBase: 15,
    custoPo: 250,
    tipo: 'Arma Mágica',
    peso: '1.5 kg',
    ingredientes: [
      { nome: 'Espada Longa de Forja Nobre (Item Base)', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Arma mundana sem defeitos estruturais.' },
      { nome: 'Essência Arcana Incomum', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Foco de poder que ancora a precisão mágica.' },
      { nome: 'Pó de Diamante para Runas (50 po)', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Material de traçado dos sulcos rúnicos.' }
    ],
    resultadoItem: {
      nome: 'Espada Longa +1',
      tipo: 'Arma Marcial Mágica (Incomum)',
      dano: '1d8 + 1 cortante (Versátil 1d10 + 1)',
      bonusAtaqueDano: '+1 em jogadas de ataque e dano',
      peso: 1.5,
      propriedades: 'Mágica, Versátil'
    },
    descricao: 'Lâmina prateada que nunca perde o fio e emite uma suave ressonância musical ao ser empunhada.'
  },
  {
    id: 'rec_varinha_misseis',
    nome: 'Varinha de Mísseis Mágicos',
    disciplina: 'encantamento',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Entalhador + Arcanismo',
    instalacao: 'Círculo de Encantamento Arcana',
    tempoHoras: 24,
    cdBase: 15,
    custoPo: 300,
    tipo: 'Varinha Mágica',
    peso: '0.5 kg',
    ingredientes: [
      { nome: 'Haste de Madeira-Ferro ou Casca de Carvalho', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Corpo da varinha com canal condutor.' },
      { nome: 'Essência Arcana Incomum (Força)', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Energia de força dos mísseis arcanos.' },
      { nome: 'Cristal de Quartzo Claro Lapidado', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Ponta focalizadora do raio.' }
    ],
    resultadoItem: {
      nome: 'Varinha de Mísseis Mágicos',
      tipo: 'Varinha (Incomum)',
      efeito: 'Possui 7 cargas. Com 1 ação, gasta 1 ou mais cargas para lançar Mísseis Mágicos (1d4+1 por míssil sem erro). Recupera 1d6+1 cargas ao amanhecer.',
      peso: 0.5
    },
    descricao: 'Varinha delgada entalhada com runas de força cintilantes na cor ametista.'
  },
  {
    id: 'rec_anel_protecao',
    nome: 'Anel de Proteção (+1 CA e Salvaguardas)',
    disciplina: 'encantamento',
    postoMinimo: 'oficial',
    ferramenta: 'Ferramentas de Joalheiro + Arcanismo',
    instalacao: 'Oficina arcana de alta precisão com fogo controlado',
    tempoHoras: 48,
    cdBase: 17,
    custoPo: 800,
    tipo: 'Item Maravilhoso (Anel)',
    peso: '0.05 kg',
    ingredientes: [
      { nome: 'Aro de Ouro Branco ou Mitral Polido', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Metal nobre que não distorce a Trama protetora.' },
      { nome: 'Essência Divina ou Arcana Rara', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Campo de força de repulsão harmônica.' },
      { nome: 'Gema de Safira Estelar Lapidada', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Engaste central que estabiliza o escudo.' }
    ],
    resultadoItem: {
      nome: 'Anel de Proteção',
      tipo: 'Item Maravilhoso (Raro)',
      efeito: 'Requer Sintonização. Concede +1 de bônus na Classe de Armadura e +1 em todas as Salvaguardas.',
      peso: 0.05
    },
    descricao: 'Anel elegante que projeta um campo invisível de deflexão protetora ao redor do usuário.'
  },
  {
    id: 'rec_bolsa_sem_fundo',
    nome: 'Bolsa Sem Fundo (Bag of Holding)',
    disciplina: 'encantamento',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Tecelão / Coureiro + Arcanismo',
    instalacao: 'Círculo de distorção espacial com âncoras de prata',
    tempoHoras: 30,
    cdBase: 15,
    custoPo: 350,
    tipo: 'Item Maravilhoso',
    peso: '7 kg',
    ingredientes: [
      { nome: 'Sacola de Couro Rústico com Costura Dupla', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Vasilha física ancorada no plano material.' },
      { nome: 'Essência Arcana Incomum (Espaço/Transmutação)', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Distorção que expande o espaço interior para um semiplano.' },
      { nome: 'Pó de Fada ou Fibras de Seda Feérica', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Isolante de peso gravitacional.' }
    ],
    resultadoItem: {
      nome: 'Bolsa Sem Fundo',
      tipo: 'Item Maravilhoso (Incomum)',
      efeito: 'Armazena até 250 kg em volume de até 1.8 metros cúbicos, pesando sempre apenas 7 kg exteriormente.',
      peso: 7.0
    },
    descricao: 'Abertura de 60 cm que conduz a um bolsão dimensional seguro e hermético.'
  },
  {
    id: 'rec_botas_aladas',
    nome: 'Botas Aladas (Winged Boots)',
    disciplina: 'encantamento',
    postoMinimo: 'oficial',
    ferramenta: 'Ferramentas de Coureiro + Arcanismo',
    instalacao: 'Oficina arcana de encantamento eólico',
    tempoHoras: 40,
    cdBase: 16,
    custoPo: 600,
    tipo: 'Item Maravilhoso (Pés)',
    peso: '1 kg',
    ingredientes: [
      { nome: 'Par de Botas de Couro Macio de Alta Qualidade', papel: 'base', qtd: 1, grauPadrao: 'alta', desc: 'Base confortável de calçar.' },
      { nome: 'Penas Radiantes Celestiais ou Asas de Monstruosidade', papel: 'auxiliar', qtd: 2, grauPadrao: 'alta', desc: 'Penugem imbuída com o princípio aerodinâmico.' },
      { nome: 'Essência Primitiva ou Arcana Rara (Voo)', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Poder de sustentação no ar.' }
    ],
    resultadoItem: {
      nome: 'Botas Aladas',
      tipo: 'Item Maravilhoso (Incomum / Raro)',
      efeito: 'Requer Sintonização. Concede deslocamento de voo igual ao deslocamento de caminhada por até 4 horas diárias divididas como desejar.',
      peso: 1.0
    },
    descricao: 'Pequenas asas estilizadas nas laterais dos tornozelos que se abrem quando o usuário salta no ar.'
  },
  {
    id: 'rec_manto_elfico',
    nome: 'Manto Élfico de Camuflagem',
    disciplina: 'encantamento',
    postoMinimo: 'aprendiz',
    ferramenta: 'Ferramentas de Tecelão + Arcanismo',
    instalacao: 'Oficina com luz natural filtrada',
    tempoHoras: 24,
    cdBase: 14,
    custoPo: 250,
    tipo: 'Item Maravilhoso (Manto)',
    peso: '0.5 kg',
    ingredientes: [
      { nome: 'Capa de Tecido com Fios de Seda Feérica', papel: 'base', qtd: 1, grauPadrao: 'media', desc: 'Tecelagem flexível que absorve reflexos de luz.' },
      { nome: 'Essência Primitiva Incomum (Camuflagem)', papel: 'auxiliar', qtd: 1, grauPadrao: 'media', desc: 'Encantamento mimético de vegetação.' },
      { nome: 'Pétalas Crepusculares Feéricas', papel: 'auxiliar', qtd: 1, grauPadrao: 'alta', desc: 'Pigmento de alteração de tom ambiental.' }
    ],
    resultadoItem: {
      nome: 'Manto Élfico',
      tipo: 'Item Maravilhoso (Incomum)',
      efeito: 'Requer Sintonização. Concede Vantagem em testes de Destreza (Furtividade) para se esconder. Testes de Percepção para notar o usuário sofrem Desvantagem.',
      peso: 0.5
    },
    descricao: 'Tecido cinza esverdeado que muda de cor harmoniosamente com a rocha, folhagem ou sombras ao redor.'
  }
];

// ============================================================
// PERSISTÊNCIA DAS FICHAS DE PROCESSO (CADERNO DO ARTESÃO)
// ============================================================
export const STORAGE_FICHAS_PROCESSO = 'nexus_arcanecraft_fichas_processos';

export function listarFichasProcesso() {
  try {
    const raw = localStorage.getItem(STORAGE_FICHAS_PROCESSO);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Erro ao carregar fichas de processo:', e);
    return [];
  }
}

export function salvarFichaProcesso(ficha) {
  const lista = listarFichasProcesso();
  const idx = lista.findIndex(f => f.id === ficha.id);
  if (idx >= 0) {
    lista[idx] = ficha;
  } else {
    lista.unshift(ficha);
  }
  if (lista.length > 100) lista.pop();
  try {
    localStorage.setItem(STORAGE_FICHAS_PROCESSO, JSON.stringify(lista));
  } catch (e) {
    console.warn('Erro ao salvar ficha de processo:', e);
  }
  return ficha;
}

export function excluirFichaProcesso(id) {
  let lista = listarFichasProcesso();
  lista = lista.filter(f => f.id !== id);
  try {
    localStorage.setItem(STORAGE_FICHAS_PROCESSO, JSON.stringify(lista));
  } catch (e) {
    console.warn('Erro ao excluir ficha de processo:', e);
  }
  return lista;
}
