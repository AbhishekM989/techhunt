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