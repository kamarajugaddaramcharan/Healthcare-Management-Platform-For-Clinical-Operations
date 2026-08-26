import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { getAllVitals } from "../../services/vitalService";

function HeartRateChart() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        loadVitals();
    }, []);

    const loadVitals = async () => {
        try {
            const data = await getAllVitals();

            const formatted = data.slice(0, 10).map((item, index) => ({
                name: `P${index + 1}`,
                heartRate: item.heartRate,
            }));

            setChartData(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className="dashboard-card"
        >
            <h2 style={{ margin: "0 0 18px 0", fontSize: "20px" }}>Heart Rate Monitoring</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#ef4444"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default HeartRateChart;