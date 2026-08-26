import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboardService";

import {
    getAllPatients,
    getPatientsByDoctor
} from "../services/patientService";

import { isDoctor as checkIsDoctor } from "../keycloak";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import PatientProfileCard from "../components/dashboard/PatientProfileCard";
import SummaryCard from "../components/dashboard/SummaryCard";

import RiskChart from "../components/dashboard/RiskChart";
import PatientGrowthChart from "../components/dashboard/PatientGrowthChart";
import HeartRateChart from "../components/dashboard/HeartRateChart";

import RecentPatients from "../components/dashboard/RecentPatients";
import UpcomingAppointments from "../components/dashboard/UpcomingAppointments";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

import LiveStatsCards from "../components/dashboard/LiveStatsCards";
import MonitoringTable from "../components/dashboard/MonitoringTable";

import CriticalPatients from "../components/alert/CriticalPatients";
import ActiveAlerts from "../components/alert/ActiveAlerts";
import CriticalAlertPopup from "../components/alert/CriticalAlertPopup";

import "../styles/dashboard.css";

function Dashboard() {

    // =========================================================
    // USER / ROLE
    // =========================================================

    const isDoctor = checkIsDoctor();

    const doctorId = "D001";

    const doctorName = "Dr. Sarah Wilson";


    // =========================================================
    // DASHBOARD COUNTS
    // =========================================================

    const [stats, setStats] = useState({
        patients: 0,
        healthTwins: 0,
        predictions: 0
    });


    // =========================================================
    // PATIENTS
    // =========================================================

    const [patients, setPatients] = useState([]);

    const [selectedPatient, setSelectedPatient] =
        useState(null);


    // =========================================================
    // SEARCH
    // =========================================================

    const [searchTerm, setSearchTerm] =
        useState("");


    // =========================================================
    // AI HEALTH DATA
    // =========================================================

    const [heartRisk, setHeartRisk] =
        useState(null);

    const [diabetesRisk, setDiabetesRisk] =
        useState(null);

    const [healthScore, setHealthScore] =
        useState(null);


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(true);


    // =========================================================
    // LAST UPDATED
    // =========================================================

    const [lastUpdated, setLastUpdated] =
        useState(
            new Date().toLocaleTimeString()
        );


    // =========================================================
    // LOAD PATIENTS
    // =========================================================

    const loadPatients = async () => {

        try {

            /*
             * DOCTOR
             * Only assigned patients.
             *
             * ADMIN
             * All patients.
             */

            const data =
                isDoctor
                    ? await getPatientsByDoctor(
                        doctorId
                    )
                    : await getAllPatients();


            const patientList =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "HealthCare patients:",
                patientList
            );


            // =================================================
            // SAVE PATIENTS
            // =================================================

            setPatients(
                patientList
            );


            // =================================================
            // KEEP CURRENT PATIENT SELECTED
            // =================================================

            setSelectedPatient(
                (current) => {

                    if (current) {

                        const updatedPatient =
                            patientList.find(
                                (patient) =>
                                    String(
                                        patient.patientId
                                    ) ===
                                    String(
                                        current.patientId
                                    )
                            );


                        if (updatedPatient) {
                            return updatedPatient;
                        }
                    }


                    /*
                     * If there is no current patient,
                     * select the first patient.
                     */

                    return patientList.length > 0
                        ? patientList[0]
                        : null;

                }
            );


            // =================================================
            // PATIENT COUNT
            // =================================================

            setStats(
                (previous) => ({
                    ...previous,
                    patients:
                    patientList.length
                })
            );

        }

        catch (error) {

            console.error(
                "Patient loading error:",
                error
            );


            setPatients([]);

            setSelectedPatient(null);


            setStats(
                (previous) => ({
                    ...previous,
                    patients: 0
                })
            );
        }
    };


    // =========================================================
    // LOAD DASHBOARD DATA
    // =========================================================

    const loadDashboard = async () => {

        try {

            const data =
                await getDashboardData();


            console.log(
                "MediSphere dashboard data:",
                data
            );


            // =================================================
            // DASHBOARD COUNTS
            // =================================================

            setStats(
                (previous) => ({
                    ...previous,

                    healthTwins:
                        isDoctor
                            ? previous.healthTwins
                            : data?.healthTwins ?? 0,

                    predictions:
                        isDoctor
                            ? previous.predictions
                            : data?.predictions ?? 0
                })
            );


            // =================================================
            // HEART DISEASE RISK
            // =================================================

            setHeartRisk(
                data?.heartRisk !== null &&
                data?.heartRisk !== undefined

                    ? Number(
                        data.heartRisk
                    )

                    : null
            );


            // =================================================
            // DIABETES RISK
            // =================================================

            setDiabetesRisk(
                data?.diabetesRisk !== null &&
                data?.diabetesRisk !== undefined

                    ? Number(
                        data.diabetesRisk
                    )

                    : null
            );


            // =================================================
            // HEALTH SCORE
            // =================================================

            setHealthScore(
                data?.healthScore !== null &&
                data?.healthScore !== undefined

                    ? Number(
                        data.healthScore
                    )

                    : null
            );

        }

        catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );


            /*
             * Do not fake clinical values.
             */

            setHeartRisk(null);

            setDiabetesRisk(null);

            setHealthScore(null);
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                loadPatients(),
                loadDashboard()
            ]);

            setLoading(false);
        };


        loadData();

    }, [isDoctor]);


    // =========================================================
    // LIVE REFRESH EVERY 5 SECONDS
    // =========================================================

    useEffect(() => {

        const interval =
            setInterval(
                async () => {

                    await loadPatients();

                    await loadDashboard();

                    setLastUpdated(
                        new Date()
                            .toLocaleTimeString()
                    );

                },
                5000
            );


        return () =>
            clearInterval(interval);

    }, [isDoctor]);


    // =========================================================
    // PATIENT SEARCH
    // =========================================================

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


                const searchableFields = [

                    patient?.patientId,

                    patient?.id,

                    patient?.name,

                    patient?.firstName,

                    patient?.lastName,

                    patient?.email,

                    patient?.gender,

                    patient?.phone,

                    patient?.doctorId,

                    patient?.doctorName,

                    patient?.assignedDoctor

                ];


                return searchableFields.some(
                    (field) => {

                        if (
                            field === null ||
                            field === undefined
                        ) {
                            return false;
                        }


                        return String(field)
                            .toLowerCase()
                            .includes(search);

                    }
                );

            }
        );


    // =========================================================
    // SELECT PATIENT FROM DROPDOWN
    // =========================================================

    const handlePatientChange =
        (event) => {

            const patientId =
                event.target.value;


            const patient =
                patients.find(
                    (item) =>
                        String(
                            item.patientId
                        ) ===
                        String(
                            patientId
                        )
                );


            setSelectedPatient(
                patient || null
            );
        };


    // =========================================================
    // SELECT PATIENT FROM SEARCH
    // =========================================================

    const handleSearchPatient =
        (patient) => {

            if (!patient) {
                return;
            }


            setSelectedPatient(
                patient
            );


            setSearchTerm("");
        };


    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (

            <div
                className="dashboard-loading"
            >

                <h2>
                    Loading Healthcare Management Platform For Clinical Operations...
                </h2>

            </div>

        );
    }


    // =========================================================
    // DISPLAY HELPERS
    // =========================================================

    const heartRiskDisplay =
        heartRisk !== null &&
        heartRisk !== undefined

            ? `${Number(heartRisk).toFixed(1)}%`

            : "N/A";


    const diabetesRiskDisplay =
        diabetesRisk !== null &&
        diabetesRisk !== undefined

            ? `${Number(diabetesRisk).toFixed(1)}%`

            : "N/A";


    const healthScoreDisplay =
        healthScore !== null &&
        healthScore !== undefined

            ? `${healthScore}/100`

            : "N/A";


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            className="dashboard-container"
        >

            {/* ================================================= */}
            {/* CRITICAL ALERT */}
            {/* ================================================= */}

            <CriticalAlertPopup />


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <DashboardHeader
                showStats={false}
                patients={patients}
                stats={stats}
                onPatientSelect={
                    handleSearchPatient
                }
            />


            {/* ================================================= */}
            {/* SELECTED PATIENT */}
            {/* ================================================= */}

            <PatientProfileCard
                patient={
                    selectedPatient
                }
            />


            {/* ================================================= */}
            {/* DOCTOR PATIENT SELECTOR */}
            {/* ================================================= */}

            {isDoctor && (

                <div
                    className="dashboard-card"
                    style={{
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0
                            }}
                        >
                            👨‍⚕️ {doctorName}
                        </h2>


                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                color:
                                    "#64748b"
                            }}
                        >
                            My assigned patients
                        </p>

                    </div>


                    <select

                        value={
                            selectedPatient?.patientId ||
                            ""
                        }

                        onChange={
                            handlePatientChange
                        }

                        style={{
                            minWidth: "300px",
                            padding: "13px 16px",
                            borderRadius: "12px",
                            border:
                                "1px solid #dce5f2",
                            background: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer",
                            outline: "none"
                        }}
                    >

                        {patients.length === 0 ? (

                            <option value="">
                                No assigned patients
                            </option>

                        ) : (

                            patients.map(
                                (patient) => (

                                    <option
                                        key={
                                            patient.id ||
                                            patient.patientId
                                        }

                                        value={
                                            patient.patientId
                                        }
                                    >

                                        Patient{" "}
                                        {
                                            patient.patientId
                                        }

                                        {patient.name
                                            ? ` - ${patient.name}`
                                            : ""}

                                    </option>

                                )
                            )

                        )}

                    </select>

                </div>

            )}


            {/* ================================================= */}
            {/* LIVE STATS */}
            {/* ================================================= */}

            <LiveStatsCards />


            {/* ================================================= */}
            {/* LIVE MONITORING STATUS */}
            {/* ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "18px 0",
                    padding: "14px 20px",
                    background: "#ffffff",
                    borderRadius: "14px",
                    boxShadow:
                        "0 6px 18px rgba(0,0,0,.08)",
                    flexWrap: "wrap",
                    gap: "10px"
                }}
            >

                <div>

                    <h3
                        style={{
                            margin: 0,
                            color: "#2563eb"
                        }}
                    >
                        🏥 Healthcare Management Platform For Clinical Operations — Live Monitoring
                    </h3>


                    <small
                        style={{
                            color: "#6b7280"
                        }}
                    >

                        {isDoctor
                            ? `${patients.length} patients assigned to ${doctorName}`
                            : "Dashboard updates automatically every 5 seconds"}

                    </small>

                </div>


                <div
                    style={{
                        fontWeight: 600,
                        color: "#16a34a"
                    }}
                >

                    🟢 Last Updated:{" "}
                    {lastUpdated}

                </div>

            </div>


            {/* ================================================= */}
            {/* DIAGNOSTIC CHARTS */}
            {/* ================================================= */}
            <div
                className="charts-grid"
                style={{
                    marginTop: "25px"
                }}
            >
                <RiskChart />
                <HeartRateChart />
            </div>


            {/* ================================================= */}
            {/* LIVE PATIENT MONITORING */}
            {/* ================================================= */}

            <div
                style={{
                    marginTop: "25px",
                    marginBottom: "25px"
                }}
            >

                {/* IMPORTANT:
                    Pass the actual patient array.
                    Previously this was:
                    <MonitoringTable />
                */}

                <MonitoringTable
                    patients={patients}
                />

            </div>


            {/* ================================================= */}
            {/* CRITICAL MONITORING */}
            {/* ================================================= */}

            <div
                className="bottom-grid"
                style={{
                    marginTop: "20px",
                    alignItems: "flex-start",
                    gap: "20px"
                }}
            >

                <div
                    style={{
                        flex: 1
                    }}
                >

                    <CriticalPatients />

                </div>


                <div
                    style={{
                        flex: 1
                    }}
                >

                    <ActiveAlerts />

                </div>

            </div>


            {/* RECENT PATIENTS, APPOINTMENTS, TIMELINES, AND OTHER CLUTTER REMOVED FOR A SIMPLIFIED UI */}


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div
                style={{
                    marginTop: "40px",
                    padding: "18px",
                    textAlign: "center",
                    borderTop:
                        "1px solid #e5e7eb",
                    color: "#6b7280",
                    fontSize: "14px"
                }}
            >

                <p
                    style={{
                        margin: 0
                    }}
                >

                    🏥 Healthcare Management Platform For Clinical Operations
                    {" • "}
                    AI Powered Digital Twin

                </p>


                <p
                    style={{
                        marginTop: "8px"
                    }}
                >

                    Real-Time Monitoring
                    {" • "}
                    AI Prediction
                    {" • "}
                    Patient 360
                    {" • "}
                    FHIR
                    {" • "}
                    Kafka

                </p>

            </div>

        </div>

    );
}


export default Dashboard;