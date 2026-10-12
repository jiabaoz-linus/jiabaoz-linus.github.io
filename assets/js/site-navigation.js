(function () {
  'use strict';
  var sidebar = document.getElementById('site-sidebar');
  var toggle = document.getElementById('navigation-toggle');
  var backdrop = document.querySelector('.sidebar-backdrop');
  var main = document.getElementById('main');
  if (!sidebar || !toggle || !backdrop) return;

  var mobile = window.matchMedia('(max-width: 900px)');
  // PDF and external links do not represent sections in the current page.
  var links = Array.from(sidebar.querySelectorAll('.section-nav a[href^="#"]'));
  var sections = links.map(function (link) {
    return document.getElementById(link.hash.slice(1));
  });

  function setOpen(open, restoreFocus) {
    open = open && mobile.matches;
    document.body.classList.toggle('navigation-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    backdrop.hidden = !open;
    main.inert = open;
    if (open && links.length) {
      (sidebar.querySelector('[aria-current="location"]') || links[0]).focus({ preventScroll: true });
    } else if (restoreFocus) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true', true);
  });
  backdrop.addEventListener('click', function () { setOpen(false, true); });
  sidebar.addEventListener('click', function (event) {
    if (event.target.closest('a') && mobile.matches) setOpen(false, true);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  mobile.addEventListener('change', function () { setOpen(false); });

  var scheduled = false;
  function updateActive() {
    scheduled = false;
    var active = 0;
    var threshold = mobile.matches ? 110 : 100;
    sections.forEach(function (section, index) {
      if (section && section.getBoundingClientRect().top <= threshold) active = index;
    });
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = links.length - 1;
    links.forEach(function (link, index) {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateActive);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', updateActive);
  updateActive();
}());
