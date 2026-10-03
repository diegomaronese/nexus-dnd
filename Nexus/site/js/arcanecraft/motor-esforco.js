// ============================================================
// Arcane Crafts Compendium - Motor de Esforço Acumulado & Ciclos
// Simulação de Múltiplas Rolagens, Fadiga e Exaustão (D&D 5.5e)
// ============================================================
import { escHtml } from '../utils.js';
import { GRAUS_MATERIAL, TABELA_VALORES_CRAFTING } from './regras-dados-oficiais.js';

/**
 * Calcula a meta de esforço total (Unit Effort - UE / Progress Target)
 * baseada na quantidade e tipo de materiais, grau de qualidade e multiplicadores.
 */
export function calcularEsforcoAlvo(tipoProcesso, state, calc) {
  if (tipoProcesso === 'alchemy') {
    // Alquimia: Baseada em Nível de Instabilidade, volume de substrato (150 ml) e reagentes
    const ilBase = Number(calc?.cdFinalCalculada || state.cdBase || 14);
    const ordemGraus = ['baixa', 'media', 'alta', 'suprema'];
    const menorGrau = calc?.menorGrau || 'media';
    const idxGrau = ordemGraus.indexOf(menorGrau);
    // Menor pureza exige mais ciclos de purificação e decantação
    const fatorGrau = (3 - idxGrau) * 5; // baixa = 15, media = 10, alta = 5, suprema = 0
    const qtdReagentes = (state.reagenteAtivo ? 4 : 0) + (state.catalisador ? 4 : 0) + (state.estabilizador && state.estabilizador !== 'nenhum' ? 4 : 0);
    return Math.max(16, Math.round(ilBase * 1.6 + fatorGrau + qtdReagentes));
  }

  if (tipoProcesso === 'enchanting') {
    // Encantamento: Baseado na raridade e dias de ritual da Trama
    const cdsRaridade = {
      'Comum': 28,
      'Incomum': 48,
      'Rara': 76,
      'Muito Rara': 118,
      'Lendária': 175,
      'Artefato': 240
    };
    const raridade = state.raridade || state.raridadeAlvo || 'Incomum';
    const baseRaridade = cdsRaridade[raridade] || 48;
    const diasRitual = Math.max(1, Number(state.tempoDiasRitual || 3));
    const modGrauEssencia = state.grauEssencia === 'suprema' ? 12 : state.grauEssencia === 'alta' ? 8 : state.grauEssencia === 'media' ? 4 : 0;
    return Math.max(24, Math.round(baseRaridade + diasRitual * 5 + modGrauEssencia));
  }

  // Crafting (Forja, Marcenaria, Joalheria, Armaduras)
  // Baseado no peso do item (em cotas de 1/2 kg / 0.5 kg) e no tier dos materiais
  const pesoKg = Math.max(0.5, Number(state.pesoItem || 1.5));
  const cotasPeso = Math.max(1, Math.round(pesoKg * 2));

  // Extrai quantidade numérica de cotas/unidades dos materiais descritos
  const parseQtd = (str) => {
    if (!str) return 2;
    const m = String(str).match(/(\d+(?:[.,]\d+)?)/);
    return m ? Math.max(1, parseFloat(m[1].replace(',', '.'))) : 2;
  };
  const qtd1 = parseQtd(state.qtdPrimaria);
  const qtd2 = parseQtd(state.qtdSecundaria);
  const cotasTotais = Math.max(cotasPeso, Math.round(qtd1 + qtd2));

  // Determina o tier do material e o Esforço Unitário (UE) conforme a TABELA_VALORES_CRAFTING
  let ueUnitario = 6; // Padrão Common (6 UE por 1/2 kg)
  if (state.materialEspecial && state.materialEspecial !== 'nenhum') {
    if (state.materialEspecial === 'adamantite') ueUnitario = 35; // Mythic
    else if (state.materialEspecial === 'mitral') ueUnitario = 25; // Exotic
    else if (state.materialEspecial === 'prata') ueUnitario = 12; // Uncommon
    else ueUnitario = 18; // Rare
  } else {
    const grauP = state.grauPrimario || 'media';
    if (grauP === 'suprema') ueUnitario = 20;
    else if (grauP === 'alta') ueUnitario = 14;
    else if (grauP === 'media') ueUnitario = 8;
    else ueUnitario = 5;
  }

  // Múltiplos materiais: cada material adicional além do primeiro aumenta a complexidade
  let extraMateriais = 0;
  if (state.materialSecundario) extraMateriais += 4;
  if (state.materialEspecial && state.materialEspecial !== 'nenhum') extraMateriais += 8;

  // Modificador de tipo de item
  let extraItem = 4;
  const itemNome = (state.nomeItem || '').toLowerCase();
  if (itemNome.includes('placas') || itemNome.includes('armadura pesada')) extraItem = 25;
  else if (itemNome.includes('cota de malha') || itemNome.includes('meia-armadura')) extraItem = 15;
  else if (itemNome.includes('escudo') || itemNome.includes('elmo')) extraItem = 8;
  else if (itemNome.includes('espada') || itemNome.includes('machado') || itemNome.includes('arco')) extraItem = 10;

  // Multiplicador de Qualidade (+1, +2, +3) do Livro de Regras
  let multQualidade = 1;
  if (state.qualidadeItem === 'plus1') multQualidade = 2.0;
  if (state.qualidadeItem === 'plus2') multQualidade = 3.0;
  if (state.qualidadeItem === 'plus3') multQualidade = 5.0;

  const totalCalculado = Math.round((cotasTotais * ueUnitario + extraItem + extraMateriais) * multQualidade);
  // Garante escala consistente para jogabilidade: entre 12 e 220 UE
  return Math.min(240, Math.max(12, totalCalculado));
}

