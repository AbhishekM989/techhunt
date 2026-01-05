/****************************
 * HARD GLOBAL GUARDS
 ****************************/

// Kill Enter key submits everywhere
const QR_WAIT_KEY = "WAITING_FOR_QR";
const QR_CLUE_KEY = "QR_CLUE_TEXT";
const SAVED_LEVEL_KEY = "SAVED_LEVEL";
const SAVED_QUESTION_KEY = "SAVED_QUESTION";
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

// Prevent double script execution
if (window.__GAME_ALREADY_RUNNING__) {
  console.warn("Game already running, stopping re-init");
  throw new Error("Duplicate game.js execution blocked");
}
window.__GAME_ALREADY_RUNNING__ = true;

/****************************
 * BASIC SETUP
 ****************************/

const teamId = localStorage.getItem("team_id");

if (!teamId) {
  window.location.replace("index.html");
}

// DOM references (MATCH HTML EXACTLY)
const levelBadge = document.getElementById("levelBadge");
const questionText = document.getElementById("questionText");
const messageEl = document.getElementById("message");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submitBtn");

// Internal state lock
let WAITING_FOR_QR = false;

/****************************
 * LOAD LEVEL (ONLY ON PAGE LOAD OR QR)
 ****************************/

async function loadLevel() {
  if (WAITING_FOR_QR) {
    console.log("Blocked loadLevel (waiting for QR)");
    return;
  }

  console.log("loadLevel() called");

  try {
    const res = await fetch(`${API_BASE}/level/${teamId}`);

    // QR lock → silently ignore
    if (res.status === 403) {
      console.log("403 received — level locked");
      return;
    }

    const data = await res.json();
    if (!res.ok) return;

    // Render question
    levelBadge.innerText = `LEVEL ${data.level}`;
    questionText.innerText = data.question;

    messageEl.innerText = "";
    answerInput.disabled = false;
    submitBtn.disabled = false;
    answerInput.value = "";

  } catch (err) {
    console.error("loadLevel error", err);
  }
}

/****************************
 * SUBMIT ANSWER (NO NAVIGATION)
 ****************************/

async function submitAnswer() {
  // Absolute safety
  if (WAITING_FOR_QR) return;

  const answer = answerInput.value.trim();
  if (!answer) {
    messageEl.innerText = "⚠️ Please enter an answer";
    return;
  }

  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/submit-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_id: teamId,
        answer: answer
      })
    });

    const data = await res.json();
    submitBtn.disabled = false;

    // Wrong answer
    if (!res.ok || data.status === "wrong") {
      let msg = "❌ Wrong answer";
      if (data.hints && data.hints.length) {
        msg += "\n\nHints:\n• " + data.hints.join("\n• ");
      }
      messageEl.innerText = msg;
      return;
    }

    // Correct answer — HARD STOP
 if (data.status === "correct") {
  const clueText =
    "✅ Correct!\n\n" +
    "🔍 Clue to next QR:\n" +
    data.next_qr_clue +
    "\n\n📸 Scan the QR to continue.";

  // 🔒 LOCK UI
  answerInput.disabled = true;
  submitBtn.disabled = true;

  // 🧠 SAVE FULL STATE
  sessionStorage.setItem(QR_WAIT_KEY, "true");
  sessionStorage.setItem(QR_CLUE_KEY, clueText);
  sessionStorage.setItem(SAVED_LEVEL_KEY, levelBadge.innerText);
  sessionStorage.setItem(SAVED_QUESTION_KEY, questionText.innerText);

  // 🖥️ SHOW
  messageEl.innerText = clueText;

  return;
}

  } catch (err) {
    submitBtn.disabled = false;
    console.error("submitAnswer error", err);
  }
}

/****************************
 * QR UNLOCK (ONLY PLACE THAT LOADS NEXT LEVEL)
 ****************************/

async function verifyQR(level) {
  try {
    const res = await fetch(
      `${API_BASE}/verify-qr?team_id=${teamId}&level=${level}`,
      { method: "POST" }
    );

    if (!res.ok) {
      console.log("QR verification failed");
      return;
    }

    sessionStorage.removeItem(QR_WAIT_KEY);
    sessionStorage.removeItem(QR_CLUE_KEY);
    sessionStorage.removeItem(SAVED_LEVEL_KEY);
    sessionStorage.removeItem(SAVED_QUESTION_KEY);

    answerInput.disabled = false;
    submitBtn.disabled = false;
    messageEl.innerText = "";

    loadLevel();

  } catch (err) {
    console.error("verifyQR error", err);
  }
}


/****************************
 * INIT (SINGLE TIME)
 ****************************/

document.addEventListener("DOMContentLoaded", () => {
  submitBtn.addEventListener("click", submitAnswer);

  const waiting = sessionStorage.getItem(QR_WAIT_KEY);

  if (waiting === "true") {
    // 🔁 RESTORE FULL UI
    levelBadge.innerText =
      sessionStorage.getItem(SAVED_LEVEL_KEY) || levelBadge.innerText;

    questionText.innerText =
      sessionStorage.getItem(SAVED_QUESTION_KEY) || questionText.innerText;

    messageEl.innerText =
      sessionStorage.getItem(QR_CLUE_KEY) ||
      "✅ Level completed. Scan QR to continue.";

    answerInput.disabled = true;
    submitBtn.disabled = true;

    console.log("Restored full waiting-for-QR state");
    return; // 🚫 DO NOT load level
  }

  loadLevel();
});

document.getElementById("testQRBtn").addEventListener("click", () => {
  // simulate scanning next level QR
  const nextLevel = 3; // or current level + 1
  verifyQR(nextLevel);
});

const params = new URLSearchParams(window.location.search);
const qrLevel = params.get("qr");

if (qrLevel) {
  verifyQR(Number(qrLevel));
}
