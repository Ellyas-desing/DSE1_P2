/**
 * Page Transitions - Transições suaves entre páginas
 * Fade out before navigate, fade in on load
 */
const PageTransitions = (() => {
  const FADE_DURATION = 500; // ms
  const transitionEl = document.querySelector('[data-page-transition]') || createTransitionEl();

  function createTransitionEl() {
    const el = document.createElement('div');
    el.setAttribute('data-page-transition', '');
    el.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--bg, #0a0c14);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity ${FADE_DURATION}ms ease;
    `;
    document.body.appendChild(el);
    return el;
  }

  function fadeOut() {
    return new Promise((resolve) => {
      transitionEl.style.pointerEvents = 'auto';
      transitionEl.style.opacity = '1';
      setTimeout(resolve, FADE_DURATION);
    });
  }

  function fadeIn() {
    transitionEl.style.opacity = '0';
    transitionEl.style.pointerEvents = 'none';
  }

  // Faz o fade e navega (use no lugar de window.location.href)
  async function navigate(href) {
    await fadeOut();
    window.location.href = href;
  }

  // Intercepta navegação interna
  function setupPageLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');

      // Ignora links externos, âncoras e atributos especiais
      if (
        !href ||
        /^(https?:|mailto:|tel:|javascript:|#)/.test(href) ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        link.hasAttribute('data-no-transition') ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      e.preventDefault();
      navigate(href);
    });
  }

  // Ao voltar pelo botão "voltar" do navegador (cache), remove o overlay
  function setupPageShow() {
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) fadeIn();
    });
  }

  function initialize() {
    fadeIn();
    setupPageLinks();
    setupPageShow();
  }

  return { initialize, fadeOut, fadeIn, navigate };
})();

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PageTransitions.initialize());
} else {
  PageTransitions.initialize();
}
