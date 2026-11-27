(() => {
  const launch = document.querySelector('.pixel-replay-launch');
  if (!launch) return;

  launch.hidden = false;
  let runtime;

  function loadRuntime() {
    if (runtime) return runtime;
    runtime = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('../assets/javascript/pixel-replay.js?v=20261128-i18n-paths-1', document.baseURI).href;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
    return runtime;
  }

  launch.addEventListener('click', async event => {
    if (launch.dataset.runtimeReady === 'true') return;
    event.preventDefault();
    try {
      await loadRuntime();
      launch.dataset.runtimeReady = 'true';
      launch.click();
    } catch {
      runtime = null;
    }
  });
})();
