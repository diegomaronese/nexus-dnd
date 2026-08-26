// ============================================================
// Modal de edicao da ficha e subida de nivel
// Extraido de site/js/pages/sheet.js sem alteracao de comportamento.
// ============================================================
import { ATRIBUTOS_KEYS, ATRIBUTOS_NOMES, PERICIAS, POINT_BUY_CUSTOS, POINT_BUY_TOTAL, STANDARD_ARRAY } from '../dados-classes.js';
import { validarAtributosEditados, validarListaUnica } from '../ficha-edicao-validacoes.js';
import { aplicarEdicao, consolidarEdicoesAtributos, reverterEdicao } from '../ficha-edicoes.js';
import { abrirLevelUpCards } from '../levelup-ui.js';
import { XP_POR_NIVEL, podeSubirDeNivel } from '../levelup.js';
import { abrirModal, calcMod, escHtml, fmtMod, processarImagemArquivo, recortarImagemArquivo, toast } from '../utils.js';
import { campoEstaEditado, char, classeData, salvar, seloEdicao, talentosCache } from './estado.js';
import { renderFichaCompleta } from './ficha.js';
import { achatarMagiasClasse, ehSubclasseConjuradora, getSubclasseConjuradoraConjuracao, magiaContaNoLimite, obterMagiasDisponiveisClasseAtual } from './magias.js';
import { obterListasIniciadoEmMagiaUsadas, obterTiposAdeptoElementalUsados } from './talentos.js';

// Feature flag de migração do fluxo de level up em cards.
// Pode ser sobrescrita por:
// 1) window.__FEATURE_FLAGS__.LEVELUP_FLOW_V2
// 2) localStorage[feature.levelup.flow.v2]
const LEVELUP_FLOW_V2_DEFAULT = true;
const LEVELUP_FLOW_V2_STORAGE_KEY = 'feature.levelup.flow.v2';

function obterFlagLevelUpFlowV2() {
  try {
    const ffGlobal = window?.__FEATURE_FLAGS__?.LEVELUP_FLOW_V2;
    if (typeof ffGlobal === 'boolean') return ffGlobal;
    if (typeof ffGlobal === 'string') {
      const v = ffGlobal.trim().toLowerCase();
      if (['1', 'true', 'on', 'sim'].includes(v)) return true;
      if (['0', 'false', 'off', 'nao', 'não'].includes(v)) return false;
    }
  } catch (_) {
    // Ignorar e seguir para outras fontes da flag.
  }

  try {
    const raw = localStorage.getItem(LEVELUP_FLOW_V2_STORAGE_KEY);
    if (raw == null) return LEVELUP_FLOW_V2_DEFAULT;
    const v = String(raw).trim().toLowerCase();
    if (['1', 'true', 'on', 'sim'].includes(v)) return true;
    if (['0', 'false', 'off', 'nao', 'não'].includes(v)) return false;
  } catch (_) {
    // Ignorar e usar valor padrão.
  }

  return LEVELUP_FLOW_V2_DEFAULT;
}

function salvarFlagLevelUpFlowV2(ativo) {
  try {
    localStorage.setItem(LEVELUP_FLOW_V2_STORAGE_KEY, ativo ? 'true' : 'false');
  } catch (_) {
    // Sem persistência local disponível.
  }
}

