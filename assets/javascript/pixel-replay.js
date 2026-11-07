(() => {
  const launch = document.querySelector('.pixel-replay-launch');
  const overlay = document.querySelector('.pixel-replay-overlay');
  if (!launch || !overlay) return;
  launch.hidden = false;

  const status = overlay.querySelector('.pixel-replay-status');
  const skip = overlay.querySelector('.pixel-replay-skip');
  const agents = [...overlay.querySelectorAll('.pixel-replay-agent')];
  for (let index = 0; index < 5; index++) {
    const extra = agents[0].cloneNode(true);
    extra.className = 'pixel-replay-agent agent-extra';
    extra.querySelector('b').textContent = ['COPY', 'ALIGN', 'MEDIA', 'SCOUT', 'TYPE'][index];
    overlay.appendChild(extra);
    agents.push(extra);
  }
  const sword = overlay.querySelector('.pixel-replay-sword');
  const frame = overlay.querySelector('.pixel-replay-frame');
  const clipboard = overlay.querySelector('.pixel-replay-clipboard');
  const guide = overlay.querySelector('.pixel-replay-guide');
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
  const paths = [
    { from: [-90, -60], corner: 0 }, { from: [85, -45], corner: 1 },
    { from: [-125, 20], corner: 3 }, { from: [110, 70], corner: 2 },
    { from: [80, -85], corner: 1 }, { from: [-70, 75], corner: 3 },
    { from: [120, 15], corner: 2 }, { from: [-110, -30], corner: 0 },
    { from: [60, 95], corner: 2 }, { from: [-140, 45], corner: 3 },
    { from: [135, -75], corner: 1 }, { from: [-95, -90], corner: 0 },
    { from: [105, 55], corner: 2 }, { from: [-130, 65], corner: 3 },
    { from: [90, -95], corner: 1 }, { from: [-80, -50], corner: 0 }
  ];
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

  function moveAgentTo(agent, x, y) {
    agent.style.setProperty('--x', `${Math.round(x)}px`);
    agent.style.setProperty('--y', `${Math.round(y)}px`);
    agent.classList.add('is-visible');
  }

  function shortTitle(element) {
    const title = element.querySelector('h1, h2, h3') || element;
    return (title.textContent || 'NEW BLOCK').trim().replace(/\s+/g, ' ').slice(0, 34);
  }

  async function dragFrame(element, index, token) {
    const subject = element.matches('main > section, .site-footer')
      ? element.querySelector('h2, h3, strong') || element : element;
    const box = subject.getBoundingClientRect();
    const x = Math.max(18, Math.min(innerWidth - 104, box.left - 10));
    const y = Math.max(106, Math.min(innerHeight - 90, box.top - 9));
    const width = Math.max(82, Math.min(box.width + 20, innerWidth - x - 18));
    const height = Math.max(46, Math.min(box.height + 18, innerHeight - y - 20));
    const corners = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    const origin = paths[index].corner;
    const end = corners[(origin + 2) % 4];
    const lead = agents[index % agents.length];
    const edgeWorker = agents[(index + 1) % agents.length];
    const finishWorker = agents[(index + 2) % agents.length];
    const copyWorker = agents[(index + 3) % agents.length];
    const alignWorker = agents[(index + 4) % agents.length];
    const mediaWorker = agents[(index + 5) % agents.length];
    const scoutWorker = agents[(index + 6) % agents.length];
    const typeWorker = agents[(index + 7) % agents.length];
    const copyX = Math.max(12, Math.min(innerWidth - 190, x + width * .12));
    const copyY = Math.max(85, Math.min(innerHeight - 92, y + height + 18));
    const pasteX = Math.max(12, Math.min(innerWidth - 190, x + width * .55));
    const pasteY = Math.max(85, Math.min(innerHeight - 92, y + height * .22));
    const next = sequence[Math.min(index + 1, sequence.length - 1)][0];
    const nextBox = next.getBoundingClientRect();
    frame.style.setProperty('--frame-x', `${Math.round(x)}px`);
    frame.style.setProperty('--frame-y', `${Math.round(y)}px`);
    frame.style.setProperty('--frame-w', `${Math.round(width)}px`);
    frame.style.setProperty('--frame-h', `${Math.round(height)}px`);
    frame.style.setProperty('--frame-origin', ['0 0', '100% 0', '100% 100%', '0 100%'][origin]);
    frame.classList.remove('is-dragging');
    frame.classList.add('is-visible');
    clipboard.style.setProperty('--copy-x', `${Math.round(copyX)}px`);
    clipboard.style.setProperty('--copy-y', `${Math.round(copyY)}px`);
    clipboard.querySelector('span').textContent = 'COPY';
    clipboard.querySelector('strong').textContent = shortTitle(sequence[Math.max(0, index - 1)][0]);
    clipboard.classList.add('is-visible');
    guide.style.setProperty('--guide-x', `${Math.round(x)}px`);
    guide.style.setProperty('--guide-y', `${Math.round(y + height + 9)}px`);
    guide.style.setProperty('--guide-w', `${Math.round(width)}px`);
    guide.style.setProperty('--guide-origin', index % 2 ? 'right' : 'left');
    copyWorker.classList.add('is-working');
    alignWorker.classList.add('is-working');
    moveAgentTo(copyWorker, copyX + 8, copyY + 8);
    moveAgentTo(alignWorker, x + width * .15, y + height + 9);
    moveAgentTo(mediaWorker, x + width * .72, y + height * .45);
    moveAgentTo(scoutWorker, Math.min(innerWidth - 24, Math.max(12, nextBox.left + 24)), Math.min(innerHeight - 32, Math.max(95, nextBox.top + 26)));
    moveAgentTo(typeWorker, x + width * .38, y + height * .22);
    moveAgentTo(edgeWorker, corners[(origin + 1) % 4][0], corners[(origin + 1) % 4][1]);
    moveAgentTo(finishWorker, corners[(origin + 3) % 4][0], corners[(origin + 3) % 4][1]);
    moveAgentTo(lead, corners[origin][0] + paths[index].from[0], corners[origin][1] + paths[index].from[1]);
    await wait(160);
    if (token !== run) return;
    lead.classList.add('is-dragging');
    moveAgentTo(lead, corners[origin][0], corners[origin][1]);
    await wait(260);
    if (token !== run) return;
    frame.classList.add('is-dragging');
    guide.classList.add('is-visible');
    moveAgentTo(lead, end[0], end[1]);
    clipboard.style.setProperty('--copy-x', `${Math.round(pasteX)}px`);
    clipboard.style.setProperty('--copy-y', `${Math.round(pasteY)}px`);
    moveAgentTo(copyWorker, pasteX + 8, pasteY + 8);
    moveAgentTo(alignWorker, x + width * .82, y + height + 9);
    moveAgentTo(edgeWorker, x + width * .7, y);
    moveAgentTo(finishWorker, x + width * .34, y + height);
    await wait(520);
    if (token !== run) return;
    clipboard.querySelector('span').textContent = 'PASTE / ADAPT';
    clipboard.querySelector('strong').textContent = shortTitle(element);
    await wait(180);
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    lead.classList.remove('is-dragging');
    copyWorker.classList.remove('is-working');
    alignWorker.classList.remove('is-working');
  }

  async function buildEnding(element, index, token) {
    const pieces = index === sequence.length - 2
      ? [...element.querySelectorAll('.contact-main > *, .official-profiles')]
      : [...element.children];
    pieces.forEach(piece => piece.setAttribute('data-replay-piece', ''));
    element.setAttribute('data-replay-visible', '');
    status.textContent = index === sequence.length - 2 ? 'The crew finishes the contact area.' : 'Final details, all hands at work.';
    agents.forEach((agent, worker) => {
      const piece = pieces[worker % pieces.length];
      const box = piece.getBoundingClientRect();
      const x = Math.max(16, Math.min(innerWidth - 155, box.left + box.width * (.2 + (worker % 3) * .22)));
      const y = Math.max(100, Math.min(innerHeight - 54, box.top + box.height * (.2 + (worker % 2) * .4)));
      agent.style.transitionDelay = `${worker * 28}ms`;
      moveAgentTo(agent, x, y);
    });
    for (let part = 0; part < pieces.length; part++) {
      await wait(115);
      if (token !== run) return;
      pieces[part].dataset.replayDirection = ['right', 'top', 'left', 'bottom'][part % 4];
      pieces[part].setAttribute('data-replay-visible', '');
    }
    await wait(180);
  }

  async function forgeMoment(token) {
    const cx = Math.round(innerWidth * (innerWidth < 700 ? .5 : .62));
    const cy = Math.round(innerHeight * .46);
    status.textContent = 'The hidden crew gathers…';
    agents.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 45}ms`;
      const angle = index * Math.PI * 2 / agents.length;
      moveAgentTo(agent, cx + Math.cos(angle) * 140, cy + Math.sin(angle) * 88);
    });
    await wait(420);
    if (token !== run) return;
    agents.forEach((agent, index) => {
      const angle = index * Math.PI * 2 / agents.length + 1.1;
      moveAgentTo(agent, cx + Math.cos(angle) * 82, cy + Math.sin(angle) * 60);
    });
    await wait(650);
    if (token !== run) return;
    status.textContent = 'A blade forms from the current.';
    const blade = [[-54, 52], [-39, 37], [-24, 22], [-9, 7], [6, -8], [21, -23], [36, -38], [48, -50]];
    agents.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 30}ms`;
      moveAgentTo(agent, cx + blade[index][0], cy + blade[index][1]);
    });
    await wait(650);
    if (token !== run) return;
    sword.style.setProperty('--x', `${cx}px`);
    sword.style.setProperty('--y', `${cy}px`);
    sword.classList.add('is-visible');
    agents.forEach(agent => agent.classList.remove('is-visible'));
    await wait(650);
    if (token !== run) return;
    sword.classList.remove('is-visible');
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    status.textContent = 'The cursors scatter and carry on.';
    agents.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 25}ms`;
      moveAgentTo(agent, cx + (index % 2 ? 1 : -1) * (90 + index * 11), cy + (index - 3.5) * 19);
    });
    await wait(480);
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
    sequence.forEach(([element]) => {
      element.removeAttribute('data-replay-visible');
      element.removeAttribute('data-replay-direction');
    });
    document.querySelectorAll('[data-replay-piece]').forEach(piece => {
      piece.removeAttribute('data-replay-piece');
      piece.removeAttribute('data-replay-visible');
      piece.removeAttribute('data-replay-direction');
    });
    overlay.hidden = true;
    sword.classList.remove('is-visible');
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    launch.hidden = false;
    agents.forEach(agent => {
      agent.classList.remove('is-visible', 'is-dragging', 'is-working');
      agent.style.transitionDelay = '';
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
        const duration = index >= sequence.length - 2
          ? Math.min(700, Math.max(360, distance * .3))
          : Math.min(1600, Math.max(520, distance * .42));
        await scrollToPosition(top, duration, token);
      }
      if (token !== run) return;
      if (index >= sequence.length - 2) {
        await buildEnding(element, index, token);
        continue;
      }
      status.textContent = label;
      agents.forEach(agent => { agent.style.transitionDelay = ''; });
      for (let cursor = 0; cursor < agents.length; cursor++) {
        const next = sequence[Math.min(index + (cursor % 3), sequence.length - 1)][0];
        const sweep = paths[index].from[0] > 0 ? -.1 : .15;
        moveAgent(agents[(index + cursor) % agents.length], next, sweep + (cursor % 3) * .16, (index % 2 ? .2 : 0) + (cursor % 2) * .12);
      }
      if (section || [3, 4, 8].includes(index)) await dragFrame(element, index, token);
      if (token !== run) return;
      element.dataset.replayDirection = ['left', 'top', 'right', 'bottom'][index % 4];
      element.setAttribute('data-replay-visible', '');
      await wait(section ? 650 : 390);
      if (index === 8 && token === run) await forgeMoment(token);
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
