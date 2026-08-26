import { useState } from "react";
import { Check, Cpu } from "lucide-react";
import "../styles/modelManagement.css";

const initialVersions = [
    {
        id: 1,
        version: "V1.0",
        model: "Random Forest Classifier",
        accuracy: 91.4,
        precision: 90.8,
        recall: 91.2,
        framework: "Scikit-Learn Core",
        status: "Archived"
    },
    {
        id: 2,
        version: "V2.0",
        model: "XGBoost Boosted Trees",
        accuracy: 93.5,
        precision: 93.0,
        recall: 93.7,
        framework: "XGBoost Library",
        status: "Testing"
    },
    {
        id: 3,
        version: "V3.0",
        model: "LightGBM Gradient Booster",
        accuracy: 95.2,
        precision: 95.0,
        recall: 95.4,
        framework: "LightGBM Engine",
        status: "Staging"
    },
    {
        id: 4,
        version: "V4.0",
        model: "Deep Neural Network",
        accuracy: 97.3,
        precision: 97.0,
        recall: 97.5,
        framework: "TensorFlow Engine",
        status: "Production"
    },
    {
        id: 5,
        version: "V5.0",
        model: "Hybrid AI Ensemble",
        accuracy: 98.6,
        precision: 98.4,
        recall: 98.8,
        framework: "TensorFlow + XGBoost",
        status: "ACTIVE"
    }
];

function ModelManagement() {
    const [versions, setVersions] = useState(initialVersions);
    const [model, setModel] = useState({
        ...initialVersions[4],
        lastUpdated: new Date().toLocaleTimeString()
    });

    const handleDeploy = () => {
        const modelName = window.prompt("Enter Model Name (e.g. CNN Cardiologist Core):", "CNN Cardiac Classifier");
        if (!modelName || !modelName.trim()) return;

        const frameworkName = window.prompt("Enter Model Framework (e.g. PyTorch v2.3, TensorFlow 2.15):", "PyTorch 2.3");
        if (!frameworkName || !frameworkName.trim()) return;

        const ver = window.prompt("Enter Version Number (e.g. V6.0):", `V${versions.length + 1}.0`);
        if (!ver || !ver.trim()) return;

        // Generate high-end simulated metrics for the new model
        const acc = Number((94 + Math.random() * 5).toFixed(1));
        const prec = Number((93 + Math.random() * 6).toFixed(1));
        const rec = Number((94 + Math.random() * 5).toFixed(1));

        const newId = versions.length + 1;
        const newModel = {
            id: newId,
            version: ver,
            model: modelName.trim(),
            accuracy: acc,
            precision: prec,
            recall: rec,
            framework: frameworkName.trim(),
            status: "ACTIVE"
        };

        // Update versions list state
        setVersions(prev => [...prev, newModel]);
        
        // Deploy and set as the currently active model
        setModel({
            ...newModel,
            lastUpdated: new Date().toLocaleTimeString()
        });

        window.alert(`Successfully compiled and deployed model "${modelName} (${ver})" to clinical cluster!`);
    };

    return (
        <div className="model-page">

            <div className="model-header">
                <div>
                    <h1>AI Model Management</h1>
                    <p>Manage deployed machine learning models</p>
                </div>
                <div className="active-pill">
                    🟢 {model.status}
                </div>
            </div>

            <div className="model-grid">

                {/* Left Card - Model Details */}
                <div className="model-card">
                    <div className="model-top">
                        <div>
                            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                                {model.model}
                            </h2>
                            <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                                {model.framework}
                            </p>
                        </div>
                        <div className="version">
                            {model.version.replace("V", "")}
                        </div>
                    </div>

                    <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Select Version
                    </label>

                    <select
                        value={model.id}
                        onChange={(e) => {
                            const selected = versions.find(
                                v => v.id === Number(e.target.value)
                            );
                            if (selected) {
                                setModel({
                                    ...selected,
                                    lastUpdated: new Date().toLocaleTimeString()
                                });
                            }
                        }}
                    >
                        {versions.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.version} - {v.model}
                            </option>
                        ))}
                    </select>

                    <div className="metric">
                        <div className="metric-title" style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                            <span>Accuracy</span>
                            <span style={{ color: "#2563eb" }}>{model.accuracy}%</span>
                        </div>
                        <div className="bar">
                            <div
                                className="fill"
                                style={{ width: `${model.accuracy}%` }}
                            />
                        </div>
                    </div>

                    <div className="metric">
                        <div className="metric-title" style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                            <span>Precision</span>
                            <span style={{ color: "#2563eb" }}>{model.precision}%</span>
                        </div>
                        <div className="bar">
                            <div
                                className="fill"
                                style={{ width: `${model.precision}%` }}
                            />
                        </div>
                    </div>

                    <div className="metric">
                        <div className="metric-title" style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                            <span>Recall</span>
                            <span style={{ color: "#2563eb" }}>{model.recall}%</span>
                        </div>
                        <div className="bar">
                            <div
                                className="fill"
                                style={{ width: `${model.recall}%` }}
                            />
                        </div>
                    </div>

                    <p style={{ marginTop: "30px", fontSize: "13px", color: "#64748b", margin: "30px 0 0 0" }}>
                        <strong>Last Updated</strong>
                        <br />
                        <span style={{ color: "#334155", fontWeight: 600 }}>{model.lastUpdated}</span>
                    </p>
                </div>

                {/* Right Card - Deployment Features */}
                <div className="model-card">
                    <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 15px 0", color: "#0f172a" }}>
                        Deployment Scope
                    </h2>

                    <div className="info-list">
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            Heart Disease Prediction
                        </div>
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            Diabetes Prediction
                        </div>
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            SHAP Explainability
                        </div>
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            HIPAA Compliant
                        </div>
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            FHIR Compatible
                        </div>
                        <div className="info-item">
                            <Check size={16} color="#16a34a" strokeWidth={3} />
                            Live Monitoring
                        </div>
                    </div>

                    <button
                        className="deploy-btn"
                        onClick={handleDeploy}
                    >
                        🚀 Deploy New Model
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModelManagement;