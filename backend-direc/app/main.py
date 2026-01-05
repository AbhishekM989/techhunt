from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.storage import load_teams, save_teams, get_or_create_team
from app.data import load_levels, normalize
from datetime import datetime
from app.models import LoginRequest
from app.models import SubmitAnswerRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

levels = load_levels()

# ---------------- LOGIN ----------------


@app.post("/login")
def login(payload: LoginRequest):
    teams = load_teams()
    team_id = payload.team_id

    if team_id not in teams:
        teams[team_id] = {
            "current_level": 1,
            "qr_unlocked_level": 1, 
            "levels": {}
        }
        save_teams(teams)

    return {
        "status": "ok",
        "current_level": teams[team_id]["current_level"]
    }


# ---------------- GET CURRENT LEVEL ----------------
@app.get("/level/{team_id}")
def get_level(team_id: str):
    teams = load_teams()

    if team_id not in teams:
        raise HTTPException(404, "Invalid team")

    team = teams[team_id]
    level = str(team["current_level"])

    # 🔒 QR gate (ONLY for level ≥ 2)
    if team["current_level"] > team["qr_unlocked_level"]:
        raise HTTPException(403, "Scan QR to unlock this level")

    if level not in team["levels"]:
        team["levels"][level] = {
            "attempts": 0,
            "answered": False,
            "hints": []
        }
        save_teams(teams)

    return {
        "level": level,
        "question": levels[level]["question"],
        "hints": team["levels"][level]["hints"]
    }


# ---------------- SUBMIT ANSWER ----------------
@app.post("/submit-answer")
def submit_answer(payload: SubmitAnswerRequest):
    team_id = payload.team_id
    answer = payload.answer

    teams = load_teams()
    team = teams.get(team_id)

    if not team:
        raise HTTPException(404, "Invalid team")

    lvl = str(team["current_level"])
    state = team["levels"].get(lvl)

    if not state:
        raise HTTPException(400, "Level not initialized")

    # already answered
    if state["answered"]:
        return {
            "status": "already_completed",
            "next_qr_clue": levels[lvl]["next_qr_clue"]
        }

    state["attempts"] += 1

    # hint logic
    for k, hint in levels[lvl]["hints"].items():
        if state["attempts"] >= int(k) and hint not in state["hints"]:
            state["hints"].append(hint)

    # check answer
    if normalize(answer) == normalize(levels[lvl]["answer"]):
        state["answered"] = True
        team["current_level"] += 1
        save_teams(teams)

        return {
            "status": "correct",
            "next_qr_clue": levels[lvl]["next_qr_clue"]
        }

    save_teams(teams)
    return {
        "status": "wrong",
        "attempts": state["attempts"],
        "hints": state["hints"]
    }

@app.post("/verify-qr")
def verify_qr(team_id: str, level: int):
    teams = load_teams()

    if team_id not in teams:
        raise HTTPException(404, "Invalid team")

    team = teams[team_id]

    # QR must be for CURRENT level only
    if level != team["current_level"]:
        raise HTTPException(403, "Invalid QR for this level")

    team["qr_unlocked_level"] = level
    save_teams(teams)

    return {
        "status": "ok",
        "unlocked_level": level
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)