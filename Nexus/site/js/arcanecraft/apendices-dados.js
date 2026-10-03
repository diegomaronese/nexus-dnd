// ============================================================
// Arcane Craft - Apêndices 1, 2 e 3 Oficiais
// Base de Dados de Materiais, Alquimia e Encantamento por Tiers
// ============================================================

import { METAIS_APENDICE1 } from './apendice1-metais.js';
import { MINERAIS_APENDICE1 } from './apendice1-minerais.js';
import { MADEIRAS_FIBRAS_APENDICE1 } from './apendice1-madeiras-fibras.js';
import { CRIATURAS_APENDICE1 } from './apendice1-criaturas.js';
import { SUBSTRATOS_APENDICE2 } from './apendice2-substratos.js';
import { REAGENTES_APENDICE2 } from './apendice2-reagentes.js';

export {
  METAIS_APENDICE1,
  MINERAIS_APENDICE1,
  MADEIRAS_FIBRAS_APENDICE1,
  CRIATURAS_APENDICE1,
  SUBSTRATOS_APENDICE2,
  REAGENTES_APENDICE2
};

// Normalizador de Materiais do Apêndice 1 (CM, CD, Esforço)
function _normMat(m) {
  const tier = Number(m.tier) || 1;
  return {
    ...m,
    tier,
    cdMod: m.cdMod !== undefined ? m.cdMod : (tier === 1 ? 0 : tier === 2 ? 1 : tier === 3 ? 2 : tier === 4 ? 3 : 4),
    cm: m.cm || (10 + tier * 5),
    custoPo: m.custoPo !== undefined ? m.custoPo : (m.unitPrice !== undefined ? m.unitPrice : 1),
    unitEffort: m.unitEffort !== undefined ? m.unitEffort : (tier === 1 ? 5 : tier === 2 ? 10 : tier === 3 ? 20 : tier === 4 ? 40 : 80),
    propriedades: m.propriedades || 'Propriedade de integridade e virtudes do material.'
  };
}

// Normalizador de Substratos do Apêndice 2
function _normSub(s) {
  const tier = Number(s.tier) || 1;
  return {
    ...s,
    tier,
    estabilidade: s.estabilidade || (tier === 1 ? 'Alta (Segura)' : tier === 2 ? 'Normal (Estável)' : tier === 3 ? 'Média (Reativa)' : tier === 4 ? 'Volátil (Perigosa)' : 'Primordial (Instável)'),
    cdMod: s.cdMod !== undefined ? s.cdMod : (tier === 1 ? 0 : tier === 2 ? -1 : tier === 3 ? 1 : tier === 4 ? 2 : 3),
    custoPo: s.custoPo !== undefined ? s.custoPo : (s.unitPrice !== undefined ? s.unitPrice : (tier * 10)),
    unitEffort: s.unitEffort || (tier === 1 ? 3 : tier === 2 ? 10 : tier === 3 ? 25 : tier === 4 ? 50 : 80),
    potencial: s.potencial || s.efeitoPrimario || s.metodoUso || 'Solvente Alquímico',
    descricao: s.descricao || `${s.tipo || 'Líquido'} para ${s.metodoUso || 'Preparo Alquímico'}. Limite de Suspensão: ${s.limiteSuspensao || '30g'}. Fonte: ${s.fonte || 'Comum'}.`
  };
}

// Normalizador de Reagentes do Apêndice 2
function _normReag(r) {
  const tier = Number(r.tier) || 1;
  return {
    ...r,
    tier,
    custoPo: r.custoPo !== undefined ? r.custoPo : (r.unitPrice !== undefined ? r.unitPrice : (tier * 15)),
    unitEffort: r.unitEffort || (tier === 1 ? 4 : tier === 2 ? 12 : tier === 3 ? 25 : tier === 4 ? 50 : 80),
    cdMod: r.cdMod !== undefined ? r.cdMod : (tier === 1 ? 0 : tier === 2 ? 1 : tier === 3 ? 2 : tier === 4 ? 3 : 4),
    tipoEfeito: r.tipoEfeito || 'Efeito Alquímico',
    descricao: r.descricao || `Canais: [${r.canais || 'Equilibrados'}]. Dose: ${r.dose || (r.dosagemG ? r.dosagemG + 'g' : '15g')}. Fontes: ${r.fontes || 'Diversas'}.${r.canalInibitorio ? ' Canal Inibitório: ' + r.canalInibitorio : ''}`
  };
}

// ------------------------------------------------------------
// APÊNDICE 1: MATERIAIS DE CRIAÇÃO (Crafting Materials)
// Categorias: Metais (44), Gemas/Minerais (13), Fibras/Madeiras (16) e Produtos de Criaturas (35)
// ------------------------------------------------------------
export const APENDICE1_MATERIAIS = {
  metais: METAIS_APENDICE1.map(_normMat),
  gemas: MINERAIS_APENDICE1.map(_normMat),
  fibras_madeiras: MADEIRAS_FIBRAS_APENDICE1.map(_normMat),
  criaturas_exoticas: CRIATURAS_APENDICE1.map(_normMat)
};

