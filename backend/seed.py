import random
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from models import Employee, Attendance, AttendanceStatus
from database import SessionLocal, engine, Base

EMPLOYEES = [
    ("EMP001", "Aarav Sharma", "aarav.sharma@hrms.in", "Engineering"),
    ("EMP002", "Priya Patel", "priya.patel@hrms.in", "Engineering"),
    ("EMP003", "Rohan Mehta", "rohan.mehta@hrms.in", "Engineering"),
    ("EMP004", "Ananya Gupta", "ananya.gupta@hrms.in", "Engineering"),
    ("EMP005", "Vikram Singh", "vikram.singh@hrms.in", "Design"),
    ("EMP006", "Neha Reddy", "neha.reddy@hrms.in", "Design"),
    ("EMP007", "Arjun Nair", "arjun.nair@hrms.in", "Design"),
    ("EMP008", "Kavya Iyer", "kavya.iyer@hrms.in", "Marketing"),
    ("EMP009", "Aditya Joshi", "aditya.joshi@hrms.in", "Marketing"),
    ("EMP010", "Sneha Kulkarni", "sneha.kulkarni@hrms.in", "Marketing"),
    ("EMP011", "Rahul Verma", "rahul.verma@hrms.in", "Finance"),
    ("EMP012", "Ishita Bose", "ishita.bose@hrms.in", "Finance"),
    ("EMP013", "Manish Tiwari", "manish.tiwari@hrms.in", "Finance"),
    ("EMP014", "Deepika Rao", "deepika.rao@hrms.in", "HR"),
    ("EMP015", "Karthik Menon", "karthik.menon@hrms.in", "HR"),
    ("EMP016", "Pooja Deshmukh", "pooja.deshmukh@hrms.in", "Operations"),
    ("EMP017", "Siddharth Chopra", "siddharth.chopra@hrms.in", "Operations"),
    ("EMP018", "Meera Krishnan", "meera.krishnan@hrms.in", "Operations"),
    ("EMP019", "Amit Saxena", "amit.saxena@hrms.in", "Engineering"),
    ("EMP020", "Divya Thakur", "divya.thakur@hrms.in", "Design"),
]

ATTENDANCE_DAYS = 30


def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        existing = db.query(Employee).count()
        if existing > 0:
            print(f"Database already has {existing} employees — skipping seed.")
            return

        random.seed(42)
        today = date.today()
        emp_objects = []

        for emp_id, name, email, dept in EMPLOYEES:
            emp = Employee(
                employee_id=emp_id,
                full_name=name,
                email=email,
                department=dept,
                created_at=datetime(2026, 1, 15, 9, 0, 0),
            )
            db.add(emp)
            emp_objects.append(emp)

        db.flush()

        for emp in emp_objects:
            for day_offset in range(ATTENDANCE_DAYS):
                d = today - timedelta(days=day_offset)
                if d.weekday() >= 5:
                    continue
                is_present = random.random() < 0.85
                att = Attendance(
                    employee_id=emp.id,
                    date=d,
                    status=AttendanceStatus.present if is_present else AttendanceStatus.absent,
                    marked_at=datetime.combine(d, datetime.min.time().replace(hour=9, minute=random.randint(0, 30))),
                )
                db.add(att)

        db.commit()
        print(f"Seeded {len(emp_objects)} employees with {ATTENDANCE_DAYS} days of attendance.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
