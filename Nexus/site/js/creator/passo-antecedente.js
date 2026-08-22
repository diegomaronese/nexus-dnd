// ============================================================
// Passo 3: escolha de antecedente
// Extraido de site/js/pages/creator.js sem alteracao de comportamento.
// ============================================================
import { abrirModal, toast } from '../utils.js';
import { ANTECEDENTES_ESCOLHAS, configurarSelectsExclusivos, consolidarPericiasProficientes, renderEscolhasTalentoHtml, talentoExigeEscolhas, talentoNumEscolhas } from './comum.js';
import { renderDistribuicaoInline } from './passo-atributos.js';
import { dadosCache, personagem } from './wizard.js';

// ============================================================
// PASSO 3: ANTECEDENTE
// ============================================================

export function selecionarAntecedente(nome) {
  const ant = dadosCache.antecedentes?.find(a => a.nome === nome);
  if (!ant) return;

  const pericias = ant.pericias.split(',').map(p => p.trim()).filter(Boolean);
  const atributosDisponiveis = ant.valores_atributo.split(',').map(a => a.trim()).filter(Boolean);
  const talentoNome = ant.talento?.replace(/\s*\(veja.*\)/, '').trim() || '';

  if (personagem.antecedente && personagem.antecedente !== nome) {
    personagem.bonus_antecedente = {};
    personagem.escolhas_antecedente = {};
    personagem.talentos = [];
    if (personagem.escolhas_talento) delete personagem.escolhas_talento.antecedente;
    delete personagem.iniciado_em_magia;
    delete personagem.iniciado_em_magia_instancias;
    delete dadosCache.bonus2;
    delete dadosCache.bonus1;
    delete dadosCache.bonus111;
  }
  personagem.antecedente = nome;

  // Aplicar pericias do antecedente
  dadosCache.pericias_antecedente = pericias;
  dadosCache.atributos_antecedente = atributosDisponiveis;

  personagem.talento_antecedente = talentoNome || '';
  _reconstruirTalentosBase();
  _consolidarFerramentaAntecedente();
  consolidarPericiasProficientes();

  const wizContent = document.getElementById('wizard-content');
  if (wizContent) renderStepAntecedente(wizContent);
}

