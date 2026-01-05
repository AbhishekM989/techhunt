// async function login() {
//   const teamId = document.getElementById("teamId").value.trim();

//   if (!teamId) {
//     alert("Enter Team ID");
//     return;
//   }

//   const res = await fetch(`${API_BASE}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ team_id: teamId })
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     alert(
//   typeof data.detail === "string"
//     ? data.detail
//     : JSON.stringify(data.detail)
// );
//     return;
//   }

//   localStorage.setItem("team_id", teamId);

//   // move to game
//   window.location.href = "game.html";
// }


async function loginTeam() {
  const teamId = document.getElementById("teamId").value.trim().toUpperCase();
   const msg = document.getElementById("msg");

  if (!teamId) {
    msg.innerText = "Team ID is required";
    return;
  }

  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team_id: teamId })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail || "Login failed");
    return;
  }

  // ✅ THIS IS FIX 2 (CRITICAL LINE)
  sessionStorage.clear();
  localStorage.setItem("team_id", teamId);

  // ✅ ONLY NOW GO TO GAME PAGE
  window.location.href = "game.html";
}
