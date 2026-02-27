import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

function formatDay(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function WeeklyBarChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">Attendance This Week</h3>
                <p className="chart-empty">No weekly data yet</p>
            </div>
        );
    }

    const formatted = data.map((d) => ({
        ...d,
        day: formatDay(d.date),
    }));

    return (
        <div className="chart-card">
            <h3 className="chart-title">Attendance This Week</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={formatted} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 13,
                        }}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    />
                    <Bar dataKey="present" name="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
