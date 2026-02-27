import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function DeptChart({ employees }) {
    if (!employees || employees.length === 0) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">Employees by Department</h3>
                <p className="chart-empty">No employee data yet</p>
            </div>
        );
    }

    const counts = {};
    employees.forEach((e) => {
        counts[e.department] = (counts[e.department] || 0) + 1;
    });
    const data = Object.entries(counts)
        .map(([dept, count]) => ({ dept, count }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="chart-card">
            <h3 className="chart-title">Employees by Department</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical" barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="dept"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={100}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 13,
                        }}
                    />
                    <Bar dataKey="count" name="Employees" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
