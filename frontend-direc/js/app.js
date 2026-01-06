document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());

document.body.style.userSelect = "none";

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.warn("Tab switch detected");
  }
});

const teamId = sessionStorage.getItem("team_id");

if (!teamId) {
  window.location.replace = "index.html";
}

const params = new URLSearchParams(window.location.search);
const scanLevel = params.get("scan");

if (scanLevel) {
  scanQR(scanLevel);
  window.history.replaceState({}, document.title, "game.html");
}

async function loadLevel() {
  const res = await fetch(`${API_BASE}/level?team_id=${teamId}`);
  const data = await res.json();

  if (data.status === "finished") {
    showFinished();
    return;
  }

  if (data.status === "locked") {
    showLocked(data.level, data.clue);
    return;
  }

  if (data.status === "active") {
    showQuestion(data);
    return;
  }
}


window.onload = loadLevel;

function showLocked(level, clue) {
  document.body.innerHTML = `
    <div style="text-align:center; margin-top:60px;">
      <h2>🔒Level ${level} Locked</h2>

      <br>

      <p><strong>📍Clue:</strong></p>
      <p>${clue || "Solve the previous level to unlock."}</p>

      <br><br>

      <p style="opacity:0.8;">Scan the QR to continue</p>
    </div>
  `;
}

function showQuestion(data) {
  document.getElementById("questionText").innerText = data.question;
  document.getElementById("clue").innerText = "";
}

async function submitAnswer() {
  const answer = document.getElementById("answer").value.trim();
  const statusMsg = document.getElementById("statusMsg");
  const hintEl = document.getElementById("hintText");

  statusMsg.innerText = "";
  hintEl.innerText = "";

  if (!answer) return;

  const res = await fetch(
    `${API_BASE}/submit-answer?team_id=${teamId}&answer=${encodeURIComponent(answer)}`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.status === "wrong") {
    statusMsg.innerText = "Wrong answer";
    statusMsg.className = "status error";
    if (data.hint) {
      hintEl.innerText = "💡Hint: " + data.hint;
    }
    return;
  }

if (data.status === "correct") {
  statusMsg.innerText = "Correct";
  statusMsg.className = "status success";

  
  document.getElementById("answer").disabled = true;
  document.getElementById("submitBtn").disabled = true;

  
  document.getElementById("submitBtn").style.opacity = "0.5";
  document.getElementById("submitBtn").style.cursor = "not-allowed";

  document.getElementById("clue").innerText =
    "📍Clue: " + data.next_clue;

  return;
}

  if (data.status === "finished") {
    showFinished();
  }
}

async function scanQR(level) {
  const res = await fetch(
    `${API_BASE}/scan-qr?team_id=${teamId}&level=${level}`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.status === "unlocked") {
    loadLevel();
  }
}

function showQuestion(data) {
  document.getElementById("levelBadge").innerText =
    `LEVEL ${data.level}`;

  document.getElementById("questionText").innerText = data.question;
  document.getElementById("clue").innerText = "";
}

function showFinished() {
  document.body.innerHTML = `
    <div style="text-align:center; margin-top:50px;">
      <h1>🎉TechHunt Completed</h1>
      <p>Congratulations! You have finished all levels.</p>
    </div>
  `;
}