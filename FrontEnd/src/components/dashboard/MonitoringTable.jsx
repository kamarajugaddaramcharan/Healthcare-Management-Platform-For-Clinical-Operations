import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllPredictions } from "../../services/predictionService";


function MonitoringTable({ patients = [] }) {

    const navigate = useNavigate();


    // =====================================================
    // PREDICTIONS
    // =====================================================

    const [predictions, setPredictions] =
        useState([]);

    const [visibleCount, setVisibleCount] =
        useState(5);

    const visiblePatients = patients.slice(0, visibleCount);


    // =====================================================
    // LOAD PREDICTIONS
    // =====================================================

    const loadPredictions = async () => {

        try {

            const predictionData =
                await getAllPredictions();


            setPredictions(
                Array.isArray(predictionData)
                    ? predictionData
                    : []
            );

        }

        catch (error) {

            console.error(
                "Prediction loading failed:",
                error
            );


            /*
             * IMPORTANT:
             *
             * Prediction failure must NOT
             * remove the patient table.
             */

            setPredictions([]);

        }

    };


    // =====================================================
    // LIVE PREDICTION REFRESH
    // =====================================================

    useEffect(() => {

        loadPredictions();


        const interval =
            setInterval(
                loadPredictions,
                5000
            );


        return () =>
            clearInterval(interval);

    }, []);


    // =====================================================
    // FIND PATIENT PREDICTION
    // =====================================================

    const getPrediction =
        (patientId) => {

            return predictions.find(
                (prediction) =>
                    String(
                        prediction.patientId
                    ) ===
                    String(
                        patientId
                    )
            );

        };


    // =====================================================
    // RISK COLOR
    // =====================================================

    const getStatusColor =
        (riskLevel) => {

            switch (
                String(
                    riskLevel || ""
                ).toUpperCase()
                ) {

                case "CRITICAL":
                    return "#dc2626";

                case "HIGH":
                    return "#ea580c";

                case "MEDIUM":
                    return "#ca8a04";

                case "MODERATE":
                    return "#ca8a04";

                case "LOW":
                    return "#16a34a";

                default:
                    return "#64748b";

            }

        };


    // =====================================================
    // PATIENT STATUS
    // =====================================================

    const getPatientStatus =
        (prediction) => {

            if (!prediction) {
                return "LIVE";
            }

            return (
                prediction.status ||
                "LIVE"
            );

        };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="dashboard-card"
            style={{
                marginTop: "25px"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "10px"
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#0f172a"
                        }}
                    >
                        🩺 Live Patient Monitoring
                    </h2>


                    <p
                        style={{
                            margin:
                                "6px 0 0",
                            color: "#475569",
                            fontSize: "14px"
                        }}
                    >
                        Healthcare Management Platform For Clinical Operations
                    </p>

                </div>


                <span
                    style={{
                        background: "#dcfce7",
                        border: "1px solid #bbf7d0",
                        color: "#15803d",
                        padding: "7px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600"
                    }}
                >
                    ● Live Monitoring
                </span>

            </div>


            {/* =================================================
                PATIENT COUNT
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "18px",
                    color: "#64748b",
                    fontSize: "14px"
                }}
            >

                <span>
                    👥
                </span>

                <strong
                    style={{
                        color: "#2563eb"
                    }}
                >
                    {patients.length}
                </strong>

                <span>
                    patient
                    {patients.length === 1
                        ? ""
                        : "s"} currently monitored
                </span>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                style={{
                    overflowX: "auto",
                    marginTop: "10px"
                }}
            >

                <table
                    className="patient-table"
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse"
                    }}
                >

                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead>

                    <tr>

                        <th
                            style={thStyle}
                        >
                            Patient ID
                        </th>


                        <th
                            style={thStyle}
                        >
                            Name
                        </th>


                        <th
                            style={thStyle}
                        >
                            Age
                        </th>


                        <th
                            style={thStyle}
                        >
                            Gender
                        </th>


                        <th
                            style={thStyle}
                        >
                            Risk
                        </th>


                        <th
                            style={thStyle}
                        >
                            Risk %
                        </th>


                        <th
                            style={thStyle}
                        >
                            Health Score
                        </th>


                        <th
                            style={thStyle}
                        >
                            Status
                        </th>


                        <th
                            style={thStyle}
                        >
                            Action
                        </th>

                    </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                    {patients.length === 0 ? (

                        <tr>

                            <td
                                colSpan="9"
                                style={{
                                    padding: "50px",
                                    textAlign:
                                        "center",
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "15px"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "32px",
                                        marginBottom:
                                            "10px"
                                    }}
                                >
                                    👥
                                </div>

                                <strong>
                                    No patients available
                                </strong>

                                <div
                                    style={{
                                        marginTop:
                                            "6px"
                                    }}
                                >
                                    Waiting for patient data...
                                </div>

                            </td>

                        </tr>

                    ) : (

                        visiblePatients.map(
                            (patient) => {

                                // =================================================
                                // FIND PREDICTION
                                // =================================================

                                const prediction =
                                    getPrediction(
                                        patient.patientId
                                    );


                                // =================================================
                                // RISK
                                // =================================================

                                const risk =
                                    String(
                                        prediction?.riskLevel ||
                                        patient?.riskLevel ||
                                        "LOW"
                                    ).toUpperCase();


                                // =================================================
                                // RISK %
                                // =================================================

                                const riskPercentage =
                                    Number(
                                        prediction?.riskPercentage ??
                                        patient?.riskPercentage ??
                                        0
                                    );


                                // =================================================
                                // HEALTH SCORE
                                // =================================================

                                const healthScore =
                                    Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Math.round(
                                                100 -
                                                riskPercentage
                                            )
                                        )
                                    );


                                // =================================================
                                // STATUS
                                // =================================================

                                const status =
                                    getPatientStatus(
                                        prediction
                                    );


                                return (

                                    <tr
                                        key={
                                            patient.id ||
                                            patient.patientId
                                        }

                                        style={{
                                            borderBottom:
                                                "1px solid #eeeeee"
                                        }}
                                    >

                                        {/* =================================================
                                                PATIENT ID
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {patient.patientId ||
                                                "-"}
                                        </td>


                                        {/* =================================================
                                                NAME
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                            {(patient.name &&
                                                patient.name !== "Unknown Patient")
                                                ? patient.name
                                                : (patient.patientName &&
                                                    patient.patientName !== "Unknown Patient")
                                                    ? patient.patientName
                                                    : `Patient ${patient.patientId || "N/A"}`}

                                        </td>


                                        {/* =================================================
                                                AGE
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {patient.age ??
                                                "-"}
                                        </td>


                                        {/* =================================================
                                                GENDER
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {patient.gender ||
                                                "-"}
                                        </td>


                                        {/* =================================================
                                                RISK
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                                <span
                                                    style={{
                                                        display:
                                                            "inline-block",

                                                        background:
                                                            getStatusColor(
                                                                risk
                                                            ),

                                                        color:
                                                            "#ffffff",

                                                        padding:
                                                            "6px 14px",

                                                        borderRadius:
                                                            "20px",

                                                        fontSize:
                                                            "13px",

                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    {risk}
                                                </span>

                                        </td>


                                        {/* =================================================
                                                RISK %
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                            <strong
                                                style={{
                                                    color:
                                                        getStatusColor(
                                                            risk
                                                        )
                                                }}
                                            >
                                                {riskPercentage.toFixed(
                                                    1
                                                )}
                                                %
                                            </strong>

                                        </td>


                                        {/* =================================================
                                                HEALTH SCORE
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                            <strong
                                                style={{
                                                    color:
                                                        healthScore >=
                                                        70
                                                            ? "#16a34a"
                                                            : healthScore >=
                                                            40
                                                                ? "#ca8a04"
                                                                : "#dc2626"
                                                }}
                                            >
                                                {healthScore}/100
                                            </strong>

                                        </td>


                                        {/* =================================================
                                                STATUS
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                                <span
                                                    style={{
                                                        color:
                                                            getStatusColor(
                                                                risk
                                                            ),
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    ●{" "}
                                                    {status}
                                                </span>

                                        </td>


                                        {/* =================================================
                                                ACTION
                                            ================================================= */}

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >

                                            <button
                                                type="button"

                                                style={{
                                                    background:
                                                        "#2563eb",

                                                    color:
                                                        "#ffffff",

                                                    border:
                                                        "none",

                                                    borderRadius:
                                                        "8px",

                                                    padding:
                                                        "8px 15px",

                                                    cursor:
                                                        "pointer",

                                                    fontWeight:
                                                        "600"
                                                }}

                                                onClick={() => {

                                                    navigate(
                                                        `/patient360/${patient.patientId}`
                                                    );

                                                }}
                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                );

                            }
                        )

                    )}

                    </tbody>

                </table>

            </div>

            {patients.length > 5 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px"
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (visibleCount === 5) {
                                setVisibleCount(patients.length);
                            } else {
                                setVisibleCount(5);
                            }
                        }}
                        style={{
                            background: "transparent",
                            border: "1px solid #dce5f2",
                            padding: "10px 28px",
                            borderRadius: "24px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#2563eb",
                            cursor: "pointer",
                            transition: ".2s ease",
                            outline: "none"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f8fafc";
                            e.currentTarget.style.borderColor = "#2563eb";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "#dce5f2";
                        }}
                    >
                        {visibleCount === 5 ? `Show More (${patients.length - 5} remaining) ▼` : "Show Less ▲"}
                    </button>
                </div>
            )}

        </div>

    );
}


// =====================================================
// TABLE HEADER STYLE
// =====================================================

const thStyle = {

    textAlign:
        "left",

    padding:
        "15px",

    fontWeight:
        "bold",

    color: "#475569",

    whiteSpace:
        "nowrap"

};


// =====================================================
// TABLE CELL STYLE
// =====================================================

const tdStyle = {

    padding:
        "15px",

    color: "#334155",

    whiteSpace:
        "nowrap"

};


export default MonitoringTable;