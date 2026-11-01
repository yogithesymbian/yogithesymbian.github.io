(() => {
  const entry = document.querySelector('.journey-entry');
  const dialog = document.querySelector('#work-journey');
  if (!entry || !dialog || !dialog.showModal) return;
  entry.hidden = false;
  const launch = entry.querySelector('button');
  const status = dialog.querySelector('.journey-loading');
  const retry = dialog.querySelector('.journey-retry');
  let controller, generation = 0, previousOverflow = '';
  async function load() {
    const token = ++generation;
    status.hidden = false;
    status.textContent = 'Opening the world map…';
    retry.hidden = true;
    try {
      const module = await import('./work-journey.js');
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
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    load();
  });
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
  });
})();
