const teamId = localStorage.getItem("team_id");
const MOCK_MODE = true;

if (!teamId) {
  window.location.href = "index.html";
}

const levelBadge = document.getElementById("levelBadge");
const questionText = document.getElementById("questionText");
const statusMsg = document.getElementById("statusMsg");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");

// Load current level
// fetch(`${API_BASE}/level?team_id=${teamId}`)
//   .then(res => {
//     if (!res.ok) throw new Error("Level locked. Scan the QR to continue.");
//     return res.json();
//   })
//   .then(data => {
//     levelBadge.innerText = `LEVEL ${data.level}`;
//     questionText.innerText = data.question;
//   })
//   .catch(err => {
//     questionText.innerText = "Level Locked";
//     statusMsg.innerText = err.message;
//     statusMsg.className = "status error";
//     answerInput.style.display = "none";
//     submitBtn.style.display = "none";
//   });
function loadLevel() {
    console.log("loadlevel() called")
  if (MOCK_MODE) {
    if (typeof MOCK_TEAMS === "undefined") {
  alert("Mock data not loaded. Check config.js");
  return;
}

const teamData = MOCK_TEAMS[teamId];

    // Safety check
    if (!teamData) {
      alert("Invalid session. Please login again.");
      localStorage.removeItem("team_id");
      window.location.href = "index.html";
      return;
    }

    renderLevel({
      level: teamData.level,
      status: teamData.status,
      question: "What is the capital of India?",
      submitted_answer: teamData.submitted_answer,
      clue: teamData.status === "SOLVED"
        ? "Knowledge grows where silence is mandatory"
        : null
    });

    return;
  }

  // real backend later
}

/* =========================
   RENDER LEVEL
   ========================= */

function renderLevel(data) {
  levelBadge.innerText = `LEVEL ${data.level}`;
  questionText.innerText = data.question;

  if (data.status === "SOLVED") {
    answerInput.value = data.submitted_answer || "";
    answerInput.disabled = true;
    submitBtn.disabled = true;

    statusMsg.innerText = `Correct! Clue: ${data.clue}`;
    statusMsg.className = "status success";
  }
}

function submitAnswer() {
  const answer = answerInput.value.trim();

  // ❌ Empty answer validation
  if (!answer) {
    statusMsg.innerText = "Answer is required";
    statusMsg.className = "status error";

    // subtle shake feedback
    answerInput.classList.add("input-error");
    setTimeout(() => {
      answerInput.classList.remove("input-error");
    }, 300);

    return; // STOP here, no API call
  }

  // Clear previous error
  statusMsg.innerText = "";
  submitBtn.classList.add("loading");

  if (MOCK_MODE) {
    setTimeout(() => {
      submitBtn.classList.remove("loading");

      if (answer.toLowerCase() === "delhi") {
        statusMsg.innerText =
          "Correct! Clue: Knowledge grows where silence is mandatory.";
        statusMsg.className = "status success";
      } else {
        statusMsg.innerText = "Wrong answer";
        statusMsg.className = "status error";
      }
    }, 800);

  } else {
    fetch(`${API_BASE}/submit-answer?team_id=${teamId}&answer=${encodeURIComponent(answer)}`, {
      method: "POST"
    })
      .then(res => {
        submitBtn.classList.remove("loading");
        if (!res.ok) throw new Error("Wrong answer");
        return res.json();
      })
      .then(data => {
        statusMsg.innerText = `Correct! Clue: ${data.clue}`;
        statusMsg.className = "status success";
      })
      .catch(err => {
        statusMsg.innerText = err.message;
        statusMsg.className = "status error";
      });
  }
}
loadLevel();
