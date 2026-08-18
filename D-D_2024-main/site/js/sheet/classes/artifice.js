// ============================================================
// Progressao e recursos do Artifice (D&D 2024 Playtest / Revisão)
//
// Consultado pela ficha, pelos descansos e pelas habilidades ativas.
// ============================================================
import { bonusProficiencia, calcMod } from '../../utils.js';
import { char, classeData } from '../estado.js';

export function getProgressaoArtifice() {
  if (char?.classe !== 'Artífice' || !classeData?.tabela_caracteristicas) return null;
  const nivel = char.nivel || 1;
  const row = classeData.tabela_caracteristicas.find(r => parseInt(r['Nível']) === nivel);
  if (!row) return null;

  let itensMagicosMax = parseInt(row['Itens Mágicos'] || row['Itens Infundidos']) || 0;
  // Armeiro nv9+: Replicar Armadura concede +1 item mágico adicional da categoria Armadura
  if (char.subclasse === 'Armeiro' && nivel >= 9) {
    itensMagicosMax += 1;
  }

  return {
    projetosConhecidos: parseInt(row['Projetos Conhecidos']) || 0,
    itensMagicosMax,
    itensInfundidosMax: itensMagicosMax,
    truquesMax: parseInt(row['Truques']) || 2,
    magiasPrepMax: parseInt(row['Magias Preparadas']) || 2
  };
}

export function getEstadoRecursosArtifice() {
  if (char?.classe !== 'Artífice') return null;
  if (!char.recursos) char.recursos = {};
  if (!char.recursos.artifice) char.recursos.artifice = {};

  const nivel = char.nivel || 1;
  const modInt = Math.max(1, calcMod(char.atributos?.inteligencia || 10));
  const bp = bonusProficiencia(nivel);

  // Funilaria Mágica (nv 1+)
  if (typeof char.recursos.artifice.funilaria_usos_gastos !== 'number') {
    char.recursos.artifice.funilaria_usos_gastos = 0;
  }
  const funilariaMax = modInt;
  const funilariaDisponiveis = Math.max(0, funilariaMax - char.recursos.artifice.funilaria_usos_gastos);

  // Lampejo de Genialidade (nv 7+)
  if (typeof char.recursos.artifice.lampejo_usos_gastos !== 'number') {
    char.recursos.artifice.lampejo_usos_gastos = 0;
  }
  const lampejoMax = nivel >= 7 ? modInt : 0;
  const lampejoDisponiveis = Math.max(0, lampejoMax - char.recursos.artifice.lampejo_usos_gastos);

  // Item Armazenador de Magia (nv 11+)
  if (typeof char.recursos.artifice.item_armazenador_usos_gastos !== 'number') {
    char.recursos.artifice.item_armazenador_usos_gastos = 0;
  }
  const itemArmazenadorMax = nivel >= 11 ? Math.max(2, 2 * modInt) : 0;
  const itemArmazenadorDisponiveis = Math.max(0, itemArmazenadorMax - char.recursos.artifice.item_armazenador_usos_gastos);

  // Subclasses
  if (!char.recursos.artifice.subclasses) {
    char.recursos.artifice.subclasses = {
      alquimista: {
        restauracao_menor_gastos: 0
      },
      armeiro: {
        modelo: 'Guardião',
        estatura_gigante_gastos: 0,
        reacao_aperfeicoada_gastos: 0
      },
      artilheiro: {
        canhao_gratis_usado: false,
        tipo_canhao: 'Balestra de Energia'
      },
      ferreiro_batalha: {
        solavanco_arcano_gastos: 0,
        golpe_arcano_gastos: 0,
        defensor_aco_pv: 5 + 5 * nivel
      }
    };
  }

  const sub = char.recursos.artifice.subclasses;

  // Garantir modelo válido
  if (sub.armeiro && !['Encouraçado', 'Guardião', 'Infiltrador'].includes(sub.armeiro.modelo)) {
    sub.armeiro.modelo = 'Guardião';
  }

  // Defensor de Aço PV
  const defensorPvMax = 5 + 5 * nivel;
  const defensorPvAtual = typeof sub.ferreiro_batalha?.defensor_aco_pv === 'number'
    ? sub.ferreiro_batalha.defensor_aco_pv
    : (typeof sub.ferreiro_batalha?.defensor_ferro_pv === 'number' ? sub.ferreiro_batalha.defensor_ferro_pv : defensorPvMax);

  // Elixires criados no descanso longo: 2 base, 3 no nv 5, 4 no nv 9, 5 no nv 15
  const elixiresDescanso = nivel >= 15 ? 5 : (nivel >= 9 ? 4 : (nivel >= 5 ? 3 : 2));

  return {
    funilariaMax,
    funilariaGastos: char.recursos.artifice.funilaria_usos_gastos,
    funilariaDisponiveis,
    lampejoMax,
    lampejoGastos: char.recursos.artifice.lampejo_usos_gastos,
    lampejoDisponiveis,
    itemArmazenadorMax,
    itemArmazenadorGastos: char.recursos.artifice.item_armazenador_usos_gastos,
    itemArmazenadorDisponiveis,
    magiaArmazenada: char.recursos.artifice.magia_armazenada || null,
    subclasses: {
      alquimista: {
        elixiresDescanso,
        restauracaoMenorMax: modInt,
        restauracaoMenorGastos: sub.alquimista?.restauracao_menor_gastos || 0,
        restauracaoMenorDisponiveis: Math.max(0, modInt - (sub.alquimista?.restauracao_menor_gastos || 0))
      },
      armeiro: {
        modelo: sub.armeiro?.modelo || 'Guardião',
        estaturaGiganteMax: modInt,
        estaturaGiganteGastos: sub.armeiro?.estatura_gigante_gastos || 0,
        estaturaGiganteDisponiveis: Math.max(0, modInt - (sub.armeiro?.estatura_gigante_gastos || 0)),
        reacaoAperfeicoadaMax: modInt,
        reacaoAperfeicoadaGastos: sub.armeiro?.reacao_aperfeicoada_gastos || 0,
        reacaoAperfeicoadaDisponiveis: Math.max(0, modInt - (sub.armeiro?.reacao_aperfeicoada_gastos || 0))
      },
      artilheiro: {
        canhaoGratisUsado: !!sub.artilheiro?.canhao_gratis_usado,
        tipoCanhao: sub.artilheiro?.tipo_canhao || 'Balestra de Energia'
      },
      ferreiro_batalha: {
        solavancoArcanoMax: modInt,
        solavancoArcanoGastos: sub.ferreiro_batalha?.solavanco_arcano_gastos ?? sub.ferreiro_batalha?.golpe_arcano_gastos ?? 0,
        solavancoArcanoDisponiveis: Math.max(0, modInt - (sub.ferreiro_batalha?.solavanco_arcano_gastos ?? sub.ferreiro_batalha?.golpe_arcano_gastos ?? 0)),
        golpeArcanoMax: modInt,
        golpeArcanoGastos: sub.ferreiro_batalha?.solavanco_arcano_gastos ?? sub.ferreiro_batalha?.golpe_arcano_gastos ?? 0,
        golpeArcanoDisponiveis: Math.max(0, modInt - (sub.ferreiro_batalha?.solavanco_arcano_gastos ?? sub.ferreiro_batalha?.golpe_arcano_gastos ?? 0)),
        defensorAcoPvMax: defensorPvMax,
        defensorAcoPvAtual: defensorPvAtual,
        defensorFerroPvMax: defensorPvMax,
        defensorFerroPvAtual: defensorPvAtual
      }
    }
  };
}
