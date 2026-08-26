import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAllPatients,
    getPatientsByDoctor,
    updatePatient,
    deletePatient,
} from "../services/patientService";

import { getAllHealthTwins } from "../services/healthTwinService";

import {
    isDoctor as checkIsDoctor,
    getDoctorId,
    getDoctorName,
} from "../keycloak";

import DashboardHeader from "../components/patient360/DashboardHeader";
import PatientHeader from "../components/patient360/PatientHeader";
import PatientTabs from "../components/patient360/PatientTabs";

import OverviewTab from "../components/patient360/OverviewTab";
import MonitoringTab from "../components/patient360/MonitoringTab";

import HealthTwinCard from "../components/patient360/HealthTwinCard";
import KeyVitalsCard from "../components/patient360/KeyVitalsCard";
import HealthScoreCard from "../components/patient360/HealthScoreCard";
import SummaryCards from "../components/patient360/SummaryCards";
import ChartsSection from "../components/patient360/ChartsSection";
import MedicalTimeline from "../components/patient360/MedicalTimeline";
import MedicationPanel from "../components/patient360/MedicationPanel";
import LabReports from "../components/patient360/LabReports";
import AIRecommendations from "../components/patient360/AIRecommendations";
import DoctorNotes from "../components/patient360/DoctorNotes";
import VaccinationHistory from "../components/patient360/VaccinationHistory";
import FHIRResources from "../components/patient360/FHIRResources";
import ECGMonitor from "../components/patient360/ECGMonitor";

import DoctorCarePlan from "../components/patient360/DoctorCarePlan";

import "../styles/patient360.css";


// =====================================================
// PATIENT 360
// =====================================================