/**
 * Cria ou restaura uma sessão de esforço acumulado para o processo
 */
export function inicializarSessaoEsforco(tipoProcesso, state, calc) {
  const esforcoAlvo = calcularEsforcoAlvo(tipoProcesso, state, calc);

  return {
    tipoProcesso,
    esforcoAlvo,
    progressoAtual: 0,
    nivelExaustao: 0, // 0 a 6 (D&D 5.5e: -2 por nível em todos os d20)
    ciclosConsecutivosSemDescanso: 0,
    horasDecorridas: 0,
    diasDecorridos: 0,
    ciclosExecutados: [],
    concluido: false,
    colapsado: false,
    obraPrimaObtida: false,
    menorGrau: calc?.menorGrau || 'media',
    ultimoCiclo: null
  };
}

/**
 * Executa uma única rolagem de ciclo de trabalho
 */
export function rolarCicloTrabalho(sessao, config) {
  if (sessao.concluido || sessao.colapsado) return sessao;

  const numCiclo = sessao.ciclosExecutados.length + 1;
  const cdCiclo = Number(config.cdCiclo || 14);
  const bonusBase = Number(config.bonusBase || 0);
  const extraManual = Number(config.modificadorExtraManual || 0);
  const modoRolagem = config.modoRolagem || 'normal';

  // Penalidade de Exaustão oficial D&D 5.5e: -2 por nível em todos os testes d20
  const penalidadeExaustao = sessao.nivelExaustao * 2;
  const modTotalEfetivo = bonusBase + extraManual - penalidadeExaustao;

  // Rolagem de dados (com suporte a vantagem / desvantagem)
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  let dadoEscolhido = r1;
  if (modoRolagem === 'vantagem') dadoEscolhido = Math.max(r1, r2);
  if (modoRolagem === 'desvantagem') dadoEscolhido = Math.min(r1, r2);

  const total = dadoEscolhido + modTotalEfetivo;
  const obraPrima = dadoEscolhido === 20;
  const falhaCritica = dadoEscolhido === 1;
  const sucesso = !falhaCritica && (obraPrima || total >= cdCiclo);

  // Incrementa tempo: 4h por ciclo de oficina (ou 1 dia em encantamento)
  if (sessao.tipoProcesso === 'enchanting') {
    sessao.diasDecorridos += 1;
    sessao.horasDecorridas += 8;
  } else {
    sessao.horasDecorridas += 4;
    sessao.diasDecorridos = Math.ceil(sessao.horasDecorridas / 8);
  }
  sessao.ciclosConsecutivosSemDescanso++;

  let progressoCiclo = 0;
  let exaustaoAdquirida = 0;
  let eventoDesc = '';

  if (obraPrima) {
    sessao.obraPrimaObtida = true;
    // 20 Natural: Golpe de mestre, progresso turbinado e sem estresse
    progressoCiclo = Math.round(cdCiclo * 0.7) + 12;
    eventoDesc = `🌟 Golpe de Mestre (20 Natural)! Inspiração lendária na execução: avanço massivo de +${progressoCiclo} UE sem nenhum desgaste.`;
  } else if (falhaCritica) {
    // 1 Natural: Desastre técnico, trinca ou fumaça
    progressoCiclo = 0;
    // Salvaguarda de Constituição para evitar exaustão
    const conSave = Math.floor(Math.random() * 20) + 1 + 2 - penalidadeExaustao;
    const conCd = 13 + sessao.nivelExaustao;
    if (conSave < conCd) {
      exaustaoAdquirida = 1;
      sessao.nivelExaustao = Math.min(6, sessao.nivelExaustao + 1);
      eventoDesc = `💥 Falha Crítica (1 Natural)! Falha técnica súbita e esforço extenuante para salvar a bancada (+0 UE). Salvaguarda de CON falhou (${conSave} vs CD ${conCd}): +1 Nível de Exaustão! Penalidade cumulativa de -${sessao.nivelExaustao * 2} em todas as rolagens seguintes.`;
    } else {
      eventoDesc = `💥 Falha Crítica (1 Natural)! A peça trincou e precisou ser desbastada (+0 UE), mas o artífice resistiu ao cansaço (CON ${conSave} superou CD ${conCd}).`;
    }
  } else if (sucesso) {
    const margem = total - cdCiclo;
    progressoCiclo = Math.max(5, 5 + Math.floor(margem * 0.9));

    // Esforço contínuo: a cada 3 ciclos sem pausa, teste de CON contra estafa
    if (sessao.ciclosConsecutivosSemDescanso >= 3) {
      const conSave = Math.floor(Math.random() * 20) + 1 + 2 - penalidadeExaustao;
      const conCd = 12 + sessao.nivelExaustao;
      if (conSave < conCd) {
        exaustaoAdquirida = 1;
        sessao.nivelExaustao = Math.min(6, sessao.nivelExaustao + 1);
        sessao.ciclosConsecutivosSemDescanso = 0;
        eventoDesc = `✓ Ciclo Eficiente (+${progressoCiclo} UE)! Porém o ritmo contínuo cobrou seu preço físico: salvaguarda de CON falhou (${conSave} vs CD ${conCd}) e o artífice sofreu +1 Nível de Exaustão (Penalidade atual: -${sessao.nivelExaustao * 2} nas próximas rolagens).`;
      } else {
        eventoDesc = `✓ Ciclo Eficiente (+${progressoCiclo} UE)! Trabalho preciso e vigor mantido contra a fadiga (CON ${conSave} vs CD ${conCd}).`;
      }
    } else {
      eventoDesc = `✓ Trabalho Preciso (+${progressoCiclo} UE): Ferramentas calibradas e avanço constante rumo à conclusão.`;
    }
  } else {
    // Falha comum
    const deficit = cdCiclo - total;
    if (deficit <= 2) {
      // Falha marginal: gera progresso pequeno (1 a 2 UE)
      progressoCiclo = Math.max(1, Math.floor(total / 8));
      eventoDesc = `⚠️ Ritmo Lento (+${progressoCiclo} UE): Ajustes minuciosos e correções exigiram trabalho extra na bancada.`;
    } else {
      // Falha acentuada: 0 de progresso e teste de CON contra estresse/fadiga
      progressoCiclo = 0;
      const conSave = Math.floor(Math.random() * 20) + 1 + 2 - penalidadeExaustao;
      const conCd = 11 + Math.floor(cdCiclo / 6) + sessao.nivelExaustao;
      if (conSave < conCd) {
        exaustaoAdquirida = 1;
        sessao.nivelExaustao = Math.min(6, sessao.nivelExaustao + 1);
        eventoDesc = `✗ Falha Extenuante (+0 UE vs CD ${cdCiclo}): A matéria não cedeu à forja. O esforço foi exaustivo (CON falhou: ${conSave} vs CD ${conCd}): +1 Nível de Exaustão! As próximas rolagens sofrerão penalidade de -${sessao.nivelExaustao * 2} no d20.`;
      } else {
        eventoDesc = `✗ Ciclo Improdutivo (+0 UE vs CD ${cdCiclo}): Nenhum avanço obtido neste turno, mas o artífice suportou o cansaço (CON ${conSave} superou CD ${conCd}).`;
      }
    }
  }

  // Atualiza progresso acumulado
  sessao.progressoAtual = Math.min(sessao.esforcoAlvo, sessao.progressoAtual + progressoCiclo);

  // Checa colapso ou conclusão
  if (sessao.nivelExaustao >= 6) {
    sessao.colapsado = true;
    eventoDesc += ' 💀 COLAPSO POR EXAUSTÃO EXTREMA (Nível 6)! O artífice desmaiou na bancada. Descanso prolongado obrigatório.';
  } else if (sessao.progressoAtual >= sessao.esforcoAlvo) {
    sessao.concluido = true;
  }

  const registro = {
    numCiclo,
    dado1: r1,
    dado2: modoRolagem !== 'normal' ? r2 : null,
    dadoEscolhido,
    modoRolagem,
    bonusBase,
    penalidadeExaustao,
    modTotalEfetivo,
    total,
    cdCiclo,
    progressoCiclo,
    progressoAcumulado: sessao.progressoAtual,
    esforcoAlvo: sessao.esforcoAlvo,
    nivelExaustao: sessao.nivelExaustao,
    exaustaoAdquirida,
    sucesso,
    obraPrima,
    falhaCritica,
    eventoDesc,
    dataHora: new Date().toISOString()
  };

  sessao.ciclosExecutados.push(registro);
  sessao.ultimoCiclo = registro;

  return sessao;
}

