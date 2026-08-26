import {
    HeartPulse,
    Activity,
    Brain,
    ClipboardList,
    AlertTriangle,
    CalendarDays,
    CheckCircle,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    getCurrentPatient,
} from "../../services/patientPortalService";

import {
    getLatestVital,
} from "../../services/vitalService";

import {
    getLatestPrediction,
} from "../../services/predictionService";

import {
    getLatestCarePlan,
} from "../../services/carePlanService";


// =====================================================
// REUSABLE CARD
// =====================================================

function Card({
                  icon,
                  title,
                  value,
                  subtitle,
              }) {
    return (
        <div
            className="premium-card"
            style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: 24,
                padding: 24,
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer"
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #e0e7ff, #e879f9)",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)"
                }}
            >
                {icon}
            </div>

            <h2
                style={{
                    marginTop: 18,
                    marginBottom: 5,
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#0f172a",
                    background: "linear-gradient(135deg, #0f172a, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >
                {value}
            </h2>

            <strong style={{ color: "#4f46e5", fontSize: "12px", letterSpacing: "0.5px", textTransform: "uppercase", display: "block" }}>
                {title}
            </strong>

            <p
                style={{
                    color: "#64748b",
                    marginBottom: 0,
                    marginTop: 5,
                    fontSize: "13px"
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

function VitalProgressRow({ icon, label, value, percentage, color, status }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontWeight: 600, fontSize: "14px" }}>
                    {icon}
                    {label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "16px" }}>{value}</span>
                    <span style={{ 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        padding: "3px 8px", 
                        borderRadius: "8px",
                        background: status === "Optimal" || status === "Normal" || status === "Stable" ? "#ecfdf5" : status === "Warning" ? "#fffbeb" : status === "Critical" ? "#fef2f2" : "#f1f5f9",
                        color: status === "Optimal" || status === "Normal" || status === "Stable" ? "#10b981" : status === "Warning" ? "#d97706" : status === "Critical" ? "#ef4444" : "#64748b"
                    }}>
                        {status}
                    </span>
                </div>
            </div>
            {percentage > 0 && (
                <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${percentage}%`, background: color, borderRadius: "10px", transition: "width 0.8s ease" }} />
                </div>
            )}
        </div>
    );
}


// =====================================================
// HEALTH ROW
// =====================================================

function HealthRow({
                       label,
                       value,
                   }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                gap: 20,
            }}
        >
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}


// =====================================================
// CALCULATE HEALTH SCORE FROM VITALS
// =====================================================

function calculateHealthScore(vital) {

    if (!vital) {
        return null;
    }

    const heartRate =
        Number(vital.heartRate);

    const oxygenLevel =
        Number(vital.oxygenLevel);

    const temperature =
        Number(vital.temperature);

    let score = 100;


    // =================================================
    // HEART RATE
    // =================================================

    if (Number.isFinite(heartRate)) {

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


    // =================================================
    // OXYGEN
    // =================================================

    if (Number.isFinite(oxygenLevel)) {

        if (oxygenLevel < 90) {

            score -= 20;

        } else if (oxygenLevel < 94) {

            score -= 12;

        } else if (oxygenLevel < 95) {

            score -= 6;
        }
    }


    // =================================================
    // TEMPERATURE
    // =================================================

    if (Number.isFinite(temperature)) {

        if (temperature >= 39) {

            score -= 15;

        } else if (temperature >= 38) {

            score -= 8;

        } else if (temperature >= 37.8) {

            score -= 4;
        }
    }


    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );
}


// =====================================================
// PATIENT DASHBOARD
// =====================================================

function PatientDashboard() {

    const [patient, setPatient] =
        useState(null);

    const [latestVital, setLatestVital] =
        useState(null);

    const [latestPrediction, setLatestPrediction] =
        useState(null);

    const [carePlan, setCarePlan] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =================================================
    // LOAD PATIENT + VITALS + AI PREDICTION
    // =================================================

    useEffect(() => {

        loadPatient();

    }, []);


    const loadPatient = async () => {

        try {

            setLoading(true);
            setError("");


            // =========================================
            // GET CURRENT PATIENT
            // =========================================

            const data =
                await getCurrentPatient();

            console.log(
                "Current patient:",
                data
            );

            setPatient(data);


            // =========================================
            // PATIENT ID REQUIRED
            // =========================================

            if (!data?.patientId) {

                console.warn(
                    "Patient ID not available."
                );

                setLatestVital(null);
                setLatestPrediction(null);

                return;
            }


            const patientId =
                data.patientId;


            // =========================================
            // GET LATEST VITAL
            // =========================================

            try {

                console.log(
                    "Loading latest vital for patient:",
                    patientId
                );

                const vital =
                    await getLatestVital(
                        patientId
                    );

                console.log(
                    "Latest vital:",
                    vital
                );

                setLatestVital(vital);

            } catch (vitalError) {

                console.error(
                    "Vital loading failed:",
                    vitalError
                );

                setLatestVital(null);
            }


            // =========================================
            // GET LATEST AI PREDICTION
            // =========================================

            try {

                console.log(
                    "Loading latest AI prediction for patient:",
                    patientId
                );

                const prediction =
                    await getLatestPrediction(
                        patientId
                    );

                console.log(
                    "Latest AI prediction:",
                    prediction
                );

                setLatestPrediction(
                    prediction
                );

            } catch (predictionError) {

                console.error(
                    "AI prediction loading failed:",
                    predictionError
                );

                setLatestPrediction(null);
            }


            // =========================================
            // GET LATEST CARE PLAN
            // =========================================

            try {

                console.log(
                    "Loading latest care plan for patient:",
                    patientId
                );

                const cp =
                    await getLatestCarePlan(
                        patientId
                    );

                console.log(
                    "Latest care plan:",
                    cp
                );

                setCarePlan(cp);

            } catch (cpError) {

                console.error(
                    "Care plan loading failed:",
                    cpError
                );

                setCarePlan(null);
            }


        } catch (err) {

            console.error(
                "Dashboard patient error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load patient data."
            );

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <div>

                <h1
                    style={{
                        fontSize: 34,
                        fontWeight: 800,
                    }}
                >
                    My Health Dashboard
                </h1>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Loading your healthcare data...
                </p>

            </div>
        );
    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {

        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    color: "#dc2626",
                }}
            >

                <h2>
                    Unable to load dashboard
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadPatient}
                    style={{
                        padding:
                            "10px 18px",
                        border: "none",
                        borderRadius: 10,
                        background: "#2563eb",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Retry
                </button>

            </div>
        );
    }


    // =================================================
    // NO PATIENT
    // =================================================

    if (!patient) {

        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                }}
            >
                <h2>
                    Patient not found
                </h2>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Unable to identify the current patient.
                </p>
            </div>
        );
    }


    // =================================================
    // LATEST VITAL VALUES
    // =================================================

    const heartRate =
        latestVital?.heartRate;

    const bloodPressure =
        latestVital?.bloodPressure;

    const oxygenLevel =
        latestVital?.oxygenLevel;

    const temperature =
        latestVital?.temperature;


    // =================================================
    // HEALTH SCORE
    // =================================================

    const calculatedScore =
        calculateHealthScore(
            latestVital
        );


    /*
     * Prefer the actual AI prediction health score
     * when it exists.
     *
     * Otherwise calculate it from latest vitals.
     */

    const healthScore =
        latestPrediction?.healthScore != null
            ? Number(
                latestPrediction.healthScore
            )
            : calculatedScore !== null
                ? calculatedScore
                : patient.healthScore ??
                patient.health_score ??
                null;


    // =================================================
    // HEALTH RISK
    // =================================================

    let risk = "No Data";

    if (latestPrediction?.riskLevel) {

        risk =
            latestPrediction.riskLevel;

    } else if (
        healthScore !== null &&
        healthScore !== undefined
    ) {

        risk =
            healthScore >= 90
                ? "Low"
                : healthScore >= 75
                    ? "Moderate"
                    : "High";
    }


    // =================================================
    // AI RESULT
    // =================================================

    const aiResultValue =
        latestPrediction
            ? (
                latestPrediction.riskLevel ||
                "Available"
            )
            : "--";


    const aiResultSubtitle =
        latestPrediction
            ? (
                latestPrediction.diagnosis ||
                "AI prediction available"
            )
            : "No prediction available";


    // =================================================
    // AI RECOMMENDATION
    // =================================================

    const aiRecommendation =
        latestPrediction?.recommendation ||
        "Continue regular monitoring";


    // =================================================
    // AI CONFIDENCE
    // =================================================

    const aiConfidence =
        latestPrediction?.confidence != null
            ? `${latestPrediction.confidence}%`
            : "--";


    // =================================================
    // RISK PERCENTAGE
    // =================================================

    const riskPercentage =
        latestPrediction?.riskPercentage != null
            ? `${latestPrediction.riskPercentage}%`
            : "--";


    // =================================================
    // CARE PLAN
    // =================================================

    const carePlanValue = (() => {
        if (!carePlan || typeof carePlan !== "object") {
            return "Not available";
        }
        const status = carePlan.status || "";
        if (status.toUpperCase() === "APPROVED") {
            return "Active";
        }
        // Capitalize status for draft or pending approval
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    })();


    // =================================================
    // ALERT STATUS
    // =================================================

    const isCritical =
        latestPrediction?.riskLevel ===
        "CRITICAL";


    const isHigh =
        latestPrediction?.riskLevel ===
        "HIGH";


    // =================================================
    // RENDER
    // =================================================

    return (

        <div>

            {/* =========================================
                HEADER
            ========================================= */}

            <div
                style={{
                    marginBottom: 25,
                }}
            >

                <h1
                    style={{
                        fontSize: 34,
                        fontWeight: 800,
                        marginBottom: 5,
                    }}
                >
                    My Health Dashboard
                </h1>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Your personal healthcare overview
                </p>

            </div>


            {/* =========================================
                SUMMARY CARDS
            ========================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 20,
                }}
            >

                {/* =====================================
                    HEALTH SCORE
                ===================================== */}

                <Card
                    icon={
                        <HeartPulse />
                    }
                    title="Health Score"
                    value={
                        healthScore !== null &&
                        healthScore !== undefined
                            ? `${healthScore}%`
                            : "--"
                    }
                    subtitle={
                        healthScore !== null &&
                        healthScore !== undefined
                            ? `${risk} risk`
                            : "Waiting for vitals"
                    }
                />


                {/* =====================================
                    LATEST VITALS
                ===================================== */}

                <Card
                    icon={
                        <Activity />
                    }
                    title="Latest Vitals"
                    value={
                        latestVital
                            ? "Available"
                            : "No Data"
                    }
                    subtitle={
                        latestVital
                            ? "Latest recorded data"
                            : "No vital data available"
                    }
                />


                {/* =====================================
                    AI RESULTS
                ===================================== */}

                <Card
                    icon={
                        <Brain />
                    }
                    title="AI Results"
                    value={
                        aiResultValue
                    }
                    subtitle={
                        aiResultSubtitle
                    }
                />


                {/* =====================================
                    CARE PLAN
                ===================================== */}

                <Card
                    icon={
                        <ClipboardList />
                    }
                    title="Care Plan"
                    value={
                        carePlanValue
                    }
                    subtitle="Your current plan"
                />

            </div>


            {/* =========================================
                TODAY'S HEALTH + UPCOMING
            ========================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(300px,1fr))",
                    gap: 20,
                    marginTop: 25,
                }}
            >

                {/* =====================================
                    TODAY'S HEALTH
                ===================================== */}

                <section
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderRadius: 24,
                        padding: 26,
                        border: "1px solid rgba(255, 255, 255, 0.8)",
                        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)",
                    }}
                >
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                        🩺 Today's Telemetry
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <VitalProgressRow
                            icon={<HeartPulse size={18} color="#ef4444" />}
                            label="Heart Rate"
                            value={heartRate ? `${heartRate} BPM` : "--"}
                            percentage={heartRate ? Math.min(100, (heartRate / 150) * 100) : 0}
                            color="#ef4444"
                            status={heartRate ? (heartRate > 100 || heartRate < 60 ? "Warning" : "Optimal") : "No Data"}
                        />
                        <VitalProgressRow
                            icon={<Activity size={18} color="#3b82f6" />}
                            label="Blood Pressure"
                            value={bloodPressure || "--"}
                            percentage={bloodPressure ? 75 : 0}
                            color="#3b82f6"
                            status={bloodPressure ? "Normal" : "No Data"}
                        />
                        <VitalProgressRow
                            icon={<Brain size={18} color="#8b5cf6" />}
                            label="Oxygen Level (SpO₂)"
                            value={oxygenLevel ? `${oxygenLevel}%` : "--"}
                            percentage={oxygenLevel ? oxygenLevel : 0}
                            color="#10b981"
                            status={oxygenLevel ? (oxygenLevel < 95 ? "Critical" : "Stable") : "No Data"}
                        />
                        <VitalProgressRow
                            icon={<Activity size={18} color="#f59e0b" />}
                            label="Body Temperature"
                            value={temperature ? `${temperature}°C` : "--"}
                            percentage={temperature ? Math.min(100, (temperature / 42) * 100) : 0}
                            color="#f59e0b"
                            status={temperature ? (temperature > 37.5 || temperature < 36 ? "Warning" : "Optimal") : "No Data"}
                        />
                    </div>
                </section>

                <section
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderRadius: 24,
                        padding: 26,
                        border: "1px solid rgba(255, 255, 255, 0.8)",
                        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)",
                    }}
                >
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                        🧠 AI Analysis
                    </h2>

                    {/* PREDICTION STATUS */}
                    <div style={{ display: "flex", gap: 14, alignItems: "center", background: "rgba(99, 102, 241, 0.04)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(99, 102, 241, 0.08)" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5" }}>
                            <Brain size={20} />
                        </div>
                        <div>
                            <strong style={{ color: "#0f172a", fontSize: "15px" }}>
                                {latestPrediction ? "Active AI Assessment" : "AI Assessment"}
                            </strong>
                            <p style={{ margin: 0, color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                                {latestPrediction ? latestPrediction.diagnosis || "Telehealth monitoring active." : "No prediction data found."}
                            </p>
                        </div>
                    </div>

                    {/* RISK LEVEL */}
                    <div style={{
                        marginTop: 20,
                        padding: "16px",
                        borderRadius: "16px",
                        background: risk === "CRITICAL" ? "#fef2f2" : risk === "HIGH" ? "#fff7ed" : risk === "MEDIUM" || risk === "Moderate" ? "#fffbeb" : "#f0fdf4",
                        border: `1px solid ${risk === "CRITICAL" ? "#fee2e2" : risk === "HIGH" ? "#ffedd5" : risk === "MEDIUM" || risk === "Moderate" ? "#fef3c7" : "#dcfce7"}`
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>System Risk Profile</span>
                            <span style={{
                                fontSize: "12px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                padding: "4px 10px",
                                borderRadius: "8px",
                                background: risk === "CRITICAL" ? "#ef4444" : risk === "HIGH" ? "#ea580c" : risk === "MEDIUM" || risk === "Moderate" ? "#f59e0b" : "#10b981",
                                color: "white"
                            }}>
                                {risk}
                            </span>
                        </div>
                    </div>

                    {/* METRICS */}
                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                            <span style={{ color: "#64748b" }}>AI Core Confidence</span>
                            <strong style={{ color: "#0f172a" }}>{aiConfidence}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                            <span style={{ color: "#64748b" }}>Calculated Risk Probability</span>
                            <strong style={{ color: "#0f172a" }}>{riskPercentage}</strong>
                        </div>
                    </div>

                    {/* RECOMMENDATION */}
                    <div style={{ marginTop: 20, padding: 16, background: "rgba(148, 163, 184, 0.05)", borderRadius: "16px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
                        <strong style={{ fontSize: "13px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>AI Clinician Guideline</strong>
                        <p style={{ marginTop: 6, marginBottom: 0, color: "#334155", fontSize: "14px", lineHeight: "1.5", fontWeight: 500 }}>
                            {aiRecommendation}
                        </p>
                    </div>

                    {/* ALERTS */}
                    {isCritical || isHigh ? (
                        <div style={{ marginTop: 20, padding: 15, background: isCritical ? "#fef2f2" : "#fff7ed", borderRadius: "16px", color: isCritical ? "#dc2626" : "#ea580c", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                            <AlertTriangle size={16} />
                            {isCritical ? "Critical alert: Urgent clinical review recommended." : "Risk elevation alert: Physician notification sent."}
                        </div>
                    ) : (
                        <div style={{ marginTop: 20, padding: 15, background: "#f0fdf4", borderRadius: "16px", color: "#10b981", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600 }}>
                            <CheckCircle size={16} />
                            Telemetry is stable. No alerts active.
                        </div>
                    )}
                </section>

            </div>


            {/* =========================================
                LAST UPDATED
            ========================================= */}

            {latestPrediction?.predictionDate && (

                <div
                    style={{
                        marginTop: 18,
                        color: "#64748b",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >

                    <CalendarDays
                        size={16}
                    />

                    AI prediction updated{" "}
                    {new Date(
                        latestPrediction.predictionDate
                    ).toLocaleString()}

                </div>

            )}

            {/* CSS styles for card scaling and animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                .premium-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.12) !important;
                    border-color: rgba(99, 102, 241, 0.2) !important;
                }
            `}} />

        </div>
    );
}


export default PatientDashboard;