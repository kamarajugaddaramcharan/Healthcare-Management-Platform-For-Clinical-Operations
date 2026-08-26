import { useEffect, useState } from "react";

import {
    Brain,
    CheckCircle,
    AlertTriangle,
    Loader2,
} from "lucide-react";

import { getCurrentPatient } from "../../services/patientPortalService";

import {
    getPredictionHistory,
} from "../../services/predictionService";


function PatientAIResults() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD AI RESULTS
    // =====================================================

    const loadResults = async () => {

        try {

            setLoading(true);
            setError("");

            // Get logged-in patient
            const currentPatient =
                await getCurrentPatient();

            console.log(
                "Current patient:",
                currentPatient
            );

            const patientId =
                currentPatient?.patientId ||
                currentPatient?.id;

            if (!patientId) {
                throw new Error(
                    "Patient ID not found."
                );
            }

            console.log(
                "Loading AI results for patient:",
                patientId
            );

            // Get AI prediction history
            const data =
                await getPredictionHistory(
                    patientId
                );

            console.log(
                "AI prediction history:",
                data
            );

            setResults(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "AI results loading error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load AI results."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadResults();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                style={{
                    padding: 30,
                    textAlign: "center",
                }}
            >

                <Loader2
                    size={40}
                    color="#2563eb"
                    style={{
                        animation:
                            "spin 1s linear infinite",
                    }}
                />

                <h2>
                    Loading AI Results...
                </h2>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Fetching your latest health
                    analysis.
                </p>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div>

                <h1>
                    My AI Results
                </h1>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    AI-generated analysis of your
                    health data
                </p>

                <div
                    style={{
                        marginTop: 25,
                        background: "#fff",
                        borderRadius: 20,
                        padding: 30,
                        border:
                            "1px solid #fecaca",
                    }}
                >

                    <AlertTriangle
                        size={40}
                        color="#dc2626"
                    />

                    <h2>
                        Unable to load AI results
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        {error}
                    </p>

                    <button
                        onClick={loadResults}
                        style={{
                            border: "none",
                            borderRadius: 10,
                            padding:
                                "10px 20px",
                            background:
                                "#2563eb",
                            color: "#fff",
                            cursor:
                                "pointer",
                        }}
                    >
                        Retry
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // NO RESULTS
    // =====================================================

    if (results.length === 0) {

        return (
            <div>

                <h1>
                    My AI Results
                </h1>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    AI-generated analysis of your
                    health data
                </p>

                <div
                    style={{
                        marginTop: 25,
                        background: "#fff",
                        borderRadius: 20,
                        padding: 40,
                        textAlign: "center",
                    }}
                >

                    <Brain
                        size={50}
                        color="#7c3aed"
                    />

                    <h2>
                        No AI predictions yet
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        No prediction history was
                        found for this patient.
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // RESULTS
    // =====================================================

    return (
        <div>

            <h1>
                My AI Results
            </h1>

            <p
                style={{
                    color: "#64748b",
                }}
            >
                AI-generated analysis of your
                health data
            </p>


            <div
                style={{
                    display: "grid",
                    gap: 20,
                    marginTop: 25,
                }}
            >

                {results.map((item) => {

                    const riskLevel =
                        item.riskLevel ||
                        "UNKNOWN";

                    const riskPercentage =
                        item.riskPercentage ??
                        0;

                    const confidence =
                        item.confidence ??
                        0;

                    const healthScore =
                        item.healthScore ??
                        "--";

                    const isLow =
                        riskLevel === "LOW";

                    const isCritical =
                        riskLevel ===
                        "CRITICAL";

                    const riskColor =
                        isLow
                            ? "#16a34a"
                            : isCritical
                                ? "#dc2626"
                                : "#f59e0b";


                    return (

                        <div
                            key={
                                item.id ||
                                `${item.patientId}-${item.predictionDate}`
                            }
                            style={{
                                background:
                                    "#fff",
                                borderRadius:
                                    20,
                                padding: 25,
                                boxShadow:
                                    "0 4px 20px rgba(0,0,0,0.06)",
                            }}
                        >

                            {/* ================================= */}
                            {/* HEADER */}
                            {/* ================================= */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    gap: 20,
                                    flexWrap:
                                        "wrap",
                                }}
                            >

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 15,
                                    }}
                                >

                                    <div
                                        style={{
                                            width: 55,
                                            height: 55,
                                            borderRadius:
                                                15,
                                            background:
                                                "#f3e8ff",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >

                                        <Brain
                                            size={30}
                                            color="#7c3aed"
                                        />

                                    </div>


                                    <div>

                                        <h3
                                            style={{
                                                margin: 0,
                                            }}
                                        >
                                            Cardiovascular
                                            Risk
                                        </h3>

                                        <p
                                            style={{
                                                margin:
                                                    "5px 0 0",
                                                color:
                                                    "#64748b",
                                            }}
                                        >
                                            Patient ID:{" "}
                                            {item.patientId ||
                                                "--"}
                                        </p>

                                    </div>

                                </div>


                                {/* RISK */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 8,
                                    }}
                                >

                                    {isLow ? (

                                        <CheckCircle
                                            size={25}
                                            color={
                                                riskColor
                                            }
                                        />

                                    ) : (

                                        <AlertTriangle
                                            size={25}
                                            color={
                                                riskColor
                                            }
                                        />

                                    )}

                                    <strong
                                        style={{
                                            color:
                                            riskColor,
                                            fontSize:
                                                17,
                                        }}
                                    >
                                        {riskLevel}
                                    </strong>

                                </div>

                            </div>


                            {/* ================================= */}
                            {/* STATS */}
                            {/* ================================= */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(180px,1fr))",
                                    gap: 15,
                                    marginTop: 25,
                                }}
                            >

                                <ResultBox
                                    label="Health Score"
                                    value={
                                        healthScore
                                    }
                                />

                                <ResultBox
                                    label="Risk"
                                    value={`${riskPercentage}%`}
                                />

                                <ResultBox
                                    label="Confidence"
                                    value={`${confidence}%`}
                                />

                            </div>


                            {/* ================================= */}
                            {/* DIAGNOSIS */}
                            {/* ================================= */}

                            <div
                                style={{
                                    marginTop: 20,
                                    padding: 18,
                                    borderRadius:
                                        14,
                                    background:
                                        "#f8fafc",
                                }}
                            >

                                <strong>
                                    Diagnosis
                                </strong>

                                <p
                                    style={{
                                        margin:
                                            "7px 0 0",
                                        color:
                                            "#475569",
                                    }}
                                >
                                    {item.diagnosis ||
                                        "No diagnosis available"}
                                </p>

                            </div>


                            {/* ================================= */}
                            {/* RECOMMENDATION */}
                            {/* ================================= */}

                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 18,
                                    borderRadius:
                                        14,
                                    background:
                                        "#f8fafc",
                                }}
                            >

                                <strong>
                                    Recommendation
                                </strong>

                                <p
                                    style={{
                                        margin:
                                            "7px 0 0",
                                        color:
                                            "#475569",
                                    }}
                                >
                                    {item.recommendation ||
                                        "No recommendation available"}
                                </p>

                            </div>


                            {/* ================================= */}
                            {/* DATE */}
                            {/* ================================= */}

                            <div
                                style={{
                                    marginTop: 15,
                                    color:
                                        "#94a3b8",
                                    fontSize: 13,
                                }}
                            >

                                Prediction Date:{" "}

                                {item.predictionDate
                                    ? new Date(
                                        item.predictionDate
                                    ).toLocaleString()
                                    : "--"}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}


// =====================================================
// RESULT BOX
// =====================================================

function ResultBox({
                       label,
                       value,
                   }) {

    return (
        <div
            style={{
                background: "#f8fafc",
                borderRadius: 14,
                padding: 18,
            }}
        >

            <div
                style={{
                    color: "#64748b",
                    fontSize: 14,
                }}
            >
                {label}
            </div>

            <strong
                style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: 23,
                }}
            >
                {value}
            </strong>

        </div>
    );
}


export default PatientAIResults;