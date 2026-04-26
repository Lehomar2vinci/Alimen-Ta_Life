const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DONATION_URL = 'https://streamlabscharity.com/teams/@alimenta-life/alimenta-life?member=365832684456513536';

// Valeurs statiques éditables pour la jauge de soutien.
const campaign = {
  raised: 650,
  goal: 2500,
};

function animateNumber(element, target, duration = 1200) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString('fr-BE');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  revealObserver.observe(el);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || prefersReducedMotion) return;
    const el = entry.target;
    animateNumber(el, Number(el.dataset.count || 0), 1400);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

function initDonationProgress() {
  const raisedEl = document.querySelector('[data-raised]');
  const goalEl = document.querySelector('[data-goal]');
  const percentEl = document.querySelector('[data-progress-percent]');
  const fillEl = document.querySelector('[data-progress-fill]');
  if (!raisedEl || !goalEl || !percentEl || !fillEl) return;

  const percent = campaign.goal > 0 ? Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100) : 0;
  goalEl.textContent = campaign.goal.toLocaleString('fr-BE');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (prefersReducedMotion) {
        raisedEl.textContent = campaign.raised.toLocaleString('fr-BE');
        percentEl.textContent = percent;
      } else {
        animateNumber(raisedEl, campaign.raised, 1350);
        animateNumber(percentEl, percent, 1350);
      }
      requestAnimationFrame(() => { fillEl.style.width = `${percent}%`; });
      progressObserver.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  progressObserver.observe(fillEl);
}
initDonationProgress();

const cursor = document.querySelector('.cursor-ball');
let mouseX = innerWidth / 2, mouseY = innerHeight / 2, ballX = mouseX, ballY = mouseY;
if (!prefersReducedMotion && cursor) {
  addEventListener('pointermove', (event) => { mouseX = event.clientX; mouseY = event.clientY; });
  function followCursor() {
    ballX += (mouseX - ballX) * 0.14;
    ballY += (mouseY - ballY) * 0.14;
    cursor.style.transform = `translate(${ballX - 26}px, ${ballY - 26}px) rotate(${ballX * 0.7}deg)`;
    requestAnimationFrame(followCursor);
  }
  followCursor();
}

const stickersLayer = document.querySelector('.stickers-layer');
const tinyThings = ['🥬', '🥕', '🍅', '🌱', '🥖', '🍎', '🤝', '🚲', '💚', '✨'];
function spawnSticker(x, y) {
  if (prefersReducedMotion || !stickersLayer) return;
  const sticker = document.createElement('div');
  sticker.textContent = tinyThings[Math.floor(Math.random() * tinyThings.length)];
  sticker.style.position = 'fixed';
  sticker.style.left = `${x}px`;
  sticker.style.top = `${y}px`;
  sticker.style.fontSize = `${18 + Math.random() * 18}px`;
  sticker.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 80 - 40}deg)`;
  sticker.style.filter = 'drop-shadow(0 4px 0 rgba(43,25,79,.18))';
  sticker.style.animation = 'stickerPop .9s ease forwards';
  stickersLayer.appendChild(sticker);
  setTimeout(() => sticker.remove(), 950);
}

document.querySelectorAll('.button, .card, .sticker, .donation-card').forEach((el) => {
  el.addEventListener('mouseenter', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    spawnSticker(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

function confettiBurst(amount = 28) {
  if (prefersReducedMotion) return;
  const colors = ['#ff4fb8', '#ff9b24', '#37c871', '#35b6ff', '#ffe347'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty('--d', `${1.9 + Math.random() * 1.9}s`);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => confettiBurst(18));
});

document.querySelectorAll('[data-donation-link]').forEach((link) => {
  link.addEventListener('click', () => confettiBurst(42));
});

const copyButton = document.querySelector('[data-copy-donation-link]');
const copyStatus = document.querySelector('[data-copy-status]');
if (copyButton && copyStatus) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(DONATION_URL);
      copyStatus.textContent = 'Lien de la campagne copié dans le presse-papiers.';
      confettiBurst(24);
    } catch {
      copyStatus.textContent = DONATION_URL;
    }
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', scrollY > 700);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    confettiBurst(16);
  });
}

document.querySelectorAll('.magnetic').forEach((element) => {
  if (prefersReducedMotion) return;
  element.addEventListener('mousemove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.translate = `${x * 0.08}px ${y * 0.08}px`;
  });
  element.addEventListener('mouseleave', () => { element.style.translate = '0 0'; });
});

setInterval(() => {
  if (document.visibilityState === 'visible') confettiBurst(8);
}, 9000);
