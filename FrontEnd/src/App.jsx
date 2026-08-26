import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// =========================================================
// ADMIN / DOCTOR LAYOUT
// =========================================================

import Layout from "./components/layout/Layout";

// =========================================================
// ADMIN / DOCTOR PAGES
// =========================================================

import Dashboard from "./pages/Dashboard";
import Patient360 from "./pages/Patient360";
import Patients from "./pages/Patients";
import AssignPatients from "./pages/AssignPatients";
import Vitals from "./pages/Vitals";
import HealthTwin from "./pages/HealthTwin";
import Consent from "./pages/Consent";
import FHIR from "./pages/FHIR";
import AIPredictions from "./pages/AIPredictions";
import PredictionReport from "./pages/PredictionReport";
import HealthTwinDetails from "./pages/HealthTwinDetails";
import AlertManagement from "./pages/AlertManagement";
import CarePlan from "./pages/CarePlan";
import ModelManagement from "./pages/ModelManagement";

// =========================================================
// PATIENT PORTAL
// =========================================================

import PatientPortal from "./pages/PatientPortal";

// =========================================================
// KEYCLOAK
// =========================================================

import {
    getCurrentRole,
} from "./keycloak";

// =========================================================
// ROLE PROTECTED ROUTE
// =========================================================

function ProtectedRoute({
                            allowedRoles,
                            children,
                        }) {

    const role = getCurrentRole();

    // =====================================================
    // NO VALID ROLE
    // =====================================================

    if (!role) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // =====================================================
    // WRONG ROLE
    // =====================================================

    if (!allowedRoles.includes(role)) {

        // Patient goes to Patient Portal

        if (role === "patient") {

            return (
                <Navigate
                    to="/patient/dashboard"
                    replace
                />
            );
        }

        // Admin / Doctor go to main dashboard

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}


// =========================================================
// PATIENT PROTECTED ROUTE
// =========================================================

function PatientRoute({
                          children
                      }) {

    const role = getCurrentRole();

    // =====================================================
    // NO VALID ROLE
    // =====================================================

    if (!role) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // =====================================================
    // NOT PATIENT
    // =====================================================

    if (role !== "patient") {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}


// =========================================================
// ADMIN / DOCTOR APPLICATION
// =========================================================

function ClinicalPortal() {

    return (

        <Layout>

            <Routes>

                {/* ================================================= */}
                {/* MAIN DASHBOARD */}
                {/* ADMIN + DOCTOR ONLY */}
                {/* ================================================= */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* PATIENT 360 */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/patient360/:patientId"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <Patient360 />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient360"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <Patient360 />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* PATIENTS */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/patients"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <Patients />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* ASSIGN PATIENTS */}
                {/* ADMIN ONLY */}
                {/* ================================================= */}

                <Route
                    path="/assign-patients"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <AssignPatients />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* HEALTH TWIN */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/healthtwin"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <HealthTwin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/healthtwin/:patientId"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <HealthTwinDetails />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* LIVE VITALS */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/vitals"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <Vitals />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* AI PREDICTIONS */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/predictions"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <AIPredictions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/predictions/:id"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <PredictionReport />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* CARE PLAN */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/care-plan"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <CarePlan />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* ALERT MANAGEMENT */}
                {/* ADMIN + DOCTOR */}
                {/* ================================================= */}

                <Route
                    path="/alerts"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "doctor",
                            ]}
                        >
                            <AlertManagement />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* ADMIN ONLY */}
                {/* ================================================= */}

                <Route
                    path="/consent"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <Consent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/fhir"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <FHIR />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/model-management"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <ModelManagement />
                        </ProtectedRoute>
                    }
                />


                {/* ================================================= */}
                {/* UNKNOWN CLINICAL ROUTE */}
                {/* ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </Layout>
    );
}


// =========================================================
// MAIN APP
// =========================================================

function App() {

    const role = getCurrentRole();

    return (

        <BrowserRouter>

            {/* ================================================= */}
            {/* PATIENT PORTAL */}
            {/* NO ADMIN/DOCTOR LAYOUT */}
            {/* ================================================= */}

            {role === "patient" ? (

                <Routes>

                    <Route
                        path="/patient/*"
                        element={
                            <PatientRoute>
                                <PatientPortal />
                            </PatientRoute>
                        }
                    />


                    {/* ================================================= */}
                    {/* PATIENT ROOT */}
                    {/* ================================================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/patient/dashboard"
                                replace
                            />
                        }
                    />


                    {/* ================================================= */}
                    {/* UNKNOWN PATIENT URL */}
                    {/* ================================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/patient/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            ) : (

                /* ================================================= */
                /* ADMIN / DOCTOR PORTAL */
                /* ================================================= */

                <ClinicalPortal />

            )}

        </BrowserRouter>
    );
}

export default App;