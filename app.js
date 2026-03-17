/* ===========================================
   DRE'S TASTY SOUTHERN CUISINES — JAVASCRIPT
   Enhanced Animation Edition
   =========================================== */

"use strict";

/* ─────────────────────────────────────────────
   LOADER
   ───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const fill   = document.getElementById("loaderFill");
  const tag    = document.getElementById("loaderTagline");

  const phrases = [
    "Loading something delicious…",
    "Stoking the hickory smoke…",
    "Marinating for 8 hours…",
    "Seasoned with Southern soul…",
    "Almost ready — hang tight…",
  ];

  let pct = 0;
  let phraseIdx = 0;

  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12 + 4, 100);
    fill.style.width = pct + "%";

    const newPhrase = phrases[Math.floor(pct / (100 / phrases.length))];
    if (newPhrase && newPhrase !== tag.textContent) {
      tag.style.opacity = "0";
      setTimeout(() => {
        tag.textContent = newPhrase;
        tag.style.transition = "opacity .4s";
        tag.style.opacity = "1";
      }, 200);
    }

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("out");
        setTimeout(() => { loader.style.display = "none"; startHeroEntrance(); }, 600);
      }, 300);
    }
  }, 60);
})();

/* ─────────────────────────────────────────────
   HERO ENTRANCE SEQUENCE
   ───────────────────────────────────────────── */
function startHeroEntrance() {
  const badge  = document.getElementById("heroBadge");
  const script = document.getElementById("heroScript");
  const line1  = document.getElementById("heroLine1");
  const line2  = document.getElementById("heroLine2");
  const sub    = document.getElementById("heroSub");
  const ctas   = document.getElementById("heroCtas");

  // 1. Badge slides down
  setTimeout(() => { badge.classList.add("char-visible"); }, 100);

  // 2. Script ("Dre's") glows in
  setTimeout(() => { script.classList.add("char-visible"); }, 450);

  // 3. "TASTY SOUTHERN" — letter by letter
  setTimeout(() => { splitAndAnimate(line1, 30); }, 900);

  // 4. "CUISINES" — letter by letter
  setTimeout(() => { splitAndAnimate(line2, 40); }, 1350);

  // 5. Typewriter for sub-tagline
  setTimeout(() => {
    sub.style.opacity = "1";
    typewriter(sub, "Hickory smoke · Southern soul · Island aloha", 45);
  }, 1800);

  // 6. CTAs fade up
  setTimeout(() => { ctas.classList.add("char-visible"); }, 2400);
}

/* Split text into individual animated chars */
function splitAndAnimate(el, staggerMs = 40) {
  const text = el.textContent;
  el.textContent = "";
  el.style.opacity = "1";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = char === " " ? "char space" : "char";
    el.appendChild(span);
    setTimeout(() => span.classList.add("visible"), i * staggerMs);
  });
}

/* Typewriter effect */
function typewriter(el, text, speed = 50) {
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, speed);
}

/* ─────────────────────────────────────────────
   CURSOR TRAIL CANVAS
   ───────────────────────────────────────────── */
