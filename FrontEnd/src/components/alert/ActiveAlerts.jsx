import { useEffect, useState } from "react";
import {
    getAllAlerts,
    acknowledgeAlert,
    resolveAlert
} from "../../services/alertService";

function ActiveAlerts() {

    const [alerts, setAlerts] = useState([]);

    const loadAlerts = async () => {

        try {

            const data = await getAllAlerts();

            const activeAlerts = data.filter(
                (item) => item.status === "ACTIVE"
            );

            setAlerts(activeAlerts);

        } catch (error) {

            console.error("Error loading alerts", error);

        }

    };

    useEffect(() => {

        loadAlerts();

        const interval = setInterval(loadAlerts, 5000);

        return () => clearInterval(interval);

    }, []);

    const handleAcknowledge = async (id) => {

        try {

            await acknowledgeAlert(id);

            loadAlerts();

        } catch (error) {

            console.error(error);

        }

    };

    const handleResolve = async (id) => {

        try {

            await resolveAlert(id);

            loadAlerts();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="dashboard-card">

            <h2>🚨 Active Alerts</h2>

            {alerts.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#94a3b8"
                    }}
                >
                    ✅ No Active Alerts
                </div>

            ) : (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "650px",
                        overflowY: "auto",
                        paddingRight: "5px"
                    }}
                >
                    {alerts.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "15px",
                                marginBottom: "15px",
                                background: "#f8fafc",
                                color: "#475569"
                            }}
                        >

                            <h3 style={{ color: "#0f172a", margin: "0 0 10px 0" }}>
                                {item.patientName &&
                                item.patientName !== "Unknown Patient"
                                    ? item.patientName
                                    : `Patient ${item.patientId || "N/A"}`}
                            </h3>

                            <p style={{ margin: "6px 0" }}>
                                <strong>Patient ID:</strong> {item.patientId}
                            </p>

                            <p style={{ margin: "6px 0" }}>
                                <strong>Risk:</strong>{" "}
                                <span
                                    style={{
                                        color:
                                            item.riskLevel === "CRITICAL"
                                                ? "#ef4444"
                                                : "#f59e0b",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {item.riskLevel}
                                </span>
                            </p>

                            <p style={{ margin: "6px 0" }}>
                                <strong>Doctor:</strong> {item.assignedDoctor}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "18px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <button
                                    onClick={() => handleAcknowledge(item.id)}
                                    style={{
                                        background: "#F59E0B",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 10px rgba(245,158,11,.3)"
                                    }}
                                >
                                    ✅ Acknowledge
                                </button>

                                <button
                                    onClick={() => handleResolve(item.id)}
                                    style={{
                                        background: "#10B981",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 10px rgba(16,185,129,.3)"
                                    }}
                                >
                                    ✔ Resolve
                                </button>

                            </div>

                        </div>

                    ))}
                </div>

            )}

        </div>

    );

}

export default ActiveAlerts;