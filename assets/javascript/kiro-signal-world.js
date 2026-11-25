(() => {
  const canvas = document.querySelector('.kiro-world');
  const stage = document.querySelector('.hero-visual');
  const activate = document.querySelector('.kiro-activate');
  if (!canvas || !stage || !activate) return;

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palette = {
    gold: '#f2bd58', cream: '#f8f3df', teal: '#5eaaa3', green: '#236153', night: '#142438'
  };
  const fragments = ['PRODUCT', 'SYSTEMS', 'CLOUD', 'APPLIED AI'];
  const particles = [];
  let pointer = { x: .5, y: .48, active: false };
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let burstTime = -10;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const scale = Math.min(1.25, window.devicePixelRatio || 1);
    canvas.width = Math.max(160, Math.round(box.width * .55 * scale));
    canvas.height = Math.max(180, Math.round(box.height * .55 * scale));
    context.imageSmoothingEnabled = false;
    draw(performance.now(), true);
  }

  function pixelRect(x, y, width, height, color, alpha = 1) {
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    context.globalAlpha = 1;
  }

  function drawKiro(cx, cy, unit, time) {
    const breathe = reducedMotion.matches ? 0 : Math.sin(time * .0022) * unit * .6;
    const lookX = pointer.active ? Math.max(-1, Math.min(1, (pointer.x - .5) * 2.4)) : 0;
    const lookY = pointer.active ? Math.max(-1, Math.min(1, (pointer.y - .48) * 2.4)) : 0;
    const leanX = lookX * unit * 1.35;
    const eyeX = Math.round(lookX * unit * .55);
    const eyeY = Math.round(lookY * unit * .45);
    cy += breathe;

    // Santa hat: stepped red crown, cream trim and pom-pom.
    pixelRect(cx - unit * 4 + leanX, cy - unit * 10, unit * 6, unit * 2, '#dc3442');
    pixelRect(cx - unit * 2 + leanX, cy - unit * 12, unit * 4, unit * 2, '#dc3442');
    pixelRect(cx + unit + leanX, cy - unit * 11, unit * 3, unit * 2, '#dc3442');
    pixelRect(cx + unit * 3 + leanX, cy - unit * 10, unit * 2, unit * 2, palette.cream);
    pixelRect(cx - unit * 5 + leanX, cy - unit * 8, unit * 10, unit * 2, palette.cream);
    pixelRect(cx - unit, cy - unit * 8, unit * 2, unit * 2, palette.gold);
    pixelRect(cx - unit * 3, cy - unit * 6, unit * 6, unit * 2, palette.gold);
    pixelRect(cx - unit * 5 + leanX, cy - unit * 4, unit * 10, unit * 9, palette.gold);
    pixelRect(cx - unit * 7 + leanX, cy - unit * 2, unit * 2, unit * 5, palette.gold);
    pixelRect(cx + unit * 5 + leanX, cy - unit * 2, unit * 2, unit * 5, palette.gold);
    pixelRect(cx - unit * 4 + leanX, cy - unit * 2, unit * 8, unit * 5, palette.night);
    pixelRect(cx - unit * 2 + leanX, cy - unit, unit, unit * 2, palette.cream);
    pixelRect(cx + unit + leanX, cy - unit, unit, unit * 2, palette.cream);
    pixelRect(cx - unit * 2 + leanX + eyeX, cy - unit + eyeY, unit, unit, palette.night);
    pixelRect(cx + unit + leanX + eyeX, cy - unit + eyeY, unit, unit, palette.night);
    pixelRect(cx - unit + leanX, cy + unit * 2, unit * 2, unit, palette.teal);
    pixelRect(cx - unit * 4, cy + unit * 5, unit * 3, unit * 3, palette.gold);
    pixelRect(cx + unit, cy + unit * 5, unit * 3, unit * 3, palette.gold);

    for (let ring = 0; ring < 3; ring += 1) {
      const pulse = (time * .02 + ring * 18) % 58;
      const alpha = reducedMotion.matches ? .18 : Math.max(0, .3 - pulse / 190);
      context.strokeStyle = palette.gold;
      context.globalAlpha = alpha;
      context.lineWidth = 1;
      context.strokeRect(Math.round(cx - unit * 7 - pulse / 2), Math.round(cy - unit * 8 - pulse / 2), Math.round(unit * 14 + pulse), Math.round(unit * 16 + pulse));
    }
    context.globalAlpha = 1;
  }

  function drawWorld(time, still = false) {
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    const horizon = height * .72;
    pixelRect(0, horizon, width, 1, palette.cream, .18);
    for (let index = 0; index < 18; index += 1) {
      const x = (index * 37) % width;
      const distance = pointer.active ? Math.max(0, 1 - Math.abs(pointer.x * width - x) / (width * .24)) : 0;
      const drift = still || reducedMotion.matches ? 0 : Math.sin(time * .0013 + index) * 2;
      const heightOffset = distance * 10;
      pixelRect(x, horizon - 4 - heightOffset + drift, 2, 2, index % 4 ? palette.cream : palette.gold, .28 + distance * .5);
    }

    const skyline = [5, 9, 4, 13, 7, 18, 8, 5, 12, 6, 15, 4];
    skyline.forEach((block, index) => {
      const blockWidth = Math.ceil(width / skyline.length);
      pixelRect(index * blockWidth, horizon - block, blockWidth - 1, block, index % 5 === 0 ? palette.green : palette.night, .8);
    });
    pixelRect(width * .08, horizon - 28, 2, 24, palette.gold, .5);
    pixelRect(width * .075, horizon - 30, 4, 2, palette.gold, .7);
    pixelRect(width * .87, horizon - 20, 2, 16, palette.teal, .45);

    const unit = Math.max(2, Math.floor(Math.min(width, height) / 42));
    drawKiro(width * .32, height * .49, unit, time);

    particles.forEach(particle => {
      pixelRect(particle.x, particle.y, particle.size, particle.size, particle.color, Math.max(0, particle.life));
      if (!still && !reducedMotion.matches) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += .018;
        particle.life -= .018;
      }
    });
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      if (particles[index].life <= 0) particles.splice(index, 1);
    }

    const elapsed = (time - burstTime) / 1000;
    if (elapsed >= 0 && elapsed < 1.6) {
      context.font = `${Math.max(5, Math.round(width / 48))}px Silkscreen, monospace`;
      context.textBaseline = 'top';
      fragments.forEach((label, index) => {
        const direction = index % 2 ? 1 : -1;
        const x = width * .32 + direction * (18 + elapsed * 28 + index * 4);
        const y = height * (.27 + index * .12);
        context.globalAlpha = Math.max(0, 1 - elapsed / 1.6);
        context.fillStyle = index === 0 ? palette.gold : palette.cream;
        context.fillText(label, x, y);
      });
      context.globalAlpha = 1;
    }
  }

  function draw(time, still = false) {
    drawWorld(time, still);
  }

  function loop(time) {
    if (!visible || document.hidden || reducedMotion.matches) { frame = 0; return; }
    if (!lastTime || time - lastTime > 32) {
      draw(time);
      lastTime = time;
    }
    frame = requestAnimationFrame(loop);
  }

  function resume() {
    if (!frame && visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(loop);
    else if (reducedMotion.matches) draw(performance.now(), true);
  }

  function burst() {
    burstTime = performance.now();
    const width = canvas.width;
    const height = canvas.height;
    for (let index = 0; index < 42; index += 1) {
      const angle = (Math.PI * 2 * index) / 42;
      const speed = .35 + (index % 7) * .08;
      particles.push({
        x: width * .32, y: height * .49,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        size: 1 + index % 2, life: 1,
        color: index % 4 ? palette.gold : palette.cream
      });
    }
    stage.classList.remove('is-transmitting');
    void stage.offsetWidth;
    stage.classList.add('is-transmitting');
    window.setTimeout(() => stage.classList.remove('is-transmitting'), 700);
    draw(performance.now(), reducedMotion.matches);
    resume();
  }

  const hero = stage.closest('.hero') || stage;
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const box = hero.getBoundingClientRect();
    pointer = { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height, active: true };
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  activate.addEventListener('click', burst);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: .05 }).observe(stage);

  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', () => { if (frame) cancelAnimationFrame(frame); frame = 0; resume(); });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  resume();
})();