// ------------------------------------------------------------
// APÊNDICE 2: ALQUIMIA (Substrates, Reagents, Recipes & Creatures)
// ------------------------------------------------------------
// Substratos Oficiais (44) e Legados (9)
const _substratosOficiais = SUBSTRATOS_APENDICE2.map(_normSub);
const _legacySubstratos = [
  { id: 'agua_pura_nascente', nome: 'Água Pura de Nascente', nomeEn: 'Spring Water', tier: 1, estabilidade: 'Alta (Segura)', cdMod: 0, custoPo: 1, unitEffort: 3, potencial: 'Poções de cura leves, infusões fitoterápicas', descricao: 'Água desprovida de sedimentos minerais e lodo, colhida no topo de colinas.' },
  { id: 'alcool_neutro_cereal', nome: 'Álcool Neutro Destilado', nomeEn: 'Grain Alcohol', tier: 1, estabilidade: 'Normal', cdMod: 0, custoPo: 2, unitEffort: 4, potencial: 'Tinturas, extratos vegetais, conservantes', descricao: 'Bebida de alto teor alcoólico obtida por destilação simples de cereais.' },
  { id: 'agua_destilada_purificada', nome: 'Água Destilada Purificada (Twice-Distilled)', nomeEn: 'Twice-Distilled Water', tier: 2, estabilidade: 'Alta (Imaculada)', cdMod: -1, custoPo: 8, unitEffort: 10, potencial: 'Poções de restauração maior, antitoxinas precisas', descricao: 'Condensada gota a gota em alambiques de cobre estéreis.' },
  { id: 'oleo_mineral_volatil', nome: 'Óleo Mineral Volátil', nomeEn: 'Volatile Mineral Oil', tier: 2, estabilidade: 'Volátil (Exige Cuidado)', cdMod: 1, custoPo: 12, unitEffort: 12, potencial: 'Fogo alquímico, óleos de revestimento de lâmina, graxas de ignição', descricao: 'Óleo refinado de rochas betuminosas que queima com fumaça alaranjada viva.' },
  { id: 'mercurio_alquimico', nome: 'Mercúrio Purificado Alquímico', nomeEn: 'Alchemical Quicksilver', tier: 3, estabilidade: 'Média (Tóxico)', cdMod: 1, custoPo: 50, unitEffort: 25, potencial: 'Elixires de atributo mental, poções de velocidade e invisibilidade', descricao: 'Metal líquido destilado sob filtros de carvão ativado e sais de prata.' },
  { id: 'solucao_vitriolo_verde', nome: 'Solução Concentrada de Vitríolo Verde', nomeEn: 'Green Vitriol Solution', tier: 3, estabilidade: 'Cáustica (Altamente Corrosiva)', cdMod: 2, custoPo: 65, unitEffort: 25, potencial: 'Ácidos dissolventes supremos, bombas corrosivas', descricao: 'Ácido sulfúrico primitivo obtido por ustulação de sulfato de ferro.' },
  { id: 'agua_primordial_elemental', nome: 'Água Primordial de Nascente Elemental', nomeEn: 'Primordial Elemental Water', tier: 4, estabilidade: 'Sublime (Afinidade Cósmica)', cdMod: -2, custoPo: 250, unitEffort: 50, potencial: 'Poções de Cura Suprema, panaceias, elixires de longevidade', descricao: 'Água colhida diretamente de fendas para o Plano Elemental da Água; nunca evapora.' },
  { id: 'eter_alquimico_cristalino', nome: 'Éter Alquímico Volátil Cristalizado', nomeEn: 'Volatile Aether', tier: 4, estabilidade: 'Altamente Volátil', cdMod: 2, custoPo: 350, unitEffort: 50, potencial: 'Óleos de forma etérea, poções de teleporte e vôo sem esforço', descricao: 'Líquido luminescente que ferve à temperatura ambiente sob vácuo.' },
  { id: 'alkahest_universal', nome: 'Solvente Universal (Alkahest Puro)', nomeEn: 'Alkahest Universal Solvent', tier: 5, estabilidade: 'Extrema (Dissolve Tudo Exceto Vidro Alquímico)', cdMod: 3, custoPo: 1500, unitEffort: 80, potencial: 'Transmutações de matéria, elixires míticos de rejuvenescimento imortal', descricao: 'O solvente lendário da alquimia clássica capaz de quebrar qualquer ligação física.' }
];

// Reagentes Oficiais (80) e Legados (13)
const _reagentesOficiais = REAGENTES_APENDICE2.map(_normReag);
const _legacyReagentes = [
  { id: 'raiz_sangue_menor', nome: 'Raiz-Sangue Menor (Bloodroot)', nomeEn: 'Lesser Bloodroot', tier: 1, canais: '+1 ; +2', dose: '15g', dosagemG: 15, tipoEfeito: 'Cura & Restauração', cdMod: 0, custoPo: 5, unitEffort: 5, efeitoPrincipal: 'Restaura 2d4+2 PV (ingestão rápida)', fontes: 'Solos úmidos de florestas temperadas', descricao: 'Raiz vermelha fibrosa abundante em solos úmidos de florestas temperadas.' },
  { id: 'cogumelo_brilhante', nome: 'Cogumelo Brilhante (Glowcap)', nomeEn: 'Glowcap Mushroom', tier: 1, canais: '+3 ; +5', dose: '10g', dosagemG: 10, tipoEfeito: 'Visão & Percepção', cdMod: 0, custoPo: 6, unitEffort: 5, efeitoPrincipal: 'Concede Visão no Escuro de 18 metros por 1 hora', fontes: 'Minas úmidas e cavernas', descricao: 'Fungo fosforescente que cresce em frestas de minas úmidas.' },
  { id: 'enxofre_bruto', nome: 'Enxofre Vulcânico Moído', nomeEn: 'Volcanic Sulfur', tier: 1, canais: '+2 ; +4', dose: '20g', dosagemG: 20, tipoEfeito: 'Dano Elemental (Fogo)', cdMod: 1, custoPo: 4, unitEffort: 5, efeitoPrincipal: 'Gera combustão exposta: 1d4 de fogo contínuo', fontes: 'Caldeiras vulcânicas', descricao: 'Pó amarelo acre altamente reativo com fricção e chama.' },
  { id: 'folha_ginseng_dourado', nome: 'Folhas de Ginseng Dourado', nomeEn: 'Golden Ginseng Leaf', tier: 2, canais: '+1 ; +3', dose: '15g', dosagemG: 15, tipoEfeito: 'Fortificante / Atributo', cdMod: -1, custoPo: 20, unitEffort: 10, efeitoPrincipal: '+2 de bônus em testes de Constituição ou Força por 1 hora', fontes: 'Montanhas temperadas', descricao: 'Erva revigorante de montanha com aroma picante e estimulante.' },
  { id: 'salitre_cristalino', nome: 'Salitre Cristalino Puro', nomeEn: 'Refined Saltpeter', tier: 2, canais: '+2 ; +5', dose: '25g', dosagemG: 25, tipoEfeito: 'Dano Elemental (Ácido / Choque)', cdMod: 0, custoPo: 18, unitEffort: 10, efeitoPrincipal: 'Reage violentamente gerando 2d6 de dano de ácido ou estampido', fontes: 'Cavernas secas e sedimentos', descricao: 'Cristais translúcidos extraídos de paredes de cavernas secas.' },
  { id: 'beladona_silvestre', nome: 'Extrato de Beladona Silvestre', nomeEn: 'Deadly Nightshade', tier: 2, canais: '-1 ; -3', dose: '12g', dosagemG: 12, tipoEfeito: 'Veneno & Paralisia', cdMod: 1, custoPo: 30, unitEffort: 12, efeitoPrincipal: 'Veneno de contato/ingestão: Salvaguarda CON CD 13 ou Envenenado por 1 hora', fontes: 'Clareiras sombrias', descricao: 'Frutas escuras brilhantes ricas em alcalóides depressores do sistema nervoso.' },
  { id: 'seiva_mandrake_mistica', nome: 'Seiva de Mandrágora Mística', nomeEn: 'Mystic Mandrake Sap', tier: 3, canais: '+1 ; +2 ; +3', dose: '20g', dosagemG: 20, tipoEfeito: 'Cura & Restauração', cdMod: -1, custoPo: 80, unitEffort: 25, efeitoPrincipal: 'Restaura 8d4+8 PV ou remove 1 Maldição/Doença', fontes: 'Raízes antropomórficas despertas', descricao: 'Extrato viscoso colhido de raízes antropomórficas despertas.' },
  { id: 'cristais_salmaris', nome: 'Cristais de Salmaris Oceânicos', nomeEn: 'Salmaris Sea Crystals', tier: 3, canais: '+3 ; +4', dose: '30g', dosagemG: 30, tipoEfeito: 'Adaptação & Utilidade', cdMod: 0, custoPo: 100, unitEffort: 25, efeitoPrincipal: 'Concede Respiração Aquática e deslocamento de natação por 24 horas', fontes: 'Fossas abissais oceânicas', descricao: 'Formação mineral cristalizada em fossas abissais marinhas.' },
  { id: 'orvalho_meia_noite', nome: 'Orvalho da Meia-Noite das Fadas', nomeEn: 'Midnight Dew', tier: 3, canais: '+5 ; +1', dose: '10g', dosagemG: 10, tipoEfeito: 'Camuflagem & Mente', cdMod: 1, custoPo: 140, unitEffort: 30, efeitoPrincipal: 'Concede Invisibilidade mágica por até 1 hora', fontes: 'Lírios lunares do Feywild', descricao: 'Gotas condensadas em pétalas de lírios lunares colhidas exatamente à meia-noite.' },
  { id: 'sangue_celestial_dourado', nome: 'Sangue Celestial Dourado (Ichor)', nomeEn: 'Celestial Golden Ichor', tier: 4, canais: '+1 ; +2 ; +3 ; +4', dose: '25g', dosagemG: 25, tipoEfeito: 'Cura & Restauração', cdMod: -2, custoPo: 600, unitEffort: 50, efeitoPrincipal: 'Panaceia: Restaura 10d4+20 PV e cura qualquer cegueira, surdez ou veneno', fontes: 'Celestiais maiores', descricao: 'Líquido dourado sagrado que emite aroma de flores e sândalo.' },
  { id: 'glandula_sopro_dragao', nome: 'Glândula Concentrada de Sopro de Dragão', nomeEn: 'Dragon Breath Extract', tier: 4, canais: '+2 ; +4 ; +5', dose: '40g', dosagemG: 40, tipoEfeito: 'Dano Elemental Destrutivo', cdMod: 2, custoPo: 750, unitEffort: 60, efeitoPrincipal: 'Arremesso ou sopro: 6d6 de dano de fogo/frio em cone de 4,5 metros', fontes: 'Dragões verdadeiros adultos', descricao: 'Órgão de dragão adulto pulsando com energia endotérmica ou exotérmica.' },
  { id: 'veneno_lagrimas_meia_noite', nome: 'Lágrimas da Meia-Noite (Midnight Tears)', nomeEn: 'Midnight Tears Venom', tier: 4, canais: '-2 ; -4 ; -5', dose: '15g', dosagemG: 15, tipoEfeito: 'Veneno Letal', cdMod: 2, custoPo: 1200, unitEffort: 70, efeitoPrincipal: 'Sem sabor ou odor: causa 9d6 de dano de veneno se ingerido na meia-noite', fontes: 'Flores venenosas das profundezas', descricao: 'Toxina refinada indetectável mesmo por testes comuns de paladar.' },
  { id: 'brasa_coracao_fenix', nome: 'Brasa do Coração da Fênix', nomeEn: 'Phoenix Heart Ember', tier: 5, canais: '+1 ; +2 ; +3 ; +4 ; +5', dose: '50g', dosagemG: 50, tipoEfeito: 'Mítico / Ressurreição', cdMod: 3, custoPo: 4500, unitEffort: 100, efeitoPrincipal: 'Ressuscita automaticamente o portador com metade dos PV se morto em até 24h', fontes: 'Ninho da Fênix Solar', descricao: 'Fragmento de carvão radiante que arde sem jamais consumir cinzas.' }
];

