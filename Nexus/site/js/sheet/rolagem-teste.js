// ============================================================
// Rolagem Rápida de Testes da Ficha (Iniciativa, Atributos, Salvaguardas, Perícias)
// ============================================================

import { salvarNoHistorico } from '../pages/dados.js';
import {
  abrirModal,
  fecharModal,
  escHtml,
  calcMod,
  fmtMod,
  calcBonusPericia,
  calcBonusSalvaguarda,
  bonusProficiencia
} from '../utils.js';
import {
  ATRIBUTOS_KEYS,
  ATRIBUTOS_NOMES,
  ATRIBUTO_NOME_PARA_KEY,
  PERICIAS
} from '../dados-classes.js';
import { char, ATRIBUTO_ESTILO } from './estado.js';
import {
  getModIniciativa,
  calcVantagemDesvantagemPericia,
  forcaPrimordialAtiva
} from './combate.js';
import { getEstadoFuria } from './classes/barbaro.js';

let _animacaoRolagemTeste = null;

/**
 * Calcula bônus numérico para um teste de atributo puro (sem perícia)
 */
export function calcBonusTesteAtributo(key) {
  if (!char || !char.atributos) return 0;
  const baseMod = calcMod(char.atributos[key]);
  let bonus = baseMod;

  // Bardo (Nível 2+): Pau pra Toda Obra (Jack of All Trades)
  // Adiciona metade da proficiência em qualquer teste de atributo sem proficiência
  if (char.classe === 'Bardo' && (char.nivel || 1) >= 2) {
    bonus += Math.floor(bonusProficiencia(char.nivel) / 2);
  }

  // Efeitos mágicos com bônus direto de atributo
  const efMag = char.efeitos_magicos || [];
  for (const ef of efMag) {
    if (ef.tipo === 'bonus_atributo' && typeof ef.bonus === 'number') {
      if (!ef.atributo || ef.atributo === ATRIBUTOS_NOMES[key] || ef.atributo === key) {
        bonus += ef.bonus;
      }
    }
  }

  return bonus;
}

/**
 * Calcula vantagens e desvantagens ativas para teste de atributo puro
 */
export function calcVantagemDesvantagemAtributo(key) {
  const nome = ATRIBUTOS_NOMES[key];
  const condicoes = char?.condicoes || [];
  const fontesVant = [];
  const fontesDesv = [];

  // Vantagens
  if (nome === 'Força' && !!getEstadoFuria()?.ativa) {
    fontesVant.push('Fúria');
  }
  if (nome === 'Força' && char?.especie === 'Golias' && (char?.nivel || 1) >= 5) {
    if (char.usos_habilidades?.['Forma Grande']?.ativa) {
      fontesVant.push('Forma Grande');
    }
  }
  const efMag = char?.efeitos_magicos || [];
  efMag.forEach(e => {
    if (e.tipo === 'bonus_pericia' && e.bonus === 'vantagem' && e.atributo && nome === e.atributo) {
      fontesVant.push(e.nome.replace(/ \(.*\)$/, ''));
    }
  });

  // Desvantagens
  if (condicoes.includes('Amedrontado')) fontesDesv.push('Amedrontado');
  if (condicoes.includes('Envenenado')) fontesDesv.push('Envenenado');

  return { fontesVant, fontesDesv };
}

/**
 * Calcula vantagens e desvantagens ativas para salvaguardas
 */
