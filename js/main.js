/* ========================================
   Digital Picto - Main JavaScript v2
   Particle color follows the --accent-rgb token in css/styles.css
   ======================================== */

(function () {
  'use strict';

  /* ----- Canvas Particle Network ----- */
  const canvas = document.getElementById('canvas-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles, mouse;

    // Read the brand color from the stylesheet so the particle network always
    // matches the palette; no color is hardcoded here.
    const accentRGB = (getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-rgb') || '224, 103, 63').trim();

    mouse = { x: null, y: null, radius: 160 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor((width * height) / 16000), 120);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 2 + 0.4,
          opacity: Math.random() * 0.13 + 0.04,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse repulsion
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += dx * force * 0.025;
            p.y += dy * force * 0.025;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + accentRGB + ', ' + p.opacity + ')';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = 0.03 * (1 - dist / 130);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + accentRGB + ', ' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ----- Navigation Scroll Effect ----- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  /* ----- Mobile Menu ----- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----- Scroll Reveal ----- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  if (revealEls.length > 0) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ----- Timeline Animation ----- */
  var timelines = document.querySelectorAll('.timeline');

  if (timelines.length > 0) {
    var tlObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.25 }
    );

    timelines.forEach(function (tl) { tlObs.observe(tl); });
  }

  /* ----- Counter Animation ----- */
  var counterEls = document.querySelectorAll('[data-counter]');

  if (counterEls.length > 0) {
    var counterObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) { counterObs.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2200;
    var startTime = performance.now();

    function update(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 4);
      var current = Math.floor(target * ease);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ----- Layer Card Toggle ----- */
  var layerCards = document.querySelectorAll('.layer-card');

  layerCards.forEach(function (card) {
    var header = card.querySelector('.layer-card-header');
    if (header) {
      header.addEventListener('click', function () {
        layerCards.forEach(function (other) {
          if (other !== card) other.classList.remove('open');
        });
        card.classList.toggle('open');
      });
    }
  });

  /* ----- Lead attribution -----------------------------------------
     Stores first-touch campaign data so an enquiry arrives with a source
     attached instead of appearing from nowhere. */
  var ATTR_KEY = 'dp_attribution';

  function captureAttribution() {
    var stored;
    try { stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || 'null'); } catch (err) { stored = null; }
    if (stored) return stored;

    var params = new URLSearchParams(window.location.search);
    var data = {
      utm_source:   params.get('utm_source')   || '',
      utm_medium:   params.get('utm_medium')   || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content:  params.get('utm_content')  || '',
      utm_term:     params.get('utm_term')     || '',
      gclid:        params.get('gclid')        || '',
      fbclid:       params.get('fbclid')       || '',
      referrer:     document.referrer || 'direct',
      landing_page: window.location.pathname,
      first_seen:   new Date().toISOString()
    };
    try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(data)); } catch (err) {}
    return data;
  }

  var attribution = captureAttribution();

  /* ----- Contact Form Validation ----- */
  var contactForm = document.getElementById('contact-form');

  function showFormError(msg) {
    if (!contactForm) return;
    var box = contactForm.querySelector('.form-status');
    if (!box) {
      box = document.createElement('p');
      box.className = 'form-status';
      box.setAttribute('role', 'alert');
      box.setAttribute('aria-live', 'assertive');
      contactForm.appendChild(box);
    }
    box.textContent = msg;
    box.classList.add('show');
  }

  function clearFormError() {
    if (!contactForm) return;
    var box = contactForm.querySelector('.form-status');
    if (box) { box.classList.remove('show'); box.textContent = ''; }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      clearFormError();
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('error');
      });

      var name = contactForm.querySelector('[name="name"]');
      var email = contactForm.querySelector('[name="email"]');
      var business = contactForm.querySelector('[name="business"]');
      var message = contactForm.querySelector('[name="message"]');

      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!business.value) {
        business.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!message.value.trim()) {
        message.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (!valid) {
        var firstBad = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
        if (firstBad) firstBad.focus();
        showFormError('Please check the highlighted fields and try again.');
      }

      if (valid) {
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <span class="arrow">&rarr;</span>';

        var formData = new FormData(contactForm);
        Object.keys(attribution).forEach(function (k) {
          if (attribution[k]) formData.append(k, attribution[k]);
        });
        formData.append('page_title', document.title);

        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(function (response) {
          if (response.ok) {
            contactForm.style.display = 'none';
            var successEl = document.querySelector('.form-success');
            if (successEl) successEl.classList.add('show');
          } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <span class="arrow">&rarr;</span>';
            showFormError('That didn\'t send. Please try again, or email us directly at Digitalpicto832@gmail.com');
          }
        }).catch(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="arrow">&rarr;</span>';
          showFormError('We couldn\'t reach the server. Check your connection and try again, or email Digitalpicto832@gmail.com');
        });
      }
    });
  }

  /* ----- FAQ Accordion ----- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          // Keep aria-expanded in step with the visual state; without this,
          // assistive tech is told every panel is closed.
          var q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ----- Keep collapsed FAQ answers out of the a11y tree ----- */
  faqItems.forEach(function (item) {
    var answer = item.querySelector('.faq-answer');
    var question = item.querySelector('.faq-question');
    if (!answer || !question) return;
    if (!answer.id) {
      answer.id = 'faq-answer-' + Math.random().toString(36).slice(2, 9);
    }
    question.setAttribute('aria-controls', answer.id);
    var sync = function () {
      answer.setAttribute('aria-hidden', item.classList.contains('open') ? 'false' : 'true');
    };
    sync();
    question.addEventListener('click', function () { setTimeout(sync, 0); });
  });


  /* ----- Blog category filter ----- */
  var filterChips = document.querySelectorAll('.filter-chip');
  if (filterChips.length) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.blog-card[data-cat]'));
    var status = document.getElementById('filter-status');

    function applyFilter(want) {
      var shown = 0;
      // Filtering changes layout after the reveal observer has run, so the
      // grid must be marked visible or the surviving cards stay at opacity 0.
      var grid = document.querySelector('.blog-grid');
      if (grid) grid.classList.add('visible');
      cards.forEach(function (card) {
        var match = (want === 'all' || card.getAttribute('data-cat') === want);
        card.hidden = !match;
        if (match) shown++;
      });
      if (status) {
        var chip = document.querySelector('.filter-chip[data-filter="' + want + '"]');
        var label = chip ? chip.firstChild.textContent.trim() : want;
        status.textContent = want === 'all'
          ? 'Showing all ' + shown + ' articles.'
          : 'Showing ' + shown + ' article' + (shown === 1 ? '' : 's') + ' in ' + label + '.';
      }
    }

    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        var want = chip.getAttribute('data-filter');
        applyFilter(want);
        var url = new URL(window.location);
        if (want === 'all') { url.searchParams.delete('topic'); }
        else { url.searchParams.set('topic', want); }
        window.history.replaceState({}, '', url);
      });
    });

    // deep link: /blog?topic=seo
    var initial = new URLSearchParams(window.location.search).get('topic');
    if (initial) {
      var target = document.querySelector('.filter-chip[data-filter="' + initial + '"]');
      if (target) target.click();
    }
  }

  /* ----- Active Nav Link -----
     URLs are extensionless, so compare resolved paths rather than filenames.
     A section link also stays active on its child pages (/blog on a post). */
  var here = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    var raw = link.getAttribute('href');
    if (!raw || /^(https?:|mailto:|tel:|#)/.test(raw)) return;
    var target;
    try { target = new URL(raw, window.location.href).pathname.replace(/\/+$/, '') || '/'; }
    catch (e) { return; }
    if (target === here || (target !== '/' && here.indexOf(target + '/') === 0)) {
      link.classList.add('active');
    }
  });
})();
