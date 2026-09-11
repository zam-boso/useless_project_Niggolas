// Cursor-following lizard pet: idle/walk animation, flies spawn in,
// lizard tongue-strikes any fly the cursor gets close to.
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'petCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const GREEN = '#39ff6a';
  const GREEN_DARK = '#1f7a37';
  const TONGUE = '#ff4dd8';

  const lizard = {
    x: mouse.x, y: mouse.y,
    facing: 0,
    legPhase: 0,
    tailPhase: 0,
    state: 'idle', // idle | walk | strike
    strikeT: 0,
    strikeTarget: null,
    strikeFly: null,
    blinkT: Math.random() * 4,
  };

  const EAT_RADIUS = 46;
  const FOLLOW_LAG = 0.07;
  const STOP_DISTANCE = 26; // lizard hangs back slightly behind the cursor

  let flies = [];
  let lastFlySpawn = performance.now();
  let nextSpawnDelay = 2500 + Math.random() * 3000;

  function spawnFly() {
    const edge = Math.floor(Math.random() * 4);
    const w = window.innerWidth, h = window.innerHeight;
    let x, y;
    if (edge === 0) { x = -20; y = Math.random() * h; }
    else if (edge === 1) { x = w + 20; y = Math.random() * h; }
    else if (edge === 2) { x = Math.random() * w; y = -20; }
    else { x = Math.random() * w; y = h + 20; }
    const targetX = w * 0.2 + Math.random() * w * 0.6;
    const targetY = h * 0.2 + Math.random() * h * 0.6;
    const dx = targetX - x, dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 1.1 + Math.random() * 0.8;
    flies.push({
      x, y,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      phase: Math.random() * Math.PI * 2,
      wingPhase: 0,
      alive: true,
      age: 0,
    });
  }

  function updateFlies(dt) {
    const now = performance.now();
    if (now - lastFlySpawn > nextSpawnDelay && flies.length < 4) {
      spawnFly();
      lastFlySpawn = now;
      nextSpawnDelay = 2500 + Math.random() * 3500;
    }
    const w = window.innerWidth, h = window.innerHeight;
    flies = flies.filter((f) => {
      if (!f.alive) return false;
      f.age += dt;
      f.phase += 0.12;
      f.wingPhase += 0.9;
      f.x += f.vx + Math.sin(f.phase) * 0.4;
      f.y += f.vy + Math.cos(f.phase * 1.3) * 0.3;
      if (f.age > 12000) return false;
      if (f.x < -60 || f.x > w + 60 || f.y < -60 || f.y > h + 60) return false;
      return true;
    });
  }

  function findEatableFly() {
    let best = null, bestDist = Infinity;
    for (const f of flies) {
      if (!f.alive) continue;
      const d = Math.hypot(f.x - mouse.x, f.y - mouse.y);
      if (d < EAT_RADIUS && d < bestDist) { best = f; bestDist = d; }
    }
    return best;
  }

  function updateLizard(dt) {
    if (lizard.state === 'strike') {
      lizard.strikeT += dt / 260; // ms -> progress over ~260ms extend+retract
      if (lizard.strikeT >= 0.5 && lizard.strikeFly && lizard.strikeFly.alive) {
        lizard.strikeFly.alive = false; // caught at full extension
      }
      if (lizard.strikeT >= 1) {
        lizard.state = 'idle';
        lizard.strikeT = 0;
        lizard.strikeTarget = null;
        lizard.strikeFly = null;
      }
      return;
    }

    const target = findEatableFly();
    if (target) {
      lizard.state = 'strike';
      lizard.strikeT = 0;
      lizard.strikeFly = target;
      lizard.strikeTarget = { x: target.x, y: target.y };
      lizard.facing = Math.atan2(target.y - lizard.y, target.x - lizard.x);
      return;
    }

    const dx = mouse.x - lizard.x, dy = mouse.y - lizard.y;
    const dist = Math.hypot(dx, dy);
    if (dist > STOP_DISTANCE) {
      lizard.x += dx * FOLLOW_LAG;
      lizard.y += dy * FOLLOW_LAG;
      lizard.facing = Math.atan2(dy, dx);
      lizard.legPhase += Math.min(dist, 40) * 0.03;
      lizard.state = 'walk';
    } else {
      lizard.state = 'idle';
      lizard.legPhase += 0.02;
    }
    lizard.tailPhase += dt * 0.004 * (lizard.state === 'walk' ? 1.6 : 0.7);
    lizard.blinkT -= dt / 1000;
  }

  function drawLizard() {
    const { x, y, facing } = lizard;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(facing);

    const walking = lizard.state === 'walk';
    const legSwing = walking ? 6 : 1.2;
    const bob = walking ? Math.sin(lizard.legPhase * 2) * 1.5 : Math.sin(performance.now() / 500) * 0.6;
    ctx.translate(0, bob);

    // tail
    const tailSway = Math.sin(lizard.tailPhase) * (walking ? 10 : 4);
    ctx.strokeStyle = GREEN_DARK;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.quadraticCurveTo(-26, tailSway * 0.6, -34, tailSway);
    ctx.stroke();

    // legs (2 pairs), animated opposite phase
    ctx.strokeStyle = GREEN_DARK;
    ctx.lineWidth = 3.5;
    [[-6, 1], [6, -1]].forEach(([lx, dirMul]) => {
      const swing = Math.sin(lizard.legPhase + (lx > 0 ? Math.PI : 0)) * legSwing;
      ctx.beginPath();
      ctx.moveTo(lx, -8);
      ctx.lineTo(lx + swing * dirMul, -16 - Math.abs(swing) * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lx, 8);
      ctx.lineTo(lx + swing * dirMul, 16 + Math.abs(swing) * 0.3);
      ctx.stroke();
    });

    // body
    ctx.fillStyle = GREEN;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.ellipse(16, 0, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // eye
    const blink = lizard.blinkT < 0.12;
    if (lizard.blinkT < -0.5) lizard.blinkT = 3 + Math.random() * 3;
    ctx.fillStyle = '#0a0a10';
    if (!blink) {
      ctx.beginPath();
      ctx.arc(19, -3, 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#0a0a10';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(17.5, -3); ctx.lineTo(20.5, -3);
      ctx.stroke();
    }

    // tongue
    if (lizard.state === 'strike' && lizard.strikeTarget) {
      const t = lizard.strikeT;
      const extend = t < 0.5 ? (t / 0.5) : 1 - ((t - 0.5) / 0.5);
      const localTargetX = Math.hypot(
        lizard.strikeTarget.x - x, lizard.strikeTarget.y - y
      );
      ctx.strokeStyle = TONGUE;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(23, 0);
      ctx.lineTo(23 + localTargetX * extend, 0);
      ctx.stroke();
      ctx.fillStyle = TONGUE;
      ctx.beginPath();
      ctx.arc(23 + localTargetX * extend, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawFlies() {
    for (const f of flies) {
      ctx.save();
      ctx.translate(f.x, f.y);
      const flap = Math.sin(f.wingPhase) * 4;
      ctx.strokeStyle = 'rgba(230,230,240,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, -flap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4, -flap); ctx.stroke();
      ctx.fillStyle = '#1a1a20';
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.6, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min(now - lastT, 48);
    lastT = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFlies(dt);
    updateLizard(dt);
    drawFlies();
    drawLizard();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
