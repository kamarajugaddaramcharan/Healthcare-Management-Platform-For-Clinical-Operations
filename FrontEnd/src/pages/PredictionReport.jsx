import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPredictionById } from "../services/predictionService";
import "../styles/predictionReport.css";

function PredictionReport() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        loadPrediction();
    }, [id]);

    const loadPrediction = async () => {

        try {

            const data = await getPredictionById(id);
            setPrediction(data);

        } catch (err) {

            console.error("Prediction Error:", err);

        }

    };

    if (!prediction) {

        return (
            <h2 style={{ padding: "40px" }}>
                Loading Report...
            </h2>
        );

    }

    const healthScore =
        prediction.healthScore ??
        Math.max(0, 100 - Math.round(prediction.riskPercentage || 0));

    const aiConfidence =
        prediction.confidence ??
        Math.min(99, Math.round((prediction.riskPercentage || 0) + 5));

    const diagnosis = () => {

        if (prediction.diagnosis)
            return prediction.diagnosis;

        switch (prediction.riskLevel) {

            case "CRITICAL":
                return "Possible Cardiac Emergency";

            case "HIGH":
                return "High Cardiovascular Risk";

            case "MEDIUM":
                return "Moderate Cardiovascular Risk";

            default:
                return "Patient Stable";

        }

    };

    const recommendation = () => {

        if (prediction.recommendation)
            return prediction.recommendation;

        switch (prediction.riskLevel) {

            case "CRITICAL":
                return "Immediate ICU admission and cardiology consultation.";

            case "HIGH":
                return "Admit patient for close observation and repeat investigations.";

            case "MEDIUM":
                return "Continuous monitoring and lifestyle modification.";

            default:
                return "Routine monitoring and follow-up.";

        }

    };

    return (

        <div className="report-container">

            <button
                className="back-btn"
                onClick={() => navigate("/predictions")}
            >
                ← Back
            </button>

            <h1>🧠 AI Clinical Report</h1>

            <div className="report-card">

                <h2>{prediction.patientId}</h2>

                <hr />

                <div className="report-row">
                    <span>Prediction ID</span>
                    <strong>{prediction.id}</strong>
                </div>

                <div className="report-row">
                    <span>Patient ID</span>
                    <strong>{prediction.patientId}</strong>
                </div>

                <div className="report-row">
                    <span>Risk Level</span>

                    <strong
                        style={{
                            color:
                                prediction.riskLevel === "CRITICAL"
                                    ? "#DC2626"
                                    : prediction.riskLevel === "HIGH"
                                        ? "#EA580C"
                                        : prediction.riskLevel === "MEDIUM"
                                            ? "#D97706"
                                            : "#16A34A"
                        }}
                    >
                        {prediction.riskLevel}
                    </strong>

                </div>

                <div className="report-row">
                    <span>Risk Percentage</span>
                    <strong>{prediction.riskPercentage}%</strong>
                </div>

                <div className="report-row">
                    <span>Health Score</span>
                    <strong>{healthScore}/100</strong>
                </div>

                <div className="report-row">
                    <span>AI Confidence</span>
                    <strong>{aiConfidence}%</strong>
                </div>

                <div className="report-row">
                    <span>Prediction Date</span>
                    <strong>
                        {prediction.predictionDate
                            ? new Date(prediction.predictionDate).toLocaleString()
                            : "-"}
                    </strong>
                </div>

                <div className="report-row">
                    <span>Model Version</span>
                    <strong>{prediction.modelVersion}</strong>
                </div>

                <hr />

                <h3>AI Diagnosis</h3>

                <p>{diagnosis()}</p>

                <hr />

                <h3>Clinical Recommendation</h3>

                <p>{recommendation()}</p>

                <hr />

                <h3>AI Summary</h3>

                <p>

                    MediSphere AI analyzed this patient's cardiovascular
                    condition using clinical features, anomaly detection,
                    and AI prediction algorithms.

                    <br /><br />

                    The patient has been classified as

                    <strong> {prediction.riskLevel} </strong>

                    risk with an estimated probability of

                    <strong> {prediction.riskPercentage}% </strong>.

                    <br /><br />

                    Overall Health Score:

                    <strong> {healthScore}/100</strong>

                    <br />

                    AI Confidence:

                    <strong> {aiConfidence}%</strong>

                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "35px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        style={{
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => window.print()}
                    >
                        🖨 Print Report
                    </button>

                    <button
                        style={{
                            background: "#10B981",
                            color: "#fff",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                        onClick={() => navigate("/predictions")}
                    >
                        Back to Predictions
                    </button>

                </div>

            </div>

        </div>

    );

}

export default PredictionReport;