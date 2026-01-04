// /* =========================
//    BINARY RAIN BACKGROUND
//    ========================= */

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");
// ctx.fillStyle = "rgba(34, 197, 94, 0.16)";

// let width, height;
// let columns;
// let drops = [];

// const fontSize = 14; // small = subtle
// const chars = "01"; // binary only
// const speed = 0.4;  // VERY slow

// function resizeCanvas() {
//   width = canvas.width = window.innerWidth;
//   height = canvas.height = window.innerHeight;

//   columns = Math.floor(width / fontSize);
//   drops = Array(columns).fill(0);
// }

// resizeCanvas();
// window.addEventListener("resize", resizeCanvas);

// function drawBinaryRain() {
//   // Fade effect (not clear)
//   ctx.fillStyle = "rgba(2, 6, 23, 0.08)";
//   ctx.fillRect(0, 0, width, height);

//   ctx.fillStyle = "rgba(34, 197, 94, 0.12)"; // subtle green
//   ctx.font = `${fontSize}px monospace`;

//   for (let i = 0; i < drops.length; i++) {
//     const text = chars[Math.floor(Math.random() * chars.length)];
//     const x = i * fontSize;
//     const y = drops[i] * fontSize;

//     ctx.fillText(text, x, y);

//     if (y > height && Math.random() > 0.985) {
//       drops[i] = 0;
//     }

//     drops[i] += speed;
//   }

//   requestAnimationFrame(drawBinaryRain);
// }

// drawBinaryRain();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const gridSize = 60;
// const nodes = [];

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// // Create glow nodes
// for (let i = 0; i < 28; i++) {
//   nodes.push({
//     x: Math.random() * w,
//     y: Math.random() * h,
//     r: Math.random() * 2 + 1,
//     alpha: Math.random(),
//     speed: Math.random() * 0.004 + 0.001
//   });
// }

// function drawGrid() {
//   ctx.strokeStyle = "rgba(34,197,94,0.07)";
//   ctx.lineWidth = 1;

//   for (let x = 0; x < w; x += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, h);
//     ctx.stroke();
//   }

//   for (let y = 0; y < h; y += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(w, y);
//     ctx.stroke();
//   }
// }

// function drawNodes() {
//   nodes.forEach(n => {
//     n.alpha += n.speed;
//     if (n.alpha > 1 || n.alpha < 0) n.speed *= -1;

//     ctx.beginPath();
//     ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
//     ctx.fillStyle = `rgba(34,197,94,${0.12 + n.alpha * 0.3})`;
//     ctx.fill();
//   });
// }

// function animate() {
//   ctx.clearRect(0, 0, w, h);
//   drawGrid();
//   drawNodes();
//   requestAnimationFrame(animate);
// }

// animate();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const particles = [];

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// // Create particles
// for (let i = 0; i < 60; i++) {
//   particles.push({
//     x: Math.random() * w,
//     y: Math.random() * h,
//     r: Math.random() * 1.8 + 0.5,
//     vx: Math.random() * 0.15 - 0.075,
//     vy: Math.random() * 0.15 - 0.075
//   });
// }

// function animate() {
//   ctx.clearRect(0, 0, w, h);

//   particles.forEach(p => {
//     p.x += p.vx;
//     p.y += p.vy;

//     if (p.x < 0 || p.x > w) p.vx *= -1;
//     if (p.y < 0 || p.y > h) p.vy *= -1;

//     ctx.beginPath();
//     ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//     ctx.fillStyle = "rgba(34,197,94,0.18)";
//     ctx.fill();
//   });

//   requestAnimationFrame(animate);
// }

// animate();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const points = [];

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// // Points
// for (let i = 0; i < 40; i++) {
//   points.push({
//     x: Math.random() * w,
//     y: Math.random() * h,
//     vx: Math.random() * 0.2 - 0.1,
//     vy: Math.random() * 0.2 - 0.1
//   });
// }

// function animate() {
//   ctx.clearRect(0, 0, w, h);

//   points.forEach((p, i) => {
//     p.x += p.vx;
//     p.y += p.vy;

//     if (p.x < 0 || p.x > w) p.vx *= -1;
//     if (p.y < 0 || p.y > h) p.vy *= -1;

//     for (let j = i + 1; j < points.length; j++) {
//       const q = points[j];
//       const dist = Math.hypot(p.x - q.x, p.y - q.y);

//       if (dist < 150) {
//         ctx.strokeStyle = "rgba(34,197,94,0.08)";
//         ctx.beginPath();
//         ctx.moveTo(p.x, p.y);
//         ctx.lineTo(q.x, q.y);
//         ctx.stroke();
//       }
//     }
//   });

//   requestAnimationFrame(animate);
// }

