// ============================================================
// App principal - Router SPA e inicialização
// ============================================================
import { renderHome } from './pages/home.js';
import { renderPersonagens } from './pages/personagens.js';
import { renderCreator } from './pages/creator.js';
import { renderSheet } from './pages/sheet.js';
import { renderCompendio } from './pages/compendio.js';
import { renderDados } from './pages/dados.js';
import { inicializarSync } from './sync.js';
import { carregarTaxasMoeda } from './store.js';
import { toast, abrirModal } from './utils.js';

// --- Router baseado em hash ---
const routes = {
  'home': renderHome,
  'personagens': renderPersonagens,
  'criar': renderCreator,
  'ficha': renderSheet,
  'compendio': renderCompendio,
  'dados': renderDados
};

let _ultimaRota = '';
let _scrollMap = new Map();
let _manterProximoScroll = false;
let _posicaoScrollDesejada = null;

/** Rola a janela e containers principais para o topo absoluto */
export function rolarParaOTopo() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  const content = document.getElementById('app-content');
  if (content) content.scrollTop = 0;
}
window.rolarParaOTopo = rolarParaOTopo;

/** Navegar para uma rota */
export function navegar(rota, opcoes = {}) {
  const rotaAtual = window.location.hash.slice(1) || 'home';
  const scrollAtual = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
  
  if (rotaAtual) {
    _scrollMap.set(rotaAtual, scrollAtual);
  }

  const { manterScroll = false, scrollTopo = false } = opcoes;
  const ehInternoCompendio = rotaAtual.startsWith('compendio') && rota.startsWith('compendio');
  const ehEntradaDetalheClasse = rotaAtual === 'compendio/classes' && rota.startsWith('compendio/classes/');
  const ehMesmaSecaoEquip = rota.startsWith('compendio/equipamento') && rotaAtual.startsWith('compendio/equipamento');
  const ehMesmaSecaoRegras = rota.startsWith('compendio/regras') && rotaAtual.startsWith('compendio/regras');
  const ehMesmaClasse = rota.startsWith('compendio/classes/') && rotaAtual.startsWith('compendio/classes/');
  
  let deveManter = false;
  let posDesejada = 0;

  if (!scrollTopo && !ehEntradaDetalheClasse) {
    if (manterScroll || ehMesmaSecaoEquip || ehMesmaSecaoRegras || ehMesmaClasse) {
      deveManter = true;
      posDesejada = scrollAtual;
    } else if (ehInternoCompendio) {
      if (_scrollMap.has(rota)) {
        deveManter = true;
        posDesejada = _scrollMap.get(rota);
      }
    }
  }

  _manterProximoScroll = deveManter;
  if (deveManter) {
    _posicaoScrollDesejada = posDesejada;
  } else {
    _posicaoScrollDesejada = 0;
    rolarParaOTopo();
  }

  if (window.location.hash === `#${rota}`) {
    processarRota();
  } else {
    window.location.hash = rota;
  }
}
window.navegar = navegar;

/** Define o texto do header. */
export function definirTituloHeader(texto) {
  const el = document.getElementById('header-titulo');
  const divider = document.getElementById('header-divider');
  if (!el) return;
  const textoLimpo = (texto || '').trim();
  el.textContent = textoLimpo;
  if (divider) {
    divider.style.display = textoLimpo ? 'inline-block' : 'none';
  }
}
window.definirTituloHeader = definirTituloHeader;

