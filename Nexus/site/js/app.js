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
import { toast, abrirModal, fecharModal, temModalAberto, consumeModalHistoryBack } from './utils.js';

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

/**
 * Retorna a rota pai hierárquica para qualquer rota do aplicativo.
 * Exemplo:
 * - 'compendio/classes/Paladino' -> 'compendio/classes'
 * - 'compendio/classes' ou 'compendio/itens_magicos' -> 'home'
 * - 'ficha/123' ou 'criar' -> 'personagens'
 * - 'personagens' ou 'dados' -> 'home'
 * - 'home' -> null
 */
export function obterRotaPai(rota) {
  const r = (rota || '').replace(/^#/, '').trim() || 'home';
  const partes = r.split('/').filter(Boolean);
  const pagina = partes[0] || 'home';

  if (pagina === 'home') return null;

  if (pagina === 'compendio') {
    if (partes.length > 2) {
      // Detalhe de sub-seção ou classe específica -> volta para a listagem da seção
      return `compendio/${partes[1]}`;
    }
    // Qualquer aba principal do compêndio -> volta para a Tela Inicial (home)
    return 'home';
  }

  if (pagina === 'ficha' || pagina === 'criar') {
    return 'personagens';
  }

  // Telas de primeiro nível (personagens, dados, etc.) -> voltam para a Tela Inicial
  return 'home';
}
window.obterRotaPai = obterRotaPai;

/**
 * Retorna o nível de profundidade na árvore de navegação
 */
export function obterNivelHierarquico(rota) {
  const r = (rota || '').replace(/^#/, '').trim() || 'home';
  const partes = r.split('/').filter(Boolean);
  const pagina = partes[0] || 'home';

  if (pagina === 'home') return 0;
  if (pagina === 'compendio') {
    return partes.length > 2 ? 2 : 1;
  }
  if (pagina === 'ficha') return 2;
  return 1;
}
window.obterNivelHierarquico = obterNivelHierarquico;

/** Rola a janela e containers principais para o topo absoluto */
export function rolarParaOTopo() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  const content = document.getElementById('app-content');
  if (content) content.scrollTop = 0;
}
window.rolarParaOTopo = rolarParaOTopo;

/**
 * Volta para a tela hierarquicamente superior (ou fecha modal se houver algum aberto)
 */
export function voltarHierarquico() {
  // 1. Se há algum modal ou sub-modal aberto, fecha o modal primeiro
  if (temModalAberto()) {
    fecharModal();
    return;
  }

  // 2. Navegar para a rota pai hierárquica
  const rotaAtual = (window.location.hash.slice(1) || 'home').replace(/^#/, '');
  const pai = obterRotaPai(rotaAtual);
  if (pai) {
    navegar(pai, { manterScroll: true, substituir: true });
  } else {
    navegar('home', { substituir: true });
  }
}
window.voltarHierarquico = voltarHierarquico;

/** Navegar para uma rota */
export function navegar(rota, opcoes = {}) {
  const rotaLimpa = (rota || 'home').replace(/^#/, '');
  const rotaAtual = (window.location.hash.slice(1) || 'home').replace(/^#/, '');
  const scrollAtual = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
  
  if (rotaAtual) {
    _scrollMap.set(rotaAtual, scrollAtual);
  }

  const { manterScroll = false, scrollTopo = false, substituir = false } = opcoes;
  const ehInternoCompendio = rotaAtual.startsWith('compendio') && rotaLimpa.startsWith('compendio');
  const ehEntradaDetalheClasse = rotaAtual === 'compendio/classes' && rotaLimpa.startsWith('compendio/classes/');
  const ehMesmaSecaoEquip = rotaLimpa.startsWith('compendio/equipamento') && rotaAtual.startsWith('compendio/equipamento');
  const ehMesmaSecaoRegras = rotaLimpa.startsWith('compendio/regras') && rotaAtual.startsWith('compendio/regras');
  const ehMesmaClasse = rotaLimpa.startsWith('compendio/classes/') && rotaAtual.startsWith('compendio/classes/');
  
  let deveManter = false;
  let posDesejada = 0;

  if (!scrollTopo && !ehEntradaDetalheClasse) {
    if (manterScroll || ehMesmaSecaoEquip || ehMesmaSecaoRegras || ehMesmaClasse) {
      deveManter = true;
      posDesejada = scrollAtual;
    } else if (ehInternoCompendio) {
      if (_scrollMap.has(rotaLimpa)) {
        deveManter = true;
        posDesejada = _scrollMap.get(rotaLimpa);
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

  // Controle de histórico hierárquico:
  // - Mudanças de abas/seções no mesmo nível ou subidas para telas pai substituem o estado no histórico
  // - Isso garante que o botão Voltar do celular sempre suba a árvore hierárquica até a Tela Iniciar
  const nivelAtual = obterNivelHierarquico(rotaAtual);
  const nivelNovo = obterNivelHierarquico(rotaLimpa);
  const mesmoPai = obterRotaPai(rotaAtual) === obterRotaPai(rotaLimpa);
  const ehSubidaHierarquica = nivelNovo < nivelAtual || rotaLimpa === obterRotaPai(rotaAtual);
  const ehMesmoNivel = nivelAtual === nivelNovo && mesmoPai && nivelAtual > 0;
  const deveSubstituir = substituir || ehMesmoNivel || ehSubidaHierarquica || (rotaLimpa === 'home' && rotaAtual === 'home');

  try {
    if (deveSubstituir) {
      history.replaceState({ rota: rotaLimpa }, '', `#${rotaLimpa}`);
    } else {
      history.pushState({ rota: rotaLimpa }, '', `#${rotaLimpa}`);
    }
  } catch (e) {
    window.location.hash = rotaLimpa;
  }

  processarRota();
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

  // Configuração do botão voltar no Header (sempre segue a hierarquia superior)
  const iconeVoltar = document.getElementById('icone-voltar');
  if (iconeVoltar) {
    iconeVoltar.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
  }
  btnVoltar.onclick = () => voltarHierarquico();

  // Definir título padrão
  const titulos = {
    'home': '',
    'personagens': 'Meus Personagens',
    'criar': 'Novo Personagem',
    'ficha': 'Ficha',
    'compendio': 'Compêndio D&D 5.5e',
    'dados': 'Mesa de Dados'
  };
  definirTituloHeader(titulos[pagina] !== undefined ? titulos[pagina] : 'Nexus D&D');

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
 * Trata atualizações do Service Worker de forma suave em segundo plano,
 * sem forçar recarregamento abrupto que interrompa o usuário durante a navegação.
 * @param {ServiceWorkerRegistration} registration - Registro do SW ativo
 */
function verificarAtualizacaoSW(registration) {
  const novoSW = registration.waiting || registration.installing;

  function aplicarAtualizacao(sw) {
    if (sw._dndAtualizacaoAplicada) return;
    sw._dndAtualizacaoAplicada = true;
    sw.postMessage({ type: 'SKIP_WAITING' });
  }

  if (novoSW) {
    if (novoSW.state === 'installed') {
      aplicarAtualizacao(novoSW);
    } else {
      novoSW.addEventListener('statechange', () => {
        if (novoSW.state === 'installed') {
          aplicarAtualizacao(novoSW);
        }
      });
    }
  }

  registration.addEventListener('updatefound', () => {
    const instalando = registration.installing;
    if (instalando) {
      instalando.addEventListener('statechange', () => {
        if (instalando.state === 'installed') {
          aplicarAtualizacao(instalando);
        }
      });
    }
  });
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

    // Quando o novo SW assumir controle, os novos caches já estarão ativos para as próximas requisições
    // Não força window.location.reload() para não interromper a sessão nem reiniciar a tela do usuário
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.info('Nexus D&D: Nova versão do Service Worker ativada em segundo plano.');
    });
  }

  // Fechar modal ao clicar fora (usa fecharModal para suporte a pilha)
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      window.fecharModal();
    }
  });

  // Listener do botão voltar nativo do celular / navegador (Android back button)
  window.addEventListener('popstate', (e) => {
    // 0. Se este popstate foi disparado por um fecharModal programático anterior (history.back), consumir e não re-processar rota
    if (consumeModalHistoryBack()) {
      return;
    }

    // 1. Se há modal ou sub-modal aberto no momento do popstate, fecha apenas o modal e mantém a tela
    if (temModalAberto()) {
      fecharModal(true);
      if (_ultimaRota && window.location.hash !== `#${_ultimaRota}`) {
        try {
          history.replaceState(null, '', `#${_ultimaRota}`);
        } catch (err) {}
      }
      return;
    }

    // 2. Retorno estritamente hierárquico até a Tela Iniciar (Home)
    const rotaAntesDoPop = (_ultimaRota || (window.location.hash.slice(1) || 'home')).replace(/^#/, '');

    // Se já estava na Tela Iniciar (home), permanece na home
    if (rotaAntesDoPop === 'home' || !obterRotaPai(rotaAntesDoPop)) {
      if (window.location.hash !== '#home' && window.location.hash !== '') {
        try {
          history.replaceState(null, '', '#home');
        } catch (err) {}
      }
      _ultimaRota = 'home';
      processarRota();
      return;
    }

    // Obter rota pai hierárquica (ex: ficha/123 -> personagens -> home; compendio/magias -> home)
    const rotaPai = obterRotaPai(rotaAntesDoPop) || 'home';

    try {
      history.replaceState(null, '', `#${rotaPai}`);
    } catch (err) {
      window.location.hash = rotaPai;
    }

    _ultimaRota = rotaPai;
    processarRota();
  });

  // Listener de rota para mudanças diretas de hash
  window.addEventListener('hashchange', () => {
    const hashAtual = (window.location.hash.slice(1) || 'home').replace(/^#/, '');
    if (!temModalAberto() && hashAtual !== _ultimaRota) {
      processarRota();
    }
  });

  // Rota inicial
  processarRota();

  // Ocultar splash screen com tempo adequado para visualização da tela de abertura e carregamento
  const splash = document.getElementById('app-splash');
  if (splash) {
    const tempoMinimoSplash = 1800; // 1.8s para experiência fluida da tela de abertura no mobile
    setTimeout(() => {
      splash.classList.add('oculto');
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 550);
    }, tempoMinimoSplash);
  }
}

document.addEventListener('DOMContentLoaded', init);
