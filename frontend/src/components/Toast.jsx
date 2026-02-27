import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`toast toast-${type}`} role="alert">
            <span>{type === "success" ? "✓" : "✕"}</span>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose} aria-label="Dismiss">×</button>
        </div>
    );
}
