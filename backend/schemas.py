from datetime import date as date_type, datetime
from pydantic import BaseModel, EmailStr, field_validator
from models import AttendanceStatus


# ── Employee ──────────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id", "full_name", "department")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()


class EmployeeResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    present_days: int = 0


# ── Attendance ────────────────────────────────────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: str          # the string employee_id (e.g. "EMP001")
    date: date_type
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    employee_id: int          # FK int
    employee_str_id: str = "" # the human-readable employee_id
    full_name: str = ""
    date: date_type
    status: AttendanceStatus
    marked_at: datetime


# ── Dashboard ─────────────────────────────────────────────────────────────────

class DashboardSummary(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    unmarked_today: int
    total_attendance_records: int
