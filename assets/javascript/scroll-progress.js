(() => {
  const indicator = document.querySelector('.scroll-progress');
  if (!indicator) return;
  const cacti = [...document.querySelectorAll('.scroll-cactus')];

  let frame = 0;
  let stopTimer;
  let lastY = window.scrollY;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    frame = 0;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    const x = 12 + progress * Math.max(0, window.innerWidth - indicator.offsetWidth - 24);
    indicator.style.left = `${x}px`;

    let jump = 0;
    if (!reducedMotion.matches) {
      const dinoCenter = x + indicator.offsetWidth / 2;
      for (const cactus of cacti) {
        const bounds = cactus.getBoundingClientRect();
        const distance = Math.abs(dinoCenter - (bounds.left + bounds.width / 2));
        if (distance < 44) jump = Math.max(jump, 34 * Math.sin(Math.PI * (1 - distance / 44) / 2));
      }
    }
    indicator.style.transform = `translateY(${-jump}px)`;

    if (y !== lastY && !reducedMotion.matches) {
      indicator.classList.add('is-moving');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => indicator.classList.remove('is-moving'), 140);
    }
    lastY = y;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  update();
})();
