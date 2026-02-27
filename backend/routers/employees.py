from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Employee, Attendance, AttendanceStatus
from schemas import EmployeeCreate, EmployeeResponse
from datetime import date

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.created_at.desc()).all()
    result = []
    for emp in employees:
        present_days = (
            db.query(func.count(Attendance.id))
            .filter(
                Attendance.employee_id == emp.id,
                Attendance.status == AttendanceStatus.present,
            )
            .scalar()
        ) or 0
        resp = EmployeeResponse.model_validate(emp)
        resp.present_days = present_days
        result.append(resp)
    return result


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    # Duplicate employee_id check
    if db.query(Employee).filter(Employee.employee_id == payload.employee_id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{payload.employee_id}' already exists.",
        )
    # Duplicate email check
    if db.query(Employee).filter(Employee.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{payload.email}' already exists.",
        )
    emp = Employee(
        employee_id=payload.employee_id,
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    resp = EmployeeResponse.model_validate(emp)
    resp.present_days = 0
    return resp


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )
    db.delete(emp)
    db.commit()
