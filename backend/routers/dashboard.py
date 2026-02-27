from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Employee, Attendance, AttendanceStatus
from schemas import DashboardSummary
from datetime import date

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardSummary)
def get_dashboard(db: Session = Depends(get_db)):
    today = date.today()
    total_employees = db.query(func.count(Employee.id)).scalar() or 0
    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == AttendanceStatus.present)
        .scalar()
        or 0
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == AttendanceStatus.absent)
        .scalar()
        or 0
    )
    total_attendance_records = db.query(func.count(Attendance.id)).scalar() or 0
    return DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        total_attendance_records=total_attendance_records,
    )