// --- Edição do cabeçalho e detalhes ---
export function abrirModalEdicaoFicha(secaoInicial = 'identidade') {
  const secoes = ['identidade', 'atributos', 'pericias', 'detalhes'];
  const titulosSecoes = {
    identidade: 'Identidade & Foto',
    atributos: 'Atributos',
    pericias: 'Perícias',
    detalhes: 'Detalhes Pessoais'
  };
  const camposDetalhes = [
    { key: 'aparencia', label: 'Aparência' },
    { key: 'personalidade', label: 'Personalidade' },
    { key: 'ideais', label: 'Ideais' },
    { key: 'lacos', label: 'Laços' },
    { key: 'defeitos', label: 'Defeitos' },
    { key: 'historia_personagem', label: 'História' },
    { key: 'notas', label: 'Notas' }
  ];
  const alinhamentos = [
    '',
    'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
    'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
    'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
  ];

  let secao = secoes.includes(secaoInicial) ? secaoInicial : 'identidade';
  let imagemPendente = char.imagem || '';
  let nomePendente = char.nome || '';
  let alinhamentoPendente = char.alinhamento || '';
  let detalhesPendentes = Object.fromEntries(camposDetalhes.map(c => [c.key, char[c.key] || '']));
  let propostaAtributos = Object.fromEntries(ATRIBUTOS_KEYS.map(key => [key, char.atributos_base?.[key] ?? char.atributos[key]]));
  let periciasPendentes = [...(char.pericias_proficientes || [])];
  let atributosForamModificados = false;
  let periciasForamModificadas = false;

  const bonusAtributo = key => char.bonus_antecedente?.[key] || 0;
  const caixaAtributo = (key, conteudo) => {
    const base = propostaAtributos[key];
    const bonus = bonusAtributo(key);
    const total = base + bonus;
    return `<div class="atributo-box" data-key="${key}">
      <div class="atributo-nome">${ATRIBUTOS_NOMES[key]}${seloEdicao(`atributos.${key}`)}</div>
      ${conteudo}
      <div style="font-size:0.65rem;color:var(--text-muted)">base: <span class="atributo-base-val">${base}</span></div>
      ${bonus ? `<div style="font-size:0.7rem;color:var(--success)">+${bonus} antecedente</div>` : ''}
      <div class="atributo-mod">${fmtMod(calcMod(total))}</div>
      <div class="atributo-total">${total}</div>
    </div>`;
  };
  const atributosEstaoEditados = () => ATRIBUTOS_KEYS.some(key =>
    campoEstaEditado(`atributos_base.${key}`) || campoEstaEditado(`atributos.${key}`));

  const salvarValoresAbaAtual = () => {
    if (secao === 'identidade') {
      const inputNome = document.querySelector('[data-edicao-identidade="nome"]');
      if (inputNome) nomePendente = inputNome.value;
      const selectAlinhamento = document.querySelector('[data-edicao-identidade="alinhamento"]');
      if (selectAlinhamento) alinhamentoPendente = selectAlinhamento.value;
    } else if (secao === 'detalhes') {
      document.querySelectorAll('[data-edicao-detalhe]').forEach(el => {
        detalhesPendentes[el.dataset.edicaoDetalhe] = el.value;
      });
    } else if (secao === 'pericias') {
      const marcadas = [...document.querySelectorAll('[data-edicao-pericia]:checked')].map(el => el.dataset.edicaoPericia);
      if (marcadas.length > 0) {
        periciasPendentes = marcadas;
      }
    }
  };

  const render = () => {
    const iconeClasse = char.classe ? `assets/icons/classes/${char.classe.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.svg` : '';
    const avatarPreviewHtml = imagemPendente
      ? `<img src="${imagemPendente}" alt="">`
      : (iconeClasse
        ? `<img src="${iconeClasse}" style="width:36px;height:36px;object-fit:contain;" alt="">`
        : escHtml((nomePendente || char.classe || 'P').charAt(0).toUpperCase()));

    const navegacao = `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${secoes.map(s => `<button class="btn btn-sm ${s === secao ? 'btn-primary' : 'btn-secondary'}" data-edicao-secao="${s}">${titulosSecoes[s] || s}</button>`).join('')}</div>`;

    if (secao === 'identidade') {
      return navegacao + `
        <div class="form-group">
          <label class="form-label">Foto do Personagem${seloEdicao('imagem')}</label>
          <div class="edicao-foto-card">
            <div class="edicao-foto-preview-wrapper">
              <div class="edicao-foto-avatar" id="edicao-imagem-preview">
                ${avatarPreviewHtml}
              </div>
            </div>
            <div class="edicao-foto-controles">
              <div class="edicao-foto-botoes">
                <button type="button" class="btn btn-sm btn-secondary" id="edicao-imagem-btn" style="display:inline-flex;align-items:center;gap:6px">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>${imagemPendente ? 'Trocar Foto' : 'Selecionar Foto'}</span>
                </button>
                ${imagemPendente ? `
                  <button type="button" class="btn btn-sm btn-secondary" id="edicao-imagem-ajustar" style="display:inline-flex;align-items:center;gap:6px" title="Ajustar zoom, enquadramento e rotação da foto">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                    <span>Ajustar Recorte</span>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" id="edicao-imagem-remover" title="Remover Foto">
                    &times; Remover
                  </button>
                ` : ''}
                <input type="file" accept="image/*" id="edicao-imagem-input" style="display:none">
              </div>
              <div class="edicao-foto-dica">
                Formatos JPG, PNG ou WebP. Você pode posicionar, girar e ampliar para o formato circular.
              </div>
              ${campoEstaEditado('imagem') ? '<button class="btn btn-sm btn-secondary" data-reverter-campo="imagem" style="align-self:flex-start">Reverter foto original</button>' : ''}
            </div>
          </div>
        </div>

        <div class="form-group mt-2">
          <label class="form-label">Nome do Personagem${seloEdicao('nome')}</label>
          <input class="form-input" data-edicao-identidade="nome" value="${escHtml(nomePendente)}">
          ${campoEstaEditado('nome') ? '<button class="btn btn-sm btn-secondary mt-1" data-reverter-campo="nome">Reverter nome</button>' : ''}
        </div>

        <div class="form-group">
          <label class="form-label">Alinhamento${seloEdicao('alinhamento')}</label>
          <select class="form-input" data-edicao-identidade="alinhamento">
            ${alinhamentos.map(valor => `<option value="${escHtml(valor)}" ${alinhamentoPendente === valor ? 'selected' : ''}>${valor || '— Nenhum —'}</option>`).join('')}
          </select>
          ${campoEstaEditado('alinhamento') ? '<button class="btn btn-sm btn-secondary mt-1" data-reverter-campo="alinhamento">Reverter alinhamento</button>' : ''}
        </div>
      `;
    }

    if (secao === 'atributos') {
      const cfg = char.configuracao_criacao?.atributos || {};
      const metodo = cfg.metodo || '';
      const selecaoPorValores = valores => {
        const atribuicoes = {};
        const usados = new Set();
        ATRIBUTOS_KEYS.forEach(key => {
          const indice = valores.findIndex((valor, i) => valor === propostaAtributos[key] && !usados.has(i));
          if (indice >= 0) { atribuicoes[key] = indice; usados.add(indice); }
        });
        return ATRIBUTOS_KEYS.map(key => caixaAtributo(key, `<select class="form-select" style="font-size:0.85rem;padding:6px;margin:4px 0" data-edicao-atributo="${key}">
          <option value="">--</option>
          ${valores.map((valor, indice) => `<option value="${indice}" ${atribuicoes[key] === indice ? 'selected' : ''} ${usados.has(indice) && atribuicoes[key] !== indice ? 'disabled' : ''}>${valor}</option>`).join('')}
        </select>`)).join('');
      };
      let controles = ATRIBUTOS_KEYS.map(key => caixaAtributo(key, `<input type="number" class="form-input" style="text-align:center;font-size:1rem;padding:6px;font-weight:700" min="3" max="18" data-edicao-atributo="${key}" value="${propostaAtributos[key]}">`)).join('');
      let ajudaMetodo = 'Edite livremente os valores base dos atributos (mínimo: 3 | máximo: 18).';
      if (metodo === 'standard') {
        controles = selecaoPorValores(STANDARD_ARRAY);
        ajudaMetodo = 'Atribua cada valor do Conjunto Padrão uma vez: 15, 14, 13, 12, 10 e 8.';
      } else if (metodo === 'pointbuy') {
        const custoAtual = Object.values(propostaAtributos).reduce((total, valor) => total + (POINT_BUY_CUSTOS[valor] ?? 0), 0);
        const restante = POINT_BUY_TOTAL - custoAtual;
        controles = ATRIBUTOS_KEYS.map(key => {
          const base = propostaAtributos[key];
          const proximoCusto = POINT_BUY_CUSTOS[base + 1] ?? Infinity;
          const podeAumentar = base < 15 && custoAtual - (POINT_BUY_CUSTOS[base] ?? 0) + proximoCusto <= POINT_BUY_TOTAL;
          return caixaAtributo(key, `<div class="counter" style="justify-content:center;margin:4px 0">
            <button class="counter-btn" data-edicao-pointbuy="${key}" data-dir="-1" ${base <= 8 ? 'disabled' : ''}>-</button>
            <span style="font-weight:700;min-width:24px;text-align:center">${base}</span>
            <button class="counter-btn" data-edicao-pointbuy="${key}" data-dir="1" ${!podeAumentar ? 'disabled' : ''}>+</button>
          </div>
          <div style="font-size:0.65rem;color:var(--text-muted)">custo: ${POINT_BUY_CUSTOS[base] ?? 0}</div>`);
        }).join('');
        ajudaMetodo = `Pontos restantes: <strong>${restante}</strong> / ${POINT_BUY_TOTAL}. Valores permitidos: 8 a 15.`;
      } else if (metodo === 'rolagem') {
        const rolados = Object.values(cfg.rolagens || cfg.valoresBase || propostaAtributos);
        controles = selecaoPorValores(rolados);
        ajudaMetodo = `Resultados da rolagem preservados: ${rolados.join(', ')}. Redistribua-os entre os atributos; não é possível rolar novamente.`;
      } else if (metodo === 'manual') {
        controles = ATRIBUTOS_KEYS.map(key => caixaAtributo(key, `<input type="number" class="form-input" style="text-align:center;font-size:1rem;padding:6px;font-weight:700" min="3" max="18" data-edicao-atributo="${key}" value="${propostaAtributos[key]}">`)).join('');
        ajudaMetodo = 'Edite livremente os valores base dos atributos (mínimo: 3 | máximo: 18).';
      }
      return navegacao + `
        <div class="info-box info" style="font-size:0.8rem;margin-bottom:10px">${ajudaMetodo} Ganhos de nível permanecem preservados ao reverter.</div>
        ${!metodo ? `<div class="form-group"><label class="form-label">Método usado na criação</label><select id="edicao-metodo-atributos" class="form-input"><option value="">-- Selecionar --</option><option value="standard">Conjunto Padrão</option><option value="pointbuy">Compra de Pontos</option><option value="rolagem">Rolagem 4d6</option><option value="manual">Valores Manuais</option></select></div>` : `<div class="form-group"><label class="form-label">Método usado na criação</label><select class="form-input" disabled><option>${escHtml({ standard: 'Conjunto Padrão', pointbuy: 'Compra de Pontos', rolagem: 'Rolagem 4d6', manual: 'Valores Manuais' }[metodo] || metodo)}</option></select></div>`}
        <div class="atributos-grid atributos-grid-edicao">${controles}</div>
        ${atributosEstaoEditados() ? '<button class="btn btn-sm btn-secondary mt-1" data-reverter-atributos>Reverter distribuição de atributos</button>' : ''}`;
    }

    if (secao === 'pericias') {
      const limite = (char.pericias_proficientes || []).length;
      return navegacao + `
        <div class="info-box info" style="font-size:0.8rem;margin-bottom:10px">Mantenha ${limite} proficiência(s). Especializações continuam exigindo proficiência.</div>
        <div style="max-height:45vh;overflow:auto">
          ${PERICIAS.map(p => `<label class="form-check" style="justify-content:flex-start;margin:0 0 6px"><input type="checkbox" data-edicao-pericia="${escHtml(p.nome)}" ${periciasPendentes.includes(p.nome) ? 'checked' : ''}> ${p.nome}${(char.pericias_expertise || []).includes(p.nome) ? ' (Especialização)' : ''}</label>`).join('')}
        </div>
        ${campoEstaEditado('pericias_proficientes') ? '<button class="btn btn-sm btn-secondary mt-1" data-reverter-campo="pericias_proficientes">Reverter perícias</button>' : ''}`;
    }

    if (secao === 'detalhes') {
      return navegacao + `
        <div class="section-divider" style="margin-top:0"><span>Detalhes Pessoais & História</span></div>
        ${camposDetalhes.map(c => `<div class="form-group">
          <label class="form-label">${c.label}${seloEdicao(c.key)}</label>
          <textarea class="form-textarea" rows="2" data-edicao-detalhe="${c.key}">${escHtml(detalhesPendentes[c.key] || '')}</textarea>
          ${campoEstaEditado(c.key) ? `<button class="btn btn-sm btn-secondary mt-1" data-reverter-campo="${c.key}">Reverter</button>` : ''}
        </div>`).join('')}`;
    }

    return navegacao;
  };

  const abrir = () => {
    abrirModal(
      'Editar Ficha',
      `<div id="edicao-ficha-corpo">${render()}</div>`,
      '<button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button><button class="btn btn-primary" id="btn-salvar-edicao-ficha">Salvar</button>'
    );
    vincular();
  };

  const vincular = () => {
    document.querySelectorAll('[data-edicao-secao]').forEach(btn => btn.addEventListener('click', () => {
      salvarValoresAbaAtual();
      secao = btn.dataset.edicaoSecao;
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    }));

    // Método de atributos (se ainda não definido na criação)
    document.getElementById('edicao-metodo-atributos')?.addEventListener('change', (e) => {
      atributosForamModificados = true;
      const novoMetodo = e.target.value;
      if (!char.configuracao_criacao) char.configuracao_criacao = {};
      if (!char.configuracao_criacao.atributos) char.configuracao_criacao.atributos = {};
      char.configuracao_criacao.atributos.metodo = novoMetodo;
      if (!char.configuracao_criacao.atributos.valoresBase) {
        char.configuracao_criacao.atributos.valoresBase = { ...char.atributos_base };
      }
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    });

    // Atributos
    document.querySelectorAll('[data-edicao-atributo]').forEach(input => {
      const atualizarVisualBox = (key, val) => {
        const box = input.closest('.atributo-box');
        if (box) {
          const bonus = bonusAtributo(key);
          const total = val + bonus;
          const modEl = box.querySelector('.atributo-mod');
          const totalEl = box.querySelector('.atributo-total');
          const baseEl = box.querySelector('.atributo-base-val');
          if (modEl) modEl.textContent = fmtMod(calcMod(total));
          if (totalEl) totalEl.textContent = total;
          if (baseEl) baseEl.textContent = val;
        }
      };

      input.addEventListener('input', () => {
        if (input.tagName === 'INPUT') {
          const key = input.dataset.edicaoAtributo;
          const val = parseInt(input.value);
          if (!isNaN(val)) {
            atributosForamModificados = true;
            propostaAtributos[key] = val;
            atualizarVisualBox(key, val);
          }
        }
      });

      input.addEventListener('change', () => {
        atributosForamModificados = true;
        const metodo = char.configuracao_criacao?.atributos?.metodo || document.getElementById('edicao-metodo-atributos')?.value || '';
        if (metodo === 'standard' || metodo === 'rolagem') {
          const valores = metodo === 'standard'
            ? STANDARD_ARRAY
            : Object.values(char.configuracao_criacao?.atributos?.rolagens || char.configuracao_criacao?.atributos?.valoresBase || propostaAtributos);
          const idx = parseInt(input.value);
          if (!isNaN(idx) && valores[idx] !== undefined) {
            propostaAtributos[input.dataset.edicaoAtributo] = valores[idx];
            const corpo = document.getElementById('edicao-ficha-corpo');
            if (corpo) { corpo.innerHTML = render(); vincular(); }
          }
        } else {
          let val = parseInt(input.value);
          if (isNaN(val)) val = 10;
          if (val < 3) val = 3;
          if (val > 18) val = 18;
          input.value = val;
          propostaAtributos[input.dataset.edicaoAtributo] = val;
          atualizarVisualBox(input.dataset.edicaoAtributo, val);
        }
      });
    });

    document.querySelectorAll('[data-edicao-pointbuy]').forEach(btn => btn.addEventListener('click', () => {
      atributosForamModificados = true;
      const key = btn.dataset.edicaoPointbuy;
      propostaAtributos[key] += parseInt(btn.dataset.dir);
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    }));

    // Perícias
    document.querySelectorAll('[data-edicao-pericia]').forEach(chk => chk.addEventListener('change', () => {
      periciasForamModificadas = true;
      periciasPendentes = [...document.querySelectorAll('[data-edicao-pericia]:checked')].map(el => el.dataset.edicaoPericia);
    }));

    // Imagem: Escolher novo arquivo
    document.getElementById('edicao-imagem-btn')?.addEventListener('click', () => {
      document.getElementById('edicao-imagem-input')?.click();
    });

    document.getElementById('edicao-imagem-input')?.addEventListener('change', async event => {
      const arquivo = event.target.files?.[0];
      event.target.value = '';
      if (!arquivo) return;
      const dataUrl = await recortarImagemArquivo(arquivo, { tamanhoSaida: 320 });
      if (!dataUrl) return;
      imagemPendente = dataUrl;
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    });

    // Imagem: Ajustar imagem atual
    document.getElementById('edicao-imagem-ajustar')?.addEventListener('click', async () => {
      if (!imagemPendente) return;
      const dataUrl = await recortarImagemArquivo(imagemPendente, { tamanhoSaida: 320 });
      if (!dataUrl) return;
      imagemPendente = dataUrl;
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    });

    // Imagem: Remover
    document.getElementById('edicao-imagem-remover')?.addEventListener('click', () => {
      imagemPendente = '';
      const corpo = document.getElementById('edicao-ficha-corpo');
      if (corpo) { corpo.innerHTML = render(); vincular(); }
    });

    // Reversões
    document.querySelector('[data-reverter-atributos]')?.addEventListener('click', () => {
      consolidarEdicoesAtributos(char);
      const mudouBase = reverterEdicao(char, 'atributos_base');
      const mudouTotal = reverterEdicao(char, 'atributos');
      if (mudouBase || mudouTotal) {
        salvar();
        window.fecharModal();
        renderFichaCompleta();
        toast('Distribuição de atributos restaurada.', 'success');
      }
    });

    document.querySelectorAll('[data-reverter-campo]').forEach(btn => btn.addEventListener('click', () => {
      if (reverterEdicao(char, btn.dataset.reverterCampo)) {
        salvar();
        window.fecharModal();
        renderFichaCompleta();
        toast('Campo restaurado.', 'success');
      }
    }));

    // Salvar todas as alterações da ficha
    document.getElementById('btn-salvar-edicao-ficha')?.addEventListener('click', () => {
      salvarValoresAbaAtual();

      // Se atributos foram alterados ou se está na aba atributos
      if (atributosForamModificados || secao === 'atributos') {
        const metodo = char.configuracao_criacao?.atributos?.metodo || document.getElementById('edicao-metodo-atributos')?.value;
        if (!metodo && secao === 'atributos') { toast('Informe o método de criação dos atributos.', 'error'); return; }
        if (metodo) {
          const proposta = { ...propostaAtributos };
          if (Object.values(proposta).some(v => !Number.isInteger(v))) {
            toast('Informe todos os atributos corretamente.', 'error');
            return;
          }
          if (!char.configuracao_criacao) char.configuracao_criacao = {};
          if (!char.configuracao_criacao.atributos) char.configuracao_criacao.atributos = {};
          if (!char.configuracao_criacao.atributos.valoresBase) char.configuracao_criacao.atributos.valoresBase = { ...char.atributos_base };
          if (!char.configuracao_criacao.atributos.rolagens && metodo === 'rolagem') char.configuracao_criacao.atributos.rolagens = { ...char.atributos_base };
          char.configuracao_criacao.atributos.metodo = metodo;
          const resultado = validarAtributosEditados(char, proposta, { STANDARD_ARRAY, POINT_BUY_CUSTOS, POINT_BUY_TOTAL });
          if (!resultado.ok) { toast(resultado.erro, 'error'); return; }
          const atributosPropostos = Object.fromEntries(ATRIBUTOS_KEYS.map(k => {
            const bonus = char.bonus_antecedente?.[k] || 0;
            const ganhoSistema = (char.atributos?.[k] || 0) - (char.atributos_base?.[k] || 0) - bonus;
            return [k, proposta[k] + bonus + ganhoSistema];
          }));
          if (Object.values(atributosPropostos).some(valor => valor > 20)) { toast('Nenhum atributo pode ultrapassar 20.', 'error'); return; }
          consolidarEdicoesAtributos(char);
          const mudouBase = ATRIBUTOS_KEYS.some(k => char.atributos_base?.[k] !== proposta[k]);
          const mudouTotal = ATRIBUTOS_KEYS.some(k => char.atributos?.[k] !== atributosPropostos[k]);
          if (mudouBase || mudouTotal) {
            aplicarEdicao(char, 'atributos_base', proposta);
            aplicarEdicao(char, 'atributos', atributosPropostos);
            consolidarEdicoesAtributos(char);
          }
        }
      }

      // Se perícias foram alteradas ou se está na aba perícias
      if (periciasForamModificadas || secao === 'pericias') {
        const limite = (char.pericias_proficientes || []).length;
        if (periciasPendentes.length > 0 || limite > 0) {
          const resultado = validarListaUnica(periciasPendentes, new Set(PERICIAS.map(p => p.nome)), limite, 'Perícias');
          if (!resultado.ok) { toast(resultado.erro, 'error'); return; }
          if ((char.pericias_expertise || []).some(p => !periciasPendentes.includes(p))) {
            toast('Não remova uma perícia com Especialização.', 'error');
            return;
          }
          aplicarEdicao(char, 'pericias_proficientes', periciasPendentes);
        }
      }

      // Identidade & Foto
      if (nomePendente && nomePendente.trim()) {
        aplicarEdicao(char, 'nome', nomePendente.trim());
      }
      if (alinhamentoPendente !== undefined) {
        aplicarEdicao(char, 'alinhamento', alinhamentoPendente);
      }
      if (imagemPendente !== undefined && imagemPendente !== char.imagem) {
        aplicarEdicao(char, 'imagem', imagemPendente);
      }

      // Detalhes pessoais
      camposDetalhes.forEach(c => {
        if (detalhesPendentes[c.key] !== undefined && detalhesPendentes[c.key] !== (char[c.key] || '')) {
          aplicarEdicao(char, c.key, detalhesPendentes[c.key]);
        }
      });

      salvar();
      window.fecharModal();
      window.definirTituloHeader?.(char.nome);
      renderFichaCompleta();
      toast('Alterações salvas com sucesso!', 'success');
    });
  };

  abrir();
}

