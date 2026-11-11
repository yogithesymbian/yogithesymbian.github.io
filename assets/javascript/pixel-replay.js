(() => {
  const launch = document.querySelector('.pixel-replay-launch');
  const overlay = document.querySelector('.pixel-replay-overlay');
  if (!launch || !overlay) return;
  launch.hidden = false;

  const status = overlay.querySelector('.pixel-replay-status');
  const phase = overlay.querySelector('.pixel-replay-phase');
  const skip = overlay.querySelector('.pixel-replay-skip');
  const sound = overlay.querySelector('.pixel-replay-sound');
  const audio = new Audio('assets/audio/ascension-secret-build.mp3');
  audio.preload = 'none';
  let soundEnabled = true;
  let audioGeneration = 0;
  let audioFadeFrame = 0;
  let hudCreditTimer = 0;
  function updateSoundControl(label) {
    sound.textContent = label || (soundEnabled ? 'Sound on' : 'Sound off');
    sound.setAttribute('aria-label', sound.textContent);
    sound.setAttribute('aria-pressed', String(soundEnabled));
  }
  function playAudio(reset = false) {
    const token = ++audioGeneration;
    cancelAnimationFrame(audioFadeFrame);
    if (reset) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = .5;
    }
    if (!soundEnabled) return;
    audio.muted = false;
    // Run from the click handler before the visual sequence reaches its first await.
    const result = audio.play();
    result?.catch(() => {
      if (token !== audioGeneration || !active) return;
      soundEnabled = false;
      if (audio.error) {
        sound.disabled = true;
        updateSoundControl('Sound unavailable');
      } else updateSoundControl('Play sound');
    });
  }
  function stopAudio(immediate = false) {
    const token = ++audioGeneration;
    cancelAnimationFrame(audioFadeFrame);
    if (immediate || audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    const from = audio.volume;
    const started = performance.now();
    const fade = now => {
      if (token !== audioGeneration) return;
      const progress = Math.min(1, (now - started) / 400);
      audio.volume = from * (1 - progress);
      if (progress < 1) audioFadeFrame = requestAnimationFrame(fade);
      else { audio.pause(); audio.currentTime = 0; audio.volume = .5; }
    };
    audioFadeFrame = requestAnimationFrame(fade);
  }
  audio.addEventListener('error', () => {
    soundEnabled = false;
    sound.disabled = true;
    updateSoundControl('Sound unavailable');
  });
  sound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) playAudio();
    else { ++audioGeneration; audio.pause(); }
    updateSoundControl();
  });
  const agents = [...overlay.querySelectorAll('.pixel-replay-agent')];
  for (let index = 0; index < 9; index++) {
    const extra = agents[0].cloneNode(true);
    extra.className = 'pixel-replay-agent agent-extra';
    extra.querySelector('b').textContent = ['COPY', 'ALIGN', 'MEDIA', 'SCOUT', 'TYPE', 'GRID', 'PLACE', 'DETAIL', 'NEXT'][index];
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
  const aircraft = document.createElement('div');
  aircraft.className = 'pixel-replay-aircraft';
  aircraft.setAttribute('aria-hidden', 'true');
  const aircraftSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  aircraftSvg.setAttribute('viewBox', '0 0 12 12');
  aircraftSvg.setAttribute('shape-rendering', 'crispEdges');
  const aircraftRows = ['.....##.....', '.....##.....', '....####....', '....####....', '..########..', '.##########.', '############', '..########..', '....####....', '...##..##...', '..##....##..', '............'];
  aircraftRows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell !== '#') return;
    const pixel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pixel.setAttribute('x', String(x));
    pixel.setAttribute('y', String(y));
    pixel.setAttribute('width', '1');
    pixel.setAttribute('height', '1');
    aircraftSvg.appendChild(pixel);
  }));
  const aircraftStripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  aircraftStripe.setAttribute('class', 'aircraft-stripe');
  aircraftStripe.setAttribute('x', '5');
  aircraftStripe.setAttribute('y', '3');
  aircraftStripe.setAttribute('width', '2');
  aircraftStripe.setAttribute('height', '5');
  aircraftSvg.appendChild(aircraftStripe);
  aircraft.appendChild(aircraftSvg);
  overlay.appendChild(aircraft);
  const thankYou = document.createElement('div');
  thankYou.className = 'pixel-replay-thank-you';
  thankYou.setAttribute('aria-hidden', 'true');
  ['ADA PROJECT?', 'YUK, GARAP BARENG.'].forEach(line => {
    const textLine = document.createElement('span');
    textLine.textContent = line;
    thankYou.appendChild(textLine);
  });
  overlay.appendChild(thankYou);
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
  const phaseNames = ['NAV', 'SCENE', 'PLAYER', 'IDENTITY', 'PORTRAIT', 'STORY', 'DETAILS', 'ACTIONS', 'PROFILE', 'UNDERSTANDING', 'PROJECTS', 'SKILL SET', 'PROOF', 'FIELD NOTES', 'CONVERSATION', 'COMPLETE'];
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
  // The first eight form the signature shapes; the remaining four work on details.
  const formation = agents.slice(0, 8);
  const detailSelectors = {
    'work-section': '.section-intro, .case-study, .archive-trigger',
    'capabilities-section': '.capability-lead, .capability-list > li, .stack-line',
    'trust-section': '.section-intro, .credential-primary, .credential-grid > article',
    'writing-section': '.section-intro, .writing-featured, .writing-compact > article'
  };
  let active = false;
  let run = 0;
  let startScroll = 0;
  let previousScrollBehavior = '';
  let communicationWasResolved = false;
  let communicationReplayResolved = false;
  let replayStep = -1;

  function wait(ms) {
    return new Promise(resolve => { window.setTimeout(resolve, ms); });
  }

  function setHudPhase(index, name) {
    if (!phase) return;
    const number = index < 0 ? '00' : String(index + 1).padStart(2, '0');
    phase.textContent = `${number} / ${name || phaseNames[index] || 'BUILD'}`;
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
      const duration = travelDuration || (replayStep < 11
        ? Math.max(210, Math.min(740, 170 + distance * .67 + (role % 3) * 24))
        : Math.max(150, Math.min(510, 105 + distance * .46 + (role % 3) * 18)));
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

  const parallelOverlays = new Set();

  function replaySubject(piece) {
    return piece.matches('.case-study') ? piece.querySelector('h3') || piece : piece;
  }

  async function buildParallelPiece(piece, cursor, assistant, part, token, quick, stillActive = () => true) {
    const subject = replaySubject(piece);
    const box = subject.getBoundingClientRect();
    const x = Math.max(16, Math.min(innerWidth - 68, box.left));
    const y = Math.max(104, Math.min(innerHeight - 68, box.top));
    const width = Math.max(44, Math.min(box.width, innerWidth - x - 18));
    const height = Math.max(34, Math.min(box.height, innerHeight - y - 18));
    const fromRight = part % 2 === 1;
    const localFrame = frame.cloneNode(true);
    const localGuide = guide.cloneNode(true);
    localFrame.classList.remove('is-visible', 'is-dragging');
    localGuide.classList.remove('is-visible');
    localFrame.style.setProperty('--frame-x', `${Math.round(x)}px`);
    localFrame.style.setProperty('--frame-y', `${Math.round(y)}px`);
    localFrame.style.setProperty('--frame-w', `${Math.round(width)}px`);
    localFrame.style.setProperty('--frame-h', `${Math.round(height)}px`);
    localFrame.style.setProperty('--frame-origin', fromRight ? '100% 0' : '0 0');
    localFrame.style.setProperty('--frame-duration', quick ? '170ms' : '245ms');
    localGuide.style.setProperty('--guide-x', `${Math.round(x)}px`);
    localGuide.style.setProperty('--guide-y', `${Math.round(y + height)}px`);
    localGuide.style.setProperty('--guide-w', `${Math.round(width)}px`);
    localGuide.style.setProperty('--guide-origin', fromRight ? 'right' : 'left');
    overlay.append(localGuide, localFrame);
    parallelOverlays.add(localFrame);
    parallelOverlays.add(localGuide);
    const pause = ms => wait(ms).then(() => token === run && stillActive());
    try {
      if (!(await pause((part % 4) * (quick ? 22 : 30)))) return;
      const startX = fromRight ? x + width : x;
      const endX = fromRight ? x : x + width;
      moveAgentTo(cursor, startX, y, quick ? 135 : 185);
      if (assistant) moveAgentTo(assistant, endX, y + height, quick ? 150 : 200);
      localFrame.classList.add('is-visible');
      if (!(await pause(quick ? 115 : 155))) return;
      cursor.classList.add('is-dragging');
      localFrame.classList.add('is-dragging');
      localGuide.classList.add('is-visible');
      moveAgentTo(cursor, endX, y + height, quick ? 170 : 245);
      if (assistant) {
        assistant.classList.add('is-working');
        moveAgentTo(assistant, x + width * .5, y + height + 9, quick ? 165 : 220);
      }
      if (!(await pause(quick ? 185 : 260))) return;
      piece.dataset.replayDirection = ['left', 'top', 'right', 'bottom'][part % 4];
      piece.setAttribute('data-replay-visible', '');
      cursor.classList.remove('is-dragging');
      if (assistant) moveAgentTo(assistant, x + width * .8, y + height * .3, 145);
      await pause(quick ? 45 : 65);
    } finally {
      localFrame.remove();
      localGuide.remove();
      parallelOverlays.delete(localFrame);
      parallelOverlays.delete(localGuide);
      cursor.classList.remove('is-dragging');
      assistant?.classList.remove('is-working');
    }
  }

  async function buildParallelWaves(pieces, index, token, quick = false, afterWave, crew = agents) {
    pieces.forEach(piece => piece.setAttribute('data-replay-piece', ''));
    let cursorOffset = index % crew.length;
    let remaining = [...pieces];
    while (remaining.length && token === run) {
      const first = replaySubject(remaining[0]).getBoundingClientRect();
      if (first.top < 100 || first.top > innerHeight - 140) {
        await scrollToPosition(window.scrollY + first.top - Math.max(115, innerHeight * .25), quick ? 270 : 350, token);
      }
      if (token !== run) return;
      const visible = remaining.filter(piece => {
        const box = replaySubject(piece).getBoundingClientRect();
        return box.top >= 75 && box.top < innerHeight - (quick ? 90 : 120);
      }).slice(0, crew.length);
      const wave = visible.length ? visible : [remaining[0]];
      status.textContent = `Building ${wave.length} elements together.`;
      const work = wave.map((piece, part) => {
        const cursor = crew[(cursorOffset + part) % crew.length];
        const assistant = wave.length * 2 <= crew.length
          ? crew[(cursorOffset + wave.length + part) % crew.length] : null;
        return buildParallelPiece(piece, cursor, assistant, cursorOffset + part, token, quick);
      });
      await Promise.all(work);
      if (token !== run) return;
      if (afterWave) await afterWave(wave);
      if (token !== run) return;
      cursorOffset = (cursorOffset + wave.length) % crew.length;
      remaining = remaining.filter(piece => !wave.includes(piece));
    }
  }

  async function placeProjectMedia(caseStudy, token, carry, isLast) {
    const media = caseStudy.querySelector('.case-media');
    const heading = caseStudy.querySelector('h3');
    if (!media || !heading || token !== run) return carry;
    const preview = media.querySelector('video[poster], .case-media-panel:not([hidden]) img, img');
    const source = preview?.getAttribute('poster') || preview?.getAttribute('src');
    if (!source) { media.setAttribute('data-replay-visible', ''); return carry; }
    const worker = agents[3];
    let proxy = carry;
    if (!proxy) {
      const title = heading.getBoundingClientRect();
      proxy = document.createElement('div');
      proxy.className = 'pixel-replay-media-proxy';
      proxy.setAttribute('aria-hidden', 'true');
      const image = document.createElement('img');
      image.src = source;
      image.alt = '';
      const label = document.createElement('span');
      label.textContent = 'SELECT / COPY';
      proxy.append(image, label);
      const startX = Math.max(16, Math.min(innerWidth - 150, title.left + Math.min(title.width * .35, 80)));
      const startY = Math.max(112, Math.min(innerHeight - 170, title.top + 14));
      proxy.style.setProperty('--media-x', `${Math.round(startX)}px`);
      proxy.style.setProperty('--media-y', `${Math.round(startY)}px`);
      overlay.appendChild(proxy);
      parallelOverlays.add(proxy);
      proxy.classList.add('is-visible');
      moveAgentTo(worker, startX + 8, startY + 8, 240);
      await wait(150);
    } else {
      proxy.querySelector('span').textContent = 'COPY / MOVE';
      status.textContent = `Carrying media into ${shortTitle(caseStudy)}.`;
    }
    if (token !== run) return proxy;
    const initial = media.getBoundingClientRect();
    if (initial.top > innerHeight - 170 || initial.bottom < 100) {
      await scrollToPosition(window.scrollY + initial.top - innerHeight * .35, 360, token);
    }
    if (token !== run) return proxy;
    const target = media.getBoundingClientRect();
    const endX = Math.max(16, Math.min(innerWidth - 150, target.left + target.width * .5 - 62));
    const endY = Math.max(110, Math.min(innerHeight - 132, target.top + Math.min(target.height * .42, 170) - 38));
    status.textContent = `Pasting media into ${shortTitle(caseStudy)}.`;
    worker.classList.add('is-dragging');
    proxy.style.setProperty('--media-x', `${Math.round(endX)}px`);
    proxy.style.setProperty('--media-y', `${Math.round(endY)}px`);
    moveAgentTo(worker, endX + 8, endY + 8, 410);
    await wait(440);
    if (token !== run) { worker.classList.remove('is-dragging'); return proxy; }
    proxy.querySelector('span').textContent = 'PASTE / ADAPT';
    proxy.querySelector('img').src = source;
    media.dataset.replayDirection = 'top';
    media.setAttribute('data-replay-visible', '');
    worker.classList.remove('is-dragging');
    await wait(115);
    if (token !== run) return proxy;
    if (isLast) {
      proxy.classList.add('is-placed');
      await wait(140);
      proxy.remove();
      parallelOverlays.delete(proxy);
      return null;
    }
    // Copy the placed media into a fixed tray so it stays in view during the next scroll.
    proxy.querySelector('span').textContent = 'COPY / NEXT';
    worker.classList.add('is-dragging');
    await wait(70);
    if (token !== run) { worker.classList.remove('is-dragging'); return proxy; }
    const trayX = Math.max(16, innerWidth - 154);
    const trayY = innerWidth <= 650 ? 94 : 164;
    proxy.style.setProperty('--media-x', `${Math.round(trayX)}px`);
    proxy.style.setProperty('--media-y', `${Math.round(trayY)}px`);
    moveAgentTo(worker, trayX + 8, trayY + 8, 310);
    await wait(330);
    worker.classList.remove('is-dragging');
    return proxy;
  }

  async function buildHeroButtons(element, token) {
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    element.setAttribute('data-replay-visible', '');
    const pieces = [...element.querySelectorAll(':scope > a')];
    const stations = ['.hero h1', '.hero-statement', '.hero-description', '.hero-visual', '.proof-rail', '.hero-meta'];
    agents.slice(2, 8).forEach((agent, index) => {
      const target = document.querySelector(stations[index])?.getBoundingClientRect();
      if (!target) return;
      moveAgentTo(agent,
        Math.max(12, Math.min(innerWidth - 28, target.left + target.width * .5)),
        Math.max(104, Math.min(innerHeight - 42, target.top + Math.min(target.height, 90) * .5)), 280);
    });
    await buildParallelWaves(pieces, 0, token, true);
  }

  async function buildHeroProof(element, token) {
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    const pieces = [...element.querySelectorAll(':scope > div')];
    pieces.forEach(piece => piece.setAttribute('data-replay-piece', ''));
    element.setAttribute('data-replay-visible', '');
    const first = pieces[0]?.getBoundingClientRect();
    if (first && first.top > innerHeight - 110) {
      await scrollToPosition(window.scrollY + first.top - innerHeight * .42, 280, token);
    }
    if (token !== run) return;
    status.textContent = 'The proof spreads into place.';
    formation.forEach((agent, worker) => {
      const box = pieces[worker % pieces.length].getBoundingClientRect();
      moveAgentTo(agent,
        Math.max(12, Math.min(innerWidth - 28, box.left + box.width * (worker < 4 ? .2 : .75))),
        Math.max(104, Math.min(innerHeight - 42, box.top + box.height * (worker < 4 ? .28 : .7))), 240);
    });
    await Promise.all(pieces.map(async (piece, part) => {
      await wait(95 + part * 45);
      if (token !== run) return;
      piece.dataset.replayDirection = ['left', 'top', 'right', 'bottom'][part];
      piece.setAttribute('data-replay-visible', '');
    }));
    await wait(100);
  }

  async function buildDetails(section, index, token) {
    const className = Object.keys(detailSelectors).find(name => section.classList.contains(name));
    if (!className) return false;
    section.setAttribute('data-replay-visible', '');
    const pieces = [...section.querySelectorAll(detailSelectors[className])];
    if (className !== 'work-section') {
      await buildParallelWaves(pieces, index, token);
      return true;
    }
    const cases = pieces.filter(piece => piece.matches('.case-study'));
    cases.forEach(piece => piece.querySelector('.case-media')?.setAttribute('data-replay-piece', ''));
    let carry = null;
    try {
      await buildParallelWaves(pieces, index, token, false, async wave => {
        for (const piece of wave.filter(item => item.matches('.case-study'))) {
          if (token !== run) return;
          carry = await placeProjectMedia(piece, token, carry, piece === cases[cases.length - 1]);
        }
      }, agents.filter((_, worker) => worker !== 3));
    } finally {
      carry?.remove();
      if (carry) parallelOverlays.delete(carry);
      agents[3].classList.remove('is-dragging');
    }
    return true;
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
    const crew = replayStep < 11 ? formation : agents;
    const lead = crew[index % crew.length];
    const edgeWorker = crew[(index + 1) % crew.length];
    const finishWorker = crew[(index + 2) % crew.length];
    const copyWorker = crew[(index + 3) % crew.length];
    const alignWorker = crew[(index + 4) % crew.length];
    const mediaWorker = crew[(index + 5) % crew.length];
    const scoutWorker = crew[(index + 6) % crew.length];
    const typeWorker = crew[(index + 7) % crew.length];
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
    await wait(replayStep < 11 ? (opening ? 100 : 160) : (opening ? 65 : 105));
    if (token !== run) return;
    lead.classList.add('is-dragging');
    moveAgentTo(lead, corners[origin][0], corners[origin][1]);
    moveAgentTo(mediaWorker, x + width * .58, y + height * .32);
    moveAgentTo(scoutWorker, Math.min(innerWidth - 24, Math.max(12, nextBox.left + 40)), Math.min(innerHeight - 32, Math.max(95, nextBox.top + 14)));
    await wait(replayStep < 11 ? (opening ? 190 : 260) : (opening ? 115 : 190));
    if (token !== run) return;
    frame.classList.add('is-dragging');
    frame.style.setProperty('--frame-duration', replayStep < 11 ? (opening ? '360ms' : '480ms') : (opening ? '250ms' : '370ms'));
    guide.classList.add('is-visible');
    moveAgentTo(lead, end[0], end[1], replayStep < 11 ? (opening ? 360 : 480) : (opening ? 250 : 370));
    moveAgentTo(mediaWorker, x + width * .72, y + height * .45);
    moveAgentTo(scoutWorker, Math.min(innerWidth - 24, Math.max(12, nextBox.left + 24)), Math.min(innerHeight - 32, Math.max(95, nextBox.top + 26)));
    clipboard.style.setProperty('--copy-x', `${Math.round(pasteX)}px`);
    clipboard.style.setProperty('--copy-y', `${Math.round(pasteY)}px`);
    moveAgentTo(copyWorker, pasteX + 8, pasteY + 8);
    moveAgentTo(alignWorker, x + width * .82, y + height + 9);
    moveAgentTo(edgeWorker, x + width * .7, y);
    moveAgentTo(finishWorker, x + width * .34, y + height);
    await wait(replayStep < 11 ? (opening ? 390 : 520) : (opening ? 275 : 395));
    if (token !== run) return;
    clipboard.querySelector('span').textContent = 'PASTE / ADAPT';
    clipboard.querySelector('strong').textContent = shortTitle(element);
    await wait(replayStep < 11 ? (opening ? 110 : 180) : (opening ? 75 : 95));
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
    await Promise.all(pieces.map(async (piece, part) => {
      await wait(part * (footer ? 95 : 55) + 160);
      if (token !== run) return;
      piece.dataset.replayDirection = ['right', 'top', 'left', 'bottom'][part % 4];
      piece.setAttribute('data-replay-visible', '');
    }));
    await wait(footer ? 460 : 180);
  }

  async function buildContact(element, token) {
    const eyebrow = element.querySelector('.contact-main > .eyebrow');
    const title = element.querySelector('#contact-title');
    const description = element.querySelector('.contact-description');
    const buttons = [...element.querySelectorAll('.contact-actions > a')];
    const profiles = [...element.querySelectorAll('.official-profiles > *')];
    const pieces = [eyebrow, title, description, ...buttons, ...profiles].filter(Boolean);
    pieces.forEach(piece => piece.setAttribute('data-replay-piece', ''));
    element.setAttribute('data-replay-visible', '');
    element.classList.add('is-contact-building');
    status.textContent = 'Setting the final scene.';
    const titleBox = title.getBoundingClientRect();
    formation.slice(2, 8).forEach((agent, index) => {
      const x = titleBox.left + titleBox.width * (index % 2 ? .82 : .16);
      const y = titleBox.top + titleBox.height * (index < 3 ? .2 : .78);
      moveAgentTo(agent, Math.max(12, Math.min(innerWidth - 28, x)), Math.max(102, Math.min(innerHeight - 36, y)), 260);
    });
    try {
      await buildParallelPiece(eyebrow, agents[0], agents[8], 0, token, true);
      if (token !== run) return;
      status.textContent = 'The invitation takes shape.';
      await buildParallelPiece(title, agents[1], agents[2], 1, token, false);
      if (token !== run) return;
      status.textContent = 'The message and two ways in arrive together.';
      await buildParallelWaves([description, ...buttons], 2, token, true);
      if (token !== run) return;
      status.textContent = 'The official routes lock into place.';
      await buildParallelWaves(profiles, 5, token, true);
      if (token !== run) return;
      await wait(240);
    } finally {
      element.classList.remove('is-contact-building');
    }
  }

  async function flyToContact(contact, token) {
    const duration = 980;
    const startX = innerWidth * .78;
    const startY = innerHeight * .72;
    const planeSlots = [
      [0, -13], [-9, -8], [9, -8], [-15, 0], [15, 0], [-9, 8], [9, 8], [0, 13]
    ];
    status.textContent = 'The crew joins into a pixel flight.';
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    formation.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 22}ms`;
      agent.classList.remove('is-working', 'is-dragging');
      moveAgentTo(agent, startX + planeSlots[index][0] * 2, startY + planeSlots[index][1] * 2, 360);
    });
    await wait(390);
    if (token !== run) return;

    aircraft.style.setProperty('--aircraft-x', `${Math.round(startX)}px`);
    aircraft.style.setProperty('--aircraft-y', `${Math.round(startY)}px`);
    formation.forEach(agent => agent.classList.add('is-morphing'));
    aircraft.classList.add('is-visible', 'is-flying');
    await wait(180);
    if (token !== run) return;
    formation.forEach(agent => agent.classList.add('is-merged'));
    status.textContent = 'A pixel flight carries the build to the conversation.';
    const fromScroll = window.scrollY;
    const started = performance.now();
    await new Promise(resolve => {
      const frame = now => {
        if (token !== run) { resolve(); return; }
        const t = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const targetScroll = contact.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top: fromScroll + (targetScroll - fromScroll) * eased, behavior: 'auto' });
        const x = innerWidth * (.78 + (.31 - .78) * eased);
        const y = innerHeight * (.72 + (.34 - .72) * eased) - Math.sin(Math.PI * eased) * Math.min(44, innerHeight * .055);
        aircraft.style.setProperty('--aircraft-x', `${Math.round(x)}px`);
        aircraft.style.setProperty('--aircraft-y', `${Math.round(y)}px`);
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    if (token !== run) return;

    const pieces = [...contact.querySelectorAll('.contact-main > *, .official-profiles')];
    aircraft.classList.remove('is-flying');
    formation.forEach((agent, worker) => {
      const piece = pieces[worker % pieces.length];
      const box = piece.getBoundingClientRect();
      const x = Math.max(16, Math.min(innerWidth - 155, box.left + box.width * (.2 + (worker % 3) * .22)));
      const y = Math.max(100, Math.min(innerHeight - 54, box.top + box.height * (.2 + (worker % 2) * .4)));
      agent.style.transitionDelay = `${worker * 24}ms`;
      moveAgentTo(agent, x, y);
      agent.classList.remove('is-merged');
    });
    await wait(180);
    if (token !== run) return;
    aircraft.classList.remove('is-visible');
    formation.forEach(agent => agent.classList.remove('is-morphing'));
    await wait(390);
    if (token !== run) return;
    aircraft.classList.remove('is-flying');
    agents.forEach(agent => { agent.style.transitionDelay = ''; });
  }

  async function thankYouMoment(token) {
    const box = thankYou.getBoundingClientRect();
    status.textContent = 'The crew gathers for one last message.';
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    formation.forEach((agent, worker) => {
      const line = worker < 4 ? 0 : 1;
      const slot = worker % 4;
      const x = box.left + box.width * (.14 + slot * .24);
      const y = box.top + box.height * (line ? .74 : .28);
      agent.style.transitionDelay = `${worker * 28}ms`;
      agent.classList.remove('is-morphing', 'is-merged', 'is-scattering');
      agent.classList.add('is-lettering');
      moveAgentTo(agent, x, y, 430);
    });
    await wait(460);
    if (token !== run) return;
    status.textContent = 'Ada project? Yuk, garap bareng.';
    thankYou.classList.add('is-writing');
    requestAnimationFrame(() => thankYou.classList.add('is-written'));
    await wait(900);
    if (token !== run) return;
    await wait(520);
    if (token !== run) return;

    status.textContent = 'The crew scatters beyond the frame.';
    const exits = [
      [-24, innerHeight * .17], [innerWidth * .32, -28], [innerWidth * .67, -28], [innerWidth + 24, innerHeight * .22],
      [-24, innerHeight * .78], [innerWidth * .3, innerHeight + 28], [innerWidth * .7, innerHeight + 28], [innerWidth + 24, innerHeight * .82]
    ];
    formation.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 34}ms`;
      agent.classList.add('is-scattering');
      agent.classList.remove('is-lettering');
      moveAgentTo(agent, exits[index][0], exits[index][1], 620 + (index % 3) * 55);
    });
    await wait(820);
    if (token !== run) return;
    agents.forEach(agent => agent.classList.remove('is-visible'));
    agents.forEach(agent => { agent.style.transitionDelay = ''; });
  }

  function prepareCommunicationReplay(element) {
    communicationWasResolved = element.classList.contains('is-story-active') || element.classList.contains('is-story-resolved');
    communicationReplayResolved = false;
    element.dataset.replayStory = 'active';
    element.classList.remove('is-story-active', 'is-story-resolved', 'is-pm-vanishing');
    element.classList.add('is-replay-story');
    element.querySelectorAll('.communication-comic').forEach(card => {
      card.setAttribute('data-replay-piece', '');
      card.querySelectorAll('.comic-heading > *, .comic-frame > *, .comic-takeaway')
        .forEach(piece => piece.setAttribute('data-replay-piece', ''));
    });
  }

  async function buildComicContents(card, cardIndex, token, crew, isCurrent = () => true) {
    const heading = [...card.querySelectorAll('.comic-heading > *')];
    const dialogue = [...card.querySelectorAll('.comic-frame > *')];
    const takeaway = card.querySelector('.comic-takeaway');
    const buildPiece = async (piece, cursor, assistant, part) => {
      const box = piece.getBoundingClientRect();
      if (innerWidth <= 650 && (!isCurrent() || box.bottom < 100 || box.top > innerHeight - 120)) {
        await wait(150);
        if (token === run) piece.setAttribute('data-replay-visible', '');
        return;
      }
      await buildParallelPiece(piece, cursor, assistant, part, token, true, isCurrent);
      if (token === run && !piece.hasAttribute('data-replay-visible')) piece.setAttribute('data-replay-visible', '');
    };
    await Promise.all(heading.map((piece, part) =>
      buildPiece(piece, crew[part], crew[part + 2], cardIndex * 3 + part)));
    if (token !== run) return;
    for (let start = 0; start < dialogue.length; start += 2) {
      const wave = dialogue.slice(start, start + 2);
      await Promise.all(wave.map(async (piece, part) => {
        await wait(part * 42);
        if (token !== run) return;
        const worker = (cardIndex + start + part) % 2;
        await buildPiece(piece, crew[worker], crew[worker + 2], start + part);
      }));
      if (token !== run) return;
    }
    await buildPiece(takeaway, crew[cardIndex % 2], crew[cardIndex % 2 + 2], cardIndex + 8);
    if (token !== run) return;
    const box = card.getBoundingClientRect();
    if (box.bottom >= 100 && box.top <= innerHeight - 120) {
      crew.forEach((agent, index) => moveAgentTo(agent,
        Math.max(12, Math.min(innerWidth - 28, box.left + (index % 2 ? box.width - 18 : 12))),
        Math.max(100, Math.min(innerHeight - 36, box.top + (index < 2 ? 12 : box.height - 20))), 175));
    }
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
      await scrollToPosition(window.scrollY + stageBox.top - innerHeight * .2, 300, token);
    }
    if (token !== run) return;

    status.textContent = 'The whole team starts together.';
    const user = element.querySelector('.character-user').getBoundingClientRect();
    const pmBox = pm.getBoundingClientRect();
    const developer = element.querySelector('.character-dev').getBoundingClientRect();
    const question = element.querySelector('.communication-object').getBoundingClientRect();
    const stations = [user, pmBox, developer, question, user, developer, pmBox, question];
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    formation.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 12}ms`;
      const box = stations[index];
      moveAgentTo(agent,
        Math.max(12, Math.min(innerWidth - 28, box.left + box.width * (index % 2 ? .72 : .28))),
        Math.max(102, Math.min(innerHeight - 32, box.top + box.height * (index % 2 ? .28 : .72))));
    });
    await wait(250);
    if (token !== run) return;

    const lead = agents[0];
    lead.style.transitionDelay = '';
    status.textContent = 'Watch the PM leave the scene.';
    moveAgentTo(lead,
      Math.max(10, Math.min(innerWidth - 28, pmBox.left + pmBox.width * .5)),
      Math.max(102, Math.min(innerHeight - 34, pmBox.top + 8)), 190);
    formation.slice(4, 7).forEach((agent, index) => moveAgentTo(agent,
      Math.max(12, Math.min(innerWidth - 28, pmBox.left + pmBox.width * (index + 1) / 4)),
      Math.max(102, Math.min(innerHeight - 34, pmBox.top + pmBox.height * .35)), 210));
    await wait(230);
    if (token !== run) return;

    element.classList.add('is-pm-vanishing');
    await wait(reducedMotion.matches ? 80 : 520);
    if (token !== run) return;
    resolveCommunicationStory(element);
    communicationReplayResolved = true;
    status.textContent = 'The work continues with a clear request.';
    await wait(80);
  }

  async function buildCommunication(element, token) {
    const cards = [...element.querySelectorAll('.communication-comic')];
    if (cards.length !== 3) return;
    await cuePmDeparture(element, token);
    if (token !== run) return;
    element.dataset.replayDirection = 'left';
    element.setAttribute('data-replay-visible', '');
    const mobile = innerWidth <= 650;
    if (mobile) {
      const first = cards[0].getBoundingClientRect();
      await scrollToPosition(window.scrollY + first.top - 108, 280, token);
    }
    if (token !== run) return;
    status.textContent = 'Three conversations build at once.';
    overlay.classList.add('is-building-comics');
    if (mobile) agents.slice(4).forEach(agent => agent.classList.remove('is-visible'));
    const work = [];
    let activeMobileCard = 0;
    for (const [index, card] of cards.entries()) {
      if (mobile && index > 0) {
        await wait(760);
        if (token !== run) return;
        activeMobileCard = index;
        agents.forEach(agent => agent.classList.remove('is-visible'));
        const box = card.getBoundingClientRect();
        await scrollToPosition(window.scrollY + box.top - 108, 340, token);
        if (token !== run) return;
      }
      card.dataset.replayDirection = ['left', 'top', 'right'][index];
      card.setAttribute('data-replay-visible', '');
      work.push(buildComicContents(card, index, token, agents.slice(index * 4, index * 4 + 4), () => !mobile || activeMobileCard === index));
    }
    await Promise.all(work);
    if (token !== run) return;
    overlay.classList.remove('is-building-comics');
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
    agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
    formation.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 45}ms`;
      const angle = index * Math.PI * 2 / formation.length;
      moveAgentTo(agent, cx + Math.cos(angle) * 140, cy + Math.sin(angle) * 88);
    });
    await wait(420);
    if (token !== run) return;
    formation.forEach((agent, index) => {
      const angle = index * Math.PI * 2 / formation.length + 1.1;
      moveAgentTo(agent, cx + Math.cos(angle) * 82, cy + Math.sin(angle) * 60);
    });
    await wait(650);
    if (token !== run) return;
    status.textContent = 'A blade forms from the current.';
    const blade = [[-54, 52], [-39, 37], [-24, 22], [-9, 7], [6, -8], [21, -23], [36, -38], [48, -50]];
    formation.forEach((agent, index) => {
      agent.style.transitionDelay = `${index * 30}ms`;
      moveAgentTo(agent, cx + blade[index][0], cy + blade[index][1]);
    });
    await wait(650);
    if (token !== run) return;
    sword.style.setProperty('--x', `${cx}px`);
    sword.style.setProperty('--y', `${cy}px`);
    sword.classList.add('is-visible');
    formation.forEach(agent => agent.classList.remove('is-visible'));
    await wait(650);
    if (token !== run) return;
    sword.classList.remove('is-visible');
    frame.classList.remove('is-visible', 'is-dragging');
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    cardToken.classList.remove('is-visible');
    aircraft.classList.remove('is-visible', 'is-flying');
    thankYou.classList.remove('is-writing', 'is-written');
    status.textContent = 'The cursors scatter and carry on.';
    formation.forEach((agent, index) => {
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
    stopAudio(document.hidden);
    active = false;
    run++;
    replayStep = -1;
    clearTimeout(hudCreditTimer);
    overlay.classList.remove('is-credit-visible');
    overlay.classList.remove('is-high-tempo');
    overlay.classList.remove('is-building-comics');
    document.querySelector('.contact-section')?.classList.remove('is-contact-building');
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
    parallelOverlays.forEach(node => node.remove());
    parallelOverlays.clear();
    clipboard.classList.remove('is-visible');
    guide.classList.remove('is-visible');
    cardToken.classList.remove('is-visible');
    aircraft.classList.remove('is-visible', 'is-flying');
    thankYou.classList.remove('is-writing', 'is-written');
    launch.hidden = false;
    agents.forEach(agent => {
      agent.classList.remove('is-visible', 'is-dragging', 'is-working', 'is-morphing', 'is-merged', 'is-lettering', 'is-scattering');
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
    playAudio(true);
    const token = ++run;
    communicationWasResolved = false;
    communicationReplayResolved = false;
    startScroll = window.scrollY;
    previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    overlay.hidden = false;
    setHudPhase(-1, 'OPENING');
    overlay.classList.add('is-credit-visible');
    clearTimeout(hudCreditTimer);
    hudCreditTimer = window.setTimeout(() => overlay.classList.remove('is-credit-visible'), 2200);
    launch.hidden = true;
    skip.focus({ preventScroll: true });
    if (reducedMotion.matches) {
      if (communication) await playReducedCommunicationBeat(token);
      if (token !== run) return;
      status.textContent = 'Ada project? Yuk, garap bareng.';
      thankYou.classList.add('is-written');
      await wait(1200);
      if (token === run) finish(true);
      return;
    }

    status.textContent = 'Opening the secret build…';
    await scrollToPosition(0, Math.min(900, 350 + startScroll / 8), token);
    if (token !== run) return;
    document.body.classList.add('is-pixel-replaying');

    for (let index = 0; index < sequence.length; index++) {
      if (token !== run) return;
      replayStep = index;
      if (index > 0) overlay.classList.remove('is-credit-visible');
      overlay.classList.toggle('is-high-tempo', index >= 11);
      const [element, label] = sequence[index];
      setHudPhase(index);
      status.textContent = label;
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
          : index < 11
          ? Math.min(1600, Math.max(520, distance * .42))
          : Math.min(1120, Math.max(390, distance * .34));
        await scrollToPosition(top, duration, token);
      }
      if (token !== run) return;
      if (index < 11) {
        if (element.matches('.communication-section')) {
          await buildCommunication(element, token);
          continue;
        }
        status.textContent = label;
        agents.forEach(agent => { agent.style.transitionDelay = ''; });
        agents.slice(8).forEach(agent => agent.classList.remove('is-visible'));
        for (let cursor = 0; cursor < 8; cursor++) {
          const next = sequence[Math.min(index + (cursor % 3), sequence.length - 1)][0];
          const sweep = paths[index].from[0] > 0 ? -.1 : .15;
          moveAgent(agents[(index + cursor) % 8], next, sweep + (cursor % 3) * .16, (index % 2 ? .2 : 0) + (cursor % 2) * .12);
        }
        if (section || [3, 4, 8].includes(index)) await dragFrame(element, index, token);
        if (token !== run) return;
        element.dataset.replayDirection = ['left', 'top', 'right', 'bottom'][index % 4];
        element.setAttribute('data-replay-visible', '');
        await wait(section ? 650 : index < 9 ? 230 : 390);
        if (index === 8 && token === run) await forgeMoment(token);
        continue;
      }
      if (index >= sequence.length - 2) {
        if (element.matches('.contact-section')) await buildContact(element, token);
        else await buildEnding(element, index, token);
        continue;
      }
      if (element.matches('.communication-section')) {
        await buildCommunication(element, token);
        continue;
      }
      if (element.matches('.hero-actions')) {
        await buildHeroButtons(element, token);
        continue;
      }
      if (element.matches('.proof-rail')) {
        await buildHeroProof(element, token);
        if (token === run) await forgeMoment(token);
        continue;
      }
      if (await buildDetails(element, index, token)) continue;
      status.textContent = label;
      agents.forEach(agent => { agent.style.transitionDelay = ''; });
      const crewSize = index < 9 ? 8 : agents.length;
      agents.slice(crewSize).forEach(agent => agent.classList.remove('is-visible'));
      for (let cursor = 0; cursor < crewSize; cursor++) {
        const next = sequence[Math.min(index + (cursor % 3), sequence.length - 1)][0];
        const sweep = paths[index].from[0] > 0 ? -.1 : .15;
        moveAgent(agents[(index + cursor) % agents.length], next, sweep + (cursor % 3) * .16, (index % 2 ? .2 : 0) + (cursor % 2) * .12);
      }
      if (section || [3, 4, 8].includes(index)) await dragFrame(element, index, token);
      if (token !== run) return;
      element.dataset.replayDirection = ['left', 'top', 'right', 'bottom'][index % 4];
      element.setAttribute('data-replay-visible', '');
      await wait(section ? 350 : index < 9 ? 105 : 250);
      if (index === 13 && token === run) await flyToContact(sequence[index + 1][0], token);
    }
    if (token === run) await thankYouMoment(token);
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
