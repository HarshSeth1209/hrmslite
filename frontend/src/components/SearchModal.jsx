import { useState, useEffect, useRef } from "react";
import { Search, X, UserSearch } from "lucide-react";
import { getEmployees } from "../api/employees";
import { MOCK_EMPLOYEES } from "../data/mockEmployees";

export default function SearchModal({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            getEmployees()
                .then((data) => {
                    setEmployees(data && data.length > 0 ? data : MOCK_EMPLOYEES);
                })
                .catch(() => setEmployees(MOCK_EMPLOYEES))
                .finally(() => setLoading(false));
            setQuery("");
        }
    }, [open]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open, loading]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    const q = query.trim().toLowerCase();
    const filtered = q.length === 0
        ? employees
        : employees.filter(
            (e) =>
                e.full_name.toLowerCase().includes(q) ||
                e.employee_id.toLowerCase().includes(q) ||
                e.email.toLowerCase().includes(q) ||
                e.department.toLowerCase().includes(q)
        );

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search employees">
            <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-header">
                    <Search size={18} aria-hidden className="search-modal-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-modal-input"
                        placeholder="Search by name, ID, email, or department…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search employees"
                    />
                    {query && (
                        <button
                            type="button"
                            className="search-modal-clear"
                            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                            aria-label="Clear search"
                        >
                            <X size={14} aria-hidden />
                        </button>
                    )}
                    <button type="button" className="search-modal-close" onClick={onClose} aria-label="Close search">
                        <X size={18} aria-hidden />
                    </button>
                </div>
                <div className="search-modal-results">
                    {loading ? (
                        <p className="search-modal-empty">Loading…</p>
                    ) : filtered.length === 0 ? (
                        <div className="search-no-results">
                            <UserSearch size={36} aria-hidden className="search-no-results-icon" />
                            <p className="search-no-results-title">No record found</p>
                            <p className="search-no-results-hint">
                                No employee matches "{query}". Try a different name, ID, email, or department.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="search-modal-count" aria-live="polite">
                                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                                {q.length > 0 && <> for "<strong>{query}</strong>"</>}
                            </p>
                            <ul className="search-modal-list">
                                {filtered.map((emp) => (
                                    <li key={emp.id} className="search-modal-item">
                                        <div className="search-modal-avatar">
                                            {emp.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className="search-modal-item-info">
                                            <span className="search-modal-name">{emp.full_name}</span>
                                            <span className="search-modal-email">{emp.email}</span>
                                        </div>
                                        <div className="search-modal-item-right">
                                            <span className="search-modal-dept">{emp.department}</span>
                                            <span className="search-modal-id">{emp.employee_id}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
