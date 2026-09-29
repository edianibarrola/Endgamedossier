/* Static dossier HTML is the archive. JavaScript enhances navigation. */
(() => {
  const cards = [...document.querySelectorAll('.card')];
  const search = document.querySelector('#q');
  const count = document.querySelector('#ct');
  const chips = [...document.querySelectorAll('.chip')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = 'all';

  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesMode = mode === 'all' || card.dataset.k === mode ||
        (mode === 'branch' && card.dataset.b === '1') ||
        (mode === 'encore' && card.dataset.e === '1');
      card.hidden = !(card.dataset.s.includes(query) && matchesMode);
      if (!card.hidden) visible++;
    });
    count.textContent = `${visible} / ${cards.length}`;
    chips.forEach(chip => {
      const active = chip.dataset.f === mode;
      chip.classList.toggle('on', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function scrollTo(element) {
    element?.scrollIntoView({behavior: motion.matches ? 'instant' : 'smooth', block: 'start'});
  }

  function reveal(id, {scroll = true, focus = true, preserveLock = false} = {}) {
    const card = document.getElementById(id);
    if (!card?.classList.contains('card')) return;
    if (!preserveLock) document.dispatchEvent(new Event('tva:release'));
    if (card.hidden) { search.value = ''; mode = 'all'; filter(); }
    card.open = true;
    if (focus) card.querySelector('summary').focus({preventScroll: true});
    if (scroll) scrollTo(card);
  }

  window.TVA = {cards, reveal, scrollTo, motion};
  search.addEventListener('input', filter);
  chips.forEach(chip => chip.addEventListener('click', () => {mode = chip.dataset.f; filter();}));
  document.querySelectorAll('a[data-target]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      reveal(link.dataset.target);
      history.replaceState(null, '', '#' + link.dataset.target);
    });
  });
  const openHash = () => {
    const id = location.hash.slice(1);
    if (/^dossier-\d{3}$/.test(id)) reveal(id);
  };
  addEventListener('hashchange', openHash);
  filter(); openHash();
  new ResizeObserver(([entry]) => {
    document.documentElement.style.setProperty('--top-height', entry.target.getBoundingClientRect().height + 'px');
  }).observe(document.querySelector('.top'));
})();
