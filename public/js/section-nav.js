/**
 * Section Nav Scroll Spy
 *
 * For nav.nav-in-page: toggles .active on the link whose section is in view.
 * Only runs when a nav with class "nav-in-page" exists.
 *
 * Optional: data-offset="120" on the nav to override the trigger offset (px from top).
 */

(function() {
    'use strict';

    var nav = document.querySelector('nav.nav-in-page');
    if (!nav) return;

    var links = nav.querySelectorAll('a[href^="#"]');
    var sections = Array.from(links).map(function(a) {
        var id = a.getAttribute('href').slice(1);
        return { id: id, element: document.getElementById(id) };
    }).filter(function(s) { return s.element; });

    if (sections.length === 0) return;

    var offset = 120;
    var dataOffset = nav.getAttribute('data-offset');
    if (dataOffset !== null && dataOffset !== '') {
        var parsed = parseInt(dataOffset, 10);
        if (!isNaN(parsed)) offset = parsed;
    }

    function setActive() {
        var sortedByTop = sections.map(function(s) {
            return { id: s.id, top: s.element.getBoundingClientRect().top };
        });
        var passed = sortedByTop.filter(function(s) { return s.top <= offset; });
        var active = passed.length
            ? passed.sort(function(a, b) { return b.top - a.top; })[0]
            : sortedByTop.sort(function(a, b) { return a.top - b.top; })[0];
        var activeId = active ? active.id : null;
        links.forEach(function(a) {
            var id = a.getAttribute('href').slice(1);
            a.classList.toggle('active', id === activeId);
        });
    }

    window.addEventListener('scroll', setActive);
    setActive();
})();
