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
  
  // Intercepta navegação interna
  function setupPageLinks() {
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Ignora links externos, âncoras e atributos especiais
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        link.target === '_blank' ||
        link.hasAttribute('data-no-transition')
      ) {
        return;
      }
      
      e.preventDefault();
      await fadeOut();
      window.location.href = href;
    });
  }
  
  // Executa ao carregar página
  function initialize() {
    fadeIn();
    setupPageLinks();
  }
  
  // Executa ao descarregar (para suavizar saída)
  function setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      fadeOut();
    });
  }
  
  return {
    initialize,
    fadeOut,
    fadeIn,
    setupBeforeUnload
  };
})();
// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PageTransitions.initialize());
} else {
  PageTransitions.initialize();
}