export function renderStepAntecedente(el) {
  const antecedentes = dadosCache.antecedentes || [];

  // Resumo compacto se ja tem antecedente selecionado
  let resumoHtml = '';
  let escolhasInlineHtml = '';

  if (personagem.antecedente) {
    const antNome = personagem.antecedente;
    const ant = antecedentes.find(a => a.nome === antNome);
    const talentoNome = ant?.talento?.split('(')[0]?.trim() || '';

    resumoHtml = `
      <div class="selecao-resumo" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div class="resumo-info">
          <div class="resumo-titulo">${antNome}</div>
          <div class="resumo-detalhe">${talentoNome} | ${ant?.pericias || ''}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" id="btn-detalhes-antecedente">Ver Detalhes</button>
        </div>
      </div>`;

    // Escolhas de ferramenta/instrumento/jogos inline
    const antEscolha = ANTECEDENTES_ESCOLHAS[antNome];
    let ferramentaInlineHtml = '';
    if (antEscolha) {
      const valorAtual = personagem.escolhas_antecedente?.[antEscolha.campo] || '';
      ferramentaInlineHtml = `
        <div class="mt-2">
          <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${antEscolha.titulo}</div>
          <div class="info-box info" style="font-size:0.85rem;margin-bottom:8px">${antEscolha.descricao}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${antEscolha.opcoes.map(opt => `
              <div class="selection-card ${valorAtual === opt ? 'selected' : ''}"
                   data-inline-escolha-ant="${antEscolha.campo}" data-opcao-ant="${opt}"
                   style="flex:1;min-width:130px;max-width:200px;cursor:pointer">
                <span class="card-check">&#10003;</span>
                <div class="card-nome" style="font-size:0.85rem">${opt}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Escolhas de talento de antecedente inline (Habilidoso, Artifista, Músico)
    let talentoInlineHtml = '';
    if (talentoExigeEscolhas(talentoNome)) {
      const pericias = ant?.pericias?.split(',').map(p => p.trim()).filter(Boolean) || [];
      talentoInlineHtml = `
        <div class="mt-2">
          ${renderEscolhasTalentoHtml(talentoNome, 'antecedente', pericias)}
        </div>
      `;
    }

    if (ferramentaInlineHtml || talentoInlineHtml) {
      escolhasInlineHtml = `
        <div class="card mt-2" style="border-left:3px solid var(--primary)">
          <div class="card-header">
            <h4 style="margin:0">Configurações do Antecedente: ${antNome}</h4>
          </div>
          ${ferramentaInlineHtml}
          ${talentoInlineHtml}
        </div>
      `;
    }
  }

  el.innerHTML = `
    <h3 style="margin-bottom:12px">Escolha seu Antecedente</h3>
    <div class="info-box info">O antecedente define suas perícias, ferramentas, talento de origem e distribuição de atributos.</div>
    <div class="selection-grid" id="grid-antecedentes">
      ${antecedentes.map(a => `
        <div class="selection-card ${personagem.antecedente === a.nome ? 'selected' : ''}" data-antecedente="${a.nome}">
          <span class="card-check">&#10003;</span>
          <button type="button" class="card-btn-info" data-info-antecedente="${a.nome}" title="Ver detalhes de ${a.nome}">&#9432;</button>
          <div class="card-nome">${a.nome}</div>
          <div class="card-detalhe">${a.talento?.split('(')[0]?.trim() || ''}</div>
        </div>
      `).join('')}
    </div>
    ${resumoHtml}
    ${escolhasInlineHtml}
    <div id="antecedente-distribuicao" class="mt-2"></div>
  `;

  // Clicar num card do antecedente seleciona o antecedente imediatamente
  el.querySelectorAll('[data-antecedente]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-info-antecedente]')) return;
      selecionarAntecedente(card.dataset.antecedente);
    });
  });

  // Botões de informação direta no card
  el.querySelectorAll('[data-info-antecedente]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirPopupAntecedente(btn.dataset.infoAntecedente);
    });
  });

  // Botão para ver detalhes no modal
  document.getElementById('btn-detalhes-antecedente')?.addEventListener('click', () => {
    if (personagem.antecedente) abrirPopupAntecedente(personagem.antecedente);
  });

  // Eventos inline de ferramenta/instrumento
  if (personagem.antecedente && ANTECEDENTES_ESCOLHAS[personagem.antecedente]) {
    const antEscolha = ANTECEDENTES_ESCOLHAS[personagem.antecedente];
    el.querySelectorAll('[data-inline-escolha-ant]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const campo = card.dataset.inlineEscolhaAnt;
        const opcao = card.dataset.opcaoAnt;
        if (!personagem.escolhas_antecedente) personagem.escolhas_antecedente = {};
        personagem.escolhas_antecedente[campo] = opcao;
        _consolidarFerramentaAntecedente();
        renderStepAntecedente(el);
      });
    });
  }

  // Eventos inline de talento do antecedente
  if (personagem.antecedente) {
    const ant = antecedentes.find(a => a.nome === personagem.antecedente);
    const talentoNome = ant?.talento?.replace(/\s*\(veja.*\)/, '').trim() || '';
    const pericias = ant?.pericias?.split(',').map(p => p.trim()).filter(Boolean) || [];
    if (talentoExigeEscolhas(talentoNome)) {
      configurarSelectsExclusivos('.escolha-talento-antecedente', { reservarClasse: true, extras: pericias });
      el.querySelectorAll('.escolha-talento-antecedente').forEach(s => {
        s.addEventListener('change', () => {
          const selects = el.querySelectorAll('.escolha-talento-antecedente');
          const vals = [...selects].map(sel => sel.value).filter(Boolean);
          if (!personagem.escolhas_talento) personagem.escolhas_talento = {};
          personagem.escolhas_talento.antecedente = vals;
          consolidarPericiasProficientes();
        });
      });
    }
  }

  // Se ja tem antecedente, mostrar distribuicao de atributos inline
  if (personagem.antecedente) {
    renderDistribuicaoInline();
  }
}

