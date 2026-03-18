/* ============================================================
   MAIN.JS — Fitness Garage
   Handles: navbar, mobile menu, smooth scroll, reveal,
            counters, footer year, card interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll sticky ── */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('stuck', window.scrollY > 44);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger / drawer ── */
  var ham     = document.getElementById('ham');
  var mobMenu = document.getElementById('mobMenu');

  ham.addEventListener('click', function () {
    var isOpen = mobMenu.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    ham.setAttribute('aria-expanded', isOpen);
  });

  mobMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        mobMenu.classList.remove('open');
        ham.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(function () {
          var el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  });

  /* ── Smooth scroll all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Scroll reveal (IntersectionObserver) ── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('vis');
        revObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.rev').forEach(function (el, i) {
    // Stagger delay within parent groups
    var parent = el.parentElement;
    var siblings = Array.from(parent.querySelectorAll('.rev'));
    var idx = siblings.indexOf(el);
    el.style.transitionDelay = Math.min(idx * 0.07, 0.42) + 's';
    revObs.observe(el);
  });

  /* ── Animated counters ── */
  function runCounter(el) {
    var raw    = el.getAttribute('data-count');
    var target = parseInt(raw.replace(/\D/g, ''), 10);
    var suffix = raw.replace(/[0-9]/g, '');
    var dur    = 1500;
    var start  = null;
    function ease(t) { return t < .5 ? 2*t*t : -1+(4-2*t)*t; }
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(frame);
  }

  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { runCounter(en.target); cntObs.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cntObs.observe(el); });

  /* ── Footer year ── */
  var yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  /* ── Subtle card tilt on program cards ── */
  document.querySelectorAll('.pc').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -3;
      var ry = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 3;
      card.style.transform = 'translateY(-3px) perspective(500px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Active nav on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('#nav .nav-ul a');
  function setActiveNav() {
    var pos = window.scrollY + 90;
    sections.forEach(function (sec) {
      var top = sec.offsetTop, bot = top + sec.offsetHeight;
      var id  = '#' + sec.id;
      if (pos >= top && pos < bot) {
        navLinks.forEach(function (a) {
          a.style.color = a.getAttribute('href') === id ? 'var(--white)' : '';
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

})();
