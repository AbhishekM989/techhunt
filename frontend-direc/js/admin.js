document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());

function formatToIST(utcString) {
  if (!utcString) return "-";

  const date = new Date(utcString);

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function calculateDuration(startUTC, endUTC) {
  if (!startUTC || !endUTC) return "-";

  const start = new Date(startUTC);
  const end = new Date(endUTC);

  let diff = Math.floor((end - start) / 1000);

  if (diff < 0) return "-";

  const hrs = Math.floor(diff / 3600);
  diff %= 3600;
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;

  return `${hrs.toString().padStart(2, "0")}h ${mins
    .toString()
    .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}

const loaderTimerEl = document.getElementById("loaderTimer");

let loaderStartTime = null;
let loaderInterval = null;

const loader = document.getElementById("backendLoader");
let backendReady = false;
const toast = document.getElementById("backendToast");

const tabs = document.querySelectorAll(".admin-tabs .tab");

tabs.forEach(tab => {
  if (tab.textContent.trim().toLowerCase() === "export") {
    tab.addEventListener("click", () => {
      window.location.href = `${API_BASE}/admin/export/pdf`;
    });
  }
});

let lastUpdatedTime = null;

const table = document.getElementById("adminTable");

async function loadTeams() {
  try {
    const res = await fetch(`${API_BASE}/admin/teams`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Backend not ready");

    const teams = await res.json();

    if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
    loaderStartTime = null;
}

    
    if (!backendReady) {
      backendReady = true;
      loader.classList.add("fade-out");

      setTimeout(() => {
      loader.style.display = "none";
      loader.classList.remove("fade-out");
},    600);

setTimeout(showBackendLiveToast, 400);
    }

    table.innerHTML = "";

    teams.forEach((team, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${team.team_id}</td>
        <td>${team.current_level}</td>
        <td>${formatToIST(team.start_time)}</td>
        <td>${formatToIST(team.end_time)}</td>
        <td>${team.attempts}</td>
        <td>${team.hints_used}</td>
        <td>${calculateDuration(team.start_time, team.end_time)}</td>
        <td>${team.tab_switches ?? 0}</td>
        <td class="status-${team.status}">
          ${team.status.toUpperCase()}
        </td>
      `;

      table.appendChild(row);
    });

    lastUpdatedTime = Date.now();
    updateLastUpdatedText();

  } catch (err) {
    loader.style.display = "flex";
    backendReady = false;

     if (!loaderStartTime) {
    loaderStartTime = Date.now();

    loaderInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - loaderStartTime) / 1000);
      if (loaderTimerEl) {
        loaderTimerEl.textContent = `Time Elapsed : ${elapsed}s`;
      }
    }, 1000);
    }
  }
}

function updateLastUpdatedText() {
  const el = document.getElementById("lastUpdated");
  if (!el || !lastUpdatedTime) return;

  const seconds = Math.floor((Date.now() - lastUpdatedTime) / 1000);
  el.textContent = `Last Updated: ${seconds} sec ago`;
}

setInterval(updateLastUpdatedText, 1000);

loadTeams();
setInterval(loadTeams, 5000);

function showBackendLiveToast() {
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}