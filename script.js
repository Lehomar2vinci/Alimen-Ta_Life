const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  revealObserver.observe(el);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || prefersReducedMotion) return;

      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("fr-BE");

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll("[data-count]").forEach((el) => {
  counterObserver.observe(el);
});

const cursor = document.querySelector(".cursor-ball");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ballX = mouseX;
let ballY = mouseY;

if (!prefersReducedMotion && cursor) {
  window.addEventListener("pointermove", (event) => {
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

const stickersLayer = document.querySelector(".stickers-layer");

const tinyThings = ["🥬", "🥕", "🍅", "🌱", "🥖", "🍎", "🤝", "🚲"];

function spawnSticker(x, y) {
  if (prefersReducedMotion || !stickersLayer) return;

  const sticker = document.createElement("div");

  sticker.textContent =
    tinyThings[Math.floor(Math.random() * tinyThings.length)];
  sticker.style.position = "fixed";
  sticker.style.left = `${x}px`;
  sticker.style.top = `${y}px`;
  sticker.style.fontSize = `${18 + Math.random() * 18}px`;
  sticker.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 80 - 40}deg)`;
  sticker.style.filter = "drop-shadow(0 4px 0 rgba(43,25,79,.18))";
  sticker.style.animation = "stickerPop .9s ease forwards";

  stickersLayer.appendChild(sticker);

  setTimeout(() => {
    sticker.remove();
  }, 950);
}

document.querySelectorAll(".button, .card, .sticker").forEach((el) => {
  el.addEventListener("mouseenter", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    spawnSticker(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

function confettiBurst(amount = 28) {
  if (prefersReducedMotion) return;

  const colors = ["#ff4fb8", "#ff9b24", "#37c871", "#35b6ff", "#ffe347"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty(
      "--c",
      colors[Math.floor(Math.random() * colors.length)],
    );
    piece.style.setProperty("--d", `${1.9 + Math.random() * 1.9}s`);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4000);
  }
}

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    confettiBurst(18);
  });
});

setInterval(() => {
  if (document.visibilityState === "visible") {
    confettiBurst(8);
  }
}, 9000);

const bubbleLines = [
  "“Je suis une patate sociale.”",
  "“Un panier local par jour éloigne le supermarché flou.”",
  "“Attention : ce site peut provoquer une envie de légumes.”",
  "“Le chou sait. Le chou voit. Le chou distribue.”",
  "“Clique doucement, les carottes sont sensibles.”",
  "“La solidarité, mais avec plus de poireaux.”",
  "“On ne roule pas sur les gens. On roule avec eux.”",
  "“Cette boule contient 12% de betterave et 88% de motivation.”",
  "“Je roule donc nous sommes.”",
  "“La courgette est temporaire. Le réseau est éternel.”",
  "“Objectif du jour : absorber une réunion de quartier.”",
  "“Le panier n’est pas plein. Il est émotionnellement disponible.”",
];

const speechBubble = document.querySelector("#speechBubble");

if (speechBubble && !prefersReducedMotion) {
  let bubbleIndex = 0;

  setInterval(() => {
    if (document.body.classList.contains("cosmic-mode")) return;

    bubbleIndex = (bubbleIndex + 1) % bubbleLines.length;
    speechBubble.textContent = bubbleLines[bubbleIndex];
  }, 2600);
}

const chaosButton = document.querySelector("#chaosButton");

const jokeLines = [
  "PANIER CRITIQUE !",
  "UNE COURGETTE ENTRE DANS LE RÉSEAU",
  "LE BROCOLI APPROUVE",
  "MODE SALADE ACTIVÉ",
  "LES POIREAUX SONT EN FORMATION",
  "ATTENTION : TOMATE MOTIVÉE",
  "LA PATATE PREND LA PAROLE",
  "GASAP MAIS PAS TROP VITE",
  "ORBITATION DU NAVET",
  "LE CHOU A PRIS LE CONTRÔLE",
  "COLLISION SOLIDAIRE",
  "NIVEAU DE MIAM : INSTABLE",
];

const veggieRainItems = [
  "🥕",
  "🥬",
  "🍅",
  "🥔",
  "🥦",
  "🧅",
  "🍎",
  "🌽",
  "🥖",
  "🌱",
];

function showFloatingJoke() {
  const joke = document.createElement("div");
  joke.className = "floating-joke";
  joke.textContent = jokeLines[Math.floor(Math.random() * jokeLines.length)];

  document.body.appendChild(joke);

  setTimeout(() => {
    joke.remove();
  }, 1600);
}

function veggieRain(amount = 34) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < amount; i++) {
    const veg = document.createElement("div");

    veg.className = "veggie-rain";
    veg.textContent =
      veggieRainItems[Math.floor(Math.random() * veggieRainItems.length)];
    veg.style.left = `${Math.random() * 100}vw`;
    veg.style.setProperty("--fall-duration", `${1.8 + Math.random() * 2.2}s`);
    veg.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(veg);

    setTimeout(() => {
      veg.remove();
    }, 4500);
  }
}

if (chaosButton) {
  chaosButton.addEventListener("click", () => {
    document.body.classList.add("chaos-mode");

    confettiBurst(42);
    veggieRain(42);
    showFloatingJoke();

    setTimeout(() => {
      document.body.classList.remove("chaos-mode");
    }, 2600);
  });
}

document.querySelectorAll(".talking-veg").forEach((veg) => {
  veg.addEventListener("click", () => {
    veggieRain(16);
    showFloatingJoke();
  });
});

document.querySelectorAll(".stuck").forEach((item) => {
  item.addEventListener("click", () => {
    showFloatingJoke();
    confettiBurst(12);
  });
});

const cosmicButton = document.querySelector("#cosmicButton");
const meterFill = document.querySelector("#meterFill");
const meterLabel = document.querySelector("#meterLabel");

const meterLevels = [
  "12 cm de solidarité",
  "48 cm de carottes coordonnées",
  "1,2 m de paniers motivés",
  "3 m de voisinage croustillant",
  "8 m de circuits courts",
  "22 m de brocoli cosmique",
  "1 petite lune alimentaire",
  "PLANÈTE GASAP",
];

let meterValue = 12;
let meterIndex = 0;
let audioContext = null;

function growMeter(boost = 8) {
  if (!meterFill || !meterLabel) return;

  meterValue = Math.min(100, meterValue + boost);
  meterIndex = Math.min(
    meterLevels.length - 1,
    Math.floor((meterValue / 100) * meterLevels.length),
  );

  meterFill.style.width = `${meterValue}%`;
  meterLabel.textContent = meterLevels[meterIndex];

  if (meterValue >= 100) {
    showFloatingJoke();
    veggieRain(30);
    meterValue = 16;

    setTimeout(() => {
      meterFill.style.width = `${meterValue}%`;
      meterLabel.textContent = meterLevels[0];
    }, 1200);
  }
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playBoop(frequency = 440, duration = 0.08, type = "square") {
  if (prefersReducedMotion) return;

  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.02);
}

function showSoundPop(x, y, text = "boop") {
  const pop = document.createElement("div");
  pop.className = "sound-pop";
  pop.textContent = text;
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;

  document.body.appendChild(pop);

  setTimeout(() => {
    pop.remove();
  }, 850);
}

document.addEventListener("click", (event) => {
  const notes = [220, 247, 262, 330, 392, 440, 523, 659];
  const words = ["boop", "pouet", "tchac", "miam", "gling", "roule"];

  playBoop(notes[Math.floor(Math.random() * notes.length)], 0.075, "square");
  showSoundPop(
    event.clientX,
    event.clientY,
    words[Math.floor(Math.random() * words.length)],
  );

  growMeter(5);
});

document
  .querySelectorAll(".card, .step, .testimonial, .dream-card")
  .forEach((item) => {
    item.addEventListener("mouseenter", () => {
      growMeter(3);
    });
  });

if (cosmicButton) {
  cosmicButton.addEventListener("click", () => {
    document.body.classList.toggle("cosmic-mode");

    confettiBurst(50);
    veggieRain(36);
    showFloatingJoke();
    growMeter(25);

    playBoop(196, 0.08, "sawtooth");
    setTimeout(() => playBoop(247, 0.08, "sawtooth"), 80);
    setTimeout(() => playBoop(330, 0.1, "sawtooth"), 160);
    setTimeout(() => playBoop(523, 0.16, "triangle"), 260);
  });
}

const cosmicLines = [
  "“Le Grand Brocoli Cosmique exige plus de circuits courts.”",
  "“Votre boule est presque assez grande pour attraper une coopérative.”",
  "“Attention : orbite de poireau détectée.”",
  "“La galaxie des paniers vous observe gentiment.”",
  "“Un navet vient de rejoindre le collectif.”",
  "“La solidarité gravitationnelle augmente.”",
];

if (speechBubble) {
  setInterval(() => {
    if (!document.body.classList.contains("cosmic-mode")) return;

    speechBubble.textContent =
      cosmicLines[Math.floor(Math.random() * cosmicLines.length)];
  }, 2200);
}
