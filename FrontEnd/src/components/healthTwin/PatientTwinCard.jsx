import {
    User,
    Shield,
    Clock,
} from "lucide-react";

import VitalsGrid from "./VitalsGrid";
import HealthScore from "./HealthScore";
import AIHealthSummary from "./AIHealthSummary";
import TwinActions from "./TwinActions";

function PatientTwinCard({ twin }) {

    // =========================================================
    // CALCULATE HEALTH SCORE FROM REAL VITALS
    // =========================================================

    const heartRate = Number(twin.heartRate);
    const oxygen = Number(
        twin.oxygenLevel ?? twin.spo2
    );
    const temperature = Number(twin.temperature);

    let score = 100;

    if (!Number.isNaN(heartRate)) {
        if (heartRate > 140) {
            score -= 35;
        } else if (heartRate > 120) {
            score -= 20;
        } else if (heartRate > 100) {
            score -= 10;
        }
    }

    if (!Number.isNaN(oxygen)) {
        if (oxygen < 88) {
            score -= 40;
        } else if (oxygen < 92) {
            score -= 25;
        } else if (oxygen < 95) {
            score -= 10;
        }
    }

    if (!Number.isNaN(temperature)) {
        if (temperature > 39.5) {
            score -= 20;
        } else if (temperature > 38.5) {
            score -= 10;
        }
    }

    score = Math.max(
        0,
        Math.min(100, score)
    );

    // =========================================================
    // STATUS
    // =========================================================

    const getStatus = () => {

        if (
            (!Number.isNaN(heartRate) &&
                heartRate > 140) ||

            (!Number.isNaN(oxygen) &&
                oxygen < 88) ||

            (!Number.isNaN(temperature) &&
                temperature > 39.5)
        ) {
            return "Critical";
        }

        if (
            (!Number.isNaN(heartRate) &&
                heartRate > 120) ||

            (!Number.isNaN(oxygen) &&
                oxygen < 92) ||

            (!Number.isNaN(temperature) &&
                temperature > 38.5)
        ) {
            return "High Risk";
        }

        return "Healthy";
    };

    const status = getStatus();

    const isHealthy =
        status === "Healthy";

    // =========================================================
    // LAST UPDATE
    // =========================================================

    const lastUpdate =
        twin.lastVitalUpdate
            ? new Date(
                twin.lastVitalUpdate
            ).toLocaleTimeString()
            : "Just now";

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 25,
                boxShadow:
                    "0 15px 35px rgba(0,0,0,.08)",
                transition: ".3s",
                border:
                    "1px solid #e2e8f0",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: 18,
                        alignItems: "center",
                    }}
                >

                    <div
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg,#2563eb,#60a5fa)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            color: "#fff",
                        }}
                    >
                        <User size={34} />
                    </div>

                    <div>

                        <h4
                            style={{
                                marginBottom: 5,
                                fontWeight: 700,
                            }}
                        >
                            Patient #
                            {twin.patientId}
                        </h4>

                        <div
                            style={{
                                color:
                                    "#64748b",
                            }}
                        >
                            Digital Health Twin
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginTop: 10,
                                alignItems:
                                    "center",
                                color:
                                    "#64748b",
                            }}
                        >
                            <Clock size={16} />

                            <small>
                                Updated{" "}
                                {lastUpdate}
                            </small>
                        </div>

                    </div>

                </div>

                {/* STATUS */}

                <span
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        background:
                            isHealthy
                                ? "#22c55e"
                                : "#ef4444",
                        color: "#fff",
                        padding:
                            "10px 18px",
                        borderRadius: 40,
                        fontWeight: 600,
                    }}
                >

                    <Shield
                        size={16}
                        style={{
                            marginRight: 6,
                        }}
                    />

                    {status}

                </span>

            </div>

            {/* =================================================
                REAL LIVE VITALS
            ================================================= */}

            <VitalsGrid
                twin={twin}
            />

            {/* =================================================
                BOTTOM
            ================================================= */}

            <div className="row mt-4">

                <div className="col-lg-4">

                    <HealthScore
                        score={score}
                    />

                </div>

                <div className="col-lg-5">

                    <AIHealthSummary
                        twin={twin}
                    />

                </div>

                <div className="col-lg-3">

                    <TwinActions
                        twin={twin}
                    />

                </div>

            </div>

        </div>
    );
}

export default PatientTwinCard;