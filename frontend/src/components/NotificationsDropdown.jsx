import { useState, useEffect, useRef } from "react";

const MOCK_NOTIFICATIONS = [
    { id: 1, text: "New employee added to Engineering", time: "2 min ago", unread: true },
    { id: 2, text: "Attendance marked for today", time: "15 min ago", unread: true },
    { id: 3, text: "3 employees absent today", time: "1 hr ago", unread: false },
    { id: 4, text: "Monthly report ready for download", time: "3 hrs ago", unread: false },
    { id: 5, text: "System maintenance scheduled tonight", time: "5 hrs ago", unread: false },
];

export default function NotificationsDropdown({ open, onClose, anchorRef }) {
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

    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

    return (
        <div className="notif-dropdown" ref={panelRef} role="menu" aria-label="Notifications">
            <div className="notif-header">
                <span className="notif-title">Notifications</span>
                {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount} new</span>
                )}
            </div>
            <ul className="notif-list">
                {MOCK_NOTIFICATIONS.map((n) => (
                    <li key={n.id} className={`notif-item${n.unread ? " notif-item--unread" : ""}`}>
                        <p className="notif-text">{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
