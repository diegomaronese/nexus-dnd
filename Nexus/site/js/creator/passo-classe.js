// ============================================================
// Passo 1: escolha de classe
// Extraido de site/js/pages/creator.js sem alteracao de comportamento.
// ============================================================
import { CLASSES_INFO, getIconeClasse } from '../dados-classes.js';
import { getClasse } from '../db.js';
import { abrirModal, escHtml, mdParaHtml, toast } from '../utils.js';
import { CLASSES_ESCOLHAS, NIVEL_SUBCLASSE } from './comum.js';
import { dadosCache, personagem } from './wizard.js';

// ============================================================
// PASSO 1: CLASSE
// ============================================================

export function selecionarClasse(nome) {
  if (personagem.classe && personagem.classe !== nome) {
    personagem.subclasse = '';
    personagem.ordem_divina = '';
    personagem.ordem_primal = '';
    personagem.escolhas_classe = {};
    personagem.extras_classe = {};
    personagem.proficiencias_extra = [];
    delete dadosCache.classeData;
    delete dadosCache.pericias_classe_sel;
  }
  personagem.classe = nome;

  // Carregar dados da classe em background se ainda não carregados
  if (!dadosCache.classeData || dadosCache.classeData.nome !== nome) {
    getClasse(nome).then(data => {
      dadosCache.classeData = data;
    }).catch(console.error);
  }

  const wizContent = document.getElementById('wizard-content');
  if (wizContent) renderStepClasse(wizContent);
}

