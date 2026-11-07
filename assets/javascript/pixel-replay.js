(() => {
  const launch = document.querySelector('.pixel-replay-launch');
  const overlay = document.querySelector('.pixel-replay-overlay');
  if (!launch || !overlay) return;
  launch.hidden = false;

  const status = overlay.querySelector('.pixel-replay-status');
  const skip = overlay.querySelector('.pixel-replay-skip');
  const agents = [...overlay.querySelectorAll('.pixel-replay-agent')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sequence = [
    ['.site-nav', 'A new path appears.'],
    ['.hero-meta', 'The scene is set.'],
    ['.hero-identity > .section-code', 'A player enters.'],
    ['.hero h1', 'The identity takes shape.'],
    ['.hero-visual', 'A portrait joins the scene.'],
    ['.hero-statement', 'The story begins.'],
    ['.hero-description', 'Details fall into place.'],
    ['.hero-actions', 'The first choices are ready.'],
    ['.proof-rail', 'The profile is complete.'],
    ['.communication-section', 'A clearer way to work.'],
    ['.work-section', 'The project log opens.'],
    ['.capabilities-section', 'Skills enter the scene.'],
    ['.trust-section', 'Proof comes into view.'],
    ['.writing-section', 'The field notes appear.'],
    ['.contact-section', 'The final doorway opens.'],
    ['.site-footer', 'Secret build complete.']
  ].map(([selector, label]) => [document.querySelector(selector), label]).filter(([element]) => element);
  let active = false;
  let run = 0;
  let startScroll = 0;
  let previousScrollBehavior = '';

  function wait(ms) {
    return new Promise(resolve => { window.setTimeout(resolve, ms); });
  }

  function moveAgent(agent, element, offsetX = 0, offsetY = 0) {
    const box = element.getBoundingClientRect();
    const x = Math.max(10, Math.min(innerWidth - 150, box.left + box.width * (0.18 + offsetX)));
    const y = Math.max(12, Math.min(innerHeight - 44, box.top + Math.min(box.height, innerHeight) * (0.16 + offsetY)));
    agent.style.setProperty('--x', `${Math.round(x)}px`);
    agent.style.setProperty('--y', `${Math.round(y)}px`);
    agent.classList.add('is-visible');
  }

  function scrollToPosition(top, duration, token) {
    return new Promise(resolve => {
      const from = window.scrollY;
      const distance = top - from;
      if (Math.abs(distance) < 8) { resolve(); return; }
      const started = performance.now();
      const frame = now => {
        if (token !== run) { resolve(); return; }
        const t = Math.min(1, (now - started) / duration);
        const eased = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        window.scrollTo({ top: from + distance * eased, behavior: 'auto' });
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  function finish(completed = false) {
    if (!active) return;
    active = false;
    run++;
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    document.body.classList.remove('is-pixel-replaying');
    sequence.forEach(([element]) => element.removeAttribute('data-replay-visible'));
    overlay.hidden = true;
    launch.hidden = false;
    agents.forEach(agent => {
      agent.classList.remove('is-visible');
      agent.style.removeProperty('--x');
      agent.style.removeProperty('--y');
    });
    if (!completed) {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: startScroll, behavior: 'auto' });
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }
    launch.focus({ preventScroll: true });
  }

  async function start() {
    if (active) return;
    active = true;
    const token = ++run;
    startScroll = window.scrollY;
    previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    overlay.hidden = false;
    launch.hidden = true;
    skip.focus({ preventScroll: true });
    if (reducedMotion.matches) {
      status.textContent = 'Secret build is ready. Motion is reduced on this device.';
      await wait(1600);
      if (token === run) finish(true);
      return;
    }

    status.textContent = 'Opening the secret build…';
    await scrollToPosition(0, Math.min(900, 350 + startScroll / 8), token);
    if (token !== run) return;
    document.body.classList.add('is-pixel-replaying');

    for (let index = 0; index < sequence.length; index++) {
      if (token !== run) return;
      const [element, label] = sequence[index];
      const section = element.matches('main > section, .site-footer');
      const box = element.getBoundingClientRect();
      if (section || box.bottom > innerHeight - 36) {
        const top = window.scrollY + box.top - (section ? 82 : innerHeight * .35);
        const distance = Math.abs(top - window.scrollY);
        await scrollToPosition(top, Math.min(1600, Math.max(520, distance * .42)), token);
      }
      if (token !== run) return;
      status.textContent = label;
      moveAgent(agents[index % agents.length], element);
      moveAgent(agents[(index + 1) % agents.length], element, .35, .28);
      element.setAttribute('data-replay-visible', '');
      await wait(section ? 650 : 390);
    }
    if (token === run) finish(true);
  }

  launch.addEventListener('click', start);
  skip.addEventListener('click', () => finish());
  document.addEventListener('keydown', event => {
    if (active && event.key === 'Escape') finish();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active) finish();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && active) finish();
  });
})();
