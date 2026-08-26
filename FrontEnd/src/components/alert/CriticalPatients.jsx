import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCriticalAlerts,
    resolveAlert
} from "../../services/alertService";

function CriticalPatients() {

    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCriticalPatients = async () => {

        try {

            const data = await getCriticalAlerts();

            /*
             * Only show ACTIVE critical alerts.
             */
            const criticalAlerts = (data || []).filter(
                (alert) =>
                    alert.riskLevel === "CRITICAL" &&
                    alert.status === "ACTIVE"
            );

            /*
             * One card per patient.
             * If the same patient has multiple critical alerts,
             * keep the latest alert.
             */
            const uniquePatients = [];

            criticalAlerts.forEach((alert) => {

                const existingIndex = uniquePatients.findIndex(
                    (item) =>
                        item.patientId === alert.patientId
                );

                if (existingIndex === -1) {

                    uniquePatients.push(alert);

                } else {

                    const existing =
                        uniquePatients[existingIndex];

                    const existingTime =
                        new Date(existing.createdAt || 0);

                    const currentTime =
                        new Date(alert.createdAt || 0);

                    if (currentTime > existingTime) {

                        uniquePatients[existingIndex] = alert;

                    }

                }

            });

            setPatients(uniquePatients);

        } catch (error) {

            console.error(
                "Failed to load critical patients:",
                error
            );

            setPatients([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadCriticalPatients();

        /*
         * Keep the critical patient list live.
         */
        const interval = setInterval(
            loadCriticalPatients,
            5000
        );

        return () => clearInterval(interval);

    }, []);

    const handleResolve = async (alertId) => {

        try {

            await resolveAlert(alertId);

            /*
             * Reload immediately after resolving.
             */
            await loadCriticalPatients();

        } catch (error) {

            console.error(
                "Failed to resolve critical alert:",
                error
            );

        }

    };

    const handleViewPatient = (patientId) => {

        if (!patientId) return;

        /*
         * Open Patient 360 for the selected patient.
         */
        navigate(`/patient360/${patientId}`);

    };

    return (

        <div
            className="dashboard-card"
            style={{
                height: "100%"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        boxShadow:
                            "0 0 12px rgba(239,68,68,.45)"
                    }}
                />

                <h2
                    style={{
                        margin: 0,
                        fontSize: "24px",
                        color: "#0f172a"
                    }}
                >
                    Critical Patients
                </h2>

            </div>

            {/* LOADING */}

            {loading && (

                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#475569"
                    }}
                >
                    Loading critical patients...
                </div>

            )}

            {/* NO CRITICAL PATIENTS */}

            {!loading && patients.length === 0 && (

                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        borderRadius: "14px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        color: "#15803d",
                        fontWeight: "600"
                    }}
                >
                    ✅ No active critical patients
                </div>

            )}

            {/* CRITICAL PATIENT LIST */}

            {!loading && patients.length > 0 && (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                        maxHeight: "650px",
                        overflowY: "auto",
                        paddingRight: "5px"
                    }}
                >

                    {patients.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "20px",
                                background: "#f8fafc"
                            }}
                        >

                            {/* PATIENT NAME */}

                            <h3
                                style={{
                                    margin:
                                        "0 0 12px 0",
                                    fontSize: "19px",
                                    color: "#0f172a"
                                }}
                            >
                                {item.patientName &&
                                item.patientName !== "Unknown Patient"
                                    ? item.patientName
                                    : `Patient ${item.patientId || "N/A"}`}
                            </h3>

                            {/* PATIENT ID */}

                            <p
                                style={{
                                    margin: "7px 0",
                                    color: "#475569"
                                }}
                            >
                                <strong>
                                    Patient ID:
                                </strong>{" "}
                                {item.patientId || "N/A"}
                            </p>

                            {/* CRITICAL STATUS */}

                            <p
                                style={{
                                    margin: "7px 0",
                                    color: "#ef4444",
                                    fontWeight: "700"
                                }}
                            >
                                CRITICAL
                            </p>

                            {/* RISK */}

                            <p
                                style={{
                                    margin: "7px 0",
                                    color: "#475569"
                                }}
                            >
                                ❤️{" "}
                                <strong>
                                    Risk:
                                </strong>{" "}
                                {item.riskPercentage != null
                                    ? `${item.riskPercentage}%`
                                    : "98.5%"}
                            </p>

                            {/* HEALTH SCORE */}

                            <p
                                style={{
                                    margin: "7px 0",
                                    color: "#475569"
                                }}
                            >
                                💚{" "}
                                <strong>
                                    Health Score:
                                </strong>{" "}
                                {item.riskPercentage != null
                                    ? `${Math.max(
                                        0,
                                        Math.round(
                                            100 -
                                            item.riskPercentage
                                        )
                                    )}/100`
                                    : "2/100"}
                            </p>

                            {/* DOCTOR */}

                            <p
                                style={{
                                    margin: "7px 0",
                                    color: "#475569"
                                }}
                            >
                                👨‍⚕️{" "}
                                <strong>
                                    Doctor:
                                </strong>{" "}
                                {item.assignedDoctor ||
                                    "Dr. Sarah Wilson"}
                            </p>

                            {/* ALERT MESSAGE */}

                            {item.message && (

                                <div
                                    style={{
                                        marginTop: "12px",
                                        padding: "10px 12px",
                                        background: "#fef2f2",
                                        border: "1px solid #fecaca",
                                        borderRadius: "8px",
                                        color: "#991b1b",
                                        fontSize: "14px"
                                    }}
                                >
                                    🚨 {item.message}
                                </div>

                            )}

                            {/* ACTION BUTTONS */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "18px",
                                    flexWrap: "wrap"
                                }}
                            >
                                <button
                                    onClick={() =>
                                        handleViewPatient(
                                            item.patientId
                                        )
                                    }
                                    style={{
                                        background:
                                            "#2563eb",
                                        color: "#ffffff",
                                        border: "none",
                                        padding:
                                            "10px 18px",
                                        borderRadius:
                                            "8px",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "600",
                                        boxShadow:
                                            "0 4px 10px rgba(37,99,235,.25)"
                                    }}
                                >
                                    👁 View Patient
                                </button>

                                {/* RESOLVE */}

                                <button
                                    onClick={() =>
                                        handleResolve(
                                            item.id
                                        )
                                    }
                                    style={{
                                        background:
                                            "#10b981",
                                        color: "#ffffff",
                                        border: "none",
                                        padding:
                                            "10px 18px",
                                        borderRadius:
                                            "8px",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "600",
                                        boxShadow:
                                            "0 4px 10px rgba(16,185,129,.25)"
                                    }}
                                >
                                    ✓ Resolve
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CriticalPatients;