export function calcVantagemDesvantagemSalvaguarda(key) {
  const nome = ATRIBUTOS_NOMES[key];
  const condicoes = char?.condicoes || [];
  const incapacitado = condicoes.includes('Incapacitado');
  const fontesVant = [];
  const fontesDesv = [];

  // Vantagens
  if (nome === 'Força' && !!getEstadoFuria()?.ativa) fontesVant.push('Fúria');
  if (nome === 'Destreza' && char?.classe === 'Bárbaro' && (char?.nivel || 1) >= 2 && !incapacitado) {
    fontesVant.push('Sentido de Perigo');
  }
  if (char?.especie === 'Gnomo' && ['Inteligência', 'Sabedoria', 'Carisma'].includes(nome)) {
    fontesVant.push('Astúcia de Gnomo');
  }
  if (char?.especie === 'Elfo' && condicoes.includes('Enfeitiçado')) {
    fontesVant.push('Ancestralidade Feérica');
  }
  if (char?.especie === 'Anão' && condicoes.includes('Envenenado')) {
    fontesVant.push('Resistência a Toxinas');
  }
  if (char?.especie === 'Pequenino' && condicoes.includes('Amedrontado')) {
    fontesVant.push('Corajoso');
  }

  // Desvantagens
  if (nome === 'Destreza' && condicoes.includes('Contido')) {
    fontesDesv.push('Contido');
  }

  return { fontesVant, fontesDesv };
}

/**
 * Executa a rolagem de Iniciativa
 */
export function rolarIniciativa() {
  const ini = getModIniciativa();
  const modo = ini.vantagem ? 'vantagem' : 'normal';
  executarRolagemTeste({
    tipo: 'iniciativa',
    nome: 'Iniciativa',
    rotuloBadge: 'INICIATIVA',
    bonus: ini.valor,
    modo,
    d20Fixo: ini.d20Fixo,
    cor: '#c8a051',
    icone: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    fontesVantagem: ini.vantagem ? ['Vantagem de Iniciativa'] : [],
    fontesDesvantagem: []
  });
}

/**
 * Executa a rolagem de Teste de Atributo
 */
export function rolarAtributo(key) {
  const nome = ATRIBUTOS_NOMES[key];
  if (!nome) return;
  const estilo = ATRIBUTO_ESTILO[key] || {};
  const bonus = calcBonusTesteAtributo(key);
  const { fontesVant, fontesDesv } = calcVantagemDesvantagemAtributo(key);

  let modo = 'normal';
  if (fontesVant.length > 0 && fontesDesv.length === 0) modo = 'vantagem';
  else if (fontesDesv.length > 0 && fontesVant.length === 0) modo = 'desvantagem';

  executarRolagemTeste({
    tipo: 'atributo',
    atributoKey: key,
    nome: `Teste de ${nome}`,
    rotuloBadge: `TESTE DE ${nome.toUpperCase()}`,
    bonus,
    modo,
    cor: estilo.cor || '#c8a051',
    icone: estilo.emoji || '🎲',
    fontesVantagem: fontesVant,
    fontesDesvantagem: fontesDesv
  });
}

/**
 * Executa a rolagem de Salvaguarda
 */
export function rolarSalvaguarda(key) {
  const nome = ATRIBUTOS_NOMES[key];
  if (!nome) return;
  const estilo = ATRIBUTO_ESTILO[key] || {};
  const bonus = calcBonusSalvaguarda(char, key);
  const { fontesVant, fontesDesv } = calcVantagemDesvantagemSalvaguarda(key);

  let modo = 'normal';
  if (fontesVant.length > 0 && fontesDesv.length === 0) modo = 'vantagem';
  else if (fontesDesv.length > 0 && fontesVant.length === 0) modo = 'desvantagem';

  executarRolagemTeste({
    tipo: 'salvaguarda',
    atributoKey: key,
    nome: `Salvaguarda de ${nome}`,
    rotuloBadge: `SALVAGUARDA DE ${nome.toUpperCase()}`,
    bonus,
    modo,
    cor: estilo.cor || '#c8a051',
    icone: '🛡️',
    fontesVantagem: fontesVant,
    fontesDesvantagem: fontesDesv
  });
}

/**
 * Executa a rolagem de Perícia
 */
