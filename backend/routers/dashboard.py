from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from database import get_db
from models import Employee, Attendance, AttendanceStatus
from schemas import DashboardSummary
from datetime import date, timedelta
from typing import List
from pydantic import BaseModel


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class WeeklyEntry(BaseModel):
    date: date
    present: int
    absent: int


@router.get("", response_model=DashboardSummary)
def get_dashboard(db: Session = Depends(get_db)):
    today = date.today()
    total_employees = db.query(func.count(Employee.id)).scalar() or 0
    present_today = (
        db.query(func.count(Attendance.id))
        .filter(and_(Attendance.date == today, Attendance.status == AttendanceStatus.present))
        .scalar()
        or 0
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(and_(Attendance.date == today, Attendance.status == AttendanceStatus.absent))
        .scalar()
        or 0
    )
    total_attendance_records = db.query(func.count(Attendance.id)).scalar() or 0
    return DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        unmarked_today=total_employees - present_today - absent_today,
        total_attendance_records=total_attendance_records,
    )


@router.get("/weekly", response_model=List[WeeklyEntry])
def get_weekly_attendance(db: Session = Depends(get_db)):
    today = date.today()
    start = today - timedelta(days=6)
    rows = (
        db.query(
            Attendance.date,
            Attendance.status,
            func.count(Attendance.id).label("cnt"),
        )
        .filter(and_(Attendance.date >= start, Attendance.date <= today))
        .group_by(Attendance.date, Attendance.status)
        .all()
    )
    lookup: dict[date, dict[str, int]] = {}
    for d in (start + timedelta(n) for n in range(7)):
        lookup[d] = {"present": 0, "absent": 0}
    for row_date, status, cnt in rows:
        key = "present" if status == AttendanceStatus.present else "absent"
        if row_date in lookup:
            lookup[row_date][key] = cnt
    return [
        WeeklyEntry(date=d, present=v["present"], absent=v["absent"])
        for d, v in sorted(lookup.items())
    ]
