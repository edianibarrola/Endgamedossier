(() => {
  const {motion} = window.TVA;
  const root = document.documentElement;
  const flare = document.getElementById('touchflare');
  let scheduled = false;
  const updateScroll = () => {
    const range = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty('--scroll', motion.matches ? '0' : (scrollY / range).toFixed(3));
    scheduled = false;
  };
  addEventListener('scroll', () => {
    if (!motion.matches && !scheduled) {scheduled = true; requestAnimationFrame(updateScroll);}
  }, {passive:true});
  const move = event => {
    root.style.setProperty('--mx', event.clientX + 'px');
    flare.style.left = event.clientX + 'px'; flare.style.top = event.clientY + 'px';
  };
  addEventListener('pointermove', event => {
    if (!motion.matches && event.pointerType === 'mouse') move(event);
  }, {passive:true});
  addEventListener('pointerdown', event => {
    if (motion.matches) return;
    move(event);
    flare.getAnimations().forEach(animation => animation.cancel());
    flare.animate([
      {opacity:.9, transform:'translate(-50%,-50%) scale(.45)'},
      {opacity:0, transform:'translate(-50%,-50%) scale(1.2)'}
    ], {duration:650, easing:'cubic-bezier(.2,.8,.2,1)'});
  }, {passive:true});
  document.querySelectorAll('.card').forEach(card => card.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse' || !card.open) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--cx', (event.clientX - rect.left) + 'px');
    card.style.setProperty('--cy', (event.clientY - rect.top) + 'px');
  }, {passive:true}));
  function syncMotion() {
    document.querySelectorAll('svg').forEach(svg => {
      if (motion.matches) svg.pauseAnimations(); else svg.unpauseAnimations();
    });
    if (motion.matches) flare.getAnimations().forEach(animation => animation.cancel());
    updateScroll();
  }
  motion.addEventListener('change', syncMotion); syncMotion();
})();
