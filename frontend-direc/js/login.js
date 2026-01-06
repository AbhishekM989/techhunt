if (sessionStorage.getItem("team_id")) {
  window.location.replace("game.html");
}

async function login() {
  const teamIdInput = document.getElementById("teamId");
  const msg = document.getElementById("msg");

  const teamId = teamIdInput.value.trim();
  msg.innerText = "";

  if (!teamId) {
    msg.innerText = "Team ID is required.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login?team_id=${teamId}`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.detail || "Invalid Team ID";
      return;
    }

    console.log("✅ Login successful, redirecting…");

    sessionStorage.setItem("team_id", teamId);
    window.location.replace("game.html");

  } catch (err) {
    console.error(err);
    errorEl.innerText = "Server not reachable";
  }
}
