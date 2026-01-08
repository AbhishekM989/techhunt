from fastapi import APIRouter
from pydantic import BaseModel
from app.storage import load_teams, save_teams
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime, timezone, timedelta
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/admin")

@router.get("/teams")
def get_all_teams():
    teams = load_teams()
    response = []

    for team_id, team in teams.items():

        
        attempts_dict = team.get("attempts", {})
        total_attempts = sum(int(v) for v in attempts_dict.values())

    
        hints_dict = team.get("hints_used", {})
        total_hints = sum(1 for v in hints_dict.values() if v is True)

        
        tab_switches = team.get("tab_switches", 0)

        response.append({
            "team_id": team_id,
            "current_level": team.get("current_level", 0),
            "start_time": team.get("start_time"),
            "end_time": team.get("end_time"),
            "attempts": total_attempts,
            "hints_used": total_hints,
            "tab_switches": tab_switches,   # 👈 MUST BE HERE
            "status": "finished" if team.get("is_finished") else "playing"
        })

    return response


class TabSwitchPayload(BaseModel):
    team_id: str
    count: int


@router.post("/track-tab-switch")
def track_tab_switch(payload: dict):
    team_id = payload.get("team_id")

    teams = load_teams()

    if team_id not in teams:
        return {"status": "invalid team"}

    
    if teams[team_id].get("is_finished"):
        return {"status": "ignored (finished)"}

    
    teams[team_id]["tab_switches"] = teams[team_id].get("tab_switches", 0) + 1

    save_teams(teams)

    return {"status": "incremented"}

from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import os

@router.get("/export/pdf")
def export_pdf():
    teams = load_teams()

    os.makedirs("reports", exist_ok=True)
    file_path = "reports/TechHunt_Event_Report.pdf"

    c = canvas.Canvas(file_path, pagesize=A4)
    IST = timezone(timedelta(hours=5, minutes=30))
    now_ist = datetime.now(IST)

    # ===== PDF METADATA =====
    c.setTitle("TechHunt Event Report")
    c.setAuthor("TechHunt System")
    c.setSubject("Event Performance Report")

    width, height = A4
    margin = 50
    y = height - margin

    # ===== TITLE =====
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2, y, "TechHunt – Event Report")

    y -= 25
    c.setFont("Helvetica", 11)
    c.setFillColor(colors.grey)
    c.drawCentredString(
        width / 2,
        y,
        f"Generated on {now_ist.strftime('%d %b %Y, %I:%M %p (IST)')}"
    )
    c.setFillColor(colors.black)
    y -= 40

    # ===== TABLE CONFIG =====
    headers = [
        "Team ID",
        "Attempts",
        "Hints",
        "Duration",
        "Tab Switches",
        "Status"
    ]

    col_widths = [80, 70, 60, 90, 100, 80]
    x_positions = [margin]
    for w in col_widths[:-1]:
        x_positions.append(x_positions[-1] + w)

    row_height = 22

    # ===== TABLE HEADER =====
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.whitesmoke)
    c.rect(margin, y - row_height, sum(col_widths), row_height, fill=1)
    c.setFillColor(colors.black)

    for i, header in enumerate(headers):
        c.drawString(x_positions[i] + 6, y - 15, header)

    y -= row_height

    # ===== TABLE ROWS =====
    c.setFont("Helvetica", 10)
    alternate = False

    for team_id, team in teams.items():
        if y < margin + row_height:
            c.showPage()
            y = height - margin
            c.setFont("Helvetica", 10)

        attempts = sum(team.get("attempts", {}).values())
        hints = sum(1 for v in team.get("hints_used", {}).values() if v)
        tab_switches = team.get("tab_switches", 0)
        status = "Finished" if team.get("is_finished") else "Playing"

        # ===== DURATION CALCULATION =====
        duration = "—"
        if team.get("start_time") and team.get("end_time"):
            start = datetime.fromisoformat(team["start_time"])
            end = datetime.fromisoformat(team["end_time"])
            diff = int((end - start).total_seconds())
            if diff > 0:
                h = diff // 3600
                m = (diff % 3600) // 60
                s = diff % 60
                duration = f"{h:02d}h {m:02d}m {s:02d}s"

        row = [
            team_id,
            attempts,
            hints,
            duration,
            tab_switches,
            status
        ]

        # ===== ROW BACKGROUND =====
        if tab_switches >= 10:
            c.setFillColor(colors.lightcoral)   # 🚨 suspicious
            c.rect(margin, y - row_height, sum(col_widths), row_height, fill=1)
            c.setFillColor(colors.black)
        elif alternate:
            c.setFillColor(colors.lightgrey)
            c.rect(margin, y - row_height, sum(col_widths), row_height, fill=1)
            c.setFillColor(colors.black)

        for i, cell in enumerate(row):
            text = f"{cell}" if (i == 4 and tab_switches >= 10) else str(cell)
            c.drawString(x_positions[i] + 6, y - 15, text)

        alternate = not alternate
        y -= row_height

    # ===== FOOTER =====
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(colors.grey)
    c.drawCentredString(
        width / 2,
        35,
        "Red-Highlighted rows indicate unusually high tab switching"
    )
    c.drawCentredString(
        width / 2,
        22,
        "Generated by IIC-TechHunt Admin System"
    )

    c.save()

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="TechHunt_Event_Report.pdf"
    )