// Reconstrói personagem.talentos a partir das duas fontes possíveis (antecedente + Versátil),
// deterministicamente. Precisa ser chamada sempre que QUALQUER uma das duas fontes mudar
// (não só quando o antecedente é confirmado), pois o usuário pode navegar entre os passos
// Espécie e Antecedente fora de ordem.
export function _reconstruirTalentosBase() {
  personagem.talentos = personagem.talento_antecedente ? [personagem.talento_antecedente] : [];
  if (personagem.talento_versatil) {
    personagem.talentos.push(personagem.talento_versatil);
  }
}

// Consolida a ferramenta/instrumento do antecedente ATUAL (personagem.antecedente)
// em proficiencias_ferramentas/proficiencias_instrumentos -- determinística,
// igual a _reconstruirTalentosBase() acima: remove a contribuição do antecedente
// anterior (guardada em dadosCache.ferramentaAntecedenteAtual) antes de recalcular,
// então pode ser chamada de novo com segurança sempre que o antecedente ou a
// escolha de ferramenta/instrumento mudar, sem duplicar nem deixar uma
// proficiência órfã de um antecedente trocado.
//
// Roteamento por CAMPO conhecido (o `campo` de ANTECEDENTES_ESCOLHAS), não por
// lista de valores: só existem três campos possíveis (ferramenta_escolhida,
// instrumento_escolhido, jogos_escolhido) e cada um mapeia para exatamente uma
// das duas arrays. Checar a escolha contra INSTRUMENTOS_MUSICAIS.includes()/
// FERRAMENTAS_TODAS.includes() (como o bloco de escolhas_talento em wizard.js
// já faz) NÃO serve aqui: as opções de Kit de Jogos (Baralho, Conjunto de
// Dados, Xadrez de Dragão, Jogo de Três Dragões) não pertencem a nenhuma das
// duas listas, e a escolha de Guarda/Nobre/Soldado desapareceria em silêncio
// -- exatamente o tipo de bug que esta função existe para corrigir.
//
// Roda na confirmação do popup do antecedente (não só no fim do assistente,
// em wizard.js:finalizar) porque o personagem em construção já deve refletir
// a ferramenta assim que o antecedente é confirmado -- não existe uma segunda
// via de aquisição de antecedente para consolidar depois.
export function _consolidarFerramentaAntecedente() {
  // Remover a contribuição do antecedente anterior, se houver, antes de recalcular
  if (dadosCache.ferramentaAntecedenteAtual) {
    const { valor, campo } = dadosCache.ferramentaAntecedenteAtual;
    const arr = campo === 'instrumento_escolhido' ? personagem.proficiencias_instrumentos : personagem.proficiencias_ferramentas;
    const idx = arr ? arr.indexOf(valor) : -1;
    if (idx >= 0) arr.splice(idx, 1);
    dadosCache.ferramentaAntecedenteAtual = null;
  }

  if (!personagem.antecedente) return;
  const ant = dadosCache.antecedentes.find(a => a.nome === personagem.antecedente);
  const antEscolha = ANTECEDENTES_ESCOLHAS[personagem.antecedente];

  // Ferramenta por categoria (Artesão/Artista/Guarda/Nobre/Soldado) usa a
  // escolha do jogador; os outros 11 antecedentes têm ferramenta específica
  // fixa no próprio dado (ant.ferramentas).
  let valor, campo;
  if (antEscolha) {
    valor = personagem.escolhas_antecedente?.[antEscolha.campo] || null;
    campo = antEscolha.campo;
  } else {
    valor = ant?.ferramentas?.trim() || null;
    campo = 'ferramenta_escolhida';
  }
  if (!valor) return;

  if (!personagem.proficiencias_ferramentas) personagem.proficiencias_ferramentas = [];
  if (!personagem.proficiencias_instrumentos) personagem.proficiencias_instrumentos = [];
  const destino = campo === 'instrumento_escolhido' ? personagem.proficiencias_instrumentos : personagem.proficiencias_ferramentas;
  if (!destino.includes(valor)) destino.push(valor);
  dadosCache.ferramentaAntecedenteAtual = { valor, campo };
}

