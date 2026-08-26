import api from "./api";
import axios from "axios";

// Alert service hits port 8088 via gateway
const ALERT_BASE_URL = "http://localhost:8088/api/alerts";

// =====================================================
// GET DASHBOARD DATA
// =====================================================

export const getDashboardData = async () => {
    // Do NOT use Promise.all here.
    // One unavailable microservice should not break
    // the entire dashboard.

    const results = await Promise.allSettled([
        api.get("/patients"),
        api.get("/healthtwins"),
        api.get("/api/prediction"),
        axios.get(`${ALERT_BASE_URL}/statistics`)
    ]);

    // =====================================================
    // PATIENTS
    // =====================================================

    let patientList = [];

    if (results[0].status === "fulfilled") {
        patientList = Array.isArray(results[0].value.data)
            ? results[0].value.data
            : [];
    } else {
        console.error(
            "Dashboard: PatientService failed:",
            results[0].reason
        );
    }

    // =====================================================
    // HEALTH TWINS
    // =====================================================

    let twinList = [];

    if (results[1].status === "fulfilled") {
        twinList = Array.isArray(results[1].value.data)
            ? results[1].value.data
            : [];
    } else {
        console.warn(
            "Dashboard: HealthTwinService unavailable:",
            results[1].reason
        );
    }

    // =====================================================
    // AI PREDICTIONS
    // =====================================================

    let predictionList = [];

    if (results[2].status === "fulfilled") {
        predictionList = Array.isArray(results[2].value.data)
            ? results[2].value.data
            : [];
    } else {
        console.warn(
            "Dashboard: PredictionService unavailable:",
            results[2].reason
        );
    }

    // =====================================================
    // ALERT STATISTICS
    // =====================================================

    let alertStats = {
        totalAlerts: 0,
        criticalAlerts: 0,
        activeAlerts: 0,
        acknowledgedAlerts: 0
    };

    if (results[3].status === "fulfilled") {
        alertStats = results[3].value.data || alertStats;
    } else {
        console.warn(
            "Dashboard: AlertService unavailable:",
            results[3].reason
        );
    }

    // =====================================================
    // FIND VALID PREDICTIONS
    // =====================================================

    const validPredictions = predictionList.filter(
        (prediction) =>
            prediction &&
            prediction.riskPercentage !== null &&
            prediction.riskPercentage !== undefined
    );

    // =====================================================
    // GET LATEST PREDICTION
    // =====================================================

    const latestPrediction =
        [...validPredictions].sort(
            (a, b) =>
                new Date(b.predictionDate || 0) -
                new Date(a.predictionDate || 0)
        )[0] || null;

    // =====================================================
    // HEALTH SCORE
    // =====================================================

    const healthScore =
        latestPrediction?.healthScore !== null &&
        latestPrediction?.healthScore !== undefined
            ? Number(latestPrediction.healthScore)
            : null;

    // =====================================================
    // HEART RISK
    // =====================================================

    const heartRisk =
        latestPrediction?.riskPercentage !== null &&
        latestPrediction?.riskPercentage !== undefined
            ? Number(latestPrediction.riskPercentage)
            : null;

    // =====================================================
    // HIGH RISK PATIENTS
    // (patients age >= 60 until real riskLevel field exists)
    // =====================================================

    const highRiskPatients = patientList.filter(
        (patient) => Number(patient.age || 0) >= 60
    ).length;

    // =====================================================
    // ONLINE PATIENTS
    // (no real online/offline field yet — use total count)
    // =====================================================

    const onlinePatients = patientList.length;

    // =====================================================
    // RETURN DASHBOARD DATA
    // =====================================================

    return {
        patients: patientList.length,

        healthTwins: twinList.length,

        predictions: predictionList.length,

        heartRisk,

        healthScore,

        diabetesRisk: null,

        // Alert stats from AlertService
        totalAlerts: alertStats.totalAlerts ?? 0,
        criticalAlerts: alertStats.criticalAlerts ?? 0,
        activeAlerts: alertStats.activeAlerts ?? 0,
        acknowledgedAlerts: alertStats.acknowledgedAlerts ?? 0,

        // Derived patient stats
        highRiskPatients,
        onlinePatients,

        // Useful for the UI/debugging
        serviceStatus: {
            patients:
                results[0].status === "fulfilled",

            healthTwins:
                results[1].status === "fulfilled",

            predictions:
                results[2].status === "fulfilled",

            alerts:
                results[3].status === "fulfilled"
        }
    };
};