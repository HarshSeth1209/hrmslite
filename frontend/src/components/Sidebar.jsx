import { NavLink } from "react-router-dom";

const navItems = [
    { to: "/", label: "Dashboard", icon: "⊞" },
    { to: "/employees", label: "Employees", icon: "👥" },
    { to: "/attendance", label: "Attendance", icon: "📅" },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">HR</span>
                <span className="sidebar-name">HRMS Lite</span>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? " sidebar-link--active" : ""}`
                        }
                    >
                        <span className="sidebar-link-icon">{icon}</span>
                        <span>{label}</span>
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
