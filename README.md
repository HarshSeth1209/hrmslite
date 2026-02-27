# HRMS Lite – Human Resource Management System

A lightweight, full-stack HR management application for managing employee records and tracking daily attendance.

## Live Demo
- **Frontend:** *(Deploy to Vercel – see Deployment section)*
- **Backend API:** *(Deploy to Render – see Deployment section)*
- **API Docs:** `<backend-url>/docs`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Vanilla CSS |
| Backend | Python 3.11+, FastAPI |
| Database | SQLite (via SQLAlchemy ORM) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

## Features

### Core
- ✅ **Employee Management** – Add, list, and delete employees (ID, Name, Email, Department)
- ✅ **Attendance Tracking** – Mark Present/Absent per employee per day; view history
- ✅ **Server-side Validation** – Required fields, email format, duplicate ID/email guards
- ✅ **Error Handling** – Proper HTTP status codes (400, 404, 409, 422) with meaningful messages

### Bonus
- ⭐ **Dashboard** – Summary counts: total employees, present/absent today, total records
- ⭐ **Present Days Count** – Shown per employee in the employee list
- ⭐ **Date Filter** – Filter attendance records by a specific date

## Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── routers/
│       ├── employees.py
│       ├── attendance.py
│       └── dashboard.py
└── frontend/
    ├── src/
    │   ├── api/          # axios client + helpers
    │   ├── components/   # Modal, Badge, Spinner, EmptyState, Toast, Sidebar
    │   ├── pages/        # Dashboard, Employees, Attendance
    │   ├── App.jsx
    │   └── index.css
    ├── .env.example
    └── index.html
```

## Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
cp .env.example .env          # edit VITE_API_URL if needed
npm install
npm run dev
# App available at http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List all employees (with present-day count) |
| POST | `/employees` | Add new employee |
| DELETE | `/employees/{employee_id}` | Delete employee (cascades attendance) |
| POST | `/attendance` | Mark attendance |
| GET | `/attendance/{employee_id}` | Get attendance (optional `?date=YYYY-MM-DD`) |
| GET | `/dashboard` | Summary counts |
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
3. Set environment variable: `VITE_API_URL=<your-render-backend-url>`
4. Deploy

## Assumptions & Limitations
- Single admin user; no authentication required
- SQLite database is ephemeral on Render free tier (resets on redeploy) – for production, swap to PostgreSQL
- Leave management, payroll, and other advanced HR features are out of scope
