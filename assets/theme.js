(() => {
  if (!('IntersectionObserver' in window) || !window.matchMedia) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Set();
  const selector = '[data-reveal], .hero-copy';
  const show = (group) => {
    group.classList.remove('is-hiding');
    group.classList.add('is-shown');
    pending.delete(group);
    observer.unobserve(group);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) show(entry.target);
    });
  }, { threshold: 0.12 });

  const initialize = (root) => {
    if (motion.matches) return;
    document.documentElement.classList.add('motion-ready');
    const groups = [...root.querySelectorAll(selector)];
    if (root.matches?.(selector)) groups.unshift(root);
    groups.forEach((group) => {
      if (group.classList.contains('t-stagger')) return;
      group.classList.add('t-stagger');
      [...group.children].forEach((line, index) => {
        line.classList.add('t-stagger-line');
        line.style.transitionDelay = `calc(var(--stagger-stagger) * ${Math.min(index, 5)})`;
      });
      pending.add(group);
      observer.observe(group);
    });
  };

  initialize(document);
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
  document.addEventListener('shopify:section:unload', (event) => {
    [...pending].forEach((group) => {
      if (event.target.contains(group)) {
        observer.unobserve(group);
        pending.delete(group);
      }
    });
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      [...pending].forEach(show);
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    } else {
      initialize(document);
    }
  });
})();
