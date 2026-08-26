import { useEffect, useState } from "react";
import {
    getCriticalAlerts,
    acknowledgeAlert
} from "../../services/alertService";

function CriticalAlertPopup() {

    const [alert, setAlert] = useState(null);

    const loadCriticalAlert = async () => {

        try {

            const alerts = await getCriticalAlerts();

            const activeAlerts = (alerts || []).filter(
                (item) =>
                    item.status === "ACTIVE" &&
                    item.acknowledged === false
            );

            if (activeAlerts.length === 0) {
                setAlert(null);
                return;
            }

            // Get newest alert
            const latestAlert = activeAlerts.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            )[0];

            setAlert(latestAlert);

        } catch (error) {

            console.error(
                "Failed to load critical alert:",
                error
            );

        }

    };

    useEffect(() => {

        loadCriticalAlert();

        const interval = setInterval(
            loadCriticalAlert,
            5000
        );

        return () => clearInterval(interval);

    }, []);

    const handleAcknowledge = async () => {

        if (!alert?.id) return;

        try {

            await acknowledgeAlert(alert.id);

            setAlert(null);

        } catch (error) {

            console.error(
                "Failed to acknowledge alert:",
                error
            );

        }

    };

    if (!alert) {
        return null;
    }

    return (

        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                width: "360px",
                maxWidth: "calc(100vw - 40px)",
                background: "#ffffff",
                borderLeft: "8px solid #dc2626",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 15px 40px rgba(0,0,0,.25)",
                zIndex: 9999,
                color: "#374151"
            }}
        >

            <h3
                style={{
                    color: "#dc2626",
                    margin: "0 0 14px 0"
                }}
            >
                🚨 Critical Alert
            </h3>

            <p>
                <strong>Patient :</strong>{" "}
                {alert.patientName &&
                alert.patientName !== "Unknown Patient"
                    ? alert.patientName
                    : `Patient ${alert.patientId || "N/A"}`}
            </p>

            <p>
                <strong>Patient ID :</strong>{" "}
                {alert.patientId}
            </p>

            <p>
                <strong>Risk Level :</strong>{" "}
                <span
                    style={{
                        color: "#dc2626",
                        fontWeight: "bold"
                    }}
                >
                    {alert.riskLevel}
                </span>
            </p>

            <p>
                <strong>Risk :</strong>{" "}
                {alert.riskPercentage ?? "--"}%
            </p>

            <p>
                <strong>Doctor :</strong>{" "}
                {alert.assignedDoctor || "Not Assigned"}
            </p>

            <p>
                <strong>Message :</strong>
            </p>

            <div
                style={{
                    background: "#fef2f2",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "15px",
                    color: "#374151"
                }}
            >
                {alert.message ||
                    "Critical vital signs detected"}
            </div>

            <p
                style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "12px"
                }}
            >
                Detected:{" "}
                {alert.createdAt
                    ? new Date(
                        alert.createdAt
                    ).toLocaleString()
                    : "Just now"}
            </p>

            <button
                style={{
                    width: "100%",
                    padding: "12px",
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                onClick={handleAcknowledge}
            >
                ✅ Acknowledge Alert
            </button>

        </div>

    );
}

export default CriticalAlertPopup;