import api from "./api";

// =====================================================
// GET LATEST CARE PLAN BY PATIENT
// =====================================================

export const getLatestCarePlan = async (patientId) => {
    const response = await api.get(
        `/careplans/patient/${encodeURIComponent(patientId)}/latest`
    );

    return response.data;
};

// =====================================================
// GET CARE PLANS BY PATIENT
// =====================================================

export const getCarePlansByPatient = async (patientId) => {
    const response = await api.get(
        `/careplans/patient/${encodeURIComponent(patientId)}`
    );

    return response.data;
};

// =====================================================
// GET CARE PLAN BY ID
// =====================================================

export const getCarePlanById = async (id) => {
    const response = await api.get(`/careplans/${id}`);

    return response.data;
};

// =====================================================
// GET ALL CARE PLANS
// =====================================================

export const getAllCarePlans = async () => {
    const response = await api.get("/careplans");

    return response.data;
};

// =====================================================
// CREATE CARE PLAN
// =====================================================

export const createCarePlan = async (carePlan) => {
    const response = await api.post("/careplans", carePlan);

    return response.data;
};

// =====================================================
// UPDATE CARE PLAN
// =====================================================

export const updateCarePlan = async (id, carePlan) => {
    const response = await api.put(
        `/careplans/${id}`,
        carePlan
    );

    return response.data;
};

// =====================================================
// APPROVE CARE PLAN
// =====================================================

export const approveCarePlan = async (
    id,
    doctorId,
    doctorName,
    doctorNotes
) => {
    const params = new URLSearchParams();

    params.set("doctorId", doctorId || "");
    params.set("doctorName", doctorName || "Doctor");

    if (doctorNotes) {
        params.set("doctorNotes", doctorNotes);
    }

    const response = await api.put(
        `/careplans/${id}/approve?${params.toString()}`
    );

    return response.data;
};

// =====================================================
// REJECT CARE PLAN
// =====================================================

export const rejectCarePlan = async (
    id,
    doctorId,
    doctorName,
    doctorNotes
) => {
    const params = new URLSearchParams();

    params.set("doctorId", doctorId || "");
    params.set("doctorName", doctorName || "Doctor");
    params.set("doctorNotes", doctorNotes || "");

    const response = await api.put(
        `/careplans/${id}/reject?${params.toString()}`
    );

    return response.data;
};

// =====================================================
// DELETE CARE PLAN
// =====================================================

export const deleteCarePlan = async (id) => {
    await api.delete(`/careplans/${id}`);
};