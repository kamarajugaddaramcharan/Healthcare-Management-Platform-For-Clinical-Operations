import { useEffect, useState } from "react";
import {
    Heart,
    Activity,
    Droplets,
    Thermometer,
    Brain,
    ShieldCheck,
    Clock,
} from "lucide-react";

function PatientHealthTwin() {

    const [vitals, setVitals] = useState({
        heartRate: 76,
        bloodPressure: "116/77",
        oxygen: 98,
        temperature: 36.8,
    });

    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Simulate live patient monitoring
    useEffect(() => {

        const updateVitals = () => {

            setVitals({
                heartRate:
                    Math.floor(Math.random() * 20) + 70,

                bloodPressure:
                    `${Math.floor(Math.random() * 15) + 110}/${Math.floor(
                        Math.random() * 15
                    ) + 70}`,

                oxygen:
                    Math.floor(Math.random() * 3) + 97,

                temperature:
                    (36.5 + Math.random() * 0.8).toFixed(1),
            });

            setLastUpdated(new Date());
        };

        const interval = setInterval(
            updateVitals,
            5000
        );

        return () => clearInterval(interval);

    }, []);

    return (
        <div
            style={{
                width: "100%",
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: 22,
                    padding: 30,
                    marginBottom: 24,
                    boxShadow:
                        "0 10px 30px rgba(15,23,42,.06)",
                    border:
                        "1px solid #e5eaf2",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20,
                        flexWrap: "wrap",
                    }}
                >

                    <div>

                        <h1
                            style={{
                                margin: 0,
                                color: "#0f172a",
                                fontSize: 32,
                                fontWeight: 800,
                            }}
                        >
                            My Digital Health Twin
                        </h1>

                        <p
                            style={{
                                marginTop: 8,
                                marginBottom: 0,
                                color: "#64748b",
                                fontSize: 16,
                            }}
                        >
                            AI-powered representation of your
                            current health status
                        </p>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#dcfce7",
                            color: "#15803d",
                            padding: "10px 16px",
                            borderRadius: 999,
                            fontWeight: 700,
                        }}
                    >

                        <span
                            style={{
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: "#22c55e",
                                boxShadow:
                                    "0 0 10px rgba(34,197,94,.7)",
                            }}
                        />

                        Live Monitoring

                    </div>

                </div>

                <div
                    style={{
                        marginTop: 18,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#64748b",
                        fontSize: 14,
                    }}
                >

                    <Clock size={16} />

                    Last updated:{" "}
                    {lastUpdated.toLocaleTimeString()}

                    <span
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        • Updates every 5 seconds
                    </span>

                </div>

            </div>


            {/* HEALTH SCORE */}

            <div
                style={{
                    background:
                        "linear-gradient(135deg,#111827,#1e3a8a)",
                    borderRadius: 24,
                    padding: 30,
                    marginBottom: 24,
                    color: "#ffffff",
                    boxShadow:
                        "0 15px 35px rgba(15,23,42,.15)",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 25,
                    }}
                >

                    <div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 10,
                            }}
                        >

                            <Brain size={26} />

                            <h2
                                style={{
                                    margin: 0,
                                }}
                            >
                                Health Score
                            </h2>

                        </div>

                        <p
                            style={{
                                margin: 0,
                                color: "#cbd5e1",
                            }}
                        >
                            Overall health condition based
                            on your current health data.
                        </p>

                    </div>

                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border:
                                "10px solid #22c55e",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#172554",
                        }}
                    >

                        <strong
                            style={{
                                fontSize: 30,
                                color: "#22c55e",
                            }}
                        >
                            94%
                        </strong>

                        <span
                            style={{
                                fontSize: 13,
                                color: "#cbd5e1",
                            }}
                        >
                            Healthy
                        </span>

                    </div>

                </div>

            </div>


            {/* VITALS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(240px,1fr))",
                    gap: 20,
                    marginBottom: 24,
                }}
            >

                <VitalCard
                    icon={<Heart size={26} />}
                    title="Heart Rate"
                    value={`${vitals.heartRate} BPM`}
                    color="#ef4444"
                    background="#fee2e2"
                />

                <VitalCard
                    icon={<Activity size={26} />}
                    title="Blood Pressure"
                    value={vitals.bloodPressure}
                    color="#2563eb"
                    background="#dbeafe"
                />

                <VitalCard
                    icon={<Droplets size={26} />}
                    title="SpO₂"
                    value={`${vitals.oxygen}%`}
                    color="#16a34a"
                    background="#dcfce7"
                />

                <VitalCard
                    icon={<Thermometer size={26} />}
                    title="Temperature"
                    value={`${vitals.temperature} °C`}
                    color="#f97316"
                    background="#ffedd5"
                />

            </div>


            {/* DIGITAL TWIN STATUS */}

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    padding: 30,
                    boxShadow:
                        "0 10px 30px rgba(15,23,42,.06)",
                    border:
                        "1px solid #e5eaf2",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 22,
                    }}
                >

                    <ShieldCheck
                        size={26}
                        color="#2563eb"
                    />

                    <h2
                        style={{
                            margin: 0,
                            color: "#0f172a",
                        }}
                    >
                        Digital Twin Status
                    </h2>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                        gap: 18,
                    }}
                >

                    <StatusItem
                        title="Cardiovascular"
                        value="Stable"
                        color="#22c55e"
                    />

                    <StatusItem
                        title="Respiratory"
                        value="Normal"
                        color="#22c55e"
                    />

                    <StatusItem
                        title="Metabolic"
                        value="Normal"
                        color="#22c55e"
                    />

                    <StatusItem
                        title="AI Risk Prediction"
                        value="Low Risk"
                        color="#22c55e"
                    />

                </div>

            </div>

        </div>
    );
}


// =========================================================
// VITAL CARD
// =========================================================

function VitalCard({
                       icon,
                       title,
                       value,
                       color,
                       background,
                   }) {

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 24,
                border: "1px solid #e5eaf2",
                boxShadow:
                    "0 10px 30px rgba(15,23,42,.06)",
                position: "relative",
            }}
        >

            <div
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: color,
                    color: "#ffffff",
                    padding: "5px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                }}
            >
                LIVE
            </div>

            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 15,
                    background,
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                }}
            >
                {icon}
            </div>

            <p
                style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: 14,
                }}
            >
                {title}
            </p>

            <h2
                style={{
                    margin:
                        "8px 0 0",
                    color: "#0f172a",
                    fontSize: 26,
                }}
            >
                {value}
            </h2>

        </div>
    );
}


// =========================================================
// STATUS ITEM
// =========================================================

function StatusItem({
                        title,
                        value,
                        color,
                    }) {

    return (
        <div
            style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 18,
                border:
                    "1px solid #e2e8f0",
            }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                }}
            >

                <span
                    style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: color,
                    }}
                />

                <span
                    style={{
                        color: "#64748b",
                        fontSize: 14,
                    }}
                >
                    {title}
                </span>

            </div>

            <strong
                style={{
                    color: "#0f172a",
                    fontSize: 18,
                }}
            >
                {value}
            </strong>

        </div>
    );
}


// =========================================================
// IMPORTANT: DEFAULT EXPORT
// =========================================================

export default PatientHealthTwin;