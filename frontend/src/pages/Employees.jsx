import { useEffect, useState, useCallback } from "react";
import { Users, Trash2 } from "lucide-react";
import { getEmployees, createEmployee, deleteEmployee } from "../api/employees";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

const DEPARTMENTS = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Legal",
];

const INITIAL_FORM = {
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getEmployees();
            setEmployees(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleFormChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAdd = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department) {
            setFormError("All fields are required. Fill in every field and try again.");
            return;
        }
        setFormLoading(true);
        try {
            await createEmployee(form);
            setShowModal(false);
            setForm(INITIAL_FORM);
            setToast({ message: "Employee added successfully!", type: "success" });
            fetchEmployees();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteEmployee(deleteTarget.employee_id);
            setDeleteTarget(null);
            setToast({ message: `${deleteTarget.full_name} deleted.`, type: "success" });
            fetchEmployees();
        } catch (e) {
            setToast({ message: e.message, type: "error" });
        } finally {
            setDeleteLoading(false);
        }
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
                    <h2 className="page-title">Employees</h2>
                    <p className="page-subtitle">Manage your workforce</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(""); }}>
                    + Add Employee
                </button>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="error-state"><span aria-hidden>⚠</span> {error}</div>
            ) : employees.length === 0 ? (
                <EmptyState
                    icon={<Users size={40} aria-hidden />}
                    title="No employees found"
                    description="Click 'Add Employee' to get started."
                />
            ) : (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Present Days</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td><span className="emp-id">{emp.employee_id}</span></td>
                                    <td className="fw-medium">{emp.full_name}</td>
                                    <td className="text-muted">{emp.email}</td>
                                    <td><span className="dept-chip">{emp.department}</span></td>
                                    <td><span className="present-count">{emp.present_days} days</span></td>
                                    <td className="text-muted">
                                        {new Date(emp.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => setDeleteTarget(emp)}
                                            aria-label={`Delete ${emp.full_name}`}
                                        >
                                            <Trash2 size={14} aria-hidden />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Employee">
                <form onSubmit={handleAdd} className="form">
                    {formError && (
                        <div className="form-error" role="alert" aria-live="polite">
                            {formError}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="emp-id">Employee ID *</label>
                        <input
                            id="emp-id"
                            className="form-input"
                            name="employee_id"
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="e.g. EMP001…"
                            value={form.employee_id}
                            onChange={handleFormChange}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="emp-name">Full Name *</label>
                        <input
                            id="emp-name"
                            className="form-input"
                            name="full_name"
                            autoComplete="name"
                            placeholder="e.g. John Doe…"
                            value={form.full_name}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="emp-email">Email Address *</label>
                        <input
                            id="emp-email"
                            className="form-input"
                            type="email"
                            name="email"
                            autoComplete="email"
                            spellCheck={false}
                            placeholder="e.g. john@company.com…"
                            value={form.email}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="emp-dept">Department *</label>
                        <Dropdown
                            id="emp-dept"
                            name="department"
                            placeholder="Select department"
                            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                            value={form.department}
                            onChange={handleFormChange}
                        />
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
                            {formLoading ? "Adding…" : "Add Employee"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Employee"
            >
                <div className="confirm-body">
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>{deleteTarget?.full_name}</strong>? This will also remove
                        all their attendance records.
                    </p>
                    <div className="form-actions">
                        <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting…" : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