function Patient360() {

    const { patientId } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // ROLE
    // =====================================================

    const isDoctor = checkIsDoctor();

    // =====================================================
    // CURRENT DOCTOR
    // =====================================================

    const doctorId = getDoctorId();
    const doctorName = getDoctorName();

    // =====================================================
    // STATE
    // =====================================================

    const [patient, setPatient] = useState(null);

    const [patients, setPatients] = useState([]);

    const [twin, setTwin] = useState(null);

    const [activeTab, setActiveTab] = useState("overview");

    const [loading, setLoading] = useState(true);

    const [healthTwinError, setHealthTwinError] =
        useState(false);


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = useCallback(async () => {

        setLoading(true);

        setHealthTwinError(false);

        try {

            // =================================================
            // LOAD PATIENTS
            // =================================================

            let patientData = [];

            try {
                patientData = await getAllPatients();
            } catch (err) {
                console.error("Failed to load all patients, falling back to doctor's patients:", err);
                if (isDoctor && doctorId) {
                    patientData = await getPatientsByDoctor(doctorId);
                } else {
                    throw err;
                }
            }


            // =================================================
            // NORMALIZE PATIENT LIST
            // =================================================

            const patientList =
                Array.isArray(patientData)
                    ? patientData
                    : [];


            console.log(
                "Patient 360 patients:",
                patientList
            );


            setPatients(patientList);


            // =================================================
            // SELECT PATIENT
            // =================================================

            let selectedPatient = null;


            if (patientId) {

                selectedPatient =
                    patientList.find(
                        (p) =>
                            String(
                                p.patientId
                            ) ===
                            String(patientId)
                    );


                // ---------------------------------------------
                // FALLBACK: DATABASE ID
                // ---------------------------------------------

                if (!selectedPatient) {

                    selectedPatient =
                        patientList.find(
                            (p) =>
                                String(
                                    p.id
                                ) ===
                                String(patientId)
                        );
                }

            } else {

                // ---------------------------------------------
                // SELECT FIRST PATIENT
                // ---------------------------------------------

                selectedPatient =
                    patientList.length > 0
                        ? patientList[0]
                        : null;
            }


            // =================================================
            // NO PATIENT
            // =================================================

            if (!selectedPatient) {

                setPatient(null);

                setTwin(null);

                return;
            }


            // =================================================
            // SET PATIENT IMMEDIATELY
            // =================================================

            setPatient(selectedPatient);


            // =================================================
            // LOAD HEALTH TWINS
            // =================================================
            //
            // Health Twin is loaded separately.
            //
            // If Health Twin API fails, Patient 360 still
            // displays the patient instead of showing
            // "No Patient Found".
            //
            // =================================================

            try {

                const twins =
                    await getAllHealthTwins();


                const twinList =
                    Array.isArray(twins)
                        ? twins
                        : [];


                console.log(
                    "Health Twin list:",
                    twinList
                );


                // ---------------------------------------------
                // FIND SELECTED PATIENT TWIN
                // ---------------------------------------------

                const selectedTwin =
                    twinList.find(
                        (t) =>
                            String(
                                t.patientId
                            ) ===
                            String(
                                selectedPatient.patientId
                            )
                    );


                setTwin(
                    selectedTwin || null
                );


                if (!selectedTwin) {

                    console.warn(
                        "No Health Twin found for patient:",
                        selectedPatient.patientId
                    );
                }

            } catch (twinError) {

                console.error(
                    "Failed to load Health Twin:",
                    twinError
                );

                setTwin(null);

                setHealthTwinError(true);
            }


        } catch (error) {

            console.error(
                "Failed to load Patient 360:",
                error
            );


            setPatient(null);

            setTwin(null);

            setPatients([]);

        } finally {

            setLoading(false);

        }

    }, [
        patientId,
        isDoctor,
        doctorId,
        doctorName,
    ]);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, [loadData]);


    // =====================================================
    // PATIENT DROPDOWN
    // =====================================================

    const handlePatientChange = (event) => {

        const selectedId =
            event.target.value;


        if (!selectedId) {
            return;
        }


        navigate(
            `/patient360/${selectedId}`
        );
    };


    // =====================================================
    // EDIT PATIENT
    // =====================================================

    const handleEdit = async () => {

        if (!patient) {
            return;
        }


        const newName =
            window.prompt(
                "Enter Patient Name",
                patient.name || ""
            );


        if (!newName?.trim()) {
            return;
        }


        try {

            await updatePatient(
                patient.id ||
                patient.patientId,
                {
                    ...patient,
                    name: newName.trim(),
                }
            );


            await loadData();

        } catch (error) {

            console.error(
                "Failed to update patient:",
                error
            );

            window.alert(
                "Failed to update patient."
            );
        }
    };


    // =====================================================
    // DELETE PATIENT
    // =====================================================

    const handleDelete = async () => {

        if (!patient) {
            return;
        }


        const confirmed =
            window.confirm(
                `Delete patient ${patient.patientId}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deletePatient(
                patient.id ||
                patient.patientId
            );


            navigate("/patients");

        } catch (error) {

            console.error(
                "Failed to delete patient:",
                error
            );

            window.alert(
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
                style={{
                    padding: "60px",
                    textAlign: "center",
                    color: "#475569",
                }}
            >

                <h2>
                    Loading Patient 360...
                </h2>

                <p>
                    Loading patient information
                    and health data.
                </p>

            </div>

        );
    }


    // =====================================================
    // NO PATIENT
    // =====================================================

    if (!patient) {

        return (

            <div
                className="container mt-5 text-center"
                style={{
                    padding: 40,
                }}
            >

                <h2>
                    No Patient Found
                </h2>


                <p
                    style={{
                        color: "#64748B",
                        marginTop: 10,
                    }}
                >

                    {isDoctor
                        ? doctorId
                            ? `No patient is currently assigned to ${doctorName}.`
                            : "Unable to determine the logged-in doctor's ID."
                        : "No patients are available in the system."
                    }

                </p>


                <button
                    onClick={() =>
                        navigate("/patients")
                    }
                    style={{
                        marginTop: 20,
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: 10,
                        background: "#2563EB",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >

                    Back to Patients

                </button>

            </div>

        );
    }


    // =====================================================
    // MAIN PATIENT 360
    // =====================================================

    return (

        <div className="patient360">

            {/* =================================================
                HEADER
            ================================================= */}

            <DashboardHeader />


            {/* =================================================
                PATIENT SELECTOR
            ================================================= */}

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    padding: "16px 20px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                    boxShadow:
                        "0 4px 18px rgba(15,23,42,0.06)",
                }}
            >

                <div>

                    <div
                        style={{
                            fontSize: 13,
                            color: "#64748B",
                            marginBottom: 5,
                            fontWeight: 600,
                        }}
                    >

                        {isDoctor
                            ? "MY ASSIGNED PATIENTS"
                            : "ALL PATIENTS"
                        }

                    </div>


                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0F172A",
                        }}
                    >

                        {isDoctor
                            ? "Select Assigned Patient"
                            : "Select Patient"
                        }

                    </div>

                </div>


                <select
                    value={
                        patient.patientId ||
                        patient.id ||
                        ""
                    }
                    onChange={
                        handlePatientChange
                    }
                    style={{
                        minWidth: 300,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border:
                            "1px solid #CBD5E1",
                        background: "#fff",
                        color: "#0F172A",
                        fontSize: 15,
                        fontWeight: 600,
                        outline: "none",
                        cursor: "pointer",
                    }}
                >

                    {patients
                        .filter((p) => !isDoctor || p.doctorId === doctorId || String(p.patientId) === String(patientId) || String(p.id) === String(patientId))
                        .map((p) => (

                        <option
                            key={
                                p.id ||
                                p.patientId
                            }
                            value={
                                p.patientId ||
                                p.id
                            }
                        >

                            Patient{" "}
                            {p.patientId || p.id}

                            {p.name
                                ? ` - ${p.name}`
                                : ""
                            }

                            {p.age !== undefined &&
                            p.age !== null &&
                            p.age !== ""
                                ? ` (${p.age} yrs)`
                                : ""
                            }

                        </option>

                    ))}

                </select>

            </div>


            {/* =================================================
                CURRENT PATIENT
            ================================================= */}

            <PatientHeader
                patient={patient}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            {/* =================================================
                HEALTH TWIN WARNING
            ================================================= */}

            {healthTwinError && (

                <div
                    style={{
                        marginTop: 15,
                        marginBottom: 15,
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: "#FFF7ED",
                        border:
                            "1px solid #FED7AA",
                        color: "#9A3412",
                        fontSize: 14,
                    }}
                >

                    Health Twin data could not be
                    loaded. Patient information is
                    still available.

                </div>

            )}


            {/* =================================================
                TABS
            ================================================= */}

            <PatientTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />


            {/* =================================================
                OVERVIEW
            ================================================= */}

            {activeTab === "overview" && (

                <>

                    <OverviewTab
                        patient={patient}
                        twin={twin}
                    />

                    <SummaryCards
                        patient={patient}
                        twin={twin}
                    />

                </>

            )}


            {/* =================================================
                MONITORING
            ================================================= */}

            {activeTab === "monitoring" && (

                <MonitoringTab
                    patient={patient}
                    twin={twin}
                />

            )}


            {/* =================================================
                AI PREDICTION
            ================================================= */}

            {activeTab === "prediction" && (

                <AIRecommendations
                    patient={patient}
                    twin={twin}
                />

            )}


            {/* =================================================
                CARE PLAN
            ================================================= */}

            {activeTab === "careplan" && (

                <DoctorCarePlan

                    patientId={
                        patient.patientId ||
                        patient.id
                    }

                    patientName={
                        patient.name ||
                        patient.patientName ||
                        `Patient ${
                            patient.patientId ||
                            patient.id
                        }`
                    }

                    doctorId={
                        patient.doctorId ||
                        doctorId
                    }

                    doctorName={
                        patient.doctorName ||
                        doctorName
                    }

                />

            )}


            {/* =================================================
                HIPAA / DOCTOR NOTES
            ================================================= */}

            {activeTab === "hipaa" && (

                <DoctorNotes
                    patient={patient}
                />

            )}


            {/* =================================================
                FHIR
            ================================================= */}

            {activeTab === "fhir" && (

                <FHIRResources
                    patient={patient}
                />

            )}

        </div>

    );
}


// =====================================================
// EXPORT
// =====================================================

export default Patient360;