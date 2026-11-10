(() => {
  const entry = document.querySelector('.journey-entry');
  const dialog = document.querySelector('#work-journey');
  if (!entry || !dialog || !dialog.showModal) return;
  entry.hidden = false;
  const launch = entry.querySelector('button');
  const spotlightKey = 'yogi-home-guide-hidden-v2';
  const secretLaunch = document.querySelector('.pixel-replay-launch');
  const spotlightSteps = [
    { target: launch, title: 'SIDE QUEST 1 / 2', message: 'Explore the projects and collaborations behind my work.' },
    { target: secretLaunch, title: 'SIDE QUEST 2 / 2', message: 'Try Secret build to watch this page assemble itself, pixel by pixel.' }
  ];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let spotlightTimer = 0;
  let spotlight;
  let spotlightStep = 0;
  let resumeSecretAfterJourney = false;
  const hideSpotlightForever = () => { try { localStorage.setItem(spotlightKey, 'yes'); } catch {} closeSpotlight(); };
  const spotlightIsHidden = () => { try { return localStorage.getItem(spotlightKey) === 'yes'; } catch { return false; } };
  function closeSpotlight() {
    clearTimeout(spotlightTimer);
    if (!spotlight) return;
    spotlight.remove();
    spotlight = null;
    document.body.classList.remove('journey-spotlight-active');
    window.removeEventListener('resize', positionSpotlight);
    window.removeEventListener('scroll', positionSpotlight);
  }
  function positionSpotlight() {
    if (!spotlight) return;
    const rect = spotlightSteps[spotlightStep].target.getBoundingClientRect();
    spotlight.style.setProperty('--spot-x', `${Math.max(8, rect.left - 10)}px`);
    spotlight.style.setProperty('--spot-y', `${Math.max(8, rect.top - 8)}px`);
    spotlight.style.setProperty('--spot-w', `${rect.width + 20}px`);
    spotlight.style.setProperty('--spot-h', `${rect.height + 16}px`);
    spotlight.classList.toggle('is-side', rect.right + 390 < innerWidth);
    spotlight.classList.toggle('is-above', rect.bottom + 190 > innerHeight);
  }
  function advanceSpotlight() {
    if (!spotlight) return;
    clearTimeout(spotlightTimer);
    spotlightStep++;
    if (spotlightStep >= spotlightSteps.length || !secretLaunch || secretLaunch.hidden) { closeSpotlight(); return; }
    spotlight.querySelector('.journey-spotlight-note p').textContent = spotlightSteps[spotlightStep].title;
    spotlight.querySelector('.journey-spotlight-note span').textContent = spotlightSteps[spotlightStep].message;
    spotlight.querySelector('[data-spotlight="next"]').textContent = 'Close';
    positionSpotlight();
    spotlightTimer = setTimeout(closeSpotlight, 5000);
  }
  function showSpotlight(step = 0) {
    if (spotlight || dialog.open || document.hidden || spotlightIsHidden()) return;
    const target = spotlightSteps[step].target?.getBoundingClientRect();
    if (!target || (step === 0 && (target.bottom < 80 || target.top > innerHeight - 32)) || (step === 1 && secretLaunch.hidden)) return;
    spotlightStep = step;
    spotlight = document.createElement('div');
    spotlight.className = 'journey-spotlight';
    spotlight.innerHTML = '<div class="journey-spotlight-frame" aria-hidden="true"></div><div class="journey-spotlight-note" role="status"><img src="assets/journey/yogi-guide.webp" alt="" width="1024" height="1536"><div><p>SIDE QUEST 1 / 2</p><span>Explore the projects and collaborations behind my work.</span><div class="journey-spotlight-actions"><button type="button" data-spotlight="next">Next</button><button type="button" data-spotlight="never">Don’t show again</button></div></div></div>';
    spotlight.querySelector('.journey-spotlight-note p').textContent = spotlightSteps[step].title;
    spotlight.querySelector('.journey-spotlight-note span').textContent = spotlightSteps[step].message;
    spotlight.querySelector('[data-spotlight="next"]').textContent = step === 0 ? 'Next' : 'Close';
    document.body.append(spotlight);
    document.body.classList.add('journey-spotlight-active');
    positionSpotlight();
    window.addEventListener('resize', positionSpotlight);
    window.addEventListener('scroll', positionSpotlight, { passive: true });
    spotlight.querySelector('[data-spotlight="next"]').addEventListener('click', advanceSpotlight);
    spotlight.querySelector('[data-spotlight="never"]').addEventListener('click', hideSpotlightForever);
    spotlightTimer = setTimeout(step === 0 ? advanceSpotlight : closeSpotlight, step === 0 ? 4500 : 5000);
  }
  if (!spotlightIsHidden()) {
    spotlightTimer = setTimeout(() => {
      if (dialog.open || document.hidden || spotlightIsHidden()) return;
      const rect = launch.getBoundingClientRect();
      if ((rect.top < 80 || rect.bottom > innerHeight - 32) && !motion.matches && scrollY < 80) {
        launch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        spotlightTimer = setTimeout(showSpotlight, 850);
      } else showSpotlight();
    }, 1200);
  }
  const status = dialog.querySelector('.journey-loading');
  const retry = dialog.querySelector('.journey-retry');
  let controller, generation = 0, previousOverflow = '';
  async function load() {
    const token = ++generation;
    status.hidden = false;
    status.textContent = 'Opening the world map…';
    retry.hidden = true;
    try {
      const module = await import('./work-journey.js?v=20261110-flow-4');
      await module.prepare();
      if (token !== generation || !dialog.open) return;
      controller ||= module.createJourney(dialog);
      status.hidden = true;
      controller.open();
    } catch {
      if (token !== generation || !dialog.open) return;
      status.textContent = 'The map could not load. You can retry or return to the portfolio.';
      retry.hidden = false;
    }
  }
  launch.addEventListener('click', () => {
    resumeSecretAfterJourney = Boolean(spotlight && spotlightStep === 0 && !spotlightIsHidden());
    closeSpotlight();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    load();
  });
  secretLaunch?.addEventListener('click', closeSpotlight);
  retry.addEventListener('click', load);
  dialog.querySelector('.journey-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')]
      .filter(element => element.getClientRects().length && !element.closest('[hidden]'));
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });
  dialog.addEventListener('close', () => {
    generation++;
    controller?.close();
    document.body.style.overflow = previousOverflow;
    launch.focus({ preventScroll: true });
    if (resumeSecretAfterJourney) {
      resumeSecretAfterJourney = false;
      spotlightTimer = setTimeout(() => showSpotlight(1), 450);
    }
  });
})();
