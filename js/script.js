/* =========================================================
   PIT Paving Services — Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  hamburger.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close menu when a nav link is clicked (mobile) */
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Mobile dropdown toggle for the Services menu */
  const dropToggles = document.querySelectorAll('.has-dropdown > .nav-link');
  dropToggles.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Active nav link highlighting ---------- */
  const sections = document.querySelectorAll('main section[id], section[id="home"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    if (section.id) spy.observe(section);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Quote form validation (if a quote form is present) ---------- */
  const form = document.getElementById('quoteForm');
  const successMsg = document.getElementById('formSuccess');

  if (form && successMsg) {
    function setFieldState(input, valid) {
      const group = input.closest('.form-group');
      input.classList.toggle('invalid', !valid);
      group.classList.toggle('has-error', !valid);
    }

    function validateField(input) {
      const value = input.value.trim();
      if (!input.hasAttribute('required')) return true;

      if (!value) { setFieldState(input, false); return false; }

      if (input.type === 'email') {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setFieldState(input, valid);
        return valid;
      }

      if (input.type === 'tel') {
        const digits = value.replace(/\D/g, '');
        const valid = digits.length >= 9;
        setFieldState(input, valid);
        return valid;
      }

      setFieldState(input, true);
      return true;
    }

    /* Live validation once a field has been touched */
    form.querySelectorAll('input[required]').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let allValid = true;
      form.querySelectorAll('input[required]').forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        const firstInvalid = form.querySelector('.has-error input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      successMsg.classList.add('show');
      form.reset();
      form.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('has-error');
        g.querySelectorAll('input').forEach(function (i) { i.classList.remove('invalid'); });
      });
      setTimeout(function () { successMsg.classList.remove('show'); }, 8000);
    });
  }

  /* ---------- Video gallery (auto-playing) ---------- */
  const videoFiles = [
    'VID-20260505-WA0007.mp4',
    'VID-20260506-WA0000.mp4',
    'InShot_20260318_191018525.mp4',
    'InShot_20260326_172147168.mp4',
    'VID-20260522-WA0007.mp4'
  ];

  const videoPlayer = document.getElementById('videoPlayer');
  const videoCount = document.getElementById('videoCount');
  const videosNavLink = document.querySelector('a[href="#videos"]');
  const videosSection = document.getElementById('videos');
  let videoIndex = 0;

  function loadVideo(index) {
    videoIndex = (index + videoFiles.length) % videoFiles.length;
    videoPlayer.src = videoFiles[videoIndex];
    videoPlayer.load();
    if (videoCount) {
      videoCount.innerHTML = '<i class="fa-solid fa-circle-play"></i>Video ' + (videoIndex + 1) + ' of ' + videoFiles.length;
    }
  }

  function playVideo(index) {
    loadVideo(index);
    const attemptPlay = function () {
      const promise = videoPlayer.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          videoPlayer.muted = true;
          videoPlayer.play();
        });
      }
    };
    attemptPlay();
  }

  if (videoPlayer && videoFiles.length) {
    loadVideo(0);

    videoPlayer.addEventListener('ended', function () {
      playVideo(videoIndex + 1);
    });

    /* Pause the video when the Videos section is not on screen */
    const videosObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          videoPlayer.pause();
        }
      });
    }, { threshold: 0.15 });

    if (videosSection) {
      videosObserver.observe(videosSection);
    }
  }

  if (videosNavLink) {
    videosNavLink.addEventListener('click', function () {
      playVideo(0);
    });
  }

  /* ---------- Smooth scroll offset for anchored links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
});
