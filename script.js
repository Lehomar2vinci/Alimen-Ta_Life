const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const target = Number(el.dataset.count || 0);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('fr-BE');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

const cursor = document.querySelector('.cursor-ball');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ballX = mouseX;
let ballY = mouseY;

if (!prefersReducedMotion && cursor) {
  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function followCursor() {
    ballX += (mouseX - ballX) * 0.14;
    ballY += (mouseY - ballY) * 0.14;
    cursor.style.transform = `translate(${ballX - 26}px, ${ballY - 26}px) rotate(${ballX * 0.7}deg)`;
    requestAnimationFrame(followCursor);
  }

  followCursor();
}

const stickersLayer = document.querySelector('.stickers-layer');
const tinyThings = ['🥬', '🥕', '🍅', '🌱', '🥖', '🍎', '🤝', '🚲'];

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

document.querySelectorAll('.button, .card, .sticker').forEach((el) => {
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

setInterval(() => {
  if (document.visibilityState === 'visible') confettiBurst(8);
}, 9000);
