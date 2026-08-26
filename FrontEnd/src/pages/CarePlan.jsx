import { useState } from "react";
import axios from "axios";

import {
    Sparkles,
    Brain,
    Pill,
    Target,
    Activity,
    CalendarDays,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Droplets,
    Moon,
    Stethoscope,
    FileText,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const CAREPLAN_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8088";

// =====================================================
// HELPERS
// =====================================================

const valueOrNA = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "null"
    ) {
        return "Not available";
    }

    return value;
};

const listOrEmpty = (value) => {
    return Array.isArray(value) ? value : [];
};

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// =====================================================
// SMALL UI COMPONENTS
// =====================================================

function SectionCard({ icon, title, children }) {
    return (
        <section
            style={{
                background: "white",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "22px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {icon}
                </div>

                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        color: "#172033",
                    }}
                >
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
}

function ListSection({ icon, title, items, emptyText }) {
    const list = listOrEmpty(items);

    return (
        <SectionCard icon={icon} title={title}>
            {list.length === 0 ? (
                <p
                    style={{
                        margin: 0,
                        color: "#94a3b8",
                        fontSize: "15px",
                    }}
                >
                    {emptyText}
                </p>
            ) : (
                <ul
                    style={{
                        margin: 0,
                        paddingLeft: "22px",
                        color: "#334155",
                        lineHeight: 1.8,
                    }}
                >
                    {list.map((item, index) => (
                        <li
                            key={`${title}-${index}`}
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            {String(item)}
                        </li>
                    ))}
                </ul>
            )}
        </SectionCard>
    );
}

function InfoBox({ label, value }) {
    return (
        <div
            style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "18px",
                minHeight: "78px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    color: "#718096",
                    fontSize: "13px",
                    marginBottom: "8px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    color: "#172033",
                    fontSize: "17px",
                    fontWeight: 700,
                    lineHeight: 1.4,
                }}
            >
                {valueOrNA(value)}
            </div>
        </div>
    );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

