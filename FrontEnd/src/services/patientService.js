import api from "./api";

// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getAllPatients = async () => {

    const response = await api.get("/patients");

    return response.data;
};


// =====================================================
// GET PATIENTS BY DOCTOR
// =====================================================

export const getPatientsByDoctor = async (doctorId) => {

    if (!doctorId) {
        throw new Error("Doctor ID is required");
    }

    const response = await api.get(
        `/patients/doctor/${encodeURIComponent(doctorId)}`
    );

    return Array.isArray(response.data)
        ? response.data
        : [];
};


// =====================================================
// GET PATIENT BY ID
// =====================================================

export const getPatientById = async (id) => {

    const response = await api.get(
        `/patients/${encodeURIComponent(id)}`
    );

    return response.data;
};


// =====================================================
// CREATE PATIENT
// =====================================================

export const createPatient = async (patient) => {

    const response = await api.post(
        "/patients",
        patient
    );

    return response.data;
};


// =====================================================
// UPDATE PATIENT
// =====================================================

export const updatePatient = async (
    id,
    patient
) => {

    const response = await api.put(
        `/patients/${encodeURIComponent(id)}`,
        patient
    );

    return response.data;
};


// =====================================================
// DELETE PATIENT
// =====================================================

export const deletePatient = async (id) => {

    await api.delete(
        `/patients/${encodeURIComponent(id)}`
    );
};