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

// Keep the hero map's regional hover language consistent with the full journey map.
(() => {
  const canvas = document.querySelector('.hero-map-relief');
  if (!canvas) return;
  const interaction = canvas.closest('.hero');
  const ctx = canvas.getContext('2d');
  const pixel = document.createElement('canvas');
  const pctx = pixel.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let countries = [], hover = -1, lift = 0, target = 0, frame = 0;
  const project = ([lon, lat]) => [(lon + 180) / 360 * canvas.clientWidth, (90 - lat) / 180 * canvas.clientHeight];
  const pathCountry = (country, offset = 0) => {
    ctx.beginPath();
    country.forEach(polygon => polygon.forEach(ring => ring.forEach((point, i) => {
      const [x, y] = project(point);
      if (i) ctx.lineTo(x, y - offset); else ctx.moveTo(x, y - offset);
    })));
    ctx.closePath();
  };
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hover < 0 || !countries[hover]) return;
    const scale = canvas.width / canvas.clientWidth;
    const pixelScale = 3;
    pixel.width = Math.max(1, Math.round(canvas.clientWidth / pixelScale));
    pixel.height = Math.max(1, Math.round(canvas.clientHeight / pixelScale));
    pctx.clearRect(0, 0, pixel.width, pixel.height);
    const country = countries[hover];
    const drawMask = (target, color, offset = 0) => {
      // Reuse the exact polygon geometry, but rasterize it at a low pixel grid.
      country.forEach(polygon => polygon.forEach(ring => ring.forEach((point, i) => {
        const [x, y] = project(point);
        if (i) target.lineTo(x / pixelScale, y / pixelScale - offset / pixelScale);
        else target.moveTo(x / pixelScale, y / pixelScale - offset / pixelScale);
      })));
      target.closePath();
      target.fillStyle = color; target.fill();

    };
    pctx.beginPath(); drawMask(pctx, '#62645f', 0);
    ctx.save(); ctx.scale(scale, scale); ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = .35; ctx.drawImage(pixel, 4, 5, canvas.clientWidth, canvas.clientHeight);
    ctx.globalAlpha = 1;
    for (let y = 0; y < lift; y += 2) { ctx.drawImage(pixel, 0, -y, canvas.clientWidth, canvas.clientHeight); }
    pctx.globalCompositeOperation = 'source-in'; pctx.fillStyle = '#faf9f6'; pctx.fillRect(0, 0, pixel.width, pixel.height); pctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(pixel, 0, -lift, canvas.clientWidth, canvas.clientHeight);
    ctx.restore();
  };
  const animate = () => {
    cancelAnimationFrame(frame);
    if (reduce.matches) { lift = target; draw(); return; }
    const start = lift, began = performance.now();
    const step = now => { const t = Math.min(1, (now - began) / 180); lift = start + (target - start) * (1 - (1 - t) ** 3); draw(); if (t < 1) frame = requestAnimationFrame(step); };
    frame = requestAnimationFrame(step);
  };
  const hit = event => {
    const x = (event.clientX - canvas.getBoundingClientRect().left) / canvas.clientWidth * 360 - 180;
    const y = 90 - (event.clientY - canvas.getBoundingClientRect().top) / canvas.clientHeight * 180;
    const inside = (point, ring) => { let yes = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const a = ring[i], b = ring[j]; if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) yes = !yes; } return yes; };
    return countries.findIndex(country => country.some(polygon => inside([x, y], polygon[0])));
  };
  const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr); draw(); };
  const loaderScript = [...document.scripts].find(script => script.src.includes('hero-flight.js'));
  const assetUrl = file => new URL(`../journey/${file}`, loaderScript?.src || document.baseURI).href;
  fetch(assetUrl('hero-countries.json')).then(response => response.json()).then(data => { countries = data; resize(); });
  interaction?.addEventListener('pointermove', event => { const next = hit(event); if (next === hover) return; hover = next; target = hover >= 0 ? 14 : 0; animate(); });
  interaction?.addEventListener('pointerleave', () => { hover = -1; target = 0; animate(); });
  addEventListener('resize', resize, { passive: true });
  reduce.addEventListener('change', () => { target = hover >= 0 ? 14 : 0; animate(); });
})();