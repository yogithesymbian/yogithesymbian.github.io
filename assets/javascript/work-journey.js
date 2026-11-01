const stops = [
  { name: 'Japan', point: [138, 37], type: 'Enterprise collaboration', title: 'Modernizing an established system', copy: 'Contributed to bringing a 20-year-old desktop system to the web, translating 200+ UI designs and supporting its Oracle → MySQL → Oracle 12c database path.', note: 'Confidential client · Laravel / Vue.js', href: '#work', link: 'View selected work' },
  { name: 'Poland', point: [19, 52], type: 'Client collaboration', title: 'A gallery with room to manage', copy: 'Delivered Kulsummarssy, a client-facing gallery and administration platform for a client in Poland.', note: 'React / Ant Design / Lumen / MySQL' },
  { name: 'Australia', point: [134, -25], type: 'Recruitment platform', title: 'Connecting people with opportunities', copy: 'Worked on Casual Chase, an Australian recruitment platform with job discovery and subscription payment integration.', note: 'Laravel / Alpine.js / Payment API' },
  { name: 'India', point: [79, 22], type: 'Client collaboration', title: 'Small projects, lasting lessons', copy: 'Helped an Indian client migrate an Android Studio SDK. Clear communication and professional collaboration made this a memorable engagement.', note: 'Android tooling · Independent collaboration', href: 'writing/the-real-contract-pengalaman-berkesan.html', link: 'Read the collaboration story' },
  { name: 'Indonesia', point: [118, -3], type: 'Regional chapter', title: 'Building closer to home', copy: 'From web and mobile products to operational systems, this chapter brings the journey back to Indonesia—and closer to Kalimantan.', note: 'Products / Systems / Local connections', href: '#work', link: 'Explore selected work' },
  { name: 'Balikpapan', point: [116.83, -1.24], type: 'Based here', title: 'A base in East Kalimantan', copy: 'Balikpapan is my base as a software engineer, working with teams in Indonesia and abroad.', note: 'East Kalimantan / Indonesia', href: '#contact', link: 'Start a conversation' },
  { name: 'Samarinda', point: [117.15, -.50], type: 'Education platform', title: 'Software for academic workflows', copy: 'Built a web-based thesis management system for Universitas 17 Agustus 1945 Samarinda. The city is also part of my education story at Politeknik Negeri Samarinda.', note: 'React / Ant Design / Lumen / MySQL' }
];
let land, countries;
export async function prepare() {
  if (land && countries) return;
  const read = async file => {
    const response = await fetch(new URL(`../journey/${file}`, import.meta.url));
    if (!response.ok) throw new Error('Map unavailable');
    return response.json();
  };
  const data = await Promise.all([read('land.json'), read('countries.json')]);
  [land, countries] = data;
}
export function createJourney(dialog) {
  const root = dialog.querySelector('.journey-experience');
  root.innerHTML = `<div class="journey-body"><div class="journey-map-wrap"><div class="journey-map-caption"><span>PROJECTS & CONNECTIONS</span><span class="journey-scale">WORLD VIEW</span></div><canvas class="journey-map" aria-hidden="true"></canvas><div class="journey-zoom"><button type="button" data-action="zoom-in" aria-label="Zoom in">+</button><button type="button" data-action="zoom-out" aria-label="Zoom out">−</button><button type="button" data-action="reset">Reset view</button></div><p class="journey-map-hint">Drag to explore · scroll to zoom<br>Routes represent collaborations, not physical travel.</p></div><section class="journey-story" aria-label="Location story" tabindex="0"><p class="journey-count"></p><p class="journey-type"></p><h3></h3><h4></h4><p class="journey-copy"></p><p class="journey-note"></p><a class="journey-project"></a></section></div><nav class="journey-stops" aria-label="Journey locations">${stops.map((s,i)=>`<button type="button" data-stop="${i}"><span>0${i+1}</span>${s.name}</button>`).join('')}</nav><footer class="journey-footer"><div class="journey-playback"><button type="button" data-action="previous" aria-label="Previous location">← Previous</button><button type="button" data-action="play">Pause</button><button type="button" data-action="next" aria-label="Next location">Next →</button><button type="button" data-action="skip">Skip tour</button><button type="button" data-action="replay" hidden>Replay</button></div><span class="journey-state" role="status" aria-live="polite"></span><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener noreferrer">Map: Natural Earth ↗</a></footer>`;
  const $ = selector => root.querySelector(selector);
  const canvas = $('.journey-map'), ctx = canvas.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, active = false, started = false, playing = false, finished = false;
  let frame = 0, timer = 0, transition = null, drag = null, pulseStart = 0;
  const pointers = new Map();
  let pinch = null;
  let view = { x: 20, y: 12, span: 340 }, width = 800, height = 450;
  const pixel = document.createElement('canvas'), pctx = pixel.getContext('2d');
  const project = ([lon,lat], v=view) => [(lon-v.x)*width/v.span+width/2,(v.y-lat)*width/v.span+height/2];
  const fit = i => i < 4 ? {x: 35, y: 14, span: 330} : i === 4 ? {x:118,y:-2,span:58} : {x:117,y:-.6,span: i===5 ? 14 : 4};
  // Relief has its own bounded scheduler; hovering never starts/interrupts the tour.
  const lifts = stops.map(() => 0);
  let hover = -1, reliefFrame = 0, reliefStart = 0, reliefFrom = [...lifts];
  let reliefTargets = [...lifts], reliefMasks = [];
  const markerPoint = i => {
    const [x, y] = project(stops[i].point);
    return [x, y - lifts[i]];
  };
  function stopRelief() {
    cancelAnimationFrame(reliefFrame);
    reliefFrame = 0;
  }
  function updateRelief(instant = false) {
    stopRelief();
    reliefFrom = [...lifts];
    reliefTargets = stops.map((_, i) => i === index ? 9 : i === hover ? 6 : 0);
    if (instant || motion.matches || !active || document.hidden) {
      lifts.splice(0, lifts.length, ...reliefTargets);
      draw();
      return;
    }
    if (lifts.every((v, i) => v === reliefTargets[i])) return;
    reliefStart = performance.now();
    const step = now => {
      reliefFrame = 0;
      if (!active || document.hidden) return;
      const t = Math.min(1, (now - reliefStart) / 180);
      const eased = 1 - (1 - t) ** 3;
      lifts.forEach((_, i) => { lifts[i] = reliefFrom[i] + (reliefTargets[i] - reliefFrom[i]) * eased; });
      draw(now);
      if (t < 1) reliefFrame = requestAnimationFrame(step);
    };
    reliefFrame = requestAnimationFrame(step);
  }
  function setHover(next) {
    if (hover === next) return;
    hover = next;
    canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab';
    updateRelief();
  }
  function cacheRelief() {
    reliefMasks = countries.map(polygons => {
      const mask = document.createElement('canvas');
      mask.width = pixel.width; mask.height = pixel.height;
      const c = mask.getContext('2d');
      if (!c) return null;
      const sx = pixel.width / width, sy = pixel.height / height;
      c.fillStyle = '#faf9f6';
      c.strokeStyle = '#62645f'; c.lineWidth = 1;
      for (const polygon of polygons) {
        c.beginPath();
        for (const ring of polygon) {
          ring.forEach((point, i) => {
            const [x, y] = project(point);
            if (i) c.lineTo(x * sx, y * sy); else c.moveTo(x * sx, y * sy);
          });
          c.closePath();
        }
        c.fill('evenodd'); c.stroke();
      }
      // Quantize antialiased polygon edges into actual solid pixel cells.
      const raster = c.getImageData(0, 0, mask.width, mask.height);
      for (let offset = 0; offset < raster.data.length; offset += 4) {
        if (raster.data[offset + 3] < 128) { raster.data[offset + 3] = 0; continue; }
        const light = raster.data[offset] > 180;
        raster.data[offset] = light ? 250 : 98;
        raster.data[offset + 1] = light ? 249 : 100;
        raster.data[offset + 2] = light ? 246 : 95;
        raster.data[offset + 3] = 255;
      }
      c.putImageData(raster, 0, 0);
      const tint = color => {
        const surface = document.createElement('canvas');
        surface.width = mask.width; surface.height = mask.height;
        const sc = surface.getContext('2d');
        if (!sc) return mask;
        sc.drawImage(mask, 0, 0);
        sc.globalCompositeOperation = 'source-in';
        sc.fillStyle = color; sc.fillRect(0, 0, surface.width, surface.height);
        return surface;
      };
      return { top: mask, side: tint('#62645f'), shadow: tint('#777e6d') };
    });
  }
  function drawRelief() {
    // Draw each footprint at native pixel scale, then extrude toward its raised top.
    lifts.forEach((lift, i) => {
      if (lift < .1 || (i > 4 && index < 5)) return;
      const h = Math.round(lift);
      if (i < 5) {
        const masks = reliefMasks[i];
        if (!masks) return;
        ctx.globalAlpha = .35;
        ctx.drawImage(masks.shadow, 4, 5, width, height);
        ctx.globalAlpha = 1;
        for (let y = 0; y < h; y += 2) ctx.drawImage(masks.side, 0, -y, width, height);
        ctx.drawImage(masks.top, 0, -h, width, height);
      } else {
        const [x, y] = project(stops[i].point);
        ctx.fillStyle = '#a4a89b'; ctx.fillRect(Math.round(x) - 8, Math.round(y) - 7, 24, 24);
        ctx.fillStyle = '#62645f'; ctx.fillRect(Math.round(x) - 12, Math.round(y) - 12 - h, 24, 24 + h);
        ctx.fillStyle = '#faf9f6'; ctx.fillRect(Math.round(x) - 11, Math.round(y) - 11 - h, 22, 22);
      }
    });
  }
  function inRing(point, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a[1] > point[1]) !== (b[1] > point[1]) &&
          point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  function hitAt(x, y) {
    // Prefer markers, especially city platforms within the Indonesian footprint.
    for (let i = stops.length - 1; i >= 0; i--) {
      if (i > 4 && index < 5) continue;
      const [mx, my] = markerPoint(i);
      if (Math.hypot(mx - x, my - y) < 22) return i;
    }
    if (index > 4) return -1;
    const lon = view.x + (x - width / 2) * view.span / width;
    for (let i = 0; i < countries.length; i++) {
      for (const offset of [0, lifts[i]]) {
        const point = [lon, view.y - (y + offset - height / 2) * view.span / width];
        if (countries[i].some(polygon => inRing(point, polygon[0]) && !polygon.slice(1).some(ring => inRing(point, ring)))) return i;
      }
    }
    return -1;
  }
  function pointerHit(event) {
    const r = canvas.getBoundingClientRect();
    return hitAt((event.clientX - r.left) * width / r.width, (event.clientY - r.top) * height / r.height);
  }
  function cancel() { cancelAnimationFrame(frame); clearTimeout(timer); frame=0; timer=0; }
  function controls() {
    $('[data-action="play"]').textContent = playing ? 'Pause' : 'Resume tour';
    $('[data-action="play"]').hidden = finished || motion.matches;
    $('[data-action="skip"]').hidden = finished || motion.matches;
    $('[data-action="replay"]').hidden = !finished && !motion.matches;
    $('[data-action="previous"]').disabled = index===0;
    $('[data-action="next"]').disabled = index===stops.length-1;
    $('.journey-state').textContent = `${motion.matches ? 'Manual exploration' : playing ? 'Playing' : finished ? 'Explore freely' : 'Paused'} · ${stops[index].name}`;
  }
  function story() {
    const s=stops[index];
    $('.journey-count').textContent=`CHAPTER 0${index+1} / 07`;
    $('.journey-type').textContent=s.type;
    $('.journey-story h3').textContent=s.name;
    $('.journey-story h4').textContent=s.title;
    $('.journey-copy').textContent=s.copy;
    $('.journey-note').textContent=s.note;
    const a=$('.journey-project');a.hidden=!s.href;
    if(s.href){a.href=s.href;a.textContent=s.link+' ↗';}
    root.querySelectorAll('[data-stop]').forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    $('.journey-scale').textContent=index<4?'WORLD VIEW':index===4?'INDONESIA':'EAST KALIMANTAN';
    controls();
  }
  function base() {
    if (!pctx) return;
    pixel.width=Math.max(1,Math.round(width/3));pixel.height=Math.max(1,Math.round(height/3));
    pctx.fillStyle='#eeede7';pctx.fillRect(0,0,pixel.width,pixel.height);
    pctx.fillStyle='#c5c7ba';
    for(const ring of land){pctx.beginPath();ring.forEach((p,i)=>{const [x,y]=project(p);if(i)pctx.lineTo(x/width*pixel.width,y/height*pixel.height);else pctx.moveTo(x/width*pixel.width,y/height*pixel.height);});pctx.closePath();pctx.fill();}
    cacheRelief();
  }
  function draw(now=performance.now()) {
    if(!ctx || !active) return;
    ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
    ctx.imageSmoothingEnabled=false;ctx.drawImage(pixel,0,0,width,height);
    ctx.strokeStyle='#d7d8cf';ctx.lineWidth=1;
    for(let x=0;x<width;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
    for(let y=0;y<height;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    drawRelief();
    ctx.strokeStyle='#777e6d';ctx.lineWidth=1.5;ctx.setLineDash([4,6]);
    for(let i=1;i<=index;i++){const a=markerPoint(i-1),b=markerPoint(i);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}ctx.setLineDash([]);
    stops.forEach((s,i)=>{
      if(i>4 && index<5)return;
      const [x,y]=markerPoint(i);if(x<0||x>width||y<0||y>height)return;
      ctx.fillStyle=i===index?'#20231f':'#62645f';ctx.fillRect(Math.round(x)-4,Math.round(y)-4,8,8);
      if(i===index){const pulse=playing&&!motion.matches&&now-pulseStart<2000?Math.sin((now-pulseStart)/1000*Math.PI*2)*3:0;const r=10+pulse;ctx.strokeStyle='#20231f';ctx.lineWidth=2;ctx.strokeRect(Math.round(x-r),Math.round(y-r),r*2,r*2);}
      ctx.font='bold 11px monospace';const label=s.name.toUpperCase();let lx=x+14;const lw=ctx.measureText(label).width;if(lx+lw>width-8)lx=x-lw-14;const ly=i===5?y+22:y-14;
      ctx.fillStyle='#faf9f6';ctx.fillRect(lx-4,ly-12,lw+8,18);ctx.fillStyle='#20231f';ctx.fillText(label,lx,ly);
    });
    if(transition&&index>0){
      const t=Math.min(1,(now-transition.start)/1200),a=stops[transition.from].point,b=stops[index].point;
      const [x,y]=project([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);
      ctx.save();ctx.translate(Math.round(x),Math.round(y - lifts[transition.from] * (1-t) - lifts[index] * t));ctx.fillStyle='#20231f';
      if(index<5){ctx.rotate(Math.atan2(-(b[1]-a[1]),b[0]-a[0]));const rows=['000100000','000110000','111111111','000110000','000100000'];rows.forEach((r,yy)=>[...r].forEach((c,xx)=>{if(c==='1')ctx.fillRect((xx-4)*3,(yy-2)*3,3,3);}));}
      else ctx.fillRect(-5,-5,10,10);ctx.restore();
    }
  }
  function tick(now) {
    frame=0;if(!active||!playing)return;
    if(transition){const t=Math.min(1,(now-transition.start)/1200),e=t*t*(3-2*t);for(const k of ['x','y','span'])view[k]=transition.view[k]+(transition.target[k]-transition.view[k])*e;base();if(t===1)transition=null;}
    draw(now);if(transition||now-pulseStart<2000)frame=requestAnimationFrame(tick);
  }
  function schedule() {
    if(!playing||!active)return;
    pulseStart=performance.now();frame=requestAnimationFrame(tick);
    timer=setTimeout(()=>{timer=0;if(index===stops.length-1){playing=false;finished=true;cancel();controls();draw();}else select(index+1,true);},11000);
  }
  function pause() {
    if(!playing)return;
    playing=false;cancel();transition=null;controls();draw();
  }
  function select(i,auto=false) {
    const from=index;if(!auto)pause();cancel();index=Math.max(0,Math.min(stops.length-1,i));
    const target=fit(index);
    if(auto&&!motion.matches&&active){transition={from,view:{...view},target,start:performance.now()};}
    else {transition=null;view=target;base();}
    hover=-1;canvas.style.cursor='grab';updateRelief();story();draw();if(playing)schedule();
  }
  function resume() {if(motion.matches||!active||document.hidden)return;playing=true;finished=false;controls();schedule();}
  function resize(){if(!active)return;const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);base();draw();}
  function zoom(factor,x=width/2,y=height/2){pause();setHover(-1);const span=Math.max(1.8,Math.min(380,view.span*factor));view.x+=(x-width/2)*(view.span-span)/width;view.y-=(y-height/2)*(view.span-span)/width;view.span=span;base();draw();}
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.stop!==undefined){select(Number(b.dataset.stop));return;}
    switch(b.dataset.action){
      case 'previous':select(index-1);break;
      case 'next':select(index+1);break;
      case 'play':playing?pause():resume();break;
      case 'skip':pause();finished=true;controls();break;
      case 'replay':pause();finished=false;select(0);resume();break;
      case 'reset':pause();view=fit(index);base();draw();break;
      case 'zoom-in':zoom(.75);break;
      case 'zoom-out':zoom(1.3);break;
    }
  });
  $('.journey-story').addEventListener('pointerdown',pause);
  $('.journey-story').addEventListener('focusin',pause);
  $('.journey-story').addEventListener('wheel',pause,{passive:true});
  $('.journey-story').addEventListener('touchstart',pause,{passive:true});
  $('.journey-project').addEventListener('click',()=>{pause();dialog.close();});
  canvas.addEventListener('wheel',e=>{e.preventDefault();const r=canvas.getBoundingClientRect();zoom(e.deltaY>0?1.15:.87,e.clientX-r.left,e.clientY-r.top);},{passive:false});
  canvas.addEventListener('pointerdown',e=>{pause();setHover(-1);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={distance:Math.hypot(a[0]-b[0],a[1]-b[1]),span:view.span};drag=null;canvas.setPointerCapture(e.pointerId);return;}drag={id:e.pointerId,x:e.clientX,y:e.clientY,view:{...view},moved:false};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId))pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pinch&&pointers.size===2){const [a,b]=[...pointers.values()];const distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(distance>0){const r=canvas.getBoundingClientRect();zoom((pinch.span*pinch.distance/distance)/view.span,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);}return;}if(!drag||e.pointerId!==drag.id){if(e.pointerType!=='touch')setHover(pointerHit(e));return;}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved ||= Math.hypot(dx,dy)>4;view.x=drag.view.x-dx*view.span/width;view.y=Math.max(-85,Math.min(85,drag.view.y+dy*view.span/width));base();draw();});
  canvas.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(pinch){pinch=null;drag=null;return;}if(!drag||e.pointerId!==drag.id)return;if(!drag.moved){const hit=pointerHit(e);if(hit>=0)select(hit);}drag=null;});
  canvas.addEventListener('pointerleave',()=>setHover(-1));
  canvas.addEventListener('pointercancel',e=>{setHover(-1);pointers.delete(e.pointerId);pinch=null;drag=null;});
  const visibility=()=>{if(document.hidden){pause();hover=-1;updateRelief(true);}};
  const reduced=()=>{if(motion.matches){pause();hover=-1;updateRelief(true);view=fit(index);base();draw();}controls();};
  const observer=new ResizeObserver(resize);
  return {
    open(){active=true;root.hidden=false;document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',reduced);observer.observe(canvas);resize();updateRelief(true);story();if(!started){started=true;select(0);resume();}controls();const focus=playing?$('[data-action="play"]'):$('.journey-story');focus.focus({preventScroll:true});},
    close(){pause();active=false;hover=-1;updateRelief(true);cancel();transition=null;drag=null;pinch=null;pointers.clear();observer.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',reduced);}
  };
}