// animate();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const points = [];

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// // Points
// for (let i = 0; i < 40; i++) {
//   points.push({
//     x: Math.random() * w,
//     y: Math.random() * h,
//     vx: Math.random() * 0.2 - 0.1,
//     vy: Math.random() * 0.2 - 0.1
//   });
// }

// function animate() {
//   ctx.clearRect(0, 0, w, h);

//   points.forEach((p, i) => {
//     p.x += p.vx;
//     p.y += p.vy;

//     if (p.x < 0 || p.x > w) p.vx *= -1;
//     if (p.y < 0 || p.y > h) p.vy *= -1;

//     for (let j = i + 1; j < points.length; j++) {
//       const q = points[j];
//       const dist = Math.hypot(p.x - q.x, p.y - q.y);

//       if (dist < 150) {
//         ctx.strokeStyle = "rgba(34,197,94,0.08)";
//         ctx.beginPath();
//         ctx.moveTo(p.x, p.y);
//         ctx.lineTo(q.x, q.y);
//         ctx.stroke();
//       }
//     }
//   });

//   requestAnimationFrame(animate);
// }

// animate();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);
// const TRACE_COLOR = "rgba(34,197,94,0.05)";
// const GRID = 50;

// function draw() {
//   ctx.clearRect(0, 0, w, h);
//   ctx.strokeStyle = "rgba(34,197,94,0.12)";
//   ctx.lineWidth = 1;

//   for (let x = 0; x < w; x += GRID) {
//     for (let y = 0; y < h; y += GRID) {
//       if (Math.random() > 0.7) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//         ctx.lineTo(x + GRID, y);
//         ctx.lineTo(x + GRID, y + GRID);
//         ctx.stroke();
//       }
//     }
//   }
// }
// draw();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const GRID = 64;

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// /* ---------- CIRCUIT PATHS ---------- */

// const circuits = [];
// const TOTAL_PATHS = 90;

// for (let i = 0; i < TOTAL_PATHS; i++) {
//   let x = Math.floor(Math.random() * (w / GRID)) * GRID;
//   let y = Math.floor(Math.random() * (h / GRID)) * GRID;

//   const steps = Math.floor(Math.random() * 5) + 3;
//   const path = [{ x, y }];

//   for (let j = 0; j < steps; j++) {
//     if (Math.random() > 0.5) x += GRID * (Math.random() > 0.5 ? 1 : -1);
//     else y += GRID * (Math.random() > 0.5 ? 1 : -1);
//     path.push({ x, y });
//   }

//   circuits.push({
//     path,
//     glowIndex: Math.floor(Math.random() * path.length),
//     glowDelay: Math.random() * 200
//   });
// }

// /* ---------- DRAW ---------- */

// function drawBase() {
//   ctx.fillStyle = "#010409";
//   ctx.fillRect(0, 0, w, h);
// }

// function drawEtchedCircuits() {
//   ctx.strokeStyle = "rgba(34,197,94,0.035)";
//   ctx.lineWidth = 1;

//   circuits.forEach(c => {
//     ctx.beginPath();
//     c.path.forEach((p, i) => {
//       if (i === 0) ctx.moveTo(p.x, p.y);
//       else ctx.lineTo(p.x, p.y);
//     });
//     ctx.stroke();
//   });
// }

// function drawGlowNodes() {
//   circuits.forEach(c => {
//     if (Math.random() > 0.985) {
//       c.glowIndex = (c.glowIndex + 1) % c.path.length;
//     }

//     const p = c.path[c.glowIndex];
//     ctx.beginPath();
//     ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
//     ctx.fillStyle = "rgba(34,197,94,0.22)";
//     ctx.fill();
//   });
// }

// function drawVignette() {
//   const grad = ctx.createRadialGradient(
//     w / 2, h / 2, Math.min(w, h) * 0.3,
//     w / 2, h / 2, Math.max(w, h) * 0.7
//   );

//   grad.addColorStop(0, "rgba(0,0,0,0)");
//   grad.addColorStop(1, "rgba(0,0,0,0.55)");

//   ctx.fillStyle = grad;
//   ctx.fillRect(0, 0, w, h);
// }

// function animate() {
//   drawBase();
//   drawEtchedCircuits();
//   drawGlowNodes();
//   drawVignette();

//   requestAnimationFrame(animate);
// }

// animate();

// const canvas = document.getElementById("binaryCanvas");
// const ctx = canvas.getContext("2d");

// let w, h;
// const GRID = 56;
// const PATHS = 80;

// function resize() {
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener("resize", resize);

// /* ---------- CIRCUIT PATH GENERATION ---------- */

// const circuits = [];

// for (let i = 0; i < PATHS; i++) {
//   let x = Math.floor(Math.random() * (w / GRID)) * GRID;
//   let y = Math.floor(Math.random() * (h / GRID)) * GRID;

//   const steps = Math.floor(Math.random() * 6) + 4;
//   const path = [{ x, y }];

