import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PageHeader from "./components/PageHeader";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

export default function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <BrowserRouter>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <div className="app-layout">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
                <div className={`main-content-wrapper${collapsed ? " main-content-wrapper--collapsed" : ""}`}>
                    <PageHeader />
                    <main id="main-content" className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/employees" element={<Employees />} />
                            <Route path="/attendance" element={<Attendance />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}
