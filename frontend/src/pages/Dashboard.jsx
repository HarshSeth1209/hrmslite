import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, CalendarDays, TrendingUp, Building2 } from "lucide-react";
import { getDashboard, getWeeklyAttendance } from "../api/attendance";
import { getEmployees } from "../api/employees";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import AttendancePieChart from "../components/AttendancePieChart";
import WeeklyBarChart from "../components/WeeklyBarChart";
import DeptChart from "../components/DeptChart";

const EMPTY_SUMMARY = {
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    unmarked_today: 0,
    total_attendance_records: 0,
};

function StatCard({ label, value, icon, iconBg, iconColor, valueColor }) {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <p className="stat-label">{label}</p>
                <div
                    className="stat-icon-circle"
                    style={{ background: iconBg, color: iconColor }}
                >
                    {icon}
                </div>
            </div>
            <p className="stat-value" style={{ color: valueColor }}>
                {value}
            </p>
        </div>
    );
}

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, emps, weekly] = await Promise.all([
                    getDashboard(),
                    getEmployees(),
                    getWeeklyAttendance(),
                ]);

                setSummary(s && typeof s.total_employees === "number" ? s : EMPTY_SUMMARY);
                setEmployees(Array.isArray(emps) ? emps : []);
                setWeeklyData(Array.isArray(weekly) ? weekly : []);
            } catch {
                setSummary(EMPTY_SUMMARY);
                setEmployees([]);
                setWeeklyData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error && !summary)
        return (
            <div className="error-state">
                <span aria-hidden>⚠</span> {error}
            </div>
        );

    const uniqueDepts = new Set(employees.map((e) => e.department)).size;
    const markedTotal = summary.present_today + summary.absent_today;
    const avgRate =
        markedTotal > 0
            ? Math.round((summary.present_today / markedTotal) * 100)
            : 0;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Overview</h2>
                    <p className="page-subtitle">Your HR operations at a glance</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    label="Total Employees"
                    value={summary.total_employees}
                    icon={<Users size={22} aria-hidden />}
                    iconBg="rgba(99, 102, 241, 0.10)"
                    iconColor="#6366f1"
                    valueColor="#312e81"
                />
                <StatCard
                    label="Present Today"
                    value={summary.present_today}
                    icon={<CheckCircle size={22} aria-hidden />}
                    iconBg="rgba(34, 197, 94, 0.10)"
                    iconColor="#22c55e"
                    valueColor="#166534"
                />
                <StatCard
                    label="Absent Today"
                    value={summary.absent_today}
                    icon={<XCircle size={22} aria-hidden />}
                    iconBg="rgba(239, 68, 68, 0.10)"
                    iconColor="#ef4444"
                    valueColor="#991b1b"
                />
                <StatCard
                    label="Attendance Rate"
                    value={`${avgRate}%`}
                    icon={<TrendingUp size={22} aria-hidden />}
                    iconBg="rgba(34, 197, 94, 0.10)"
                    iconColor="#22c55e"
                    valueColor="#166534"
                />
                <StatCard
                    label="Departments"
                    value={uniqueDepts}
                    icon={<Building2 size={22} aria-hidden />}
                    iconBg="rgba(59, 130, 246, 0.10)"
                    iconColor="#3b82f6"
                    valueColor="#1e3a5f"
                />
                <StatCard
                    label="Total Records"
                    value={summary.total_attendance_records}
                    icon={<CalendarDays size={22} aria-hidden />}
                    iconBg="rgba(168, 85, 247, 0.10)"
                    iconColor="#a855f7"
                    valueColor="#581c87"
                />
            </div>

            <div className="charts-grid">
                <AttendancePieChart
                    present={summary.present_today}
                    absent={summary.absent_today}
                    unmarked={summary.unmarked_today}
                />
                <WeeklyBarChart data={weeklyData} />
                <DeptChart employees={employees} />
            </div>

            <div className="section">
                <h2 className="section-title">Employees Overview</h2>
                {employees.length === 0 ? (
                    <EmptyState
                        icon={<Users size={40} aria-hidden />}
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