/**
 * Aplica um descanso ao artesão: alivia 1 nível de exaustão e consome 1 dia/8h de oficina.
 */
export function descansarSessao(sessao) {
  if (sessao.nivelExaustao <= 0) {
    return { sucesso: false, mensagem: 'O artífice já está descansado (Exaustão 0).' };
  }

  const nivelAnterior = sessao.nivelExaustao;
  sessao.nivelExaustao = Math.max(0, sessao.nivelExaustao - 1);
  sessao.ciclosConsecutivosSemDescanso = 0;
  sessao.horasDecorridas += 8;
  sessao.diasDecorridos += 1;
  sessao.colapsado = false;

  const registroDescanso = {
    numCiclo: `Pausa`,
    tipo: 'descanso',
    dadoEscolhido: '-',
    modTotalEfetivo: '-',
    total: '-',
    cdCiclo: '-',
    progressoCiclo: 0,
    progressoAcumulado: sessao.progressoAtual,
    esforcoAlvo: sessao.esforcoAlvo,
    nivelExaustao: sessao.nivelExaustao,
    eventoDesc: `🛌 Descanso Restaurador (8h): O artífice pausou a forja, hidratou-se e aliviou os músculos. Exaustão reduzida de ${nivelAnterior} para ${sessao.nivelExaustao} (Penalidade atual: -${sessao.nivelExaustao * 2} no d20).`,
    dataHora: new Date().toISOString()
  };

  sessao.ciclosExecutados.push(registroDescanso);
  sessao.ultimoCiclo = registroDescanso;

  return { sucesso: true, mensagem: `Exaustão reduzida para Nível ${sessao.nivelExaustao}.` };
}

