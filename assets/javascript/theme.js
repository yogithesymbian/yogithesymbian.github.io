(() => {
  const root = document.documentElement;
  const key = 'yo-portfolio-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = window.localStorage.getItem(key); } catch {}
  let manual = saved === 'light' || saved === 'dark';

  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#151915' : '#faf9f6';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const next = theme === 'dark' ? 'Light' : 'Dark';
      button.setAttribute('aria-label', `Switch to ${next.toLowerCase()} mode`);
      button.dataset.activeTheme = theme;
    });
  }

  apply(manual ? saved : system.matches ? 'dark' : 'light');
  system.addEventListener('change', event => {
    if (!manual) apply(event.matches ? 'dark' : 'light');
  });

  function mount() {
    const header = document.querySelector('.site-nav, .blog-masthead');
    if (!header) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML = '<span class="theme-toggle-option theme-toggle-light" aria-hidden="true">Light</span><span class="theme-toggle-option theme-toggle-dark" aria-hidden="true">Dark</span>';
    const before = header.querySelector('.menu-toggle, .site-nav-links, .back-link');
    header.insertBefore(button, before);
    apply(root.dataset.theme);
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      manual = true;
      try { window.localStorage.setItem(key, next); } catch {}
      root.classList.add('is-theme-switching');
      apply(next);
      requestAnimationFrame(() => root.classList.remove('is-theme-switching'));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
