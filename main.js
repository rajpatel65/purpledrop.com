/* Purpledrop v3 — interactive 3D droplet (the mark, live), scroll reveals, nav, form scaffold.
   Three.js loads via dynamic import so the rest of the page works even if the CDN fails. */
let THREE = null;
try { THREE = await import('three'); } catch (e) { /* fallback SVG shows instead */ }

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 3D droplet ---------- */
(function initDroplet() {
  const canvas = document.getElementById('drop-3d');
  const fallback = document.querySelector('.drop-fallback');
  if (!THREE || !canvas) { if (fallback) fallback.style.display = 'block'; return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { if (fallback) fallback.style.display = 'block'; return; }

  const stage = canvas.closest('.drop-stage');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0.4, 7.2);

  // Teardrop: icosahedron stretched + pinched at the top
  const geo = new THREE.IcosahedronGeometry(1.55, 4);
  const pos = geo.attributes.position;
  const base = new Float32Array(pos.array);
  for (let i = 0; i < pos.count; i++) {
    let x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
    y *= 1.28;                                            // stretch tall
    const t = THREE.MathUtils.clamp((y - 0.4) / 1.6, 0, 1); // 0 at belly, 1 at tip
    const pinch = 1 - t * t * 0.62;                        // narrow toward the tip
    x *= pinch; z *= pinch;
    base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
  }
  pos.array.set(base);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x4C1D95, roughness: 0.32, metalness: 0.15,
    flatShading: false
  });
  const drop = new THREE.Mesh(geo, mat);
  scene.add(drop);

  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xA78BFA, 1.6); rim.position.set(-5, 2, -4); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xFFF7EE, 0.55));

  // Drag to spin + gentle idle motion
  let dragging = false, px = 0, py = 0, vx = 0, vy = 0, rx = 0.12, ry = 0;
  let tiltX = 0, tiltY = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (dragging) {
      vx = (e.clientY - py) * 0.006; vy = (e.clientX - px) * 0.006;
      rx += vx; ry += vy; px = e.clientX; py = e.clientY;
    } else {
      tiltY = (e.clientX / window.innerWidth - 0.5) * 0.35;
      tiltX = (e.clientY / window.innerHeight - 0.5) * 0.22;
    }
  }, { passive: true });

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight || 420;
    const s = Math.min(w, h, 460);
    renderer.setSize(s, s, false);
    camera.aspect = 1; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
  const clock = new THREE.Clock();

  // organic wobble via layered sines on the unit direction
  const v = new THREE.Vector3();
  function wobble(t) {
    const arr = pos.array;
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];
      v.set(bx, by, bz).normalize();
      const n =
        Math.sin(v.x * 3.1 + t * 1.1) *
        Math.sin(v.y * 2.7 + t * 0.9) *
        Math.sin(v.z * 3.4 + t * 1.25);
      const s = 1 + n * 0.055;
      arr[i * 3] = bx * s; arr[i * 3 + 1] = by * s; arr[i * 3 + 2] = bz * s;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      wobble(t);
      if (!dragging) { ry += 0.0035; rx += (0.12 - rx) * 0.02; vx *= 0.92; vy *= 0.92; rx += vx; ry += vy; }
      drop.rotation.x += ((rx + tiltX) - drop.rotation.x) * 0.08;
      drop.rotation.y += ((ry + tiltY) - drop.rotation.y) * 0.08;
      drop.position.y = Math.sin(t * 0.8) * 0.09;
    } else if (t < 0.1) {
      wobble(1.4);
      drop.rotation.set(0.12, 0.5, 0);
    }
    renderer.render(scene, camera);
  }
  frame();
})();

/* ---------- Reveal on scroll ---------- */
(function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.problem-grid').forEach((grid) => {
    [...grid.children].forEach((child, n) => { child.style.transitionDelay = `${n * 80}ms`; });
  });
  els.forEach((el) => io.observe(el));
})();

/* ---------- Contact form scaffold ----------
   Backend not wired yet. See the HTML comment above the form for options.
   Remove this intercept once the form posts to a real endpoint. */
(function initForm() {
  const form = document.getElementById('audit-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.style.display = 'block';
    status.textContent = 'Thanks — the form backend isn\u2019t connected yet. This is a draft site under review.';
  });
})();
