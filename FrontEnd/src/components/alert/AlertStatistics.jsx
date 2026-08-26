import { useEffect, useState } from "react";
import { getAlertStatistics } from "../../services/alertService";

function StatCard({ title, value, color }) {
    return (
        <div className="stat-card">
            <h3>{title}</h3>

            <h1 style={{ color }}>{value}</h1>
        </div>
    );
}

function AlertStatistics() {

    const [stats, setStats] = useState({
        totalAlerts: 0,
        criticalAlerts: 0,
        activeAlerts: 0,
        acknowledgedAlerts: 0,
    });

    const loadStatistics = async () => {

        try {

            const data = await getAlertStatistics();

            setStats(data);

        } catch (error) {

            console.error("Failed to load alert statistics", error);

        }

    };

    useEffect(() => {

        loadStatistics();

        const interval = setInterval(loadStatistics, 5000);

        return () => clearInterval(interval);

    }, []);

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px",
            }}
        >

            <StatCard
                title="Total Alerts"
                value={stats.totalAlerts}
                color="#3b82f6"
            />

            <StatCard
                title="Critical Alerts"
                value={stats.criticalAlerts}
                color="#DC2626"
            />

            <StatCard
                title="Active Alerts"
                value={stats.activeAlerts}
                color="#EA580C"
            />

            <StatCard
                title="Acknowledged"
                value={stats.acknowledgedAlerts}
                color="#16A34A"
            />

        </div>

    );

}

export default AlertStatistics;