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
  const cardToken = document.createElement('div');
  cardToken.className = 'pixel-replay-card-token';
  cardToken.setAttribute('aria-hidden', 'true');
  overlay.appendChild(cardToken);
  const communication = document.querySelector('[data-communication]');
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
  let communicationWasResolved = false;
  let communicationReplayResolved = false;

  function wait(ms) {
    return new Promise(resolve => { window.setTimeout(resolve, ms); });
  }

  function moveAgent(agent, element, offsetX = 0, offsetY = 0) {
    const box = element.getBoundingClientRect();
    const x = Math.max(10, Math.min(innerWidth - 150, box.left + box.width * (0.18 + offsetX)));
    const y = Math.max(12, Math.min(innerHeight - 44, box.top + Math.min(box.height, innerHeight) * (0.16 + offsetY)));
    moveAgentTo(agent, x, y);
  }

  function moveAgentTo(agent, x, y, travelDuration) {
    const previousX = Number.parseFloat(agent.style.getPropertyValue('--x'));
    const previousY = Number.parseFloat(agent.style.getPropertyValue('--y'));
    if (Number.isFinite(previousX) && Number.isFinite(previousY)) {
      const distance = Math.hypot(x - previousX, y - previousY);
      const role = agents.indexOf(agent);
      const duration = travelDuration || Math.max(210, Math.min(740, 170 + distance * .67 + (role % 3) * 24));
      agent.style.setProperty('--travel-duration', `${Math.round(duration)}ms`);
    }
    agent.style.setProperty('--x', `${Math.round(x)}px`);
    agent.style.setProperty('--y', `${Math.round(y)}px`);
    agent.classList.add('is-visible');
  }

  function shortTitle(element) {
    const title = element.querySelector('h1, h2, h3') || element;
    return (title.textContent || 'NEW BLOCK').trim().replace(/\s+/g, ' ').slice(0, 34);
  }

  async function dragFrame(element, index, token) {
    const opening = index < 9;
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
    await wait(opening ? 100 : 160);
    if (token !== run) return;
    lead.classList.add('is-dragging');
    moveAgentTo(lead, corners[origin][0], corners[origin][1]);
    moveAgentTo(mediaWorker, x + width * .58, y + height * .32);
    moveAgentTo(scoutWorker, Math.min(innerWidth - 24, Math.max(12, nextBox.left + 40)), Math.min(innerHeight - 32, Math.max(95, nextBox.top + 14)));
    await wait(opening ? 190 : 260);
    if (token !== run) return;
    frame.classList.add('is-dragging');
    frame.style.setProperty('--frame-duration', opening ? '360ms' : '480ms');
    guide.classList.add('is-visible');
    moveAgentTo(lead, end[0], end[1], opening ? 360 : 480);
    moveAgentTo(mediaWorker, x + width * .72, y + height * .45);
    moveAgentTo(scoutWorker, Math.min(innerWidth - 24, Math.max(12, nextBox.left + 24)), Math.min(innerHeight - 32, Math.max(95, nextBox.top + 26)));
    clipboard.style.setProperty('--copy-x', `${Math.round(pasteX)}px`);
    clipboard.style.setProperty('--copy-y', `${Math.round(pasteY)}px`);
    moveAgentTo(copyWorker, pasteX + 8, pasteY + 8);
    moveAgentTo(alignWorker, x + width * .82, y + height + 9);
    moveAgentTo(edgeWorker, x + width * .7, y);
    moveAgentTo(finishWorker, x + width * .34, y + height);
    await wait(opening ? 390 : 520);
    if (token !== run) return;
    clipboard.querySelector('span').textContent = 'PASTE / ADAPT';
    clipboard.querySelector('strong').textContent = shortTitle(element);
    await wait(opening ? 110 : 180);
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    lead.classList.remove('is-dragging');
    copyWorker.classList.remove('is-working');
    alignWorker.classList.remove('is-working');
  }

  async function buildEnding(element, index, token) {
    const footer = index === sequence.length - 1;
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
      agent.style.transitionDelay = `${worker * (footer ? 48 : 28)}ms`;
      moveAgentTo(agent, x, y);
    });
    for (let part = 0; part < pieces.length; part++) {
      await wait(footer ? 265 : 115);
      if (token !== run) return;
      pieces[part].dataset.replayDirection = ['right', 'top', 'left', 'bottom'][part % 4];
      pieces[part].setAttribute('data-replay-visible', '');
    }
    await wait(footer ? 460 : 180);
  }

  function prepareCommunicationReplay(element) {
    communicationWasResolved = element.classList.contains('is-story-active') || element.classList.contains('is-story-resolved');
    communicationReplayResolved = false;
    element.dataset.replayStory = 'active';
    element.classList.remove('is-story-active', 'is-story-resolved', 'is-pm-vanishing');
    element.classList.add('is-replay-story');
  }

  function resolveCommunicationStory(element) {
    element.classList.remove('is-story-active', 'is-replay-story', 'is-pm-vanishing');
    element.classList.add('is-story-resolved');
    delete element.dataset.replayStory;
    element.dispatchEvent(new Event('communication:story-resolved'));
  }

  async function cuePmDeparture(element, token) {
    const stage = element.querySelector('.communication-stage');
    const pm = element.querySelector('.character-pm');
    if (!stage || !pm) return;
    element.dataset.replayStory = 'active';
    element.classList.add('is-replay-story');
    element.classList.remove('is-story-active', 'is-story-resolved', 'is-pm-vanishing');
    element.setAttribute('data-replay-visible', '');
    if (innerWidth <= 760) {
      const stageBox = stage.getBoundingClientRect();
      await scrollToPosition(window.scrollY + stageBox.top - innerHeight * .2, 520, token);
    }
    if (token !== run) return;

    status.textContent = 'The whole team starts together.';
    const user = element.querySelector('.character-user').getBoundingClientRect();
    const pmBox = pm.getBoundingClientRect();
    const developer = element.querySelector('.character-dev').getBoundingClientRect();
    const question = element.querySelector('.communication-object').getBoundingClientRect();
    const stations = [user, pmBox, developer, question, user, developer, pmBox, question];
    agents.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 24}ms`;
      const box = stations[index];
      moveAgentTo(agent,
        Math.max(12, Math.min(innerWidth - 28, box.left + box.width * (index % 2 ? .72 : .28))),
        Math.max(102, Math.min(innerHeight - 32, box.top + box.height * (index % 2 ? .28 : .72))));
    });
    await wait(560);
    if (token !== run) return;

    const lead = agents[0];
    lead.style.transitionDelay = '';
    status.textContent = 'Watch the PM leave the scene.';
    moveAgentTo(lead,
      Math.max(10, Math.min(innerWidth - 28, pmBox.left + pmBox.width * .5)),
      Math.max(102, Math.min(innerHeight - 34, pmBox.top + 8)), 420);
    await wait(480);
    if (token !== run) return;

    element.classList.add('is-pm-vanishing');
    await wait(reducedMotion.matches ? 80 : 860);
    if (token !== run) return;
    resolveCommunicationStory(element);
    communicationReplayResolved = true;
    status.textContent = 'The work continues with a clear request.';
    await wait(420);
  }

  async function buildCommunication(element, token) {
    const cards = [...element.querySelectorAll('.communication-comic')];
    if (cards.length !== 3) return;
    await cuePmDeparture(element, token);
    if (token !== run) return;
    cards.forEach(card => card.setAttribute('data-replay-piece', ''));
    element.dataset.replayDirection = 'left';
    element.setAttribute('data-replay-visible', '');
    cards[0].dataset.replayDirection = 'left';
    cards[0].setAttribute('data-replay-visible', '');
    status.textContent = 'A clear request starts the work.';
    await wait(360);
    if (token !== run) return;

    for (let step = 0; step < 2; step++) {
      const source = cards[step];
      const target = cards[step + 1];
      if (innerWidth <= 650) {
        const targetBox = target.getBoundingClientRect();
        await scrollToPosition(window.scrollY + targetBox.top - innerHeight * .46, 460, token);
      }
      if (token !== run) return;
      const sourceBox = source.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      const mobile = innerWidth <= 650;
      const fromX = mobile ? Math.max(18, innerWidth * .12) : sourceBox.left + Math.min(sourceBox.width * .24, 92);
      const fromY = mobile ? innerHeight * .49 : sourceBox.top + 22;
      const toX = mobile ? Math.min(innerWidth - 190, innerWidth * .43) : targetBox.left + Math.min(targetBox.width * .24, 92);
      const toY = mobile ? innerHeight * .63 : targetBox.top + 22;
      cardToken.textContent = source.querySelector('h3').textContent.replace(/^\s*0\d\s*/, '').trim();
      cardToken.style.transition = 'none';
      cardToken.style.setProperty('--card-x', `${Math.round(fromX)}px`);
      cardToken.style.setProperty('--card-y', `${Math.round(fromY)}px`);
      cardToken.classList.add('is-visible');
      const lead = agents[(step + 3) % agents.length];
      moveAgentTo(lead, fromX + 8, fromY + 8);
      agents.forEach((agent, worker) => {
        if (agent === lead) return;
        const box = worker % 2 ? targetBox : sourceBox;
        moveAgentTo(agent, Math.max(12, Math.min(innerWidth - 150, box.left + box.width * (.15 + (worker % 3) * .2))), Math.max(100, Math.min(innerHeight - 50, box.top + 28 + (worker % 2) * 28)));
      });
      await wait(180);
      if (token !== run) return;
      cardToken.style.transition = '';
      cardToken.style.setProperty('--card-x', `${Math.round(toX)}px`);
      cardToken.style.setProperty('--card-y', `${Math.round(toY)}px`);
      moveAgentTo(lead, toX + 8, toY + 8, 580);
      status.textContent = step === 0 ? 'The request becomes a question.' : 'The question makes room for an early warning.';
      await wait(610);
      if (token !== run) return;
      target.dataset.replayDirection = step === 0 ? 'right' : 'top';
      target.setAttribute('data-replay-visible', '');
      cardToken.textContent = target.querySelector('h3').textContent.replace(/^\s*0\d\s*/, '').trim();
      await wait(260);
      if (token !== run) return;
      cardToken.classList.remove('is-visible');
      await wait(120);
    }
    communicationReplayResolved = true;
  }

  async function playReducedCommunicationBeat(token) {
    if (!communication) return;
    prepareCommunicationReplay(communication);
    const stage = communication.querySelector('.communication-stage');
    const top = window.scrollY + stage.getBoundingClientRect().top - Math.max(16, innerHeight * .14);
    window.scrollTo({ top, behavior: 'instant' });
    status.textContent = 'The team is together.';
    await wait(650);
    if (token !== run) return;
    communication.classList.add('is-pm-vanishing');
    await wait(120);
    if (token !== run) return;
    resolveCommunicationStory(communication);
    communicationReplayResolved = true;
    status.textContent = 'The PM steps away. The cards show what comes next.';
    await wait(900);
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
    cardToken.classList.remove('is-visible');
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
    if (communication?.classList.contains('is-replay-story')) {
      const resolved = communicationReplayResolved || communicationWasResolved;
      communication.classList.remove('is-replay-story', 'is-pm-vanishing', 'is-story-active', 'is-story-resolved');
      communication.removeAttribute('data-replay-story');
      if (resolved) communication.classList.add('is-story-resolved');
      communication.dispatchEvent(new Event('communication:story-replay-end'));
    }
    overlay.hidden = true;
    sword.classList.remove('is-visible');
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    cardToken.classList.remove('is-visible');
    launch.hidden = false;
    agents.forEach(agent => {
      agent.classList.remove('is-visible', 'is-dragging', 'is-working');
      agent.style.transitionDelay = '';
      agent.style.removeProperty('--x');
      agent.style.removeProperty('--y');
      agent.style.removeProperty('--travel-duration');
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
    communicationWasResolved = false;
    communicationReplayResolved = false;
    startScroll = window.scrollY;
    previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    overlay.hidden = false;
    launch.hidden = true;
    skip.focus({ preventScroll: true });
    if (reducedMotion.matches) {
      if (communication) await playReducedCommunicationBeat(token);
      if (token !== run) return;
      status.textContent = 'Secret build is ready. Motion is reduced on this device.';
      await wait(700);
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
      if (element.matches('.communication-section')) prepareCommunicationReplay(element);
      const box = element.getBoundingClientRect();
      if (section || box.bottom > innerHeight - 36) {
        const top = window.scrollY + box.top - (section ? 82 : innerHeight * .35);
        const distance = Math.abs(top - window.scrollY);
        const duration = index === sequence.length - 1
          ? Math.min(1050, Math.max(620, distance * .45))
          : index === sequence.length - 2
          ? Math.min(700, Math.max(360, distance * .3))
          : Math.min(1600, Math.max(520, distance * .42));
        await scrollToPosition(top, duration, token);
      }
      if (token !== run) return;
      if (index >= sequence.length - 2) {
        await buildEnding(element, index, token);
        continue;
      }
      if (element.matches('.communication-section')) {
        await buildCommunication(element, token);
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
      await wait(section ? 650 : index < 9 ? 230 : 390);
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
