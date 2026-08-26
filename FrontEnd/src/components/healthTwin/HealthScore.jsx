import { Activity, ShieldCheck, TrendingUp } from "lucide-react";

function HealthScore({ score }) {

    const color =
        score >= 90
            ? "#22c55e"
            : score >= 75
                ? "#f59e0b"
                : "#ef4444";

    const status =
        score >= 90
            ? "Excellent"
            : score >= 75
                ? "Good"
                : "Critical";

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

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                }}
            >

                <Activity color="#2563eb" size={22} />

                <h5
                    style={{
                        margin: 0,
                        fontWeight: 700,
                    }}
                >
                    Health Score
                </h5>

            </div>

            {/* Circle */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 25,
                }}
            >

                <div
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        background: `conic-gradient(${color} ${score}%, #e2e8f0 ${score}% 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    <div
                        style={{
                            width: 118,
                            height: 118,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,.05)",
                        }}
                    >

                        <h1
                            style={{
                                margin: 0,
                                color,
                                fontWeight: 700,
                            }}
                        >
                            {score}%
                        </h1>

                        <small
                            style={{
                                color: "#64748b",
                            }}
                        >
                            Score
                        </small>

                    </div>

                </div>

            </div>

            {/* Status */}

            <div
                style={{
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                    borderRadius: 16,
                    padding: 15,
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

                    <ShieldCheck
                        color={color}
                        size={18}
                    />

                    <strong
                        style={{
                            color,
                        }}
                    >
                        {status}
                    </strong>

                </div>

                <small
                    style={{
                        color: "#64748b",
                        display: "block",
                    }}
                >
                    Overall patient condition based on
                    current vitals and AI analysis.
                </small>

            </div>

            {/* Footer */}

            <div
                style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <span
                    style={{
                        color: "#64748b",
                        fontSize: 14,
                    }}
                >
                    AI Confidence
                </span>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#22c55e",
                        fontWeight: 600,
                    }}
                >

                    <TrendingUp size={16} />

                    98%

                </div>

            </div>

        </div>

    );

}

export default HealthScore;