export function rolarPericia(nomePericia) {
  const pericia = PERICIAS.find(p => p.nome === nomePericia);
  if (!pericia) return;
  const key = ATRIBUTO_NOME_PARA_KEY[pericia.atributo];
  const estilo = ATRIBUTO_ESTILO[key] || {};
  const bonus = calcBonusPericia(char, nomePericia, {
    emFuria: !!getEstadoFuria()?.ativa,
    forcaPrimordialAtiva: forcaPrimordialAtiva()
  });
  const vd = calcVantagemDesvantagemPericia(nomePericia);

  let modo = 'normal';
  if (vd.vantagens.length > 0 && vd.desvantagens.length === 0) modo = 'vantagem';
  else if (vd.desvantagens.length > 0 && vd.vantagens.length === 0) modo = 'desvantagem';

  executarRolagemTeste({
    tipo: 'pericia',
    periciaNome: nomePericia,
    nome: `Teste de ${nomePericia}`,
    rotuloBadge: nomePericia.toUpperCase(),
    bonus,
    modo,
    cor: estilo.cor || '#c8a051',
    icone: estilo.emoji || '🎯',
    fontesVantagem: vd.vantagens,
    fontesDesvantagem: vd.desvantagens
  });
}

/**
 * Motor central de rolagem de teste com exibição visual harmoniosa estilo Quick Dice
 */
