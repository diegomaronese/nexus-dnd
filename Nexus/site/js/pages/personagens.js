// ============================================================
// Página: Meus Personagens - Gerenciamento e lista de fichas
// ============================================================
import {
  listarPersonagens,
  removerPersonagem,
  duplicarPersonagem,
  exportarTodos,
  exportarPersonagem,
  importarPersonagens,
  atualizarListaLocal,
  backupPersonagensLocais,
  restaurarPersonagensLocais
} from '../store.js';
import { enfileirarSync, obterIdsPendentesRemocao } from '../sync.js';
import { toast, abrirModal, fecharModal, escHtml } from '../utils.js';
import { CLASSES_INFO } from '../dados-classes.js';
import { iniciarAuth, getUsuario, onAuthChange, buscarPersonagensCloud } from '../auth.js';
import { definirTituloHeader, navegar } from '../app.js';

let _containerRef = null;
let _sincronizando = false;

export function renderPersonagens(container) {
  _containerRef = container;
  definirTituloHeader('Fichas');

  const personagens = listarPersonagens();
  const usuario = getUsuario();

  // Iniciar Firebase em background (não bloqueia a renderização)
  iniciarAuth().then(() => {
    if (!renderPersonagens._authRegistrado) {
      renderPersonagens._authRegistrado = true;
      onAuthChange(() => {
        if (_containerRef) renderPersonagens(_containerRef);
      });
    }
  });

  _renderConteudo(container, personagens, usuario);
}

