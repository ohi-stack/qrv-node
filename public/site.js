(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const groups = [...document.querySelectorAll('.nav-group')];
  const backToTop = document.querySelector('.back-to-top');

  const closeMenus = (except) => groups.forEach(group => {
    if (group !== except) group.removeAttribute('open');
  });

  menuButton?.addEventListener('click', () => {
    const open = header?.dataset.menuOpen !== 'true';
    if (header) header.dataset.menuOpen = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (!open) closeMenus();
  });

  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) closeMenus(group);
  }));

  document.addEventListener('pointerdown', event => {
    if (header && !header.contains(event.target)) closeMenus();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeMenus();
    if (header) header.dataset.menuOpen = 'false';
    menuButton?.setAttribute('aria-expanded', 'false');
  });

  document.querySelectorAll('.mega-menu a').forEach(link => link.addEventListener('click', () => {
    if (header) header.dataset.menuOpen = 'false';
    menuButton?.setAttribute('aria-expanded', 'false');
    closeMenus();
  }));

  const updateBackToTop = () => backToTop?.classList.toggle('visible', window.scrollY > 480);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
