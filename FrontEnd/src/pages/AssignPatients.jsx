import { useEffect, useState } from "react";
import {
    getAllPatients,
    updatePatient
} from "../services/patientService";

import api from "../services/api";

import {
    FaUserMd,
    FaUserInjured,
    FaSearch,
    FaCheck
} from "react-icons/fa";

import "../styles/assignPatients.css";

// =====================================================
// COLOR BADGE HELPERS
// =====================================================

const getAvatarGradient = (id) => {
    const index = Number(String(id).replace(/\D/g, "")) || 0;
    const gradients = [
        "linear-gradient(135deg, #3b82f6, #60a5fa)", // Blue
        "linear-gradient(135deg, #7c3aed, #a78bfa)", // Purple
        "linear-gradient(135deg, #db2777, #f472b6)", // Pink
        "linear-gradient(135deg, #ea580c, #fb923c)", // Orange
        "linear-gradient(135deg, #16a34a, #4ade80)", // Green
        "linear-gradient(135deg, #0d9488, #2dd4bf)", // Teal
    ];
    return gradients[index % gradients.length];
};

const getConditionBadgeStyle = (condition) => {
    const cond = String(condition || "").toLowerCase();
    if (cond.includes("heart") || cond.includes("cardio") || cond.includes("stroke")) {
        return { background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }; // Red
    }
    if (cond.includes("arthritis") || cond.includes("joint") || cond.includes("diabetes") || cond.includes("rheumatoid")) {
        return { background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }; // Orange/Yellow
    }
    if (cond.includes("kidney") || cond.includes("renal") || cond.includes("chronic")) {
        return { background: "#ccfbf1", color: "#0d9488", border: "1px solid #99f6e4" }; // Teal
    }
    return { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" }; // Default Blue
};


function AssignPatients() {

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedPatients, setSelectedPatients] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // =====================================================
    // LOAD PATIENTS + DOCTORS
    // =====================================================

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);

            console.log("Loading patients and doctors...");

            const patientResponse =
                await getAllPatients();

            const doctorResponse =
                await api.get("/doctors");


            console.log(
                "PATIENT RESPONSE:",
                patientResponse
            );

            console.log(
                "DOCTOR RESPONSE:",
                doctorResponse.data
            );


            // =================================================
            // NORMALIZE PATIENT RESPONSE
            // =================================================

            let patientList = [];

            if (Array.isArray(patientResponse)) {

                patientList = patientResponse;

            } else if (
                Array.isArray(patientResponse?.data)
            ) {

                patientList = patientResponse.data;

            } else if (
                Array.isArray(patientResponse?.patients)
            ) {

                patientList = patientResponse.patients;

            }


            // =================================================
            // NORMALIZE DOCTOR RESPONSE
            // =================================================

            let doctorList = [];

            if (Array.isArray(doctorResponse?.data)) {

                doctorList = doctorResponse.data;

            } else if (
                Array.isArray(doctorResponse?.data?.doctors)
            ) {

                doctorList =
                    doctorResponse.data.doctors;

            }


            console.log(
                "FINAL PATIENTS:",
                patientList
            );

            console.log(
                "FINAL DOCTORS:",
                doctorList
            );


            setPatients(patientList);
            setDoctors(doctorList);

        } catch (error) {

            console.error(
                "Failed to load assignment data:",
                error
            );

            console.error(
                "API ERROR RESPONSE:",
                error?.response?.data
            );


            alert(
                "Unable to load patients or doctors. Check the backend/API connection."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SELECT / UNSELECT PATIENT
    // =====================================================

    const togglePatient = (patientId) => {

        setSelectedPatients((current) => {

            if (current.includes(patientId)) {

                return current.filter(
                    (id) => id !== patientId
                );

            }


            return [
                ...current,
                patientId
            ];

        });

    };


    // =====================================================
    // SELECT ALL
    // =====================================================

    const selectAll = () => {

        const visibleIds =
            filteredPatients.map(
                (patient) => patient.id
            );


        setSelectedPatients((current) => {

            const allSelected =
                visibleIds.length > 0 &&
                visibleIds.every(
                    (id) => current.includes(id)
                );


            if (allSelected) {

                return current.filter(
                    (id) =>
                        !visibleIds.includes(id)
                );

            }


            return [
                ...new Set([
                    ...current,
                    ...visibleIds
                ])
            ];

        });

    };


    // =====================================================
    // ASSIGN PATIENTS
    // =====================================================

    const assignPatients = async () => {

        // -------------------------------------------------
        // CHECK DOCTOR
        // -------------------------------------------------

        if (!selectedDoctor) {

            alert(
                "Please select a doctor."
            );

            return;

        }


        // -------------------------------------------------
        // CHECK PATIENT
        // -------------------------------------------------

        if (selectedPatients.length === 0) {

            alert(
                "Please select at least one patient."
            );

            return;

        }


        // -------------------------------------------------
        // FIND DOCTOR
        // -------------------------------------------------

        const doctor =
            doctors.find(
                (item) =>
                    String(item.doctorId) ===
                    String(selectedDoctor)
            );


        if (!doctor) {

            alert(
                "Doctor not found."
            );

            return;

        }


        try {

            setSaving(true);


            console.log(
                "Assigning patients:",
                selectedPatients
            );

            console.log(
                "Selected doctor:",
                doctor
            );


            // -------------------------------------------------
            // UPDATE PATIENTS
            // -------------------------------------------------

            for (
                const patientId of selectedPatients
                ) {

                const patient =
                    patients.find(
                        (item) =>
                            item.id === patientId
                    );


                if (!patient) {

                    console.warn(
                        "Patient not found:",
                        patientId
                    );

                    continue;

                }


                const updatedPatient = {

                    ...patient,

                    doctorId:
                    doctor.doctorId,

                    doctorName:
                    doctor.doctorName

                };


                console.log(
                    "Updating patient:",
                    updatedPatient
                );


                await updatePatient(
                    patient.id,
                    updatedPatient
                );

            }


            alert(
                `${selectedPatients.length} patient(s) assigned to ${doctor.doctorName}`
            );


            setSelectedPatients([]);

            await loadData();

        } catch (error) {

            console.error(
                "Assignment failed:",
                error
            );

            console.error(
                "Backend error:",
                error?.response?.data
            );


            alert(
                "Failed to assign patients. Check backend console."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // REMOVE ASSIGNMENT
    // =====================================================

    const removeAssignments = async () => {

        if (selectedPatients.length === 0) {

            alert(
                "Please select at least one patient."
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Are you sure you want to remove the doctor assignment from ${selectedPatients.length} patient(s)?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setSaving(true);


            console.log(
                "Removing assignments:",
                selectedPatients
            );


            // -------------------------------------------------
            // REMOVE DOCTOR
            // -------------------------------------------------

            for (
                const patientId of selectedPatients
                ) {

                const patient =
                    patients.find(
                        (item) =>
                            item.id === patientId
                    );


                if (!patient) {

                    console.warn(
                        "Patient not found:",
                        patientId
                    );

                    continue;

                }


                const updatedPatient = {

                    ...patient,

                    doctorId: null,

                    doctorName: null

                };


                console.log(
                    "Removing assignment:",
                    updatedPatient
                );


                await updatePatient(
                    patient.id,
                    updatedPatient
                );

            }


            alert(
                `${selectedPatients.length} patient(s) are now unassigned.`
            );


            setSelectedPatients([]);

            await loadData();

        } catch (error) {

            console.error(
                "Remove assignment failed:",
                error
            );

            console.error(
                "Backend error:",
                error?.response?.data
            );


            alert(
                "Failed to remove assignments. Check backend console."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // SINGLE ROW ASSIGN / REASSIGN
    // =====================================================

    const handleSingleAssign = async (patient) => {

        if (!selectedDoctor) {

            alert("Please select a doctor from the dropdown first.");

            return;
        }


        const doctor =
            doctors.find(
                (item) =>
                    String(item.doctorId) ===
                    String(selectedDoctor)
            );


        if (!doctor) {

            alert("Selected doctor not found.");

            return;
        }


        try {

            setSaving(true);


            const updatedPatient = {

                ...patient,

                doctorId:
                doctor.doctorId,

                doctorName:
                doctor.doctorName
            };


            console.log(
                "Assigning single patient:",
                patient.id,
                "to doctor:",
                doctor.doctorId
            );


            await updatePatient(
                patient.id,
                updatedPatient
            );


            alert(
                `Patient assigned to ${doctor.doctorName}`
            );


            await loadData();


        } catch (error) {

            console.error(
                "Single assignment failed:",
                error
            );

            alert(
                "Failed to assign doctor. Check backend console."
            );

        } finally {

            setSaving(false);
        }
    };


    const handleSingleRemove = async (patient) => {

        const patientName =
            patient.patientId
                ? `Patient ${patient.patientId}`
                : `Patient ${patient.id}`;


        const confirmed =
            window.confirm(
                `Are you sure you want to remove the doctor assignment from ${patientName}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setSaving(true);


            const updatedPatient = {

                ...patient,

                doctorId: null,

                doctorName: null
            };


            console.log(
                "Removing assignment for single patient:",
                patient.id
            );


            await updatePatient(
                patient.id,
                updatedPatient
            );


            alert(
                `${patientName} is now unassigned.`
            );


            await loadData();


        } catch (error) {

            console.error(
                "Remove single assignment failed:",
                error
            );

            alert(
                "Failed to remove assignment. Check backend console."
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredPatients =
        patients.filter((patient) => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {

                return true;

            }


            return (

                String(
                    patient.patientId || ""
                )
                    .toLowerCase()
                    .includes(query)

                ||

                String(
                    patient.id || ""
                )
                    .toLowerCase()
                    .includes(query)

                ||

                String(
                    patient.doctorName || ""
                )
                    .toLowerCase()
                    .includes(query)

                ||

                String(
                    patient.gender || ""
                )
                    .toLowerCase()
                    .includes(query)

                ||

                String(
                    patient.medicalCondition || ""
                )
                    .toLowerCase()
                    .includes(query)

            );

        });


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="assign-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="assign-header">

                <div>

                    <h1>
                        Assign Patients
                    </h1>

                    <p>
                        Assign patients to doctors
                        and manage doctor assignments.
                    </p>

                </div>

            </div>


            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="assign-card">


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="assign-controls">


                    {/* DOCTOR SELECTOR */}

                    <div className="doctor-selector">

                        <label>

                            <FaUserMd />

                            Select Doctor

                        </label>


                        <select
                            value={selectedDoctor}
                            onChange={(event) =>
                                setSelectedDoctor(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Select a doctor
                            </option>


                            {doctors
                                .filter(
                                    (doctor) =>
                                        doctor.active !== false
                                )
                                .map(
                                    (doctor) => (

                                        <option
                                            key={
                                                doctor.doctorId
                                            }
                                            value={
                                                doctor.doctorId
                                            }
                                        >

                                            {
                                                doctor.doctorName
                                            }

                                            {" — "}

                                            {
                                                doctor.specialization
                                            }

                                        </option>

                                    )
                                )}

                        </select>

                    </div>


                    {/* SEARCH */}

                    <div className="patient-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search patient ID, doctor, condition..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    SELECTION BAR
                ================================================= */}

                <div className="selection-bar">

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                        <strong>
                            {selectedPatients.length}
                        </strong>

                        {" "}
                        patient(s) selected

                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

                        <button
                            type="button"
                            className="select-all-btn"
                            onClick={selectAll}
                            disabled={
                                filteredPatients.length === 0
                            }
                        >

                            {
                                filteredPatients.length > 0 &&
                                filteredPatients.every(
                                    (patient) =>
                                        selectedPatients.includes(
                                            patient.id
                                        )
                                )
                                    ? "Unselect All"
                                    : "Select All"
                            }

                        </button>

                        {selectedPatients.length > 0 && (
                            <>
                                <button
                                    type="button"
                                    className="assign-action-btn"
                                    onClick={assignPatients}
                                    disabled={saving}
                                >
                                    {saving ? "Assigning..." : "Assign to Doctor"}
                                </button>

                                <button
                                    type="button"
                                    className="remove-action-btn"
                                    onClick={removeAssignments}
                                    disabled={saving}
                                >
                                    {saving ? "Removing..." : "Remove Doctor"}
                                </button>
                            </>
                        )}

                    </div>

                </div>


                {/* =================================================
                    PATIENT LIST
                ================================================= */}

                {loading ? (

                    <div className="empty-state">

                        Loading patients...

                    </div>

                ) : filteredPatients.length === 0 ? (

                    <div className="empty-state">

                        <FaUserInjured
                            style={{
                                fontSize: "42px",
                                marginBottom: "12px"
                            }}
                        />

                        <h3>
                            No patients found
                        </h3>

                        <p>
                            No patient records are
                            available from the backend.
                        </p>

                    </div>

                ) : (

                    <div className="patient-list">

                        {filteredPatients.map(
                            (patient) => {

                                const selected =
                                    selectedPatients.includes(
                                        patient.id
                                    );


                                return (

                                    <div
                                        key={
                                            patient.id
                                        }
                                        className={
                                            `patient-row ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`
                                        }
                                        onClick={() =>
                                            togglePatient(
                                                patient.id
                                            )
                                        }
                                    >


                                        {/* CHECKBOX */}

                                        <input
                                            type="checkbox"
                                            checked={
                                                selected
                                            }
                                            onChange={() =>
                                                togglePatient(
                                                    patient.id
                                                )
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        />


                                        {/* ICON */}

                                        <div
                                            className="patient-icon"
                                            style={{
                                                background: selected
                                                    ? "linear-gradient(135deg, #10b981, #059669)"
                                                    : getAvatarGradient(patient.id || patient.patientId),
                                                color: "#ffffff",
                                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >

                                            {selected ? (
                                                <FaCheck />
                                            ) : (
                                                <FaUserInjured />
                                            )}

                                        </div>


                                        {/* PATIENT */}

                                        <div className="patient-main">

                                            <strong>

                                                {
                                                    patient.patientId
                                                        ? `Patient ${patient.patientId}`
                                                        : `Patient ${patient.id}`
                                                }

                                            </strong>


                                            <span>

                                                ID:{" "}

                                                {
                                                    patient.patientId ||
                                                    patient.id
                                                }

                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="patient-details" style={{ display: "flex", gap: "10px", alignItems: "center", width: "auto", flex: "1" }}>

                                            <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                                                Age: {patient.age}
                                            </span>


                                            <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                                                {patient.gender || "N/A"}
                                            </span>


                                            <span style={{
                                                ...getConditionBadgeStyle(patient.medicalCondition),
                                                padding: "4px 10px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {patient.medicalCondition || "No condition"}
                                            </span>

                                        </div>


                                        {/* CURRENT DOCTOR */}

                                        <div className="current-doctor" style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

                                            <small style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                CURRENT DOCTOR
                                            </small>


                                            <strong style={{
                                                background: patient.doctorName ? "#f3e8ff" : "#f1f5f9",
                                                color: patient.doctorName ? "#6b21a8" : "#475569",
                                                border: `1px solid ${patient.doctorName ? "#e9d5ff" : "#cbd5e1"}`,
                                                padding: "5px 12px",
                                                borderRadius: "12px",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                display: "inline-block",
                                                marginTop: "4px"
                                            }}>
                                                👤 {patient.doctorName || "Unassigned"}
                                            </strong>

                                        </div>


                                        {/* Row actions */}
                                        <div className="patient-actions" onClick={(event) => event.stopPropagation()}>
                                            <button
                                                type="button"
                                                className="patient-assign-button"
                                                onClick={() => handleSingleAssign(patient)}
                                                disabled={saving}
                                            >
                                                {patient.doctorName ? "Reassign" : "Assign"}
                                            </button>

                                            {patient.doctorName && (
                                                <button
                                                    type="button"
                                                    className="patient-remove-button"
                                                    onClick={() => handleSingleRemove(patient)}
                                                    disabled={saving}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default AssignPatients;