function _renderConteudo(container, personagens, usuario) {
  const heroHtml = `
    <!-- Cabeçalho da Página -->
    <div class="personagens-hero">
      <div>
        <div class="personagens-hero-title">
          <span>🧙 Meus Personagens</span>
        </div>
        <div class="personagens-hero-desc">
          Gerencie, visualize e edite suas fichas de personagens, com suporte a salvamento local, sincronização em nuvem e exportação.
        </div>
      </div>
    </div>
  `;

  // Barra de sincronização caso esteja logado
  const syncBarHtml = usuario
    ? `<div class="card" style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:16px;background:var(--bg-input)">
        <img src="${escHtml(usuario.photoURL || '')}" alt="" style="width:28px;height:28px;border-radius:50%;${usuario.photoURL ? '' : 'display:none'}" referrerpolicy="no-referrer">
        <div style="flex:1;min-width:0">
          <div style="font-size:0.82rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(usuario.displayName || usuario.email || '')}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">Nuvem ativa &bull; Sincronização automática</div>
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-sync-cloud" title="Sincronizar agora">&#x21bb; Sincronizar</button>
      </div>`
    : '';

  if (personagens.length === 0) {
    container.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto;">
        ${heroHtml}
        ${syncBarHtml}

        <div class="empty-state" style="padding: 40px 20px;">
          <img src="img/dnd-icon.svg" alt="D&D" width="85" height="85" style="opacity: 0.85; margin-bottom: 12px;">
          <h2 style="font-size: 1.3rem; color: #ffffff; margin-bottom: 6px;">Nenhum personagem cadastrado</h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Crie seu primeiro personagem para D&D 5.5e ou importe uma ficha salva anteriormente.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" onclick="navegar('criar')">
              + Criar Novo Personagem
            </button>
            <button class="btn btn-secondary btn-lg" id="btn-importar">
              📥 Importar Ficha (.json)
            </button>
          </div>
        </div>
      </div>
    `;

    setupImportar(container);
    _setupSyncEvent(container);
    _sincronizarSeLogado(container);
    return;
  }

  container.innerHTML = `
    <div style="max-width: 760px; margin: 0 auto;">
      ${heroHtml}
      ${syncBarHtml}

      <div class="flex justify-between items-center mb-2" style="flex-wrap: wrap; gap: 10px;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #ffffff; margin: 0;">Fichas Criadas (${personagens.length})</h2>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
            Clique em qualquer ficha para abrir, rolar dados e jogar.
          </div>
        </div>
        <div class="flex gap-1" style="flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary" id="btn-exportar" title="Exportar todos os personagens num único arquivo">
            📤 Exportar Todos
          </button>
          <button class="btn btn-sm btn-secondary" id="btn-importar" title="Importar arquivo com 1 ou vários personagens">
            📥 Importar
          </button>
          <button class="btn btn-sm btn-primary" onclick="navegar('criar')">
            + Novo Personagem
          </button>
        </div>
      </div>

      <div class="char-list">
        ${personagens.map(p => renderCharCard(p)).join('')}
      </div>

      <div class="mt-3 text-center">
        <button class="btn btn-primary btn-lg btn-block" onclick="navegar('criar')">
          + Criar Outro Personagem
        </button>
      </div>
    </div>
  `;

  // Eventos de clique nos cards
  container.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.char-actions')) return;
      navegar(`ficha/${card.dataset.id}`);
    });
  });

  // Botões de ação nos cards
  container.querySelectorAll('[data-action="duplicar"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.char-card').dataset.id;
      duplicarPersonagem(id);
      toast('Personagem duplicado!', 'success');
      renderPersonagens(container);
    });
  });

  container.querySelectorAll('[data-action="exportar-individual"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.char-card').dataset.id;
      const p = personagens.find(x => x.id === id);
      const json = exportarPersonagem(id);
      if (!json) {
        toast('Erro ao exportar personagem', 'error');
        return;
      }
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dnd_personagem_${(p?.nome || 'sem_nome').replace(/[^\w\-]+/g, '_')}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`${p?.nome || 'Personagem'} exportado!`, 'success');
    });
  });

  container.querySelectorAll('[data-action="excluir"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.char-card').dataset.id;
      const p = personagens.find(x => x.id === id);
      abrirModal(
        'Excluir Personagem',
        `<p>Tem certeza que deseja excluir <strong>${escHtml(p?.nome) || 'este personagem'}</strong>?</p><p style="color:var(--danger);font-size:0.85rem;margin-top:8px;">Esta ação não pode ser desfeita.</p>`,
        `<button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
         <button class="btn btn-danger" id="btn-confirmar-excluir">Excluir</button>`
      );
      document.getElementById('btn-confirmar-excluir').addEventListener('click', () => {
        removerPersonagem(id);
        fecharModal();
        toast('Personagem excluído', 'error');
        renderPersonagens(container);
      });
    });
  });

  // Exportar Todos
  const btnExportar = document.getElementById('btn-exportar');
  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      const json = exportarTodos();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dnd_personagens_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Exportados com sucesso!', 'success');
    });
  }

  setupImportar(container);
  _setupSyncEvent(container);
  _sincronizarSeLogado(container);
}

function _setupSyncEvent(container) {
  document.getElementById('btn-sync-cloud')?.addEventListener('click', () => {
    _sincronizarSeLogado(container, true);
  });
}

/**
 * Sincroniza personagens com a nuvem (se logado).
 */
async function _sincronizarSeLogado(container, manual = false) {
  const usuario = getUsuario();
  if (!usuario || _sincronizando) return;

  _sincronizando = true;
  try {
    if (manual) toast('Sincronizando...', 'info');
    backupPersonagensLocais();
    const listaCloud = await buscarPersonagensCloud();
    const listaLocal = listarPersonagens();

    const mapaCloud = new Map(listaCloud.map(p => [p.id, p]));
    const mapaLocal = new Map(listaLocal.map(p => [p.id, p]));
    const todosIds = new Set([...mapaCloud.keys(), ...mapaLocal.keys()]);
    const idsPendentesRemocao = obterIdsPendentesRemocao();

    const listaMergida = [];
    const paraEnviarCloud = [];

    for (const id of todosIds) {
      const cloud = mapaCloud.get(id);
      const local = mapaLocal.get(id);

      if (!local) {
        if (!idsPendentesRemocao.has(id)) {
          listaMergida.push(cloud);
        }
      } else if (!cloud) {
        listaMergida.push(local);
        paraEnviarCloud.push(local);
      } else {
        const tCloud = new Date(cloud.atualizado_em || 0).getTime();
        const tLocal = new Date(local.atualizado_em || 0).getTime();
        if (tLocal > tCloud) {
          listaMergida.push(local);
          paraEnviarCloud.push(local);
        } else {
          listaMergida.push(cloud);
        }
      }
    }

    atualizarListaLocal(listaMergida);

    for (const p of paraEnviarCloud) {
      enfileirarSync(p);
    }

    if (manual) {
      toast('Sincronizado com sucesso!', 'success');
      renderPersonagens(container);
    } else {
      const mudou = listaMergida.length !== listaLocal.length ||
        listaMergida.some(m => {
          const l = mapaLocal.get(m.id);
          return !l || m.atualizado_em !== l.atualizado_em;
        });
      if (mudou) renderPersonagens(container);
    }
  } catch (err) {
    console.warn('Erro na sincronização:', err);
    if (manual) toast('Erro ao sincronizar: ' + (err.message || ''), 'error');
  } finally {
    _sincronizando = false;
  }
}

function setupImportar(container) {
  const btnImportar = document.getElementById('btn-importar');
  if (btnImportar) {
    btnImportar.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = importarPersonagens(ev.target.result);
          if (result >= 0) {
            toast(`${result} personagem(ns) importado(s)!`, 'success');
            renderPersonagens(container);
          } else {
            toast('Erro ao importar arquivo', 'error');
          }
        };
        reader.readAsText(file);
      });
      input.click();
    });
  }
}

function renderCharCard(p) {
  const inicial = (p.nome || p.classe || '?')[0].toUpperCase();
  const info = CLASSES_INFO[p.classe];
  const dadoVida = info ? `d${info.dado_vida}` : '';

  return `
    <div class="card char-card" data-id="${escHtml(p.id)}">
      <div class="char-avatar">${p.imagem ? `<img src="${p.imagem}" alt="">` : escHtml(inicial)}</div>
      <div class="char-info">
        <div class="char-nome">${escHtml(p.nome) || 'Sem nome'}</div>
        <div class="char-detalhe">
          ${escHtml(p.especie || '')} ${escHtml(p.classe || '')}
          ${p.subclasse ? `(${escHtml(p.subclasse)})` : ''}
          ${dadoVida ? `&middot; ${dadoVida}` : ''}
        </div>
      </div>
      <div class="char-nivel">Nv. ${escHtml(p.nivel ?? 1)}</div>
      <div class="char-actions" style="display:flex;gap:4px;margin-left:8px;">
        <button class="btn btn-sm btn-secondary" data-action="exportar-individual" title="Exportar este personagem (arquivo só com ele)">&#x21E9;</button>
        <button class="btn btn-sm btn-secondary" data-action="duplicar" title="Duplicar">&#x2398;</button>
        <button class="btn btn-sm btn-danger" data-action="excluir" title="Excluir">&times;</button>
      </div>
    </div>
  `;
}
