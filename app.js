/* ===========================================
   DRE'S TASTY SOUTHERN CUISINES — JAVASCRIPT
   =========================================== */

"use strict";

/* ─── CUSTOM CURSOR ─────────────────────────── */
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + "px";
  cursorFollower.style.top = followerY + "px";
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll("a, button, .menu-card, .steak-card, .shrimp-card, .contact-card, .gallery-item").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursorFollower.style.opacity = "0.3";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.opacity = "0.6";
  });
});

/* ─── SCROLL PROGRESS ───────────────────────── */
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = (scrollTop / scrollHeight * 100) + "%";
}, { passive: true });

/* ─── NAV SCROLL ────────────────────────────── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

/* ─── HAMBURGER ─────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
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

/* ─── HERO CANVAS PARTICLE SYSTEM ───────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Particle types: embers (fire), smoke, sparks
  const particles = [];
  const EMBER_COUNT = 80;
  const SMOKE_COUNT = 25;
  const STAR_COUNT = 60;

  class Ember {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.life = 1;
      this.decay = Math.random() * 0.005 + 0.002;
      this.color = Math.random() > 0.5
        ? `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)`
        : `hsl(${Math.random() * 20 + 40}, 100%, ${Math.random() * 20 + 60}%)`;
      this.wobble = Math.random() * Math.PI * 2;
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
      ctx.globalAlpha = this.life * 0.9;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class SmokeParticle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = (Math.random() * 0.6 + 0.2) * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height * 0.8 + Math.random() * 100;
      this.radius = Math.random() * 60 + 30;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.life = Math.random() * 0.3 + 0.05;
      this.maxLife = this.life;
      this.decay = Math.random() * 0.001 + 0.0005;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.radius += 0.3;
      this.life -= this.decay;
      this.rotation += this.rotSpeed;
    }
    draw() {
      if (this.life <= 0) return;
      const alpha = (this.life / this.maxLife) * 0.12;
      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, "rgba(180,140,80,0.8)");
      grad.addColorStop(0.5, "rgba(80,60,40,0.4)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Star {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height * 0.7 : -5;
      this.size = Math.random() * 1.5 + 0.3;
      this.life = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.life += this.twinkleSpeed;
    }
    draw() {
      const alpha = (Math.sin(this.life) + 1) / 2 * 0.7 + 0.1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#FFF8E7";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Init particles
  for (let i = 0; i < EMBER_COUNT; i++) particles.push(new Ember());
  for (let i = 0; i < SMOKE_COUNT; i++) particles.push(new SmokeParticle());
  for (let i = 0; i < STAR_COUNT; i++) particles.push(new Star());

  // Spawn rate tracking
  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Subtle radial glow at bottom center
    const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height, 0, canvas.width / 2, canvas.height, canvas.height * 0.6);
    grd.addColorStop(0, "rgba(200,100,0,0.06)");
    grd.addColorStop(0.4, "rgba(180,80,0,0.03)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
      if (p.life !== undefined && p.life <= 0) p.reset();
    });

    // Occasionally spawn new embers from bottom
    if (frame % 3 === 0) {
      const e = new Ember();
      e.y = canvas.height + 5;
      e.x = (Math.random() * 0.6 + 0.2) * canvas.width;
      particles.push(e);
      if (particles.length > EMBER_COUNT + SMOKE_COUNT + STAR_COUNT + 50) {
        particles.splice(STAR_COUNT, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── SCROLL REVEAL ─────────────────────────── */
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

/* ─── ANIMATED COUNTER ──────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statNums = document.querySelectorAll(".stat-num");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ─── PARALLAX HERO ─────────────────────────── */
const heroContent = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  if (window.scrollY < window.innerHeight) {
    const offset = window.scrollY;
    heroContent.style.transform = `translateY(${offset * 0.3}px)`;
    heroContent.style.opacity = 1 - (offset / (window.innerHeight * 0.7));
  }
}, { passive: true });

/* ─── MENU CARD TILT EFFECT ─────────────────── */
document.querySelectorAll(".menu-card, .steak-card, .shrimp-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.02) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s";
  });
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.1s, box-shadow 0.3s";
  });
});

/* ─── GALLERY MAGNETIC EFFECT ────────────────── */
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
    item.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
    item.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  });
});

/* ─── SECTION HIGHLIGHT ON SCROLL ───────────── */
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });
  navLinkEls.forEach(a => {
    a.style.color = a.getAttribute("href") === `#${current}` ? "var(--gold)" : "";
  });
}, { passive: true });

/* ─── TICKER PAUSE ON HOVER ──────────────────── */
const ticker = document.querySelector(".ticker");
const tickerWrap = document.querySelector(".ticker-wrap");
if (ticker && tickerWrap) {
  tickerWrap.addEventListener("mouseenter", () => {
    ticker.style.animationPlayState = "paused";
  });
  tickerWrap.addEventListener("mouseleave", () => {
    ticker.style.animationPlayState = "running";
  });
}

/* ─── CONTACT CARD GLOW TRACE ───────────────── */
document.querySelectorAll(".contact-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(212,160,23,0.07), rgba(255,255,255,0.02) 60%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});

/* ─── LOADING ENTRANCE ───────────────────────── */
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});

/* ─── SMOOTH ANCHOR SCROLL ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

console.log(
  "%c🔥 Dre's Tasty Southern Cuisines 🔥\n%cMade with soul. Served with aloha.",
  "font-size:20px; color:#D4A017; font-weight:bold;",
  "font-size:12px; color:#8a7a60;"
);
