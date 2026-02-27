import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#a3a3a3"];

export default function AttendancePieChart({ present, absent, unmarked = 0 }) {
    const marked = present + absent;
    const total = marked + unmarked;
    const pct = marked > 0 ? Math.round((present / marked) * 100) : 0;

    const data = [
        { name: "Present", value: present },
        { name: "Absent", value: absent },
        ...(unmarked > 0 ? [{ name: "Unmarked", value: unmarked }] : []),
    ];

    if (total === 0) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">Today's Attendance</h3>
                <p className="chart-empty">No attendance data yet</p>
            </div>
        );
    }

    return (
        <div className="chart-card">
            <h3 className="chart-title">Today's Attendance</h3>
            <div className="pie-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-label">
                    <span className="pie-center-pct">{pct}%</span>
                    <span className="pie-center-sub">Checked In</span>
                </div>
            </div>
            <div className="pie-legend">
                <span className="pie-legend-item">
                    <span className="pie-dot" style={{ background: COLORS[0] }} />
                    Present ({present})
                </span>
                <span className="pie-legend-item">
                    <span className="pie-dot" style={{ background: COLORS[1] }} />
                    Absent ({absent})
                </span>
                {unmarked > 0 && (
                    <span className="pie-legend-item">
                        <span className="pie-dot" style={{ background: COLORS[2] }} />
                        Unmarked ({unmarked})
                    </span>
                )}
            </div>
        </div>
    );
}
