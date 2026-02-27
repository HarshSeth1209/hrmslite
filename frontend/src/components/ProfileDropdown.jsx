import { useEffect, useRef } from "react";
import { Shield } from "lucide-react";

export default function ProfileDropdown({ open, onClose, anchorRef }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(e.target)
            ) {
                onClose();
            }
        };
        const keyHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("keydown", keyHandler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", keyHandler);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    return (
        <div className="profile-dropdown" ref={panelRef} role="menu" aria-label="User profile">
            <div className="profile-dropdown__section">
                <div className="profile-dropdown__item">
                    <Shield size={15} aria-hidden />
                    <span className="profile-dropdown__item-label">Role</span>
                    <span className="profile-dropdown__role-badge">Administrator</span>
                </div>
            </div>
        </div>
    );
}
