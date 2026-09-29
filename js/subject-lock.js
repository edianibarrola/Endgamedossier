(() => {
  // Inherited prototype routes: checkpoints, not a complete chronology.
  const routes = {
  "dossier-001": [
    "2012",
    "2018",
    "2023"
  ],
  "dossier-002": [
    "2012",
    "2018",
    "2023",
    "2026"
  ],
  "dossier-004": [
    "2013",
    "2018",
    "2023"
  ],
  "dossier-003": [
    "2012",
    "2023",
    "2026"
  ],
  "dossier-005": [
    "2014",
    "2018",
    "2023"
  ],
  "dossier-006": [
    "2014",
    "2023"
  ],
  "dossier-010": [
    "2014",
    "2023"
  ],
  "dossier-050": [
    "2012",
    "2026"
  ],
  "dossier-015": [
    "2014",
    "2023"
  ],
  "dossier-014": [
    "2014",
    "2023"
  ],
  "dossier-013": [
    "2018"
  ],
  "dossier-008": [
    "2012",
    "2023"
  ],
  "dossier-024": [
    "2018",
    "2023",
    "2024+"
  ],
  "dossier-017": [
    "2018",
    "2023",
    "2024+"
  ],
  "dossier-025": [
    "2018",
    "2023",
    "2024+"
  ],
  "dossier-026": [
    "2018",
    "2023",
    "2024+"
  ],
  "dossier-084": [
    "2026"
  ],
  "dossier-085": [
    "2026"
  ],
  "dossier-088": [
    "2026"
  ]
};
  const {reveal, scrollTo} = window.TVA;
  const hud = document.getElementById('lockhud');
  new ResizeObserver(() => document.documentElement.style.setProperty('--lock-height', hud.getBoundingClientRect().height + 'px')).observe(hud);
  const rail = document.querySelector('.maprail');
  const status = document.getElementById('mapstatus');
  const svgNS = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(svgNS, 'svg');
  overlay.classList.add('route-overlay');
  overlay.setAttribute('aria-hidden', 'true');
  rail.append(overlay);
  let current = null;
  let returnFocus = null;

  function routeFor(id) {
    return routes[id] || [...rail.querySelectorAll(`.subjectchip[data-target="${id}"]`)]
      .map(chip => chip.closest('.era2').dataset.era);
  }
  function draw() {
    overlay.replaceChildren();
    if (!current) return;
    const bounds = rail.getBoundingClientRect();
    overlay.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const points = routeFor(current).map(era => rail.querySelector(`.era2[data-era="${era}"]`))
      .filter(Boolean).map(element => {
        const rect = element.getBoundingClientRect();
        return [rect.left - bounds.left + rect.width / 2, 51];
      });
    if (points.length > 1) {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', points.map(([x,y],i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '));
      overlay.append(path);
    }
    points.forEach(([x,y],i) => {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', x); circle.setAttribute('cy', y);
      circle.setAttribute('r', i === points.length - 1 ? 6 : 4);
      overlay.append(circle);
    });
  }
  function clear() {
    current = null; hud.hidden = true;
    document.body.classList.remove('subject-locked');
    document.querySelectorAll('.lockmatch,.route-era,.locked-dossier,.lockrelated').forEach(element => {
      element.classList.remove('lockmatch','route-era','locked-dossier','lockrelated');
    });
    document.querySelectorAll('.subjectchip,.lockmini').forEach(button => button.setAttribute('aria-pressed','false'));
    status.textContent = 'TAP A SUBJECT TO LOCK THEIR ROUTE // DOSSIERS REMAIN AVAILABLE BELOW';
    overlay.replaceChildren();
  }
  function trace() {
    scrollTo(document.getElementById('temporal-map'));
    const first = rail.querySelector('.route-era');
    if (first) document.querySelector('.mapwindow').scrollLeft = first.offsetLeft;
  }
  function lock(id, follow = false) {
    const card = document.getElementById(id);
    if (!card) return;
    returnFocus = document.activeElement;
    clear(); current = id;
    document.body.classList.add('subject-locked'); hud.hidden = false;
    document.getElementById('lockname').textContent = card.querySelector('.who b').textContent;
    const eras = routeFor(id);
    document.getElementById('lockroute').textContent = eras.length ? eras.join(' → ') + ' // PROTOTYPE CHECKPOINTS' : 'ROUTE NOT YET MODELED';
    document.getElementById('followroute').disabled = !eras.length;
    document.querySelectorAll('.subjectchip,.lockmini').forEach(button => {
      const selected = button.dataset.target === id;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('lockmatch', selected);
    });
    eras.forEach(era => rail.querySelector(`.era2[data-era="${era}"]`)?.classList.add('route-era'));
    card.classList.add('locked-dossier');
    reveal(id, {scroll:false, focus:false, preserveLock:true});
    document.querySelectorAll('.threat').forEach(threat => threat.classList.toggle('lockrelated', threat.dataset.target === id));
    status.textContent = `LOCKED // ${card.querySelector('.who b').textContent} // ${eras.length ? 'SCHEMATIC CHECKPOINTS; NOT A COMPLETE CHRONOLOGY' : 'ROUTE NOT YET MODELED'}`;
    draw();
    if (follow && eras.length) trace();
  }
  document.querySelectorAll('.lockmini').forEach(button => button.addEventListener('click', () => lock(button.dataset.target, true)));
  document.addEventListener('tva:lock', event => lock(event.detail.id));
  document.addEventListener('tva:release', clear);
  document.getElementById('unlock').addEventListener('click', () => {clear(); returnFocus?.focus({preventScroll:true});});
  document.getElementById('followroute').addEventListener('click', trace);
  new ResizeObserver(draw).observe(rail);
})();
