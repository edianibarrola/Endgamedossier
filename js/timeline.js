/* Route geometry lives in Subject Lock; each chip targets a stable dossier. */
(() => {
  document.querySelectorAll('.subjectchip').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('tva:lock', {detail: {id: button.dataset.target}}));
    });
  });
})();
