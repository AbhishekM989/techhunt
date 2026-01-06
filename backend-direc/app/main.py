from fastapi import FastAPI, HTTPException
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware

from app.storage import load_teams, save_teams
from app.data import check_answer
import json

LEVEL_FILE = "data/levels.json"

app = FastAPI(title="TechHunt JSON Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

def load_levels():
    with open(LEVEL_FILE, "r") as f:
        return json.load(f)

@app.post("/login")
def login(team_id: str):
    teams = load_teams()

    if team_id not in teams:
        raise HTTPException(status_code=401, detail="Invalid Team ID")

    team = teams[team_id]

    if team["start_time"] is None:
        team["start_time"] = datetime.now(timezone.utc).isoformat()
        team["current_level"] = 1
        team["qr_unlocked"] = True

    save_teams(teams)

    return {"status": "ok", "current_level": team["current_level"]}

@app.get("/level")
def get_level(team_id: str):
    teams = load_teams()
    levels = load_levels()

    if team_id not in teams:
        raise HTTPException(status_code=401, detail="Invalid Team ID")

    team = teams[team_id]
    level = str(team["current_level"])

    if level == "1":
        team["qr_unlocked"] = True

    if team["is_finished"]:
        return {"status": "finished"}

    if team["qr_unlocked"]:
        level_data = levels[level]
        questions = level_data["questions"]

    team.setdefault("question_map", {})

    if level not in team["question_map"]:
        import random
        q_index = random.randint(0, len(questions) - 1)
        team["question_map"][level] = q_index
        save_teams(teams)
    else:
        q_index = team["question_map"][level]

    question_obj = questions[q_index]

    return {
        "status": "active",
        "level": level,
        "question": question_obj["question"],
        "clue": level_data.get("clue")
    }
    prev_level = str(int(level) - 1)
    clue = None
    if prev_level in levels:
        clue = levels[prev_level].get("clue")

    return {
        "status": "locked",
        "level": level,
        "clue": clue
    }

    data = levels[level]
    return {
        "status": "active",
        "level": level,
        "question": data["question"],
        "clue": data.get("clue")
    }

@app.post("/scan-qr")
def scan_qr(team_id: str, level: int):
    teams = load_teams()
    level = str(level)

    if team_id not in teams:
        raise HTTPException(status_code=401, detail="Invalid Team ID")

    team = teams[team_id]

    if str(team["current_level"]) != level:
        raise HTTPException(status_code=403, detail="Wrong QR")

    team["qr_unlocked"] = True
    save_teams(teams)

    return {"status": "unlocked"}

@app.post("/submit-answer")
def submit_answer(team_id: str, answer: str):
    teams = load_teams()
    levels = load_levels()

    if team_id not in teams:
        raise HTTPException(status_code=401, detail="Invalid Team ID")

    team = teams[team_id]
    level = str(team["current_level"])

    # Safety checks
    if team["is_finished"]:
        return {"status": "finished"}

    if not team["qr_unlocked"]:
        raise HTTPException(status_code=403, detail="Level locked")

    # Get team-specific question
    q_index = team["question_map"][level]
    correct_answer = levels[level]["questions"][q_index]["answer"]

    # Initialize tracking
    team["attempts"].setdefault(level, 0)
    team["hints_used"].setdefault(level, False)

    # ✅ CORRECT ANSWER
    if check_answer(answer, correct_answer):

        team["last_clue"] = levels[level].get("clue")
        team["qr_unlocked"] = False
        team["current_level"] += 1

        if str(team["current_level"]) not in levels:
            team["is_finished"] = True
            team["end_time"] = datetime.now(timezone.utc).isoformat()
            save_teams(teams)
            return {"status": "finished"}

        save_teams(teams)
        return {
            "status": "correct",
            "next_clue": team["last_clue"]
        }

    # ❌ WRONG ANSWER
    team["attempts"][level] += 1
    attempts = team["attempts"][level]

    hint = None

    # Unlock hint exactly on 3rd wrong attempt
    if attempts == 3:
        team["hints_used"][level] = True
        hint = levels[level].get("hint")

    # Keep showing hint after unlock
    elif team["hints_used"][level]:
        hint = levels[level].get("hint")

    save_teams(teams)

    return {
        "status": "wrong",
        "attempts": attempts,
        "hint": hint
    }
    team["qr_unlocked"] = False
    team["current_level"] += 1

    if str(team["current_level"]) not in levels:
        team["is_finished"] = True
        team["end_time"] = datetime.utcnow().isoformat()
        save_teams(teams)
        return {"status": "finished"}

    save_teams(teams)
    return {
        "status": "correct",
        "next_clue": levels[level]["clue"]
    }
