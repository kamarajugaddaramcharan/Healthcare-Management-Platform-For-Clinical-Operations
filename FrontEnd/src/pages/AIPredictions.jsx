import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPredictions } from "../services/predictionService";
import "../styles/predictions.css";

function AIPredictions() {

    const navigate = useNavigate();

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPredictions = async () => {

        try {

            const data = await getAllPredictions();

            setPredictions(data);

        } catch (err) {

            console.error("Error loading predictions:", err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPredictions();

        const interval = setInterval(() => {

            loadPredictions();

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const getHealthScore = (riskPercentage) => {

        if (riskPercentage == null) return "--";

        return Math.max(0, Math.round(100 - riskPercentage));

    };

    const getProgressClass = (riskLevel) => {

        switch (riskLevel) {

            case "CRITICAL":
                return "progress-red";

            case "HIGH":
                return "progress-orange";

            case "MEDIUM":
                return "progress-yellow";

            case "LOW":
                return "progress-green";

            default:
                return "progress-green";
        }

    };

    if (loading) {

        return (
            <div className="prediction-page">
                <h2>Loading AI Predictions...</h2>
            </div>
        );

    }

    return (

        <div className="prediction-page">

            <div className="prediction-top">

                <div>

                    <h1>AI Prediction Center</h1>

                    <p>
                        Real-time Disease Risk Analytics powered by AI
                    </p>

                </div>

                <div className="live-status">
                    ● LIVE
                </div>

            </div>

            {predictions.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "60px",
                        fontSize: "22px"
                    }}
                >
                    No Prediction Data Available
                </div>

            ) : (

                <div className="prediction-grid">

                    {predictions.map((prediction) => (

                        <div
                            className="prediction-box"
                            key={prediction.id}
                        >

                            <div className="prediction-header">

                                <div>

                                    <h2>
                                        {prediction.patientId}
                                    </h2>

                                    <span>
                                        {prediction.riskLevel} Risk
                                    </span>

                                </div>

                                <div className="score-circle">

                                    {getHealthScore(
                                        prediction.riskPercentage
                                    )}

                                </div>

                            </div>

                            <div className="prediction-item">

                                <div className="label">

                                    ❤️ Heart Disease Risk

                                    <span>

                                        {prediction.riskPercentage != null
                                            ? prediction.riskPercentage.toFixed(
                                                1
                                            )
                                            : "--"}
                                        %

                                    </span>

                                </div>

                                <div className="progress">

                                    <div
                                        className={getProgressClass(
                                            prediction.riskLevel
                                        )}
                                        style={{
                                            width: `${prediction.riskPercentage || 0}%`
                                        }}
                                    ></div>

                                </div>

                            </div>

                            <div className="prediction-item">

                                <div className="label">

                                    🎯 AI Confidence

                                    <span>

                                        {prediction.confidence != null
                                            ? prediction.confidence.toFixed(1)
                                            : "--"}
                                        %

                                    </span>

                                </div>

                                <div className="progress">

                                    <div
                                        className="progress-blue"
                                        style={{
                                            width: `${prediction.confidence || 0}%`
                                        }}
                                    ></div>

                                </div>

                            </div>

                            <div className="prediction-footer">

                                <div>

                                    Risk Level

                                    <h3>
                                        {prediction.riskLevel}
                                    </h3>

                                </div>

                                <div>

                                    Updated

                                    <h3>

                                        {prediction.predictionDate
                                            ? new Date(
                                                prediction.predictionDate
                                            ).toLocaleString()
                                            : "--"}

                                    </h3>

                                </div>

                            </div>

                            <button
                                className="report-btn"
                                onClick={() =>
                                    navigate(
                                        `/predictions/${prediction.id}`
                                    )
                                }
                            >
                                View Full Report →
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default AIPredictions;