(function initTrail() {
  const canvas = document.getElementById("trailCanvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const trail = [];
  const MAX   = 60;
  let mx = -999, my = -999;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    trail.push({
      x: mx, y: my,
      life: 1,
      size: Math.random() * 3 + 1.5,
      hue:  Math.random() * 30 + 35, // gold-ish
    });
    if (trail.length > MAX) trail.shift();
  });

  (function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, i) => {
      p.life -= 0.03;
      if (p.life <= 0) return;
      const alpha = p.life * 0.5;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
      ctx.fillStyle   = `hsl(${p.hue}, 100%, ${50 + p.life * 20}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    // Remove dead particles
    for (let i = trail.length - 1; i >= 0; i--) {
      if (trail[i].life <= 0) trail.splice(i, 1);
    }
    requestAnimationFrame(drawTrail);
  })();
})();

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────────── */
const cursor         = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  })();
}

const hoverEls = document.querySelectorAll(
  "a, button, .menu-card, .steak-card, .shrimp-card, .contact-card, .gallery-item, .section-dot"
);
hoverEls.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform         = "translate(-50%, -50%) scale(2.5)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursorFollower.style.opacity   = "0.3";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform         = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.opacity   = "0.6";
  });
});

/* ─────────────────────────────────────────────
   CLICK RIPPLE
   ───────────────────────────────────────────── */
document.addEventListener("click", (e) => {
  const r = document.createElement("div");
  r.className = "ripple";
  r.style.left   = e.clientX + "px";
  r.style.top    = e.clientY + "px";
  document.body.appendChild(r);
  r.addEventListener("animationend", () => r.remove());
});

/* ─────────────────────────────────────────────
   SCROLL PROGRESS
   ───────────────────────────────────────────── */
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const t = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = (t / h * 100) + "%";
}, { passive: true });

/* ─────────────────────────────────────────────
   NAV SCROLL STATE
   ───────────────────────────────────────────── */
const nav = document.getElementById("nav");
function updateNav() {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 60);
}
updateNav(); // apply immediately on load (handles page refresh while scrolled)
window.addEventListener("scroll", updateNav, { passive: true });

/* ─────────────────────────────────────────────
   BACK TO TOP
   ───────────────────────────────────────────── */
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ─────────────────────────────────────────────
   HAMBURGER
   ───────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
}

/* ─────────────────────────────────────────────
   HERO CANVAS — EMBERS + SMOKE + STARS
   ───────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Ember {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x           = Math.random() * canvas.width;
      this.y           = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size        = Math.random() * 3 + 1;
      this.speedY      = -(Math.random() * 1.5 + 0.5);
      this.speedX      = (Math.random() - 0.5) * 0.8;
      this.life        = 1;
      this.decay       = Math.random() * 0.005 + 0.002;
      this.color       = Math.random() > 0.5
        ? `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)`
        : `hsl(${Math.random() * 20 + 40}, 100%, ${Math.random() * 20 + 60}%)`;
      this.wobble      = Math.random() * Math.PI * 2;
      this.wobbleSpeed = (Math.random() - 0.5) * 0.05;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.4;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.998;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha  = this.life * 0.9;
      ctx.shadowBlur   = 6;
      ctx.shadowColor  = this.color;
      ctx.fillStyle    = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class SmokeParticle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x       = (Math.random() * 0.6 + 0.2) * canvas.width;
      this.y       = initial ? Math.random() * canvas.height : canvas.height * 0.8 + Math.random() * 100;
      this.radius  = Math.random() * 60 + 30;
      this.speedY  = -(Math.random() * 0.4 + 0.15);
      this.speedX  = (Math.random() - 0.5) * 0.3;
      this.life    = Math.random() * 0.3 + 0.05;
      this.maxLife = this.life;
      this.decay   = Math.random() * 0.001 + 0.0005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.radius += 0.3;
      this.life   -= this.decay;
    }
    draw() {
      if (this.life <= 0) return;
      const alpha = (this.life / this.maxLife) * 0.12;
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, "rgba(180,140,80,.8)");
      g.addColorStop(0.5, "rgba(80,60,40,.4)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Star {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x           = Math.random() * canvas.width;
      this.y           = initial ? Math.random() * canvas.height * 0.7 : -5;
      this.size        = Math.random() * 1.5 + 0.3;
      this.life        = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }
    update() { this.life += this.twinkleSpeed; }
    draw() {
      const alpha = (Math.sin(this.life) + 1) / 2 * 0.7 + 0.1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = "#FFF8E7";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* Canvas fire tongues at the bottom — large animated shapes */
  class FireTongue {
    constructor() { this.reset(); }
    reset() {
      this.x     = (Math.random() * 0.7 + 0.15) * canvas.width;
      this.baseY = canvas.height;
      this.h     = Math.random() * 180 + 80;
      this.w     = Math.random() * 60 + 30;
      this.life  = Math.random();
      this.speed = Math.random() * 0.015 + 0.008;
      this.hue   = Math.random() * 25 + 10; // orange-red
    }
    update() {
      this.life += this.speed;
      if (this.life > 1) this.reset();
    }
    draw() {
      const t     = this.life;
      const alpha = Math.sin(t * Math.PI) * 0.04;
      const scaleH = Math.sin(t * Math.PI);
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(
        this.x, this.baseY, 0,
        this.x, this.baseY - this.h * scaleH, this.w
      );
      g.addColorStop(0,   `hsla(${this.hue}, 100%, 60%, 1)`);
      g.addColorStop(0.4, `hsla(${this.hue + 10}, 100%, 45%, 0.6)`);
      g.addColorStop(1,   "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(
        this.x, this.baseY,
        this.w / 2, this.h * scaleH,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = [];
  for (let i = 0; i < 80; i++) particles.push(new Ember());
  for (let i = 0; i < 25; i++) particles.push(new SmokeParticle());
  for (let i = 0; i < 60; i++) particles.push(new Star());
  for (let i = 0; i < 8; i++)  particles.push(new FireTongue());

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Warm glow base
    const grd = ctx.createRadialGradient(
      canvas.width / 2, canvas.height, 0,
      canvas.width / 2, canvas.height, canvas.height * 0.6
    );
    grd.addColorStop(0,   "rgba(200,100,0,0.07)");
    grd.addColorStop(0.4, "rgba(180,80,0,0.03)");
    grd.addColorStop(1,   "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => { p.update(); p.draw(); if (p.life !== undefined && p.life <= 0) p.reset(); });

    // Spawn fresh embers
    if (frame % 3 === 0) {
      const e = new Ember();
      e.y = canvas.height + 5;
      e.x = (Math.random() * 0.6 + 0.2) * canvas.width;
      particles.push(e);
      if (particles.length > 230) particles.splice(60, 1);
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─────────────────────────────────────────────
   HOVER SIZZLE PARTICLES (steak/menu cards)
   ───────────────────────────────────────────── */
(function initSizzle() {
  const canvas = document.getElementById("trailCanvas");
  const ctx    = canvas.getContext("2d");

  const sizzles = [];

  function spawnSizzle(x, y) {
    for (let i = 0; i < 6; i++) {
      sizzles.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 3 + 1),
        size: Math.random() * 4 + 1,
        life: 1,
        hue: Math.random() * 30 + 10,
      });
    }
  }

  // Draw loop is shared with trail canvas in trailCanvas init above
  // So we expose spawnSizzle via a global handler
  window._spawnSizzle = spawnSizzle;

  // Poll to draw sizzle particles on the same canvas
  // The trail canvas RAF loop is separate, so we hook in here
  function drawSizzle() {
    for (let i = sizzles.length - 1; i >= 0; i--) {
      const p = sizzles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.05; // gravity upward (smoke rises)
      p.life -= 0.04;
      if (p.life <= 0) { sizzles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha  = p.life * 0.7;
      ctx.shadowBlur   = 10;
      ctx.shadowColor  = `hsl(${p.hue}, 100%, 60%)`;
      ctx.fillStyle    = `hsl(${p.hue}, 100%, ${40 + p.life * 30}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(drawSizzle);
  }
  drawSizzle();
})();

