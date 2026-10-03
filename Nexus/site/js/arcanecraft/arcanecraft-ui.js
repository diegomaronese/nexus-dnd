// ============================================================
// Utilitários de Interface e UX Adaptativa para Arcane Craft
// Suporte completo a navegação por toque, mouse drag, mouse wheel e botões de seta
// ============================================================

/**
 * Torna qualquer barra ou container horizontalmente deslizável em TODOS os dispositivos:
 * - Telas sensíveis ao toque (touch swipe nativo com inércia)
 * - Mouses e telas não-touch (arrastar com clique do mouse / drag-to-scroll quando movimento > 10px)
 * - Roda do mouse (mouse wheel deltaY convertido em scrollLeft horizontal)
 * - Botões de navegação lateral (setas anterior e próxima com estado desabilitado inteligente)
 * - Centralização automática do item ativo (.ativo ou seletor customizado)
 * - Indicadores visuais de overflow
 *
 * @param {HTMLElement} bar - O elemento container com overflow-x: auto
 * @param {Object} options - Configurações opcionais
 * @returns {Function} Função de limpeza (cleanup) para desanexar listeners
 */
export function tornarBarraDeslizavel(bar, options = {}) {
  if (!bar) return () => {};

  // Limpa ouvintes anteriores para não acumular no window
  if (bar._cleanupDeslizavel) {
    try {
      bar._cleanupDeslizavel();
    } catch (e) {
      // silencioso
    }
  }

  const {
    btnEsquerda = null,
    btnDireita = null,
    passoScroll = 260,
    centralizarAtivo = true,
    seletorAtivo = '.ativo'
  } = options;

  let isDown = false;
  let startX = 0;
  let scrollStartX = 0;
  let hasDragged = false;
  let dragDistance = 0;

  // Atualiza a visibilidade e estado de ativação dos botões de seta
  function atualizarSetas() {
    if (!bar) return;
    const maxScroll = Math.max(0, bar.scrollWidth - bar.clientWidth);
    const canScroll = maxScroll > 4;

    if (btnEsquerda) {
      const atStart = bar.scrollLeft <= 4;
      btnEsquerda.disabled = !canScroll || atStart;
      btnEsquerda.classList.toggle('oculto', !canScroll);
      btnEsquerda.setAttribute('aria-hidden', (!canScroll).toString());
    }

    if (btnDireita) {
      const atEnd = bar.scrollLeft >= maxScroll - 4;
      btnDireita.disabled = !canScroll || atEnd;
      btnDireita.classList.toggle('oculto', !canScroll);
      btnDireita.setAttribute('aria-hidden', (!canScroll).toString());
    }

    // Se o elemento pai tem classe de wrapper, adiciona classes para gradientes de borda
    const wrapper = bar.parentElement;
    if (wrapper && wrapper.classList.contains('ac-tabs-nav-wrapper')) {
      wrapper.classList.toggle('has-scroll-left', canScroll && bar.scrollLeft > 6);
      wrapper.classList.toggle('has-scroll-right', canScroll && bar.scrollLeft < maxScroll - 6);
    }
  }

  // Cliques nos botões de seta
  if (btnEsquerda) {
    btnEsquerda.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      bar.scrollBy({ left: -passoScroll, behavior: 'smooth' });
    };
  }

  if (btnDireita) {
    btnDireita.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      bar.scrollBy({ left: passoScroll, behavior: 'smooth' });
    };
  }

  // Mouse Wheel: rolagem vertical do mouse converte em scroll horizontal quando em foco da barra
  const onWheel = (e) => {
    const maxScroll = bar.scrollWidth - bar.clientWidth;
    if (maxScroll <= 2) return;

    // Se usuário rolou verticalmente, converter para horizontal
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      bar.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };
  bar.addEventListener('wheel', onWheel, { passive: false });

  // Mouse Drag: somente ativa arrasto se o usuário realmente mover o mouse (> 10px)
  const onMouseDown = (e) => {
    // Apenas botão primário (esquerdo)
    if (e.button !== 0) return;
    isDown = true;
    hasDragged = false;
    dragDistance = 0;
    startX = e.clientX;
    scrollStartX = bar.scrollLeft;
    // NÃO adiciona .arrastando aqui! Só se mover de verdade!
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    const deltaX = e.clientX - startX;
    dragDistance = Math.abs(deltaX);
    if (dragDistance > 10) {
      hasDragged = true;
      bar.classList.add('arrastando');
      bar.scrollLeft = scrollStartX - deltaX;
    }
  };

  const onMouseUp = () => {
    if (!isDown) return;
    isDown = false;
    bar.classList.remove('arrastando');
    // Permite que o click handler diferencie clique de arrasto
    setTimeout(() => {
      hasDragged = false;
    }, 120);
  };

  // Se o mouse moveu mais de 10px durante o clique, previne a ativação do botão filho
  const onClickCapture = (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  bar.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  bar.addEventListener('click', onClickCapture, true);

  bar.addEventListener('scroll', atualizarSetas, { passive: true });
  window.addEventListener('resize', atualizarSetas, { passive: true });

  // Centralizar o item ativo na tela suavemente
  function focarItemAtivo() {
    if (!bar) return;
    const ativo = bar.querySelector(seletorAtivo);
    if (ativo) {
      const barRect = bar.getBoundingClientRect();
      const itemRect = ativo.getBoundingClientRect();
      const offset = (itemRect.left + itemRect.width / 2) - (barRect.left + barRect.width / 2);
      if (Math.abs(offset) > 10) {
        bar.scrollBy({ left: offset, behavior: 'smooth' });
      }
    }
    atualizarSetas();
  }

  if (centralizarAtivo) {
    setTimeout(focarItemAtivo, 60);
  } else {
    setTimeout(atualizarSetas, 60);
  }

  // Registra função de limpeza
  bar._cleanupDeslizavel = () => {
    bar.removeEventListener('wheel', onWheel);
    bar.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    bar.removeEventListener('click', onClickCapture, true);
    bar.removeEventListener('scroll', atualizarSetas);
    window.removeEventListener('resize', atualizarSetas);
  };

  return bar._cleanupDeslizavel;
}
