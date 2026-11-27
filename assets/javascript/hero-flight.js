(() => {
  const background = document.querySelector('.journey-background');
  const planes = [...(background?.querySelectorAll('.journey-plane') || [])];
  if (!background || !planes.length || !('animate' in planes[0])) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let started = false;
  const start = () => {
    if (started || reduce.matches) return;
    started = true;
    animations = planes.map(plane => {
      plane.style.offsetPath = "path('M170 154 C275 78 374 105 448 190 S632 330 748 215 S850 125 914 168')";
      plane.style.offsetRotate = 'auto';
      return plane.animate([
        { offsetDistance: '0%', transform: 'translate(-12px, -12px)' },
        { offsetDistance: '100%', transform: 'translate(-12px, -12px)' }
      ], { duration: 18000, iterations: Infinity, easing: 'linear', delay: Number(plane.dataset.delay || 0) });
    });
    sync();
  };
  const sync = () => {
    const visible = !document.hidden && background.dataset.visible === 'true' && !reduce.matches;
    animations.forEach(animation => visible ? animation.play() : animation.pause());
  };
  const idle = window.requestIdleCallback || (callback => setTimeout(callback, 1600));
  idle(start, { timeout: 2200 });
  new IntersectionObserver(([entry]) => { background.dataset.visible = String(entry.isIntersecting); sync(); }, { threshold: 0.05 }).observe(background);
  document.addEventListener('visibilitychange', sync, { passive: true });
  reduce.addEventListener('change', sync);
})();