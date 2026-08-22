// ============================================================
// Página Inicial - Hub principal D&D 5.5e
// ============================================================
import { listarPersonagens, restaurarPersonagensLocais } from '../store.js';
import { toast, escHtml } from '../utils.js';
import { iniciarAuth, getUsuario, loginComGoogle, logout, onAuthChange } from '../auth.js';
import { definirTituloHeader, navegar } from '../app.js';

let _containerRef = null;

export function renderHome(container) {
  _containerRef = container;
  definirTituloHeader();

  const personagens = listarPersonagens();
  const usuario = getUsuario();

  // Iniciar Firebase Auth em background
  iniciarAuth().then(() => {
    if (!renderHome._authRegistrado) {
      renderHome._authRegistrado = true;
      onAuthChange(() => {
        if (_containerRef) renderHome(_containerRef);
      });
    }
  });

  _renderMenuPrincipal(container, personagens, usuario);
}

function _renderMenuPrincipal(container, personagens, usuario) {
  // HTML da Seção 3: Conta Google / Nuvem
  const secaoGoogleHtml = usuario
    ? `
      <div class="home-menu-card home-card-conta">
        <div class="home-menu-icon-wrap" style="background: rgba(46, 204, 113, 0.15); border-color: rgba(46, 204, 113, 0.3);">
          <img src="${escHtml(usuario.photoURL || '')}" alt="" class="home-user-avatar" ${usuario.photoURL ? '' : 'style="display:none;"'} referrerpolicy="no-referrer">
          ${!usuario.photoURL ? '<img src="img/icons/ico-home-usuario.png" alt="Usuário" class="home-user-icon-img">' : ''}
        </div>
        <div class="home-menu-text">
          <div class="home-menu-title" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span>${escHtml(usuario.displayName || usuario.email || 'Conta Google Conectada')}</span>
            <span class="c-badge c-badge-escola" style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; border-color: rgba(46, 204, 113, 0.4); font-size: 0.68rem;">
              ● Nuvem Ativa
            </span>
          </div>
          <div class="home-menu-desc">
            Suas fichas são sincronizadas automaticamente com sua conta Google.
          </div>
        </div>
        <div class="home-menu-action">
          <button class="btn btn-sm btn-secondary" id="btn-logout-home" title="Sair da conta Google">
            Desconectar
          </button>
        </div>
      </div>
    `
    : `
      <div class="home-menu-card home-card-google">
        <div class="home-menu-icon-wrap" style="background: rgba(200, 160, 81, 0.14); border-color: rgba(200, 160, 81, 0.3);">
          <img src="img/icons/ico-home-usuario.png" alt="Usuário" class="home-menu-icon-img">
        </div>
        <div class="home-menu-text">
          <div class="home-menu-title">Sincronização na Nuvem</div>
          <div class="home-menu-desc">
            Faça login com o Google para salvar suas fichas na nuvem e acessá-las em qualquer dispositivo.
          </div>
        </div>
        <div class="home-menu-action">
          <button class="btn btn-google-login" id="btn-login-google-home">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    `;

  container.innerHTML = `
    <div class="home-container">
      <!-- Logo Principal e Cabeçalho de Boas-Vindas -->
      <div class="home-hero">
        <div class="home-logo-wrap">
          <img src="img/nexus-logo.svg" alt="Nexus D&D" class="home-main-logo">
        </div>
        <div class="home-hero-badge">Dungeons & Dragons 5.5e (2024)</div>
        <p class="home-hero-subtitle">
          Acesse a enciclopédia de regras completas, gerencie suas fichas de personagens e prepare seus dados para jogar.
        </p>
      </div>

      <!-- Grade / Lista dos 3 Botões Principais -->
      <div class="home-menu-grid">

        <!-- 1º BOTÃO: Compêndio D&D 5.5e -->
        <div class="home-menu-card home-card-compendio" id="btn-home-compendio" role="button" tabindex="0" onclick="navegar('compendio')">
          <div class="home-menu-icon-wrap" style="background: rgba(200, 160, 81, 0.14); border-color: rgba(200, 160, 81, 0.3);">
            <img src="img/icons/ico-home-compendio.png" alt="Compêndio" class="home-menu-icon-img">
          </div>
          <div class="home-menu-text">
            <div class="home-menu-title">Compêndio</div>
            <div class="home-menu-desc">
              Biblioteca oficial completa, com as principais informações disponíveis nos livros de D&D 5.5.
            </div>
          </div>
        </div>

        <!-- 2º BOTÃO: Meus Personagens -->
        <div class="home-menu-card home-card-personagens" id="btn-home-personagens" role="button" tabindex="0" onclick="navegar('personagens')">
          <div class="home-menu-icon-wrap" style="background: rgba(200, 160, 81, 0.14); border-color: rgba(200, 160, 81, 0.3);">
            <img src="img/icons/ico-home-personagens.png" alt="Personagens" class="home-menu-icon-img">
          </div>
          <div class="home-menu-text">
            <div class="home-menu-title">
              <span>Meus Personagens</span>
            </div>
            <div class="home-menu-desc">
              Crie novos heróis passo a passo e gerencie suas fichas digitais interativas.
            </div>
          </div>
        </div>

        <!-- 3º BOTÃO: Mesa de Dados Virtual -->
        <div class="home-menu-card home-card-dados" id="btn-home-dados" role="button" tabindex="0" onclick="navegar('dados')">
          <div class="home-menu-icon-wrap" style="background: rgba(200, 160, 81, 0.14); border-color: rgba(200, 160, 81, 0.3);">
            <img src="img/icons/ico-home-dados.png" alt="Dados" class="home-menu-icon-img">
          </div>
          <div class="home-menu-text">
            <div class="home-menu-title" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span>Mesa de Dados Virtual</span>
              <span class="c-badge" style="background: rgba(200, 160, 81, 0.12); border-color: var(--border-gold); color: var(--gold-light); font-size: 0.68rem;">
                d4 • d6 • d8 • d10 • d12 • d20 • d100
              </span>
            </div>
            <div class="home-menu-desc">
              Rolador de dados com sistema de vantagens, desvantagens, modificadores e histórico.
            </div>
          </div>
        </div>

        <!-- 4º BOTÃO / SEÇÃO: Entrar com Google -->
        ${secaoGoogleHtml}

      </div>
    </div>
  `;

  _setupAuthEvents(container);

  // Acessibilidade via teclado para os cards clicáveis
  container.querySelectorAll('.home-menu-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function _setupAuthEvents(container) {
  // Login com Google
  document.getElementById('btn-login-google-home')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      toast('Abrindo login com Google...', 'info');
      await loginComGoogle();
      toast('Login realizado com sucesso!', 'success');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        toast('Login cancelado', 'info');
      } else {
        console.error('Erro no login:', err);
        toast('Erro ao fazer login: ' + (err.message || 'desconhecido'), 'error');
      }
    }
  });

  // Logout
  document.getElementById('btn-logout-home')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      restaurarPersonagensLocais();
      await logout();
      toast('Desconectado da conta Google', 'info');
    } catch (err) {
      toast('Erro ao desconectar', 'error');
    }
  });
}
