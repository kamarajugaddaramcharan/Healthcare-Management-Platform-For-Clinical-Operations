import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isDoctor as checkIsDoctor } from "../keycloak";

import {
    getAllPatients,
    getPatientsByDoctor,
    createPatient,
    updatePatient,
    deletePatient
} from "../services/patientService";

import PatientTable from "../components/patients/PatientTable";
import PatientModal from "../components/patients/PatientModal";
import DeleteDialog from "../components/patients/DeleteDialog";
import PatientStats from "../components/patients/PatientStats";
import ViewPatientDialog from "../components/patients/ViewPatientDialog";

function Patients() {

    const navigate = useNavigate();

    const isDoctor = checkIsDoctor();

    // =====================================================
    // PATIENT STATE
    // =====================================================

    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewPatient, setViewPatient] = useState(null);


    // =====================================================
    // DOCTOR STATE
    // =====================================================

    const [doctors, setDoctors] = useState([]);

    const [assignOpen, setAssignOpen] = useState(false);

    const [assignPatient, setAssignPatient] =
        useState(null);

    const [selectedDoctorId, setSelectedDoctorId] =
        useState("");

    const [doctorLoading, setDoctorLoading] =
        useState(false);


    // =====================================================
    // SARAH DOCTOR PORTAL
    // =====================================================
    //
    // KEEP THIS PORTAL AS:
    //
    // Dr. Sarah Wilson
    // Doctor ID: D001
    //
    // Doctor patients are loaded using D001.
    // =====================================================

    const doctorId = "D001";

    const doctorName =
        "Dr. Sarah Wilson";


    // =====================================================
    // LOAD DOCTORS
    // =====================================================

    const loadDoctors = async () => {

        try {

            setDoctorLoading(true);

            const response = await fetch(
                "http://localhost:8090/doctors"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load doctors"
                );
            }

            const data =
                await response.json();

            setDoctors(
                Array.isArray(data)
                    ? data.filter(
                        (doctor) =>
                            doctor.active === true
                    )
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load doctors:",
                err
            );

            setDoctors([]);

            setError(
                "Unable to load doctors. Please check the Doctor Service."
            );

        } finally {

            setDoctorLoading(false);
        }
    };


    // =====================================================
    // LOAD PATIENTS
    // =====================================================

    const loadPatients = async () => {

        try {

            setLoading(true);
            setError("");

            let data;


            // =================================================
            // DOCTOR
            // =================================================

            if (isDoctor) {

                console.log(
                    "Loading patients for:",
                    doctorName,
                    doctorId
                );

                data =
                    await getPatientsByDoctor(
                        doctorId
                    );

            }

                // =================================================
                // ADMIN
            // =================================================

            else {

                data =
                    await getAllPatients();
            }


            setPatients(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load patients:",
                err
            );

            setPatients([]);

            setError(
                "Unable to load patients. Please check the Patient Service."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadPatients();

    }, [isDoctor]);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredPatients =
        patients.filter(
            (patient) => {

                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!search) {
                    return true;
                }


                return (

                    patient.patientId
                        ?.toString()
                        .toLowerCase()
                        .includes(search)

                    ||

                    patient.id
                        ?.toString()
                        .toLowerCase()
                        .includes(search)

                    ||

                    patient.name
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    patient.patientName
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    patient.email
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    patient.gender
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    patient.doctorName
                        ?.toLowerCase()
                        .includes(search)
                );
            }
        );


    // =====================================================
    // ADMIN - ADD
    // =====================================================

    const handleAdd = () => {

        if (isDoctor) {
            return;
        }

        setSelectedPatient(null);

        setOpenModal(true);
    };


    // =====================================================
    // ADMIN - EDIT
    // =====================================================

    const handleEdit = (patient) => {

        if (isDoctor) {
            return;
        }

        setSelectedPatient(patient);

        setOpenModal(true);
    };


    // =====================================================
    // OPEN ASSIGN DOCTOR
    // =====================================================

    const handleAssignDoctor =
        async (patient) => {

            if (isDoctor) {
                return;
            }

            if (!patient) {
                return;
            }

            setError("");

            setAssignPatient(patient);

            setSelectedDoctorId(
                patient.doctorId || ""
            );

            await loadDoctors();

            setAssignOpen(true);
        };


    // =====================================================
    // CONFIRM DOCTOR ASSIGNMENT
    // =====================================================

    const handleConfirmAssignment =
        async () => {

            if (!assignPatient) {
                return;
            }


            if (!selectedDoctorId) {

                setError(
                    "Please select a doctor."
                );

                return;
            }


            const selectedDoctor =
                doctors.find(
                    (doctor) =>
                        String(
                            doctor.doctorId
                        ) ===
                        String(
                            selectedDoctorId
                        )
                );


            if (!selectedDoctor) {

                setError(
                    "Selected doctor was not found."
                );

                return;
            }


            const patientId =
                assignPatient.id ||
                assignPatient.patientId;


            if (!patientId) {

                setError(
                    "Patient ID is missing."
                );

                return;
            }


            try {

                setError("");


                const updatedPatient = {

                    ...assignPatient,

                    doctorId:
                    selectedDoctor.doctorId,

                    doctorName:
                    selectedDoctor.doctorName
                };


                console.log(
                    "Assigning patient:",
                    patientId
                );

                console.log(
                    "Doctor:",
                    selectedDoctor
                );


                await updatePatient(
                    patientId,
                    updatedPatient
                );


                // Close popup

                setAssignOpen(false);

                setAssignPatient(null);

                setSelectedDoctorId("");


                // Refresh patients

                await loadPatients();


            } catch (err) {

                console.error(
                    "Failed to assign doctor:",
                    err
                );

                setError(
                    "Failed to assign patient to doctor."
                );
            }
        };


    // =====================================================
    // CLOSE ASSIGN POPUP
    // =====================================================

    const closeAssignDialog = () => {

        setAssignOpen(false);

        setAssignPatient(null);

        setSelectedDoctorId("");
    };


    // =====================================================
    // VIEW PATIENT
    // =====================================================

    const handleView = (patient) => {

        if (!patient) {
            return;
        }


        // =================================================
        // DOCTOR → PATIENT 360
        // =================================================

        if (isDoctor) {

            const patientId =
                patient.patientId ||
                patient.id;


            if (!patientId) {

                console.error(
                    "Cannot open Patient 360: patient ID missing",
                    patient
                );

                return;
            }


            navigate(
                `/patient360/${patientId}`
            );

            return;
        }


        // =================================================
        // ADMIN → VIEW PATIENT
        // =================================================

        setViewPatient(patient);

        setViewOpen(true);
    };


    // =====================================================
    // SAVE PATIENT
    // =====================================================

    const handleSave = async (
        patient
    ) => {

        if (isDoctor) {
            return;
        }


        try {

            setError("");


            const data = {

                ...patient,

                // Keep existing doctor
                // assignment.

                doctorId:
                    patient.doctorId ||
                    doctorId,

                doctorName:
                    patient.doctorName ||
                    doctorName
            };


            if (selectedPatient?.id) {

                await updatePatient(
                    selectedPatient.id,
                    data
                );

            } else {

                await createPatient(
                    data
                );
            }


            setOpenModal(false);

            setSelectedPatient(null);

            await loadPatients();


        } catch (err) {

            console.error(
                "Failed to save patient:",
                err
            );

            setError(
                "Failed to save patient."
            );
        }
    };


    // =====================================================
    // DELETE CLICK
    // =====================================================

    const handleDeleteClick =
        (patient) => {

            if (isDoctor) {
                return;
            }

            setSelectedPatient(patient);

            setDeleteOpen(true);
        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        if (isDoctor) {
            return;
        }


        try {

            setError("");

            await deletePatient(id);

            setDeleteOpen(false);

            setSelectedPatient(null);

            await loadPatients();


        } catch (err) {

            console.error(
                "Failed to delete patient:",
                err
            );

            setError(
                "Failed to delete patient."
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="dashboard-container"
            >

                <div
                    style={{
                        padding: 40,
                        textAlign: "center",
                        color: "#64748B"
                    }}
                >

                    Loading patients...

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="dashboard-container"
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20,
                    marginBottom: 25
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: 36,
                            fontWeight: 800
                        }}
                    >

                        {isDoctor
                            ? "My Patients"
                            : "👥 Patient Management"}

                    </h1>


                    <p
                        style={{
                            color: "#64748B",
                            marginTop: 8
                        }}
                    >

                        {isDoctor
                            ? `Patients assigned to ${doctorName}.`
                            : "Manage patients and assign them to doctors."}

                    </p>

                </div>


                {/* ADMIN ONLY */}

                {!isDoctor && (

                    <button
                        className="add-btn"
                        onClick={handleAdd}
                    >

                        + Add Patient

                    </button>

                )}

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        padding: "14px 18px",
                        borderRadius: 12,
                        marginBottom: 20
                    }}
                >

                    {error}

                </div>

            )}


            {/* =================================================
                SARAH DOCTOR INFORMATION
            ================================================= */}

            {isDoctor && (

                <div
                    style={{
                        background: "#EFF6FF",
                        border:
                            "1px solid #BFDBFE",
                        borderRadius: 12,
                        padding: "12px 16px",
                        marginBottom: 20,
                        color: "#1E3A8A"
                    }}
                >

                    <strong>
                        Logged-in Doctor:
                    </strong>

                    {" "}

                    {doctorName}

                    {" • "}

                    Doctor ID:

                    {" "}

                    {doctorId}

                </div>

            )}


            {/* =================================================
                SEARCH
            ================================================= */}

            <input
                type="text"
                placeholder={
                    isDoctor
                        ? "Search assigned patients..."
                        : "🔍 Search by Patient ID, Name, Doctor..."
                }
                value={searchTerm}
                onChange={(event) =>
                    setSearchTerm(
                        event.target.value
                    )
                }
                style={{
                    width: "100%",
                    maxWidth: 420,
                    padding: "14px 18px",
                    borderRadius: 14,
                    border:
                        "1px solid #DCE5F2",
                    marginBottom: 25,
                    fontSize: 15,
                    outline: "none"
                }}
            />


            {/* =================================================
                STATS
            ================================================= */}

            <PatientStats
                patients={
                    filteredPatients
                }
            />


            {/* =================================================
                PATIENT TABLE
            ================================================= */}

            <PatientTable
                patients={
                    filteredPatients
                }

                onView={
                    handleView
                }

                onEdit={
                    isDoctor
                        ? undefined
                        : handleEdit
                }

                onDelete={
                    isDoctor
                        ? undefined
                        : handleDeleteClick
                }
            />


            {/* =================================================
                ADMIN CREATE / EDIT
            ================================================= */}

            {!isDoctor && (

                <>

                    <PatientModal
                        open={
                            openModal
                        }

                        patient={
                            selectedPatient
                        }

                        onSave={
                            handleSave
                        }

                        onClose={() => {

                            setOpenModal(
                                false
                            );

                            setSelectedPatient(
                                null
                            );

                        }}
                    />


                    <DeleteDialog
                        open={
                            deleteOpen
                        }

                        patient={
                            selectedPatient
                        }

                        onDelete={
                            handleDelete
                        }

                        onClose={() => {

                            setDeleteOpen(
                                false
                            );

                            setSelectedPatient(
                                null
                            );

                        }}
                    />

                </>

            )}


            {/* =================================================
                ADMIN VIEW
            ================================================= */}

            {!isDoctor && (

                <ViewPatientDialog
                    open={
                        viewOpen
                    }

                    patient={
                        viewPatient
                    }

                    onClose={() => {

                        setViewOpen(
                            false
                        );

                        setViewPatient(
                            null
                        );

                    }}
                />

            )}


            {/* =================================================
                ASSIGN / REASSIGN DOCTOR MODAL
            ================================================= */}

            {!isDoctor &&
                assignOpen &&
                assignPatient && (

                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background:
                                "rgba(0,0,0,0.65)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                            padding: 20
                        }}
                    >

                        <div
                            style={{
                                width: "100%",
                                maxWidth: 500,
                                background: "#ffffff",
                                borderRadius: 20,
                                padding: 30,
                                boxShadow:
                                    "0 25px 60px rgba(0,0,0,.35)"
                            }}
                        >


                            {/* TITLE */}

                            <h2
                                style={{
                                    marginTop: 0,
                                    marginBottom: 8,
                                    color: "#172033"
                                }}
                            >

                                {assignPatient.doctorId
                                    ? "Reassign Doctor"
                                    : "Assign Doctor"}

                            </h2>


                            {/* PATIENT */}

                            <p
                                style={{
                                    color: "#64748b",
                                    marginBottom: 25
                                }}
                            >

                                Patient:

                                {" "}

                                <strong
                                    style={{
                                        color: "#172033"
                                    }}
                                >

                                    {
                                        assignPatient.name ||
                                        assignPatient.patientName ||
                                        `Patient ${
                                            assignPatient.patientId ||
                                            ""
                                        }`
                                    }

                                </strong>

                            </p>


                            {/* SELECT DOCTOR */}

                            <label
                                style={{
                                    display: "block",
                                    fontWeight: 700,
                                    marginBottom: 8,
                                    color: "#172033"
                                }}
                            >

                                Select Doctor

                            </label>


                            <select
                                value={
                                    selectedDoctorId
                                }

                                onChange={
                                    (event) =>
                                        setSelectedDoctorId(
                                            event.target.value
                                        )
                                }

                                disabled={
                                    doctorLoading
                                }

                                style={{
                                    width: "100%",
                                    padding:
                                        "13px 15px",
                                    borderRadius: 10,
                                    border:
                                        "1px solid #CBD5E1",
                                    fontSize: 15,
                                    background:
                                        "#ffffff",
                                    color:
                                        "#172033",
                                    marginBottom: 25,
                                    outline: "none"
                                }}
                            >

                                <option value="">

                                    {doctorLoading
                                        ? "Loading doctors..."
                                        : "Select a doctor"}

                                </option>


                                {doctors.map(
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


                            {/* SELECTED DOCTOR */}

                            {selectedDoctorId && (

                                <div
                                    style={{
                                        background:
                                            "#EFF6FF",
                                        border:
                                            "1px solid #BFDBFE",
                                        borderRadius: 12,
                                        padding: 15,
                                        marginBottom: 25
                                    }}
                                >

                                    {(() => {

                                        const selected =
                                            doctors.find(
                                                (doctor) =>
                                                    String(
                                                        doctor.doctorId
                                                    ) ===
                                                    String(
                                                        selectedDoctorId
                                                    )
                                            );


                                        if (!selected) {
                                            return null;
                                        }


                                        return (

                                            <>

                                                <div
                                                    style={{
                                                        fontWeight: 800,
                                                        color:
                                                            "#1E3A8A",
                                                        fontSize: 15
                                                    }}
                                                >

                                                    {
                                                        selected.doctorName
                                                    }

                                                </div>


                                                <div
                                                    style={{
                                                        color:
                                                            "#475569",
                                                        fontSize: 13,
                                                        marginTop: 4
                                                    }}
                                                >

                                                    ID:

                                                    {" "}

                                                    {
                                                        selected.doctorId
                                                    }

                                                </div>


                                                <div
                                                    style={{
                                                        color:
                                                            "#475569",
                                                        fontSize: 13,
                                                        marginTop: 2
                                                    }}
                                                >

                                                    {
                                                        selected.specialization
                                                    }

                                                </div>

                                            </>

                                        );

                                    })()}

                                </div>

                            )}


                            {/* BUTTONS */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 12
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeAssignDialog
                                    }
                                    style={{
                                        padding:
                                            "12px 20px",
                                        border: "none",
                                        borderRadius: 10,
                                        background:
                                            "#E2E8F0",
                                        color:
                                            "#334155",
                                        fontWeight: 700,
                                        cursor:
                                            "pointer"
                                    }}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmAssignment
                                    }
                                    disabled={
                                        doctorLoading ||
                                        !selectedDoctorId
                                    }
                                    style={{
                                        padding:
                                            "12px 20px",
                                        border: "none",
                                        borderRadius: 10,
                                        background:
                                            "#2563EB",
                                        color:
                                            "#ffffff",
                                        fontWeight: 700,
                                        cursor:
                                            selectedDoctorId
                                                ? "pointer"
                                                : "not-allowed",
                                        opacity:
                                            selectedDoctorId
                                                ? 1
                                                : 0.6
                                    }}
                                >

                                    {assignPatient.doctorId
                                        ? "Reassign Doctor"
                                        : "Assign Doctor"}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}

export default Patients;