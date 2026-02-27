import { useEffect, useState } from "react";
import { getDashboard } from "../api/attendance";
import { getEmployees } from "../api/employees";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";

function StatCard({ label, value, icon, accent }) {
    return (
        <div className="stat-card" style={{ "--accent": accent }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, emps] = await Promise.all([getDashboard(), getEmployees()]);
                setSummary(s);
                setEmployees(emps);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error)
        return (
            <div className="error-state">
                <span>⚠</span> {error}
            </div>
        );

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of your HR operations today</p>
            </div>

            <div className="stats-grid">
                <StatCard
                    label="Total Employees"
                    value={summary.total_employees}
                    icon="👥"
                    accent="#58a6ff"
                />
                <StatCard
                    label="Present Today"
                    value={summary.present_today}
                    icon="✅"
                    accent="#3fb950"
                />
                <StatCard
                    label="Absent Today"
                    value={summary.absent_today}
                    icon="❌"
                    accent="#f85149"
                />
                <StatCard
                    label="Total Records"
                    value={summary.total_attendance_records}
                    icon="📅"
                    accent="#d2a8ff"
                />
            </div>

            <div className="section">
                <h2 className="section-title">Employees Overview</h2>
                {employees.length === 0 ? (
                    <EmptyState
                        icon="👥"
                        title="No employees yet"
                        description="Add your first employee from the Employees page."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Present Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>
                                            <span className="emp-id">{emp.employee_id}</span>
                                        </td>
                                        <td>{emp.full_name}</td>
                                        <td>
                                            <span className="dept-chip">{emp.department}</span>
                                        </td>
                                        <td>
                                            <span className="present-count">
                                                {emp.present_days} days
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
