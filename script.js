/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== HERO COUNTER ANIMATION ===== */
function animateCounter(el, target, duration = 1800) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const isLarge = target >= 1000;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);

    if (isLarge) {
      el.textContent = prefix + value.toLocaleString() + suffix;
    } else {
      el.textContent = prefix + value + suffix;
    }

    if (progress < 1) requestAnimationFrame(tick);
    else {
      if (isLarge) {
        el.textContent = prefix + target.toLocaleString() + suffix;
      } else {
        el.textContent = prefix + target + suffix;
      }
    }
  };
  requestAnimationFrame(tick);
}

/* ===== INTERSECTION OBSERVER FOR COUNTERS ===== */
const heroStats = document.querySelectorAll('.hero-stat-num[data-target]');
let heroCounterDone = false;

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !heroCounterDone) {
      heroCounterDone = true;
      heroStats.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
    }
  });
}, { threshold: 0.5 });

heroStats.forEach(el => heroObserver.observe(el));

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(
  '.service-card, .result-card, .brand-card, .process-step, .about-card, .about-text'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60 * (Array.from(revealElements).indexOf(entry.target) % 6));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--text)';
    }
  });
});

/* ===== CURSOR GLOW (desktop only) ===== */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
