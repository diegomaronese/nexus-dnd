/**
 * Nexus D&D 5.5 - Ferramenta de Recorte de Imagem / Avatar
 * Permite selecionar, reposicionar, aplicar zoom e girar fotos para o quadro redondo do personagem.
 */

import { abrirModal, fecharModal, toast } from './utils.js';

/**
 * Redimensiona previamente uma imagem caso ela seja excessivamente grande (ex: 12MP de câmera mobile),
 * para garantir fluidez perfeita de 60fps durante arrasto e zoom no canvas.
 * @param {HTMLImageElement} img 
 * @param {number} maxDim 
 * @returns {HTMLImageElement|HTMLCanvasElement}
 */
function otimizarImagemBase(img, maxDim = 1200) {
  if (img.width <= maxDim && img.height <= maxDim) return img;
  let w = img.width;
  let h = img.height;
  if (w > h) {
    h = Math.round(h * (maxDim / w));
    w = maxDim;
  } else {
    w = Math.round(w * (maxDim / h));
    h = maxDim;
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/**
 * Lê um arquivo ou dataURL de imagem e carrega em um elemento Image.
 * @param {File|Blob|string} fonte 
 * @returns {Promise<HTMLImageElement|null>}
 */
function carregarElementoImagem(fonte) {
  return new Promise((resolve) => {
    if (!fonte) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);

    if (typeof fonte === 'string') {
      img.src = fonte;
    } else if (fonte instanceof Blob || (typeof File !== 'undefined' && fonte instanceof File)) {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(fonte);
    } else {
      resolve(null);
    }
  });
}

/**
 * Abre modal interativo para recortar uma imagem no formato de avatar circular da ficha.
 * @param {File|Blob|string} fonteArquivo - Arquivo ou URL base64 da imagem
 * @param {Object} [opcoes]
 * @param {number} [opcoes.tamanhoSaida=320] - Resolução em pixels do avatar exportado (quadrado de 320x320)
 * @param {number} [opcoes.qualidade=0.88] - Qualidade JPEG da exportação (0.0 a 1.0)
 * @returns {Promise<string|null>} DataURL JPEG da imagem recortada ou null se o usuário cancelar
 */
export async function recortarImagemArquivo(fonteArquivo, opcoes = {}) {
  const tamanhoSaida = opcoes.tamanhoSaida || 320;
  const qualidade = opcoes.qualidade || 0.88;

  const imgCarregada = await carregarElementoImagem(fonteArquivo);
  if (!imgCarregada || imgCarregada.width === 0 || imgCarregada.height === 0) {
    toast('Não foi possível abrir a imagem selecionada.', 'error');
    return null;
  }

  // Otimiza caso a imagem seja gigante
  const imgBase = otimizarImagemBase(imgCarregada, 1400);

  return new Promise((resolve) => {
    let resolvido = false;
    const finalizar = (resultado) => {
      if (!resolvido) {
        resolvido = true;
        resolve(resultado);
      }
    };

    // Parâmetros de estado do recorte
    let zoomRelativo = 1.0; // 1.0 = preenchimento total do círculo
    let offsetX = 0;
    let offsetY = 0;
    let rotacao = 0; // 0, 90, 180, 270

    // Dimensões do Canvas do Visualizador
    const CANVAS_WIDTH = 320;
    const CANVAS_HEIGHT = 320;
    const CROP_RADIUS = 110; // Raio do círculo no canvas (diâmetro 220px)
    const CX = CANVAS_WIDTH / 2;
    const CY = CANVAS_HEIGHT / 2;

    // Calcula a escala base para cobrir o círculo
    const getEscalaBase = (rot) => {
      const is90or270 = rot === 90 || rot === 270;
      const w = is90or270 ? imgBase.height : imgBase.width;
      const h = is90or270 ? imgBase.width : imgBase.height;
      const diametro = CROP_RADIUS * 2;
      return Math.max(diametro / w, diametro / h);
    };

    // Limita o deslocamento para que o círculo nunca fique com buracos vazios
    const aplicarLimitesOffset = () => {
      const escalaBase = getEscalaBase(rotacao);
      const escalaAtual = escalaBase * zoomRelativo;
      const is90or270 = rotacao === 90 || rotacao === 270;
      const w = (is90or270 ? imgBase.height : imgBase.width) * escalaAtual;
      const h = (is90or270 ? imgBase.width : imgBase.height) * escalaAtual;

      const maxOffsetX = Math.max(0, (w / 2) - CROP_RADIUS);
      const maxOffsetY = Math.max(0, (h / 2) - CROP_RADIUS);

      offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
      offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
    };

    const corpoHtml = `
      <div class="cropper-container">
        <div class="cropper-hint">
          Arraste a foto e use o zoom para enquadrar perfeitamente no quadro redondo:
        </div>

        <div class="cropper-stage-wrapper">
          <canvas id="cropper-main-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" class="cropper-canvas"></canvas>
        </div>

        <!-- Controles de Zoom & Ajustes -->
        <div class="cropper-controls">
          <div class="cropper-zoom-row">
            <button type="button" class="btn btn-sm btn-secondary cropper-btn-icon" id="cropper-zoom-out" title="Diminuir Zoom" aria-label="Diminuir Zoom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <input type="range" id="cropper-zoom-range" min="1" max="3.5" step="0.01" value="1" class="form-range cropper-range" aria-label="Nível de Zoom">
            <button type="button" class="btn btn-sm btn-secondary cropper-btn-icon" id="cropper-zoom-in" title="Aumentar Zoom" aria-label="Aumentar Zoom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>

          <div class="cropper-tools-row">
            <button type="button" class="btn btn-sm btn-secondary" id="cropper-btn-rotate" style="display:inline-flex;align-items:center;gap:6px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Girar 90°</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" id="cropper-btn-center" style="display:inline-flex;align-items:center;gap:6px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <span>Centralizar</span>
            </button>
          </div>
        </div>

        <!-- Mini Prévia Real -->
        <div class="cropper-preview-card">
          <div class="cropper-preview-avatar">
            <canvas id="cropper-mini-preview" width="64" height="64" class="cropper-mini-canvas"></canvas>
          </div>
          <div class="cropper-preview-text">
            <span class="cropper-preview-title">Visualização no Avatar</span>
            <span class="cropper-preview-desc">Assim que a foto aparecerá na ficha e nas listas.</span>
          </div>
        </div>
      </div>
    `;

    const acoesHtml = `
      <button type="button" class="btn btn-secondary" id="cropper-btn-cancelar">Cancelar</button>
      <button type="button" class="btn btn-primary" id="cropper-btn-confirmar" style="display:inline-flex;align-items:center;gap:6px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Aplicar Foto</span>
      </button>
    `;

    abrirModal('Ajustar Foto do Personagem', corpoHtml, acoesHtml, () => {
      finalizar(null);
    });

    const canvas = document.getElementById('cropper-main-canvas');
    const miniCanvas = document.getElementById('cropper-mini-preview');
    const zoomRange = document.getElementById('cropper-zoom-range');
    const btnZoomIn = document.getElementById('cropper-zoom-in');
    const btnZoomOut = document.getElementById('cropper-zoom-out');
    const btnRotate = document.getElementById('cropper-btn-rotate');
    const btnCenter = document.getElementById('cropper-btn-center');
    const btnConfirmar = document.getElementById('cropper-btn-confirmar');
    const btnCancelar = document.getElementById('cropper-btn-cancelar');

    if (!canvas) {
      finalizar(null);
      return;
    }

    const ctx = canvas.getContext('2d');
    const miniCtx = miniCanvas ? miniCanvas.getContext('2d') : null;

    // Renderiza o quadro e a máscara circular
    const render = () => {
      aplicarLimitesOffset();

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const escalaBase = getEscalaBase(rotacao);
      const escalaAtual = escalaBase * zoomRelativo;

      // 1. Desenha imagem com transformações
      ctx.save();
      ctx.translate(CX + offsetX, CY + offsetY);
      ctx.rotate((rotacao * Math.PI) / 180);
      ctx.scale(escalaAtual, escalaAtual);
      ctx.drawImage(imgBase, -imgBase.width / 2, -imgBase.height / 2);
      ctx.restore();

      // 2. Máscara escura ao redor do círculo
      ctx.save();
      ctx.fillStyle = 'rgba(12, 10, 8, 0.76)';
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.arc(CX, CY, CROP_RADIUS, 0, Math.PI * 2, true);
      ctx.fill();

      // 3. Guia de terços suave dentro do círculo
      ctx.strokeStyle = 'rgba(200, 160, 81, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      const offThird = CROP_RADIUS / 3;
      const hThird1 = CY - offThird;
      const hThird2 = CY + offThird;
      const corda1 = Math.sqrt(Math.max(0, CROP_RADIUS * CROP_RADIUS - offThird * offThird));

      ctx.beginPath();
      ctx.moveTo(CX - corda1, hThird1); ctx.lineTo(CX + corda1, hThird1);
      ctx.moveTo(CX - corda1, hThird2); ctx.lineTo(CX + corda1, hThird2);

      const vThird1 = CX - offThird;
      const vThird2 = CX + offThird;
      ctx.moveTo(vThird1, CY - corda1); ctx.lineTo(vThird1, CY + corda1);
      ctx.moveTo(vThird2, CY - corda1); ctx.lineTo(vThird2, CY + corda1);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Borda de ouro ao redor do círculo do avatar
      ctx.strokeStyle = '#c8a051';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(CX, CY, CROP_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Atualiza mini-preview
      if (miniCtx) {
        miniCtx.clearRect(0, 0, 64, 64);
        const miniRadius = 32;
        const ratio = miniRadius / CROP_RADIUS;

        miniCtx.save();
        miniCtx.beginPath();
        miniCtx.arc(32, 32, 31, 0, Math.PI * 2);
        miniCtx.clip();

        miniCtx.fillStyle = '#181411';
        miniCtx.fillRect(0, 0, 64, 64);

        miniCtx.translate(32 + offsetX * ratio, 32 + offsetY * ratio);
        miniCtx.rotate((rotacao * Math.PI) / 180);
        miniCtx.scale(escalaAtual * ratio, escalaAtual * ratio);
        miniCtx.drawImage(imgBase, -imgBase.width / 2, -imgBase.height / 2);
        miniCtx.restore();
      }
    };

    // --- Interação: Arrasto com Mouse / Touch ---
    let arrastando = false;
    let startX = 0;
    let startY = 0;
    let initialOffsetX = 0;
    let initialOffsetY = 0;

    // Suporte a pinch-to-zoom em telas touch
    let touchDistanceInicial = 0;
    let zoomInicialPinch = 1.0;

    const onPointerDown = (e) => {
      e.preventDefault();
      arrastando = true;
      startX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      initialOffsetX = offsetX;
      initialOffsetY = offsetY;
      if (e.target.setPointerCapture && e.pointerId) {
        try { e.target.setPointerCapture(e.pointerId); } catch (err) {}
      }
    };

    const onPointerMove = (e) => {
      if (!arrastando) return;
      e.preventDefault();
      const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const currentY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const dx = currentX - startX;
      const dy = currentY - startY;

      offsetX = initialOffsetX + dx;
      offsetY = initialOffsetY + dy;
      render();
    };

    const onPointerUp = (e) => {
      arrastando = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Gestos touch adicionais para multi-touch pinch zoom
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        arrastando = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistanceInicial = Math.sqrt(dx * dx + dy * dy);
        zoomInicialPinch = zoomRelativo;
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && touchDistanceInicial > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const fator = dist / touchDistanceInicial;
        const novoZoom = Math.max(1, Math.min(3.5, zoomInicialPinch * fator));
        zoomRelativo = novoZoom;
        if (zoomRange) zoomRange.value = novoZoom;
        render();
      }
    }, { passive: false });

    // Zoom via Roda do Mouse
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      const novoZoom = Math.max(1, Math.min(3.5, zoomRelativo + delta));
      zoomRelativo = novoZoom;
      if (zoomRange) zoomRange.value = novoZoom;
      render();
    }, { passive: false });

    // Slider de Zoom
    zoomRange?.addEventListener('input', (e) => {
      zoomRelativo = parseFloat(e.target.value) || 1.0;
      render();
    });

    btnZoomIn?.addEventListener('click', () => {
      zoomRelativo = Math.min(3.5, zoomRelativo + 0.25);
      if (zoomRange) zoomRange.value = zoomRelativo;
      render();
    });

    btnZoomOut?.addEventListener('click', () => {
      zoomRelativo = Math.max(1.0, zoomRelativo - 0.25);
      if (zoomRange) zoomRange.value = zoomRelativo;
      render();
    });

    // Girar 90 graus
    btnRotate?.addEventListener('click', () => {
      rotacao = (rotacao + 90) % 360;
      render();
    });

    // Centralizar
    btnCenter?.addEventListener('click', () => {
      offsetX = 0;
      offsetY = 0;
      zoomRelativo = 1.0;
      if (zoomRange) zoomRange.value = 1.0;
      render();
    });

    // Botão Cancelar
    btnCancelar?.addEventListener('click', () => {
      fecharModal();
      finalizar(null);
    });

    // Botão Confirmar
    btnConfirmar?.addEventListener('click', () => {
      try {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = tamanhoSaida;
        exportCanvas.height = tamanhoSaida;
        const eCtx = exportCanvas.getContext('2d');

        const exportCenter = tamanhoSaida / 2;
        const ratio = exportCenter / CROP_RADIUS;
        const escalaBase = getEscalaBase(rotacao);
        const escalaAtual = escalaBase * zoomRelativo;

        // Fundo neutro caso haja transparência
        eCtx.fillStyle = '#181411';
        eCtx.fillRect(0, 0, tamanhoSaida, tamanhoSaida);

        // Aplica o enquadramento exato
        eCtx.save();
        eCtx.translate(exportCenter + offsetX * ratio, exportCenter + offsetY * ratio);
        eCtx.rotate((rotacao * Math.PI) / 180);
        eCtx.scale(escalaAtual * ratio, escalaAtual * ratio);
        eCtx.drawImage(imgBase, -imgBase.width / 2, -imgBase.height / 2);
        eCtx.restore();

        const resultadoDataUrl = exportCanvas.toDataURL('image/jpeg', qualidade);
        fecharModal();
        finalizar(resultadoDataUrl);
      } catch (err) {
        console.error('Erro ao recortar imagem:', err);
        toast('Erro ao processar o recorte da imagem.', 'error');
        fecharModal();
        finalizar(null);
      }
    });

    // Render inicial
    render();
  });
}
