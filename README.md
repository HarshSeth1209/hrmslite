# HRMS Lite – Human Resource Management System

A lightweight, full-stack HR management application for managing employee records and tracking daily attendance.

## Live Demo
- **Frontend:** *(Deploy to Vercel – see Deployment section)*
- **Backend API:** *(Deploy to Render – see Deployment section)*
- **API Docs:** `<backend-url>/docs`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7, Vanilla CSS |
| Backend | Python 3.11+, FastAPI |
| Database | SQLite (via SQLAlchemy ORM) |
| Charts | Recharts |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

## Features

### Core
- **Employee Management** – Add, list, and delete employees (ID, Name, Email, Department)
- **Attendance Tracking** – Mark Present/Absent per employee per day; view history
- **Server-side Validation** – Required fields, email format, duplicate ID/email guards
- **Error Handling** – Proper HTTP status codes (400, 404, 409, 422) with meaningful messages

### Bonus
- **Dashboard** – Summary counts: total employees, present/absent today, total records
- **Weekly Bar Chart** – Visual weekly attendance breakdown
- **Attendance Pie Chart** – Present vs absent distribution
- **Department Chart** – Employee distribution by department
- **Present Days Count** – Shown per employee in the employee list
- **Date Filter** – Filter attendance records by a specific date
- **Search Modal** – Quick search across the app
- **Notifications** – Notification dropdown in the header
- **Responsive Sidebar** – Collapsible navigation sidebar

## Project Structure

```
hrms/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLAlchemy engine & session
│   ├── models.py            # ORM models (Employee, Attendance)
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── seed.py              # Database seeder (20 employees, 30 days)
│   ├── requirements.txt
│   └── routers/
│       ├── employees.py     # CRUD for employees
│       ├── attendance.py    # Mark & query attendance
│       └── dashboard.py     # Summary stats & weekly chart
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── App.jsx           # Root component with routing
        ├── main.jsx          # React entry point
        ├── index.css         # Global styles
        ├── api/              # Axios client & endpoint helpers
        │   ├── client.js
        │   ├── employees.js
        │   └── attendance.js
        ├── components/       # Reusable UI components
        │   ├── Sidebar.jsx
        │   ├── PageHeader.jsx
        │   ├── Modal.jsx
        │   ├── Badge.jsx
        │   ├── Spinner.jsx
        │   ├── Toast.jsx
        │   ├── EmptyState.jsx
        │   ├── DatePicker.jsx
        │   ├── Dropdown.jsx
        │   ├── SearchModal.jsx
        │   ├── ProfileDropdown.jsx
        │   ├── NotificationsDropdown.jsx
        │   ├── AttendancePieChart.jsx
        │   ├── DeptChart.jsx
        │   └── WeeklyBarChart.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Employees.jsx
            └── Attendance.jsx
```

## Running Locally

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

### Backend

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Windows (Command Prompt):**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` and interactive docs at `http://localhost:8000/docs`.

The database (`hrms.db`) is auto-created on first run, and 20 sample employees with 30 days of attendance data are seeded automatically.

### Frontend
```bash
cd frontend
cp .env.example .env          # edit VITE_API_URL if needed
npm install
npm run dev
```

> On Windows, use `copy .env.example .env` instead of `cp`.

The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List all employees (with present-day count) |
| POST | `/employees` | Add new employee |
| DELETE | `/employees/{employee_id}` | Delete employee (cascades attendance) |
| POST | `/attendance` | Mark attendance |
| GET | `/attendance/{employee_id}` | Get attendance (optional `?date=YYYY-MM-DD`) |
| GET | `/dashboard` | Summary counts |
| GET | `/dashboard/weekly` | Weekly attendance breakdown (last 7 days) |
| GET | `/health` | Health check |

## Deployment

### Backend (Render)
1. Push repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Create project on [Vercel](https://vercel.com), connect the GitHub repo
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable: `VITE_API_URL=<your-render-backend-url>`
6. Deploy

## Cross-Platform Notes
- The project runs on **macOS, Linux, and Windows** without modification
- Virtual environments (`.venv/`, `venv/`) are excluded from version control — each developer must create their own
- The SQLite database path is resolved using `pathlib` relative to `database.py`, so it works regardless of where you run the server from
- All npm scripts use cross-platform Node tooling (Vite) — no OS-specific commands

## Assumptions & Limitations
- Single admin user; no authentication required
- SQLite database is ephemeral on Render free tier (resets on redeploy) — for production, swap to PostgreSQL
- Leave management, payroll, and other advanced HR features are out of scope
