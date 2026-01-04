function login() {
  const teamId = document.getElementById("teamId").value.trim().toUpperCase();
  const msg = document.getElementById("msg");

  if (!teamId) {
    msg.innerText = "Team ID is required";
    return;
  }

  // 🔹 MOCK MODE: validate team
  if (!MOCK_TEAMS[teamId]) {
    msg.innerText = "Invalid Team ID";
    return;
  }

  // Save team session
  localStorage.setItem("team_id", teamId);

  // Redirect to game
  window.location.href = "game.html";
}