function abrirPopupAntecedente(nome) {
  const ant = dadosCache.antecedentes.find(a => a.nome === nome);
  if (!ant) return;

  // Parsear dados do antecedente
  const pericias = ant.pericias.split(',').map(p => p.trim()).filter(Boolean);
  const atributosDisponiveis = ant.valores_atributo.split(',').map(a => a.trim()).filter(Boolean);
  const talentoNome = ant.talento?.replace(/\s*\(veja.*\)/, '').trim() || '';

  // Escolha de ferramenta/instrumento
  const antEscolha = ANTECEDENTES_ESCOLHAS[nome];
  let escolhaHtml = '';
  if (antEscolha) {
    const valorAtual = personagem.escolhas_antecedente?.[antEscolha.campo] || '';
    escolhaHtml = `
      <div class="section-divider mt-2"><span>${antEscolha.titulo}</span></div>
      <div class="info-box info" style="font-size:0.85rem">${antEscolha.descricao}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0">
        ${antEscolha.opcoes.map(opt => `
          <div class="selection-card ${valorAtual === opt ? 'selected' : ''}"
               data-escolha-ant="${antEscolha.campo}" data-opcao-ant="${opt}"
               style="flex:1;min-width:130px;max-width:180px;cursor:pointer">
            <div class="card-nome" style="font-size:0.85rem">${opt}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Escolhas do talento (Habilidoso, Artifista, Musico). As duas pericias do
  // proprio antecedente vao como "ja adquiridas": o antecedente ainda nao foi
  // confirmado, entao elas nao estao em lugar nenhum que o filtro alcance, e
  // sem isso o Habilidoso do Nobre oferecia Historia e Persuasao -- que o
  // Nobre ja concede -- desperdicando uma das 3 escolhas.
  let escolhaTalentoHtml = '';
  if (talentoExigeEscolhas(talentoNome)) {
    escolhaTalentoHtml = renderEscolhasTalentoHtml(talentoNome, 'antecedente', pericias);
  }

  const corpoHtml = `
    <p style="font-size:0.85rem;margin-bottom:12px;font-style:italic">${ant.descricao || ''}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85rem">
      <div><strong>Perícias:</strong> ${pericias.join(', ')}</div>
      <div><strong>Ferramentas:</strong> ${ant.ferramentas}</div>
      <div><strong>Talento:</strong> ${talentoNome}</div>
      <div><strong>Atributos:</strong> ${atributosDisponiveis.join(', ')}</div>
    </div>
    <div style="font-size:0.85rem;margin-top:8px">
      <strong>Equipamento:</strong> ${ant.equipamento?.replace(/\*/g, '') || ''}
    </div>
    ${escolhaHtml}
    ${escolhaTalentoHtml}
  `;

  abrirModal(ant.nome, corpoHtml, `
    <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
    <button class="btn btn-primary" id="popup-confirmar-antecedente">Selecionar ${ant.nome}</button>
  `);

  // reservarClasse: as pericias que a classe ainda vai precisar escolher no
  // passo 4 nao entram nas opcoes do Habilidoso -- ver o porque (aritmetico)
  // em periciasReservadasParaClasse. `extras` sao as duas pericias do proprio
  // antecedente, que ja tornam a conta exata (nao ha mais margem preventiva).
  if (talentoExigeEscolhas(talentoNome)) {
    configurarSelectsExclusivos('.escolha-talento-antecedente', { reservarClasse: true, extras: pericias });
  }

  // Eventos de escolha de ferramenta/instrumento
  if (antEscolha) {
    document.querySelectorAll('[data-escolha-ant]').forEach(card => {
      card.addEventListener('click', () => {
        const campo = card.dataset.escolhaAnt;
        const opcao = card.dataset.opcaoAnt;
        if (!personagem.escolhas_antecedente) personagem.escolhas_antecedente = {};
        personagem.escolhas_antecedente[campo] = opcao;
        // Atualizar visual
        document.querySelectorAll(`[data-escolha-ant="${campo}"]`).forEach(c => {
          c.classList.toggle('selected', c.dataset.opcaoAnt === opcao);
        });
      });
    });
  }

  // Botao de confirmacao (com validação de escolhas obrigatórias)
  document.getElementById('popup-confirmar-antecedente')?.addEventListener('click', () => {
    // Validar escolhas de antecedente (ferramenta/instrumento)
    const antEscolha = ANTECEDENTES_ESCOLHAS[nome];
    if (antEscolha && !personagem.escolhas_antecedente?.[antEscolha.campo]) {
      toast(`Selecione ${antEscolha.titulo}`, 'error');
      return;
    }
    // Validar escolhas do talento do antecedente (Habilidoso, Artifista, Musico)
    const numEsc = talentoNumEscolhas(talentoNome);
    if (numEsc > 0) {
      const selects = document.querySelectorAll('.escolha-talento-antecedente');
      const vals = [...selects].map(s => s.value).filter(Boolean);
      if (vals.length < numEsc) {
        toast(`Selecione todas as ${numEsc} escolhas de ${talentoNome}`, 'error');
        return;
      }
      if (new Set(vals).size < vals.length) {
        toast('Nao repita opcoes nas escolhas do talento', 'error');
        return;
      }
      if (!personagem.escolhas_talento) personagem.escolhas_talento = {};
      personagem.escolhas_talento.antecedente = vals;
    }
    // Se mudou de antecedente, limpar dados especificos do anterior
    if (personagem.antecedente && personagem.antecedente !== nome) {
      personagem.bonus_antecedente = {};
      personagem.escolhas_antecedente = {};
      personagem.talentos = [];
      if (personagem.escolhas_talento) delete personagem.escolhas_talento.antecedente;
      delete personagem.iniciado_em_magia;
      delete personagem.iniciado_em_magia_instancias;
      delete dadosCache.bonus2;
      delete dadosCache.bonus1;
      delete dadosCache.bonus111;
    }
    personagem.antecedente = nome;

    // Aplicar pericias do antecedente
    dadosCache.pericias_antecedente = pericias;
    dadosCache.atributos_antecedente = atributosDisponiveis;

    // Verificar conflito: mesmo talento não-repetível do antecedente e Versátil
    const _talentosOrigemRepetiveis = ['Habilidoso', 'Iniciado em Magia'];
    if (personagem.talento_versatil && personagem.talento_versatil === talentoNome && !_talentosOrigemRepetiveis.includes(talentoNome)) {
      toast(`O talento "${talentoNome}" já está selecionado como Versátil e não é repetível. Altere sua escolha na etapa de Espécie.`, 'error');
      return;
    }

    // Persistir o talento do antecedente e reconstruir array de talentos de forma
    // determinística a partir das duas fontes (evita duplicação ao re-selecionar,
    // e mantém consistência se o usuário revisitar o passo Espécie depois)
    personagem.talento_antecedente = talentoNome || '';
    _reconstruirTalentosBase();
    // Grava a ferramenta/instrumento do antecedente nas arrays de proficiência
    // (achado do spec de regras: nada fazia isso antes -- ver comentário na
    // função para o porquê de rodar aqui, não só no fim do assistente).
    _consolidarFerramentaAntecedente();
    // Perícias do antecedente (e as do Habilidoso) entram na lista definitiva
    // agora, e não só quando o passo 4 for renderizado -- o filtro de escolha
    // repetida dos passos seguintes lê essa lista.
    consolidarPericiasProficientes();

    window.fecharModal();
    // Re-renderizar o passo com o resumo e distribuicao de atributos
    const wizContent = document.getElementById('wizard-content');
    if (wizContent) renderStepAntecedente(wizContent);
  });
}