export function executarRolagemTeste(cfg) {
  if (_animacaoRolagemTeste) {
    clearInterval(_animacaoRolagemTeste);
    _animacaoRolagemTeste = null;
  }

  const {
    nome,
    rotuloBadge = nome.toUpperCase(),
    bonus = 0,
    modo = 'normal',
    d20Fixo = null,
    cor = '#c8a051',
    icone = '🎲',
    fontesVantagem = [],
    fontesDesvantagem = []
  } = cfg;

  // Sorteios reais
  const d1 = d20Fixo !== null ? d20Fixo : Math.floor(Math.random() * 20) + 1;
  let d2 = null;
  let d20Mantido = d1;
  let d20Descartado = null;

  if (modo === 'vantagem') {
    d2 = Math.floor(Math.random() * 20) + 1;
    d20Mantido = Math.max(d1, d2);
    d20Descartado = Math.min(d1, d2);
  } else if (modo === 'desvantagem') {
    d2 = Math.floor(Math.random() * 20) + 1;
    d20Mantido = Math.min(d1, d2);
    d20Descartado = Math.max(d1, d2);
  }

  // Regra de espécie: Sorte do Pequenino (re-rola 1 natural)
  let sortePequeninoAplicada = false;
  if (char?.especie === 'Pequenino' && d20Mantido === 1 && d20Fixo === null) {
    d20Mantido = Math.floor(Math.random() * 20) + 1;
    sortePequeninoAplicada = true;
  }

  const total = d20Mantido + bonus;
  let statusCritico = null;
  if (d20Mantido === 20) statusCritico = 'nat20';
  else if (d20Mantido === 1) statusCritico = 'nat1';

  const agora = new Date();
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Grava no histórico de dados
  const resultadoHistorico = {
    id: 'teste_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    tipo: 'd20',
    faces: 20,
    qtd: modo !== 'normal' ? 2 : 1,
    mod: bonus,
    modo,
    descricao: nome,
    dadosMantidos: [d20Mantido],
    dadosDescartados: d20Descartado !== null ? [d20Descartado] : [],
    paresAdvDisadv: [],
    somaDados: d20Mantido,
    total,
    statusCritico,
    hora: horaFormatada,
    timestamp: Date.now()
  };
  try {
    salvarNoHistorico(resultadoHistorico);
  } catch (e) {
    // Ignorar falha silenciosamente
  }

  // Cabeçalho do modal
  const tituloHtml = `
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="img/icons/ico-home-dados.png" style="width:22px;height:22px;object-fit:contain" alt="" onerror="this.outerHTML='<span style=\\'font-size:1.2rem\\'>🎲</span>'">
      <span>${escHtml(nome)}</span>
    </div>
  `;

  // Corpo do modal (sem botões de escolha de dados, focado puramente no resultado do teste)
  const corpoHtml = `
    <div class="quick-dice-modal-body" id="teste-roll-modal-container" style="padding:4px 0">
      <div id="teste-roll-display-slot">
        ${_gerarHtmlDisplayTeste({
          nome,
          rotuloBadge,
          cor,
          icone,
          valorExibido: '...',
          emAnimacao: true
        })}
      </div>
    </div>
  `;

  // Ações do modal (apenas o botão fechar para retorno instantâneo à ficha)
  const acoesHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="fecharModal()" style="font-size:0.85rem;min-width:100px">Fechar</button>
  `;

  abrirModal(tituloHtml, corpoHtml, acoesHtml, () => {
    if (_animacaoRolagemTeste) {
      clearInterval(_animacaoRolagemTeste);
      _animacaoRolagemTeste = null;
    }
  });

  // Animação dinâmica de sorteio rápido (5 frames de 30ms = 150ms)
  let frame = 0;
  const maxFrames = 5;
  const slot = document.getElementById('teste-roll-display-slot');

  _animacaoRolagemTeste = setInterval(() => {
    frame++;
    const tempNum = Math.floor(Math.random() * 20) + 1 + bonus;
    if (slot) {
      slot.innerHTML = _gerarHtmlDisplayTeste({
        nome,
        rotuloBadge,
        cor,
        icone,
        valorExibido: tempNum,
        emAnimacao: true
      });
    }
    if (frame >= maxFrames) {
      clearInterval(_animacaoRolagemTeste);
      _animacaoRolagemTeste = null;
      if (slot) {
        slot.innerHTML = _gerarHtmlDisplayTeste({
          nome,
          rotuloBadge,
          cor,
          icone,
          valorExibido: total,
          d20Mantido,
          d20Descartado,
          d1,
          d2,
          bonus,
          modo,
          statusCritico,
          hora: horaFormatada,
          sortePequeninoAplicada,
          fontesVantagem,
          fontesDesvantagem,
          emAnimacao: false
        });
      }
    }
  }, 30);
}

/**
 * Gera o template visual do resultado dentro do display estilizado de dados
 */
function _gerarHtmlDisplayTeste(dados) {
  const {
    rotuloBadge,
    cor = '#c8a051',
    icone = '🎲',
    valorExibido,
    d20Mantido,
    d20Descartado,
    bonus = 0,
    modo = 'normal',
    statusCritico = null,
    hora = '',
    sortePequeninoAplicada = false,
    fontesVantagem = [],
    fontesDesvantagem = [],
    emAnimacao = false
  } = dados;

  const iconeHtml = typeof icone === 'string' && icone.startsWith('<') ? icone : `<span>${icone}</span>`;

  if (emAnimacao) {
    return `
      <div class="quick-dice-display is-rolling" style="border-color: ${cor};">
        <div class="quick-dice-result-top">
          <span class="quick-dice-badge" style="background:${cor}25;border-color:${cor}60;color:#fff">
            ${iconeHtml}
            <span>${escHtml(rotuloBadge)}</span>
          </span>
          <span style="font-size:0.75rem;color:var(--text-muted)">Rolando...</span>
        </div>
        <div class="quick-dice-number" style="color: ${cor}; transform: scale(1.08);">${valorExibido}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Sorteando resultado...</div>
      </div>
    `;
  }

  let classeCritico = '';
  let criticoBadge = '';
  if (statusCritico === 'nat20') {
    classeCritico = 'is-nat20';
    criticoBadge = `
      <div class="quick-dice-crit-badge nat20">
        <img src="img/icons/ico-nat20.png" style="width:14px;height:14px;object-fit:contain" alt="" onerror="this.outerHTML='⭐'">
        <span>SUCESSO CRÍTICO (NATURAL 20!)</span>
      </div>
    `;
  } else if (statusCritico === 'nat1') {
    classeCritico = 'is-nat1';
    criticoBadge = `
      <div class="quick-dice-crit-badge nat1">
        <img src="img/icons/ico-nat1.png" style="width:14px;height:14px;object-fit:contain" alt="" onerror="this.outerHTML='💀'">
        <span>FALHA CRÍTICA (NATURAL 1!)</span>
      </div>
    `;
  }

  // Exibição da fórmula matemática do teste
  const bonusStr = bonus === 0 ? '' : (bonus > 0 ? ` + ${bonus}` : ` - ${Math.abs(bonus)}`);
  let formulaTexto = '';

  if (modo === 'vantagem') {
    const motivo = fontesVantagem.length > 0 ? ` (${fontesVantagem.join(', ')})` : '';
    formulaTexto = `
      <div class="quick-dice-roll-detail">
        <span class="quick-dice-mode-tag tag-vantagem">Vantagem${motivo}</span>
        <span class="quick-dice-formula-calc">Dados: [<strong>${d20Mantido}</strong>, <span style="opacity:0.6;text-decoration:line-through">${d20Descartado}</span>]${bonusStr} = <strong>${valorExibido}</strong></span>
      </div>
    `;
  } else if (modo === 'desvantagem') {
    const motivo = fontesDesvantagem.length > 0 ? ` (${fontesDesvantagem.join(', ')})` : '';
    formulaTexto = `
      <div class="quick-dice-roll-detail">
        <span class="quick-dice-mode-tag tag-desvantagem">Desvantagem${motivo}</span>
        <span class="quick-dice-formula-calc">Dados: [<strong>${d20Mantido}</strong>, <span style="opacity:0.6;text-decoration:line-through">${d20Descartado}</span>]${bonusStr} = <strong>${valorExibido}</strong></span>
      </div>
    `;
  } else {
    formulaTexto = `
      <div class="quick-dice-roll-detail">
        <span class="quick-dice-formula-calc">d20 (<strong>${d20Mantido}</strong>)${bonusStr} = <strong>${valorExibido}</strong></span>
      </div>
    `;
  }

  const sortePill = sortePequeninoAplicada ? `
    <div style="font-size:0.75rem;color:var(--success);margin-top:6px;font-weight:600">
      ☘️ Sorte de Pequenino: 1 natural re-rolado automaticamente!
    </div>
  ` : '';

  return `
    <div class="quick-dice-display ${classeCritico}" style="border-color:${classeCritico ? '' : cor + '70'};">
      <div class="quick-dice-result-top">
        <span class="quick-dice-badge" style="background:${cor}25;border-color:${cor}60;color:#fff">
          ${iconeHtml}
          <span>${escHtml(rotuloBadge)}</span>
        </span>
        <span style="font-size:0.75rem;color:var(--text-muted);">${hora}</span>
      </div>

      <div class="quick-dice-number ${classeCritico ? '' : 'color-normal'}" style="${classeCritico ? '' : `color:${cor};`}">
        ${valorExibido}
      </div>

      ${criticoBadge}

      ${formulaTexto}

      ${sortePill}
    </div>
  `;
}

/**
 * Configura os ouvintes de clique e acessibilidade por teclado para os itens de teste
 */
export function setupEventosRolagemTestes() {
  function vincularAcao(el, handler) {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  }

  // 1. Iniciativa
  const elIniciativa = document.querySelector('.stat-box-iniciativa[data-rolagem-tipo="iniciativa"]');
  if (elIniciativa) {
    vincularAcao(elIniciativa, () => rolarIniciativa());
  }

  // 2. Atributos
  document.querySelectorAll('.ficha-attr-box[data-rolagem-tipo="atributo"]').forEach(el => {
    const key = el.dataset.atributoKey;
    if (key) {
      vincularAcao(el, () => rolarAtributo(key));
    }
  });

  // 3. Salvaguardas
  document.querySelectorAll('.salva-item[data-rolagem-tipo="salvaguarda"]').forEach(el => {
    const key = el.dataset.salvaguardaKey;
    if (key) {
      vincularAcao(el, () => rolarSalvaguarda(key));
    }
  });

  // 4. Perícias
  document.querySelectorAll('.pericia-item[data-rolagem-tipo="pericia"]').forEach(el => {
    const nome = el.dataset.periciaNome;
    if (nome) {
      vincularAcao(el, () => rolarPericia(nome));
    }
  });
}
