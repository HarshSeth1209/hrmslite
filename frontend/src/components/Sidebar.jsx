import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, Menu } from "lucide-react";

const navItems = [
    { to: "/", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/employees", label: "Employees", Icon: Users },
    { to: "/attendance", label: "Attendance", Icon: CalendarCheck },
];

export default function Sidebar({ collapsed, onToggle }) {
    return (
        <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
            <div className="sidebar-brand">
                <span className="sidebar-logo" aria-label="HRMS Logo">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-logo-svg">
                        <defs>
                            <linearGradient id="logoBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <linearGradient id="personGrad" x1="14" y1="8" x2="26" y2="34" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#e0d4fc" />
                            </linearGradient>
                        </defs>
                        <rect width="40" height="40" rx="10" fill="url(#logoBg)" />
                        {/* Person head */}
                        <circle cx="20" cy="14" r="5" fill="url(#personGrad)" />
                        {/* Person body arc */}
                        <path d="M10 33 C10 25, 14 21, 20 21 C26 21, 30 25, 30 33" fill="url(#personGrad)" />
                        {/* Accent nodes — network/system dots */}
                        <circle cx="8" cy="14" r="1.8" fill="#c4b5fd" opacity="0.7" />
                        <circle cx="32" cy="14" r="1.8" fill="#c4b5fd" opacity="0.7" />
                        <line x1="12.5" y1="14" x2="9.8" y2="14" stroke="#c4b5fd" strokeWidth="0.8" opacity="0.5" />
                        <line x1="27.5" y1="14" x2="30.2" y2="14" stroke="#c4b5fd" strokeWidth="0.8" opacity="0.5" />
                    </svg>
                </span>
                <span className="sidebar-name">HRMS Lite</span>
                <button
                    type="button"
                    className="sidebar-hamburger"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    onClick={onToggle}
                >
                    <Menu size={20} aria-hidden />
                </button>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? " sidebar-link--active" : ""}`
                        }
                        title={collapsed ? label : undefined}
                    >
                        <span className="sidebar-link-icon" aria-hidden>
                            <Icon size={20} />
                        </span>
                        <span className="sidebar-link-text">{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <p>HRMS Lite v1.0</p>
                <p>Admin Panel</p>
            </div>
        </aside>
    );
}
