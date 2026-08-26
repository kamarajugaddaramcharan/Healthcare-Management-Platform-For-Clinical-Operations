import api from "./api";

// =========================================================
// HEALTH TWIN SERVICE
// Backend:
// http://localhost:8083
//
// Endpoints:
// GET    /healthtwins
// GET    /healthtwins/{id}
// POST   /healthtwins
// PUT    /healthtwins/{id}
// DELETE /healthtwins/{id}
// =========================================================


// =========================================================
// GET ALL HEALTH TWINS
// =========================================================

export const getAllHealthTwins = async () => {
    try {
        const response = await api.get("/healthtwins");

        console.log(
            "Health Twins loaded:",
            response.data
        );

        if (Array.isArray(response.data)) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error(
            "Failed to load all Health Twins:",
            error
        );

        throw error;
    }
};


// =========================================================
// GET HEALTH TWIN BY PATIENT ID
// =========================================================

export const getHealthTwinById = async (id) => {
    try {
        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {
            throw new Error(
                "Patient ID is required"
            );
        }

        const patientId = String(id).trim();

        console.log(
            "Loading Health Twin for patient:",
            patientId
        );

        const response = await api.get(
            `/healthtwins/${encodeURIComponent(patientId)}`
        );

        console.log(
            "Health Twin response:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to load Health Twin:",
            error
        );

        throw error;
    }
};


// =========================================================
// CREATE HEALTH TWIN
// =========================================================

export const createHealthTwin = async (
    healthTwin
) => {
    try {
        if (!healthTwin) {
            throw new Error(
                "Health Twin data is required"
            );
        }

        const response = await api.post(
            "/healthtwins",
            healthTwin
        );

        console.log(
            "Health Twin created:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to create Health Twin:",
            error
        );

        throw error;
    }
};


// =========================================================
// UPDATE HEALTH TWIN
// =========================================================

export const updateHealthTwin = async (
    id,
    healthTwin
) => {
    try {
        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {
            throw new Error(
                "Health Twin ID is required"
            );
        }

        if (!healthTwin) {
            throw new Error(
                "Health Twin data is required"
            );
        }

        const response = await api.put(
            `/healthtwins/${encodeURIComponent(String(id))}`,
            healthTwin
        );

        console.log(
            "Health Twin updated:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "Failed to update Health Twin:",
            error
        );

        throw error;
    }
};


// =========================================================
// DELETE HEALTH TWIN
// =========================================================

export const deleteHealthTwin = async (
    id
) => {
    try {
        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {
            throw new Error(
                "Health Twin ID is required"
            );
        }

        await api.delete(
            `/healthtwins/${encodeURIComponent(String(id))}`
        );

        console.log(
            "Health Twin deleted:",
            id
        );

        return true;
    } catch (error) {
        console.error(
            "Failed to delete Health Twin:",
            error
        );

        throw error;
    }
};


// =========================================================
// FIND HEALTH TWIN FROM ALL RECORDS
// Useful when Patient 360 uses numeric patient IDs
// but Health Twin uses values such as P002.
// =========================================================

export const findHealthTwinByPatientId = async (
    patientId
) => {
    try {
        if (
            patientId === undefined ||
            patientId === null ||
            patientId === ""
        ) {
            throw new Error(
                "Patient ID is required"
            );
        }

        const requestedId =
            String(patientId)
                .trim()
                .toLowerCase();

        console.log(
            "Searching Health Twin for:",
            requestedId
        );

        const twins =
            await getAllHealthTwins();

        const found = twins.find((twin) => {

            const twinPatientId =
                twin?.patientId ??
                twin?.patientID ??
                twin?.patient_id ??
                twin?.id;

            if (
                twinPatientId === undefined ||
                twinPatientId === null
            ) {
                return false;
            }

            const value =
                String(twinPatientId)
                    .trim()
                    .toLowerCase();

            return (
                value === requestedId ||
                value === `p${requestedId}`
            );
        });

        console.log(
            "Matching Health Twin:",
            found
        );

        return found || null;

    } catch (error) {
        console.error(
            "Failed to find Health Twin:",
            error
        );

        throw error;
    }
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

const healthTwinService = {
    getAllHealthTwins,
    getHealthTwinById,
    findHealthTwinByPatientId,
    createHealthTwin,
    updateHealthTwin,
    deleteHealthTwin,
};

export default healthTwinService;