//   for (let j = 0; j < steps; j++) {
//     if (Math.random() > 0.5) x += GRID * (Math.random() > 0.5 ? 1 : -1);
//     else y += GRID * (Math.random() > 0.5 ? 1 : -1);
//     path.push({ x, y });
//   }

//   circuits.push({
//     path,
//     energy: Math.random()
//   });
// }

// /* ---------- DRAW LAYERS ---------- */

// function drawBase() {
//   ctx.fillStyle = "#020409";
//   ctx.fillRect(0, 0, w, h);
// }

// function drawGlowCircuits() {
//   circuits.forEach(c => {
//     ctx.lineWidth = 1.4;

//     ctx.shadowColor = "rgba(34,197,94,0.45)";
//     ctx.shadowBlur = 18;
//     ctx.strokeStyle = "rgba(34,197,94,0.35)";

//     ctx.beginPath();
//     c.path.forEach((p, i) => {
//       if (i === 0) ctx.moveTo(p.x, p.y);
//       else ctx.lineTo(p.x, p.y);
//     });
//     ctx.stroke();

//     // ✨ Core bright line
//     ctx.shadowBlur = 0;
//     ctx.strokeStyle = "rgba(34,197,94,0.9)";
//     ctx.lineWidth = 0.6;

//     ctx.beginPath();
//     c.path.forEach((p, i) => {
//       if (i === 0) ctx.moveTo(p.x, p.y);
//       else ctx.lineTo(p.x, p.y);
//     });
//     ctx.stroke();
//   });
// }

// function drawEnergyPulses() {
//   circuits.forEach(c => {
//     c.energy += 0.01;
//     if (c.energy > 1) c.energy = 0;

//     const idx = Math.floor(c.energy * (c.path.length - 1));
//     const p = c.path[idx];

//     ctx.beginPath();
//     ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
//     ctx.fillStyle = "rgba(34,197,94,0.9)";
//     ctx.shadowColor = "rgba(34,197,94,0.9)";
//     ctx.shadowBlur = 25;
//     ctx.fill();
//   });
// }

// function drawVignette() {
//   const grad = ctx.createRadialGradient(
//     w / 2, h / 2, Math.min(w, h) * 0.3,
//     w / 2, h / 2, Math.max(w, h)
//   );

//   grad.addColorStop(0, "rgba(0,0,0,0)");
//   grad.addColorStop(1, "rgba(0,0,0,0.7)");

//   ctx.fillStyle = grad;
//   ctx.fillRect(0, 0, w, h);
// }

// /* ---------- ANIMATE ---------- */

// function animate() {
//   drawBase();
//   drawGlowCircuits();
//   drawEnergyPulses();
//   drawVignette();
//   requestAnimationFrame(animate);
// }

// animate();

const canvas = document.getElementById("binaryCanvas");
const ctx = canvas.getContext("2d");

let w, h;
const GRID = 60;
const PATHS = 75;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* --------- GENERATE CIRCUIT PATHS --------- */

const circuits = [];

for (let i = 0; i < PATHS; i++) {
  let x = Math.floor(Math.random() * (w / GRID)) * GRID;
  let y = Math.floor(Math.random() * (h / GRID)) * GRID;

  const steps = Math.floor(Math.random() * 6) + 4;
  const path = [{ x, y }];

  for (let j = 0; j < steps; j++) {
    if (Math.random() > 0.5) x += GRID * (Math.random() > 0.5 ? 1 : -1);
    else y += GRID * (Math.random() > 0.5 ? 1 : -1);
    path.push({ x, y });
  }

  circuits.push({
    path,
    energy: Math.random()
  });
}

/* --------- DRAW --------- */

function drawBase() {
  ctx.fillStyle = "#020409";
  ctx.fillRect(0, 0, w, h);
}

function drawCircuits() {
  circuits.forEach(c => {
    // Outer glow
    ctx.shadowColor = "rgba(59,130,246,0.6)";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "rgba(59,130,246,0.35)";
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    c.path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Core bright line
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(59,130,246,0.95)";
    ctx.lineWidth = 0.6;

    ctx.beginPath();
    c.path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  });
}

function drawEnergy() {
  circuits.forEach(c => {
    c.energy += 0.012;
    if (c.energy > 1) c.energy = 0;

    const i = Math.floor(c.energy * (c.path.length - 1));
    const p = c.path[i];

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59,130,246,0.9)";
    ctx.shadowColor = "rgba(59,130,246,1)";
    ctx.shadowBlur = 24;
    ctx.fill();
  });
}

function vignette() {
  const g = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.3,
    w / 2, h / 2, Math.max(w, h)
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function animate() {
  drawBase();
  drawCircuits();
  drawEnergy();
  vignette();
  requestAnimationFrame(animate);
}

animate();