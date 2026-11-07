(() => {
  const communication = document.querySelector('[data-communication]');

  if (communication) {
    if ('IntersectionObserver' in window) {
      const storyObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        communication.classList.add('is-story-active');
        storyObserver.disconnect();
      }, { threshold: 0.35 });

      storyObserver.observe(communication);
    } else {
      communication.classList.add('is-story-active');
    }
  }

  document.querySelectorAll('.comic-help').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      button.setAttribute('aria-label', `${expanded ? 'Tampilkan' : 'Sembunyikan'} penjelasan`);
    });
  });
})();
