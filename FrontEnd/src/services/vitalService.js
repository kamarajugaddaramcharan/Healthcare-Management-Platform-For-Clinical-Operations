import api from "./api";

// =====================================================
// GET ALL VITALS
// HealthTwinService stores vital information
// under /healthtwins
// =====================================================

export const getAllVitals = async () => {
    try {
        const response = await api.get("/healthtwins");

        console.log(
            "Health Twin data received:",
            response.data
        );

        return Array.isArray(response.data)
            ? response.data
            : [];

    } catch (error) {
        console.error(
            "Failed to load health twin / vital data:",
            error
        );

        return [];
    }
};


// =====================================================
// GET VITALS BY PATIENT
// =====================================================

export const getVitalsByPatient = async (patientId) => {
    try {
        const response = await api.get(
            `/healthtwins/${patientId}`
        );

        return response.data
            ? [response.data]
            : [];

    } catch (error) {
        console.error(
            `Failed to load vitals for patient ${patientId}:`,
            error
        );

        return [];
    }
};


// =====================================================
// GET LATEST VITAL BY PATIENT
// =====================================================

export const getLatestVital = async (patientId) => {
    try {
        const response = await api.get(
            `/healthtwins/${patientId}`
        );

        return response.data || null;

    } catch (error) {
        console.error(
            `Failed to load latest vital for patient ${patientId}:`,
            error
        );

        return null;
    }
};


// =====================================================
// GET HEALTH TWIN BY ID
// =====================================================

export const getVitalById = async (id) => {
    try {
        const response = await api.get(
            `/healthtwins/${id}`
        );

        return response.data;

    } catch (error) {
        console.error(
            `Failed to load health twin ${id}:`,
            error
        );

        throw error;
    }
};


// =====================================================
// CREATE VITAL / HEALTH TWIN
// =====================================================

export const createVital = async (vital) => {
    try {
        const response = await api.post(
            "/healthtwins",
            vital
        );

        return response.data;

    } catch (error) {
        console.error(
            "Failed to create health twin:",
            error
        );

        throw error;
    }
};


// =====================================================
// UPDATE VITAL / HEALTH TWIN
// =====================================================

export const updateVital = async (id, vital) => {
    try {
        const response = await api.put(
            `/healthtwins/${id}`,
            vital
        );

        return response.data;

    } catch (error) {
        console.error(
            `Failed to update health twin ${id}:`,
            error
        );

        throw error;
    }
};


// =====================================================
// DELETE HEALTH TWIN
// =====================================================

export const deleteVital = async (id) => {
    try {
        await api.delete(
            `/healthtwins/${id}`
        );

    } catch (error) {
        console.error(
            `Failed to delete health twin ${id}:`,
            error
        );

        throw error;
    }
};