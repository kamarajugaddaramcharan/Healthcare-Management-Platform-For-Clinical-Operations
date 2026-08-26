import api from "./api";

// =====================================================
// CREATE AI PREDICTION
// =====================================================

export const createPrediction = async (prediction) => {
    const response = await api.post(
        "/api/prediction/cvd",
        prediction
    );

    return response.data;
};

// =====================================================
// CREATE PREDICTION FROM PATIENT VITALS
// =====================================================

export const createPredictionFromVitals = async (
    patientId,
    vital
) => {
    const bloodPressure =
        String(vital?.bloodPressure || "0/0");

    const [systolic] =
        bloodPressure
            .split("/")
            .map(Number);

    const prediction = {
        patientId: String(patientId),

        age: null,
        sex: null,
        chestPainType: null,

        restingBloodPressure:
            Number.isFinite(systolic)
                ? systolic
                : 0,

        cholesterol: null,
        fastingBloodSugar: null,
        restingECG: null,

        maxHeartRate:
            vital?.heartRate != null
                ? Number(vital.heartRate)
                : null,

        exerciseInducedAngina: null,
        oldPeak: null,
        slope: null,
        majorVessels: null,
        thal: null,
        target: null
    };

    return createPrediction(prediction);
};

// =====================================================
// GET ALL PREDICTIONS
// =====================================================

export const getAllPredictions = async () => {
    try {
        const response = await api.get(
            "/api/prediction"
        );

        if (!Array.isArray(response.data)) {
            return [];
        }

        // Sort predictions by date descending (newest first)
        const sorted = [...response.data].sort(
            (a, b) =>
                new Date(b.predictionDate || 0) -
                new Date(a.predictionDate || 0)
        );

        // Deduplicate: keep only the first (latest) prediction for each unique patientId
        const patientLatestMap = new Map();
        for (const pred of sorted) {
            const pid = String(pred.patientId || "");
            if (pid && !patientLatestMap.has(pid)) {
                patientLatestMap.set(pid, pred);
            }
        }

        return Array.from(patientLatestMap.values());
    } catch (error) {
        console.error(
            "PredictionService unavailable:",
            error
        );

        // Prevent MonitoringTable from staying
        // permanently broken if PredictionService
        // is temporarily unavailable.
        return [];
    }
};

// =====================================================
// GET PREDICTION BY ID
// =====================================================

export const getPredictionById = async (id) => {
    const response = await api.get(
        `/api/prediction/${id}`
    );

    return response.data;
};

// =====================================================
// GET PREDICTION HISTORY BY PATIENT
// =====================================================

export const getPredictionHistory = async (
    patientId
) => {
    try {
        const response = await api.get(
            `/api/prediction/history/${patientId}`
        );

        return Array.isArray(response.data)
            ? response.data
            : [];
    } catch (error) {
        console.error(
            `Prediction history failed for patient ${patientId}:`,
            error
        );

        return [];
    }
};

// =====================================================
// GET LATEST PREDICTION
// =====================================================

export const getLatestPrediction = async (
    patientId
) => {
    const history =
        await getPredictionHistory(patientId);

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {
        return null;
    }

    return [...history].sort(
        (a, b) =>
            new Date(
                b.predictionDate || 0
            ) -
            new Date(
                a.predictionDate || 0
            )
    )[0];
};

// =====================================================
// UPDATE PREDICTION
// =====================================================

export const updatePrediction = async (
    id,
    prediction
) => {
    const response = await api.put(
        `/api/prediction/${id}`,
        prediction
    );

    return response.data;
};

// =====================================================
// DELETE PREDICTION
// =====================================================

export const deletePrediction = async (id) => {
    await api.delete(
        `/api/prediction/${id}`
    );
};