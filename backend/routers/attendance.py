from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
from models import Employee, Attendance
from schemas import AttendanceCreate, AttendanceResponse
from typing import Optional
from datetime import date as date_type

router = APIRouter(prefix="/attendance", tags=["attendance"])


def _build_response(att: Attendance) -> AttendanceResponse:
    r = AttendanceResponse.model_validate(att)
    r.employee_str_id = att.employee.employee_id
    r.full_name = att.employee.full_name
    return r


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == payload.employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{payload.employee_id}' not found.",
        )
    # Duplicate date guard
    existing = (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id, Attendance.date == payload.date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance for '{payload.employee_id}' on {payload.date} already marked.",
        )
    att = Attendance(employee_id=emp.id, date=payload.date, status=payload.status)
    db.add(att)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance record already exists for this date.",
        )
    db.refresh(att)
    return _build_response(att)


@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(
    employee_id: str,
    date: Optional[date_type] = None,
    db: Session = Depends(get_db),
):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    query = db.query(Attendance).filter(Attendance.employee_id == emp.id)
    if date:
        query = query.filter(Attendance.date == date)
    records = query.order_by(Attendance.date.desc()).all()
    return [_build_response(r) for r in records]