document.querySelectorAll(".steak-card, .menu-card--featured, .shrimp-card--xl").forEach(card => {
  let sizzleInt = null;
  card.addEventListener("mouseenter", (e) => {
    sizzleInt = setInterval(() => {
      const r = card.getBoundingClientRect();
      const x = r.left + Math.random() * r.width;
      const y = r.top  + Math.random() * 20;
      if (window._spawnSizzle) window._spawnSizzle(x, y);
    }, 120);
  });
  card.addEventListener("mouseleave", () => { clearInterval(sizzleInt); });
});

/* ─────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────
   STAGGERED CARD REVEAL
   ───────────────────────────────────────────── */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll(".menu-card, .steak-card, .shrimp-card");
      cards.forEach((c, i) => {
        setTimeout(() => c.classList.add("card-in"), i * 100);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll(".menu-grid, .steak-grid, .shrimp-grid").forEach(g => cardObserver.observe(g));

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 2000;
  const start    = performance.now();
  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

/* ─────────────────────────────────────────────
   PARALLAX HERO
   ───────────────────────────────────────────── */
const heroContent = document.querySelector(".hero-content");
if (heroContent) {
  window.addEventListener("scroll", () => {
    if (window.scrollY < window.innerHeight) {
      const o = window.scrollY;
      heroContent.style.transform = `translateY(${o * 0.3}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - o / (window.innerHeight * 0.7));
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   SECTION DOT NAV
   ───────────────────────────────────────────── */
const sectionIds  = ["hero", "about", "gallery", "contact"];
const sectionDots = document.querySelectorAll(".section-dot");

sectionDots.forEach((dot, i) => {
  dot.style.cursor = "pointer";
  dot.addEventListener("click", () => {
    document.getElementById(sectionIds[i])?.scrollIntoView({ behavior: "smooth" });
  });
});

window.addEventListener("scroll", () => {
  let current = 0;
  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - window.innerHeight / 2) current = i;
  });
  sectionDots.forEach((d, i) => d.classList.toggle("active", i === current));
}, { passive: true });

/* ─────────────────────────────────────────────
   3D CARD TILT
   ───────────────────────────────────────────── */
document.querySelectorAll(".menu-card, .steak-card, .shrimp-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.02) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform  = "";
    card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s";
  });
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform .1s, box-shadow .3s";
  });
});

/* ─────────────────────────────────────────────
   GALLERY MAGNETIC
   ───────────────────────────────────────────── */
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x    = (e.clientX - rect.left - rect.width  / 2) * 0.06;
    const y    = (e.clientY - rect.top  - rect.height / 2) * 0.06;
    item.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform  = "";
    item.style.transition = "transform .6s cubic-bezier(.25,.46,.45,.94)";
  });
});

/* ─────────────────────────────────────────────
   CONTACT CARD GLOW TRACE
   ───────────────────────────────────────────── */
document.querySelectorAll(".contact-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.background = `radial-gradient(220px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(212,160,23,.09), rgba(255,255,255,.02) 60%)`;
  });
  card.addEventListener("mouseleave", () => { card.style.background = ""; });
});

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK
   ───────────────────────────────────────────── */
const navLinkEls = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  document.querySelectorAll("section[id]").forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinkEls.forEach(a => {
    const href = a.getAttribute("href");
    a.style.color = href === `#${current}` ? "var(--gold)" : "";
  });
}, { passive: true });

/* ─────────────────────────────────────────────
   TICKER PAUSE
   ───────────────────────────────────────────── */
const ticker     = document.querySelector(".ticker");
const tickerWrap = document.querySelector(".ticker-wrap");
if (ticker && tickerWrap) {
  tickerWrap.addEventListener("mouseenter", () => { ticker.style.animationPlayState = "paused"; });
  tickerWrap.addEventListener("mouseleave", () => { ticker.style.animationPlayState = "running"; });
}

/* ─────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
   ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

/* ─────────────────────────────────────────────
   AMBIENT FIRE FLICKER (CSS var)
   ───────────────────────────────────────────── */
(function ambientFlicker() {
  const menuSection = document.querySelector(".menu-section");
  if (!menuSection) return;
  setInterval(() => {
    const v = (Math.random() * 0.06 + 0.04).toFixed(3);
    menuSection.style.setProperty("--fire-opacity", v);
  }, 200);
})();

/* ─────────────────────────────────────────────
   SHIMMER TITLES
   ───────────────────────────────────────────── */
document.querySelectorAll(".section-title").forEach(el => {
  el.classList.add("shimmer-title");
});

console.log(
  "%c🔥 Dre's Tasty Southern Cuisines 🔥\n%cMade with soul. Served with aloha.\n%c@dres_tasty_southerncuisenes",
  "font-size:20px; color:#D4A017; font-weight:bold;",
  "font-size:12px; color:#8a7a60;",
  "font-size:11px; color:#00B4D8;"
);
