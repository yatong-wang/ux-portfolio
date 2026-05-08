/**
 * Case Study in-page rail
 *
 * Drives `.case-nav` (desktop dot rail + mobile FAB):
 *   - Scroll-spy via IntersectionObserver to mark the active section link.
 *   - Show/hide the rail after the user scrolls past the hero.
 *   - Toggle the mobile FAB list open/closed.
 *
 * No-op when `.case-nav` is absent, so it's safe to include site-wide.
 */
(function () {
  'use strict';

  var nav = document.querySelector('.case-nav');
  if (!nav) return;

  var links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var link = byId[e.target.id];
      if (!link) return;
      if (e.isIntersecting) link.dataset.visible = '1';
      else delete link.dataset.visible;
    });
    var firstVisible = links.find(function (a) { return a.dataset.visible === '1'; });
    links.forEach(function (a) { a.classList.toggle('is-active', a === firstVisible); });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
  sections.forEach(function (s) { io.observe(s); });

  function updateVisibility() {
    var scroll = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-visible', scroll > window.innerHeight);
  }
  var rafId = null;
  window.addEventListener('scroll', function () {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(function () {
      rafId = null;
      updateVisibility();
    });
  }, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  updateVisibility();

  var toggle = nav.querySelector('.case-nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var list = nav.querySelector('.case-nav__list');
  if (list) {
    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
