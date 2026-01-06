
if (localStorage.getItem("team_id")) {
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

    console.log("✅ Login successful");


    localStorage.setItem("team_id", teamId);

    const pendingScan = localStorage.getItem("pending_scan");

    if (pendingScan) {
      localStorage.removeItem("pending_scan");
      window.location.replace(`game.html?scan=${pendingScan}`);
    } else {
      window.location.replace("game.html");
    }

  } catch (err) {
    console.error(err);
    msg.innerText = "Server not reachable";
  }
}
