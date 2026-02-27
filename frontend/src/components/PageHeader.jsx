import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import SearchModal from "./SearchModal";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";

const pathToTitle = {
    "/": "Dashboard",
    "/employees": "Employees",
    "/attendance": "Attendance",
};

export default function PageHeader() {
    const { pathname } = useLocation();
    const title = pathToTitle[pathname] ?? "Dashboard";
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const bellRef = useRef(null);
    const avatarRef = useRef(null);

    return (
        <>
            <header className="page-header-bar">
                <h1 className="page-header-title">{title}</h1>
                <div className="page-header-actions">
                    <button
                        type="button"
                        className="page-header-icon-btn"
                        aria-label="Search"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search size={20} aria-hidden />
                    </button>
                    <div className="notif-anchor">
                        <button
                            type="button"
                            className="page-header-icon-btn"
                            aria-label="Notifications"
                            ref={bellRef}
                            onClick={() => setNotifOpen((v) => !v)}
                        >
                            <Bell size={20} aria-hidden />
                        </button>
                        <NotificationsDropdown
                            open={notifOpen}
                            onClose={() => setNotifOpen(false)}
                            anchorRef={bellRef}
                        />
                    </div>
                    <span className="page-header-divider" aria-hidden />
                    <div className="profile-anchor">
                        <button
                            type="button"
                            className="page-header-avatar"
                            aria-label="Profile"
                            ref={avatarRef}
                            onClick={() => setProfileOpen((v) => !v)}
                        >
                            <span aria-hidden>A</span>
                        </button>
                        <ProfileDropdown
                            open={profileOpen}
                            onClose={() => setProfileOpen(false)}
                            anchorRef={avatarRef}
                        />
                    </div>
                </div>
            </header>
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
