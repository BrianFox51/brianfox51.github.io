const canvas = document.querySelector('#atmosphere');
const ctx = canvas.getContext('2d');
const hero = document.querySelector('.hero');
let width = 0;
let height = 0;
let motes = [];
let frame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = hero.clientWidth;
  height = hero.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  motes = Array.from({ length: Math.max(22, Math.round(width / 31)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + .35,
    drift: Math.random() * .28 + .08,
    phase: Math.random() * Math.PI * 2,
    warm: Math.random() > .48
  }));
}

function paintAtmosphere() {
  ctx.clearRect(0, 0, width, height);
  for (const mote of motes) {
    mote.y -= mote.drift;
    mote.x += Math.sin(frame * .006 + mote.phase) * .16;
    if (mote.y < -5) { mote.y = height + 5; mote.x = Math.random() * width; }
    const flicker = .22 + (Math.sin(frame * .025 + mote.phase) + 1) * .19;
    ctx.beginPath();
    ctx.fillStyle = mote.warm ? `rgba(228, 183, 122, ${flicker})` : `rgba(147, 191, 201, ${flicker * .64})`;
    ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
    ctx.fill();
  }
  frame += 1;
  requestAnimationFrame(paintAtmosphere);
}

resizeCanvas();
paintAtmosphere();
window.addEventListener('resize', resizeCanvas, { passive: true });

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// A slight image drift adds depth while keeping the headline steady.
if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    document.querySelector('.hero-image').style.transform = `scale(1.055) translate(${x * -9}px, ${y * -7}px)`;
  });
  hero.addEventListener('pointerleave', () => {
    document.querySelector('.hero-image').style.transform = '';
  });
}
