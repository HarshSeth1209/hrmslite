import { useEffect, useState, useCallback } from "react";
import { CalendarCheck } from "lucide-react";
import { getEmployees } from "../api/employees";
import { markAttendance, getAttendance } from "../api/attendance";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import DatePicker from "../components/DatePicker";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [records, setRecords] = useState([]);
    const [dateFilter, setDateFilter] = useState("");
    const [loadingEmps, setLoadingEmps] = useState(true);
    const [loadingRec, setLoadingRec] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ date: "", status: "Present" });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });

    // Helper: today's date in YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const fetchEmployees = useCallback(async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
            if (data.length > 0 && !selectedEmp) setSelectedEmp(data[0]);
        } catch (e) {
            setToast({ message: e.message, type: "error" });
        } finally {
            setLoadingEmps(false);
        }
    }, [selectedEmp]);

    const fetchRecords = useCallback(async () => {
        if (!selectedEmp) return;
        setLoadingRec(true);
        try {
            const data = await getAttendance(selectedEmp.employee_id, dateFilter || null);
            setRecords(data);
        } catch (e) {
            if (e.message && e.message.includes("not found")) {
                setRecords([]);
            } else {
                setToast({ message: e.message, type: "error" });
            }
        } finally {
            setLoadingRec(false);
        }
    }, [selectedEmp, dateFilter]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!form.date) {
            setFormError("Date is required. Pick a date and try again.");
            return;
        }
        setFormLoading(true);
        try {
            await markAttendance({
                employee_id: selectedEmp.employee_id,
                date: form.date,
                status: form.status,
            });
            setShowModal(false);
            setForm({ date: today, status: "Present" });
            setToast({ message: "Attendance marked successfully!", type: "success" });
            fetchRecords();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setFormLoading(false);
        }
    };

    const openModal = () => {
        setForm({ date: today, status: "Present" });
        setFormError("");
        setShowModal(true);
    };

    return (
        <div className="page">
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "" })}
            />

            <div className="page-header">
                <div>
                    <h2 className="page-title">Attendance</h2>
                    <p className="page-subtitle">Track daily attendance records</p>
                </div>
                {selectedEmp && (
                    <button type="button" className="btn btn-primary" onClick={openModal}>
                        + Mark Attendance
                    </button>
                )}
            </div>

            {loadingEmps ? (
                <Spinner />
            ) : employees.length === 0 ? (
                <EmptyState
                    icon={<CalendarCheck size={40} aria-hidden />}
                    title="No employees yet"
                    description="Add employees first before tracking attendance."
                />
            ) : (
                <>
                    {/* Controls */}
                    <div className="attendance-controls">
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="att-emp-select">Select Employee</label>
                            <Dropdown
                                id="att-emp-select"
                                options={employees.map((emp) => ({
                                    value: emp.employee_id,
                                    label: `${emp.full_name} (${emp.employee_id})`,
                                }))}
                                value={selectedEmp?.employee_id || ""}
                                onChange={(e) => {
                                    const emp = employees.find((x) => x.employee_id === e.target.value);
                                    setSelectedEmp(emp);
                                    setDateFilter("");
                                }}
                                placeholder="Select employee"
                            />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="att-date-filter">Filter by Date</label>
                            <DatePicker
                                id="att-date-filter"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                placeholder="All dates"
                            />
                        </div>
                        {dateFilter && (
                            <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ alignSelf: "flex-end" }}
                                onClick={() => setDateFilter("")}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Employee info strip */}
                    {selectedEmp && (
                        <div className="emp-strip">
                            <strong>{selectedEmp.full_name}</strong>
                            <span className="emp-id">{selectedEmp.employee_id}</span>
                            <span className="dept-chip">{selectedEmp.department}</span>
                            <span className="present-count">
                                {selectedEmp.present_days} present days
                            </span>
                        </div>
                    )}

                    {/* Records table */}
                    {loadingRec ? (
                        <Spinner />
                    ) : records.length === 0 ? (
                        <EmptyState
                            icon={<CalendarCheck size={40} aria-hidden />}
                            title="No attendance records"
                            description={
                                dateFilter
                                    ? `No records for ${dateFilter}.`
                                    : "No attendance has been marked for this employee."
                            }
                        />
                    ) : (
                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Marked At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((rec, i) => (
                                        <tr key={rec.id}>
                                            <td className="text-muted">{i + 1}</td>
                                            <td>{rec.date}</td>
                                            <td>
                                                <Badge status={rec.status} />
                                            </td>
                                            <td className="text-muted">
                                                {new Date(rec.marked_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Mark Attendance Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`Mark Attendance – ${selectedEmp?.full_name || ""}`}
            >
                <form onSubmit={handleMarkAttendance} className="form">
                    {formError && (
                        <div className="form-error" role="alert" aria-live="polite">
                            {formError}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="att-date">Date *</label>
                        <DatePicker
                            id="att-date"
                            value={form.date}
                            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                            max={today}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <span className="form-label" id="att-status-label">Status *</span>
                        <div className="radio-group" role="group" aria-labelledby="att-status-label">
                            {["Present", "Absent"].map((s) => (
                                <label key={s} className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={form.status === s}
                                        onChange={() => setForm((p) => ({ ...p, status: s }))}
                                    />
                                    <Badge status={s} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={formLoading}
                        >
                            {formLoading ? "Saving…" : "Mark Attendance"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
