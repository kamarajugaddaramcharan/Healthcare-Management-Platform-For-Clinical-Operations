import { Routes, Route, Navigate } from "react-router-dom";

import PatientSidebar from "../components/patients/PatientSidebar";
import PatientNavbar from "../components/patients/PatientNavbar";

import PatientDashboard from "../components/patients/PatientDashboard";
import PatientProfile from "../components/patients/PatientProfile";
import PatientVitals from "../components/patients/PatientVitals";
import PatientHealthTwin from "../components/patients/PatientHealthTwin";
import PatientAIResults from "../components/patients/PatientAIResults";
import PatientCarePlan from "../components/patients/PatientCarePlan";
import PatientFHIR from "../components/patients/PatientFHIR";
import PatientConsent from "../components/patients/PatientConsent";

function PatientPortal() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
            }}
        >
            <PatientSidebar />

            <div
                style={{
                    marginLeft: 260,
                    minHeight: "100vh",
                }}
            >
                <PatientNavbar />

                <main
                    style={{
                        padding: 30,
                        maxWidth: 1600,
                        margin: "0 auto",
                    }}
                >
                    <Routes>

                        {/* Default */}
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        {/* Dashboard */}
                        <Route
                            path="dashboard"
                            element={<PatientDashboard />}
                        />

                        {/* Patient Profile */}
                        <Route
                            path="profile"
                            element={<PatientProfile />}
                        />

                        {/* Vitals */}
                        <Route
                            path="vitals"
                            element={<PatientVitals />}
                        />

                        {/* Health Twin */}
                        <Route
                            path="health-twin"
                            element={<PatientHealthTwin />}
                        />

                        {/* AI Results */}
                        <Route
                            path="ai-results"
                            element={<PatientAIResults />}
                        />

                        {/* Care Plan */}
                        <Route
                            path="care-plan"
                            element={<PatientCarePlan />}
                        />

                        {/* FHIR */}
                        <Route
                            path="fhir"
                            element={<PatientFHIR />}
                        />

                        {/* Consent */}
                        <Route
                            path="consent"
                            element={<PatientConsent />}
                        />

                        {/* Alerts */}
                        <Route
                            path="alerts"
                            element={<PatientAlerts />}
                        />

                        {/* Unknown patient route */}
                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                    </Routes>
                </main>
            </div>
        </div>
    );
}

function PatientAlerts() {
    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 30,
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
            }}
        >
            <h1
                style={{
                    margin: 0,
                    color: "#0f172a",
                }}
            >
                My Alerts
            </h1>

            <p
                style={{
                    color: "#64748b",
                    marginTop: 8,
                }}
            >
                Patient-specific health alerts will
                appear here.
            </p>

            <div
                style={{
                    marginTop: 20,
                    padding: 20,
                    borderRadius: 16,
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: "#9a3412",
                }}
            >
                No active alerts.
            </div>
        </div>
    );
}

export default PatientPortal;