function CarePlan() {
    const [patientId, setPatientId] = useState("11");
    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState(false);
    const [carePlan, setCarePlan] = useState(null);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleFieldChange = (key, value) => {
        setCarePlan(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleArrayFieldChange = (key, value) => {
        const array = value.split("\n").map(item => item.trim()).filter(item => item !== "");
        handleFieldChange(key, array);
    };

    const saveCarePlanChanges = async () => {
        setIsSaving(true);
        setError("");
        try {
            const response = await axios.put(
                `${CAREPLAN_API_URL}/careplans/${carePlan.id}`,
                carePlan
            );
            setCarePlan(response.data);
            setIsEditing(false);
            window.alert("Care Plan saved successfully!");
        } catch (err) {
            console.error("Failed to save Care Plan:", err);
            setError(err.response?.data?.message || "Failed to save Care Plan changes.");
        } finally {
            setIsSaving(false);
        }
    };

    // =================================================
    // GENERATE CARE PLAN
    // =================================================

    const generateCarePlan = async () => {
        const id = patientId.trim();

        if (!id) {
            setError("Patient ID is required.");
            return;
        }

        setLoading(true);
        setError("");
        setCarePlan(null);

        try {
            console.log(
                `Generating Care Plan for patient ${id}`
            );

            const response = await axios.post(
                `${CAREPLAN_API_URL}/careplans/generate/${id}`
            );

            console.log(
                "Care Plan generated successfully:",
                response.data
            );

            setCarePlan(response.data);
        } catch (err) {
            console.error(
                "Care Plan generation failed:",
                err
            );

            if (err.response) {
                const serverMessage =
                    err.response.data?.message ||
                    err.response.data?.error ||
                    err.response.data;

                setError(
                    typeof serverMessage === "string"
                        ? serverMessage
                        : `Care Plan service returned HTTP ${err.response.status}.`
                );
            } else if (err.request) {
                setError(
                    "CarePlanService is not responding via the API Gateway (port 8088). Make sure the Gateway and CarePlanService are running."
                );
            } else {
                setError(
                    err.message ||
                    "Unable to generate Care Plan."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =================================================
    // APPROVE CARE PLAN
    // =================================================

    const approveCarePlan = async () => {
        if (!carePlan?.id) {
            setError("Care plan ID is missing.");
            return;
        }

        if (carePlan.status === "APPROVED") {
            return;
        }

        setApproving(true);
        setError("");

        try {
            const response = await axios.put(
                `${CAREPLAN_API_URL}/careplans/${carePlan.id}/approve`,
                null,
                {
                    params: {
                        doctorId: "DOC001",
                        doctorName: "John Doctor",
                        doctorNotes:
                            "Care plan reviewed and approved by clinician.",
                    },
                }
            );

            console.log(
                "Care Plan approved successfully:",
                response.data
            );

            // Use the backend response as the source of truth.
            // This keeps status, doctor information and approvedAt
            // synchronized with MongoDB.
            setCarePlan(response.data);
        } catch (err) {
            console.error("Care Plan approval failed:", err);

            if (err.response) {
                const serverMessage =
                    err.response.data?.message ||
                    err.response.data?.error ||
                    err.response.data;

                setError(
                    typeof serverMessage === "string"
                        ? serverMessage
                        : `Care Plan approval returned HTTP ${err.response.status}.`
                );
            } else if (err.request) {
                setError(
                    "CarePlanService is not responding via the API Gateway (port 8088)."
                );
            } else {
                setError(
                    err.message ||
                    "Unable to approve Care Plan."
                );
            }
        } finally {
            setApproving(false);
        }
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                padding: "35px",
                boxSizing: "border-box",
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "25px",
                    boxShadow:
                        "0 8px 30px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >
                    <div
                        style={{
                            width: "55px",
                            height: "55px",
                            borderRadius: "16px",
                            background: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            flexShrink: 0,
                        }}
                    >
                        <Sparkles size={28} />
                    </div>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "30px",
                                color: "#172033",
                            }}
                        >
                            AI Care Plan
                        </h1>

                        <p
                            style={{
                                margin: "6px 0 0",
                                color: "#718096",
                            }}
                        >
                            Generate a personalized care plan
                            using the patient's latest vitals
                            and AI.
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                PATIENT + GENERATE
            ================================================= */}

            <div
                style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "28px",
                    marginBottom: "25px",
                    boxShadow:
                        "0 8px 30px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#718096",
                                marginBottom: "6px",
                            }}
                        >
                            Patient
                        </div>

                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#172033",
                            }}
                        >
                            Patient {patientId || "—"}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <input
                            value={patientId}
                            onChange={(e) =>
                                setPatientId(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !loading
                                ) {
                                    generateCarePlan();
                                }
                            }}
                            placeholder="Patient ID"
                            style={{
                                width: "150px",
                                padding: "13px 15px",
                                border:
                                    "1px solid #d7dfeb",
                                borderRadius: "10px",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />

                        <button
                            onClick={generateCarePlan}
                            disabled={loading}
                            style={{
                                border: "none",
                                borderRadius: "11px",
                                padding:
                                    "14px 22px",
                                background: loading
                                    ? "#94a3b8"
                                    : "#2563eb",
                                color: "white",
                                fontWeight: 700,
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "9px",
                            }}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw
                                        size={18}
                                        className="spin"
                                    />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate AI Care Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {carePlan && !error && (
                <div
                    style={{
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#047857",
                        padding: "18px",
                        borderRadius: "14px",
                        marginBottom: "25px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: 700,
                    }}
                >
                    <CheckCircle size={21} />

                    AI Care Plan Generated
                    {carePlan.status
                        ? ` — ${carePlan.status.replace(
                            /_/g,
                            " "
                        )}`
                        : ""}
                </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div
                    style={{
                        background: "#fff1f2",
                        border:
                            "1px solid #fecdd3",
                        color: "#be123c",
                        padding: "18px",
                        borderRadius: "14px",
                        marginBottom: "25px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        lineHeight: 1.5,
                    }}
                >
                    <AlertTriangle
                        size={20}
                        style={{
                            flexShrink: 0,
                            marginTop: "2px",
                        }}
                    />

                    <div>
                        <strong>
                            Care Plan generation failed
                        </strong>

                        <div
                            style={{
                                marginTop: "4px",
                            }}
                        >
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div
                    style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "60px 30px",
                        textAlign: "center",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.06)",
                        marginBottom: "25px",
                    }}
                >
                    <RefreshCw
                        size={45}
                        color="#2563eb"
                        className="spin"
                        style={{
                            marginBottom: "15px",
                        }}
                    />

                    <h2
                        style={{
                            margin: "0 0 10px",
                            color: "#172033",
                        }}
                    >
                        Generating AI Care Plan...
                    </h2>

                    <p
                        style={{
                            color: "#718096",
                            margin: 0,
                        }}
                    >
                        Analyzing the patient's latest
                        health information.
                    </p>
                </div>
            )}

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!carePlan &&
                !loading &&
                !error && (
                    <div
                        style={{
                            background: "white",
                            borderRadius: "20px",
                            padding: "70px 30px",
                            textAlign: "center",
                            boxShadow:
                                "0 8px 30px rgba(0,0,0,0.06)",
                        }}
                    >
                        <Brain
                            size={55}
                            color="#2563eb"
                            style={{
                                marginBottom: "15px",
                            }}
                        />

                        <h2
                            style={{
                                margin: "0 0 10px",
                                color: "#172033",
                            }}
                        >
                            No Care Plan Generated
                        </h2>

                        <p
                            style={{
                                color: "#718096",
                                margin: 0,
                            }}
                        >
                            Enter a patient ID and click
                            "Generate AI Care Plan".
                        </p>
                    </div>
                )}

            {/* =================================================
                CARE PLAN
            ================================================= */}

            {carePlan && (
                <>
                    {isEditing ? (
                        <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
                            <h2 style={{ margin: "0 0 20px", color: "#172033", fontSize: "22px" }}>✏️ Edit Care Plan</h2>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Diagnosis</label>
                                    <textarea 
                                        value={carePlan.diagnosis || ""} 
                                        onChange={(e) => handleFieldChange("diagnosis", e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Daily Water Target (L/day)</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            value={carePlan.dailyWaterTarget ?? ""} 
                                            onChange={(e) => handleFieldChange("dailyWaterTarget", parseFloat(e.target.value) || 0)}
                                            style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Risk Level</label>
                                        <select 
                                            value={carePlan.riskLevel || ""} 
                                            onChange={(e) => handleFieldChange("riskLevel", e.target.value)}
                                            style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                        >
                                            <option value="LOW">LOW</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HIGH">HIGH</option>
                                            <option value="CRITICAL">CRITICAL</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Medications (one per line)</label>
                                    <textarea 
                                        value={(carePlan.medications || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("medications", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Diet Recommendations (one per line)</label>
                                    <textarea 
                                        value={(carePlan.dietRecommendations || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("dietRecommendations", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Exercise Recommendations (one per line)</label>
                                    <textarea 
                                        value={(carePlan.exerciseRecommendations || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("exerciseRecommendations", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Lifestyle Recommendations (one per line)</label>
                                    <textarea 
                                        value={(carePlan.lifestyleRecommendations || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("lifestyleRecommendations", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Treatment Goals (one per line)</label>
                                    <textarea 
                                        value={(carePlan.treatmentGoals || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("treatmentGoals", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Monitoring Plan (one per line)</label>
                                    <textarea 
                                        value={(carePlan.monitoringPlan || []).join("\n")} 
                                        onChange={(e) => handleArrayFieldChange("monitoringPlan", e.target.value)}
                                        rows={4}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Sleep Recommendation</label>
                                    <textarea 
                                        value={carePlan.sleepRecommendation || ""} 
                                        onChange={(e) => handleFieldChange("sleepRecommendation", e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Follow-up Instructions</label>
                                    <textarea 
                                        value={carePlan.followUp || ""} 
                                        onChange={(e) => handleFieldChange("followUp", e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Doctor Notes</label>
                                    <textarea 
                                        value={carePlan.doctorNotes || ""} 
                                        onChange={(e) => handleFieldChange("doctorNotes", e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        generateCarePlan();
                                    }}
                                    style={{ border: "1px solid #cbd5e1", background: "white", color: "#475569", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={saveCarePlanChanges}
                                    disabled={isSaving}
                                    style={{ border: "none", background: "#2563eb", color: "white", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                    {/* =================================================
                        CLINICAL ASSESSMENT
                    ================================================= */}

                    <SectionCard
                        icon={<Activity size={26} />}
                        title="Clinical Assessment"
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            <InfoBox
                                label="Diagnosis"
                                value={carePlan.diagnosis}
                            />

                            <InfoBox
                                label="Risk Level"
                                value={carePlan.riskLevel}
                            />

                            <InfoBox
                                label="Risk Percentage"
                                value={
                                    carePlan.riskPercentage !==
                                    null &&
                                    carePlan.riskPercentage !==
                                    undefined
                                        ? `${carePlan.riskPercentage}%`
                                        : null
                                }
                            />

                            <InfoBox
                                label="Health Score"
                                value={
                                    carePlan.healthScore !==
                                    null &&
                                    carePlan.healthScore !==
                                    undefined
                                        ? `${carePlan.healthScore}/100`
                                        : null
                                }
                            />

                            <InfoBox
                                label="Current Risk"
                                value={
                                    carePlan.currentRiskPercentage !==
                                    null &&
                                    carePlan.currentRiskPercentage !==
                                    undefined
                                        ? `${carePlan.currentRiskPercentage}%`
                                        : null
                                }
                            />

                            <InfoBox
                                label="Previous Risk"
                                value={
                                    carePlan.previousRiskPercentage !==
                                    null &&
                                    carePlan.previousRiskPercentage !==
                                    undefined
                                        ? `${carePlan.previousRiskPercentage}%`
                                        : null
                                }
                            />

                            <InfoBox
                                label="Outcome"
                                value={carePlan.outcome}
                            />
                        </div>
                    </SectionCard>

                    {/* =================================================
                        MEDICATIONS
                    ================================================= */}

                    <ListSection
                        icon={<Pill size={26} />}
                        title="Medications"
                        items={carePlan.medications}
                        emptyText="No medication recommendations available."
                    />

                    {/* =================================================
                        DIET
                    ================================================= */}

                    <ListSection
                        icon={<Activity size={26} />}
                        title="Diet Recommendations"
                        items={
                            carePlan.dietRecommendations
                        }
                        emptyText="No diet recommendations available."
                    />

                    {/* =================================================
                        EXERCISE
                    ================================================= */}

                    <ListSection
                        icon={<Activity size={26} />}
                        title="Exercise Recommendations"
                        items={
                            carePlan.exerciseRecommendations
                        }
                        emptyText="No exercise recommendations available."
                    />

                    {/* =================================================
                        LIFESTYLE
                    ================================================= */}

                    <ListSection
                        icon={<Brain size={26} />}
                        title="Lifestyle Recommendations"
                        items={
                            carePlan.lifestyleRecommendations
                        }
                        emptyText="No lifestyle recommendations available."
                    />

                    {/* =================================================
                        TREATMENT GOALS
                    ================================================= */}

                    <ListSection
                        icon={<Target size={26} />}
                        title="Treatment Goals"
                        items={carePlan.treatmentGoals}
                        emptyText="No treatment goals available."
                    />

                    {/* =================================================
                        MONITORING PLAN
                    ================================================= */}

                    <ListSection
                        icon={<Activity size={26} />}
                        title="Monitoring Plan"
                        items={carePlan.monitoringPlan}
                        emptyText="No monitoring plan available."
                    />

                    {/* =================================================
                        DAILY WATER
                    ================================================= */}

                    <SectionCard
                        icon={<Droplets size={26} />}
                        title="Daily Water Target"
                    >
                        <InfoBox
                            label="Recommended Daily Water"
                            value={
                                carePlan.dailyWaterTarget !==
                                null &&
                                carePlan.dailyWaterTarget !==
                                undefined
                                    ? `${carePlan.dailyWaterTarget} L/day`
                                    : null
                            }
                        />
                    </SectionCard>

                    {/* =================================================
                        SLEEP
                    ================================================= */}

                    <SectionCard
                        icon={<Moon size={26} />}
                        title="Sleep Recommendation"
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#334155",
                                lineHeight: 1.7,
                                fontSize: "16px",
                            }}
                        >
                            {valueOrNA(
                                carePlan.sleepRecommendation
                            )}
                        </p>
                    </SectionCard>

                    {/* =================================================
                        FOLLOW UP
                    ================================================= */}

                    <SectionCard
                        icon={<CalendarDays size={26} />}
                        title="Follow-up"
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#334155",
                                lineHeight: 1.7,
                                fontSize: "16px",
                            }}
                        >
                            {valueOrNA(
                                carePlan.followUp
                            )}
                        </p>
                    </SectionCard>

                    {/* =================================================
                        NEXT REVIEW
                    ================================================= */}

                    <SectionCard
                        icon={<CalendarDays size={26} />}
                        title="Next Review"
                    >
                        <InfoBox
                            label="Next Review Date"
                            value={formatDate(
                                carePlan.nextReviewDate
                            )}
                        />
                    </SectionCard>

                    {/* =================================================
                        DOCTOR NOTES
                    ================================================= */}

                    <SectionCard
                        icon={<Stethoscope size={26} />}
                        title="Doctor Notes"
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#334155",
                                lineHeight: 1.7,
                                fontSize: "16px",
                            }}
                        >
                            {valueOrNA(
                                carePlan.doctorNotes
                            )}
                        </p>
                    </SectionCard>

                    {/* =================================================
                        DOCTOR INFORMATION
                    ================================================= */}

                    <SectionCard
                        icon={<Stethoscope size={26} />}
                        title="Doctor Information"
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            <InfoBox
                                label="Doctor Name"
                                value={
                                    carePlan.doctorName ||
                                    "Not assigned"
                                }
                            />

                            <InfoBox
                                label="Doctor ID"
                                value={
                                    carePlan.doctorId ||
                                    "Not assigned"
                                }
                            />
                        </div>
                    </SectionCard>

                    {/* =================================================
                        PLAN INFORMATION
                    ================================================= */}

                    <SectionCard
                        icon={<FileText size={26} />}
                        title="Plan Information"
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            <InfoBox
                                label="Patient ID"
                                value={
                                    carePlan.patientId
                                }
                            />

                            <InfoBox
                                label="Patient Name"
                                value={
                                    carePlan.patientName
                                }
                            />

                            <InfoBox
                                label="Status"
                                value={
                                    carePlan.status
                                        ? carePlan.status.replace(
                                            /_/g,
                                            " "
                                        )
                                        : null
                                }
                            />

                            <InfoBox
                                label="Created At"
                                value={formatDate(
                                    carePlan.createdAt
                                )}
                            />

                            <InfoBox
                                label="Updated At"
                                value={formatDate(
                                    carePlan.updatedAt
                                )}
                            />

                            <InfoBox
                                label="Approved At"
                                value={formatDate(
                                    carePlan.approvedAt
                                )}
                            />
                        </div>
                    </SectionCard>
                        </>
                    )}

                    {/* =================================================
                        APPROVAL
                    ================================================= */}

                    {carePlan.status === "PENDING_APPROVAL" && (
                        <SectionCard
                            icon={<CheckCircle size={26} />}
                            title="Doctor Approval"
                        >
                            <div
                                style={{
                                    background: "#fff7ed",
                                    border: "1px solid #fed7aa",
                                    borderRadius: "14px",
                                    padding: "18px",
                                    marginBottom: "18px",
                                    color: "#9a3412",
                                    lineHeight: 1.6,
                                }}
                            >
                                This care plan is waiting for clinician
                                review and approval.
                            </div>

                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={isEditing}
                                    style={{
                                        border: "1px solid #2563eb",
                                        background: "white",
                                        color: "#2563eb",
                                        borderRadius: "11px",
                                        padding: "14px 22px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "9px",
                                    }}
                                >
                                    ✏️ Edit Care Plan
                                </button>
                                
                                <button
                                    onClick={approveCarePlan}
                                    disabled={approving || isEditing}
                                    style={{
                                        border: "none",
                                        background: approving || isEditing
                                            ? "#94a3b8"
                                            : "#16a34a",
                                        color: "white",
                                        borderRadius: "11px",
                                        padding: "14px 22px",
                                        fontWeight: 700,
                                        cursor: approving || isEditing
                                            ? "not-allowed"
                                            : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "9px",
                                    }}
                                >
                                    {approving ? (
                                        <>
                                            <RefreshCw
                                                size={18}
                                                className="spin"
                                            />
                                            Approving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            Approve Care Plan
                                        </>
                                    )}
                                </button>
                            </div>
                        </SectionCard>
                    )}

                    {carePlan.status === "APPROVED" && (
                        <SectionCard
                            icon={<CheckCircle size={26} />}
                            title="Approval"
                        >
                            <div
                                style={{
                                    background: "#ecfdf5",
                                    border: "1px solid #a7f3d0",
                                    borderRadius: "14px",
                                    padding: "18px",
                                    color: "#047857",
                                    marginBottom: "18px",
                                    fontWeight: 700,
                                }}
                            >
                                ✓ Care Plan Approved
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "18px",
                                }}
                            >
                                <InfoBox
                                    label="Approved By"
                                    value={carePlan.doctorName}
                                />

                                <InfoBox
                                    label="Doctor ID"
                                    value={carePlan.doctorId}
                                />

                                <InfoBox
                                    label="Approved At"
                                    value={formatDate(
                                        carePlan.approvedAt
                                    )}
                                />

                                <InfoBox
                                    label="Doctor Notes"
                                    value={carePlan.doctorNotes}
                                />
                            </div>
                        </SectionCard>
                    )}

                    {/* =================================================
                        REGENERATE
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "10px",
                            paddingBottom: "30px",
                        }}
                    >
                        <button
                            onClick={generateCarePlan}
                            disabled={loading}
                            style={{
                                border:
                                    "1px solid #2563eb",
                                background: "white",
                                color: "#2563eb",
                                borderRadius: "11px",
                                padding:
                                    "13px 20px",
                                fontWeight: 700,
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <RefreshCw size={18} />
                            Regenerate
                        </button>
                    </div>
                </>
            )}

            {/* =================================================
                SIMPLE SPINNER STYLE
            ================================================= */}

            <style>
                {`
                    .spin {
                        animation: carePlanSpin 1s linear infinite;
                    }

                    @keyframes carePlanSpin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default CarePlan;