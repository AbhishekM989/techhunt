from pydantic import BaseModel
from typing import Union

class LoginRequest(BaseModel):
    team_id : str
class QRVerifyRequest(BaseModel):
    team_id: str
    level: int
class SubmitAnswerRequest(BaseModel):
    team_id: str
    answer: str   # ✅ ALWAYS STRING
