const canvas = document.getElementById("binaryCanvas");
const ctx = canvas.getContext("2d");

let w, h;
const GRID = 80;          
const PATHS = 35;         
const COLOR = "rgba(59,130,246,0.18)"; 

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);


const circuits = [];

for (let i = 0; i < PATHS; i++) {
  let x = Math.floor(Math.random() * (w / GRID)) * GRID;
  let y = Math.floor(Math.random() * (h / GRID)) * GRID;

  const steps = Math.floor(Math.random() * 4) + 3;
  const path = [{ x, y }];

  for (let j = 0; j < steps; j++) {
    if (Math.random() > 0.5) x += GRID * (Math.random() > 0.5 ? 1 : -1);
    else y += GRID * (Math.random() > 0.5 ? 1 : -1);
    path.push({ x, y });
  }

  circuits.push(path);
}



let offset = 0;

function draw() {
  // Deep dark background
  ctx.fillStyle = "#020409";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 1;

  circuits.forEach(path => {
    ctx.beginPath();
    path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x + offset, p.y);
      else ctx.lineTo(p.x + offset, p.y);
    });
    ctx.stroke();
  });

  offset += 0.05;
  if (offset > GRID) offset = 0;

  requestAnimationFrame(draw);
}

draw();