/** Processa a rota atual do hash */
function processarRota() {
  const hash = window.location.hash.slice(1) || 'home';
  const partes = hash.split('/');
  const pagina = partes[0];
  const param = partes.slice(1).join('/');

  const scrollAtual = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
  if (_ultimaRota && _ultimaRota !== hash) {
    _scrollMap.set(_ultimaRota, scrollAtual);
  }

  const ehInternoCompendio = _ultimaRota.startsWith('compendio') && hash.startsWith('compendio');
  const ehEntradaDetalheClasse = _ultimaRota === 'compendio/classes' && hash.startsWith('compendio/classes/');
  const ehMesmaSecaoEquip = _ultimaRota.startsWith('compendio/equipamento') && hash.startsWith('compendio/equipamento');
  const ehMesmaSecaoRegras = _ultimaRota.startsWith('compendio/regras') && hash.startsWith('compendio/regras');
  const ehMesmaClasse = _ultimaRota.startsWith('compendio/classes/') && hash.startsWith('compendio/classes/');

  let deveManterScroll = false;
  if (_manterProximoScroll) {
    deveManterScroll = true;
  } else if (ehInternoCompendio && !ehEntradaDetalheClasse) {
    if (ehMesmaSecaoEquip || ehMesmaSecaoRegras || ehMesmaClasse) {
      deveManterScroll = true;
    } else if (_scrollMap.has(hash)) {
      deveManterScroll = true;
    }
  }

  const posDesejada = deveManterScroll
    ? (_posicaoScrollDesejada !== null ? _posicaoScrollDesejada : ((ehMesmaSecaoEquip || ehMesmaSecaoRegras || ehMesmaClasse) ? scrollAtual : (_scrollMap.get(hash) ?? scrollAtual)))
    : 0;

  _manterProximoScroll = false;
  _posicaoScrollDesejada = null;

  if (!deveManterScroll) {
    rolarParaOTopo();
  }

  const render = routes[pagina];
  const content = document.getElementById('app-content');
  if (content && !deveManterScroll) {
    content.scrollTop = 0;
  }
  const btnVoltar = document.getElementById('btn-voltar');
  const acoes = document.getElementById('header-acoes');

  // Limpar estado anterior
  acoes.innerHTML = '';
  btnVoltar.style.display = pagina === 'home' ? 'none' : 'block';

  // Configuração do botão voltar
  const iconeVoltar = document.getElementById('icone-voltar');
  if (pagina === 'ficha') {
    iconeVoltar.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
    btnVoltar.onclick = () => navegar('personagens');
  } else if (pagina === 'criar') {
    iconeVoltar.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
    btnVoltar.onclick = () => navegar('personagens');
  } else if (pagina === 'compendio') {
    iconeVoltar.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
    if (partes.length > 2) {
      btnVoltar.onclick = () => navegar(`compendio/${partes[1]}`, { manterScroll: true });
    } else {
      btnVoltar.onclick = () => navegar('home');
    }
  } else {
    iconeVoltar.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
    btnVoltar.onclick = () => navegar('home');
  }

  // Definir título padrão
  const titulos = {
    'home': '',
    'personagens': 'Meus Personagens',
    'criar': 'Novo Personagem',
    'ficha': 'Ficha',
    'compendio': 'Compêndio D&D 5.5e',
    'dados': 'Mesa de Dados'
  };
  definirTituloHeader(titulos[pagina] !== undefined ? titulos[pagina] : 'Nexus D&D 5.5');

  // Botões contextuais no header
  if (pagina === 'personagens') {
    acoes.innerHTML = `
      <button class="header-btn-rotulado" id="btn-header-novo" title="Criar Novo Personagem" onclick="navegar('criar')">
        <span class="header-icone">+</span>
        <span class="header-rotulo">Novo</span>
      </button>
    `;
  }

  const aplicarScrollFinal = () => {
    if (deveManterScroll) {
      window.scrollTo({ top: posDesejada, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = posDesejada;
      if (document.body) document.body.scrollTop = posDesejada;
    } else {
      rolarParaOTopo();
    }
  };

  _ultimaRota = hash;

  if (render) {
    const res = render(content, param);
    if (res && typeof res.then === 'function') {
      res.then(() => {
        aplicarScrollFinal();
        requestAnimationFrame(aplicarScrollFinal);
      });
    } else {
      aplicarScrollFinal();
      requestAnimationFrame(aplicarScrollFinal);
    }
  } else {
    content.innerHTML = '<div class="empty-state"><h2>Página não encontrada</h2><button class="btn btn-primary" onclick="navegar(\'home\')">Voltar ao início</button></div>';
  }
}

// --- PWA Update ---
/**
 * Verifica se existe uma nova versão do Service Worker. Quando encontra,
 * limpa os caches do SW e envia SKIP_WAITING automaticamente (sem exigir
 * clique do usuário). Limpar caches do SW nunca afeta personagens, que
 * vivem só em localStorage (store.js), separado do Cache Storage do SW.
 * @param {ServiceWorkerRegistration} registration - Registro do SW ativo
 */
function verificarAtualizacaoSW(registration) {
  const novoSW = registration.waiting || registration.installing;

  function aplicarAtualizacao(sw) {
    // Evitar disparar mais de uma vez pro mesmo SW
    if (sw._dndAtualizacaoAplicada) return;
    sw._dndAtualizacaoAplicada = true;

    // NAO apagar caches aqui. O proprio SW (evento 'activate') remove apenas os
    // caches de versoes antigas. Apagar tudo do cliente destroi o cache que o novo
    // SW acabou de popular no 'install', deixando o app sem conteudo offline
    // (erro "Returned response is null" ao abrir sem rede).
    sw.postMessage({ type: 'SKIP_WAITING' });
  }

  if (novoSW) {
    if (novoSW.state === 'installed') {
      if (navigator.serviceWorker.controller) aplicarAtualizacao(novoSW);
    } else {
      novoSW.addEventListener('statechange', () => {
        if (novoSW.state === 'installed' && navigator.serviceWorker.controller) {
          aplicarAtualizacao(novoSW);
        }
      });
    }
  }

  registration.addEventListener('updatefound', () => {
    const instalando = registration.installing;
    if (instalando) {
      instalando.addEventListener('statechange', () => {
        if (instalando.state === 'installed' && navigator.serviceWorker.controller) {
          aplicarAtualizacao(instalando);
        }
      });
    }
  });
}

/**
 * Recarrega a página assim que for seguro (sem modal aberto), pra não
 * interromper o usuário no meio de uma edição (ex: wizard de level-up).
 * Se já estiver seguro, recarrega na hora.
 */
function recarregarQuandoSeguro() {
  const overlay = document.getElementById('modal-overlay');
  const modalAberto = overlay && overlay.style.display === 'flex';

  if (!modalAberto) {
    window.location.reload();
    return;
  }

  toast('Nova versão disponível — será aplicada ao fechar esta janela.', '');
  // Polling em vez do callback onClose de abrirModal() (utils.js): esse callback é
  // um slot único por modal, já pode estar ocupado pela lógica do próprio wizard/modal
  // em andamento — registrar aqui substituiria esse callback e quebraria a limpeza dele.
  const interval = setInterval(() => {
    const aindaAberto = overlay && overlay.style.display === 'flex';
    if (!aindaAberto) {
      clearInterval(interval);
      window.location.reload();
    }
  }, 500);
}

// --- Inicialização ---
function init() {
  // Carregar taxas de conversao de moeda customizadas (se houver), antes de qualquer ficha renderizar
  carregarTaxasMoeda();

  // Inicializar módulo de sync (registra listeners online/offline e processa fila pendente)
  inicializarSync();

  // Registrar Service Worker e verificar atualizações
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      verificarAtualizacaoSW(registration);

      // Verificar atualizações periodicamente (a cada 5 min)
      setInterval(() => {
        registration.update();
      }, 5 * 60 * 1000);

      // Verificar ao voltar para a aba (útil em mobile)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update();
        }
      });
    }).catch(err => {
      console.warn('SW registro falhou:', err);
    });

    // Recarregar página quando o novo SW assumir controle (pós-atualização)
    // hadController evita reload desnecessário na primeira instalação
    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      recarregarQuandoSeguro();
    });
  }

  // Fechar modal ao clicar fora (usa fecharModal para suporte a pilha)
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      window.fecharModal();
    }
  });

  // Listener de rota
  window.addEventListener('hashchange', processarRota);

  // Rota inicial
  processarRota();

  // Ocultar splash screen após carregamento inicial
  const splash = document.getElementById('app-splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('oculto');
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 400);
    }, 300);
  }
}

document.addEventListener('DOMContentLoaded', init);
