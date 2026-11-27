(() => {
  // Change mode to 'on' for a preview, 'off' to disable, or 'auto' for the season.
  const config = {
    mode: 'off',
    timeZone: 'Asia/Makassar',
    start: '11-11', // inclusive, month-day in the configured time zone
    end: '12-31' // inclusive
  };

  function dateInZone(date) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: config.timeZone,
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const get = type => parts.find(part => part.type === type)?.value;
    return `${get('month')}-${get('day')}`;
  }

  const today = dateInZone(new Date());
  const inSeason = config.start <= config.end
    ? today >= config.start && today <= config.end
    : today >= config.start || today <= config.end;
  const enabled = config.mode === 'on' || (config.mode === 'auto' && inSeason);
  if (!enabled) return;
  document.documentElement.dataset.season = 'christmas';
  const script = document.createElement('script');
  script.src = new URL('../assets/javascript/kiro-signal-world.js?v=20261126-distill-1', document.baseURI).href;
  script.defer = true;
  document.head.append(script);
})();
