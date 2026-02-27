import { useEffect } from "react";
import { Check, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`toast toast-${type}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <span aria-hidden>{type === "success" ? <Check size={18} /> : <X size={18} />}</span>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose} aria-label="Dismiss">
                <X size={16} aria-hidden />
            </button>
        </div>
    );
}
