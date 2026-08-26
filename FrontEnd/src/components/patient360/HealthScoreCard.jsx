import {
    ShieldCheck,
    Heart,
    AlertTriangle,
    Activity,
    TrendingUp,
} from "lucide-react";

function HealthScoreCard({ twin }) {

    if (!twin) {
        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 24,
                }}
            >
                Loading Health Score...
            </div>
        );
    }

    // =====================================================
    // REAL VITAL VALUES
    // =====================================================

    const heartRate =
        Number(twin.heartRate);

    const oxygenLevel =
        Number(
            twin.oxygenLevel ??
            twin.spo2
        );

    const temperature =
        Number(twin.temperature);


    // =====================================================
    // START WITH 100
    // =====================================================

    let score = 100;


    // =====================================================
    // HEART RATE
    // =====================================================

    if (
        Number.isFinite(heartRate)
    ) {

        if (
            heartRate < 50 ||
            heartRate > 120
        ) {

            score -= 15;

        } else if (
            heartRate < 60 ||
            heartRate > 100
        ) {

            score -= 8;
        }
    }


    // =====================================================
    // OXYGEN
    // =====================================================

    if (
        Number.isFinite(oxygenLevel)
    ) {

        if (
            oxygenLevel < 90
        ) {

            score -= 20;

        } else if (
            oxygenLevel < 94
        ) {

            score -= 12;

        } else if (
            oxygenLevel < 95
        ) {

            score -= 6;
        }
    }


    // =====================================================
    // TEMPERATURE
    // =====================================================

    if (
        Number.isFinite(temperature)
    ) {

        if (
            temperature >= 39
        ) {

            score -= 15;

        } else if (
            temperature >= 38
        ) {

            score -= 8;

        } else if (
            temperature >= 37.8
        ) {

            score -= 4;
        }
    }


    // =====================================================
    // KEEP SCORE BETWEEN 0 AND 100
    // =====================================================

    score = Math.max(
        0,
        Math.min(
            100,
            score
        )
    );


    // =====================================================
    // RISK
    // =====================================================

    const risk =
        score >= 90
            ? "Low"
            : score >= 75
                ? "Moderate"
                : "High";


    const riskColor =
        risk === "Low"
            ? "#22c55e"
            : risk === "Moderate"
                ? "#f59e0b"
                : "#ef4444";


    // =====================================================
    // PREDICTION
    // =====================================================

    const prediction =
        score >= 90
            ? "Stable"
            : score >= 75
                ? "Monitor"
                : "Attention Required";


    // =====================================================
    // RECOMMENDATION
    // =====================================================

    const recommendation =
        score >= 90
            ? "Continue regular monitoring"
            : score >= 75
                ? "Continue monitoring vital signs"
                : "Review patient condition";


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={{
                borderRadius: 24,
                padding: 24,
                color: "#fff",
                background:
                    "linear-gradient(135deg,#172554,#1e3a8a)",
                boxShadow:
                    "0 20px 40px rgba(0,0,0,.30)",
            }}
        >

            {/* HEADER */}

            <div
                className="d-flex justify-content-between align-items-center"
            >

                <div>

                    <h3
                        className="fw-bold mb-1"
                    >
                        🤖 AI Health Score
                    </h3>

                    <small
                        style={{
                            color: "#cbd5e1",
                        }}
                    >
                        Real-time patient assessment
                    </small>

                </div>

                <ShieldCheck
                    size={42}
                    color={riskColor}
                />

            </div>


            {/* SCORE */}

            <div
                className="text-center my-4"
            >

                <div
                    style={{
                        width: 140,
                        height: 140,
                        margin: "0 auto",
                        borderRadius: "50%",
                        border:
                            "10px solid rgba(255,255,255,.15)",
                        display: "flex",
                        flexDirection:
                            "column",
                        alignItems: "center",
                        justifyContent:
                            "center",
                    }}
                >

                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 700,
                        }}
                    >
                        {score}
                    </div>

                    <small>
                        Health Score
                    </small>

                </div>


                {/* PROGRESS */}

                <div
                    className="progress mt-4"
                    style={{
                        height: 12,
                    }}
                >

                    <div
                        className="progress-bar"
                        style={{
                            width: `${score}%`,
                            background:
                            riskColor,
                        }}
                    />

                </div>

            </div>


            {/* RISK + AI STATUS */}

            <div className="row g-3">

                <div className="col-6">

                    <div
                        className="p-3 rounded-4 bg-dark"
                    >

                        <Heart
                            className="text-danger mb-2"
                        />

                        <div>
                            Risk Level
                        </div>

                        <strong
                            style={{
                                color: riskColor,
                            }}
                        >
                            {risk}
                        </strong>

                    </div>

                </div>


                <div className="col-6">

                    <div
                        className="p-3 rounded-4 bg-dark"
                    >

                        <Activity
                            className="text-info mb-2"
                        />

                        <div>
                            AI Status
                        </div>

                        <span
                            className="badge bg-success"
                        >
                            Active
                        </span>

                    </div>

                </div>

            </div>


            <hr
                style={{
                    opacity: 0.15,
                }}
            />


            {/* PREDICTION */}

            <div
                className="d-flex justify-content-between align-items-center"
            >

                <div
                    className="d-flex align-items-center gap-2"
                >

                    <TrendingUp
                        color="#22c55e"
                    />

                    Health Prediction

                </div>

                <strong
                    style={{
                        color: "#22c55e",
                    }}
                >
                    {prediction}
                </strong>

            </div>


            {/* RECOMMENDATION */}

            <div
                className="d-flex justify-content-between align-items-center mt-3"
            >

                <div
                    className="d-flex align-items-center gap-2"
                >

                    <AlertTriangle
                        color="#f59e0b"
                    />

                    AI Recommendation

                </div>

                <small
                    style={{
                        color: "#cbd5e1",
                    }}
                >
                    {recommendation}
                </small>

            </div>

        </div>
    );
}

export default HealthScoreCard;
