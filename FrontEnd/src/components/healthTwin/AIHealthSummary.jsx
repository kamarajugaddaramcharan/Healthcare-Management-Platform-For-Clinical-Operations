import {
    Brain,
    Heart,
    Activity,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

function AIHealthSummary({ twin }) {

    const healthy = twin.status === "Healthy";

    return (

        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 24,
                height: "100%",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(0,0,0,.08)",
            }}
        >

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                }}
            >

                <Brain
                    color="#7c3aed"
                    size={24}
                />

                <h5
                    style={{
                        margin: 0,
                        fontWeight: 700,
                    }}
                >
                    AI Health Summary
                </h5>

            </div>

            {/* Analysis */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                }}
            >

                <Prediction
                    icon={<Heart color="#ef4444" size={18} />}
                    title="Heart Disease"
                    value={healthy ? "Low Risk" : "Moderate Risk"}
                    color={healthy ? "#22c55e" : "#f59e0b"}
                />

                <Prediction
                    icon={<Activity color="#2563eb" size={18} />}
                    title="Blood Pressure"
                    value={healthy ? "Stable" : "Monitor Closely"}
                    color={healthy ? "#22c55e" : "#ef4444"}
                />

                <Prediction
                    icon={<ShieldCheck color="#22c55e" size={18} />}
                    title="Overall Status"
                    value={healthy ? "Healthy" : "Needs Attention"}
                    color={healthy ? "#22c55e" : "#ef4444"}
                />

            </div>

            {/* Recommendation */}

            <div
                style={{
                    marginTop: 25,
                    padding: 18,
                    borderRadius: 16,
                    background: healthy
                        ? "#ecfdf5"
                        : "#fff7ed",
                    border: healthy
                        ? "1px solid #bbf7d0"
                        : "1px solid #fed7aa",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >

                    {healthy ? (
                        <CheckCircle
                            color="#22c55e"
                            size={20}
                        />
                    ) : (
                        <AlertTriangle
                            color="#f97316"
                            size={20}
                        />
                    )}

                    <strong>
                        AI Recommendation
                    </strong>

                </div>

                <small
                    style={{
                        color: "#475569",
                        lineHeight: 1.6,
                    }}
                >
                    {healthy
                        ? "Patient vitals are stable. Continue current medication, healthy diet and regular exercise."
                        : "Monitor blood pressure and blood sugar closely. Schedule a follow-up consultation within 7 days."}
                </small>

            </div>

            {/* Confidence */}

            <div
                style={{
                    marginTop: 20,
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                    }}
                >

                    <small>
                        AI Confidence
                    </small>

                    <strong
                        style={{
                            color: "#2563eb",
                        }}
                    >
                        98%
                    </strong>

                </div>

                <div
                    style={{
                        height: 10,
                        background: "#e2e8f0",
                        borderRadius: 20,
                        overflow: "hidden",
                    }}
                >

                    <div
                        style={{
                            width: "98%",
                            height: "100%",
                            background:
                                "linear-gradient(90deg,#2563eb,#06b6d4)",
                        }}
                    />

                </div>

            </div>

        </div>

    );

}

function Prediction({
                        icon,
                        title,
                        value,
                        color,
                    }) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 12,
                borderBottom: "1px solid #e2e8f0",
            }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >

                {icon}

                <strong>
                    {title}
                </strong>

            </div>

            <span
                style={{
                    color,
                    fontWeight: 700,
                }}
            >
                {value}
            </span>

        </div>

    );

}

export default AIHealthSummary;