export function renderStepClasse(el) {
  const classes = Object.keys(CLASSES_INFO);

  // Resumo compacto se ja tem classe selecionada
  let resumoHtml = '';
  let escolhasInlineHtml = '';

  if (personagem.classe) {
    const nomeClasse = personagem.classe;
    const info = CLASSES_INFO[nomeClasse];
    const escolhasTxt = [];
    if (personagem.ordem_divina) escolhasTxt.push(personagem.ordem_divina);
    if (personagem.ordem_primal) escolhasTxt.push(personagem.ordem_primal);
    if (personagem.escolhas_classe?.estilo_luta?.length) escolhasTxt.push(personagem.escolhas_classe.estilo_luta[0]);
    if (personagem.escolhas_classe?.especialista?.length) escolhasTxt.push('Especialista: ' + personagem.escolhas_classe.especialista.join(', '));
    const extra = escolhasTxt.length ? ' | ' + escolhasTxt.join(', ') : '';
    const iconeSel = getIconeClasse(nomeClasse);

    resumoHtml = `
      <div class="selecao-resumo" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          ${iconeSel ? `<img src="${iconeSel}" class="classe-icon-card" style="width:36px;height:36px;" alt="">` : ''}
          <div class="resumo-info">
            <div class="resumo-titulo">${nomeClasse}</div>
            <div class="resumo-detalhe">d${info?.dado_vida || 8} | ${info?.atributo_primario || ''} | ${info?.conjurador ? 'Conjurador' : 'Marcial'}${extra}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" id="btn-detalhes-classe">Ver Detalhes</button>
        </div>
      </div>`;

    // Renderizar escolhas obrigatórias da classe inline se houver
    const classeEscolhas = CLASSES_ESCOLHAS[nomeClasse];
    if (classeEscolhas) {
      let escolhasItens = '';
      for (const [chave, config] of Object.entries(classeEscolhas)) {
        const nivelMinConfig = parseInt(config.nivelMinimo || 1);
        if ((personagem.nivel || 1) < nivelMinConfig) continue;
        const selecionados = personagem.escolhas_classe?.[chave] || [];

        if (config.tipo === 'pericias') {
          const periciasDaClasse = info?.pericias_opcoes || [];
          escolhasItens += `
            <div class="mt-2">
              <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${config.titulo} (${selecionados.length}/${config.maxEscolhas})</div>
              <div class="info-box info" style="font-size:0.85rem;margin-bottom:8px">${config.descricao}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px" id="inline-escolha-${chave}">
                ${periciasDaClasse.map(p => `
                  <div class="selection-card ${selecionados.includes(p) ? 'selected' : ''}"
                       data-inline-escolha-classe="${chave}" data-opcao="${p}"
                       style="flex:1;min-width:120px;max-width:180px;cursor:pointer">
                    <span class="card-check">&#10003;</span>
                    <div class="card-nome" style="font-size:0.85rem">${p}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        } else if (config.tipo === 'pericias_fixas') {
          const opcoes = config.opcoes_fixas || [];
          escolhasItens += `
            <div class="mt-2">
              <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${config.titulo} (${selecionados.length}/${config.maxEscolhas})</div>
              <div class="info-box info" style="font-size:0.85rem;margin-bottom:8px">${config.descricao}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px" id="inline-escolha-${chave}">
                ${opcoes.map(p => `
                  <div class="selection-card ${selecionados.includes(p) ? 'selected' : ''}"
                       data-inline-escolha-classe="${chave}" data-opcao="${p}"
                       style="flex:1;min-width:120px;max-width:180px;cursor:pointer">
                    <span class="card-check">&#10003;</span>
                    <div class="card-nome" style="font-size:0.85rem">${p}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          escolhasItens += `
            <div class="mt-2">
              <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${config.titulo} (${selecionados.length}/${config.maxEscolhas})</div>
              <div class="info-box info" style="font-size:0.85rem;margin-bottom:8px">${config.descricao}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px" id="inline-escolha-${chave}">
                ${(config.opcoes || []).map(opt => `
                  <div class="selection-card ${selecionados.includes(opt.nome) ? 'selected' : ''}"
                       data-inline-escolha-classe="${chave}" data-opcao="${opt.nome}"
                       style="flex:1;min-width:140px;max-width:220px;cursor:pointer">
                    <span class="card-check">&#10003;</span>
                    <div class="card-nome" style="font-size:0.85rem">${opt.nome}</div>
                    ${opt.descricao ? `<div class="card-detalhe" style="font-size:0.75rem">${opt.descricao}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      if (escolhasItens) {
        escolhasInlineHtml = `
          <div class="card mt-2" style="border-left:3px solid var(--primary)">
            <div class="card-header">
              <h4 style="margin:0">Configurações da Classe: ${nomeClasse}</h4>
            </div>
            ${escolhasItens}
          </div>
        `;
      }
    }
  }

  el.innerHTML = `
    <h3 style="margin-bottom:12px">Escolha sua Classe</h3>
    <div class="selection-grid" id="grid-classes">
      ${classes.map(c => {
        const info = CLASSES_INFO[c];
        const icone = getIconeClasse(c);
        return `
          <div class="selection-card ${personagem.classe === c ? 'selected' : ''}" data-classe="${c}">
            <span class="card-check">&#10003;</span>
            <button type="button" class="card-btn-info" data-info-classe="${c}" title="Ver detalhes de ${c}">&#9432;</button>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              ${icone ? `<img src="${icone}" class="classe-icon-card" style="width:26px;height:26px;" alt="">` : ''}
              <div class="card-nome" style="margin-bottom:0">${c}</div>
            </div>
            <div class="card-detalhe">d${info.dado_vida} &middot; ${info.atributo_primario}</div>
            <div class="card-detalhe">${info.conjurador ? 'Conjurador' : 'Marcial'}</div>
          </div>`;
      }).join('')}
    </div>
    ${resumoHtml}
    ${escolhasInlineHtml}
  `;

  // Clicar num card da classe seleciona a classe imediatamente
  el.querySelectorAll('[data-classe]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-info-classe]')) return;
      selecionarClasse(card.dataset.classe);
    });
  });

  // Botões de informação direta no card
  el.querySelectorAll('[data-info-classe]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirPopupClasse(btn.dataset.infoClasse);
    });
  });

  // Botão para abrir modal de detalhes completos da classe
  document.getElementById('btn-detalhes-classe')?.addEventListener('click', () => {
    if (personagem.classe) abrirPopupClasse(personagem.classe);
  });

  // Eventos de escolhas inline da classe
  if (personagem.classe && CLASSES_ESCOLHAS[personagem.classe]) {
    const classeEscolhas = CLASSES_ESCOLHAS[personagem.classe];
    el.querySelectorAll('[data-inline-escolha-classe]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const chave = card.dataset.inlineEscolhaClasse;
        const opcao = card.dataset.opcao;
        const config = classeEscolhas[chave];
        if (!config) return;

        if (!personagem.escolhas_classe) personagem.escolhas_classe = {};
        let selecionados = personagem.escolhas_classe[chave] || [];

        if (selecionados.includes(opcao)) {
          selecionados = selecionados.filter(s => s !== opcao);
        } else {
          if (selecionados.length >= config.maxEscolhas) {
            if (config.maxEscolhas === 1) selecionados = [opcao];
          } else {
            selecionados.push(opcao);
          }
        }
        personagem.escolhas_classe[chave] = selecionados;

        // Aplicar efeitos específicos (compatibilidade)
        if (chave === 'ordem_divina') {
          personagem.ordem_divina = selecionados[0] || '';
          const opt = config.opcoes?.find(o => o.nome === selecionados[0]);
          if (opt?.efeito) {
            personagem.extras_classe = { ordem: selecionados[0], ...opt.efeito };
          }
        }
        if (chave === 'ordem_primal') {
          personagem.ordem_primal = selecionados[0] || '';
          const opt = config.opcoes?.find(o => o.nome === selecionados[0]);
          if (opt?.efeito) {
            personagem.extras_classe = { ordem: selecionados[0], ...opt.efeito };
          }
        }

        // Re-renderizar o passo para atualizar contadores e seleção
        renderStepClasse(el);
      });
    });
  }
}

async function abrirPopupClasse(nome) {
  const info = CLASSES_INFO[nome];
  const classeData = await getClasse(nome);
  dadosCache.classeData = classeData;

  const armaduras = info.armaduras.length > 0 ? info.armaduras.join(', ') : 'Nenhuma';
  const armas = info.armas.join(', ');
  const salvaguardas = info.salvaguardas.join(', ');
  const pericias = info.pericias_opcoes ? info.pericias_opcoes.join(', ') : 'Qualquer';
  const nivelSub = NIVEL_SUBCLASSE[nome] || 3;

  // Subclasse
  let subclassesHtml = '';
  if (classeData?.subclasses?.length && personagem.nivel >= nivelSub) {
    subclassesHtml = `
      <div class="form-group mt-2">
        <label class="form-label">Subclasse (obrigatória no nível ${nivelSub})</label>
        <select class="form-select" id="sel-subclasse">
          <option value="">Selecione uma subclasse</option>
          ${classeData.subclasses.map(s => `<option value="${s.nome}" ${personagem.subclasse === s.nome ? 'selected' : ''}>${s.nome}</option>`).join('')}
        </select>
      </div>`;
  } else if (classeData?.subclasses?.length) {
    subclassesHtml = `
      <div class="info-box" style="font-size:0.85rem;margin-top:8px">
        Subclasse disponível a partir do nível ${nivelSub}. Subclasses: ${classeData.subclasses.map(s => s.nome).join(', ')}
      </div>`;
  }

  // Escolhas obrigatórias da classe (Ordem Divina, Estilo de Luta, etc.)
  const classeEscolhas = CLASSES_ESCOLHAS[nome];
  let escolhasHtml = '';
  if (classeEscolhas) {
    for (const [chave, config] of Object.entries(classeEscolhas)) {
      // Filtrar por nivel minimo: nao exibir escolhas de nivel superior ao do personagem
      const nivelMinConfig = parseInt(config.nivelMinimo || 1);
      if ((personagem.nivel || 1) < nivelMinConfig) continue;
      const selecionados = personagem.escolhas_classe?.[chave] || [];

      // Tipo especial: pericias - gerar opcoes a partir das pericias da classe
      if (config.tipo === 'pericias') {
        const periciasDaClasse = info?.pericias_opcoes || [];
        escolhasHtml += `
          <div class="section-divider mt-2"><span>${config.titulo}</span></div>
          <div class="info-box info" style="font-size:0.85rem">${config.descricao}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0" id="escolha-${chave}">
            ${periciasDaClasse.map(p => `
              <div class="selection-card ${selecionados.includes(p) ? 'selected' : ''}"
                   data-escolha-classe="${chave}" data-opcao="${p}"
                   style="flex:1;min-width:120px;max-width:180px;cursor:pointer">
                <div class="card-nome" style="font-size:0.85rem">${p}</div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (config.tipo === 'pericias_fixas') {
        // Tipo pericias_fixas: exibe lista fixa de pericias independente da classe
        const opcoes = config.opcoes_fixas || [];
        escolhasHtml += `
          <div class="section-divider mt-2"><span>${config.titulo}</span></div>
          <div class="info-box info" style="font-size:0.85rem">${config.descricao}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0" id="escolha-${chave}">
            ${opcoes.map(p => `
              <div class="selection-card ${selecionados.includes(p) ? 'selected' : ''}"
                   data-escolha-classe="${chave}" data-opcao="${p}"
                   style="flex:1;min-width:120px;max-width:180px;cursor:pointer">
                <div class="card-nome" style="font-size:0.85rem">${p}</div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        escolhasHtml += `
          <div class="section-divider mt-2"><span>${config.titulo}</span></div>
          <div class="info-box info" style="font-size:0.85rem">${config.descricao}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0" id="escolha-${chave}">
            ${(config.opcoes || []).map(opt => `
              <div class="selection-card ${selecionados.includes(opt.nome) ? 'selected' : ''}"
                   data-escolha-classe="${chave}" data-opcao="${opt.nome}"
                   style="flex:1;min-width:140px;max-width:200px;cursor:pointer">
                <div class="card-nome" style="font-size:0.85rem">${opt.nome}</div>
                ${opt.descricao ? `<div class="card-detalhe" style="font-size:0.75rem">${opt.descricao}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  // Características de nível 1
  const caracteristicasExcluir = ['Ordem Divina', 'Estilo de Luta', 'Especialista', 'Explorador Hábil', 'Acadêmico'];
  let caracteristicas1 = '';
  if (classeData?.caracteristicas) {
    const feats = classeData.caracteristicas.filter(c => c.nivel === 1 && !caracteristicasExcluir.includes(c.nome));
    if (feats.length) {
      caracteristicas1 = `
        <div class="section-divider"><span>Características Nível 1</span></div>
        ${feats.map(f => `
          <details style="margin-bottom:8px">
            <summary style="font-weight:600;cursor:pointer;font-size:0.9rem">${f.nome}</summary>
            <div class="md-content" style="padding:8px 0;font-size:0.85rem">${mdParaHtml(f.descricao)}</div>
          </details>
        `).join('')}`;
    }
  }

  const corpoHtml = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <span class="badge badge-primary" style="font-size:0.9rem">d${info.dado_vida}</span>
      <span style="font-size:0.85rem;color:var(--text-muted)">${info.conjurador ? 'Conjurador' : 'Marcial'}</span>
    </div>
    <div class="row" style="font-size:0.85rem">
      <div class="col-2"><strong>Atributo Primário:</strong> ${info.atributo_primario}</div>
      <div class="col-2"><strong>Salvaguardas:</strong> ${salvaguardas}</div>
      <div class="col-2"><strong>Armaduras:</strong> ${armaduras}</div>
      <div class="col-2"><strong>Armas:</strong> ${armas}</div>
    </div>
    <div style="font-size:0.85rem;margin-top:8px">
      <strong>Perícias (escolha ${info.num_pericias}):</strong> ${pericias}
    </div>
    ${subclassesHtml}
    ${escolhasHtml}
    ${caracteristicas1}
  `;

  const iconePopup = getIconeClasse(nome);
  const tituloPopup = iconePopup
    ? `<span style="display:inline-flex;align-items:center;gap:10px;"><img src="${iconePopup}" class="classe-icon-card" style="width:26px;height:26px;" alt=""><span>${escHtml(nome)}</span></span>`
    : escHtml(nome);

  abrirModal(tituloPopup, corpoHtml, `
    <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
    <button class="btn btn-primary" id="popup-confirmar-classe">Selecionar ${nome}</button>
  `);

  // Evento subclasse
  document.getElementById('sel-subclasse')?.addEventListener('change', (e) => {
    personagem.subclasse = e.target.value;
  });

  // Eventos das escolhas de classe (generico)
  if (classeEscolhas) {
    document.querySelectorAll('[data-escolha-classe]').forEach(card => {
      card.addEventListener('click', () => {
        const chave = card.dataset.escolhaClasse;
        const opcao = card.dataset.opcao;
        const config = classeEscolhas[chave];
        if (!config) return;

        if (!personagem.escolhas_classe) personagem.escolhas_classe = {};
        let selecionados = personagem.escolhas_classe[chave] || [];

        if (selecionados.includes(opcao)) {
          selecionados = selecionados.filter(s => s !== opcao);
        } else {
          if (selecionados.length >= config.maxEscolhas) {
            if (config.maxEscolhas === 1) selecionados = [opcao];
          } else {
            selecionados.push(opcao);
          }
        }
        personagem.escolhas_classe[chave] = selecionados;

        // Aplicar efeitos especificos (compatibilidade)
        if (chave === 'ordem_divina') {
          personagem.ordem_divina = selecionados[0] || '';
          const opt = config.opcoes?.find(o => o.nome === selecionados[0]);
          if (opt?.efeito) {
            personagem.extras_classe = { ordem: selecionados[0], ...opt.efeito };
          }
        }
        if (chave === 'ordem_primal') {
          personagem.ordem_primal = selecionados[0] || '';
          const opt = config.opcoes?.find(o => o.nome === selecionados[0]);
          if (opt?.efeito) {
            personagem.extras_classe = { ordem: selecionados[0], ...opt.efeito };
          }
        }

        // Atualizar visual
        document.querySelectorAll(`[data-escolha-classe="${chave}"]`).forEach(c => {
          c.classList.toggle('selected', selecionados.includes(c.dataset.opcao));
        });
      });
    });
  }

  // Botao de confirmacao (com validação de escolhas obrigatórias)
  document.getElementById('popup-confirmar-classe')?.addEventListener('click', () => {
    // Validar escolhas obrigatórias antes de confirmar
    if (classeEscolhas) {
      for (const [chave, config] of Object.entries(classeEscolhas)) {
        const nivelMinimo = parseInt(config.nivelMinimo || 1);
        if ((personagem.nivel || 1) < nivelMinimo) continue;
        const selecionados = personagem.escolhas_classe?.[chave] || [];
        if (selecionados.length < config.maxEscolhas) {
          toast(`Selecione ${config.maxEscolhas} opção(ões) de ${config.titulo}`, 'error');
          return;
        }
      }
    }
    // Se mudou de classe, limpar dados especificos da classe anterior
    if (personagem.classe && personagem.classe !== nome) {
      personagem.subclasse = '';
      personagem.ordem_divina = '';
      personagem.ordem_primal = '';
      personagem.escolhas_classe = {};
      personagem.extras_classe = {};
      personagem.proficiencias_extra = [];
      delete dadosCache.classeData;
      // As pericias escolhidas eram da lista da classe anterior
      delete dadosCache.pericias_classe_sel;
    }
    personagem.classe = nome;
    // Compatibilidade: migrar ordem_divina
    if (nome === 'Clérigo' && personagem.ordem_divina && !personagem.escolhas_classe?.ordem_divina) {
      if (!personagem.escolhas_classe) personagem.escolhas_classe = {};
      personagem.escolhas_classe.ordem_divina = [personagem.ordem_divina];
    }
    if (nome === 'Druida' && personagem.ordem_primal && !personagem.escolhas_classe?.ordem_primal) {
      if (!personagem.escolhas_classe) personagem.escolhas_classe = {};
      personagem.escolhas_classe.ordem_primal = [personagem.ordem_primal];
    }
    window.fecharModal();
    // Re-renderizar o passo com o resumo atualizado
    const wizContent = document.getElementById('wizard-content');
    if (wizContent) renderStepClasse(wizContent);
  });
}