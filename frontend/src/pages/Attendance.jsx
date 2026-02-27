import { useEffect, useState, useCallback } from "react";
import { getEmployees } from "../api/employees";
import { markAttendance, getAttendance } from "../api/attendance";
import Modal from "../components/Modal";
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
    }, []);

    const fetchRecords = useCallback(async () => {
        if (!selectedEmp) return;
        setLoadingRec(true);
        try {
            const data = await getAttendance(selectedEmp.employee_id, dateFilter || null);
            setRecords(data);
        } catch (e) {
            setToast({ message: e.message, type: "error" });
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
            setFormError("Date is required.");
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
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Track daily attendance records</p>
                </div>
                {selectedEmp && (
                    <button className="btn btn-primary" onClick={openModal}>
                        + Mark Attendance
                    </button>
                )}
            </div>

            {loadingEmps ? (
                <Spinner />
            ) : employees.length === 0 ? (
                <EmptyState
                    icon="📅"
                    title="No employees yet"
                    description="Add employees first before tracking attendance."
                />
            ) : (
                <>
                    {/* Controls */}
                    <div className="attendance-controls">
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Select Employee</label>
                            <select
                                id="att-emp-select"
                                className="form-input"
                                value={selectedEmp?.employee_id || ""}
                                onChange={(e) => {
                                    const emp = employees.find((x) => x.employee_id === e.target.value);
                                    setSelectedEmp(emp);
                                    setDateFilter("");
                                }}
                            >
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.employee_id}>
                                        {emp.full_name} ({emp.employee_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Filter by Date</label>
                            <input
                                id="att-date-filter"
                                className="form-input"
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        {dateFilter && (
                            <button
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
                            icon="📅"
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
                    {formError && <div className="form-error">{formError}</div>}
                    <div className="form-group">
                        <label className="form-label">Date *</label>
                        <input
                            id="att-date"
                            className="form-input"
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                            max={today}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status *</label>
                        <div className="radio-group">
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
