/* =============================================
   PORTFOLIO — main.js
   Adapté à index.html (OUATTARA Kinon Marc)
   - Navbar scroll + active link
   - Menu burger mobile
   - Scroll reveal (IntersectionObserver)
   - Compteurs animés
   - Effet typage sur le titre hero
   - Parallaxe hero au scroll
   - Formulaire de contact
   - Bouton retour en haut
============================================= */

// ===== NAVBAR SCROLL =====
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
});

// ===== MENU BURGER MOBILE =====
const burger   = document.getElementById('burger');
const navLinks = document.querySelector('.navbar__links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans  = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Ferme le menu quand on clique sur un lien
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = 'none';
    });
  });
}

// ===== ACTIVE LINK AU SCROLL =====
const sections    = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.navbar__link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 160;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ===== COMPTEURS ANIMÉS =====
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.count, 10);
    let current  = 0;
    const step   = Math.max(1, target / 50);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + '+';
    }, 35);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ===== EFFET DE FRAPPE SUR LE NOM =====
const heroName = document.querySelector('.hero__name');
if (heroName) {
  // Sauvegarde le HTML (avec <br>) et l'extrait en texte pur + retour à la ligne
  const lines   = heroName.innerHTML.split('<br>').map(l => l.trim());
  heroName.innerHTML = '';
  heroName.style.borderRight = '3px solid var(--cyan)';
  heroName.style.whiteSpace  = 'pre-wrap';

  const fullText = lines.join('\n');
  let i = 0;

  function typeWriter() {
    if (i < fullText.length) {
      const char = fullText.charAt(i);
      heroName.textContent += char;
      i++;
      setTimeout(typeWriter, char === '\n' ? 300 : 45);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = 'none';
      }, 1000);
    }
  }

  // Démarre après le chargement de la page
  setTimeout(typeWriter, 600);
}

// ===== PARALLAXE HERO AU SCROLL =====
const heroVisual = document.querySelector('.hero__visual');
if (heroVisual) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < 900) {
      heroVisual.style.transform = `translateY(${window.scrollY * 0.07}px)`;
    }
  }, { passive: true });
}

// ===== BOUTON RETOUR EN HAUT =====
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FORMULAIRE DE CONTACT =====
const contactForm    = document.getElementById('contactForm');
const formFeedback   = document.getElementById('formFeedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll('input, textarea');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) valid = false;
    });

    if (valid) {
      // Simule un envoi (remplacer par une vraie API si besoin)
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Envoi en cours…';

      setTimeout(() => {
        formFeedback.textContent = '✅ Message envoyé ! Je vous répondrai très rapidement.';
        formFeedback.className   = 'contact__form-feedback success';
        inputs.forEach(input => (input.value = ''));
        btn.disabled    = false;
        btn.textContent = 'Envoyer le message';

        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className   = 'contact__form-feedback';
        }, 6000);
      }, 1200);

    } else {
      formFeedback.textContent = '⚠️ Veuillez remplir tous les champs.';
      formFeedback.className   = 'contact__form-feedback error';
    }
  });
}
