// ===== CRYPTO SLIDESHOW =====
const slides = document.querySelectorAll('.crypto-slideshow .slide');
const dots = document.querySelectorAll('.slide-dots .dot');
let currentSlide = 0;

function goToSlide(n) {
  if(!slides.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
if (slides.length > 0) setInterval(() => goToSlide(currentSlide + 1), 3000);

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if(cursor) cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if(cursorFollower) cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor Hover Effects
document.querySelectorAll('a, button, .service-card, .project-card, .faq-q, .tool-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if(cursor) cursor.classList.add('cursor-hover');
    if(cursorFollower) cursorFollower.style.opacity = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    if(cursor) cursor.classList.remove('cursor-hover');
    if(cursorFollower) cursorFollower.style.opacity = '1';
  });
});

// ===== MAGNETIC BUTTONS =====
const magnetBtns = document.querySelectorAll('.nav-cta, .btn-gold, .btn-outline');
magnetBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});

// ===== 3D TILT EFFECT FOR CARDS =====
document.querySelectorAll('.project-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if(nav) {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// ===== HAMBURGER / MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if(hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

function closeMobile() {
  menuOpen = false;
  if(mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  if(hamburger) hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
if(typewriterEl) {
  const text = typewriterEl.textContent;
  typewriterEl.textContent = '';
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typewriterEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50); // Speed of typing
    }
  }
  setTimeout(typeWriter, 800); // Start delay
}

// ===== SCROLL REVEAL (Standard) =====
const revealEls = document.querySelectorAll('.reveal:not(.service-card):not(.project-card)');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== SCROLL REVEAL (Staggered for Grids) =====
document.querySelectorAll('.services-grid, .projects-grid').forEach(grid => {
  const cards = grid.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 120);
      });
      obs.disconnect();
    }
  }, { threshold: 0.15 });
  obs.observe(grid);
});

// ===== COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

// Easing function: easeOutQuart
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statNums.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000; // ms
      let startTimestamp = null;
      
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);
        
        el.textContent = current;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target; // Ensure exact final value
        }
      };
      window.requestAnimationFrame(step);
    });
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.getAttribute('data-width') + '%';
        }, i * 150);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-bars');
if (skillsSection) skillObserver.observe(skillsSection);

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = answer.classList.contains('open');
    // Close all
    faqItems.forEach(other => {
      other.querySelector('.faq-a').classList.remove('open');
      other.querySelector('.faq-q').classList.remove('active');
    });
    // Open clicked if was closed
    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('active');
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
  });
}

// ===== SMOOTH ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold)';
    }
  });
});

// ===== PARALLAX HERO ORBS =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.12}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.08}px)`;
});

// ===== TOOL TAG HOVER WAVE =====
const toolTags = document.querySelectorAll('.tool-tag');
toolTags.forEach((tag, i) => {
  tag.style.animationDelay = `${i * 0.05}s`;
});

// ===== DYNAMIC YEAR & LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
  
  const yearSpan = document.getElementById('year');
  if(yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

console.log('%c✦ Portfolio by Md. Tajul Islam (Raju)', 'color: #c9a84c; font-size: 14px; font-weight: bold;');
console.log('%cIT Professional · AI Specialist · Dhaka, Bangladesh', 'color: #b8b4a8; font-size: 11px;');
