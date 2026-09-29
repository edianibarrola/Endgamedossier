(() => {
  const {cards, reveal} = window.TVA;
  const panel = document.getElementById('console');
  const open = document.getElementById('openconsole');
  const command = document.getElementById('cmd');
  const results = document.getElementById('results');
  open.setAttribute('aria-controls', 'console');
  open.setAttribute('aria-expanded', 'false');
  const dismiss = (restoreFocus = true) => {
    panel.hidden = true;
    open.setAttribute('aria-expanded', 'false');
    if (restoreFocus) open.focus();
  };
  open.addEventListener('click', () => {
    panel.hidden = false;
    open.setAttribute('aria-expanded', 'true');
    command.focus();
  });
  document.getElementById('closeconsole').addEventListener('click', () => dismiss());
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {event.preventDefault(); dismiss();}
  });
  command.addEventListener('input', () => {
    const query = command.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    if (!query) return;
    const matches = cards.filter(card => card.dataset.s.includes(query)).slice(0, 8);
    matches.forEach(card => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${card.querySelector('.who b').textContent} // ${card.querySelector('.status').textContent}`;
      button.addEventListener('click', () => {dismiss(false); reveal(card.id);});
      results.append(button);
    });
    if (!matches.length) results.textContent = 'NO MATCHING FILES';
  });
  document.getElementById('randomcase').addEventListener('click', () => {
    reveal(cards[Math.floor(Math.random() * cards.length)].id);
  });
})();