export function setupEventosEdicao() {
  document.getElementById('btn-editar-ficha')?.addEventListener('click', () => abrirModalEdicaoFicha('identidade'));
  document.getElementById('char-avatar-btn')?.addEventListener('click', () => abrirModalEdicaoFicha('identidade'));
  document.getElementById('char-avatar-btn')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirModalEdicaoFicha('identidade');
    }
  });

  // Editar detalhes pessoais
  document.getElementById('btn-edit-detalhes')?.addEventListener('click', () => abrirModalEdicaoFicha('detalhes'));

  // Editar cabeçalho
  document.getElementById('btn-edit-header')?.addEventListener('click', () => abrirModalEdicaoFicha('identidade'));

  // Editar XP
  document.getElementById('xp-display')?.addEventListener('click', () => {
    abrirModal('Gerenciar Pontos de Experiência', `
      <div class="form-group">
        <label class="form-label" for="edit-xp-atual">XP Atual</label>
        <input type="number" class="form-input" id="edit-xp-atual" value="${char.xp || 0}" min="0">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">
          Nível Atual: ${char.nivel}${char.nivel < 20 ? ` | Próximo Nível (${char.nivel + 1}): ${XP_POR_NIVEL[char.nivel + 1]} XP` : ' (Máximo)'}
        </div>
      </div>
      <div class="section-divider mt-2"><span>Adicionar XP</span></div>
      <div class="form-group">
        <label class="form-label" for="add-xp">Ganhar XP</label>
        <input type="number" class="form-input" id="add-xp" placeholder="Quantidade de XP para adicionar" min="0">
      </div>
    `, '<button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button><button class="btn btn-primary" id="btn-salvar-xp">Salvar</button>');

    document.getElementById('btn-salvar-xp')?.addEventListener('click', () => {
      const novoXP = parseInt(document.getElementById('edit-xp-atual')?.value) || 0;
      const addXP = parseInt(document.getElementById('add-xp')?.value) || 0;
      
      char.xp = novoXP + addXP;
      
      salvar();
      window.fecharModal();
      
      // Verificar se pode subir de nível
      if (podeSubirDeNivel(char)) {
        toast(`XP atualizado! Você pode subir para o nível ${char.nivel + 1}!`, 'success');
      } else {
        toast('XP atualizado com sucesso!', 'success');
      }
      
      renderFichaCompleta();
    });
  });

  // Level Up
  document.getElementById('btn-levelup')?.addEventListener('click', async () => {
    await abrirModalLevelUp();
  });
}