/**
 * Executa todos os ciclos restantes automaticamente até concluir ou atingir o limite.
 */
export function autoResolverCiclos(sessao, config, maxCiclos = 30) {
  let contador = 0;
  while (!sessao.concluido && !sessao.colapsado && contador < maxCiclos) {
    contador++;
    // Gestão de fadiga tática: se a exaustão subir para 3+, faz uma pausa para evitar colapso
    if (sessao.nivelExaustao >= 3) {
      descansarSessao(sessao);
    } else {
      rolarCicloTrabalho(sessao, config);
    }
  }
  return sessao;
}

/**
 * Retorna as informações do nível de exaustão conforme o livro D&D 5.5e (2024)
 */
export function getInfoExaustao(nivel) {
  const n = Math.max(0, Math.min(6, Number(nivel) || 0));
  const niveis = [
    { nivel: 0, rotulo: 'Em Plena Força', penalidade: 0, cor: '#22c55e', desc: 'Sem fadiga. Bônus completo nos testes.' },
    { nivel: 1, rotulo: 'Fadiga Leve', penalidade: -2, cor: '#eab308', desc: '-2 em todas as jogadas de d20.' },
    { nivel: 2, rotulo: 'Fadiga Moderada', penalidade: -4, cor: '#f59e0b', desc: '-4 em todas as jogadas de d20.' },
    { nivel: 3, rotulo: 'Fadiga Intensa', penalidade: -6, cor: '#f97316', desc: '-6 em todas as jogadas de d20.' },
    { nivel: 4, rotulo: 'Exaustão Severa', penalidade: -8, cor: '#ea580c', desc: '-8 em todas as jogadas de d20.' },
    { nivel: 5, rotulo: 'Exaustão Crítica', penalidade: -10, cor: '#ef4444', desc: '-10 em d20 e velocidade reduzida a 0.' },
    { nivel: 6, rotulo: 'Colapso Físico', penalidade: -99, cor: '#991b1b', desc: 'Incapacitado por estafa extrema. Trabalho paralisado.' }
  ];
  return niveis[n];
}

