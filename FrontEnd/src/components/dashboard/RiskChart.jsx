import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "High Risk", value: 120 },
    { name: "Moderate", value: 80 },
    { name: "Low Risk", value: 106 },
];

const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

function RiskChart() {
    return (
        <div
            className="dashboard-card"
        >
            <h2 style={{ margin: "0 0 18px 0", fontSize: "20px" }}>AI Risk Distribution</h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RiskChart;