// Combinar e normalizar
const _todosSubstratosMap = new Map();
_substratosOficiais.forEach(s => _todosSubstratosMap.set(s.id, s));
_legacySubstratos.forEach(s => {
  if (!_todosSubstratosMap.has(s.id)) _todosSubstratosMap.set(s.id, _normSub(s));
});

const _todosReagentesMap = new Map();
_reagentesOficiais.forEach(r => _todosReagentesMap.set(r.id, r));
_legacyReagentes.forEach(r => {
  if (!_todosReagentesMap.has(r.id)) _todosReagentesMap.set(r.id, _normReag(r));
});

export const APENDICE2_ALQUIMIA = {
  substratos: Array.from(_todosSubstratosMap.values()),
  reagentes: Array.from(_todosReagentesMap.values()),
  reagentes_criaturas: [
    {
      familia: 'Feras (Beasts)',
      icone: '🐺',
      reagentes: [
        { nome: 'Gordura de Urso Refinada', uso: 'Base espessante de unguentos térmicos e pomadas de resistência.' },
        { nome: 'Sangue de Lobo Alfa', uso: 'Elixir de adrenalina (+2 em iniciativa e vantagem em testes de Percepção).' },
        { nome: 'Fel de Serpente Venenosa', uso: 'Catalisador para contra-venenos e antitoxinas universais.' }
      ]
    },
    {
      familia: 'Monstruosidades (Monstrosities)',
      icone: '🦂',
      reagentes: [
        { nome: 'Sangue de Basilisco Filtrado', uso: 'Solvente anti-petrificação e óleo restaurador de tecidos calcificados.' },
        { nome: 'Glândula Tóxica de Wyvern', uso: 'Veneno virulento de ferimento (causa 7d6 de dano de veneno imediato).' },
        { nome: 'Mucilagem de Grifo Predador', uso: 'Óleos de salto atlético e elixires de reflexos aprimorados.' }
      ]
    },
    {
      familia: 'Dragões (Dragons)',
      icone: '🐉',
      reagentes: [
        { nome: 'Bile Ácida de Dragão Negro', uso: 'Ácido que dissolve pedras e armas de ferro mundanas instantaneamente.' },
        { nome: 'Sangue Ígneo de Dragão Vermelho', uso: 'Óleo da chama implacável (adiciona 1d6 fogo a armas por 1 hora).' },
        { nome: 'Coração de Dragão Azul (Extrato)', uso: 'Poções de relâmpago veloz e condução de energia arcana sem perda.' }
      ]
    },
    {
      familia: 'Elementais (Elementals)',
      icone: '🔥',
      reagentes: [
        { nome: 'Brasas Eternas de Magmin', uso: 'Ingrediente básico para fogo alquímico permanente e pólvora rúnica.' },
        { nome: 'Gotas de Água Primordial de Marid', uso: 'Poção de respiração aquática superior e purificação total de toxinas.' },
        { nome: 'Poeira de Redemoinho de Sylph', uso: 'Poções de levitação sem gravidade e andar sobre o vento.' }
      ]
    },
    {
      familia: 'Mortos-Vivos (Undead)',
      icone: '💀',
      reagentes: [
        { nome: 'Ectoplasma de Espectro Translúcido', uso: 'Óleo de intangibilidade espectral e poções de atravessar vãos estreitos.' },
        { nome: 'Pó de Múmia Nobre Embalsamada', uso: 'Veneno da Podridão da Múmia (impede cura até remoção de maldição).' },
        { nome: 'Bile de Carniçal (Ghoul)', uso: 'Unguento de paralisia cadavérica para dardos e flechas.' }
      ]
    },
    {
      familia: 'Ínferos (Fiends)',
      icone: '😈',
      reagentes: [
        { nome: 'Enxofre Abissal em Óleo', uso: 'Ácido infernal que derrete armaduras de prata e ferro frio.' },
        { nome: 'Sangue de Diabo das Correntes', uso: 'Elixir de imunidade total a medo e encantamentos coercitivos.' },
        { nome: 'Esporos de Fungo de Vrock', uso: 'Granadas de esporos sufocantes que causam dano por turno em área.' }
      ]
    },
    {
      familia: 'Celestiais (Celestials)',
      icone: '🪽',
      reagentes: [
        { nome: 'Lágrimas Purificadas de Couatl', uso: 'Antídoto universal para todas as toxinas e doenças naturais.' },
        { nome: 'Pó de Halo Luminescente', uso: 'Óleo sagrado de alvorecer (causa +1d8 dano radiante contra mortos-vivos).' },
        { nome: 'Gotas de Ichor de Solar', uso: 'Elixir da Panaceia e restauração total de níveis ou atributos drenados.' }
      ]
    },
    {
      familia: 'Aberrações (Aberrations)',
      icone: '👁️',
      reagentes: [
        { nome: 'Muco Hipnótico de Aboleth', uso: 'Poção de telepatia forçada e respiração anfíbia com pele viscosa.' },
        { nome: 'Líquido Ocular de Nothic', uso: 'Elixir de Ver o Invisível e leitura de pensamentos superficiais.' },
        { nome: 'Córtex Preservado de Devorador de Mentes', uso: 'Poção de amplificação psiônica e resistência a dano psíquico.' }
      ]
    },
    {
      familia: 'Lodos & Plantas (Oozes & Plants)',
      icone: '🧪',
      reagentes: [
        { nome: 'Fluido Digestivo de Pudim Negro', uso: 'Ácido que degrada metal permanentemente (-1 CA em acertos na armadura).' },
        { nome: 'Esporos Paralisantes de Fungo Violeta', uso: 'Pó de necrose tecidual e anestésico cirúrgico poderoso.' },
        { nome: 'Seiva de Treant Desperto', uso: 'Bálsamo de casca de carvalho (+2 na CA enquanto durar o efeito).' }
      ]
    }
  ],

  receitas_basicas: [
    {
      id: 'rec_pocao_cura_comum',
      nome: 'Poção de Cura Comum (Healing Potion)',
      tier: 1,
      posto: 'Novato',
      cdBase: 12,
      tempoHoras: 4,
      custoPo: 25,
      substratoSugerido: 'Água Pura de Nascente & Álcool Neutro',
      reagentesSugeridos: 'Raiz-Sangue Menor macerada (2 doses)',
      efeito: 'Restaura 2d4 + 2 pontos de vida quando consumida (1 ação bônus).',
      descricao: 'Líquido vermelho rubi brilhante que fecha arranhões e cortes quase instantaneamente.'
    },
    {
      id: 'rec_fogo_alquimico',
      nome: 'Frasco de Fogo Alquímico',
      tier: 1,
      posto: 'Novato',
      cdBase: 13,
      tempoHoras: 4,
      custoPo: 25,
      substratoSugerido: 'Óleo Mineral Volátil',
      reagentesSugeridos: 'Enxofre Vulcânico e Fósforo Moído',
      efeito: 'Arremesso até 6m. Inflama ao contato com ar: causa 1d4 dano de fogo no início do turno do alvo até apagar (CD 10).',
      descricao: 'Fluido viscoso alaranjado acondicionado em frasco de vidro espesso lacrado com cera.'
    },
    {
      id: 'rec_acido_corrosivo',
      nome: 'Frasco de Ácido Corrosivo',
      tier: 1,
      posto: 'Novato',
      cdBase: 12,
      tempoHoras: 4,
      custoPo: 25,
      substratoSugerido: 'Água Pura de Nascente',
      reagentesSugeridos: 'Salitre Cristalino e Resíduo de Lodo',
      efeito: 'Arremesso até 6m: 2d6 de dano de ácido ou corrói fechaduras metálicas simples em 1 minuto.',
      descricao: 'Líquido verde efervescente que solta fumaça picante em contato com o ar.'
    },
    {
      id: 'rec_antitoxina',
      nome: 'Frasco de Antitoxina Universal',
      tier: 1,
      posto: 'Novato',
      cdBase: 13,
      tempoHoras: 6,
      custoPo: 50,
      substratoSugerido: 'Álcool Neutro Destilado',
      reagentesSugeridos: 'Fel de Serpente e Carvão Vegetal Puro',
      efeito: 'Concede Vantagem em testes de resistência contra Veneno por 1 hora.',
      descricao: 'Composto escuro e amargo que neutraliza toxinas no trato digestivo e sanguíneo.'
    },
    {
      id: 'rec_pocao_cura_maior',
      nome: 'Poção de Cura Maior (Greater Healing)',
      tier: 2,
      posto: 'Aprendiz',
      cdBase: 15,
      tempoHoras: 8,
      custoPo: 100,
      substratoSugerido: 'Água Destilada Purificada',
      reagentesSugeridos: 'Raiz-Sangue Purificada e Folha de Ginseng Dourado',
      efeito: 'Restaura 4d4 + 4 pontos de vida quando ingerida.',
      descricao: 'Poção vermelha intensa com partículas douradas suspensas em fluxo suave.'
    },
    {
      id: 'rec_elixir_forca',
      nome: 'Elixir da Força do Touro',
      tier: 2,
      posto: 'Aprendiz',
      cdBase: 15,
      tempoHoras: 8,
      custoPo: 120,
      substratoSugerido: 'Álcool Alquímico Tríplice',
      reagentesSugeridos: 'Folhas de Ginseng Dourado e Gordura de Fera Alfa',
      efeito: 'Aumenta a Força para 19 (ou concede +2 se já for maior) por 1 hora.',
      descricao: 'Bebida densa e adocicada com aroma de cevada tostada e mel.'
    },
    {
      id: 'rec_oleo_afiacao',
      nome: 'Óleo de Afiação Alquímica (Precision Oil)',
      tier: 2,
      posto: 'Aprendiz',
      cdBase: 14,
      tempoHoras: 6,
      custoPo: 80,
      substratoSugerido: 'Óleo Mineral e Resina de Pinheiro',
      reagentesSugeridos: 'Pó Diamantino de Polimento Mínimo',
      efeito: 'Aplicado em arma cortante/perfurante: +1 no ataque e dano por 1 hora.',
      descricao: 'Óleo translúcido que alinha micro-fraturas na lâmina restaurando o fio máximo.'
    },
    {
      id: 'rec_veneno_serpente',
      nome: 'Toxina Paralisante de Serpente',
      tier: 2,
      posto: 'Aprendiz',
      cdBase: 16,
      tempoHoras: 8,
      custoPo: 150,
      substratoSugerido: 'Gordura de Fera Refinada',
      reagentesSugeridos: 'Glândula de Veneno de Serpente Gigante e Beladona',
      efeito: 'Veneno de ferimento (3 doses): Alvo faz Salvaguarda CON CD 13 ou fica Envenenado e Paralisado por 1 min.',
      descricao: 'Graxa verde-esmeralda inodora que adere firmemente ao corte das lâminas.'
    },
    {
      id: 'rec_pocao_cura_superior',
      nome: 'Poção de Cura Superior (Superior Healing)',
      tier: 3,
      posto: 'Oficial',
      cdBase: 18,
      tempoHoras: 16,
      custoPo: 450,
      substratoSugerido: 'Água Destilada Purificada & Mercúrio Alquímico',
      reagentesSugeridos: 'Seiva de Mandrágora Mística e Pérola em Pó',
      efeito: 'Restaura 8d4 + 8 pontos de vida quando ingerida.',
      descricao: 'Líquido reluzente que pulsa suavemente como um batimento cardíaco sereno.'
    },
    {
      id: 'rec_pocao_invisibilidade',
      nome: 'Poção de Invisibilidade',
      tier: 3,
      posto: 'Oficial',
      cdBase: 19,
      tempoHoras: 20,
      custoPo: 500,
      substratoSugerido: 'Mercúrio Alquímico Purificado',
      reagentesSugeridos: 'Orvalho da Meia-Noite e Ectoplasma de Espectro',
      efeito: 'O usuário fica Invisível por 1 hora. O efeito cessa se o usuário atacar ou lançar uma magia.',
      descricao: 'Frasco que parece vazio à primeira vista; o líquido refrata a luz ambiente com perfeição.'
    },
    {
      id: 'rec_pocao_respiracao_aquatica',
      nome: 'Poção de Respiração Aquática',
      tier: 2,
      posto: 'Aprendiz',
      cdBase: 14,
      tempoHoras: 6,
      custoPo: 90,
      substratoSugerido: 'Água Pura de Nascente',
      reagentesSugeridos: 'Cristais de Salmaris Oceânicos e Algas Azuis',
      efeito: 'Permite respirar sob a água por 24 horas.',
      descricao: 'Líquido azulado com sabor de brisa marítima fresca.'
    },
    {
      id: 'rec_pocao_velocidade',
      nome: 'Poção de Velocidade (Haste Potion)',
      tier: 3,
      posto: 'Oficial',
      cdBase: 19,
      tempoHoras: 18,
      custoPo: 600,
      substratoSugerido: 'Mercúrio Alquímico Purificado',
      reagentesSugeridos: 'Sangue de Lobo Alfa e Poeira de Redemoinho',
      efeito: 'Concede os benefícios da magia Velocidade por 1 minuto sem exigir concentração.',
      descricao: 'Fluido amarelo estalando de energia estática; o frasco vibra na palma da mão.'
    },
    {
      id: 'rec_pocao_cura_suprema',
      nome: 'Poção de Cura Suprema (Supreme Healing)',
      tier: 4,
      posto: 'Mestre',
      cdBase: 22,
      tempoHoras: 32,
      custoPo: 1500,
      substratoSugerido: 'Água Primordial de Nascente Elemental',
      reagentesSugeridos: 'Sangue Celestial Dourado e Seiva da Árvore-da-Vida',
      efeito: 'Restaura 10d4 + 20 pontos de vida quando consumida.',
      descricao: 'O pináculo da arte da medicina mágica: regenera tecidos, ossos partidos e restaura o vigor pleno.'
    },
    {
      id: 'rec_oleo_forma_eterea',
      nome: 'Óleo de Forma Etérea (Oil of Etherealness)',
      tier: 4,
      posto: 'Mestre',
      cdBase: 23,
      tempoHoras: 36,
      custoPo: 1800,
      substratoSugerido: 'Éter Alquímico Volátil Cristalizado',
      reagentesSugeridos: 'Ectoplasma de Espectro e Pó de Halo Celestial',
      efeito: 'Reveste o corpo (10 min de aplicação): concede efeito da magia Forma Etérea por 1 hora.',
      descricao: 'Óleo cinza perolado que faz a pele de quem o aplica oscilar entre a realidade e o éter.'
    }
  ]
};