/**
 * Renderiza o HTML da Arena de Trabalho por Ciclos
 */
export function renderizarArenaEsforcoHTML(sessao, config, callbacks) {
  const pct = Math.min(100, Math.round((sessao.progressoAtual / sessao.esforcoAlvo) * 100));
  const infoExaust = getInfoExaustao(sessao.nivelExaustao);
  const cd = Number(config.cdCiclo || 14);
  const bonusBase = Number(config.bonusBase || 0);
  const extraManual = Number(config.modificadorExtraManual || 0);
  const penalidade = sessao.nivelExaustao * 2;
  const modEfetivo = bonusBase + extraManual - penalidade;

  const ult = sessao.ultimoCiclo;
  const numCicloAtual = sessao.ciclosExecutados.filter(c => c.tipo !== 'descanso').length + 1;

  let labelProcesso = 'Ciclos de Forja';
  let iconProcesso = '⚒️';
  if (sessao.tipoProcesso === 'alchemy') {
    labelProcesso = 'Ciclos de Destilação & Purificação';
    iconProcesso = '⚗️';
  } else if (sessao.tipoProcesso === 'enchanting') {
    labelProcesso = 'Dias de Sintonização Ritualística';
    iconProcesso = '✨';
  }

  return `
    <div class="ac-esforco-arena-card">

      <!-- VISOR SUPERIOR: ESFORÇO ACUMULADO & BARRA DE PROGRESSO -->
      <div class="ac-esforco-header">
        <div class="ac-esforco-title-row">
          <div>
            <h4 class="ac-esforco-title">${iconProcesso} ${labelProcesso} & Esforço Acumulado</h4>
            <span class="ac-esforco-sub">Sistema de Manufatura D&D 5.5e • Rolagens Sequenciais por Turno</span>
          </div>
          <div class="ac-esforco-meta-badge">
            Meta: <strong>${sessao.progressoAtual} / ${sessao.esforcoAlvo} UE</strong> (${pct}%)
          </div>
        </div>

        <!-- BARRA DE PROGRESSO COM BRILHO DOURADO -->
        <div class="ac-esforco-progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="ac-esforco-progress-fill ${sessao.concluido ? 'concluido' : ''}" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- PAINEL DE STATUS: EXAUSTÃO D&D 5.5E & CALENDÁRIO -->
      <div class="ac-esforco-status-grid">

        <!-- CARD DE EXAUSTÃO DO ARTESÃO -->
        <div class="ac-status-box ac-exaustao-box" style="border-left-color: ${infoExaust.cor};">
          <div class="ac-status-top">
            <span class="ac-status-lbl">ESTADO DO ARTESÃO (EXAUSTÃO D&D 5.5e)</span>
            <span class="ac-status-pill" style="background: ${infoExaust.cor}22; color: ${infoExaust.cor}; border: 1px solid ${infoExaust.cor};">
              Nível ${sessao.nivelExaustao}: ${infoExaust.rotulo}
            </span>
          </div>

          <!-- MEDIDOR DE 6 ESFERAS DE FADIGA -->
          <div class="ac-exaustao-dots-row">
            ${[1, 2, 3, 4, 5, 6].map(i => `
              <div class="ac-exaustao-dot ${i <= sessao.nivelExaustao ? 'ativo' : ''}"
                   style="${i <= sessao.nivelExaustao ? `background: ${infoExaust.cor}; border-color: ${infoExaust.cor}; box-shadow: 0 0 6px ${infoExaust.cor}88;` : ''}"
                   title="Nível ${i}: Penalidade de -${i * 2} em d20">
                ${i <= sessao.nivelExaustao ? '⚡' : i}
              </div>
            `).join('')}
          </div>

          <div class="ac-status-desc">
            ${sessao.nivelExaustao > 0
              ? `⚠️ <strong>Penalidade Ativa:</strong> <span style="color:${infoExaust.cor}; font-weight:700;">-${penalidade} em todos os testes de d20</span> (${infoExaust.desc}). Descanse para recuperar as forças!`
              : `✨ O artífice está bem disposto e sem nenhuma penalidade nas ferramentas.`}
          </div>
        </div>

        <!-- CARD DE DADOS DO TURNO ATUAL -->
        <div class="ac-status-box">
          <div class="ac-status-top">
            <span class="ac-status-lbl">CONFIGURAÇÃO DO PRÓXIMO TESTE</span>
            <span class="ac-status-pill">Dificuldade: CD ${cd}</span>
          </div>

          <div class="ac-status-math-row">
            <span>Bônus Base: <strong>+${bonusBase}</strong></span>
            ${extraManual !== 0 ? `<span>Ajuste: <strong>${extraManual > 0 ? `+${extraManual}` : extraManual}</strong></span>` : ''}
            <span>Exaustão: <strong style="color: ${infoExaust.cor};">-${penalidade}</strong></span>
            <span class="ac-status-total-mod">Total: <strong>${modEfetivo >= 0 ? `+${modEfetivo}` : modEfetivo}</strong></span>
          </div>

          <div class="ac-status-desc">
            ⏱️ Tempo Dedicado: <strong>${sessao.horasDecorridas} horas (${sessao.diasDecorridos} dias de trabalho)</strong>
          </div>
        </div>

      </div>

      <!-- CONTROLES DO TESTE: MODO (VANTAGEM/DESVANTAGEM) E AJUSTE MANUAL -->
      <div class="ac-roll-controls-row">
        <div class="ac-form-group">
          <label class="ac-label">Modo da Rolagem no Ciclo:</label>
          <div class="ac-btn-group">
            <button class="btn btn-sm ${config.modoRolagem === 'normal' ? 'btn-primary' : 'btn-outline'}"
                    onclick="${callbacks.setModo}('normal')">Normal</button>
            <button class="btn btn-sm ${config.modoRolagem === 'vantagem' ? 'btn-primary' : 'btn-outline'}"
                    onclick="${callbacks.setModo}('vantagem')">Vantagem (2d20)</button>
            <button class="btn btn-sm ${config.modoRolagem === 'desvantagem' ? 'btn-primary' : 'btn-outline'}"
                    onclick="${callbacks.setModo}('desvantagem')">Desvantagem (2d20)</button>
          </div>
        </div>

        <div class="ac-form-group">
          <label class="ac-label">Ajuste Extra Manual (Bênção / Inspiração):</label>
          <div class="ac-input-spinner">
            <button class="ac-spin-btn" onclick="${callbacks.ajustarExtra}(-1)">-</button>
            <input type="number" class="ac-input text-center" style="max-width: 60px;" value="${extraManual}" readonly>
            <button class="ac-spin-btn" onclick="${callbacks.ajustarExtra}(1)">+</button>
          </div>
        </div>
      </div>

      <!-- BOTÕES PRINCIPAIS DE AÇÃO -->
      <div class="ac-esforco-actions-bar">
        ${!sessao.concluido && !sessao.colapsado ? `
          <button class="btn btn-primary ac-btn-huge-roll" onclick="${callbacks.rolarCiclo}">
            🎲 Rolar Ciclo de Trabalho #${numCicloAtual} (d20 + ${modEfetivo} vs CD ${cd})
          </button>
          <button class="btn btn-outline" onclick="${callbacks.autoResolver}" title="Executa todos os ciclos restantes com descanso inteligente automático">
            ⚡ Auto-Concluir Ciclos Restantes
          </button>
          <button class="btn btn-outline" onclick="${callbacks.descansar}" ${sessao.nivelExaustao === 0 ? 'disabled style="opacity:0.5;"' : ''} title="Pausa a forja por 8 horas, recupera 1 nível de exaustão e avança 1 dia no calendário">
            🛌 Descansar (-1 Exaustão, +1 Dia)
          </button>
        ` : sessao.concluido ? `
          <div class="ac-esforco-win-banner">
            <div class="ac-win-title">🎉 CRIAÇÃO FINALIZADA COM SUCESSO!</div>
            <p>A peça alcançou a meta total de <strong>${sessao.progressoAtual} / ${sessao.esforcoAlvo} UE</strong> após <strong>${sessao.ciclosExecutados.length} ciclos</strong> de trabalho dedicados (${sessao.diasDecorridos} dias de oficina).</p>
            <div class="ac-win-actions">
              <button class="btn btn-primary btn-lg" onclick="${callbacks.avancarFicha}">
                📜 Ver Ficha Oficial de Criação Preenchida →
              </button>
              <button class="btn btn-outline" onclick="${callbacks.reiniciarSessao}">
                🔄 Reiniciar Nova Sessão
              </button>
            </div>
          </div>
        ` : `
          <div class="ac-esforco-fail-banner">
            <div class="ac-fail-title">💀 COLAPSO POR EXAUSTÃO EXTREMA!</div>
            <p>O artífice atingiu o Nível 6 de Exaustão e desmaiou na bancada. Faça uma pausa prolongada para retomar.</p>
            <div class="ac-win-actions">
              <button class="btn btn-primary" onclick="${callbacks.descansar}">
                🛌 Fazer Repouso Prolongado (Recuperar Forças)
              </button>
              <button class="btn btn-outline" onclick="${callbacks.reiniciarSessao}">
                🔄 Reiniciar Processo
              </button>
            </div>
          </div>
        `}
      </div>

      <!-- ÚLTIMO EVENTO OCORRIDO -->
      ${ult ? `
        <div class="ac-ultimo-ciclo-box ${ult.obraPrima ? 'nat20' : ult.falhaCritica ? 'nat1' : ult.sucesso ? 'sucesso' : 'falha'}">
          <div class="ac-ciclo-box-header">
            <span class="ac-ciclo-tag">
              ${ult.tipo === 'descanso' ? '🛌 PAUSA DE DESCANSO' : `CICLO #${ult.numCiclo} EXECUTADO`}
            </span>
            <span class="ac-ciclo-time">${new Date(ult.dataHora).toLocaleTimeString()}</span>
          </div>

          ${ult.tipo !== 'descanso' ? `
            <div class="ac-result-dice-display">
              <div class="ac-dice-token">${ult.dadoEscolhido}</div>
              <div class="ac-dice-math">
                + ${ult.bonusBase} (bônus)
                ${ult.penalidadeExaustao > 0 ? `<span style="color:#ef4444;"> - ${ult.penalidadeExaustao} (exaustão)</span>` : ''}
                = <strong class="ac-total-number">${ult.total}</strong>
                <span class="ac-vs-cd">vs CD ${ult.cdCiclo}</span>
                <span class="ac-progresso-tag">+${ult.progressoCiclo} UE Gerados</span>
              </div>
            </div>
          ` : ''}

          <div class="ac-ciclo-relato">
            ${escHtml(ult.eventoDesc)}
          </div>
        </div>
      ` : ''}

      <!-- HISTÓRICO COMPLETO DE CICLOS EXECUTADOS -->
      ${sessao.ciclosExecutados.length > 0 ? `
        <div class="ac-historico-ciclos-section">
          <div class="ac-historico-header">
            <h5>📜 Registro de Ciclos & Jornada de Forja (${sessao.ciclosExecutados.length} etapas registradas)</h5>
          </div>

          <div class="ac-of-table-container">
            <table class="ac-of-table ac-ciclos-table">
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Dado</th>
                  <th>Bônus Total</th>
                  <th>Pen. Exaustão</th>
                  <th>Total vs CD</th>
                  <th>Progresso Gerado</th>
                  <th>Acumulado</th>
                  <th>Exaustão</th>
                  <th>Relato do Turno</th>
                </tr>
              </thead>
              <tbody>
                ${sessao.ciclosExecutados.slice().reverse().map(c => `
                  <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                    <td><strong>${c.tipo === 'descanso' ? '🛌 Repouso' : `#${c.numCiclo}`}</strong></td>
                    <td>${c.tipo === 'descanso' ? '-' : `<code>${c.dadoEscolhido}</code>`}</td>
                    <td>${c.tipo === 'descanso' ? '-' : (c.bonusBase >= 0 ? `+${c.bonusBase}` : c.bonusBase)}</td>
                    <td>${c.penalidadeExaustao > 0 ? `<span style="color:#ef4444; font-weight:700;">-${c.penalidadeExaustao}</span>` : '0'}</td>
                    <td>${c.tipo === 'descanso' ? '-' : `<strong>${c.total}</strong> vs ${c.cdCiclo}`}</td>
                    <td><strong class="gold">+${c.progressoCiclo} UE</strong></td>
                    <td>${c.progressoAcumulado} / ${c.esforcoAlvo}</td>
                    <td><span class="ac-exaustao-pill exaust-${c.nivelExaustao}">Nv ${c.nivelExaustao}</span></td>
                    <td class="ac-table-relato-td">${escHtml(c.eventoDesc)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}
