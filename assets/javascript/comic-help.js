(() => {
  const communication = document.querySelector('[data-communication]');

  if (communication) {
    let storyObserver = null;
    communication.addEventListener('communication:story-resolved', () => storyObserver?.disconnect());
    communication.addEventListener('communication:story-replay-end', () => {
      if (communication.classList.contains('is-story-resolved')) storyObserver?.disconnect();
    });
    if ('IntersectionObserver' in window) {
      storyObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        if (communication.dataset.replayStory === 'active') return;
        if (communication.classList.contains('is-story-resolved')) {
          storyObserver.disconnect();
          return;
        }
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