// Modal de subir de nivel - delega para o sistema de cards dinamicos
async function abrirModalLevelUp() {
  if (!obterFlagLevelUpFlowV2()) {
    const html = `
      <div style="display:flex;flex-direction:column;gap:10px;font-size:0.9rem">
        <div>O fluxo de <strong>Level Up V2</strong> está desativado pela feature flag de migração.</div>
        <div style="font-size:0.85rem;color:var(--text-muted)">
          Chave local: <code>${LEVELUP_FLOW_V2_STORAGE_KEY}</code>
        </div>
      </div>
    `;
    abrirModal(
      'Level Up V2 desativado',
      html,
      '<button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>' +
      '<button class="btn btn-accent" id="btn-enable-levelup-v2">Ativar V2 e continuar</button>'
    );

    document.getElementById('btn-enable-levelup-v2')?.addEventListener('click', async () => {
      salvarFlagLevelUpFlowV2(true);
      window.fecharModal?.();
      await abrirModalLevelUp();
    });
    return;
  }

  const helpers = {
    ehSubclasseConjuradora,
    getSubclasseConjuradoraConjuracao,
    obterMagiasDisponiveisClasseAtual,
    obterListasIniciadoEmMagiaUsadas,
    obterTiposAdeptoElementalUsados,
    achatarMagiasClasse,
    magiaContaNoLimite
  };
  const caches = { talentosCache };
  try {
    await abrirLevelUpCards(char, classeData, helpers, caches, salvar, renderFichaCompleta);
  } catch (err) {
    console.error('Falha ao abrir fluxo de level up V2:', err);
    toast('Não foi possível abrir o fluxo de level up. Tente novamente.', 'error');
  }
}