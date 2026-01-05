import json
import os
from datetime import datetime

TEAMS_FILE = "data/teams.json"

def load_teams():
    if not os.path.exists(TEAMS_FILE):
        return {}
    with open(TEAMS_FILE, "r") as f:
        return json.load(f)

def save_teams(data):
    with open(TEAMS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_or_create_team(team_id):
    teams = load_teams()

    if team_id not in teams:
        teams[team_id] = {
            "current_level": 1,
            "qr_unlocked_level": 1,
            "start_time": datetime.utcnow().isoformat(),
            "completed": False,
            "levels": {}
        }
        save_teams(teams)

    return teams[team_id]