// ------------------------------------------------------------
// APÊNDICE 3: ENCANTAMENTO (Schools of Magic & Tier/Strand Properties)
// ------------------------------------------------------------
export const APENDICE3_ENCANTAMENTO = {
  escolas: [
    {
      id: 'abjuracao',
      nome: 'Abjuração',
      nomeEn: 'Abjuration',
      icone: '🛡️',
      cor: '#3b82f6',
      descricao: 'Magias protetoras, barreiras arcanas, resistências elementais e anulação de magias hostis.'
    },
    {
      id: 'conjuracao',
      nome: 'Conjuração',
      nomeEn: 'Conjuration',
      icone: '🌀',
      cor: '#06b6d4',
      descricao: 'Transporte de matéria, teleporte, passos dimensionais e invocação de criaturas e itens.'
    },
    {
      id: 'adivinhacao',
      nome: 'Adivinhação',
      nomeEn: 'Divination',
      icone: '👁️',
      cor: '#eab308',
      descricao: 'Visão além do alcance, detecção mágica, clarividência e antecipação nos combates.'
    },
    {
      id: 'encantamento_escola',
      nome: 'Encantamento',
      nomeEn: 'Enchantment',
      icone: '💖',
      cor: '#ec4899',
      descricao: 'Manipulação da vontade alheia, charme, fascínio e imposição de ordens místicas.'
    },
    {
      id: 'evocacao',
      nome: 'Evocação',
      nomeEn: 'Evocation',
      icone: '⚡',
      cor: '#f97316',
      descricao: 'Manipulação de energia pura (Fogo, Raio, Gelo, Força, Luz Radiante e Trovão).'
    },
    {
      id: 'ilusao',
      nome: 'Ilusão',
      nomeEn: 'Illusion',
      icone: '🎭',
      cor: '#8b5cf6',
      descricao: 'Engano sensorial, miragens, duplicatas visuais, disfarces e invisibilidade.'
    },
    {
      id: 'necromancia',
      nome: 'Necromancia',
      nomeEn: 'Necromancy',
      icone: '💀',
      cor: '#64748b',
      descricao: 'Manipulação de energias de vida e morte, drenagem vital e domínio do sepulcro.'
    },
    {
      id: 'transmutacao',
      nome: 'Transmutação',
      nomeEn: 'Transmutation',
      icone: '🌿',
      cor: '#10b981',
      descricao: 'Alteração das propriedades da matéria, ampliação de atributos físicos e velocidade.'
    }
  ],

  tiers_strands: [
    {
      tier: 1,
      strands: 'Strands 1-2',
      rotulo: 'Tier 1 (Strands 1-2)',
      classificacao: 'Encantamento Menor (Comum / Incomum)',
      cdBase: 14,
      tempoSugerido: '2 a 4 dias (8h/dia)',
      custoPoSugerido: 250,
      circuloMagia: 'Círculos 0 a 2 (Truques a 2º nível)',
      catalisadorSugerido: 'Cristal de Quartzo Claro, Prata Pura, Essência de Monstro Menor'
    },
    {
      tier: 2,
      strands: 'Strands 3-4',
      rotulo: 'Tier 2 (Strands 3-4)',
      classificacao: 'Encantamento Moderado (Incomum / Raro)',
      cdBase: 17,
      tempoSugerido: '6 a 10 dias',
      custoPoSugerido: 800,
      circuloMagia: 'Círculos 3 a 4',
      catalisadorSugerido: 'Safira ou Rubi Lapidado, Ouro Rúnico, Núcleo Elemental'
    },
    {
      tier: 3,
      strands: 'Strands 5-6',
      rotulo: 'Tier 3 (Strands 5-6)',
      classificacao: 'Encantamento Maior (Raro / Muito Raro)',
      cdBase: 20,
      tempoSugerido: '14 a 25 dias',
      custoPoSugerido: 3500,
      circuloMagia: 'Círculos 5 a 6',
      catalisadorSugerido: 'Diamante Puro, Placas de Adamantite, Essência Dracônica'
    },
    {
      tier: 4,
      strands: 'Strands 7-8',
      rotulo: 'Tier 4 (Strands 7-8)',
      classificacao: 'Encantamento Supremo (Muito Raro / Lendário)',
      cdBase: 24,
      tempoSugerido: '30 a 60 dias (1-2 meses)',
      custoPoSugerido: 15000,
      circuloMagia: 'Círculos 7 a 8',
      catalisadorSugerido: 'Diamante Astral, Chifre Abissal Maior, Penas de Deva Solar'
    },
    {
      tier: 5,
      strands: 'Strand 9',
      rotulo: 'Tier 5 (Strand 9)',
      classificacao: 'Encantamento Mítico / Arcano (Lendário / Artefato)',
      cdBase: 28,
      tempoSugerido: '90 a 180 dias',
      custoPoSugerido: 50000,
      circuloMagia: '9º Círculo / Trama Direta',
      catalisadorSugerido: 'Cristal Primordial de Trama, Sangue de Titã Antigo'
    }
  ],

  // Propriedades detalhadas organizadas por [Escola][Tier]
  tabela_propriedades: {
    abjuracao: {
      1: [
        { nome: 'Guarda Reflexa (+1 CA)', efeito: 'Concede +1 na CA como reação contra 1 ataque por descanso curto.', cargas: '1 por descanso', gatilho: 'Reação' },
        { nome: 'Escudo Protetor Simples', efeito: 'Permite lançar Escudo Arcano (Shield) 1x por dia.', cargas: '1/dia', gatilho: 'Reação' },
        { nome: 'Amuleto de Afastamento', efeito: 'Vantagem na primeira salvaguarda contra veneno ou paralisia a cada dia.', cargas: 'Passivo', gatilho: 'Permanente' }
      ],
      2: [
        { nome: 'Resistência Elemental Permanente', efeito: 'Concede Resistência a um tipo de dano elemental à escolha na criação (Fogo, Frio, Ácido ou Elétrico).', cargas: 'Passivo', gatilho: 'Permanente' },
        { nome: 'Barreira de Contra-Ataque', efeito: 'Permite lançar Contra-Mágica (Counterspell) de 3º nível gastando 1 carga (3 cargas diárias).', cargas: '3 cargas', gatilho: 'Reação' },
        { nome: 'Aura de Proteção +1', efeito: 'Concede +1 na CA e +1 em todas as salvaguardas enquanto o item for empunhado ou sintonizado.', cargas: 'Passivo', gatilho: 'Sintonização' }
      ],
      3: [
        { nome: 'Imunidade Elemental Temporária', efeito: 'O portador pode ativar Imunidade total ao elemento sintonizado por 1 minuto 1x por dia.', cargas: '1/dia', gatilho: 'Ação Bônus' },
        { nome: 'Baluarte de Invulnerabilidade Menor', efeito: 'Projeta um Globo de Invulnerabilidade Menor de 3 metros centralizado no item por 1 minuto.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Armadura da Resiliência Mágica', efeito: 'Vantagem em todas as jogadas de salvaguarda contra quaisquer feitiços e efeitos mágicos.', cargas: 'Passivo', gatilho: 'Sintonização' }
      ],
      4: [
        { nome: 'Espelho Arcano Refletor', efeito: 'Quando atingido por magia direcionada de até 5º nível, pode refleti-la de volta ao conjurador.', cargas: '2/dia', gatilho: 'Reação' },
        { nome: 'Aura de Santuário Supremo', efeito: 'Qualquer criatura hostil que tentar atacar o usuário deve fazer Salvaguarda de Sabedoria CD 18 para não perder a ação.', cargas: 'Passivo', gatilho: 'Permanente' }
      ],
      5: [
        { nome: 'Invulnerabilidade Absoluta Periódica', efeito: 'Com 1 reação, o portador fica totalmente invulnerável a todo tipo de dano e efeitos hostis por 1 rodada inteira.', cargas: '1/descanso longo', gatilho: 'Reação' },
        { nome: 'Anulação de Desencadeamento Planar', efeito: 'Cria uma zona permanente de 18 metros onde magias hostis de até 6º círculo simplesmente falham ao entrar.', cargas: 'Passivo', gatilho: 'Permanente' }
      ]
    },

    evocacao: {
      1: [
        { nome: 'Gume Elemental Menor (+1d4)', efeito: 'Adiciona +1d4 de dano de Fogo, Frio ou Raio a cada acerto da arma.', cargas: 'Passivo', gatilho: 'Acerto' },
        { nome: 'Luz Perene Radiante', efeito: 'Emite luz plena em 6 metros e penumbra em 6 metros adicionais à vontade.', cargas: 'Ilimitado', gatilho: 'Palavra de Comando' },
        { nome: 'Varinha de Dardos Mágicos', efeito: 'Possui 5 cargas; gasta 1 carga para lançar Mísseis Mágicos (1º círculo).', cargas: '5 cargas', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Lâmina Flamejante / Glacial (+1d6)', efeito: 'Causa +1d6 de dano elemental permanente em todos os ataques e emite calor/frio no entorno.', cargas: 'Passivo', gatilho: 'Acerto' },
        { nome: 'Detonação Arcana (Bola de Fogo)', efeito: 'Permite lançar Bola de Fogo ou Relâmpago (3º nível, CD 15) 1x por dia.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Arma de Impacto Trovejante', efeito: 'Em acerto crítico, causa +2d8 de trovão e empurra o alvo 4,5 metros para trás.', cargas: 'Passivo', gatilho: 'Crítico' }
      ],
      3: [
        { nome: 'Torrente Destrutiva (+2d6)', efeito: 'Adiciona +2d6 de dano de Fogo ou Raio por golpe e inflige cegueira temporária no alvo em acertos críticos.', cargas: 'Passivo', gatilho: 'Acerto' },
        { nome: 'Cone de Frio / Tempestade de Gelo', efeito: 'Permite lançar Cone de Frio (5º círculo, CD 17) gastando 2 de suas 6 cargas diárias.', cargas: '6 cargas', gatilho: 'Ação' },
        { nome: 'Lança Solar Radiante', efeito: 'Causa +2d8 de dano radiante extra contra mortos-vivos e ínferos e cega criaturas sensíveis à luz.', cargas: 'Passivo', gatilho: 'Acerto' }
      ],
      4: [
        { nome: 'Prisma Devastador (+3d6)', efeito: 'Arma +3 que adiciona +3d6 de força destrutiva ignorando quaisquer resistências elementais comuns.', cargas: 'Passivo', gatilho: 'Permanente' },
        { nome: 'Tempestade de Fogo / Terremoto', efeito: 'Lança Tempestade de Fogo (7º nível, CD 19) com recuperação de 1 carga a cada aurora.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      5: [
        { nome: 'Lâmina Vorpal da Ruína Primordial', efeito: 'Em um 20 natural no d20, decapita o alvo instantaneamente ou inflige 12d10 de dano de Força pura.', cargas: 'Passivo', gatilho: '20 Natural' },
        { nome: 'Chama Cósmica Eterna', efeito: 'Qualquer dano de fogo ou luz causado pelo item incinera matéria molecular sem deixar cinzas; dano nunca pode ser reduzido.', cargas: 'Passivo', gatilho: 'Permanente' }
      ]
    },

    conjuracao: {
      1: [
        { nome: 'Passo Rápido Dimensional', efeito: 'Permite lançar Passo Nebuloso (Misty Step) 1x por descanso curto.', cargas: '1/descanso curto', gatilho: 'Ação Bônus' },
        { nome: 'Corda Mágica Estendida', efeito: 'Cria uma corda de escalada mágica inextensível de até 18 metros sob comando.', cargas: 'Ilimitado', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Salto Entre Sombras (3 Cargas)', efeito: 'Teleporta até 9 metros para qualquer espaço desocupado na penumbra ou escuridão que possa ver.', cargas: '3 cargas', gatilho: 'Ação Bônus' },
        { nome: 'Invocação de Familiar / Montaria Arcana', efeito: 'Convoca um corcel espectral veloz que dura 8 horas sem cansaço.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      3: [
        { nome: 'Porta Dimensional Instantânea', efeito: 'Permite lançar Porta Dimensional (Dimension Door) 2x ao dia sem componentes.', cargas: '2/dia', gatilho: 'Ação' },
        { nome: 'Invocação Elemental Guardião', efeito: 'Convoca 1 Elemental correspondente que obedece a ordens por até 1 hora.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      4: [
        { nome: 'Teleporte de Grupo Sem Falhas', efeito: 'Lança Teleporte para até 8 criaturas para círculo de teletransporte conhecido.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Prisão Dimensional Eterna', efeito: 'Bane o alvo atingido para labirinto extradimensional (magia Labirinto, CD 18).', cargas: '1/dia', gatilho: 'Acerto' }
      ],
      5: [
        { nome: 'Passagem Astral Irrestrita', efeito: 'Abre portal permanente ou temporário entre planos do multiverso sem erro de desvio.', cargas: '1/dia', gatilho: 'Ação' }
      ]
    },

    adivinhacao: {
      1: [
        { nome: 'Olhar do Falcão (+2 Percepção)', efeito: 'Concede +2 em Percepção Passiva e visão apurada a até 1 quilômetro.', cargas: 'Passivo', gatilho: 'Permanente' },
        { nome: 'Detector de Magia / Veneno', efeito: 'Permite lançar Detectar Magia ou Detectar Veneno à vontade.', cargas: 'Ilimitado', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Visão no Escuro Superior (36m)', efeito: 'Concede visão no escuro total mágica que penetra inclusive escuridão mágica.', cargas: 'Passivo', gatilho: 'Permanente' },
        { nome: 'Ver o Invisível (3 Cargas)', efeito: 'Ativa visão do invisível e criaturas no plano etéreo por 1 hora.', cargas: '3 cargas', gatilho: 'Ação' }
      ],
      3: [
        { nome: 'Clarividência Espacial Ampla', efeito: 'Permite criar sensor invisível a até 1,5 km de distância para espiar som e imagem.', cargas: '2/dia', gatilho: 'Ação' },
        { nome: 'Antecipação Marcial (+3 Iniciativa)', efeito: 'Concede +3 na iniciativa e impede o portador de ser surpreendido.', cargas: 'Passivo', gatilho: 'Permanente' }
      ],
      4: [
        { nome: 'Visão Verdadeira (True Seeing)', efeito: 'Concede Visão da Verdade em 36 metros por 1 hora (revela ilusões, metamorfos e o etéreo).', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Presságio do Destino', efeito: 'Gera 2 d20 de presságio por dia que podem substituir qualquer rolagem do usuário ou alvo visível.', cargas: '2/dia', gatilho: 'Reação' }
      ],
      5: [
        { nome: 'Onisciência Sensorial de Combate', efeito: 'O usuário não pode sofrer ataques com vantagem e todos os seus ataques ignoram camuflagem e cobertura.', cargas: 'Passivo', gatilho: 'Permanente' }
      ]
    },

    encantamento_escola: {
      1: [
        { nome: 'Charme Amigável', efeito: 'Permite lançar Enfeitiçar Pessoa (Charm Person, CD 13) 1x por dia.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Comando Imperativo', efeito: 'Permite lançar Comando (Command, CD 13) 2x por descanso longo.', cargas: '2/descanso', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Aura de Fascinar / Sugestão', efeito: 'Lança Sugestão (Suggestion, CD 15) gastando 1 das 3 cargas do item.', cargas: '3 cargas', gatilho: 'Ação' },
        { nome: 'Presença Intimidadora (+2 Carisma)', efeito: 'Concede +2 em testes de Persuasão e Intimidação e vantagem contra amedrontamento.', cargas: 'Passivo', gatilho: 'Permanente' }
      ],
      3: [
        { nome: 'Paralisia Mental (Hold Monster)', efeito: 'Permite lançar Imobilizar Monstro (Hold Monster, CD 17) 1x por dia.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Modificar Memória Pontual', efeito: 'Permite alterar até 10 minutos de memória recente de um alvo encantado.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      4: [
        { nome: 'Domínio Mental Absoluto', efeito: 'Lança Dominar Monstro (Dominate Monster, CD 19) com telepatia direta e comando irrestrito.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      5: [
        { nome: 'Comando Psíquico de Regência', efeito: 'Pode emitir ordem irresistível para até 10 criaturas simultâneas (Salvo Salvaguarda de Sabedoria CD 22).', cargas: '1/descanso longo', gatilho: 'Ação' }
      ]
    },

    ilusao: {
      1: [
        { nome: 'Disfarce Mágico Ilusório', efeito: 'Permite alterar a aparência física e vestimentas (Disfarçar-se) à vontade.', cargas: 'Ilimitado', gatilho: 'Ação' },
        { nome: 'Som e Imagem Silenciosa', efeito: 'Projeta miragem visual simples de até 4,5 metros por 10 minutos.', cargas: '2/dia', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Invisibilidade Menor (3 Cargas)', efeito: 'Concede invisibilidade ao portador por até 1 hora ou até realizar um ataque.', cargas: '3 cargas', gatilho: 'Ação' },
        { nome: 'Duplicatas Reflexas (Mirror Image)', efeito: 'Cria 3 duplicatas ilusórias protetoras com 1 ação bônus 1x por descanso curto.', cargas: '1/descanso curto', gatilho: 'Ação Bônus' }
      ],
      3: [
        { nome: 'Invisibilidade Maior de Combate', efeito: 'Torna o usuário invisível por 1 minuto sem quebrar a invisibilidade ao atacar ou conjurar.', cargas: '1/dia', gatilho: 'Ação' },
        { nome: 'Miragem Aterrorizante', efeito: 'Projeta medo ilusório causando 4d10 de dano psíquico e condição Amedrontado em área.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      4: [
        { nome: 'Manto de Simulação Perfeita', efeito: 'Cria uma cópia ilusória quase sólida com metade dos pontos de vida do usuário.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      5: [
        { nome: 'Realidade Ilusória Transmutada', efeito: 'Torna ilusões criadas pelo usuário temporariamente sólidas e tangíveis no mundo real.', cargas: 'Passivo', gatilho: 'Permanente' }
      ]
    },

    necromancia: {
      1: [
        { nome: 'Toque Vampírico Menor (+1d4)', efeito: 'Em acerto crítico, o usuário recupera metade do dano necrótico causado em pontos de vida.', cargas: 'Passivo', gatilho: 'Crítico' },
        { nome: 'Sentir Mortos-Vivos', efeito: 'Detecta a presença de mortos-vivos e túmulos a até 30 metros.', cargas: 'Ilimitado', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Infusão Necrótica (+1d6)', efeito: 'Arma causa +1d6 de dano necrótico e alvos mortos por ela não podem ser reanimados como zumbis comuns.', cargas: 'Passivo', gatilho: 'Acerto' },
        { nome: 'Proteção Contra Apodrecimento', efeito: 'Imunidade a dano necrótico mundano e imunidade à condição Envenenado por podridão.', cargas: 'Passivo', gatilho: 'Permanente' }
      ],
      3: [
        { nome: 'Dreno Vital Vampírico (+2d6)', efeito: 'Causa +2d6 de dano necrótico e cura o portador em valor igual ao dano extra 3x ao dia.', cargas: '3/dia', gatilho: 'Acerto' },
        { nome: 'Comando Sobre Carniçais', efeito: 'Permite impor vontade sobre mortos-vivos menores sem controle mástil.', cargas: '2/dia', gatilho: 'Ação' }
      ],
      4: [
        { nome: 'Lâmina do Dedo da Morte', efeito: 'Dispara raio de 7d8+30 de dano necrótico 1x ao dia; humanoid morto levanta como zumbi perpétuo.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      5: [
        { nome: 'Foice Ceifadora de Almas', efeito: 'Criaturas abatidas têm suas almas capturadas na arma concedendo +20 PV temporários ao portador.', cargas: 'Passivo', gatilho: 'Abater Alvo' }
      ]
    },

    transmutacao: {
      1: [
        { nome: 'Salto e Passada Longa (+3m)', efeito: 'Aumenta o deslocamento do portador em 3 metros e triplica a distância de salto.', cargas: 'Passivo', gatilho: 'Permanente' },
        { nome: 'Reparo Espontâneo Mágico', efeito: 'Permite consertar pequenos danos físicos e fissuras do item automaticamente (Mending).', cargas: 'Ilimitado', gatilho: 'Ação' }
      ],
      2: [
        { nome: 'Couro de Ferro / Pele de Pedra', efeito: 'Gasta 1 carga para ganhar resistência a dano cortante, perfurante e de impacto não-mágico por 10 min.', cargas: '2 cargas', gatilho: 'Ação' },
        { nome: 'Arma Transmutável de Combate', efeito: 'Com 1 ação bônus, muda a forma da arma (ex: de espada longa para lança ou arco curto).', cargas: 'Ilimitado', gatilho: 'Ação Bônus' }
      ],
      3: [
        { nome: 'Voo Sem Asas (Fly)', efeito: 'Concede deslocamento de vôo de 18 metros por até 10 minutos (3 cargas diárias).', cargas: '3 cargas', gatilho: 'Ação' },
        { nome: 'Força dos Titãs (+2 Força / CON)', efeito: 'Concede +2 de atributo físico permanente enquanto empunhado ou sintonizado.', cargas: 'Passivo', gatilho: 'Sintonização' }
      ],
      4: [
        { nome: 'Metamorfose Superior (Polymorph)', efeito: 'Permite lançar Metamorfose em si mesmo assumindo forma de fera de ND até igual ao nível do portador.', cargas: '1/dia', gatilho: 'Ação' }
      ],
      5: [
        { nome: 'Transmutação da Matéria Primordial', efeito: 'Permite alterar a composição elementar de qualquer objeto de até 1 tonelada (chumbo em ouro, rocha em ferro).', cargas: '1/dia', gatilho: 'Ação' }
      ]
    }
  }
};

// Funções de busca e alimentação rápida para os Wizards
export function obterMateriaisApendice1(categoria = 'todos', tier = 0, busca = '') {
  let list = [];
  if (categoria === 'todos' || categoria === 'metal') list = list.concat(APENDICE1_MATERIAIS.metais);
  if (categoria === 'todos' || categoria === 'gema') list = list.concat(APENDICE1_MATERIAIS.gemas);
  if (categoria === 'todos' || categoria === 'fibra_madeira') list = list.concat(APENDICE1_MATERIAIS.fibras_madeiras);
  if (categoria === 'todos' || categoria === 'criatura_exotica') list = list.concat(APENDICE1_MATERIAIS.criaturas_exoticas);

  if (tier > 0) {
    list = list.filter(m => m.tier === Number(tier));
  }
  if (busca && busca.trim()) {
    const q = busca.toLowerCase().trim();
    list = list.filter(m =>
      m.nome.toLowerCase().includes(q) ||
      m.propriedades.toLowerCase().includes(q) ||
      (m.usos && m.usos.toLowerCase().includes(q))
    );
  }
  return list;
}

export function obterSubstratosApendice2(tier = 0) {
  if (!tier) return APENDICE2_ALQUIMIA.substratos;
  return APENDICE2_ALQUIMIA.substratos.filter(s => s.tier === Number(tier));
}

export function obterReagentesApendice2(tier = 0, tipoEfeito = 'todos') {
  let list = APENDICE2_ALQUIMIA.reagentes;
  if (tier > 0) list = list.filter(r => r.tier === Number(tier));
  if (tipoEfeito && tipoEfeito !== 'todos') {
    list = list.filter(r => r.tipoEfeito.toLowerCase().includes(tipoEfeito.toLowerCase()));
  }
  return list;
}

export function obterReceitasBasicasApendice2(tier = 0) {
  if (!tier) return APENDICE2_ALQUIMIA.receitas_basicas;
  return APENDICE2_ALQUIMIA.receitas_basicas.filter(r => r.tier === Number(tier));
}

export function obterPropriedadesApendice3(escola = 'abjuracao', tier = 1) {
  const escData = APENDICE3_ENCANTAMENTO.tabela_propriedades[escola];
  if (!escData) return [];
  return escData[tier] || [];
}
