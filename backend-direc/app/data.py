import json

LEVEL_FILE = "data/levels.json"

def load_levels():
    with open(LEVEL_FILE, "r") as f:
        return json.load(f)

def normalize(ans: str) -> str:
    return ans.strip().lower()

def check_answer(user_answer: str, correct_answer: str) -> bool:
    return normalize(user_answer) == normalize(correct_answer)
